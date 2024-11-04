<?php

namespace App\Models\Users;

use App\Models\Cart;
use App\Models\Contracts\InsertDefaultValueInterface;
use App\Models\Log;
use App\Models\Resident\Client\Activity;
use App\Models\Resident\Client\Company;
use App\Models\Resident\Client\Group;
use App\Models\Resident\Client\PasswordManager;
use App\Models\Resident\Document;
use App\Models\Resident\Invoices\Invoice;
use App\Models\Resident\Invoices\Offer;
use App\Models\Resident\Orders\Order;
use App\Models\Resident\Settings\CustomFields;
use App\Models\Resident\Settings\CustomFieldsValues;
use App\Models\Resident\Settings\EmailLog;
use App\Models\Resident\Transactions\Transaction;
use App\Models\Traits\CurrencyTrait;
use App\Models\Traits\HelperTrait;
use App\Models\Traits\InsertDefaultValueTrait;
use App\Models\Traits\TagsTrait;
use App\Models\Traits\UserTrait;
use App\Models\User;
use App\Models\Users\Interfaces\LoginIntarface;
use Carbon\Carbon;
use Illuminate\Database\Eloquent\SoftDeletes;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Str;
use App\Models\Catalog\Cart as CatalogCart;

class Client extends User implements LoginIntarface, InsertDefaultValueInterface
{
    use InsertDefaultValueTrait, HelperTrait, CurrencyTrait, TagsTrait, UserTrait, SoftDeletes;

    public $table = 'crm_accounts';

    protected $morphClass = 'Client';

    protected $nameClass = 'Client';

    const TYPE = [
        'Customer', 'Supplier'
    ];
    protected $fillable = [
        'lastlogin'
    ];

    protected $casts = [
        'lastlogin' => 'datetime',
    ];

    public function getColumnLastTime()
    {
        return 'lastlogin';
    }

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

    public function getCurrencyId()
    {
        return true;
    }

    public function setTypeAttribute($value)
    {
        $this->attributes['type'] = is_array($value) ? implode(',',$value) : $value;
    }

    public function getTypeAttribute($value)
    {
        return explode(',', $value);
    }

    public function group()
    {
        return $this->belongsTo(Group::class, 'gid');
    }

    public function companyClient()
    {
        return $this->belongsTo(Company::class, 'cid');
    }

    public function invoices()
    {
        return $this->hasMany(Invoice::class, 'userid')->with(['getCurrencyIso']);
    }

    #sys_quotes
    public function offers()
    {
        return $this->hasMany(Offer::class, 'userid');
    }

    public function orders()
    {
        return $this->hasMany(Order::class, 'cid');
    }

    public function emailLog()
    {
        return $this->hasMany(EmailLog::class, 'userid');
    }

    public function passwordManager()
    {
        return $this->hasMany(PasswordManager::class, 'client_id');
    }

    public function logs()
    {
        return $this->hasMany(Log::class, 'userid')
            ->where('type', $this->nameClass);
    }

    public function customFieldsValues()
    {
        return $this->belongsToMany(CustomFields::class, CustomFieldsValues::class, 'relid', 'fieldid')
            ->withPivot(['fvalue']);
    }

    public function documents()
    {
        return $this->belongsToMany(Document::class, 'ib_doc_rel', 'rid', 'did')
            ->withPivot(['rtype', 'can_download']);
    }

    public function activity()
    {
        return $this->hasMany(Activity::class, 'cid');
    }

    public function transaction()
    {

        $instance = $this->newRelatedInstance(Transaction::class);

        $query = $instance->newQuery()->where(function($q){
            $q->where('payerid', $this->attributes['id'])
                ->orWhere('payeeid', $this->attributes['id']);
        });

        return $this->newHasMany(
            $query, $this, null, null
        );
    }

    //Плательщик
    public function transactionPayer()
    {
        return $this->hasMany(Transaction::class, 'payerid');
    }

    //получатель платежа
    public function transactionPayee()
    {
        return $this->hasMany(Transaction::class, 'payeeid');
    }

    public function scopeHasType($query, $type = self::TYPE[0])
    {
        $query->where('type', 'like', "%{$type}%");
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
        $lastLogin = $this->lastlogin;
        $this->lastlogin = now();

        if(request()->is('api/*')) {
            if(!$this->isLastTime(false) || !$this->api_token) {
                $this->setApiToken();
            }
        } else {
            Auth::guard('Client')->loginUsingId($this->id, true);
            $this->token = Str::random(20) . md5(time());
        }
        $this->save();
    }

    public function failPassword()
    {
        (new Log())->setUser($this)->writeLog(__('login.failed', ['name' => $this->username]));
    }

    public function getDefault(): array
    {
        return [
            'account' => ['', 'fullName'],
            'email' => [''],
//            'password' => [rand(1, 999999)],
            'phone' => [''],
            'address' => [''],
            'city' => [''],
            'zip' => [''],
            'state' => [''],
            'country' => [''],
            'company' => [''],
            'signed_up_ip' => [null, 'ip'],
            'isp' => [request()->ip()],
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

//    public function myCart()
//    {
//        $time = Carbon::now()->subSeconds(CatalogCart::$timeForCart);
//        return $this->hasOne(CatalogCart::class, 'id_client')->where('updated_at', '>', $time)->orderBy('id', 'DESC');
//    }

    public function carts()
    {
        return $this->hasMany(CatalogCart::class, 'id_client')->where('updated_at', '>', $time)->orderBy('id', 'DESC');
    }

    public function getAutologin()
    {
        return $this->autologin ? route('autologin', [$this->autologin]) : null;
    }

    public function getCustomFieldsValues()
    {
        return CustomFields::select(['crm_customfields.*', 'crm_customfieldsvalues.fvalue as value'])
            ->leftJoin('crm_customfieldsvalues', function($join){
                $join->on('crm_customfieldsvalues.fieldid', '=', 'crm_customfields.id')->where('crm_customfieldsvalues.relid', $this->id);
            })
            ->get();
    }

    public static function getForSelect()
    {
        return self::checkAccess('all', 'customers')->orderBy('account')->with(['group', 'companyClient'])->get();
    }

    public function getFullAddress($line = PHP_EOL)
    {
        $format = '';
        foreach(['address', 'city', 'state', 'zip', 'country'] as $key => $prop) {
            $eol = $prop == 'state' || $key > 3 ? ' ' : $line;
            if($this->{$prop}) {
                $format .= $this->{$prop} . $eol;
            }
        }

        return $format;
    }
}
