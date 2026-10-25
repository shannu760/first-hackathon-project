# Saarathi: Master Build Prompt for Claude Code

*Merged from the original master prompt and the profiling and recommendation addendum. Paste everything below the line into Claude Code in an empty project folder. If the session runs out of room, tell Claude Code to continue from the status checklist in the README.*

---

# BUILD SAARATHI: A PRODUCTION-ORIENTED AI STUDENT CAREER COMPANION

## 1. Role and mission

Act as a principal full-stack engineer, senior product designer, AI engineer, database architect, security engineer and product strategist. Build **Saarathi**. Tagline: *Your Guide from Eligibility to Employment.*

Core promise: Saarathi saves a student’s profile and answers, discovers relevant government schemes, scholarships, internships and courses from attributed sources, estimates eligibility and fit with explainable logic, finds skill gaps, and keeps recommendations fresh as the profile or the source data changes.

Build a working application: real backend, real database persistence, authentication, ingestion, scoring, tests and deployment docs. Not a landing page, static mockup or fake-data dashboard. Inspect the existing project first, preserve useful code, build in phases, run and test everything, and fix errors instead of stopping after generating files. If a third-party service needs credentials, build the integration interface, add `.env.example`, explain the setup, and never fabricate a successful response or claim an integration is live when it is not.

## 2. Trust rules (apply everywhere)

- Never invent a deadline, stipend, benefit, eligibility rule, course detail, company or vacancy. Unverified fields are labelled unverified.
- Demo and fixture data is visibly labelled “Demo” and kept separate from verified data. Never show a sample as a live vacancy.
- Never claim that a scholarship is approved or guaranteed, an internship is open, an email is verified, a reminder was sent, a course is free or certified, or a source is real-time, unless evidence or a completed operation supports it.
- Match scores measure profile fit, not legal eligibility or the probability of selection. No score is presented as a calibrated probability.
- No government affiliation, endorsement, partnerships, user counts, ratings or outcome statistics without evidence. Student stories are labelled illustrative.
- Official source documents are authoritative for eligibility and application rules. Always surface “last verified” and flag stale records.
- If live data access is blocked (no API, missing credentials, site restrictions), say so and provide the most compliant integration path.

## 3. Users, problems and questions answered

Users: Indian school, diploma, UG, PG and final-year students, and scholarship applicants. The first release focuses on students; keep the architecture extensible for college and recruiter dashboards.

Problems solved: scattered opportunities, hard-to-read eligibility rules, missed deadlines, unclear internship realism, no skill-gap plan, disorganised applications.

Every major feature answers one of these: Which opportunities are relevant to me? What makes me eligible or ineligible? Which criteria still need verification? Which documents do I need? Where is the official page? Which skills am I missing? What should I do today and next? Which deadlines are near?

## 4. Technology stack

Use each technology for a real purpose. Do not force every language into the request path.

- **Frontend:** React with Vite, JavaScript/JSX, semantic HTML5, CSS3 with design tokens, React Router, Lucide React, Recharts, accessible forms with loading and error states.
- **Backend:** Node.js with Express (ES modules) as the primary API. Python with FastAPI for the intelligence service (ingestion, document parsing, AI tasks) only where it adds real value. Rust only for a focused scoring module if clearly beneficial; otherwise implement and test scoring in JavaScript and document a Rust integration boundary.
- **Supporting:** YAML for source config, settings, CI and deployment; Docker and Docker Compose; GitHub-ready structure; automated tests; production build. Pin stable versions and document the Node.js and Python versions.

## 5. Database responsibilities

**PostgreSQL (or MySQL) is the source of truth** for users, sessions, tokens, student profiles, academic records, questionnaire responses, skills and proficiency, learning preferences, career goals, course progress, projects, saved opportunities, applications and outcomes, notifications and preferences, recommendations and history, preparation plans, resumes, subscriptions, consent records and audit events.

**MongoDB holds** normalized opportunity documents (schemes, internships, courses), raw source snapshots with provenance, flexible eligibility criteria, the skill taxonomy, course metadata, and validated AI outputs and recommendation explanations.

Do not duplicate authoritative data across both without a stated sync strategy. Use migrations, indexes, unique constraints, foreign keys, transactions, validation, development seed scripts, consistent UTC timestamps, a retention policy, and backup and recovery docs. Data must survive server restarts. Never use an in-memory array as the store for users, profiles, applications or production opportunities.

