@extends('Layout.usergame')
@section('content')
    <div class="deposite-container" style="padding: 20px 10px 80px 10px; max-width: 1000px; margin: 0 auto;">
        <div class="sub-header d-flex align-items-center gap-2 mb-3">
            <span class="material-symbols-outlined text-warning" style="font-size: 28px;">emoji_events</span>
            <h2 class="head_title m-0" style="color: #fff; font-size: 20px; font-weight: 800;">Aviator Leaderboard</h2>
        </div>
        
        <div class="card" style="background: #13141a; border: 1px solid rgba(255,255,255,0.08); border-radius: 14px; overflow: hidden;">
            <div class="card-header border-bottom border-secondary d-flex align-items-center justify-content-between py-3 px-3" style="background: #0d0e13;">
                <span class="fw-bold text-white fs-6">Top Win Multipliers – All Time</span>
                <span class="badge bg-warning text-dark fw-bold px-2 py-1">🏆 Hall of Fame</span>
            </div>
            <div class="card-body p-0">
                <div class="table-responsive">
                    <table class="table table-dark table-hover m-0 align-middle" style="background: transparent;">
                        <thead style="background: #0d0e13; border-bottom: 1px solid rgba(255,255,255,0.08);">
                            <tr style="font-size: 11px; text-transform: uppercase; letter-spacing: 0.05em; color: #8a8d9b;">
                                <th class="py-3 px-3 text-center" style="width: 60px;">Rank</th>
                                <th class="py-3 px-3">Player</th>
                                <th class="py-3 px-3 text-center">Bet Amount</th>
                                <th class="py-3 px-3 text-center">Multiplier</th>
                                <th class="py-3 px-3 text-end">Win Cash Out</th>
                            </tr>
                        </thead>
                        <tbody style="font-size: 13px;">
                            @php
                                // Merge real data with simulated fallback if needed
                                $list = $topbets->count() > 0 ? $topbets : ($simulated ?? collect());
                            @endphp

                            @if ($list->count() > 0)
                                @foreach ($list as $item)
                                    @php
                                        $uid = (string)($item->display_id ?? $item->userid ?? '??');
                                        $avatar = $item->image ?? '/images/avtar/av-' . (($loop->index % 72) + 1) . '.png';
                                        $playerLabel = $item->name ?? ('Player #' . $uid);
                                        $multiplier = floatval($item->cashout_multiplier);
                                        $amount = floatval($item->amount);
                                        $winAmount = $amount * $multiplier;
                                    @endphp
                                    <tr style="border-bottom: 1px solid rgba(255,255,255,0.04);">
                                        <td class="py-3 px-3 text-center fw-bold">
                                            @if($loop->iteration == 1)
                                                <span style="font-size:20px;">🥇</span>
                                            @elseif($loop->iteration == 2)
                                                <span style="font-size:20px;">🥈</span>
                                            @elseif($loop->iteration == 3)
                                                <span style="font-size:20px;">🥉</span>
                                            @else
                                                <span class="text-muted">#{{ $loop->iteration }}</span>
                                            @endif
                                        </td>
                                        <td class="py-3 px-3">
                                            <div class="d-flex align-items-center gap-2">
                                                <img src="{{ $avatar }}" 
                                                     class="rounded-circle" 
                                                     style="width: 32px; height: 32px; object-fit: cover; border: 2px solid rgba(255,200,0,0.3);"
                                                     onerror="this.src='/images/avtar/av-1.png'">
                                                <span class="fw-bold text-white">{{ $playerLabel }}</span>
                                            </div>
                                        </td>
                                        <td class="py-3 px-3 text-center fw-bold" style="color: #aaa;">
                                            {{ number_format($amount, 2) }}₦
                                        </td>
                                        <td class="py-3 px-3 text-center">
                                            <span class="badge" style="background: rgba(0, 230, 118, 0.15); color: #00e676; border: 1px solid rgba(0, 230, 118, 0.3); font-size: 13px; padding: 4px 10px; border-radius: 20px; font-weight: 800;">
                                                {{ number_format($multiplier, 2) }}x
                                            </span>
                                        </td>
                                        <td class="py-3 px-3 text-end fw-bold" style="color: #00e676;">
                                            +{{ number_format($winAmount, 2) }}₦
                                        </td>
                                    </tr>
                                @endforeach
                            @else
                                <tr>
                                    <td colspan="5" class="text-center py-5" style="color: #6c757d;">
                                        <span class="material-symbols-outlined d-block mb-2" style="font-size: 40px; color: #454759;">emoji_events</span>
                                        Leaderboard updating soon!
                                    </td>
                                </tr>
                            @endif
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    </div>
@endsection
