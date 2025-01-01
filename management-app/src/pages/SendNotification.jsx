import { useState, useEffect } from 'react';
import { getMessaging, getToken, onMessage } from 'firebase/messaging';

const SendNotification = () => {
  const [fcmToken, setFcmToken] = useState('');

  useEffect(() => {
    const messaging = getMessaging();

    // Get the FCM token
    const getTokenFromFirebase = async () => {
      try {
        const token = await getToken(messaging, { vapidKey: process.env.REACT_APP_FCM_VAPID_KEY });
        if (token) {
          console.log('FCM Token:', token);
          setFcmToken(token);
        }
      } catch (error) {
        console.error('Error getting FCM token:', error);
      }
    };

    // Listen for incoming messages
    const listenForMessages = () => {
      onMessage(messaging, (payload) => {
        console.log('Message received:', payload);
        // Handle the notification payload
      });
    };

    getTokenFromFirebase();
    listenForMessages();
  }, []);

  return (
    <div>
      <h2>FCM Token: {fcmToken}</h2>
      {/* Other components */}
    </div>
  );
};

export default SendNotification;
