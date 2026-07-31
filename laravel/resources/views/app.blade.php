<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no">
    <meta name="csrf-token" content="{{ csrf_token() }}">
    <title>FlyBoy — Live Aviator Betting Platform</title>

    <!-- Google Fonts & Material Symbols -->
    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    <link href="https://fonts.googleapis.com/css2?family=Roboto:wght@300;400;500;700&display=swap" rel="stylesheet">
    <link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:opsz,wght,FILL,GRAD@20..48,100..700,0..1,-50..200&display=block" />

    <!-- Stylesheets -->
    <link rel="stylesheet" href="/css/bootstrap.css" />
    <link rel="stylesheet" href="/css/style.css" />
    <link rel="stylesheet" href="/css/aviator-theme.css" />
    <script src="https://cdn.tailwindcss.com"></script>
    <script>
      tailwind.config = {
        theme: {
          extend: {
            colors: {
              slate: {
                800: '#1e293b',
                900: '#0f172a',
                950: '#020617',
              },
              lime: {
                300: '#bef264',
                400: '#a3e635',
              }
            }
          }
        }
      }
    </script>

    <!-- React 18 & Babel Standalone for Instant Execution -->
    <script crossorigin src="https://unpkg.com/react@18/umd/react.production.min.js"></script>
    <script crossorigin src="https://unpkg.com/react-dom@18/umd/react-dom.production.min.js"></script>
    <script crossorigin src="https://unpkg.com/@babel/standalone/babel.min.js"></script>
    <script src="https://code.jquery.com/jquery-3.6.0.min.js"></script>
    <script src="/js/bootstrap.bundle.min.js"></script>
</head>
<body class="bg-slate-950 text-white p-0 m-0 overflow-x-hidden" style="min-height: 100vh; background-color: #020617;">
    <!-- React Root Mount Node -->
    <div id="app" data-page='@json($page ?? [])' style="min-height: 100vh; width: 100%;"></div>

    <!-- Include Auth Modals -->
    @include('include.auth-modals')

    <!-- Load Compiled Main React Application Script -->
    <script src="/js/react-app.js"></script>
</body>
</html>


