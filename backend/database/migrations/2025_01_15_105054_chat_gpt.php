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
        Schema::create('business_model_chat_gpt', function(Blueprint $table){
            $table->id();
            $table->unsignedBigInteger('id_business_model');
            $table->enum('type', \App\Models\BusinessModel\ChatGPT::TYPE);
            $table->text('request')->nullable();
            $table->mediumText('response')->nullable();
            $table->timestamps();

            $table->foreign('id_business_model')->references('id')->on('business_model')->onDelete('cascade');


        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('business_model_chat_gpt', function(Blueprint $table){
            $table->dropForeign(['id_business_model']);
        });

        Schema::drop('business_model_chat_gpt');
    }
};
