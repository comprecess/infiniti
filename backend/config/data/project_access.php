<?php

/**
 * Project Access Configuration — Growth & Exit Program
 *
 * Defines role-based access rules for external participants (Client guard).
 * Roles are stored in personal_model.data JSON: {"role": "founder|investor|buyer"}
 *
 * Each role maps to permitted sections and their access levels.
 * Access levels: 'full' = read+write, 'read' = read-only, 'summary' = limited data view
 *
 * The 'owner' role is implicit for the project contact_id (founder who owns the project).
 */

return [

    /*
    |--------------------------------------------------------------------------
    | Role Definitions
    |--------------------------------------------------------------------------
    |
    | 'sections' — which project sections this role can access
    | 'deal_room_folders' — which Deal Room folders are visible (null = all)
    |
    */

    'owner' => [
        'sections' => [
            'onboarding'  => 'full',
            'deal_room'   => 'full',
            'valuation'   => 'full',
            'growth_plan' => 'full',
            'tasks'       => 'full',
            'offers'      => 'read',
            'invoices'    => 'full',
            'pipeline'    => 'read',
            'files'       => 'full',
            'view'        => 'full',
        ],
        'deal_room_folders' => null, // null = all folders
    ],

    'founder' => [
        'sections' => [
            'onboarding'  => 'full',
            'deal_room'   => 'full',
            'valuation'   => 'full',
            'growth_plan' => 'full',
            'tasks'       => 'full',
            'offers'      => 'read',
            'invoices'    => 'full',
            'pipeline'    => 'read',
            'files'       => 'full',
            'view'        => 'full',
        ],
        'deal_room_folders' => null,
    ],

    'investor' => [
        'sections' => [
            'deal_room'   => 'read',
            'valuation'   => 'summary',
            'growth_plan' => 'read',
            'offers'      => 'full',
            'invoices'    => 'read',
            'view'        => 'read',
        ],
        'deal_room_folders' => ['financial', 'commercial', 'marketing'],
    ],

    'buyer' => [
        'sections' => [
            'deal_room'   => 'read',
            'valuation'   => 'summary',
            'offers'      => 'full',
            'invoices'    => 'read',
            'view'        => 'read',
        ],
        'deal_room_folders' => ['financial', 'legal', 'operational', 'commercial', 'technical', 'hr', 'compliance'],
    ],

    /*
    |--------------------------------------------------------------------------
    | Section-to-Route Mapping
    |--------------------------------------------------------------------------
    |
    | Maps the viewProcess 'type' parameter to section codes.
    | Used by middleware to resolve which section is being accessed.
    |
    */

    'route_section_map' => [
        'view'        => 'view',
        'tasks'       => 'tasks',
        'files'       => 'files',
        'invoices'    => 'invoices',
        'offers'      => 'offers',
        'onboarding'  => 'onboarding',
        'deal-room'   => 'deal_room',
        'valuation'   => 'valuation',
        'growth-plan' => 'growth_plan',
        'growth-items'=> 'growth_plan',
        'pipeline'    => 'pipeline',
    ],

];
