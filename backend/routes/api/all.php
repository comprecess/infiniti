<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Api\CatalogController;
use App\Http\Controllers\Api\BusinessModelController;
use App\Http\Controllers\Api\MeetingController;

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

#business_model
Route::controller(BusinessModelController::class)
    ->prefix('business-model')
    ->group(function(){
        Route::get('filters', 'filters');
        Route::get('properties', 'properties');
        Route::get('property/{id}', 'property');
        Route::post('list', 'list');
        Route::get('item/{model}', 'item');
    });

#business_model
Route::controller(MeetingController::class)
    ->prefix('meeting')
    ->group(function(){
        Route::post('{name}/{id?}', 'create')->whereIn('name', MeetingController::MEET_TYPE);
        Route::get('employment/{name}/{id?}', 'employment')->whereIn('name', MeetingController::MEET_TYPE);
    });

