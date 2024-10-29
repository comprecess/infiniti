<?php

namespace App\Models\Catalog;

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

    public static function createOrUpdate(User $user, BlockExperienceTalentRequest $request)
    {
        $blockDatas = $request->getBlock();
        if(!$blockDatas) {
            return;
        }
        $ids = $user->blockExperience->pluck('id', 'id');

        foreach($blockDatas as $block) {
            if($block['id']) {
                $userBlock = UserBlock::find($block['id']);
                if(!$block) {
                    continue;
                }
                $ids->forget($block['id']);
            }else{
                $userBlock = new UserBlock();
            }
            $userBlock->id_catalog_user = $user->id;
            $userBlock->name = $block['name'];
            $userBlock->position = $block['position'];
            $userBlock->from = $block['periodFrom'];
            $userBlock->to = $block['periodTo'];
            $userBlock->save();
        }

        if($ids->count()) {
            UserBlock::whereIn('id', $ids->toArray())->delete();
        }

    }
}