SQL tables (adapt to the ORM): users, sessions, email\_verification\_tokens, password\_reset\_tokens, student\_profiles, student\_academic\_records, student\_questionnaire\_responses, student\_skills, student\_learning\_preferences, student\_career\_goals, student\_course\_progress, student\_projects, student\_applications, student\_saved\_opportunities, student\_recommendations, recommendation\_events, notifications, notification\_preferences, preparation\_plans, preparation\_tasks, resumes, subscriptions, user\_consents, audit\_events.

MongoDB collections: opportunities, source\_snapshots, skill\_taxonomy, courses, validated\_ai\_outputs.

## 6. Design system

A premium Indian edtech SaaS feel. Inter for the interface, optional Manrope for headings, Noto Sans Telugu for Telugu, system-font fallbacks, efficient font loading. Warm off-white background, deep navy or charcoal text, indigo or royal-blue primary, teal or emerald accent. Restrained gradients, subtle borders, soft shadows, rounded cards, generous whitespace; information-dense but uncluttered. Avoid heavy glassmorphism, oversized gradients, generic AI imagery and needless animation. Light and dark themes if practical.

Requirements: fully responsive; sticky landing navbar; collapsible dashboard sidebar with a clear active state; skeleton loaders; useful empty states; toasts; confirmation dialogs for destructive actions; tooltips for eligibility jargon; subtle transitions that respect reduced motion; accessible contrast and visible focus; charts with text alternatives; field-level form errors. Build reusable components instead of styling each page separately.

## 7. Routes

- **Public:** `/`, `/pricing`, `/login`, `/signup`, `/forgot-password`, `/reset-password`, `/privacy`, `/terms`.
- **Authenticated:** `/onboarding`, `/dashboard`, `/recommendations`, `/schemes`, `/schemes/:id`, `/internships`, `/internships/:id`, `/courses`, `/courses/:id`, `/skills`, `/copilot`, `/resume`, `/applications`, `/notifications`, `/settings`.

Protect routes on the server and the client (client guards are UX, not security). Keep useful filters in URL query parameters.

## 8. Landing page

- **Navbar:** logo and wordmark, Features, How It Works, Opportunities, Pricing, Login, Create My Free Profile.
- **Hero headline:** “Find the schemes, scholarships, and internships you actually qualify for.” **Supporting text:** “Saarathi analyzes your profile, estimates your eligibility, discovers relevant opportunities, identifies skill gaps, and creates a personalized career roadmap.” **CTAs:** Create My Free Profile; See How It Works. Add a dashboard illustration built from real UI components or CSS (match score, scholarship eligibility, internship fit, skill readiness, deadlines), not stock imagery.
- **Trust indicators:** built for Indian students; schemes, scholarships and internships; personalized skill roadmaps.
- **Problem section:** “Students do not lack opportunities. They lack clarity.” Cards: scattered information, unclear eligibility, no personalized guidance.
- **Features:** Scheme Eligibility Predictor, Internship Fit Predictor, Skill-Gap Analyzer, Course Recommender, Preparation Copilot, Resume Builder, Deadline Radar.
- **How it works:** 1. Create your student profile. 2. Discover matching opportunities. 3. Understand eligibility and missing skills. 4. Follow a personalized roadmap.
- **Also:** interactive dashboard preview; three clearly labelled illustrative student stories; Free, Student Pro and College pricing; at least six FAQs; final call to action; footer with contact, privacy, terms and social links.

## 9. Authentication and persistent login

Real, SQL-backed authentication.

- **Signup:** full name, email, optional phone, password, confirmation, and consent to terms and privacy (stored as consent records).
- **Email:** client and server format validation, normalization, a database unique constraint, duplicate detection, and real ownership verification through Resend, Postmark or similar, with single-use expiring tokens and a rate-limited resend. Do not call an address verified until the link is completed. Without credentials, use a clearly marked development email sink, and never show “Verification email sent” unless the provider accepted the message.
- **Login:** email and password, show/hide password, non-leaky error messages, rate limiting and abuse protection, forgot and reset flow with expiring single-use tokens, optional Google OAuth only when credentials are configured.
- **Passwords:** Argon2id. Never store, log or make recoverable any plaintext password.
- **Sessions:** server-managed sessions in secure, HttpOnly, SameSite cookies; HTTPS in production; expiry; rotation after login; CSRF protection; session-fixation protection; logout; revoke-all; a production session store (not memory). No session IDs, refresh tokens or secrets in localStorage. “Remember me” extends the session only within a documented secure policy, and sessions stay revocable.
- **Account:** view and edit profile, change password, log out, log out of all sessions, delete account with confirmation, export personal data, manage consent and privacy settings.
- All secrets come from environment variables. `.env.example` contains placeholders only.

