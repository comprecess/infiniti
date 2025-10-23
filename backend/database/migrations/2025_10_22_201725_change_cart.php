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
        Schema::table('catalog_cart', function (Blueprint $table){
            $table->unsignedInteger('business_plan_id')->nullable();

            $table->foreign('business_plan_id')->references('id')->on('app_business_plan');
        });

        Schema::table('catalog_cart_item', function (Blueprint $table){
            $table->unsignedInteger('business_plan_id')->nullable();

            $table->foreign('business_plan_id')->references('id')->on('app_business_plan');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('catalog_cart', function(Blueprint $table){
            $table->dropForeign(['business_plan_id']);
        });

        Schema::table('catalog_cart', function(Blueprint $table){
            $table->dropColumn(['business_plan_id']);
        });

        Schema::table('catalog_cart_item', function(Blueprint $table){
            $table->dropForeign(['business_plan_id']);
        });

        Schema::table('catalog_cart_item', function(Blueprint $table){
            $table->dropColumn(['business_plan_id']);
        });
    }
};
