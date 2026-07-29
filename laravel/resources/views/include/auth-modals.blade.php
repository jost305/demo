<!--====== UNIFIED TABBED AUTH MODAL (Sign In / Register) ======-->
<div class="modal fade ax-modal" id="auth-modal" tabindex="-1" aria-labelledby="authModalLabel" aria-hidden="true">
    <div class="modal-dialog modal-dialog-centered" style="max-width: 380px;">
        <div class="modal-content ax-auth-card">
            
            <!-- Close Button -->
            <button type="button" class="btn-close btn-close-white ax-auth-close" data-bs-dismiss="modal" aria-label="Close"></button>

            <!-- Brand Emblem Icon -->
            <div class="ax-auth-emblem">
                <img src="/images/favicon.png" alt="FlyBoy10x Emblem" class="ax-emblem-img" onerror="this.src='images/logo.png'">
            </div>

            <!-- Dynamic Header Text -->
            <div class="text-center px-4 pt-2 pb-2">
                <h4 class="ax-auth-title" id="auth-modal-title">Sign in to continue</h4>
                <p class="ax-auth-subtitle" id="auth-modal-subtitle">Welcome back to FlyBoy10x</p>
            </div>

            <!-- Segmented Tab Switcher -->
            <div class="ax-auth-tabs-wrap px-4 mb-3">
                <div class="ax-auth-tabs">
                    <button type="button" class="ax-auth-tab active" id="tab-btn-login" onclick="switchAuthTab('login')">SIGN IN</button>
                    <button type="button" class="ax-auth-tab" id="tab-btn-register" onclick="switchAuthTab('register')">REGISTER</button>
                </div>
            </div>

            <div class="modal-body px-4 pb-4 pt-0">
                
                <!-- LOGIN FORM PANE -->
                <div id="auth-login-pane" class="ax-auth-pane active">
                    <form class="login-form" method="post" action="#" name="loginForm" id="loginForm">
                        @csrf
                        <div class="mb-3">
                            <label class="ax-field-label">EMAIL OR PHONE</label>
                            <div class="ax-auth-input-wrapper">
                                <span class="material-symbols-outlined ax-auth-input-icon">person</span>
                                <input type="text" class="ax-auth-input" id="username" name="username" placeholder="Enter email or phone" required>
                            </div>
                        </div>

                        <div class="mb-3">
                            <div class="d-flex justify-content-between align-items-center mb-1">
                                <label class="ax-field-label m-0">PASSWORD</label>
                                <a href="#" id="forgotPassword" class="ax-auth-forgot" data-bs-toggle="modal" data-bs-target="#forgot-password-modal">Forgot?</a>
                            </div>
                            <div class="ax-auth-input-wrapper">
                                <span class="material-symbols-outlined ax-auth-input-icon">lock</span>
                                <input type="password" class="ax-auth-input" id="password" name="password" placeholder="Enter password" required>
                                <button type="button" class="ax-pw-toggle" onclick="togglePasswordVisibility('password', this)">
                                    <span class="material-symbols-outlined">visibility</span>
                                </button>
                            </div>
                        </div>

                        <div class="mb-2">
                            <label id="username-error" class="error" for="username" style="display:none"></label>
                            <label id="password-error" class="error" for="password" style="display:none"></label>
                            <label id="login-error" class="error" style="display:none; color:#ff1e46; font-size:11px; font-weight:700;"></label>
                        </div>

                        <button type="submit" class="ax-auth-submit-btn" id="loginSubmit">
                            SIGN IN
                        </button>
                    </form>

                    <div class="ax-auth-switch-footer text-center mt-3">
                        <span class="text-muted f-12">Don't have an account?</span>
                        <a href="#" class="ax-auth-switch-link fw-bold ms-1" onclick="switchAuthTab('register'); return false;">Sign Up</a>
                    </div>
                </div>

                <!-- STREAMLINED REGISTER FORM PANE -->
                <div id="auth-register-pane" class="ax-auth-pane d-none">
                    <form class="register-form" action="/auth/register" method="post" name="registerForm" id="registerViaEmailForm">
                        @csrf
                        <input type="hidden" name="name" id="name" value="Player">
                        <input type="hidden" name="mobile" id="mobile" value="0000000000">
                        <input type="hidden" name="gender" id="gender" value="male">
                        <input type="hidden" name="currency" id="currency" value="₦">
                        <input type="hidden" name="country" id="countries" value="IN">
                        <input type="hidden" name="register_type" id="register_type" value="3">
                        <input type="hidden" id="promocode" value="">

                        <div class="mb-3">
                            <label class="ax-field-label">EMAIL ADDRESS</label>
                            <div class="ax-auth-input-wrapper">
                                <span class="material-symbols-outlined ax-auth-input-icon">mail</span>
                                <input type="email" class="ax-auth-input" id="reg_email" name="email" placeholder="name@example.com" required>
                            </div>
                        </div>

                        <div class="mb-3">
                            <label class="ax-field-label">CREATE PASSWORD</label>
                            <div class="ax-auth-input-wrapper">
                                <span class="material-symbols-outlined ax-auth-input-icon">lock</span>
                                <input type="password" class="ax-auth-input" id="regpassword" name="password" placeholder="Create password" required>
                                <button type="button" class="ax-pw-toggle" onclick="togglePasswordVisibility('regpassword', this)">
                                    <span class="material-symbols-outlined">visibility</span>
                                </button>
                            </div>
                        </div>

                        <div class="mb-2">
                            <div class="d-flex justify-content-between align-items-center mb-1">
                                <label class="ax-field-label m-0">PROMOCODE (OPTIONAL)</label>
                            </div>
                            <div class="ax-auth-input-wrapper">
                                <span class="material-symbols-outlined ax-auth-input-icon">confirmation_number</span>
                                <input type="text" class="ax-auth-input" id="promo_code" name="promocode" placeholder="Enter promo code if any">
                            </div>
                            <label for="promo_code" id="promo_code_error" class="error" style="display:none; color:#ff1e46; font-size:11px; margin-top:2px;"></label>
                        </div>

                        <div class="mb-3">
                            <label class="d-flex align-items-center gap-2 text-muted f-11 cursor-pointer">
                                <input type="checkbox" id="email_policy" checked class="form-check-input mt-0">
                                <span>I confirm I am 18+ and agree to terms</span>
                            </label>
                        </div>

                        <button type="submit" class="ax-auth-submit-btn green" id="register_via_email">
                            CREATE ACCOUNT
                        </button>
                    </form>

                    <div class="ax-auth-switch-footer text-center mt-3">
                        <span class="text-muted f-12">Already have an account?</span>
                        <a href="#" class="ax-auth-switch-link fw-bold ms-1" onclick="switchAuthTab('login'); return false;">Sign In</a>
                    </div>
                </div>

            </div>
        </div>
    </div>
