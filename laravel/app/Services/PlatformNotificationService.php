<?php

namespace App\Services;

use App\Models\Notification;

class PlatformNotificationService
{
    public static function create($userId, string $type, string $title, string $message, array $data = [])
    {
        return Notification::create([
            'user_id' => $userId,
            'type' => $type,
            'title' => $title,
            'message' => $message,
            'data' => $data ?: null,
        ]);
    }
}
