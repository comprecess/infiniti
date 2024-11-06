<?php

namespace App\Models\Resident\Invoices;

use App\Models\Catalog\Cart;
use App\Models\Collection\InvoiceItemCollection;
use App\Models\Contracts\InsertDefaultValueInterface;
use App\Models\Resident\Settings\Currency;
use App\Models\Traits\CurrencyTrait;
use App\Models\Traits\HelperTrait;
use App\Models\Traits\InsertDefaultValueTrait;
use App\Models\Users\Admin;
use App\Models\Users\Client;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Offer extends Model implements InsertDefaultValueInterface
{
    use HasFactory, CurrencyTrait, HelperTrait, InsertDefaultValueTrait;

    const STAGE = ['Accepted', 'Dead', 'Delivered', 'Draft', 'Lost'];

    public $currencyId = true;

    protected $table = "sys_quotes";

    public $timestamps = false;

    protected $casts = [
        'datecreated' => 'date',
        'validuntil' => 'date',
    ];

    public function getDefault(): array
    {
        return [
            'account' => [''],
            'firstname' => [''],
            'lastname' => [''],
            'companyname' => [''],
            'email' => [''],
            'address1' => [''],
            'address2' => [''],
            'city' => [''],
            'state' => [''],
            'postcode' => [''],
            'country' => [''],
            'phonenumber' => [''],
            'currency' => [0],
            'discount_type' => ['f'],
            'discount_value' => [0],
            'taxname' => [''],
            'taxrate' => [0],
            'tax1' => [0],
            'tax2' => [0],
            'adminnotes' => [''],
            'lastmodified' => [now()],
            'dateaccepted' => [now()],

        ];
    }

    public function getCode()
    {
        return $this->invoicenum . ($this->cn ?? $this->id);
    }

    public function user()
    {
        return $this->belongsTo(Client::class, 'userid');
    }

    public function items()
    {
        return $this->morphMany(InvoiceItem::class, 'document');
    }

    public static function createCart(Cart $cart)
    {
        $nextCode = self::getNextCode('CART');
        list($invoicenum, $cn) = explode('-', $nextCode);
        $date = now();
        $user = $cart->user;
        $accauntName = $user instanceof Admin ? $user->fullname : auth()->user()->fullname;
        #currency
        $currency = Currency::getDefault();


        $t = new self();
        $t->insertDefaultValue();
        $t->subject = __('resident.newCartOffer', ['id' => $nextCode]);
        $t->stage = self::STAGE[3];
        $t->validuntil = $date;
        $t->userid = 0;
        $t->invoicenum = $invoicenum . "-";
        $t->cn = $cn;
        $t->account = $accauntName;
        $t->currency = $currency->id;

        $t->subtotal = 0;
        $t->discount = 0;
        $t->total = 0;
        $t->proposal = '';
        $t->customernotes = '';
        $t->adminnotes = '';
        $t->datecreated = $date;
        $t->datesent = $date;
        $t->setRandomNum('vtoken', 10, true);

        $items = new InvoiceItemCollection();

        $cart->load(['items', 'items.userCatalog', 'items.userCatalog.values', 'items.userCatalog.values.prop']);
        foreach($cart->items as $item) {
            $userCatalog = $item->userCatalog;
            $newItem = new InvoiceItem();
            $newItem->insertDefaultValue();
            $newItem->userid = $userCatalog->id;
            $newItem->userid = $userCatalog->id;
            $newItem->description = view('block.cart-offer', compact('userCatalog', 'item'))->render();
            $newItem->qty = $item->amount;
            $newItem->amount = $item->price;
            $newItem->total = round($item->amount * $item->price, 2);
            if(!$item->taxes_include) {
                $tax = Cart::getTax();
                $taxamount = $tax?->getTaxPrice($newItem->total) ?? 0;
                $newItem->taxed = 1;
                $newItem->tax_rate = $tax?->rate ?? 0;
                $newItem->total += $taxamount;
                $newItem->taxamount = $taxamount;
            }

            $items->push($newItem);
        }
        $t->items = $items;

        return $t;
    }

}
