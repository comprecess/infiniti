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
        Schema::table('sys_quotes', function(Blueprint $table){
            $table->boolean('check_public')->nullable()->default(0);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('sys_quotes', function(Blueprint $table){
            $table->dropColumn('check_public');
        });
    }
};
