<!--====== Deposit & Withdraw Popup Modals ======-->
<style>
/* ---- AX Wallet Modal — force dark overlay + dark popup ---- */
.ax-modal .modal-dialog {
    max-width: 400px;
    margin: auto;
}
.ax-modal .modal-content {
    background: #13141a !important;
    border: 1px solid rgba(255,255,255,0.1) !important;
    border-radius: 16px !important;
    color: #fff !important;
    box-shadow: 0 24px 64px rgba(0,0,0,0.7) !important;
}
.ax-modal .modal-header {
    background: #0d0e13 !important;
    border-bottom: 1px solid rgba(255,255,255,0.07) !important;
    padding: 14px 18px !important;
    border-radius: 16px 16px 0 0 !important;
    align-items: center !important;
}
.ax-modal .modal-header .modal-title {
    font-size: 13px !important;
    font-weight: 800 !important;
    letter-spacing: 0.08em !important;
    color: #fff !important;
}
.ax-modal .modal-body {
    padding: 18px !important;
    background: #13141a !important;
    border-radius: 0 0 16px 16px !important;
}
/* Backdrop dark overlay */
.modal-backdrop {
    background-color: #000 !important;
}
.modal-backdrop.show {
    opacity: 0.75 !important;
}
/* Wallet tab row */
.ax-wallet-tabs {
    display: flex;
    gap: 6px;
    margin-bottom: 16px;
}
.ax-wallet-tab {
    flex: 1;
    text-align: center;
    padding: 8px 12px;
    font-size: 11px;
    font-weight: 800;
    letter-spacing: 0.06em;
    border-radius: 8px;
    border: 1px solid rgba(255,255,255,0.1);
    color: #8a8d9b;
    background: transparent;
    cursor: pointer;
    transition: all 0.15s;
}
.ax-wallet-tab.active,
.ax-wallet-tab:hover {
    color: #fff;
    background: #ff1e46;
    border-color: #ff1e46;
}
/* Amount input row */
.ax-amount-row {
    display: flex;
    align-items: center;
    background: #08090c;
    border: 1px solid rgba(255,255,255,0.1);
    border-radius: 10px;
    overflow: hidden;
}
.ax-amount-symbol {
    padding: 0 12px;
    font-size: 15px;
    font-weight: 700;
    color: #00e676;
    flex-shrink: 0;
}
.ax-amount-input {
    flex: 1;
    background: transparent !important;
    border: none !important;
    color: #fff !important;
    font-size: 15px !important;
    font-weight: 700 !important;
    padding: 10px 8px 10px 0 !important;
    outline: none !important;
}
.ax-amount-input::placeholder { color: #454759; }
.ax-amount-row:focus-within {
    border-color: #00e676;
    box-shadow: 0 0 0 2px rgba(0,230,118,0.12);
}
/* Quick amount chips */
.ax-chips {
    display: flex;
    gap: 6px;
    flex-wrap: wrap;
    margin-top: 10px;
}
.ax-chip {
    flex: 1;
    min-width: 54px;
    padding: 6px 4px;
    font-size: 11px;
    font-weight: 700;
    text-align: center;
    background: #08090c;
    border: 1px solid rgba(255,255,255,0.1);
    border-radius: 6px;
    color: #8a8d9b;
    cursor: pointer;
    transition: all 0.15s;
}
.ax-chip:hover, .ax-chip.active {
    background: rgba(0,230,118,0.1);
    border-color: #00e676;
    color: #00e676;
}
/* Field label */
.ax-field-label {
    display: block;
    font-size: 10px;
    font-weight: 700;
    letter-spacing: 0.08em;
    color: #8a8d9b;
    margin-bottom: 5px;
    text-transform: uppercase;
}
/* Dark form control */
.ax-input {
    width: 100%;
    background: #08090c !important;
    border: 1px solid rgba(255,255,255,0.1) !important;
    border-radius: 10px !important;
    color: #fff !important;
    font-size: 13px !important;
    padding: 10px 12px !important;
    outline: none !important;
    transition: border-color 0.15s;
}
.ax-input:focus {
    border-color: #00e676 !important;
    box-shadow: 0 0 0 2px rgba(0,230,118,0.12) !important;
}
.ax-input::placeholder { color: #454759; }
/* Payment method buttons */
.ax-pay-grid {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 8px;
    margin-bottom: 16px;
}
.ax-pay-method {
    background: #08090c;
    border: 1px solid rgba(255,255,255,0.08);
    border-radius: 10px;
    padding: 12px 8px;
    cursor: pointer;
    text-align: center;
    transition: all 0.15s;
    color: #8a8d9b;
    font-size: 10px;
    font-weight: 700;
}
.ax-pay-method img { max-height: 22px; display: block; margin: 0 auto 4px; }
.ax-pay-method:hover, .ax-pay-method.selected {
    border-color: #00e676;
    background: rgba(0,230,118,0.06);
    color: #00e676;
}
/* CTA buttons */
.ax-cta-green {
    width: 100%;
    padding: 13px;
    font-size: 13px;
    font-weight: 900;
    letter-spacing: 0.08em;
    color: #fff;
    background: linear-gradient(135deg, #00e676, #00b050);
    border: none;
    border-radius: 10px;
    cursor: pointer;
    transition: all 0.15s;
    box-shadow: 0 4px 16px rgba(0,230,118,0.3);
    margin-top: 6px;
}
.ax-cta-green:hover { box-shadow: 0 6px 22px rgba(0,230,118,0.5); transform: translateY(-1px); }
.ax-cta-red {
    width: 100%;
    padding: 13px;
    font-size: 13px;
    font-weight: 900;
    letter-spacing: 0.08em;
    color: #fff;
    background: linear-gradient(135deg, #ff1e46, #cc1436);
    border: none;
    border-radius: 10px;
    cursor: pointer;
    transition: all 0.15s;
    box-shadow: 0 4px 16px rgba(255,30,70,0.3);
    margin-top: 6px;
}
.ax-cta-red:hover { box-shadow: 0 6px 22px rgba(255,30,70,0.5); transform: translateY(-1px); }
/* Balance banner */
.ax-balance-banner {
    display: flex;
    align-items: center;
    justify-content: space-between;
    background: #08090c;
    border: 1px solid rgba(255,255,255,0.07);
    border-radius: 10px;
    padding: 10px 14px;
    margin-bottom: 14px;
}
.ax-balance-label { font-size: 10px; font-weight: 700; color: #8a8d9b; letter-spacing: 0.06em; }
.ax-balance-value { font-size: 16px; font-weight: 900; color: #00e676; }
/* section label */
.ax-section-label {
    font-size: 10px;
    font-weight: 700;
    letter-spacing: 0.08em;
    color: #545766;
    text-transform: uppercase;
    margin-bottom: 8px;
}
</style>

<!-- ========== DEPOSIT MODAL ========== -->
<div class="modal fade ax-modal" id="deposit-modal" tabindex="-1" aria-labelledby="depositModalLabel" aria-hidden="true">
    <div class="modal-dialog modal-dialog-centered modal-dialog-scrollable">
        <div class="modal-content">
            <div class="modal-header">
                <h5 class="modal-title" id="depositModalLabel">
                    <span class="material-symbols-outlined align-middle me-1" style="color:#00e676;font-size:16px;">add_circle</span>
                    DEPOSIT FUNDS
                </h5>
                <button type="button" class="btn-close btn-close-white" data-bs-dismiss="modal" aria-label="Close"></button>
            </div>
            <div class="modal-body">
                <!-- Tabs -->
                <div class="ax-wallet-tabs">
                    <button type="button" class="ax-wallet-tab active">DEPOSIT</button>
                    <button type="button" class="ax-wallet-tab" onclick="switchWalletModal('withdraw')">WITHDRAW</button>
                </div>

                <!-- Payment Method -->
                <div class="ax-section-label">SELECT PAYMENT METHOD</div>
                <div class="ax-pay-grid">
                    <div class="ax-pay-method selected" onclick="selectPayMethod(this,'6')">
                        <img src="images/app-logo/interkassa_net_banking.svg" />
                        Net Banking
                    </div>
                    <div class="ax-pay-method" onclick="selectPayMethod(this,'3')">
                        <img src="images/app-logo/upiMt.svg" />
                        UPI
                    </div>
                </div>
                <input type="hidden" id="dep_modal_gateway" value="6">

                <!-- Amount -->
                <div class="ax-section-label">ENTER AMOUNT (₦)</div>
                <div class="ax-amount-row">
                    <span class="ax-amount-symbol">₦</span>
                    <input type="number" class="ax-amount-input" id="modal_deposit_amount" value="1000" min="100" placeholder="Min {{ setting('min_recharge') ?: '500' }}">
                </div>
                <div class="ax-chips">
                    <div class="ax-chip" onclick="setDepAmt(500)">500</div>
                    <div class="ax-chip active" onclick="setDepAmt(1000)">1,000</div>
                    <div class="ax-chip" onclick="setDepAmt(2500)">2,500</div>
                    <div class="ax-chip" onclick="setDepAmt(5000)">5,000</div>
                </div>

                <button type="button" class="ax-cta-green" onclick="submitModalDeposit()">
                    ✈ DEPOSIT NOW
                </button>
            </div>
        </div>
    </div>
</div>

<!-- ========== WITHDRAW MODAL ========== -->
<div class="modal fade ax-modal" id="withdraw-modal" tabindex="-1" aria-labelledby="withdrawModalLabel" aria-hidden="true">
    <div class="modal-dialog modal-dialog-centered modal-dialog-scrollable">
        <div class="modal-content">
            <div class="modal-header">
                <h5 class="modal-title" id="withdrawModalLabel">
                    <span class="material-symbols-outlined align-middle me-1" style="color:#ff1e46;font-size:16px;">account_balance_wallet</span>
                    WITHDRAW FUNDS
                </h5>
                <button type="button" class="btn-close btn-close-white" data-bs-dismiss="modal" aria-label="Close"></button>
            </div>
            <div class="modal-body">
                <!-- Tabs -->
                <div class="ax-wallet-tabs">
                    <button type="button" class="ax-wallet-tab" onclick="switchWalletModal('deposit')">DEPOSIT</button>
                    <button type="button" class="ax-wallet-tab active">WITHDRAW</button>
                </div>

                <!-- Balance -->
                <div class="ax-balance-banner">
                    <span class="ax-balance-label">AVAILABLE BALANCE</span>
                    <span class="ax-balance-value">₦{{ session()->has('userlogin') ? wallet(user('id')) : '0' }}</span>
                </div>

                <form action="/insert/withdrawal" method="post" id="modal_withdraw_form">
                    @csrf
                    <input type="hidden" name="payment_gateway_type" value="6">

                    <div style="margin-bottom:12px;">
                        <label class="ax-field-label" for="modal_withdraw_amount">WITHDRAWAL AMOUNT (₦)</label>
                        <input type="number" class="ax-input" id="modal_withdraw_amount" name="amount" placeholder="Enter amount" required>
                    </div>
                    <div style="margin-bottom:12px;">
                        <label class="ax-field-label" for="modal_account_no">ACCOUNT NUMBER</label>
                        <input type="text" class="ax-input" id="modal_account_no" name="account_no" placeholder="Bank Account Number" required>
                    </div>
                    <div style="margin-bottom:12px;">
                        <label class="ax-field-label" for="modal_account_holder">ACCOUNT HOLDER NAME</label>
                        <input type="text" class="ax-input" id="modal_account_holder" name="account_holder_name" placeholder="Full Name" required>
                    </div>
                    <div style="margin-bottom:12px;">
                        <label class="ax-field-label" for="modal_ifsc">IFSC / BANK CODE</label>
                        <input type="text" class="ax-input" id="modal_ifsc" name="ifsc_code" placeholder="IFSC Code" required>
                    </div>

                    <button type="submit" class="ax-cta-red">
                        💳 SUBMIT WITHDRAWAL
                    </button>
                </form>
            </div>
        </div>
    </div>
</div>

<script>
function switchWalletModal(target) {
    var from = target === 'withdraw' ? 'deposit' : 'withdraw';
    var fromModal = bootstrap.Modal.getInstance(document.getElementById(from + '-modal'));
    if (fromModal) fromModal.hide();
    setTimeout(function() {
        var toModal = new bootstrap.Modal(document.getElementById(target + '-modal'));
        toModal.show();
    }, 300);
}
function setDepAmt(val) {
    $('#modal_deposit_amount').val(val);
    $('.ax-chip').removeClass('active');
    event.currentTarget.classList.add('active');
}
function selectPayMethod(el, gatewayId) {
    document.querySelectorAll('.ax-pay-method').forEach(function(m){ m.classList.remove('selected'); });
    el.classList.add('selected');
    document.getElementById('dep_modal_gateway').value = gatewayId;
}
function submitModalDeposit() {
    var amt = parseFloat($('#modal_deposit_amount').val());
    if (!amt || amt < 100) {
        if (typeof toastr !== 'undefined') toastr.error('Please enter a valid amount (min ₦100)');
        else alert('Please enter a valid amount (min ₦100)');
        return;
    }
    var gateway = $('#dep_modal_gateway').val() || '6';
    $.ajax({
        url: '/depositNow',
        type: 'POST',
        data: { _token: '{{ csrf_token() }}', amount: amt, payment_gateway_type: gateway },
        dataType: 'json',
        success: function(res) {
            if (res && (res.status == 1 || res.isSuccess)) {
                if (typeof toastr !== 'undefined') toastr.success('Deposit request submitted!');
                bootstrap.Modal.getInstance(document.getElementById('deposit-modal')).hide();
            } else {
                if (typeof toastr !== 'undefined') toastr.error((res && res.message) || 'Deposit failed. Please try again.');
                else alert((res && res.message) || 'Deposit failed.');
            }
        },
        error: function() {
            if (typeof toastr !== 'undefined') toastr.success('Deposit request sent!');
            bootstrap.Modal.getInstance(document.getElementById('deposit-modal')).hide();
        }
    });
}
</script>
