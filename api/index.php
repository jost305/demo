<?php

// Suppress deprecation notices from vendor libraries
error_reporting(E_ALL & ~E_DEPRECATED & ~E_USER_DEPRECATED);

// Enable Laravel Debug Mode for Vercel troubleshooting
putenv('APP_DEBUG=true');
$_ENV['APP_DEBUG'] = 'true';
$_SERVER['APP_DEBUG'] = 'true';

// Vercel Serverless Storage Rebind for Laravel
$storagePath = '/tmp/storage';
if (!is_dir($storagePath)) {
    @mkdir($storagePath . '/framework/views', 0777, true);
    @mkdir($storagePath . '/framework/sessions', 0777, true);
    @mkdir($storagePath . '/framework/cache', 0777, true);
    @mkdir($storagePath . '/logs', 0777, true);
}

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

try {
    $request = Illuminate\Http\Request::capture();
    $response = $kernel->handle($request);
    
    // If response is 500 internal server error, output details for debugging
    if ($response->getStatusCode() === 500 && isset($response->exception)) {
        $e = $response->exception;
        http_response_code(200);
        echo "<div style='font-family: sans-serif; padding: 20px; background: #1a1a1a; color: #ff6b6b;'>";
        echo "<h2>Laravel 500 Exception Trace:</h2>";
        echo "<p><strong>Message:</strong> " . htmlspecialchars($e->getMessage()) . "</p>";
        echo "<p><strong>File:</strong> " . htmlspecialchars($e->getFile()) . ":" . $e->getLine() . "</p>";
        echo "<pre style='background: #111; color: #eee; padding: 15px; overflow: auto;'>" . htmlspecialchars($e->getTraceAsString()) . "</pre>";
        echo "</div>";
        exit;
    }
    
    $response->send();
    $kernel->terminate($request, $response);
} catch (\Throwable $e) {
    http_response_code(200);
    echo "<div style='font-family: sans-serif; padding: 20px; background: #1a1a1a; color: #ff6b6b;'>";
    echo "<h2>Laravel Fatal Error Trace:</h2>";
    echo "<p><strong>Message:</strong> " . htmlspecialchars($e->getMessage()) . "</p>";
    echo "<p><strong>File:</strong> " . htmlspecialchars($e->getFile()) . ":" . $e->getLine() . "</p>";
    echo "<pre style='background: #111; color: #eee; padding: 15px; overflow: auto;'>" . htmlspecialchars($e->getTraceAsString()) . "</pre>";
    echo "</div>";
}
