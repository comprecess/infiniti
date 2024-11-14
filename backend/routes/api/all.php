<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Api\CatalogController;
use App\Http\Controllers\Api\Public\PetitionController;

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
});

#invoice and offer by token
Route::controller(PetitionController::class)->prefix('/{type}/token/{token}')
    ->whereIn('type', array_keys(PetitionController::PUBLIC_TOKEN))
    ->group(function(){
       Route::get('/', 'publicToken');
       Route::post('/', 'offerCheck');
    });


