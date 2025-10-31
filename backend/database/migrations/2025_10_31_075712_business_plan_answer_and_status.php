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
        Schema::table('app_business_plan', function (Blueprint $table){
            $table->enum('status_generate', \App\Models\Resident\BusinessPlan::STATUS_GENERATE)->nullable();
            $table->json('answer')->nullable();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('app_business_plan', function (Blueprint $table){
            $table->dropColumn('status_generate');
            $table->dropColumn('answer');
        });
    }
};
