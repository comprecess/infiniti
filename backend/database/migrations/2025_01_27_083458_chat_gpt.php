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
            $table->unsignedBigInteger('parent_id')->nullable();
            $table->nullableMorphs('model');
            $table->mediumText('message')->nullable();
            $table->mediumText('log_message')->nullable();
            $table->string('chat_id')->nullable();
            $table->string('chat_model')->nullable();
            $table->string('chat_history_hash')->nullable();
            $table->timestamps();
            $table->softDeletes();

            $table->foreign('admin_id')->references('id')->on('sys_users')->onDelete('cascade');
            $table->foreign('parent_id')->references('id')->on('chat_gpt')->onDelete('cascade');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('chat_gpt', function(Blueprint $table){
            $table->dropForeign(['admin_id']);
            $table->dropForeign(['parent_id']);
        });

        Schema::drop('chat_gpt');
    }
};
