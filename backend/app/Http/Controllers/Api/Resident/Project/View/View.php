<?php


namespace App\Http\Controllers\Api\Resident\Project\View;


use Illuminate\Database\Eloquent\Model;
use Illuminate\Http\Request;
use Illuminate\Support\Arr;

abstract class View
{

    protected $path = null;

    public function __construct(protected Model $model, protected Request $request)
    {
    }

    public static function create(Model $model)
    {
        $request = request();
        $classList = [
            Get::class => ['get'],
            Edit::class => ['post', 'patch'/*, 'put', 'patch'*/],
//            Patch::class => ['patch'],
            Delete::class => ['delete']
        ];

        foreach($classList as $class => $methods){
            if(in_array(strtolower($request->method()), $methods)) {
                $type = $request->route('type');
                if(method_exists($class, $type)) {
                    $new = new $class($model, $request);
                    return $new->{$type}();
                }
            }
        }

        return null;
    }

    protected function urlToMethod($getInt = false)
    {
        if($id = $this->request->route('id')) {
            $this->path = explode('/', $id);
            $id = $this->path[0];
            $id = preg_replace('/[^a-z0-9]/', '_', $id);
            if(($idInt = intval($id)) == $id && $getInt) {
                return $idInt;
            }
            $method = snakeCaseToPascalCase(debug_backtrace()[1]['function'] . ucfirst($id));
            if(method_exists($this, $method)) {
                return $this->{$method}();
            }

            abort(404);
        }

        return null;
    }

    protected function urlToMethodInt()
    {
        if($id = $this->request->route('id')) {
            $this->path = explode('/', $id);
            $method = [debug_backtrace()[1]['function']];
            $integer = [];
            foreach($this->path as $path){
                $int = intval($path);
                if($int == $path) {
                    $integer[] = $int;
                }else{
                    $method[] = ucfirst(snakeCaseToPascalCase(preg_replace('/[^a-z0-9]/', '_', $path)));
//                    $method[] = ucfirst(strtolower($path));
                }
            }

            if(count($method) > 1) {
                $method = lcfirst(implode('', $method));
                if (method_exists($this, $method)) {
                    return $this->{$method}($integer);
                }

                abort(404);
            }else{
                return Arr::get($integer, 0, null);
            }
        }

        return null;
    }

    protected function getProjectUser()
    {
        $users = collect([]);
        foreach([$this->model->client, $this->model->admin, $this->model->manager] as $u) {
            if($u) {
                $users->push($u);
            }
        }

        foreach($this->model->personals as $personal)
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
