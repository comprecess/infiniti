<?php


namespace App\Http\Controllers\Api\Resident\Client;


use App\Http\Controllers\Api\Resident\ResidentController;
use App\Http\Controllers\Api\Traits\CRUD;
use App\Http\Requests\Resident\Client\ClientRequest;
use App\Http\Resources\Resident\Client\ClientExcelResource;
use App\Http\Resources\Resident\Client\ClientPdfResource;
use App\Http\Resources\Resident\Client\ClientResource;
use App\Models\Users\Client;
use App\Services\Document\DocumentVariables;
use Illuminate\Http\Request;
use Illuminate\Support\Arr;
use PhpOffice\PhpSpreadsheet\Worksheet\Drawing;

class ClientController extends ResidentController
{
    use CRUD;

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

    public function list(ClientRequest $request)
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
                    ->orWhere('crm_groups.gname', 'like', $search)
                    ->orWhere('sys_companies.company_name', 'like', $search);
            });
        }

        return $this->index($clients, ClientResource::class, true);
    }

    public function getAllType(Client $company)
    {
        $data = ['logo' => $company->getLastFile()?->getLink(), 'name' => $company->company_name];
        $typesValue = [null, null];

        $companyUsers = $company->users()->with(['invoices', 'offers', 'orders', 'transactionPayer', 'transactionPayee'])->get();

        $typesValue[] = $companyUsers->count();

        foreach(['invoices', 'offers', 'orders'] as $relations) {
            $typesValue[] = $companyUsers->sum(function($item) use($relations){
                return $item->{$relations}?->count();
            });
        }

        $transaction = $companyUsers->sum(function($item) use($relations){
            return $item->transactionPayer?->count();
        });

        $transaction += $companyUsers->sum(function($item) use($relations){
            return $item->transactionPayee?->count();
        });

        $typesValue[] = $transaction;
        $data['type'] = array_combine(CompanyViewRequest::TYPE, $typesValue);

        return response()->json($data);
    }

}
