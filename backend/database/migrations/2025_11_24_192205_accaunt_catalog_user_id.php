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
        Schema::table('crm_accounts', function (Blueprint $table){
            $table->unsignedBigInteger('catalog_user_id')->nullable();

            $table->foreign('catalog_user_id')->references('id')->on('catalog_user');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('crm_accounts', function (Blueprint $table){
            $table->dropForeign(['catalog_user_id']);
        });

        Schema::table('crm_accounts', function (Blueprint $table){
            $table->dropColumn('catalog_user_id');
        });
    }
};
