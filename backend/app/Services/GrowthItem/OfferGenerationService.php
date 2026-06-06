<?php

namespace App\Services\GrowthItem;

use App\Models\Config;
use App\Models\Resident\Invoices\Invoice;
use App\Models\Resident\Invoices\InvoiceItem;
use App\Models\Resident\Invoices\Offer;
use App\Models\Resident\Project\GrowthItem\ProjectGrowthItem;
use App\Models\Resident\Project\Project;
use App\Models\Resident\Settings\Currency;
use App\Models\User;
use App\Models\Users\Admin;
use Illuminate\Support\Facades\DB;

/**
 * OfferGenerationService — generates Offers and Invoices from Growth Items.
 *
 * Bridges the Growth Plan with the existing Sales module:
 * - Creates sys_quotes (Offer) from approved Growth Items
 * - Converts Offers to sys_invoices (Invoice) on acceptance
 *
 * Reuses existing Offer/Invoice models and their full lifecycle.
 */
class OfferGenerationService
{
    /**
     * Generate an Offer from a Growth Item.
     *
     * @param ProjectGrowthItem $item
     * @return Offer
     */
    public static function generateOffer(ProjectGrowthItem $item): Offer
    {
        return DB::transaction(function () use ($item) {
            $project = $item->project;
            $user = User::getAuth();
            $currency = Currency::getDefault();

            // Create the Offer
            $offer = new Offer();
            $offer->insertDefaultValue();

            $offer->subject = "[Growth Plan] {$item->title}";
            $offer->stage = Offer::STAGE[3]; // Draft
            $offer->datecreated = now();
            $offer->validuntil = now()->addDays(30);

            // Link to project owner (founder)
            if ($project->contact_id) {
                $client = \App\Models\Users\Client::find($project->contact_id);
                if ($client) {
                    $offer->userid = $client->id;
                    $offer->account = $client->account;
                }
            } else {
                $offer->userid = 0;
                $offer->account = '';
            }

            // Set financial data
            $offer->currency = $currency->id;
            $offer->currency_iso_code = $currency->iso_code;
            $offer->subtotal = $item->estimated_cost;
            $offer->discount = 0;
            $offer->total = $item->estimated_cost;
            $offer->check_public = 1;
            $offer->proposal = '';
            $offer->customernotes = '';
            $offer->adminnotes = "Auto-generated from Growth Item #{$item->id}";
            $offer->datesent = now();

            // Set code
            $offer->invoicenum = Config::get('offer_code_prefix', 'QUO-');
            $offer->cn = Offer::getNextNum();

            // Set creator
            if ($user instanceof Admin) {
                $offer->o = $user->id;
            }

            $offer->setRandomNum('vtoken', 10, true);
            $offer->save();

            // Create line item
            $lineItem = new InvoiceItem();
            $lineItem->insertDefaultValue();
            $lineItem->document()->associate($offer);
            $lineItem->invoiceid = $offer->id;
            $lineItem->userid = $offer->userid;
            $lineItem->description = self::buildOfferDescription($item);
            $lineItem->qty = 1;
            $lineItem->amount = $item->estimated_cost;
            $lineItem->total = $item->estimated_cost;
            $lineItem->currency_iso_code = $currency->iso_code;
            $lineItem->save();

            // Link offer to growth item
            $item->sys_offer_id = $offer->id;
            $item->save();

            return $offer;
        });
    }

    /**
     * Convert an Offer to an Invoice (reuses existing convert logic pattern).
     *
     * @param Offer $offer
     * @param ProjectGrowthItem|null $growthItem  If provided, links invoice to growth item
     * @return Invoice
     */
    public static function convertToInvoice(Offer $offer, ?ProjectGrowthItem $growthItem = null): Invoice
    {
        return DB::transaction(function () use ($offer, $growthItem) {
            $converColumn = [
                'userid', 'account', 'subtotal', 'discount_type', 'discount_value',
                'discount', 'total', 'tax1' => 'tax', 'taxname', 'taxrate', 'currency_iso_code'
            ];

            $date = now();
            $invoice = Invoice::newDefault();

            foreach ($converColumn as $key => $val) {
                $value = is_int($key) ? $offer->{$val} : $offer->{$key};
                $invoice->{$val} = $value;
            }

            $invoice->getCurrencyIso()->associate($offer->getCurrencyIso ?? Currency::getDefault());
            $invoice->date = $date;
            $invoice->duedate = $date->clone()->addDays(7);
            $invoice->nd = $date;

            $user = User::getAuth();
            $invoice->aid = ($user instanceof Admin) ? $user->id : 0;
            $invoice->quote_id = intval($offer->id);
            $invoice->invoicenum = Config::get('invoice_code_prefix', 'INV-');

            // Link to project if growth item provided
            if ($growthItem && $growthItem->project_id) {
                $invoice->pid = $growthItem->project_id;
            }

            $invoice->save();

            // Copy line items
            $offer->load('items');
            foreach ($offer->items as $item) {
                $newItem = $item->replicate();
                $newItem->document()->associate($invoice);
                $newItem->invoiceid = $invoice->id;
                $newItem->save();
            }

            // Update offer stage to Accepted
            $offer->stage = Offer::STAGE[0]; // Accepted
            $offer->dateaccepted = now();
            $offer->save();

            // Link invoice to growth item
            if ($growthItem) {
                $growthItem->sys_invoice_id = $invoice->id;
                $growthItem->save();
            }

            return $invoice;
        });
    }

    /**
     * Build a description for the offer line item.
     */
    protected static function buildOfferDescription(ProjectGrowthItem $item): string
    {
        $parts = [];
        $parts[] = $item->title;
        if ($item->description) {
            $parts[] = $item->description;
        }
        $parts[] = '';
        $parts[] = "Category: {$item->category}";
        $parts[] = "Duration: {$item->estimated_duration_days} days";
        $parts[] = "Confidence: {$item->confidence_percent}%";

        return implode("\n", $parts);
    }
}
