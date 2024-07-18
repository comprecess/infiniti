<?php
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Api\ClientController;
use App\Http\Controllers\Api\Resident\Settings\CurrencyController;
use App\Http\Controllers\Api\Resident\Client;

#resident
Route::get('/', [ClientController::class, 'index']);

#client
Route::group(['prefix' => 'client',], function(){
    Route::get('/list', [Client\ClientController::class, 'list']);

    #group
    Route::group(['prefix' => 'group'], function(){
        Route::get('/', [Client\GroupController::class, 'index']);
        Route::post('/', [Client\GroupController::class, 'create']);
        Route::put('/sort', [Client\GroupController::class, 'sort']);
        Route::put('/{group}', [Client\GroupController::class, 'create']);
        Route::delete('/{group}', [Client\GroupController::class, 'delete']);
    });

    #company
    Route::group(['prefix' => 'company'], function(){
        Route::get('/', [Client\CompanyController::class, 'list']);
        Route::post('/', [Client\CompanyController::class, 'create']);
        Route::put('/{company}', [Client\CompanyController::class, 'create']);
        Route::get('/{company}', [Client\CompanyController::class, 'index']);
        Route::delete('/{company}', [Client\CompanyController::class, 'delete']);
    });

});
#settings
Route::group(['prefix' => 'settings'], function(){
    #Currency
    Route::get('/currency', [CurrencyController::class, 'currency']);
    Route::post('/currency', [CurrencyController::class, 'create']);
    Route::put('/currency/{currency}', [CurrencyController::class, 'update']);
    Route::put('/currency/{currency}/base', [CurrencyController::class, 'updateBase']);
    Route::delete('/currency/{currency}', [CurrencyController::class, 'delete']);
});
