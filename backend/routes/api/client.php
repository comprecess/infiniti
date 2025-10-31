<?php
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Api\ClientController;
use App\Http\Controllers\Api\Public\PetitionController;
use App\Http\Controllers\Api\Client;


Route::group(['prefix' => 'client',], function(){
    Route::get('/', [ClientController::class, 'index']);
    Route::put('/', [ClientController::class, 'update']);
    Route::post('/avatar', [ClientController::class, 'updateAvatar']);
    Route::post('add-fund', [ClientController::class, 'addFund']);
    Route::get('add-fund', [ClientController::class, 'inputData']);

    #invoice and offer
    Route::controller(PetitionController::class)->prefix('/my/{type}')
        ->whereIn('type', array_keys(PetitionController::PUBLIC_TOKEN))
        ->group(function(){
            Route::get('/', 'myData');
        });

    #dashboard
    Route::controller(Client\DashboardController::class)->prefix('dashboard')
        ->group(function(){
            Route::get('/', 'index');
        });

    #business-plan
    Route::controller(Client\Business\BusinessPlanController::class)->prefix('business-plan')
        ->group(function(){
            Route::get('list', 'list');
            Route::get('{id}', 'item')->where('id', '[0-9]+');
            Route::get('question', 'getQuestion');
            Route::get('question', 'getQuestion');
            Route::post('item/{businessModel}/question', 'cretaeBusinessPlan')->where('businessModel', '[0-9]+');
            //https://console.infiniti.stream/api/v1/client/business-plan/item/77/question
        });

    #transaction
    Route::controller(Client\TransactionController::class)->prefix('transaction')
        ->group(function(){
            Route::get('list', 'list');
        });

    #file
    Route::controller(Client\DocumentController::class)->prefix('document')
        ->group(function(){
            Route::get('list', 'list');
            Route::post('/', 'create');
        });

    #order
    Route::controller(Client\OrderController::class)->prefix('order')
        ->group(function(){
            Route::get('list', 'list');
            Route::get('view/{order}', 'item');
        });

    #invoice
    Route::controller(Client\InvoiceController::class)->prefix('invoice')
        ->group(function(){
            Route::get('list', 'list');
        });
});