## 10. Onboarding and student questionnaire

Build a polished multi-step wizard for onboarding, then an optional, progressively shown questionnaire on the dashboard. Use short sections, a progress indicator, conditional questions, skip-and-return for optional items, debounced autosave with a visible save status and retry (never silently drop answers), validation, previous/next, save-and-resume, and a plain-language reason beside every sensitive question. Answers are not permanent facts: store timestamps and allow corrections at any time. The database is the authority; localStorage is never the store.

**Section A, personal and academic:** full name; verified email; optional phone; state and district; education level (School, Diploma, UG, PG); institution; course and specialization; current year; graduation year; latest marks (CGPA and percentage in separate fields, with grading scale, and no comparison without a defined conversion policy); backlogs; entrance exam results when relevant.

**Section B, scholarship profile:** annual family income range; state of study; home state; education level; marks; benefit sought (government scholarship, tuition support, maintenance allowance, loan assistance, other); has income certificate; has category certificate where applicable; bank account meeting scheme payment rules; other scheme-specific documents. Category, gender and disability questions are optional unless the student chooses to evaluate an opportunity where they matter. Explain why they are asked, restrict access, never infer them from names, location or other signals, and never assume eligibility from category or income alone.

**Section C, career interests:** interests (software development, AI and ML, data analytics, cybersecurity, embedded systems and robotics, electronics, government jobs, research, entrepreneurship, other); target roles for the next 6 to 12 months; internship mode (remote, hybrid, on-site); stipend range; acceptable locations; how soon to start applying; existing resume, GitHub, portfolio or LinkedIn; experience level.

**Section D, skills and learning:** programming languages; tools used; confident skills; skills to improve; skill proficiency levels; projects built; internships, certifications and achievements; daily learning time; learning budget; preferred format (free YouTube, structured courses, hands-on projects, documentation and books, mentorship, a mixture); learning language (English, Telugu, both); pace (beginner-friendly, moderate, intensive); certificates, practical projects, or both.

**Section E, preparation and progress:** 30-day goal; 90-day goal; main blocker; applications made and their outcomes; completed courses and projects; weekly preparation time; interface language (English or Telugu); opt-in for weekly progress summaries; opt-in for deadline reminders.

The final onboarding step generates the first dashboard from the real profile and the available opportunity data, states that results are estimates, and lists missing information. Editing the profile triggers recalculation.

## 11. Dashboard and “Recommended for You”

**Dashboard:** welcome message, profile completion, readiness score, upcoming deadlines, top three schemes, top three internships, skill gaps, today’s preparation task, recent applications, weekly progress chart, and quick actions (find schemes, find internships, improve resume, generate plan). Every value comes from the database or a labelled derived calculation; no hardcoded readiness score. Handle first-time and incomplete-profile states with useful actions.

**Recommended for You** has three tabs: Scholarships & Schemes, Courses & Learning Paths, Internships & Jobs. Sections: best matches, deadlines approaching, skills to develop next, courses for those skills, new since last visit, recently updated or expired, saved recommendations, and your next three actions. Each card states a clear reason, for example “Recommended next: Learn SQL fundamentals”, with bullets such as: your target role is Data Analyst Intern; your profile lists Python but not SQL; several relevant listings require SQL; the course fits your budget and learning language. Show the last successful refresh time and a loading state. Do not reveal sensitive attributes in notifications or shared views.

## 12. Opportunity discovery and refresh

Do not ship four static scholarships. Build a modular source-connector interface (new sources must not require rewriting the engines) and a scheduled ingestion system.

**Sources (official, documented, permitted access only):** National Scholarship Portal (scholarships.gov.in), AICTE, National Career Service, india.gov.in, Andhra Pradesh and Telangana scholarship portals, official institution and program pages, employer career pages, company internship listings, permitted job feeds and APIs, government employment portals. For courses: SWAYAM, NPTEL, AICTE learning resources, Microsoft Learn, Cisco Networking Academy, freeCodeCamp, official documentation, and other reputable providers with verifiable course pages.

