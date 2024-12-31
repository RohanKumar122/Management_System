import React, { useState, useEffect } from "react";
import { useFirebase } from "../context/firebase";
import { useNavigate } from "react-router-dom";

const RegisterForm = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const firebase = useFirebase();
  const navigate = useNavigate();

  useEffect(() => {
    // Ensure firebase is initialized before accessing properties
    if (firebase && firebase.isLoggedIn) {
      navigate("/"); // Redirect to home if already logged in
    }
  }, [firebase, firebase?.isLoggedIn, navigate]);

  const handleRegister = async (e) => {
    e.preventDefault(); // Prevent default form submission
    setLoading(true);
  
    try {
      console.log("Registering user...");
  
      // Validate inputs
      if (!username || !password) {
        alert("Please fill in both username and password.");
        return;
      }
  
      // Attempt to sign up the user
      await firebase.signupUserWithEmailAndPassword(username, password);
      console.log("Registration successful");
  
      // Optionally, you can redirect the user after successful registration or login
      navigate("/"); // Redirect to home page after registration or login
    } catch (error) {
      console.error("Error registering user:", error);
  
      // Handle specific error cases like email already in use
      if (error.message.includes("email-already-in-use")) {
        alert("This email is already registered. You will be logged in instead.");
        // Optional: Navigate to login page after the error
        navigate("/login"); // Redirect to login page
      } else {
        alert("Registration failed. Please try again.");
      }
    } finally {
      setLoading(false);
    }
  };
  

  return (
    <div className="max-w-md mx-auto mt-8 p-6 bg-white shadow-lg rounded-lg">
      <h2 className="text-2xl font-semibold text-center mb-4">Register</h2>
      <form onSubmit={handleRegister}>
        <input
          type="text"
          placeholder="Username"
          className="w-full p-2 mb-4 border border-gray-300 rounded"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          required
        />
        <input
          type="password"
          placeholder="Password"
          className="w-full p-2 mb-4 border border-gray-300 rounded"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        <button
          type="submit"
          className="w-full py-2 bg-green-500 text-white rounded hover:bg-green-600"
          disabled={loading}
        >
          {loading ? "Registering..." : "Create Account"}
        </button>
      </form>
    </div>
  );
};

export default RegisterForm;
