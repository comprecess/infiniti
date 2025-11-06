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
        Schema::create('personal_model', function (Blueprint $table){
            $table->id();
            $table->morphs('user');
            $table->morphs('model');
            $table->json('data')->nullable();
            $table->timestamps();

            $table->unique(['user_type', 'user_id', 'model_type', 'model_id']);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::drop('personal_model');
    }
};