</div>

<script>
function switchAuthTab(tab) {
    if (tab === 'login') {
        $('#auth-modal-title').text('Sign in to continue');
        $('#auth-modal-subtitle').text('Welcome back to FlyBoy10x');
        $('#tab-btn-login').addClass('active');
        $('#tab-btn-register').removeClass('active');
        $('#auth-login-pane').removeClass('d-none').addClass('active');
        $('#auth-register-pane').addClass('d-none').removeClass('active');
    } else {
        $('#auth-modal-title').text('Create your account');
        $('#auth-modal-subtitle').text('Join thousands of players winning daily');
        $('#tab-btn-register').addClass('active');
        $('#tab-btn-login').removeClass('active');
        $('#auth-register-pane').removeClass('d-none').addClass('active');
        $('#auth-login-pane').addClass('d-none').removeClass('active');
    }
}

function togglePasswordVisibility(inputId, btnEl) {
    var input = document.getElementById(inputId);
    var icon = btnEl.querySelector('.material-symbols-outlined');
    if (input.type === 'password') {
        input.type = 'text';
        icon.textContent = 'visibility_off';
    } else {
        input.type = 'password';
        icon.textContent = 'visibility';
    }
}

// Redirect trigger from buttons targeting #login-modal or #register-modal
$(document).ready(function() {
    $(document).on('click', '[data-bs-target="#login-modal"], #login', function(e) {
        e.preventDefault();
        switchAuthTab('login');
        var modalEl = document.getElementById('auth-modal');
        var modal = bootstrap.Modal.getInstance(modalEl) || new bootstrap.Modal(modalEl);
        modal.show();
    });
    $(document).on('click', '[data-bs-target="#register-modal"], .reg_btn', function(e) {
        e.preventDefault();
        switchAuthTab('register');
        var modalEl = document.getElementById('auth-modal');
        var modal = bootstrap.Modal.getInstance(modalEl) || new bootstrap.Modal(modalEl);
        modal.show();
    });
});
</script>
