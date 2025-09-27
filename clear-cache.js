// Cache clearing utility for PWA deployment
// Add this script to your page or run in browser console after deployment

function clearAppCache() {
    if ('serviceWorker' in navigator) {
        // Unregister all service workers
        navigator.serviceWorker.getRegistrations().then(function(registrations) {
            for(let registration of registrations) {
                registration.unregister();
                console.log('Service Worker unregistered:', registration);
            }
        });

        // Clear all caches
        if ('caches' in window) {
            caches.keys().then(function(cacheNames) {
                return Promise.all(
                    cacheNames.map(function(cacheName) {
                        console.log('Deleting cache:', cacheName);
                        return caches.delete(cacheName);
                    })
                );
            }).then(function() {
                console.log('All caches cleared!');
                alert('Cache cleared! The app will reload with the latest version.');
                window.location.reload(true);
            });
        }
    } else {
        console.log('Service Workers not supported');
        window.location.reload(true);
    }
}

// Force update function
function forceUpdate() {
    if ('serviceWorker' in navigator && navigator.serviceWorker.controller) {
        navigator.serviceWorker.controller.postMessage({ command: 'skipWaiting' });
    }
    window.location.reload(true);
}

console.log('Cache utilities loaded. Use clearAppCache() or forceUpdate() to refresh.');