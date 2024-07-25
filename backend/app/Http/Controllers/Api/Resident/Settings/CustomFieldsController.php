<?php


namespace App\Http\Controllers\Api\Resident\Settings;


use App\Http\Requests\Resident\Settings\CustomFieldsRequest;
use App\Http\Resources\Resident\Settings\CustomFieldsResorce;
use App\Models\Resident\Settings\CustomFields;

class CustomFieldsController extends SettingsController
{
    public function list()
    {
        $currencyData = CustomFields::all();
        return CustomFieldsResorce::collection($currencyData);
    }

    public function createOrUpdate(CustomFields $customFields, CustomFieldsRequest $request)
    {
        $request->setModel($customFields);
        $customFields->save();

        return response()->json(['success' => true]);
    }

    public function item(CustomFields $customFields)
    {
        return new CustomFieldsResorce($customFields);
    }

    public function delete(CustomFields $customFields)
    {
        $customFields->delete();

        return response()->json(['success' => true]);
    }

}
