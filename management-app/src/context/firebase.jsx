import { createContext, useContext, useState, useEffect } from "react";
import { initializeApp } from "firebase/app";
import {
  getAuth,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  GoogleAuthProvider,
  signInWithPopup,
  signInWithRedirect,
  getRedirectResult,
  onAuthStateChanged,
  signOut,
} from "firebase/auth";
import { getFirestore, collection, addDoc, getDoc, setDoc, deleteDoc, doc, getDocs, updateDoc } from "firebase/firestore";

// Firebase Context
const FirebaseContext = createContext(null);

const firebaseConfig = {
  apiKey: process.env.REACT_APP_FIREBASE_API_KEY,
  authDomain: process.env.REACT_APP_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.REACT_APP_FIREBASE_PROJECT_ID,
  storageBucket: process.env.REACT_APP_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.REACT_APP_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.REACT_APP_FIREBASE_APP_ID,
  measurementId: process.env.REACT_APP_FIREBASE_MEASUREMENT_ID,
};

export const useFirebase = () => useContext(FirebaseContext);

const firebaseApp = initializeApp(firebaseConfig);
const firebaseAuth = getAuth(firebaseApp);
const firestore = getFirestore(firebaseApp);
const googleProvider = new GoogleAuthProvider();

// Detect mobile devices (simplified check)
const isMobile = window.innerWidth <= 800;

export const FirebaseProvider = (props) => {
  const [user, setUser] = useState(null);

  // Monitor auth state changes
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(firebaseAuth, (currentUser) => {
      if (currentUser) {
        console.log("User is signed in:", currentUser);
        setUser(currentUser); // Update state
      } else {
        console.log("No user is signed in.");
        setUser(null); // Clear state
      }
    });
  
    return () => unsubscribe(); // Cleanup subscription
  }, []);
  
  useEffect(() => {
    const handleRedirect = async () => {
      try {
        const result = await getRedirectResult(firebaseAuth);
        if (result && result.user) {
          console.log("Redirect sign-in successful:", result.user);
          setUser(result.user);
        }
      } catch (error) {
        console.error("Error handling redirect result:", error);
      }
    };
  
    handleRedirect();
  }, []);


  useEffect(() => {
    const checkRedirectResult = async () => {
      try {
        const result = await getRedirectResult(firebaseAuth);
        if (result && result.user) {
          console.log("Redirect login successful:", result.user);
          await handleUser(result.user); // Save user to Firestore
        }
      } catch (error) {
        console.error("Error handling redirect result:", error);
      }
    };
  
    // Check redirect result only once when the component mounts
    checkRedirectResult();
  }, []);
  
  
    
  // Set user privileges
  const setAdminPrivilege = async (uid, isAdmin) => {
    try {
      const userRef = doc(firestore, "users", uid);
      await updateDoc(userRef, { isAdmin });
      console.log(`User ${uid} is now ${isAdmin ? 'an admin' : 'a regular user'}`);
    } catch (error) {
      console.error("Error setting admin:", error);
    }
  };

  // List all users
  const listAllUsers = async () => {
    try {
      const querySnapshot = await getDocs(collection(firestore, "users"));
      return querySnapshot.docs.map((doc) => ({ uid: doc.id, ...doc.data() }));
    } catch (error) {
      console.error("Error fetching users:", error);
      throw error;
    }
  };

  // Add a new user to Firestore
  const addUser = async (userData) => {
    try {
      const usersCollection = collection(firestore, "users");
      await addDoc(usersCollection, userData);
    } catch (error) {
      console.error("Error adding user:", error);
    }
  };

  // Delete a user from Firestore
  const deleteUser = async (uid) => {
    try {
      const userDocRef = doc(firestore, "users", uid);
      await deleteDoc(userDocRef);
    } catch (error) {
      console.error("Error deleting user:", error);
    }
  };

  // Sign up a user with email and password
  const signupUserWithEmailAndPassword = async (email, password) => {
    try {
      const userCredential = await createUserWithEmailAndPassword(firebaseAuth, email, password);
      const uid = userCredential.user.uid;
      await addUser({ uid, email, isAdmin: false }); // Default to non-admin
      console.log("User registered successfully");
    } catch (error) {
      console.error("Error signing up:", error);
      if (error.code === "auth/email-already-in-use") {
        await loginWithEmailAndPassword(email, password); // Auto-login if email is in use
        console.log("User already registered, logging in...");
        return; // Exit the signup flow
      }
      throw error;
    }
  };

  // Login with email and password
  const loginWithEmailAndPassword = async (email, password) => {
    try {
      const trimmedEmail = email.trim();
      const trimmedPassword = password.trim();

      if (!trimmedEmail || !trimmedPassword) throw new Error("Email and password must not be empty.");
      await signInWithEmailAndPassword(firebaseAuth, trimmedEmail, trimmedPassword);
      console.log("Login successful");
    } catch (error) {
      console.error("Login error:", error);
      throw error;
    }
  };

  // Google Sign-in
  const signinWithGoogle = async () => {
    try {
      if (isMobile) {
        // Use redirect on mobile
        await signInWithRedirect(firebaseAuth, googleProvider);
      } else {
        // Use popup on non-mobile devices
        const result = await signInWithPopup(firebaseAuth, googleProvider);
        const user = result.user;
        await handleUser(user); // Ensure user is handled after sign-in
      }
    } catch (error) {
      console.error("Error signing in with Google:", error);
      throw error;
    }
  };




  const handleUser = async (user) => {
    try {
      const userRef = doc(firestore, "users", user.uid);
      const userDoc = await getDoc(userRef);
  
      if (!userDoc.exists()) {
        await setDoc(userRef, { 
          uid: user.uid, 
          email: user.email, 
          isAdmin: false 
        });
        console.log('User added to Firestore');
      } else {
        console.log('User already exists in Firestore');
      }
    } catch (error) {
      console.error("Error handling user:", error);
    }
  };
  
  // Logout
  const logout = async () => {
    try {
      await signOut(firebaseAuth);
      console.log("User logged out successfully");
    } catch (error) {
      console.error("Error logging out:", error);
    }
  };

  // Create new listing in Firestore
  const handleCreateNewListing = async (name, isbn, price) => {
    try {
      const docRef = await addDoc(collection(firestore, "books"), {
        name,
        isbn,
        price,
        userId: user.uid,
        userEmail: user.email,
        displayName: user.displayName,
        photoURL: user.photoURL,
      });
      return { success: true, id: docRef.id };
    } catch (error) {
      console.error("Error creating new listing:", error);
      return { success: false, error: error.message };
    }
  };

  // List all books
  const listAllBooks = async () => {
    const querySnapshot = await getDocs(collection(firestore, "books"));
    return querySnapshot;
  };

  const isLoggedIn = !!user;

  return (
    <FirebaseContext.Provider
      value={{
        user,
        signupUserWithEmailAndPassword,
        loginWithEmailAndPassword,
        signinWithGoogle,
        handleCreateNewListing,
        isLoggedIn,
        addUser,
        deleteUser,
        setUserAdmin: setAdminPrivilege,
        logout,
        listAllBooks,
        setAdminPrivilege,
        listAllUsers,
      }}
    >
      {props.children}
    </FirebaseContext.Provider>
  );
};
