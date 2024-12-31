import { createContext, useContext, useState, useEffect } from "react";
import { initializeApp } from "firebase/app";
import {
  getAuth,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  GoogleAuthProvider,
  signInWithPopup,
  onAuthStateChanged,
  signOut,
} from "firebase/auth";
import { getFirestore, collection, addDoc, getDoc, setDoc, deleteDoc, doc, getDocs, updateDoc } from "firebase/firestore";

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

export const FirebaseProvider = (props) => {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(firebaseAuth, (currentUser) => {
      if (currentUser) {
        setUser(currentUser); // Set user when logged in
      } else {
        setUser(null); // Set user to null when logged out
      }
    });

    return () => unsubscribe(); // Cleanup on unmount
  }, []);

  const setAdminPrivilege = async (uid, isAdmin) => {
    try {
      const userRef = doc(firestore, "users", uid);
      await updateDoc(userRef, {
        isAdmin: isAdmin,
      });
      console.log(`User ${uid} is now ${isAdmin ? 'an admin' : 'a regular user'}`);
    } catch (error) {
      console.error("Error setting admin:", error);
    }
  };

  const listAllUsers = async () => {
    try {
      const querySnapshot = await getDocs(collection(firestore, "users"));
      const users = querySnapshot.docs.map((doc) => ({
        uid: doc.id,
        ...doc.data(),
      }));
      return users;
    } catch (error) {
      console.error("Error fetching users:", error);
      throw error;
    }
  };

  const addUser = async (userData) => {
    try {
      const usersCollection = collection(firestore, "users");
      await addDoc(usersCollection, userData);
    } catch (error) {
      console.error("Error adding user:", error);
    }
  };

  const deleteUser = async (uid) => {
    try {
      const userDocRef = doc(firestore, "users", uid);
      await deleteDoc(userDocRef);
    } catch (error) {
      console.error("Error deleting user:", error);
    }
  };

  const signupUserWithEmailAndPassword = async (email, password) => {
    try {
      // Attempt to create a new user
      const userCredential = await createUserWithEmailAndPassword(firebaseAuth, email, password);
      const uid = userCredential.user.uid;
  
      // Optionally, set the user as regular or admin in Firestore
      await addUser({
        uid,
        email,
        isAdmin: false, // Default to non-admin
      });
  
      console.log("User registered successfully");
    } catch (error) {
      console.error("Error signing up:", error);
  
      // Check if the error is that the email is already in use
      if (error.code === "auth/email-already-in-use") {
        // Instead of throwing an error, auto-login the user with the existing email
        await loginWithEmailAndPassword(email, password); // Attempt login instead of registration
        console.log("User already registered, logging in...");
        return; // Exit the signup flow
      }
  
      // Propagate other errors for handling in the component
      throw error;
    }
  };
  

  const loginWithEmailAndPassword = async (email, password) => {
    try {
      // Trim any unwanted spaces from email and password
      const trimmedEmail = email.trim();
      const trimmedPassword = password.trim();
  
      // Log email and password to check if they're correctly passed
      console.log("Attempting login with email:", trimmedEmail);
  
      // Check if email and password are empty
      if (!trimmedEmail || !trimmedPassword) {
        throw new Error("Email and password must not be empty.");
      }
  
      // Sign in with email and password
      await signInWithEmailAndPassword(firebaseAuth, trimmedEmail, trimmedPassword);
      console.log("Login successful");
    } catch (error) {
      // Log the full error message for debugging
      console.error("Login error:", error);
      throw error; // Propagate the error for the component to handle
    }
  };
  

  const signinWithGoogle = async () => {
    try {
      const result = await signInWithPopup(firebaseAuth, googleProvider);
      const user = result.user;
      
      // Get a reference to the user's document in Firestore
      const userRef = doc(firestore, "users", user.uid);
      
      // Check if the user exists in Firestore
      const userDoc = await getDoc(userRef);
      
      // If the user doesn't exist, add them to Firestore
      if (!userDoc.exists()) {
        await setDoc(userRef, {
          uid: user.uid,
          email: user.email,
          isAdmin: false, // Default to non-admin
        });
        console.log('User added to Firestore');
      } else {
        console.log('User already exists in Firestore');
      }
    } catch (error) {
      console.error("Error signing in with Google:", error);
      throw error;
    }
  };

  const logout = async () => {
    try {
      await signOut(firebaseAuth);
      console.log("User logged out successfully");
    } catch (error) {
      console.error("Error logging out:", error);
    }
  };

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

  const listAllBooks = async () => {
    const querySnapshot = await getDocs(collection(firestore, "books"));
    return querySnapshot;
  };

  const isLoggedIn = user ? true : false;

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
