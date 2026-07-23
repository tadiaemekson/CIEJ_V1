<?php

namespace App\Domains\Events\Controllers;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Str;

class EventController extends Controller
{
    /**
     * List all events.
     */
    public function index(Request $request)
    {
        $user = $request->user();
        
        $events = DB::table('events')
            ->orderBy('start_time', 'asc')
            ->get();

        // Attach registration status for standard members
        if ($user->role !== 'super_admin') {
            $registrations = DB::table('event_registrations')
                ->where('user_id', $user->id)
                ->pluck('event_id')
                ->toArray();

            $events = collect($events)->map(function ($event) use ($registrations) {
                $event->is_registered = in_array($event->id, $registrations);
                if ($event->is_registered) {
                    $event->ticket = DB::table('event_registrations')
                        ->where('event_id', $event->id)
                        ->where('user_id', auth()->id())
                        ->first();
                }
                return $event;
            });
        } else {
            // For admin, load registrations counts
            $events = collect($events)->map(function ($event) {
                $event->registrations_count = DB::table('event_registrations')
                    ->where('event_id', $event->id)
                    ->count();
                return $event;
            });
        }

        return response()->json($events);
    }

    /**
     * Create a new event (Admin only).
     */
    public function store(Request $request)
    {
        $user = $request->user();

        if ($user->role !== 'super_admin') {
            return response()->json(['message' => 'Non autorisé.'], 403);
        }

        $request->validate([
            'title' => 'required|string|max:255',
            'description' => 'nullable|string',
            'start_time' => 'required|date',
            'end_time' => 'required|date|after:start_time',
            'location' => 'required|string|max:255',
            'price' => 'required|numeric|min:0',
            'capacity' => 'nullable|integer|min:1',
        ]);

        DB::table('events')->insert([
            'title' => $request->title,
            'description' => $request->description,
            'start_time' => $request->start_time,
            'end_time' => $request->end_time,
            'location' => $request->location,
            'price' => $request->price,
            'capacity' => $request->capacity,
            'created_at' => now(),
            'updated_at' => now(),
        ]);

        return response()->json(['message' => 'Événement programmé avec succès.'], 201);
    }

    /**
     * Register standard member to an event.
     */
    public function register(Request $request, $id)
    {
        $user = $request->user();

        return DB::transaction(function () use ($user, $id) {
            $event = DB::table('events')->where('id', $id)->first();

            if (! $event) {
                return response()->json(['message' => 'Événement introuvable.'], 404);
            }

            // Check if already registered
            $existing = DB::table('event_registrations')
                ->where('event_id', $id)
                ->where('user_id', $user->id)
                ->first();

            if ($existing) {
                return response()->json(['message' => 'Déjà inscrit à cet événement.'], 400);
            }

            // Check capacity
            if ($event->capacity) {
                $count = DB::table('event_registrations')->where('event_id', $id)->count();
                if ($count >= $event->capacity) {
                    return response()->json(['message' => 'Cet événement est complet.'], 400);
                }
            }

            $ticketCode = 'CIEJ-TKT-' . strtoupper(Str::random(8));

            DB::table('event_registrations')->insert([
                'event_id' => $id,
                'user_id' => $user->id,
                'ticket_code' => $ticketCode,
                'attended' => false,
                'created_at' => now(),
                'updated_at' => now(),
            ]);

            return response()->json([
                'message' => 'Inscription enregistrée avec succès.',
                'ticket_code' => $ticketCode,
            ], 201);
        });
    }

    /**
     * Check-in / scan ticket code (Admin only).
     */
    public function checkIn(Request $request)
    {
        $user = $request->user();

        if ($user->role !== 'super_admin') {
            return response()->json(['message' => 'Non autorisé.'], 403);
        }

        $request->validate([
            'ticket_code' => 'required|string',
        ]);

        return DB::transaction(function () use ($request) {
            $registration = DB::table('event_registrations')
                ->join('users', 'event_registrations.user_id', '=', 'users.id')
                ->join('events', 'event_registrations.event_id', '=', 'events.id')
                ->where('event_registrations.ticket_code', $request->ticket_code)
                ->select('event_registrations.*', 'users.name as attendee_name', 'events.title as event_title')
                ->first();

            if (! $registration) {
                return response()->json(['message' => 'Ticket invalide ou inexistant.'], 404);
            }

            if ($registration->attended) {
                return response()->json([
                    'message' => 'Ce ticket a déjà été scanné.',
                    'details' => $registration
                ], 400);
            }

            DB::table('event_registrations')
                ->where('id', $registration->id)
                ->update([
                    'attended' => true,
                    'updated_at' => now(),
                ]);

            return response()->json([
                'message' => 'Check-in validé avec succès pour ' . $registration->attendee_name . ' !',
                'details' => $registration
            ]);
        });
    }
}
