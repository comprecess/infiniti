<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Facades\Auth;

class Log extends Model
{
    use HasFactory;

    protected $table = 'sys_logs';

    public $timestamps = false;

    protected ?User $user = null;

    public function setUser(User $user)
    {
        $this->user = $user;
        return $this;
    }

    public static function send($description, $type = null)
    {
        $user = User::getAuth();
        $log = new self();
        if($user) {
            $log->setUser($user);
        }
        $log->writeLog($description, $type);
    }

    public function writeLog($description, $type = null)
    {
        $msg = '';
        if (is_array($description)) {
            foreach ($description as $key => $value) {
                $msg .= $key . ' : ' . $value;
            }
        } else {
            $msg = $description;
        }

        $userid = 0;

        if($type === null) {
            if($this->user) {
                $type = $this->user->getNameClass();
                $userid = $this->user->id;
            } else {
                $type = 'No type';
            }
        }

        $this->date = now();
        $this->type = $type;
        $this->description = $msg;
        $this->userid = $userid;
        $this->ip = request()->ip();
        $this->save();

        return $this;
    }

}
