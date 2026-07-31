<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Chat;
use App\Services\TelegramService;
use Illuminate\Support\Facades\Schema;

class ChatController extends Controller
{
    /**
     * Mobile /chat page
     */
    public function index(Request $r)
    {
        $activeRoom = $r->get('room', 'general');
        if ($activeRoom === 'telegram') {
            try {
                TelegramService::seedSimulatedTelegramFeed();
            } catch (\Throwable $e) {}
        }

        try {
            $messages = Chat::orderBy('id', 'desc')->take(50)->get()->reverse()->values();
        } catch (\Throwable $e) {
            $messages = collect();
        }

        return view('chat', compact('messages', 'activeRoom'));
    }

    /**
     * AJAX: get latest messages for a room (polling)
     * ?room=general&last_id=X
     */
    public function messages(Request $r)
    {
        $last_id = intval($r->get('last_id', 0));
        $room    = $r->get('room', 'general');

        if ($room === 'telegram') {
            try {
                TelegramService::seedSimulatedTelegramFeed();
            } catch (\Throwable $e) {}
        }

        try {
            $query = Chat::where('id', '>', $last_id);

            // Filter by room if room column exists in chats table
            if (Schema::hasColumn('chats', 'room')) {
                if ($room === 'general') {
                    $query->where(function($q) {
                        $q->where('room', 'general')->orWhereNull('room');
                    });
                } else {
                    $query->where('room', $room);
                }
            }

            $messages = $query->orderBy('id', 'asc')
                ->take(40)
                ->get()
                ->map(function ($msg) {
                    $isMe = (session()->has('userlogin') && session('userlogin')['id'] == $msg->userid);
                    
                    $timeStr = date('h:i A');
                    if (!empty($msg->created_at)) {
                        $timeStr = is_string($msg->created_at) ? date('h:i A', strtotime($msg->created_at)) : $msg->created_at->format('h:i A');
                    }

                    return [
                        'id'       => $msg->id,
                        'room'     => isset($msg->room) ? $msg->room : 'general',
                        'userid'   => $msg->userid,
                        'username' => $msg->username ?? 'Guest',
                        'avatar'   => $msg->avatar ?: '/images/flyboy10x_icon.png',
                        'source'   => isset($msg->source) ? $msg->source : 'web',
                        'badge'    => isset($msg->badge) ? $msg->badge : ((isset($msg->source) && $msg->source === 'telegram') ? 'Telegram' : null),
                        'message'  => e($msg->message),
                        'time'     => $timeStr,
                        'is_me'    => $isMe,
                    ];
                });

            return response()->json([
                'messages' => $messages,
                'last_id'  => $messages->count() > 0 ? $messages->last()['id'] : $last_id,
            ]);
        } catch (\Throwable $e) {
            return response()->json([
                'messages' => [],
                'last_id'  => $last_id,
                'error'    => $e->getMessage()
            ]);
        }
    }

    /**
     * AJAX: post a new message to a specific chatroom
     */
    public function store(Request $r)
    {
        $r->validate([
            'message' => 'required|string|max:300',
            'room'    => 'nullable|string|max:50',
        ]);

        $message = trim($r->message);
        $room    = $r->get('room', 'general');

        if (!$message) {
            return response()->json(['success' => false, 'message' => 'Empty message']);
        }

        $userid   = null;
        $username = 'Guest_' . rand(100, 999);
        $avatar   = user('image') ?: '/images/flyboy10x_icon.png';
        $badge    = null;

        if (session()->has('userlogin')) {
            $user     = session('userlogin');
            $userid   = $user['id'];
            $username = $user['name'] ?? ('Player #' . $user['id']);
            $avatar   = $user['image'] ?? $avatar;
            if (isset($user['isadmin']) && $user['isadmin'] == 1) {
                $badge = 'Admin';
            }
        }

        try {
            $chatData = [
                'userid'   => $userid,
                'username' => $username,
                'avatar'   => $avatar,
                'message'  => $message,
            ];

            if (Schema::hasColumn('chats', 'room')) {
                $chatData['room'] = $room;
            }
            if (Schema::hasColumn('chats', 'source')) {
                $chatData['source'] = 'web';
            }
            if (Schema::hasColumn('chats', 'badge')) {
                $chatData['badge'] = $badge;
            }

            $chat = Chat::create($chatData);

            if ($room === 'telegram') {
                try {
                    TelegramService::sendToTelegram($username, $message);
                } catch (\Throwable $e) {}
            }

            return response()->json([
                'success' => true,
                'id'      => $chat->id,
                'message' => [
                    'id'       => $chat->id,
                    'room'     => $room,
                    'userid'   => $chat->userid,
                    'username' => $chat->username,
                    'avatar'   => $chat->avatar,
                    'source'   => 'web',
                    'badge'    => $badge,
                    'message'  => e($chat->message),
                    'time'     => date('h:i A'),
                    'is_me'    => true,
                ],
            ]);
        } catch (\Throwable $e) {
            return response()->json(['success' => false, 'message' => $e->getMessage()]);
        }
    }

    /**
     * Webhook endpoint for Telegram Bot incoming group messages
     */
    public function telegramWebhook(Request $r)
    {
        try {
            $data = $r->all();
            $chat = TelegramService::processWebhookData($data);
            return response()->json(['ok' => true, 'chat_id' => $chat ? $chat->id : null]);
        } catch (\Throwable $e) {
            return response()->json(['ok' => false, 'error' => $e->getMessage()]);
        }
    }
}
