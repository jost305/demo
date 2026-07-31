<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no">
    <meta name="csrf-token" content="{{ csrf_token() }}">
    <title>FlyBoy — Live Aviator Betting Platform</title>

    <!-- Google Fonts & Material Symbols -->
    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    <link href="https://fonts.googleapis.com/css2?family=Roboto:wght@300;400;500;700&display=swap" rel="stylesheet">
    <link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:opsz,wght,FILL,GRAD@20..48,100..700,0..1,-50..200&display=block" />

    <!-- Stylesheets -->
    <link rel="stylesheet" href="/css/bootstrap.css" />
    <link rel="stylesheet" href="/css/style.css" />
    <link rel="stylesheet" href="/css/aviator-theme.css" />
    <script src="https://cdn.tailwindcss.com"></script>
    <script>
      tailwind.config = {
        theme: {
          extend: {
            colors: {
              slate: {
                800: '#1e293b',
                900: '#0f172a',
                950: '#020617',
              },
              lime: {
                300: '#bef264',
                400: '#a3e635',
              }
            }
          }
        }
      }
    </script>

    <!-- React 18 & Babel Standalone for Instant Execution -->
    <script crossorigin src="https://unpkg.com/react@18/umd/react.production.min.js"></script>
    <script crossorigin src="https://unpkg.com/react-dom@18/umd/react-dom.production.min.js"></script>
    <script crossorigin src="https://unpkg.com/@babel/standalone/babel.min.js"></script>
    <script src="https://code.jquery.com/jquery-3.6.0.min.js"></script>
    <script src="/js/bootstrap.bundle.min.js"></script>
</head>
<body class="bg-slate-950 text-white p-0 m-0 overflow-x-hidden" style="min-height: 100vh; background-color: #020617;">
    <!-- React Root Mount Node -->
    <div id="app" data-page='@json($page ?? [])' style="min-height: 100vh; width: 100%;"></div>

    <!-- Hidden compatibility DOM nodes for live engine compatibility -->
    <div style="display:none; visibility:hidden; width:0; height:0; overflow:hidden;">
        <div class="stage-board">
            <canvas id="myCanvas" width="1200" height="600"></canvas>
            <div id="auto_increment_number_div">
                <div class="flew_away_section">FLEW AWAY!</div>
                <div id="auto_increment_number">1.00<span>X</span></div>
            </div>
            <div class="loading-game">
                <div class="game-centeral-loading"></div>
                <div class="bottom-left-plane"></div>
            </div>
        </div>
        <div id="main_bet_section">
            <div id="bet_button"></div>
            <div id="cancle_button"><span id="waiting"></span></div>
            <div id="cashout_button"></div>
            <span id="cash_out_amount"></span>
            <input id="main_bet_id" type="hidden" />
            <input id="main_auto_bet" type="checkbox" />
            <input id="main_checkout" type="checkbox" />
            <input id="main_incrementor" type="number" value="2.00" />
        </div>
        <div id="extra_bet_section">
            <div id="bet_button"></div>
            <div id="cancle_button"><span id="waiting"></span></div>
            <div id="cashout_button"></div>
            <span id="cash_out_amount"></span>
            <input id="extra_bet_id" type="hidden" />
            <input id="extra_auto_bet" type="checkbox" />
            <input id="extra_checkout" type="checkbox" />
            <input id="extra_incrementor" type="number" value="2.00" />
        </div>
        <div id="all_bets"><div class="mCSB_container"></div></div>
        <div id="my_bet_list"></div>
        <div id="prev_bets"><div class="mCSB_container"></div></div>
    </div>

    <!-- Include Auth Modals -->
    @include('include.auth-modals')

    <!-- Game Engine Globals & Scripts -->
    <script>
        var hash_id = '{{ csrf_token() }}';
        var currency_symbol = '₦';
        var currency_id = 1;
        var min_bet_amount = 5;
        var max_bet_amount = 50;
        var bet_array = [];
        var stage_time_out = 0;
        var is_game_generated = 0;
        var main_counter = 0;
        var extra_counter = 0;
        var main_cash_out = 0;
        var extra_cash_out = 0;
    </script>
    <script src="/user/avatar.js"></script>
    <script src="/user/canvas.js?v={{ time() }}"></script>
    <script src="/user/aviatorold.js?v={{ time() }}"></script>
    <script src="/user/aviatorbyapp.js?v={{ time() }}"></script>

    <!-- Load Compiled Main React Application Script -->
    <script src="/js/react-app.js"></script>
</body>
</html>

