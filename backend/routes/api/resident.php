<?php
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Api\ClientController;
use App\Http\Controllers\Api\Resident;
//use App\Http\Controllers\Api\Resident\Settings;
//use App\Http\Controllers\Api\Resident\Client;

#resident
Route::get('/', [ClientController::class, 'index']);

#dashboard
Route::controller(Resident\DashboardController::class)->prefix('dashboard')
    ->group(function(){
        Route::get('/', 'index');
    });

#client
Route::group(['prefix' => 'client',], function(){
    Route::get('/list', [Resident\Client\ClientController::class, 'list']);
    Route::get('/input-data', [Resident\Client\ClientController::class, 'inputData']);
    Route::post('/', [Resident\Client\ClientController::class, 'createOrUpdate']);
    Route::get('/{client}', [Resident\Client\ClientController::class, 'item'])->where('client', '[0-9]+');
    Route::put('/{client}', [Resident\Client\ClientController::class, 'createOrUpdate']);
    Route::delete('/{client}', [Resident\Client\ClientController::class, 'delete']);
    Route::get('/{client}/view/', [Resident\Client\ClientController::class, 'getAllType']);
    Route::match(['get', 'put', 'post', 'delete'], '/{client}/view/{type}/{id?}', [Resident\Client\ClientController::class, 'type']);
//    Route::get('/{client}/view/{type}', [Client\ClientController::class, 'type']);
//    Route::put('/{client}/view/{type}', [Client\ClientController::class, 'type']);

    #group
    Route::group(['prefix' => 'group'], function(){
        Route::get('/', [Resident\Client\GroupController::class, 'index']);
        Route::post('/', [Resident\Client\GroupController::class, 'create']);
        Route::put('/sort', [Resident\Client\GroupController::class, 'sort']);
        Route::put('/{group}', [Resident\Client\GroupController::class, 'create']);
        Route::delete('/{group}', [Resident\Client\GroupController::class, 'delete']);
        Route::delete('/{group}/client/{client}', [Resident\Client\GroupController::class, 'deleteClient']);
    });

    #company
    Route::group(['prefix' => 'company'], function(){
        Route::get('/', [Resident\Client\CompanyController::class, 'list']);
        Route::get('/input-data', [Resident\Client\CompanyController::class, 'inputData']);
        Route::get('/{company}/view/', [Resident\Client\CompanyController::class, 'getAllType']);
        Route::get('/{company}/view/{type}', [Resident\Client\CompanyController::class, 'type']);
        Route::put('/{company}/view/{type}', [Resident\Client\CompanyController::class, 'updateType']);
        Route::post('/', [Resident\Client\CompanyController::class, 'create']);
        Route::put('/{company}', [Resident\Client\CompanyController::class, 'create']);
        Route::get('/{company}', [Resident\Client\CompanyController::class, 'index']);
        Route::delete('/{company}', [Resident\Client\CompanyController::class, 'delete']);
    });

});

#suppliers
Route::controller(Resident\Client\SupplierController::class)
    ->prefix('supplier')
    ->group(function(){
        Route::get('/list', 'list');
        Route::get('/input-data', 'inputData');
        Route::post('/', 'createOrUpdate');
        Route::get('/{client}', 'item')->where('client', '[0-9]+');
        Route::put('/{client}', 'createOrUpdate');
        Route::delete('/{client}', 'delete');
        Route::get('/{client}/view/', 'getAllType');
        Route::match(['get', 'put', 'post', 'delete'], '/{client}/view/{type}/{id?}', 'type');
    });

#invoce
Route::controller(Resident\Sale\InvoiceController::class)->prefix('invoice')
    ->group(function(){
        Route::get('/stat', 'stat');
        Route::get('/list', 'list');
        Route::get('/input-data', 'inputData');
        Route::post('/price-calc', 'priceCalc');
        Route::post('/', 'createOrUpdate');
        Route::put('/{invoice}', 'createOrUpdate');
        Route::put('/{invoice}/update', 'update');
        Route::post('/{invoice}/clone', 'invoiceClone');
        Route::post('/{invoice}/stopRecurring', 'stopRecurring');
//        Route::get('/{invoice}/blank', 'blankList');
//        Route::post('/{invoice}/blank', 'blankCreateOrUpdate');
//        Route::put('/{invoice}/blank/{item}', 'blankCreateOrUpdate');
//        Route::delete('/{invoice}/blank/{item}', 'blankDelete');
        Route::get('/{invoice}', 'item');
        Route::delete('/{invoice}', 'delete');
//        Route::get('/service/{service}', 'listService');
        Route::get('/{invoice}/pay-info', 'payInfo');
        Route::post('/{invoice}/add-pay', 'addPay');
    });
