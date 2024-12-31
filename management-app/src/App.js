import './App.css';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import RegisterForm from './pages/Register';
import LoginForm from './pages/login'; // Ensure the correct case for the file name
import ItemListing from './pages/ItemListing';
import Home from './pages/Home';
import AdminRoute from './pages/AdminRoute';
import Header from './pages/Header'; // Ensure this import path is correct
import React from 'react';
import { FirebaseProvider } from './context/firebase'; // Import the FirebaseProvider

function App() {
  return (
    <FirebaseProvider> {/* Wrap the app in FirebaseProvider */}
      <Router>
        <Header />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/listBooks" element={<ItemListing />} />
          <Route path="/register" element={<RegisterForm />} />
          <Route path="/login" element={<LoginForm />} />
          <Route path="/admin" element={<AdminRoute />} /> {/* Admin route */}
        </Routes>
      </Router>
    </FirebaseProvider>
  );
}

export default App;
