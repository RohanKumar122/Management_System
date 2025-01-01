import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useFirebase } from "../context/firebase";

const Header = () => {
  const navigate = useNavigate();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const firebase = useFirebase();

  const handleNavigation = (path) => {
    navigate(path);
    setIsMenuOpen(false);
  };

  const handleLogout = async () => {
    try {
      // Log out from Firebase
      await firebase.logout();
      console.log("User logged out successfully");

      // Clear any other session data if needed
      localStorage.removeItem("token");

      // Redirect to the login page
      navigate("/login");
    } catch (error) {
      console.error("Error logging out:", error);
    }
  };

  return (
    <header className="bg-blue-500 text-white p-4 flex items-center justify-between relative">
      <div className="flex items-center">
        <h1 className="font-bold lg:text-xl">Notify</h1>
      </div>
      <div className="relative">
        {/* Hamburger Button */}
        <button
          onClick={() => setIsMenuOpen((prev) => !prev)}
          className="flex items-center justify-center p-2 rounded-md bg-blue-700 hover:bg-blue-600 focus:outline-none"
        >
          <div className="space-y-1">
            <span className="block w-6 h-0.5 bg-white"></span>
            <span className="block w-6 h-0.5 bg-white"></span>
            <span className="block w-6 h-0.5 bg-white"></span>
          </div>
        </button>

        {/* Dropdown Menu */}
        {isMenuOpen && (
          <div className="absolute right-0 mt-2 w-40 bg-white text-black rounded-md shadow-lg">
            <button
              onClick={() => handleNavigation("/")}
              className="block px-4 py-2 w-full text-left hover:bg-gray-100"
            >
              Home
            </button>
            <button
              onClick={() => handleNavigation("/listBooks")}
              className="block px-4 py-2 w-full text-left hover:bg-gray-100"
            >
              Add Books
            </button>

            {/* Admin Route (Visible only to specific email) */}
            {firebase.user?.email === "rk399504@gmail.com" && (
              <button
                onClick={() => handleNavigation("/admin")}
                className="block px-4 py-2 w-full text-left hover:bg-gray-100 text-blue-600"
              >
                Admin
              </button>
            )}

            {/* Show Login if user is not logged in */}
            {!firebase.user && (
              <button
                onClick={() => handleNavigation("/login")}
                className="block px-4 py-2 w-full text-left hover:bg-gray-100 text-green-600"
              >
                Login
              </button>
            )}

            {/* Logout button */}
            {firebase.user && (
              <button
                onClick={handleLogout}
                className="block px-4 py-2 w-full text-left hover:bg-gray-100 text-red-600"
              >
                Logout
              </button>
            )}

            {/* Register button */}
            <button
              onClick={() => handleNavigation("/register")}
              className="text-red-900 hover:text-red-700 block px-4 py-2 w-full text-left"
            >
              Register
            </button>
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;
