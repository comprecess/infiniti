<?php


namespace App\Http\Controllers\Api\Resident\Settings;


use App\Http\Controllers\Api\Traits\CRUD;
use App\Http\Requests\Resident\Settings\AdminListRequest;
use App\Http\Requests\Resident\Settings\AdminRequest;
use App\Http\Requests\Resident\Settings\AdminUpdateRequest;
use App\Http\Resources\Resident\Settings\Admin\AdminListResource;
use App\Http\Resources\Resident\Settings\DepartmentResource;
use App\Http\Resources\Resident\Settings\RoleResource;
use App\Models\Resident\Settings\Department;
use App\Models\Resident\Settings\Role;
use App\Models\Users\Admin;
use App\Services\Tools\Countries;
use Illuminate\Support\Arr;

class AdminController extends SettingsController
{
    use CRUD {
        createOrUpdate as createOrUpdateCRUD;
        delete as deleteCRUD;
    }

    const PAY_FREQUENCY = ['Hourly', 'Monthly'];

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
            'role' => RoleResource::collection(Role::getForSelect()),
            'country' => Countries::list(),
            'payFrequency' => self::PAY_FREQUENCY,
            'department' => DepartmentResource::collection(Department::all()),
            'localization' => config('data.localization'),
        ]);
    }

    public function createOrUpdate(Admin $resident, AdminRequest $request)
    {

        return $this->createOrUpdateCRUD(
            $request,
            $resident,
            function($model, $request, $isNew){
                $role = Role::getForSelect()->where('id', $request->role)->first();
                if($request->password) {
                    $model->setNewPassword($request->password);
                }
                $model->roleid = $role->id;
                $model->role = $role->rname;

                if(!$isNew) {
                    $putList = [
                        'address',
                        'amount',
                    ];
                    $request->setModel($model, true, $putList);
                }

            },
            function ($model, $request, $isNew) {
                if($request->img && !$isNew) {
                    $model->uploads($request->img);
                }
            }
        );
    }

    public function item(Admin $resident)
    {
        return new AdminListResource($resident);
    }

    public function delete(Admin $resident)
    {
        return $this->deleteCRUD($resident);
    }

    public function update(Admin $resident, AdminUpdateRequest $request)
    {
        $request->setModel($resident, true);
        if($request->department) {
            if($resident->departments()->where('sys_ticketdepartments.id', $request->department)->count()){
                $resident->departments()->detach($request->department);
            }else{
                $resident->departments()->attach([
                    $request->department => [
                        'type' => Admin::NAME_DEPARTMENT,
                        'created_at' => now(),
                        'updated_at' => now(),
                    ]
                ]);
            }

        }

        return $this->defResponse();
    }


}
