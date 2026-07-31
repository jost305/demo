<?php

namespace App\Http\Controllers;

use App\Models\Transaction;
use App\Models\User;
use App\Services\PlatformNotificationService;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Log;

class FlutterwaveController extends Controller
{
    private function getSecretKey(): string
    {
        return env('FLUTTERWAVE_V3_SECRET_KEY', '');
    }

    private function getPublicKey(): string
    {
        return env('FLUTTERWAVE_V3_PUBLIC_KEY', '');
    }

    /**
     * Prepare Flutterwave Inline Payment config.
     * Creates a pending transaction and returns JSON config for the inline SDK.
     * No redirect — the widget opens as an overlay on the same page.
     */
    public function initialize(Request $request)
    {
        $request->validate([
            'amount' => 'required|numeric|min:100',
        ]);

        $userSession = session()->get('userlogin');
        if (!$userSession) {
            return response()->json([
                'status'  => 'error',
                'message' => 'Please log in to make a deposit.'
            ], 401);
        }

        $userId = is_object($userSession) ? $userSession->id : ($userSession['id'] ?? null);
        $user   = User::find($userId);

        if (!$user) {
            return response()->json([
                'status'  => 'error',
                'message' => 'User account not found.'
            ], 404);
        }

        $amount = (float) $request->amount;
        $txRef  = 'FLB_DEP_' . time() . '_' . $user->id;

        // Store pending transaction record
        $trn                = new Transaction();
        $trn->userid        = $user->id;
        $trn->platform      = 'Flutterwave';
        $trn->transactionno = $txRef;
        $trn->type          = 'credit';
        $trn->amount        = $amount;
        $trn->category      = 'recharge';
        $trn->remark        = 'Processing Flutterwave Inline Deposit';
        $trn->status        = '0';
        $trn->save();

        $appUrl = url('/');

        // Return config for the Flutterwave Inline JS SDK
        return response()->json([
            'status'     => 'success',
            'public_key' => $this->getPublicKey(),
            'tx_ref'     => $txRef,
            'amount'     => $amount,
            'currency'   => 'NGN',
            'customer'   => [
                'email'       => $user->email    ?? ('user_' . $user->id . '@flyboy10x.com'),
                'phone_number'=> $user->mobile   ?? '',
                'name'        => $user->name     ?? 'FlyBoy Player',
            ],
            'customizations' => [
                'title'       => 'FlyBoy 10x',
                'description' => '₦' . number_format($amount, 2) . ' Wallet Deposit',
                'logo'        => $appUrl . '/images/flyboy10x_logo.png',
            ],
            'meta' => [
                'user_id' => $user->id,
            ],
        ]);
    }

