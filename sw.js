self.addEventListener('install', (event) => {
    console.log('Service Worker installed');
  });

  self.addEventListener('push', (event) => {
    const data = event.data.json();
    const options = {
      body: data.body,
      icon: 'icon-192.png',
      badge: 'icon-192.png'
    };

    // Tối ưu cho iOS: Đảm bảo waitUntil để tránh termination
    event.waitUntil(
        self.registration.showNotification(data.title, options).catch(err => {
          console.error('Lỗi khi hiển thị thông báo:', err);
        })
    );
  });

  self.addEventListener('notificationclick', (event) => {
    event.notification.close();
    event.waitUntil(clients.openWindow('/'));
  });