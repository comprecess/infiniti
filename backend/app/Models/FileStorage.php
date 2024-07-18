<?php

namespace App\Models;

use App\Exceptions\LoadFileStorageException;
use App\Models\Traits\BootTrait;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Http\File;
use Illuminate\Http\UploadedFile;
use Illuminate\Support\Arr;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Storage;
use Intervention\Image\Laravel\Facades\Image;

class FileStorage extends Model
{
    use HasFactory, BootTrait;

    const NAME = 'file_storage';

    const FILE_TYPE = [
        'pdf' => 'pdf',
        'doc' => 'document',
        'docx' => 'document',
        'xls' => 'excel',
        'xlsx' => 'excel',
        'jpg' => 'img',
        'jpeg' => 'img',
        'png' => 'img',
        'gif' => 'img',
        'raw' => 'img',
        'tiff' => 'img',
        'bmp' => 'img',
        'webp' => 'img',
        'tif' => 'img',
        'heic' => 'img',
        'svg' => 'svg'
    ];

    private $convertorByJpg = [
        'webp', 'gif', 'bmp', 'tif', 'heic'
    ];
    private $tmpFile = null;

    private $file = null;

    protected $casts = [
        'data' => 'array',
    ];

    public static function deletedEvent($item)
    {
        $path = self::where('path', $item->path)->get();
        if($path->count() < 1) {
            Storage::disk('local')->delete($item->path);
        }
    }

    public function model()
    {
        return $this->morphTo('model');
    }

    public static function getAccept() :string
    {
        $keys = array_keys(self::FILE_TYPE);
        return "." . implode(",.", $keys);
    }

    public function getType() :?string
    {
        return Arr::get(self::FILE_TYPE, strtolower($this->ext));
    }

    public function isImage()
    {
        return $this->getType() == 'img';
    }

    public function uploads(Model $model, UploadedFile|File $file, $data = null) :FileStorage
    {
        if($file instanceof UploadedFile && $file->getError()) {
            Log::error($file->getErrorMessage());
            throw new LoadFileStorageException($file->getErrorMessage(), 2);
        }

        $this->setFile($file);

        #resize
//        $this->correctionFile();

        if(!$this->getType()) {
            Log::error("Error uploads file. File: ".$this->getAttrFile('original'). " Type: " . strtolower($this->ext));
            throw new LoadFileStorageException("Invalid file format");
        }

        $nameModel = explode("\\", get_class($model));
        $path = mb_strtolower('/'.self::NAME.'/' . ($model->path_fileStorage ?? Arr::last($nameModel, null, 'file_storage')));
        $this->original_name = $this->getAttrFile('original');
        try{
            $this->mime = $this->getAttrFile('mime');
        }catch (\Exception $e){
            Log::error($e->getMessage());
        }
        $this->size = $this->getAttrFile('size');
        $name = Storage::putFile($path, $this->getFile());
        $this->model()->associate($model);
//        if($model->client_id) {
//            $this->client_id = $model->client_id;
//        }
        if($name === false) {
            throw new LoadFileStorageException("Can't download file", 1);
        }
        $this->path = $name;

        if($data) {
            $this->data = $data;
        }

        $this->hash = $this->getHash();

        $this->save();

        $this->dropTmpFile();
        return $this;
    }

    public function uplodsUrl(Model $model, string $url)
    {
        $urlFile = new \SplFileInfo($url);
        $tmpStorage = storage_path("app/".self::NAME ."/tmp/");
        $tmp = self::NAME . "/tmp/";
        $baseName = $urlFile->getBasename();

//        if(!isset(self::FILE_TYPE[$urlFile->getExtension()])) {
//            throw new LoadFileStorageException("Invalid file format");
//        }

        $storage = Storage::disk('local');

        if(!$storage->exists($tmp)) {
            $storage->makeDirectory($tmp);
        }

        $urlFile = fopen($url, 'r');

        if($urlFile !== false) {

            if($storage->put($tmp . $baseName, $urlFile)) {
                $fileStorage = $this->uploads($model, new File($tmpStorage . $baseName));
                if($fileStorage->id) {
                    $storage->delete($tmp . $baseName);
                    return true;
                }
            }
        }
        return false;
    }

    public function setFile(UploadedFile|File $file)
    {
        $this->file = $file;
        $this->ext = $this->getAttrFile('ext');
    }

    public function getFile()
    {
        if(!$this->file && $this->id) {
            $file = new File(storage_path("app/{$this->path}"));
            $this->setFile($file);
        }

        return $this->file;
    }

    public function getAttrFile($attr)
    {
        $attrFile = [
            'ext' => ['getClientOriginalExtension', 'extension'],
            'original' => ['getClientOriginalName', 'getBasename'],
            'mime' => ['getMimeType', 'getMimeType'],
            'size' => ['getSize', 'getSize'],
        ];
        $id = $this->file instanceof UploadedFile ? 0 : 1;

        if(isset($attrFile[$attr])) {
            $method = $attrFile[$attr][$id];
            return $this->file->{$method}();
        }

        return null;
    }

    public function getHash($length = 32)
    {
        $str = random_bytes($length);
        $str = base64_encode($str);
        $str = str_replace(["+", "/", "="], "", $str);
        $str = substr($str, 0, $length);
        return md5(md5(time()) . $str);
    }

    public function getLink() :string
    {
        return route('file_storage', ['file_storage' => $this->hash ? $this->hash : $this->id]);
    }

    public function correctionFile()
    {
        if(!$this->isImage()) {
            return false;
        }

        $name = $this->getAttrFile('original');

        $convert = Image::read($this->getFile()->getPathName())->scale(1280);

        if(in_array($this->ext, $this->convertorByJpg)) {
            $name = explode('.', $name);
            unset($name[count($name) - 1]);
            $name = implode('.', $name) . ".jpg";

            $convert = $convert->toJpeg();
        }

        $this->tmpFile = self::NAME . "/{$name}";
        $path = storage_path("app/" . $this->tmpFile);

        $convert->save($path);
        $this->setFile(new File($path));

    }

    public function dropTmpFile()
    {
        if($this->tmpFile) {
            Storage::disk('local')->delete($this->tmpFile);
        }
    }
}
