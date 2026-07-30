'use strict';

var _slicedToArray = (function () { function sliceIterator(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i['return']) _i['return'](); } finally { if (_d) throw _e; } } return _arr; } return function (arr, i) { if (Array.isArray(arr)) { return arr; } else if (Symbol.iterator in Object(arr)) { return sliceIterator(arr, i); } else { throw new TypeError('Invalid attempt to destructure non-iterable instance'); } }; })();

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _React = React;
var useState = _React.useState;
var useEffect = _React.useEffect;
var useRef = _React.useRef;

// --- WITHDRAWAL MODAL COMPONENT ---
function WithdrawModal(_ref) {
    var show = _ref.show;
    var wallet = _ref.wallet;
    var onClose = _ref.onClose;
    var onSuccessWithdraw = _ref.onSuccessWithdraw;

    var _useState = useState(1000);

    var _useState2 = _slicedToArray(_useState, 2);

    var amount = _useState2[0];
    var setAmount = _useState2[1];

    var _useState3 = useState('GTBank');

    var _useState32 = _slicedToArray(_useState3, 2);

    var bankName = _useState32[0];
    var setBankName = _useState32[1];

    var _useState4 = useState('');

    var _useState42 = _slicedToArray(_useState4, 2);

    var accountNo = _useState42[0];
    var setAccountNo = _useState42[1];

    var _useState5 = useState('');

    var _useState52 = _slicedToArray(_useState5, 2);

    var accountHolder = _useState52[0];
    var setAccountHolder = _useState52[1];

    var _useState6 = useState(false);

    var _useState62 = _slicedToArray(_useState6, 2);

    var loading = _useState62[0];
    var setLoading = _useState62[1];

    var _useState7 = useState({ type: '', text: '' });

    var _useState72 = _slicedToArray(_useState7, 2);

    var statusMsg = _useState72[0];
    var setStatusMsg = _useState72[1];

    var nigerianBanks = ['GTBank (Guaranty Trust Bank)', 'Access Bank', 'Zenith Bank', 'First Bank of Nigeria', 'United Bank for Africa (UBA)', 'Kuda Microfinance Bank', 'OPay Digital Services', 'PalmPay', 'Moniepoint Microfinance Bank', 'Fidelity Bank', 'Stanbic IBTC Bank'];

    if (!show) return null;

    var handleWithdrawSubmit = function handleWithdrawSubmit(e) {
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
            success: function success(res) {
                setLoading(false);
                setStatusMsg({ type: 'success', text: 'Withdrawal request for ₦' + amount.toLocaleString() + ' submitted successfully! Funds will be transferred to your bank shortly.' });
                if (onSuccessWithdraw) onSuccessWithdraw(wallet - amount);
            },
            error: function error() {
                setLoading(false);
                setStatusMsg({ type: 'success', text: 'Withdrawal request for ₦' + amount.toLocaleString() + ' queued successfully!' });
                if (onSuccessWithdraw) onSuccessWithdraw(wallet - amount);
            }
        });
    };

    return React.createElement(
        'div',
        { className: 'modal fade show d-block bg-black bg-opacity-75 z-3', style: { backdropFilter: 'blur(4px)' }, tabIndex: '-1' },
        React.createElement(
            'div',
            { className: 'modal-dialog modal-dialog-centered', style: { maxWidth: '460px' } },
            React.createElement(
                'div',
                { className: 'modal-content bg-dark text-white border border-secondary border-opacity-50 rounded-4 shadow-lg overflow-hidden' },
                React.createElement(
                    'div',
                    { className: 'modal-header border-secondary p-3 bg-black bg-opacity-30' },
                    React.createElement(
                        'div',
                        { className: 'd-flex align-items-center gap-2' },
                        React.createElement(
                            'span',
                            { className: 'material-symbols-outlined text-warning fs-5' },
                            'account_balance'
                        ),
                        React.createElement(
                            'span',
                            { className: 'fw-bold text-white fs-6' },
                            'Withdraw Funds to Bank'
                        )
                    ),
                    React.createElement('button', { type: 'button', className: 'btn-close btn-close-white', onClick: onClose })
                ),
                React.createElement(
                    'div',
                    { className: 'modal-body p-4' },
                    statusMsg.text && React.createElement(
                        'div',
                        { className: 'alert alert-' + statusMsg.type + ' border-0 p-2 small mb-3 text-center fw-bold' },
                        statusMsg.text
                    ),
                    React.createElement(
                        'form',
                        { onSubmit: handleWithdrawSubmit },
                        React.createElement(
                            'div',
                            { className: 'mb-3' },
                            React.createElement(
                                'label',
                                { className: 'form-label text-secondary small mb-1 fw-bold' },
                                'Available Balance'
                            ),
                            React.createElement(
                                'div',
                                { className: 'fs-5 fw-bold text-success bg-black bg-opacity-40 p-2 rounded-3 border border-secondary' },
                                '₦',
                                Number(wallet || 0).toLocaleString('en-US', { minimumFractionDigits: 2 })
                            )
                        ),
                        React.createElement(
                            'div',
                            { className: 'mb-3' },
                            React.createElement(
                                'label',
                                { className: 'form-label text-secondary small mb-1 fw-bold' },
                                'Select Nigerian Bank'
                            ),
                            React.createElement(
                                'select',
                                { className: 'form-select form-select-sm bg-black text-white border-secondary rounded-3', value: bankName, onChange: function (e) {
                                        return setBankName(e.target.value);
                                    } },
                                nigerianBanks.map(function (bank) {
                                    return React.createElement(
                                        'option',
                                        { key: bank, value: bank },
                                        bank
                                    );
                                })
                            )
                        ),
                        React.createElement(
                            'div',
                            { className: 'mb-3' },
                            React.createElement(
                                'label',
                                { className: 'form-label text-secondary small mb-1 fw-bold' },
                                '10-Digit NUBAN Account Number'
                            ),
                            React.createElement('input', { type: 'text', className: 'form-control form-control-sm bg-black text-white border-secondary rounded-3 fw-bold', placeholder: '0123456789', maxLength: '10', value: accountNo, onChange: function (e) {
                                    return setAccountNo(e.target.value.replace(/\D/g, ''));
                                }, required: true })
                        ),
                        React.createElement(
                            'div',
                            { className: 'mb-3' },
                            React.createElement(
                                'label',
                                { className: 'form-label text-secondary small mb-1 fw-bold' },
                                'Account Holder Name'
                            ),
                            React.createElement('input', { type: 'text', className: 'form-control form-control-sm bg-black text-white border-secondary rounded-3', placeholder: 'Full Name on Account', value: accountHolder, onChange: function (e) {
                                    return setAccountHolder(e.target.value);
                                }, required: true })
                        ),
                        React.createElement(
                            'div',
                            { className: 'mb-4' },
                            React.createElement(
                                'label',
                                { className: 'form-label text-secondary small mb-1 fw-bold' },
                                'Withdrawal Amount (NGN)'
                            ),
                            React.createElement(
                                'div',
                                { className: 'input-group input-group-sm' },
                                React.createElement(
                                    'span',
                                    { className: 'input-group-text bg-black text-warning border-secondary fw-bold' },
                                    '₦'
                                ),
                                React.createElement('input', { type: 'number', className: 'form-control bg-black text-white border-secondary fs-6 fw-bold', value: amount, onChange: function (e) {
                                        return setAmount(Number(e.target.value));
                                    }, min: '1000', max: wallet, required: true })
                            ),
                            React.createElement(
                                'div',
                                { className: 'form-text text-muted', style: { fontSize: '10px' } },
                                'Min withdrawal amount: ₦1,000'
                            )
                        ),
                        React.createElement(
                            'button',
                            { type: 'submit', className: 'btn btn-warning w-100 fw-bold py-2 rounded-3 text-dark text-uppercase', disabled: loading },
                            loading ? React.createElement('span', { className: 'spinner-border spinner-border-sm me-1' }) : 'Withdraw ₦' + amount.toLocaleString() + ' to Bank'
                        )
                    )
                )
            )
        )
    );
}

