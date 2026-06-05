<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class ProjectTemplateSeeder extends Seeder
{
    /**
     * Seed the project templates.
     */
    public function run(): void
    {
        // Exit Deal Template
        $templateId = DB::table('clx_project_templates')->insertGetId([
            'code' => 'exit_deal',
            'name' => 'Exit Deal',
            'description' => 'Growth & Exit program project template. Includes Deal Room, Valuation, Growth Plan, and Buyer/Investor Pipelines.',
            'default_roles' => json_encode(['founder', 'investor', 'buyer', 'advisor']),
            'default_statuses' => json_encode(['Draft', 'Onboarding', 'Growth Phase', 'Deal Active', 'Due Diligence', 'Closed', 'Cancelled']),
            'is_active' => true,
            'sort_order' => 1,
            'created_at' => now(),
            'updated_at' => now(),
        ]);

        // Sections for Exit Deal
        $sections = [
            [
                'template_id' => $templateId,
                'code' => 'summary',
                'name' => 'Summary',
                'icon' => 'DashboardIcon',
                'sort_order' => 0,
                'config' => null,
                'is_required' => true,
                'is_active' => true,
            ],
            [
                'template_id' => $templateId,
                'code' => 'tasks',
                'name' => 'Tasks',
                'icon' => 'TasksIcon',
                'sort_order' => 1,
                'config' => null,
                'is_required' => true,
                'is_active' => true,
            ],
            [
                'template_id' => $templateId,
                'code' => 'growth_plan',
                'name' => 'Growth Plan',
                'icon' => 'ChartIcon',
                'sort_order' => 2,
                'config' => json_encode(['show_valuation_summary' => true]),
                'is_required' => true,
                'is_active' => true,
            ],
            [
                'template_id' => $templateId,
                'code' => 'valuation',
                'name' => 'Valuation',
                'icon' => 'AccountingIcon',
                'sort_order' => 3,
                'config' => null,
                'is_required' => true,
                'is_active' => true,
            ],
            [
                'template_id' => $templateId,
                'code' => 'deal_room',
                'name' => 'Deal Room',
                'icon' => 'FileIcon',
                'sort_order' => 4,
                'config' => json_encode([
                    'default_folders' => [
                        'NDA & Legal',
                        'Financials',
                        'Product & Tech',
                        'Team & HR',
                        'Market & Clients',
                        'Operations',
                    ],
                ]),
                'is_required' => true,
                'is_active' => true,
            ],
            [
                'template_id' => $templateId,
                'code' => 'pipeline_buyers',
                'name' => 'Buyer Pipeline',
                'icon' => 'LeadsIcon',
                'sort_order' => 5,
                'config' => json_encode(['pipeline_type' => 'buyer']),
                'is_required' => false,
                'is_active' => true,
            ],
            [
                'template_id' => $templateId,
                'code' => 'pipeline_investors',
                'name' => 'Investor Pipeline',
                'icon' => 'TalentsIcon',
                'sort_order' => 6,
                'config' => json_encode(['pipeline_type' => 'investor']),
                'is_required' => false,
                'is_active' => true,
            ],
            [
                'template_id' => $templateId,
                'code' => 'invoices',
                'name' => 'Invoices',
                'icon' => 'InvoicesIcon',
                'sort_order' => 7,
                'config' => null,
                'is_required' => false,
                'is_active' => true,
            ],
            [
                'template_id' => $templateId,
                'code' => 'logs',
                'name' => 'Logs',
                'icon' => 'LogIcon',
                'sort_order' => 8,
                'config' => null,
                'is_required' => false,
                'is_active' => true,
            ],
        ];

        foreach ($sections as $section) {
            $section['created_at'] = now();
            $section['updated_at'] = now();
            DB::table('clx_project_template_sections')->insert($section);
        }

        // Fundraising Template (placeholder for future)
        $fundraisingId = DB::table('clx_project_templates')->insertGetId([
            'code' => 'fundraising',
            'name' => 'Fundraising',
            'description' => 'Template for fundraising rounds. Includes investor pipeline, pitch materials, and term sheet tracking.',
            'default_roles' => json_encode(['founder', 'investor', 'advisor']),
            'default_statuses' => json_encode(['Draft', 'Preparation', 'Active Round', 'Term Sheet', 'Closed', 'Cancelled']),
            'is_active' => false, // Not active yet — Phase 2
            'sort_order' => 2,
            'created_at' => now(),
            'updated_at' => now(),
        ]);

        // Venture Building Template (placeholder for future)
        DB::table('clx_project_templates')->insert([
            'code' => 'venture_building',
            'name' => 'Venture Building',
            'description' => 'Template for building new ventures from scratch. Includes validation, MVP tracking, and growth metrics.',
            'default_roles' => json_encode(['founder', 'advisor', 'team_lead']),
            'default_statuses' => json_encode(['Idea', 'Validation', 'MVP', 'Growth', 'Scale', 'Completed']),
            'is_active' => false, // Not active yet — Phase 3
            'sort_order' => 3,
            'created_at' => now(),
            'updated_at' => now(),
        ]);
    }
}
