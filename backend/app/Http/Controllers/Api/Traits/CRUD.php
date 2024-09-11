<?php


namespace App\Http\Controllers\Api\Traits;



use App\Http\Requests\Interfaces\ConvertingPropertiesInterface;
use App\Models\Contracts\InsertDefaultValueInterface;
use App\Services\Document\DocumentVariables;
use App\Services\Document\FactoryDocument;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Support\Facades\DB;

trait CRUD
{
    protected $page = 6;

    public function getNamePrePage() :string
    {
        return 'amount';
    }

    public function getDocumentVariables() :DocumentVariables
    {
        return new DocumentVariables();
    }

    public function index(string|Builder $model, string $resorce, bool $paginate = false)
    {
        if(!($model instanceof Builder)) {
            $model = $model::query();
        }

        if($document = request()->input('document')) {
            $documentData = (new FactoryDocument($model, $resorce, $this->getDocumentVariables()))->creator($document);
            if($documentData !== null) {
                return $documentData;
            }
        }

        if($paginate) {
            $model = $model->paginate(request()->input($this->getNamePrePage()) ?? $this->page);
        } else {
            $model = $model->get();
        }

        return $resorce::collection($model);
    }

    public function createOrUpdate(FormRequest $request, Model $model, ?callable $setDataModel = null, ?callable $afterDataSet = null)
    {
        DB::beginTransaction();
        $isNew = !((bool) $model->getAttributes());
        if($isNew && ($model instanceof InsertDefaultValueInterface)) {
            $model->insertDefaultValue();
        }

        if($request instanceof ConvertingPropertiesInterface) {
            $request->setModel($model);
        }

        if(is_callable($setDataModel)) {
//            $this->checkException($setDataModel($model, $request, $isNew));
            $this->checkException($setDataModel, $model, $request, $isNew);
        }

        $model->save();

        if(is_callable($afterDataSet)) {
//            $this->checkException($afterDataSet($model, $request, $isNew));
            $this->checkException($afterDataSet, $model, $request, $isNew);
        }

        DB::commit();

        return response()->json(['success' => true]);

    }

    private function checkException(callable $callable, ...$data)
    {
        try{
            $result = $callable(...$data);
            if($result instanceof \Exception) {
                DB::rollBack();
                throw $result;
            }
        }catch (\Exception $e) {
            DB::rollBack();
            throw $e;
        }
    }

//    private function checkException(mixed $resultCallable)
//    {
//        if($resultCallable instanceof \Exception) {
//            DB::rollBack();
//            throw $resultCallable;
//        }
//    }

    public function delete(Model $model)
    {
        $model->delete();

        return response()->json(['success' => true]);
    }

}
