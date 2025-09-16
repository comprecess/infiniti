<?php


namespace App\Http\Controllers\Api\Resident\BusinessPlan;


use App\Http\Controllers\Api\Traits\CRUD;
use App\Http\Requests\Resident\BusinessPlan\BusinessPlanCreateRequest;
use App\Http\Requests\Resident\BusinessPlan\BusinessPlanListRequest;
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

    public function list(BusinessPlanListRequest $request)
    {
        $query = BusinessPlan::with(['client', 'client.files', 'businessModel', 'businessModel.values', 'businessModel.props', 'businessModel.values.prop']);
        $request->filter($query);

        return $this->index($query, BusinessPlanListResource::class, true);
    }

    public function inputData()
    {
        $users = User::active()
            ->with(['files','values', 'values.prop', 'blockExperience'])
            ->get();
        $data['talents'] = TalentResource::collection($users);

        return response()->json($data);
    }

    public function createOrUpdate(BusinessPlan $plan, BusinessPlanCreateRequest $request)
    {
        return $this->createOrUpdateCRUD($request, $plan, afterDataSet:function($model, $request){
            $model->teams()->sync($request->teams);

            if($request->file || $request->fileDelete) {
                $files = $model->files;
                if($request->file) {
                    $model->uploads($request->file);
                }

                $files->each(function($item){
                    $item->delete();
                });
            }
        });
    }

    public function item(BusinessPlan $plan)
    {
//        $plan->load(['teams', 'teams.files', 'teams.values', 'teams.values.prop', 'teams.blockExperience']);
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
