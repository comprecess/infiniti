<?php


namespace App\Http\Controllers\Api\Resident\Project;


use App\Http\Controllers\Api\Resident\Project\View\View;
use App\Http\Controllers\Api\Traits\CRUD;
use App\Http\Requests\Resident\Project\ProjectCreateRequest;
use App\Http\Resources\Resident\Client\ClientResource;
use App\Http\Resources\Resident\Project\ProjectItemResource;
use App\Http\Resources\Resident\Project\ProjectListResource;
use App\Http\Resources\Resident\Settings\CurrencyResource;
use App\Http\Resources\Users\AdminListResource;
use App\Models\Resident\Project\Project;
use App\Models\Resident\Settings\Currency;
use App\Models\Users\Admin;
use App\Models\Users\Client;
use Illuminate\Support\Facades\DB;

class ProjectController extends ProjectAccessController
{
    use CRUD {
        createOrUpdate as createOrUpdateCRUD;
        delete as deleteCRUD;
    }

    public function inputData()
    {
        $client = Client::hasType()->with(['files', 'companyClient', 'group'])->get();
        $supplier = Client::hasType(Client::TYPE[1])->with(['files', 'companyClient', 'group'])->get();
        $staff = Admin::all();
        $currency = Currency::all();

        return response()->json([
            'client' => ClientResource::collection($client),
            'supplier' => ClientResource::collection($supplier),
            'staff' => AdminListResource::collection($staff),
            'currency' => CurrencyResource::collection($currency),
            'status' => Project::STATUS,
            'type' => Project::TYPE
        ]);
    }

    public function list()
    {
//        $projectQuery = Project::checkAccess(...self::ACCESS);
        //access or manager
        $projectQuery = Project::select();
        $admin = auth()->user();
        if($admin->checkAccess(...self::ACCESS) === 0) {
            $projectQuery->where(function($query) use($admin){
                $project = new Project();
                $query->where($project->getTable() .'.' . $project->getAdminColumn(), $admin->id)
                    ->orWhere('project_manager_id', $admin->id);
            });
        }

        $projectQuery
            ->with(['admin.files', 'admin.myRole', 'getCurrencyIso', 'transactionExpense', 'transactionExpense.getCurrencyIso'])
            ->orderBy('id', 'desc')
            ->limit(100);

        return ProjectListResource::collection($projectQuery->get());
    }

    public function createOrUpdate(Project $project, ProjectCreateRequest $request)
    {
        $this->isPut = true;
        if(!$project->id) {
            $project = Project::newDefault();
        }
        return $this->createOrUpdateCRUD($request, $project, null, function($model, $request, $isNew){
            $admins = Admin::whereIn('id', $request->members)->get();
            $supplier = Client::whereIn('id', $request->supplier)->hasType(Client::TYPE[1])->get();
            $model->setPersonal($admins->merge($supplier));
        });
    }

    public function delete(Project $project)
    {
        return $this->deleteCRUD($project);
    }

    public function view(Project $project)
    {
//        $project->checkAccessAbort(...self::ACCESS);
        $admin = auth()->user();
        $projectNew = new Project();
        if(($admin->checkAccess(...self::ACCESS) === 0 && $admin->id != $project->{$projectNew->getAdminColumn()}) && $project->project_manager_id != $admin->id) {
            abort(403);
        }
        $viewResponce = View::create($project);
        if($viewResponce === null) {
            abort(404);
        }

        return $viewResponce;
    }

    public function item(Project $project)
    {
        $project->checkAccessAbort(...self::ACCESS);
        return new ProjectItemResource($project);
    }

}
