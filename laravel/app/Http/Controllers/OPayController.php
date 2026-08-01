<?php

namespace App\Http\Controllers;

use App\Models\Transaction;
use App\Models\User;
use App\Services\PlatformNotificationService;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Log;

class OPayController extends Controller
{
    private function getPublicKey(): string
    {
        return env('OPAY_PUBLIC_KEY', '');
    }

    private function getPrivateKey(): string
    {
        return env('OPAY_PRIVATE_KEY', '');
    }

    private function getMerchantId(): string
    {
        return env('OPAY_MERCHANT_ID', '');
    }

    private function getApiBaseUrl(): string
    {
        return env('OPAY_ENVIRONMENT', 'test') === 'live'
            ? 'https://liveapi.opaycheckout.com/api/v1/international'
            : 'https://testapi.opaycheckout.com/api/v1/international';
    }

    public function create(Request $request)
    {
        $request->validate([
            'amount' => 'required|numeric|min:100',
        ]);

        $userSession = session()->get('userlogin');
        if (!$userSession) {
            return response()->json(['status' => 'error', 'message' => 'Please log in to make a deposit.'], 401);
        }

        $userId = is_object($userSession) ? $userSession->id : ($userSession['id'] ?? null);
        $user   = User::find($userId);
        if (!$user) {
            return response()->json(['status' => 'error', 'message' => 'User account not found.'], 404);
        }

        $publicKey  = $this->getPublicKey();
        $merchantId = $this->getMerchantId();
        if (!$publicKey || !$merchantId) {
            return response()->json(['status' => 'error', 'message' => 'OPay gateway is not configured.'], 500);
        }

        $amount = (float) $request->amount;
        $txRef  = 'OPAY_DEP_' . time() . '_' . $user->id;

        $trn = new Transaction();
        $trn->userid = $user->id;
        $trn->platform = 'OPay';
        $trn->transactionno = $txRef;
        $trn->type = 'credit';
        $trn->amount = $amount;
        $trn->category = 'recharge';
        $trn->remark = 'Processing OPay Cashier Deposit';
        $trn->status = '0';
        $trn->save();

        $payload = [
            'country' => 'NG',
            'reference' => $txRef,
            'amount' => [
                'total' => (int) round($amount * 100),
                'currency' => 'NGN',
            ],
            'returnUrl' => url('/payment/opay/callback'),
            'cancelUrl' => url('/crash?deposit=cancelled'),
            'callbackUrl' => url('/payment/opay/callback'),
            'displayName' => 'FlyBoy 10x',
            'customerVisitSource' => 'BROWSER',
            'evokeOpay' => true,
            'expireAt' => 30,
            'userInfo' => [
                'userEmail' => $user->email ?? ('user_' . $user->id . '@flyboy10x.com'),
                'userId' => (string) $user->id,
                'userMobile' => $user->mobile ?? '',
                'userName' => $user->name ?? 'FlyBoy Player',
            ],
            'product' => [
                'name' => 'FlyBoy 10x Wallet Deposit',
                'description' => 'Deposit ₦' . number_format($amount, 2) . ' into your FlyBoy wallet',
            ],
        ];

        try {
            $endpoint = $this->getApiBaseUrl() . '/cashier/create';
            $response = Http::withHeaders([
                'Content-Type' => 'application/json',
                'Authorization' => 'Bearer ' . $publicKey,
                'MerchantId' => $merchantId,
            ])->post($endpoint, $payload);

            $result = $response->json();
            if ($response->successful() && isset($result['code']) && $result['code'] === '00000' && isset($result['data']['cashierUrl'])) {
                return response()->json([
                    'status' => 'success',
                    'cashierUrl' => $result['data']['cashierUrl'],
                    'reference' => $result['data']['reference'] ?? $txRef,
                ]);
            }

            Log::error('OPay cashier create failed', ['status' => $response->status(), 'response' => $result]);
            return response()->json(['status' => 'error', 'message' => 'OPay cashier creation failed. Please try again.'], 500);
        } catch (\Throwable $e) {
            Log::error('OPay cashier create exception', ['message' => $e->getMessage()]);
            return response()->json(['status' => 'error', 'message' => 'Unable to create OPay payment. Please try again.'], 500);
        }
    }

