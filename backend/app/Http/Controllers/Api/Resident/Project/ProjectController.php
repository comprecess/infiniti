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

class ProjectController extends ProjectAccessController
{
    use CRUD {
        createOrUpdate as createOrUpdateCRUD;
        delete as deleteCRUD;
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
        $this->isPut = true;
        if(!$project->id) {
            $project = Project::newDefault();
        }
        return $this->createOrUpdateCRUD($request, $project);
    }

    public function delete(Project $project)
    {
        return $this->deleteCRUD($project);
    }

    public function view(Project $project)
    {
        $project->checkAccessAbort(self::ACCESS);
        $viewResponce = View::create($project);
        if($viewResponce === null) {
            abort(404);
        }

        return $viewResponce;
    }

    public function item(Project $project)
    {
        return new ProjectItemResource($project);
    }

}
