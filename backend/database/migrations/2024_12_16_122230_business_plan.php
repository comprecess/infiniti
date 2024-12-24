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
        Schema::create('business_model', function(Blueprint $table){
            $table->id();
            $table->date('start')->nullable();
            $table->text('description');
            $table->longText('full_description');
            $table->softDeletes();
        });

        Schema::create('business_model_prop', function(Blueprint $table){
            $table->id();
            $table->unsignedBigInteger('id_parent')->nullable();
            $table->string('id_name')->nullable();
            $table->string('name');
            $table->enum('type', \App\Models\Catalog\Prop::TYPE)->nullable();
            $table->smallInteger('filter')->default(0);
            $table->smallInteger('has_add')->default(0);
            $table->softDeletes();
            $table->smallInteger('sort')->nullable();
            $table->json('options')->nullable();
            $table->boolean('required')->default(false);
        });

        Schema::create('business_model_prop_value', function(Blueprint $table){
            $table->id();
            $table->unsignedBigInteger('id_prop');
            $table->text('value');
        });

        Schema::create('business_model_value', function(Blueprint $table){
            $table->id();
            $table->morphs('cataloggable');
            $table->unsignedBigInteger('id_business_model');
            $table->text('value')->nullable();
        });


        //foreign key
        Schema::table('business_model_prop', function(Blueprint $table){
            $table->foreign('id_parent')->references('id')->on('business_model_prop')->onDelete('cascade');
        });
        Schema::table('business_model_prop_value', function(Blueprint $table){
            $table->foreign('id_prop')->references('id')->on('business_model_prop')->onDelete('cascade');
        });
        Schema::table('business_model_value', function(Blueprint $table){
            $table->foreign('id_business_model')->references('id')->on('business_model')->onDelete('cascade');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('business_model_prop', function(Blueprint $table){
            $table->dropForeign(['id_parent']);
        });
        Schema::table('business_model_prop_value', function(Blueprint $table){
            $table->dropForeign(['id_prop']);
        });
        Schema::table('business_model_value', function(Blueprint $table){
            $table->dropForeign(['id_business_model']);
        });

        Schema::drop('business_model');
        Schema::drop('business_model_prop');
        Schema::drop('business_model_prop_value');
        Schema::drop('business_model_value');
    }
};
