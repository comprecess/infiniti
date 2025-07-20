<?php


namespace App\Http\Controllers\Api\Resident\Talents;


use App\Contracts\FilterContract;
use App\Events\Resident\Talents\DeleteTalent;
use App\Http\Controllers\Api\Traits\CRUD;
use App\Http\Requests\Catalog\ListRequest;
use App\Http\Requests\Resident\Talents\CartListRequest;
use App\Http\Requests\Resident\Talents\CartRequest;
use App\Http\Requests\Resident\Talents\TalentUpdateRequest;
use App\Http\Requests\Resident\Talents\BlockExperienceTalentRequest;
use App\Http\Requests\Resident\Talents\TalentCreateRequest;
use App\Http\Requests\Resident\Talents\TalentListRequest;
use App\Http\Resources\Catalog\PropertyResorce;
use App\Http\Resources\Catalog\UsersResorce;
use App\Http\Resources\Catalog\ValueResorce;
use App\Http\Resources\Resident\Client\ClientResource;
use App\Http\Resources\Resident\Talents\CartListResource;
use App\Http\Resources\Resident\Talents\TalentExcelResource;
use App\Http\Resources\Resident\Talents\TalentListResource;
use App\Http\Resources\Resident\Talents\TalentPdfResource;
use App\Http\Resources\Resident\Talents\TalentResource;
use App\Http\Resources\UserResource;
use App\Models\Catalog\Cart;
use App\Models\Catalog\CartItem;
use App\Models\Catalog\Prop;
use App\Models\Catalog\User;
use App\Models\Catalog\UserBlock;
use App\Models\Catalog\UserValue;
use App\Models\Catalog\Value;
use App\Models\Users\Admin;
use App\Models\Users\Client;
use App\Services\Document\DocumentVariables;
use Illuminate\Http\Request;
use Illuminate\Support\Arr;
use Illuminate\Validation\ValidationException;
use PhpOffice\PhpSpreadsheet\Worksheet\Drawing;

class TalentController extends TalentsController
{
    use CRUD {
       createOrUpdate as createOrUpdateCRUD;
       delete as deleteCRUD;
    }

    public function roleAccess($request)
    {
        if($request->getMethod() == "DELETE" && strpos($request->getUri(), 'resident/talent/cart') !== false && $request->route('cart')?->id == auth()->user()->myCart?->id) {
            return true;
        }
        return null;
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

        $request->sortModel($query);

        return $this->index($query, TalentListResource::class, true);
    }

