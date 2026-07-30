<?php

// Force all errors to be displayed
ini_set('display_errors', '1');
ini_set('display_startup_errors', '1');
error_reporting(E_ALL);

// Early debug: if we see this, PHP itself is working
if (isset($_GET['phpinfo'])) {
    phpinfo();
    exit;
}
if (isset($_GET['debug'])) {
    header('Content-Type: application/json');
    echo json_encode([
        'php_version' => PHP_VERSION,
        'cwd' => getcwd(),
        'dir' => __DIR__,
        'laravel_dir_exists' => is_dir(__DIR__ . '/../laravel'),
        'vendor_exists' => file_exists(__DIR__ . '/../laravel/vendor/autoload.php'),
        'bootstrap_exists' => file_exists(__DIR__ . '/../laravel/bootstrap/app.php'),
        'env_exists' => file_exists(__DIR__ . '/../laravel/.env'),
        'memory_limit' => ini_get('memory_limit'),
    ], JSON_PRETTY_PRINT);
    exit;
}

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
