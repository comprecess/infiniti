<?php

namespace App\Http\Controllers\Api\Resident\Project\Pipeline;

use App\Http\Controllers\Controller;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class PipelineController extends Controller
{
    /**
     * Get pipeline leads for a project by type (investor or buyer).
     */
    public function index(int $projectId, string $type): JsonResponse
    {
        if (!in_array($type, ['investor', 'buyer'])) {
            return response()->json([
                'success' => false,
                'message' => 'Invalid pipeline type. Must be "investor" or "buyer".',
            ], 422);
        }

        $leads = DB::table('sys_leads')
            ->where('o', $type)
            ->where('trash', 0)
            ->orderByRaw("FIELD(status, 'Term Sheet', 'Due Diligence', 'Meeting Scheduled', 'Qualified', 'Initial Contact')")
            ->get();

        // Group by status for pipeline view
        $stages = [
            'Initial Contact' => [],
            'Qualified' => [],
            'Meeting Scheduled' => [],
            'Due Diligence' => [],
            'Term Sheet' => [],
        ];

        foreach ($leads as $lead) {
            $stage = $lead->status ?? 'Initial Contact';
            if (!isset($stages[$stage])) {
                $stages[$stage] = [];
            }
            $stages[$stage][] = [
                'id' => $lead->id,
                'name' => $lead->fullname,
                'company' => $lead->company,
                'email' => $lead->email,
                'phone' => $lead->phone,
                'source' => $lead->source,
                'stage' => $stage,
                'created_at' => $lead->created_at,
                'last_contact' => $lead->last_contact,
            ];
        }

        return response()->json([
            'success' => true,
            'data' => [
                'type' => $type,
                'total' => $leads->count(),
                'stages' => $stages,
                'leads' => $leads->map(function ($lead) {
                    return [
                        'id' => $lead->id,
                        'name' => $lead->fullname,
                        'company' => $lead->company,
                        'email' => $lead->email,
                        'phone' => $lead->phone,
                        'source' => $lead->source,
                        'stage' => $lead->status ?? 'Initial Contact',
                        'created_at' => $lead->created_at,
                        'last_contact' => $lead->last_contact,
                    ];
                }),
            ],
        ]);
    }
}
