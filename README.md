# उद्यम Track

A complete government-oriented frontend connected to the supplied FastAPI backend.
The backend Python files, API routes and database schema are unchanged.
This version contains fictional trainee names and company profiles in the demo database.
Existing IDs, locations, employment outcomes and numerical metrics are preserved.

## Run on Windows

Open a terminal in this folder (containing backend, frontend and skilltrack.db).

    python -m pip install -r requirements.txt
    python -m uvicorn backend.main:app --reload

Open http://127.0.0.1:8000 and press Ctrl + Shift + R after replacing an older frontend.
Alternatively use python server_run.py, your original launcher.
Do not open index.html directly or use Live Server.

If you already have a working backend and database, copy the frontend folder into
your existing project. To change the names in your existing database, also copy
apply_demo_names.py and demo_names.json next to skilltrack.db, stop your server, and run:

    python apply_demo_names.py

The script backs up the database first and only renames matching original demo records.
It leaves unmatched/custom records unchanged. Restart the backend afterward.
Alternatively run this complete project in a separate folder with its updated database.
Do not accidentally nest the frontend as
frontend/frontend/index.html. No backend code changes or npm commands are needed to run.

## Included

- Impact Overview: live KPI cards, original vision quote, cohort filters, geographic
  Maharashtra background, interactive Livelihood Journey, wage progression,
  employment donut, course comparison, district performance and intervention queue.
- Learner Directory: refreshed table, initials avatars, wage sparklines, search,
  status/remedial filters, pagination, detailed timeline and intervention form.
- Enrolment Desk: existing three-step consent and simulated-OTP registration.
- Outreach Studio: existing WhatsApp/SMS follow-up simulation and chat.
- Employer Connect: employer registration, verification and existing demonstration ledger.
- Enterprise Pathways: existing self-employment record cards.
- Insights Lab: existing attrition predictor, explanatory signals and feedback analysis.
- Trust & Consent: existing consent/audit logs and integrity checks.
- Evidence Centre: live cohort summary, CSV download and printable report.
- Desktop sidebar, mobile navigation, both supplied logos, Hindi branding and local fonts.

## How figures are presented

The supplied database contains Telangana and Andhra Pradesh district records. These
are preserved. The Maharashtra outline is a decorative background, not a district
choropleth or a claim that these records belong to Maharashtra.

Dashboard cohort filters affect KPI cards and the Livelihood Journey. Chart aggregation
endpoints do not accept those filters, so the chart section explicitly says all cohorts.
Course/district earning rates include wage employment plus self-employment, matching
the backend. The wage-placement KPI uses wage employment only. Retention uses the
backend's full-cohort denominator. Reports/CSV use the full dataset.

The original project is a demonstration: OTP/SMS, uploads and ledger behavior remain
as provided by the backend. The perspective selector is a demo display selector, not
an authentication or authorization layer. The vision quote is original project copy
and is not attributed to a public official.

## Editing the frontend

The ready-to-run frontend is precompiled and includes local React, ReactDOM, confetti,
fonts and styles. Internet/CDN access is not required to render it once installed.

- portal.jsx: new application layout, navigation, dashboard, charts and reports.
- views.jsx: existing operational workflows, with updated presentation/error handling.
- design.css: visual system, responsive layouts and print styles.
- tailwind.config.cjs and utilities.input.css: utility stylesheet source.
- app.js and styles.css: compiled outputs used by index.html.

To rebuild after editing JSX or utility classes (Node.js required only for development):

    cd frontend
    npm install
    npm run build

Keep the source files: editing JSX alone will not change the compiled app.js.
Editing design.css takes effect directly after a hard refresh.

## Credits and assets

The two logos were supplied by the user and retained without image alteration.
Maharashtra outline is projected from the Maharashtra feature in:
https://github.com/geohacker/india/blob/master/state/india_state.geojson
It is used as a decorative state outline, without invented district divisions.
Upstream geographic data and its terms are documented in that repository.

React, ReactDOM, canvas-confetti and Tailwind licenses are in frontend/vendor.
Manrope and Noto Sans Devanagari font licenses are in frontend/fonts.

## Verification

The frontend was exercised with the supplied backend using a temporary copy of the
database. All nine navigation views, dashboard stage selection, cohort filters,
learner detail opening, desktop/mobile layout and local asset loading were checked.
The packaged database was not changed by those checks. See TESTING.md for the final
functional checks and limitations.

## Fictional demo identities

100 trainee names and eight employer profiles were changed. Company contact people,
emails, phone placeholders, GST placeholders and Udyam placeholders are fictional.
Emails use the reserved .example domain; registration identifiers are prefixed DEMO.
Training providers, trainee locations, courses, wages, risk scores and outcome statuses
are retained. Names are Maharashtra-style, but the dataset's existing geographic scope
is unchanged. Historical consent/audit records and mock proof hashes are retained;
they do not independently validate the new fictional company identities.
The original seed script is unchanged: if you deliberately reseed from scratch,
run apply_demo_names.py again to apply the fictional identities to matching demo records.
