<?php

namespace App\Services;

use App\Models\Setting;
use App\Models\Transaction;
use App\Models\User;
use Illuminate\Support\Facades\DB;

class DailyLoginRewardService
{
    public function reward(User $user): void
    {
        $amount = (float) Setting::where('category', 'daily_login_reward')->value('value');

        if ($amount <= 0) {
            return;
        }

        $rewarded = false;

        DB::transaction(function () use ($user, $amount, &$rewarded) {
            $alreadyRewarded = Transaction::where('userid', $user->id)
                ->where('category', 'daily_login')
                ->whereDate('created_at', now()->toDateString())
                ->exists();

            if ($alreadyRewarded) {
                return;
            }

            addwallet($user->id, $amount);
            addtransaction(
                $user->id,
                'System',
                'daily-' . now()->format('Ymd') . '-' . $user->id,
                'credit',
                $amount,
                'daily_login',
                'Daily login reward',
                '1'
            );

            $rewarded = true;
        });

        if ($rewarded) {
            PlatformNotificationService::create(
                $user->id,
                'daily_login_reward',
                'Daily login reward',
                'You received ' . number_format($amount, 2) . ' for logging in today.',
                ['amount' => $amount]
            );
        }
    }
}