Do not assume a public API exists; inspect the access methods. Respect terms, robots policies, rate limits and licensing. Never bypass logins, CAPTCHAs or anti-bot controls. Fall back to permitted public-page ingestion, approved feeds, administrator-managed records or verified manual updates.

Per source, store: id, official URL, last successful fetch, last verification, retrieval time, freshness, availability status, and error and retry info. The pipeline provides provenance, duplicate detection, freshness checks, expired-listing detection and retries. Scheduled jobs discover new records, refresh existing ones, detect changed eligibility and deadlines, detect expired deadlines and dead application pages, merge duplicates, and recalculate only the affected recommendations. New opportunities are evaluated against saved profiles and surfaced only to relevant students. If a source fails, keep the last good record and flag it as possibly stale; a failed job must never erase prior data. Never call anything real-time verified if its source could not be checked.

**Opportunity record:** id, name, provider, type, description, education and academic requirements, income limits, category criteria, geographic limits, gender or disability criteria only if explicitly applicable, required documents, benefits, opening date, deadline, official application URL, official source URL, last verified, retrieved at, data confidence, eligibility rule version, and status (active, expired, unverified). Distinguish an official application portal from an informational page.

**Browser:** keyword search; filters for type, education level, state, category, income, deadline and provider; sorting by relevance and deadline. **Card:** name, provider, match score, eligibility status, benefits, missing documents, deadline or “unverified”, reasons, official link, save, reminder. **Detail page:** full criteria, documents, application steps, source link, last verified date, explanation in English or Telugu, deadline information, and a warning when data is outdated or incomplete.

**Development fixtures** (provisional, labelled Demo until checked against current official rules, amounts and windows): PM-USP Central Sector Scholarship, AICTE Swanath Scholarship, Post-Matric Scholarship for SC Students, Post-Matric Scholarship for OBC Students. Internship demo fixtures: Python Developer, Data Analyst, AI/ML, Frontend Developer and Embedded Systems interns. The simplified sample rules are not complete official criteria.

## 13. Scholarship eligibility engine

Deterministic, configurable and tested. Default weights: education level 25, academic marks 25, family income 25, category 15, state 10. Bands: 75 to 100 strong profile match, 50 to 74 partial, below 50 low.

Evaluate every mandatory criterion as pass, fail or unknown. A failed mandatory criterion blocks “eligible” regardless of score. Unknown criteria produce conditional or needs-verification, never an unsupported claim. Use the latest verified rule version, not last year’s. Never infer eligibility from sensitive data the student has not provided.

Return: `eligibility_status` (likely\_eligible, conditionally\_eligible, likely\_ineligible, needs\_verification); `match_score` 0 to 100; passed\_criteria; failed\_criteria; missing\_information; missing\_documents; source\_confidence; last\_verified\_at; scheme name, provider, application status, official URL, deadline, verified benefits, a plain-language explanation in English or Telugu, and a recommended next action. Example explanation: “You appear to match the published academic and income requirements. Your institution’s eligibility and the current application window still need verification. Check the official notice before applying.” Never guarantee approval, selection or payment.

Unit tests: boundary values, missing data, conflicting criteria, expired opportunities, state restrictions.

## 14. Internship discovery and fit

Only real listings from legitimate, permitted sources, with provenance, duplicate detection, freshness and expiry checks. **Card:** company, role, source, fit score, stipend or “not disclosed”, work mode, location, duration, required, matched and missing skills, published CGPA requirement, posting date and deadline if available, official apply link.

**Fit score (configurable):** required skills matched 40%, preferred skills 25%, academic eligibility 20%, target-role alignment 15%. Compare only against explicitly listed requirements and handle undisclosed ones explicitly. Project experience is a separately documented signal, or the weights are changed transparently; the total never silently exceeds 100. Location, work mode, stipend and listing freshness are shown as separate preference-fit and ranking signals, not hidden inside the 100.

Return: overall fit, matched skills, missing required and preferred skills, academic eligibility, role alignment, confidence and data freshness, and recommended actions.

## 15. Skill-gap analyzer

