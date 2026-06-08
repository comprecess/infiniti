<?php
// Regression Test for v0.9.12-beta (REG-001 fix)
// Run via: php artisan tinker < regression_test.php

use Illuminate\Support\Facades\Schema;
use Illuminate\Support\Facades\DB;

$results = [];

// TEST 1: Knowledge OS workspace endpoint
try {
    $controller = app('App\Http\Controllers\Api\Resident\Task\KnowledgeController');
    $request = new \Illuminate\Http\Request();
    $response = $controller->workspace($request, 208);
    $data = json_decode($response->getContent(), true);
    $results[] = ['Knowledge OS Workspace', array_key_exists('context', $data) ? 'PASS' : 'FAIL'];
} catch (\Exception $e) {
    $results[] = ['Knowledge OS Workspace', 'FAIL: ' . $e->getMessage()];
}

// TEST 2: Knowledge OS tables exist
$tables = ['sys_decision_records', 'sys_prompt_records', 'sys_validation_records', 'sys_task_contexts', 'sys_knowledge_assets', 'sys_outcome_records'];
$allExist = true;
foreach ($tables as $t) {
    if (!Schema::hasTable($t)) { $allExist = false; break; }
}
$results[] = ['Knowledge OS Tables (6/6)', $allExist ? 'PASS' : 'FAIL'];

// TEST 3: Decision records for task 208
$dr = DB::table('sys_decision_records')->where('task_id', 208)->count();
$results[] = ['Decision Records (Task 208)', $dr > 0 ? "PASS ($dr records)" : 'FAIL'];

// TEST 4: Project 45 accessible
$project = DB::table('sys_projects')->where('id', 45)->first();
$results[] = ['Project 45 Accessible', $project ? "PASS ($project->title)" : 'FAIL'];

// TEST 5: Tasks in project 45 accessible
$taskCount = DB::table('sys_tasks')->where('pid', 45)->count();
$results[] = ['Project 45 Tasks', $taskCount > 0 ? "PASS ($taskCount tasks)" : 'FAIL'];

// TEST 6: Auth routes registered
$routes = collect(app('router')->getRoutes()->getRoutes());
$authRoutes = $routes->filter(fn($r) => str_contains($r->uri(), 'login'));
$results[] = ['Auth Routes Registered', $authRoutes->count() > 0 ? "PASS ({$authRoutes->count()} routes)" : 'FAIL'];

// TEST 7: Knowledge OS API routes registered
$knowledgeRoutes = $routes->filter(fn($r) => str_contains($r->uri(), 'knowledge'));
$results[] = ['Knowledge OS Routes', $knowledgeRoutes->count() > 0 ? "PASS ({$knowledgeRoutes->count()} routes)" : 'FAIL'];

// TEST 8: Validation records exist
$vr = DB::table('sys_validation_records')->where('task_id', 208)->count();
$results[] = ['Validation Records (Task 208)', $vr > 0 ? "PASS ($vr records)" : 'FAIL'];

// TEST 9: Outcome records exist
$or = DB::table('sys_outcome_records')->where('task_id', 208)->count();
$results[] = ['Outcome Records (Task 208)', $or > 0 ? "PASS ($or records)" : 'FAIL'];

// TEST 10: Frontend dist has correct assets
$distExists = file_exists('/var/www/Infiniti/dist/index.html');
$cssExists = glob('/var/www/Infiniti/dist/assets/*.css');
$jsExists = glob('/var/www/Infiniti/dist/assets/*.js');
$results[] = ['Frontend Dist Valid', ($distExists && count($cssExists) > 0 && count($jsExists) > 0) ? 'PASS' : 'FAIL'];

// Output results
echo "\n=== REGRESSION VALIDATION v0.9.12-beta ===\n\n";
$passCount = 0;
$failCount = 0;
foreach ($results as $i => [$name, $status]) {
    $num = $i + 1;
    echo "  TEST $num: $name => $status\n";
    if (str_starts_with($status, 'PASS')) $passCount++;
    else $failCount++;
}
echo "\n  TOTAL: $passCount PASS / $failCount FAIL\n";
echo "  STATUS: " . ($failCount === 0 ? 'ALL TESTS PASSED' : 'SOME TESTS FAILED') . "\n\n";
