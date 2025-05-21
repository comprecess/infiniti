<?php


namespace App\Services\Zoom;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Arr;
use Illuminate\Support\Facades\Log;


class WebHook extends Controller
{

    protected function createSecret($key = null)
    {
        $key = $key ?? Arr::get(\request()->payload, 'plainToken');
        $token = env('ZOOM_WEBHOOK');
        return hash_hmac('sha256', $key, $token);
    }

    public function index(Request $request)
    {
        Log::alert('***Zoom webhook***', $request->all());
        $data = $request->all();

        if ($event = Arr::get($data, 'event')) {
            $classAndMethod = explode('.', $event);
            $class = "\\App\\Services\\Zoom\\WebHook\\" . ucfirst($classAndMethod[0]);
            if(class_exists($class)) {
                $runClass = new $class();
                $method = snakeCaseToPascalCase($classAndMethod[1] ?? 'indexMethod');
                if(method_exists($runClass, $method)) {
                    return $runClass->{$method}($request);
                }
            }
        }

        return response()->json(['success' => true], 200);
    }

    protected function indexMethod()
    {
        return response()->json(['success' => false], 404);
    }
}
