// Dynamic cache versioning based on timestamp for auto-updates
// Force deployment: 2025-09-28T17:30:00Z - API Fix v2.2.0
const CACHE_VERSION = '7k-money-v' + new Date().toISOString().split('T')[0]; // Daily cache updates
const CACHE_NAME = CACHE_VERSION;
const urlsToCache = [
  './index.html',
  './manifest.json',
  './logo/logo-for-7kmomey-192x192.png',
  './logo/logo-for-7kmomey-512x512.png'
];

// Install Service Worker
self.addEventListener('install', (event) => {
  console.log('Service Worker: Install Event', CACHE_NAME);
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => {
        console.log('Service Worker: Caching App Shell');
        return cache.addAll(urlsToCache);
      })
      .then(() => {
        // Force activation of new service worker
        return self.skipWaiting();
      })
  );
});

// Activate Service Worker with improved cache management
self.addEventListener('activate', (event) => {
  console.log('Service Worker: Activate Event', CACHE_NAME);
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cache) => {
          // Delete all old caches except current one
          if (cache.startsWith('7k-money-v') && cache !== CACHE_NAME) {
            console.log('Service Worker: Deleting Old Cache', cache);
            return caches.delete(cache);
          }
        })
      );
    }).then(() => {
      // Take control of all clients immediately
      return self.clients.claim();
    })
  );
});

// Enhanced Fetch Event with network-first strategy for HTML
self.addEventListener('fetch', (event) => {
  console.log('Service Worker: Fetch Event', event.request.url);
  
  // Network-first strategy for HTML files to ensure updates
  if (event.request.destination === 'document' || event.request.url.endsWith('.html')) {
    event.respondWith(
      fetch(event.request)
        .then((networkResponse) => {
          // If network request succeeds, cache it and return
          if (networkResponse && networkResponse.status === 200) {
            const responseToCache = networkResponse.clone();
            caches.open(CACHE_NAME)
              .then((cache) => {
                cache.put(event.request, responseToCache);
              });
          }
          return networkResponse;
        })
        .catch(() => {
          // If network fails, try cache
          return caches.match(event.request)
            .then((cachedResponse) => {
              return cachedResponse || caches.match('./index.html');
            });
        })
    );
  } else {
    // Cache-first strategy for other resources
    event.respondWith(
      caches.match(event.request)
        .then((response) => {
          // Return cached version or fetch from network
          return response || fetch(event.request)
            .then((fetchResponse) => {
              // Check if we received a valid response
              if (!fetchResponse || fetchResponse.status !== 200 || fetchResponse.type !== 'basic') {
                return fetchResponse;
              }

              // Clone the response as it can only be consumed once
              const responseToCache = fetchResponse.clone();

              caches.open(CACHE_NAME)
                .then((cache) => {
                  cache.put(event.request, responseToCache);
                });

              return fetchResponse;
            });
        })
        .catch(() => {
          // Return offline page or cached index.html for navigation requests
          if (event.request.destination === 'document') {
            return caches.match('./index.html');
          }
        })
    );
  }
});

// Background Sync (for future use)
self.addEventListener('sync', (event) => {
  if (event.tag === 'background-sync') {
    console.log('Service Worker: Background Sync');
    // Handle background sync for offline transactions
  }
});

// Push Notifications (for future use)
self.addEventListener('push', (event) => {
  console.log('Service Worker: Push Event');
  // Handle push notifications
});