Show the target role, current skills and proficiency, required, matched and missing skills, progress bars, readiness score, estimated preparation time, recommended projects and courses, and related internships. Base everything on identifiable role requirements from the skill taxonomy, not arbitrary AI claims. Readiness is an estimate, not an employment guarantee. Students can update skills and see their fit scores change. Example: an AI/ML Intern candidate with Python and Git is missing machine learning, Pandas and model deployment; a suitable project is an end-to-end prediction project with a README.

## 16. Course recommendation engine

Inputs: target role, current skills and proficiency, missing skills, academic background, learning language, available hours, budget, preferred format, certificate preference, completed courses, project experience. Prefer free or affordable options when the budget requires. Never claim a course is free, certificate-granting or available without verifying its current details.

Each recommendation includes: title, provider, official URL, price or free status (if verified), language, level, skills covered, skills gained, published duration, certificate availability (if verified), why it matches this student, its position in the learning sequence, and a freshness timestamp. Skip beginner courses already completed unless revision helps. Illustrative AI/ML sequence for a student with basic Python: data analysis fundamentals; Pandas and NumPy; statistics and EDA; core machine learning; model evaluation; an end-to-end portfolio project; deployment basics. Adapt it per student; it is not universal.

## 17. Recommendation scoring, feedback and events

Keep separate scores for scholarships, courses and internships, with configurable, documented weights.

- **Scholarship relevance:** mandatory eligibility (evaluated separately from ranking), education level, academics, income, geography, application window, missing documents, stated financial need.
- **Course relevance:** missing role skills, current proficiency, career goal, prerequisites, learning language, available time, budget, source reliability, duplicate or completed content.
- **Internship relevance:** required and preferred skills, academics, role alignment, projects, location and mode, stipend, listing freshness.

Every recommendation explains why it was selected, which saved answers influenced it, which requirements are met, unknown or missing, and the next action. Students can dismiss, save, or mark a recommendation “not relevant”. That feedback adjusts ranking only, never official eligibility rules. Store recommendation history and events.

Recompute when the profile changes, a new opportunity arrives, eligibility rules or deadlines change, a course or project is completed, or skills, grades or goals change. Use targeted refreshes, queued jobs, and caching with clear invalidation instead of recalculating everything on each request.

## 18. Preparation copilot

Seven-, thirty- and ninety-day plans with a daily checklist, skill progress, projects, interview questions, aptitude practice, resume tasks and completion percentage. Generate tasks from current skills, available time, target role and plan length. Example 7-day Data Analyst plan: Python for analysis; Pandas with ten exercises; SQL joins and aggregation; a small analysis project; publish it on GitHub with a README; twenty aptitude questions; resume update and a mock interview.

Persist plans and progress. Use an LLM through a backend service when credentials exist: structured schemas, validation before storage, and only the minimal profile fields sent. Model output must never execute queries, code or shell commands, and never make authorization decisions. Provide a deterministic fallback when the provider is unavailable.

## 18A. AI integration (OpenRouter, hackathon-ready)

Add a working AI layer using OpenRouter. It must run in a live hackathon demo within minutes of setup and keep working when the network, a model or the free quota fails. AI explains, drafts and tutors; deterministic code decides eligibility, scores and authorization. Build the explanation feature and the assistant right after the first vertical slice, not at the end.

**Setup (the README must show these exact steps)**

- Create an OpenRouter account and API key and put it in `OPENROUTER_API_KEY` in the backend `.env`. The key stays server-side; the browser only calls Saarathi’s own `/api/v1/ai/*` endpoints.
- Environment variables: `OPENROUTER_API_KEY`, `AI_ENABLED`, `AI_DEMO_MODE`, `AI_MODELS` (comma-separated fallback chain), `AI_MODELS_JSON` (models confirmed to support structured output), `AI_TIMEOUT_MS`, `AI_MAX_TOKENS`, `AI_USER_DAILY_LIMIT`, `PUBLIC_APP_URL`.
- Provide `npm run ai:check`: verifies the key, checks each configured model against OpenRouter’s models list (`GET https://openrouter.ai/api/v1/models`), sends one test prompt, and prints which model answered and how long it took. Run it before every demo.

**Provider layer**

