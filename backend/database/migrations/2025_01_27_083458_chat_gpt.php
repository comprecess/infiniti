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
        Schema::create('chat_gpt', function(Blueprint $table){
            $table->id();
            $table->unsignedInteger('admin_id')->nullable();
            $table->nullableMorphs('model');
            $table->enum('type', \App\Models\ChatGPT::TYPE);
            $table->mediumText('message')->nullable();
            $table->timestamps();

            $table->foreign('admin_id')->references('id')->on('sys_users')->onDelete('cascade');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('chat_gpt', function(Blueprint $table){
            $table->dropForeign(['admin_id']);
        });

        Schema::drop('chat_gpt');
    }
};
