<div class="ax-chatroom-panel d-flex flex-column h-100" style="background: #090a0f; border: 1px solid #1a1d26; border-radius: 12px; overflow: hidden; font-family: system-ui, -apple-system, sans-serif;">
    <!-- Chat Header -->
    <div class="ax-chat-header px-3 py-2.5 border-bottom d-flex align-items-center justify-content-between" style="border-color: #1a1d26 !important; background: #090a0f;">
        <div class="d-flex align-items-center gap-2">
            <span class="material-symbols-outlined text-danger fs-5" style="color: #ef4444 !important;">chat_bubble</span>
            <span class="fw-bold text-white tracking-wide" style="font-size: 13px; letter-spacing: 0.5px;">LIVE CHAT & TROLL</span>
        </div>
        <div class="d-flex align-items-center gap-2">
            <span class="badge rounded-pill px-2.5 py-1 d-inline-flex align-items-center gap-1.5" style="font-size: 10.5px; background: rgba(34, 197, 94, 0.12); color: #22c55e; border: 1px solid rgba(34, 197, 94, 0.25); font-weight: 600;">
                <span class="rounded-circle d-inline-block" style="width: 6px; height: 6px; background: #22c55e; box-shadow: 0 0 6px #22c55e;"></span>
                <span id="ax-online-count">128</span> Online
            </span>
        </div>
    </div>

    <!-- Chat Messages Container -->
    <div class="ax-chat-body p-3 flex-grow-1 overflow-auto" id="ax-chat-messages" style="min-height: 250px; max-height: 540px; background: #06070a; scrollbar-width: thin; scrollbar-color: #1e2230 transparent;">
        <div class="text-center py-4 text-muted small" id="ax-chat-loader">
            <div class="spinner-border spinner-border-sm me-1" role="status" style="color: #ef4444;"></div>
            Loading chat...
        </div>
    </div>

    <!-- Chat Footer / Send Form -->
    <div class="ax-chat-footer px-3 py-2 border-top" style="border-color: #1a1d26 !important; background: #090a0f;">
        @if(session()->has('userlogin'))
            <form id="ax-chat-form" class="position-relative d-flex align-items-center m-0" onsubmit="axSendChatMessage(event);">
                @csrf
                <input type="text" id="ax-chat-input" class="form-control text-white border-0" placeholder="Type a message..." maxlength="300" autocomplete="off" required style="border-radius: 20px; font-size: 12.5px; background: #12141d; border: 1px solid #222634 !important; padding: 8px 42px 8px 14px;">
                <button type="submit" class="btn p-0 position-absolute d-flex align-items-center justify-content-center" style="right: 12px; background: transparent; border: none; color: #f8fafc;" title="Send Message">
                    <span class="material-symbols-outlined" style="font-size: 18px; transform: rotate(-25deg);">send</span>
                </button>
            </form>
        @else
            <div class="text-center py-1">
                <a href="#" class="btn btn-outline-danger btn-sm w-100 py-1.5" style="font-size: 12px; border-radius: 20px; border-color: #ef4444; color: #ef4444;" data-bs-toggle="modal" data-bs-target="#auth-modal" onclick="if(window.switchAuthTab) switchAuthTab('login')">
                    Log in to Chat
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

        function axRenderBadgeIcon(badge, source) {
            if (badge && badge.includes('Telegram')) return '<span style="font-size:10px; margin-left:3px;" title="Telegram">📱</span>';
            if (badge && badge.includes('Admin')) return '<span style="font-size:10px; margin-left:3px;" title="Admin">👑</span>';
            if (badge && badge.includes('Captain')) return '<span style="font-size:10px; margin-left:3px;" title="Captain">👨‍✈️</span>';
            if (source === 'telegram') return '<span style="font-size:10px; margin-left:3px;" title="Telegram">📱</span>';
            return '';
        }

        function axRenderChatMessage(msg) {
            var isMe   = msg.is_me;
            var avatar = msg.avatar || '/images/flyboy10x_icon.png';
            var name   = msg.username || 'Pilot';
            var time   = msg.time || '';
            var text   = msg.message || '';
            var icon   = axRenderBadgeIcon(msg.badge, msg.source);

            return '<div class="ax-chat-item d-flex align-items-start gap-2.5 mb-2.5" data-msg-id="' + msg.id + '">' +
                '<img src="' + avatar + '" class="rounded-circle" style="width:30px; height:30px; object-fit:cover; flex-shrink:0; border: 1px solid rgba(255,255,255,0.12);" onerror="this.src=\'/images/flyboy10x_icon.png\'">' +
                '<div class="flex-grow-1 min-w-0">' +
                    '<div class="d-flex align-items-center justify-content-between mb-0.5">' +
                        '<div class="d-flex align-items-center">' +
                            '<span class="fw-bold ' + (isMe ? 'text-danger' : 'text-white') + '" style="font-size: 12.5px; line-height: 1.2;">' + name + '</span>' +
                            icon +
                        '</div>' +
                        '<span class="text-muted" style="font-size: 11px; color: #64748b !important;">' + time + '</span>' +
                    '</div>' +
                    '<div style="font-size: 12.5px; color: #cbd5e1; line-height: 1.35; word-break: break-word; font-weight: 400;">' +
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
                } catch(e) {}
            }
        }

        $(document).ready(function() {
            axFetchChatMessages();
            initPusherWebSocket();
            axChatPollTimer = setInterval(axFetchChatMessages, 3000);
        });
    })();
</script>
