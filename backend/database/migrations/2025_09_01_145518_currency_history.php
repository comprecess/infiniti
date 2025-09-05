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
        Schema::create('sys_currency_history', function(Blueprint $table){
            $table->id();
            $table->string('iso_code', 10)->index();
            $table->decimal('rate', 16, 8);
            $table->date('date')->index();

            $table->unique(['iso_code', 'date']);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::drop('sys_currency_history');
    }
};
