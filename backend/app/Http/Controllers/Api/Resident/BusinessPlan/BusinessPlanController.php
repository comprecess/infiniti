<?php


namespace App\Http\Controllers\Api\Resident\BusinessPlan;


use App\Http\Controllers\Api\Traits\CRUD;
use App\Http\Requests\Resident\BusinessPlan\BusinessPlanCreateRequest;
use App\Http\Resources\Resident\BusinessPlan\BusinessPlanListResource;
use App\Http\Resources\Resident\BusinessPlan\BusinessPlanResource;
use App\Http\Resources\Resident\Talents\TalentResource;
use App\Models\Catalog\User;
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

    public function inputData()
    {
        $users = User::active()
            ->with(['files','values', 'values.prop', 'blockExperience'])
            ->get();
        $data['talents'] = TalentResource::collection($users);
    }

    public function createOrUpdate(BusinessPlan $plan, BusinessPlanCreateRequest $request)
    {
        return $this->createOrUpdateCRUD($request, $plan);
    }

    public function item(BusinessPlan $plan)
    {
        $plan->load(['teams', 'teams.files', 'teams.values', 'teams.values.prop', 'teams.blockExperience']);
        return new BusinessPlanResource($plan);
    }

    public function delete(BusinessPlan $plan)
    {
        return $this->deleteCRUD($plan);
    }

    public function team(Request $request, BusinessPlan $plan)
    {
        $user = User::findorFail((int) $request->route('id'));
        if($request->getMethod() == 'PUT') {
            $plan->teams()->attach($user->id);
        }else{
            $plan->teams()->detach([$user->id]);
        }

        return response()->json(['success' => true]);
    }
}
