@extends('Layout.usergame')
@section('content')
    <div class="deposite-container" style="padding: 20px 10px 80px 10px; max-width: 1000px; margin: 0 auto;">
        <div class="sub-header d-flex align-items-center gap-2 mb-3">
            <span class="material-symbols-outlined text-warning" style="font-size: 28px;">history</span>
            <h2 class="head_title m-0" style="color: #fff; font-size: 20px; font-weight: 800;">My Bets History</h2>
        </div>
        
        <div class="card" style="background: #13141a; border: 1px solid rgba(255,255,255,0.08); border-radius: 14px; overflow: hidden;">
            <div class="card-body p-0">
                <div class="table-responsive">
                    <table class="table table-dark table-hover m-0 align-middle" style="background: transparent;">
                        <thead style="background: #0d0e13; border-bottom: 1px solid rgba(255,255,255,0.08);">
                            <tr style="font-size: 11px; text-transform: uppercase; letter-spacing: 0.05em; color: #8a8d9b;">
                                <th class="py-3 px-3">Date & Time</th>
                                <th class="py-3 px-3 text-center">Bet Amount</th>
                                <th class="py-3 px-3 text-center">Result</th>
                                <th class="py-3 px-3 text-end">Cash Out</th>
                            </tr>
                        </thead>
                        <tbody style="font-size: 13px;">
                            @if ($mybets->count() > 0)
                                @foreach ($mybets as $item)
                                    @php
                                        $multiplier = floatval($item->cashout_multiplier ?? 0);
                                        $amount = floatval($item->amount);
                                        $didCashout = $multiplier > 1 && $item->status == 1;
                                        $inProgress = $item->status == 0;
                                    @endphp
                                    <tr style="border-bottom: 1px solid rgba(255,255,255,0.04);">
                                        <td class="py-3 px-3" style="color: #aaa; font-size: 12px;">
                                            {{ dformat($item->created_at, 'd M Y, h:i A') }}
                                        </td>
                                        <td class="py-3 px-3 text-center fw-bold" style="color: #fff;">
                                            {{ number_format($amount, 2) }}₦
                                        </td>
                                        <td class="py-3 px-3 text-center">
                                            @if($inProgress)
                                                <span class="badge" style="background: rgba(255,200,0,0.15); color: #ffc800; border: 1px solid rgba(255,200,0,0.3); font-size: 11px; padding: 4px 8px; border-radius: 20px;">
                                                    ⏳ In Game
                                                </span>
                                            @elseif($didCashout)
                                                <span class="badge" style="background: rgba(0, 230, 118, 0.15); color: #00e676; border: 1px solid rgba(0, 230, 118, 0.3); font-size: 11px; padding: 4px 8px; border-radius: 20px;">
                                                    ✓ {{ number_format($multiplier, 2) }}x
                                                </span>
                                            @else
                                                <span class="badge" style="background: rgba(255, 30, 70, 0.15); color: #ff1e46; border: 1px solid rgba(255, 30, 70, 0.3); font-size: 11px; padding: 4px 8px; border-radius: 20px;">
                                                    ✗ Crashed
                                                </span>
                                            @endif
                                        </td>
                                        <td class="py-3 px-3 text-end fw-bold">
                                            @if($didCashout)
                                                <span style="color: #00e676;">+{{ number_format($amount * $multiplier, 2) }}₦</span>
                                            @elseif($inProgress)
                                                <span style="color: #ffc800;">—</span>
                                            @else
                                                <span style="color: #ff1e46;">-{{ number_format($amount, 2) }}₦</span>
                                            @endif
                                        </td>
                                    </tr>
                                @endforeach
                            @else
                                <tr>
                                    <td colspan="4" class="text-center py-5" style="color: #6c757d;">
                                        <span class="material-symbols-outlined d-block mb-2" style="font-size: 40px; color: #454759;">sports_esports</span>
                                        No bet history found yet. Start playing Aviator!
                                    </td>
                                </tr>
                            @endif
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
        
        @if($mybets->hasPages())
            <div class="d-flex justify-content-center mt-3">
                {{ $mybets->links() }}
            </div>
        @endif
    </div>
@endsection
