<?php

namespace Database\Seeders;

use App\Models\BusinessModel\BusinessModel;
use App\Models\BusinessModel\Prop;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class SaasMarketplaceBusinessModel extends Seeder
{
    public function run(): void
    {
        // Idempotent — skip if already exists
        if (BusinessModel::where('title', 'SaaS Marketplace')->exists()) {
            $this->command->info('SaaS Marketplace already exists — skipping.');
            return;
        }

        $model = new BusinessModel();
        $model->title             = 'SaaS Marketplace';
        $model->start             = '2021-01-01';
        $model->description       = 'B2B SaaS for automating approvals in mid-size companies. Who pays, for what, when — and why they can\'t leave.';
        $model->full_description  = 'B2B platform connecting software buyers and sellers — automated billing, per-seat subscription and expansion-revenue upsell. Companies 200–2000 employees finally get rid of approval chaos in email and spreadsheets.';

        $model->market_analysis = '<p><strong>Confirmed facts</strong></p>
<ul>
  <li>Companies 500+ employees genuinely lose velocity on manual approval processes</li>
  <li>Template onboarding significantly accelerates time-to-value</li>
  <li>Expansion revenue grows after 2–3 workflows are activated per client</li>
</ul>
<p><strong>Market size</strong></p>
<ul>
  <li>Total Addressable Market: $4.2B</li>
  <li>Serviceable Addressable Market: $680M (mid-market segment)</li>
  <li>Primary verticals: Fintech, HR Tech, Logistics</li>
</ul>';

        $model->financial_model = '<p><strong>Revenue Streams</strong></p>
<ul>
  <li><strong>Per-seat Subscription</strong> — $12 / active user / month. Core recurring revenue.</li>
  <li><strong>Enterprise Modules</strong> — SSO, audit log, multi-entity, advanced analytics. $1,500–4,000 / month upsell after first activation.</li>
  <li><strong>API Access</strong> — Enterprise tier with pay-per-call or flat API pricing for third-party integrations.</li>
  <li><strong>Partner / Integrator Revenue Share</strong> — 15–20% rev share to implementation partners who bring and activate clients.</li>
  <li><strong>Implementation Services</strong> — One-time setup fee $3k–15k for large enterprise accounts.</li>
  <li><strong>White-label License</strong> — License the platform to other SaaS vendors or consulting firms. Annual flat fee.</li>
</ul>';

        $model->current_investors = '<p>No current institutional investors. Bootstrapped to $180k ARR. Seeking Seed round of $1.2M.</p>';

        $model->stages_implementation = '<p><strong>Implementation Steps</strong></p>
<ol>
  <li><strong>MVP Development</strong> — Core platform: accounts, workflow builder, basic search and auth. <em>3 months</em></li>
  <li><strong>Payment Integration</strong> — Stripe / PayPal, subscription billing, commission logic, invoicing. <em>2 months</em></li>
  <li><strong>Growth &amp; Analytics</strong> — Marketing automation, A/B testing, revenue dashboard, NPS tracking. <em>2 months</em></li>
  <li><strong>Scale &amp; Partnerships</strong> — Enterprise tier, API integrations, affiliate programme, white-label. <em>Ongoing</em></li>
</ol>
<p><strong>GTM Motion</strong></p>
<ul>
  <li><strong>Entry wedge:</strong> One process first — leave request, purchase or budget approval</li>
  <li><strong>Purchase trigger:</strong> Rapid growth, audit event, shared-services rollout, approval chaos</li>
  <li><strong>Sales motion:</strong> Demo-led · 2–5 meetings to close · template-based onboarding</li>
  <li><strong>Retention mechanic:</strong> Data + process integration + switching costs + template library</li>
  <li><strong>Channels:</strong> SEO content, Outbound, Partners, Webinars</li>
</ul>';

        $model->partnership_options = '<p><strong>Transfers well — keep as-is</strong></p>
<ul>
  <li>✓ Core product architecture</li>
  <li>✓ The pain point — approval chaos is universal</li>
  <li>✓ Subscription monetisation model</li>
  <li>✓ Module upsell logic after activation</li>
  <li>✓ NRR-driven growth mechanic</li>
</ul>
<p><strong>Needs localisation — adapt</strong></p>
<ul>
  <li>⚠ Pricing and packaging (market maturity varies)</li>
  <li>⚠ Language and local workflow templates</li>
  <li>⚠ Integrations with local HRIS / ERP vendors</li>
  <li>⚠ Security / compliance (GDPR, local laws)</li>
  <li>⚠ Partner channel and sales motion</li>
</ul>';

        // New passport fields
        $model->target_client = '<p><strong>Target client:</strong> Companies 200–2000 employees</p>
<p><strong>Buyer (decision maker):</strong> COO, Head of Operations, HR Director, CFO</p>
<p><strong>End user:</strong> Employees, team leads, HRBP, finance managers</p>
<p><strong>Job-to-be-Done:</strong> Approve requests, purchases, leaves and budgets — without email chaos</p>
<p><strong>Problem today:</strong> Processes live in Excel + email + Slack. Approvals get lost, no SLA, no visibility</p>
<p><strong>Current alternative:</strong> Excel + email + manual manager control</p>';

        $model->value_proposition = '<p><strong>Value Proposition:</strong> Faster approvals · less manual work · clear statuses · audit trail · fewer errors</p>
<p><strong>Moat:</strong> Deep process integration + switching costs + ops data + industry template library</p>';

        $model->revenue_logic = '<p><strong>Core logic:</strong> $12 / active user / month · min $900 MRR · enterprise modules $1,500–4,000 MRR</p>
<p><strong>Upsell trigger:</strong> After 2–3 workflows activated → offer enterprise modules</p>
<p><strong>NRR:</strong> 112% — existing clients grow revenue without new sales</p>';

        $model->unit_economics = '<p><strong>Key metrics</strong></p>
<ul>
  <li><strong>ARPA:</strong> $1,800 / month per client</li>
  <li><strong>Gross Margin:</strong> 82%</li>
  <li><strong>CAC:</strong> $6,000</li>
  <li><strong>Payback period:</strong> 6–7 months</li>
  <li><strong>LTV / CAC:</strong> 10.3×</li>
  <li><strong>NRR:</strong> 112%</li>
</ul>
<p><strong>Break-even:</strong> ~18 enterprise clients. Min MRR to launch: $900 (75 users).</p>
<p><strong>Main cost drivers:</strong> Engineering, cloud infra, CAC, customer success.</p>';

        $model->facts_hypotheses_risks = '<p><strong>✓ Confirmed facts</strong></p>
<ul>
  <li>Companies 500+ employees genuinely lose velocity on manual approval processes</li>
  <li>Template onboarding significantly accelerates time-to-value</li>
  <li>Expansion revenue grows after 2–3 workflows are activated per client</li>
</ul>
<p><strong>? Hypotheses — not yet proven</strong></p>
<ul>
  <li>New market will accept the same ARPA pricing tier</li>
  <li>Partners will own a meaningful share of implementation work</li>
  <li>Existing workflow templates will work locally with minimal changes</li>
</ul>
<p><strong>⚠ Risks to watch</strong></p>
<ul>
  <li>Long implementation cycle can kill unit economics — every client needs heavy setup</li>
  <li>High dependency on third-party integrations creates fragility</li>
  <li>Competition from large ERP suites bundling workflow tools as free add-ons</li>
</ul>';

        $model->setRandomNum('public', 32, true);
        $model->save();

        // Attach prop values
        $propValues = [
            'industries'    => ['B2B SaaS', 'HRTech', 'FinTech', 'Logistics &amp; Transport'],
            'technologies'  => ['React', 'Node.js', 'PostgreSQL'],
            'location'      => ['USA', 'EU'],
            'category'      => ['B2B SaaS'],
            'profitability' => ['High'],
            'price'         => [299],
            'age'           => [3],
        ];

        foreach ($propValues as $idName => $values) {
            $prop = Prop::where('id_name', $idName)->first();
            if (!$prop) continue;

            $children = $prop->children;
            foreach ($values as $val) {
                if ($children && $children->count()) {
                    // nested prop (e.g. price inside investments)
                    $child = $children->first();
                    if (in_array($child->type, ['integer', 'float'])) {
                        $valueModel = $child->values()->create(['value' => $val]);
                        $valueModel->users()->attach($model);
                    }
                } elseif (str_contains((string)($prop->type ?? ''), 'checkbox')) {
                    // find existing prop value by text, or skip
                    $existing = $prop->values()->where('value', $val)->first();
                    if ($existing) {
                        $existing->users()->attach($model);
                    } else {
                        // add new value if has_add=1
                        if ($prop->has_add) {
                            $new = $prop->values()->create(['value' => $val]);
                            $new->users()->attach($model);
                        }
                    }
                } else {
                    // select / integer — find by value
                    $existing = $prop->values()->where('value', $val)->first();
                    if ($existing) {
                        $existing->users()->attach($model);
                    }
                }
            }
        }

        $this->command->info("✅ SaaS Marketplace business model created (id={$model->id})");
    }
}
