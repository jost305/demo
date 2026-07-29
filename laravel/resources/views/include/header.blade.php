<!--====== Header Start ======-->
<header class="ax-header">
    <div class="ax-header-left">
        <a href="/crash" class="ax-logo">
            <img src="/images/flyboy10x_logo.png" alt="FlyBoy10x" class="ax-logo-img">
        </a>
    </div>

    <div class="ax-header-right">
        @if (session()->has('userlogin'))
            {{-- Wallet pill --}}
            <div class="ax-wallet-pill">
                <span class="ax-wallet-icon material-symbols-outlined">account_balance_wallet</span>
                <span class="ax-wallet-amount" id="header_wallet_balance">₦{{ wallet(user('id')) }}</span>
                <button type="button" class="ax-deposit-btn" data-bs-toggle="modal" data-bs-target="#deposit-modal" title="Deposit funds">+</button>
            </div>

            {{-- Notification Bell --}}
            @include('include.notification-dropdown')

            {{-- Profile Menu --}}
            <div class="ax-profile-dropdown">
                <button type="button" class="ax-icon-btn ax-profile-trigger" id="profileMenuBtn" aria-label="Profile menu">
                    <img src="images/avtar/av-1.png" class="ax-avatar-sm" id="avatar_img" onerror="this.src='images/avtar/av-1.png'">
                    <span class="ax-caret material-symbols-outlined">expand_more</span>
                </button>

                <div class="ax-profile-menu" id="profileMenu">
                    {{-- User card --}}
                    <div class="ax-pm-user">
                        <img src="images/avtar/av-1.png" class="ax-pm-avatar" onerror="this.src='images/avtar/av-1.png'">
                        <div class="ax-pm-info">
                            <div class="ax-pm-email">{{ user('email') }}</div>
                            <div class="ax-pm-id">ID #{{ user('id') }}</div>
                        </div>
                        <div class="ax-pm-balance">
                            <div class="ax-pm-bal-label">Balance</div>
                            <div class="ax-pm-bal-amount">₦{{ wallet(user('id')) }}</div>
                        </div>
                    </div>

                    {{-- Nav links --}}
                    <div class="ax-pm-links" style="grid-template-columns:1fr 1fr 1fr;">
                        <a href="/crash" class="ax-pm-link">
                            <span class="material-symbols-outlined">flight_takeoff</span>
                            <span>Play</span>
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
                        <a href="/profile" class="ax-pm-link">
                            <span class="material-symbols-outlined">person</span>
                            <span>Profile</span>
                        </a>
                        <a href="/deposit_withdrawals" class="ax-pm-link">
                            <span class="material-symbols-outlined">receipt_long</span>
                            <span>Transactions</span>
                        </a>
                        <a href="/chat" class="ax-pm-link">
                            <span class="material-symbols-outlined">forum</span>
                            <span>Chat</span>
                        </a>
                        <a href="/referal" class="ax-pm-link">
                            <span class="material-symbols-outlined">group_add</span>
                            <span>Referral</span>
                        </a>
                    </div>

                    {{-- Sign out --}}
                    <a href="/logout" class="ax-pm-signout">
                        <span class="material-symbols-outlined">logout</span>
                        Sign Out
                    </a>
                </div>
            </div>

        @else
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
        var notifPanel = document.getElementById('ax-notif-panel');
        if (notifPanel) notifPanel.classList.remove('ax-notif-open');
    });
    document.addEventListener('click', function() {
        if (profileMenu) profileMenu.classList.remove('ax-pm-open');
        var c = profileBtn ? profileBtn.querySelector('.ax-caret') : null;
        if (c) c.textContent = 'expand_more';
    });
    if (profileMenu) profileMenu.addEventListener('click', function(e) { e.stopPropagation(); });
})();
</script>
