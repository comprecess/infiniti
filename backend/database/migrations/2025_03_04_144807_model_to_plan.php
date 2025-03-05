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
        Schema::table('app_business_plan', function (Blueprint $table) {
            $table->unsignedBigInteger('business_model_id')->nullable();

            $table->foreign('business_model_id')->references('id')->on('business_model');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('app_business_plan', function (Blueprint $table) {
            $table->dropForeign(['business_model_id']);
            $table->dropColumn('business_model_id');
        });
    }
};
