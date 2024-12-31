import React, { useState, useEffect } from "react";
import { useFirebase } from "../context/firebase";
import { useNavigate } from "react-router-dom";

const LoginForm = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const firebase = useFirebase();
  const navigate = useNavigate();

  useEffect(() => {
    if (firebase.user) {
      navigate("/"); // Redirect to home if already logged in
    }
  }, [firebase.user, navigate]); // Change to firebase.user

  const handleLogin = async (e) => {
    e.preventDefault(); // Prevent default form submission
    setLoading(true);
    try {
      console.log("Signing in...");
      await firebase.loginWithEmailAndPassword(username, password);
      console.log("Login successful");
      navigate("/"); // Redirect to home after login
    } catch (error) {
      console.error("Login error:", error);
      alert("Login failed. Please check your credentials and try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleSignIn = async () => {
    try {
      // Sign in with Google
      const result = await firebase.signinWithGoogle();
      
      // If the sign-in is successful, navigate to home
      if (result) {
        navigate("/"); // Redirect to home
      }
    } catch (error) {
      // Only show the error if there's a failure
      console.error("Error signing in with Google:", error);
      alert("Google sign-in failed. Please try again.");
    }
  };
  

  return (
    <div className="max-w-md mx-auto mt-8 p-6 bg-white shadow-lg rounded-lg">
      <h2 className="text-2xl font-semibold text-center mb-4">Login</h2>
      <form onSubmit={handleLogin}>
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
          className="w-full py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
          disabled={loading}
        >
          {loading ? "Logging in..." : "Login"}
        </button>
      </form>
      <h1 className="text-center my-4">OR</h1>
      <button
        onClick={handleGoogleSignIn}
        className="w-full py-2 bg-red-500 text-white rounded hover:bg-red-600"
      >
        Sign in with Google
      </button>
    </div>
  );
};

export default LoginForm;
