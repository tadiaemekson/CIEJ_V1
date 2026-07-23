<?php

namespace App\Domains\Formations\Controllers;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class CourseController extends Controller
{
    /**
     * List all courses with nested modules and lessons.
     */
    public function index(Request $request)
    {
        $courses = DB::table('formations')->get();

        $courses = collect($courses)->map(function ($course) {
            $modules = DB::table('formation_modules')
                ->where('formation_id', $course->id)
                ->orderBy('order_index', 'asc')
                ->get();

            $course->modules = collect($modules)->map(function ($module) {
                $module->lessons = DB::table('formation_lessons')
                    ->where('module_id', $module->id)
                    ->orderBy('order_index', 'asc')
                    ->get();
                return $module;
            });

            $course->quizzes = DB::table('quizzes')
                ->where('formation_id', $course->id)
                ->get();

            return $course;
        });

        return response()->json($courses);
    }

    /**
     * Create a new course (Admin only).
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
            'instructor_name' => 'required|string|max:255',
        ]);

        $courseId = DB::table('formations')->insertGetId([
            'title' => $request->title,
            'description' => $request->description,
            'instructor_name' => $request->instructor_name,
            'created_at' => now(),
            'updated_at' => now(),
        ]);

        return response()->json([
            'message' => 'Formation créée avec succès.',
            'course_id' => $courseId
        ], 201);
    }

    /**
     * Add module to course (Admin only).
     */
    public function addModule(Request $request)
    {
        $user = $request->user();

        if ($user->role !== 'super_admin') {
            return response()->json(['message' => 'Non autorisé.'], 403);
        }

        $request->validate([
            'formation_id' => 'required|integer',
            'title' => 'required|string|max:255',
            'order_index' => 'required|integer',
        ]);

        $moduleId = DB::table('formation_modules')->insertGetId([
            'formation_id' => $request->formation_id,
            'title' => $request->title,
            'order_index' => $request->order_index,
            'created_at' => now(),
            'updated_at' => now(),
        ]);

        return response()->json([
            'message' => 'Module ajouté avec succès.',
            'module_id' => $moduleId
        ], 201);
    }

    /**
     * Add lesson to module (Admin only).
     */
    public function addLesson(Request $request)
    {
        $user = $request->user();

        if ($user->role !== 'super_admin') {
            return response()->json(['message' => 'Non autorisé.'], 403);
        }

        $request->validate([
            'module_id' => 'required|integer',
            'title' => 'required|string|max:255',
            'video_url' => 'nullable|string|max:255',
            'pdf_url' => 'nullable|string|max:255',
            'order_index' => 'required|integer',
        ]);

        DB::table('formation_lessons')->insert([
            'module_id' => $request->module_id,
            'title' => $request->title,
            'video_url' => $request->video_url,
            'pdf_url' => $request->pdf_url,
            'order_index' => $request->order_index,
            'created_at' => now(),
            'updated_at' => now(),
        ]);

        return response()->json(['message' => 'Leçon ajoutée avec succès.'], 201);
    }
}
