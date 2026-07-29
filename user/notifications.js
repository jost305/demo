(function () {
    'use strict';

    if (window.__aviatorNotificationsInitialized) {
        return;
    }
    window.__aviatorNotificationsInitialized = true;

    function initializeNotifications() {
        var dropdown = document.getElementById('notificationDropdown');
        var list = document.getElementById('notification_list');
        var count = document.getElementById('notification_count');
        var enableBrowserButton = document.getElementById('enable-browser-notifications');
        var markAllButton = document.getElementById('mark-all-notifications-read');

        if (!dropdown || !list || !count) {
            return;
        }

        var csrfToken = dropdown.getAttribute('data-csrf');
        var storageKey = 'aviator:last-notification-id';
        var lastNotificationId = Number(window.localStorage.getItem(storageKey) || 0);
        var hasLoadedOnce = false;

        function setCount(unreadCount) {
            var unread = Number(unreadCount || 0);
            if (unread > 0) {
                count.textContent = unread > 99 ? '99+' : String(unread);
                count.classList.remove('d-none');
            } else {
                count.textContent = '0';
                count.classList.add('d-none');
            }
        }

        function formatDate(value) {
            if (!value) {
                return '';
            }
            var date = new Date(value);
            return Number.isNaN(date.getTime()) ? '' : date.toLocaleString();
        }

        function renderNotifications(items) {
            list.innerHTML = '';

            if (!items.length) {
                var empty = document.createElement('div');
                empty.className = 'notification-empty';
                empty.textContent = 'No new notifications';
                list.appendChild(empty);
                return;
            }

            items.forEach(function (item) {
                var notification = document.createElement('button');
                notification.type = 'button';
                notification.className = 'notification-item' + (item.read ? '' : ' notification-unread');
                notification.setAttribute('data-notification-id', item.id);

                var title = document.createElement('strong');
                title.className = 'notification-item-title';
                title.textContent = item.title || 'Notification';

                var message = document.createElement('span');
                message.className = 'notification-item-message';
                message.textContent = item.message || '';

                var date = document.createElement('small');
                date.className = 'notification-item-date';
                date.textContent = formatDate(item.created_at);

                notification.appendChild(title);
                notification.appendChild(message);
                notification.appendChild(date);
                notification.addEventListener('click', function () {
                    markAsRead(item.id, notification);
                });
                list.appendChild(notification);
            });
        }

        function markAsRead(id, element) {
            fetch('/notifications/' + encodeURIComponent(id) + '/read', {
                method: 'POST',
                credentials: 'same-origin',
                headers: {
                    'Accept': 'application/json',
                    'X-CSRF-TOKEN': csrfToken,
                    'X-Requested-With': 'XMLHttpRequest'
                }
            }).then(function () {
                element.classList.remove('notification-unread');
                refreshNotifications(false);
            });
        }

        function showBrowserNotification(item) {
            if (!('Notification' in window) || Notification.permission !== 'granted') {
                return;
            }

            new Notification(item.title || 'FlyBoy notification', {
                body: item.message || '',
                icon: '/images/logo.png',
                tag: 'aviator-notification-' + item.id
            });
        }

        function refreshNotifications(showBrowserAlerts) {
            fetch('/notifications?limit=20', {
                credentials: 'same-origin',
                headers: { 'Accept': 'application/json' }
            })
                .then(function (response) {
                    if (!response.ok) {
                        throw new Error('Unable to load notifications');
                    }
                    return response.json();
                })
                .then(function (payload) {
                    var items = Array.isArray(payload.data) ? payload.data : [];
                    var newestId = items.reduce(function (max, item) {
                        return Math.max(max, Number(item.id) || 0);
                    }, 0);

                    if (hasLoadedOnce && showBrowserAlerts && newestId > lastNotificationId) {
                        items.filter(function (item) {
                            return Number(item.id) > lastNotificationId;
                        }).reverse().forEach(showBrowserNotification);
                    }

                    if (newestId > lastNotificationId) {
                        lastNotificationId = newestId;
                        window.localStorage.setItem(storageKey, String(lastNotificationId));
                    }

                    setCount(payload.unread_count || 0);
                    renderNotifications(items);
                    hasLoadedOnce = true;
                })
                .catch(function () {
                    // Keep the dropdown usable when the notification endpoint is unavailable.
                });
        }

        if (enableBrowserButton) {
            enableBrowserButton.addEventListener('click', function () {
                if (!('Notification' in window)) {
                    enableBrowserButton.textContent = 'Browser alerts unavailable';
                    return;
                }

                Notification.requestPermission().then(function (permission) {
                    enableBrowserButton.textContent = permission === 'granted'
                        ? 'Browser alerts enabled'
                        : 'Browser alerts blocked';
                });
            });
        }

        if (markAllButton) {
            markAllButton.addEventListener('click', function () {
                fetch('/notifications/read-all', {
                    method: 'POST',
                    credentials: 'same-origin',
                    headers: {
                        'Accept': 'application/json',
                        'X-CSRF-TOKEN': csrfToken,
                        'X-Requested-With': 'XMLHttpRequest'
                    }
                }).then(function () {
                    refreshNotifications(false);
                });
            });
        }

        refreshNotifications(false);
        window.setInterval(function () {
            refreshNotifications(true);
        }, 30000);
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initializeNotifications);
    } else {
        initializeNotifications();
    }
})();
