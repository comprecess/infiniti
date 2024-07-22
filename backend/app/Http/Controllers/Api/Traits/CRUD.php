<?php


namespace App\Http\Controllers\Api\Traits;



use App\Http\Requests\Interfaces\ConvertingPropertiesInterface;
use App\Models\Contracts\InsertDefaultValueInterface;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Support\Facades\DB;

trait CRUD
{
    public function getNamePrePage() :string
    {
        return 'amount';
    }

    public function index(string|Builder $model, string $resorce, bool $paginate = false)
    {
        if(!($model instanceof Builder)) {
            $model = $model::query();
        }

        if($paginate) {
            $model = $model->paginate(request()->input($this->getNamePrePage()) ?? 6);
        } else {
            $model = $model->get();
        }

        return $resorce::collection($model);
    }

    public function createOrUpdate(FormRequest $request, Model $model, ?callable $setDataModel = null, ?callable $afterDataSet = null)
    {
        DB::beginTransaction();
        $isUpdate = !((bool) $model->getAttributes());

        if($isUpdate && ($model instanceof InsertDefaultValueInterface)) {
            $model->insertDefaultValue();
        }

        if($request instanceof ConvertingPropertiesInterface) {
            $request->setModel($model);
        }

        if(is_callable($setDataModel)) {
            $this->checkException($setDataModel($model, $request, $isUpdate));
        }

        $model->save();

        if(is_callable($afterDataSet)) {
            $this->checkException($afterDataSet($model, $request, $isUpdate));
        }

        DB::commit();

        return response()->json(['success' => true]);

    }

    private function checkException(mixed $resultCallable)
    {
        if($resultCallable instanceof \Exception) {
            DB::rollBack();
            throw $resultCallable;
        }
    }

    public function delete(Model $model)
    {
        $model->delete();

        return response()->json(['success' => true]);
    }

}
