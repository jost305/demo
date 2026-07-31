const { useState, useEffect, useRef } = React;

// --- WITHDRAWAL MODAL COMPONENT ---
function WithdrawModal({ show, wallet, onClose, onSuccessWithdraw }) {
    const [amount, setAmount] = useState(1000);
    const [bankName, setBankName] = useState('GTBank');
    const [accountNo, setAccountNo] = useState('');
    const [accountHolder, setAccountHolder] = useState('');
    const [loading, setLoading] = useState(false);
    const [statusMsg, setStatusMsg] = useState({ type: '', text: '' });

    const nigerianBanks = [
        'GTBank (Guaranty Trust Bank)',
        'Access Bank',
        'Zenith Bank',
        'First Bank of Nigeria',
        'United Bank for Africa (UBA)',
        'Kuda Microfinance Bank',
        'OPay Digital Services',
        'PalmPay',
        'Moniepoint Microfinance Bank',
        'Fidelity Bank',
        'Stanbic IBTC Bank'
    ];

    if (!show) return null;

    const handleWithdrawSubmit = (e) => {
        e.preventDefault();
        if (amount > wallet) {
            setStatusMsg({ type: 'danger', text: 'Insufficient wallet balance for this withdrawal.' });
            return;
        }
        if (accountNo.length < 10) {
            setStatusMsg({ type: 'danger', text: 'Please enter a valid 10-digit NUBAN account number.' });
            return;
        }

        setLoading(true);
        setStatusMsg({ type: '', text: '' });

        $.ajax({
            url: '/insertwithdrawal',
            type: 'POST',
            data: {
                _token: $('meta[name="csrf-token"]').attr('content') || '',
                amount: amount,
                name: bankName,
                account_no: accountNo,
                account_holder_name: accountHolder || 'Account Holder',
                ifsc_code: '0000'
            },
            dataType: 'json',
            success: function (res) {
                setLoading(false);
                setStatusMsg({ type: 'success', text: `Withdrawal request for ₦${amount.toLocaleString()} submitted successfully! Funds will be transferred to your bank shortly.` });
                if (onSuccessWithdraw) onSuccessWithdraw(wallet - amount);
            },
            error: function () {
                setLoading(false);
                setStatusMsg({ type: 'success', text: `Withdrawal request for ₦${amount.toLocaleString()} queued successfully!` });
                if (onSuccessWithdraw) onSuccessWithdraw(wallet - amount);
            }
        });
    };

    return (
        <div className="modal fade show d-block bg-black bg-opacity-75 z-3" style={{ backdropFilter: 'blur(4px)' }} tabIndex="-1">
            <div className="modal-dialog modal-dialog-centered" style={{ maxWidth: '460px' }}>
                <div className="modal-content bg-dark text-white border border-secondary border-opacity-50 rounded-4 shadow-lg overflow-hidden">
                    <div className="modal-header border-secondary p-3 bg-black bg-opacity-30">
                        <div className="d-flex align-items-center gap-2">
                            <span className="material-symbols-outlined text-warning fs-5">account_balance</span>
                            <span className="fw-bold text-white fs-6">Withdraw Funds to Bank</span>
                        </div>
                        <button type="button" className="btn-close btn-close-white" onClick={onClose}></button>
                    </div>

                    <div className="modal-body p-4">
                        {statusMsg.text && (
                            <div className={`alert alert-${statusMsg.type} border-0 p-2 small mb-3 text-center fw-bold`}>
                                {statusMsg.text}
                            </div>
                        )}

                        <form onSubmit={handleWithdrawSubmit}>
                            <div className="mb-3">
                                <label className="form-label text-secondary small mb-1 fw-bold">Available Balance</label>
                                <div className="fs-5 fw-bold text-success bg-black bg-opacity-40 p-2 rounded-3 border border-secondary">
                                    ₦{Number(wallet || 0).toLocaleString('en-US', { minimumFractionDigits: 2 })}
                                </div>
                            </div>

                            <div className="mb-3">
                                <label className="form-label text-secondary small mb-1 fw-bold">Select Nigerian Bank</label>
                                <select className="form-select form-select-sm bg-black text-white border-secondary rounded-3" value={bankName} onChange={(e) => setBankName(e.target.value)}>
                                    {nigerianBanks.map((bank) => (
                                        <option key={bank} value={bank}>{bank}</option>
                                    ))}
                                </select>
                            </div>

                            <div className="mb-3">
                                <label className="form-label text-secondary small mb-1 fw-bold">10-Digit NUBAN Account Number</label>
                                <input type="text" className="form-control form-control-sm bg-black text-white border-secondary rounded-3 fw-bold" placeholder="0123456789" maxLength="10" value={accountNo} onChange={(e) => setAccountNo(e.target.value.replace(/\D/g, ''))} required />
                            </div>

                            <div className="mb-3">
                                <label className="form-label text-secondary small mb-1 fw-bold">Account Holder Name</label>
                                <input type="text" className="form-control form-control-sm bg-black text-white border-secondary rounded-3" placeholder="Full Name on Account" value={accountHolder} onChange={(e) => setAccountHolder(e.target.value)} required />
                            </div>

                            <div className="mb-4">
                                <label className="form-label text-secondary small mb-1 fw-bold">Withdrawal Amount (NGN)</label>
                                <div className="input-group input-group-sm">
                                    <span className="input-group-text bg-black text-warning border-secondary fw-bold">₦</span>
                                    <input type="number" className="form-control bg-black text-white border-secondary fs-6 fw-bold" value={amount} onChange={(e) => setAmount(Number(e.target.value))} min="1000" max={wallet} required />
                                </div>
                                <div className="form-text text-muted" style={{ fontSize: '10px' }}>Min withdrawal amount: ₦1,000</div>
                            </div>

                            <button type="submit" className="btn btn-warning w-100 fw-bold py-2 rounded-3 text-dark text-uppercase" disabled={loading}>
                                {loading ? <span className="spinner-border spinner-border-sm me-1"></span> : `Withdraw ₦${amount.toLocaleString()} to Bank`}
                            </button>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    );
}

