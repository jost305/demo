/**
 * FlyBoy10x Real-Time In-App & Web Push Notification System
 */

(function () {
    let seenNotificationIds = new Set();
    let isFirstPoll = true;

    // Service Worker Registration
    if ('serviceWorker' in navigator) {
        window.addEventListener('load', function () {
            navigator.serviceWorker.register('/sw.js').then(function (registration) {
                console.log('Push Service Worker registered with scope: ', registration.scope);
            }).catch(function (err) {
                console.warn('Push Service Worker registration failed: ', err);
            });
        });
    }

    // Request Browser Push Notification Permission
    function requestPushPermission() {
        if ('Notification' in window && Notification.permission === 'default') {
            Notification.requestPermission().then(function (permission) {
                console.log('Web Push Notification Permission: ', permission);
            });
        }
    }

    // Trigger In-App Glassmorphism Toast Banner
    function showInAppToast(notification) {
        let container = document.getElementById('ax-toast-container');
        if (!container) {
            container = document.createElement('div');
            container.id = 'ax-toast-container';
            container.style.cssText = 'position:fixed; top:20px; right:20px; z-index:999999; display:flex; flex-direction:column; gap:10px; max-width:340px; pointer-events:none;';
            document.body.appendChild(container);
        }

        let icon = '🔔';
        if (notification.type === 'fuel_points') icon = '🛩️';
        if (notification.type === 'deposit_success') icon = '💰';
        if (notification.type === 'deposit_failed') icon = '⚠️';
        if (notification.type === 'win') icon = '🎉';
        if (notification.type === 'withdrawal_approved') icon = '✅';
        if (notification.type === 'withdrawal_rejected') icon = '❌';

        let toast = document.createElement('div');
        toast.className = 'ax-toast-item';
        toast.style.cssText = 'pointer-events:auto; background:rgba(18, 20, 29, 0.95); backdrop-filter:blur(16px); border:1px solid rgba(255, 30, 70, 0.35); border-radius:14px; padding:12px 16px; color:#fff; box-shadow:0 12px 32px rgba(0,0,0,0.7); display:flex; align-items:flex-start; gap:12px; transform:translateX(120%); transition:all 0.35s cubic-bezier(0.34, 1.56, 0.64, 1);';

        toast.innerHTML = `
            <div style="font-size:22px; line-height:1; flex-shrink:0;">${icon}</div>
            <div style="flex:1; min-width:0;">
                <div style="font-size:13px; font-weight:800; color:#fff; margin-bottom:2px; letter-spacing:-0.2px;">${escapeHtml(notification.title)}</div>
                <div style="font-size:11px; color:#a0a5b5; line-height:1.35; word-wrap:break-word;">${escapeHtml(notification.message)}</div>
            </div>
            <button type="button" onclick="this.parentElement.remove()" style="background:none; border:none; color:#6b7280; font-size:16px; cursor:pointer; padding:0; line-height:1;">&times;</button>
        `;

        container.appendChild(toast);

        // Slide in animation
        setTimeout(function () {
            toast.style.transform = 'translateX(0)';
        }, 50);

        // Play chime sound
        playChimeSound();

        // Trigger Web Push Notification if permission granted
        showWebPushNotification(notification.title, notification.message);

        // Auto remove toast after 6 seconds
        setTimeout(function () {
            toast.style.transform = 'translateX(120%)';
            toast.style.opacity = '0';
            setTimeout(function () {
                toast.remove();
            }, 400);
        }, 6000);
    }

    // Trigger Web Push Notification
    function showWebPushNotification(title, message) {
        if ('Notification' in window && Notification.permission === 'granted') {
            try {
                new Notification(title, {
                    body: message,
                    icon: '/images/favicon.png',
                    badge: '/images/favicon.png'
                });
            } catch (e) {}
        }
    }

    // Gentle Audio Chime Sound
    function playChimeSound() {
        try {
            let ctx = new (window.AudioContext || window.webkitAudioContext)();
            let osc = ctx.createOscillator();
            let gain = ctx.createGain();
            osc.type = 'sine';
            osc.frequency.setValueAtTime(587.33, ctx.currentTime);
            osc.frequency.exponentialRampToValueAtTime(880, ctx.currentTime + 0.15);
            gain.gain.setValueAtTime(0.08, ctx.currentTime);
            gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.3);
            osc.connect(gain);
            gain.connect(ctx.destination);
            osc.start();
            osc.stop(ctx.currentTime + 0.3);
        } catch (e) {}
    }

    function escapeHtml(str) {
        if (!str) return '';
        return str.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");
    }

    // Poll for notifications
    function pollNotifications() {
        if (typeof $ === 'undefined') return;

        $.ajax({
            url: '/notifications/unread',
            type: 'GET',
            dataType: 'json',
            success: function (res) {
                if (!res.isSuccess) return;

                // Update bell badge
                let unreadCount = res.unread_count || 0;
                let badge = $('#notification_count, #notification_badge');
                if (unreadCount > 0) {
                    badge.text(unreadCount).removeClass('d-none').show();
                } else {
                    badge.addClass('d-none').hide();
                }

                // Render notification dropdown list if container exists
                let listContainer = $('#notification_list');
                if (listContainer.length > 0 && res.notifications) {
                    if (res.notifications.length === 0) {
                        listContainer.html('<div class="text-center p-3 text-muted f-11">No notifications yet</div>');
                    } else {
                        let html = '';
                        res.notifications.forEach(function (n) {
                            let icon = '🔔';
                            if (n.type === 'fuel_points') icon = '🛩️';
                            if (n.type === 'deposit_success') icon = '💰';
                            if (n.type === 'win') icon = '🎉';
                            if (n.type === 'withdrawal_approved') icon = '✅';

                            let unreadStyle = !n.read_at ? 'background:rgba(255, 30, 70, 0.12); border-left: 3px solid #ff1e46;' : '';
                            html += `
                                <div class="ax-notif-item p-2 mb-1 rounded d-flex gap-2 align-items-center" style="${unreadStyle}">
                                    <div class="f-18">${icon}</div>
                                    <div class="flex-grow-1 min-w-0">
                                        <div class="fw-bold f-11 text-white">${escapeHtml(n.title)}</div>
                                        <div class="text-muted f-10 text-truncate">${escapeHtml(n.message)}</div>
                                    </div>
                                </div>
                            `;
                        });
                        listContainer.html(html);
                    }
                }

                // Show toast for newly arrived unread notifications
                if (res.notifications) {
                    res.notifications.forEach(function (n) {
                        if (!seenNotificationIds.has(n.id)) {
                            seenNotificationIds.add(n.id);
                            if (!isFirstPoll && !n.read_at) {
                                showInAppToast(n);
                            }
                        }
                    });
                }

                isFirstPoll = false;
            }
        });
    }

    $(document).ready(function () {
        requestPushPermission();
        pollNotifications();
        setInterval(pollNotifications, 4000); // Poll every 4s for instant alerts

        // Enable browser notification button click
        $(document).on('click', '#enable-browser-notifications', function () {
            if ('Notification' in window) {
                Notification.requestPermission().then(function (permission) {
                    if (permission === 'granted') {
                        alert('Browser push notifications enabled!');
                    }
                });
            }
        });

        // Mark all as read when bell icon or clear button clicked
        $(document).on('click', '#axNotifBtn, #mark-all-notifications-read', function () {
            $.post('/notifications/mark-read', { _token: $('meta[name="csrf-token"]').attr('content') }, function () {
                $('#notification_count, #notification_badge').addClass('d-none').hide();
            });
        });
    });
})();
