# Saarathi: Production-Oriented AI Student Career Companion
> **"Your Guide from Eligibility to Employment"**

Saarathi is an enterprise-grade full-stack platform built for Indian university and polytechnic students. It deterministically demystifies government scholarship eligibility, maps skill gaps to pragmatic internships and certified courses (NPTEL, SWAYAM, freeCodeCamp), plans 7/30/90-day preparation sprints, generates ATS-compliant resumes with native PDF export, and tracks opportunities through a Kanban application board.

---

## 🚀 Live Server & Demo Credentials

The unified full-stack server is running and accessible at:
- **Web Application**: [http://localhost:5000/](http://localhost:5000/)
- **API Health Check**: [http://localhost:5000/api/v1/health](http://localhost:5000/api/v1/health)

### Pre-Seeded Student Credentials
| Role | Email | Password | Student Profile |
| :--- | :--- | :--- | :--- |
| **Merit Student** | `demo@saarathi.edu.in` | `Password@123` | **Ananya Sharma** (B.Tech CSE, 3rd Year, JNTU Hyderabad) |

---

## 🎨 Visual Design Architecture (Pinterest Spec Implementation)

Saarathi is designed with the luxury, precision, and depth of a 20-year principal design director:

1. **Starting/Hero Page (Pins [1116118720125299873](https://in.pinterest.com/pin/1116118720125299873/) & [865605990890519809](https://in.pinterest.com/pin/865605990890519809/))**:
   - Interactive Three.js WebGL canvas featuring a central glowing ruby/coral astrolabe core (`#C43B43` & `#FA947E`).
   - Concentric orbital rings with coordinate crossbars and dynamic geometry rotation.
   - 1,000 particle celestial field with mouse parallax and seekable interactive camera movement.

2. **Profile Page (Pin [865605990890519809](https://in.pinterest.com/pin/865605990890519809/))**:
   - Statuesque, dark editorial layout featuring a sculpted 3D centerpiece/avatar emblem.
   - Minimal floating navigation, credentials matrix, and DPDP-compliant data export and deletion actions.

3. **Color Palette (Pin [855824735461537655](https://in.pinterest.com/pin/855824735461537655/))**:
   - **Deep Midnight Slate**: `#0B0F19`, `#161B2F`, `#1F2942`
   - **Royal Wine / Crimson**: `#57192E`, `#74182F`, `#921B2F`, `#AA3234`, `#C43B43`
   - **Warm Coral / Rose Gold**: `#CF625D`, `#EC7E6F`, `#FA947E`, `#E4A28C`, `#FAD4C0`
   - **Pearl Text / Highlights**: `#F8FAFC`, `#E2E8F0`

4. **Typography System (Pin [1133781274977088183](https://in.pinterest.com/pin/1133781274977088183/))**:
   - Headings: `Cinzel` & `Syne` (luxury editorial hierarchy)
   - Body & Numbers: `Plus Jakarta Sans` & `Inter`
   - Regional Script: `Noto Sans Telugu`

---

## ⚙️ Technical Architecture & Engines

### 1. Deterministic Engines (`backend/src/modules/engines/`)
- **Scholarship Eligibility Engine** (25/25/25/15/10 Weights):
  - Academic Marks & Education Level (25%)
  - Family Income Ceiling (25%)
  - Social Category / Quota (25%)
  - Domicile / State (15%)
  - Documentation Readiness (10%)
  - *Status Outcomes*: `likely_eligible`, `conditionally_eligible` (with missing documents/info clearly surfaced), `likely_ineligible`.
- **Internship Fit Engine** (40/25/20/15 Weights):
  - Required Skills Match (40%)
  - Academic CGPA (25%)
  - Target Role Alignment (20%)
  - Work Mode / Location (15%)
- **Skill-Gap Analyzer Engine**: Compares student competencies against verified industry taxonomies and computes preparation readiness and estimated prep time in weeks.
- **Course Recommender Engine**: Prioritizes free NPTEL and SWAYAM courses covering verified missing skills within student time and budget constraints.

### 2. High-Performance Backend
- **Runtime**: Node.js v24 LTS on Windows x64.
- **Database**: Zero-compilation native Node 24 SQLite (`node:sqlite`, `DatabaseSync`) with WAL mode and foreign key constraints.
- **Authentication**: Modern `@node-rs/argon2` with HTTP-Only secure cookies and session lifecycle management.
- **Resume PDF Engine**: `pdfkit` server-side rendering streaming ATS-friendly vector PDFs.

### 3. OpenRouter AI Layer with Deterministic Fallbacks
- Configured for `google/gemini-2.5-flash` via OpenRouter.
- Graceful offline fallback providing golden domain responses and ground-truth citations (National Scholarship Portal, AICTE).

---

## 🧪 Verification & Test Suite

All 15 unit and integration tests pass with 100% success rate:
```powershell
cd d:\hackathon\backend
npm test
```
```
▶ Saarathi Deterministic Eligibility & Scoring Engines
  ✔ Scholarship Eligibility: Full Match returns likely_eligible with score 100
  ✔ Scholarship Eligibility: Failed mandatory criterion blocks eligibility regardless of high score
  ✔ Scholarship Eligibility: Missing income produces conditional eligibility rather than unsupported claim
  ✔ Internship Fit: Calculates skills match and academic eligibility accurately
  ✔ Skill-Gap Engine: Correctly flags missing skills and computes preparation readiness
  ✔ Course Recommender: Prioritizes courses covering missing skills within budget
  ✔ AI Layer: Deterministic fallback and offline demo mode operate without crashing
✔ Saarathi Deterministic Eligibility & Scoring Engines (15.4ms)

▶ Saarathi Full-Stack API Integration Tests
  ✔ 1. Health Check returns 200 and healthy status
  ✔ 2. Authentication: Login with demo credentials sets session cookie
  ✔ 3. Protected Route: GET /api/v1/auth/me returns authenticated student and profile
  ✔ 4. Opportunities: Returns verified schemes with computed eligibility
  ✔ 5. Recommendations: Returns 3 tabs (Schemes, Courses, Internships) with explanations
  ✔ 6. PDF Resume Generation: Returns valid application/pdf binary stream
  ✔ 7. AI Status: Returns OpenRouter/Demo mode status payload
  ✔ 8. Single Page App: Static frontend index.html served on root /
✔ Saarathi Full-Stack API Integration Tests (107.5ms)

ℹ tests 15 | pass 15 | fail 0
```

---

## 📋 Key Routes & Application Features

| Route | Feature |
| :--- | :--- |
| `/` | Interactive 3D WebGL Hero, Value Proposition, Feature Matrix, FAQs, and Bilingual Switcher |
| `/login` & `/signup` | Argon2id Authentication with pre-populated demo login |
| `/dashboard` | Readiness Score Gauge, Top 3 Schemes, Today's Sprints, Recharts 7-day trend |
| `/profile` | Statuesque editorial profile, credentials matrix, skills inventory, DPDP export |
| `/recommendations` | 3 Tabs (Scholarships, Internships, Courses), match breakdown, AI explanation |
| `/schemes` & `/schemes/:id` | Central PM-USP, AICTE Pragati, Telangana ePASS with eligibility diagnostics |
| `/internships` & `/internships/:id` | Google STEP, Microsoft SWE, Swiggy Backend with matched vs missing skill bars |
| `/skills` | Skill-gap analyzer, readiness score, target role taxonomy, capstone project guide |
| `/courses` | Curated free courses from NPTEL, SWAYAM, freeCodeCamp with progress tracker |
| `/copilot` | 7, 30, and 90-day actionable career sprints with persistent task checkboxes |
| `/resume` | ATS resume builder, heuristic score analyzer, and live vector PDF download |
| `/applications` | Kanban board with 6 columns: To Apply, Applied, Under Review, Interview, Offer, Rejected |
| `/notifications` | Deadline Radar with color-coded countdown indicators |
