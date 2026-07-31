<!--====== UNIFIED TABBED AUTH MODAL (Sign In / Register) ======-->
<div class="modal fade ax-modal" id="auth-modal" tabindex="-1" aria-labelledby="authModalLabel" aria-hidden="true">
    <div class="modal-dialog modal-dialog-centered" style="max-width: 330px;">
        <div class="modal-content ax-auth-card">
            
            <!-- Close Button -->
            <button type="button" class="btn-close btn-close-white ax-auth-close" data-bs-dismiss="modal" aria-label="Close"></button>

            <!-- Brand Emblem Icon -->
            <div class="ax-auth-emblem" style="margin-top: 16px; margin-bottom: 4px;">
                <img src="/images/favicon.png" alt="FlyBoy10x Emblem" class="ax-emblem-img" style="width: 42px; height: 42px;" onerror="this.src='images/logo.png'">
            </div>

            <!-- Dynamic Header Text -->
            <div class="text-center px-3 pt-1 pb-2">
                <h4 class="ax-auth-title" id="auth-modal-title" style="font-size: 15px;">Sign in to continue</h4>
                <p class="ax-auth-subtitle" id="auth-modal-subtitle" style="font-size: 11px;">Welcome back to FlyBoy10x</p>
            </div>

            <!-- Segmented Tab Switcher -->
            <div class="ax-auth-tabs-wrap px-3 mb-2">
                <div class="ax-auth-tabs" style="padding: 3px;">
                    <button type="button" class="ax-auth-tab active" id="tab-btn-login" onclick="switchAuthTab('login')" style="padding: 6px 10px; font-size: 11px;">SIGN IN</button>
                    <button type="button" class="ax-auth-tab" id="tab-btn-register" onclick="switchAuthTab('register')" style="padding: 6px 10px; font-size: 11px;">REGISTER</button>
                </div>
            </div>

            <div class="modal-body px-3 pb-3 pt-0">
                
                <!-- LOGIN FORM PANE -->
                <div id="auth-login-pane" class="ax-auth-pane active">
                    <form class="login-form" method="post" action="#" name="loginForm" id="loginForm">
                        @csrf
                        <div class="mb-2">
                            <label class="ax-field-label" style="font-size: 10px;">EMAIL OR PHONE</label>
                            <div class="ax-auth-input-wrapper" style="border-radius: 8px;">
                                <span class="material-symbols-outlined ax-auth-input-icon" style="font-size: 16px;">person</span>
                                <input type="text" class="ax-auth-input" id="username" name="username" placeholder="Enter email or phone" required style="padding: 7px 10px; font-size: 12px;">
                            </div>
                        </div>

                        <div class="mb-2">
                            <div class="d-flex justify-content-between align-items-center mb-1">
                                <label class="ax-field-label m-0" style="font-size: 10px;">PASSWORD</label>
                                <a href="#" id="forgotPassword" class="ax-auth-forgot" data-bs-toggle="modal" data-bs-target="#forgot-password-modal" style="font-size: 10px;">Forgot?</a>
                            </div>
                            <div class="ax-auth-input-wrapper" style="border-radius: 8px;">
                                <span class="material-symbols-outlined ax-auth-input-icon" style="font-size: 16px;">lock</span>
                                <input type="password" class="ax-auth-input" id="password" name="password" placeholder="Enter password" required style="padding: 7px 10px; font-size: 12px;">
                                <button type="button" class="ax-pw-toggle" onclick="togglePasswordVisibility('password', this)">
                                    <span class="material-symbols-outlined" style="font-size: 16px;">visibility</span>
                                </button>
                            </div>
                        </div>

                        <div class="mb-2">
                            <label id="username-error" class="error" for="username" style="display:none; font-size:10px; color:#ff1e46;"></label>
                            <label id="password-error" class="error" for="password" style="display:none; font-size:10px; color:#ff1e46;"></label>
                            <label id="login-error" class="error" style="display:none; color:#ff1e46; font-size:11px; font-weight:700;"></label>
                        </div>

                        <button type="submit" class="ax-auth-submit-btn" id="loginSubmit" style="padding: 9px; font-size: 12px; font-weight: 800;">
                            SIGN IN
                        </button>
                    </form>

                    <div class="ax-auth-switch-footer text-center mt-2">
                        <span class="text-muted f-11">Don't have an account?</span>
                        <a href="#" class="ax-auth-switch-link fw-bold ms-1 f-11" onclick="switchAuthTab('register'); return false;">Sign Up</a>
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

                        <div class="mb-2">
                            <label class="ax-field-label" style="font-size: 10px;">EMAIL ADDRESS</label>
                            <div class="ax-auth-input-wrapper" style="border-radius: 8px;">
                                <span class="material-symbols-outlined ax-auth-input-icon" style="font-size: 16px;">mail</span>
                                <input type="email" class="ax-auth-input" id="reg_email" name="email" placeholder="name@example.com" required style="padding: 7px 10px; font-size: 12px;">
                            </div>
                        </div>

                        <div class="mb-2">
                            <label class="ax-field-label" style="font-size: 10px;">CREATE PASSWORD</label>
                            <div class="ax-auth-input-wrapper" style="border-radius: 8px;">
                                <span class="material-symbols-outlined ax-auth-input-icon" style="font-size: 16px;">lock</span>
                                <input type="password" class="ax-auth-input" id="regpassword" name="password" placeholder="Create password" required style="padding: 7px 10px; font-size: 12px;">
                                <button type="button" class="ax-pw-toggle" onclick="togglePasswordVisibility('regpassword', this)">
                                    <span class="material-symbols-outlined" style="font-size: 16px;">visibility</span>
                                </button>
                            </div>
                        </div>

                        <div class="mb-2">
                            <div class="d-flex justify-content-between align-items-center mb-1">
                                <label class="ax-field-label m-0" style="font-size: 10px;">PROMOCODE (OPTIONAL)</label>
                            </div>
                            <div class="ax-auth-input-wrapper" style="border-radius: 8px;">
                                <span class="material-symbols-outlined ax-auth-input-icon" style="font-size: 16px;">confirmation_number</span>
                                <input type="text" class="ax-auth-input" id="promo_code" name="promocode" placeholder="Enter promo code if any" style="padding: 7px 10px; font-size: 12px;">
                            </div>
                            <label for="promo_code" id="promo_code_error" class="error" style="display:none; color:#ff1e46; font-size:10px; margin-top:2px;"></label>
                        </div>

                        <div class="mb-2">
                            <label class="d-flex align-items-center gap-2 text-muted f-10 cursor-pointer">
                                <input type="checkbox" id="email_policy" checked class="form-check-input mt-0">
                                <span>I confirm I am 18+ and agree to terms</span>
                            </label>
                        </div>

                        <button type="submit" class="ax-auth-submit-btn green" id="register_via_email" style="padding: 9px; font-size: 12px; font-weight: 800;">
                            CREATE ACCOUNT
                        </button>
                    </form>

                    <div class="ax-auth-switch-footer text-center mt-2">
                        <span class="text-muted f-11">Already have an account?</span>
                        <a href="#" class="ax-auth-switch-link fw-bold ms-1 f-11" onclick="switchAuthTab('login'); return false;">Sign In</a>
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

