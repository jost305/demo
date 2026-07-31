<!--====== Component 1: Top Navigation Header ======-->
<header class="ax-header">
    <div class="ax-header-left">
        <a href="/crash" class="ax-logo">
            <img src="/images/flyboy10x_logo.png" alt="FlyBoy10x" class="ax-logo-img">
        </a>
    </div>

    <div class="ax-header-right">
        @if (session()->has('userlogin'))
            {{-- Wallet Balance Pill --}}
            <div class="ax-wallet-pill">
                <span class="ax-wallet-amount" id="header_wallet_balance">₦ {{ number_format(floatval(wallet(user('id'))), 2) }}</span>
            </div>

            {{-- + Deposit Button --}}
            <button type="button" class="ax-deposit-btn-full" data-bs-toggle="modal" data-bs-target="#deposit-modal" title="Deposit funds">
                + Deposit
            </button>

            {{-- Notification Bell --}}
            @include('include.notification-dropdown')

            {{-- Profile Dropdown --}}
            <div class="ax-profile-dropdown">
                <button type="button" class="ax-icon-btn ax-profile-trigger" id="profileMenuBtn" aria-label="Profile menu">
                    <img src="{{ user('image') ?: 'images/avtar/av-1.png' }}" class="ax-avatar-sm" id="avatar_img" onerror="this.src='images/avtar/av-1.png'">
                    <span class="ax-caret material-symbols-outlined">expand_more</span>
                </button>

                <div class="ax-profile-menu" id="profileMenu">
                    <div class="ax-pm-user">
                        <img src="{{ user('image') ?: 'images/avtar/av-1.png' }}" class="ax-pm-avatar" onerror="this.src='images/avtar/av-1.png'">
                        <div class="ax-pm-info">
                            <div class="ax-pm-email">{{ user('email') }}</div>
                            <div class="ax-pm-id">ID #{{ user('id') }}</div>
                        </div>
                        <div class="ax-pm-balance">
                            <div class="ax-pm-bal-label">Balance</div>
                            <div class="ax-pm-bal-amount">₦ {{ number_format(floatval(wallet(user('id'))), 2) }}</div>
                        </div>
                    </div>

                    <div class="ax-pm-links">
                        <a href="/crash" class="ax-pm-link">
                            <span class="material-symbols-outlined">flight_takeoff</span>
                            <span>Play Aviator</span>
                        </a>
                        <a href="#" class="ax-pm-link" data-bs-toggle="modal" data-bs-target="#deposit-modal">
                            <span class="material-symbols-outlined">add_circle</span>
                            <span>Deposit</span>
                        </a>
                        <a href="#" class="ax-pm-link" data-bs-toggle="modal" data-bs-target="#withdraw-modal">
                            <span class="material-symbols-outlined">account_balance_wallet</span>
                            <span>Withdraw</span>
                        </a>
                        <a href="/mybets" class="ax-pm-link">
                            <span class="material-symbols-outlined">history</span>
                            <span>My Bets</span>
                        </a>
                        <a href="/leaderboard" class="ax-pm-link">
                            <span class="material-symbols-outlined">emoji_events</span>
                            <span>Leaderboard</span>
                        </a>
                    </div>

                    <a href="/logout" class="ax-pm-signout">
                        <span class="material-symbols-outlined">logout</span>
                        Sign Out
                    </a>
                </div>
            </div>

        @else
            {{-- Guest Wallet Display --}}
            <div class="ax-wallet-pill">
                <span class="ax-wallet-amount">₦ 0.00</span>
            </div>

            {{-- + Deposit Button --}}
            <button type="button" class="ax-deposit-btn-full" data-bs-toggle="modal" data-bs-target="#auth-modal" onclick="switchAuthTab('login')">
                + Deposit
            </button>

            {{-- Gift Badge --}}
            <button type="button" class="ax-gift-badge-btn" data-bs-toggle="modal" data-bs-target="#auth-modal" title="Daily Rewards">
                🎁<span class="ax-gift-dot"></span>
            </button>

            {{-- Register & Login Action Buttons --}}
            <button class="ax-auth-btn ax-auth-register" data-bs-toggle="modal" data-bs-target="#auth-modal" onclick="switchAuthTab('register')">Register</button>
            <button class="ax-auth-btn ax-auth-login" data-bs-toggle="modal" data-bs-target="#auth-modal" onclick="switchAuthTab('login')" id="login">Login</button>
        @endif
    </div>
</header>


<script>
(function() {
    var profileBtn = document.getElementById('profileMenuBtn');
    var profileMenu = document.getElementById('profileMenu');
    if (!profileBtn || !profileMenu) return;

    profileBtn.addEventListener('click', function(e) {
        e.stopPropagation();
        var open = profileMenu.classList.toggle('ax-pm-open');
        profileBtn.querySelector('.ax-caret').textContent = open ? 'expand_less' : 'expand_more';
        // close notification panel if open
        var notifPanel = document.getElementById('ax-notif-panel');
        if (notifPanel) notifPanel.classList.remove('ax-notif-open');
    });
    document.addEventListener('click', function() {
        profileMenu.classList.remove('ax-pm-open');
        var c = profileBtn.querySelector('.ax-caret');
        if (c) c.textContent = 'expand_more';
    });
    profileMenu.addEventListener('click', function(e) { e.stopPropagation(); });
})();
</script>
