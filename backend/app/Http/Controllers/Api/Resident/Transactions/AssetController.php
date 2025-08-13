<?php


namespace App\Http\Controllers\Api\Resident\Transactions;


use App\Http\Controllers\Api\Resident\ResidentController;
use App\Http\Controllers\Api\Traits\CRUD;
use App\Http\Requests\Resident\Transactions\AssetCategoryCreateRequest;
use App\Http\Requests\Resident\Transactions\AssetCreateRequest;
use App\Http\Requests\Resident\Transactions\AssetListRequest;
use App\Http\Resources\Resident\Transactions\AsseResource;
use App\Http\Resources\Resident\Transactions\AssetCategoryTreeResource;
use App\Http\Resources\Resident\Transactions\AssetListResource;
use App\Http\Resources\Resident\Transactions\AssetListResourceCollection;
use App\Models\Resident\Transactions\Asset;
use App\Models\Resident\Transactions\AssetCategory;
use App\Services\Document\DocumentVariables;
use Illuminate\Support\Arr;


class AssetController extends ResidentController
{
    use CRUD {
        createOrUpdate as createOrUpdateCRUD;
        delete as deleteCRUD;
    }

    const ACCESS = ['all', 'assets'];

    public function getDocumentVariables(): DocumentVariables
    {
        $columns = [
            'name' => 'Name',
            'datePurchased' => 'Date purchased',
            'supportedUntil' => 'Supported until',
            'price' => 'price',
        ];

        $varibles = new DocumentVariables();

        $varibles->nameDocument = "Asset";
        $varibles->header = "Asset - Infiniti";

        $varibles->columns = $columns;
        $varibles->excelView = 'document.excel.resident-asset';
        $varibles->resource = AssetListResource::class;


        return $varibles;
    }

    public function list(AssetListRequest $request)
    {
        $query = Asset::checkAccess(...self::ACCESS);
        $data = $request->all();

        if($category = Arr::get($data, 'filter.category')) {
            $query->where('category_id', $category);
        }

        $total = (new Asset())->printPrice($query->get()->sum('price'));

        if($search = Arr::get($data, 'filter.search')) {
            $search = "%{$search}%";
            $query->where(function($query) use($search){
                $query->where('id', 'like', $search)
                    ->orWhere('name', 'like', $search)
                    ->orWhere('serial', 'like', $search)
                    ->orWhere('notes', 'like', $search)
                    ->orWhere('price', 'like', $search);
            });
        }

        $request->sortModel($query);


        return $this->index($query, AssetListResourceCollection::class, true, ['total' => $total]);
    }

    public function inputData()
    {
        return response()->json([
            'category' => AssetCategoryTreeResource::collection(AssetCategory::getHead()),
        ]);
    }

    public function categoryCreate(AssetCategoryCreateRequest $request)
    {
        $category = AssetCategory::newDefault();
        return $this->createOrUpdateCRUD($request, $category, function($model, $request){
            $model->parent_id = (int) $request->parent;
        });
    }

    public function categoryDelete(AssetCategory $category)
    {
        return $this->deleteCRUD($category);
    }

    public function createOrUpdate(AssetCreateRequest $request, Asset $asset)
    {
        if(!$asset->id) {
            $asset = Asset::newDefault();
        }

        return $this->createOrUpdateCRUD($request, $asset);
    }

    public function item(Asset $asset)
    {
        return new AsseResource($asset);
    }

    public function delete(Asset $asset)
    {
        return $this->deleteCRUD($asset);
    }


}
