<?php

namespace App\Http\Controllers\Api;

use App\Exceptions\ClientException;
use App\Exceptions\LoadFileStorageException;
use App\Http\Controllers\Controller;
use App\Models\FileStorage;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Modules\User\app\Models\Group;

class FileController extends Controller
{
    public function load(Request $request)
    {
        $nameFile = $request->file_storage;

        if($nameFile == (int) $nameFile) {
            $file_storage = FileStorage::where('id', $nameFile)->where(function($query){
                $query->whereNull('hash')->orWhere('hash','');
            })->first();
        } else {
            $file_storage = FileStorage::where('hash', $nameFile)->orderByDesc('id')->first();
        }

        if(!$file_storage) {
            abort(404);
        }

//        if(!$this->access->hasFile($file_storage)) {
//            abort(403);
//        }

        $p = $file_storage->path;
        $storage = Storage::disk('local');

//        if(!$file_storage->isClient()) {
//            throw new ClientException("This client does not have access to this resource");
//        }

        if(!$storage->has($p)) {
            throw new LoadFileStorageException("File not found", 2);
        }

        return response($storage->get($p), 200)->header('Content-Type', $file_storage->mime)
            ->header('Content-Disposition', "attachment; filename=\"{$file_storage->original_name}\"");
    }

    public function ajaxFile(Request $request)
    {
        $modulName = ucfirst($request->modul);
        $modelName = ucfirst($request->model ?? $modulName);
        $data = http_build_query($request->all());
        if(isset($data['originalModel'])) {
            $modelName = $request->model ?? $modulName;
        }
        $class = "Modules\\{$modulName}\\app\\Models\\{$modelName}";

        if(!class_exists($class)){
            abort(404);
        }

        $files = $model = null;
        if($request->id) {
            $model = $class::find($request->id);


            if ($request->isMethod('post') && $request->method == null) {

                if(!$this->access->has($modulName, Group::CHANGE)) {
                    return abort(403);
                }

                $allRequest = $request->all();
                $model->uploads($allRequest['files'], $request->data);
            }

            if ($request->isMethod('post') && $request->method == 'delet') {

                if(!$this->access->has($modulName, Group::DELETE)) {
                    return abort(403);
                }
                $file = FileStorage::find($request->id);
                $model = $file->modul;
                $file->delete();
            }

            if($request->data) {
                $query = $model->files();
                foreach($request->data as $key => $value) {
                    $query->whereJsonContains('data->'.$key, $value);
                }
                $files = $query->get();
            } else {
                $files = $model->files;
            }
        }

        if(!$this->access->has($modulName, Group::READ)) {
            return abort(403);
        }

        return view('elements.file.ajax', compact('files', 'model', 'request', 'data'));
    }
}
