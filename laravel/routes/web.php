<?php

use App\Http\Controllers\Admin;
use App\Http\Controllers\Authentication;
use App\Http\Controllers\Gamesetting;
use App\Http\Controllers\Pages;
use App\Http\Controllers\NotificationController;
use App\Http\Controllers\Userdetail;
use App\Http\Controllers\Adminapi;
use App\Http\Controllers\ChatController;
use Illuminate\Support\Facades\Route;

/*
|--------------------------------------------------------------------------
| Web Routes
|--------------------------------------------------------------------------
|
| Here is where you can register web routes for your application. These
| routes are loaded by the RouteServiceProvider within a group which
| contains the "web" middleware group. Now create something great!
|
 */
Route::get('/storagelink', function () {
	$target = '/home/u558340823/domains/thixpro.in/public_html/aviator/laravel/storage/app/public/';
   $shortcut = '/home/u558340823/domains/thixpro.in/public_html/aviator/storage/';
   symlink($target, $shortcut);
    dd('storage link successfully');
});
Route::get('/clear', function () {
    Artisan::call('cache:clear');
    Artisan::call('config:cache');
    Artisan::call('route:clear');
    Artisan::call('optimize');
    dd('Cache cleared successfully');
});
Route::get('/', function () {
    return redirect('/crash');
});
Route::get('/dashboard', function () {
    return redirect('/crash');
});

// Public crash page - accessible to all (guests + logged in users)
Route::get('/crash', [Pages::class, 'aviator']);

// Chat - public read, authenticated write, Telegram 2-way sync
Route::get('/chat', [ChatController::class, 'index']);
Route::get('/chat/messages', [ChatController::class, 'index']);
Route::post('/chat/send', [ChatController::class, 'store']);
Route::post('/chat/delete/{id}', [ChatController::class, 'deleteMsg']);
Route::post('/telegram/webhook', [ChatController::class, 'telegramWebhook']);
Route::match(['get', 'post'], '/currentlybet', [Gamesetting::class, "currentlybet"]);
Route::match(['get', 'post'], '/game/currentlybet', [Gamesetting::class, "currentlybet"]);

Route::get('/register', function () {
    return redirect('/crash?auth=register');
});
Route::get('/login', function () {
    return redirect('/crash?auth=login');
});

// Notifications API
Route::get('/notifications/unread', [\App\Http\Controllers\NotificationController::class, 'unread']);
Route::post('/notifications/mark-read', [\App\Http\Controllers\NotificationController::class, 'markRead']);
Route::get('/notifications/vapid-public-key', [\App\Http\Controllers\NotificationController::class, 'vapidPublicKey']);
// Auth Login
Route::post('/auth/login', [Authentication::class, "login"]);
Route::post('/auth/register', [Authentication::class, "register"]);
Route::get('/is_login', [Userdetail::class, "is_login"]);
Route::get('/game-cron', [Gamesetting::class, "cronjob"]);
// Auth Admin Login
Route::post('/auth/admin/login', [Authentication::class, "adminlogin"]);

// Admin Login
Route::get('/admin', [Admin::class, "login"]);
Route::group(['prefix' => 'admin/', 'middleware' => ['isAdmin']], function () {
    Route::get('/dashboard', [Admin::class, "dashboard"]);
    Route::get('/user-list', [Admin::class, "userlist"]);
    Route::get('/change-password', [Admin::class, "chagepassword"]);
    Route::get('/user/edit/{id}', [Admin::class, "useredit"]);
    Route::get('/recharge-history', [Admin::class, "rechargehistory"]);
    Route::get('/withdrawal-history', [Admin::class, "withdrawalhistory"]);
    Route::get('/amount-setup/{id?}', [Admin::class, "amountsetup"]);
    Route::get('/bank-detail', [Admin::class, "bankdetail"]);
    
    Route::group(['prefix' => 'api/'], function () {
        Route::post('/changepassword', [Adminapi::class, "changepassword"]);
        Route::post('/edituser', [Adminapi::class, "edituser"]);
        Route::post('/recharge/{event}', [Adminapi::class, "rechargeapproval"]);
        Route::post('/withdraw/{event}', [Adminapi::class, "withdrawalapproval"]);
        Route::post('/user/delete', [Adminapi::class, "userdelete"]);
        Route::post('/editamountsetup', [Adminapi::class, "editamountsetup"]);
        Route::post('/bankdetail', [Adminapi::class, "editbankdetail"]);
        Route::post('/updatewallet', [Adminapi::class, "updatewallet"]);
    });

    Route::get('/logout', [Admin::class, "logout"]);
});

Route::group(['middleware' => ['isUser']], function () {

    Route::get('/profile', [Userdetail::class, "profile"]);
    Route::get('/deposit', [Pages::class, 'deposit']);
    Route::get('/amount-transfer', [Pages::class, "amount_transfer"]);
    Route::get('/withdraw', function () {
        return view('withdraw');
    });
    Route::get('/referal', function () {
        return view('refferal');
    });
    Route::get('/level-management', [Pages::class,'level_management']);

    Route::get('/deposit_withdrawals', [Userdetail::class, "deposit_withdrawal"]);
    Route::get('/mybets', [Userdetail::class, "mybets"]);
    Route::get('/leaderboard', [Pages::class, "leaderboard"]);
    Route::get('/logout', function () {
        if (session()->has('userlogin')) {
            session()->forget('userlogin');
        }
        return redirect('/');
    });
    //Api
    Route::get('/get_user_details', [Userdetail::class, "get_user_detail"]);
    Route::get('/notifications', [NotificationController::class, 'index']);
    Route::post('/notifications/{id}/read', [NotificationController::class, 'read']);
    Route::post('/notifications/read-all', [NotificationController::class, 'readAll']);
    // Api Lists App Createion

    //Data api
    Route::post('/user/withdrawal_list', [Userdetail::class, "withdrawal_list"]);
    Route::post('/game/existence', [Gamesetting::class, "game_existence"]);
    Route::post('/game/crash_plane', [Gamesetting::class, "crash_plane"]);
    Route::post('/game/new_game_generated', [Gamesetting::class, "new_game_generated"]);
    Route::post('/game/increamentor', [Gamesetting::class, "increamentor"]);
    Route::post('/game/game_over', [Gamesetting::class, "game_over"]);
    Route::post('/game/add_bet', [Gamesetting::class, "betNow"]);
	Route::get('/cash_out', [Gamesetting::class, "cashout"]);
    Route::post('/game/my_bets_history', [Gamesetting::class, "my_bets_history"]);
    Route::get('/payment_gateway_details', [Adminapi::class, "payment_gateway"]);
    Route::post('/insert/withdrawal', [Adminapi::class, "withdrawal_query"]);
    Route::post('/depositNow', [Adminapi::class, "depositNow"]);
    Route::post('/wallet_transfer', [Userdetail::class, "wallet_transfer"]);

    // Flutterwave Payment Routes
    Route::post('/payment/flutterwave/initialize', [\App\Http\Controllers\FlutterwaveController::class, 'initialize']);
});

Route::get('/payment/flutterwave/callback', [\App\Http\Controllers\FlutterwaveController::class, 'callback']);
Route::post('/payment/flutterwave/webhook', [\App\Http\Controllers\FlutterwaveController::class, 'webhook']);
Route::post('/payment/flutterwave/verify', [\App\Http\Controllers\FlutterwaveController::class, 'verify']);


Route::match(['get', 'post'], '/currentlybet', [Gamesetting::class, "currentlybet"]);
Route::match(['get', 'post'], '/game/currentlybet', [Gamesetting::class, "currentlybet"]);

