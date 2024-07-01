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
        Schema::create('catalog_cart', function (Blueprint $table) {
            $table->id();
            $table->integer('id_client');
            $table->string('secret')->nullable();
            $table->decimal('total', 16, 2)->default(0);
            $table->timestamps();
            $table->softDeletes();
        });

        Schema::create('catalog_cart_item', function (Blueprint $table) {
            $table->id();
            $table->unsignedBigInteger('id_catalog_cart');
            $table->unsignedBigInteger('id_catalog_user');
            $table->string('name_id_type')->nullable();
            $table->integer('amount')->default(0);
            $table->boolean('taxes_include')->default(0);
            $table->decimal('price', 16, 2)->default(0);
            $table->decimal('total', 16, 2)->default(0);
            $table->timestamps();
        });

        //foreign key
        Schema::table('catalog_cart', function(Blueprint $table){
            $table->foreign('id_client')->references('id')->on('crm_accounts');
        });
        Schema::table('catalog_cart_item', function(Blueprint $table){
            $table->foreign('id_catalog_cart')->references('id')->on('catalog_cart')->onDelete('cascade');
            $table->foreign('id_catalog_user')->references('id')->on('catalog_user')->onDelete('cascade');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('catalog_cart', function(Blueprint $table){
            $table->dropForeign(['id_client']);
        });
        Schema::table('catalog_cart_item', function(Blueprint $table){
            $table->dropForeign(['id_catalog_user']);
            $table->dropForeign(['id_catalog_cart']);
        });
        Schema::dropIfExists('catalog_cart');
        Schema::dropIfExists('catalog_cart_item');
    }
};
