<?php


namespace App\Http\Controllers\Api\Resident\Settings;


use App\Http\Controllers\Api\Traits\CRUD;
use App\Http\Requests\Resident\Settings\AdminListRequest;
use App\Http\Resources\Resident\Settings\Admin\AdminListResource;
use App\Http\Resources\Resident\Settings\RoleResource;
use App\Models\Resident\Settings\Role;
use App\Models\Users\Admin;
use Illuminate\Support\Arr;

class AdminController extends SettingsController
{
    use CRUD {
        createOrUpdate as createOrUpdateCRUD;
    }

    public function list(AdminListRequest $request)
    {
        $query = Admin::query()
            ->select('sys_users.*')
            ->leftJoin('sys_roles', 'sys_roles.id', '=', 'sys_users.roleid')
            ->with(['myRole']);

        $requestAll = $request->all();

        if(($search = Arr::get($requestAll, 'filter.search')) !== null) {
            $query->where(function($q) use ($search){
                $search = "%" . $search . "%";
                $q->where('sys_users.id', 'like', $search)
                    ->orWhere('sys_users.username', 'like', $search)
                    ->orWhere('sys_users.fullname', 'like', $search)
                    ->orWhere('sys_users.phonenumber', 'like', $search)
                    ->orWhere('sys_users.city', 'like', $search)
                    ->orWhere('sys_users.state', 'like', $search)
                    ->orWhere('sys_users.country', 'like', $search)
                    ->orWhere('sys_users.zip', 'like', $search)
                    ->orWhere('sys_roles.rname', 'like', $search);
            });
        }

        $request->sortModel($query);

        return $this->index($query, AdminListResource::class, true);
    }

    public function inputData()
    {
        return response()->json([
            'role' => RoleResource::collection(Role::getForSelect())
        ]);
    }

    public function createOrUpdate(Admin $resident)
    {
        dd($resident);
    }

}
