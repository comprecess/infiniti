<?php

namespace App\Http\Controllers\Api\Client;

use App\Http\Controllers\Controller;
use App\Http\Requests\Client\Document\DocumentFileCreateRequest;
use App\Http\Resources\Client\Document\DocumentResource;
use App\Models\Resident\Document;
use App\Models\User;
use App\Http\Controllers\Api\Traits\CRUD;


class DocumentController extends Controller
{
    use CRUD;

    public function list()
    {

        return $this->index(User::getAuth()->documents()->with(['files']), DocumentResource::class, true);
    }

    public function create(DocumentFileCreateRequest $request)
    {
        $document = Document::newDefault();
        $user = User::getAuth();

        return $this->createOrUpdate($request, $document, null, function($model, $request, $isNew) use($user){
                $fileStorage = $model->uploads($request->file);
                $model->file_mime_type = $fileStorage->ext;
                $model->is_global = 1;
                $model->title = $request->title;
                $model->save();

                $user->documents()->attach($model->id, ['rtype' => Document::TYPE_CONTACT]);
            });
    }
}
