<?php

namespace App\Models;

// use Illuminate\Contracts\Auth\MustVerifyEmail;
use App\Events\UserIsAuthorized;
use App\Models\Traits\AuthPasswordTrait;
use App\Models\Traits\FileStorageTrait;
use App\Models\Users\Interfaces\LoginIntarface;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Str;
use Laravel\Sanctum\HasApiTokens;

class User extends Authenticatable
{
    use HasApiTokens, HasFactory, Notifiable, AuthPasswordTrait, FileStorageTrait;

    /**
     * The attributes that are mass assignable.
     *
     * @var array<int, string>
     */
    protected $fillable = [
        'fullname',
        'username',
        'password',
    ];

    protected $nameClass = 'User';

    /**
     * The attributes that should be hidden for serialization.
     *
     * @var array<int, string>
     */
    protected $hidden = [
        'password',
        'remember_token',
    ];

    /**
     * The attributes that should be cast.
     *
     * @var array<string, string>
     */
    protected $casts = [
        'email_verified_at' => 'datetime',
        'password' => 'hashed',
    ];

    public function getNameClass()
    {
        return $this->nameClass;
    }

    public function userCheckPassword($password)
    {
        if($this->checkPassword($password)) {
            $this->checkedPassword();
            return true;
        }else{
            $this->failPassword();
            return false;
        }
    }

    public static function getAuth()
    {
        foreach(config('auth.guards') as $guard => $data) {
            $user = Auth::guard($guard)->user();
            if($user) {
                return $user;
            }
        }

        return null;
    }

    public function isLogined(?LoginIntarface $user, $password)
    {
        if(!$user) {
            return false;
        }

        $checkPassword = $user->userCheckPassword($password);

        if($checkPassword) {
            event(new UserIsAuthorized($user));
            return $user;
        } else {
            return false;
        }
    }

    public function setApiToken()
    {
        $this->api_token = hash('sha256', Hash::make(Str::random(36)));
    }

    public function getAvatar($isLink = false)
    {
        return $this->getLastFile($isLink);
    }


}
