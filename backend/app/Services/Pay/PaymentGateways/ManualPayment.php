<?php


namespace App\Services\Pay\PaymentGateways;


use App\Models\Resident\Document;
use App\Services\Pay\Contract\PaymentGatewaysContract;
use App\Services\Pay\PaymentGateways;

class ManualPayment extends PaymentGateways implements PaymentGatewaysContract
{

    public function execute() :PaymentGatewaysContract
    {
        $request = $this->pay->getDataRequest();
        $model = $this->pay->getModel();

        $document = new Document();
        $document->insertDefaultValue();
        $document->title = $request->title;
        $document->save();

        $fileStorage = $document->uploads($request->file);
        $document->file_mime_type = $fileStorage->ext;
        $document->save();

        $model->documents()->attach($document->id, ['rtype' => $this->getName()]);

        return $this;

    }



    protected function getName()
    {
        $model = $this->pay->getModel();
        $class_parts = explode('\\', get_class($model));
        return strtolower(end($class_parts));
    }

    public function response()
    {
        return response()->json(['success' => true]);
    }
}
