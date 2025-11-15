<?php


namespace App\Http\Controllers\Api\Resident\BusinessPlan;


use App\Http\Controllers\Api\Traits\CRUD;
use App\Http\Requests\Resident\BusinessPlan\BusinessModelCreateRequest;
use App\Http\Requests\Resident\BusinessPlan\BusinessModelListRequest;
use App\Http\Requests\Resident\BusinessPlan\BusinessModelUpdateRequest;
use App\Http\Resources\Catalog\ValueResorce;
use App\Http\Resources\Resident\BusinessPlan\BusinessModelResource;
use App\Http\Resources\Resident\BusinessPlan\BusinessPlanResource;
use App\Models\BusinessModel\BusinessModel;
use App\Models\BusinessModel\BusinessModelValue;
use App\Models\BusinessModel\Prop;
use App\Models\BusinessModel\Value;
use Illuminate\Http\Request;
use Illuminate\Support\Arr;
use Illuminate\Validation\ValidationException;

class BusinessModelController extends BusinessPlanAccessController
{
    use CRUD {
        createOrUpdate as createOrUpdateCRUD;
        delete as deleteCRUD;
    }

    public function list(BusinessModelListRequest $request)
    {

        $query = BusinessModel::query()
            ->distinct(['business_model.id'])
            ->select('catalog_user.*')
            ->leftJoin('business_model_value', 'business_model_value.id_business_model', '=', 'business_model.id')
            ->leftJoin('business_model_prop_value', function($join){
                $join->on('business_model_prop_value.id', '=', 'business_model_value.cataloggable_id')
                    ->where('business_model_value.cataloggable_type', Value::class);
            })
            ->with(['values', 'values.prop']);

        $requestAll = $request->all();

        if(($search = Arr::get($requestAll, 'filter.search')) !== null) {
            $query->where(function($q) use ($search){
                $search = "%" . $search . "%";
                $q->where('business_model_prop_value.value', 'like', $search)
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
        $all = ['industries', 'technologies', 'category', 'profitability', 'location'];
        $data = [];

        foreach($all as $value) {
            $prop = Prop::where('id_name', $value)->first();
            $data[snakeCaseToPascalCase($value)] = ValueResorce::collection($prop->values);
        }

        return response()->json($data);
    }

    public function createOrUpdate(BusinessModel $model, BusinessModelCreateRequest $request)
    {
        $result = $this->createOrUpdateCRUD(
            $request,
            $model,
            null,
            function($model, $request, $isNew){

                if(!$isNew) {
                    BusinessModelValue::where('id_business_model', $model->id)->delete();
                }else{
                    $model->setRandomNum('public', 32, true);
                }

                $data = $request->all();
                $props = Prop::all();
                foreach($data as $nameProp => $values){
                    if(!in_array($nameProp, $props->pluck('id_name')->toArray())) {
                        continue;
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
            });

        return $result;
    }

    public function delete(BusinessModel $model)
    {
        return $this->deleteCRUD($model);
    }

    public function update(BusinessModelUpdateRequest $request, BusinessModel $model)
    {

        foreach(BusinessModel::TYPE_IMG as $file) {
            $del = "{$file}Delete";

            if($request->{$file} || $request->{$del}) {
                $fileStorage = $model->getFileType($file);
                $fileStorage->each(function ($item) {
                    $item->delete();
                });
            }
            if($request->{$file}) {
                $model->uploads($request->{$file}, ['type' => $file]);
            }

        }

        return $this->defResponse();
    }

    public function item(BusinessModel $model)
    {
        return new BusinessModelResource($model);
    }

    public function toPlan(BusinessModel $model)
    {
        return new BusinessPlanResource($model->toPlan());
    }


}
