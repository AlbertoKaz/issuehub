<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Requests\StoreTicketCommentRequest;
use App\Http\Resources\TicketCommentResource;
use App\Models\Ticket;
use App\Models\TicketComment;
use Illuminate\Http\Request;

class TicketCommentController extends Controller
{
    public function index(Request $request, Ticket $ticket)
    {
        $this->authorize('view', $ticket);

        $comments = $ticket->comments()
            ->with('user')
            ->latest()
            ->paginate(10);

        return TicketCommentResource::collection($comments);
    }

    public function store(StoreTicketCommentRequest $request, Ticket $ticket)
    {
        $this->authorize('view', $ticket);

        $comment = TicketComment::create([
            'ticket_id' => $ticket->id,
            'user_id' => $request->user()->id,
            'body' => $request->validated('body'),
        ]);

        $comment->load('user');

        return (new TicketCommentResource($comment))
            ->response()
            ->setStatusCode(201);
    }
}
