<?php


namespace App\Models\Collection;


use App\Models\User;
use Illuminate\Database\Eloquent\Collection;

class PersonalCollection extends Collection
{

    public function diffUser(PersonalCollection $collection)
    {
        $del = clone $collection;
        $new = collect([]);
        $ext = collect([]);
        $this->each(function($item) use(&$del, $new, $ext){
            $user = $item->user;
            $s = $del->where(function($q) use($user){
               return get_class($q->user) == get_class($user) && $q?->user->id == $user?->id;
            })->first();
            if(!$s) {
                $new->push($item);
            }else{
                $ext->push($s);
                $del->pull($del->search(function($item) use($s){
                    return $s->id == $item->id;
                }));
            }
        });

        return ['new' => $new->pluck('user'), 'ext' => $ext->pluck('user'), 'del' => $del->pluck('user')];
    }

    public function getUser()
    {
        return $this->pluck('user');
    }
}
