<?php

namespace App\Http\Controllers;

use App\Models\Bankdetail;
use App\Models\Bank_detail;
use App\Models\Setting;
use App\Models\Transaction;
use App\Models\User;
use App\Models\Wallet;
use App\Services\PlatformNotificationService;
use Hash;
use Illuminate\Http\Request;

class Adminapi extends Controller
{
    public function changepassword(Request $r)
    {
        $response = array('status' => 0, 'title' => "Oops!!", 'message' => "Invalid Credential!");
        $validated = $r->validate([
            'userid' => 'required',
            'newpassword' => 'required',
            'renewpassword' => 'required',
        ]);
        if ($r->newpassword == $r->renewpassword) {
            User::where('id', $r->userid)->where('isadmin', '1')->update([
                "password" => Hash::make($r->newpassword),
            ]);
            $response = array('status' => 1, 'title' => "Success!!", 'message' => "Password successfully updated!");
        } else {
            $response = array('status' => 0, 'title' => "Oops!!", 'message' => "Password not match!");
        }
        return response()->json($response);
    }
    public function edituser(Request $r)
    {
        $response = array('status' => 0, 'title' => "Oops!!", 'message' => "Invalid Credential!");
        $validated = $r->validate([
            'userid' => 'required',
            'newpassword' => 'required',
            'renewpassword' => 'required',
        ]);
        if ($r->newpassword == $r->renewpassword) {
            User::where('id', $r->userid)->where('isadmin', '1')->update([
                "password" => Hash::make($r->newpassword),
            ]);
            $response = array('status' => 1, 'title' => "Success!!", 'message' => "Password successfully updated!");
        } else {
            $response = array('status' => 0, 'title' => "Oops!!", 'message' => "Password not match!");
        }
        return response()->json($response);
    }
    public function rechargeapproval($event, Request $r)
    {
        $response = array('status' => 0, 'title' => "Oops!!", 'message' => "Invalid Action!");
        $id = $r->id;
        $userid = $r->userid;
        $transaction = Transaction::where('id', $id)
            ->where('userid', $userid)
            ->where('category', 'recharge')
            ->first();

        if (!$transaction || $transaction->status !== '0') {
            return response()->json([
                'status' => 0,
                'title' => 'Already processed',
                'message' => 'This recharge request is no longer pending.',
            ]);
        }

        $amount = (float) $transaction->amount;
        $customer = User::find($userid);

        if ($event == 'success') {
            $hasPriorRecharge = Transaction::where('userid', $userid)
                ->where('category', 'recharge')
                ->where('status', '1')
                ->where('id', '!=', $id)
                ->exists();

            if (!$hasPriorRecharge && $customer) {
                $referrer = $customer->promocode ? User::find($customer->promocode) : null;

                for ($level = 1; $level <= 3 && $referrer; $level++) {
                    $rate = (float) Setting::where('category', 'level' . $level . 'commission')->value('value');
                    $reward = round($amount * $rate / 100, 2);

                    if ($reward > 0) {
                        addwallet($referrer->id, $reward);
                        addtransaction(
                            $referrer->id,
                            'Level',
                            date("ydmhsi"),
                            'credit',
                            $reward,
                            'Level_bonus',
                            'Success',
                            '1'
                        );
                        PlatformNotificationService::create(
                            $referrer->id,
                            'referral_reward',
                            'Referral reward received',
                            'You received ' . number_format($reward, 2) . ' from a level ' . $level . ' referral reward.',
                            ['amount' => $reward, 'level' => $level, 'referred_user_id' => $userid]
                        );
                    }

                    $referrer = $referrer->promocode ? User::find($referrer->promocode) : null;
                }
            }

            Transaction::where('id', $id)->update([
                "remark" => 'Success',
                "status" => '1',
            ]);
            addwallet($userid, $amount);
            try {
                \App\Services\FuelPointService::awardDeposit((int)$userid, $amount);
            } catch (\Throwable $fpe) {}

            PlatformNotificationService::create(
                $userid,
                'deposit_approved',
                'Deposit approved',
                'Your deposit of ' . number_format($amount, 2) . ' has been credited to your wallet.',
                ['amount' => $amount, 'transaction_id' => $id]
            );
            $response = array('status' => 1, 'title' => "Success!!", 'message' => "Recharge successfully updated!");

        } elseif ($event == 'cancel') {
            Transaction::where('id', $id)->update([
                "remark" => 'Cancle payment due to some issue',
                "status" => '2',
            ]);
            PlatformNotificationService::create(
                $userid,
                'deposit_rejected',
                'Deposit not approved',
                'Your deposit request of ' . number_format($amount, 2) . ' was not approved.',
                ['amount' => $amount, 'transaction_id' => $id]
            );
            $response = array('status' => 1, 'title' => "Success!!", 'message' => "Recharge successfully updated!");
        }
        return response()->json($response);
    }
    public function withdrawalapproval($event, Request $r)
    {
        $response = array('status' => 0, 'title' => "Oops!!", 'message' => "Invalid Action!");
        $id = $r->id;
        $userid = $r->userid;
        $transaction = Transaction::where('id', $id)
            ->where('userid', $userid)
            ->where('category', 'withdraw')
            ->first();

        if (!$transaction || $transaction->status !== '0') {
            return response()->json([
                'status' => 0,
                'title' => 'Already processed',
                'message' => 'This withdrawal request is no longer pending.',
            ]);
        }

        $amount = (float) $transaction->amount;

        if ($event == 'success') {
            Transaction::where('id', $id)->update([
                "transactionno" => 'doltedaviator' . date("dmyhis"),
                "remark" => 'Success',
                "status" => '1',
            ]);
            PlatformNotificationService::create(
                $userid,
                'withdrawal_approved',
                'Withdrawal approved',
                'Your withdrawal of ' . number_format($amount, 2) . ' has been approved.',
                ['amount' => $amount, 'transaction_id' => $id]
            );
            $response = array('status' => 1, 'title' => "Success!!", 'message' => "Withdrawal successfully updated!");
        } elseif ($event == 'cancel') {
            Transaction::where('id', $id)->update([
                "remark" => 'Cancle payment due to some issue',
                "status" => '2',
            ]);
            addwallet($userid, $amount);
            PlatformNotificationService::create(
                $userid,
                'withdrawal_rejected',
                'Withdrawal rejected',
                'Your withdrawal of ' . number_format($amount, 2) . ' was rejected and the amount was returned to your wallet.',
                ['amount' => $amount, 'transaction_id' => $id]
            );
            $response = array('status' => 1, 'title' => "Success!!", 'message' => "Withdrawal successfully updated!");
        }
        return response()->json($response);
    }
    public function userdelete(Request $r)
    {
        $response = array('status' => 0, 'title' => "Oops!!", 'message' => "Invalid Action!");
        $id = $r->id;
        User::where('id', $id)->delete();
        Wallet::where('userid', $id)->delete();
        Transaction::where('userid', $id)->delete();
        $response = array('status' => 1, 'title' => "Success!!", 'message' => "User successfully Deleted!");
        return response()->json($response);
    }
    public function payment_gateway(Request $r)
    {
        $status = false;
        $message = "Something went wrong!";
        $detail = Bankdetail::where('id', '1')->first();
        if ($detail) {
            $status = true;
            $data = array(
                'user_name' => $detail->account_holder_name,
                'mobile_no' => $detail->mobile_no,
                'upi_id' => $detail->upi_id,
                'account_number' => $detail->account_no,
                'ifsc_code' => $detail->ifsc_code,
                'bank_name' => $detail->bank_name,
                'barcode' => $detail->barcode,
            );
            $message = "";

        } else {
            $status = false;
            $data = array();
            $message = "Something wents wrong!";
        }
        $response = array("isSuccess" => $status, "data" => $data, "message" => $message);
        return response()->json($response);
    }