    public function callback(Request $request)
    {
        $reference = $request->get('reference');
        $orderNo = $request->get('orderNo');
        $txRef = $request->get('reference') ?: $request->get('tx_ref');

        if (!$reference && !$orderNo && !$txRef) {
            return redirect('/crash?deposit=failed&msg=Invalid+OPay+response');
        }

        $statusData = $this->queryStatus($reference, $orderNo, $txRef);
        if (!$statusData) {
            return redirect('/crash?deposit=failed&msg=Unable+to+verify+OPay+payment');
        }

        $statusCode = $statusData['code'] ?? null;
        $status = $statusData['data']['status'] ?? null;
        $amountTotal = $statusData['data']['amount']['total'] ?? null;
        $referenceValue = $statusData['data']['reference'] ?? $txRef;

        if ($statusCode === '00000' && in_array($status, ['SUCCESS', 'INITIAL', 'PENDING'], true)) {
            if ($status === 'SUCCESS') {
                $txnRef = $referenceValue ?: $txRef;
                $trn = Transaction::where('transactionno', $txnRef)->where('status', '0')->first();
                $userId = null;

                if ($trn) {
                    $userId = $trn->userid;
                    $amountPaid = (float) $amountTotal;
                    addwallet($userId, $amountPaid, '+');
                    $trn->status = '1';
                    $trn->remark = 'Successful OPay Cashier Deposit';
                    $trn->save();
                }

                if (!$trn) {
                    $referenceParts = explode('_', $referenceValue);
                    $userId = end($referenceParts);
                    if ($userId) {
                        $amountPaid = (float) $amountTotal;
                        addtransaction($userId, 'OPay', $referenceValue, 'credit', $amountPaid, 'recharge', 'Successful Deposit', '1');
                    }
                }

                if ($userId) {
                    try {
                        PlatformNotificationService::create(
                            $userId,
                            'deposit_success',
                            'Deposit Successful! 🎉',
                            'Your wallet has been credited with ₦' . number_format($amountPaid, 2) . ' via OPay.',
                            ['amount' => $amountPaid, 'transaction_id' => $referenceValue]
                        );
                    } catch (\Throwable $e) {
                        Log::warning('OPay notification failed: ' . $e->getMessage());
                    }
                }

                return redirect('/crash?deposit=success&amount=' . ($amountPaid ?? ''));
            }

            return redirect('/crash?deposit=pending&msg=Payment+is+still+pending');
        }

        $message = $statusData['message'] ?? 'OPay payment verification failed.';
        return redirect('/crash?deposit=failed&msg=' . urlencode($message));
    }

    private function queryStatus($reference, $orderNo, $txRef)
    {
        $merchantId = $this->getMerchantId();
        $privateKey = $this->getPrivateKey();
        if (!$merchantId || !$privateKey) {
            return null;
        }

        $payload = ['country' => 'NG'];
        if ($reference) {
            $payload['reference'] = $reference;
        } elseif ($txRef) {
            $payload['reference'] = $txRef;
        }
        if ($orderNo) {
            $payload['orderNo'] = $orderNo;
        }

        $jsonPayload = json_encode($payload, JSON_UNESCAPED_SLASHES);
        $signature = hash_hmac('sha512', $jsonPayload, $privateKey);

        try {
            $endpoint = $this->getApiBaseUrl() . '/cashier/status';
            $response = Http::withHeaders([
                'Content-Type' => 'application/json',
                'Authorization' => 'Bearer ' . $signature,
                'MerchantId' => $merchantId,
            ])->post($endpoint, $payload);

            if ($response->successful()) {
                return $response->json();
            }

            Log::error('OPay status check failed', ['status' => $response->status(), 'body' => $response->body()]);
            return null;
        } catch (\Throwable $e) {
            Log::error('OPay status check exception', ['message' => $e->getMessage()]);
            return null;
        }
    }
}
