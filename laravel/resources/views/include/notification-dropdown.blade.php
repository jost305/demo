<div class="ax-notif-wrap">
    <button type="button" class="ax-icon-btn ax-notif-trigger" id="axNotifBtn"
        aria-label="Notifications" data-csrf="{{ csrf_token() }}">
        <span class="material-symbols-outlined">notifications</span>
        <span class="ax-notif-badge d-none" id="notification_count">0</span>
    </button>

    <div class="ax-notif-panel" id="ax-notif-panel">
        <div class="ax-notif-header">
            <span class="ax-notif-title">Notifications</span>
            <button type="button" class="ax-notif-clear" id="mark-all-notifications-read" title="Mark all read">
                <span class="material-symbols-outlined">done_all</span>
            </button>
        </div>
        <div class="ax-notif-body" id="notification_list">
            <div class="ax-notif-empty">
                <span class="material-symbols-outlined">notifications_off</span>
                <span>No new notifications</span>
            </div>
        </div>
        <div class="ax-notif-footer">
            <button type="button" class="ax-notif-enable" id="enable-browser-notifications">
                <span class="material-symbols-outlined">notifications_active</span>
                Enable browser alerts
            </button>
        </div>
    </div>
</div>

<script src="/user/notifications.js"></script>
<script>
(function() {
    var btn = document.getElementById('axNotifBtn');
    var panel = document.getElementById('ax-notif-panel');
    if (!btn || !panel) return;

    btn.addEventListener('click', function(e) {
        e.stopPropagation();
        panel.classList.toggle('ax-notif-open');
        // close profile menu if open
        var pm = document.getElementById('profileMenu');
        if (pm) pm.classList.remove('ax-pm-open');
    });
    document.addEventListener('click', function() {
        panel.classList.remove('ax-notif-open');
    });
    panel.addEventListener('click', function(e) { e.stopPropagation(); });
})();
</script>
