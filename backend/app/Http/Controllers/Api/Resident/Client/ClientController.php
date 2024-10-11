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
use App\Models\Log;
use App\Models\Resident\Client\Activity;
use App\Models\Resident\Client\Company;
use App\Models\Resident\Client\Group;
use App\Models\Resident\Document;
use App\Models\Resident\Invoices\Invoice;
use App\Models\Resident\Settings\Currency;
use App\Models\Resident\Settings\CustomFields;
use App\Models\Resident\Settings\Tag;
use App\Models\Users\Admin;
use App\Models\Users\Client;
use App\Services\Document\DocumentVariables;
use App\Services\Tools\Countries;
use Illuminate\Support\Arr;
use Illuminate\Support\Facades\Mail;
use PhpOffice\PhpSpreadsheet\Worksheet\Drawing;

class ClientController extends MainClientController
{
    use CRUD {
       createOrUpdate as createOrUpdateCRUD;
       delete as deleteCRUD;
    }

    protected $client = null;

    public function getDocumentVariables(): DocumentVariables
    {
        $columns = [
          'img' => 'Image',
          'account' => 'Name',
          'company' => 'Company name',
          'group' => 'Group',
          'email' => 'E-mail',
          'phone' => 'Phone',
        ];

        $varibles = new DocumentVariables();

        $varibles->nameDocument = "Customers";
        $varibles->header = "Customers - Infiniti";
        if(request()->type == Client::TYPE[1]) {
            $varibles->nameDocument = "Suppliers";
            $varibles->header = "Suppliers - Infiniti";
        }
        $varibles->columns = $columns;
        $varibles->excelView = 'document.excel.resident-client';
        $varibles->excelFilesCollable = function ($query){
            $images = [];

            foreach($query as $key => $value) {
                if($path = $value->getLastFile()?->getFile()?->getRealPath()) {
                    $drawing = new Drawing();
                    $drawing->setPath($path);
                    $drawing->setHeight(50);
                    $drawing->setCoordinates("A" . ($key + 2));
                    $images[] = $drawing;
                }
            }

            return $images;
        };
        $varibles->resource = request()->input('document') == 'pdf' ? ClientPdfResource::class : ClientExcelResource::class;


        return $varibles;
    }

    public function list(ClientListRequest $request)
    {
        $clients = Client::query()
            ->select('crm_accounts.*')
            ->leftJoin("crm_groups", "crm_groups.id", "=", "crm_accounts.gid")
            ->leftJoin("sys_companies", "sys_companies.id", "=", "crm_accounts.cid")
            ->leftJoin("file_storages", function($join){
                $join->on('file_storages.model_id', "=", "crm_accounts.id")
                    ->where('file_storages.model_type', "=", Client::class)
                    ->whereNull('file_storages.data');
            })
            ->with(['group', 'companyClient', 'files']);

        $requestAll = $request->all();
        if($group = Arr::get($requestAll, 'filter.group')) {
            $clients->where('gid', $group);
        }

        if($search = Arr::get($requestAll, 'filter.search')) {
            $clients->where(function($q) use ($search){
                $search = "%" . $search . "%";
                $q->where('crm_accounts.id', 'like', $search)
                    ->orWhere('crm_accounts.account', 'like', $search)
                    ->orWhere('crm_accounts.email', 'like', $search)
                    ->orWhere('crm_accounts.phone', 'like', $search)
                    ->orWhere('crm_groups.gname', 'like', $search)
                    ->orWhere('sys_companies.company_name', 'like', $search);
            });
        }

        if($type = Arr::get($requestAll, 'type', Client::TYPE[0])) {
            $clients->where('crm_accounts.type', 'like', '%' . $type . '%');
        }

//        $user = auth()->user();
//        if($user->checkAccess() === 0) {
//            $clients->where('crm_accounts.o', $user->id);
//        }

        $clients->checkAccess();

        $request->sortModel($clients);

        return $this->index($clients, ClientResource::class, true);
    }

    public function item(Client $client)
    {
        return new ClientAllResource($client->checkAccessAbort());
    }

    public function inputData()
    {
        $name = 'CUS';
        if(in_array(request()->type, Client::TYPE)) {
            $name = strtoupper(mb_substr(request()->type, 0, 3));
        }
        $data = [
            'code' => Client::getNextCode($name),
            'type' => Client::TYPE,
            'company' => CompanyResource::collection(Company::getForSelect()),
            'group' => GroupResource::collection(Group::getForSelect()),
            'currency' => CurrencyResource::collection(Currency::getForSelect()),
            'owner' => UserResource::collection(Admin::getForSelect()),
            'country' => Countries::list(),
            'customFields' => CustomFieldsResource::collection(CustomFields::getForSelect()),
            'tags' => Tag::getForSelectByName('Client')->pluck('text')->toArray()
        ];

        return response()->json($data);
    }

