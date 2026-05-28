<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('business_model', function (Blueprint $table) {
            // Passport block — structured fields for the new detail page
            if (!Schema::hasColumn('business_model', 'target_client')) {
                $table->mediumText('target_client')->nullable()->after('partnership_options');
            }
            if (!Schema::hasColumn('business_model', 'value_proposition')) {
                $table->mediumText('value_proposition')->nullable()->after('target_client');
            }
            if (!Schema::hasColumn('business_model', 'revenue_logic')) {
                $table->mediumText('revenue_logic')->nullable()->after('value_proposition');
            }
            if (!Schema::hasColumn('business_model', 'unit_economics')) {
                $table->mediumText('unit_economics')->nullable()->after('revenue_logic');
            }
            if (!Schema::hasColumn('business_model', 'facts_hypotheses_risks')) {
                $table->mediumText('facts_hypotheses_risks')->nullable()->after('unit_economics');
            }
        });
    }

    public function down(): void
    {
        Schema::table('business_model', function (Blueprint $table) {
            $table->dropColumn([
                'target_client',
                'value_proposition',
                'revenue_logic',
                'unit_economics',
                'facts_hypotheses_risks',
            ]);
        });
    }
};
