<?php

use Illuminate\Support\Facades\Route;
use App\Http\Middleware\Auth\Authenticate;
use App\Http\Controllers\AuthController;

/*
|--------------------------------------------------------------------------
| Web Routes
|--------------------------------------------------------------------------
|
| Here is where you can register web routes for your application. These
| routes are loaded by the RouteServiceProvider and all of them will
| be assigned to the "web" middleware group. Make something great!
|
*/
Route::group(['middleware' => Authenticate::class], function(){
    Route::get('/', function () {
        return view('welcome');
    });
});

Route::prefix('chat-gpt')
    ->controller(\App\Http\Controllers\Api\Resident\ChatGPTController::class)
    ->group(function(){
        Route::get('test', 'test');
    });

#Авторизация регистрация
Route::view('login', 'pages.auth.login');
Route::post('login', [AuthController::class, 'login'])->name('login.post');
Route::any('/api/v1/stripe', [\App\Http\Controllers\Service\StripeController::class, 'index'])->name('stripeEvent');

