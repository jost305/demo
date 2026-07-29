<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Support\Facades\DB;

return new class extends Migration
{
    public function up()
    {
        if (!DB::table('settings')->where('category', 'daily_login_reward')->exists()) {
            DB::table('settings')->insert([
                'category' => 'daily_login_reward',
                'value' => '5',
                'status' => '1',
                'created_at' => now(),
                'updated_at' => now(),
            ]);
        }
    }

    public function down()
    {
        DB::table('settings')->where('category', 'daily_login_reward')->delete();
    }
};
