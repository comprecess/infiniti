<?php

namespace App\Listeners\Project;

use App\Events\Invoice\InvoiceIsPay;
use App\Mail\Project\InviteSupplier;
use App\Models\Collection\Catalog\CartItemCollection;
use App\Models\Notification;
use App\Models\Resident\Project\Project;
use App\Models\Resident\Project\ProjectLog;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Queue\InteractsWithQueue;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Mail;
use function SpomkyLabs\Pki\ASN1\Component\length;

class ProjectFromBusinessPlan implements ShouldQueue
{
    /**
     * Create the event listener.
     */

    private $error = [];

    public function __construct()
    {
        //
    }

    /**
     * Handle the event.
     */
    public function handle(InvoiceIsPay $event): void
    {
        $invoice = $event?->invoice;
        $cart = $invoice?->orderCart?->first();

        if(!$cart->business_plan_id) {
            return;
        }

        DB::beginTransaction();
        try {
            $cartItemsQuery = $cart->items()->with(['userCatalog'])/*->get()*/
            ;
            $cartItemsQuery->select('catalog_cart_item.*')->join('catalog_user', function ($join) {
                $join->on('catalog_cart_item.id_catalog_user', '=', 'catalog_user.id')
                    ->whereNull('catalog_user.deleted_at');
            })->where('business_plan_id', $cart->business_plan_id);
            $cartItems = $cartItemsQuery->get();

            if (!$cartItems->count()) {
                return;
            }

            $businessPlan = $cart->businessPlan;

            $summary = strip_tags($businessPlan->ex_summary);
            if (strlen($summary) > 250) {
                $summary = substr($summary, 0, 250) . "...";
            }

            $project = new Project();
            $project->name = $businessPlan->company_name;
            $project->summary = $summary;
            $project->description = $businessPlan->description;
            $project->status = Project::STATUS[1];
            $project->billing_type = Project::TYPE[0];
            list($project->start_date, $project->due_date) = $this->startAndEndProject($cartItems);
            $project->currency = $invoice->currency_iso_code;
            $project->budget = $invoice->total;
            $project->contact_id = $invoice->userid;

            $project->save();

            $this->createUser($cartItems, $project);
            if ($this->error) {
                $project->refresh();
                $messgae = "Errors found while creating the project: " . implode('; ', $this->error);
                ProjectLog::create($project, ProjectLog::TYPE[12], $invoice->user, $this->error, $messgae);
            }
            $invoice->pid = $project->id;
            $invoice->save();
        }catch (\Exception $e) {
            \Illuminate\Support\Facades\Log::error($e->getMessage(), $e->getTrace());
            DB::rollBack();
        }

        DB::commit();
    }

    private function startAndEndProject(CartItemCollection $cartItems) :array
    {
        $start = now()->addDay();
        $days = $cartItems->getJobInDays();
        if(!$days->count()) {
            return [$start, null];
        }

        $days = $days->max();
        $days += ceil($days * 0.3);
        $days = intval($days);

        while($start->isWeekend()) {
            $start->addDay();
        }

        $end = $start->clone();
        while($days) {
            $end->addDay();

            if(!$end->isWeekend()) {
                $days--;
            }
        }

        return [$start, $end];
    }

    private function createUser(CartItemCollection $cartItems, Project $project)
    {
        foreach($cartItems as $item){
            $user = $item->userCatalog;
            if($user) {
                $supplier = $user->createSupplierClient();
                if($supplier) {
                    $project->setPersonal($supplier);
                    Mail::to($supplier)->send(new InviteSupplier($supplier, $project));
                    Notification::createMain(
                        user: $supplier,
                        model: $project,
                        message: __('notification.message.project.suppler-invite', ['link' => ""])
                    );
                }else{
                    $this->error[] = "Talent: {$user->name} not added, missing email";
                }
            }
        }
    }
}
