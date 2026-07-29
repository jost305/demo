<?php

// Vercel Serverless Storage Rebind for Laravel
$storagePath = '/tmp/storage';
if (!is_dir($storagePath)) {
    @mkdir($storagePath . '/framework/views', 0777, true);
    @mkdir($storagePath . '/framework/sessions', 0777, true);
    @mkdir($storagePath . '/framework/cache', 0777, true);
    @mkdir($storagePath . '/logs', 0777, true);
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
