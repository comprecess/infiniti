<?php


namespace App\Http\Controllers\Api\Resident\Talents;


use App\Http\Controllers\Api\Traits\CRUD;
use App\Http\Requests\Resident\Talents\TalentUpdateRequest;
use App\Http\Requests\Resident\Talents\BlockExperienceTalentRequest;
use App\Http\Requests\Resident\Talents\TalentCreateRequest;
use App\Http\Requests\Resident\Talents\TalentListRequest;
use App\Http\Resources\Catalog\PropertyResorce;
use App\Http\Resources\Catalog\ValueResorce;
use App\Http\Resources\Resident\Client\ClientResource;
use App\Http\Resources\Resident\Talents\TalentExcelResource;
use App\Http\Resources\Resident\Talents\TalentListResource;
use App\Http\Resources\Resident\Talents\TalentPdfResource;
use App\Http\Resources\Resident\Talents\TalentResource;
use App\Http\Resources\UserResource;
use App\Models\Catalog\Prop;
use App\Models\Catalog\User;
use App\Models\Catalog\UserBlock;
use App\Models\Catalog\UserValue;
use App\Models\Catalog\Value;
use App\Models\Users\Admin;
use App\Models\Users\Client;
use App\Services\Document\DocumentVariables;
use Illuminate\Support\Arr;
use Illuminate\Validation\ValidationException;
use PhpOffice\PhpSpreadsheet\Worksheet\Drawing;

class TalentController extends TalentsController
{
    use CRUD {
       createOrUpdate as createOrUpdateCRUD;
       delete as deleteCRUD;
    }

    public function getDocumentVariables(): DocumentVariables
    {
        $columns = [
            'img' => 'Image',
            'account' => 'Name',
            'specialization' => 'Specialization',
            'lvl' => 'Level',
            'priceHour' => 'Price per hour',
            'priceDay' => 'Price per day',
        ];

        $varibles = new DocumentVariables();

        $varibles->nameDocument = "Talents";
        $varibles->header = "Talents - Infiniti";
        $varibles->columns = $columns;
        $varibles->excelView = 'document.excel.resident-talent';
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
        $varibles->resource = request()->input('document') == 'pdf' ? TalentPdfResource::class : TalentExcelResource::class;


        return $varibles;
    }

    public function list(TalentListRequest $request)
    {

        $query = User::query()
            ->distinct(['catalog_user.id'])
            ->select('catalog_user.*')
            ->leftJoin('catalog_user_value', 'catalog_user_value.id_catalog_user', '=', 'catalog_user.id')
            ->leftJoin('catalog_prop_value', function($join){
                $join->on('catalog_prop_value.id', '=', 'catalog_user_value.cataloggable_id')
                    ->where('catalog_user_value.cataloggable_type', Value::class);
            })
            ->with(['values', 'values.prop']);

        $requestAll = $request->all();

        if(($search = Arr::get($requestAll, 'filter.search')) !== null) {
            $query->where(function($q) use ($search){
                $search = "%" . $search . "%";
                $q->where('catalog_prop_value.value', 'like', $search)
                    ->orWhere('name', 'like', $search);
            });
        }
//        $query->checkAccess();

        $request->sortModel($query);
//        $t = $query->first()->getPropsByNameId();
//        dd($t->where('id_name', 'specialization')?->first()->values->first()->value);


        return $this->index($query, TalentListResource::class, true);
    }

    public function inputData()
    {
        $all = ['key_skills', 'specialization', 'industries', 'all_skills', 'timezone', 'lvl', 'gender'];
        $data = [];

        foreach($all as $value) {
            $prop = Prop::where('id_name', $value)->first();
            $data[snakeCaseToPascalCase($value)] = ValueResorce::collection($prop->values);
        }

        $data['owner'] = UserResource::collection(Admin::getForSelect());
        $data['client'] = ClientResource::collection(Client::getForSelect());
        $data['language'] = PropertyResorce::collection(Prop::where('id_name', 'language')->get());

        return response()->json($data);
    }

    public function createOrUpdate(User $user, TalentCreateRequest $request)
    {
        $result =  $this->createOrUpdateCRUD(
            $request,
            $user,
            null,
            function($model, $request, $isNew){

                if(!$isNew) {
                    UserValue::where('id_catalog_user', $model->id)->delete();
                }

                $data = $request->all();
                foreach($data as $nameProp => $values){
                    if(in_array($nameProp, ['active','ownerId','clientId','birthDay', 'rate', 'blockExperience'])) {
                        continue;
                    }
                    if(!in_array($nameProp, ['priceHour','priceDay'])) {
                        $nameProp = pascalCaseToSnakeCase($nameProp);
                    }

                    if(!is_array($values)) {
                        $values = [$values];
                    }
                    foreach($values as $value) {
                        try {
                            $model->setPropData($value, $nameProp);
                        }catch (\Exception $e) {
                            throw ValidationException::withMessages([$nameProp => $e->getMessage()]);
                        }
                    }
                }

                if($data['rate']) {
                    Prop::where('id_name', 'rate')->first()?->values?->first()?->users()->attach([$model->id]);
                }

                #block
                $blockRequest = app(BlockExperienceTalentRequest::class);
                UserBlock::createOrUpdate($model, $blockRequest);
            });

        $user->setExpirence();
        return $result;
    }

    public function item(User $user)
    {
        $user->load(['values', 'values.prop']);
        return new TalentResource($user);
    }

    public function delete(User $user)
    {
        return $this->deleteCRUD($user);
    }

    public function update(TalentUpdateRequest $request, User $user)
    {
        if($request->file) {
            $user->files()->whereNull('data')->delete();
            $user->uploads($request->file);
        }

        if($request->deleteImg) {
            $user->files()->whereNull('data')->delete();
        }

        return $this->defResponse();
    }

    public function cartList()
    {
        $query = User::query()
            ->distinct(['catalog_user.id'])
            ->select('catalog_user.*')
            ->leftJoin('catalog_user_value', 'catalog_user_value.id_catalog_user', '=', 'catalog_user.id')
            ->leftJoin('catalog_prop_value', function($join){
                $join->on('catalog_prop_value.id', '=', 'catalog_user_value.cataloggable_id')
                    ->where('catalog_user_value.cataloggable_type', Value::class);
            })
            ->with(['values', 'values.prop']);

        $requestAll = $request->all();

        if(($search = Arr::get($requestAll, 'filter.search')) !== null) {
            $query->where(function($q) use ($search){
                $search = "%" . $search . "%";
                $q->where('catalog_prop_value.value', 'like', $search)
                    ->orWhere('name', 'like', $search);
            });
        }
//        $query->checkAccess();

        $request->sortModel($query);
//        $t = $query->first()->getPropsByNameId();
//        dd($t->where('id_name', 'specialization')?->first()->values->first()->value);


        return $this->index($query, TalentListResource::class, true);
    }

}
