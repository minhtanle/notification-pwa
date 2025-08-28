const baseURL = 'https://minhtanle.github.io/notification-pwa';

document.addEventListener('DOMContentLoaded', function () {
    const firebaseConfig = {
        apiKey: "AIzaSyC1kOGCzjIJv9_tNyp4mV3R8Peiyz24K5c",
        authDomain: "notifycationpwa.firebaseapp.com",
        projectId: "notifycationpwa",
        storageBucket: "notifycationpwa.firebasestorage.app",
        messagingSenderId: "196088165519",
        appId: "1:196088165519:web:9efab7258ff41e37bb6cfa",
        measurementId: "G-SHFKPPP2DM"
    };

    const vapidKey = 'BDi3xzJpUidCPQbHzQ1wdaojtTwcoHK3toUWBOdGfM00CMy5PLwZNx3YAEdakuKc8wZ65EXPfy6eW-1T0ih4Fds'

    firebase.initializeApp(firebaseConfig);
    const messaging = firebase.messaging();

    const enableNotificationsButton = document.getElementById('enable-notifications');
    const fcmTokenInput = document.getElementById('fcm-token');
    const messagesBox = document.getElementById('messages-box');

    // Đăng ký Service Worker
    if ('serviceWorker' in navigator) {
        const version = new Date().getTime(); // Sử dụng timestamp làm phiên bản
        navigator.serviceWorker.register(`${baseURL}/firebase-messaging-sw.js?v=${version}`)
          .then((registration) => {
            console.log('Service Worker đã được đăng ký:', registration);

            messaging.useServiceWorker(registration);
          })
          .catch((error) => {
            console.error('Lỗi khi đăng ký Service Worker:', error);
          });
      } else {
        console.warn('Trình duyệt không hỗ trợ Service Worker.');
      }

    // Bật thông báo với retry nếu denied
    enableNotificationsButton.addEventListener('click', () => {
        Notification.requestPermission().then(permission => {
            if (permission === 'granted') {
                messaging.getToken({ vapidKey }) // Thay bằng VAPID public key từ Firebase
                    .then(token => {
                        console.log('FCM Token:', token);
                        // Gửi token lên server để lưu
                        // fetch('/save-token', { method: 'POST', body: JSON.stringify({ token }) });
                        fcmTokenInput.value = token; // Hiển thị FCM Token trong ô input
                    })
                    .catch(err => console.error('Error getting token', err));
            } else if (permission === 'denied') {
                alert('Vui lòng bật thông báo trong Settings > Safari > Website Data');
            }
        });
    });

    // Xử lý thông báo khi app đang mở (foreground)
    messaging.onMessage((payload) => {
        console.log('Message received:', payload);

          // Hiển thị thông báo trong box
        const messageElement = document.createElement('div');
        messageElement.textContent = `${payload.notification.title}: ${payload.notification.body}`;
        messagesBox.appendChild(messageElement);

        if ('Notification' in window) {
            const notification = new Notification(payload.notification.title, {
                body: payload.notification.body,
                icon: 'icon-192.png'
            });
        } else {
            console.warn('Notification API không được hỗ trợ trên trình duyệt này.');
        }
    });
})