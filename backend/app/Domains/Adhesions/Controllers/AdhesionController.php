<?php

namespace App\Domains\Adhesions\Controllers;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class AdhesionController extends Controller
{
    /**
     * List all applications (Admin) or user's application (Member).
     */
    public function index(Request $request)
    {
        $user = $request->user();

        if ($user->role === 'super_admin') {
            $applications = DB::table('adhesion_applications')
                ->join('users', 'adhesion_applications.user_id', '=', 'users.id')
                ->select('adhesion_applications.*', 'users.name as applicant_name', 'users.email as applicant_email', 'users.phone as applicant_phone')
                ->orderBy('adhesion_applications.created_at', 'desc')
                ->get();
        } else {
            $applications = DB::table('adhesion_applications')
                ->where('user_id', $user->id)
                ->orderBy('created_at', 'desc')
                ->get();
        }

        return response()->json($applications);
    }

    /**
     * Submit or update user's application details.
     */
    public function store(Request $request)
    {
        $user = $request->user();

        $request->validate([
            'company_name' => 'required|string|max:255',
            'college' => 'required|string|max:100',
            'description' => 'nullable|string',
        ]);

        // Check if there is an existing application
        $existing = DB::table('adhesion_applications')
            ->where('user_id', $user->id)
            ->first();

        if ($existing) {
            // Update
            DB::table('adhesion_applications')
                ->where('id', $existing->id)
                ->update([
                    'company_name' => $request->company_name,
                    'college' => $request->college,
                    'description' => $request->description,
                    'status' => 'pending', // Reset status on updates
                    'updated_at' => now(),
                ]);

            return response()->json(['message' => 'Candidature mise à jour avec succès.']);
        }

        // Create new
        DB::table('adhesion_applications')->insert([
            'user_id' => $user->id,
            'company_name' => $request->company_name,
            'college' => $request->college,
            'description' => $request->description,
            'status' => 'pending',
            'created_at' => now(),
            'updated_at' => now(),
        ]);

        return response()->json(['message' => 'Candidature soumise avec succès.'], 201);
    }

    /**
     * Process/review application (Admin).
     */
    public function update(Request $request, $id)
    {
        $user = $request->user();

        if ($user->role !== 'super_admin') {
            return response()->json(['message' => 'Non autorisé.'], 403);
        }

        $request->validate([
            'status' => 'required|string|in:verified,approved,rejected',
            'notes' => 'nullable|string',
        ]);

        return DB::transaction(function () use ($request, $id) {
            $application = DB::table('adhesion_applications')->where('id', $id)->first();

            if (! $application) {
                return response()->json(['message' => 'Candidature introuvable.'], 404);
            }

            // Update application status
            DB::table('adhesion_applications')
                ->where('id', $id)
                ->update([
                    'status' => $request->status,
                    'notes' => $request->notes,
                    'updated_at' => now(),
                ]);

            // If approved, update active membership details
            if ($request->status === 'approved') {
                // Activate member
                DB::table('members')
                    ->where('user_id', $application->user_id)
                    ->update([
                        'status' => 'active',
                        'member_code' => 'CIEJ-2026-' . str_pad($application->user_id, 4, '0', STR_PAD_LEFT),
                        'updated_at' => now(),
                    ]);

                // Create initial cotisation row for 2026
                $memberId = DB::table('members')->where('user_id', $application->user_id)->value('id');
                
                // Check if cotisation already exists
                $existingCotisation = DB::table('cotisations')
                    ->where('member_id', $memberId)
                    ->where('year', '2026')
                    ->first();

                if (! $existingCotisation) {
                    DB::table('cotisations')->insert([
                        'member_id' => $memberId,
                        'year' => '2026',
                        'amount' => 50000.00, // 50,000 FCFA standard fee
                        'status' => 'unpaid',
                        'created_at' => now(),
                        'updated_at' => now(),
                    ]);
                }
            } elseif ($request->status === 'rejected') {
                // Suspend / deactivate member
                DB::table('members')
                    ->where('user_id', $application->user_id)
                    ->update([
                        'status' => 'inactive',
                        'updated_at' => now(),
                    ]);
            }

            return response()->json(['message' => 'Candidature traitée avec succès.']);
        });
    }
}
