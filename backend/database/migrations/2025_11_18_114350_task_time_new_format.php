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
        Schema::table('sys_tasks_time', function (Blueprint $table){
            $table->dropColumn('time');
            $table->dropColumn('timeDate');
        });

        Schema::table('sys_tasks_time', function (Blueprint $table){
            $table->date('date')->after('task_id')->nullable();
            $table->string('time')->after('task_id')->nullable();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('sys_tasks_time', function (Blueprint $table){
            $table->dropColumn('date');
            $table->dropColumn('time');
        });

        Schema::table('sys_tasks_time', function (Blueprint $table){
            $table->integer('time')->after('task_id')->nullable();
            $table->time('timeDate')->after('task_id')->nullable();
        });
    }
};
