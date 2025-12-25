<?php


namespace App\Http\Controllers\Api\Resident\BusinessPlan;


use App\Http\Controllers\Api\Traits\CRUD;
use App\Http\Requests\Resident\BusinessPlan\BusinessPlanCreateRequest;
use App\Http\Requests\Resident\BusinessPlan\BusinessPlanListRequest;
use App\Http\Resources\Resident\BusinessPlan\BusinessPlanDocumentExcelResource;
use App\Http\Resources\Resident\BusinessPlan\BusinessPlanDocumentResource;
use App\Http\Resources\Resident\BusinessPlan\BusinessPlanListResource;
use App\Http\Resources\Resident\BusinessPlan\BusinessPlanResource;
use App\Http\Resources\Resident\Talents\TalentResource;
use App\Models\Catalog\User;
use App\Models\Resident\BusinessPlan;
use App\Services\Document\DocumentVariables;
use Illuminate\Database\QueryException;
use Illuminate\Http\Request;
use PhpOffice\PhpSpreadsheet\Worksheet\Drawing;

class BusinessPlanController extends BusinessPlanAccessController
{
    use CRUD {
        createOrUpdate as createOrUpdateCRUD;
        delete as deleteCRUD;
    }

    public function getDocumentVariables(): DocumentVariables
    {
        $columns = [
            'img' => 'Image',
            'account' => 'Name',
            'model' => 'Business Model',
            'company' => 'Business Plan',
        ];

        $varibles = new DocumentVariables();

        $varibles->nameDocument = "Business Plan";
        $varibles->header = "Business Plan - Infiniti";

        $varibles->columns = $columns;
        $varibles->excelView = 'document.excel.business-plan';
        $varibles->excelFilesCollable = function ($query){
            $images = [];

            foreach($query as $key => $value) {
                if($path = $value->client?->getLastFile()?->getFile()?->getRealPath()) {
                    $drawing = new Drawing();
                    $drawing->setPath($path);
                    $drawing->setHeight(50);
                    $drawing->setCoordinates("A" . ($key + 2));
                    $images[] = $drawing;
                }
            }

            return $images;
        };
        $varibles->resource = request()->input('document') == 'pdf' ? BusinessPlanDocumentResource::class : BusinessPlanDocumentExcelResource::class;


        return $varibles;
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
        $plan->load(['client', 'client.files', 'businessModel', 'businessModel.values', 'businessModel.props', 'businessModel.values.prop']);
        return new BusinessPlanResource($plan);
    }

    public function delete(BusinessPlan $plan)
    {
        try {
            return $this->deleteCRUD($plan);
        }catch (QueryException $e) {
            if($e->getCode() == 23000) {
                return response()->json([
                    'access' => 'false',
                    'message' => 'The linking element cannot be deleted.'
                ],405);
            }
        }
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
