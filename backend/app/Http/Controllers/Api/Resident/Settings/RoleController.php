<?php


namespace App\Http\Controllers\Api\Resident\Settings;


use App\Http\Controllers\Api\Traits\CRUD;
use App\Http\Requests\Resident\Settings\RoleRequest;
use App\Http\Resources\Resident\Settings\RolePermissionResource;
use App\Http\Resources\Resident\Settings\RoleResource;
use App\Models\Resident\Settings\Role;
use App\Models\Resident\Settings\RoleAccess;
use App\Models\Resident\Settings\RolePermission;
use Illuminate\Http\Request;

class RoleController extends SettingsController
{
    use CRUD{
        createOrUpdate as createOrUpdateCRUD;
        delete as deleteCRUD;
    }


    public function list(Request $request)
    {
        $roles = Role::with(['access', 'access.permission'])->orderBy('id', 'desc');
        return $this->index($roles, RoleResource::class);
    }

    public function inputData()
    {
        return [
            'permission' => RolePermissionResource::collection(RolePermission::all())
        ];
    }

    public function createOrUpdate(RoleRequest $request, Role $role)
    {
        return $this->createOrUpdateCRUD($request, $role, null, function($model, $request, $isNew){
                RolePermission::all()->each(function($item) use($request, $model, $isNew){
                    $requestData = $request->getPermission($item->id);

                    $access = null;
                    if(!$isNew) {
                        $access = $item->access()->where('rid', $model->id)->first();
                    }

                    if(!$access) {
                        $access = new RoleAccess();
                        $access->rid = $model->id;
                        $access->pid = $item->id;
                        $access->shortname = $item->shortname;
                    }

                    foreach(RoleRequest::TYPE_ACCESS as $value) {
                        $access->{$value} = $requestData ? $requestData[$value] : 0;
                    }

                    $access->save();

                });
        });
    }

    public function item(Role $role)
    {
        return new RoleResource($role);
    }

    public function delete(Role $role)
    {
        return $this->deleteCRUD($role);
    }

}
