<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Chat;
use App\Models\User;
use App\Services\TelegramService;
use App\Services\PusherBroadcaster;
use Illuminate\Support\Facades\Schema;
use Illuminate\Support\Facades\DB;

class ChatController extends Controller
{
    /**
     * AJAX: fetch latest chat messages for chatroom (General / Telegram unified)
     */
    public function index(Request $r)
    {
        if (function_exists('opcache_reset')) {
            @opcache_reset();
        }
        $room    = $r->get('room', 'general');
        $last_id = intval($r->get('last_id', 0));

        $userlogin = session()->get('userlogin');
        $myUserId = is_object($userlogin) ? $userlogin->id : (is_array($userlogin) ? ($userlogin['id'] ?? null) : null);

        try {
            // Seed simulated feed if empty
            try {
                TelegramService::seedSimulatedTelegramFeed();
            } catch (\Throwable $se) {}

            $query = Chat::orderBy('id', 'desc');

            if ($last_id > 0) {
                $query->where('id', '>', $last_id);
            }

            $messages = $query->take(50)->get()
                ->reverse()
                ->values()
                ->map(function ($msg) use ($myUserId) {
                    $isMe = ($myUserId && $msg->userid == $myUserId);

                    $timeStr = '';
                    if ($msg->created_at) {
                        $timeStr = is_string($msg->created_at) ? date('h:i A', strtotime($msg->created_at)) : $msg->created_at->format('h:i A');
                    }

                    return [
                        'id'       => $msg->id,
                        'room'     => $msg->room ?? 'general',
                        'userid'   => $msg->userid,
                        'username' => $msg->username ?? 'Pilot',
                        'avatar'   => $msg->avatar ?: '/images/flyboy10x_icon.png',
                        'source'   => $msg->source ?? 'web',
                        'badge'    => $msg->badge ?: ($msg->source === 'telegram' ? '📱 Telegram' : '💻 Web'),
                        'message'  => e($msg->message),
                        'time'     => $timeStr,
                        'is_me'    => $isMe,
                    ];
                });

            return response()->json([
                'messages' => $messages,
                'last_id'  => $messages->count() > 0 ? $messages->last()['id'] : $last_id,
                'online_count' => rand(42, 88)
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
     * AJAX: post a new message to the chatroom (Two-way synced to Telegram + Pusher)
     */
    public function store(Request $r)
    {
        $r->validate([
            'message' => 'required|string|max:300',
            'room'    => 'nullable|string|max:50',
        ]);

        $rawMessage = trim($r->message);
        if (!$rawMessage) {
            return response()->json(['success' => false, 'message' => 'Empty message']);
        }

        // Sanitize profanity / spam
        $message = TelegramService::sanitizeText($rawMessage);

        $userid   = null;
        $username = 'Guest_' . rand(100, 999);
        $avatar   = user('image') ?: '/images/flyboy10x_icon.png';
        $badge    = '💻 Web';

        $userlogin = session()->get('userlogin');
        if ($userlogin) {
            $uId = is_object($userlogin) ? $userlogin->id : ($userlogin['id'] ?? null);
            if ($uId) {
                $user = User::find($uId);
                if ($user) {
                    $userid   = $user->id;
                    $username = $user->name ?: ($user->email ? explode('@', $user->email)[0] : 'Pilot #' . $user->id);
                    $avatar   = $user->image ?: '/images/flyboy10x_icon.png';
                    
                    if ($user->isadmin == 1) {
                        $badge = '👑 Admin';
                    } elseif ($user->fuel_points >= 50) {
                        $badge = '👨‍✈️ Captain';
                    } else {
                        $badge = '👨‍✈️ Pilot';
                    }
                }
            }
        }

        try {
            $chat = Chat::create([
                'room'     => 'general',
                'userid'   => $userid,
                'username' => $username,
                'avatar'   => $avatar,
                'source'   => 'web',
                'badge'    => $badge,
                'message'  => $message,
            ]);

            $payload = [
                'id'       => $chat->id,
                'room'     => 'general',
                'userid'   => $chat->userid,
                'username' => $chat->username,
                'avatar'   => $chat->avatar,
                'source'   => 'web',
                'badge'    => $badge,
                'message'  => $chat->message,
                'time'     => date('h:i A'),
                'is_me'    => false,
            ];

            // 1. Send to Telegram Group via Telegram Bot API
            try {
                TelegramService::sendToTelegram($username, $message, $badge);
            } catch (\Throwable $te) {}

            // 2. Broadcast to all Web App players via Pusher WebSocket
            try {
                PusherBroadcaster::broadcastChat($payload);
            } catch (\Throwable $pe) {}

            $payload['is_me'] = true;

            return response()->json([
                'success' => true,
                'id'      => $chat->id,
                'message' => $payload,
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

    /**
     * Admin: delete a chat message
     */
    public function deleteMsg($id)
    {
        $userlogin = session()->get('userlogin');
        $isAdmin = is_object($userlogin) ? ($userlogin->isadmin == 1) : (is_array($userlogin) && ($userlogin['isadmin'] ?? 0) == 1);

        if (!$isAdmin) {
            return response()->json(['success' => false, 'message' => 'Unauthorized']);
        }

        Chat::where('id', $id)->delete();
        return response()->json(['success' => true]);
    }
}
