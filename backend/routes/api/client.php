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
        });

    #transaction
    Route::controller(Client\TransactionController::class)->prefix('transaction')
        ->group(function(){
            Route::get('list', 'list');
        });

    #file
    Route::controller(Client\DocumentController::class)->prefix('document')->middleware('testDB')
        ->group(function(){
            Route::get('list', 'list');
            Route::post('/', 'create');
        });
});



