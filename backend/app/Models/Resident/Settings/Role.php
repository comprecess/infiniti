<?php

namespace App\Models\Resident\Settings;

use App\Models\Traits\BootTrait;
use App\Models\Users\Admin;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Http\Request;
use Illuminate\Support\Arr;
use Illuminate\Support\Facades\Cache;

class Role extends Model
{
    use HasFactory, BootTrait;

    const ACCESS_METHOD = [
          'view' => ['GET', 'HEADER'],
          'edit' => ['PUT'],
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

    public function hasAccess(Request $request, $getList = false)
    {
        $controllerList = Cache::remember('data.access', config('cache.time.1year'), function (){
            return config('data.access');
        });

        $method = $request->method();
        $class = $request->route()->getController();

        $type = collect(self::ACCESS_METHOD)->search(function($value) use($method){
            return array_search($method, $value) !== false;
        });


        $list = [$request->route()->getControllerClass()];
        $this->getParentClass($class, $list);

        $onlyController = Arr::where($controllerList, function($value) use($list){
           foreach($value as $classAccess) {
               if(array_search($classAccess, $list) !== false) {
                   return true;
               }
           }
        });

        $query = $this->access()->whereIn('shortname', array_keys($onlyController));

        if(method_exists($class, 'roleAccess')) {
            if(($result = $class->roleAccess($request, $getList)) !== null) {
                return $result;
            }
        }

        if($getList) {
            return $query->with(['permission'])->first();
        }

        $status = false;

        $query->each(function($item) use(&$status, $type){
            if($item->all || $item->{$type}) {
                $status = true;
            }
        });



        return $status;

    }

    private function getParentClass($class, &$list = [])
    {
        $name = get_parent_class($class);
        if($name === false) {
            return false;
        }
        $list[] = $name;
        $this->getParentClass($name, $list);
    }

}
