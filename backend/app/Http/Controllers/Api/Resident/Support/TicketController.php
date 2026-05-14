<?php

namespace App\Http\Controllers\Api\Resident\Support;

use App\Http\Controllers\Api\Traits\CRUD;
use App\Http\Controllers\Api\Resident\ResidentController;
use App\Models\Notification;
use App\Models\Support\SysTicket;
use App\Models\Support\SysTicketDepartment;
use App\Models\Support\SysTicketReply;
use App\Models\Support\SysPredefinedReply;
use App\Models\User;
use App\Models\Users\Admin;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;

class TicketController extends ResidentController
{
    use CRUD;

    // Role shortname — registered in config/data.php
    const SHORTNAME = 'support';

    // ── Input data for create/edit forms ──
    public function inputData()
    {
        $departments = SysTicketDepartment::visible()->orderBy('sorder')->get()->map(fn($d) => ['id' => $d->id, 'name' => $d->dname]);
        $staff       = Admin::where('status', 'Active')->orderBy('fullname')->get(['id', 'fullname']);
        $statuses    = SysTicket::STATUSES;
        $urgencies   = SysTicket::URGENCIES;

        return response()->json([
            'status' => true,
            'data'   => compact('departments', 'staff', 'statuses', 'urgencies'),
        ]);
    }

