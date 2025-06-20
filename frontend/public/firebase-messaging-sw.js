// public/firebase-messaging-sw.js
importScripts(
  "https://www.gstatic.com/firebasejs/9.0.0/firebase-app-compat.js"
);
importScripts(
  "https://www.gstatic.com/firebasejs/9.0.0/firebase-messaging-compat.js"
);
const config = {
  apiKey: "AIzaSyCBWz2faNaziQHF4_QEIG5HaS2hMoHq2YI",
  authDomain: "university-project-1a9de.firebaseapp.com",
  projectId: "university-project-1a9de",
  storageBucket: "university-project-1a9de.firebasestorage.app",
  messagingSenderId: "430277240680",
  appId: "1:430277240680:web:0343af5a971abe87d0d8dd",
  measurementId: "G-MQ7T7Z9K1S",
};
// const config = {
//   apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
//   authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
//   projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
//   storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
//   messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
//   appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
// };

firebase.initializeApp(config);

const messaging = firebase.messaging();

messaging.onBackgroundMessage((payload) => {
  console.log("Received background message:", payload);

  const notificationTitle = payload.notification.title;
  const notificationOptions = {
    body: payload.notification.body,
    icon: "/logo.png",
  };

  self.registration.showNotification(notificationTitle, notificationOptions);
});
