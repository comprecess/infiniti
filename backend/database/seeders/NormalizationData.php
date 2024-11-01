<?php

namespace Database\Seeders;

use App\Models\Resident\Invoices\Invoice;
use App\Models\Resident\Invoices\InvoiceItem;
use App\Models\Resident\Invoices\Offer;
use Database\Seeders\NormalizationData\ActivityIcon;
use Illuminate\Support\Facades\DB;


class NormalizationData extends Normalization
{
    protected $activityIcon = null;

    protected function isHas()
    {
        $this->activityIcon = new ActivityIcon();

        $this->has->set('activityIcon', $this->activityIcon->has());

        $this->has->set('invoiceItemDocument', InvoiceItem::where('document_type', '')->count() > 0);

        $this->has->set('invoiceItemDocumentOffer', DB::table('sys_quoteitems')->count() > InvoiceItem::where('document_type', Offer::class)->count());

        $this->has->set('roleTalents', DB::table('sys_permissions')->where('shortname', 'talent')->count() == 0);
    }

    protected function create()
    {
        $this->has->is('roleTalents', function(){
            DB::table('sys_permissions')->insert(['pname' => 'Talent', 'shortname' => 'talent', 'available' => 0, 'core' => 1]);
        });
    }

    protected function update()
    {
        $this->has->is('activityIcon', function(){
            $this->activityIcon->update();
        });

        $this->has->is('invoiceItemDocument', function(){
            $items = InvoiceItem::where('document_type', '')->get();
            $items->each(function($item){
                $class = Invoice::class;
                $id = $item->invoiceid;

                $item->document_type = $class;
                $item->document_id = $id;
                $item->save();
            });
        });

        $this->has->is('invoiceItemDocumentOffer', function(){
            DB::table('sys_quoteitems')->get()->each(function($item){
                $offer = Offer::find($item->qid);
                $invoiceItem = new InvoiceItem();
                $invoiceItem->insertDefaultValue();
                $invoiceItem->document_type = Offer::class;
                $invoiceItem->document_id = $item->qid;
                $invoiceItem->description = $item->description;
                $invoiceItem->qty = $item->qty;
                $invoiceItem->amount = $item->amount;
                $invoiceItem->total = $item->total;
                $invoiceItem->userid = $offer->userid;
                $invoiceItem->save();
            });
        });
    }

    protected function delete()
    {

    }
}
