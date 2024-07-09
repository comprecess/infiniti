<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Api\AuthController;
use App\Http\Controllers\Api\ClientController;
use App\Http\Controllers\Api\UserController;
use App\Http\Controllers\Api\CatalogController;
use App\Http\Controllers\Api\Resident\Settings\CurrencyController;

/*
|--------------------------------------------------------------------------
| API Routes
|--------------------------------------------------------------------------
|
| Here is where you can register API routes for your application. These
| routes are loaded by the RouteServiceProvider and all of them will
| be assigned to the "api" middleware group. Make something great!
|
*/

Route::middleware('auth:api_client')->get('/test', function (Request $request) {
    return response()->json(['test' => '123']);
});

Route::post('/client/login', [AuthController::class, 'clientLogin']);
Route::post('/client/register', [AuthController::class, 'registration']);
Route::post('/client/resetpassword', [AuthController::class, 'resetpassword']);
Route::post('/resident/login', [AuthController::class, 'residentLogin']);

Route::group(
    [
        'prefix' => 'user',
    ], function(){
    Route::get('/', [UserController::class, 'getUser']);
}
);

Route::group(
    [
    'middleware' => ['auth:api_client'],
    'prefix' => 'client',
    ], function(){
        Route::get('/', [ClientController::class, 'index']);
        Route::put('/', [ClientController::class, 'update']);
        Route::post('/avatar', [ClientController::class, 'updateAvatar']);
    }
);

#resident
Route::group(
    [
        'middleware' => ['auth:api_admin'],
        'prefix' => 'resident',
    ], function(){
    Route::get('/', [ClientController::class, 'index']);

    #client
    Route::group(['prefix' => 'client',], function(){

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
}
);

#tools
Route::group(['prefix' => 'tools'], function(){
    Route::get('countries', [\App\Http\Controllers\Api\ToolsController::class, 'countries']);
}
);

#catalog
Route::group(['prefix' => 'catalog', 'middleware' => ['auth:api_client']], function(){
    Route::get('filters', [CatalogController::class, 'filters']);
    Route::get('properties', [CatalogController::class, 'properties']);
    Route::get('property/{id}', [CatalogController::class, 'property']);
    Route::post('list', [CatalogController::class, 'list']);
    Route::get('item/{catalogUser}', [CatalogController::class, 'item']);
    Route::get('cart', [CatalogController::class, 'getCart']);
    Route::post('cart', [CatalogController::class, 'addCart']);
    Route::delete('cart/item/{id}', [CatalogController::class, 'deleteItemCart']);
});

#fileStorage
Route::get('/file/{file_storage}', [\App\Http\Controllers\Api\FileController::class, 'load'])
    ->name('file_storage');
