<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use App\Models\Resident\Project\Project as ProjectModel;

class Project extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        ProjectModel::with(['personals', 'personals.user'])->orderBy('id')->each(function($project){
           $personals = $project->personals->where('user', '!=', null)->pluck('user');
           $tasks = $project->tasks;
           $users = collect([]);
           foreach($tasks as $task) {
               $usersTask = collect([]);
               foreach(['admin', 'client'] as $userType) {
                   if($user = $task->{$userType}) {
                       $usersTask->push($user);
                   }
               }

               $task->setPersonal($usersTask);
               $users = $users->merge($usersTask);
           }

            $users = $users->unique(function($item){
               if($item) {
                   return $item::class . "_" . $item->id;
               }
            });

           if($personals->count()){
               $users = $users->merge($personals);
           }


           $project->setPersonal($users);
        });
    }
}
