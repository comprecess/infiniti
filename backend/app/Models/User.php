<?php

namespace App\Models;

// use Illuminate\Contracts\Auth\MustVerifyEmail;
use App\Events\UserIsAuthorized;
use App\Models\Catalog\Cart as CatalogCart;
use App\Models\Resident\Project\Calendar;
use App\Models\Traits\AuthPasswordTrait;
use App\Models\Traits\FileStorageTrait;
use App\Models\Users\Admin;
use App\Models\Users\Interfaces\LoginIntarface;
use Carbon\Carbon;
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

    protected $authHours = 168;

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

    public function myCart()
    {
        $time = Carbon::now()->subSeconds(CatalogCart::$timeForCart);
        return $this->morphOne(CatalogCart::class, 'user')->where('catalog_cart.updated_at', '>', $time)->orderBy('catalog_cart.updated_at', 'DESC');
    }

    public function cart()
    {
        return $this->morphOne(CatalogCart::class, 'user');
    }

    public function notifications()
    {
        return $this->morphMany(Notification::class, 'user');
    }

    public function pushSubscriptions()
    {
        return $this->morphMany(Push::class, 'user');
    }

    public function pushSubscriptionsEnabled()
    {
        return $this->morphMany(Push::class, 'user')->where('enabled', 1);
    }

    public function settings()
    {
        return $this->morphMany(UserSettings::class, 'user');
    }

    public function calendar()
    {
        return $this->hasMany(Calendar::class, $this instanceof Admin ? 'aid' : 'cid');
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

    public function isLastTime($save = true) :bool
    {
        $nameColumn = $this->getColumnLastTime();
        $last = now()->subHours($this->authHours) < $this->{$nameColumn};
        if($last && $save) {
            $this->update([$nameColumn => now()]);
//            $this->{$nameColumn} = now();
//            $this->save();
        }
        return $last;
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

    public function getEmail()
    {
        if($this instanceof Admin) {
            return $this->username;
        }

        return $this->email;
    }

    public function getName()
    {
        if($this instanceof Admin) {
            return $this->fullname;
        }

        return $this->account;
    }


}
