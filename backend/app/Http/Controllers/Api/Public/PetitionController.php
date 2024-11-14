<?php


namespace App\Http\Controllers\Api\Public;


use App\Http\Controllers\Api\Traits\CRUD;
use App\Http\Controllers\Api\Traits\IsAuthTrait;
use App\Http\Controllers\Controller;
use App\Http\Requests\Public\OfferCheckRequest;
use App\Http\Resources\Resident\Invoices\InvoiceItemResource;
use App\Http\Resources\Resident\Invoices\OfferItemResource;
use App\Models\Log;
use App\Models\Resident\Client\Activity;
use App\Models\Resident\Invoices\Invoice;
use App\Models\Resident\Invoices\Offer;
use App\Models\Users\Admin;
use Illuminate\Support\Arr;
use Illuminate\Validation\ValidationException;

class PetitionController extends Controller
{
    use CRUD{
        createOrUpdate as createOrUpdateCRUD;
        delete as deleteCRUD;
    }
    use IsAuthTrait;

    const PUBLIC_TOKEN = [
        'invoice' => [
          'model' => Invoice::class,
          'resource' => InvoiceItemResource::class
        ],
        'offer' => [
            'model' => Offer::class,
            'resource' => OfferItemResource::class
        ],
    ];

    protected function getDataByToken($type = null, $token = null)
    {
        $type = $type ?? request()->route('type');
        $token = $token ?? request()->route('token');
        $type = Arr::get(self::PUBLIC_TOKEN, $type);
        if(!$type) {
            abort(404);
        }

        $class = $type['model'];

        $model = $class::where('vtoken', $token)
            ->with(['items', 'items.service', 'items.document'])
            ->orderBy('id', 'desc')
            ->first();

        if(!$model) {
            abort(404);
        }

        return [$type, $model];
    }

    public function publicToken($type, $token)
    {
        list($type, $model) = $this->getDataByToken();
        $model->getPublicToken = true;

        return new $type['resource']($model);

    }

    public function offerCheck(OfferCheckRequest $request)
    {
        list($type, $model) = $this->getDataByToken();
        $user = $this->isAuth(false);
        if(!$model->status()->actionPublic()) {
            throw ValidationException::withMessages(["offer" => "It is not possible to change the status"]);
        }

        $model->stage = $request->stage;
        $model->save();

        if($request->stage == Offer::STAGE[5]) {
            $date = now();
            $activity = new Activity();
            $name = $user?->account ?? $request->name ?? $request->ip();
            $message = ["[name:{$name}]", "[ip:{$request->ip()}]", $request->message];

            $resident = $model->orderCart()->withTrashed()->orderByDesc('id')->first()?->user;
            if(!$resident || !($resident instanceof Admin)) {
                $resident = Admin::orderBy('id')->first();
            }

            $activity->cid = $model->userid;
            $activity->msg = '<p>' . implode('<br>', $message) . '</p>';
            $activity->icon = 'reply';
            $activity->stime = $date->timestamp;
            $activity->sdate = $date;
            $activity->oname = $name;
            $activity->no_delete = 1;
            $activity->o = $resident->id;
            $activity->save();
        }
        $message[] = "[Offer:{$model->id}]";
        $message[] = "[stage:{$request->stage}]";
        $newMessage = array_diff($message, ['']);
        Log::send(implode("; ", $newMessage), $model->user);

        return response()->json(['success' => true]);
    }



}
