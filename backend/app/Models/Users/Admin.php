<?php

namespace App\Models\Users;

use App\Models\Log;
use App\Models\Resident\Settings\Role;
use App\Models\Resident\Transactions\Transaction;
use App\Models\User;
use App\Models\Users\Interfaces\LoginIntarface;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Cache;


class Admin extends User implements LoginIntarface
{

    public $table = 'sys_users';

    protected $nameClass = 'Admin';

    protected $casts = [
        'last_login' => 'datetime',
    ];

    public function getColumnLastTime()
    {
        return 'last_login';
    }

    public function myRole()
    {
        return $this->belongsTo(Role::class, 'roleid');
    }

    public function transaction()
    {
        return $this->hasMany(Transaction::class, 'aid');
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
            if(!$this->isLastTime(false)) {
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
        $cacheName = $request->url() . $this->id . $this->updated_at . ($getList ? 1 : 0);
        $role = $this->myRole;
        $cacheName .= $role?->summAccess();

        return Cache::remember($cacheName, config('cache.time.1week'), function() use($role, $request, $getList){
            if($role) {
                return $role->hasAccessByRequest($request, $getList);
            }
            return true;
        });

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


}
