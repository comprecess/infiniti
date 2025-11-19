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
        Schema::create('clx_projects_log', function(Blueprint $table){
            $table->id();
            $table->morphs('user');
            $table->unsignedInteger('project_id');
            $table->integer('task_id')->nullable();
            $table->string('type');
            $table->text('description');
            $table->json('data')->nullable();
            $table->timestamps();

            $table->foreign('project_id')->references('id')->on('clx_projects');
            $table->foreign('task_id')->references('id')->on('sys_tasks');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('clx_projects_log', function (Blueprint $table){
            $table->dropForeign(['project_id']);
            $table->dropForeign(['task_id']);
        });

        Schema::drop('clx_projects_log');
    }
};
