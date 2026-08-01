@extends('Layout.usergame')
@section('content')
    <div class="deposite-container">
        <div class="container">
            <div class="row justify-content-center">
                <div class="col-md-6">
                    <div class="pay-tabs">
                        <a href="/deposit" class="custom-tabs-link">DEPOSIT</a>
                        <a href="#" class="custom-tabs-link active">WITHDRAW</a>
                    </div>
                    <div class="pay-options">
                        <div class="payment-cols">
                            <div class="grid-view">


                                <!--<div class="grid-list">-->
                                <!--    <button class="btn payment-btn" data-bs-toggle="modal" data-bs-target="#withdraw-modal"-->
                                <!--        onclick="withdraw('1' , '')">-->
                                <!--        <img src="images/app-logo/g_pay_mt.svg " />-->
                                <!--        <div class="PaymentCard_limit">GPay</div>-->
                                <!--    </button>-->
                                <!--</div>-->




                                <!--<div class="grid-list">-->
                                <!--    <button class="btn payment-btn" data-bs-toggle="modal" data-bs-target="#withdraw-modal"-->
                                <!--        onclick="withdraw('2' , '')">-->
                                <!--        <img src="images/app-logo/phone_pe_mt.svg " />-->
                                <!--        <div class="PaymentCard_limit">PhonePe</div>-->
                                <!--    </button>-->
                                <!--</div>-->
                                
                                
                                <div class="grid-list">
                                    <button class="btn payment-btn" data-bs-toggle="modal" data-bs-target="#deposit-modal"
                                        onclick="openWalletModal('withdraw')">
                                        <img src="images/app-logo/interkassa_net_banking.svg " />
                                        <div class="PaymentCard_limit">Net Banking</div>
                                    </button>
                                </div>

                                <div class="grid-list">
                                    <button class="btn payment-btn" data-bs-toggle="modal" data-bs-target="#deposit-modal"
                                        onclick="openWalletModal('withdraw')">
                                        <img src="images/app-logo/upiMt.svg " />
                                        <div class="PaymentCard_limit">UPI</div>
                                    </button>
                                </div>

                                <!--<div class="grid-list">-->
                                <!--    <button class="btn payment-btn" data-bs-toggle="modal" data-bs-target="#withdraw-modal"-->
                                <!--        onclick="withdraw('5' , '')">-->
                                <!--        <img src="images/app-logo/paytm_amount.svg " />-->
                                <!--        <div class="PaymentCard_limit">Payment</div>-->
                                <!--    </button>-->
                                <!--</div>-->

                                <!--<div class="grid-list">-->
                                <!--    <button class="btn payment-btn" data-bs-toggle="modal" data-bs-target="#withdraw-modal"-->
                                <!--        onclick="withdraw('9' , '')">-->
                                <!--        <img src="images/app-logo/imps.svg " />-->
                                <!--        <div class="PaymentCard_limit">imps</div>-->
                                <!--    </button>-->
                                <!--</div>-->



                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
@endsection
@section('js')
@isset($_GET['msg'])
@if ($_GET['msg'] == 'Success')
    <script>
        toastr.success("Request send successfully!");
    </script>
@endif
@if ($_GET['msg'] == 'error')
    <script>
        toastr.error("Something went wrong!");
    </script>
@endif
@endisset
@endsection