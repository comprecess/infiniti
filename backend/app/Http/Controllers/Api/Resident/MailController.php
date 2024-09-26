<?php


namespace App\Http\Controllers\Api\Resident;


use App\Services\Mail\Requests\MailSendRequest;
use App\Services\Mail\Requests\MailTemplateRequest;
use Illuminate\Support\Facades\Mail;

class MailController extends ResidentController
{
    public function template(MailTemplateRequest $request)
    {

        $template = $request->getTemplate();
        $result = $template->render();
        $result['variable'] = $template->defaultVariables();
        $result['adminEmail'] = auth()->user()->username;

        if($request->getMethod() == 'POST') {
            $requestSend = app(MailSendRequest::class);
            Mail::send('emails.email-template', ['content' => $requestSend->message], function($message) use($requestSend, $template){
                $message->to($requestSend->toEmail);
                $message->subject($requestSend->subject);

                foreach(['bccEmail' => 'bcc', 'ccEmail' => 'cc'] as $name => $method)
                if($requestSend->{$name}) {
                    $emails = explode(',', $requestSend->{$name});
                    foreach($emails as $email) {
                        $message->{$method}($email);
                    }
                }

                if($requestSend->attachFile) {
                    list($file, $name) = $template->getFile();
                    $message->attachData($file, $name);
                }
            });

            return response()->json(['success' => true]);
        }

        return response()->json($result);
    }
}
