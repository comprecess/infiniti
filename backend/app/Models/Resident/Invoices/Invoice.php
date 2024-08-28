<?php

namespace App\Models\Resident\Invoices;

use App\Models\Collection\InvoiceCollection;
use App\Models\Traits\CollectionTrait;
use App\Models\Traits\CurrencyTrait;
use App\Models\Users\Client;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Arr;

class Invoice extends Model
{
    use HasFactory, CurrencyTrait, CollectionTrait;

    const STATUS = [
        'Unpaid', 'Paid', 'Partially Paid', 'Cancelled'
    ];

    protected $table = "sys_invoices";

    public $collection = InvoiceCollection::class;

    protected $casts = [
      'date' => 'date',
      'duedate' => 'date',
    ];

    public function getCode()
    {
        return $this->invoicenum . ($this->cn ? $this->cn : $this->id);
    }

    public function user()
    {
        return $this->belongsTo(Client::class, 'userid');
    }

    public static function smallStat(callable $where = null, $round = 1)
    {
        $result = [];

        foreach(self::STATUS as $key => $status) {
            $invoice = self::where('status', $status);
            if(is_callable($where)) {
                $where($invoice);
            }
            $data = [
                'status' => $status,
                'build' => clone $invoice,
                'count' => $invoice->count(),
            ];

            $result[$key] = $data;
        }

        $summ = array_sum(Arr::pluck($result, 'count'));

        foreach($result as &$data) {
            $data['percentage'] = $data['count'] ? round(($data['count'] / $summ) * 100, $round) : 0 ;
        }
        return $result;
    }
}
