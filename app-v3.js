const baseURL = 'https://minhtanle.github.io/notification-pwa';

console.log('Thông tin trình duyệt:', navigator.userAgent);

document.addEventListener('DOMContentLoaded', function () {
    // === Xử lý nút cài đặt PWA ===
    let deferredPrompt;
    const installBtn = document.getElementById('install-pwa');

    window.addEventListener('beforeinstallprompt', (e) => {
        console.log('Sự kiện beforeinstallprompt được kích hoạt'); // Thêm log

        e.preventDefault();
        deferredPrompt = e;
        installBtn.style.display = 'inline-block';
    });

    installBtn.addEventListener('click', () => {
        console.log('Người dùng nhấn nút cài đặt'); // Thêm log

        if (deferredPrompt) {
            deferredPrompt.prompt();
            deferredPrompt.userChoice.then((choiceResult) => {
                if (choiceResult.outcome === 'accepted') {
                    console.log('Người dùng đã cài đặt ứng dụng');
                } else {
                    alert('Bạn cần cài đặt ứng dụng để tiếp tục sử dụng.');
                }
                deferredPrompt = null;
            });
        }
    });

    // Đăng ký Service Worker
    if ('serviceWorker' in navigator) {
        const version = new Date().getTime();
        navigator.serviceWorker.register(`${baseURL}/firebase-messaging-sw.js?v=${version}`)
            .then((registration) => {
                console.log('Service Worker đã được đăng ký:', registration);
                // messaging.useServiceWorker(registration);
            })
            .catch((error) => {
                console.error('Lỗi khi đăng ký Service Worker:', error);
            });
    } else {
        console.warn('Trình duyệt không hỗ trợ Service Worker.');
    }

    // === Kiểm tra nếu đang ở chế độ PWA mới load Firebase ===
    function isInStandaloneMode() {
        return (window.matchMedia('(display-mode: standalone)').matches) ||
            (window.navigator.standalone === true);
    }

    if (isInStandaloneMode()) {
        // Load Firebase scripts
        function loadScript(src) {
            return new Promise((resolve, reject) => {
                const script = document.createElement('script');
                script.src = src;
                script.onload = resolve;
                script.onerror = reject;
                document.head.appendChild(script);
            });
        }

        Promise.all([
            loadScript('https://minhtanle.github.io/notification-pwa/firebase-app.js'),
            loadScript('https://minhtanle.github.io/notification-pwa/firebase-messaging.js')
        ]).then(() => {
            initFirebaseMessaging();
        }).catch((err) => {
            console.error('Không thể load Firebase scripts:', err);
        });

        function initFirebaseMessaging() {
            const firebaseConfig = {
                apiKey: "AIzaSyC1kOGCzjIJv9_tNyp4mV3R8Peiyz24K5c",
                authDomain: "notifycationpwa.firebaseapp.com",
                projectId: "notifycationpwa",
                storageBucket: "notifycationpwa.firebasestorage.app",
                messagingSenderId: "196088165519",
                appId: "1:196088165519:web:9efab7258ff41e37bb6cfa",
                measurementId: "G-SHFKPPP2DM"
            };

            const vapidKey = 'BDi3xzJpUidCPQbHzQ1wdaojtTwcoHK3toUWBOdGfM00CMy5PLwZNx3YAEdakuKc8wZ65EXPfy6eW-1T0ih4Fds';

            firebase.initializeApp(firebaseConfig);
            const messaging = firebase.messaging();

            const enableNotificationsButton = document.getElementById('enable-notifications');
            const fcmTokenInput = document.getElementById('fcm-token');
            const messagesBox = document.getElementById('messages-box');



            // Bật thông báo
            enableNotificationsButton.addEventListener('click', () => {
                Notification.requestPermission().then(permission => {
                    if (permission === 'granted') {
                        messaging.getToken({ vapidKey })
                            .then(token => {
                                console.log('FCM Token:', token);
                                fcmTokenInput.value = token;
                            })
                            .catch(err => console.error('Error getting token', err));
                    } else {
                        alert('Vui lòng bật thông báo trong trình duyệt.');
                    }
                });
            });

            // Xử lý thông báo foreground
            messaging.onMessage((payload) => {
                console.log('Message received:', payload);

                const messageElement = document.createElement('div');
                messageElement.textContent = `${payload.notification.title}: ${payload.notification.body}`;
                messagesBox.appendChild(messageElement);

                if ('Notification' in window) {
                    new Notification('App ' + payload.notification.title, {
                        body: payload.notification.body,
                        icon: 'icon-192.png'
                    });
                } else {
                    console.warn('Notification API không được hỗ trợ.');
                }
            });
        }
    } else {
        alert('Vui lòng cài đặt ứng dụng để sử dụng.');
        installBtn.style.display = 'inline-block';
    }
});