    /**
     * Verify payment after Flutterwave Inline SDK callback.
     * Called from frontend JS after payment widget closes successfully.
     */
    public function verify(Request $request)
    {
        $request->validate([
            'transaction_id' => 'required',
            'tx_ref'         => 'required',
        ]);

        $transactionId = $request->transaction_id;
        $txRef         = $request->tx_ref;
        $secretKey     = $this->getSecretKey();

        if (!$secretKey) {
            return response()->json(['status' => 'error', 'message' => 'Payment gateway not configured.'], 500);
        }

        try {
            $response = Http::withHeaders([
                'Authorization' => 'Bearer ' . $secretKey,
            ])->get("https://api.flutterwave.com/v3/transactions/{$transactionId}/verify");

            $resData = $response->json();
            Log::info('Flutterwave verify response', ['tx_ref' => $txRef, 'status' => $resData['data']['status'] ?? 'unknown']);

            if (
                isset($resData['status']) && $resData['status'] === 'success' &&
                isset($resData['data']['status']) && $resData['data']['status'] === 'successful'
            ) {
                $flwData    = $resData['data'];
                $amountPaid = (float) $flwData['amount'];
                $ref        = $flwData['tx_ref'];

                // Extract user_id from tx_ref: FLB_DEP_{timestamp}_{user_id}
                $refParts = explode('_', $ref);
                $userId   = end($refParts);

                // Find matching pending transaction
                $trn = Transaction::where('transactionno', $ref)->where('status', '0')->first();

                if (!$trn) {
                    // Already credited (duplicate callback)
                    $alreadyDone = Transaction::where('transactionno', $ref)->where('status', '1')->exists();
                    if ($alreadyDone) {
                        return response()->json(['status' => 'success', 'message' => 'Already credited.', 'already_credited' => true]);
                    }
                }

                // Credit user wallet
                addwallet($userId, $amountPaid, '+');

                if ($trn) {
                    $trn->status = '1';
                    $trn->remark = 'Successful Flutterwave Inline Deposit (Tx: ' . $transactionId . ')';
                    $trn->save();
                } else {
                    addtransaction($userId, 'Flutterwave', $ref, 'credit', $amountPaid, 'recharge', 'Successful Deposit', '1');
                }

                // Platform notification
                try {
                    PlatformNotificationService::create(
                        $userId,
                        'deposit_success',
                        'Deposit Successful! 🎉',
                        'Your wallet has been credited with ₦' . number_format($amountPaid, 2) . ' via Flutterwave.',
                        ['amount' => $amountPaid, 'transaction_id' => $transactionId]
                    );
                } catch (\Throwable $te) {}

                return response()->json([
                    'status'  => 'success',
                    'message' => 'Wallet credited with ₦' . number_format($amountPaid, 2),
                    'amount'  => $amountPaid,
                ]);
            }

            // Failed verification notification
            $refParts = explode('_', $txRef);
            $userId   = end($refParts);
            if ($userId) {
                try {
                    PlatformNotificationService::create(
                        $userId,
                        'deposit_failed',
                        'Deposit Failed ❌',
                        'Your Flutterwave deposit of ₦' . number_format($request->amount ?? 0, 2) . ' could not be verified.',
                        ['tx_ref' => $txRef, 'transaction_id' => $transactionId]
                    );
                } catch (\Throwable $te) {}
            }

            return response()->json([
                'status'  => 'error',
                'message' => 'Payment verification failed. Please contact support if funds were deducted.',
            ], 400);

        } catch (\Throwable $e) {
            Log::error('Flutterwave Verify Error: ' . $e->getMessage());
            return response()->json(['status' => 'error', 'message' => 'Verification error. Please contact support.'], 500);
        }
    }

    /**
     * Fallback redirect callback (for users who close/navigate away mid-payment).
     */
    public function callback(Request $request)
    {
        $status        = $request->get('status');
        $txRef         = $request->get('tx_ref');
        $transactionId = $request->get('transaction_id');

        if ($status === 'cancelled') {
            return redirect('/crash?deposit=cancelled');
        }

        if ($status === 'successful' && $transactionId) {
            // Re-use verify logic
            $verifyRequest = Request::create('/payment/flutterwave/verify', 'POST', [
                'transaction_id' => $transactionId,
                'tx_ref'         => $txRef,
            ]);
            $result = $this->verify($verifyRequest)->getData(true);

            if (($result['status'] ?? '') === 'success') {
                return redirect('/crash?deposit=success&amount=' . ($result['amount'] ?? ''));
            }
        }

        return redirect('/crash?deposit=failed&msg=Payment+could+not+be+verified');
    }

    /**
     * Asynchronous Webhook IPN
     */
    public function webhook(Request $request)
    {
        $payload = $request->all();

        if (isset($payload['event']) && $payload['event'] === 'charge.completed') {
            $data = $payload['data'];
            if (isset($data['status']) && $data['status'] === 'successful') {
                $transactionId = $data['id'];
                $amountPaid    = (float) $data['amount'];
                $ref           = $data['tx_ref'];
                $refParts      = explode('_', $ref);
                $userId        = end($refParts);

                $trn = Transaction::where('transactionno', $ref)->where('status', '0')->first();
                if ($trn) {
                    addwallet($userId, $amountPaid, '+');
                    $trn->status = '1';
                    $trn->remark = 'Successful Webhook Deposit (Tx: ' . $transactionId . ')';
                    $trn->save();
                }
            }
        }

        return response()->json(['status' => 'success'], 200);
    }
}
