<?php
use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        // K-002.5: Context Records
        Schema::create('sys_task_contexts', function (Blueprint $table) {
            $table->id();
            $table->integer('task_id')->unsigned(false);
            $table->text('problem_statement')->nullable();
            $table->text('business_value')->nullable();
            $table->text('success_criteria')->nullable();
            $table->string('origin_source', 255)->nullable();
            $table->timestamps();
            $table->foreign('task_id')->references('id')->on('sys_tasks')->onDelete('cascade');
            $table->index('task_id');
        });

        // K-002.5: Knowledge Assets
        Schema::create('sys_knowledge_assets', function (Blueprint $table) {
            $table->id();
            $table->integer('task_id')->unsigned(false);
            $table->string('title', 255);
            $table->string('asset_type', 50)->comment('Architecture, API Spec, ERD, UI Mockup, Strategy Doc');
            $table->longText('content')->nullable();
            $table->string('version', 50)->nullable();
            $table->timestamps();
            $table->softDeletes();
            $table->foreign('task_id')->references('id')->on('sys_tasks')->onDelete('cascade');
            $table->index('task_id');
        });

        // K-003: Decision Records
        Schema::create('sys_decision_records', function (Blueprint $table) {
            $table->id();
            $table->integer('task_id')->unsigned(false);
            $table->string('title', 255);
            $table->text('context')->nullable();
            $table->text('decision')->nullable();
            $table->text('alternatives')->nullable();
            $table->integer('owner_id')->nullable();
            $table->timestamp('decision_date')->nullable();
            $table->string('status', 50)->default('Proposed')->comment('Proposed, Accepted, Deprecated, Superseded');
            $table->timestamps();
            $table->softDeletes();
            $table->foreign('task_id')->references('id')->on('sys_tasks')->onDelete('cascade');
            $table->index('task_id');
            $table->index('status');
        });

        // K-004: Prompt Records
        Schema::create('sys_prompt_records', function (Blueprint $table) {
            $table->id();
            $table->integer('task_id')->unsigned(false);
            $table->string('objective', 255);
            $table->longText('prompt_text');
            $table->longText('output_text')->nullable();
            $table->string('status', 50)->default('Success')->comment('Success, Partial, Failed');
            $table->timestamp('execution_date')->nullable();
            $table->timestamps();
            $table->softDeletes();
            $table->foreign('task_id')->references('id')->on('sys_tasks')->onDelete('cascade');
            $table->index('task_id');
            $table->index('status');
        });

        // K-005: Validation Records
        Schema::create('sys_validation_records', function (Blueprint $table) {
            $table->id();
            $table->integer('task_id')->unsigned(false);
            $table->integer('release_id')->nullable();
            $table->text('finding');
            $table->string('severity', 50)->comment('Blocker, High, Medium, Low, Pass');
            $table->text('resolution')->nullable();
            $table->string('status', 50)->default('Open')->comment('Open, Resolved, Ignored');
            $table->timestamps();
            $table->softDeletes();
            $table->foreign('task_id')->references('id')->on('sys_tasks')->onDelete('cascade');
            $table->index('task_id');
            $table->index(['severity', 'status']);
        });

        // K-002.5: Outcome Records
        Schema::create('sys_outcome_records', function (Blueprint $table) {
            $table->id();
            $table->integer('task_id')->unsigned(false);
            $table->text('expected_result')->nullable();
            $table->text('actual_result')->nullable();
            $table->json('metrics')->nullable();
            $table->text('lessons_learned')->nullable();
            $table->timestamp('outcome_date')->nullable();
            $table->timestamps();
            $table->softDeletes();
            $table->foreign('task_id')->references('id')->on('sys_tasks')->onDelete('cascade');
            $table->index('task_id');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('sys_outcome_records');
        Schema::dropIfExists('sys_validation_records');
        Schema::dropIfExists('sys_prompt_records');
        Schema::dropIfExists('sys_decision_records');
        Schema::dropIfExists('sys_knowledge_assets');
        Schema::dropIfExists('sys_task_contexts');
    }
};
