<?php

namespace App\Models\Resident\Project\Valuation;

use App\Models\Resident\Project\Project;
use App\Models\Users\Admin;
use Illuminate\Database\Eloquent\Model;

class ProjectValuation extends Model
{
    protected $table = 'clx_project_valuations';

    const TYPE_CURRENT = 'current';
    const TYPE_PROJECTED = 'projected';
    const TYPE_BEST_CASE = 'best_case';
    const TYPE_FINAL = 'final';

    const TYPES = [
        self::TYPE_CURRENT,
        self::TYPE_PROJECTED,
        self::TYPE_BEST_CASE,
        self::TYPE_FINAL,
    ];

    const METRIC_EBITDA = 'EBITDA';
    const METRIC_MRR = 'MRR';
    const METRIC_ARR = 'ARR';
    const METRIC_REVENUE = 'Revenue';

    const METRICS = [
        self::METRIC_EBITDA,
        self::METRIC_MRR,
        self::METRIC_ARR,
        self::METRIC_REVENUE,
    ];

    protected $fillable = [
        'project_id',
        'valuation_type',
        'base_metric_name',
        'base_metric_value',
        'multiplier',
        'total_value',
        'confidence_percent',
        'notes',
        'created_by',
    ];

    protected $casts = [
        'base_metric_value' => 'decimal:2',
        'multiplier' => 'decimal:2',
        'total_value' => 'decimal:2',
        'confidence_percent' => 'integer',
    ];

    // ─── Relationships ───────────────────────────────────────────────

    public function project()
    {
        return $this->belongsTo(Project::class, 'project_id');
    }

    public function creator()
    {
        return $this->belongsTo(Admin::class, 'created_by');
    }

    // ─── Scopes ──────────────────────────────────────────────────────

    public function scopeOfType($query, string $type)
    {
        return $query->where('valuation_type', $type);
    }

    public function scopeLatest($query)
    {
        return $query->orderBy('created_at', 'desc');
    }

    public function scopeForProject($query, int $projectId)
    {
        return $query->where('project_id', $projectId);
    }

    // ─── Calculation ─────────────────────────────────────────────────

    /**
     * Recalculate total_value before saving.
     */
    public static function boot()
    {
        parent::boot();

        static::saving(function (self $valuation) {
            $valuation->total_value = round(
                $valuation->base_metric_value * $valuation->multiplier,
                2
            );
        });
    }

    /**
     * Get the latest current valuation for a project.
     */
    public static function getLatestCurrent(int $projectId): ?self
    {
        return static::forProject($projectId)
            ->ofType(self::TYPE_CURRENT)
            ->latest()
            ->first();
    }

    /**
     * Calculate projected valuation based on growth items.
     * Projected = Current + SUM(impact * confidence/100) for non-rejected items.
     */
    public static function calculateProjected(int $projectId): array
    {
        $current = static::getLatestCurrent($projectId);
        if (!$current) {
            return [
                'base_metric_value' => 0,
                'multiplier' => 0,
                'total_value' => 0,
                'confidence_percent' => 0,
            ];
        }

        $growthItems = \App\Models\Resident\Project\GrowthItem\ProjectGrowthItem::forProject($projectId)
            ->whereNotIn('status', ['rejected'])
            ->get();

        $metricIncrease = 0;
        $multiplierIncrease = 0;
        $totalConfidence = 0;
        $itemCount = 0;

        foreach ($growthItems as $item) {
            $weight = $item->confidence_percent / 100;
            $metricIncrease += $item->impact_metric_increase * $weight;
            $multiplierIncrease += $item->impact_multiplier_increase * $weight;
            $totalConfidence += $item->confidence_percent;
            $itemCount++;
        }

        $projectedMetric = $current->base_metric_value + $metricIncrease;
        $projectedMultiplier = $current->multiplier + $multiplierIncrease;
        $avgConfidence = $itemCount > 0 ? round($totalConfidence / $itemCount) : 100;

        return [
            'base_metric_name' => $current->base_metric_name,
            'base_metric_value' => round($projectedMetric, 2),
            'multiplier' => round($projectedMultiplier, 2),
            'total_value' => round($projectedMetric * $projectedMultiplier, 2),
            'confidence_percent' => $avgConfidence,
        ];
    }

    /**
     * Calculate best-case valuation (100% confidence on all items).
     */
    public static function calculateBestCase(int $projectId): array
    {
        $current = static::getLatestCurrent($projectId);
        if (!$current) {
            return [
                'base_metric_value' => 0,
                'multiplier' => 0,
                'total_value' => 0,
                'confidence_percent' => 100,
            ];
        }

        $growthItems = \App\Models\Resident\Project\GrowthItem\ProjectGrowthItem::forProject($projectId)
            ->whereNotIn('status', ['rejected'])
            ->get();

        $metricIncrease = $growthItems->sum('impact_metric_increase');
        $multiplierIncrease = $growthItems->sum('impact_multiplier_increase');

        $bestMetric = $current->base_metric_value + $metricIncrease;
        $bestMultiplier = $current->multiplier + $multiplierIncrease;

        return [
            'base_metric_name' => $current->base_metric_name,
            'base_metric_value' => round($bestMetric, 2),
            'multiplier' => round($bestMultiplier, 2),
            'total_value' => round($bestMetric * $bestMultiplier, 2),
            'confidence_percent' => 100,
        ];
    }
}
