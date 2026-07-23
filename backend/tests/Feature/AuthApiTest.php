<?php

namespace Tests\Feature;

use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class AuthApiTest extends TestCase
{
    use RefreshDatabase;

    /**
     * Test user registration and workspace setup.
     */
    public function test_user_can_register(): void
    {
        $response = $this->postJson('/api/v1/auth/register', [
            'name' => 'Emmanuel Ken',
            'email' => 'emmanuel@example.com',
            'password' => 'secret1234',
            'phone' => '+237 688 888 888',
            'company_name' => 'Ken Innovation Lab',
            'college' => 'Startup',
            'description' => 'AI and Agentic solutions development.',
        ]);

        $response->assertStatus(201);
        $response->assertJsonStructure([
            'token',
            'user' => [
                'id',
                'name',
                'email',
                'phone',
                'role',
                'status',
                'company_name',
                'college',
            ]
        ]);

        $this->assertDatabaseHas('users', [
            'email' => 'emmanuel@example.com',
            'role' => 'membre',
        ]);

        $this->assertDatabaseHas('entreprises', [
            'name' => 'Ken Innovation Lab',
        ]);

        $this->assertDatabaseHas('adhesion_applications', [
            'company_name' => 'Ken Innovation Lab',
            'status' => 'pending',
        ]);
    }

    /**
     * Test login with seeded or created credentials.
     */
    public function test_user_can_login(): void
    {
        $user = User::create([
            'name' => 'Test User',
            'email' => 'test_login@example.com',
            'password' => bcrypt('password123'),
            'role' => 'membre',
            'status' => 'active',
        ]);

        $response = $this->postJson('/api/v1/auth/login', [
            'email' => 'test_login@example.com',
            'password' => 'password123',
        ]);

        $response->assertStatus(200);
        $response->assertJsonStructure([
            'token',
            'user' => [
                'id',
                'name',
                'email',
                'role',
            ]
        ]);
    }

    /**
     * Test me route with Sanctum authorization.
     */
    public function test_authenticated_user_can_fetch_profile(): void
    {
        $user = User::create([
            'name' => 'John Doe',
            'email' => 'john@example.com',
            'password' => bcrypt('password123'),
            'role' => 'membre',
            'status' => 'active',
        ]);

        $token = $user->createToken('test_token')->plainTextToken;

        $response = $this->withHeaders([
            'Authorization' => 'Bearer ' . $token,
        ])->getJson('/api/v1/auth/me');

        $response->assertStatus(200);
        $response->assertJson([
            'email' => 'john@example.com',
            'name' => 'John Doe',
        ]);
    }

    /**
     * Test logout route.
     */
    public function test_authenticated_user_can_logout(): void
    {
        $user = User::create([
            'name' => 'Jane Doe',
            'email' => 'jane@example.com',
            'password' => bcrypt('password123'),
            'role' => 'membre',
            'status' => 'active',
        ]);

        $token = $user->createToken('test_token')->plainTextToken;

        $response = $this->withHeaders([
            'Authorization' => 'Bearer ' . $token,
        ])->postJson('/api/v1/auth/logout');

        $response->assertStatus(200);
        $response->assertJson(['message' => 'Déconnecté avec succès.']);
    }
}
