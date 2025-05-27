<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Api\CatalogController;
use App\Http\Controllers\Api\BusinessModelController;
use App\Http\Controllers\Api\MeetingController;
use App\Http\Controllers\Api\NotificationController;
use App\Http\Controllers\Api\UserController;

#user settings
Route::controller(UserController::class)
    ->prefix('user')
    ->group(function(){
        Route::get('setting', 'setting');
        Route::patch('setting', 'settingUpdate');
        Route::post('setting', 'settingUpdate');
    });

#catalog
Route::controller(CatalogController::class)
    ->prefix('catalog')
    ->group(function(){
    Route::get('filters', 'filters');
    Route::get('properties', 'properties');
    Route::get('property/{id}', 'property');
    Route::post('list', 'list');
    Route::get('item/{catalogUser}', 'item');
    Route::get('employment', 'employment');
    Route::get('cart', 'getCart');
    Route::post('cart', 'addCart');
    Route::delete('cart/item/{id}', 'deleteItemCart');
    Route::get('cart/create-pay', 'createPay');
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

#meeting
Route::controller(MeetingController::class)
    ->prefix('meeting')
    ->group(function(){
        Route::post('{name}/{id?}', 'create')->whereIn('name', MeetingController::MEET_TYPE);
        Route::get('employment/{name}/{id?}', 'employment')->whereIn('name', MeetingController::MEET_TYPE);
    });

#notification
Route::controller(NotificationController::class)
    ->prefix('notification')
    ->group(function(){
        Route::get('/', 'list');
        Route::put('/viewed', 'viewed');
        Route::get('/push/public-key', 'getKeyPush');
        Route::post('/push/subscribe', 'subscribePush');
        Route::post('/push/unsubscribed', 'unsubscribedPush');
        Route::get('/push/test', 'test');
    });

