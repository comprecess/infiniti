<?php


namespace App\Http\Controllers\Api\Resident\Transactions;


use App\Http\Controllers\Api\Traits\CRUD;
use App\Http\Requests\Resident\Transactions\AccountRequest;
use App\Http\Requests\Resident\Transactions\AssetCategoryCreateRequest;
use App\Http\Requests\Resident\Transactions\AssetCreateRequest;
use App\Http\Requests\Resident\Transactions\AssetListRequest;
use App\Http\Requests\Resident\Transactions\TransactionsListRequest;
use App\Http\Resources\Resident\Settings\CurrencyResource;
use App\Http\Resources\Resident\Transactions\AccountListResource;
use App\Http\Resources\Resident\Transactions\AccountResource;
use App\Http\Resources\Resident\Transactions\AsseResource;
use App\Http\Resources\Resident\Transactions\AssetCategoryTreeResource;
use App\Http\Resources\Resident\Transactions\AssetListResource;
use App\Http\Resources\Resident\Transactions\TransactionsListResource;
use App\Http\Resources\Users\AdminListResource;
use App\Models\Resident\Settings\Currency;
use App\Models\Resident\Transactions\Account;
use App\Models\Resident\Transactions\Asset;
use App\Models\Resident\Transactions\AssetCategory;
use App\Models\Resident\Transactions\Transaction;
use App\Models\User;
use App\Models\Users\Admin;
use App\Services\Document\DocumentVariables;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Arr;


class AssetController extends TransactionsAccessController
{
    use CRUD {
        createOrUpdate as createOrUpdateCRUD;
        delete as deleteCRUD;
    }

    const ACCESS = ['all', 'transactions'];

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

        if($search = Arr::get($data, 'filter.search')) {
            $search = "%{$search}%";
            $query->where(function($query) use($search){
                $query->where('id', $search)
                    ->orWhere('name', $search)
                    ->orWhere('serial', $search)
                    ->orWhere('notes', $search)
                    ->orWhere('price', $search);
            });
        }

        $request->sortModel($query);

        return $this->index($query, AssetListResource::class, true);
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
        return $this->delete($category);
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
