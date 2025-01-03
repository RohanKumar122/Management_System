import React, { useEffect, useState } from "react";
import { useFirebase } from "../context/firebase";
import { messaging } from "../context/firebase";
import { getToken } from "firebase/messaging";
import { firestore } from "../context/firebase"; // Correct import for Firestore
import { doc, setDoc } from "firebase/firestore"; // Use setDoc to create or update the document

const Home = () => {
  const firebase = useFirebase();
  const [books, setBooks] = useState([]);
  const [token, setToken] = useState(""); // State to store the FCM token

  // Request notification permission and get the FCM token
  async function requestPermission() {
    const permission = await Notification.requestPermission();
    if (permission === "granted") {
      console.log("Permission granted");
      try {
        // Generate FCM token
        const generatedToken = await getToken(messaging, {
          vapidKey: "BL9ZzEEh7gnC2dapiQbPVDixtZ9BKyEp_kEM6vEevXn8n7NYTS9kzjq2xfpFY3jKKDXNdPiBdnkT0pNFTbYLPwU", // VAPID Key
        });
        console.log("Token:", generatedToken);
        setToken(generatedToken); // Update the token state

        // Save token and user details to Firestore
        if (firebase?.user?.email && generatedToken) {
          const userRef = doc(firestore, "tokens", firebase.user.email); // Correct Firestore doc reference
          await setDoc(userRef, {
            fcmToken: generatedToken,
            email: firebase.user.email,
            isAdmin: firebase.user?.isAdmin || false,
            uid: firebase.user?.uid,
          }, { merge: true }); // Use merge: true to merge with existing data, if any
          console.log("FCM Token and user data saved to Firestore");
        }
      } catch (error) {
        console.error("Error generating token:", error);
      }
    } else if (permission === "denied") {
      console.log("Permission denied");
    }
  }

  // Run permission request on component mount
  useEffect(() => {
    requestPermission();
  }, []);

  // Fetch books if logged in
  useEffect(() => {
    if (firebase && firebase.isLoggedIn) {
      const fetchBooks = async () => {
        try {
          const allBooks = await firebase.listAllBooks();
          const userBooks = allBooks.docs
            .map((doc) => ({ id: doc.id, ...doc.data() }))
            .filter((book) => book.userId === firebase.user?.uid);
          console.log(userBooks);
          setBooks(userBooks);
        } catch (error) {
          console.error("Error fetching books:", error);
        }
      };

      fetchBooks();
    } else {
      setBooks([]);
    }
  }, [firebase]);

  // Copy token to clipboard
  const copyToClipboard = () => {
    navigator.clipboard.writeText(token).then(() => {
      alert("Token copied to clipboard!");
    });
  };

  return (
    <div>
      <h1 className="mx-4 p-4 justify-center flex font-semibold text-red-600">
        Your Books
      </h1>

      <div className="flex flex-row mx-4">
        {books.length > 0 ? (
          books.map((book) => (
            <div
              className="gap-4 rounded-lg flex-col mx-4 bg-emerald-100 p-4 md:w-1/2 sm:w-1/2 lg:w-1/5"
              key={book.id}
            >
              <p>
                Book:{" "}
                <span className="text-black font-bold font-mono">{book.name}</span>
              </p>
              <p>
                ISBN: <span className="text-gray-700">{book.isbn}</span>
              </p>
              <p>Price: {book.price}</p>
            </div>
          ))
        ) : (
          <p className="mx-auto text-gray-500">No books found.</p>
        )}
      </div>

      <div className="mt-8 p-4 text-center">
        <h2 className="text-lg font-bold">FCM Token</h2>
        {token ? (
          <div className="mt-2">
            <p className="break-words bg-gray-100 p-4 rounded text-gray-800">{token}</p>
            <button
              className="mt-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
              onClick={copyToClipboard}
            >
              Copy Token
            </button>
          </div>
        ) : (
          <p className="text-gray-500">Generating FCM Token...</p>
        )}
      </div>
    </div>
  );
};

export default Home;