#offer
Route::controller(Resident\Sale\OfferController::class)->prefix('offer')
    ->group(function(){
//        Route::get('/stat', 'stat');
        Route::get('/list', 'list');
        Route::get('/input-data', 'inputData');
        Route::get('/cart/{token}', 'fromCart');
        Route::post('/', 'createOrUpdate');
        Route::put('/{offer}', 'createOrUpdate');
        Route::put('/{offer}/update', 'update');
        Route::put('/{offer}/convert', 'convert');
        Route::get('/{offer}', 'item');
        Route::delete('/{offer}', 'delete');
    });
#blank
Route::controller(Resident\Sale\BlankController::class)->prefix('{typeBlank}')->whereIn('typeBlank', array_keys(Resident\Sale\BlankController::TYPE_BLANK))
    ->group(function(){
        Route::get('/{idType}/blank', 'blankList');
        Route::post('/{idType}/blank', 'blankCreateOrUpdate');
        Route::put('/{idType}/blank/{item}', 'blankCreateOrUpdate');
        Route::delete('/{idType}/blank/{item}', 'blankDelete');
        Route::get('/service/{service}', 'listService');
    });
#document
Route::controller(Resident\DocumentController::class)->prefix('document')
    ->group(function(){
        Route::get('/list', 'list');
        Route::post('/', 'createOrUpdate');
        Route::get('/{document}', 'item');
        Route::put('/{document}/update', 'update');
        Route::delete('/{document}', 'delete');
    });

#talents
Route::controller(Resident\Talents\TalentController::class)->prefix('talent')
    ->group(function(){
        Route::get('/list', 'list');
        Route::get('list', 'listCatalogPublic');
        Route::get('/input-data', 'inputData');
        Route::get('/cart/list', 'cartList');
        Route::get('/cart/{cart}', 'cartItem');
        Route::put('/cart/{cart}/item/{item}', 'cartItemUpdate');
        Route::delete('/cart/{cart}/item/{item}', 'cartItemDelete');
        Route::post('/', 'createOrUpdate');
        Route::put('/{user}', 'createOrUpdate');
        Route::get('/{user}', 'item');
        Route::delete('/{user}', 'delete');
        Route::match(['put', 'post'],'/{user}/update', 'update');
    });

#BusinessPlan
Route::controller(Resident\BusinessPlan\BusinessPlanController::class)->prefix('business-plan')
    ->group(function(){
        Route::get('/list', 'list');
        Route::get('/input-data', 'inputData');
        Route::get('/{plan}', 'item');
        Route::post('/', 'createOrUpdate');
        Route::match(['put', 'post'],'/{plan}', 'createOrUpdate');
        Route::delete('/{plan}', 'delete');
//        Route::match(['put', 'delete'],'/{plan}/team/{id}', 'team');
    });
#BusinessModelPublic
Route::controller(Resident\BusinessPlan\BusinessModelPublicController::class)->prefix('business-model')
    ->group(function(){
        Route::get('filters', 'filters');
        Route::get('properties', 'properties');
        Route::get('property/{id}', 'property');
        Route::get('list', 'list');
        Route::get('item/{model}', 'item');
    });

#BusinessModel
Route::controller(Resident\BusinessPlan\BusinessModelController::class)->prefix('business-model')
    ->group(function(){
        Route::get('/input-data', 'inputData');
        Route::post('/', 'createOrUpdate');
        Route::put('/{model}', 'createOrUpdate');
        Route::get('/{model}', 'item');
        Route::get('/{model}/to-plan', 'toPlan');
        Route::delete('/{model}', 'delete');
        Route::match(['put', 'post'],'/{model}/update', 'update');
    });

