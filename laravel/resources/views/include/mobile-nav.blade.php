{{--====== Mobile Fixed Bottom Navigation Bar ======--}}
<nav class="ax-bottom-nav" id="ax-mobile-nav">
    <a href="/crash" class="ax-nav-item {{ request()->is('crash') ? 'active' : '' }}" onclick="if(window.location.pathname === '/crash') { var m = bootstrap.Modal.getInstance(document.getElementById('leaderboard-modal')); if(m) m.hide(); return false; }">
        <span class="material-symbols-outlined ax-nav-icon">flight_takeoff</span>
        <span class="ax-nav-label">Game</span>
    </a>
    
    <a href="/chat" class="ax-nav-item {{ request()->is('chat') ? 'active' : '' }}">
        <span class="material-symbols-outlined ax-nav-icon">forum</span>
        <span class="ax-nav-label">Chat</span>
    </a>

    <a href="/mybets" class="ax-nav-item {{ request()->is('mybets') ? 'active' : '' }}">
        <span class="material-symbols-outlined ax-nav-icon">history</span>
        <span class="ax-nav-label">My Bets</span>
    </a>

    @if(request()->is('crash'))
    <a href="#" class="ax-nav-item" data-bs-toggle="modal" data-bs-target="#leaderboard-modal">
        <span class="material-symbols-outlined ax-nav-icon">emoji_events</span>
        <span class="ax-nav-label">Leaderboard</span>
    </a>
    @else
    <a href="/leaderboard" class="ax-nav-item {{ request()->is('leaderboard') ? 'active' : '' }}">
        <span class="material-symbols-outlined ax-nav-icon">emoji_events</span>
        <span class="ax-nav-label">Leaderboard</span>
    </a>
    @endif

    @if(session()->has('userlogin'))
    <a href="#" class="ax-nav-item" data-bs-toggle="modal" data-bs-target="#deposit-modal">
        <span class="material-symbols-outlined ax-nav-icon">account_balance_wallet</span>
        <span class="ax-nav-label">Wallet</span>
    </a>
    @else
    <a href="#" class="ax-nav-item" data-bs-toggle="modal" data-bs-target="#auth-modal" onclick="if(window.switchAuthTab) switchAuthTab('login')">
        <span class="material-symbols-outlined ax-nav-icon">account_balance_wallet</span>
        <span class="ax-nav-label">Wallet</span>
    </a>
    @endif

    <a href="/profile" class="ax-nav-item {{ request()->is('profile') ? 'active' : '' }}">
        <span class="material-symbols-outlined ax-nav-icon">person</span>
        <span class="ax-nav-label">Profile</span>
    </a>
</nav>
