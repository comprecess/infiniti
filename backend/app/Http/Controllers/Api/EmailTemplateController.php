<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\EmailTemplate;
use App\Models\Users\Client;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class EmailTemplateController extends Controller
{
    public function index(): JsonResponse
    {
        $templates = EmailTemplate::orderByDesc('id')->get();
        return response()->json(['status' => true, 'data' => $templates]);
    }

    public function store(Request $request): JsonResponse
    {
        $request->validate([
            'name'    => 'required|string|max:255',
            'subject' => 'required|string|max:255',
            'body'    => 'required|string',
        ]);

        $template = EmailTemplate::create($request->only('name', 'subject', 'body'));
        return response()->json(['status' => true, 'data' => $template], 201);
    }

    public function show(int $id): JsonResponse
    {
        $template = EmailTemplate::findOrFail($id);
        return response()->json(['status' => true, 'data' => $template]);
    }

    public function update(Request $request, int $id): JsonResponse
    {
        $template = EmailTemplate::findOrFail($id);
        $template->update($request->only('name', 'subject', 'body'));
        return response()->json(['status' => true, 'data' => $template]);
    }

    public function destroy(int $id): JsonResponse
    {
        EmailTemplate::findOrFail($id)->delete();
        return response()->json(['status' => true]);
    }

    public function render(Request $request, int $id): JsonResponse
    {
        $template = EmailTemplate::findOrFail($id);

        $subject = $template->subject;
        $body    = $template->body;

        $contactId = $request->query('contact_id');
        if ($contactId) {
            $contact = Client::find($contactId);
            if ($contact) {
                $vars = [
                    '{name}'          => $contact->account ?? '',
                    '{email}'         => $contact->email ?? '',
                    '{company}'       => $contact->company ?? '',
                    '{business_name}' => config('app.name', 'Infiniti'),
                ];
                $subject = str_replace(array_keys($vars), array_values($vars), $subject);
                $body    = str_replace(array_keys($vars), array_values($vars), $body);
            }
        }

        return response()->json(['status' => true, 'data' => ['subject' => $subject, 'body' => $body]]);
    }
}
