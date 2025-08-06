<?php


namespace App\Http\Controllers\Api\Resident\Client;


use App\Http\Controllers\Api\Traits\CRUD;
use App\Http\Requests\Resident\Client\ClientCreateRequest;
use App\Http\Requests\Resident\Client\ClientListRequest;
use App\Http\Requests\Resident\Client\ClientViewRequest;
use App\Http\Requests\Resident\Client\View\ActivityRequest;
use App\Http\Requests\Resident\Client\View\FilesRequest;
use App\Http\Resources\Resident\Client\ClientAllResource;
use App\Http\Resources\Resident\Client\ClientExcelResource;
use App\Http\Resources\Resident\Client\ClientPdfResource;
use App\Http\Resources\Resident\Client\ClientResource;
use App\Http\Resources\Resident\Client\ClientView;
use App\Http\Resources\Resident\Client\CompanyResource;
use App\Http\Resources\Resident\Client\CompanyView\TransactionResource;
use App\Http\Resources\Resident\Client\GroupResource;
use App\Http\Resources\Resident\DocumentResource;
use App\Http\Resources\Resident\Settings\CurrencyResource;
use App\Http\Resources\Resident\Settings\CustomFieldsResource;
use App\Http\Resources\UserResource;
use App\Mail\EmailTemplateMail;
use App\Mail\Resident\Client\WelcomeEmail;
use App\Models\Log;
use App\Models\Resident\Client\Activity;
use App\Models\Resident\Client\Company;
use App\Models\Resident\Client\Group;
use App\Models\Resident\Document;
use App\Models\Resident\Invoices\Invoice;
use App\Models\Resident\Settings\Currency;
use App\Models\Resident\Settings\CustomFields;
use App\Models\Resident\Settings\Role;
use App\Models\Resident\Settings\Tag;
use App\Models\User;
use App\Models\Users\Admin;
use App\Models\Users\Client;
use App\Services\Document\DocumentVariables;
use App\Services\Tools\Countries;
use App\Services\Zoom\Requests\MeetingData;
use Illuminate\Support\Arr;
use Illuminate\Support\Facades\Mail;
use Illuminate\Validation\ValidationException;
use PhpOffice\PhpSpreadsheet\Worksheet\Drawing;
use Illuminate\Http\Request;

class SupplierController extends ClientController
{

}
