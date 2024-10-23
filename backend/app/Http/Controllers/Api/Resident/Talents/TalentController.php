<?php


namespace App\Http\Controllers\Api\Resident\Talents;


use App\Http\Controllers\Api\Traits\CRUD;
use App\Http\Requests\Resident\Talents\TalentListRequest;
use App\Http\Resources\Resident\Talents\TalentListResource;
use App\Models\Catalog\User;
use App\Models\Catalog\Value;
use Illuminate\Support\Arr;

class TalentController extends TalentsController
{
    use CRUD {
       createOrUpdate as createOrUpdateCRUD;
       delete as deleteCRUD;
    }

    public function list(TalentListRequest $request)
    {

        $query = User::query()
            ->distinct()
            ->select('catalog_user.*')
            ->leftJoin('crm_accounts', 'crm_accounts.id', '=', 'catalog_user.id_client')
            ->leftJoin('catalog_user_value', 'catalog_user_value.id_catalog_user', '=', 'catalog_user.id')
            ->leftJoin('catalog_prop_value', function($join){
                $join->on('catalog_prop_value.id', '=', 'catalog_user_value.cataloggable_id')
                    ->where('catalog_user_value.cataloggable_type', Value::class);
            })
            ->with(['user', 'values', 'values.prop']);

        $requestAll = $request->all();

        if(($search = Arr::get($requestAll, 'filter.search')) !== null) {
            $query->where(function($q) use ($search){
                $search = "%" . $search . "%";
                $q->where('catalog_prop_value.value', 'like', $search)
                    ->orWhere('crm_accounts.account', 'like', $search);
            });
        }
//        $query->checkAccess();

        $request->sortModel($query);

        return $this->index($query, TalentListResource::class, true);
    }

}
