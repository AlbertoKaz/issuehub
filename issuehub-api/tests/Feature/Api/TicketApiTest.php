<?php

use App\Models\Ticket;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Laravel\Sanctum\Sanctum;

uses(RefreshDatabase::class);

it('allows an authenticated user to create a ticket', function () {
    $user = User::factory()->create();

    Sanctum::actingAs($user);

    $response = $this->postJson('/api/tickets', [
        'title' => 'Cannot create issue',
        'description' => 'I am getting an error when trying to create a new issue from the dashboard.',
        'priority' => 'high',
    ]);

    $response->assertCreated()
        ->assertJsonPath('data.title', 'Cannot create issue')
        ->assertJsonPath('data.status', 'open')
        ->assertJsonPath('data.priority', 'high')
        ->assertJsonPath('data.user.id', $user->id);

    $this->assertDatabaseHas('tickets', [
        'user_id' => $user->id,
        'title' => 'Cannot create issue',
        'status' => 'open',
        'priority' => 'high',
    ]);
});

it('rejects ticket creation for guests', function () {
    $response = $this->postJson('/api/tickets', [
        'title' => 'Unauthorized request',
        'description' => 'This request should fail because no token was provided.',
        'priority' => 'medium',
    ]);

    $response->assertUnauthorized();
});

it('validates required fields when creating a ticket', function () {
    $user = User::factory()->create();

    Sanctum::actingAs($user);

    $response = $this->postJson('/api/tickets', []);

    $response->assertUnprocessable()
        ->assertJsonValidationErrors(['title', 'description']);
});

it('lists only tickets belonging to the authenticated user', function () {
    $user = User::factory()->create();
    $otherUser = User::factory()->create();

    Ticket::factory()->count(2)->create([
        'user_id' => $user->id,
    ]);

    Ticket::factory()->count(3)->create([
        'user_id' => $otherUser->id,
    ]);

    Sanctum::actingAs($user);

    $response = $this->getJson('/api/tickets');

    $response->assertOk()
        ->assertJsonCount(2, 'data');
});

it('shows a ticket owned by the authenticated user', function () {
    $user = User::factory()->create();
    $ticket = Ticket::factory()->create([
        'user_id' => $user->id,
    ]);

    Sanctum::actingAs($user);

    $response = $this->getJson("/api/tickets/{$ticket->id}");

    $response->assertOk()
        ->assertJsonPath('data.id', $ticket->id);
});

it('forbids viewing another users ticket', function () {
    $user = User::factory()->create();
    $otherUser = User::factory()->create();

    $ticket = Ticket::factory()->create([
        'user_id' => $otherUser->id,
    ]);

    Sanctum::actingAs($user);

    $response = $this->getJson("/api/tickets/{$ticket->id}");

    $response->assertForbidden();
});

it('updates a ticket owned by the authenticated user', function () {
    $user = User::factory()->create();

    $ticket = Ticket::factory()->create([
        'user_id' => $user->id,
        'status' => 'open',
        'priority' => 'medium',
    ]);

    Sanctum::actingAs($user);

    $response = $this->patchJson("/api/tickets/{$ticket->id}", [
        'status' => 'in_progress',
        'priority' => 'high',
    ]);

    $response->assertOk()
        ->assertJsonPath('data.status', 'in_progress')
        ->assertJsonPath('data.priority', 'high');
});

it('deletes a ticket owned by the authenticated user', function () {
    $user = User::factory()->create();

    $ticket = Ticket::factory()->create([
        'user_id' => $user->id,
    ]);

    Sanctum::actingAs($user);

    $response = $this->deleteJson("/api/tickets/{$ticket->id}");

    $response->assertOk();

    $this->assertDatabaseMissing('tickets', [
        'id' => $ticket->id,
    ]);
});

it('filters tickets by status', function () {
    $user = User::factory()->create();

    Ticket::factory()->create([
        'user_id' => $user->id,
        'status' => 'open',
        'title' => 'Open ticket',
    ]);

    Ticket::factory()->create([
        'user_id' => $user->id,
        'status' => 'closed',
        'title' => 'Closed ticket',
    ]);

    Sanctum::actingAs($user);

    $response = $this->getJson('/api/tickets?status=open');

    $response->assertOk()
        ->assertJsonCount(1, 'data')
        ->assertJsonPath('data.0.status', 'open');
});

it('filters tickets by priority', function () {
    $user = User::factory()->create();

    Ticket::factory()->create([
        'user_id' => $user->id,
        'priority' => 'high',
        'title' => 'High priority ticket',
    ]);

    Ticket::factory()->create([
        'user_id' => $user->id,
        'priority' => 'low',
        'title' => 'Low priority ticket',
    ]);

    Sanctum::actingAs($user);

    $response = $this->getJson('/api/tickets?priority=high');

    $response->assertOk()
        ->assertJsonCount(1, 'data')
        ->assertJsonPath('data.0.priority', 'high');
});

it('filters tickets by search term in title', function () {
    $user = User::factory()->create();

    Ticket::factory()->create([
        'user_id' => $user->id,
        'title' => 'Login error on dashboard',
    ]);

    Ticket::factory()->create([
        'user_id' => $user->id,
        'title' => 'Payment gateway timeout',
    ]);

    Sanctum::actingAs($user);

    $response = $this->getJson('/api/tickets?search=login');

    $response->assertOk()
        ->assertJsonCount(1, 'data')
        ->assertJsonPath('data.0.title', 'Login error on dashboard');
});
