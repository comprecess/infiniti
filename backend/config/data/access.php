<?php
use \App\Http\Controllers\Api\Resident;

    return [
        'sales' => [
            Resident\Sale\SaleController::class,
        ],
        'settings' => [
            Resident\Settings\SettingsController::class
        ],
        'customers' => [
            Resident\Client\MainClientController::class
        ],
        'suppliers' => [
            Resident\Client\SupplierController::class
        ],
        'companies' => [
            Resident\Client\CompanyController::class
        ],
        'documents' => [
            Resident\DocumentController::class
        ],
        'talent' => [
            Resident\Talents\TalentsController::class
        ],
        'business_plan' => [
            Resident\BusinessPlan\BusinessPlanAccessController::class
        ],
        'transactions' => [
            Resident\Transactions\TransactionsAccessController::class
        ],
        'assets' => [
            Resident\Transactions\AssetController::class
        ],
        'projects' => [
            Resident\Project\ProjectAccessController::class
        ],
        'tasks' => [
            Resident\Task\TaskAccessController::class
        ],
        'calendar' => [
            Resident\Project\CalendarController::class
        ]
    ];
