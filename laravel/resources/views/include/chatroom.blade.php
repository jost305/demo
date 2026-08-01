<style>
#flyboy-chat-wrap {
    display: flex;
    flex-direction: column;
    height: 100%;
    min-height: 0;
    background: #0b0c10;
    border-radius: 10px;
    overflow: hidden;
    font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', system-ui, sans-serif;
}

/* ── Header ────────────────────────── */
#flyboy-chat-header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 10px 14px;
    border-bottom: 1px solid #17191f;
    background: #0b0c10;
    flex-shrink: 0;
}
#flyboy-chat-header .chat-title {
    display: flex;
    align-items: center;
    gap: 7px;
    color: #f0f0f0;
    font-size: 13px;
    font-weight: 700;
    letter-spacing: 0.3px;
}
#flyboy-chat-header .chat-title svg {
    color: #e53e3e;
    flex-shrink: 0;
}
.chat-online-pill {
    display: inline-flex;
    align-items: center;
    gap: 5px;
    background: rgba(34,197,94,0.10);
    border: 1px solid rgba(34,197,94,0.22);
    color: #22c55e;
    font-size: 11px;
    font-weight: 600;
    padding: 3px 9px 3px 7px;
    border-radius: 20px;
    line-height: 1;
}
.chat-online-dot {
    width: 6px;
    height: 6px;
    border-radius: 50%;
    background: #22c55e;
    box-shadow: 0 0 5px #22c55e;
    display: inline-block;
}

/* ── Messages ─────────────────────── */
#flyboy-chat-messages {
    flex: 1;
    min-height: 0;
    overflow-y: auto;
    padding: 10px 14px 4px;
    background: #0b0c10;
    scrollbar-width: thin;
    scrollbar-color: #1e2230 transparent;
}
#flyboy-chat-messages::-webkit-scrollbar { width: 4px; }
#flyboy-chat-messages::-webkit-scrollbar-track { background: transparent; }
#flyboy-chat-messages::-webkit-scrollbar-thumb { background: #1e2230; border-radius: 4px; }

.fc-msg-row {
    display: flex;
    align-items: flex-start;
    gap: 10px;
    padding: 7px 0;
    border-bottom: 1px solid rgba(255,255,255,0.035);
}
.fc-msg-row:last-child {
    border-bottom: none;
}
.fc-avatar {
    width: 36px;
    height: 36px;
    border-radius: 50%;
    object-fit: cover;
    flex-shrink: 0;
    border: 1.5px solid rgba(255,255,255,0.10);
}
.fc-msg-body {
    flex: 1;
    min-width: 0;
}
.fc-msg-meta {
    display: flex;
    align-items: baseline;
    justify-content: space-between;
    margin-bottom: 2px;
}
.fc-username {
    font-size: 13px;
    font-weight: 700;
    color: #f5f5f5;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
    max-width: 68%;
    line-height: 1.2;
}
.fc-username.is-me {
    color: #f87171;
}
.fc-time {
    font-size: 10.5px;
    color: #4a5568;
    flex-shrink: 0;
    line-height: 1.2;
    margin-left: 6px;
}
.fc-msg-text {
    font-size: 13px;
    color: #a0aec0;
    line-height: 1.4;
    word-break: break-word;
    font-weight: 400;
}
.fc-badge-icon {
    font-size: 11px;
    margin-left: 3px;
    vertical-align: middle;
}

/* ── Loader ────────────────────────── */
#flyboy-chat-loader {
    text-align: center;
    padding: 24px 0;
    color: #4a5568;
    font-size: 12px;
}

/* ── Footer / Input ───────────────── */
#flyboy-chat-footer {
    flex-shrink: 0;
    padding: 10px 14px;
    border-top: 1px solid #17191f;
    background: #0b0c10;
}
#flyboy-chat-form {
    display: flex;
    align-items: center;
    gap: 0;
    background: #13151c;
    border: 1px solid #1e2230;
    border-radius: 22px;
    padding: 0 8px 0 14px;
    height: 40px;
}
#flyboy-chat-input {
    flex: 1;
    background: transparent;
    border: none;
    outline: none;
    color: #e2e8f0;
    font-size: 13px;
    height: 100%;
    box-shadow: none !important;
}
#flyboy-chat-input::placeholder { color: #3d4557; }
#flyboy-chat-send-btn {
    background: transparent;
    border: none;
    color: #cbd5e1;
    padding: 4px 4px;
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;
    flex-shrink: 0;
    opacity: 0.75;
    transition: opacity 0.15s;
}
#flyboy-chat-send-btn:hover { opacity: 1; color: #f87171; }

</style>

