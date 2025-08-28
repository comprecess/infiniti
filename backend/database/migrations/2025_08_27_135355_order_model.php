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
        Schema::table('sys_orders', function(Blueprint $table){
            $table->nullableMorphs('model');
            $table->string('currency_iso_code', 10)->nullable()->after('amount');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('sys_orders', function(Blueprint $table){
            $table->dropMorphs('model');
            $table->dropColumn('currency_iso_code');
        });
    }
};
