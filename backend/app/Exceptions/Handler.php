<?php

namespace App\Exceptions;

use Illuminate\Auth\AuthenticationException;
use Illuminate\Database\Eloquent\ModelNotFoundException;
use Illuminate\Foundation\Exceptions\Handler as ExceptionHandler;
use Illuminate\Http\Exceptions\ThrottleRequestsException;
use Illuminate\Support\Facades\Log;
use Illuminate\Validation\ValidationException;
use Symfony\Component\HttpKernel\Exception\HttpException;
use Symfony\Component\HttpKernel\Exception\MethodNotAllowedHttpException;
use Symfony\Component\HttpKernel\Exception\NotFoundHttpException;
use Throwable;

class Handler extends ExceptionHandler
{
    /**
     * The list of the inputs that are never flashed to the session on validation exceptions.
     *
     * @var array<int, string>
     */
    protected $dontFlash = [
        'current_password',
        'password',
        'password_confirmation',
    ];

    /**
     * Register the exception handling callbacks for the application.
     */
    public function register(): void
    {
        $this->reportable(function (Throwable $e) {
            //
        });
    }

    public function render($request, Throwable $exception)
    {
        $message = [
            403 => 'No access',
            401 => 'Unauthenticated'
        ];

        if($request->expectsJson()
            && (
                $exception instanceof NotFoundHttpException
                || $exception instanceof ModelNotFoundException
                || $exception instanceof MethodNotAllowedHttpException
            )
            ) {
            return response()->json([
                'message' => 'Not Found',
            ], 404);
        }

        if($exception instanceof ThrottleRequestsException) {
            return response()->json([
                'message' => 'Limit request',
            ], 509);
        }

        if($exception instanceof HttpException && in_array($exception->getStatusCode(), array_keys($message))) {
            $data = [
                'message' => $message[$exception->getStatusCode()] ?? 'Error'
            ];
            if($exception->getMessage()) {
                $data['shortname'] = $exception->getMessage();
            }
            return response()->json($data, $exception->getStatusCode());
        }

        if ($request->expectsJson()
            && !(
                $exception instanceof ValidationException
                || $exception instanceof AuthenticationException
            )) {

            Log::error($exception->getMessage(), ['errorAll' => $exception->getTraceAsString()]);

            return response()->json([
                'error' => $exception->getCode(),
                'message' => 'Error',
            ], 500);
        }

        Log::alert($request->getRequestUri());

        return parent::render($request, $exception);
    }
}
