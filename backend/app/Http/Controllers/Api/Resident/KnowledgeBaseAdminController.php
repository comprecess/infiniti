<?php

namespace App\Http\Controllers\Api\Resident;

use Illuminate\Http\Request;
use App\Http\Controllers\Controller;
use Illuminate\Support\Facades\DB;

class KnowledgeBaseAdminController extends Controller
{
    // GET /api/v1/resident/knowledge-base/popular
    // Returns top questions from chat_gpt + pinned custom ones
    public function popular(Request $request)
    {
        $limit = $request->get('limit', 50);

        // Aggregate real questions from chat_gpt (client questions only, no AI replies)
        $chatQuestions = DB::table('chat_gpt')
            ->select(DB::raw('TRIM(message) as question'), DB::raw('COUNT(*) as ask_count'), DB::raw('MAX(created_at) as last_asked'))
            ->whereNotNull('client_id')
            ->whereNull('parent_id')
            ->whereNull('deleted_at')
            ->groupBy(DB::raw('TRIM(message)'))
            ->orderByDesc('ask_count')
            ->limit($limit)
            ->get();

        // Pinned/custom questions
        $pinned = DB::table('kb_popular_questions')
            ->orderByDesc('is_default')
            ->orderByDesc('ask_count')
            ->get();

        return response()->json([
            'status' => true,
            'data' => [
                'popular' => $chatQuestions,
                'pinned'  => $pinned,
            ]
        ]);
    }

    // DELETE /api/v1/resident/knowledge-base/popular/chat/{question_hash}
    // Soft-delete all chat_gpt records matching this question
    public function deletePopular(Request $request)
    {
        $question = $request->input('question');
        if (!$question) return response()->json(['status' => false, 'message' => 'question required'], 422);

        DB::table('chat_gpt')
            ->whereNotNull('client_id')
            ->whereNull('parent_id')
            ->where(DB::raw('TRIM(message)'), trim($question))
            ->update(['deleted_at' => now()]);

        return response()->json(['status' => true]);
    }

    // GET /api/v1/resident/knowledge-base/pinned
    public function pinned()
    {
        $pinned = DB::table('kb_popular_questions')
            ->orderByDesc('is_default')
            ->orderByDesc('ask_count')
            ->get();
        return response()->json(['status' => true, 'data' => $pinned]);
    }

    // POST /api/v1/resident/knowledge-base/pinned
    public function addPinned(Request $request)
    {
        $request->validate(['question' => 'required|string|max:500']);
        $id = DB::table('kb_popular_questions')->insertGetId([
            'question'   => $request->question,
            'ask_count'  => $request->ask_count ?? 0,
            'is_default' => $request->is_default ? 1 : 0,
            'created_at' => now(),
            'updated_at' => now(),
        ]);
        return response()->json(['status' => true, 'data' => ['id' => $id]]);
    }

    // PUT /api/v1/resident/knowledge-base/pinned/{id}
    public function updatePinned(Request $request, int $id)
    {
        $data = [];
        if ($request->has('question'))   $data['question']   = $request->question;
        if ($request->has('is_default')) $data['is_default'] = $request->is_default ? 1 : 0;
        if ($request->has('ask_count'))  $data['ask_count']  = $request->ask_count;
        $data['updated_at'] = now();

        DB::table('kb_popular_questions')->where('id', $id)->update($data);
        return response()->json(['status' => true]);
    }

    // DELETE /api/v1/resident/knowledge-base/pinned/{id}
    public function deletePinned(int $id)
    {
        DB::table('kb_popular_questions')->where('id', $id)->delete();
        return response()->json(['status' => true]);
    }
}
