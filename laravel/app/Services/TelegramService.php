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
    public static function sendToTelegram($username, $text)
    {
        $botToken = env('TELEGRAM_BOT_TOKEN') ?: setting('telegram_bot_token');
        $chatId   = env('TELEGRAM_CHAT_ID')   ?: setting('telegram_chat_id');

        if (!$botToken || !$chatId) {
            return false;
        }

        try {
            $formattedMsg = "<b>{$username}</b> (via FlyBoy Web):\n{$text}";
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
        $firstName = $from['first_name'] ?? ($from['username'] ?? 'Telegram User');
        $username = $firstName . ' ✈️';
        $userId   = $from['id'] ?? null;
        $avatar   = '/images/avtar/av-' . (abs(crc32($username)) % 72 + 1) . '.png';

        if (!$msgText) {
            return null;
        }

        // Store into chats table with source 'telegram' and room 'telegram'
        return Chat::create([
            'room'     => 'telegram',
            'userid'   => null,
            'username' => $username,
            'avatar'   => $avatar,
            'source'   => 'telegram',
            'badge'    => 'Telegram',
            'message'  => $msgText,
        ]);
    }

    /**
     * Seed initial vibrant simulated Telegram group messages if empty
     */
    public static function seedSimulatedTelegramFeed()
    {
        $count = Chat::where('room', 'telegram')->count();
        if ($count > 0) return;

        $simulated = [
            ['user' => 'Alex_Flyer ✈️', 'text' => 'Who is ready for the 100x multiplier round tonight? 🚀', 'badge' => 'Telegram'],
            ['user' => 'CryptoKing ✈️', 'text' => 'Cashout at 2.50x every time = solid profit strategy! 💰', 'badge' => 'VIP'],
            ['user' => 'FlyBoy_Official ✈️', 'text' => 'Welcome to the official FlyBoy Telegram Sync channel! All group chat activity is mirrored here.', 'badge' => 'Admin'],
            ['user' => 'Grace_Aviator ✈️', 'text' => 'Just hit 15.4x multiplier! 🎯🔥', 'badge' => 'Telegram'],
            ['user' => 'BetMaster_NG ✈️', 'text' => 'Nice one Grace! Cashout early or ride the rocket 🚀', 'badge' => 'Telegram'],
        ];

        foreach ($simulated as $sim) {
            Chat::create([
                'room'     => 'telegram',
                'userid'   => null,
                'username' => $sim['user'],
                'avatar'   => '/images/avtar/av-' . rand(1, 72) . '.png',
                'source'   => 'telegram',
                'badge'    => $sim['badge'],
                'message'  => $sim['text'],
            ]);
        }
    }
}
