<?php

namespace Database\Seeders;

use App\Models\User;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Hash;

class DatabaseSeeder extends Seeder
{
    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        // 1. Seed Colleges
        $colleges = [
            [
                'name' => 'Startup',
                'description' => 'Collège des technologies, innovation et entreprises à forte croissance.',
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'name' => 'PME-PMI',
                'description' => 'Collège des Petites et Moyennes Entreprises / Industries des services et commerce.',
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'name' => 'Artisanat',
                'description' => 'Collège des métiers d\'art, de la production locale, transformation et artisanat.',
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'name' => 'Agri-preneur',
                'description' => 'Collège de l\'agriculture, élevage, pêche et agro-alimentaire.',
                'created_at' => now(),
                'updated_at' => now(),
            ],
        ];

        DB::table('colleges')->insert($colleges);

        // Fetch colleges for referencing
        $startupCollegeId = DB::table('colleges')->where('name', 'Startup')->value('id');
        $pmeCollegeId = DB::table('colleges')->where('name', 'PME-PMI')->value('id');

        // 2. Seed Super Admin
        $admin = User::create([
            'name' => 'Secrétaire Général CIEJ',
            'email' => 'admin@ciej.org',
            'phone' => '+237 600 000 000',
            'role' => 'super_admin',
            'status' => 'active',
            'password' => Hash::make('admin1234'),
        ]);

        // 3. Seed Normal Member User
        $memberUser = User::create([
            'name' => 'Christian Ewane',
            'email' => 'christian@example.com',
            'phone' => '+237 677 777 777',
            'role' => 'membre',
            'status' => 'active',
            'password' => Hash::make('member1234'),
        ]);

        // 4. Seed Normal Member's Enterprise
        $entrepriseId = DB::table('entreprises')->insertGetId([
            'name' => 'Ewane Tech Solutions',
            'rccm' => 'RC/DLA/2026/B/1234',
            'niu' => 'M01234567890X',
            'address' => 'Douala, Cameroun',
            'phone' => '+237 677 777 777',
            'website' => 'https://ewanetech.com',
            'sector' => 'IT Services & Software development',
            'college_id' => $startupCollegeId,
            'created_at' => now(),
            'updated_at' => now(),
        ]);

        // 5. Create Member profile
        DB::table('members')->insert([
            'user_id' => $memberUser->id,
            'entreprise_id' => $entrepriseId,
            'college_id' => $startupCollegeId,
            'member_code' => 'CIEJ-2026-0001',
            'status' => 'active',
            'membership_card_url' => null,
            'created_at' => now(),
            'updated_at' => now(),
        ]);

        // Seed some basic news/blogs
        DB::table('news')->insert([
            [
                'title' => 'Lancement officiel de la plateforme numérique CIEJ V2',
                'content' => 'Nous sommes ravis d\'annoncer le lancement de notre nouvelle plateforme V2 qui intègre le Fonds de Croissance Stratégique (FCS), la gestion automatisée des cotisations, et l\'annuaire B2B.',
                'image_url' => null,
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'title' => 'Assemblée Générale Ordinaire de la CIEJ',
                'content' => 'L\'Assemblée Générale Ordinaire se tiendra le 15 août 2026. Tous les membres à jour de leurs cotisations sont invités à y participer physiquement ou via vote en ligne.',
                'image_url' => null,
                'created_at' => now(),
                'updated_at' => now(),
            ]
        ]);
    }
}