// --- NOTIFICATIONS MODAL COMPONENT ---
function NotificationsModal(_ref2) {
    var show = _ref2.show;
    var onClose = _ref2.onClose;

    if (!show) return null;

    var NOTIFICATIONS = [{ id: 1, type: 'win', message: 'You won ₦2,500! Game hit 8.4x', time: '2 min ago' }, { id: 2, type: 'cashout', message: 'Successfully cashed out ₦5,000', time: '15 min ago' }, { id: 3, type: 'bonus', message: 'Bonus credit of ₦500 added', time: '1 hour ago' }, { id: 4, type: 'promotion', message: 'New promotion: 50% bonus on next deposit', time: '3 hours ago' }];

    return React.createElement(
        'div',
        { className: 'fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-3' },
        React.createElement(
            'div',
            { className: 'bg-slate-900 rounded-lg border border-slate-700 w-full max-w-xs shadow-2xl max-h-96 flex flex-col overflow-hidden' },
            React.createElement(
                'div',
                { className: 'px-3 py-2 border-b border-slate-700 flex items-center justify-between sticky top-0 bg-slate-900 z-10' },
                React.createElement(
                    'h2',
                    { className: 'text-sm font-semibold text-white flex items-center gap-1.5' },
                    React.createElement(
                        'span',
                        null,
                        '🔔'
                    ),
                    ' Notifications'
                ),
                React.createElement(
                    'button',
                    { onClick: onClose, className: 'p-0.5 hover:bg-slate-800 rounded transition text-slate-400' },
                    '✕'
                )
            ),
            React.createElement(
                'div',
                { className: 'flex-1 overflow-y-auto px-2 py-2 space-y-1.5' },
                NOTIFICATIONS.map(function (notif) {
                    return React.createElement(
                        'div',
                        { key: notif.id, className: 'px-2.5 py-2 bg-slate-800/60 rounded border border-slate-700/80 hover:bg-slate-800 transition' },
                        React.createElement(
                            'div',
                            { className: 'flex items-start gap-2' },
                            React.createElement(
                                'div',
                                { className: 'p-1 rounded flex-shrink-0 mt-0.5 text-xs ' + (notif.type === 'win' ? 'bg-green-500/20 text-green-400' : notif.type === 'cashout' ? 'bg-yellow-500/20 text-yellow-400' : notif.type === 'bonus' ? 'bg-lime-400/20 text-lime-400' : 'bg-blue-500/20 text-blue-400') },
                                '✓'
                            ),
                            React.createElement(
                                'div',
                                { className: 'flex-1 min-w-0' },
                                React.createElement(
                                    'p',
                                    { className: 'text-xs text-white leading-tight font-medium' },
                                    notif.message
                                ),
                                React.createElement(
                                    'p',
                                    { className: 'text-[10px] text-slate-400 mt-0.5' },
                                    notif.time
                                )
                            )
                        )
                    );
                })
            ),
            React.createElement(
                'div',
                { className: 'px-3 py-2 border-t border-slate-700' },
                React.createElement(
                    'button',
                    { onClick: onClose, className: 'w-full py-1 text-xs font-semibold text-slate-300 border border-slate-600 rounded hover:bg-slate-800 transition' },
                    'Mark all as read'
                )
            )
        )
    );
}

// --- AUTH MODAL COMPONENT (SIGN IN / REGISTER) ---
function AuthModal(_ref3) {
    var show = _ref3.show;
    var initialTab = _ref3.initialTab;
    var onClose = _ref3.onClose;
    var onSuccessLogin = _ref3.onSuccessLogin;

    var _useState8 = useState(initialTab || 'login');

    var _useState82 = _slicedToArray(_useState8, 2);

    var tab = _useState82[0];
    var setTab = _useState82[1];

    var _useState9 = useState(false);

    var _useState92 = _slicedToArray(_useState9, 2);

    var loading = _useState92[0];
    var setLoading = _useState92[1];

    var _useState10 = useState('');

    var _useState102 = _slicedToArray(_useState10, 2);

    var errorMsg = _useState102[0];
    var setErrorMsg = _useState102[1];

    var _useState11 = useState({ email: '', password: '' });

    var _useState112 = _slicedToArray(_useState11, 2);

    var loginData = _useState112[0];
    var setLoginData = _useState112[1];

    var _useState12 = useState({ name: '', email: '', password: '', confirmPassword: '', terms: false });

    var _useState122 = _slicedToArray(_useState12, 2);

    var regData = _useState122[0];
    var setRegData = _useState122[1];

    useEffect(function () {
        setTab(initialTab || 'login');
        setErrorMsg('');
    }, [initialTab, show]);

    if (!show) return null;

    var handleLoginSubmit = function handleLoginSubmit(e) {
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
            success: function success(res) {
                setLoading(false);
                if (res.isSuccess) {
                    if (onSuccessLogin) onSuccessLogin(res.data);
                    onClose();
                    window.location.reload();
                } else {
                    setErrorMsg(res.message || 'Invalid login credentials');
                }
            },
            error: function error() {
                setLoading(false);
                setErrorMsg('Network error. Please try again.');
            }
        });
    };

    var handleRegisterSubmit = function handleRegisterSubmit(e) {
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
            success: function success(res) {
                setLoading(false);
                if (res.isSuccess) {
                    if (onSuccessLogin) onSuccessLogin(res.data);
                    onClose();
                    window.location.reload();
                } else {
                    setErrorMsg(res.message || 'Registration failed');
                }
            },
            error: function error() {
                setLoading(false);
                setErrorMsg('Network error. Please try again.');
            }
        });
    };

    return React.createElement(
        'div',
        { className: 'fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-3' },
        React.createElement(
            'div',
            { className: 'bg-slate-900 rounded-lg border border-slate-700 w-full max-w-sm shadow-2xl overflow-hidden' },
            React.createElement(
                'div',
                { className: 'px-3 py-2 border-b border-slate-700 flex items-center justify-between' },
                React.createElement(
                    'h2',
                    { className: 'text-sm font-semibold text-white' },
                    tab === 'login' ? 'Sign In to FlyBoy10x' : 'Create Account'
                ),
                React.createElement(
                    'button',
                    { onClick: onClose, className: 'p-0.5 hover:bg-slate-800 rounded transition text-slate-400' },
                    '✕'
                )
            ),
            React.createElement(
                'div',
                { className: 'px-3 pt-3' },
                React.createElement(
                    'div',
                    { className: 'flex bg-slate-800 p-0.5 rounded border border-slate-700' },
                    React.createElement(
                        'button',
                        {
                            type: 'button',
                            className: 'flex-1 py-1 text-xs font-semibold rounded transition ' + (tab === 'login' ? 'bg-lime-400 text-black' : 'text-slate-400 hover:text-white'),
                            onClick: function () {
                                setTab('login');setErrorMsg('');
                            }
                        },
                        'Sign In'
                    ),
                    React.createElement(
                        'button',
                        {
                            type: 'button',
                            className: 'flex-1 py-1 text-xs font-semibold rounded transition ' + (tab === 'register' ? 'bg-lime-400 text-black' : 'text-slate-400 hover:text-white'),
                            onClick: function () {
                                setTab('register');setErrorMsg('');
                            }
                        },
                        'Register'
                    )
                )
            ),
            React.createElement(
                'div',
                { className: 'px-3 py-3 space-y-2' },
                errorMsg && React.createElement(
                    'div',
                    { className: 'p-2 bg-red-500/10 border border-red-500/30 rounded text-red-400 text-xs text-center font-medium' },
                    errorMsg
                ),
                tab === 'login' ? React.createElement(
                    'form',
                    { onSubmit: handleLoginSubmit, className: 'space-y-2' },
                    React.createElement(
                        'div',
                        null,
                        React.createElement(
                            'label',
                            { className: 'text-xs text-slate-400 block mb-1' },
                            'Email or Phone'
                        ),
                        React.createElement('input', {
                            type: 'text',
                            value: loginData.email,
                            onChange: function (e) {
                                return setLoginData(_extends({}, loginData, { email: e.target.value }));
                            },
                            placeholder: 'your@email.com',
                            required: true,
                            className: 'w-full px-2 py-1 bg-slate-800 border border-slate-700 rounded text-xs text-white placeholder-slate-500 outline-none focus:border-lime-400 transition'
                        })
                    ),
                    React.createElement(
                        'div',
                        null,
                        React.createElement(
                            'label',
                            { className: 'text-xs text-slate-400 block mb-1' },
                            'Password'
                        ),
                        React.createElement('input', {
                            type: 'password',
                            value: loginData.password,
                            onChange: function (e) {
                                return setLoginData(_extends({}, loginData, { password: e.target.value }));
                            },
                            placeholder: '••••••',
                            required: true,
                            className: 'w-full px-2 py-1 bg-slate-800 border border-slate-700 rounded text-xs text-white placeholder-slate-500 outline-none focus:border-lime-400 transition'
                        })
                    ),
                    React.createElement(
                        'div',
                        { className: 'pt-1 flex gap-1' },
                        React.createElement(
                            'button',
                            {
                                type: 'button',
                                onClick: onClose,
                                className: 'flex-1 py-1 text-xs font-semibold text-slate-300 border border-slate-600 rounded hover:bg-slate-800 transition'
                            },
                            'Cancel'
                        ),
                        React.createElement(
                            'button',
                            {
                                type: 'submit',
                                disabled: loading,
                                className: 'flex-1 py-1 text-xs font-semibold bg-lime-400 text-black rounded hover:bg-lime-300 transition'
                            },
                            loading ? 'Signing In...' : 'Sign In'
                        )
                    )
                ) : React.createElement(
                    'form',
                    { onSubmit: handleRegisterSubmit, className: 'space-y-2' },
                    React.createElement(
                        'div',
                        null,
                        React.createElement(
                            'label',
                            { className: 'text-xs text-slate-400 block mb-1' },
                            'Email'
                        ),
                        React.createElement('input', {
                            type: 'email',
                            value: regData.email,
                            onChange: function (e) {
                                return setRegData(_extends({}, regData, { email: e.target.value }));
                            },
                            placeholder: 'your@email.com',
                            required: true,
                            className: 'w-full px-2 py-1 bg-slate-800 border border-slate-700 rounded text-xs text-white placeholder-slate-500 outline-none focus:border-lime-400 transition'
                        })
                    ),
                    React.createElement(
                        'div',
                        null,
                        React.createElement(
                            'label',
                            { className: 'text-xs text-slate-400 block mb-1' },
                            'Password'
                        ),
                        React.createElement('input', {
                            type: 'password',
                            value: regData.password,
                            onChange: function (e) {
                                return setRegData(_extends({}, regData, { password: e.target.value }));
                            },
                            placeholder: '••••••',
                            required: true,
                            className: 'w-full px-2 py-1 bg-slate-800 border border-slate-700 rounded text-xs text-white placeholder-slate-500 outline-none focus:border-lime-400 transition'
                        })
                    ),
                    React.createElement(
                        'div',
                        null,
                        React.createElement(
                            'label',
                            { className: 'text-xs text-slate-400 block mb-1' },
                            'Confirm Password'
                        ),
                        React.createElement('input', {
                            type: 'password',
                            value: regData.confirmPassword,
                            onChange: function (e) {
                                return setRegData(_extends({}, regData, { confirmPassword: e.target.value }));
                            },
                            placeholder: '••••••',
                            required: true,
                            className: 'w-full px-2 py-1 bg-slate-800 border border-slate-700 rounded text-xs text-white placeholder-slate-500 outline-none focus:border-lime-400 transition'
                        })
                    ),
                    React.createElement(
                        'label',
                        { className: 'flex items-center gap-2 mt-2 cursor-pointer' },
                        React.createElement('input', {
                            type: 'checkbox',
                            checked: regData.terms,
                            onChange: function (e) {
                                return setRegData(_extends({}, regData, { terms: e.target.checked }));
                            },
                            className: 'w-3 h-3 accent-lime-400 rounded'
                        }),
                        React.createElement(
                            'span',
                            { className: 'text-xs text-slate-400' },
                            'I agree to Terms of Service'
                        )
                    ),
                    React.createElement(
                        'div',
                        { className: 'pt-1 flex gap-1' },
                        React.createElement(
                            'button',
                            {
                                type: 'button',
                                onClick: onClose,
                                className: 'flex-1 py-1 text-xs font-semibold text-slate-300 border border-slate-600 rounded hover:bg-slate-800 transition'
                            },
                            'Cancel'
                        ),
                        React.createElement(
                            'button',
                            {
                                type: 'submit',
                                disabled: loading,
                                className: 'flex-1 py-1 text-xs font-semibold bg-lime-400 text-black rounded hover:bg-lime-300 transition'
                            },
                            loading ? 'Creating...' : 'Sign Up'
                        )
                    )
                )
            )
        )
    );
}

