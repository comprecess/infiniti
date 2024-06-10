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
        Schema::create('catalog_user', function(Blueprint $table){
            $table->id();
            $table->integer('id_client')->nullable();
            $table->date('start')->nullable();
            $table->softDeletes();
        });

        Schema::create('catalog_prop', function(Blueprint $table){
            $table->id();
            $table->unsignedBigInteger('id_parent')->nullable();
            $table->string('id_name')->nullable();
            $table->string('name');
            $table->enum('type', \App\Models\Catalog\Prop::TYPE)->nullable();
            $table->smallInteger('filter')->default(0);
            $table->smallInteger('has_add')->default(0);
            $table->softDeletes();
        });

        Schema::create('catalog_prop_value', function(Blueprint $table){
            $table->id();
            $table->unsignedBigInteger('id_prop');
            $table->text('value');
        });

        Schema::create('catalog_user_value', function(Blueprint $table){
            $table->id();
            $table->morphs('cataloggable');
            $table->unsignedBigInteger('id_catalog_user');
            $table->text('value')->nullable();
        });

        Schema::create('catalog_user_block', function(Blueprint $table){
            $table->id();
            $table->unsignedBigInteger('id_catalog_user');
            $table->string('position');
            $table->date('from');
            $table->date('to')->nullable();
            $table->longText('responsibilities')->nullable();
        });

        //foreign key
        Schema::table('catalog_user', function(Blueprint $table){
            $table->foreign('id_client')->references('id')->on('crm_accounts')->onDelete('SET NULL');
        });
        Schema::table('catalog_prop', function(Blueprint $table){
            $table->foreign('id_parent')->references('id')->on('catalog_prop')->onDelete('cascade');
        });
        Schema::table('catalog_prop_value', function(Blueprint $table){
            $table->foreign('id_prop')->references('id')->on('catalog_prop')->onDelete('cascade');
        });
        Schema::table('catalog_user_value', function(Blueprint $table){
            $table->foreign('id_catalog_user')->references('id')->on('catalog_user')->onDelete('cascade');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('catalog_user', function(Blueprint $table){
            $table->dropForeign(['id_client']);
        });
        Schema::table('catalog_prop', function(Blueprint $table){
            $table->dropForeign(['id_parent']);
        });
        Schema::table('catalog_prop_value', function(Blueprint $table){
            $table->dropForeign(['id_prop']);
        });
        Schema::table('catalog_user_value', function(Blueprint $table){
            $table->dropForeign(['id_catalog_user']);
        });

        Schema::drop('catalog_user');
        Schema::drop('catalog_prop');
        Schema::drop('catalog_prop_value');
        Schema::drop('catalog_user_value');
        Schema::drop('catalog_user_block');
    }
};
