<?php


namespace App\Http\Controllers\Api\Resident\Client;


use App\Http\Controllers\Api\Resident\ResidentController;
use App\Http\Controllers\Api\Traits\CRUD;
use App\Http\Requests\Resident\Client\CompanyRequest;
use App\Http\Requests\Resident\Client\CompanyViewRequest;
use App\Http\Resources\Resident\Client\CompanyResource;
use App\Models\Resident\Client\Company;
use App\Services\Tools\Countries;
use Illuminate\Support\Arr;
use Illuminate\Validation\ValidationException;
use App\Http\Resources\Resident\Client\CompanyView;

class CompanyController extends ResidentController
{
    use CRUD {
        index as myIndex;
        delete as myDelete;
    }

    public function list()
    {
        $companies = Company::with(['files'])
            ->orderBy('id', 'desc')
            ->checkAccess();

        return $this->myIndex($companies, CompanyResource::class);
    }

    public function create(CompanyRequest $request, Company $company)
    {
        return $this->createOrUpdate($request, $company, function($model, $request){
            if($request->country) {
                $countries = Countries::list();
                $model->country = Arr::get($countries, $request->country);
            }
        },
        function($model, $request){
            $file = $model->getLastFile();
            if($request->logo) {
                if($request->logo != $file?->getLink()) {
                    $newFile = $model->urlFile($request->logo);
                    if(!$newFile->isImage()) {
                        return ValidationException::withMessages(['The logo is not a picture']);
                    }
                    $file?->delete();
                }
            } else {
                $file?->delete();
            }
        });
    }

    public function inputData()
    {
        $name = 'COMP';
        $data = [
            'code' => Company::getNextCode($name),
        ];

        return response()->json($data);
    }

    public function index(Company $company)
    {
        return new CompanyResource($company->checkAccessAbort());
    }

    public function delete(Company $company)
    {
        return $this->myDelete($company);
    }

    public function getAllType(Company $company)
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

    public function type(Company $company, CompanyViewRequest $request)
    {
        $type = array_flip(CompanyViewRequest::TYPE);
        $listResponse = [
            2 => [
                'with' => null,
                'response' => CompanyView\ClientResource::class
            ],
            [
                'with' => ['invoices'],
                'response' => CompanyView\InvoiceResource::class,
                'withDop' => ['invoices.getCurrencyIso', 'invoices.user'],
            ],
            [
                'with' => ['offers'],
                'response' => CompanyView\OffercResource::class,
                'withDop' => ['offers.getCurrencyIso', 'offers.user'],
            ],
            [
                'with' => ['orders'],
                'response' => CompanyView\OrderResource::class,
                'withDop' => ['orders.user'],
            ],
            [
                'with' => ['transactionPayer', 'transactionPayee'],
                'response' => CompanyView\TransactionResource::class,
                'withDop' => ['transactionPayer.payerUser', 'transactionPayee.payeeUser', 'transactionPayer.getCurrencyIso', 'transactionPayee.getCurrencyIso'],
            ],
        ];

        $usersBuild = $company->users();

        if($request->type == "summary"){
            return new CompanyResource($company);
        }elseif ($request->type == "memo") {
            return response()->json(['notes' => $company->notes ?? '']);
        }elseif(isset($listResponse[$type[$request->type]])){
            $response = $listResponse[$type[$request->type]];

            if(($with = $response['with']) || isset($response['withDop'])) {

                $usersBuild->with(array_merge($with, $response['withDop'] ?? []));
            }

            $users = $usersBuild->orderBy('id', 'desc')->get();
            if($with) {
                $data = collect([]);
                foreach($with as $withData) {
                    $data = $data->merge($users->pluck($withData)->flatten());
                }
                $resource = $response['response'];
                return $resource::collection($data->sortByDesc('id')->values());
            } else {
                $resource = $response['response'];
                return $resource::collection($users);
            }

        }
    }

    public function updateType(Company $company, CompanyViewRequest $request)
    {
        if($request->type == 'memo') {
            $company->notes = $request->memo;
            $company->save();

            return response()->json(['success' => true]);
        }

        return response()->json(['success' => false], 422);
    }

}