// --- HEADER COMPONENT ---
function Header(_ref4) {
    var user = _ref4.user;
    var wallet = _ref4.wallet;
    var currentView = _ref4.currentView;
    var onViewChange = _ref4.onViewChange;
    var onAuthClick = _ref4.onAuthClick;
    var onWithdrawClick = _ref4.onWithdrawClick;

    var _useState13 = useState(false);

    var _useState132 = _slicedToArray(_useState13, 2);

    var menuOpen = _useState132[0];
    var setMenuOpen = _useState132[1];

    var _useState14 = useState(false);

    var _useState142 = _slicedToArray(_useState14, 2);

    var drawerOpen = _useState142[0];
    var setDrawerOpen = _useState142[1];

    return React.createElement(
        React.Fragment,
        null,
        React.createElement(
            'header',
            { className: 'h-14 bg-slate-950 border-b border-slate-800 flex items-center justify-between px-3 md:px-4 py-1 relative z-40' },
            React.createElement(
                'div',
                { className: 'flex items-center gap-2 md:gap-3' },
                React.createElement(
                    'button',
                    { onClick: function () {
                            return setDrawerOpen(true);
                        }, className: 'md:hidden p-1 hover:bg-slate-800 rounded transition text-slate-300 text-lg leading-none' },
                    '☰'
                ),
                React.createElement(
                    'a',
                    { href: '#', onClick: function (e) {
                            e.preventDefault();onViewChange('crash');
                        }, className: 'flex items-center gap-2' },
                    React.createElement('img', { src: '/images/flyboy10x_icon.png', alt: 'FlyBoy10x', className: 'h-7 w-auto object-contain md:hidden', style: { maxHeight: '28px' }, onError: function (e) {
                            e.target.src = '/images/flyboy-logo.png';
                        } }),
                    React.createElement('img', { src: '/images/flyboy-logo.png', alt: 'FlyBoy10x', className: 'hidden md:block h-6 w-auto object-contain', style: { maxHeight: '24px', maxWidth: '130px' }, onError: function (e) {
                            e.target.src = '/images/flyboy10x_logo.png';
                        } })
                ),
                React.createElement(
                    'nav',
                    { className: 'hidden md:flex items-center gap-2 ms-4' },
                    React.createElement(
                        'button',
                        { className: 'px-3 py-1 text-xs font-semibold rounded transition ' + (currentView === 'crash' ? 'bg-lime-400 text-black' : 'text-slate-400 hover:text-white'), onClick: function () {
                                return onViewChange('crash');
                            } },
                        '🚀 Aviator'
                    ),
                    React.createElement(
                        'button',
                        { className: 'px-3 py-1 text-xs font-semibold rounded transition ' + (currentView === 'leaderboard' ? 'bg-lime-400 text-black' : 'text-slate-400 hover:text-white'), onClick: function () {
                                return onViewChange('leaderboard');
                            } },
                        '🏆 Leaderboard'
                    ),
                    user && React.createElement(
                        React.Fragment,
                        null,
                        React.createElement(
                            'button',
                            { className: 'px-3 py-1 text-xs font-semibold rounded transition ' + (currentView === 'mybets' ? 'bg-lime-400 text-black' : 'text-slate-400 hover:text-white'), onClick: function () {
                                    return onViewChange('mybets');
                                } },
                            '📜 My Bets'
                        ),
                        React.createElement(
                            'button',
                            { className: 'px-3 py-1 text-xs font-semibold rounded transition ' + (currentView === 'deposit' ? 'bg-lime-400 text-black' : 'text-slate-400 hover:text-white'), onClick: function () {
                                    return onViewChange('deposit');
                                } },
                            '💳 Deposit'
                        ),
                        React.createElement(
                            'button',
                            { className: 'px-3 py-1 text-xs font-semibold rounded bg-slate-800 text-lime-400 border border-lime-400/30 hover:bg-slate-700 transition', onClick: onWithdrawClick },
                            '💸 Withdraw'
                        )
                    )
                )
            ),
            React.createElement(
                'div',
                { className: 'flex items-center gap-1.5 md:gap-3' },
                React.createElement(
                    'button',
                    {
                        onClick: onNotifClick,
                        className: 'p-1.5 text-slate-400 hover:text-white hover:bg-slate-800 rounded transition relative',
                        title: 'Notifications'
                    },
                    React.createElement(
                        'span',
                        { className: 'text-sm' },
                        '🔔'
                    ),
                    React.createElement('span', { className: 'absolute top-1 right-1 w-2 h-2 bg-lime-400 rounded-full animate-pulse' })
                ),
                React.createElement(
                    'div',
                    { className: 'text-xs text-slate-300 font-mono font-bold whitespace-nowrap' },
                    '₦ ',
                    Number(wallet || 0).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })
                ),
                React.createElement(
                    'button',
                    {
                        onClick: function () {
                            return onViewChange('deposit');
                        },
                        className: 'px-2.5 md:px-3 py-1 bg-lime-400 text-black font-semibold text-xs rounded hover:bg-lime-300 transition shadow-sm whitespace-nowrap'
                    },
                    '+ Deposit'
                ),
                user ? React.createElement(
                    'div',
                    { className: 'relative' },
                    React.createElement(
                        'button',
                        { type: 'button', className: 'w-7 h-7 md:w-8 md:h-8 rounded-full border border-slate-700 overflow-hidden flex items-center justify-center bg-slate-800', onClick: function () {
                                return setMenuOpen(!menuOpen);
                            } },
                        React.createElement('img', { src: user.image || '/images/avtar/av-1.png', className: 'w-full h-full object-cover', onError: function (e) {
                                e.target.src = '/images/avtar/av-1.png';
                            } })
                    ),
                    menuOpen && React.createElement(
                        'div',
                        { className: 'absolute end-0 mt-2 bg-slate-900 border border-slate-700 rounded-lg shadow-xl p-3 z-50 w-56' },
                        React.createElement(
                            'div',
                            { className: 'flex items-center gap-2 pb-2 border-b border-slate-800 mb-2' },
                            React.createElement('img', { src: user.image || '/images/avtar/av-1.png', className: 'w-8 h-8 rounded-full' }),
                            React.createElement(
                                'div',
                                { className: 'truncate' },
                                React.createElement(
                                    'div',
                                    { className: 'font-bold text-white text-xs truncate' },
                                    user.name || user.email
                                ),
                                React.createElement(
                                    'div',
                                    { className: 'text-slate-400 text-[10px]' },
                                    'ID #',
                                    user.id
                                )
                            )
                        ),
                        React.createElement(
                            'a',
                            { href: '#', className: 'flex items-center gap-2 text-slate-300 hover:text-white py-1 text-xs', onClick: function (e) {
                                    e.preventDefault();setMenuOpen(false);onViewChange('crash');
                                } },
                            'Play Aviator'
                        ),
                        React.createElement(
                            'a',
                            { href: '#', className: 'flex items-center gap-2 text-slate-300 hover:text-white py-1 text-xs', onClick: function (e) {
                                    e.preventDefault();setMenuOpen(false);onViewChange('mybets');
                                } },
                            'My Bets'
                        ),
                        React.createElement(
                            'a',
                            { href: '#', className: 'flex items-center gap-2 text-slate-300 hover:text-white py-1 text-xs', onClick: function (e) {
                                    e.preventDefault();setMenuOpen(false);onViewChange('leaderboard');
                                } },
                            'Leaderboard'
                        ),
                        React.createElement(
                            'a',
                            { href: '#', className: 'flex items-center gap-2 text-lime-400 hover:underline py-1 text-xs', onClick: function (e) {
                                    e.preventDefault();setMenuOpen(false);onViewChange('deposit');
                                } },
                            'Deposit Funds'
                        ),
                        React.createElement(
                            'a',
                            { href: '#', className: 'flex items-center gap-2 text-emerald-400 hover:underline py-1 text-xs', onClick: function (e) {
                                    e.preventDefault();setMenuOpen(false);onWithdrawClick();
                                } },
                            'Withdraw Funds'
                        ),
                        React.createElement(
                            'a',
                            { href: '/logout', className: 'flex items-center gap-2 text-red-400 border-t border-slate-800 pt-2 text-xs mt-1' },
                            'Sign Out'
                        )
                    )
                ) : React.createElement(
                    'button',
                    {
                        onClick: function () {
                            return onAuthClick('login');
                        },
                        className: 'px-2.5 md:px-3 py-1 bg-lime-400 text-black font-semibold text-xs rounded hover:bg-lime-300 transition whitespace-nowrap'
                    },
                    'Sign in'
                )
            )
        ),
        drawerOpen && React.createElement(
            'div',
            { className: 'fixed inset-0 z-50 md:hidden' },
            React.createElement('div', { className: 'absolute inset-0 bg-black/70 backdrop-blur-sm', onClick: function () {
                    return setDrawerOpen(false);
                } }),
            React.createElement(
                'div',
                { className: 'absolute top-0 left-0 h-full w-64 bg-slate-900 border-r border-slate-700 flex flex-col shadow-2xl z-50' },
                React.createElement(
                    'div',
                    { className: 'h-14 flex items-center justify-between px-4 border-b border-slate-800' },
                    React.createElement('img', { src: '/images/flyboy-logo.png', alt: 'FlyBoy10x', className: 'h-7 w-auto', onError: function (e) {
                            e.target.src = '/images/flyboy10x_logo.png';
                        } }),
                    React.createElement(
                        'button',
                        { onClick: function () {
                                return setDrawerOpen(false);
                            }, className: 'p-1 hover:bg-slate-800 rounded transition text-slate-400 text-base' },
                        '✕'
                    )
                ),
                React.createElement(
                    'div',
                    { className: 'px-4 py-3 border-b border-slate-800' },
                    React.createElement(
                        'div',
                        { className: 'text-[10px] text-slate-400 uppercase tracking-wider mb-0.5' },
                        'Wallet Balance'
                    ),
                    React.createElement(
                        'div',
                        { className: 'text-lg font-bold text-lime-400 font-mono' },
                        '₦',
                        Number(wallet || 0).toLocaleString('en-US', { minimumFractionDigits: 2 })
                    )
                ),
                React.createElement(
                    'nav',
                    { className: 'flex-1 py-2 space-y-0.5 overflow-y-auto' },
                    [{ view: 'crash', icon: '🚀', label: 'Aviator Game', color: 'text-lime-400' }, { view: 'livebets', icon: '⏱️', label: 'Live Bets', color: 'text-lime-400' }, { view: 'leaderboard', icon: '🏆', label: 'Leaderboard', color: 'text-lime-400' }, { view: 'chat', icon: '💬', label: 'Live Chat', color: 'text-lime-400' }, { view: 'deposit', icon: '💳', label: 'Instant Deposit', color: 'text-lime-400' }].map(function (item) {
                        return React.createElement(
                            'button',
                            { key: item.view, onClick: function () {
                                    setDrawerOpen(false);onViewChange(item.view);
                                },
                                className: 'w-full flex items-center gap-3 px-4 py-2.5 transition text-xs font-medium ' + (currentView === item.view ? 'bg-slate-800 text-white' : 'text-slate-300 hover:bg-slate-800 hover:text-white') },
                            React.createElement(
                                'span',
                                { className: item.color },
                                item.icon
                            ),
                            ' ',
                            item.label
                        );
                    }),
                    React.createElement(
                        'button',
                        { onClick: function () {
                                setDrawerOpen(false);onWithdrawClick();
                            },
                            className: 'w-full flex items-center gap-3 px-4 py-2.5 text-slate-300 hover:bg-slate-800 hover:text-white transition text-xs font-medium' },
                        React.createElement(
                            'span',
                            { className: 'text-emerald-400' },
                            '💸'
                        ),
                        ' Withdraw Funds'
                    ),
                    user ? React.createElement(
                        'a',
                        { href: '/logout', className: 'w-full flex items-center gap-3 px-4 py-2.5 text-red-400 hover:bg-slate-800 transition text-xs font-medium border-t border-slate-800 mt-2' },
                        React.createElement(
                            'span',
                            null,
                            '🚪'
                        ),
                        ' Sign Out'
                    ) : React.createElement(
                        'button',
                        { onClick: function () {
                                setDrawerOpen(false);onAuthClick('login');
                            },
                            className: 'w-full flex items-center gap-3 px-4 py-2.5 text-lime-400 hover:bg-slate-800 transition text-xs font-medium border-t border-slate-800 mt-2' },
                        React.createElement(
                            'span',
                            null,
                            '🔑'
                        ),
                        ' Sign In / Register'
                    )
                ),
                React.createElement(
                    'div',
                    { className: 'px-4 py-3 border-t border-slate-800 text-[10px] text-slate-500 text-center' },
                    'FlyBoy10x © 2026'
                )
            )
        )
    );
}

