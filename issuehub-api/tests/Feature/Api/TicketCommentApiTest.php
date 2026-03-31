<?php

use App\Models\Ticket;
use App\Models\User;
use App\Models\TicketComment;
use Laravel\Sanctum\Sanctum;
use Illuminate\Foundation\Testing\RefreshDatabase;

uses(RefreshDatabase::class);

it('lists comments for a ticket', function () {
    $user = User::factory()->create();
    $ticket = Ticket::factory()->create(['user_id' => $user->id]);

    TicketComment::factory()->count(2)->create([
        'ticket_id' => $ticket->id,
    ]);

    Sanctum::actingAs($user);

    $response = $this->getJson("/api/tickets/{$ticket->id}/comments");

    $response->assertOk()
        ->assertJsonCount(2, 'data');
});

it('allows user to add a comment to a ticket', function () {
    $user = User::factory()->create();
    $ticket = Ticket::factory()->create(['user_id' => $user->id]);

    Sanctum::actingAs($user);

    $response = $this->postJson("/api/tickets/{$ticket->id}/comments", [
        'body' => 'This is a test comment',
    ]);

    $response->assertCreated()
        ->assertJsonPath('data.body', 'This is a test comment');

    $this->assertDatabaseHas('ticket_comments', [
        'ticket_id' => $ticket->id,
        'user_id' => $user->id,
        'body' => 'This is a test comment',
    ]);
});
