<div class="ax-chatroom-panel d-flex flex-column h-100" style="background: var(--card-bg, #12141c); border: 1px solid var(--card-border, #1e212d); border-radius: 12px; overflow: hidden;">
    <!-- Chat Header & Room Selector -->
    <div class="ax-chat-header px-3 py-2 border-bottom" style="border-color: #1e212d !important; background: #0f1118;">
        <div class="d-flex align-items-center justify-content-between mb-2">
            <div class="d-flex align-items-center gap-2">
                <span class="material-symbols-outlined text-warning fs-5">forum</span>
                <span class="fw-bold text-white fs-6">Live Community</span>
            </div>
            <div class="d-flex align-items-center gap-2">
                <span class="badge rounded-pill px-2 py-1" style="font-size:10px; background: rgba(181, 246, 0, 0.15); color: #b5f600; border: 1px solid rgba(181, 246, 0, 0.3);">
                    <span class="d-inline-block rounded-circle me-1" style="width:6px;height:6px; background: #b5f600;"></span>
                    <span id="ax-online-count">68</span> Online
                </span>
                <a href="https://t.me/" target="_blank" class="btn btn-xs btn-outline-info rounded-pill px-2 py-0.5 f-10 d-inline-flex align-items-center gap-1" title="Join Telegram Group">
                    <span>📱 Telegram</span>
                </a>
            </div>
        </div>

        <!-- Sync Header Info -->
        <div class="d-flex align-items-center justify-content-between px-1 pb-1" style="font-size: 10.5px; color: #8a8d9b;">
            <span>⚡ 2-Way Realtime Telegram & Web Sync</span>
            <span style="color:#b5f600;">● Live</span>
        </div>
    </div>

    <!-- Chat Messages Container -->
    <div class="ax-chat-body p-3 flex-grow-1 overflow-auto" id="ax-chat-messages" style="min-height: 250px; max-height: 520px; background: #0c0d12;">
        <div class="text-center py-4 text-muted small" id="ax-chat-loader">
            <div class="spinner-border spinner-border-sm me-1" role="status" style="color: #b5f600;"></div>
            Connecting to Live Community Chat...
        </div>
    </div>

    <!-- Chat Footer / Send Form -->
    <div class="ax-chat-footer p-2 border-top" style="border-color: #1e212d !important; background: #0f1118;">
        @if(session()->has('userlogin'))
            <form id="ax-chat-form" class="d-flex align-items-center gap-2 m-0" onsubmit="axSendChatMessage(event);">
                @csrf
                <input type="text" id="ax-chat-input" class="form-control form-control-sm text-white" placeholder="Send to Website & Telegram..." maxlength="300" autocomplete="off" required style="border-radius: 20px; font-size: 12.5px; background: #191c26; border: 1px solid #1e212d;">
                <button type="submit" class="btn btn-sm rounded-circle d-flex align-items-center justify-content-center p-0" style="width: 34px; height: 34px; flex-shrink: 0; background: #b5f600; color: #000; border: none; font-weight: bold;" title="Send Message">
                    <span class="material-symbols-outlined fs-5">send</span>
                </button>
            </form>
        @else
            <div class="text-center py-1">
                <a href="#" class="btn btn-outline-danger btn-sm w-100 py-1" style="font-size:12px; border-radius: 20px; border-color: #ef4444; color: #ef4444;" data-bs-toggle="modal" data-bs-target="#auth-modal" onclick="if(window.switchAuthTab) switchAuthTab('login')">
                    Log in to Chat & Sync
                </a>
            </div>
        @endif
    </div>
</div>

