<?php


namespace App\Http\Controllers\Api\Resident;


use App\Http\Controllers\Api\Traits\CRUD;
use App\Http\Controllers\Api\UserController;
use App\Http\Requests\Resident\DocumentFileCreateRequest;
use App\Http\Requests\Resident\DocumentFileRequest;
use App\Http\Resources\Resident\DocumentResource;
use App\Models\Resident\Document;
use App\Models\User;
use App\Models\Users\Client;
use Illuminate\Http\Request;
use Illuminate\Support\Arr;
use Illuminate\Support\Facades\Storage;

class DocumentController extends ResidentController
{
    use CRUD {
        createOrUpdate as createOrUpdateCRUD;
        delete as deleteCRUD;
    }

    public $file = null;

    public function roleAccess($request)
    {
        $method = $request->method();
        $user = User::getAuth();
        if($method === 'GET') {
            if($user->checkAccess('view', 'customers')) {
                return true;
            }
        }
    }

    public function list(DocumentFileRequest $request)
    {
        $query = Document::query()->select('sys_documents.*');

        $query
            ->filesExists()
            ->checkAccess()
            ->with(['files']);

        $requestAll = $request->all();

        if(($search = Arr::get($requestAll, 'filter.search')) !== null) {
            $query->where(function($q) use ($search){
                $search = "%" . $search . "%";
                $q->where('sys_documents.title', 'like', $search);
            });
        }

        if(($type = Arr::get($requestAll, 'filter.type')) !== null) {

            if($type == 'client') {
                $query->where('sys_documents.cid', '!=', 0);
            }

        }

        if(($with = Arr::get($requestAll, 'filter.with')) !== null) {
            if(($object = Arr::get($with, 'object')) !== null) {
                $query->join('ib_doc_rel', 'ib_doc_rel.did', '=', 'sys_documents.id')
                    ->where(function($q) use($with, $object){
                        $q->where('ib_doc_rel.rtype', $object);

                        if(($objectId = Arr::get($with, 'id')) !== null) {
                            $q->where('ib_doc_rel.rid', $objectId);
                }
                    });

            }

        }

        $request->sortModel($query);


        return $this->index($query, DocumentResource::class, true);
    }

    public function createOrUpdate(Document $document, DocumentFileCreateRequest $request)
    {
        return $this->createOrUpdateCRUD(
            $request,
            $document,
            null,
            function($model, $request, $isNew){
                $this->file = $model->uploads($request->file);
                $model->file_mime_type = $this->file->ext;
                $model->is_global = (bool) $request->global;
                $model->save();

                if($modelObject = $request->getModel()) {
                    $modelObject->documents()->attach($model->id, ['rtype' => $modelObject->documentName]);
                }
            }
        );
    }

    public function item(Document $document)
    {
        return new DocumentResource($document);
    }

    public function update(Request $request, Document $document)
    {
        if($request->global !== null) {
            $document->is_global = $request->global;
            $document->save();
        }

        return $this->defResponse();
    }

    public function delete(Document $document)
    {
        return $this->deleteCRUD($document);
    }

    public function load(Request $request, $token)
    {
        $document = Document::where('file_dl_token', $token)->orderBy('id', 'desc')->first();
        $file_storage = $document?->files()?->first();

        if(!$document || !$file_storage) {
            abort(404);
        }

        $userController = new UserController();
        $fileUser = true;

        if($request->token){
            $user = Client::where('api_token', $request->token)->first();
            foreach($document->clients as $client) {
                if($client->id == $user?->id) {
                    $fileUser = false;
                }
            }
        }

        if(!$document->is_global && !$userController->getUserModel(false)) {
            abort(403);
        }

        $p = $file_storage->path;
        $storage = Storage::disk('local');

        return response($storage->get($p), 200)->header('Content-Type', $file_storage->mime)
            ->header('Content-Disposition', "attachment; filename=\"{$file_storage->original_name}\"");
    }
}
