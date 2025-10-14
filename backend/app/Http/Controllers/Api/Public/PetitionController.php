<?php


namespace App\Http\Controllers\Api\Public;


use App\Events\InvoicePay;
use App\Http\Controllers\Api\Traits\CRUD;
use App\Http\Controllers\Api\Traits\IsAuthTrait;
use App\Http\Controllers\Controller;
use App\Http\Requests\Public\Petition\OfferCheckRequest;
use App\Http\Requests\Public\Petition\PayRequest;
use App\Http\Resources\Resident\Invoices\InvoiceItemResource;
use App\Http\Resources\Resident\Invoices\InvoiceListResource;
use App\Http\Resources\Resident\Invoices\OfferItemResource;
use App\Http\Resources\Resident\Invoices\OfferListResource;
use App\Models\Log;
use App\Models\Resident\Client\Activity;
use App\Models\Resident\Invoices\Invoice;
use App\Models\Resident\Invoices\Offer;
use App\Models\Resident\Settings\PaymentGateway;
use App\Models\Users\Admin;
use App\Services\Pay\Contract\PayContract;
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
          'resource' => InvoiceItemResource::class,
          'my' => 'invoices',
          'myResource' => InvoiceListResource::class
        ],
        'offer' => [
            'model' => Offer::class,
            'resource' => OfferItemResource::class,
            'my' => 'offers',
            'myResource' => OfferListResource::class,
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

        if($model instanceof Invoice) {
            $model->payList = PaymentGateway::active()->get();
        }

        return new $type['resource']($model);

    }

    public function offerCheck(OfferCheckRequest $request)
    {
        list($type, $model) = $this->getDataByToken();
        $user = $this->isAuth(false);
        //Проверить статус а именно корзину
//        if(!$model->status()->actionPublic()) {
        if(!$model->status()->actionPublicStage()) {
            throw ValidationException::withMessages(["offer" => "It is not possible to change the status"]);
        }

        $model->stage = $request->stage;
        $model->save();
        $message = collect([]);

        if($request->stage == Offer::STAGE[5]) {
            $date = now();
            $activity = new Activity();
//            $name = $user?->account ?? $request->name ?? $request->ip();
//            $message = collect([/*"[name:{$name}]", */"[ip:{$request->ip()}]", $request->message]);
            $message->push("[ip:{$request->ip()}]");
            $message->push("[<a href=\"{$model->getUrlFront()}\" target=\"_blank\">Offer: {$model->id}</a>]");
            $message->push($request->message);

            $resident = $model->orderCart()->withTrashed()->orderByDesc('id')->first()?->user;
            if(!$resident || !($resident instanceof Admin)) {
                $resident = Admin::orderBy('id')->first();
            }

            $activity->cid = $model->userid;
            $activity->msg = '<p>' . $message->implode('<br>') . '</p>';
            $activity->icon = 'reply';
            $activity->stime = $date->timestamp;
            $activity->sdate = $date;
            $activity->oname = $resident->fullname;
            $activity->no_delete = 1;
            $activity->o = $resident->id;
            $activity->save();
        }
        $message->prepend("[stage:{$request->stage}]");
        $message->prepend("[Offer:{$model->id}]");
        Log::send($message->implode("; "), $model->user);

        return response()->json(['success' => true]);
    }

    public function pay(PayContract $pay, PayRequest $request)
    {
        list($type, $model) = $this->getDataByToken();

        if(!($model instanceof Invoice)) {
            abort(404);
        }

        $response = $pay->setPay($request->route('payType'), $model)->execute();

        event(new InvoicePay($model));
        return $response;
    }

    public function myData($type)
    {

        if(!in_array($type, array_keys(self::PUBLIC_TOKEN))) {
            abort(404);
        }

        $data = self::PUBLIC_TOKEN[$type];
        $client = auth()->user();

        return $data['myResource']::collection($client->{$data['my']});
    }


}
