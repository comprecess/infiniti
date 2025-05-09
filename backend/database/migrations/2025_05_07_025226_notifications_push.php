<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('push_subscriptions', function (Blueprint $table) {
            $table->id();
            $table->morphs('user');
            $table->string('endpoint')->unique();
            $table->json('keys');
            $table->timestamps();
        });
        /*
         Schema::dropIfExists('push_subscriptions');
        Schema::create('push_subscriptions', function (Blueprint $table) {
            $table->id();
            $table->morphs('user');
            $table->string('hash')->unique();
            $table->timestamps();
        });
         * */
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('push_subscriptions');
    }
};
