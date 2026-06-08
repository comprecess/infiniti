<?php
namespace App\Http\Controllers\Api\Resident\Task;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\Resident\Project\Knowledge\DecisionRecord;
use App\Models\Resident\Project\Knowledge\PromptRecord;
use App\Models\Resident\Project\Knowledge\ValidationRecord;
use App\Models\Resident\Project\Knowledge\TaskContext;
use App\Models\Resident\Project\Knowledge\KnowledgeAsset;
use App\Models\Resident\Project\Knowledge\OutcomeRecord;

class KnowledgeController extends Controller
{
    // ==========================================
    // DECISION RECORDS (K-003)
    // ==========================================

    public function decisions(int $taskId)
    {
        return DecisionRecord::where('task_id', $taskId)
            ->orderBy('created_at', 'desc')
            ->get();
    }

    public function storeDecision(Request $request, int $taskId)
    {
        $validated = $request->validate([
            'title' => 'required|string|max:255',
            'context' => 'nullable|string',
            'decision' => 'nullable|string',
            'alternatives' => 'nullable|string',
            'owner_id' => 'nullable|integer',
            'decision_date' => 'nullable|date',
            'status' => 'nullable|string|in:Proposed,Accepted,Deprecated,Superseded',
        ]);

        $validated['task_id'] = $taskId;
        $record = DecisionRecord::create($validated);
        return response()->json($record, 201);
    }

    public function updateDecision(Request $request, int $taskId, int $id)
    {
        $record = DecisionRecord::where('task_id', $taskId)->findOrFail($id);
        $validated = $request->validate([
            'title' => 'sometimes|string|max:255',
            'context' => 'nullable|string',
            'decision' => 'nullable|string',
            'alternatives' => 'nullable|string',
            'owner_id' => 'nullable|integer',
            'decision_date' => 'nullable|date',
            'status' => 'nullable|string|in:Proposed,Accepted,Deprecated,Superseded',
        ]);
        $record->update($validated);
        return response()->json($record);
    }

    public function destroyDecision(int $taskId, int $id)
    {
        $record = DecisionRecord::where('task_id', $taskId)->findOrFail($id);
        $record->delete();
        return response()->json(['message' => 'Deleted']);
    }

    // ==========================================
    // PROMPT RECORDS (K-004)
    // ==========================================

    public function prompts(int $taskId)
    {
        return PromptRecord::where('task_id', $taskId)
            ->orderBy('execution_date', 'desc')
            ->get();
    }

    public function storePrompt(Request $request, int $taskId)
    {
        $validated = $request->validate([
            'objective' => 'required|string|max:255',
            'prompt_text' => 'required|string',
            'output_text' => 'nullable|string',
            'status' => 'nullable|string|in:Success,Partial,Failed',
            'execution_date' => 'nullable|date',
        ]);

        $validated['task_id'] = $taskId;
        $record = PromptRecord::create($validated);
        return response()->json($record, 201);
    }

    public function updatePrompt(Request $request, int $taskId, int $id)
    {
        $record = PromptRecord::where('task_id', $taskId)->findOrFail($id);
        $validated = $request->validate([
            'objective' => 'sometimes|string|max:255',
            'prompt_text' => 'sometimes|string',
            'output_text' => 'nullable|string',
            'status' => 'nullable|string|in:Success,Partial,Failed',
            'execution_date' => 'nullable|date',
        ]);
        $record->update($validated);
        return response()->json($record);
    }

    public function destroyPrompt(int $taskId, int $id)
    {
        $record = PromptRecord::where('task_id', $taskId)->findOrFail($id);
        $record->delete();
        return response()->json(['message' => 'Deleted']);
    }

    // ==========================================
    // VALIDATION RECORDS (K-005)
    // ==========================================

    public function validations(int $taskId)
    {
        return ValidationRecord::where('task_id', $taskId)
            ->orderBy('created_at', 'desc')
            ->get();
    }

    public function storeValidation(Request $request, int $taskId)
    {
        $validated = $request->validate([
            'finding' => 'required|string',
            'severity' => 'required|string|in:Blocker,High,Medium,Low,Pass',
            'resolution' => 'nullable|string',
            'release_id' => 'nullable|integer',
            'status' => 'nullable|string|in:Open,Resolved,Ignored',
        ]);

        $validated['task_id'] = $taskId;
        $record = ValidationRecord::create($validated);
        return response()->json($record, 201);
    }

    public function updateValidation(Request $request, int $taskId, int $id)
    {
        $record = ValidationRecord::where('task_id', $taskId)->findOrFail($id);
        $validated = $request->validate([
            'finding' => 'sometimes|string',
            'severity' => 'nullable|string|in:Blocker,High,Medium,Low,Pass',
            'resolution' => 'nullable|string',
            'release_id' => 'nullable|integer',
            'status' => 'nullable|string|in:Open,Resolved,Ignored',
        ]);
        $record->update($validated);
        return response()->json($record);
    }

