<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        // 1. colleges
        Schema::create('colleges', function (Blueprint $table) {
            $table->id();
            $table->string('name')->unique();
            $table->text('description')->nullable();
            $table->timestamps();
        });

        // 2. entreprises
        Schema::create('entreprises', function (Blueprint $table) {
            $table->id();
            $table->string('name');
            $table->string('rccm')->nullable();
            $table->string('niu')->nullable();
            $table->string('address')->nullable();
            $table->string('phone')->nullable();
            $table->string('website')->nullable();
            $table->string('sector')->nullable();
            $table->foreignId('college_id')->nullable()->constrained('colleges')->onDelete('set null');
            $table->timestamps();
        });

        // 3. members
        Schema::create('members', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->unique()->constrained('users')->onDelete('cascade');
            $table->foreignId('entreprise_id')->nullable()->unique()->constrained('entreprises')->onDelete('set null');
            $table->foreignId('college_id')->nullable()->constrained('colleges')->onDelete('set null');
            $table->string('member_code', 50)->nullable()->unique();
            $table->string('status', 50)->default('pending'); // pending, active, suspended, inactive
            $table->string('membership_card_url')->nullable();
            $table->timestamps();
        });

        // 4. adhesion_applications
        Schema::create('adhesion_applications', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->constrained('users')->onDelete('cascade');
            $table->string('company_name');
            $table->string('college');
            $table->text('description')->nullable();
            $table->string('status', 50)->default('pending'); // pending, verified, approved, rejected
            $table->text('notes')->nullable();
            $table->timestamps();
        });

        // 5. adhesion_documents
        Schema::create('adhesion_documents', function (Blueprint $table) {
            $table->id();
            $table->foreignId('application_id')->constrained('adhesion_applications')->onDelete('cascade');
            $table->string('document_type'); // rccm, tax_card, id_card, photo, logo, etc.
            $table->string('file_path');
            $table->timestamps();
        });

        // 6. cotisations
        Schema::create('cotisations', function (Blueprint $table) {
            $table->id();
            $table->foreignId('member_id')->constrained('members')->onDelete('cascade');
            $table->string('year', 4);
            $table->decimal('amount', 12, 2);
            $table->string('status', 50)->default('unpaid'); // unpaid, paid, partially_paid
            $table->timestamps();
        });

        // 7. payments
        Schema::create('payments', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->constrained('users')->onDelete('cascade');
            $table->foreignId('cotisation_id')->nullable()->constrained('cotisations')->onDelete('set null');
            $table->decimal('amount', 12, 2);
            $table->string('payment_method', 50); // Mobile Money, Card, Cash
            $table->string('transaction_reference')->unique();
            $table->string('status', 50)->default('pending'); // pending, success, failed
            $table->timestamps();
        });

        // 8. events
        Schema::create('events', function (Blueprint $table) {
            $table->id();
            $table->string('title');
            $table->text('description')->nullable();
            $table->dateTime('start_time');
            $table->dateTime('end_time');
            $table->string('location')->nullable();
            $table->decimal('price', 12, 2)->default(0.00);
            $table->integer('capacity')->nullable();
            $table->timestamps();
        });

        // 9. event_registrations
        Schema::create('event_registrations', function (Blueprint $table) {
            $table->id();
            $table->foreignId('event_id')->constrained('events')->onDelete('cascade');
            $table->foreignId('user_id')->constrained('users')->onDelete('cascade');
            $table->string('ticket_code')->unique();
            $table->boolean('attended')->default(false);
            $table->timestamps();
        });

        // 10. formations
        Schema::create('formations', function (Blueprint $table) {
            $table->id();
            $table->string('title');
            $table->text('description')->nullable();
            $table->string('instructor_name')->nullable();
            $table->timestamps();
        });

        // 11. formation_modules
        Schema::create('formation_modules', function (Blueprint $table) {
            $table->id();
            $table->foreignId('formation_id')->constrained('formations')->onDelete('cascade');
            $table->string('title');
            $table->integer('order_index')->default(0);
            $table->timestamps();
        });

        // 12. formation_lessons
        Schema::create('formation_lessons', function (Blueprint $table) {
            $table->id();
            $table->foreignId('module_id')->constrained('formation_modules')->onDelete('cascade');
            $table->string('title');
            $table->string('video_url')->nullable();
            $table->string('pdf_url')->nullable();
            $table->integer('order_index')->default(0);
            $table->timestamps();
        });

        // 13. quizzes
        Schema::create('quizzes', function (Blueprint $table) {
            $table->id();
            $table->foreignId('formation_id')->constrained('formations')->onDelete('cascade');
            $table->string('title');
            $table->text('questions_json'); // JSON array of questions, choices, answers
            $table->integer('passing_score')->default(70);
            $table->timestamps();
        });

        // 14. mentoring_relations
        Schema::create('mentoring_relations', function (Blueprint $table) {
            $table->id();
            $table->foreignId('mentor_id')->constrained('users')->onDelete('cascade');
            $table->foreignId('mentee_id')->constrained('users')->onDelete('cascade');
            $table->string('status', 50)->default('active'); // active, completed, terminated
            $table->timestamps();
        });

        // 15. mentoring_sessions
        Schema::create('mentoring_sessions', function (Blueprint $table) {
            $table->id();
            $table->foreignId('relation_id')->constrained('mentoring_relations')->onDelete('cascade');
            $table->dateTime('scheduled_at');
            $table->string('topic');
            $table->text('notes')->nullable();
            $table->string('status', 50)->default('scheduled'); // scheduled, completed, cancelled
            $table->timestamps();
        });

        // 16. b2b_opportunities
        Schema::create('b2b_opportunities', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->constrained('users')->onDelete('cascade');
            $table->string('title');
            $table->text('description');
            $table->string('type', 50); // offer, demand
            $table->string('status', 50)->default('active');
            $table->timestamps();
        });

        // 17. messages
        Schema::create('messages', function (Blueprint $table) {
            $table->id();
            $table->foreignId('sender_id')->constrained('users')->onDelete('cascade');
            $table->foreignId('recipient_id')->constrained('users')->onDelete('cascade');
            $table->text('content');
            $table->boolean('is_read')->default(false);
            $table->timestamps();
        });

        // 18. fcs_applications
        Schema::create('fcs_applications', function (Blueprint $table) {
            $table->id();
            $table->foreignId('member_id')->constrained('members')->onDelete('cascade');
            $table->decimal('requested_amount', 12, 2);
            $table->decimal('approved_amount', 12, 2)->nullable();
            $table->text('project_description');
            $table->string('status', 50)->default('submitted'); // submitted, under_review, approved, rejected, disbursed
            $table->text('committee_notes')->nullable();
            $table->timestamps();
        });

        // 19. meetings (Governance)
        Schema::create('meetings', function (Blueprint $table) {
            $table->id();
            $table->string('title');
            $table->text('description')->nullable();
            $table->string('type', 50); // General Assembly, Board Meeting, Executive Committee
            $table->dateTime('scheduled_at');
            $table->string('meeting_url')->nullable();
            $table->string('minutes_path')->nullable(); // PV / Minutes file
            $table->timestamps();
        });

        // 20. votes
        Schema::create('votes', function (Blueprint $table) {
            $table->id();
            $table->foreignId('meeting_id')->constrained('meetings')->onDelete('cascade');
            $table->foreignId('user_id')->constrained('users')->onDelete('cascade');
            $table->string('resolution_title');
            $table->string('choice', 50); // yes, no, abstain
            $table->timestamps();
            
            $table->unique(['meeting_id', 'user_id', 'resolution_title']);
        });

        // 22. sanctions
        Schema::create('sanctions', function (Blueprint $table) {
            $table->id();
            $table->foreignId('member_id')->constrained('members')->onDelete('cascade');
            $table->string('type', 50); // warning, suspension, exclusion
            $table->text('reason');
            $table->date('start_date');
            $table->date('end_date')->nullable();
            $table->timestamps();
        });

        // 23. notifications
        Schema::create('notifications', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->constrained('users')->onDelete('cascade');
            $table->string('title');
            $table->text('content');
            $table->boolean('is_read')->default(false);
            $table->timestamps();
        });

        // 24. documents
        Schema::create('documents', function (Blueprint $table) {
            $table->id();
            $table->string('title');
            $table->string('category', 100); // Bylaws, Internal Regulation, Report
            $table->string('file_path');
            $table->timestamps();
        });

        // 25. partners
        Schema::create('partners', function (Blueprint $table) {
            $table->id();
            $table->string('name');
            $table->string('logo_url')->nullable();
            $table->string('website')->nullable();
            $table->timestamps();
        });

        // 26. news
        Schema::create('news', function (Blueprint $table) {
            $table->id();
            $table->string('title');
            $table->text('content');
            $table->string('image_url')->nullable();
            $table->timestamps();
        });

        // 27. audit_logs
        Schema::create('audit_logs', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->nullable()->constrained('users')->onDelete('set null');
            $table->string('action');
            $table->text('description')->nullable();
            $table->string('ip_address', 45)->nullable();
            $table->timestamps();
        });

        // 28. settings
        Schema::create('settings', function (Blueprint $table) {
            $table->id();
            $table->string('key')->unique();
            $table->text('value')->nullable();
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('settings');
        Schema::dropIfExists('audit_logs');
        Schema::dropIfExists('news');
        Schema::dropIfExists('partners');
        Schema::dropIfExists('documents');
        Schema::dropIfExists('notifications');
        Schema::dropIfExists('sanctions');
        Schema::dropIfExists('votes');
        Schema::dropIfExists('meetings');
        Schema::dropIfExists('fcs_applications');
        Schema::dropIfExists('messages');
        Schema::dropIfExists('b2b_opportunities');
        Schema::dropIfExists('mentoring_sessions');
        Schema::dropIfExists('mentoring_relations');
        Schema::dropIfExists('quizzes');
        Schema::dropIfExists('formation_lessons');
        Schema::dropIfExists('formation_modules');
        Schema::dropIfExists('formations');
        Schema::dropIfExists('event_registrations');
        Schema::dropIfExists('events');
        Schema::dropIfExists('payments');
        Schema::dropIfExists('cotisations');
        Schema::dropIfExists('adhesion_documents');
        Schema::dropIfExists('adhesion_applications');
        Schema::dropIfExists('members');
        Schema::dropIfExists('entreprises');
        Schema::dropIfExists('colleges');
    }
};
