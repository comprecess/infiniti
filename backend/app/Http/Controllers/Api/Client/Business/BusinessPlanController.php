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
use App\Models\Log;
use App\Models\Resident\BusinessPlan;
use App\Models\Resident\Question;
use App\Models\Resident\Transactions\Transaction;
use App\Models\Resident\Transactions\Category;
use App\Models\Users\Client;
use App\Models\User;
use App\Services\ChatGPT as ChatGPTService;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log as LaravelLog;
use Illuminate\Validation\ValidationException;

class BusinessPlanController extends Controller
{
    use CRUD;

    public function list(Request $request)
    {
        $userId = $request->user()->id;
        $query = BusinessPlan::where('cid', $userId)
            ->with(['client', 'client.files', 'businessModel', 'businessModel.values', 'businessModel.props', 'businessModel.values.prop'])
            ->orderByDesc('id');


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

        // ── 1. Load the Client record (crm_accounts) that holds the balance ─────
        $client = Client::find($user->id);

        if (!$client) {
            return response()->json(['success' => false, 'message' => 'Client account not found.'], 422);
        }

        // ── 2. Resolve the price of this business model ───────────────────────
        // getPropValues() lives only in PropValuesTrait (Resources), not on the Model.
        // We read price directly: find the 'price' prop, get its first value for this model.
        $businessModel->load(['values', 'values.prop']);
        $priceProp = $businessModel->getPropsByNameId(['price'])->first();
        $priceRaw  = (float) ($priceProp?->values?->first()?->value ?? 0);
        $price     = round($priceRaw, 2);

        // ── 3. Check balance ──────────────────────────────────────────────────
        $currentBalance = (float) $client->balance;

        if ($price > 0 && $currentBalance < $price) {
            return response()->json([
                'success'  => false,
                'message'  => 'Insufficient balance. This business plan costs $' . number_format($price, 2) . '. Your current balance is $' . number_format($currentBalance, 2) . '.',
                'required' => $price,
                'balance'  => $currentBalance,
            ], 402);
        }

        // ── 4. Parse answers ──────────────────────────────────────────────────
        if (is_array($request->answers)) {
            $answers = $request->answers;
        } else {
            $answers = json_decode($request->answers, true);
        }

        // ── 5. Create the business plan record ────────────────────────────────
        DB::beginTransaction();
        try {
            $plan = new BusinessPlan();
            $plan->setUser($user);
            $plan->date             = now();
            $plan->status_generate  = BusinessPlan::STATUS_GENERATE[0];
            $plan->answer           = ['original' => $answers];
            $plan->business_model_id = $businessModel->id;
            $plan->company_name     = $businessModel->title;
            $plan->save();

            $file = $businessModel->getFileType('content')->first();
            if ($file) {
                $file->replicateNewModel($plan)->save();
            }

            // ── 6. Deduct balance & write transaction if price > 0 ────────────
            if ($price > 0) {
                // Deduct from client balance
                $client->balance = round($currentBalance - $price, 2);
                $client->save();

                // Find or create "Business Plan Generation" expense category
                $category = Category::where('name', 'Business Plan Generation')
                    ->where('type', 'Expense')
                    ->first();
                if (!$category) {
                    $category       = new Category();
                    $category->name = 'Business Plan Generation';
                    $category->type = 'Expense';
                    $category->save();
                }

                // Write expense transaction to sys_transactions.
                // account_id must point to a real sys_accounts row because Transaction::createdEvent
                // updates that account's balance. We use the first available platform account.
                $platformAccount = \App\Models\Resident\Transactions\Account::first();

                $transaction                    = Transaction::newDefault();
                $transaction->account_id        = $platformAccount?->id ?? 0;
                $transaction->account           = $platformAccount?->account ?? 'Platform';
                $transaction->type              = 'Expense';
                $transaction->amount            = $price;
                $transaction->dr                = $price;
                $transaction->cr                = 0;
                $transaction->date              = now()->toDateString();
                $transaction->status            = 'Cleared';
                $transaction->cat_id            = $category->id;
                $transaction->category          = $category->name;
                // payerid = the client who paid (shown via transactionPayer() when hide_expense_client=1)
                // payeeid = also set so the full transaction() relation works too
                $transaction->payerid           = $client->id;
                $transaction->payeeid           = $client->id;
                $transaction->description       = 'Business Plan #' . $plan->id . ' — "' . $businessModel->title . '" (model #' . $businessModel->id . ')';
                $transaction->currency_iso_code = 'USD';
                $transaction->source            = 'business_plan';
                $transaction->c1                = (string) $plan->id;
                $transaction->c2                = (string) $businessModel->id;
                $transaction->save();

                LaravelLog::info('BusinessPlan: charged $' . $price . ' from client #' . $client->id
                    . ' for plan #' . $plan->id . ' (model: ' . $businessModel->title . ').'
                    . ' New balance: $' . $client->balance);
            }

            DB::commit();

        } catch (\Exception $e) {
            DB::rollBack();
            LaravelLog::error('BusinessPlan createBusinessPlan failed: ' . $e->getMessage());
            return response()->json(['success' => false, 'message' => 'Failed to create business plan. Please try again.'], 500);
        }

        // ── 7. Fire generation event (outside transaction — queue job) ────────
        event(new Generate($plan));
        Log::send(__('log.businessModelToPlan', ['idModel' => $businessModel->id, 'idPlan' => $plan->id]));

        return response()->json([
            'success'     => true,
            'id'          => $plan->id,
            'charged'     => $price,
            'balance'     => round((float) $client->fresh()->balance, 2),
        ]);
    }

    public function addCart(BusinessPlan $plan)
    {
        $userId = User::getAuth()->id;
        $plan = BusinessPlan::where('id', $plan->id)
            ->where('cid', $userId)
            ->firstOrFail();
        if($plan->toCart()) {
            Log::send(__('log.addCartPlan',['id' => $plan->id]));
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