<div id="flyboy-chat-wrap">
    {{-- Header --}}
    <div id="flyboy-chat-header">
        <div class="chat-title">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg>
            LIVE CHAT &amp; TROLL
        </div>
        <div class="chat-online-pill">
            <span class="chat-online-dot"></span>
            <span id="fc-online-count">0</span> Online
        </div>
    </div>

    {{-- Messages --}}
    <div id="flyboy-chat-messages">
        <div id="flyboy-chat-loader">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#e53e3e" stroke-width="2" style="animation:fc-spin 1s linear infinite;margin-right:5px;vertical-align:middle"><circle cx="12" cy="12" r="10" stroke-opacity="0.25"/><path d="M12 2a10 10 0 0 1 10 10" stroke="#e53e3e"/></svg>
            Loading messages...
        </div>
    </div>

    {{-- Footer - open to all, guests chat as Guest_XXX --}}
    <div id="flyboy-chat-footer">
        <form id="flyboy-chat-form" onsubmit="fcSend(event)">
            @csrf
            <input type="text" id="flyboy-chat-input" placeholder="Type a message..." maxlength="300" autocomplete="off" required>
            <button type="submit" id="flyboy-chat-send-btn" title="Send">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round" style="transform:rotate(-30deg)"><line x1="22" y1="2" x2="11" y2="13"/><polygon points="22 2 15 22 11 13 2 9 22 2"/></svg>
            </button>
        </form>
    </div>
</div>

<style>
@keyframes fc-spin { to { transform: rotate(360deg); } }
</style>

<script src="https://js.pusher.com/8.2.0/pusher.min.js"></script>
<script>
(function () {
    var lastId = 0;
    var pusherKey = '6cb294030245343b2cb7';
    var pusherCluster = 'mt1';

    function badge(b, src) {
        if (b && b.includes('Admin'))    return '<span class="fc-badge-icon" title="Admin">👑</span>';
        if (b && b.includes('Captain'))  return '<span class="fc-badge-icon" title="Captain">👨‍✈️</span>';
        if (src === 'telegram' || (b && b.includes('Telegram')))
                                         return '<span class="fc-badge-icon" title="Telegram">📱</span>';
        return '';
    }

    function renderMsg(m) {
        var av   = m.avatar   || '/images/flyboy10x_icon.png';
        var name = m.username || 'Pilot';
        var time = m.time     || '';
        var text = m.message  || '';
        var cls  = m.is_me ? ' is-me' : '';

        return '<div class="fc-msg-row" data-id="' + m.id + '">' +
            '<img class="fc-avatar" src="' + av + '" onerror="this.src=\'/images/flyboy10x_icon.png\'">' +
            '<div class="fc-msg-body">' +
                '<div class="fc-msg-meta">' +
                    '<span class="fc-username' + cls + '">' + name + badge(m.badge, m.source) + '</span>' +
                    '<span class="fc-time">' + time + '</span>' +
                '</div>' +
                '<div class="fc-msg-text">' + text + '</div>' +
            '</div>' +
        '</div>';
    }

    function appendMsg(m) {
        var box = document.getElementById('flyboy-chat-messages');
        if (box.querySelector('[data-id="' + m.id + '"]')) return;
        var atBottom = (box.scrollHeight - box.scrollTop - box.clientHeight) < 100 || lastId === 0;
        box.insertAdjacentHTML('beforeend', renderMsg(m));
        lastId = Math.max(lastId, m.id);
        if (atBottom) box.scrollTop = box.scrollHeight;
    }

    function fetchMessages() {
        var xhr = new XMLHttpRequest();
        xhr.open('GET', '/chat/messages?room=general&last_id=' + lastId, true);
        xhr.onload = function () {
            if (xhr.status !== 200) return;
            try {
                var res = JSON.parse(xhr.responseText);
                document.getElementById('flyboy-chat-loader') && (document.getElementById('flyboy-chat-loader').style.display = 'none');
                if (res.online_count) document.getElementById('fc-online-count').textContent = res.online_count;
                (res.messages || []).forEach(appendMsg);
            } catch(e) {}
        };
        xhr.send();
    }

    window.fcSend = function (e) {
        e.preventDefault();
        var inp  = document.getElementById('flyboy-chat-input');
        var text = inp.value.trim();
        if (!text) return;
        inp.value = '';
        inp.disabled = true;

        var xhr = new XMLHttpRequest();
        xhr.open('POST', '/chat/send', true);
        xhr.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
        xhr.setRequestHeader('X-CSRF-TOKEN', '{{ csrf_token() }}');
        xhr.onload = function () {
            inp.disabled = false; inp.focus();
            try {
                var res = JSON.parse(xhr.responseText);
                if (res.success && res.message) appendMsg(res.message);
            } catch(e) {}
        };
        xhr.onerror = function () { inp.disabled = false; inp.focus(); };
        xhr.send('room=general&message=' + encodeURIComponent(text));
    };

    /* Pusher real-time */
    function initPusher() {
        if (typeof Pusher === 'undefined') return;
        try {
            var ch = new Pusher(pusherKey, { cluster: pusherCluster }).subscribe('flyboy-chat');
            ch.bind('message-sent', function (data) {
                if (typeof data === 'string') { try { data = JSON.parse(data); } catch(e) {} }
                if (data) appendMsg(data);
            });
        } catch(e) {}
    }

    fetchMessages();
    initPusher();
    setInterval(fetchMessages, 3000);
})();
</script>
