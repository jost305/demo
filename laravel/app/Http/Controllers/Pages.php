<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Gameresult;
use App\Models\Userbit;
use App\Models\User;
use App\Models\Bank_detail;
use Carbon\Carbon;

class Pages extends Controller
{
    public function aviator() {
        $userSession = session()->get('userlogin');
        $userId = is_object($userSession) ? $userSession->id : (is_array($userSession) ? ($userSession['id'] ?? null) : null);
        $user = $userId ? User::find($userId) : null;
        $wallet = $userId ? wallet($userId) : 0;
        $mybets = $userId ? Userbit::where("userid", (string)$userId)->where('status', 1)->orderBy('id', 'desc')->get() : collect();
        $allresults = Gameresult::orderBy('id', 'desc')->take(10)->get();
        
        $page = [
            'user' => $user ? [
                'id' => $user->id,
                'name' => $user->name,
                'email' => $user->email,
                'image' => $user->image
            ] : null,
            'wallet' => $wallet
        ];
        
        return view('app', compact('page'));

    }

    public function deposit() {
        $bank = Bank_detail::where('userid', user('id'))->first();
        if (!$bank) {
            $bank = array();
        }
        return view('deposite', compact('bank'));
    }

    public function amount_transfer()
    {
        $specificdata = null;
        $title = 'Amount Transfer';
        return view('amount_transfer', [
            'title' => $title,
        ]);
    }

    public function leaderboard() {
        $userSession = session()->get('userlogin');
        $userId = is_object($userSession) ? $userSession->id : (is_array($userSession) ? ($userSession['id'] ?? null) : null);
        $user = $userId ? User::find($userId) : null;
        $wallet = $userId ? wallet($userId) : 0;
        
        $page = [
            'user' => $user ? [
                'id' => $user->id,
                'name' => $user->name,
                'email' => $user->email,
                'image' => $user->image
            ] : null,
            'wallet' => $wallet,
            'view' => 'leaderboard'
        ];

        return view('app', compact('page'));
    }


    public function level_management() {
        $mypromocode = user('id');
        $level1users = User::where('promocode',$mypromocode)->get();
        $users = count($level1users);
        $level1 = $level1users;
        $level2 = array();
        $level3 = array();
        foreach ($level1users as $key2) {
            $level2users = User::where('promocode',$key2->id)->get();
            $users += count($level2users);
            if (count($level2users) > 0) {
                array_push($level2,$level2users);
            }
            foreach ($level2users as $key3) {
                $level3users = User::where('promocode',$key3->id)->get();
                $users += count($level3users);
                array_push($level3,$level3users);
            }
        }
        return view('level_management',compact('users','level1','level2','level3'));
    }
}
