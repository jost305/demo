<div class="ax-chatroom-panel">
    <div class="ax-chat-header d-flex align-items-center justify-content-between px-3 py-2 border-bottom border-secondary">
        <div class="d-flex align-items-center gap-2">
            <span class="material-symbols-outlined text-danger">forum</span>
            <span class="fw-bold text-white fs-6">Live Chat & Troll</span>
        </div>
        <div class="d-flex align-items-center gap-1">
            <span class="ax-online-badge">
                <span class="ax-online-dot"></span>
                <span id="ax-online-count">128</span> Online
            </span>
        </div>
    </div>

    <div class="ax-chat-body p-3" id="ax-chat-messages">
        <!-- Messages loaded dynamically -->
        <div class="text-center py-4 text-muted small" id="ax-chat-loader">
            <div class="spinner-border spinner-border-sm text-secondary me-1" role="status"></div>
            Connecting to chat...
        </div>
    </div>

    <div class="ax-chat-footer p-2 border-top border-secondary">
        @if(session()->has('userlogin'))
            <form id="ax-chat-form" class="d-flex align-items-center gap-2 m-0" onsubmit="axSendChatMessage(event);">
                @csrf
                <input type="text" id="ax-chat-input" class="form-control form-control-sm bg-dark text-white border-secondary" placeholder="Type a message or troll..." maxlength="300" autocomplete="off" required style="border-radius: 20px; font-size: 13px;">
                <button type="submit" class="btn btn-danger btn-sm rounded-circle d-flex align-items-center justify-content-center p-0" style="width: 34px; height: 34px; flex-shrink: 0;">
                    <span class="material-symbols-outlined fs-5">send</span>
                </button>
            </form>
        @else
            <div class="text-center py-2">
                <a href="#" class="btn btn-outline-danger btn-sm w-100" data-bs-toggle="modal" data-bs-target="#auth-modal" onclick="if(window.switchAuthTab) switchAuthTab('login')">
                    Log in to Chat
                </a>
            </div>
        @endif
    </div>
</div>

<script>
    // Only activate chat polling on desktop (lg+) or on the /chat page itself
    (function() {
        var isMobileSize = window.innerWidth < 992;
        var isChatPage   = window.location.pathname === '/chat';

        // On /crash on mobile → skip polling entirely (no chat section shown)
        if (isMobileSize && !isChatPage) return;

        var axLastChatId  = 0;
        var axChatPollTimer = null;

        function axRenderChatMessage(msg) {
            var isMe   = msg.is_me;
            var avatar = msg.avatar || '/images/avtar/av-1.png';
            var name   = msg.username || 'Player';
            var time   = msg.time || '';
            var text   = msg.message || '';

            return '<div class="ax-chat-item d-flex gap-2 mb-2" data-msg-id="' + msg.id + '"' + (isMe ? ' style="flex-direction:row-reverse"' : '') + '>' +
                '<img src="' + avatar + '" class="rounded-circle" style="width:28px;height:28px;object-fit:cover;flex-shrink:0;" onerror="this.src=\'/images/avtar/av-1.png\'">' +
                '<div class="ax-chat-bubble-wrap" style="max-width:85%;' + (isMe ? 'display:flex;flex-direction:column;align-items:flex-end' : '') + '">' +
                    '<div class="d-flex align-items-center gap-1 mb-1">' +
                        '<span class="fw-bold ' + (isMe ? 'text-danger' : 'text-light') + '" style="font-size:11px;">' + name + '</span>' +
                        '<span class="text-muted" style="font-size:9.5px;">' + time + '</span>' +
                    '</div>' +
                    '<div class="ax-chat-bubble p-2 rounded-3 text-white" style="font-size:12.5px;background:' + (isMe ? 'rgba(255,30,70,0.2)' : '#1c1e27') + ';border:1px solid ' + (isMe ? 'rgba(255,30,70,0.35)' : 'rgba(255,255,255,0.06)') + ';word-break:break-word;">' +
                        text +
                    '</div>' +
                '</div>' +
            '</div>';
        }

        function axFetchChatMessages() {
            $.ajax({
                url: '/chat/messages?last_id=' + axLastChatId,
                type: 'GET',
                dataType: 'json',
                success: function(res) {
                    $('#ax-chat-loader').remove();
                    if (res.messages && res.messages.length > 0) {
                        var container = $('#ax-chat-messages');
                        var atBottom  = (container[0].scrollHeight - container.scrollTop() - container[0].clientHeight) < 80 || axLastChatId === 0;

                        res.messages.forEach(function(msg) {
                            if ($('.ax-chat-item[data-msg-id="' + msg.id + '"]').length === 0) {
                                container.append(axRenderChatMessage(msg));
                            }
                        });

                        axLastChatId = res.last_id;

                        if (atBottom) {
                            container.scrollTop(container[0].scrollHeight);
                        }
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
                    message: text
                },
                dataType: 'json',
                success: function(res) {
                    input.prop('disabled', false).focus();
                    if (res.success && res.message) {
                        var container = $('#ax-chat-messages');
                        if ($('.ax-chat-item[data-msg-id="' + res.message.id + '"]').length === 0) {
                            container.append(axRenderChatMessage(res.message));
                            axLastChatId = Math.max(axLastChatId, res.message.id);
                            container.scrollTop(container[0].scrollHeight);
                        }
                    }
                },
                error: function() {
                    input.prop('disabled', false).focus();
                }
            });
        };

        $(document).ready(function() {
            axFetchChatMessages();
            axChatPollTimer = setInterval(axFetchChatMessages, 3000);
        });
    })();
</script>
