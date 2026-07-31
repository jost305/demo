<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up()
    {
        Schema::dropIfExists('chats');
        Schema::create('chats', function (Blueprint $table) {
            $table->id();
            $table->string('room')->default('general')->nullable();
            $table->unsignedBigInteger('userid')->nullable();
            $table->string('username')->nullable();
            $table->string('avatar')->nullable();
            $table->string('source')->default('web')->nullable();
            $table->string('badge')->nullable();
            $table->text('message');
            $table->timestamps();
        });
    }

    public function down()
    {
        Schema::dropIfExists('chats');
    }
};
