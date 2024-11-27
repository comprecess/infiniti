<?php
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Api\ClientController;
use App\Http\Controllers\Api\Public\PetitionController;


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
});



