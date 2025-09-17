<?php


namespace App\Http\Controllers\Api\Client\Business;


use App\Http\Controllers\Api\Traits\CRUD;
use App\Http\Controllers\Controller;
use App\Http\Resources\Resident\BusinessPlan\BusinessPlanListResource;
use App\Http\Resources\Resident\BusinessPlan\BusinessPlanResource;
use App\Models\Resident\BusinessPlan;
use Illuminate\Http\Request;

class BusinessPlanController extends Controller
{
    use CRUD;

    public function list(Request $request)
    {
        $userId = $request->user()->id;
        $query = BusinessPlan::where('cid', $userId)
            ->with(['client', 'client.files', 'businessModel', 'businessModel.values', 'businessModel.props', 'businessModel.values.prop']);


        return $this->index($query, BusinessPlanListResource::class);
    }

    public function item($id, Request $request)
    {
        $userId = $request->user()->id;
        $plan = BusinessPlan::where('id', $id)
            ->where('cid', $userId)
            ->with(['client', 'client.files', 'businessModel', 'businessModel.values', 'businessModel.props', 'businessModel.values.prop'])
            ->firstOrFail();
        return new BusinessPlanResource($plan);
    }

//    public function delete(BusinessPlan $plan)
//    {
//        return $this->deleteCRUD($plan);
//    }
}
