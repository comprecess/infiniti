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
        Schema::dropIfExists('business_model_chat_gpt');

        Schema::table('business_model', function(Blueprint $table){
            $table->mediumText('market_analysis')->nullable();
            $table->mediumText('financial_model')->nullable();
            $table->mediumText('current_investors')->nullable();
            $table->mediumText('stages_implementation')->nullable();
            $table->mediumText('partnership_options')->nullable();
        });

        Schema::table('chat_gpt', function(Blueprint $table){
            $table->json('data')->nullable();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('business_model', function(Blueprint $table){
            $table->dropColumn('market_analysis');
            $table->dropColumn('financial_model');
            $table->dropColumn('current_investors');
            $table->dropColumn('stages_implementation');
            $table->dropColumn('partnership_options');
        });

        Schema::table('chat_gpt', function(Blueprint $table){
            $table->dropColumn('data');
        });
    }
};