#transactions
Route::controller(Resident\Transactions\TransactionsController::class)
    ->prefix('transactions')
    ->group(function(){
        Route::get('/list', 'list');
        Route::get('/input-data', 'inputData');
        Route::get('/input-data/client', 'inputDataClient');
//        Route::match(['post', 'put'], '/{transaction?}', 'createOrUpdate');
        Route::post('/create', 'create');
        Route::post('/', 'createOrUpdate');
        Route::get('bill', 'bill');
        Route::put('/{transaction}', 'createOrUpdate');
        Route::delete('/{transaction}', 'delete');
        Route::get('/{transaction}', 'item');
        Route::post('transfer', 'transfer');
        Route::get('bill/all', 'billAll');
        Route::post('bill', 'billCreateOrUpdate');
        Route::match(['put', 'post'],'bill/{bill}', 'billCreateOrUpdate');
        Route::put('bill/{bill}/paid', 'billPaid');
        Route::delete('bill/{bill}', 'billDelete');
        Route::get('bill/{bill}', 'billItem');

        #account
        Route::controller(Resident\Transactions\AccountController::class)
            ->prefix('account')
            ->group(function(){
                Route::get('/list', 'list');
                Route::get('/input-data', 'inputData');
                Route::post('/', 'createOrUpdate');
                Route::put('/{account}', 'createOrUpdate');
                Route::get('/{account}', 'item');
                Route::delete('/{account}', 'delete');
                Route::post('/{account}/equity', 'equity');
            });

        #asset
        Route::controller(Resident\Transactions\AssetController::class)
            ->prefix('asset')
            ->group(function(){
                Route::get('/list', 'list');
                Route::get('/input-data', 'inputData');
                Route::post('/category', 'categoryCreate');
                Route::delete('/category/{category}', 'categoryDelete');
                Route::post('/', 'createOrUpdate');
                Route::put('/{asset}', 'createOrUpdate');
                Route::get('/{asset}', 'item');
                Route::delete('/{asset}', 'delete');
            });
    });


#Project Templates
Route::prefix('project-templates')
    ->controller(Resident\Project\Template\ProjectTemplateController::class)
    ->group(function(){
        Route::get('/', 'list');
        Route::get('/by-code/{code}', 'sectionsByCode');
        Route::post('/', 'store');
        Route::get('/{template}', 'item');
        Route::put('/{template}', 'update');
        Route::get('/{template}/sections', 'sections');
    });

#Project Metadata
Route::prefix('project/{projectId}/metadata')
    ->controller(Resident\Project\ProjectMetadataController::class)
    ->group(function(){
        Route::get('/', 'index');
        Route::get('/{group}', 'group');
        Route::post('/', 'store');
        Route::delete('/{group}/{key}', 'destroy');
    });

#Project
Route::controller(Resident\Project\ProjectController::class)->prefix('project')
    ->group(function(){
        Route::get('/list', 'list');
        Route::get('/input-data', 'inputData');
        Route::post('/', 'createOrUpdate');
        Route::put('/{project}', 'createOrUpdate');
        Route::delete('/{project}', 'delete');
        Route::match(['get', 'put', 'patch', 'post', 'delete'], '/{project}/{type}/{id?}', 'view')->where('id', '.+');
        Route::get('/{project}', 'item');
        /*Route::get('/{model}/to-plan', 'toPlan');
        Route::match(['put', 'post'],'/{model}/update', 'update');*/
    });

#Task
Route::controller(Resident\Task\TaskController::class)->prefix('task')
    ->group(function(){
//        Route::get('/list', 'list');
//        Route::get('/input-data', 'inputData');
        Route::post('/', 'createOrUpdate');
        Route::put('/{task}', 'createOrUpdate');
        Route::delete('/{task}', 'delete');
        Route::patch('/{task}/status', 'updateStatus');
//        Route::match(['get', 'put', 'post', 'delete'], '/{project}/{type}/{id?}', 'view');
        /*Route::get('/{model}', 'item');
        Route::get('/{model}/to-plan', 'toPlan');
        Route::match(['put', 'post'],'/{model}/update', 'update');*/
    });

