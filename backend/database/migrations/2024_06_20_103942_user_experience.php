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
        Schema::table('catalog_user', function(Blueprint $table){
            $table->json('experience')->nullable();
        });
        Schema::table('catalog_user_block', function(Blueprint $table){
            $table->string('name')->after('id_catalog_user');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('catalog_user', function(Blueprint $table){
            $table->dropColumn('experience');
        });

        Schema::table('catalog_user_block', function(Blueprint $table){
            $table->dropColumn('name');
        });
    }
};
