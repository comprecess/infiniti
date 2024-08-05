<?php


namespace App\Http\Controllers\Api\Resident\Client;


use App\Http\Controllers\Api\Resident\ResidentController;
use App\Http\Controllers\Api\Traits\CRUD;
use App\Http\Requests\Resident\Client\ClientCreateRequest;
use App\Http\Requests\Resident\Client\ClientListRequest;
use App\Http\Requests\Resident\Client\ClientViewRequest;
use App\Http\Requests\Resident\Settings\CustomFieldsRequest;
use App\Http\Resources\Resident\Client\ClientExcelResource;
use App\Http\Resources\Resident\Client\ClientPdfResource;
use App\Http\Resources\Resident\Client\ClientResource;
use App\Http\Resources\Resident\Client\CompanyResource;
use App\Http\Resources\Resident\Client\GroupResource;
use App\Http\Resources\Resident\Settings\CurrencyResorce;
use App\Http\Resources\Resident\Settings\CustomFieldsResorce;
use App\Http\Resources\UserResource;
use App\Models\Log;
use App\Models\Resident\Client\Company;
use App\Models\Resident\Client\Group;
use App\Models\Resident\Settings\Currency;
use App\Models\Resident\Settings\CustomFields;
use App\Models\Users\Admin;
use App\Models\Users\Client;
use App\Services\Document\DocumentVariables;
use App\Services\Tools\Countries;
use Illuminate\Http\Request;
use Illuminate\Support\Arr;
use PhpOffice\PhpSpreadsheet\Worksheet\Drawing;

class ClientController extends ResidentController
{
    use CRUD {
       createOrUpdate as createOrUpdateCRUD;
    }

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

        $request->sortModel($clients);

        return $this->index($clients, ClientResource::class, true);
    }
    public function inputData()
    {
        $data = [
            'code' => Client::getNextCode('CUS'),
            'type' => Client::TYPE,
            'company' => CompanyResource::collection(Company::getForSelect()),
            'group' => GroupResource::collection(Group::getForSelect()),
            'currency' => CurrencyResorce::collection(Currency::getForSelect()),
            'owner' => UserResource::collection(Admin::getForSelect()),
            'country' => Countries::list(),
            'customFields' => CustomFieldsResorce::collection(CustomFields::getForSelect())
        ];

        return response()->json($data);
    }

    public function createOrUpdate(ClientCreateRequest $request, Client $client)
    {
        $this->createOrUpdateCRUD(
            $request,
            $client,
            function($model, $request){
                /**
                 * @var Client $model
                 */
                if($request->password) {
                    $model->setNewPassword($request->password);
                }
            },
            function($model, $request){
                Log::send(__('resident.newContact', ['name' => $model->account, 'id' => $model->id]));

                $data = [];
                foreach($request->customFields as $id => $value) {
                    $data[$id] = ['fvalue' => $value];
                }
                $model->customFieldsValues()->sync($data);
            }
        );
    }

    public function getAllType(Client $client)
    {
        $data = ['img' => $client->getLastFile()?->getLink(), 'email' => $client->email, 'phone' => $client->phone, 'account' => $client->account];
        $type = ClientViewRequest::TYPE;
        $typesValue = array_fill(0, count($type), null);
        $data['type'] = array_combine($type, $typesValue);

        $data['type']['invoices'] = $client->invoices()->count();
        $data['type']['quotes'] = $client->offers()->count();

        return response()->json($data);
    }

}
