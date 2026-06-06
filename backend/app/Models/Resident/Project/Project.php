<?php

namespace App\Models\Resident\Project;

use App\Models\Contracts\InsertDefaultValueInterface;
use App\Models\Resident\Invoices\Invoice;
use App\Models\Resident\Project\Template\ProjectTemplate;
use App\Models\Resident\Project\Valuation\ProjectValuation;
use App\Models\Resident\Project\GrowthItem\ProjectGrowthItem;
use App\Models\Resident\Transactions\Transaction;
use App\Models\Traits\CurrencyTrait;
use App\Models\Traits\DocumentTrait;
use App\Models\Traits\InsertDefaultValueTrait;
use App\Models\Traits\PersonalModelTrait;
use App\Models\Traits\UserTrait;
use App\Models\User;
use App\Models\Users\Admin;
use App\Models\Users\Client;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class Project extends Model implements InsertDefaultValueInterface
{
    use HasFactory, UserTrait, CurrencyTrait, InsertDefaultValueTrait, SoftDeletes, DocumentTrait, PersonalModelTrait;

    const STATUS = ['Draft','Started','Completed'];

    const TYPE = ['Internal Project', 'Hourly Rate', 'Fixed Rate'];

    protected $table = 'clx_projects';

    protected $adminColumn = 'admin_id';
    protected $clientColumn = 'contact_id';

    protected $currencyColumnName = 'currency';

    public $documentName = 'project';

    protected $casts = [
        'start_date' => 'date',
        'due_date' => 'date',
        'members' => 'array'
    ];

    public function tasks()
    {
        return $this->hasMany(Task::class, 'pid');
    }

    public function transactions()
    {
        return $this->hasMany(Transaction::class, 'project_id');
    }

    public function transactionExpense()
    {
        return $this->hasMany(Transaction::class, 'project_id')
            ->where('type', Transaction::TYPE[1]);
    }

    public function invoices()
    {
        return $this->hasMany(Invoice::class, 'pid');
    }

    public function manager()
    {
        return $this->belongsTo(Admin::class, 'project_manager_id');
    }

    public function log()
    {
        return $this->hasMany(ProjectLog::class, 'project_id');
    }

    public function isMy(?Client $client = null)
    {
        $user = User::getAuth();
        if($user instanceof Admin) {
            return false;
        }
        $client = $client ?? $user;
        return $this->contact_id == $client->id;
    }

    public function getTaskCompleted()
    {
        $count = $this->tasks()->count();
        $completed = $this->tasks()->whereIn('status', Task::STATUS_COMPLETED)->count();
        $percent = 0;

        if($count) {
            $percent = (int) ($completed / ($count / 100));
        }
        return [
            'completed' => $completed,
            'total' => $count,
            'percent' => $percent
        ];
    }

    public function getMembers()
    {
        if(!$this->members) {
            return collect([]);
        }

        return Admin::whereIn('id', $this->members)->with(['files', 'myRole'])->get();
    }

    /**
     * Get the project template.
     */
    public function template()
    {
        return $this->belongsTo(ProjectTemplate::class, 'template_code', 'code');
    }

    /**
     * Get all metadata for this project via clx_shared_preferences.
     */
    public function metadata()
    {
        return $this->hasMany(ProjectMetadata::class, 'relation_id')
            ->where('relation_type', ProjectMetadata::RELATION_TYPE);
    }

    /**
     * Check if this project uses a specific template.
     */
    public function hasTemplate(?string $code = null): bool
    {
        if ($code === null) {
            return !empty($this->template_code);
        }
        return $this->template_code === $code;
    }

    /**
     * Check if this is a legacy project (no template).
     */
    public function isLegacy(): bool
    {
        return empty($this->template_code);
    }

    /**
     * Get all valuations for this project.
     */
    public function valuations()
    {
        return $this->hasMany(ProjectValuation::class, 'project_id');
    }

    /**
     * Get the latest current valuation.
     */
    public function currentValuation()
    {
        return $this->hasOne(ProjectValuation::class, 'project_id')
            ->where('valuation_type', ProjectValuation::TYPE_CURRENT)
            ->latest();
    }

    /**
     * Get all growth items for this project.
     */
    public function growthItems()
    {
        return $this->hasMany(ProjectGrowthItem::class, 'project_id');
    }

    /**
     * Get active (non-rejected) growth items.
     */
    public function activeGrowthItems()
    {
        return $this->growthItems()->active();
    }

    public function getDefault(): array
    {
        return [
            'admin_id' => [User::getAuth()->id],
        ];
    }
}