- One `AiProvider` interface with an `OpenRouterProvider` that calls `POST https://openrouter.ai/api/v1/chat/completions` (OpenAI-compatible request and response schema) with `Authorization: Bearer`, `HTTP-Referer` set to `PUBLIC_APP_URL`, and the `X-OpenRouter-Title` header set to Saarathi. Plain `fetch` or an OpenAI-compatible SDK pointed at the OpenRouter base URL; no heavy dependencies.
- Send the `models` array so OpenRouter falls back automatically on rate limits, provider downtime, context errors and moderation flags. Also keep an application-level fallback to deterministic output.
- Never hardcode model IDs in code. Free models (IDs ending in `:free`) can rotate out without warning, so read the chain from `AI_MODELS` and have `ai:check` flag any model that has disappeared. `.env.example` ships with `openrouter/free` (OpenRouter’s free router) as the safe default plus a comment on picking two or three specific `:free` models, and one inexpensive paid model for demo day, from the OpenRouter models page.

**Free-tier limits to design around** (from OpenRouter’s docs; re-check them before the hackathon)

- Free models allow 20 requests per minute, and 50 requests per day, or 1,000 per day once the account has ever bought $10 of credits. Limits are per account, not per key, failed requests can still count, and a negative balance returns 402 even on free models.
- So: one AI call per user action; never call AI on page load; no retry loops (one retry with backoff at most); a global request budget with a visible “AI busy” state; cache everything; and buy the $10 of credits before demo day so the daily cap is 1,000.

**Hackathon reliability features**

1. **Demo mode** (`AI_DEMO_MODE=true`): serves stored responses for a seeded demo profile and five golden demo prompts, labelled “Demo response”, never presented as live AI. The whole demo must pass offline.
2. **Response cache** in SQL keyed by feature, prompt hash, opportunity version and profile hash, with a TTL.
3. **Deterministic fallback for every AI feature:** template explanations built from the eligibility engine’s passed, failed and unknown criteria; a template 7-day plan built from the skill-gap output. The UI says “AI unavailable, showing the standard explanation”.
4. **Streaming** (SSE) for the assistant, with timeout and cancel. Show a small “Powered by OpenRouter” note with the model that answered.
5. **Status endpoint** `GET /api/v1/ai/status`: enabled, demo mode, last success, last error, estimated remaining budget.

**Features, in build order**

1. **Explain my result:** a plain-language English or Telugu explanation of one scholarship or internship result. The input is only the engine’s structured output. Validate that every amount, date and scheme name in the AI text appears in that input; if not, discard it and use the fallback.
2. **Saarathi Assistant** (`/assistant`): answers from verified opportunity records and minimal profile fields found by a simple keyword query. It cites the record and its last-verified date, says “not verified” when data is missing, and relays engine results instead of judging eligibility itself.
3. **7-day preparation plan** from the skill-gap output, as validated JSON.
4. **Resume review** against the target role and a simple **mock interview** (question, answer, feedback).
5. **Notice summarizer:** paste official notice text, get a checklist of criteria and documents, labelled as an AI summary with a link to the source.

**Structured output.** Many free models do not support strict JSON schema. Use `response_format` only for models listed in `AI_MODELS_JSON`; for the rest, ask for JSON in the prompt, extract it, validate with zod or pydantic, repair-retry once, then fall back to deterministic output.

**Safety and privacy**

- Treat scraped pages, retrieved text and student-typed text as untrusted data: wrap it in delimiters and tell the model to ignore instructions inside it. Model output never runs queries, code or shell commands and never makes authorization decisions.
- Free-model providers may retain prompts, so send no name, email, phone, category, income, disability or gender. Send only the fields a task needs (such as target role, skills, marks band, state, education level) and check each model’s data policy on its OpenRouter page.
- Label AI-generated content and tell students to verify on the official site.
- Log request ID, feature, model, latency and status only; never prompt text containing personal data. Rate limit per user and globally; record usage in `ai_usage`.

**API and data:** `POST /api/v1/ai/chat` (SSE), `POST /api/v1/ai/explain`, `POST /api/v1/ai/plan`, `POST /api/v1/ai/resume-review`, `POST /api/v1/ai/mock-interview`, `GET /api/v1/ai/status`, `GET /api/v1/ai/conversations`, `DELETE /api/v1/ai/conversations/:id`. Tables: ai\_conversations, ai\_messages, ai\_usage, ai\_cache. Assistant history is included in data export and account deletion.

**Tests and acceptance**

- Mocked OpenRouter tests for success, 429, 402, timeout, malformed JSON, injection text inside a scraped page, and a hallucinated amount being caught.
- `ai:check` passes with a real key. With the key removed, the whole app still works with fallbacks. With `AI_DEMO_MODE=true`, the five golden prompts pass offline, and the README lists them as the stage demo script.

