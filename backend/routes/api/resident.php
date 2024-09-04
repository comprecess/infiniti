<?php
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Api\ClientController;
use App\Http\Controllers\Api\Resident\Settings;
use App\Http\Controllers\Api\Resident\Client;

#resident
Route::get('/', [ClientController::class, 'index']);

#client
Route::group(['prefix' => 'client',], function(){
    Route::get('/list', [Client\ClientController::class, 'list']);
    Route::get('/input-data', [Client\ClientController::class, 'inputData']);
    Route::post('/', [Client\ClientController::class, 'createOrUpdate']);
    Route::get('/{client}', [Client\ClientController::class, 'item'])->where('client', '[0-9]+');
    Route::put('/{client}', [Client\ClientController::class, 'createOrUpdate']);
    Route::get('/{client}/view/', [Client\ClientController::class, 'getAllType']);
    Route::match(['get', 'put', 'post', 'delete'], '/{client}/view/{type}/{id?}', [Client\ClientController::class, 'type']);
//    Route::get('/{client}/view/{type}', [Client\ClientController::class, 'type']);
//    Route::put('/{client}/view/{type}', [Client\ClientController::class, 'type']);

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
        Route::get('/{company}/view/', [Client\CompanyController::class, 'getAllType']);
        Route::get('/{company}/view/{type}', [Client\CompanyController::class, 'type']);
        Route::put('/{company}/view/{type}', [Client\CompanyController::class, 'updateType']);
        Route::post('/', [Client\CompanyController::class, 'create']);
        Route::put('/{company}', [Client\CompanyController::class, 'create']);
        Route::get('/{company}', [Client\CompanyController::class, 'index']);
        Route::delete('/{company}', [Client\CompanyController::class, 'delete']);
    });

});

#invoce
Route::controller(\App\Http\Controllers\Api\Resident\InvoiceController::class)->prefix('invoice')
    ->group(function(){
        Route::get('/stat', 'stat');
        Route::get('/list', 'list');
        Route::get('/input-data', 'inputData');
        Route::post('/price-calc', 'priceCalc');
        Route::post('/', 'createOrUpdate');
//        Route::put('/{invoice}', 'createOrUpdate');
//        Route::get('/{invoice}', 'item');
//        Route::delete('/{invoice}', 'delete');
    });

#settings
Route::group(['prefix' => 'settings'], function(){
    #currency
    Route::controller(Settings\CurrencyController::class)->prefix('currency')
        ->group(function(){
            Route::get('/',  'currency');
            Route::post('/', 'create');
            Route::put('/{currency}', 'update');
            Route::put('/{currency}/base', 'updateBase');
            Route::delete('/{currency}', 'delete');
        });
//    #Currency
//    Route::get('/currency', [Settings\CurrencyController::class, 'currency']);
//    Route::post('/currency', [Settings\CurrencyController::class, 'create']);
//    Route::put('/currency/{currency}', [Settings\CurrencyController::class, 'update']);
//    Route::put('/currency/{currency}/base', [Settings\CurrencyController::class, 'updateBase']);
//    Route::delete('/currency/{currency}', [Settings\CurrencyController::class, 'delete']);
    #custom fields
    Route::controller(Settings\CustomFieldsController::class)->prefix('custom_fields')
        ->group(function(){
            Route::get('/', 'list');
            Route::post('/', 'createOrUpdate');
            Route::put('/{customFields}', 'createOrUpdate');
            Route::get('/{customFields}', 'item');
            Route::delete('/{customFields}', 'delete');
        });
});
