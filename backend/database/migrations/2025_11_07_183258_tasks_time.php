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
        Schema::create('sys_tasks_time', function (Blueprint $table){
            $table->id();
            $table->morphs('user');
            $table->unsignedInteger('project_id')->nullable();
            $table->integer('task_id');
            $table->integer('time')->nullable();
            $table->time('timeDate')->nullable();
            $table->text('description')->nullable();
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
        Schema::table('sys_tasks_time', function (Blueprint $table){
            $table->dropForeign(['project_id']);
            $table->dropForeign(['task_id']);
        });

        Schema::drop('sys_tasks_time');
    }
};
