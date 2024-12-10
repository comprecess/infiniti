<?php


namespace App\Http\Controllers\Api\Resident\BusinessPlan;


use App\Http\Controllers\Api\Traits\CRUD;
use App\Http\Requests\Resident\BusinessPlan\BusinessPlanCreateRequest;
use App\Http\Resources\Resident\BusinessPlan\BusinessPlanListResource;
use App\Http\Resources\Resident\BusinessPlan\BusinessPlanResource;
use App\Models\Resident\BusinessPlan;
use Illuminate\Http\Request;

class BusinessPlanController extends BusinessPlanAccessController
{
    use CRUD {
        createOrUpdate as createOrUpdateCRUD;
        delete as deleteCRUD;
    }

    public function list(Request $request)
    {
        $query = BusinessPlan::orderByDesc('id');

        return $this->index($query, BusinessPlanListResource::class);
    }

    public function createOrUpdate(BusinessPlan $plan, BusinessPlanCreateRequest $request)
    {
        return $this->createOrUpdateCRUD($request, $plan);
    }

    public function item(BusinessPlan $plan)
    {
        return new BusinessPlanResource($plan);
    }

    public function delete(BusinessPlan $plan)
    {
        return $this->deleteCRUD($plan);
    }
}
