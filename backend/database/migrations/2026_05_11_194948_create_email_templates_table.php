<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('email_templates', function (Blueprint $table) {
            $table->id();
            $table->string('name');
            $table->string('subject');
            $table->text('body');
            $table->timestamps();
        });

        // Seed 3 sample templates
        DB::table('email_templates')->insert([
            [
                'name'       => 'Welcome to Infiniti',
                'subject'    => 'Welcome, {name}! Let us get you started',
                'body'       => '<p>Hi {name},</p><p>Welcome to <strong>Infiniti</strong>! We are thrilled to have you on board.</p><p>Before we dive in, we would love to understand your goals better. Could you share:</p><ul><li>What is the main challenge you are looking to solve right now?</li><li>What does success look like for you in the next 3 months?</li><li>Are there any specific areas where you would like our support?</li></ul><p>Your answers will help us tailor our work together from day one.</p><p>Looking forward to hearing from you.</p><p>Best,<br>{business_name} Team</p>',
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'name'       => 'Follow-up: Next Steps',
                'subject'    => 'Following up on our conversation, {name}',
                'body'       => '<p>Hi {name},</p><p>Thank you for taking the time to speak with us. It was great learning more about {company} and the direction you are heading.</p><p>As discussed, here are the next steps:</p><ol><li>We will prepare a tailored proposal based on your goals</li><li>Please review and share any additional context that might be helpful</li><li>We will schedule a follow-up call to align on the details</li></ol><p>Feel free to reach out if anything comes up in the meantime.</p><p>Best regards,<br>{business_name} Team</p>',
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'name'       => 'Checking in',
                'subject'    => 'Checking in — how are things going, {name}?',
                'body'       => '<p>Hi {name},</p><p>It has been a while since we last connected, and I wanted to check in to see how things are going at {company}.</p><p>A few things have changed on our end that might be relevant to you — we have expanded our capabilities and would love to explore if there is a good fit.</p><p>Would you be open to a quick 20-minute call this week or next?</p><p>No pressure at all — just keen to reconnect and see if we can be useful.</p><p>Best,<br>{business_name} Team</p>',
                'created_at' => now(),
                'updated_at' => now(),
            ],
        ]);
    }

    public function down(): void
    {
        Schema::dropIfExists('email_templates');
    }
};
