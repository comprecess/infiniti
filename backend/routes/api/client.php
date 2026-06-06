<?php
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Api\ClientController;
use App\Http\Controllers\Api\Public\PetitionController;
use App\Http\Controllers\Api\Client;


Route::group(['prefix' => 'client',], function(){
    Route::get('/', [ClientController::class, 'index']);
    Route::put('/', [ClientController::class, 'update']);
    Route::post('/avatar', [ClientController::class, 'updateAvatar']);
    Route::post('add-fund', [ClientController::class, 'addFund']);
    Route::get('add-fund', [ClientController::class, 'inputData']);

    #invoice and offer
    Route::controller(PetitionController::class)->prefix('/my/{type}')
        ->whereIn('type', array_keys(PetitionController::PUBLIC_TOKEN))
        ->group(function(){
            Route::get('/', 'myData');
        });

    #dashboard
    Route::controller(Client\DashboardController::class)->prefix('dashboard')
        ->group(function(){
            Route::get('/', 'index');
        });

    #business-plan
    Route::controller(Client\Business\BusinessPlanController::class)->prefix('business-plan')
        ->group(function(){
            Route::get('list', 'list');
            Route::get('{id}', 'item')->where('id', '[0-9]+');
            Route::patch('{id}', 'update')->where('id', '[0-9]+');
            Route::get('question', 'getQuestion');
            Route::get('/input-data', 'inputData');
            Route::get('{id}/chatgpt/talents', 'chatgptTalent')->where('id', '[0-9]+');
//            Route::get('question', 'getQuestion');
            Route::post('item/{businessModel}/question', 'createBusinessPlan')->where('businessModel', '[0-9]+');
            Route::post('{plan}/add-cart', 'addCart');
            //https://console.infiniti.stream/api/v1/client/business-plan/item/77/question
        });

    #transaction
    Route::controller(Client\TransactionController::class)->prefix('transaction')
        ->group(function(){
            Route::get('list', 'list');
        });

    #file
    Route::controller(Client\DocumentController::class)->prefix('document')
        ->group(function(){
            Route::get('list', 'list');
            Route::post('/', 'create');
        });

    #order
    Route::controller(Client\OrderController::class)->prefix('order')
        ->group(function(){
            Route::get('list', 'list');
            Route::get('view/{order}', 'item');
        });

    #invoice
    Route::controller(Client\InvoiceController::class)->prefix('invoice')
        ->group(function(){
            Route::get('list', 'list');
        });

    #Project
    Route::controller(Client\Project\ProjectController::class)
        ->prefix('project')
        ->group(function(){
            Route::get('/my-projects', 'myProject');
            Route::get('/work-projects', 'workProjects');
            Route::get('/input-data', 'inputData');
//            Route::post('/', 'createOrUpdate');
            Route::match(['put', 'post'],'/{project}', 'createOrUpdate');
//            Route::delete('/{project}', 'delete');
            Route::match(['get', 'put', 'patch', 'post', 'delete'], '/{project}/{type}/{id?}', 'viewProcess')->where('id', '.+');
            Route::get('/{project}', 'item');
            /*Route::get('/{model}/to-plan', 'toPlan');
            Route::match(['put', 'post'],'/{model}/update', 'update');*/
        });

    #Logs
    Route::controller(Client\LogsController::class)
        ->prefix('log')
        ->middleware('throttle:1,1')
        ->group(function(){
                Route::patch('in', 'in');
                Route::patch('out', 'out');
        });

    #knowledge-base
    Route::controller(Client\KnowledgeBaseController::class)->prefix('knowledge-base')
        ->group(function(){
            Route::get('input-data', 'inputData');
            Route::get('history',    'history');
            Route::post('message',   'message');
        });

    #support / tickets
    Route::controller(\App\Http\Controllers\Api\Client\Support\ClientTicketController::class)->prefix('support')
        ->group(function(){
            Route::get('/',             'list');
            Route::post('/',            'store');
            Route::get('/input-data',   'inputData');
            Route::get('/{id}',         'show')->where('id', '[0-9]+');
            Route::post('/{id}/reply',  'reply')->where('id', '[0-9]+');
        });
    #Exit Deal Project (role-based access for Founder/Investor/Buyer)
    Route::controller(Client\Project\ProjectExitController::class)
        ->prefix("project/{projectId}/exit")
        ->group(function(){
            Route::get("/overview", "overview");
            Route::get("/deal-room", "dealRoom");
            Route::get("/deal-room/folder/{folderCode}", "dealRoomFolder");
            Route::get("/valuation", "valuation");
            Route::get("/growth-plan", "growthPlan");
            Route::get("/invoices", "invoices");
            Route::get("/offers", "offers");
        });
});