<script src="https://js.pusher.com/8.2.0/pusher.min.js"></script>
<script>
    (function() {
        var isMobileSize  = window.innerWidth < 992;
        var isChatPage    = window.location.pathname === '/chat';
        if (isMobileSize && !isChatPage) return;

        var axLastChatId   = 0;
        var axChatPollTimer= null;
        var pusherKey      = '6cb294030245343b2cb7';
        var pusherCluster  = 'mt1';

        function axRenderBadge(badge, source) {
            if (!badge && source === 'telegram') badge = '📱 Telegram';
            if (!badge) badge = '💻 Web';
            
            var bgClass = 'bg-secondary';
            if (badge.includes('Admin')) bgClass = 'bg-danger text-white';
            if (badge.includes('Captain')) bgClass = 'bg-warning text-dark';
            if (badge.includes('Telegram')) bgClass = 'bg-info text-dark';
            if (badge.includes('Pilot')) bgClass = 'bg-primary text-white';

            return '<span class="badge ' + bgClass + ' ms-1" style="font-size:9px; padding: 2px 6px;">' + badge + '</span>';
        }

        function axRenderChatMessage(msg) {
            var isMe   = msg.is_me;
            var avatar = msg.avatar || '/images/flyboy10x_icon.png';
            var name   = msg.username || 'Pilot';
            var time   = msg.time || '';
            var text   = msg.message || '';
            var badge  = axRenderBadge(msg.badge, msg.source);

            return '<div class="ax-chat-item d-flex gap-2 mb-2" data-msg-id="' + msg.id + '"' + (isMe ? ' style="flex-direction:row-reverse"' : '') + '>' +
                '<img src="' + avatar + '" class="rounded-circle" style="width:28px;height:28px;object-fit:cover;flex-shrink:0;" onerror="this.src=\'/images/flyboy10x_icon.png\'">' +
                '<div class="ax-chat-bubble-wrap" style="max-width:85%;' + (isMe ? 'display:flex;flex-direction:column;align-items:flex-end' : '') + '">' +
                    '<div class="d-flex align-items-center gap-1 mb-1">' +
                        '<span class="fw-bold ' + (isMe ? 'text-danger' : 'text-light') + '" style="font-size:11px;">' + name + '</span>' +
                        badge +
                        '<span class="text-muted ms-1" style="font-size:9.5px;">' + time + '</span>' +
                    '</div>' +
                    '<div class="ax-chat-bubble p-2 rounded-3 text-white" style="font-size:12.5px;background:' + (isMe ? 'rgba(255,30,70,0.25)' : '#1c1e27') + ';border:1px solid ' + (isMe ? 'rgba(255,30,70,0.4)' : 'rgba(255,255,255,0.06)') + ';word-break:break-word;">' +
                        text +
                    '</div>' +
                '</div>' +
            '</div>';
        }

        function axAppendSingleMessage(msg) {
            var container = $('#ax-chat-messages');
            if (container.find('.ax-chat-item[data-msg-id="' + msg.id + '"]').length === 0) {
                var atBottom = (container[0].scrollHeight - container.scrollTop() - container[0].clientHeight) < 120 || axLastChatId === 0;
                container.append(axRenderChatMessage(msg));
                axLastChatId = Math.max(axLastChatId, msg.id);
                if (atBottom) {
                    container.scrollTop(container[0].scrollHeight);
                }
            }
        }

        function axFetchChatMessages() {
            $.ajax({
                url: '/chat/messages?room=general&last_id=' + axLastChatId,
                type: 'GET',
                dataType: 'json',
                success: function(res) {
                    $('#ax-chat-loader').remove();
                    if (res.online_count) {
                        $('#ax-online-count').text(res.online_count);
                    }
                    if (res.messages && res.messages.length > 0) {
                        res.messages.forEach(function(msg) {
                            axAppendSingleMessage(msg);
                        });
                    }
                }
            });
        }

        window.axSendChatMessage = function(e) {
            e.preventDefault();
            var input = $('#ax-chat-input');
            var text  = $.trim(input.val());
            if (!text) return;

            input.val('').prop('disabled', true);

            $.ajax({
                url: '/chat/send',
                type: 'POST',
                data: {
                    _token: '{{ csrf_token() }}',
                    room: 'general',
                    message: text
                },
                dataType: 'json',
                success: function(res) {
                    input.prop('disabled', false).focus();
                    if (res.success && res.message) {
                        axAppendSingleMessage(res.message);
                    }
                },
                error: function() {
                    input.prop('disabled', false).focus();
                }
            });
        };

        // Initialize Pusher WebSocket Subscriptions for 0ms Real-Time Sync
        function initPusherWebSocket() {
            if (typeof Pusher !== 'undefined' && pusherKey) {
                try {
                    var pusher = new Pusher(pusherKey, { cluster: pusherCluster });
                    var channel = pusher.subscribe('flyboy-chat');
                    channel.bind('message-sent', function(data) {
                        if (typeof data === 'string') {
                            try { data = JSON.parse(data); } catch(e){}
                        }
                        if (data) {
                            axAppendSingleMessage(data);
                        }
                    });
                    console.log('FlyBoy Pusher Chat WebSocket connected on channel: flyboy-chat');
                } catch(e) {
                    console.warn('Pusher WS connection error: ', e);
                }
            }
        }

        $(document).ready(function() {
            axFetchChatMessages();
            initPusherWebSocket();
            axChatPollTimer = setInterval(axFetchChatMessages, 3000); // 3s fallback poll
        });
    })();
</script>
