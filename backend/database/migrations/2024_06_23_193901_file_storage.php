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
        Schema::create('file_storages', function (Blueprint $table) {
            $table->id();
//            $table->integer('client_id')->nullable();
            $table->morphs('model');
            $table->string('original_name')->nullable();
            $table->string('mime')->nullable();
            $table->string('ext')->nullable();
            $table->integer('size')->nullable()->default(0);
            $table->string('path')->nullable();
            $table->json('data')->nullable();
            $table->longText('object')->nullable();
            $table->timestamps();
            $table->string('hash')->nullable();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('file_storage');
    }
};
