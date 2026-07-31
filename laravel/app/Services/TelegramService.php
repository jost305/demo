<?php

namespace App\Services;

use App\Models\Chat;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Log;

class TelegramService
{
    /**
     * Send a web chat message to configured Telegram Group/Channel
     */
    public static function sendToTelegram($username, $text, $badge = '💻 Web')
    {
        $botToken = env('TELEGRAM_BOT_TOKEN') ?: setting('telegram_bot_token');
        $chatId   = env('TELEGRAM_CHAT_ID')   ?: setting('telegram_chat_id');

        if (!$botToken || !$chatId) {
            return false;
        }

        try {
            $formattedMsg = "<b>{$badge} {$username}</b>:\n{$text}";
            $response = Http::post("https://api.telegram.org/bot{$botToken}/sendMessage", [
                'chat_id'    => $chatId,
                'text'       => $formattedMsg,
                'parse_mode' => 'HTML',
            ]);

            return $response->successful();
        } catch (\Throwable $e) {
            Log::error("Telegram Send Error: " . $e->getMessage());
            return false;
        }
    }

    /**
     * Process incoming Webhook payload from Telegram Group Bot
     */
    public static function processWebhookData(array $data)
    {
        if (!isset($data['message']['text'])) {
            return null;
        }

        $msgText  = trim($data['message']['text']);
        $from     = $data['message']['from'] ?? [];
        $firstName = $from['first_name'] ?? ($from['username'] ?? 'Telegram Pilot');
        $username = $firstName;
        $avatar   = '/images/flyboy10x_icon.png';

        if (!$msgText) {
            return null;
        }

        // Filter / sanitize profanity
        $msgText = self::sanitizeText($msgText);

        // Store into chats table with source 'telegram' and room 'general'
        $chat = Chat::create([
            'room'     => 'general',
            'userid'   => null,
            'username' => $username,
            'avatar'   => $avatar,
            'source'   => 'telegram',
            'badge'    => '📱 Telegram',
            'message'  => $msgText,
        ]);

        // Broadcast to all Web App players via Pusher WebSocket
        try {
            PusherBroadcaster::broadcastChat([
                'id'       => $chat->id,
                'room'     => 'general',
                'userid'   => null,
                'username' => $chat->username,
                'avatar'   => $chat->avatar,
                'source'   => 'telegram',
                'badge'    => '📱 Telegram',
                'message'  => $chat->message,
                'time'     => now()->format('h:i A'),
                'is_me'    => false,
            ]);
        } catch (\Throwable $e) {}

        return $chat;
    }

    /**
     * Simple profanity and spam filter.
     */
    public static function sanitizeText(string $text): string
    {
        $text = mb_substr($text, 0, 300);
        $badWords = ['badword1', 'spamlink', 'scam', 'phishing'];
        foreach ($badWords as $bad) {
            $text = preg_replace('/\b' . preg_quote($bad, '/') . '\b/i', '***', $text);
        }
        return e(trim($text));
    }

    /**
     * Seed initial vibrant simulated Telegram group messages if empty
     */
    public static function seedSimulatedTelegramFeed()
    {
        $count = Chat::count();
        if ($count > 0) return;

        $simulated = [
            ['user' => 'Alex_Flyer', 'text' => 'Who is ready for the 100x multiplier round tonight? 🚀', 'badge' => '📱 Telegram', 'source' => 'telegram'],
            ['user' => 'CryptoKing', 'text' => 'Cashout at 2.50x every time = solid profit strategy! 💰', 'badge' => '👨‍✈️ Captain', 'source' => 'web'],
            ['user' => 'FlyBoy_Official', 'text' => 'Welcome to FlyBoy10x Live Community! All group chat activity is mirrored here.', 'badge' => '👑 Admin', 'source' => 'web'],
            ['user' => 'Grace_Aviator', 'text' => 'Just hit 15.4x multiplier! 🎯🔥', 'badge' => '📱 Telegram', 'source' => 'telegram'],
            ['user' => 'BetMaster_NG', 'text' => 'Nice one Grace! Cashout early or ride the rocket 🚀', 'badge' => '👨‍✈️ Pilot', 'source' => 'web'],
        ];

        foreach ($simulated as $sim) {
            Chat::create([
                'room'     => 'general',
                'userid'   => null,
                'username' => $sim['user'],
                'avatar'   => '/images/flyboy10x_icon.png',
                'source'   => $sim['source'],
                'badge'    => $sim['badge'],
                'message'  => $sim['text'],
            ]);
        }
    }
}
