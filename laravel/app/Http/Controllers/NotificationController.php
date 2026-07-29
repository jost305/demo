<?php

namespace App\Http\Controllers;

use App\Models\Notification;
use Illuminate\Http\Request;

class NotificationController extends Controller
{
    public function index(Request $request)
    {
        $limit = min(max((int) $request->input('limit', 20), 1), 50);
        $userId = user('id');

        $notifications = Notification::where('user_id', $userId)
            ->latest()
            ->limit($limit)
            ->get()
            ->map(function (Notification $notification) {
                return [
                    'id' => $notification->id,
                    'type' => $notification->type,
                    'title' => $notification->title,
                    'message' => $notification->message,
                    'data' => $notification->data ?: [],
                    'read' => $notification->read_at !== null,
                    'created_at' => optional($notification->created_at)->toIso8601String(),
                ];
            });

        return response()->json([
            'isSuccess' => true,
            'data' => $notifications,
            'unread_count' => Notification::where('user_id', $userId)
                ->whereNull('read_at')
                ->count(),
        ]);
    }

    public function read($id)
    {
        Notification::where('id', $id)
            ->where('user_id', user('id'))
            ->whereNull('read_at')
            ->update(['read_at' => now()]);

        return response()->json(['isSuccess' => true]);
    }

    public function readAll()
    {
        Notification::where('user_id', user('id'))
            ->whereNull('read_at')
            ->update(['read_at' => now()]);

        return response()->json(['isSuccess' => true]);
    }
}
