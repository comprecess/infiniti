<?php


namespace App\Http\Controllers\Api\Client\Business;


use App\Events\Client\BusinessPlan\Generate;
use App\Http\Controllers\Api\Traits\CRUD;
use App\Http\Controllers\Controller;
use App\Http\Requests\Client\BusinessPlan\BusinessPlanUpdateRequest;
use App\Http\Resources\Client\BusinessPlan\QuestionResource;
use App\Http\Resources\Resident\BusinessPlan\BusinessPlanListResource;
use App\Http\Resources\Resident\BusinessPlan\BusinessPlanResource;
use App\Http\Resources\Resident\Talents\TalentResource;
use App\Models\BusinessModel\BusinessModel;
use App\Models\Catalog\Prop;
use App\Models\Resident\BusinessPlan;
use App\Models\Resident\Question;
use App\Models\User;
use App\Services\ChatGPT as ChatGPTService;
use Illuminate\Http\Request;
use Illuminate\Validation\ValidationException;

class BusinessPlanController extends Controller
{
    use CRUD;

    public function list(Request $request)
    {
        $userId = $request->user()->id;
        $query = BusinessPlan::where('cid', $userId)
            ->with(['client', 'client.files', 'businessModel', 'businessModel.values', 'businessModel.props', 'businessModel.values.prop']);


        return $this->index($query, BusinessPlanListResource::class);
    }

    public function inputData()
    {
        $users = \App\Models\Catalog\User::active()
            ->with(['files','values', 'values.prop', 'blockExperience'])
            ->get();
        $data['talents'] = TalentResource::collection($users);

        return response()->json($data);
    }

    public function item($id, Request $request)
    {
        $userId = $request->user()->id;
        $plan = BusinessPlan::where('id', $id)
            ->where('cid', $userId)
            ->with(['client', 'client.files', 'businessModel', 'businessModel.values', 'businessModel.props', 'businessModel.values.prop'])
            ->firstOrFail();
        return new BusinessPlanResource($plan);
    }

    public function chatgptTalent($id, Request $request)
    {
        $userId = $request->user()->id;
        $plan = BusinessPlan::where('id', $id)
            ->where('cid', $userId)
            ->with(['client', 'client.files', 'businessModel', 'businessModel.values', 'businessModel.props', 'businessModel.values.prop'])
            ->firstOrFail();


        $chatGPT = $plan->chatGPT();
        $chatGPT->chat_model = ChatGPTService::MODEL[0];
        $chatGPT->namePrompt = 'selectionSpecialists';

        $chatGPTService = $chatGPT->toPrompt(request: $request);
        $chatGPTService->send();

        return response()->json($chatGPTService->getTagInfo());
    }

    public function getQuestion()
    {
        $question = Question::whereNull('parent_id')
            ->with(['childrenRecursive'])
            ->orderBy('position')
            ->get();

        return QuestionResource::collection($question);
    }

    public function createBusinessPlan(BusinessModel $businessModel, Request $request)
    {
        $user = User::getAuth();
        if(is_array($request->answers)) {
            $answers = $request->answers;
        }else {
            $answers = json_decode($request->answers, true);
        }

        $plan = new BusinessPlan();
        $plan->setUser($user);
        $plan->date = now();
        $plan->status_generate = BusinessPlan::STATUS_GENERATE[0];
        $plan->answer = ['original' => $answers];
        $plan->business_model_id = $businessModel->id;
        /*test*/
        $plan->company_name = $businessModel->title;
        $plan->description = $businessModel->description;
        $plan->ex_summary = $businessModel->full_description;
        $plan->m_analysis = $businessModel->market_analysis;
        $plan->management = $businessModel->stages_implementation;
        $plan->investment = $businessModel->current_investors;
        $plan->finance = $businessModel->financial_model;
        /*test*/
        $plan->save();

        $file = $businessModel->getFileType('content')->first();
        if($file) {
            $file->replicateNewModel($plan)->save();
        }

        event(new Generate($plan));

        return response()->json(['success' => true, 'id' => $plan->id]);
    }

    public function addCart(BusinessPlan $plan)
    {
        $userId = User::getAuth()->id;
        $plan = BusinessPlan::where('id', $plan->id)
            ->where('cid', $userId)
            ->firstOrFail();
        if($plan->toCart()) {
            return response()->json(['success' => true, 'id' => $plan->id]);
        }else{
            throw ValidationException::withMessages(['talents' => "No business plan talents found"]);
        }
    }

    public function update(BusinessPlanUpdateRequest $request, $id)
    {
        $userId = $request->user()->id;
        $plan = BusinessPlan::where('id', $id)
            ->where('cid', $userId)
            ->firstOrFail();

        if(is_array($request->teams)) {
            $plan->teams()->sync($request->teams);
        }

        return response()->json(['success' => true, 'id' => $plan->id]);
    }


}
