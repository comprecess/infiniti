<?php

namespace App\Http\Controllers\Api;

use App\Exceptions\ClientException;
use App\Exceptions\LoadFileStorageException;
use App\Http\Controllers\Controller;
use App\Models\FileStorage;
use App\Services\RedisCache;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Redis;
use Illuminate\Support\Facades\Storage;
use Intervention\Image\Laravel\Facades\Image;
use Modules\User\app\Models\Group;
use function PHPUnit\Framework\isNull;

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

        try{
            $newImage = $this->scaleImageFile($file_storage, $storage, $request);
            $data = explode(',', $newImage);
            if($newImage !== null) {
                return response(base64_decode($data[1]))->header('Content-Type', $file_storage->mime)
                    ->header('Content-Disposition', "inline; filename=\"{$file_storage->original_name}\"")
                    ->header('Cache-Control', 'max-age=' . config('cache.time.1month'));
            }
        }catch (\Exception $e) {
            Log::error($e->getMessage(), $e->getTrace());
        }

        return response($storage->get($p), 200)->header('Content-Type', $file_storage->mime)
            ->header('Content-Disposition', "attachment; filename=\"{$file_storage->original_name}\"");
    }

    private function scaleImageFile(FileStorage $file_storage, $storage, Request $request) :?string
    {
        if(!(($request->width || $request->height) && $file_storage->isImage())) {
            return null;
        }

        $scale = $this->searchScale($request->width, $request->height);
        if(!$scale) {
            return null;
        }

        $key = "image:scale:" . $file_storage->hash . "_" . implode('x', $scale);

        return (new RedisCache())->remember($key, function() use($file_storage, $scale){
            $convert = Image::read($file_storage->getFile()->getPathName())->scale(...$scale);
            if (in_array($file_storage->ext, $file_storage->convertorByJpg)) {
                $convert = $convert->toJpeg();
            }

            //return base64 file
            //$convert->encode()->toDataUri();
            return $convert->encode()->toDataUri();
        });

        /*$convert = Image::read($file_storage->getFile()->getPathName())->scale(...$scale);
        if (in_array($file_storage->ext, $file_storage->convertorByJpg)) {
            $convert = $convert->toJpeg();
        }

        //return base64 file
        //$convert->encode()->toDataUri();
        return $convert->encode();*/
    }

    private function searchScale($width, $height) :?array
    {
        $scale = config('data.scale_image');
        $result = [[],[]];

        foreach([$width, $height] as $key => $permit) {
            foreach($scale as $keyScale => $dataScale) {
                if($permit == $dataScale[$key]) {
                    $result[$key][] = $keyScale;
                }
            }
        }

        //100%
        if($int = array_intersect($result[0], $result[1])){
            return $scale[$int[0]];
        }

        if(count($result[0]) || count($result[1])) {
            return $scale[($result[0] ? $result[0] : $result[1])[0]];
        }else{
            return null;
        }

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
