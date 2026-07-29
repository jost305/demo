<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Chat;

class ChatController extends Controller
{
    /**
     * Mobile /chat page
     */
    public function index()
    {
        $messages = Chat::orderBy('id', 'desc')->take(50)->get()->reverse()->values();
        return view('chat', compact('messages'));
    }

    /**
     * AJAX: get latest messages (polling)
     * ?last_id=X returns only messages with id > X
     */
    public function messages(Request $r)
    {
        $last_id = intval($r->get('last_id', 0));
        $messages = Chat::where('id', '>', $last_id)
            ->orderBy('id', 'asc')
            ->take(30)
            ->get()
            ->map(function ($msg) {
                return [
                    'id'       => $msg->id,
                    'userid'   => $msg->userid,
                    'username' => $msg->username ?? 'Guest',
                    'avatar'   => $msg->avatar ?? '/images/avtar/av-1.png',
                    'message'  => e($msg->message),
                    'time'     => $msg->created_at->format('h:i A'),
                    'is_me'    => (session()->has('userlogin') && session('userlogin')['id'] == $msg->userid),
                ];
            });

        return response()->json([
            'messages' => $messages,
            'last_id'  => $messages->count() > 0 ? $messages->last()['id'] : $last_id,
        ]);
    }

    /**
     * AJAX: post a new message
     */
    public function store(Request $r)
    {
        $r->validate(['message' => 'required|string|max:300']);

        $message = trim($r->message);
        if (!$message) {
            return response()->json(['success' => false]);
        }

        $userid   = null;
        $username = 'Guest';
        $avatar   = '/images/avtar/av-' . rand(1, 72) . '.png';

        if (session()->has('userlogin')) {
            $user     = session('userlogin');
            $userid   = $user['id'];
            $username = $user['name'] ?? ('Player #' . $user['id']);
            $avatar   = $user['image'] ?? $avatar;
        }

        $chat = Chat::create([
            'userid'   => $userid,
            'username' => $username,
            'avatar'   => $avatar,
            'message'  => $message,
        ]);

        return response()->json([
            'success' => true,
            'id'      => $chat->id,
            'message' => [
                'id'       => $chat->id,
                'userid'   => $chat->userid,
                'username' => $chat->username,
                'avatar'   => $chat->avatar,
                'message'  => e($chat->message),
                'time'     => $chat->created_at->format('h:i A'),
                'is_me'    => true,
            ],
        ]);
    }
}
