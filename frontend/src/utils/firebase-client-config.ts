// lib/firebase-client.ts
import { initializeApp } from "firebase/app";
import { getMessaging, getToken } from "firebase/messaging";

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
  measurementId: process.env.NEXT_PUBLIC_MESUREMENT_ID,
};

// const firebaseConfig = {
//   apiKey: "AIzaSyCBWz2faNaziQHF4_QEIG5HaS2hMoHq2YI",
//   authDomain: "university-project-1a9de.firebaseapp.com",
//   projectId: "university-project-1a9de",
//   storageBucket: "university-project-1a9de.firebasestorage.app",
//   messagingSenderId: "430277240680",
//   appId: "1:430277240680:web:0343af5a971abe87d0d8dd",
//   measurementId: "G-MQ7T7Z9K1S"
// }

export const getFcmToken = async () => {
  try {
    const permission = await Notification.requestPermission();
    if (permission === "granted") {
      const app = initializeApp(firebaseConfig);
      const messaging = getMessaging(app);
      const token = await getToken(messaging, {
        vapidKey: process.env.NEXT_PUBLIC_FIREBASE_VAPID_KEY,
      });
      return token;
      //   const token = await getToken(messaging, {
      //     vapidKey: process.env.NEXT_PUBLIC_FIREBASE_VAPID_KEY,
      //   });
      //   return token;
      console.log("My Log permission: ", permission);
    }
  } catch (error) {
    console.error("Error getting FCM token:", error);
    return null;
  }
};
