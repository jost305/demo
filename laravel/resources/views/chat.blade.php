@extends('Layout.usergame')
@section('content')
    <div class="ax-mobile-chat-page-container" style="padding: 10px 10px 80px 10px; max-width: 600px; margin: 0 auto; height: calc(100vh - 140px); display: flex; flex-direction: column;">
        <div class="card h-100" style="background: #13141a; border: 1px solid rgba(255,255,255,0.08); border-radius: 14px; overflow: hidden; display: flex; flex-direction: column;">
            @include('include.chatroom')
        </div>
    </div>
@endsection
