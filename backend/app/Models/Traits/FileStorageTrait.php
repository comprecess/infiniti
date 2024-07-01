<?php


namespace App\Models\Traits;


use App\Models\FileStorage;
use Illuminate\Http\File;
use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\Log;

trait FileStorageTrait
{
    public function files()
    {
        return $this->morphMany(FileStorage::class, 'model')->orderByDesc('id');
    }

    public function uploads(UploadedFile|File $file, $data = null)
    {
        $fileStorage = new FileStorage();
        try {
            return $fileStorage->uploads($this, $file, $data);
        }catch (\Exception $e) {
            Log::info(print_r($this, true), ['**FILE**' => print_r($file, true)]);
            throw new \Exception("Error format file");
        }
    }

    public function deleteAllFiles()
    {
        foreach($this->files as $file) {
            $file->delete();
        }
    }

    public function getLastImage()
    {
        $type = [];
        foreach (FileStorage::FILE_TYPE as $k => $v) {
            if($v == 'img') {
                $type[] = $k;
            }
        }

        return $this->morphOne(FileStorage::class, 'modul')->whereIn('ext', $type)->orderByDesc('id');
    }

    public function getFileType($type = null)
    {
        $query = $this->files();
        if($type) {
            $query->whereJsonContains('data->type', $type);
//            dd($query->toSql(), $query->getBindings());
        } else {
            $query->whereNull('data');
        }
        return $query->get();
    }

    public function cloneFile($new)
    {
        foreach ($this->files as $file) {
            $cloneFile = $file->replicate();
            $cloneFile->hash = $cloneFile->getHash();
            $cloneFile->model()->associate($new);
            $cloneFile->save();
        }
    }
}
