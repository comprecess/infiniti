<?php
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Api\ClientController;

Route::get('/test', function (Request $request) {
    return response()->json(['test' => '123']);
});

Route::group(['prefix' => 'client',], function(){
    Route::get('/', [ClientController::class, 'index']);
    Route::put('/', [ClientController::class, 'update']);
    Route::post('/avatar', [ClientController::class, 'updateAvatar']);
    }
);



