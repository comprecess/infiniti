<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     * Phase 3: Value Creation Engine — Valuations
     */
    public function up(): void
    {
        Schema::create('clx_project_valuations', function (Blueprint $table) {
            $table->id();
            $table->unsignedInteger('project_id');
            $table->enum('valuation_type', ['current', 'projected', 'best_case', 'final'])
                  ->default('current');
            $table->string('base_metric_name', 50)->default('EBITDA')
                  ->comment('Metric used for valuation: EBITDA, MRR, ARR, Revenue');
            $table->decimal('base_metric_value', 15, 2)->default(0);
            $table->decimal('multiplier', 8, 2)->default(1.00);
            $table->decimal('total_value', 15, 2)->default(0)
                  ->comment('Calculated: base_metric_value * multiplier');
            $table->unsignedTinyInteger('confidence_percent')->default(100)
                  ->comment('Confidence level 0-100 for this valuation');
            $table->text('notes')->nullable();
            $table->unsignedInteger('created_by')->nullable()
                  ->comment('Admin/Manager who created this valuation');
            $table->timestamps();

            $table->index(['project_id', 'valuation_type'], 'idx_proj_val_type');
            $table->index(['project_id', 'created_at'], 'idx_proj_val_history');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('clx_project_valuations');
    }
};
