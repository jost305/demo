<?php

namespace App\Services;

use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Log;

class PusherBroadcaster
{
    /**
     * Broadcast a real-time chat message to all connected WebSocket clients via Pusher REST API.
     */
    public static function broadcastChat(array $messageData): bool
    {
        $appId   = env('PUSHER_APP_ID', '1553294');
        $key     = env('PUSHER_APP_KEY', '6cb294030245343b2cb7');
        $secret  = env('PUSHER_APP_SECRET', 'c31afda9a0bc52932b1e');
        $cluster = env('PUSHER_APP_CLUSTER', 'mt1');

        if (!$appId || !$key || !$secret) {
            return false;
        }

        try {
            $body = json_encode([
                'name'     => 'message-sent',
                'channels' => ['flyboy-chat'],
                'data'     => json_encode($messageData)
            ]);

            $path = "/apps/{$appId}/events";
            $time = time();
            $bodyMd5 = md5($body);

            $queryString = "auth_key={$key}&auth_timestamp={$time}&auth_version=1.0&body_md5={$bodyMd5}";
            $stringToSign = "POST\n{$path}\n{$queryString}";
            $signature = hash_hmac('sha256', $stringToSign, $secret);

            $url = "https://api-{$cluster}.pusher.com{$path}?{$queryString}&auth_signature={$signature}";

            $response = Http::withHeaders(['Content-Type' => 'application/json'])
                ->withBody($body, 'application/json')
                ->post($url);

            return $response->successful();
        } catch (\Throwable $e) {
            Log::error("Pusher Broadcast Error: " . $e->getMessage());
            return false;
        }
    }
}