#settings
Route::group(['prefix' => 'settings'], function(){
    #admin
    Route::controller(Resident\Settings\AdminController::class)->prefix('admin')
        ->group(function(){
            Route::get('/list', 'list');
            Route::get('/input-data', 'inputData');
            Route::post('/', 'createOrUpdate');
            Route::put('/{resident}', 'createOrUpdate');
            Route::get('/{resident}', 'item');
            Route::match(['put', 'post'],'/{resident}/update', 'update');
            Route::delete('/{resident}', 'delete');
        });
    #currency
    Route::controller(Resident\Settings\CurrencyController::class)->prefix('currency')
        ->group(function(){
            Route::get('/',  'currency');
            Route::post('/', 'create');
            Route::put('/{currency}', 'update');
            Route::put('/{currency}/base', 'updateBase');
            Route::delete('/{currency}', 'delete');
        });
    #custom fields
    Route::controller(Resident\Settings\CustomFieldsController::class)->prefix('custom_fields')
        ->group(function(){
            Route::get('/', 'list');
            Route::post('/', 'createOrUpdate');
            Route::put('/{customFields}', 'createOrUpdate');
            Route::get('/{customFields}', 'item');
            Route::delete('/{customFields}', 'delete');
        });
    #Roles
    Route::controller(Resident\Settings\RoleController::class)->prefix('role')
        ->group(function(){
            Route::get('/', 'list');
            Route::get('/input-data', 'inputData');
            Route::post('/', 'createOrUpdate');
            Route::put('/{role}', 'createOrUpdate');
            Route::get('/{role}', 'item');
            Route::delete('/{role}', 'delete');
        });
    #Config
    Route::prefix('config')
        ->controller(Resident\Settings\ConfigController::class)
        ->group(function(){
            Route::patch('{name}', 'setConfig')->whereIn('name', array_keys(Resident\Settings\ConfigController::LIST));
        });
});

#ChatGPT
Route::prefix('chat-gpt')
    ->controller(Resident\ChatGPTController::class)
    ->group(function(){
        Route::get('history-user', 'historyUser');
        Route::get('input-data', 'inputData');
        Route::get('analysis', 'analysis');
        Route::post('message', 'message');
        Route::get('ready-prompt', 'readyPrompt');
        Route::get('test', 'test');
        Route::any('history/{hash}', 'history');
    });

#mail
Route::controller(Resident\MailController::class)->prefix('mail')
    ->group(function(){
        Route::match(['GET', 'POST'],'/template/{nameTemplate}/{varible?}', 'template')->where('varible', '(.*)');
    });

#Leads (HubSpot)
Route::prefix('leads')
    ->controller(Resident\LeadsController::class)
    ->group(function(){
        Route::get('/', 'list');
        Route::get('/statuses', 'statuses');
        Route::post('/', 'store');
        Route::put('/{id}', 'update');
        Route::delete('/{id}', 'destroy');
    });

# Email Templates
Route::prefix('email-templates')
    ->controller(\App\Http\Controllers\Api\EmailTemplateController::class)
    ->group(function(){
        Route::get('/', 'index');
        Route::post('/', 'store');
        Route::get('/{id}', 'show');
        Route::patch('/{id}', 'update');
        Route::delete('/{id}', 'destroy');
        Route::get('/{id}/render', 'render');
    });

# Knowledge Base admin (popular questions)
Route::prefix('knowledge-base')
    ->controller(\App\Http\Controllers\Api\Resident\KnowledgeBaseAdminController::class)
    ->group(function(){
        Route::get('/popular',          'popular');
        Route::delete('/popular',       'deletePopular');
        Route::get('/pinned',           'pinned');
        Route::post('/pinned',          'addPinned');
        Route::put('/pinned/{id}',      'updatePinned')->where('id', '[0-9]+');
        Route::delete('/pinned/{id}',   'deletePinned')->where('id', '[0-9]+');
    });

# Support / Tickets (resident/admin)
Route::prefix('support')
    ->controller(\App\Http\Controllers\Api\Resident\Support\TicketController::class)
    ->group(function(){
        Route::get('/',                     'list');
        Route::post('/',                    'store');
        Route::get('/input-data',           'inputData');
        Route::get('/departments',          'departmentList');
        Route::post('/departments',         'departmentStore');
        Route::put('/departments/{id}',     'departmentUpdate')->where('id', '[0-9]+');
        Route::delete('/departments/{id}',  'departmentDestroy')->where('id', '[0-9]+');
        Route::get('/predefined',           'predefinedList');
        Route::post('/predefined',          'predefinedStore');
        Route::put('/predefined/{id}',      'predefinedUpdate')->where('id', '[0-9]+');
        Route::delete('/predefined/{id}',   'predefinedDestroy')->where('id', '[0-9]+');
        Route::get('/{id}',                 'show')->where('id', '[0-9]+');
        Route::put('/{id}',                 'update')->where('id', '[0-9]+');
        Route::delete('/{id}',              'destroy')->where('id', '[0-9]+');
        Route::post('/{id}/reply',          'reply')->where('id', '[0-9]+');
        Route::post('/{id}/attachment',     'uploadAttachment')->where('id', '[0-9]+');
    });
