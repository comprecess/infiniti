<?php

namespace App\Http\Controllers\Api\Client;

use App\Http\Controllers\Controller;
use App\Http\Resources\Client\Document\DocumentResource;
use App\Http\Resources\Resident\Invoices\InvoiceListResource;
use App\Http\Resources\Resident\Invoices\OfferListResource;
use App\Http\Resources\Resident\Orders\OrderListClientResource;
use App\Http\Resources\Resident\Transactions\TransactionsListResource;
use App\Models\BusinessModel\BusinessModel;
use App\Models\Catalog\Cart;
use App\Models\Catalog\CartItem;
use App\Models\Catalog\User as Talent;
use App\Models\Config;
use App\Models\Resident\Invoices\Invoice;
use App\Models\Resident\Project\Project;
use App\Models\Resident\Project\Task;
use App\Models\Resident\Project\TaskTime;
use App\Models\User;
use App\Models\Users\Client;
use Illuminate\Support\Facades\Cache;


class DashboardController extends Controller
{

    public function index()
    {
        $user = User::getAuth();

        if($user->isType()) {
            $quantity = $this->getDataProjectSupplier($user);
        }else {
            $quantity = [
                'project' => $user->projects()->count(),
                'businessModel' => BusinessModel::count(),
                'businessPlan' => $user->myBusinessPlans()->count(),
                'talent' => Talent::active()->count()
            ];
        }

        $invoices = $user->invoices()->with(['getCurrencyIso', 'user', 'user.companyClient','user.group'])->orderByDesc('id')->limit(5)->get();
        $offers = $user->offers()->with(['getCurrencyIso', 'user', 'user.companyClient','user.group'])->orderByDesc('id')->limit(5)->get();
        $order = $user->orders()->with(['getCurrencyIso'])->orderByDesc('id')->limit(5)->get();
        $documents = $user->documents()->filesExists()->orderByDesc('sys_documents.id')->limit(5)->get();

        $hideExpense = Config::get('hide_expense_client');
        if($hideExpense) {
            $transactionQuery = $user->transactionPayer();
        }else{
            $transactionQuery = $user->transaction();
        }
        $transactions = $transactionQuery->orderByDesc('id')->limit(5)->get();

        $graph = [];
        $currency = $user->getCurrencyIso;
        $invoicesQuery = $user->invoices();
        foreach([
                    Invoice::STATUS[1] => [Invoice::STATUS[1]],
                    Invoice::STATUS[0] => [Invoice::STATUS[0], Invoice::STATUS[2]],
                ] as $name => $status) {

            $newQuery = $invoicesQuery->clone();
            $newQuery->whereIn('status', $status);

            $i = 12;
            $dateGraph = now();
            while ($i) {
                $start = $dateGraph->startOfMonth()->copy();
                $end = $dateGraph->endOfMonth()->copy();

                $graph[$start->format('m/d/Y')][$name] = $newQuery->clone()
                    ->where('date', '>=', $start)
                    ->where('date', '<=', $end)
                    ->get()
                    ->getSumTotal($currency);



                $dateGraph = $start->subMonths(1)->copy();
                $i--;
            }

        }

        return response()->json([
            'order' => OrderListClientResource::collection($order),
            'invoice' => InvoiceListResource::collection($invoices),
            'offer' => OfferListResource::collection($offers),
            'transaction' => TransactionsListResource::collection($transactions),
            'quantity' => $quantity,
            'graph' => $graph,
            'document' => DocumentResource::collection($documents),
        ]);
    }

    private function getDataProjectSupplier(Client $client)
    {
        $tasksQuery = Task::findByUser($client, true);

        $projects = Project::findByUser($client);
        $projectIds = $projects->pluck('id')->toArray();

        $cart = CartItem::select('catalog_cart_item.*')
            ->join('catalog_cart', 'catalog_cart.id', '=', 'catalog_cart_item.id_catalog_cart')
            ->join('catalog_cart_order','catalog_cart_order.id_catalog_cart', '=', 'catalog_cart.id')
            ->join('sys_invoices', function($join){
                $join->on('catalog_cart_order.model_id', '=','sys_invoices.id')
                    ->where('catalog_cart_order.model_type', Invoice::class);
            })
            ->whereIn('sys_invoices.pid', $projectIds)
            ->where('catalog_cart_item.id_catalog_user', $client->catalog_user_id)
            ->get();

        $time = TaskTime::whereIn('project_id', $projectIds)
            ->where('user_type', $client::class)
            ->where('user_id', $client->id)
            ->get();

        return [
            'tasksCount' => $tasksQuery->count(),
            'tasksCompletedCount' => $tasksQuery->whereIn('sys_tasks.status', Task::STATUS_COMPLETED)->count(),
            'hoursCount' => $cart->getHours()->sum(),
            'hoursWorkedCount' => $time->getHours(),
        ];
    }

}
