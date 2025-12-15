<?php


namespace App\Http\Controllers\Api\Client\Project;

use App\Http\Controllers\Api\Resident\Project\Traits\ProjectLogTrait;
use App\Http\Controllers\Api\Resident\Sale\InvoiceController;
use App\Http\Controllers\Api\Resident\Transactions\TransactionsController;
use App\Http\Controllers\Api\Traits\CRUD;
use App\Http\Requests\Resident\Invoices\InvoiceListRequest;
use App\Http\Requests\Resident\Project\View\FilesListRequest;
use App\Http\Requests\Resident\Transactions\TransactionsListRequest;
use App\Http\Resources\Client\Project\ProjectListWorkerResource;
use App\Http\Resources\Resident\Invoices\InvoiceListResource;
use App\Http\Resources\Resident\Project\View\LogResource;
use App\Http\Resources\Resident\Project\View\TaskGanttChartResource;
use App\Http\Resources\Resident\Project\View\TaskResource;
use App\Http\Resources\Resident\Project\View\TaskTimeResource;
use App\Http\Resources\Resident\Transactions\TransactionsListResource;
use App\Http\Resources\Resident\DocumentResource;
use App\Http\Resources\Resident\Project\ProjectListResource;
use App\Models\PersonalModel;
use App\Models\Resident\Project\Project;
use App\Models\Resident\Project\Task;
use App\Models\Resident\Transactions\Transaction;
use Illuminate\Http\Request;
use Illuminate\Support\Arr;

class ProjectController
{
    use ProjectLogTrait, CRUD {
        createOrUpdate as createOrUpdateCRUD;
        delete as deleteCRUD;
    }

    const PROJECT = ['my', 'worker'];
    protected $viewData = [];

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

    public function item(Project $project)
    {
        $checkProject = $this->checkUserProject($project);
        if($checkProject === false) {
            abort(403);
        }

        return $checkProject == self::PROJECT[0] ? new ProjectListResource($project) : new ProjectListWorkerResource($project);
    }

    private function checkMy()
    {
        if($this->viewData['checkProject'] != self::PROJECT[0]) {
            abort(404);
        }
    }

    private function getTask($project)
    {
        $id = Arr::get($this->viewData, 'path.0');
        if($id) {
            $query = $project->tasks()->where('id', $id);
            if(Arr::get($this->viewData, 'checkProject') == self::PROJECT[1]) {
                $client = auth()->user();
                $query->selectRaw('DISTINCT sys_tasks.*')
                    ->joinPersonal($client);
            }
            return $query->firstOrFail();
        }

        return null;
    }

    public function viewProcess(Request $request, Project $project)
    {
        $type = $request->route('type');
        $id = $request->route('id');
        $this->viewData['path'] = explode('/', $id);
        $this->viewData['checkProject'] = $this->checkUserProject($project);

        if($this->viewData['checkProject'] === false) {
            abort(403);
        }

        $prefix = ucfirst(strtolower($request->getMethod()));
        $method = $type . $prefix;
        if(!method_exists($this, $method)) {
            abort(404);
        }

        $result = $this->{$method}($project);
        if($result === true) {
            return response()->json(['success' => true]);
        }

        return $result;
    }

    public function viewGet($project)
    {
        return $this->viewData['checkProject'] == self::PROJECT[0] ? new ProjectListResource($project) : new ProjectListWorkerResource($project);
    }

    public function tasksGet($project)
    {
        $methodList = [
            'times' => 'tasksTimes',
            'logs' => 'tasksLogs'
        ];
        $id = Arr::get($this->viewData, 'path.0');
        $method = Arr::get($this->viewData, 'path.1');

        if($method) {
            if(isset($methodList[$method])) {
                return $this->{$methodList[$method]}($project);
            }else{
                abort(404);
            }
        }


        $checkProject = Arr::get($this->viewData, 'checkProject');
        $tasqQuery = $tasks = $project->tasks()
            ->with(['admin.files', 'admin.myRole', 'client.companyClient', 'client.files', 'personals', 'personals.user', 'personals.user.files']);

        if($checkProject == self::PROJECT[1]){
            $client = auth()->user();
            $tasqQuery->selectRaw('DISTINCT sys_tasks.*')
                ->joinPersonal($client);
        }

        if($id) {
            $tasqQuery->where('sys_tasks.id', $id);
        }

        $tasks = $tasqQuery->sort()->get();
        $group = $tasks->groupBy('status');

        $taskColumns = Task::getStatusColumn()->sortBy('sort');
        $data = [];

        foreach($taskColumns as $column) {
            $data[$column['title']] =  TaskResource::collection($group->get($column['title']) ?? []);
        }
        return ['data' => $data];
    }

    public function tasksTimes($project)
    {
        $task = $this->getTask($project);
        $times = $task->times()->with(['user', 'user.files'])->where('project_id', $project->id)->get();

        return TaskTimeResource::collection($times);
    }

    public function tasksLogs($project)
    {
        $task = $this->getTask($project);
        $queryLog = $task->log()->orderBy('id', 'desc')->with(['user', 'user.files']);
        return $this->index($queryLog, LogResource::class, true);
    }

    public function filesGet($project)
    {
        $request = app(FilesListRequest::class);
        $query = $project->documents()->filesExists();

        $request->searchModel($query);
        $request->sortModel($query);

        return $this->index($query, DocumentResource::class, true);
    }

    public function expensesGet($project)
    {
        $this->checkMy();
        $client = auth()->user();
        $query = $project->transactions()
            ->where('payerid', $client->id)
            ->orderByDesc('id');

        return $this->index($query, TransactionsListResource::class, true);
    }

    public function invoicesGet($project)
    {
        $this->checkMy();
        $client = auth()->user();
        $query = $project->invoices()
            ->where('userid', $client->id)
            ->orderByDesc('id');
        return $this->index($query, InvoiceListResource::class, true);
    }

    public function ganttChartGet()
    {
        $this->checkMy();
        $tasks = $this->model->tasks()
            ->with(['project'])
            ->sort();

        return $this->index($tasks, TaskGanttChartResource::class);
    }

}
