// Service Worker chính (hoạt động trên mọi nền tảng)

self.addEventListener('install', (event) => {
    console.log('[sw.js] Service Worker được cài đặt.');
});

self.addEventListener('activate', (event) => {
    console.log('[sw.js] Service Worker được kích hoạt.');
});