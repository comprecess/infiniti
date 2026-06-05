<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     * Adds template_code to clx_projects to link projects to their template type.
     * NULL means legacy project (no template) — backward compatible.
     */
    public function up(): void
    {
        Schema::table('clx_projects', function (Blueprint $table) {
            $table->string('template_code', 50)
                ->nullable()
                ->after('billing_type')
                ->comment('Links to clx_project_templates.code; NULL = legacy project');
            $table->index('template_code', 'clx_projects_template_code_index');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('clx_projects', function (Blueprint $table) {
            $table->dropIndex('clx_projects_template_code_index');
            $table->dropColumn('template_code');
        });
    }
};