    public function destroyValidation(int $taskId, int $id)
    {
        $record = ValidationRecord::where('task_id', $taskId)->findOrFail($id);
        $record->delete();
        return response()->json(['message' => 'Deleted']);
    }

    // ==========================================
    // CONTEXT RECORDS (K-002.5)
    // ==========================================

    public function context(int $taskId)
    {
        return TaskContext::where('task_id', $taskId)->first()
            ?? response()->json(null);
    }

    public function storeOrUpdateContext(Request $request, int $taskId)
    {
        $validated = $request->validate([
            'problem_statement' => 'nullable|string',
            'business_value' => 'nullable|string',
            'success_criteria' => 'nullable|string',
            'origin_source' => 'nullable|string|max:255',
        ]);

        $context = TaskContext::updateOrCreate(
            ['task_id' => $taskId],
            $validated
        );
        return response()->json($context);
    }

    // ==========================================
    // KNOWLEDGE ASSETS (K-002.5)
    // ==========================================

    public function assets(int $taskId)
    {
        return KnowledgeAsset::where('task_id', $taskId)
            ->orderBy('created_at', 'desc')
            ->get();
    }

    public function storeAsset(Request $request, int $taskId)
    {
        $validated = $request->validate([
            'title' => 'required|string|max:255',
            'asset_type' => 'required|string|max:50',
            'content' => 'nullable|string',
            'version' => 'nullable|string|max:50',
        ]);

        $validated['task_id'] = $taskId;
        $record = KnowledgeAsset::create($validated);
        return response()->json($record, 201);
    }

    public function updateAsset(Request $request, int $taskId, int $id)
    {
        $record = KnowledgeAsset::where('task_id', $taskId)->findOrFail($id);
        $validated = $request->validate([
            'title' => 'sometimes|string|max:255',
            'asset_type' => 'sometimes|string|max:50',
            'content' => 'nullable|string',
            'version' => 'nullable|string|max:50',
        ]);
        $record->update($validated);
        return response()->json($record);
    }

    public function destroyAsset(int $taskId, int $id)
    {
        $record = KnowledgeAsset::where('task_id', $taskId)->findOrFail($id);
        $record->delete();
        return response()->json(['message' => 'Deleted']);
    }

    // ==========================================
    // OUTCOME RECORDS (K-002.5)
    // ==========================================

    public function outcomes(int $taskId)
    {
        return OutcomeRecord::where('task_id', $taskId)
            ->orderBy('outcome_date', 'desc')
            ->get();
    }

    public function storeOutcome(Request $request, int $taskId)
    {
        $validated = $request->validate([
            'expected_result' => 'nullable|string',
            'actual_result' => 'nullable|string',
            'metrics' => 'nullable|array',
            'lessons_learned' => 'nullable|string',
            'outcome_date' => 'nullable|date',
        ]);

        $validated['task_id'] = $taskId;
        $record = OutcomeRecord::create($validated);
        return response()->json($record, 201);
    }

    public function updateOutcome(Request $request, int $taskId, int $id)
    {
        $record = OutcomeRecord::where('task_id', $taskId)->findOrFail($id);
        $validated = $request->validate([
            'expected_result' => 'nullable|string',
            'actual_result' => 'nullable|string',
            'metrics' => 'nullable|array',
            'lessons_learned' => 'nullable|string',
            'outcome_date' => 'nullable|date',
        ]);
        $record->update($validated);
        return response()->json($record);
    }

    public function destroyOutcome(int $taskId, int $id)
    {
        $record = OutcomeRecord::where('task_id', $taskId)->findOrFail($id);
        $record->delete();
        return response()->json(['message' => 'Deleted']);
    }

    // ==========================================
    // FULL TASK KNOWLEDGE (K-002 Workspace)
    // ==========================================

    public function workspace(int $taskId)
    {
        return response()->json([
            'context' => TaskContext::where('task_id', $taskId)->first(),
            'assets' => KnowledgeAsset::where('task_id', $taskId)->get(),
            'decisions' => DecisionRecord::where('task_id', $taskId)->orderBy('created_at', 'desc')->get(),
            'prompts' => PromptRecord::where('task_id', $taskId)->orderBy('execution_date', 'desc')->get(),
            'validations' => ValidationRecord::where('task_id', $taskId)->orderBy('created_at', 'desc')->get(),
            'outcomes' => OutcomeRecord::where('task_id', $taskId)->orderBy('outcome_date', 'desc')->get(),
        ]);
    }
}
