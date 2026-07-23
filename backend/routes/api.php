<?php

use Illuminate\Support\Facades\Route;
use App\Domains\Auth\Controllers\AuthController;
use App\Domains\Adhesions\Controllers\AdhesionController;
use App\Domains\Members\Controllers\MemberController;
use App\Domains\Members\Controllers\CotisationController;
use App\Domains\Events\Controllers\EventController;
use App\Domains\Formations\Controllers\CourseController;
use App\Domains\FCS\Controllers\FcsController;

/*
|--------------------------------------------------------------------------
| API Routes - Version 1
|--------------------------------------------------------------------------
*/

Route::prefix('v1')->group(function () {
    
    // Guest Auth Routes
    Route::post('/auth/login', [AuthController::class, 'login']);
    Route::post('/auth/register', [AuthController::class, 'register']);
    
    // Protected Routes (Required Sanctum API Token)
    Route::middleware('auth:sanctum')->group(function () {
        
        // Profile & Auth
        Route::get('/auth/me', [AuthController::class, 'me']);
        Route::post('/auth/logout', [AuthController::class, 'logout']);
        
        // Adhesion Applications
        Route::get('/adhesions', [AdhesionController::class, 'index']);
        Route::post('/adhesions', [AdhesionController::class, 'store']);
        Route::put('/adhesions/{id}', [AdhesionController::class, 'update']);
        
        // Members & Directory
        Route::get('/members', [MemberController::class, 'index']);
        Route::put('/members/{id}', [MemberController::class, 'update']);
        
        // Cotisations & Payments
        Route::get('/cotisations', [CotisationController::class, 'index']);
        Route::post('/cotisations', [CotisationController::class, 'store']);
        Route::put('/cotisations/verify/{id}', [CotisationController::class, 'verify']);
        
        // Events
        Route::get('/events', [EventController::class, 'index']);
        Route::post('/events', [EventController::class, 'store']);
        Route::post('/events/register/{id}', [EventController::class, 'register']);
        Route::post('/events/checkin', [EventController::class, 'checkIn']);
        
        // Courses & Formations
        Route::get('/courses', [CourseController::class, 'index']);
        Route::post('/courses', [CourseController::class, 'store']);
        Route::post('/courses/modules', [CourseController::class, 'addModule']);
        Route::post('/courses/lessons', [CourseController::class, 'addLesson']);
        
        // FCS strategic funds
        Route::get('/fcs', [FcsController::class, 'index']);
        Route::post('/fcs', [FcsController::class, 'store']);
        Route::put('/fcs/{id}', [FcsController::class, 'update']);
    });
});
