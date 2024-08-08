<?php


namespace App\Http\Controllers\Api\Resident\Settings;


use App\Http\Requests\Resident\Settings\CustomFieldsRequest;
use App\Http\Resources\Resident\Settings\CustomFieldsResource;
use App\Models\Resident\Settings\CustomFields;

class CustomFieldsController extends SettingsController
{
    public function list()
    {
        $currencyData = CustomFields::all();
        return CustomFieldsResource::collection($currencyData);
    }

    public function createOrUpdate(CustomFields $customFields, CustomFieldsRequest $request)
    {
        $request->setModel($customFields);
        $customFields->save();

        return response()->json(['success' => true]);
    }

    public function item(CustomFields $customFields)
    {
        return new CustomFieldsResource($customFields);
    }

    public function delete(CustomFields $customFields)
    {
        $customFields->delete();

        return response()->json(['success' => true]);
    }

}