## 19. Resume builder

Personal information, education, skills, projects, experience, certifications, achievements, portfolio and GitHub links, and target role. Live preview, missing-keyword analysis, and ATS-oriented checks labelled as a heuristic compatibility estimate (never a prediction of any employer’s ranking). PDF export through a proper PDF library with readable text. Sanitize and escape all user content. Preview before download.

## 20. Application tracker

Kanban columns: To Apply, Applied, Under Review, Interview, Offer, Rejected. Each card shows opportunity, type, deadline, status, notes, next action and last updated. Offer drag-and-drop only if it is accessible and reliable, plus keyboard-operable status controls. Filtering, search and notes. Persist every change to SQL. A unique constraint on student and opportunity prevents duplicate application records.

## 21. Notifications and deadline radar

Notification types: upcoming deadlines, new matching schemes, new internship matches, preparation reminders, application status updates, and weekly progress summaries for students who opted in. Filters: all, schemes, scholarships, internships, deadlines. Read and unread state, dismiss, preference settings, reminder configuration, deadline sorting, and email when configured.

Use a scheduled worker or job queue, never the open browser tab. Prevent duplicate reminders and store delivery status, retry information and timestamps. Do not claim push or email notifications are enabled until permissions and providers are configured. Keep sensitive attributes out of notification text.

## 22. Pricing

A billing-ready page with a monthly/yearly toggle and responsive cards.

- **Free (₹0):** basic profile, five scheme predictions, five internship matches, basic skill-gap report.
- **Student Pro (₹99/month or ₹999/year):** unlimited predictions, AI resume review, mock interviews, full preparation roadmaps, priority deadline alerts.
- **College (custom):** student analytics, college dashboard, opportunity management, bulk onboarding.

The first release may display pricing without taking payments. If billing is built: a supported payment provider, verified webhook signatures, server-side subscription state, and never trust client-submitted plan values or unlock premium features from a browser-side plan identifier.

## 23. English and Telugu

Build i18n from day one with a translation dictionary, not hardcoded strings. Translate navigation, buttons, form labels, validation messages, eligibility explanations, opportunity summaries, preparation tasks, notifications, and privacy and safety notices. Use a Telugu-capable font. Keep official scheme names, amounts, dates and conditions exact, and do not present uncertain translations of legal terms as authoritative. Switching language never loses a student’s work.

## 24. API

Versioned REST under `/api/v1`, documented with OpenAPI or Swagger.

- **Auth:** signup, login, logout, logout-all, me, verify-email, resend-verification, forgot-password, reset-password.
- **Profile and dashboard:** get and update profile; dashboard.
- **Questionnaire:** save and fetch responses; update career goals, skills and course progress.
- **Opportunities:** list, detail, eligibility, save, reminders.
- **Internships:** list, detail, fit.
- **Recommendations:** scholarship predictions, course recommendations, internship recommendations, dismiss, save or mark not relevant, request refresh, history.
- **Other:** skill gap; preparation plans and tasks; applications CRUD; resume CRUD, preview and PDF export; notifications and preferences; data export and account deletion.

Requirements: schema validation on every request; a consistent JSON envelope and correct status codes; pagination, filtering and sorting; centralized error handling; request IDs; rate limiting; authentication; per-user authorization derived from the session (never a client-supplied user ID); structured logs with sensitive fields redacted.

## 25. Security and privacy

Treat this as an application holding sensitive student data. Required: secure password hashing and cookies, CSRF protection, rate limiting, input validation, output encoding, XSS protection, SQL and NoSQL injection protection, a CORS allowlist, secure HTTP headers, secret management, dependency auditing, request size limits, safe file-upload validation, and IDOR and privilege-escalation protection with server-side ownership checks on all profile, questionnaire, application and progress data.

Never expose credentials, API keys, session secrets, password hashes or private student details to the browser or logs. Practice data minimization: collect only what the chosen features need, explain why, restrict access, allow edit, export and deletion, keep consent records, and define retention and deletion policies. Never sell or expose questionnaire responses, and never infer caste, disability, gender or income from indirect signals. Send an LLM only the minimal fields needed.

## 26. Testing

