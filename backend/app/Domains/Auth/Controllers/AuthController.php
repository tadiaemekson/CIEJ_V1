<?php

namespace App\Domains\Auth\Controllers;

use App\Http\Controllers\Controller;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\DB;
use Illuminate\Validation\ValidationException;

class AuthController extends Controller
{
    /**
     * Handle user login.
     */
    public function login(Request $request)
    {
        $request->validate([
            'email' => 'required|email',
            'password' => 'required|string',
        ]);

        $user = User::where('email', $request->email)->first();

        if (! $user || ! Hash::check($request->password, $user->password)) {
            throw ValidationException::withMessages([
                'email' => ['Les identifiants fournis sont incorrects.'],
            ]);
        }

        // Fetch associated member and enterprise details if any
        $member = DB::table('members')
            ->leftJoin('entreprises', 'members.entreprise_id', '=', 'entreprises.id')
            ->where('members.user_id', $user->id)
            ->select(
                'members.member_code',
                'members.status as member_status',
                'entreprises.name as company_name',
                'entreprises.sector as college'
            )
            ->first();

        $token = $user->createToken('ciej_auth_token')->plainTextToken;

        return response()->json([
            'token' => $token,
            'user' => [
                'id' => $user->id,
                'name' => $user->name,
                'email' => $user->email,
                'phone' => $user->phone,
                'role' => $user->role,
                'status' => $user->status,
                'member_code' => $member?->member_code ?? null,
                'company_name' => $member?->company_name ?? null,
                'college' => $member?->college ?? null,
            ]
        ]);
    }

    /**
     * Handle user registration and admission request.
     */
    public function register(Request $request)
    {
        $request->validate([
            'name' => 'required|string|max:255',
            'email' => 'required|string|email|max:255|unique:users',
            'password' => 'required|string|min:8',
            'phone' => 'nullable|string|max:20',
            'company_name' => 'required|string|max:255',
            'college' => 'required|string|max:100',
            'description' => 'nullable|string',
        ]);

        return DB::transaction(function () use ($request) {
            // 1. Create User
            $user = User::create([
                'name' => $request->name,
                'email' => $request->email,
                'phone' => $request->phone,
                'role' => 'membre',
                'status' => 'active',
                'password' => Hash::make($request->password),
            ]);

            // 2. Resolve college ID (or create college if missing, but it is seeded)
            $collegeId = DB::table('colleges')->where('name', $request->college)->value('id');

            // 3. Create Enterprise
            $entrepriseId = DB::table('entreprises')->insertGetId([
                'name' => $request->company_name,
                'sector' => $request->college,
                'college_id' => $collegeId,
                'created_at' => now(),
                'updated_at' => now(),
            ]);

            // 4. Create Member profile (status is pending until application approved)
            DB::table('members')->insert([
                'user_id' => $user->id,
                'entreprise_id' => $entrepriseId,
                'college_id' => $collegeId,
                'status' => 'pending',
                'created_at' => now(),
                'updated_at' => now(),
            ]);

            // 5. Create Adhesion Application
            DB::table('adhesion_applications')->insert([
                'user_id' => $user->id,
                'company_name' => $request->company_name,
                'college' => $request->college,
                'description' => $request->description,
                'status' => 'pending',
                'created_at' => now(),
                'updated_at' => now(),
            ]);

            $token = $user->createToken('ciej_auth_token')->plainTextToken;

            return response()->json([
                'token' => $token,
                'user' => [
                    'id' => $user->id,
                    'name' => $user->name,
                    'email' => $user->email,
                    'phone' => $user->phone,
                    'role' => $user->role,
                    'status' => $user->status,
                    'member_code' => null,
                    'company_name' => $request->company_name,
                    'college' => $request->college,
                    'description' => $request->description,
                ]
            ], 201);
        });
    }

    /**
     * Get authenticated user profile.
     */
    public function me(Request $request)
    {
        $user = $request->user();

        // Fetch associated member and enterprise details
        $member = DB::table('members')
            ->leftJoin('entreprises', 'members.entreprise_id', '=', 'entreprises.id')
            ->where('members.user_id', $user->id)
            ->select(
                'members.member_code',
                'members.status as member_status',
                'entreprises.name as company_name',
                'entreprises.sector as college',
                'entreprises.sector as description' // fallback
            )
            ->first();

        // Also fetch description from adhesion applications
        $application = DB::table('adhesion_applications')
            ->where('user_id', $user->id)
            ->orderBy('id', 'desc')
            ->first();

        return response()->json([
            'id' => $user->id,
            'name' => $user->name,
            'email' => $user->email,
            'phone' => $user->phone,
            'role' => $user->role,
            'status' => $user->status,
            'member_code' => $member?->member_code ?? null,
            'company_name' => $member?->company_name ?? null,
            'college' => $member?->college ?? null,
            'description' => $application?->description ?? null,
        ]);
    }

    /**
     * Logout user.
     */
    public function logout(Request $request)
    {
        $request->user()->currentAccessToken()->delete();

        return response()->json(['message' => 'Déconnecté avec succès.']);
    }
}
