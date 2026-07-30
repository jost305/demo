<?php

namespace App\Http\Controllers;

use App\Models\User;
use App\Models\Wallet;
use App\Services\DailyLoginRewardService;
use App\Services\PlatformNotificationService;
use Hash;
use Illuminate\Http\Request;

class Authentication extends Controller
{
    public function login(Request $r)
    {
        $validated = $r->validate([
            'username' => 'required',
            'password' => 'required',
        ]);
        $data = "";
        $isSuccess = false;
        $message = "";
        $usernameexist = User::where('mobile', $r->username)->orWhere('email', $r->username)->first();
        if ($usernameexist) {
            if (Hash::check($r->password, $usernameexist->password)) {
                $r->session()->put('userlogin', $usernameexist);
                app(DailyLoginRewardService::class)->reward($usernameexist);
                $message = "Login successful!";
                $isSuccess = true;
            } else {
                $message = "Incorrect Password!";
            }
        } else {
            $message = "Account not found with this email/phone!";
        }
        $res = array("data" => $data, "isSuccess" => $isSuccess, "message" => $message);
        return response()->json($res);
    }

    public function register(Request $r)
    {
        $validated = $r->validate([
            'name' => 'required',
            'gender' => 'required',
            'email' => 'required',
            'password' => 'required'
        ]);
        
        $data = "";
        $isSuccess = false;
        $message = "Something went wrong!";

        // Generate unique mobile if default or dummy
        $mobile = ($r->mobile && $r->mobile !== '0000000000') ? $r->mobile : '080' . rand(10000000, 99999999);

        // Check duplicate email
        $olddata = User::where('email', $r->email)->first();
        if ($olddata) {
            $message = "This email is already registered. Please sign in.";
            return response()->json([
                "data" => array("is_email_exist" => 1, "email" => $r->email),
                "isSuccess" => false,
                "message" => $message
            ]);
        }

        if ($r->promocode != '') {
            $existpromocode = User::where('id', $r->promocode)->first();
            if (!$existpromocode) {
                return response()->json([
                    "data" => array(),
                    "isSuccess" => false,
                    "message" => "Invalid Promocode"
                ]);
            }
        }

        $user = new User;
        $user->name = $r->name ?: 'Player';
        $user->image = "/images/avtar/av-" . rand(1, 72) . ".png";
        $user->mobile = $mobile;
        $user->email = $r->email;
        $user->password = Hash::make($r->password);
        $user->currency = '₦';
        $user->gender = $r->gender ?: 'male';
        $user->country = 'NG';
        $user->status = '1';
        $user->promocode = $r->promocode;

        if ($user->save()) {
            $wallet = new Wallet;
            $wallet->userid = $user->id;
            $wallet->amount = setting('initial_bonus') ?: 500;
            $wallet->save();

            PlatformNotificationService::create(
                $user->id,
                'welcome',
                'Welcome to FlyBoy',
                'Your account is ready. Log in to start playing.',
                ['user_id' => $user->id]
            );

            // Log user in immediately upon registration
            $r->session()->put('userlogin', $user);
            app(DailyLoginRewardService::class)->reward($user);

            $data = array("username" => $user->email, "password" => $r->password, "token" => csrf_token());
            $isSuccess = true;
            $message = "Registration successful!";
        }

        return response()->json(["data" => $data, "isSuccess" => $isSuccess, "message" => $message]);
    }

    public function adminlogin(Request $r)
    {
        $validated = $r->validate([
            'username' => 'required',
            'password' => 'required',
        ]);
        $response = array('status' => 0, 'title' => "Oops!!", 'message' => "Invalid Credential!");
        $usernameexist = User::where('mobile', $r->username)->orWhere('email', $r->username)->where('isadmin', '1')->first();
        if ($usernameexist) {
            if (Hash::check($r->password, $usernameexist->password)) {
                $r->session()->put('adminlogin', $usernameexist);
                $response = array('status' => 1, 'title' => "Success!!", 'message' => "Login Successfully!");
            } else {
                $response = array('status' => 0, 'title' => "Oops!!", 'message' => "Incorrect Password!");
            }
        } else {
            $response = array('status' => 0, 'title' => "Oops!!", 'message' => "Username not exists!");
        }
        return response()->json($response);
    }
}
