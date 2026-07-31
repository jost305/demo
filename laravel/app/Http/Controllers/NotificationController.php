<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Notification;
use Illuminate\Support\Facades\DB;

class NotificationController extends Controller
{
    /**
     * Get unread & recent notifications for the logged-in user.
     */
    public function unread(Request $r)
    {
        $userlogin = session()->get('userlogin');
        $userId = is_object($userlogin) ? $userlogin->id : (is_array($userlogin) ? ($userlogin['id'] ?? null) : null);

        if (!$userId) {
            return response()->json(['isSuccess' => false, 'notifications' => [], 'unread_count' => 0]);
        }

        $notifications = Notification::where('user_id', $userId)
            ->orderBy('id', 'desc')
            ->take(15)
            ->get();

        $unreadCount = Notification::where('user_id', $userId)
            ->whereNull('read_at')
            ->count();

        return response()->json([
            'isSuccess'     => true,
            'notifications' => $notifications,
            'unread_count'  => $unreadCount
        ]);
    }

    /**
     * Mark all or single notification as read.
     */
    public function markRead(Request $r)
    {
        $userlogin = session()->get('userlogin');
        $userId = is_object($userlogin) ? $userlogin->id : (is_array($userlogin) ? ($userlogin['id'] ?? null) : null);

        if (!$userId) {
            return response()->json(['isSuccess' => false]);
        }

        if ($r->id) {
            Notification::where('user_id', $userId)->where('id', $r->id)->update(['read_at' => now()]);
        } else {
            Notification::where('user_id', $userId)->whereNull('read_at')->update(['read_at' => now()]);
        }

        return response()->json(['isSuccess' => true]);
    }
}
