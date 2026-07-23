<?php

namespace App\Domains\FCS\Controllers;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class FcsController extends Controller
{
    /**
     * List FCS applications.
     */
    public function index(Request $request)
    {
        $user = $request->user();

        if ($user->role === 'super_admin') {
            $applications = DB::table('fcs_applications')
                ->join('members', 'fcs_applications.member_id', '=', 'members.id')
                ->join('users', 'members.user_id', '=', 'users.id')
                ->leftJoin('entreprises', 'members.entreprise_id', '=', 'entreprises.id')
                ->select(
                    'fcs_applications.*',
                    'users.name as applicant_name',
                    'users.email as applicant_email',
                    'entreprises.name as company_name'
                )
                ->orderBy('fcs_applications.created_at', 'desc')
                ->get();
        } else {
            $memberId = DB::table('members')->where('user_id', $user->id)->value('id');

            $applications = DB::table('fcs_applications')
                ->where('member_id', $memberId)
                ->orderBy('created_at', 'desc')
                ->get();
        }

        return response()->json($applications);
    }

    /**
     * Submit an FCS financing request (Member).
     */
    public function store(Request $request)
    {
        $user = $request->user();

        $request->validate([
            'requested_amount' => 'required|numeric|min:100000', // min 100K FCFA
            'project_description' => 'required|string',
        ]);

        $memberId = DB::table('members')->where('user_id', $user->id)->value('id');

        if (! $memberId) {
            return response()->json(['message' => 'Profil de membre introuvable.'], 404);
        }

        // Validate active membership status
        $member = DB::table('members')->where('id', $memberId)->first();
        if ($member->status !== 'active') {
            return response()->json(['message' => 'Votre dossier d\'adhésion doit être validé avant de solliciter le FCS.'], 400);
        }

        DB::table('fcs_applications')->insert([
            'member_id' => $memberId,
            'requested_amount' => $request->requested_amount,
            'project_description' => $request->project_description,
            'status' => 'submitted',
            'created_at' => now(),
            'updated_at' => now(),
        ]);

        return response()->json(['message' => 'Demande de financement soumise au FCS avec succès.'], 201);
    }

    /**
     * Evaluate loan request (Admin only).
     */
    public function update(Request $request, $id)
    {
        $user = $request->user();

        if ($user->role !== 'super_admin') {
            return response()->json(['message' => 'Non autorisé.'], 403);
        }

        $request->validate([
            'status' => 'required|string|in:under_review,approved,rejected,disbursed',
            'approved_amount' => 'nullable|numeric|min:0',
            'committee_notes' => 'nullable|string',
        ]);

        $application = DB::table('fcs_applications')->where('id', $id)->first();

        if (! $application) {
            return response()->json(['message' => 'Dossier FCS introuvable.'], 404);
        }

        DB::table('fcs_applications')
            ->where('id', $id)
            ->update([
                'status' => $request->status,
                'approved_amount' => $request->approved_amount ?? $application->approved_amount,
                'committee_notes' => $request->committee_notes,
                'updated_at' => now(),
            ]);

        return response()->json(['message' => 'Dossier FCS évalué avec succès.']);
    }
}