$(document).ready(function() {
    // Intercept register links to open modal tab instead of page reload
    $(document).on('click', 'a[href="/register"], a[href="/login"], [data-bs-target="#register-modal"], [data-bs-target="#login-modal"], .reg_btn, .login_btn', function(e) {
        var href = $(this).attr('href');
        var targetTab = (href === '/register' || $(this).is('[data-bs-target="#register-modal"]') || $(this).hasClass('reg_btn')) ? 'register' : 'login';
        e.preventDefault();
        switchAuthTab(targetTab);
        var modalEl = document.getElementById('auth-modal');
        if (modalEl && typeof bootstrap !== 'undefined') {
            var modal = bootstrap.Modal.getInstance(modalEl) || new bootstrap.Modal(modalEl);
            modal.show();
        }
    });

    // Check URL parameters for ?auth=register or ?auth=login
    var urlParams = new URLSearchParams(window.location.search);
    var authParam = urlParams.get('auth');
    if (authParam === 'register' || authParam === 'login') {
        switchAuthTab(authParam);
        var modalEl = document.getElementById('auth-modal');
        if (modalEl && typeof bootstrap !== 'undefined') {
            var modal = bootstrap.Modal.getInstance(modalEl) || new bootstrap.Modal(modalEl);
            modal.show();
        }
    }
});
</script>
