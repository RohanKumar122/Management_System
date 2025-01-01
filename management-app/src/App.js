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
import { onMessage, getToken, messaging } from './context/firebase';
import { getMessaging } from "firebase/messaging";

// Service worker registration
if ("serviceWorker" in navigator) {
  navigator.serviceWorker
    .register("/firebase-messaging-sw.js")
    .then((registration) => {
      console.log("Service Worker registered with scope:", registration.scope);
      const messaging = getMessaging();
      messaging.useServiceWorker(registration);
    })
    .catch((err) => {
      console.error("Service Worker registration failed:", err);
    });
}

onMessage(messaging, (payload) => {
  console.log("Foreground notification received:", payload);
  // Optionally show a custom UI notification
  alert(`Notification: ${payload.notification.title}`);
});
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
