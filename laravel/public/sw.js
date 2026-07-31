// FlyBoy10x Web Push Notification Service Worker
self.addEventListener('install', function(event) {
    self.skipWaiting();
});

self.addEventListener('activate', function(event) {
    event.waitUntil(self.clients.claim());
});

self.addEventListener('push', function(event) {
    let data = {};
    if (event.data) {
        try {
            data = event.data.json();
        } catch (e) {
            data = { title: 'FlyBoy10x Notification', message: event.data.text() };
        }
    }
    
    const title = data.title || 'FlyBoy10x Alert';
    const options = {
        body: data.message || data.body || 'You have a new update!',
        icon: '/images/favicon.png',
        badge: '/images/favicon.png',
        vibrate: [100, 50, 100],
        data: {
            url: data.url || '/crash'
        }
    };

    event.waitUntil(
        self.registration.showNotification(title, options)
    );
});

self.addEventListener('notificationclick', function(event) {
    event.notification.close();
    event.waitUntil(
        clients.matchAll({ type: 'window', includeUncontrolled: true }).then(function(clientList) {
            for (var i = 0; i < clientList.length; i++) {
                var client = clientList[i];
                if (client.url && 'focus' in client) {
                    return client.focus();
                }
            }
            if (clients.openWindow) {
                return clients.openWindow(event.notification.data.url || '/crash');
            }
        })
    );
});
