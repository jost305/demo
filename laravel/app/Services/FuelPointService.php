<?php

namespace App\Services;

use App\Models\User;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;

class FuelPointService
{
    /**
     * Award 10 FuelPoints for Daily Login Streak.
     */
    public static function awardDailyLogin(int $userId): bool
    {
        try {
            $user = User::find($userId);
            if (!$user) return false;

            $today = now()->toDateString();

            // Already awarded today?
            if ($user->last_login_streak_date === $today) {
                return false;
            }

            DB::transaction(function () use ($user, $today) {
                $user->fuel_points = intval($user->fuel_points) + 10;
                $user->last_login_streak_date = $today;
                $user->save();

                DB::table('fuel_point_logs')->insert([
                    'userid'      => $user->id,
                    'points'      => 10,
                    'type'        => 'daily_login',
                    'description' => 'Daily login streak reward (+10 FP)',
                    'created_at'  => now(),
                    'updated_at'  => now(),
                ]);
            });

            try {
                PlatformNotificationService::create(
                    $user->id,
                    'fuel_points',
                    'Daily Streak Reward! ⚡',
                    'You earned +10 FuelPoints (FP) for logging in today. Total FP: ' . ($user->fuel_points + 10),
                    ['points' => 10, 'total_fp' => $user->fuel_points + 10]
                );
            } catch (\Throwable $te) {}

            return true;
        } catch (\Throwable $e) {
            Log::error('FuelPointService awardDailyLogin error: ' . $e->getMessage());
            return false;
        }
    }

    /**
     * Award 20 FuelPoints for Referral.
     */
    public static function awardReferral(int $referrerId, int $referredUserId): bool
    {
        try {
            $referrer = User::find($referrerId);
            if (!$referrer) return false;

            DB::transaction(function () use ($referrer, $referredUserId) {
                $referrer->fuel_points = intval($referrer->fuel_points) + 20;
                $referrer->save();

                DB::table('fuel_point_logs')->insert([
                    'userid'      => $referrer->id,
                    'points'      => 20,
                    'type'        => 'referral',
                    'description' => 'Referral bonus (+20 FP)',
                    'created_at'  => now(),
                    'updated_at'  => now(),
                ]);
            });

            try {
                PlatformNotificationService::create(
                    $referrer->id,
                    'fuel_points',
                    'Referral Reward! ⚡',
                    'You earned +20 FuelPoints (FP) for inviting a new player!',
                    ['points' => 20, 'referred_user_id' => $referredUserId]
                );
            } catch (\Throwable $te) {}

            return true;
        } catch (\Throwable $e) {
            Log::error('FuelPointService awardReferral error: ' . $e->getMessage());
            return false;
        }
    }

    /**
     * Award 10 FuelPoints for a successful Deposit.
     */
    public static function awardDeposit(int $userId, float $amount): bool
    {
        try {
            $user = User::find($userId);
            if (!$user) return false;

            DB::transaction(function () use ($user, $amount) {
                $user->fuel_points = intval($user->fuel_points) + 10;
                $user->save();

                DB::table('fuel_point_logs')->insert([
                    'userid'      => $user->id,
                    'points'      => 10,
                    'type'        => 'deposit',
                    'description' => 'Deposit reward for ₦' . number_format($amount, 2) . ' (+10 FP)',
                    'created_at'  => now(),
                    'updated_at'  => now(),
                ]);
            });

            try {
                PlatformNotificationService::create(
                    $user->id,
                    'fuel_points',
                    'Deposit Bonus! ⚡',
                    'You earned +10 FuelPoints (FP) for your ₦' . number_format($amount, 2) . ' deposit!',
                    ['points' => 10, 'amount' => $amount]
                );
            } catch (\Throwable $te) {}

            return true;
        } catch (\Throwable $e) {
            Log::error('FuelPointService awardDeposit error: ' . $e->getMessage());
            return false;
        }
    }

    /**
     * Award 20 FuelPoints for a Winning Bet.
     */
    public static function awardWinningBet(int $userId, float $winAmount): bool
    {
        try {
            $user = User::find($userId);
            if (!$user) return false;

            DB::transaction(function () use ($user, $winAmount) {
                $user->fuel_points = intval($user->fuel_points) + 20;
                $user->save();

                DB::table('fuel_point_logs')->insert([
                    'userid'      => $user->id,
                    'points'      => 20,
                    'type'        => 'winning_bet',
                    'description' => 'Winning bet reward (+20 FP)',
                    'created_at'  => now(),
                    'updated_at'  => now(),
                ]);
            });

            try {
                PlatformNotificationService::create(
                    $user->id,
                    'fuel_points',
                    'Victory Reward! ⚡',
                    'You earned +20 FuelPoints (FP) for winning your bet!',
                    ['points' => 20, 'win_amount' => $winAmount]
                );
            } catch (\Throwable $te) {}

            return true;
        } catch (\Throwable $e) {
            Log::error('FuelPointService awardWinningBet error: ' . $e->getMessage());
            return false;
        }
    }
}
