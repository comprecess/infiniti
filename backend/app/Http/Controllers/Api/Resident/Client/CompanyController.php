<?php


namespace App\Http\Controllers\Api\Resident\Client;


use App\Http\Controllers\Api\Traits\CRUD;
use App\Http\Controllers\Controller;
use App\Http\Requests\Resident\Client\CompanyRequest;
use App\Http\Resources\Resident\Client\CompanyResource;
use App\Models\Resident\Client\Company;
use App\Services\Tools\Countries;
use Illuminate\Support\Arr;
use Illuminate\Validation\ValidationException;

class CompanyController extends Controller
{
    use CRUD {
        index as myIndex;
        delete as myDelete;
    }

    public function list()
    {
        return $this->myIndex(Company::with(['files'])->orderBy('id', 'desc'), CompanyResource::class);
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

    public function index(Company $company)
    {
        return new CompanyResource($company);
    }

    public function delete(Company $company)
    {
        return $this->myDelete($company);
    }

}
