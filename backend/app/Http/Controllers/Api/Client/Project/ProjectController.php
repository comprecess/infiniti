<?php


namespace App\Http\Controllers\Api\Client\Project;

use App\Http\Controllers\Api\Resident\DocumentController;
use App\Http\Controllers\Api\Resident\Project\Traits\ProjectLogTrait;
use App\Http\Controllers\Api\Resident\Task\TaskController;
use App\Http\Controllers\Api\Traits\CRUD;
use App\Http\Requests\Resident\DocumentFileCreateRequest;
use App\Http\Requests\Resident\Project\ProjectCreateRequest;
use App\Http\Requests\Resident\Project\View\AddTimeRequest;
use App\Http\Requests\Resident\Project\View\FilesListRequest;
use App\Http\Requests\Resident\Task\TaskCreateRequest;
use App\Http\Requests\Resident\Task\TaskUpdateStatusRequest;
use App\Http\Resources\Client\Project\ProjectListWorkerResource;
use App\Http\Resources\Resident\Client\ClientResource;
use App\Http\Resources\Resident\Invoices\InvoiceListResource;
use App\Http\Resources\Resident\Project\ProjectItemResource;
use App\Http\Resources\Resident\Project\ProjectItemWorkerResource;
use App\Http\Resources\Resident\Project\View\LogResource;
use App\Http\Resources\Resident\Project\View\TaskGanttChartResource;
use App\Http\Resources\Resident\Project\View\TaskResource;
use App\Http\Resources\Resident\Project\View\TaskTimeResource;
use App\Http\Resources\Resident\Settings\CurrencyResource;
use App\Http\Resources\Resident\Transactions\TransactionsListResource;
use App\Http\Resources\Resident\DocumentResource;
use App\Http\Resources\Resident\Project\ProjectListResource;
use App\Http\Resources\UserResource;
use App\Http\Resources\Users\AdminListResource;
use App\Models\PersonalModel;
use App\Models\Resident\Document;
use App\Models\Resident\Project\Project;
use App\Models\Resident\Project\ProjectLog;
use App\Models\Resident\Project\Task;
use App\Models\Resident\Project\TaskTime;
use App\Models\Resident\Settings\Currency;
use App\Models\User;
use App\Models\Users\Admin;
use App\Models\Users\Client;
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

    public function createOrUpdate(Project $project, ProjectCreateRequest $request)
    {
        $this->setOldModel($project);

        $this->isPut = true;
        if(!$project->id) {
            $project = Project::newDefault();
        }

        $result = $this->createOrUpdateCRUD($request, $project, null, function($model, $request, $isNew){
            $collect = collect([]);
            if($request->members) {
                $collect =  $collect->merge(Admin::whereIn('id', $request->members)->get());
            }
            if($request->suppliers) {
                $collect = $collect->merge(Client::whereIn('id', $request->suppliers)->hasType(Client::TYPE[1])->get());
            }
            $model->setPersonal($collect);

        });
        $this->sendLog($project);

        return $result;
    }


    public function item(Project $project)
    {
        $checkProject = $this->checkUserProject($project);
        if($checkProject === false) {
            abort(403);
        }

        return $checkProject == self::PROJECT[0] ? new ProjectItemResource($project) : new ProjectItemWorkerResource($project);
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
                $query->orWhere('sys_tasks.cid', $client->id);
            }
            return $query->firstOrFail();
        }

        return null;
    }

    private function methodPathExecute($project, array $methodList, $key = 'path.1')
    {
        $method = Arr::get($this->viewData, $key);
        if($method) {
            if(isset($methodList[$method])) {
                return $this->{$methodList[$method]}($project);
            }else{
                abort(404);
            }
        }

        return null;
    }

    public function viewProcess(Request $request, Project $project)
    {
        $result = null;
        $type = $request->route('type');
        $id = $request->route('id');
        $this->viewData['request'] = $request;
        $this->viewData['path'] = explode('/', $id);
        $this->viewData['checkProject'] = $this->checkUserProject($project);

        if($this->viewData['checkProject'] === false) {
            abort(403);
        }

        $prefix = ucfirst(strtolower($request->getMethod()));
        $method = $type . $prefix;
        if(method_exists($this, $method)) {
            $result = $this->{$method}($project);
        }elseif(method_exists($this, $type . "All")) {
            $method = $type . "All";
            $result = $this->{$method}($project);
        }

        if($result === null) {
            abort(404);
        }

        if($result === true) {
            return response()->json(['success' => true]);
        }

        return $result;
    }

    #GET
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
        if(($method = $this->methodPathExecute($project, $methodList)) !== null) {
            return $method;
        }
        $id = Arr::get($this->viewData, 'path.0');
        if($id == 'input-data') {
            return response()->json([
                'users' => UserResource::collection($this->getProjectUser($project)),
                'status' => Task::getStatusColumn()
            ]);
        }


        $checkProject = Arr::get($this->viewData, 'checkProject');
        $taskQuery = $tasks = $project->tasks()
            ->with(['admin.files', 'admin.myRole', 'client.companyClient', 'client.files', 'personals', 'personals.user', 'personals.user.files']);

        if($checkProject == self::PROJECT[1]){
            $client = auth()->user();
            $taskQuery->selectRaw('DISTINCT sys_tasks.*')
                ->JoinPersonalTable()
                ->where(function($query) use($client){
                    $query->where(function($query) use($client){
                        $query->where('personal_model.user_type', $client::class)
                            ->where('personal_model.user_id', $client->id);
                    })->orWhere('sys_tasks.cid', $client->id);
                });
        }

        if($id) {
            return new TaskResource($taskQuery->where('sys_tasks.id', $id)->firstOrFail());
        }

        $tasks = $taskQuery->sort()->get();
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

    #POST
    public function filesPost($project)
    {
        $document = new DocumentController();
        $request = app(DocumentFileCreateRequest::class);
        $request->setModel($project);
        $result = $document->createOrUpdate(new Document(), $request);
        if($document->file) {
            $data = $document->file->toArray();
            $dopDescription = __('project_log.project.fileName',['fileName' => $document->file->original_name, 'fileId' => $document->file->id]);
        }
        ProjectLog::create($project, ProjectLog::TYPE[4], null, $data, null, $dopDescription);
        return $result;
    }

    public function tasksAll($project)
    {
        $methodList = [
            'times' => 'tasksTimesEdit',
            'status' => 'tasksStatusEdit'
        ];
        if(($method = $this->methodPathExecute($project, $methodList)) !== null) {
            return $method;
        }

        $task = $this->getTask($project);
        $user = User::getAuth();
//        request()->merge(['users' => [['userType' => $user->getNameClass(), 'id' => $user->id]]]);

        $controller = new TaskController();
        $method = strtolower($this->viewData['request']->method());
        $path = Arr::get($this->viewData, 'path.1');


        if(in_array($method, ['post', 'put', 'patch']) && !$path) {
            $request = app(TaskCreateRequest::class);
            $request->setData(['pid' => $project->id]);
            return $controller->createOrUpdate($task ?? new Task(), $request);
        } elseif ($method == 'patch' && $path == 'status' && $task) {
            $request = app(TaskUpdateStatusRequest::class);
            $request->merge(['pid' => $project->id]);
            return $controller->updateStatus($task, $request);
        }
    }

    public function tasksTimesEdit($project)
    {
        $method = $this->viewData['request']->getMethod();
        $task = $this->getTask($project);
        $request = app(AddTimeRequest::class);
        $time = null;

        if(in_array($method, ['POST', 'PUT'])) {
            $time = new TaskTime();
            $time->setUser(User::getAuth());
            $time->project_id = $project->id;
            $time->task_id = $task->id;
            $type = ProjectLog::TYPE[8];
        }elseif ($method == 'PATCH') {
            $id = (int) Arr::get($this->viewData, 'path.2');
            $time = $task->times()->where('id', $id)->where('project_id', $project->id)->firstOrFail();
            $type = ProjectLog::TYPE[9];
        }

        if($time !== null) {
            $time->setTime($request->getTime());
            $time->description = $request->description;
            $time->save();
            ProjectLog::create(model: $task, type: $type, descriptionDop: ProjectLog::dopDescription('task.time', $time->toArray()));

            return response()->json(['success' => true, 'id' => $time->id]);
        }
    }

    public function tasksStatusEdit($project)
    {
        $controller = new TaskController();
        $task = $this->getTask($project);
        $request = app(TaskUpdateStatusRequest::class);
        $request->merge(['pid' => $project->id]);
        return $controller->updateStatus($task, $request);
    }

    #DELETE

    public function tasksDelete($project)
    {
        $methodList = [
            'times' => 'tasksTimesDelete',
        ];
        if(($method = $this->methodPathExecute($project, $methodList)) !== null) {
            return $method;
        }
        $task = $this->getTask($project);
        if($task) {
            $this->sendLog($task, ProjectLog::TYPE[2]);
            return $this->delete($task);
        }
        ProjectLog::create($task, ProjectLog::TYPE[2]);
        return response()->json(['success' => false]);
    }

    public function tasksTimesDelete($project)
    {
        $task = $this->getTask($project);
        $user = User::getAuth();
        $time = $task->times()
            ->where('id', Arr::get($this->viewData, 'path.2'))
            ->where('project_id', $project->id)
            ->where(function($query) use($user){
                $query->where('user_type', $user::class)
                    ->where('user_id', $user->id);
            })
            ->firstOrFail();
        ProjectLog::create($task, ProjectLog::TYPE[10]);
        return $this->delete($time);
    }

    protected function getProjectUser($project)
    {
        $users = collect([]);
        foreach([$project->client, $project->admin, $project->manager] as $u) {
            if($u) {
                $users->push($u);
            }
        }

        foreach($project->personals as $personal)
        {
            if($personal) {
                $users->push($personal->user);
            }
        }
        $users = $users->filter(function($value){
            return !empty($value);
        })->unique(function($item){
            if($item) {
                return $item::class . "_" . $item->id;
            }
        });

        return $users;
    }

}