    public function createOrUpdate(ClientCreateRequest $request, Client $client)
    {
        return $this->createOrUpdateCRUD(
            $request,
            $client,
            function($model, $request, $isNew){

                if($isNew) {
                    $model->setApiToken();
                }
                /**
                 * @var Client $model
                 */
                if($request->password) {
                    $model->setNewPassword($request->password);
                }

                if($request->currency) {
                    $cur = Currency::where('iso_code', $request->currency)->first();
                    $model->currency = $cur->id;
                }

                if($request->country) {
                    $countryList = Countries::list();
                    $model->country = $countryList[$request->country];
                }
            },
            function($model, $request, $isNew){
                if($isNew) {
                    Log::send(__('resident.newContact', ['name' => $model->account, 'id' => $model->id]));
                }

                if($request->customFields) {
                    $data = [];
                    foreach($request->customFields as $id => $value) {
                        $data[$id] = ['fvalue' => $value];
                    }
                    $model->customFieldsValues()->sync($data);
                }


                if($request->tags) {
                    $model->setTag($request->tags);
                }
            }
        );
    }

    public function delete(Client $client)
    {
        return $this->deleteCRUD($client);
    }

    public function getAllType(Client $client)
    {
        $data = ['img' => $client->getLastFile()?->getLink(), 'email' => $client->email, 'phone' => $client->phone, 'account' => $client->account];
        $type = ClientViewRequest::TYPE;
        $typesValue = array_fill(0, count($type), null);
        $data['type'] = array_combine($type, $typesValue);
        $data['type']['invoices'] = $client->invoices()->count();
        $data['type']['transactions'] = $client->transaction()->count();
        $data['type']['quotes'] = $client->offers()->count();
        $data['type']['files'] = $client->documents()->wherePivot('rtype', 'contact')->count();
        $data['type']['log'] = $client->logs()->count();

        return response()->json($data);
    }

    public function type(ClientViewRequest $request, Client $client)
    {
        $this->client = $client;
        return $this->viewObject($request, $request->getMethod());
    }

    private function viewObject(ClientViewRequest $request, $prefix = "Get")
    {
        $prefix = ucfirst(strtolower($prefix));
        $method = $request->getType() . $prefix;

        if(!method_exists($this, $method)) {
            abort(404);
        }

        $result = $this->{$method}($request);
        if($result === null) {
            return response()->json(['success' => true]);
        }

        return $result;
    }

    private function summaryGet()
    {
        return new ClientView\SummaryResource($this->client->load(['group', 'companyClient', 'transactionPayer', 'transactionPayee']));
    }

    private function activityGet($request)
    {
        if($id = $request->route('id')) {
            $activity = $this->client?->activity()->with(['admin','client'])->where('id', $id)->first();
            if(!$activity) {
                abort(404);
            }
            return new ClientView\ActivityResource($activity);
        }
        return ClientView\ActivityResource::collection($this->client?->activity()->with(['admin','client'])->orderByDesc('id')->get());
    }

    private function invoicesGet()
    {
        $invoices = $this->client->invoices()->with(['user'])->get();
        $currency = Currency::getDefault();
        $invoicesCur = new Invoice();
        return response()
            ->json([
                'listStatus' => Invoice::STATUS,
                'invoiceAmount' => $invoicesCur->printPrice($invoices->invoice_amount, $currency),
                'paidAmount' => $invoicesCur->printPrice($invoices->paid_amount, $currency),
                'unpaidAmount' => $invoicesCur->printPrice($invoices->unpaid_amount, $currency),
//                'cancelledAmount' => $invoicesCur->printPrice($invoices->cancelled_amount, $currency),
                'invoice' => ClientView\InvoiceResource::collection($invoices),
            ]);
    }

    private function quotesGet()
    {
        return ClientView\OffercResource::collection($this->client?->offers);
    }

    private function filesGet()
    {
        return response()->json([
           'clientFiles' =>  DocumentResource::collection($this->client->documents()->wherePivot('rtype', 'contact')->get()),
           'listFiles' => DocumentResource::collection(Document::all())
        ]);
    }

