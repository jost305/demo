<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up()
    {
        if (!Schema::hasColumn('users', 'fuel_points')) {
            Schema::table('users', function (Blueprint $table) {
                $table->integer('fuel_points')->default(0);
                $table->date('last_login_streak_date')->nullable();
            });
        }

        if (!Schema::hasTable('fuel_point_logs')) {
            Schema::create('fuel_point_logs', function (Blueprint $table) {
                $table->id();
                $table->unsignedBigInteger('userid');
                $table->integer('points');
                $table->string('type'); // daily_login, referral, deposit, winning_bet
                $table->string('description');
                $table->timestamps();
            });
        }
    }

    public function down()
    {
        if (Schema::hasColumn('users', 'fuel_points')) {
            Schema::table('users', function (Blueprint $table) {
                $table->dropColumn(['fuel_points', 'last_login_streak_date']);
            });
        }
        Schema::dropIfExists('fuel_point_logs');
    }
};
