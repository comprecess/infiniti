<?php

namespace App\Models\Users;

use App\Models\Log;
use App\Models\User;
use App\Models\Users\Interfaces\LoginIntarface;


class Admin extends User implements LoginIntarface
{

    public $table = 'sys_users';

    protected $nameClass = 'Admin';


    public function login($username, $password)
    {
        $account = self::where('username', $username)
            ->first();

        return $this->isLogined($account, $password);
    }

    public function checkedPassword()
    {
        $this->last_login = now();

        if(request()->is('api/*')) {
            $this->setApiToken();
        }

        $this->save();
        (new Log())->setUser($this)->writeLog(__('login.success'));
    }

    public function failPassword()
    {
        (new Log())->setUser($this)->writeLog(__('login.failed', ['name' => $this->username]));
    }


}
