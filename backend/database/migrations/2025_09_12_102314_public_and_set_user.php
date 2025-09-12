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
        Schema::table('app_business_plan', function(Blueprint $table){
            $table->string('public')->unique()->nullable();
            $table->integer('cid')->nullable();

            $table->foreign('cid')->references('id')->on('crm_accounts');
        });

        Schema::table('business_model', function(Blueprint $table){
            $table->string('public')->unique()->nullable();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('app_business_plan', function(Blueprint $table){
            $table->dropForeign(['cid']);
        });

        Schema::table('app_business_plan', function(Blueprint $table){
            $table->dropColumn('public');
        });

        Schema::table('business_model', function(Blueprint $table){
            $table->dropColumn('public');
        });
    }
};
