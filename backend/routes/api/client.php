<?php
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Api\ClientController;
use App\Http\Controllers\Api\CatalogController;

Route::get('/test', function (Request $request) {
    return response()->json(['test' => '123']);
});

Route::group(['prefix' => 'client',], function(){
    Route::get('/', [ClientController::class, 'index']);
    Route::put('/', [ClientController::class, 'update']);
    Route::post('/avatar', [ClientController::class, 'updateAvatar']);
    }
);

#catalog
Route::group(['prefix' => 'catalog'], function(){
    Route::get('filters', [CatalogController::class, 'filters']);
    Route::get('properties', [CatalogController::class, 'properties']);
    Route::get('property/{id}', [CatalogController::class, 'property']);
    Route::post('list', [CatalogController::class, 'list']);
    Route::get('item/{catalogUser}', [CatalogController::class, 'item']);
    Route::put('item/{catalogUser}', [CatalogController::class, 'edit']);
    Route::get('input-data', [CatalogController::class, 'inputData']);
    Route::get('cart', [CatalogController::class, 'getCart']);
    Route::post('cart', [CatalogController::class, 'addCart']);
    Route::delete('cart/item/{id}', [CatalogController::class, 'deleteItemCart']);
});


