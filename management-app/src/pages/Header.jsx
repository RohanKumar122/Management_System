import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useFirebase } from "../context/firebase";

const Header = () => {
  const navigate = useNavigate();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const handleNavigation = (path) => {
    navigate(path);
    setIsMenuOpen(false);
  };

  const firebase = useFirebase();
  return (
    <header className="bg-blue-500 text-white p-4 flex items-center justify-between relative">
      <div className="flex items-center">
        {/* <img src={logo} alt="Logo" className="h-6 w-6 mx-2" />
         */}
        {/* <h1>Nofify</h1> */}

        <h1 className="font-bold lg:text-xl ">Notify</h1>
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
            <button
              onClick={() => handleNavigation("/login")}
              className="block px-4 py-2 w-full text-left hover:bg-gray-100 text-green-600 "
            >
              Login
            </button>

            <button
             className="block px-4 py-2 w-full text-left hover:bg-gray-100 text-red-600 "
              
              onClick={async () => {
                try {
                  // Log out from Firebase
                  await firebase.logout();
                  // Clear local storage
                  localStorage.removeItem("token");
                  // Redirect to the register page
                  window.location.href = "/login";
                } catch (error) {
                  console.error("Error logging out:", error);
                }
              }}
            >
              Logout
            </button>

            <button
              onClick={() => {
                localStorage.removeItem("token");
                window.location.href = "/register";
              }}
              className="text-red-900 hover:text-red-700 block px-4 py-2 w-full text-left"
            >
              register
            </button>
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;
