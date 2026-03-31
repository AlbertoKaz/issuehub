<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Ticket;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class DashboardStatsController extends Controller
{
    public function __invoke(Request $request): JsonResponse
    {
        $user = $request->user();

        $baseQuery = Ticket::query()->where('user_id', $user->id);

        return response()->json([
            'total' => (clone $baseQuery)->count(),
            'open' => (clone $baseQuery)->where('status', 'open')->count(),
            'in_progress' => (clone $baseQuery)->where('status', 'in_progress')->count(),
            'closed' => (clone $baseQuery)->where('status', 'closed')->count(),
        ]);
    }
}
