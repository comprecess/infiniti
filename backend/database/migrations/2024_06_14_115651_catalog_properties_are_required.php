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
        Schema::table('catalog_prop', function(Blueprint $table){
            $table->boolean('required')->default(false);
        });

        Schema::table('catalog_user', function(Blueprint $table){
            $table->dropColumn('start');
            $table->date('availabilityStart')->nullable();
            $table->date('availabilityEnd')->nullable();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('catalog_prop', function(Blueprint $table){
            $table->dropColumn('required');
        });

        Schema::table('catalog_user', function(Blueprint $table){
            $table->date('start')->nullable();
            $table->dropColumn('availabilityStart');
            $table->dropColumn('availabilityEnd');
        });
    }
};
