<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     * Phase 3: Value Creation Engine — Growth Items (Recommendations)
     */
    public function up(): void
    {
        Schema::create('clx_project_growth_items', function (Blueprint $table) {
            $table->id();
            $table->unsignedInteger('project_id');
            $table->string('title', 255);
            $table->text('description')->nullable();
            $table->enum('category', [
                'financial',
                'technical',
                'operational',
                'team',
                'marketing',
                'legal',
                'product'
            ])->default('operational');

            // Impact on valuation
            $table->decimal('impact_multiplier_increase', 8, 2)->default(0.00)
                  ->comment('How much this adds to the multiplier when completed');
            $table->decimal('impact_metric_increase', 15, 2)->default(0.00)
                  ->comment('How much this adds to the base metric when completed');

            // Confidence & estimation (investment analytics)
            $table->unsignedTinyInteger('confidence_percent')->default(50)
                  ->comment('Confidence level 0-100 that this item will achieve projected impact');
            $table->decimal('estimated_cost', 15, 2)->default(0.00)
                  ->comment('Estimated cost to implement this growth item');
            $table->unsignedSmallInteger('estimated_duration_days')->default(30)
                  ->comment('Estimated days to complete');

            // Status workflow
            $table->enum('status', [
                'proposed',
                'approved',
                'in_progress',
                'completed',
                'rejected'
            ])->default('proposed');

            // Integration with existing entities
            $table->unsignedInteger('sys_task_id')->nullable()
                  ->comment('Linked Kanban task created on approval');
            $table->unsignedInteger('catalog_talent_id')->nullable()
                  ->comment('Linked Talent assigned to execute this item');
            $table->unsignedInteger('sys_invoice_id')->nullable()
                  ->comment('Linked Invoice for payment of this service');
            $table->unsignedInteger('sys_offer_id')->nullable()
                  ->comment('Linked Offer sent to Founder for this service');

            // Tracking
            $table->unsignedInteger('created_by')->nullable();
            $table->timestamp('approved_at')->nullable();
            $table->timestamp('completed_at')->nullable();
            $table->timestamps();

            // Indexes
            $table->index(['project_id', 'status'], 'idx_proj_growth_status');
            $table->index(['project_id', 'category'], 'idx_proj_growth_category');
            $table->index('sys_task_id', 'idx_growth_task');
            $table->index('sys_invoice_id', 'idx_growth_invoice');
            $table->index('sys_offer_id', 'idx_growth_offer');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('clx_project_growth_items');
    }
};
