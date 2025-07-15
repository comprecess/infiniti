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
        Schema::table('catalog_cart', function(Blueprint $table){
            $table->string('currency_iso_code', 10)->nullable()->after('sub_tax');
        });

        Schema::table('catalog_cart_item', function(Blueprint $table){
            $table->string('currency_iso_code', 10)->nullable()->after('total');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('catalog_cart', function(Blueprint $table){
            $table->dropColumn('currency_iso_code');
        });

        Schema::table('catalog_cart_item', function(Blueprint $table){
            $table->dropColumn('currency_iso_code');
        });
    }
};
