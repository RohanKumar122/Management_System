importScripts(
  "https://www.gstatic.com/firebasejs/9.0.0/firebase-app-compat.js"
);
importScripts(
  "https://www.gstatic.com/firebasejs/9.0.0/firebase-messaging-compat.js"
);

console.log("Service Worker: Loaded");

const firebaseConfig = {
  apiKey: "AIzaSyAPd_OOHcDamdKsxn1jHLLaVi1uvicTwxg",
  authDomain: "notificationsystem-c1552.firebaseapp.com",
  projectId: "notificationsystem-c1552",
  storageBucket: "notificationsystem-c1552.appspot.com",
  messagingSenderId: "383363146689",
  appId: "1:383363146689:web:2133223589b96cf31fc540",
  measurementId: "G-SNS7LJFETC",
};

firebase.initializeApp(firebaseConfig);
console.log("Service Worker: Firebase Initialized");

const messaging = firebase.messaging();

messaging.onBackgroundMessage((payload) => {
  console.log("Service Worker: Received background message:", payload);

  const { title, body, icon } = payload.notification || {};
  if (title && body) {
    const notificationOptions = {
      body,
      icon: icon || "/default-icon.png",
    };

    console.log("Service Worker: Showing notification");
    self.registration.showNotification(title, notificationOptions);
  } else {
    console.error("Service Worker: Missing notification details:", payload);
  }
});