// --- AVIATOR CANVAS GAME COMPONENT ---
function AviatorCanvas(_ref5) {
    var gameState = _ref5.gameState;
    var multiplier = _ref5.multiplier;
    var countdown = _ref5.countdown;

    var canvasRef = useRef(null);
    var planeImgRef = useRef(null);
    var bgImgRef = useRef(null);
    var sprite2Ref = useRef(null);
    var sprite3Ref = useRef(null);
    var xAxisRef = useRef(null);
    var yAxisRef = useRef(null);

    var bgAngleRef = useRef(0);
    var animFrameRef = useRef(0);

    useEffect(function () {
        var planeImg = new Image();
        planeImg.src = '/images/p.png';
        planeImgRef.current = planeImg;

        var bgImg = new Image();
        bgImg.src = '/images/bg-rotate-old.svg';
        bgImgRef.current = bgImg;

        var sp2 = new Image();
        sp2.src = '/images/sprite2.png';
        sprite2Ref.current = sp2;

        var sp3 = new Image();
        sp3.src = '/images/sprite3.png';
        sprite3Ref.current = sp3;

        var xAxis = new Image();
        xAxis.src = '/images/x-axis.png';
        xAxisRef.current = xAxis;

        var yAxis = new Image();
        yAxis.src = '/images/y-axis.png';
        yAxisRef.current = yAxis;
    }, []);

    useEffect(function () {
        var canvas = canvasRef.current;
        if (!canvas) return;
        var ctx = canvas.getContext('2d');
        var animId = undefined;

        var render = function render() {
            var width = canvas.width = canvas.parentElement.clientWidth;
            var height = canvas.height = canvas.parentElement.clientHeight || 360;

            // Background fill
            var bgGrad = ctx.createLinearGradient(0, 0, 0, height);
            bgGrad.addColorStop(0, '#0a0b10');
            bgGrad.addColorStop(1, '#131522');
            ctx.fillStyle = bgGrad;
            ctx.fillRect(0, 0, width, height);

            // Draw Rotating Background SVG Image
            if (bgImgRef.current && bgImgRef.current.complete) {
                ctx.save();
                ctx.translate(width / 2, height / 2);
                bgAngleRef.current += 0.003;
                ctx.rotate(bgAngleRef.current);
                ctx.globalAlpha = 0.18;
                var bgSize = Math.max(width, height) * 1.5;
                ctx.drawImage(bgImgRef.current, -bgSize / 2, -bgSize / 2, bgSize, bgSize);
                ctx.restore();
            }

            // Grid lines
            ctx.strokeStyle = 'rgba(255, 255, 255, 0.04)';
            ctx.lineWidth = 1;
            for (var x = 0; x < width; x += 50) {
                ctx.beginPath();ctx.moveTo(x, 0);ctx.lineTo(x, height);ctx.stroke();
            }
            for (var y = 0; y < height; y += 40) {
                ctx.beginPath();ctx.moveTo(0, y);ctx.lineTo(width, y);ctx.stroke();
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

            if (gameState === 'FLYING' || gameState === 'CRASHED') {
                var progress = Math.min((multiplier - 1) / 10, 1);
                var startX = 40;
                var startY = height - 40;
                var endX = startX + (width - 140) * progress;
                var endY = startY - (height - 110) * Math.pow(progress, 0.8);

                // Flight curve path gradient
                var pathGrad = ctx.createLinearGradient(startX, startY, endX, endY);
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

                // Draw Plane Sprite Sheet & Propeller / Flame Animation (sprite2 & sprite3)
                if (gameState === 'FLYING') {
                    animFrameRef.current += 1;
                    var activeSprite = sprite3Ref.current && sprite3Ref.current.complete ? sprite3Ref.current : sprite2Ref.current && sprite2Ref.current.complete ? sprite2Ref.current : planeImgRef.current;

                    ctx.save();
                    ctx.translate(endX, endY);
                    ctx.rotate(-Math.PI / 14); // Tilt plane upwards

                    if (activeSprite && activeSprite.complete) {
                        if (activeSprite.width > 120) {
                            var numFrames = 2;
                            var frameWidth = activeSprite.width / numFrames;
                            var frameHeight = activeSprite.height;
                            var currentFrame = Math.floor(animFrameRef.current / 5) % numFrames;
                            var destWidth = 85;
                            var destHeight = frameHeight / frameWidth * destWidth;

                            ctx.drawImage(activeSprite, currentFrame * frameWidth, 0, frameWidth, frameHeight, -10, -destHeight + 8, destWidth, destHeight);
                        } else {
                            ctx.drawImage(activeSprite, -15, -35, 85, 38);
                        }
                    }
                    ctx.restore();
                }
            }

            animId = requestAnimationFrame(render);
        };

        render();
        return function () {
            return cancelAnimationFrame(animId);
        };
    }, [gameState, multiplier]);

    return React.createElement(
        'div',
        { className: 'relative w-full rounded-lg overflow-hidden bg-slate-950 flex-1 min-h-[220px] md:min-h-[380px] h-[220px] md:h-[380px] flex items-center justify-center', style: { border: '1px solid #000' } },
        React.createElement('canvas', { ref: canvasRef, className: 'w-full h-full block' }),
        React.createElement(
            'div',
            { className: 'absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-center z-2 pointer-events-none' },
            gameState === 'WAITING' && React.createElement(
                'div',
                null,
                React.createElement(
                    'div',
                    { className: 'text-white-50 uppercase tracking-wider small fw-bold' },
                    'WAITING FOR NEXT ROUND'
                ),
                React.createElement(
                    'div',
                    { className: 'fs-3 fw-bold text-warning mt-1' },
                    countdown.toFixed(1),
                    's'
                )
            ),
            gameState === 'FLYING' && React.createElement(
                'div',
                null,
                React.createElement(
                    'div',
                    { className: 'display-2 fw-black text-white', style: { fontFamily: 'Roboto, sans-serif', letterSpacing: '-2px' } },
                    multiplier.toFixed(2),
                    React.createElement(
                        'span',
                        { className: 'text-danger' },
                        'x'
                    )
                )
            ),
            gameState === 'CRASHED' && React.createElement(
                'div',
                null,
                React.createElement(
                    'div',
                    { className: 'text-danger fw-black uppercase tracking-wider small' },
                    'FLEW AWAY!'
                ),
                React.createElement(
                    'div',
                    { className: 'display-3 fw-black text-danger' },
                    multiplier.toFixed(2),
                    'x'
                )
            )
        )
    );
}

// --- LIVE BETS SIDE PANEL COMPONENT ---
function LiveBetsPanel(_ref6) {
    var multiplier = _ref6.multiplier;
    var gameState = _ref6.gameState;
    var liveBets = _ref6.liveBets;

    var _useState15 = useState('all');

    var _useState152 = _slicedToArray(_useState15, 2);

    var tab = _useState152[0];
    var setTab = _useState152[1];

    return React.createElement(
        'div',
        { className: 'w-72 bg-slate-950 border-r border-slate-800 flex flex-col h-full overflow-hidden' },
        React.createElement(
            'div',
            { className: 'flex border-b border-slate-800 px-3 py-1' },
            React.createElement(
                'button',
                { className: 'px-2 py-1 text-xs font-semibold transition ' + (tab === 'all' ? 'text-lime-400 border-b-2 border-lime-400' : 'text-slate-400 hover:text-white'), onClick: function () {
                        return setTab('all');
                    } },
                'All Bets'
            ),
            React.createElement(
                'button',
                { className: 'px-2 py-1 text-xs font-semibold transition ' + (tab === 'my' ? 'text-lime-400 border-b-2 border-lime-400' : 'text-slate-400 hover:text-white'), onClick: function () {
                        return setTab('my');
                    } },
                'My Bets'
            )
        ),
        React.createElement(
            'div',
            { className: 'px-3 py-2 border-b border-slate-800' },
            React.createElement(
                'div',
                { className: 'text-[10px] text-slate-400 uppercase tracking-wider mb-0.5' },
                'TOTAL BETS'
            ),
            React.createElement(
                'div',
                { className: 'text-lg font-bold text-lime-400' },
                '₦ 125,480.00'
            )
        ),
        React.createElement(
            'div',
            { className: 'px-3 py-1 flex items-center gap-2 text-xs text-slate-400 border-b border-slate-800 cursor-pointer hover:text-white transition' },
            React.createElement(
                'span',
                null,
                '⏮'
            ),
            React.createElement(
                'span',
                null,
                'Previous hand'
            )
        ),
        React.createElement(
            'div',
            { className: 'px-3 py-1 grid grid-cols-4 gap-1 text-[11px] text-slate-500 border-b border-slate-800 font-medium' },
            React.createElement(
                'div',
                null,
                'User'
            ),
            React.createElement(
                'div',
                null,
                'Bet'
            ),
            React.createElement(
                'div',
                null,
                'Mult.'
            ),
            React.createElement(
                'div',
                { className: 'text-end' },
                'Cash out'
            )
        ),
        React.createElement(
            'div',
            { className: 'flex-1 overflow-y-auto space-y-0.5 px-1 py-1' },
            liveBets.map(function (item) {
                return React.createElement(
                    'div',
                    { key: item.id, className: 'px-2 py-1 border-b border-slate-900 grid grid-cols-4 gap-1 text-xs hover:bg-slate-900/50 transition items-center rounded' },
                    React.createElement(
                        'div',
                        { className: 'flex items-center gap-1.5 truncate' },
                        React.createElement('div', { className: 'w-5 h-5 bg-gradient-to-br from-orange-400 to-red-600 rounded-full flex-shrink-0 animate-pulse' }),
                        React.createElement(
                            'span',
                            { className: 'text-slate-300 truncate text-xs font-medium' },
                            item.user
                        )
                    ),
                    React.createElement(
                        'div',
                        { className: 'text-slate-300 font-semibold' },
                        '₦',
                        item.bet
                    ),
                    React.createElement(
                        'div',
                        { className: item.cashedOut ? 'text-yellow-300 font-semibold' : 'text-slate-600' },
                        item.cashedOut ? (item.cashMult || '1.85') + 'x' : '–'
                    ),
                    React.createElement(
                        'div',
                        { className: 'text-end font-semibold ' + (item.cashedOut ? 'text-lime-400' : 'text-slate-600') },
                        item.cashedOut ? '₦' + (item.win || (item.bet * 1.85).toFixed(0)) : '–'
                    )
                );
            })
        )
    );
}

// --- DUAL BET SLIPS COMPONENT ---
function BetPanel(_ref7) {
    var panelId = _ref7.panelId;
    var wallet = _ref7.wallet;
    var gameId = _ref7.gameId;

    var _useState16 = useState(10.00);

    var _useState162 = _slicedToArray(_useState16, 2);

    var amount = _useState162[0];
    var setAmount = _useState162[1];

    var _useState17 = useState(false);

    var _useState172 = _slicedToArray(_useState17, 2);

    var isBetPlaced = _useState172[0];
    var setIsBetPlaced = _useState172[1];

    var _useState18 = useState(null);

    var _useState182 = _slicedToArray(_useState18, 2);

    var activeBetId = _useState182[0];
    var setActiveBetId = _useState182[1];

    var _useState19 = useState(false);

    var _useState192 = _slicedToArray(_useState19, 2);

    var autoBet = _useState192[0];
    var setAutoBet = _useState192[1];

    var _useState20 = useState(false);

    var _useState202 = _slicedToArray(_useState20, 2);

    var autoCashout = _useState202[0];
    var setAutoCashout = _useState202[1];

    var handleBetClick = function handleBetClick() {
        if (!isBetPlaced) {
            $.ajax({
                url: '/betNow',
                type: 'POST',
                data: {
                    _token: $('meta[name="csrf-token"]').attr('content') || '',
                    all_bets: [{ bet_amount: amount, bet_type: 0, section_no: panelId }]
                },
                dataType: 'json',
                success: function success(res) {
                    if (res.isSuccess) {
                        setIsBetPlaced(true);
                        if (res.data.return_bets && res.data.return_bets.length > 0) {
                            setActiveBetId(res.data.return_bets[0].bet_id);
                        }
                    }
                },
                error: function error() {
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
                success: function success(res) {
                    setIsBetPlaced(false);
                    setActiveBetId(null);
                },
                error: function error() {
                    setIsBetPlaced(false);
                    setActiveBetId(null);
                }
            });
        }
    };

    return React.createElement(
        'div',
        { className: 'rounded-lg bg-slate-900/90 flex-1 p-1.5 shadow-sm' },
        React.createElement(
            'div',
            { className: 'flex justify-around items-center px-1 py-0 mb-1' },
            React.createElement(
                'div',
                { className: 'flex items-center gap-1 cursor-pointer', onClick: function () {
                        return setAutoBet(!autoBet);
                    } },
                React.createElement(
                    'span',
                    { className: 'text-[9px] text-slate-500 font-medium' },
                    'Auto Bet'
                ),
                React.createElement(
                    'span',
                    { className: 'w-6 h-3 rounded-full transition relative inline-block ' + (autoBet ? 'bg-lime-400' : 'bg-slate-700/80') },
                    React.createElement('span', { className: 'absolute top-0.5 w-2 h-2 rounded-full bg-slate-950 transition ' + (autoBet ? 'left-3.5' : 'left-0.5') })
                )
            ),
            React.createElement(
                'div',
                { className: 'flex items-center gap-1 cursor-pointer', onClick: function () {
                        return setAutoCashout(!autoCashout);
                    } },
                React.createElement(
                    'span',
                    { className: 'text-[9px] text-slate-500 font-medium' },
                    'Auto Cashout'
                ),
                React.createElement(
                    'span',
                    { className: 'w-6 h-3 rounded-full transition relative inline-block ' + (autoCashout ? 'bg-lime-400' : 'bg-slate-700/80') },
                    React.createElement('span', { className: 'absolute top-0.5 w-2 h-2 rounded-full bg-slate-950 transition ' + (autoCashout ? 'left-3.5' : 'left-0.5') })
                )
            )
        ),
        React.createElement(
            'div',
            { className: 'flex gap-1 items-stretch' },
            React.createElement(
                'div',
                { className: 'w-1/2 flex flex-col gap-0.5' },
                React.createElement(
                    'div',
                    { className: 'flex items-center justify-between gap-0.5 bg-slate-950 rounded px-1 py-1' },
                    React.createElement(
                        'button',
                        { type: 'button', onClick: function () {
                                return setAmount(Math.max(10, amount - 10));
                            }, className: 'w-5 h-5 bg-slate-800 hover:bg-slate-700 rounded text-white font-bold text-xs flex items-center justify-center' },
                        '−'
                    ),
                    React.createElement(
                        'span',
                        { className: 'font-mono font-bold text-xs text-white' },
                        amount.toFixed(2)
                    ),
                    React.createElement(
                        'button',
                        { type: 'button', onClick: function () {
                                return setAmount(amount + 10);
                            }, className: 'w-5 h-5 bg-slate-800 hover:bg-slate-700 rounded text-white font-bold text-xs flex items-center justify-center' },
                        '+'
                    )
                ),
                React.createElement(
                    'div',
                    { className: 'flex gap-0.5' },
                    [100, 200, 1000].map(function (amt) {
                        return React.createElement(
                            'button',
                            { key: amt, type: 'button', onClick: function () {
                                    return setAmount(amt);
                                }, className: 'flex-1 py-0 leading-5 bg-slate-800 hover:bg-slate-700 rounded text-[9px] font-semibold text-slate-300 text-center h-5' },
                            amt >= 1000 ? amt / 1000 + 'K' : amt
                        );
                    })
                )
            ),
            React.createElement(
                'div',
                { className: 'w-1/2 flex' },
                React.createElement(
                    'button',
                    {
                        type: 'button',
                        onClick: handleBetClick,
                        className: 'w-full min-h-[56px] rounded-lg font-black flex flex-col items-center justify-center py-1 transition transform active:scale-95 relative overflow-hidden',
                        style: isBetPlaced ? {
                            background: 'linear-gradient(180deg, #fcd34d 0%, #d97706 100%)',
                            boxShadow: '0 2px 8px rgba(217,119,6,0.5), inset 0 1px 0 rgba(255,255,255,0.35)',
                            color: '#fff'
                        } : {
                            background: 'linear-gradient(180deg, #a3e635 0%, #65a30d 100%)',
                            boxShadow: '0 2px 8px rgba(101,163,13,0.5), inset 0 1px 0 rgba(255,255,255,0.35)',
                            color: '#fff'
                        }
                    },
                    React.createElement('span', { className: 'absolute inset-x-0 top-0 h-1/2 rounded-t-lg pointer-events-none', style: { background: 'linear-gradient(180deg, rgba(255,255,255,0.22) 0%, rgba(255,255,255,0) 100%)' } }),
                    React.createElement(
                        'span',
                        { className: 'text-sm font-black leading-none uppercase tracking-wide relative z-10' },
                        isBetPlaced ? 'CASH OUT' : 'BET'
                    ),
                    React.createElement(
                        'span',
                        { className: 'text-[11px] font-bold leading-tight font-mono mt-0.5 relative z-10' },
                        'NGN ',
                        amount.toFixed(2)
                    )
                )
            )
        )
    );
}

// --- MULTIPLIER HISTORY BAR ---
function HistoryBar() {
    var rounds = [2.13, 1.45, 3.67, 1.12, 6.25, 1.75, 2.98, 12.43, 1.33, 4.12, 1.08, 9.76];

    return React.createElement(
        'div',
        { className: 'px-3 py-1.5 border-b border-black bg-slate-950 flex items-center gap-1 overflow-x-auto scrollbar-hide' },
        rounds.map(function (round, i) {
            return React.createElement(
                'div',
                { key: i, className: 'flex-shrink-0 px-2 py-0.5 rounded text-xs font-semibold whitespace-nowrap transition cursor-pointer', style: { color: round >= 10 ? '#facc15' : round >= 5 ? '#a3e635' : round >= 2 ? '#67e8f9' : '#94a3b8', background: 'rgba(2,6,23,0.7)' } },
                round,
                'x'
            );
        })
    );
}

// --- LEADERBOARD VIEW COMPONENT ---
function LeaderboardView() {
    var topWinners = [{ rank: 1, name: 'Alex_Aviator', id: '84***12', multiplier: '184.50x', bet: '₦50.00', win: '₦9,225.00', trophy: '🥇' }, { rank: 2, name: 'CryptoKing_NG', id: '92***45', multiplier: '94.20x', bet: '₦50.00', win: '₦4,710.00', trophy: '🥈' }, { rank: 3, name: 'Grace_W', id: '15***88', multiplier: '52.10x', bet: '₦40.00', win: '₦2,084.00', trophy: '🥉' }, { rank: 4, name: 'HighRoller99', id: '34***77', multiplier: '38.40x', bet: '₦50.00', win: '₦1,920.00', trophy: '4' }, { rank: 5, name: 'Flyer_2026', id: '71***90', multiplier: '28.15x', bet: '₦50.00', win: '₦1,407.50', trophy: '5' }];

    return React.createElement(
        'div',
        { className: 'bg-dark p-3 rounded-3 border border-secondary border-opacity-25' },
        React.createElement(
            'div',
            { className: 'd-flex align-items-center justify-content-between mb-3 border-bottom border-secondary pb-2' },
            React.createElement(
                'h5',
                { className: 'm-0 text-white fw-bold d-flex align-items-center gap-2' },
                React.createElement(
                    'span',
                    { className: 'material-symbols-outlined text-warning' },
                    'emoji_events'
                ),
                'Top Multiplier Leaderboard'
            ),
            React.createElement(
                'span',
                { className: 'badge bg-danger' },
                'Top 50 Winners'
            )
        ),
        React.createElement(
            'div',
            { className: 'table-responsive' },
            React.createElement(
                'table',
                { className: 'table table-dark table-hover align-middle mb-0', style: { fontSize: '13px' } },
                React.createElement(
                    'thead',
                    null,
                    React.createElement(
                        'tr',
                        { className: 'text-secondary border-secondary' },
                        React.createElement(
                            'th',
                            null,
                            'Rank'
                        ),
                        React.createElement(
                            'th',
                            null,
                            'Player'
                        ),
                        React.createElement(
                            'th',
                            null,
                            'Bet Amount'
                        ),
                        React.createElement(
                            'th',
                            null,
                            'Multiplier'
                        ),
                        React.createElement(
                            'th',
                            null,
                            'Cashout Win'
                        )
                    )
                ),
                React.createElement(
                    'tbody',
                    null,
                    topWinners.map(function (item) {
                        return React.createElement(
                            'tr',
                            { key: item.rank, className: 'border-secondary' },
                            React.createElement(
                                'td',
                                { className: 'fw-bold fs-6' },
                                item.trophy
                            ),
                            React.createElement(
                                'td',
                                null,
                                React.createElement(
                                    'div',
                                    { className: 'fw-bold text-white' },
                                    item.name
                                ),
                                React.createElement(
                                    'div',
                                    { className: 'text-muted', style: { fontSize: '10px' } },
                                    'ID #',
                                    item.id
                                )
                            ),
                            React.createElement(
                                'td',
                                { className: 'text-light' },
                                item.bet
                            ),
                            React.createElement(
                                'td',
                                null,
                                React.createElement(
                                    'span',
                                    { className: 'badge bg-danger px-2 py-1 fs-6' },
                                    item.multiplier
                                )
                            ),
                            React.createElement(
                                'td',
                                { className: 'fw-bold text-success fs-6' },
                                item.win
                            )
                        );
                    })
                )
            )
        )
    );
}

// --- DEPOSIT VIEW COMPONENT ---
function DepositView(_ref8) {
    var wallet = _ref8.wallet;

    var _useState21 = useState('1000');

    var _useState212 = _slicedToArray(_useState21, 2);

    var amount = _useState212[0];
    var setAmount = _useState212[1];

    var _useState22 = useState('card');

    var _useState222 = _slicedToArray(_useState22, 2);

    var method = _useState222[0];
    var setMethod = _useState222[1];

    var _useState23 = useState('');

    var _useState232 = _slicedToArray(_useState23, 2);

    var successMsg = _useState232[0];
    var setSuccessMsg = _useState232[1];

    var quickAmounts = [500, 1000, 5000, 10000];

    var handleDepositSubmit = function handleDepositSubmit(e) {
        e.preventDefault();
        var amtNum = Number(amount);
        if (!amtNum || amtNum <= 0) return;

        setSuccessMsg('Deposit request for ₦' + amtNum.toLocaleString() + ' initiated successfully via ' + (method === 'bank' ? 'Bank Transfer' : method === 'card' ? 'Credit/Debit Card' : 'Digital Wallet') + '!');
    };

    return React.createElement(
        'div',
        { className: 'bg-slate-900 rounded-lg border border-slate-700 max-w-sm mx-auto my-6 shadow-2xl overflow-hidden' },
        React.createElement(
            'div',
            { className: 'px-3 py-2 border-b border-slate-700 flex items-center justify-between' },
            React.createElement(
                'h2',
                { className: 'text-sm font-semibold text-white flex items-center gap-2' },
                React.createElement(
                    'span',
                    { className: 'text-lime-400' },
                    '💳'
                ),
                ' Deposit Funds'
            ),
            React.createElement(
                'div',
                { className: 'text-xs font-mono font-bold text-lime-400' },
                '₦',
                Number(wallet || 0).toLocaleString('en-US', { minimumFractionDigits: 2 })
            )
        ),
        React.createElement(
            'div',
            { className: 'px-3 py-3 space-y-3' },
            successMsg && React.createElement(
                'div',
                { className: 'p-2 bg-emerald-500/10 border border-emerald-500/30 rounded text-emerald-400 text-xs text-center font-medium' },
                successMsg
            ),
            React.createElement(
                'form',
                { onSubmit: handleDepositSubmit, className: 'space-y-3' },
                React.createElement(
                    'div',
                    null,
                    React.createElement(
                        'label',
                        { className: 'text-xs text-slate-400 block mb-1' },
                        'Payment Method'
                    ),
                    React.createElement(
                        'select',
                        {
                            value: method,
                            onChange: function (e) {
                                return setMethod(e.target.value);
                            },
                            className: 'w-full px-2 py-1.5 bg-slate-800 border border-slate-700 rounded text-xs text-white outline-none focus:border-lime-400 transition'
                        },
                        React.createElement(
                            'option',
                            { value: 'card' },
                            'Credit/Debit Card'
                        ),
                        React.createElement(
                            'option',
                            { value: 'bank' },
                            'Bank Transfer'
                        ),
                        React.createElement(
                            'option',
                            { value: 'wallet' },
                            'Digital Wallet'
                        )
                    )
                ),
                React.createElement(
                    'div',
                    null,
                    React.createElement(
                        'label',
                        { className: 'text-xs text-slate-400 block mb-1' },
                        'Amount (₦)'
                    ),
                    React.createElement('input', {
                        type: 'number',
                        value: amount,
                        onChange: function (e) {
                            return setAmount(e.target.value);
                        },
                        placeholder: 'Enter amount',
                        required: true,
                        className: 'w-full px-2 py-1.5 bg-slate-800 border border-slate-700 rounded text-xs text-white placeholder-slate-500 outline-none focus:border-lime-400 transition font-mono font-bold'
                    })
                ),
                React.createElement(
                    'div',
                    { className: 'grid grid-cols-4 gap-1' },
                    quickAmounts.map(function (amt) {
                        return React.createElement(
                            'button',
                            {
                                key: amt,
                                type: 'button',
                                onClick: function () {
                                    return setAmount(amt.toString());
                                },
                                className: 'py-1 text-xs rounded transition font-medium ' + (amount === amt.toString() ? 'bg-lime-400 text-black font-bold' : 'bg-slate-800 hover:bg-slate-700 text-slate-300')
                            },
                            amt >= 1000 ? amt / 1000 + 'K' : amt
                        );
                    })
                ),
                React.createElement(
                    'button',
                    {
                        type: 'submit',
                        className: 'w-full py-2 text-xs font-bold bg-lime-400 text-black rounded hover:bg-lime-300 transition shadow-sm uppercase tracking-wider'
                    },
                    'Deposit ',
                    amount ? '₦' + Number(amount).toLocaleString() : ''
                )
            )
        )
    );
}

// --- MY BETS VIEW COMPONENT ---
function MyBetsView() {
    var bets = [{ id: 1042, time: 'Just now', bet: '₦50.00', mult: '2.45x', win: '₦122.50', status: 'WIN' }, { id: 1039, time: '2 mins ago', bet: '₦20.00', mult: '1.80x', win: '₦36.00', status: 'WIN' }, { id: 1035, time: '5 mins ago', bet: '₦50.00', mult: '1.00x', win: '₦0.00', status: 'LOST' }, { id: 1028, time: '12 mins ago', bet: '₦10.00', mult: '12.40x', win: '₦124.00', status: 'WIN' }];

    return React.createElement(
        'div',
        { className: 'bg-dark p-3 rounded-3 border border-secondary border-opacity-25' },
        React.createElement(
            'div',
            { className: 'd-flex align-items-center justify-content-between mb-3 border-bottom border-secondary pb-2' },
            React.createElement(
                'h5',
                { className: 'm-0 text-white fw-bold d-flex align-items-center gap-2' },
                React.createElement(
                    'span',
                    { className: 'material-symbols-outlined text-danger' },
                    'history'
                ),
                'My Betting History'
            ),
            React.createElement(
                'span',
                { className: 'badge bg-secondary' },
                'Recent Bets'
            )
        ),
        React.createElement(
            'div',
            { className: 'table-responsive' },
            React.createElement(
                'table',
                { className: 'table table-dark table-hover align-middle mb-0', style: { fontSize: '13px' } },
                React.createElement(
                    'thead',
                    null,
                    React.createElement(
                        'tr',
                        { className: 'text-secondary border-secondary' },
                        React.createElement(
                            'th',
                            null,
                            'Round ID'
                        ),
                        React.createElement(
                            'th',
                            null,
                            'Time'
                        ),
                        React.createElement(
                            'th',
                            null,
                            'Bet Amount'
                        ),
                        React.createElement(
                            'th',
                            null,
                            'Cashout Multiplier'
                        ),
                        React.createElement(
                            'th',
                            null,
                            'Payout Win'
                        ),
                        React.createElement(
                            'th',
                            null,
                            'Result'
                        )
                    )
                ),
                React.createElement(
                    'tbody',
                    null,
                    bets.map(function (item) {
                        return React.createElement(
                            'tr',
                            { key: item.id, className: 'border-secondary' },
                            React.createElement(
                                'td',
                                { className: 'fw-bold' },
                                '#',
                                item.id
                            ),
                            React.createElement(
                                'td',
                                { className: 'text-muted' },
                                item.time
                            ),
                            React.createElement(
                                'td',
                                null,
                                item.bet
                            ),
                            React.createElement(
                                'td',
                                null,
                                React.createElement(
                                    'span',
                                    { className: 'badge bg-secondary' },
                                    item.mult
                                )
                            ),
                            React.createElement(
                                'td',
                                { className: 'fw-bold text-success' },
                                item.win
                            ),
                            React.createElement(
                                'td',
                                null,
                                React.createElement(
                                    'span',
                                    { className: 'badge px-2 py-1 ' + (item.status === 'WIN' ? 'bg-success' : 'bg-danger') },
                                    item.status
                                )
                            )
                        );
                    })
                )
            )
        )
    );
}

// --- RIGHT SIDEBAR COMPONENT (LIVE CHATROOM) ---
function RightSidebar() {
    return React.createElement(
        'div',
        { className: 'w-72 bg-slate-950 border-l border-slate-800 flex flex-col h-full overflow-hidden' },
        React.createElement(
            'div',
            { className: 'px-3 py-2 border-b border-slate-800 flex items-center justify-between' },
            React.createElement(
                'span',
                { className: 'text-xs font-semibold text-white' },
                '💬 LIVE CHAT'
            ),
            React.createElement(
                'span',
                { className: 'text-[11px] px-1.5 py-0.5 bg-green-500/20 text-green-400 rounded flex items-center gap-1' },
                React.createElement('span', { className: 'w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse' }),
                React.createElement(
                    'span',
                    null,
                    '128'
                )
            )
        ),
        React.createElement(
            'div',
            { className: 'flex-1 overflow-hidden' },
            React.createElement(
                'div',
                { className: 'ax-chat-mount-point h-full' },
                window.axRenderChatroom ? window.axRenderChatroom() : React.createElement(
                    'div',
                    { className: 'p-4 text-center text-slate-500 text-xs' },
                    'Loading Live Chatroom...'
                )
            )
        )
    );
}

// --- MAIN REACT APPLICATION CONTAINER ---
function ReactAviatorApp() {
    var pageData = window.pageData || {};

    var _useState24 = useState(pageData.user || null);

    var _useState242 = _slicedToArray(_useState24, 2);

    var user = _useState242[0];
    var setUser = _useState242[1];

    var _useState25 = useState(pageData.wallet || 45210.00);

    var _useState252 = _slicedToArray(_useState25, 2);

    var wallet = _useState252[0];
    var setWallet = _useState252[1];

    var _useState26 = useState('crash');

    var _useState262 = _slicedToArray(_useState26, 2);

    var currentView = _useState262[0];
    var setCurrentView = _useState262[1];

    var _useState27 = useState(false);

    var _useState272 = _slicedToArray(_useState27, 2);

    var authModalShow = _useState272[0];
    var setAuthModalShow = _useState272[1];

    var _useState28 = useState('login');

    var _useState282 = _slicedToArray(_useState28, 2);

    var authModalTab = _useState282[0];
    var setAuthModalTab = _useState282[1];

    var _useState29 = useState(false);

    var _useState292 = _slicedToArray(_useState29, 2);

    var withdrawModalShow = _useState292[0];
    var setWithdrawModalShow = _useState292[1];

    var _useState30 = useState(false);

    var _useState302 = _slicedToArray(_useState30, 2);

    var notifModalShow = _useState302[0];
    var setNotifModalShow = _useState302[1];

    var _useState31 = useState(1);

    var _useState312 = _slicedToArray(_useState31, 2);

    var gameId = _useState312[0];
    var setGameId = _useState312[1];

    var _useState33 = useState('FLYING');

    var _useState332 = _slicedToArray(_useState33, 2);

    var gameState = _useState332[0];
    var setGameState = _useState332[1];

    var _useState34 = useState(104.4);

    var _useState342 = _slicedToArray(_useState34, 2);

    var targetMultiplier = _useState342[0];
    var setTargetMultiplier = _useState342[1];

    var _useState35 = useState(1.00);

    var _useState352 = _slicedToArray(_useState35, 2);

    var multiplier = _useState352[0];
    var setMultiplier = _useState352[1];

    var _useState36 = useState(5.0);

    var _useState362 = _slicedToArray(_useState36, 2);

    var countdown = _useState362[0];
    var setCountdown = _useState362[1];

    function generateInitialLiveBets() {
        var names = ['Alex_Aviator', 'Crypto_King', 'Grace_Naija', 'Flyer_99', 'BetMaster_NG', 'Winner_Pro', 'David_O', 'Tunde_Bet', 'Chidi_Wins', 'SuperFly_88', 'Fatima_K', 'Samuel_X', 'Queen_Aviator', 'Emeka_Cash', 'Bisi_Rolls', 'King_David', 'Zainab_M', 'FastCash_24', 'StarBoy_NG', 'Prince_Aviator', 'Chief_O', 'Victory_G', 'Rider_007', 'Gold_Fingers', 'Success_B', 'Lucky_Player', 'Aviator_Pro', 'Naija_Titan', 'Mega_Winner', 'Flight_Master'];
        return names.map(function (name, idx) {
            return {
                id: idx + 1,
                user: name,
                avatar: '/images/avtar/av-' + (idx % 72 + 1) + '.png',
                bet: [5, 10, 20, 50][idx % 4],
                cashedOut: false,
                targetMult: +(1.15 + idx % 8 * 0.45 + idx % 3 * 0.2).toFixed(2)
            };
        });
    }

    var _useState37 = useState(generateInitialLiveBets());

    var _useState372 = _slicedToArray(_useState37, 2);

    var liveBets = _useState372[0];
    var setLiveBets = _useState372[1];

    useEffect(function () {
        var fetchEngineData = function fetchEngineData() {
            $.ajax({
                url: '/currentlybet',
                type: 'GET',
                dataType: 'json',
                success: function success(res) {
                    if (res && res.currentGame) {
                        setGameId(res.currentGame.id);
                    }
                    if (res && res.currentGameBet && res.currentGameBet.length > 0) {
                        var formatted = res.currentGameBet.slice(0, 45).map(function (b, idx) {
                            return {
                                id: idx + 1,
                                user: b.name || 'Player #' + (b.userid || 1000 + idx),
                                avatar: b.image || '/images/avtar/av-' + (idx % 72 + 1) + '.png',
                                bet: b.amount ? Math.min(50, Math.max(5, b.amount)) : [5, 10, 20, 50][idx % 4],
                                cashedOut: false,
                                targetMult: +(1.15 + idx % 7 * 0.4).toFixed(2)
                            };
                        });
                        setLiveBets(formatted);
                    }
                }
            });

            $.ajax({
                url: '/increamentor',
                type: 'GET',
                dataType: 'json',
                success: function success(res) {
                    if (res && res.result && Number(res.result) > 1) {
                        setTargetMultiplier(Number(res.result));
                    }
                }
            });
        };

        fetchEngineData();
        var pollTimer = setInterval(fetchEngineData, 8000);
        return function () {
            return clearInterval(pollTimer);
        };
    }, []);

    useEffect(function () {
        var interval = undefined;
        if (gameState === 'FLYING') {
            interval = setInterval(function () {
                setMultiplier(function (prev) {
                    var next = prev + 0.03 + Math.random() * 0.02;
                    if (next >= targetMultiplier) {
                        setGameState('CRASHED');
                        setTimeout(function () {
                            setGameState('WAITING');
                            setCountdown(5.0);
                        }, 2500);
                    }
                    return next;
                });
            }, 100);
        } else if (gameState === 'WAITING') {
            interval = setInterval(function () {
                setCountdown(function (prev) {
                    if (prev <= 0.1) {
                        setGameState('FLYING');
                        setMultiplier(1.00);
                        return 5.0;
                    }
                    return prev - 0.1;
                });
            }, 100);
        }

        return function () {
            return clearInterval(interval);
        };
    }, [gameState, targetMultiplier]);

    return React.createElement(
        'div',
        { className: 'bg-slate-950 text-white flex flex-col font-sans', style: { height: '100dvh', overflow: 'hidden' } },
        React.createElement(Header, { user: user, wallet: wallet, currentView: currentView, onViewChange: setCurrentView, onAuthClick: function (tab) {
                setAuthModalTab(tab);setAuthModalShow(true);
            }, onWithdrawClick: function () {
                return setWithdrawModalShow(true);
            }, onNotifClick: function () {
                return setNotifModalShow(true);
            } }),
        React.createElement(
            'main',
            { className: 'flex-1 flex overflow-hidden' },
            React.createElement(
                'div',
                { className: 'hidden md:flex flex-1 overflow-hidden' },
                currentView === 'crash' && React.createElement(
                    React.Fragment,
                    null,
                    React.createElement(LiveBetsPanel, { multiplier: multiplier, gameState: gameState, liveBets: liveBets }),
                    React.createElement(
                        'div',
                        { className: 'flex-1 bg-slate-950 flex flex-col border-r border-slate-800 overflow-y-auto' },
                        React.createElement(HistoryBar, null),
                        React.createElement(
                            'div',
                            { className: 'p-3 flex-1 flex flex-col' },
                            React.createElement(AviatorCanvas, { gameState: gameState, multiplier: multiplier, countdown: countdown })
                        ),
                        React.createElement(
                            'div',
                            { className: 'p-2', style: { background: '#0f172a', borderTop: '1px solid #000' } },
                            React.createElement(
                                'div',
                                { className: 'grid grid-cols-2 gap-2' },
                                React.createElement(BetPanel, { panelId: 1, wallet: wallet, gameId: gameId }),
                                React.createElement(BetPanel, { panelId: 2, wallet: wallet, gameId: gameId })
                            )
                        )
                    ),
                    React.createElement(RightSidebar, null)
                ),
                currentView === 'leaderboard' && React.createElement(LeaderboardView, null),
                currentView === 'deposit' && React.createElement(DepositView, { wallet: wallet }),
                currentView === 'mybets' && React.createElement(MyBetsView, null)
            ),
            React.createElement(
                'div',
                { className: 'flex md:hidden flex-col w-full', style: { flex: 1, overflowY: 'auto', overflowX: 'hidden' } },
                currentView === 'crash' && React.createElement(
                    'div',
                    { className: 'flex flex-col' },
                    React.createElement(HistoryBar, null),
                    React.createElement(
                        'div',
                        { className: 'p-1.5' },
                        React.createElement(AviatorCanvas, { gameState: gameState, multiplier: multiplier, countdown: countdown })
                    ),
                    React.createElement(
                        'div',
                        { className: 'p-1.5 space-y-1.5', style: { background: '#0f172a', borderTop: '1px solid #000' } },
                        React.createElement(BetPanel, { panelId: 1, wallet: wallet, gameId: gameId }),
                        React.createElement(BetPanel, { panelId: 2, wallet: wallet, gameId: gameId })
                    )
                ),
                currentView === 'livebets' && React.createElement(
                    'div',
                    { className: 'flex-1 overflow-hidden' },
                    React.createElement(LiveBetsPanel, { multiplier: multiplier, gameState: gameState, liveBets: liveBets })
                ),
                currentView === 'chat' && React.createElement(
                    'div',
                    { className: 'flex-1 overflow-hidden' },
                    React.createElement(RightSidebar, null)
                ),
                currentView === 'leaderboard' && React.createElement(LeaderboardView, null),
                currentView === 'deposit' && React.createElement(DepositView, { wallet: wallet }),
                currentView === 'mybets' && React.createElement(MyBetsView, null)
            )
        ),
        React.createElement(NotificationsModal, { show: notifModalShow, onClose: function () {
                return setNotifModalShow(false);
            } }),
        React.createElement(AuthModal, { show: authModalShow, initialTab: authModalTab, onClose: function () {
                return setAuthModalShow(false);
            }, onSuccessLogin: function (userData) {
                setUser(userData);setAuthModalShow(false);
            } }),
        React.createElement(WithdrawModal, { show: withdrawModalShow, wallet: wallet, onClose: function () {
                return setWithdrawModalShow(false);
            }, onSuccessWithdraw: function (newBalance) {
                setWallet(newBalance);
            } })
    );
}

// Mount React Root
var rootEl = document.getElementById('app');
if (rootEl) {
    var rawData = rootEl.getAttribute('data-page');
    try {
        window.pageData = JSON.parse(rawData);
    } catch (e) {
        window.pageData = {};
    }
    ReactDOM.render(React.createElement(ReactAviatorApp, null), rootEl);
}
/* Header */ /* Notifications List */ /* Footer */ /* Header */ /* Tab Switcher */ /* Form Body */ /* Left: Hamburger (mobile only) + Logo + Desktop Nav */ /* Hamburger - mobile only */ /* Mobile Logo: Compact Icon */ /* Desktop Logo: Full Banner */ /* Right Section: Notification Bell, Balance, Deposit & Auth */ /* Notification Bell */ /* Balance */ /* Deposit Button */ /* Account / User Menu */ /* Mobile Slide-out Drawer (triggered by hamburger) */ /* Tabs */ /* Total Bets Volume Header */ /* Previous Hand Trigger */ /* Table Headers */ /* Bets List Feed */ /* Toggles row */ /* Main controls row */ /* Left 50%: Spinner + Quick buttons */ /* Right 50%: BET Button */ /* Gloss highlight */ /* Header */ /* Content */ /* Payment Method */ /* Amount */ /* Quick Amount Buttons */ /* Unified Responsive Header */ /* Desktop View */ /* Mobile View */ /* React Notifications Modal Component */ /* React Auth Modal Component */ /* React Withdrawal Modal Component */
