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
        Schema::create('meetings', function (Blueprint $table){
            $table->id();
            $table->nullableMorphs('owner');
            $table->morphs('meeting');
            $table->dateTime('date');
            $table->dateTime('date_timezone');
            $table->string('timezone');
            $table->json('service_response')->nullable();
            $table->json('create_data')->nullable();
            $table->timestamps();
            $table->softDeletes();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('meetings');
    }
};
