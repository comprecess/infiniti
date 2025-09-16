<?php

namespace App\Http\Requests\Resident\BusinessPlan;

use App\Http\Requests\Resident\DocumentRequest;
use Illuminate\Support\Arr;


class BusinessPlanListRequest extends DocumentRequest
{
    public function sort() :array
    {
        return [
            'id' => 'app_business_plan.id',
            'account' => 'crm_accounts.account',
            'titleModel' => 'business_model.title',
        ];
    }

    public function filter($query)
    {
        $query->select('app_business_plan.*')
            ->leftJoin('business_model', 'business_model.id', '=', 'app_business_plan.business_model_id')
            ->leftJoin('crm_accounts', 'crm_accounts.id', '=', 'app_business_plan.cid');

        $requestAll = $this->all();

//        if($status = Arr::get($requestAll, 'filter.status')) {
//            $query->where('sys_invoices.status', $status);
//        }

        if(($search = Arr::get($requestAll, 'filter.search')) !== null) {
            $query->where(function($q) use ($search){
                $search = "%" . $search . "%";
                $q->where('app_business_plan.id', 'like', $search)
                    ->orWhere('app_business_plan.company_name', 'like', $search)
                    ->orWhere('app_business_plan.name', 'like', $search)
                    ->orWhere('app_business_plan.description', 'like', $search)
                    ->orWhere('business_model.title', 'like', $search)
                    ->orWhere('business_model.description', 'like', $search)
                    ->orWhere('crm_accounts.account', 'like', $search)
                    ->orWhere('crm_accounts.email', 'like', $search);
            });
        }

        $this->sortModel($query);
    }

}
