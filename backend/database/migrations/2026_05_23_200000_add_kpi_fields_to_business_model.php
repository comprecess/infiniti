<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('business_model', function (Blueprint $table) {
            // Overview KPI block (shown on Overview tab)
            if (!Schema::hasColumn('business_model', 'kpi_gross_margin')) {
                $table->string('kpi_gross_margin', 50)->nullable()->after('facts_hypotheses_risks');
            }
            if (!Schema::hasColumn('business_model', 'kpi_gross_margin_sub')) {
                $table->string('kpi_gross_margin_sub', 100)->nullable()->after('kpi_gross_margin');
            }
            if (!Schema::hasColumn('business_model', 'kpi_payback')) {
                $table->string('kpi_payback', 50)->nullable()->after('kpi_gross_margin_sub');
            }
            if (!Schema::hasColumn('business_model', 'kpi_payback_sub')) {
                $table->string('kpi_payback_sub', 100)->nullable()->after('kpi_payback');
            }
            if (!Schema::hasColumn('business_model', 'kpi_ltv_cac')) {
                $table->string('kpi_ltv_cac', 50)->nullable()->after('kpi_payback_sub');
            }
            if (!Schema::hasColumn('business_model', 'kpi_ltv_cac_sub')) {
                $table->string('kpi_ltv_cac_sub', 100)->nullable()->after('kpi_ltv_cac');
            }
            if (!Schema::hasColumn('business_model', 'kpi_nrr')) {
                $table->string('kpi_nrr', 50)->nullable()->after('kpi_ltv_cac_sub');
            }
            if (!Schema::hasColumn('business_model', 'kpi_nrr_sub')) {
                $table->string('kpi_nrr_sub', 100)->nullable()->after('kpi_nrr');
            }
            if (!Schema::hasColumn('business_model', 'kpi_market')) {
                $table->string('kpi_market', 50)->nullable()->after('kpi_nrr_sub');
            }
            if (!Schema::hasColumn('business_model', 'kpi_market_sub')) {
                $table->string('kpi_market_sub', 100)->nullable()->after('kpi_market');
            }
            // Unit Economics KPI block (shown on Economics tab)
            if (!Schema::hasColumn('business_model', 'kpi_arpa')) {
                $table->string('kpi_arpa', 50)->nullable()->after('kpi_market_sub');
            }
            if (!Schema::hasColumn('business_model', 'kpi_arpa_sub')) {
                $table->string('kpi_arpa_sub', 100)->nullable()->after('kpi_arpa');
            }
            if (!Schema::hasColumn('business_model', 'kpi_cac')) {
                $table->string('kpi_cac', 50)->nullable()->after('kpi_arpa_sub');
            }
            if (!Schema::hasColumn('business_model', 'kpi_cac_sub')) {
                $table->string('kpi_cac_sub', 100)->nullable()->after('kpi_cac');
            }
        });
    }

    public function down(): void
    {
        Schema::table('business_model', function (Blueprint $table) {
            $table->dropColumn([
                'kpi_gross_margin', 'kpi_gross_margin_sub',
                'kpi_payback', 'kpi_payback_sub',
                'kpi_ltv_cac', 'kpi_ltv_cac_sub',
                'kpi_nrr', 'kpi_nrr_sub',
                'kpi_market', 'kpi_market_sub',
                'kpi_arpa', 'kpi_arpa_sub',
                'kpi_cac', 'kpi_cac_sub',
            ]);
        });
    }
};
