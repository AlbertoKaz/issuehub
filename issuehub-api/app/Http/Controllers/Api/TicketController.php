<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Requests\StoreTicketRequest;
use App\Http\Requests\UpdateTicketRequest;
use App\Http\Resources\TicketResource;
use App\Models\Ticket;
use Illuminate\Http\Request;

class TicketController extends Controller
{
    public function index(Request $request)
    {
        $this->authorize('viewAny', Ticket::class);

        $tickets = Ticket::query()
            ->with('user')
            ->where('user_id', $request->user()->id)
            ->when($request->filled('status'), function ($query) use ($request) {
                $query->where('status', $request->status);
            })
            ->when($request->filled('priority'), function ($query) use ($request) {
                $query->where('priority', $request->priority);
            })
            ->when($request->filled('search'), function ($query) use ($request) {
                $query->where('title', 'like', '%' . $request->search . '%');
            })
            ->latest()
            ->paginate(10);

        return TicketResource::collection($tickets);
    }

    public function store(StoreTicketRequest $request)
    {
        $this->authorize('create', Ticket::class);

        $ticket = Ticket::create([
            'user_id' => $request->user()->id,
            'title' => $request->validated('title'),
            'description' => $request->validated('description'),
            'status' => 'open',
            'priority' => $request->validated('priority') ?? 'medium',
        ]);

        $ticket->load('user');

        return (new TicketResource($ticket))
            ->response()
            ->setStatusCode(201);
    }

    public function show(Request $request, Ticket $ticket)
    {
        $this->authorize('view', $ticket);

        $ticket->load('user');

        return new TicketResource($ticket);
    }

    /*public function update(UpdateTicketRequest $request, Ticket $ticket)
    {
        $this->authorize('update', $ticket);

        $ticket->update($request->validated());
        $ticket->load('user');

        return new TicketResource($ticket);
    }*/

    public function update(Request $request, Ticket $ticket)
    {
        $this->authorize('update', $ticket);

        $validated = $request->validate([
            'title' => ['sometimes', 'required', 'string', 'max:255'],
            'description' => ['sometimes', 'required', 'string'],
            'status' => ['sometimes', 'required', 'in:open,in_progress,closed'],
            'priority' => ['sometimes', 'required', 'in:low,medium,high'],
        ]);

        $ticket->update($validated);

        return new TicketResource($ticket->fresh('user'));
    }


    public function destroy(Request $request, Ticket $ticket)
    {
        $this->authorize('delete', $ticket);

        $ticket->delete();

        return response()->json([
            'message' => 'Ticket deleted successfully.',
        ]);
    }
}
