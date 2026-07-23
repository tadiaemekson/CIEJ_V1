<?php

namespace App\Domains\Members\Controllers;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class MemberController extends Controller
{
    /**
     * Get searchable directory of all members.
     */
    public function index(Request $request)
    {
        $query = DB::table('members')
            ->join('users', 'members.user_id', '=', 'users.id')
            ->leftJoin('entreprises', 'members.entreprise_id', '=', 'entreprises.id')
            ->leftJoin('colleges', 'members.college_id', '=', 'colleges.id')
            ->select(
                'members.id as member_id',
                'members.member_code',
                'members.status as member_status',
                'users.name as name',
                'users.email as email',
                'users.phone as phone',
                'users.role as role',
                'entreprises.name as company_name',
                'entreprises.sector as sector',
                'colleges.name as college_name'
            );

        // Filter: only show active members to standard users, admins see all
        $user = $request->user();
        if ($user->role !== 'super_admin') {
            $query->where('members.status', 'active');
        }

        // Search parameter
        if ($request->has('search') && $request->search != '') {
            $search = $request->search;
            $query->where(function($q) use ($search) {
                $q->where('users.name', 'like', "%{$search}%")
                  ->orWhere('entreprises.name', 'like', "%{$search}%")
                  ->orWhere('members.member_code', 'like', "%{$search}%");
            });
        }

        // College parameter
        if ($request->has('college') && $request->college != '') {
            $query->where('colleges.name', $request->college);
        }

        $members = $query->orderBy('members.created_at', 'desc')->get();

        return response()->json($members);
    }

    /**
     * Update member status / role (Admin only).
     */
    public function update(Request $request, $id)
    {
        $currentUser = $request->user();

        if ($currentUser->role !== 'super_admin') {
            return response()->json(['message' => 'Non autorisé.'], 403);
        }

        $request->validate([
            'status' => 'required|string|in:active,suspended,inactive',
            'role' => 'nullable|string|in:membre,mentor,super_admin,president',
        ]);

        return DB::transaction(function () use ($request, $id) {
            $member = DB::table('members')->where('id', $id)->first();

            if (! $member) {
                return response()->json(['message' => 'Membre introuvable.'], 404);
            }

            // Update members table status
            DB::table('members')
                ->where('id', $id)
                ->update([
                    'status' => $request->status,
                    'updated_at' => now(),
                ]);

            // Update user table status and role if provided
            $userData = ['status' => $request->status === 'active' ? 'active' : 'inactive'];
            if ($request->has('role')) {
                $userData['role'] = $request->role;
            }

            DB::table('users')
                ->where('id', $member->user_id)
                ->update($userData);

            return response()->json(['message' => 'Statut du membre mis à jour avec succès.']);
        });
    }
}