    private function transactionsGet()
    {
        return TransactionResource::collection($this->client->transaction()->with(['payerUser', 'payeeUser'])->get());
    }

    private function emailGet()
    {
//        return ClientView\EmailLogResource::collection($this->client->emailLog()->orderBy('id', 'desc')->get());
        return response()->json([
            'client' => new ClientResource($this->client),
            'logEmail' =>  ClientView\EmailLogResource::collection($this->client->emailLog()->orderBy('id', 'desc')->get()),
        ]);
    }

    private function logGet()
    {
        return ClientView\LogResource::collection($this->client->logs()->orderBy('id', 'desc')->get());
    }

    private function clientpasswordmanagerGet()
    {
        return ClientView\PasswordManagerResource::collection($this->client->passwordManager()->orderBy('id', 'desc')->get());
    }

    private function moreGet()
    {
        return ClientView\CustomFieldsResource::collection($this->client->getCustomFieldsValues());
    }

    #put
    private function summaryPut($request)
    {
        $data = $request->all();
        if($request->isSet('primaryContact') && in_array($request->primaryContact, [0, 1])) {
            $this->client->is_primary_contact = $data['primaryContact'];
        }

        if($request->isSet('notes')) {
            $this->client->notes = $data['notes'];
        }

        if($request->isSet('autologin')) {
            $this->client->autologin = $data['autologin'] ? str()->random(64) : null;
        }

        if($request->isSet('addAmount') || $request->isSet('returnAmount')) {
            $type = isset($data['addAmount']);
            $amount = $type ? $data['addAmount'] : $data['returnAmount'];

            $request->validateWithBag('put', [$type ? 'addAmount' : 'returnAmount' => 'numeric|min:0|not_in:0']);

            $balancePrivate = $this->client->balance;
            if($type) {
                $newBalance = $balancePrivate + $amount;
                Log::send(__('log.added_amount', ['amount' => $amount,'balancePrivate' => $balancePrivate, 'nameadmin' => auth()->user()->fullname, 'nameclient' => $this->client->account, 'newBalace' => $newBalance, 'id' => $this->client->id]), $this->client);
            } else {
                $newBalance = $balancePrivate - $amount;
                Log::send(__('log.return_amount', ['amount' => $amount,'balancePrivate' => $balancePrivate, 'nameadmin' => auth()->user()->fullname, 'nameclient' => $this->client->account, 'newBalace' => $newBalance, 'id' => $this->client->id]), $this->client);
            }
            $this->client->balance = $newBalance;

        }

        $this->client->save();
    }

    private function activityPut($request)
    {
        $requestData = app(ActivityRequest::class);
        $activity = Activity::findOrFail($request->route('id'));
        $requestData->setModel($activity);
        $activity->save();
    }

    private function filesPut()
    {
        $requestData = app(FilesRequest::class);
        $this->client->documents()->attach($requestData->id, ['rtype' => Document::TYPE_CONTACT]);
    }

    private function emailPut($request)
    {
//        $t = new Template();
//        $text = '<p>{{ticket_message}}</p>
//<p>----------------------------------------------<br /> Ticket ID: #{{ticket_id}}<br /> Subject: {{ticket_subject}}<br /> Status: {{ticket_status}}<br /> Ticket URL: {{ticket_link}}<br /> ----------------------------------------------</p>';
//        $t->render($text);
        $request->validateWithBag('put', [
            'title' => 'required',
            'message' => 'required'
        ]);
        Mail::to($this->client)->send(new EmailTemplateMail($this->client, $request->title, $request->message));

    }

    #post
    private function activityPost()
    {
        $requestData = app(ActivityRequest::class);
        $activity = new Activity();
        $requestData->setModel($activity);
        $activity->o = auth()->id();
        #delete old code
        $activity->oname = auth()->user()->fullname;
        $date = now();
        $activity->stime = $date->timestamp;
        $activity->sdate = $date;
        #delete
        $this->client->activity()->saveMany([$activity]);
    }

    #delete
    private function activityDelete($request)
    {
        $activity = Activity::findOrFail($request->route('id'));
        $activity->delete();
    }

    private function filesDelete()
    {
        $requestData = app(FilesRequest::class);
//        $this->client->documents()->attach($requestData->id, ['rtype' => Document::TYPE_CONTACT]);
//        dd($this->client->documents()->where('ib_doc_rel.id', $requestData->id)->toRawSql());
        $this->client->documents()/*->where('ib_doc_rel.id', $requestData->id)*/->detach([$requestData->id]);
    }





}
