<?php

// Suppress deprecation notices from third-party vendor libraries
error_reporting(E_ALL & ~E_DEPRECATED & ~E_USER_DEPRECATED);

// Vercel Serverless Storage Rebind for Laravel
$storagePath = '/tmp/storage';
if (!is_dir($storagePath)) {
    @mkdir($storagePath . '/framework/views', 0777, true);
    @mkdir($storagePath . '/framework/sessions', 0777, true);
    @mkdir($storagePath . '/framework/cache', 0777, true);
    @mkdir($storagePath . '/logs', 0777, true);
}

try {
    // Ensure Environment Variables are propagated to getenv(), $_ENV, and $_SERVER
    foreach ($_ENV as $key => $value) {
        putenv("{$key}={$value}");
        $_SERVER[$key] = $value;
    }

    define('LARAVEL_START', microtime(true));

    require __DIR__ . '/../laravel/vendor/autoload.php';

    $app = require_once __DIR__ . '/../laravel/bootstrap/app.php';

    // Bind storage path to writable /tmp directory
    $app->useStoragePath($storagePath);

    $kernel = $app->make(Illuminate\Contracts\Http\Kernel::class);

    $response = $kernel->handle(
        $request = Illuminate\Http\Request::capture()
    );

    $response->send();

    $kernel->terminate($request, $response);
} catch (\Throwable $e) {
    http_response_code(500);
    header('Content-Type: text/html');
    echo '<h2>Server Error</h2><p>' . htmlspecialchars($e->getMessage()) . '</p><pre>' . htmlspecialchars($e->getTraceAsString()) . '</pre>';
}
