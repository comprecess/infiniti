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
            $table->integer('id_admin')->nullable();
            $table->date('birth_day')->nullable();
            $table->boolean('active')->nullable()->default(true);
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('catalog_user', function(Blueprint $table){
            $table->dropColumn('id_admin');
            $table->dropColumn('birth_day');
            $table->dropTimestamps();
        });
    }
};
