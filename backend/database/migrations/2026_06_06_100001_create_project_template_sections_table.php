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
        Schema::create('clx_project_template_sections', function (Blueprint $table) {
            $table->id();
            $table->foreignId('template_id')
                ->constrained('clx_project_templates')
                ->cascadeOnDelete();
            $table->string('code', 50)->comment('Section code: summary, tasks, deal_room, growth_plan, valuation');
            $table->string('name', 100);
            $table->string('icon', 50)->nullable()->comment('Icon identifier for frontend rendering');
            $table->unsignedSmallInteger('sort_order')->default(0);
            $table->json('config')->nullable()->comment('Section-specific configuration (component, permissions, etc.)');
            $table->boolean('is_required')->default(false);
            $table->boolean('is_active')->default(true);
            $table->timestamps();

            $table->unique(['template_id', 'code']);
            $table->index(['template_id', 'sort_order']);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('clx_project_template_sections');
    }
};
