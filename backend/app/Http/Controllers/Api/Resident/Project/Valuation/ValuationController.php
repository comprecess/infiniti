<?php
namespace App\Http\Controllers\Api\Resident\Project\Valuation;

use App\Http\Controllers\Controller;
use App\Models\Resident\Project\Project;
use App\Models\Resident\Project\Valuation\ProjectValuation;
use App\Models\User;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class ValuationController extends Controller
{
    /**
     * Get the valuation dashboard for a project.
     * Returns: current, projected, best_case valuations + enriched Venture OS context.
     */
    public function dashboard(int $projectId): JsonResponse
    {
        $project = Project::findOrFail($projectId);
        $current = ProjectValuation::getLatestCurrent($projectId);
        $projected = ProjectValuation::calculateProjected($projectId);
        $bestCase = ProjectValuation::calculateBestCase($projectId);
        $history = ProjectValuation::forProject($projectId)
            ->ofType(ProjectValuation::TYPE_CURRENT)
            ->orderBy('created_at', 'desc')
            ->limit(12)
            ->get();

        // Growth items for context
        $growthItems = \App\Models\Resident\Project\GrowthItem\ProjectGrowthItem::forProject($projectId)
            ->whereNotIn('status', ['rejected'])
            ->get();

        // ─── Venture OS Enrichment ───────────────────────────────────
        $assumptions = $this->buildAssumptions($current, $projected, $growthItems);
        $confidenceExplanation = $this->buildConfidenceExplanation($current, $growthItems);
        $valueDrivers = $this->buildValueDrivers($current, $growthItems);
        $recommendation = $this->buildRecommendation($current, $projected, $bestCase, $growthItems);

        return response()->json([
            'success' => true,
            'data' => [
                'current' => $current,
                'projected' => $projected,
                'best_case' => $bestCase,
                'history' => $history,
                'metrics' => ProjectValuation::METRICS,
                // Venture OS panels
                'assumptions' => $assumptions,
                'confidence_explanation' => $confidenceExplanation,
                'value_drivers' => $valueDrivers,
                'recommendation' => $recommendation,
            ],
        ]);
    }

    /**
     * Build valuation assumptions panel data.
     */
    private function buildAssumptions($current, array $projected, $growthItems): array
    {
        if (!$current) {
            return ['arr' => 0, 'growth_rate' => 0, 'multiple' => 0, 'comparables' => []];
        }

        $baseValue = (float) $current->base_metric_value;
        $projectedValue = (float) ($projected['base_metric_value'] ?? 0);
        $growthRate = $baseValue > 0 ? round((($projectedValue - $baseValue) / $baseValue) * 100, 1) : 0;

        return [
            'arr' => $baseValue,
            'arr_projected' => $projectedValue,
            'growth_rate' => $growthRate,
            'multiple' => (float) $current->multiplier,
            'multiple_projected' => (float) ($projected['multiplier'] ?? $current->multiplier),
            'base_metric' => $current->base_metric_name,
            'comparables' => [
                ['name' => 'TradingView (2023)', 'multiple' => 12.0, 'arr' => 500000000, 'note' => 'Social trading platform'],
                ['name' => '3Commas (2022)', 'multiple' => 8.5, 'arr' => 15000000, 'note' => 'Crypto trading bots'],
                ['name' => 'Shrimpy (2022)', 'multiple' => 7.0, 'arr' => 4000000, 'note' => 'Portfolio rebalancing'],
                ['name' => 'Quadency (2021)', 'multiple' => 6.5, 'arr' => 2500000, 'note' => 'Multi-exchange trading'],
            ],
        ];
    }

    /**
     * Build confidence explanation.
     */
    private function buildConfidenceExplanation($current, $growthItems): array
    {
        if (!$current) {
            return ['overall' => 0, 'factors' => []];
        }

        $confidence = (int) $current->confidence_percent;
        $factors = [];

        // Revenue stability
        $factors[] = [
            'factor' => 'Revenue Stability',
            'impact' => $confidence >= 70 ? 'positive' : 'neutral',
            'score' => min(100, $confidence + 10),
            'explanation' => 'ARR-based metric provides recurring revenue visibility',
        ];

        // Growth plan execution
        $approvedItems = $growthItems->whereIn('status', ['approved', 'completed'])->count();
        $totalItems = $growthItems->count();
        $executionRate = $totalItems > 0 ? round(($approvedItems / $totalItems) * 100) : 0;
        $factors[] = [
            'factor' => 'Growth Plan Execution',
            'impact' => $executionRate >= 50 ? 'positive' : ($executionRate >= 25 ? 'neutral' : 'negative'),
            'score' => $executionRate,
            'explanation' => "{$approvedItems}/{$totalItems} growth items approved or completed",
        ];

        // Market multiple validation
        $multiple = (float) $current->multiplier;
        $multipleScore = $multiple <= 5 ? 90 : ($multiple <= 10 ? 70 : ($multiple <= 15 ? 50 : 30));
        $factors[] = [
            'factor' => 'Multiple Reasonableness',
            'impact' => $multipleScore >= 70 ? 'positive' : ($multipleScore >= 50 ? 'neutral' : 'negative'),
            'score' => $multipleScore,
            'explanation' => "x{$multiple} multiple " . ($multipleScore >= 70 ? 'within market range' : 'above market average, requires strong growth'),
        ];

        // Data completeness
        $hasNotes = !empty($current->notes);
        $dataScore = $hasNotes ? 80 : 60;
        $factors[] = [
            'factor' => 'Data Completeness',
            'impact' => $dataScore >= 70 ? 'positive' : 'neutral',
            'score' => $dataScore,
            'explanation' => $hasNotes ? 'Valuation methodology documented' : 'Add notes to improve transparency',
        ];

        return [
            'overall' => $confidence,
            'factors' => $factors,
        ];
    }

    /**
     * Build key value drivers.
     */
    private function buildValueDrivers($current, $growthItems): array
    {
        if (!$current) return [];

        $baseValue = (float) $current->base_metric_value;
        $multiplier = (float) $current->multiplier;
        $currentTotal = $baseValue * $multiplier;

        $drivers = [];

        // ARR Growth driver
        $arrGrowthItems = $growthItems->filter(fn($item) => 
            str_contains(strtolower($item->title ?? ''), 'arr') ||
            str_contains(strtolower($item->title ?? ''), 'revenue') ||
            str_contains(strtolower($item->category ?? ''), 'financial')
        );
        $arrImpact = $arrGrowthItems->sum('impact_metric_increase');
        $drivers[] = [
            'driver' => 'ARR Growth',
            'current_contribution' => round($baseValue * $multiplier, 0),
            'potential_impact' => round($arrImpact * $multiplier, 0),
            'status' => $arrImpact > 0 ? 'active' : 'planned',
            'icon' => 'trending_up',
            'description' => 'Revenue expansion through new customers and upsells',
        ];

        // Market Expansion
        $marketItems = $growthItems->filter(fn($item) =>
            str_contains(strtolower($item->title ?? ''), 'market') ||
            str_contains(strtolower($item->title ?? ''), 'expansion') ||
            str_contains(strtolower($item->category ?? ''), 'marketing')
        );
        $marketImpact = $marketItems->sum('impact_metric_increase');
        $drivers[] = [
            'driver' => 'Market Expansion',
            'current_contribution' => round($currentTotal * 0.2, 0),
            'potential_impact' => round($marketImpact * $multiplier, 0),
            'status' => $marketItems->count() > 0 ? 'active' : 'planned',
            'icon' => 'public',
            'description' => 'Geographic and segment expansion opportunities',
        ];

        // Strategic Partnerships
        $partnerItems = $growthItems->filter(fn($item) =>
            str_contains(strtolower($item->title ?? ''), 'partner') ||
            str_contains(strtolower($item->title ?? ''), 'integration')
        );
        $partnerMultiplierImpact = $partnerItems->sum('impact_multiplier_increase');
        $drivers[] = [
            'driver' => 'Strategic Partnerships',
            'current_contribution' => round($currentTotal * 0.15, 0),
            'potential_impact' => round($baseValue * $partnerMultiplierImpact, 0),
            'status' => $partnerItems->count() > 0 ? 'active' : 'planned',
            'icon' => 'handshake',
            'description' => 'Exchange integrations and B2B partnerships',
        ];

        // Product Milestones
        $productItems = $growthItems->filter(fn($item) =>
            str_contains(strtolower($item->title ?? ''), 'product') ||
            str_contains(strtolower($item->title ?? ''), 'feature') ||
            str_contains(strtolower($item->category ?? ''), 'technical')
        );
        $productImpact = $productItems->sum('impact_multiplier_increase');
        $drivers[] = [
            'driver' => 'Product Milestones',
            'current_contribution' => round($currentTotal * 0.25, 0),
            'potential_impact' => round($baseValue * $productImpact, 0),
            'status' => $productItems->count() > 0 ? 'active' : 'planned',
            'icon' => 'rocket_launch',
            'description' => 'Feature releases that drive retention and expansion',
        ];

        return $drivers;
    }

    /**
     * Build recommended next action based on valuation context.
     */
    private function buildRecommendation($current, array $projected, array $bestCase, $growthItems): array
    {
        if (!$current) {
            return [
                'action' => 'Create Initial Valuation',
                'rationale' => 'No valuation data exists. Create a baseline valuation to begin tracking.',
                'impact_estimate' => 0,
                'priority' => 'high',
                'category' => 'setup',
            ];
        }

        $confidence = (int) $current->confidence_percent;
        $currentTotal = (float) $current->total_value;
        $projectedTotal = (float) ($projected['total_value'] ?? 0);
        $bestCaseTotal = (float) ($bestCase['total_value'] ?? 0);
        $gap = $bestCaseTotal - $projectedTotal;

        $pendingItems = $growthItems->where('status', 'pending')->count();
        $approvedItems = $growthItems->where('status', 'approved')->count();

        // Decision logic
        if ($confidence < 60) {
            return [
                'action' => 'Strengthen Valuation Evidence',
                'rationale' => "Current confidence is {$confidence}%. Gather comparable transaction data, validate revenue metrics with audited financials, and document methodology to increase investor confidence.",
                'impact_estimate' => round($currentTotal * 0.15, 0),
                'impact_description' => '+15% valuation uplift from improved confidence',
                'priority' => 'high',
                'category' => 'validation',
                'steps' => [
                    'Obtain 3 comparable M&A transactions in crypto/fintech',
                    'Prepare audited financial statements for last 12 months',
                    'Document customer cohort retention data',
                    'Update valuation with validated metrics',
                ],
            ];
        }

        if ($pendingItems > 3) {
            return [
                'action' => 'Execute Pending Growth Initiatives',
                'rationale' => "{$pendingItems} growth items are pending approval. Executing these could bridge the gap between projected ({$this->formatVal($projectedTotal)}) and best-case ({$this->formatVal($bestCaseTotal)}) valuations.",
                'impact_estimate' => round($gap * 0.4, 0),
                'impact_description' => "Potential " . $this->formatVal(round($gap * 0.4, 0)) . " valuation increase",
                'priority' => 'high',
                'category' => 'execution',
                'steps' => [
                    'Review and prioritize pending growth items by ROI',
                    'Approve top 3 items with highest impact/cost ratio',
                    'Assign execution owners and deadlines',
                    'Track metric improvements weekly',
                ],
            ];
        }

        if ($approvedItems > 0 && $gap > $currentTotal * 0.3) {
            return [
                'action' => 'Accelerate Growth Plan to Close Valuation Gap',
                'rationale' => "The gap between projected and best-case is " . $this->formatVal($gap) . ". Accelerating approved growth items could capture 40-60% of this upside within 6 months.",
                'impact_estimate' => round($gap * 0.5, 0),
                'impact_description' => "Close " . $this->formatVal(round($gap * 0.5, 0)) . " of the valuation gap",
                'priority' => 'medium',
                'category' => 'growth',
                'steps' => [
                    'Increase resource allocation to approved growth items',
                    'Set 90-day sprint milestones for each initiative',
                    'Implement weekly progress reviews',
                    'Update valuation monthly based on actuals',
                ],
            ];
        }

        return [
            'action' => 'Prepare for Next Funding Round',
            'rationale' => "Current valuation is " . $this->formatVal($currentTotal) . " with {$confidence}% confidence. Position for Series A by building a compelling data room and investor narrative.",
            'impact_estimate' => round($currentTotal * 0.25, 0),
            'impact_description' => "Target " . $this->formatVal(round($currentTotal * 1.25, 0)) . " post-money valuation",
            'priority' => 'medium',
            'category' => 'fundraising',
            'steps' => [
                'Compile investor memo with growth trajectory',
                'Prepare financial model with 3-year projections',
                'Identify 10 target investors in crypto/fintech',
                'Schedule intro meetings through warm referrals',
            ],
        ];
    }

    private function formatVal(float $value): string
    {
        if ($value >= 1_000_000) return '$' . round($value / 1_000_000, 1) . 'M';
        if ($value >= 1_000) return '$' . round($value / 1_000, 0) . 'K';
        return '$' . round($value, 0);
    }

    /**
     * Create or update the current valuation.
     */
    public function store(Request $request, int $projectId): JsonResponse
    {
        $project = Project::findOrFail($projectId);
        $validated = $request->validate([
            'base_metric_name' => 'required|string|in:' . implode(',', ProjectValuation::METRICS),
            'base_metric_value' => 'required|numeric|min:0',
            'multiplier' => 'required|numeric|min:0.1|max:100',
            'confidence_percent' => 'sometimes|integer|min:0|max:100',
            'notes' => 'nullable|string|max:2000',
        ]);

        $user = User::getAuth();
        $valuation = new ProjectValuation();
        $valuation->project_id = $projectId;
        $valuation->valuation_type = ProjectValuation::TYPE_CURRENT;
        $valuation->base_metric_name = $validated['base_metric_name'];
        $valuation->base_metric_value = $validated['base_metric_value'];
        $valuation->multiplier = $validated['multiplier'];
        $valuation->confidence_percent = $validated['confidence_percent'] ?? 100;
        $valuation->notes = $validated['notes'] ?? null;
        $valuation->created_by = $user->id;
        $valuation->save();

        return response()->json([
            'success' => true,
            'data' => $valuation,
            'message' => 'Valuation created successfully.',
        ], 201);
    }

    /**
     * Get valuation history for a project.
     */
    public function history(int $projectId): JsonResponse
    {
        $valuations = ProjectValuation::forProject($projectId)
            ->orderBy('created_at', 'desc')
            ->get();

        return response()->json([
            'success' => true,
            'data' => $valuations,
        ]);
    }

    /**
     * Delete a valuation entry (only non-final).
     */
    public function destroy(int $projectId, int $valuationId): JsonResponse
    {
        $valuation = ProjectValuation::forProject($projectId)
            ->where('id', $valuationId)
            ->firstOrFail();

        if ($valuation->valuation_type === ProjectValuation::TYPE_FINAL) {
            return response()->json([
                'success' => false,
                'message' => 'Cannot delete a final valuation.',
            ], 403);
        }

        $valuation->delete();

        return response()->json([
            'success' => true,
            'message' => 'Valuation deleted.',
        ]);
    }
}