    // ── List all tickets ──
    public function list(Request $request)
    {
        $admin = User::getAuth();

        $query = SysTicket::with(['department', 'assignee', 'client'])
            ->orderBy('id', 'desc');

        // Filter: only see own tickets unless admin has all_data access
        $allData = $admin->checkAccess('all_data', $this);
        if (!$allData) {
            $query->where(function ($q) use ($admin) {
                $q->where('aid', $admin->id)->orWhereNull('aid');
            });
        }

        // Filters from request
        if ($status = $request->input('status')) {
            $query->where('status', $status);
        }
        if ($did = $request->input('did')) {
            $query->where('did', $did);
        }
        if ($search = $request->input('search')) {
            $query->where(function ($q) use ($search) {
                $q->where('subject', 'like', "%{$search}%")
                  ->orWhere('tid', 'like', "%{$search}%");
            });
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

    // ── Single ticket with replies ──
    public function show(int $id)
    {
        $ticket = SysTicket::with(['department', 'assignee', 'client', 'replies'])->findOrFail($id);

        // Mark as read by admin
        $ticket->admin_read = 'yes';
        $ticket->save();

        return response()->json([
            'status' => true,
            'data'   => ['data' => $this->formatTicketFull($ticket)],
        ]);
    }

    // ── Create ticket (admin-side) ──
    public function store(Request $request)
    {
        $request->validate([
            'subject'  => 'required|string|max:500',
            'message'  => 'required|string',
            'did'      => 'nullable|integer|exists:sys_ticketdepartments,id',
            'aid'      => 'nullable|integer|exists:sys_users,id',
            'userid'   => 'nullable|integer|exists:crm_accounts,id',
            'urgency'  => 'nullable|in:' . implode(',', SysTicket::URGENCIES),
            'status'   => 'nullable|in:' . implode(',', SysTicket::STATUSES),
            'email'    => 'nullable|email',
            'cc'       => 'nullable|string',
            'bcc'      => 'nullable|string',
            'notes'    => 'nullable|string',
        ]);

        $ticket = new SysTicket();
        $ticket->did      = $request->did;
        $ticket->aid      = $request->aid;
        $ticket->userid   = $request->userid;
        $ticket->subject  = $request->subject;
        $ticket->message  = $request->message;
        $ticket->status   = $request->status  ?? SysTicket::STATUS_OPEN;
        $ticket->urgency  = $request->urgency ?? SysTicket::URGENCY_LOW;
        $ticket->email    = $request->email;
        $ticket->cc       = $request->cc;
        $ticket->bcc      = $request->bcc;
        $ticket->notes    = $request->notes;
        $ticket->source   = 'admin';
        $ticket->admin_read = 'yes';
        $ticket->save();

        return response()->json(['status' => true, 'data' => ['id' => $ticket->id]]);
    }

    // ── Update ticket ──
    public function update(Request $request, int $id)
    {
        $ticket = SysTicket::findOrFail($id);

        $request->validate([
            'did'     => 'nullable|integer|exists:sys_ticketdepartments,id',
            'aid'     => 'nullable|integer|exists:sys_users,id',
            'status'  => 'nullable|in:' . implode(',', SysTicket::STATUSES),
            'urgency' => 'nullable|in:' . implode(',', SysTicket::URGENCIES),
            'notes'   => 'nullable|string',
            'email'   => 'nullable|email',
            'cc'      => 'nullable|string',
            'bcc'     => 'nullable|string',
        ]);

        $oldAid = $ticket->aid;

        if ($request->has('did'))     $ticket->did     = $request->did;
        if ($request->has('aid'))     $ticket->aid     = $request->aid;
        if ($request->has('status'))  $ticket->status  = $request->status;
        if ($request->has('urgency')) $ticket->urgency = $request->urgency;
        if ($request->has('notes'))   $ticket->notes   = $request->notes;
        if ($request->has('email'))   $ticket->email   = $request->email;
        if ($request->has('cc'))      $ticket->cc      = $request->cc;
        if ($request->has('bcc'))     $ticket->bcc     = $request->bcc;
        $ticket->save();

        // Notify new assignee if changed
        if ($request->has('aid') && $request->aid && $request->aid != $oldAid) {
            $this->notifyAssignee($ticket);
        }

        return response()->json(['status' => true]);
    }

    // ── Add reply ──
    public function reply(Request $request, int $id)
    {
        $ticket = SysTicket::findOrFail($id);
        $admin  = User::getAuth();

        $request->validate([
            'message'    => 'required|string',
            'reply_type' => 'nullable|in:public,internal',
        ]);

        $reply = new SysTicketReply();
        $reply->tid        = $ticket->id;
        $reply->userid     = $admin->id;
        $reply->reply_type = $request->reply_type ?? SysTicketReply::TYPE_PUBLIC;
        $reply->message    = $request->message;
        $reply->replied_by = 'admin';
        $reply->admin      = $admin->fullname;
        $reply->admin_read = 'yes';
        $reply->save();

        // Update ticket status + last_reply
        $ticket->status     = SysTicket::STATUS_ANSWERED;
        $ticket->last_reply = now()->format('Y-m-d H:i:s');
        $ticket->client_read = null; // mark unread for client
        $ticket->save();

        // Notify client via in-app if public reply
        if ($reply->reply_type === SysTicketReply::TYPE_PUBLIC && $ticket->userid) {
            $this->notifyClient($ticket, $reply);
        }

        return response()->json([
            'status' => true,
            'data'   => ['data' => $this->formatReply($reply, $admin)],
        ]);
    }


    // ── Upload attachment to reply ──
    public function uploadAttachment(Request $request, int $id)
    {
        $ticket = SysTicket::findOrFail($id);
        $request->validate([
            'file'     => 'required|file|max:10240', // 10MB max
            'reply_id' => 'nullable|integer',
        ]);

        if ($request->reply_id) {
            $model = SysTicketReply::findOrFail($request->reply_id);
        } else {
            $model = $ticket;
        }

        $file = (new $model)->uploads($request->file('file'));

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

    // ── Delete ticket ──
    public function destroy(int $id)
    {
        $ticket = SysTicket::findOrFail($id);
        $ticket->replies()->delete();
        $ticket->delete();
        return response()->json(['status' => true]);
    }

    // ── Predefined replies ──
    public function predefinedList()
    {
        return response()->json([
            'status' => true,
            'data'   => SysPredefinedReply::orderBy('rname')->get(['id', 'rname', 'reply']),
        ]);
    }

    public function predefinedStore(Request $request)
    {
        $request->validate(['rname' => 'required|string|max:200', 'reply' => 'required|string']);
        $admin = User::getAuth();
        $item = SysPredefinedReply::create([
            'rname'      => $request->rname,
            'reply'      => $request->reply,
            'created_by' => $admin->id,
            'updated_by' => $admin->id,
        ]);
        return response()->json(['status' => true, 'data' => $item]);
    }

    public function predefinedUpdate(Request $request, int $id)
    {
        $request->validate(['rname' => 'required|string|max:200', 'reply' => 'required|string']);
        $item = SysPredefinedReply::findOrFail($id);
        $item->rname = $request->rname;
        $item->reply = $request->reply;
        $item->updated_by = User::getAuth()->id;
        $item->save();
        return response()->json(['status' => true]);
    }

    public function predefinedDestroy(int $id)
    {
        SysPredefinedReply::findOrFail($id)->delete();
        return response()->json(['status' => true]);
    }

    // ── Departments ──
    public function departmentList()
    {
        return response()->json([
            'status' => true,
            'data'   => SysTicketDepartment::orderBy('sorder')->get(),
        ]);
    }

    public function departmentStore(Request $request)
    {
        $request->validate([
            'dname'       => 'required|string|max:200',
            'email'       => 'nullable|email',
            'default_aid' => 'nullable|integer|exists:sys_users,id',
            'hidden'      => 'nullable|boolean',
        ]);
        $dept = SysTicketDepartment::create($request->only([
            'dname', 'description', 'email', 'default_aid',
            'hidden', 'host', 'port', 'username', 'password', 'encryption',
        ]));
        return response()->json(['status' => true, 'data' => $dept]);
    }

    public function departmentUpdate(Request $request, int $id)
    {
        $dept = SysTicketDepartment::findOrFail($id);
        $dept->fill($request->only([
            'dname', 'description', 'email', 'default_aid',
            'hidden', 'host', 'port', 'username', 'password', 'encryption',
        ]))->save();
        return response()->json(['status' => true]);
    }

    public function departmentDestroy(int $id)
    {
        SysTicketDepartment::findOrFail($id)->delete();
        return response()->json(['status' => true]);
    }

    // ── Private helpers ──

    private function notifyAssignee(SysTicket $ticket)
    {
        $assignee = Admin::find($ticket->aid);
        if (!$assignee) return;

        $message = "New ticket assigned to you: #{$ticket->id} — {$ticket->subject}";
        try {
            Notification::createMain(
                user: $assignee,
                model: $ticket,
                message: $message
            );
            $push = app(\App\Services\Push\Contracts\PushContract::class);
            $push->sendUser($assignee, 'Infiniti Support', $message, "/admin/support/tickets/view/ticket/{$ticket->id}");
        } catch (\Throwable $e) {
            Log::error('Push (ticket assign): ' . $e->getMessage());
        }
    }

    private function notifyClient(SysTicket $ticket, SysTicketReply $reply)
    {
        if (!$ticket->userid) return;
        $client = \App\Models\Users\Client::find($ticket->userid);
        if (!$client) return;

        $message = "Support replied to ticket #{$ticket->id}: {$ticket->subject}";
        try {
            \App\Models\Notification::createMain(
                user: $client,
                model: $ticket,
                message: $message,
                data: ['link' => "/client/tickets/view/ticket/{$ticket->id}"]
            );
        } catch (\Throwable $e) {
            \Illuminate\Support\Facades\Log::error('Notify client (ticket reply): ' . $e->getMessage());
        }
    }

    private function formatTicket(SysTicket $t): array
    {
        return [
            'id'         => $t->id,
            'subject'    => $t->subject,
            'status'     => $t->status,
            'urgency'    => $t->urgency,
            'priority'   => $t->urgency,
            'department' => $t->did ? ['id' => $t->did, 'name' => $t->department?->dname] : null,
            'did'        => $t->did,
            'assignee'   => $t->aid ? ['id' => $t->aid, 'name' => $t->assignee?->fullname] : null,
            'aid'        => $t->aid,
            'client'     => ['id' => $t->userid, 'name' => $t->client?->account ?? $t->email ?? 'Unknown'],
            'userid'     => $t->userid,
            'email'      => $t->email,
            'last_reply' => $t->last_reply,
            'created_at' => $t->created_at?->format('Y-m-d H:i:s'),
            'admin_read' => $t->admin_read,
        ];
    }

    private function formatTicketFull(SysTicket $t): array
    {
        $data = $this->formatTicket($t);
        $data['message'] = $t->message;
        $data['cc']      = $t->cc;
        $data['bcc']     = $t->bcc;
        $data['notes']   = $t->notes;
        $data['tags']    = $t->tags;
        $clientName = $t->client?->account ?? $t->email ?? 'Client';
        $data['replies'] = $t->replies->map(fn($r) => $this->formatReply($r, null, $clientName))->values()->toArray();
        return $data;
    }

    private function formatReply(SysTicketReply $r, $admin = null, $clientName = 'Client'): array
    {
        $isAdmin = $r->replied_by === 'admin';
        return [
            'id'          => $r->id,
            'message'     => $r->message,
            'body'        => $r->message,
            'reply_type'  => $r->reply_type,
            'replied_by'  => $r->replied_by,
            'author_info' => [
                'name' => $isAdmin ? ($r->admin ?? 'Admin') : $clientName,
                'type' => $isAdmin ? 'admin' : 'client',
            ],
            'created_at'  => $r->created_at?->format('Y-m-d H:i:s'),
            'admin_read'  => $r->admin_read,
        ];
    }
}