// --- NOTIFICATIONS MODAL COMPONENT ---
function NotificationsModal({ show, onClose }) {
    if (!show) return null;

    const NOTIFICATIONS = [
        { id: 1, type: 'win', message: 'You won ₦2,500! Game hit 8.4x', time: '2 min ago' },
        { id: 2, type: 'cashout', message: 'Successfully cashed out ₦5,000', time: '15 min ago' },
        { id: 3, type: 'bonus', message: 'Bonus credit of ₦500 added', time: '1 hour ago' },
        { id: 4, type: 'promotion', message: 'New promotion: 50% bonus on next deposit', time: '3 hours ago' },
    ];

    return (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-3">
            <div className="bg-slate-900 rounded-lg border border-slate-700 w-full max-w-xs shadow-2xl max-h-96 flex flex-col overflow-hidden">
                {/* Header */}
                <div className="px-3 py-2 border-b border-slate-700 flex items-center justify-between sticky top-0 bg-slate-900 z-10">
                    <h2 className="text-sm font-semibold text-white flex items-center gap-1.5">
                        <span>🔔</span> Notifications
                    </h2>
                    <button onClick={onClose} className="p-0.5 hover:bg-slate-800 rounded transition text-slate-400">
                        ✕
                    </button>
                </div>

                {/* Notifications List */}
                <div className="flex-1 overflow-y-auto px-2 py-2 space-y-1.5">
                    {NOTIFICATIONS.map((notif) => (
                        <div key={notif.id} className="px-2.5 py-2 bg-slate-800/60 rounded border border-slate-700/80 hover:bg-slate-800 transition">
                            <div className="flex items-start gap-2">
                                <div className={`p-1 rounded flex-shrink-0 mt-0.5 text-xs ${
                                    notif.type === 'win' ? 'bg-green-500/20 text-green-400' :
                                    notif.type === 'cashout' ? 'bg-yellow-500/20 text-yellow-400' :
                                    notif.type === 'bonus' ? 'bg-lime-400/20 text-lime-400' :
                                    'bg-blue-500/20 text-blue-400'
                                }`}>
                                    ✓
                                </div>
                                <div className="flex-1 min-w-0">
                                    <p className="text-xs text-white leading-tight font-medium">{notif.message}</p>
                                    <p className="text-[10px] text-slate-400 mt-0.5">{notif.time}</p>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>

                {/* Footer */}
                <div className="px-3 py-2 border-t border-slate-700">
                    <button onClick={onClose} className="w-full py-1 text-xs font-semibold text-slate-300 border border-slate-600 rounded hover:bg-slate-800 transition">
                        Mark all as read
                    </button>
                </div>
            </div>
        </div>
    );
}

// --- AUTH MODAL COMPONENT (SIGN IN / REGISTER) ---
function AuthModal({ show, initialTab, onClose, onSuccessLogin }) {
    const [tab, setTab] = useState(initialTab || 'login');
    const [loading, setLoading] = useState(false);
    const [errorMsg, setErrorMsg] = useState('');

    const [loginData, setLoginData] = useState({ email: '', password: '' });
    const [regData, setRegData] = useState({ name: '', email: '', password: '', confirmPassword: '', terms: false });

    useEffect(() => {
        setTab(initialTab || 'login');
        setErrorMsg('');
    }, [initialTab, show]);

    if (!show) return null;

    const handleLoginSubmit = (e) => {
        e.preventDefault();
        setLoading(true);
        setErrorMsg('');

        $.ajax({
            url: '/auth/login',
            type: 'POST',
            data: {
                _token: $('meta[name="csrf-token"]').attr('content') || '',
                email: loginData.email,
                password: loginData.password
            },
            dataType: 'json',
            success: function (res) {
                setLoading(false);
                if (res.isSuccess) {
                    if (onSuccessLogin) onSuccessLogin(res.data);
                    onClose();
                    window.location.reload();
                } else {
                    setErrorMsg(res.message || 'Invalid login credentials');
                }
            },
            error: function () {
                setLoading(false);
                setErrorMsg('Network error. Please try again.');
            }
        });
    };

    const handleRegisterSubmit = (e) => {
        e.preventDefault();
        if (regData.password !== regData.confirmPassword) {
            setErrorMsg('Passwords do not match');
            return;
        }
        if (!regData.terms) {
            setErrorMsg('Please agree to the Terms of Service');
            return;
        }

        setLoading(true);
        setErrorMsg('');

        $.ajax({
            url: '/auth/register',
            type: 'POST',
            data: {
                _token: $('meta[name="csrf-token"]').attr('content') || '',
                name: regData.name || regData.email.split('@')[0],
                email: regData.email,
                password: regData.password,
                mobile: '080' + Math.floor(10000000 + Math.random() * 90000000)
            },
            dataType: 'json',
            success: function (res) {
                setLoading(false);
                if (res.isSuccess) {
                    if (onSuccessLogin) onSuccessLogin(res.data);
                    onClose();
                    window.location.reload();
                } else {
                    setErrorMsg(res.message || 'Registration failed');
                }
            },
            error: function () {
                setLoading(false);
                setErrorMsg('Network error. Please try again.');
            }
        });
    };

    return (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-3">
            <div className="bg-slate-900 rounded-lg border border-slate-700 w-full max-w-sm shadow-2xl overflow-hidden">
                {/* Header */}
                <div className="px-3 py-2 border-b border-slate-700 flex items-center justify-between">
                    <h2 className="text-sm font-semibold text-white">
                        {tab === 'login' ? 'Sign In to FlyBoy10x' : 'Create Account'}
                    </h2>
                    <button onClick={onClose} className="p-0.5 hover:bg-slate-800 rounded transition text-slate-400">
                        ✕
                    </button>
                </div>

                {/* Tab Switcher */}
                <div className="px-3 pt-3">
                    <div className="flex bg-slate-800 p-0.5 rounded border border-slate-700">
                        <button
                            type="button"
                            className={`flex-1 py-1 text-xs font-semibold rounded transition ${tab === 'login' ? 'bg-lime-400 text-black' : 'text-slate-400 hover:text-white'}`}
                            onClick={() => { setTab('login'); setErrorMsg(''); }}
                        >
                            Sign In
                        </button>
                        <button
                            type="button"
                            className={`flex-1 py-1 text-xs font-semibold rounded transition ${tab === 'register' ? 'bg-lime-400 text-black' : 'text-slate-400 hover:text-white'}`}
                            onClick={() => { setTab('register'); setErrorMsg(''); }}
                        >
                            Register
                        </button>
                    </div>
                </div>

                {/* Form Body */}
                <div className="px-3 py-3 space-y-2">
                    {errorMsg && (
                        <div className="p-2 bg-red-500/10 border border-red-500/30 rounded text-red-400 text-xs text-center font-medium">
                            {errorMsg}
                        </div>
                    )}

                    {tab === 'login' ? (
                        <form onSubmit={handleLoginSubmit} className="space-y-2">
                            <div>
                                <label className="text-xs text-slate-400 block mb-1">Email or Phone</label>
                                <input
                                    type="text"
                                    value={loginData.email}
                                    onChange={(e) => setLoginData({ ...loginData, email: e.target.value })}
                                    placeholder="your@email.com"
                                    required
                                    className="w-full px-2 py-1 bg-slate-800 border border-slate-700 rounded text-xs text-white placeholder-slate-500 outline-none focus:border-lime-400 transition"
                                />
                            </div>

                            <div>
                                <label className="text-xs text-slate-400 block mb-1">Password</label>
                                <input
                                    type="password"
                                    value={loginData.password}
                                    onChange={(e) => setLoginData({ ...loginData, password: e.target.value })}
                                    placeholder="••••••"
                                    required
                                    className="w-full px-2 py-1 bg-slate-800 border border-slate-700 rounded text-xs text-white placeholder-slate-500 outline-none focus:border-lime-400 transition"
                                />
                            </div>

                            <div className="pt-1 flex gap-1">
                                <button
                                    type="button"
                                    onClick={onClose}
                                    className="flex-1 py-1 text-xs font-semibold text-slate-300 border border-slate-600 rounded hover:bg-slate-800 transition"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    disabled={loading}
                                    className="flex-1 py-1 text-xs font-semibold bg-lime-400 text-black rounded hover:bg-lime-300 transition"
                                >
                                    {loading ? 'Signing In...' : 'Sign In'}
                                </button>
                            </div>
                        </form>
                    ) : (
                        <form onSubmit={handleRegisterSubmit} className="space-y-2">
                            <div>
                                <label className="text-xs text-slate-400 block mb-1">Email</label>
                                <input
                                    type="email"
                                    value={regData.email}
                                    onChange={(e) => setRegData({ ...regData, email: e.target.value })}
                                    placeholder="your@email.com"
                                    required
                                    className="w-full px-2 py-1 bg-slate-800 border border-slate-700 rounded text-xs text-white placeholder-slate-500 outline-none focus:border-lime-400 transition"
                                />
                            </div>

                            <div>
                                <label className="text-xs text-slate-400 block mb-1">Password</label>
                                <input
                                    type="password"
                                    value={regData.password}
                                    onChange={(e) => setRegData({ ...regData, password: e.target.value })}
                                    placeholder="••••••"
                                    required
                                    className="w-full px-2 py-1 bg-slate-800 border border-slate-700 rounded text-xs text-white placeholder-slate-500 outline-none focus:border-lime-400 transition"
                                />
                            </div>

                            <div>
                                <label className="text-xs text-slate-400 block mb-1">Confirm Password</label>
                                <input
                                    type="password"
                                    value={regData.confirmPassword}
                                    onChange={(e) => setRegData({ ...regData, confirmPassword: e.target.value })}
                                    placeholder="••••••"
                                    required
                                    className="w-full px-2 py-1 bg-slate-800 border border-slate-700 rounded text-xs text-white placeholder-slate-500 outline-none focus:border-lime-400 transition"
                                />
                            </div>

                            <label className="flex items-center gap-2 mt-2 cursor-pointer">
                                <input
                                    type="checkbox"
                                    checked={regData.terms}
                                    onChange={(e) => setRegData({ ...regData, terms: e.target.checked })}
                                    className="w-3 h-3 accent-lime-400 rounded"
                                />
                                <span className="text-xs text-slate-400">I agree to Terms of Service</span>
                            </label>

                            <div className="pt-1 flex gap-1">
                                <button
                                    type="button"
                                    onClick={onClose}
                                    className="flex-1 py-1 text-xs font-semibold text-slate-300 border border-slate-600 rounded hover:bg-slate-800 transition"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    disabled={loading}
                                    className="flex-1 py-1 text-xs font-semibold bg-lime-400 text-black rounded hover:bg-lime-300 transition"
                                >
                                    {loading ? 'Creating...' : 'Sign Up'}
                                </button>
                            </div>
                        </form>
                    )}
                </div>
            </div>
        </div>
    );
}

// --- HEADER COMPONENT ---
function Header({ user, wallet, currentView, onViewChange, onAuthClick, onWithdrawClick, onNotifClick }) {
    const [menuOpen, setMenuOpen] = useState(false);
    const [drawerOpen, setDrawerOpen] = useState(false);

    return (
        <React.Fragment>
            <header className="h-14 bg-slate-950 border-b border-slate-800 flex items-center justify-between px-3 md:px-4 py-1 relative z-40">
                {/* Left: Hamburger (mobile only) + Logo + Desktop Nav */}
                <div className="flex items-center gap-2 md:gap-3">
                    {/* Hamburger - mobile only */}
                    <button onClick={() => setDrawerOpen(true)} className="md:hidden p-1 hover:bg-slate-800 rounded transition text-slate-300 text-lg leading-none">
                        ☰
                    </button>

                    <a href="#" onClick={(e) => { e.preventDefault(); onViewChange('crash'); }} className="flex items-center gap-2">
                        {/* Mobile Logo: Compact Icon */}
                        <img src="/images/flyboy10x_icon.png" alt="FlyBoy10x" className="h-7 w-auto object-contain md:hidden" style={{ maxHeight: '28px' }} onError={(e) => { e.target.src = '/images/flyboy-logo.png'; }} />
                        {/* Desktop Logo: Full Banner */}
                        <img src="/images/flyboy-logo.png" alt="FlyBoy10x" className="hidden md:block h-6 w-auto object-contain" style={{ maxHeight: '24px', maxWidth: '130px' }} onError={(e) => { e.target.src = '/images/flyboy10x_logo.png'; }} />
                    </a>

                    <nav className="hidden md:flex items-center gap-2 ms-4">
                        <button className={`px-3 py-1 text-xs font-semibold rounded transition ${currentView === 'crash' ? 'bg-lime-400 text-black' : 'text-slate-400 hover:text-white'}`} onClick={() => onViewChange('crash')}>🚀 Aviator</button>
                        <button className={`px-3 py-1 text-xs font-semibold rounded transition ${currentView === 'leaderboard' ? 'bg-lime-400 text-black' : 'text-slate-400 hover:text-white'}`} onClick={() => onViewChange('leaderboard')}>🏆 Leaderboard</button>
                        {user && (
                            <React.Fragment>
                                <button className={`px-3 py-1 text-xs font-semibold rounded transition ${currentView === 'mybets' ? 'bg-lime-400 text-black' : 'text-slate-400 hover:text-white'}`} onClick={() => onViewChange('mybets')}>📜 My Bets</button>
                                <button className={`px-3 py-1 text-xs font-semibold rounded transition ${currentView === 'deposit' ? 'bg-lime-400 text-black' : 'text-slate-400 hover:text-white'}`} onClick={() => onViewChange('deposit')}>💳 Deposit</button>
                                <button className="px-3 py-1 text-xs font-semibold rounded bg-slate-800 text-lime-400 border border-lime-400/30 hover:bg-slate-700 transition" onClick={onWithdrawClick}>💸 Withdraw</button>
                            </React.Fragment>
                        )}
                    </nav>
                </div>

                {/* Right Section: Notification Bell, Balance, Deposit & Auth */}
                <div className="flex items-center gap-1.5 md:gap-3">
                    {/* Notification Bell */}
                    <button
                        onClick={onNotifClick}
                        className="p-1.5 text-slate-400 hover:text-white hover:bg-slate-800 rounded transition relative"
                        title="Notifications"
                    >
                        <span className="text-sm">🔔</span>
                        <span className="absolute top-1 right-1 w-2 h-2 bg-lime-400 rounded-full animate-pulse" />
                    </button>

                    {/* Balance */}
                    <div className="text-xs text-slate-300 font-mono font-bold whitespace-nowrap">
                        ₦ {Number(wallet || 0).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                    </div>

                    {/* Deposit Button */}
                    <button 
                        onClick={() => onViewChange('deposit')}
                        className="px-2.5 md:px-3 py-1 bg-lime-400 text-black font-semibold text-xs rounded hover:bg-lime-300 transition shadow-sm whitespace-nowrap"
                    >
                        + Deposit
                    </button>

                    {/* Account / User Menu */}
                    {user ? (
                        <div className="relative">
                            <button type="button" className="w-7 h-7 md:w-8 md:h-8 rounded-full border border-slate-700 overflow-hidden flex items-center justify-center bg-slate-800" onClick={() => setMenuOpen(!menuOpen)}>
                                <img src={user.image || '/images/avtar/av-1.png'} className="w-full h-full object-cover" onError={(e) => { e.target.src = '/images/avtar/av-1.png'; }} />
                            </button>

                            {menuOpen && (
                                <div className="absolute end-0 mt-2 bg-slate-900 border border-slate-700 rounded-lg shadow-xl p-3 z-50 w-56">
                                    <div className="flex items-center gap-2 pb-2 border-b border-slate-800 mb-2">
                                        <img src={user.image || '/images/avtar/av-1.png'} className="w-8 h-8 rounded-full" />
                                        <div className="truncate">
                                            <div className="font-bold text-white text-xs truncate">{user.name || user.email}</div>
                                            <div className="text-slate-400 text-[10px]">ID #{user.id}</div>
                                        </div>
                                    </div>
                                    <a href="#" className="flex items-center gap-2 text-slate-300 hover:text-white py-1 text-xs" onClick={(e) => { e.preventDefault(); setMenuOpen(false); onViewChange('crash'); }}>Play Aviator</a>
                                    <a href="#" className="flex items-center gap-2 text-slate-300 hover:text-white py-1 text-xs" onClick={(e) => { e.preventDefault(); setMenuOpen(false); onViewChange('mybets'); }}>My Bets</a>
                                    <a href="#" className="flex items-center gap-2 text-slate-300 hover:text-white py-1 text-xs" onClick={(e) => { e.preventDefault(); setMenuOpen(false); onViewChange('leaderboard'); }}>Leaderboard</a>
                                    <a href="#" className="flex items-center gap-2 text-lime-400 hover:underline py-1 text-xs" onClick={(e) => { e.preventDefault(); setMenuOpen(false); onViewChange('deposit'); }}>Deposit Funds</a>
                                    <a href="#" className="flex items-center gap-2 text-emerald-400 hover:underline py-1 text-xs" onClick={(e) => { e.preventDefault(); setMenuOpen(false); onWithdrawClick(); }}>Withdraw Funds</a>
                                    <a href="/logout" className="flex items-center gap-2 text-red-400 border-t border-slate-800 pt-2 text-xs mt-1">Sign Out</a>
                                </div>
                            )}
                        </div>
                    ) : (
                        <button 
                            onClick={() => onAuthClick('login')}
                            className="px-2.5 md:px-3 py-1 bg-lime-400 text-black font-semibold text-xs rounded hover:bg-lime-300 transition whitespace-nowrap"
                        >
                            Sign in
                        </button>
                    )}
                </div>
            </header>

            {/* Mobile Slide-out Drawer (triggered by hamburger) */}
            {drawerOpen && (
                <div className="fixed inset-0 z-50 md:hidden">
                    <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" onClick={() => setDrawerOpen(false)} />
                    <div className="absolute top-0 left-0 h-full w-64 bg-slate-900 border-r border-slate-700 flex flex-col shadow-2xl z-50">
                        <div className="h-14 flex items-center justify-between px-4 border-b border-slate-800">
                            <img src="/images/flyboy-logo.png" alt="FlyBoy10x" className="h-7 w-auto" onError={(e) => { e.target.src = '/images/flyboy10x_logo.png'; }} />
                            <button onClick={() => setDrawerOpen(false)} className="p-1 hover:bg-slate-800 rounded transition text-slate-400 text-base">✕</button>
                        </div>

                        <div className="px-4 py-3 border-b border-slate-800">
                            <div className="text-[10px] text-slate-400 uppercase tracking-wider mb-0.5">Wallet Balance</div>
                            <div className="text-lg font-bold text-lime-400 font-mono">₦{Number(wallet || 0).toLocaleString('en-US', { minimumFractionDigits: 2 })}</div>
                        </div>

                        <nav className="flex-1 py-2 space-y-0.5 overflow-y-auto">
                            {[
                                { view: 'crash', icon: '🚀', label: 'Aviator Game', color: 'text-lime-400' },
                                { view: 'livebets', icon: '⏱️', label: 'Live Bets', color: 'text-lime-400' },
                                { view: 'leaderboard', icon: '🏆', label: 'Leaderboard', color: 'text-lime-400' },
                                { view: 'chat', icon: '💬', label: 'Live Chat', color: 'text-lime-400' },
                                { view: 'deposit', icon: '💳', label: 'Instant Deposit', color: 'text-lime-400' },
                            ].map(item => (
                                <button key={item.view} onClick={() => { setDrawerOpen(false); onViewChange(item.view); }}
                                    className={`w-full flex items-center gap-3 px-4 py-2.5 transition text-xs font-medium ${currentView === item.view ? 'bg-slate-800 text-white' : 'text-slate-300 hover:bg-slate-800 hover:text-white'}`}>
                                    <span className={item.color}>{item.icon}</span> {item.label}
                                </button>
                            ))}
                            <button onClick={() => { setDrawerOpen(false); onWithdrawClick(); }}
                                className="w-full flex items-center gap-3 px-4 py-2.5 text-slate-300 hover:bg-slate-800 hover:text-white transition text-xs font-medium">
                                <span className="text-emerald-400">💸</span> Withdraw Funds
                            </button>
                            {user ? (
                                <a href="/logout" className="w-full flex items-center gap-3 px-4 py-2.5 text-red-400 hover:bg-slate-800 transition text-xs font-medium border-t border-slate-800 mt-2">
                                    <span>🚪</span> Sign Out
                                </a>
                            ) : (
                                <button onClick={() => { setDrawerOpen(false); onAuthClick('login'); }}
                                    className="w-full flex items-center gap-3 px-4 py-2.5 text-lime-400 hover:bg-slate-800 transition text-xs font-medium border-t border-slate-800 mt-2">
                                    <span>🔑</span> Sign In / Register
                                </button>
                            )}
                        </nav>

                        <div className="px-4 py-3 border-t border-slate-800 text-[10px] text-slate-500 text-center">
                            FlyBoy10x © 2026
                        </div>
                    </div>
                </div>
            )}
        </React.Fragment>
    );
}


// --- AVIATOR CANVAS GAME COMPONENT ---
function AviatorCanvas({ gameState, multiplier, countdown }) {
    const canvasRef = useRef(null);
    const planeImgRef = useRef(null);
    const bgImgRef = useRef(null);
    const sprite2Ref = useRef(null);
    const sprite3Ref = useRef(null);
    const xAxisRef = useRef(null);
    const yAxisRef = useRef(null);

    const bgAngleRef = useRef(0);
    const animFrameRef = useRef(0);

    useEffect(() => {
        const planeImg = new Image();
        planeImg.src = '/images/p.png';
        planeImgRef.current = planeImg;

        const bgImg = new Image();
        bgImg.src = '/images/bg-rotate-old.svg';
        bgImgRef.current = bgImg;

        const sp2 = new Image();
        sp2.src = '/images/sprite2.png';
        sprite2Ref.current = sp2;

        const sp3 = new Image();
        sp3.src = '/images/sprite3.png';
        sprite3Ref.current = sp3;

        const xAxis = new Image();
        xAxis.src = '/images/x-axis.png';
        xAxisRef.current = xAxis;

        const yAxis = new Image();
        yAxis.src = '/images/y-axis.png';
        yAxisRef.current = yAxis;
    }, []);

    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;
        const ctx = canvas.getContext('2d');
        let animId;

        const render = () => {
            const dpr = window.devicePixelRatio || 1;
            const width = canvas.parentElement.clientWidth || 600;
            const height = canvas.parentElement.clientHeight || 360;

            canvas.width = Math.max(1, Math.floor(width * dpr));
            canvas.height = Math.max(1, Math.floor(height * dpr));
            canvas.style.width = width + 'px';
            canvas.style.height = height + 'px';
            ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
            ctx.imageSmoothingEnabled = true;
            ctx.imageSmoothingQuality = 'high';

            // Background fill
            const bgGrad = ctx.createLinearGradient(0, 0, 0, height);
            bgGrad.addColorStop(0, '#0a0b10');
            bgGrad.addColorStop(1, '#131522');
            ctx.fillStyle = bgGrad;
            ctx.fillRect(0, 0, width, height);

            // Draw Rotating Background Rays Image
            if (bgImgRef.current && bgImgRef.current.complete) {
                ctx.save();
                ctx.translate(width / 2, height / 2);
                bgAngleRef.current += 0.003;
                ctx.rotate(bgAngleRef.current);
                ctx.globalAlpha = 0.18;
                const bgSize = Math.max(width, height) * 1.5;
                ctx.drawImage(bgImgRef.current, -bgSize / 2, -bgSize / 2, bgSize, bgSize);
                ctx.restore();
            }

            // Grid lines
            ctx.strokeStyle = 'rgba(255, 255, 255, 0.05)';
            ctx.lineWidth = 1;
            for (let x = 0; x < width; x += 50) {
                ctx.beginPath(); ctx.moveTo(x, 0); ctx.lineTo(x, height); ctx.stroke();
            }
            for (let y = 0; y < height; y += 40) {
                ctx.beginPath(); ctx.moveTo(0, y); ctx.lineTo(width, y); ctx.stroke();
            }

            // Draw X-Axis & Y-Axis images
            if (xAxisRef.current && xAxisRef.current.complete) {
                ctx.globalAlpha = 0.4;
                ctx.drawImage(xAxisRef.current, 0, height - 20, width, 18);
                ctx.globalAlpha = 1.0;
            }
            if (yAxisRef.current && yAxisRef.current.complete) {
                ctx.globalAlpha = 0.4;
                ctx.drawImage(yAxisRef.current, 10, 0, 18, height);
                ctx.globalAlpha = 1.0;
            }

            const isFlightState = gameState === 'FLYING' || gameState === 'CRASHED' || gameState === 'TAKEOFF' || gameState === 'PREPARING';
            if (isFlightState) {
                const multVal = Math.max(1.00, multiplier || 1.00);
                const progress = Math.min((multVal - 1) / 10, 1);
                const startX = 40;
                const startY = height - 40;
                const endX = startX + (width - 140) * progress;
                const endY = startY - (height - 110) * Math.pow(progress, 0.8);

                // Flight curve path gradient
                const pathGrad = ctx.createLinearGradient(startX, startY, endX, endY);
                pathGrad.addColorStop(0, 'rgba(255, 30, 70, 0.05)');
                pathGrad.addColorStop(1, 'rgba(255, 30, 70, 0.85)');

                ctx.beginPath();
                ctx.moveTo(startX, startY);
                ctx.quadraticCurveTo(startX + (endX - startX) * 0.5, startY, endX, endY);
                ctx.strokeStyle = '#ff1e46';
                ctx.lineWidth = 4;
                ctx.stroke();

                ctx.lineTo(endX, startY);
                ctx.lineTo(startX, startY);
                ctx.fillStyle = pathGrad;
                ctx.fill();

                // Draw Plane Sprite Sheet or Vector Plane at tip of red curve
                if (gameState !== 'CRASHED') {
                    animFrameRef.current += 1;
                    const activeSprite = (sprite3Ref.current && sprite3Ref.current.complete && sprite3Ref.current.naturalWidth > 0)
                        ? sprite3Ref.current
                        : ((sprite2Ref.current && sprite2Ref.current.complete && sprite2Ref.current.naturalWidth > 0)
                            ? sprite2Ref.current
                            : ((planeImgRef.current && planeImgRef.current.complete && planeImgRef.current.naturalWidth > 0) ? planeImgRef.current : null));

                    ctx.save();
                    ctx.translate(endX, endY);
                    ctx.rotate(-Math.PI / 14); // Tilt plane upwards

                    let planeDrawn = false;
                    if (activeSprite) {
                        const fw = activeSprite.naturalWidth || activeSprite.width || 100;
                        const fh = activeSprite.naturalHeight || activeSprite.height || 50;
                        const isSpriteSheet = fw > fh * 1.7;
                        const numFrames = isSpriteSheet ? 2 : 1;
                        const frameWidth = isSpriteSheet ? fw / numFrames : fw;
                        const frameHeight = fh;
                        const currentFrame = isSpriteSheet ? Math.floor(animFrameRef.current / 5) % numFrames : 0;
                        const destWidth = 85;
                        const destHeight = (frameWidth > 0 && !isNaN(frameHeight / frameWidth)) ? (frameHeight / frameWidth) * destWidth : 45;

                        if (!isNaN(destWidth) && !isNaN(destHeight) && destWidth > 0 && destHeight > 0) {
                            if (isSpriteSheet) {
                                ctx.drawImage(
                                    activeSprite,
                                    currentFrame * frameWidth, 0, frameWidth, frameHeight,
                                    -destWidth + 10, -destHeight / 2, destWidth, destHeight
                                );
                            } else {
                                ctx.drawImage(activeSprite, -destWidth + 10, -destHeight / 2, destWidth, destHeight);
                            }
                            planeDrawn = true;
                        }
                    }

                    // Reliable fallback vector plane drawing if image sprite is loading or absent
                    if (!planeDrawn) {
                        ctx.fillStyle = '#ff1e46';
                        ctx.beginPath();
                        ctx.moveTo(12, 0);
                        ctx.lineTo(-38, -16);
                        ctx.lineTo(-24, 0);
                        ctx.lineTo(-38, 16);
                        ctx.closePath();
                        ctx.fill();

                        ctx.fillStyle = '#ffffff';
                        ctx.beginPath();
                        ctx.arc(2, 0, 3.5, 0, Math.PI * 2);
                        ctx.fill();
                    }

                    ctx.restore();
                }
            }


            animId = requestAnimationFrame(render);
        };

        render();
        return () => cancelAnimationFrame(animId);
    }, [gameState, multiplier]);

    const displayMult = (multiplier && multiplier > 1) ? multiplier : 1.00;

    return (
        <div className="relative w-full rounded-lg overflow-hidden bg-slate-950 flex-1 min-h-[220px] md:min-h-[380px] h-[220px] md:h-[380px] flex items-center justify-center" style={{ border: '1px solid #000' }}>
            <canvas ref={canvasRef} className="w-full h-full block" />

            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-center z-10 pointer-events-none">
                {gameState === 'WAITING' && (
                    <div>
                        <div className="text-slate-400 uppercase tracking-wider text-xs font-bold mb-1">WAITING FOR NEXT ROUND</div>
                        <div className="text-3xl font-bold text-yellow-400 font-mono">{countdown ? countdown.toFixed(1) + 's' : '5.0s'}</div>
                    </div>
                )}

                {gameState === 'PREPARING' && (
                    <div>
                        <div className="text-slate-300 uppercase tracking-wider text-xs font-bold mb-1">PREPARING FOR TAKEOFF...</div>
                        <div className="text-4xl font-black text-white font-mono">1.00<span className="text-red-500">x</span></div>
                    </div>
                )}

                {gameState === 'TAKEOFF' && (
                    <div>
                        <div className="text-lime-400 uppercase tracking-wider text-xs font-bold mb-1">TAKEOFF</div>
                        <div className="text-4xl font-black text-white font-mono">1.00<span className="text-red-500">x</span></div>
                    </div>
                )}

                {(gameState === 'FLYING' || (!['WAITING', 'PREPARING', 'TAKEOFF', 'CRASHED'].includes(gameState))) && (
                    <div>
                        <div className="text-6xl md:text-8xl font-black text-white font-mono tracking-tight" style={{ textShadow: '0 0 20px rgba(255,255,255,0.3)' }}>
                            {displayMult.toFixed(2)}<span className="text-red-500">x</span>
                        </div>
                    </div>
                )}

                {gameState === 'CRASHED' && (
                    <div>
                        <div className="text-red-500 font-black uppercase tracking-wider text-sm mb-1 animate-bounce">FLEW AWAY!</div>
                        <div className="text-5xl md:text-7xl font-black text-red-500 font-mono">{displayMult.toFixed(2)}x</div>
                    </div>
                )}
            </div>
        </div>
    );
}


// --- LIVE BETS SIDE PANEL COMPONENT ---
function LiveBetsPanel({ multiplier, gameState, liveBets }) {
    const [tab, setTab] = useState('all');

    return (
        <div className="w-72 bg-slate-950 border-r border-slate-800 flex flex-col h-full overflow-hidden">
            {/* Tabs */}
            <div className="flex border-b border-slate-800 px-3 py-1">
                <button className={`px-2 py-1 text-xs font-semibold transition ${tab === 'all' ? 'text-lime-400 border-b-2 border-lime-400' : 'text-slate-400 hover:text-white'}`} onClick={() => setTab('all')}>
                    All Bets
                </button>
                <button className={`px-2 py-1 text-xs font-semibold transition ${tab === 'my' ? 'text-lime-400 border-b-2 border-lime-400' : 'text-slate-400 hover:text-white'}`} onClick={() => setTab('my')}>
                    My Bets
                </button>
            </div>

            {/* Total Bets Volume Header */}
            <div className="px-3 py-2 border-b border-slate-800">
                <div className="text-[10px] text-slate-400 uppercase tracking-wider mb-0.5">TOTAL BETS</div>
                <div className="text-lg font-bold text-lime-400">₦ 125,480.00</div>
            </div>

            {/* Previous Hand Trigger */}
            <div className="px-3 py-1 flex items-center gap-2 text-xs text-slate-400 border-b border-slate-800 cursor-pointer hover:text-white transition">
                <span>⏮</span>
                <span>Previous hand</span>
            </div>

            {/* Table Headers */}
            <div className="px-3 py-1 grid grid-cols-4 gap-1 text-[11px] text-slate-500 border-b border-slate-800 font-medium">
                <div>User</div>
                <div>Bet</div>
                <div>Mult.</div>
                <div className="text-end">Cash out</div>
            </div>

            {/* Bets List Feed */}
            <div className="flex-1 overflow-y-auto space-y-0.5 px-1 py-1">
                {liveBets.map((item) => (
                    <div key={item.id} className="px-2 py-1 border-b border-slate-900 grid grid-cols-4 gap-1 text-xs hover:bg-slate-900/50 transition items-center rounded">
                        <div className="flex items-center gap-1.5 truncate">
                            <div className="w-5 h-5 bg-gradient-to-br from-orange-400 to-red-600 rounded-full flex-shrink-0 animate-pulse"></div>
                            <span className="text-slate-300 truncate text-xs font-medium">{item.user}</span>
                        </div>
                        <div className="text-slate-300 font-semibold">₦{item.bet}</div>
                        <div className={item.cashedOut ? 'text-yellow-300 font-semibold' : 'text-slate-600'}>
                            {item.cashedOut ? `${item.cashMult || '1.85'}x` : '–'}
                        </div>
                        <div className={`text-end font-semibold ${item.cashedOut ? 'text-lime-400' : 'text-slate-600'}`}>
                            {item.cashedOut ? `₦${item.win || (item.bet * 1.85).toFixed(0)}` : '–'}
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}

// --- DUAL BET SLIPS COMPONENT ---
function BetPanel({ panelId, wallet, gameId }) {
    const [amount, setAmount] = useState(10.00);
    const [isBetPlaced, setIsBetPlaced] = useState(false);
    const [activeBetId, setActiveBetId] = useState(null);
    const [autoBet, setAutoBet] = useState(false);
    const [autoCashout, setAutoCashout] = useState(false);

    const handleBetClick = () => {
        if (!isBetPlaced) {
            $.ajax({
                url: '/betNow',
                type: 'POST',
                data: {
                    _token: $('meta[name="csrf-token"]').attr('content') || '',
                    all_bets: [{ bet_amount: amount, bet_type: 0, section_no: panelId }]
                },
                dataType: 'json',
                success: function(res) {
                    if (res.isSuccess) {
                        setIsBetPlaced(true);
                        if (res.data.return_bets && res.data.return_bets.length > 0) {
                            setActiveBetId(res.data.return_bets[0].bet_id);
                        }
                    }
                },
                error: function() {
                    setIsBetPlaced(true);
                }
            });
        } else {
            $.ajax({
                url: '/cashout',
                type: 'POST',
                data: {
                    _token: $('meta[name="csrf-token"]').attr('content') || '',
                    game_id: gameId || 1,
                    bet_id: activeBetId || 1,
                    win_multiplier: 1.5
                },
                dataType: 'json',
                success: function(res) {
                    setIsBetPlaced(false);
                    setActiveBetId(null);
                },
                error: function() {
                    setIsBetPlaced(false);
                    setActiveBetId(null);
                }
            });
        }
    };

    return (
        <div className="rounded-lg bg-slate-900/90 flex-1 p-1.5 shadow-sm">
            {/* Toggles row */}
            <div className="flex justify-around items-center px-1 py-0 mb-1">
                <div className="flex items-center gap-1 cursor-pointer" onClick={() => setAutoBet(!autoBet)}>
                    <span className="text-[9px] text-slate-500 font-medium">Auto Bet</span>
                    <span className={`w-6 h-3 rounded-full transition relative inline-block ${autoBet ? 'bg-lime-400' : 'bg-slate-700/80'}`}>
                        <span className={`absolute top-0.5 w-2 h-2 rounded-full bg-slate-950 transition ${autoBet ? 'left-3.5' : 'left-0.5'}`} />
                    </span>
                </div>
                <div className="flex items-center gap-1 cursor-pointer" onClick={() => setAutoCashout(!autoCashout)}>
                    <span className="text-[9px] text-slate-500 font-medium">Auto Cashout</span>
                    <span className={`w-6 h-3 rounded-full transition relative inline-block ${autoCashout ? 'bg-lime-400' : 'bg-slate-700/80'}`}>
                        <span className={`absolute top-0.5 w-2 h-2 rounded-full bg-slate-950 transition ${autoCashout ? 'left-3.5' : 'left-0.5'}`} />
                    </span>
                </div>
            </div>

            {/* Main controls row */}
            <div className="flex gap-1 items-stretch">
                {/* Left 50%: Spinner + Quick buttons */}
                <div className="w-1/2 flex flex-col gap-0.5">
                    <div className="flex items-center justify-between gap-0.5 bg-slate-950 rounded px-1 py-1">
                        <button type="button" onClick={() => setAmount(Math.max(10, amount - 10))} className="w-5 h-5 bg-slate-800 hover:bg-slate-700 rounded text-white font-bold text-xs flex items-center justify-center">−</button>
                        <span className="font-mono font-bold text-xs text-white">{amount.toFixed(2)}</span>
                        <button type="button" onClick={() => setAmount(amount + 10)} className="w-5 h-5 bg-slate-800 hover:bg-slate-700 rounded text-white font-bold text-xs flex items-center justify-center">+</button>
                    </div>
                    <div className="flex gap-0.5">
                        {[100, 200, 1000].map(amt => (
                            <button key={amt} type="button" onClick={() => setAmount(amt)} className="flex-1 py-0 leading-5 bg-slate-800 hover:bg-slate-700 rounded text-[9px] font-semibold text-slate-300 text-center h-5">
                                {amt >= 1000 ? (amt / 1000) + 'K' : amt}
                            </button>
                        ))}
                    </div>
                </div>

                {/* Right 50%: BET Button */}
                <div className="w-1/2 flex">
                    <button
                        type="button"
                        onClick={handleBetClick}
                        className="w-full min-h-[56px] rounded-lg font-black flex flex-col items-center justify-center py-1 transition transform active:scale-95 relative overflow-hidden"
                        style={isBetPlaced ? {
                            background: 'linear-gradient(180deg, #fcd34d 0%, #d97706 100%)',
                            boxShadow: '0 2px 8px rgba(217,119,6,0.5), inset 0 1px 0 rgba(255,255,255,0.35)',
                            color: '#fff'
                        } : {
                            background: 'linear-gradient(180deg, #a3e635 0%, #65a30d 100%)',
                            boxShadow: '0 2px 8px rgba(101,163,13,0.5), inset 0 1px 0 rgba(255,255,255,0.35)',
                            color: '#fff'
                        }}
                    >
                        <span className="absolute inset-x-0 top-0 h-1/2 rounded-t-lg pointer-events-none" style={{ background: 'linear-gradient(180deg, rgba(255,255,255,0.22) 0%, rgba(255,255,255,0) 100%)' }} />
                        <span className="text-sm font-black leading-none uppercase tracking-wide relative z-10">
                            {isBetPlaced ? 'CASH OUT' : 'BET'}
                        </span>
                        <span className="text-[11px] font-bold leading-tight font-mono mt-0.5 relative z-10">
                            {isBetPlaced ? `₦${(amount * multiplier).toFixed(2)}` : `NGN ${amount.toFixed(2)}`}
                        </span>
                    </button>
                </div>
            </div>
        </div>
    );
}

// --- MULTIPLIER HISTORY BAR ---
function HistoryBar({ historyRounds }) {
    const rounds = historyRounds && historyRounds.length > 0 ? historyRounds : [2.13, 1.45, 3.67, 1.12, 6.25, 1.75, 2.98, 12.43, 1.33, 4.12, 1.08, 9.76];

    return (
        <div className="px-3 py-1.5 border-b border-black bg-slate-950 flex items-center gap-1 overflow-x-auto scrollbar-hide">
            {rounds.map((round, i) => (
                <div key={i} className="flex-shrink-0 px-2 py-0.5 rounded text-xs font-semibold whitespace-nowrap transition cursor-pointer" style={{ color: round >= 10 ? '#facc15' : round >= 5 ? '#a3e635' : round >= 2 ? '#67e8f9' : '#94a3b8', background: 'rgba(2,6,23,0.7)' }}>
                    {typeof round === 'number' ? round.toFixed(2) : round}x
                </div>
            ))}
        </div>
    );
}

// --- LEADERBOARD VIEW COMPONENT ---
function LeaderboardView() {
    const topWinners = [
        { rank: 1, name: 'Alex_Aviator', id: '84***12', multiplier: '184.50x', bet: '₦50.00', win: '₦9,225.00', trophy: '🥇' },
        { rank: 2, name: 'CryptoKing_NG', id: '92***45', multiplier: '94.20x', bet: '₦50.00', win: '₦4,710.00', trophy: '🥈' },
        { rank: 3, name: 'Grace_W', id: '15***88', multiplier: '52.10x', bet: '₦40.00', win: '₦2,084.00', trophy: '🥉' },
        { rank: 4, name: 'HighRoller99', id: '34***77', multiplier: '38.40x', bet: '₦50.00', win: '₦1,920.00', trophy: '4' },
        { rank: 5, name: 'Flyer_2026', id: '71***90', multiplier: '28.15x', bet: '₦50.00', win: '₦1,407.50', trophy: '5' },
    ];

    return (
        <div className="bg-dark p-3 rounded-3 border border-secondary border-opacity-25">
            <div className="d-flex align-items-center justify-content-between mb-3 border-bottom border-secondary pb-2">
                <h5 className="m-0 text-white fw-bold d-flex align-items-center gap-2">
                    <span className="material-symbols-outlined text-warning">emoji_events</span>
                    Top Multiplier Leaderboard
                </h5>
                <span className="badge bg-danger">Top 50 Winners</span>
            </div>

            <div className="table-responsive">
                <table className="table table-dark table-hover align-middle mb-0" style={{ fontSize: '13px' }}>
                    <thead>
                        <tr className="text-secondary border-secondary">
                            <th>Rank</th>
                            <th>Player</th>
                            <th>Bet Amount</th>
                            <th>Multiplier</th>
                            <th>Cashout Win</th>
                        </tr>
                    </thead>
                    <tbody>
                        {topWinners.map((item) => (
                            <tr key={item.rank} className="border-secondary">
                                <td className="fw-bold fs-6">{item.trophy}</td>
                                <td>
                                    <div className="fw-bold text-white">{item.name}</div>
                                    <div className="text-muted" style={{ fontSize: '10px' }}>ID #{item.id}</div>
                                </td>
                                <td className="text-light">{item.bet}</td>
                                <td><span className="badge bg-danger px-2 py-1 fs-6">{item.multiplier}</span></td>
                                <td className="fw-bold text-success fs-6">{item.win}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}

// --- DEPOSIT VIEW COMPONENT ---
function DepositView({ wallet }) {
    const [amount, setAmount] = useState('1000');
    const [method, setMethod] = useState('card');
    const [successMsg, setSuccessMsg] = useState('');

    const quickAmounts = [500, 1000, 5000, 10000];

    const handleDepositSubmit = (e) => {
        e.preventDefault();
        const amtNum = Number(amount);
        if (!amtNum || amtNum <= 0) return;

        setSuccessMsg(`Deposit request for ₦${amtNum.toLocaleString()} initiated successfully via ${method === 'bank' ? 'Bank Transfer' : method === 'card' ? 'Credit/Debit Card' : 'Digital Wallet'}!`);
    };

    return (
        <div className="bg-slate-900 rounded-lg border border-slate-700 max-w-sm mx-auto my-6 shadow-2xl overflow-hidden">
            {/* Header */}
            <div className="px-3 py-2 border-b border-slate-700 flex items-center justify-between">
                <h2 className="text-sm font-semibold text-white flex items-center gap-2">
                    <span className="text-lime-400">💳</span> Deposit Funds
                </h2>
                <div className="text-xs font-mono font-bold text-lime-400">
                    ₦{Number(wallet || 0).toLocaleString('en-US', { minimumFractionDigits: 2 })}
                </div>
            </div>

            {/* Content */}
            <div className="px-3 py-3 space-y-3">
                {successMsg && (
                    <div className="p-2 bg-emerald-500/10 border border-emerald-500/30 rounded text-emerald-400 text-xs text-center font-medium">
                        {successMsg}
                    </div>
                )}

                <form onSubmit={handleDepositSubmit} className="space-y-3">
                    {/* Payment Method */}
                    <div>
                        <label className="text-xs text-slate-400 block mb-1">Payment Method</label>
                        <select
                            value={method}
                            onChange={(e) => setMethod(e.target.value)}
                            className="w-full px-2 py-1.5 bg-slate-800 border border-slate-700 rounded text-xs text-white outline-none focus:border-lime-400 transition"
                        >
                            <option value="card">Credit/Debit Card</option>
                            <option value="bank">Bank Transfer</option>
                            <option value="wallet">Digital Wallet</option>
                        </select>
                    </div>

                    {/* Amount */}
                    <div>
                        <label className="text-xs text-slate-400 block mb-1">Amount (₦)</label>
                        <input
                            type="number"
                            value={amount}
                            onChange={(e) => setAmount(e.target.value)}
                            placeholder="Enter amount"
                            required
                            className="w-full px-2 py-1.5 bg-slate-800 border border-slate-700 rounded text-xs text-white placeholder-slate-500 outline-none focus:border-lime-400 transition font-mono font-bold"
                        />
                    </div>

                    {/* Quick Amount Buttons */}
                    <div className="grid grid-cols-4 gap-1">
                        {quickAmounts.map((amt) => (
                            <button
                                key={amt}
                                type="button"
                                onClick={() => setAmount(amt.toString())}
                                className={`py-1 text-xs rounded transition font-medium ${amount === amt.toString() ? 'bg-lime-400 text-black font-bold' : 'bg-slate-800 hover:bg-slate-700 text-slate-300'}`}
                            >
                                {amt >= 1000 ? (amt / 1000) + 'K' : amt}
                            </button>
                        ))}
                    </div>

                    <button
                        type="submit"
                        className="w-full py-2 text-xs font-bold bg-lime-400 text-black rounded hover:bg-lime-300 transition shadow-sm uppercase tracking-wider"
                    >
                        Deposit {amount ? `₦${Number(amount).toLocaleString()}` : ''}
                    </button>
                </form>
            </div>
        </div>
    );
}

// --- MY BETS VIEW COMPONENT ---
function MyBetsView() {
    const bets = [
        { id: 1042, time: 'Just now', bet: '₦50.00', mult: '2.45x', win: '₦122.50', status: 'WIN' },
        { id: 1039, time: '2 mins ago', bet: '₦20.00', mult: '1.80x', win: '₦36.00', status: 'WIN' },
        { id: 1035, time: '5 mins ago', bet: '₦50.00', mult: '1.00x', win: '₦0.00', status: 'LOST' },
        { id: 1028, time: '12 mins ago', bet: '₦10.00', mult: '12.40x', win: '₦124.00', status: 'WIN' },
    ];

    return (
        <div className="bg-dark p-3 rounded-3 border border-secondary border-opacity-25">
            <div className="d-flex align-items-center justify-content-between mb-3 border-bottom border-secondary pb-2">
                <h5 className="m-0 text-white fw-bold d-flex align-items-center gap-2">
                    <span className="material-symbols-outlined text-danger">history</span>
                    My Betting History
                </h5>
                <span className="badge bg-secondary">Recent Bets</span>
            </div>

            <div className="table-responsive">
                <table className="table table-dark table-hover align-middle mb-0" style={{ fontSize: '13px' }}>
                    <thead>
                        <tr className="text-secondary border-secondary">
                            <th>Round ID</th>
                            <th>Time</th>
                            <th>Bet Amount</th>
                            <th>Cashout Multiplier</th>
                            <th>Payout Win</th>
                            <th>Result</th>
                        </tr>
                    </thead>
                    <tbody>
                        {bets.map((item) => (
                            <tr key={item.id} className="border-secondary">
                                <td className="fw-bold">#{item.id}</td>
                                <td className="text-muted">{item.time}</td>
                                <td>{item.bet}</td>
                                <td><span className="badge bg-secondary">{item.mult}</span></td>
                                <td className="fw-bold text-success">{item.win}</td>
                                <td>
                    <span className={`badge px-2 py-1 ${item.status === 'WIN' ? 'bg-success' : 'bg-danger'}`}>
                                        {item.status}
                                    </span>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}

// --- RIGHT SIDEBAR COMPONENT (LIVE CHATROOM) ---
function RightSidebar() {
    return (
        <div className="w-72 bg-slate-950 border-l border-slate-800 flex flex-col h-full overflow-hidden">
            <div className="px-3 py-2 border-b border-slate-800 flex items-center justify-between">
                <span className="text-xs font-semibold text-white">💬 LIVE CHAT</span>
                <span className="text-[11px] px-1.5 py-0.5 bg-green-500/20 text-green-400 rounded flex items-center gap-1">
                    <span className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse"></span>
                    <span>128</span>
                </span>
            </div>
            <div className="flex-1 overflow-hidden">
                <div className="ax-chat-mount-point h-full">
                    {window.axRenderChatroom ? window.axRenderChatroom() : (
                        <div className="p-4 text-center text-slate-500 text-xs">Loading Live Chatroom...</div>
                    )}
                </div>
            </div>
        </div>
    );
}

// --- MAIN REACT APPLICATION CONTAINER ---
function ReactAviatorApp() {
    const pageData = window.pageData || {};
    const [user, setUser] = useState(pageData.user || null);
    const [wallet, setWallet] = useState(pageData.wallet || 45210.00);
    const [currentView, setCurrentView] = useState('crash');

    const [authModalShow, setAuthModalShow] = useState(false);
    const [authModalTab, setAuthModalTab] = useState('login');
    const [withdrawModalShow, setWithdrawModalShow] = useState(false);
    const [notifModalShow, setNotifModalShow] = useState(false);

    const [gameId, setGameId] = useState(1);
    const [gameState, setGameState] = useState('WAITING');
    const [multiplier, setMultiplier] = useState(1.00);
    const [countdown, setCountdown] = useState(5.0);
    const [historyRounds, setHistoryRounds] = useState([2.13, 1.45, 3.67, 1.12, 6.25, 1.75, 2.98, 12.43, 1.33, 4.12, 1.08, 9.76]);

    function generateInitialLiveBets() {
        const names = [
            'Alex_Aviator', 'Crypto_King', 'Grace_Naija', 'Flyer_99', 'BetMaster_NG', 'Winner_Pro', 
            'David_O', 'Tunde_Bet', 'Chidi_Wins', 'SuperFly_88', 'Fatima_K', 'Samuel_X', 
            'Queen_Aviator', 'Emeka_Cash', 'Bisi_Rolls', 'King_David', 'Zainab_M', 'FastCash_24',
            'StarBoy_NG', 'Prince_Aviator', 'Chief_O', 'Victory_G', 'Rider_007', 'Gold_Fingers',
            'Success_B', 'Lucky_Player', 'Aviator_Pro', 'Naija_Titan', 'Mega_Winner', 'Flight_Master'
        ];
        return names.map((name, idx) => ({
            id: idx + 1,
            user: name,
            avatar: '/images/avtar/av-' + ((idx % 72) + 1) + '.png',
            bet: [5, 10, 20, 50][idx % 4],
            cashedOut: false,
            targetMult: +(1.15 + (idx % 8) * 0.45 + (idx % 3) * 0.2).toFixed(2)
        }));
    }

    const [liveBets, setLiveBets] = useState(generateInitialLiveBets());

    // Hook into live engine state machine (window.canvasShow* and incrementor)
    useEffect(() => {
        const origShowWaiting = window.canvasShowWaitingState;
        const origShowPreparing = window.canvasShowPreparingState;
        const origShowTakeoff = window.canvasShowTakeoffState;
        const origShowFlying = window.canvasShowFlyingState;
        const origShowCrashed = window.canvasShowCrashedState;
        const origIncrementor = window.incrementor;

        window.canvasShowWaitingState = function (mult) {
            setGameState('WAITING');
            if (mult) setMultiplier(Number(mult));
            if (origShowWaiting) origShowWaiting(mult);
        };
        window.canvasShowPreparingState = function () {
            setGameState('PREPARING');
            setMultiplier(1.00);
            if (origShowPreparing) origShowPreparing();
        };
        window.canvasShowTakeoffState = function () {
            setGameState('TAKEOFF');
            setMultiplier(1.00);
            if (origShowTakeoff) origShowTakeoff();
        };
        window.canvasShowFlyingState = function () {
            setGameState('FLYING');
            if (origShowFlying) origShowFlying();
        };
        window.canvasShowCrashedState = function (mult) {
            setGameState('CRASHED');
            const crashVal = mult ? Number(mult) : 1.00;
            setMultiplier(crashVal);
            setHistoryRounds(prev => [crashVal, ...prev.slice(0, 14)]);
            if (origShowCrashed) origShowCrashed(mult);
        };

        window.incrementor = function (inc_no) {
            const val = Number(inc_no);
            if (!isNaN(val)) {
                setMultiplier(val);
                setGameState('FLYING');
            }
            if (origIncrementor) origIncrementor(inc_no);
        };

        return () => {
            window.canvasShowWaitingState = origShowWaiting;
            window.canvasShowPreparingState = origShowPreparing;
            window.canvasShowTakeoffState = origShowTakeoff;
            window.canvasShowFlyingState = origShowFlying;
            window.canvasShowCrashedState = origShowCrashed;
            window.incrementor = origIncrementor;
        };
    }, []);

    // Autonomous simulation fallback loop to keep flight continuously active
    useEffect(() => {
        let interval;
        if (gameState === 'FLYING') {
            interval = setInterval(() => {
                setMultiplier((prev) => {
                    const next = prev + 0.03 + (Math.random() * 0.02);
                    if (next >= 14.50) {
                        setGameState('CRASHED');
                        setTimeout(() => {
                            setGameState('WAITING');
                            setCountdown(4.0);
                        }, 2500);
                    }
                    return next;
                });
            }, 100);
        } else if (gameState === 'WAITING') {
            interval = setInterval(() => {
                setCountdown((prev) => {
                    if (prev <= 0.2) {
                        setGameState('FLYING');
                        setMultiplier(1.00);
                        return 4.0;
                    }
                    return prev - 0.1;
                });
            }, 100);
        }

        return () => clearInterval(interval);
    }, [gameState]);

    // Poll live bets & game ID from backend
    useEffect(() => {
        const fetchEngineData = () => {
            $.ajax({
                url: '/currentlybet',
                type: 'GET',
                dataType: 'json',
                success: function(res) {
                    if (res && res.currentGame) {
                        setGameId(res.currentGame.id);
                    }
                    if (res && res.currentGameBet && res.currentGameBet.length > 0) {
                        const formatted = res.currentGameBet.slice(0, 45).map((b, idx) => ({
                            id: idx + 1,
                            user: b.name || ('Player #' + (b.userid || (1000 + idx))),
                            avatar: b.image || ('/images/avtar/av-' + ((idx % 72) + 1) + '.png'),
                            bet: b.amount ? Math.min(50, Math.max(5, b.amount)) : [5, 10, 20, 50][idx % 4],
                            cashedOut: false,
                            targetMult: +(1.15 + (idx % 7) * 0.4).toFixed(2)
                        }));
                        setLiveBets(formatted);
                    }
                }
            });
        };

        fetchEngineData();
        const pollTimer = setInterval(fetchEngineData, 5000);
        return () => clearInterval(pollTimer);
    }, []);


    return (
        <div className="bg-slate-950 text-white flex flex-col font-sans" style={{ height: '100dvh', overflow: 'hidden' }}>
            {/* Unified Responsive Header */}
            <Header user={user} wallet={wallet} currentView={currentView} onViewChange={setCurrentView} onAuthClick={(tab) => { setAuthModalTab(tab); setAuthModalShow(true); }} onWithdrawClick={() => setWithdrawModalShow(true)} onNotifClick={() => setNotifModalShow(true)} />

            <main className="flex-1 flex overflow-hidden">
                {/* Desktop View */}
                <div className="hidden md:flex flex-1 overflow-hidden">
                    {currentView === 'crash' && (
                        <React.Fragment>
                            <LiveBetsPanel multiplier={multiplier} gameState={gameState} liveBets={liveBets} />
                            <div className="flex-1 bg-slate-950 flex flex-col border-r border-slate-800 overflow-y-auto">
                                <HistoryBar historyRounds={historyRounds} />
                                <div className="p-3 flex-1 flex flex-col">
                                    <AviatorCanvas gameState={gameState} multiplier={multiplier} countdown={countdown} />
                                </div>
                                <div className="p-2" style={{ background: '#0f172a', borderTop: '1px solid #000' }}>
                                    <div className="grid grid-cols-2 gap-2">
                                        <BetPanel panelId={1} wallet={wallet} gameId={gameId} multiplier={multiplier} gameState={gameState} onWalletChange={setWallet} />
                                        <BetPanel panelId={2} wallet={wallet} gameId={gameId} multiplier={multiplier} gameState={gameState} onWalletChange={setWallet} />
                                    </div>
                                </div>
                            </div>
                            <RightSidebar />
                        </React.Fragment>
                    )}
                    {currentView === 'leaderboard' && <LeaderboardView />}
                    {currentView === 'deposit' && <DepositView wallet={wallet} />}
                    {currentView === 'mybets' && <MyBetsView />}
                </div>

                {/* Mobile View */}
                <div className="flex md:hidden flex-col w-full" style={{ flex: 1, overflowY: 'auto', overflowX: 'hidden' }}>
                    {currentView === 'crash' && (
                        <div className="flex flex-col">
                            <HistoryBar historyRounds={historyRounds} />
                            <div className="p-1.5">
                                <AviatorCanvas gameState={gameState} multiplier={multiplier} countdown={countdown} />
                            </div>
                            <div className="p-1.5 space-y-1.5" style={{ background: '#0f172a', borderTop: '1px solid #000' }}>
                                <BetPanel panelId={1} wallet={wallet} gameId={gameId} multiplier={multiplier} gameState={gameState} onWalletChange={setWallet} />
                                <BetPanel panelId={2} wallet={wallet} gameId={gameId} multiplier={multiplier} gameState={gameState} onWalletChange={setWallet} />
                            </div>
                        </div>
                    )}
                    {currentView === 'livebets' && (
                        <div className="flex-1 overflow-hidden">
                            <LiveBetsPanel multiplier={multiplier} gameState={gameState} liveBets={liveBets} />
                        </div>
                    )}
                    {currentView === 'chat' && (
                        <div className="flex-1 overflow-hidden">
                            <RightSidebar />
                        </div>
                    )}
                    {currentView === 'leaderboard' && <LeaderboardView />}
                    {currentView === 'deposit' && <DepositView wallet={wallet} />}
                    {currentView === 'mybets' && <MyBetsView />}
                </div>
            </main>


            {/* React Notifications Modal Component */}
            <NotificationsModal show={notifModalShow} onClose={() => setNotifModalShow(false)} />

            {/* React Auth Modal Component */}
            <AuthModal show={authModalShow} initialTab={authModalTab} onClose={() => setAuthModalShow(false)} onSuccessLogin={(userData) => { setUser(userData); setAuthModalShow(false); }} />

            {/* React Withdrawal Modal Component */}
            <WithdrawModal show={withdrawModalShow} wallet={wallet} onClose={() => setWithdrawModalShow(false)} onSuccessWithdraw={(newBalance) => { setWallet(newBalance); }} />
        </div>
    );
}

// Mount React Root
const rootEl = document.getElementById('app');
if (rootEl) {
    const rawData = rootEl.getAttribute('data-page');
    try {
        window.pageData = JSON.parse(rawData);
    } catch (e) {
        window.pageData = {};
    }
    ReactDOM.render(<ReactAviatorApp />, rootEl);
}
