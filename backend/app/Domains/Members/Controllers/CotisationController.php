<?php

namespace App\Domains\Members\Controllers;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Str;

class CotisationController extends Controller
{
    /**
     * List cotisations and summary stats.
     */
    public function index(Request $request)
    {
        $user = $request->user();

        if ($user->role === 'super_admin') {
            $cotisations = DB::table('cotisations')
                ->join('members', 'cotisations.member_id', '=', 'members.id')
                ->join('users', 'members.user_id', '=', 'users.id')
                ->leftJoin('entreprises', 'members.entreprise_id', '=', 'entreprises.id')
                ->select(
                    'cotisations.*',
                    'users.name as member_name',
                    'users.email as member_email',
                    'entreprises.name as company_name'
                )
                ->orderBy('cotisations.year', 'desc')
                ->get();

            // Summarize stats for dashboard
            $totalCollected = DB::table('cotisations')->where('status', 'paid')->sum('amount');
            $totalPending = DB::table('cotisations')->where('status', 'unpaid')->sum('amount');
            $paidCount = DB::table('cotisations')->where('status', 'paid')->count();
            $unpaidCount = DB::table('cotisations')->where('status', 'unpaid')->count();

            return response()->json([
                'cotisations' => $cotisations,
                'stats' => [
                    'total_collected' => $totalCollected,
                    'total_pending' => $totalPending,
                    'paid_count' => $paidCount,
                    'unpaid_count' => $unpaidCount,
                ]
            ]);
        } else {
            $memberId = DB::table('members')->where('user_id', $user->id)->value('id');

            $cotisations = DB::table('cotisations')
                ->where('member_id', $memberId)
                ->orderBy('year', 'desc')
                ->get();

            $payments = DB::table('payments')
                ->where('user_id', $user->id)
                ->orderBy('created_at', 'desc')
                ->get();

            return response()->json([
                'cotisations' => $cotisations,
                'payments' => $payments,
            ]);
        }
    }

    /**
     * Settle a cotisation via simulated Mobile Money / Card.
     */
    public function store(Request $request)
    {
        $user = $request->user();

        $request->validate([
            'cotisation_id' => 'required|integer',
            'payment_method' => 'required|string|in:Mobile Money,Card,Cash',
            'phone' => 'required_if:payment_method,Mobile Money|string|max:20',
        ]);

        return DB::transaction(function () use ($request, $user) {
            $cotisation = DB::table('cotisations')->where('id', $request->cotisation_id)->first();

            if (! $cotisation) {
                return response()->json(['message' => 'Cotisation introuvable.'], 404);
            }

            if ($cotisation->status === 'paid') {
                return response()->json(['message' => 'Cette cotisation est déjà réglée.'], 400);
            }

            $transactionRef = 'CIEJ-TX-' . strtoupper(Str::random(10));

            // 1. Create payment entry (directly success for simulation)
            DB::table('payments')->insert([
                'user_id' => $user->id,
                'cotisation_id' => $cotisation->id,
                'amount' => $cotisation->amount,
                'payment_method' => $request->payment_method,
                'transaction_reference' => $transactionRef,
                'status' => 'success',
                'created_at' => now(),
                'updated_at' => now(),
            ]);

            // 2. Update cotisation row
            DB::table('cotisations')
                ->where('id', $cotisation->id)
                ->update([
                    'status' => 'paid',
                    'updated_at' => now(),
                ]);

            return response()->json([
                'message' => 'Paiement effectué avec succès!',
                'reference' => $transactionRef,
            ], 201);
        });
    }

    /**
     * Manually approve payment transaction (Admin only).
     */
    public function verify(Request $request, $id)
    {
        $user = $request->user();

        if ($user->role !== 'super_admin') {
            return response()->json(['message' => 'Non autorisé.'], 403);
        }

        return DB::transaction(function () use ($id) {
            $payment = DB::table('payments')->where('id', $id)->first();

            if (! $payment) {
                return response()->json(['message' => 'Paiement introuvable.'], 404);
            }

            if ($payment->status === 'success') {
                return response()->json(['message' => 'Paiement déjà validé.'], 400);
            }

            DB::table('payments')
                ->where('id', $id)
                ->update([
                    'status' => 'success',
                    'updated_at' => now(),
                ]);

            if ($payment->cotisation_id) {
                DB::table('cotisations')
                    ->where('id', $payment->cotisation_id)
                    ->update([
                        'status' => 'paid',
                        'updated_at' => now(),
                    ]);
            }

            return response()->json(['message' => 'Paiement validé manuellement avec succès.']);
        });
    }
}
