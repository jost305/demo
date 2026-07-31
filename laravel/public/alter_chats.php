<?php

require __DIR__ . '/../vendor/autoload.php';
$app = require_once __DIR__ . '/../bootstrap/app.php';
$kernel = $app->make(Illuminate\Contracts\Console\Kernel::class);
$kernel->bootstrap();

use Illuminate\Support\Facades\DB;

try {
    DB::statement("ALTER TABLE public.chats ADD COLUMN IF NOT EXISTS room VARCHAR(255) DEFAULT 'general'");
    DB::statement("ALTER TABLE public.chats ADD COLUMN IF NOT EXISTS source VARCHAR(255) DEFAULT 'web'");
    DB::statement("ALTER TABLE public.chats ADD COLUMN IF NOT EXISTS badge VARCHAR(255)");
    DB::statement("ALTER TABLE public.chats ADD COLUMN IF NOT EXISTS avatar VARCHAR(255)");
    DB::statement("ALTER TABLE public.chats ADD COLUMN IF NOT EXISTS userid BIGINT");
    DB::statement("ALTER TABLE public.chats ADD COLUMN IF NOT EXISTS username VARCHAR(255)");
    echo "ALTER_CHATS_SUCCESSFUL";
} catch (\Throwable $e) {
    echo "ALTER_ERROR: " . $e->getMessage();
}
