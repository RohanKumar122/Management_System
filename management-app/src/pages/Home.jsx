import React, { useEffect, useState } from "react";
import { useFirebase } from "../context/firebase";

const Home = () => {
  const firebase = useFirebase();
  const [books, setBooks] = useState([]);

  useEffect(() => {
    // Check if firebase and firebase.user are properly initialized
    if (firebase && firebase.isLoggedIn) {
      const fetchBooks = async () => {
        try {
          const allBooks = await firebase.listAllBooks();
          const userBooks = allBooks.docs
            .map((doc) => ({ id: doc.id, ...doc.data() }))
            .filter((book) => book.userId === firebase.user?.uid); // Filter books by logged-in user's ID
          console.log(userBooks);
          setBooks(userBooks); // Update the books state
        } catch (error) {
          console.error("Error fetching books:", error);
        }
      };

      fetchBooks();
    } else {
      setBooks([]); // Clear books if not logged in or firebase is not initialized
    }
  }, [firebase]); // Add firebase as a dependency to handle updates to logged-in state

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
    </div>
  );
};

export default Home;
