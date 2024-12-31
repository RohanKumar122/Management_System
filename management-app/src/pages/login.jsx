import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useFirebase } from "../context/firebase";

const LoginForm = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const firebase = useFirebase(); // Get firebase context
  const navigate = useNavigate();

  // Redirect to home if already logged in
  useEffect(() => {
    if (firebase.user) {
      navigate("/"); // Redirect to home if user is logged in
    }
  }, [firebase.user, navigate]);
  
  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
  
    try {
      if (!username || !password) {
        alert("Please fill in both username and password.");
        return;
      }
  
      await firebase.loginWithEmailAndPassword(username, password);
      console.log("Login successful");
      navigate("/"); // Redirect to home after successful login
    } catch (error) {
      console.error("Login error:", error);
      if (error.code === "auth/wrong-password") {
        alert("Invalid password. Please try again.");
      } else if (error.code === "auth/user-not-found") {
        alert("No user found with this email.");
      } else {
        alert("Login failed. Please try again.");
      }
    } finally {
      setLoading(false);
    }
  };
  
  const handleGoogleSignIn = async () => {
    try {
      setLoading(true);
      await firebase.signinWithGoogle(); // This triggers the sign-in process
      console.log("Google sign-in initiated.");
    } catch (error) {
      console.error("Error signing in with Google:", error);
      alert("Google sign-in failed. Please try again.");
    } finally {
      setLoading(false);
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
  className={`w-full py-2 ${loading ? "bg-gray-400" : "bg-red-500"} text-white rounded hover:bg-red-600`}
  disabled={loading}
>
  {loading ? "Signing in with Google..." : "Sign in with Google"}
</button>

    </div>
  );
};

export default LoginForm;
