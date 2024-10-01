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
        Schema::table('sys_invoiceitems', function(Blueprint $table){
            $table->morphs('document');
        });
        /*
         Schema::create('blank', function (Blueprint $table){
            $table->id();
            $table->morphs('document');
            $table->integer('qty')->default(1);
            $table->decimal('amount')->default(0);
            $table->integer('tax_id')->nullable();
            $table->decimal('tax_rate')->default(0);
            $table->decimal('tax_amount')->default(0);
            $table->boolean('discount_is_percent')->default(0);
            $table->decimal('discount_rate')->default(0);
            $table->decimal('discount_amount')->default(0);
            $table->text('description')->nullable();
            $table->nullableMorphs('service');
        });
         * */
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('sys_invoiceitems', function(Blueprint $table){
            $table->dropColumn('document_type');
            $table->dropColumn('document_id');
        });
    }
};