    public function editamountsetup(Request $r)
    {
        $response = array('status' => 0, 'title' => "Error!!", 'message' => "Something wents wrong!");
        $update = Setting::where('id', $r->id)->update([
            "category" => $r->settingname,
            "value" => $r->value,
        ]);
        if ($update) {
            $response = array('status' => 1, 'title' => "Success!!", 'message' => "User successfully Deleted!");
        }
        return response()->json($response);
    }

    public function editbankdetail(Request $r)
    {
        // return $r->all();
        $response = array('status' => 0, 'title' => "Error!!", 'message' => "Something wents wrong!");
        $exist = Bankdetail::where('id', '1')->first();
        if ($exist) {
            if ($r->file('barcode') != '') {
                $barcode = imageupload($r->file('barcode'), 'barcode', 'admin/bankdetail/')['filePath'];
            } else {
                $barcode = $exist->barcode;
            }
        }
        $update = Bankdetail::where('id', '1')->update([
            "account_holder_name" => $r->holdername,
            "mobile_no" => $r->mobile_no,
            "upi_id" => $r->upi_id,
            "account_no" => $r->account_no,
            "ifsc_code" => $r->ifsccode,
            "bank_name" => $r->bank_name,
            "barcode" => $barcode,
        ]);
        if ($update) {
            $response = array('status' => 1, 'title' => "Success!!", 'message' => "User successfully Deleted!");
        }
        return response()->json($response);
    }
    public function updatewallet(Request $r)
    {
        $userid = $r->userid;
        $amount = $r->amount;
        $response = array('status' => 0, 'title' => "Error!!", 'message' => "Something wents wrong!");
        $update = Wallet::where('userid', $userid)->update([
            "amount" => $amount,
        ]);
        if ($update) {
            $response = array('status' => 1, 'title' => "Success!!", 'message' => "User Wallet successfully Updated!");
        }
        return response()->json($response);
    }

