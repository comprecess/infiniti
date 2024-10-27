<?php

namespace App\Models\Catalog;

use App\Http\Requests\Resident\Talents\BlockExperienceRequest;
use App\Http\Requests\Resident\Talents\BlockExperienceTalentRequest;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class UserBlock extends Model
{
    use HasFactory;

    protected $table = 'catalog_user_block';
    public $timestamps = false;

    protected $casts = [
        'from' => 'date',
        'to' => 'date',
    ];
    protected $fillable = [
        'name',
        'position',
        'from',
        'to',
        'responsibilities',
    ];

    public static function createByUser(User $user, BlockExperienceTalentRequest $request)
    {
        $blockDatas = $request->getBlock();
        foreach($blockDatas as $block) {
            $user->blockExperience()->create($block);
        }

    }
}
