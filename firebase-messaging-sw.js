// Import Firebase SDK
importScripts('https://www.gstatic.com/firebasejs/8.10.0/firebase-app.js');
importScripts('https://www.gstatic.com/firebasejs/8.10.0/firebase-messaging.js');

// Cấu hình Firebase
firebase.initializeApp({
    apiKey: "AIzaSyC1kOGCzjIJv9_tNyp4mV3R8Peiyz24K5c",
    authDomain: "notifycationpwa.firebaseapp.com",
    projectId: "notifycationpwa",
    storageBucket: "notifycationpwa.firebasestorage.app",
    messagingSenderId: "196088165519",
    appId: "1:196088165519:web:9efab7258ff41e37bb6cfa",
    measurementId: "G-SHFKPPP2DM"
});

// Khởi tạo Firebase Messaging
const messaging = firebase.messaging();

console.log('[firebase-messaging-sw.js] Initial');

// Xử lý sự kiện push notification
messaging.onBackgroundMessage((payload) => {
  console.log('[firebase-messaging-sw.js] Nhận thông báo nền:', payload);

  const notificationTitle = 'SW ' + payload.data.title;
  const notificationOptions = {
    body: payload.data.body,
    icon: '/icon-192.png', // Đường dẫn đến icon của thông báo
  };

  self.registration.showNotification(notificationTitle, notificationOptions);
});