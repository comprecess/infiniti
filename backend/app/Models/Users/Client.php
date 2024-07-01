<?php

namespace App\Models\Users;

use App\Models\Cart;
use App\Models\Contracts\InsertDefaultValueInterface;
use App\Models\Log;
use App\Models\Traits\InsertDefaultValueTrait;
use App\Models\User;
use App\Models\Users\Interfaces\LoginIntarface;
use Carbon\Carbon;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Str;
use App\Models\Catalog\Cart as CatalogCart;

class Client extends User implements LoginIntarface, InsertDefaultValueInterface
{
    use InsertDefaultValueTrait;

    public $table = 'crm_accounts';

    protected $morphClass = 'Client';

    protected $nameClass = 'Client';

    public function checkCart()
    {
        $cookieCart = request()->cookie('ib_cart_secret');
        if($cookieCart) {
            $cart = Cart::where('secret', $cookieCart)->first();

            if($cart) {
                $cart->cid = $this->id;
                $cart->save();
            }
        }
    }

    public function login($username, $password)
    {
        $account = self::where('email', $username)
            ->orWhere('username', $username)
            ->orWhere('phone', $username)
            ->first();

        \Illuminate\Support\Facades\Log::alert('LOGININ ', ['login' => $username]);

        return $this->isLogined($account, $password);
    }

    public function checkedPassword()
    {
        $this->checkCart();

        $this->lastlogin = now();

        if(request()->is('api/*')) {
            $this->setApiToken();
        } else {
            Auth::guard('Client')->loginUsingId($this->id, true);
            $this->token = Str::random(20) . md5(time());
        }
        $this->save();
    }

    public function failPassword()
    {

    }

    public function getDefault(): array
    {
        return [
            'account' => ['', 'fullName'],
            'email' => [''],
            'password' => [''],
            'phone' => [''],
            'address' => [''],
            'city' => [''],
            'zip' => [''],
            'state' => [''],
            'country' => [''],
            'company' => [''],
            'signed_up_ip' => ['', 'ip'],
            'isp' => [''],
            'balance' => ['0.00'],
            'status' => ['Active'],
            'notes' => [''],
            'img' => [''],
            'web' => [''],
            'facebook' => [''],
            'google' => [''],
            'linkedin' => [''],
            'twitter' => [''],
            'skype' => [''],
            'cid' => [0]
        ];
    }

    public function myCart()
    {
        $time = Carbon::now()->subSeconds(CatalogCart::$timeForCart);
        return $this->hasOne(CatalogCart::class, 'id_client')->where('updated_at', '>', $time)->orderBy('id', 'DESC');
    }

    public function carts()
    {
        return $this->hasMany(CatalogCart::class, 'id_client')->where('updated_at', '>', $time)->orderBy('id', 'DESC');
    }
}
