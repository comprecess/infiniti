<?php

namespace Database\Seeders;

use App\Models\Catalog\Prop;
use App\Models\FileStorage;
use App\Models\Resident\Client\Company;
use App\Models\Users\Admin;
use App\Models\Users\Client;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Illuminate\Http\File;
use Illuminate\Support\Facades\DB;

class TransferringFiles extends Seeder
{
    /**
     * Run the database seeds.
     */
    protected $path = "storage";

    public function run(): void
    {
        $list = [
//            Company::class => ['companies', 'logo_url', 1],
//            Client::class => ['contacts', 'img', 0],
            Admin::class => ['pics', 'img', 0]
        ];

        foreach($list as $class => $data) {
            list($dir, $column, $hasPath) = $data;
            $path = "{$this->path}/{$dir}/";

            $class::all()->each(function($item) use($path, $column, $hasPath){
                if($item->{$column}) {
                    if($hasPath) {
                        $allPath = $path . $item->{$column};
                    } else {
                      $allPath = $item->{$column};
                    }
                    $file = $this->getFile($allPath);
                    if($file) {
                        $item->uploads($file);
                    }
                }
            });
        }
        try{
            $path = storage_path("app/" . FileStorage::NAME);
            system("/bin/chown -R www-data:www-data {$path}");
        } catch (\Exception $e) {
            $this->command->error($e->getMessage());
        }
    }

    private function getFile($filePath)
    {
        if($filePath) {
            try {
                return new File(storage_path($filePath), true);
            }catch (\Exception $e) {
                $this->command->error($e->getMessage());
            }
        }

        return null;
    }


}