    public function listCatalogPublic(ListRequest $request, FilterContract $filter)
    {
        $queryBuild = User::select(['catalog_user.*'])
            ->distinct()
            ->with(['blockExperience', 'values', 'props', 'values.prop']);

        if($request->filter) {
            $filter->properties($request->filter, $queryBuild);
        }

        $sort = $request->getSort();

        $prop = Prop::where('id_name', $sort)->first();
        if($prop) {

            $beforeQuerySort =  Value::selectRaw('catalog_user_value.id_catalog_user, catalog_prop_value.value * 1 as value')
                ->leftJoin('catalog_user_value', function($join){
                    $join->on('catalog_user_value.cataloggable_id', '=', 'catalog_prop_value.id')
                        ->where('catalog_user_value.cataloggable_type', '=', Value::class);
                })
                ->where('catalog_prop_value.id_prop', $prop->id)
                ->where('catalog_user_value.cataloggable_type', '=', Value::class);


            $queryBuild->addSelect(['sortValue.value'])
                ->leftJoinSub($beforeQuerySort, 'sortValue', function($join){
                    $join->on('sortValue.id_catalog_user', '=', 'catalog_user.id');
                })
                ->orderBy('sortValue.value', $request->getSort(true));
        }

        $resultQuery = $queryBuild->paginate($request->getAmount());

        $cart = \App\Models\User::getAuth()->myCart;
        if($cart) {
            $items = $cart->items;
            $resultQuery->each(function ($item) use($items) {
                $item->inCart = $items?->where('id_catalog_user', $item->id)->count();
            });
        }

        return UsersResorce::collection($resultQuery);
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

                if(Arr::get($data, 'rate')) {
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
        event(new DeleteTalent($user));
        return $this->deleteCRUD($user);
    }

    public function update(TalentUpdateRequest $request, User $user)
    {
        if($request->file) {
            $user->files()->whereNull('data')->get()->each(function($item){
                $item->delete();
            });
            $user->uploads($request->file);
        }

        if($request->deleteImg) {
            $user->files()->whereNull('data')->get()->each(function($item){
                $item->delete();
            });
        }

        return $this->defResponse();
    }

    public function cartList(CartListRequest $request)
    {
        $requestAll = $request->all();
        $typeRequest = CartListRequest::TYPE;
        $user = auth()->user();

        $type = Arr::get($requestAll, 'filter.type', $typeRequest[0]);

        switch ($type) {
            case $typeRequest[0]: $query = $user->myCart()->reorder(); break;
            case $typeRequest[1]: $query = $user->cart(); break;
            case $typeRequest[2]:
                if(!$user->checkAccess()) {
                    abort(403);
                }
                $query = Cart::query();
            break;
        }

        $query->select(['catalog_cart.*']);



        $query->leftJoin('crm_accounts', function($join){
            $join->on('crm_accounts.id', '=', 'catalog_cart.user_id')
                ->where('catalog_cart.user_type', Client::class);
        })->leftJoin('sys_users', function($join){
            $join->on('sys_users.id', '=', 'catalog_cart.user_id')
                ->where('catalog_cart.user_type', Admin::class);
        });

        if(($search = Arr::get($requestAll, 'filter.search')) !== null) {
            $search = "%" . $search . "%";
            $prop = Prop::where('id_name', 'specialization')->get();


            $serchCatalog = CartItem::/*leftJoin('catalog_user', 'catalog_user.id', '=', 'catalog_cart_item.id_catalog_user')
                ->*/leftJoin('catalog_user_value', 'catalog_user_value.id_catalog_user', '=', 'catalog_cart_item.id_catalog_user')
                ->leftJoin('catalog_prop_value', function($join){
                    $join->on('catalog_prop_value.id', '=', 'catalog_user_value.cataloggable_id')
                        ->where('catalog_user_value.cataloggable_type', Value::class);
                })
            ->whereIn('catalog_prop_value.id_prop', $prop->pluck('id'))
            ->where('catalog_prop_value.value', 'like', $search)
            ->get();

            $query->where(function($q) use ($search, $serchCatalog){
                $q->where('crm_accounts.account', 'like', $search)
                    ->orWhere('sys_users.fullname', 'like', $search);

                if($serchCatalog->count()) {
                    $q->orWhereIn('catalog_cart.id', $serchCatalog->pluck('id_catalog_cart'));
                }
            });
        }

        $request->sortModel($query);

        $query->with(['items', 'items.userCatalog', 'items.userCatalog.values']);

        #проверка ну удаление талантов и пустоту корзины
        $query->whereRaw("(SELECT COUNT(*) FROM `catalog_cart_item` JOIN `catalog_user` ON `catalog_user`.`id` = `catalog_cart_item`.`id_catalog_user` WHERE catalog_cart_item.id_catalog_cart = catalog_cart.id AND `catalog_user`.`deleted_at` IS NULL) > 0");


        return $this->index($query, CartListResource::class, true);
    }

    public function cartItem(Cart $cart)
    {
        $user = auth()->user();
        $userCart = $cart->user;
        if($userCart->id != $user->id && !$user->checkAccess()) {
            abort(403);
        }
        $cart->load(['itemsActive', 'items.userCatalog', 'user', 'items.userCatalog.values']);

        return new CartListResource($cart);
    }

    public function cartItemUpdate(Cart $cart, CartItem $item, CartRequest $request)
    {

        $request->setModel($item, true);
        $item->save();

        $cart->calculation();
        return $this->defResponse();
    }

    public function cartItemDelete(Cart $cart, CartItem $item)
    {
        $item->delete();

        $cart->calculation();
        return $this->defResponse();
    }

}
