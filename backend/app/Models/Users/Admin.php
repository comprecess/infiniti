<?php

namespace App\Models\Users;

use App\Models\Contracts\InsertDefaultValueInterface;
use App\Models\Log;
use App\Models\Resident\Settings\Department;
use App\Models\Resident\Settings\Role;
use App\Models\Resident\Settings\RoleAccess;
use App\Models\Resident\Transactions\Transaction;
use App\Models\Traits\InsertDefaultValueTrait;
use App\Models\User;
use App\Models\Users\Interfaces\LoginIntarface;
use Illuminate\Database\Eloquent\SoftDeletes;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Cache;


class Admin extends User implements LoginIntarface, InsertDefaultValueInterface
{
    use InsertDefaultValueTrait, SoftDeletes;

    const NAME_DEPARTMENT = 'staff_departments';

    public $table = 'sys_users';

    protected $nameClass = 'Admin';

    protected $casts = [
        'last_login' => 'datetime',
        'date_hired' => 'date'
    ];

    protected $fillable = ['last_login'];

    public function getColumnLastTime()
    {
        return 'last_login';
    }

    public function getDefault() :array
    {
        return [
          'phonenumber' => [''],
          'last_login' => [now()],
          'creationdate' => [now()],
          'pin' => [''],
          'img' => [''],
          'otp' => ['No'],
          'pin_enabled' => ['No'],
          'api' => ['No'],
          'pwresetkey' => [''],
          'keyexpire' => [''],
          'address_line_1' => [''],
          'status' => ['Active'],
        ];
    }

    public function myRole()
    {
        return $this->belongsTo(Role::class, 'roleid');
    }

    public function transaction()
    {
        return $this->hasMany(Transaction::class, 'aid');
    }

    public function departments()
    {
        return $this->belongsToMany(Department::class, 'relations', 'source_id', 'target_id')
            ->wherePivot('type', self::NAME_DEPARTMENT);
    }

    public function login($username, $password)
    {
        $account = self::where('username', $username)
            ->first();

        return $this->isLogined($account, $password);
    }

    public function checkedPassword()
    {
        $lastLogin = $this->last_login;
        $this->last_login = now();

        if(request()->is('api/*')) {
            if(!$this->isLastTime(false) || !$this->api_token) {
                $this->setApiToken();
            }
        }

        $this->save();
        (new Log())->setUser($this)->writeLog(__('login.success'));
    }

    public function failPassword()
    {
        (new Log())->setUser($this)->writeLog(__('login.failed', ['name' => $this->username]));
    }


    public static function getForSelect()
    {
        return self::orderBy('fullname')->get();
    }

    public function hasAccessByRequest(Request $request, $getList = false)
    {
//        $cacheName = $request->url() . $this->id . $this->updated_at . ($getList ? 1 : 0);
        $role = $this->myRole;
//        $cacheName .= $role?->summAccess();
//
//        return Cache::remember($cacheName, config('cache.time.1week'), function() use($role, $request, $getList){
            if($role) {
                return $role->hasAccessByRequest($request, $getList);
            }
            return true;
//        });

    }


    public function checkAccess($access = 'all', mixed $shortNameOrClass = null)
    {
        $role = $this->myRole;

        if(!$role) {
            return true;
        }

        if($shortNameOrClass === null) {
            $shortNameOrClass = \request()->route()->getController();
        }

        $roleAccess = $role->checkAccess($shortNameOrClass);

        if($access) {
            return $roleAccess->{$access};
        }

        return $roleAccess;

    }

    public function getListAccess(array $listShortName, $mod = null, bool $setResult = false, $abort = false)
    {
        $role = $this->myRole;
        $typeAccess = [];
        $result = [];
        if($role) {
            $access = $role->access()->whereIn('shortname', $listShortName)->get();
            $access->each(function($item) use(&$typeAccess, &$result, $mod){
                if($mod && $item->{$mod} == 1) {
                    $result[] = $item->shortname;
                }
                foreach(RoleAccess::TYPE_ACCESS as $type) {
                    if(!$mod){
                        $result[$item->shortname][$type] = $item->{$type};
                    }
                    if(isset($typeAccess[$type])) {
                        $typeAccess[$type] = (bool) $typeAccess[$type] || (bool) $item->{$type};
                    }else{
                        $typeAccess[$type] = (bool) $item->{$type};
                    }

                    $typeAccess[$type] = (int) $typeAccess[$type];
                }
            });
        }else{
            foreach(RoleAccess::TYPE_ACCESS as $type) {
                $typeAccess[$type] = 1;
            }
            $result = array_values($listShortName);
        }
        if($setResult) {
            // save $typeAccess;
            request()->attributes->add(['main_access' => $typeAccess]);
        }


        if(!$result && $abort) {
            abort(403);
        }

        return $result;
    }

    public function isFullAdmin()
    {
        return $this->roleid == 0;
    }


}
