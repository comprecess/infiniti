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
            $table->morphs('user');
            $table->dropForeign(['id_client']);
            $table->dropColumn('id_client');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('catalog_cart', function(Blueprint $table){
            $table->integer('id_client')->after();
            $table->foreign('id_client')->references('id')->on('crm_accounts');
        });
    }
};
