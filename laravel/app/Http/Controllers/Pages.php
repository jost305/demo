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
        $allresults = Gameresult::where('created_at', '>=', Carbon::today()->toDateString())->orderBy('id','desc')->get();
        $mybets = collect();
        if (session()->has('userlogin')) {
            $mybets = Userbit::where('userid', user('id'))->where('created_at', '>=', Carbon::today()->toDateString())->orderBy('id','desc')->get();
        }
        return view('crash', compact("allresults", "mybets"));
    }

    public function deposit() {
        $bank = Bank_detail::where('userid',user('id'))->first();
        if (!$bank) {
            $bank = array();
        }
        return view('deposite',compact('bank'));
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
        // Use leftJoin so bots/dummy users without a real DB user row don't break the query
        $topbets = Userbit::where('userbits.cashout_multiplier', '>', 1)
            ->where('userbits.status', 1)
            ->leftJoin('users', 'users.id', '=', 'userbits.userid')
            ->select(
                'userbits.id',
                'userbits.userid',
                'userbits.amount',
                'userbits.cashout_multiplier',
                'userbits.created_at',
                'users.name',
                'users.image'
            )
            ->orderBy('userbits.cashout_multiplier', 'desc')
            ->take(50)
            ->get()
            ->map(function($item) {
                // Mask the userid: show only first 2 + stars + last 2 digits
                $uid = (string) $item->userid;
                if (strlen($uid) > 4) {
                    $item->display_id = substr($uid, 0, 2) . str_repeat('*', strlen($uid) - 4) . substr($uid, -2);
                } else {
                    $item->display_id = $uid;
                }
                // Fallback avatar if no image stored
                if (empty($item->image)) {
                    $item->image = '/images/avtar/av-' . (($item->id % 72) + 1) . '.png';
                }
                return $item;
            });

        $simulated = collect();
        if ($topbets->count() < 10) {
            for ($i = 1; $i <= 30; $i++) {
                $uid = rand(10000, 99999);
                $simulated->push((object)[
                    'id' => $i,
                    'userid' => $uid,
                    'display_id' => substr((string)$uid, 0, 2) . '***' . substr((string)$uid, -2),
                    'name' => null,
                    'image' => '/images/avtar/av-' . rand(1, 72) . '.png',
                    'amount' => rand(500, 25000),
                    'cashout_multiplier' => number_format(rand(200, 50000) / 100, 2),
                    'created_at' => now()->subMinutes(rand(1, 1440))
                ]);
            }
            $simulated = $simulated->sortByDesc('cashout_multiplier')->values();
        }

        return view('leaderboard', compact('topbets', 'simulated'));
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
