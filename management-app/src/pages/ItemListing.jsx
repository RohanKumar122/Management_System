import React, { useState } from "react";
import { useFirebase } from "../context/firebase";

const ItemListing = () => {
  const [bookname, setBookname] = useState("");
  const [ISBN, setISBN] = useState("");
  const [price, setPrice] = useState("");
  const [loading, setLoading] = useState(false);
  const firebase = useFirebase();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const result = await firebase.handleCreateNewListing(bookname, ISBN, price);
      if (result.success) {
        console.log("Listing created successfully with ID:", result.id);
        // Optionally clear the form after success
        setBookname("");
        setISBN("");
        setPrice("");
      } else {
        console.error("Error creating listing:", result.error);
      }
    } catch (error) {
      console.error("Unexpected error:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <div className="max-w-md mx-auto mt-8 p-6 bg-white shadow-lg rounded-lg">
        <h2 className="text-2xl font-semibold text-center mb-4">Book Listing</h2>
        <form onSubmit={handleSubmit}>
          <label>Book Name</label>
          <input
            type="text"
            placeholder="Book Name"
            className="w-full p-2 mb-4 border border-gray-300 rounded"
            value={bookname}
            onChange={(e) => setBookname(e.target.value)}
          />
          <label>ISBN Number</label>
          <input
            type="number"
            placeholder="ISBN Number"
            className="w-full p-2 mb-4 border border-gray-300 rounded"
            value={ISBN}
            onChange={(e) => setISBN(e.target.value)}
          />
          <label>Price</label>
          <input
            type="text"
            placeholder="Price"
            className="w-full p-2 mb-4 border border-gray-300 rounded"
            value={price}
            onChange={(e) => setPrice(e.target.value)}
          />
          {/* Uncomment this for file upload */}
          {/* 
          <label>Image</label>
          <input
            type="file"
            className="w-full p-2 mb-4 border border-gray-300 rounded"
            onChange={(e) => setFile(e.target.files[0])}
          /> 
          */}
          <button
            type="submit"
            className="w-full py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
            disabled={loading}
          >
            {loading ? "Creating..." : "Create"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default ItemListing;
