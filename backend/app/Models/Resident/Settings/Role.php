<?php

namespace App\Models\Resident\Settings;

use App\Models\Traits\BootTrait;
use App\Models\User;
use App\Models\Users\Admin;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Http\Request;
use Illuminate\Support\Arr;
use Illuminate\Support\Facades\Cache;
use Illuminate\Support\Facades\DB;

class Role extends Model
{
    use HasFactory, BootTrait;

    const ACCESS_METHOD = [
          'view' => ['GET', 'HEADER'],
          'edit' => ['PUT', 'PATCH'],
          'create' => ['POST'],
          'delete' => ['DELETE'],
    ];

    protected $table = 'sys_roles';

    public $timestamps = false;

    public static function deletedEvent($item)
    {
        $item->access()->delete();
        $item->residents?->each(function($user){
           $user->roleid = 0;
           $user->save();
        });
    }

    public function access()
    {
        return $this->hasMany(RoleAccess::class, 'rid');
    }

    public function residents()
    {
        return $this->hasMany(Admin::class, 'roleid');
    }

    public function summAccess()
    {
//        $summ = $this->access()->select(DB::raw('CONCAT(SUM(can_view), SUM(can_edit), SUM(all_data), SUM(can_create), SUM(can_delete)) as summ'))->first();
        $summ = $this->access()->select(DB::raw("GROUP_CONCAT(CONCAT(CONV(CONCAT(can_view, can_edit, all_data, can_create, can_delete), 2, 10),'_', id) SEPARATOR '.') as summ"))
            ->groupBy('rid')
            ->first();
        return $summ->summ;
    }

    public function hasAccessByRequest(Request $request, $getList = false)
    {

        $method = $request->method();
        $class = $request->route()->getController();

        $type = collect(self::ACCESS_METHOD)->search(function($value) use($method){
            return array_search($method, $value) !== false;
        });

        //system
        if(method_exists($class, 'roleAccess')) {
            if(($result = $class->roleAccess($request, $getList)) !== null) {
                return $result;
//                return RoleAccess::systemAccess($result);
            }
        }

        $list = $this->getParentClass($class);
        $shortnameController = $this->getListAccess($list);


//        $query = $this->access()->whereIn('shortname', array_keys($shortnameController));
//
//        if($getList) {
//
//            return $query->with(['permission'])->first();
//        }
//
//        $status = false;
//
//        $query->each(function($item) use(&$status, $type){
//            if($item->{$type}) {
//                $status = true;
//            }
//        });
//
//        return $status;


        foreach(array_keys($shortnameController) as $shortname) {
            $query = $this->access()->where('shortname', $shortname);
            if($getList) {
                return $query->with(['permission'])->first();
            }

            if($query->count()) {
                $status = false;
                $query->each(function($item) use(&$status, $type){
                    if($item->{$type}) {
                        $status = true;
                    }
                });
                return $status;
            }
        }

        return false;
    }

    private function getListAccess(array $classController) :array
    {
        $controllerList = Cache::remember('data.access', config('cache.time.1year'), function (){
            return config('data.access');
        });

        //        return Arr::where($controllerList, function($value) use($classController){
//            foreach($value as $classAccess) {
//                if(array_search($classAccess, $classController) !== false) {
//                    return true;
//                }
//            }
//        });
        $filter = [];
        Arr::where($classController, function($value) use($controllerList, &$filter){
            foreach($controllerList as $key => $classAccess) {
                if(array_search($value, $classAccess) !== false) {
                    $filter[$key] = $classAccess;
                    return true;
                }
            }
        });
        return $filter;
    }

    public static function getAccessType()
    {
        $method = request()->method();

        return collect(self::ACCESS_METHOD)->search(function($value) use($method){
            return array_search($method, $value) !== false;
        });
    }

//    private function getParentClass($class, &$list = [])
//    {
//        $name = get_parent_class($class);
//        if($name === false) {
//            return false;
//        }
//        $list[] = $name;
//        $this->getParentClass($name, $list);
//    }

    private function getParentClass($class, &$list = [])
    {
        $list[] = is_object($class) ? get_class($class) : $class;
        $name = get_parent_class($class);
        if($name === false) {
            return false;
        }
        $this->getParentClass($name, $list);
        return $list;
    }

    public function checkAccess($nameOrClass) :RoleAccess
    {
        $query = $this->access();
        if(is_object($nameOrClass)) {
            $list = $this->getParentClass($nameOrClass);
            $shortnameController = $this->getListAccess($list);
            if($shortnameController) {
                $query->whereIn('shortname', array_keys($shortnameController));
            }else{
                if(method_exists($nameOrClass, 'roleAccess')) {
                    if(($result = $nameOrClass->roleAccess(\request())) !== null) {
                        return RoleAccess::systemAccess($result);
                    }
                }
                return RoleAccess::systemAccess(false);
            }
        } else {
            $query->where('shortname', $nameOrClass);
        }

        return $query->first();

    }

    public function getRoleAccess()
    {
        $data = [];
        $this->access->each(function($item) use(&$data){
            $access = [];
            foreach(RoleAccess::TYPE_ACCESS as $name) {
                $access[$name] = $item->{$name};
            }
            $data[$item->shortname] = $access;
        });

        return $data;
    }

    public static function getForSelect()
    {
        $collect = collect([]);
        $admin = new self();
        $admin->rname = __('resident.fullAdministrator');
        $admin->id = 0;
        $collect->push($admin);
        self::orderBy('rname')->get()->each(function($item) use($collect){
            $collect->push($item);
        });

        return $collect;
    }

    public function setNew()
    {
        $access = $this->access;
        RolePermission::whereNotIn('id', $access->pluck('pid'))->each(function($item){
            $roleAccess = new RoleAccess();
            $roleAccess->rid = $this->id;
            $roleAccess->pid = $item->id;
            $roleAccess->shortname = $item->shortname;
            $roleAccess->save();
        });
    }

    public static function setAccessResponse($data)
    {
        $typeAccess = [];
        foreach(RoleAccess::TYPE_ACCESS as $type) {
            if(!isset($data[$type])) {
                return false;
            }
            $typeAccess[$type] =(int) ((bool) is_array($data) ? $data[$type] : $data->{$type});
        }

        request()->attributes->add(['main_access' => $typeAccess]);
    }

}
