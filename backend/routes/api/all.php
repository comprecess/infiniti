<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Api\CatalogController;

#catalog
Route::group(['prefix' => 'catalog'], function(){
    Route::get('filters', [CatalogController::class, 'filters']);
    Route::get('properties', [CatalogController::class, 'properties']);
    Route::get('property/{id}', [CatalogController::class, 'property']);
    Route::post('list', [CatalogController::class, 'list']);
    Route::get('item/{catalogUser}', [CatalogController::class, 'item']);
    Route::get('cart', [CatalogController::class, 'getCart']);
    Route::post('cart', [CatalogController::class, 'addCart']);
    Route::delete('cart/item/{id}', [CatalogController::class, 'deleteItemCart']);
    Route::get('cart/create-pay', [CatalogController::class, 'createPay']);
});