- **Unit:** email validation, eligibility engine, scoring, missing-information handling, deadline status, skill-gap math, course sequencing, input validation.
- **Integration:** signup, duplicate email, verification, login and logout, session persistence, password reset, profile and questionnaire saving, opportunity queries, tracker persistence, authorization boundaries, database errors, and failed background jobs preserving prior data.
- **End-to-end:** landing page, signup, email verification in a test environment, login, onboarding, dashboard, scheme discovery, internship fit report, course recommendations, preparation plan, add an application, refresh and confirm persistence, log out and confirm protected pages require login.
- Also test responsive layouts and key accessibility flows. Use a separate test database and never run destructive tests against production.

## 27. Deployment and developer experience

Suggested layout (adapt as needed): `frontend/`, `backend/`, `services/intelligence/`, `database/migrations/`, `database/seeds/`, `infrastructure/`, `tests/`, `docs/`, `.env.example`, `docker-compose.yml`, `README.md`.

Include package configs, a Python requirements file, a Rust manifest only if Rust is used, SQL migrations, MongoDB setup, Docker Compose, YAML configuration, `.gitignore`, API and architecture docs, and a deployment guide. Provide setup instructions for Windows 11 PowerShell and a Docker alternative. Document every environment variable: SQL URL, MongoDB URI, session secret, email provider key, public app URL, AI key, and OAuth and payment credentials if used. Keep development and production configuration separate. Add health-check endpoints, startup validation, logging and production build commands. Explain hosting for the frontend, Node backend, Python service, SQL database and MongoDB, with no publicly exposed database ports and no hardcoded credentials or URLs.

## 28. Build order

Prioritize a complete, working vertical slice first: signup with email verification and persistent login; profile and questionnaire saved to SQL; source-attributed scholarship discovery; explainable eligibility; internship matching and skill gaps; application tracker; and the AI integration in section 18A (explanations and assistant first), because it must be demo-ready for the hackathon. Then add courses, recommendation feedback and refresh jobs, AI plans, resume PDF, scheduled notifications, full Telugu coverage and billing.

1. **Phase 1, foundation:** project structure, design system, routing, SQL and MongoDB, migrations, Docker, landing page.
2. **Phase 2, authentication:** signup, login, email verification, persistent sessions, password recovery, protected routes.
3. **Phase 3, student core:** onboarding, questionnaire autosave, profile completion, dashboard, saved items, application tracker.
4. **Phase 4, opportunity intelligence:** connectors, ingestion, normalization, freshness, scholarship and internship scoring, explanations, missing-information handling.
5. **Phase 5, career tools:** skill gaps, course recommendations, preparation plans, resume and PDF, notifications, Telugu, recommendation refresh jobs, AI integration (section 18A).
6. **Phase 6, production readiness:** tests, security review, accessibility and responsive checks, build verification, deployment config, documentation.

After each phase: run the relevant tests, fix errors, verify through the UI or API, and update the README status checklist. Do not stop at plans or code snippets.

## 29. Acceptance criteria

- The landing page looks professional on mobile and desktop.
- Signup and login work through a real backend; email ownership verification works; duplicate emails are rejected by the database; passwords are hashed; sessions follow the documented remember-me policy; logout revokes the session.
- Questionnaire answers save to SQL and survive refresh, logout, another device and a server restart; students can edit and delete them.
- Scholarship results change when relevant profile data changes; course recommendations respond to updated skills and goals; completed courses appear in progress.
- New verified opportunities trigger targeted recommendation updates; expired listings are never shown as open; a failed background job never erases prior data.
- Every recommendation has a traceable source or an explicit demo label; eligibility results include explanations and mandatory-condition checks; internship scores show matched and missing skills.
- A student cannot read or change another student’s data.
- Tracker changes and preparation plans persist; PDF resume export works; English and Telugu work for key flows.
- No credentials or AI keys appear in frontend code; AI answers are grounded, labelled and never decide eligibility; automated tests pass; production builds succeed; setup, configuration and deployment are documented.

## 30. Final report

When finished, report: (1) what is actually implemented; (2) which integrations are live and which still need credentials; (3) how to run the project on Windows 11; (4) how to configure the databases and email verification; (5) which tests passed; (6) known limitations; (7) the exact next steps for deployment.

The goal is a trustworthy, well-designed, genuinely useful career companion that becomes more useful as students update their profile and progress, while staying transparent about eligibility, data freshness and uncertainty.
