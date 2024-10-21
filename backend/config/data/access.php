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
        'documents' => [
            Resident\DocumentController::class
        ]
    ];
