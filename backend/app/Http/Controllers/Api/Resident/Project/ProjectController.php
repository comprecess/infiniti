<?php


namespace App\Http\Controllers\Api\Resident\Project;


use App\Http\Controllers\Api\Traits\CRUD;
use App\Http\Requests\Resident\Project\ProjectCreateRequest;
use App\Http\Resources\Resident\Client\ClientResource;
use App\Http\Resources\Resident\Project\ProjectListResource;
use App\Http\Resources\Resident\Settings\CurrencyResource;
use App\Http\Resources\Users\AdminListResource;
use App\Models\Resident\Project\Project;
use App\Models\Resident\Settings\Currency;
use App\Models\Users\Admin;
use App\Models\Users\Client;

class ProjectController extends ProjectAccessController
{
    use CRUD {
        createOrUpdate as createOrUpdateCRUD;
    }

    public function inputData()
    {
        $client = Client::with(['files', 'companyClient', 'group'])->get();
        $staff = Admin::all();
        $currency = Currency::all();

        return response()->json([
            'client' => ClientResource::collection($client),
            'staff' => AdminListResource::collection($staff),
            'currency' => CurrencyResource::collection($currency),
            'status' => Project::STATUS,
            'type' => Project::TYPE
        ]);
    }

    public function list()
    {
        $projectQuery = Project::checkAccess(...self::ACCESS);
        $projectQuery
            ->with(['admin.files', 'admin.myRole'])
            ->orderBy('id', 'desc')
            ->limit(100);

        return ProjectListResource::collection($projectQuery->get());
    }

    public function createOrUpdate(Project $project, ProjectCreateRequest $request)
    {
        $this->isPud = true;
        if($project->id) {
            $project = Project::newDefault();
        }
        return $this->createOrUpdateCRUD($request, $project/*, function($model, $request){
            $model->members = $request->teamMember;
        }*/);
    }
/*
    public function transfer(TransferRequest $request)
    {
        $from = Transaction::newDefault();
        $to = Transaction::newDefault();
        return $this->createOrUpdateCRUD($request, $from, function($model, $request) use($to){
            if($request->tags) {
                $tagsString = implode(',',$request->tags);
                Tag::setTag(data: $request->tags, type: 'Transfer');
                $model->tags = $tagsString;
                $to->tags = $tagsString;
            }
            $faccount = $request->getModel('fromAccount');
            $taccount = $request->getModel('toAccount');
            $amount = $request->getAmount();
            $method = $request->getModel('payMethods');
            $currency = $request->getModel('currency');
            $user = User::getAuth();

            $model->account = $faccount->account;
            $model->account_id = $faccount->id;
            $model->type = Transaction::TYPE[2];
            $model->amount = $amount;
            $model->dr = $amount;
            $model->aid = $user->id;
            $model->currency_rate = $currency->rate;

            $to->account = $taccount->account;
            $to->account_id = $taccount->id;
            $to->type = Transaction::TYPE[3];
            $to->amount = $amount;
            $to->method = $method;
            $to->ref = $request->referralLink;
            $to->description = $request->description;
            $to->date = $request->date;
            $to->cr = $amount;
            $to->aid = $user->id;
            $to->currency_iso_code = $currency->iso_code;
            $to->currency = $currency->id;
            $to->currency_rate = $currency->rate;
            $to->save();
        });
    }

    public function bill(BillListRequest $request)
    {
        $days = 30;
        $today = now();

        $billsUpcomingQuery = Bill::whereBetween('next_date', [$today, (clone $today)->addDays($days)])
            ->with(['account', 'getCurrencyIso', 'client', 'category'])
            ->orderBy('next_date', 'asc');

        $billsPastDueQuery = Bill::whereBetween('next_date', [
            (clone $today)->subDays($days),
            $today,
        ])
            ->with(['account', 'getCurrencyIso', 'client', 'category'])
            ->orderBy('next_date', 'asc')
            ->where('is_paid', 0);

        if($search = Arr::get($request->all(), 'filter.search')){
            $billsUpcomingQuery->where(function($query) use($search){
                $query->where('id', 'like', "%{$search}%")
                    ->orWhere('title', 'like', "%{$search}%")
                    ->orWhere('website', 'like', "%{$search}%")
                ;
            });

            $billsPastDueQuery->where(function($query) use($search){
                $query->where('id', 'like', "%{$search}%")
                    ->orWhere('title', 'like', "%{$search}%")
                    ->orWhere('website', 'like', "%{$search}%")
                ;
            });
        }

        $with = ['getCurrencyIso', 'account', 'client','category'];
        $billsUpcomingQuery->with($with);
        $billsPastDueQuery->with($with);


        $bills_upcoming = $billsUpcomingQuery->get();
        $bills_past_due = $billsPastDueQuery->get();

        return response()->json(['billsUpcoming' => BillsResource::collection($bills_upcoming), 'billsPastDue' => BillsResource::collection($bills_past_due)]);
    }

    public function billAll(BillListRequest $request)
    {
        $bills = Bill::query();

        if($search = Arr::get($request->all(), 'filter.search')){
            $bills->where(function($query) use($search){
                $query->where('id', 'like', "%{$search}%")
                    ->orWhere('title', 'like', "%{$search}%")
                    ->orWhere('website', 'like', "%{$search}%")
                ;
            });
        }
        $bills->with(['getCurrencyIso', 'account', 'client','category']);
        $request->sortModel($bills);

        return $this->index($bills, BillsResource::class);
    }

    public function billItem(Bill $bill)
    {
        return new BillsResource($bill);
    }

    public function billCreateOrUpdate(BillCreateRequest $request, Bill $bill)
    {
        return $this->createOrUpdateCRUD($request, $bill);
    }

    public function billDelete(Bill $bill)
    {
        return $this->delete($bill);
    }

    public function billPaid(Bill $bill)
    {
        $bill->is_paid = 1;
        $bill->save();
        return $this->defResponse();
    }
*/


}
