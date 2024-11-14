<?php


use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Api\AuthController;
use App\Http\Controllers\Api\ClientController;
use App\Http\Controllers\Api\UserController;

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


Route::post('/client/login', [AuthController::class, 'clientLogin']);
Route::post('/client/register', [AuthController::class, 'registration']);
Route::post('/client/resetpassword', [AuthController::class, 'resetpassword']);
Route::post('/resident/login', [AuthController::class, 'residentLogin']);

#autologin
Route::get('/client/autologin/{autologin}', [AuthController::class, 'autologin'])
    ->name('autologin');
/*
#invoice
Route::get('/{type}/token/{token}', [\App\Http\Controllers\Api\Resident\Sale\InvoiceController::class, 'publicToken'])
    ->whereIn('type', array_keys(\App\Http\Controllers\Api\Resident\Sale\InvoiceController::PUBLIC_TOKEN))
    ->name('invoicePublic');
*/

Route::group(['prefix' => 'user'], function(){
    Route::get('/', [UserController::class, 'getUser']);
});

#tools
Route::group(['prefix' => 'tools'], function(){
    Route::get('countries', [\App\Http\Controllers\Api\ToolsController::class, 'countries']);
}
);

#fileStorage
Route::get('/file/{file_storage}', [\App\Http\Controllers\Api\FileController::class, 'load'])
    ->name('file_storage');
#pdf
Route::get('/pdf/{name}/token/{token}', [\App\Http\Controllers\Api\PdfController::class, 'index'])
    ->name('pdf');
#document
Route::get('/document/{token}', [\App\Http\Controllers\Api\Resident\DocumentController::class, 'load'])
    ->name('document_load');


#test
Route::get('test/list', [\App\Http\Controllers\Api\Resident\Client\ClientController::class, 'list']);
