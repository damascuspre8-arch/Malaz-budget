const CACHE_NAME = 'malaz-v1';
const ASSETS_TO_CACHE = [
  './',
  './index.html',
  './manifest.json',
  './malaz-icon-square.svg',
  'https://cdn.tailwindcss.com'
];

// 1. تثبيت الـ Service Worker وتخزين الملفات
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll(ASSETS_TO_CACHE);
    })
  );
  self.skipWaiting();
});

// 2. تفعيل التخزين وحذف الباقات القديمة
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((keys) => {
      return Promise.all(
        keys.map((key) => {
          if (key !== CACHE_NAME) {
            return caches.delete(key);
          }
        })
      );
    })
  );
  self.clients.claim();
});

// 3. قراءة الملفات من الذاكرة المحلية عند قطع الإنترنت
self.addEventListener('fetch', (event) => {
  event.respondWith(
    caches.match(event.request).then((cachedResponse) => {
      if (cachedResponse) {
        return cachedResponse;
      }
      return fetch(event.request).catch(() => {
        // في حال انقطاع الشبكة وعدم وجود الملف
        return caches.match('./index.html');
      });
    })
  );
});
