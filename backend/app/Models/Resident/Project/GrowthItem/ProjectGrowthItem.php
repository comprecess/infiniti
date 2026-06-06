<?php

namespace App\Models\Resident\Project\GrowthItem;

use App\Models\Resident\Project\Project;
use App\Models\Resident\Project\Task;
use App\Models\Resident\Invoices\Invoice;
use App\Models\Resident\Invoices\Offer;
use App\Models\Users\Admin;
use Illuminate\Database\Eloquent\Model;

class ProjectGrowthItem extends Model
{
    protected $table = 'clx_project_growth_items';

    const STATUS_PROPOSED = 'proposed';
    const STATUS_APPROVED = 'approved';
    const STATUS_IN_PROGRESS = 'in_progress';
    const STATUS_COMPLETED = 'completed';
    const STATUS_REJECTED = 'rejected';

    const STATUSES = [
        self::STATUS_PROPOSED,
        self::STATUS_APPROVED,
        self::STATUS_IN_PROGRESS,
        self::STATUS_COMPLETED,
        self::STATUS_REJECTED,
    ];

    const CATEGORY_FINANCIAL = 'financial';
    const CATEGORY_TECHNICAL = 'technical';
    const CATEGORY_OPERATIONAL = 'operational';
    const CATEGORY_TEAM = 'team';
    const CATEGORY_MARKETING = 'marketing';
    const CATEGORY_LEGAL = 'legal';
    const CATEGORY_PRODUCT = 'product';

    const CATEGORIES = [
        self::CATEGORY_FINANCIAL,
        self::CATEGORY_TECHNICAL,
        self::CATEGORY_OPERATIONAL,
        self::CATEGORY_TEAM,
        self::CATEGORY_MARKETING,
        self::CATEGORY_LEGAL,
        self::CATEGORY_PRODUCT,
    ];

    protected $fillable = [
        'project_id',
        'title',
        'description',
        'category',
        'impact_multiplier_increase',
        'impact_metric_increase',
        'confidence_percent',
        'estimated_cost',
        'estimated_duration_days',
        'status',
        'sys_task_id',
        'catalog_talent_id',
        'sys_invoice_id',
        'sys_offer_id',
        'created_by',
        'approved_at',
        'completed_at',
    ];

    protected $casts = [
        'impact_multiplier_increase' => 'decimal:2',
        'impact_metric_increase' => 'decimal:2',
        'confidence_percent' => 'integer',
        'estimated_cost' => 'decimal:2',
        'estimated_duration_days' => 'integer',
        'approved_at' => 'datetime',
        'completed_at' => 'datetime',
    ];

    // ─── Relationships ───────────────────────────────────────────────

    public function project()
    {
        return $this->belongsTo(Project::class, 'project_id');
    }

    public function task()
    {
        return $this->belongsTo(Task::class, 'sys_task_id');
    }

    public function invoice()
    {
        return $this->belongsTo(Invoice::class, 'sys_invoice_id');
    }

    public function offer()
    {
        return $this->belongsTo(Offer::class, 'sys_offer_id');
    }

    public function creator()
    {
        return $this->belongsTo(Admin::class, 'created_by');
    }

    // ─── Scopes ──────────────────────────────────────────────────────

    public function scopeForProject($query, int $projectId)
    {
        return $query->where('project_id', $projectId);
    }

    public function scopeActive($query)
    {
        return $query->whereNotIn('status', [self::STATUS_REJECTED]);
    }

    public function scopeByStatus($query, string $status)
    {
        return $query->where('status', $status);
    }

    public function scopeByCategory($query, string $category)
    {
        return $query->where('category', $category);
    }

    // ─── Business Logic ──────────────────────────────────────────────

    /**
     * Calculate the projected value impact of this single item.
     * Takes confidence into account.
     */
    public function getProjectedImpact(): float
    {
        $weight = $this->confidence_percent / 100;
        // Simplified: impact on total = metric_increase * current_multiplier + multiplier_increase * current_metric
        // For display purposes, we show the raw impact values
        return round(($this->impact_metric_increase + $this->impact_multiplier_increase) * $weight, 2);
    }

    /**
     * Calculate ROI: (projected value increase) / estimated_cost.
     */
    public function getROI(float $currentMetric = 0, float $currentMultiplier = 0): ?float
    {
        if ($this->estimated_cost <= 0) {
            return null;
        }

        // Value increase = new_total - current_total
        $currentTotal = $currentMetric * $currentMultiplier;
        $newTotal = ($currentMetric + $this->impact_metric_increase)
                  * ($currentMultiplier + $this->impact_multiplier_increase);
        $valueIncrease = $newTotal - $currentTotal;

        return round($valueIncrease / $this->estimated_cost, 1);
    }

    /**
     * Approve the growth item and set the approval timestamp.
     */
    public function approve(): self
    {
        $this->status = self::STATUS_APPROVED;
        $this->approved_at = now();
        $this->save();
        return $this;
    }

    /**
     * Mark as in progress (typically after task is created).
     */
    public function startExecution(): self
    {
        $this->status = self::STATUS_IN_PROGRESS;
        $this->save();
        return $this;
    }

    /**
     * Mark as completed and record the timestamp.
     */
    public function complete(): self
    {
        $this->status = self::STATUS_COMPLETED;
        $this->completed_at = now();
        $this->save();
        return $this;
    }

    /**
     * Reject the growth item.
     */
    public function reject(): self
    {
        $this->status = self::STATUS_REJECTED;
        $this->save();
        return $this;
    }

    /**
     * Check if this item is actionable (can be approved/started).
     */
    public function isActionable(): bool
    {
        return in_array($this->status, [self::STATUS_PROPOSED, self::STATUS_APPROVED]);
    }

    /**
     * Check if this item is linked to a task.
     */
    public function hasTask(): bool
    {
        return $this->sys_task_id !== null;
    }

    /**
     * Check if this item is linked to an offer.
     */
    public function hasOffer(): bool
    {
        return $this->sys_offer_id !== null;
    }
}