    public function depositNow(Request $r)
    {
        $trn = new Transaction;
        $trn->userid = user('id');
        $trn->platform = platform($r->payment_gateway_type);
        $trn->transactionno = $r->trn;
        $trn->type = 'credit';
        $trn->amount = $r->amount;
        $trn->category = 'recharge';
        $trn->remark = 'Processing';
        $trn->status = '0';
        if ($trn->save()) {
            PlatformNotificationService::create(
                user('id'),
                'deposit_submitted',
                'Deposit request submitted',
                'Your deposit request of ' . number_format((float) $r->amount, 2) . ' is being reviewed.',
                ['amount' => (float) $r->amount, 'transaction_id' => $trn->id]
            );
            return redirect('/deposit?msg=Success');
        }
    }
    public function withdrawal_query(Request $r)
    {
        // return $r->all();
        $trn = new Transaction;
        $trn->userid = user('id');
        $trn->platform = platform($r->payment_gateway_type);
        $trn->transactionno = '';
        $trn->type = 'debit';
        $trn->amount = $r->amount;
        $trn->category = 'withdraw';
        $trn->remark = 'Processing';
        $trn->status = '0';
        if ($trn->save()) {
            PlatformNotificationService::create(
                user('id'),
                'withdrawal_submitted',
                'Withdrawal request submitted',
                'Your withdrawal request of ' . number_format((float) $r->amount, 2) . ' is being reviewed.',
                ['amount' => (float) $r->amount, 'transaction_id' => $trn->id]
            );
            if (wallet(user('id'), 'num') > $r->amount) {
                addwallet(user('id'), $r->amount, '-');
            }
            $existbank = Bank_detail::where('userid', user('id'))->orderBy('id', 'desc')->first();
            if ($existbank) {
                Bank_detail::where('userid', user('id'))->update([
                    "bankname" => $r->bank_name,
                    "accountno" => $r->account_no,
                    "ifsccode" => $r->ifsc_code,
                    "upi_id" => $r->upi_id,
                    "mobile_no" => $r->mobile,
                ]);
                return redirect('/withdraw?msg=Success');
            } else {
                $bank = new Bank_detail;
                $bank->userid = user('id');
                $bank->bankname = $r->bank_name;
                $bank->accountno = $r->account_no;
                $bank->ifsccode = $r->ifsc_code;
                $bank->upi_id = $r->upi_id;
                $bank->mobile_no = $r->mobile;
                if ($bank->save()) {
                    return redirect('/withdraw?msg=Success');
                }
                return redirect('/withdraw?msg=error');
            }
        }
    }
}
