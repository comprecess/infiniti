<?php


namespace App\Http\Controllers\Api\Client\Project;

use App\Http\Controllers\Api\Resident\Project\Traits\ProjectLogTrait;
use App\Http\Controllers\Api\Traits\CRUD;
use App\Http\Resources\Client\Project\ProjectListWorkerResource;
use App\Http\Resources\Resident\Project\ProjectListResource;
use App\Models\PersonalModel;
use App\Models\Resident\Project\Project;

class ProjectController
{
    use ProjectLogTrait, CRUD {
        createOrUpdate as createOrUpdateCRUD;
        delete as deleteCRUD;
    }

    const PROJECT = ['my', 'worker'];

    private function createQuery(callable $callable = null)
    {

        $query = Project::select()
            ->with([
            'admin',
            'admin.files',
            'admin.myRole',
            'manager',
            'manager.files',
            'manager.myRole',
            'client',
            'client.files',
            'client.companyClient',
            'getCurrencyIso',
            'transactionExpense',
            'transactionExpense.getCurrencyIso',
            'personalClients',
            'personalClients.user',
            'personalClients.user.files',
            'personalClients.user.companyClient',
            'personalAdmins',
            'personalAdmins.user',
            'personalAdmins.user.files',
            'personalAdmins.user.myRole',
        ])
            ->orderBy('id', 'desc')
            ->limit(100);

        if(is_callable($callable)) {
            $callable($query);
        }

        return $query;
    }

    private function checkUserProject(Project $project) :mixed
    {
        $client = auth()->user();

        if($project->isMy($client)) {
            return self::PROJECT[0];
        }

        $isWorker = Project::findByUser($client, true)->where('clx_projects.id', $project->id)->count();
        if($isWorker) {
            return self::PROJECT[1];
        }

        return false;
    }

    public function myProject()
    {
        $projectQuery = $this->createQuery(function($query){
            $client = auth()->user();
            $query->where('contact_id', $client->id);
        });

        return ProjectListResource::collection($projectQuery->get());
    }

    public function workProjects()
    {
        $projectQuery = $this->createQuery(function($query){
            $client = auth()->user();
            $objectIds = PersonalModel::where('user_type', $client::class)
                ->where('user_id', $client->id)
                ->where('model_type', Project::class)
                ->get()
                ->pluck('model_id')
                ->toArray();

            $query->whereIn('id', $objectIds);
        });

        return ProjectListWorkerResource::collection($projectQuery->get());
    }

    public function list()
    {
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
            ->with([
                'admin',
                'admin.files',
                'admin.myRole',
                'manager',
                'manager.files',
                'manager.myRole',
                'client',
                'client.files',
                'client.companyClient',
                'getCurrencyIso',
                'transactionExpense',
                'transactionExpense.getCurrencyIso',
                'personalClients',
                'personalClients.user',
                'personalClients.user.files',
                'personalClients.user.companyClient',
                'personalAdmins',
                'personalAdmins.user',
                'personalAdmins.user.files',
                'personalAdmins.user.myRole',
            ])
            ->orderBy('id', 'desc')
            ->limit(100);

        return ProjectListResource::collection($projectQuery->get());
    }

    public function view(Project $project)
    {
        $checkProject = $this->checkUserProject($project);
        if($checkProject === false) {
            abort(403);
        }

//        $viewResponce = View::create($project, ['checkProject' => $checkProject]);
//        if($viewResponce === null) {
//            abort(404);
//        }

        return $viewResponce;
    }

    public function item(Project $project)
    {
        $checkProject = $this->checkUserProject($project);
        if($checkProject === false) {
            abort(403);
        }

        return $checkProject == self::PROJECT[0] ? new ProjectListResource($project) : new ProjectListWorkerResource($project);
    }

}
