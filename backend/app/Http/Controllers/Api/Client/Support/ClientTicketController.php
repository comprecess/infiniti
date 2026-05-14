<?php

namespace App\Http\Controllers\Api\Client\Support;

use App\Http\Controllers\Controller;
use App\Models\Support\SysTicket;
use App\Models\Support\SysTicketDepartment;
use App\Models\Support\SysTicketReply;
use App\Models\User;
use App\Models\Users\Admin;
use App\Models\Notification;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;

class ClientTicketController extends Controller
{
    // ── Input data for new ticket form ──
    public function inputData()
    {
        $departments = SysTicketDepartment::visible()
            ->orderBy('sorder')
            ->get(['id', 'dname']);

        $urgencies = SysTicket::URGENCIES;

        return response()->json([
            'status' => true,
            'data'   => compact('departments', 'urgencies'),
        ]);
    }

    // ── Client's own tickets ──
    public function list(Request $request)
    {
        $client = User::getAuth();

        $query = SysTicket::with(['department'])
            ->where('userid', $client->id)
            ->orderBy('id', 'desc');

        if ($status = $request->input('status')) {
            $query->where('status', $status);
        }

        $tickets = $query->paginate($request->input('amount', 20));

        return response()->json([
            'status' => true,
            'data'   => [
                'data'         => $tickets->map(fn($t) => $this->formatTicket($t)),
                'total'        => $tickets->total(),
                'per_page'     => $tickets->perPage(),
                'current_page' => $tickets->currentPage(),
                'last_page'    => $tickets->lastPage(),
            ],
        ]);
    }

    // ── Single ticket (client can only see their own) ──
    public function show(int $id)
    {
        $client = User::getAuth();
        $ticket = SysTicket::with(['department', 'replies'])
            ->where('userid', $client->id)
            ->findOrFail($id);

        // Mark as read by client
        $ticket->client_read = 'yes';
        $ticket->save();

        return response()->json([
            'status' => true,
            'data'   => ['data' => $this->formatTicketFull($ticket)],
        ]);
    }

    // ── Create new ticket ──
    public function store(Request $request)
    {
        $client = User::getAuth();

        $request->validate([
            'subject'  => 'required|string|max:500',
            'message'  => 'required|string',
            'did'      => 'nullable|integer|exists:sys_ticketdepartments,id',
            'urgency'  => 'nullable|in:' . implode(',', SysTicket::URGENCIES),
            'email'    => 'nullable|email',
            'cc'       => 'nullable|string',
        ]);

        // Auto-assign default admin from department (or fallback to first dept default)
        $defaultAid = null;
        if ($request->did) {
            $dept = SysTicketDepartment::find($request->did);
            $defaultAid = $dept?->default_aid;
        }
        if (!$defaultAid) {
            // Fallback: use default_aid from first available department
            $fallbackDept = SysTicketDepartment::whereNotNull('default_aid')->first();
            $defaultAid = $fallbackDept?->default_aid;
        }

        $ticket = new SysTicket();
        $ticket->userid  = $client->id;
        $ticket->did     = $request->did;
        $ticket->aid     = $defaultAid;
        $ticket->subject = $request->subject;
        $ticket->message = $request->message;
        $ticket->status  = SysTicket::STATUS_OPEN;
        $ticket->urgency = $request->urgency ?? SysTicket::URGENCY_LOW;
        $ticket->email   = $request->email ?? $client->email ?? '';
        $ticket->cc      = $request->cc;
        $ticket->source  = 'client';
        $ticket->client_read = 'yes';
        $ticket->save();

        // Notify assignee
        if ($ticket->aid) {
            $this->notifyAssignee($ticket);
        }

        return response()->json([
            'status' => true,
            'data'   => ['id' => $ticket->id],
        ]);
    }

    // ── Client reply ──
    public function reply(Request $request, int $id)
    {
        $client = User::getAuth();
        $ticket = SysTicket::where('userid', $client->id)->findOrFail($id);

        $request->validate(['message' => 'required|string']);

        $reply = new SysTicketReply();
        $reply->tid        = $ticket->id;
        $reply->userid     = $client->id;
        $reply->reply_type = SysTicketReply::TYPE_PUBLIC;
        $reply->message    = $request->message;
        $reply->replied_by = 'client';
        $reply->client_read = 'yes';
        $reply->save();

        // Update ticket status
        $ticket->status     = SysTicket::STATUS_IN_PROCESS;
        $ticket->last_reply = now()->format('Y-m-d H:i:s');
        $ticket->admin_read = null; // mark unread for admin
        $ticket->save();

        // Notify assigned admin
        if ($ticket->aid) {
            $this->notifyAssignee($ticket, 'Client replied');
        }

        return response()->json([
            'status' => true,
            'data'   => ['data' => $this->formatReply($reply)],
        ]);
    }

    // ── Private helpers ──

    private function notifyAssignee(SysTicket $ticket, string $prefix = 'New ticket')
    {
        $assignee = Admin::find($ticket->aid);
        if (!$assignee) return;

        $message = "{$prefix}: #{$ticket->id} — {$ticket->subject}";
        try {
            Notification::createMain(
                user: $assignee,
                model: $ticket,
                message: $message,
                data: ['link' => "/admin/support/tickets/view/ticket/{$ticket->id}"]
            );
            $push = app(\App\Services\Push\Contracts\PushContract::class);
            $push->sendUser($assignee, 'Infiniti Support', $message, "/admin/support/tickets/view/ticket/{$ticket->id}");
        } catch (\Throwable $e) {
            Log::error('Push (client ticket): ' . $e->getMessage());
        }
    }

    private function formatTicket(SysTicket $t): array
    {
        return [
            'id'         => $t->id,
            'subject'    => $t->subject,
            'status'     => $t->status,
            'urgency'    => $t->urgency,
            'department' => $t->department?->dname,
            'did'        => $t->did,
            'last_reply' => $t->last_reply,
            'created_at' => $t->created_at?->format('Y-m-d H:i:s'),
            'client_read'=> $t->client_read,
        ];
    }

    private function formatTicketFull(SysTicket $t): array
    {
        $data = $this->formatTicket($t);
        $data['message'] = $t->message;
        $data['email']   = $t->email;
        $data['cc']      = $t->cc;
        $data['replies'] = $t->replies
            ->filter(fn($r) => $r->reply_type === SysTicketReply::TYPE_PUBLIC)
            ->map(fn($r) => $this->formatReply($r))
            ->values()
            ->toArray();
        return $data;
    }

    private function formatReply(SysTicketReply $r): array
    {
        return [
            'id'         => $r->id,
            'message'    => $r->message,
            'reply_type' => $r->reply_type,
            'replied_by' => $r->replied_by,
            'admin'      => $r->admin,
            'created_at' => $r->created_at?->format('Y-m-d H:i:s'),
        ];
    }

    // ── Upload attachment ──
    public function uploadAttachment(Request $request, int $id)
    {
        $client = Client::getAuth();
        $ticket = SysTicket::where('userid', $client->id)->findOrFail($id);
        $request->validate(['file' => 'required|file|max:10240']);

        $file = $ticket->uploads($request->file('file'));

        return response()->json([
            'status' => true,
            'data'   => [
                'id'   => $file->id,
                'name' => $file->name,
                'ext'  => $file->ext,
                'link' => $file->getLink(),
            ],
        ]);
    }

}