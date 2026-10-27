# Dronacharya — Phased MVP Implementation Roadmap

---

## 1. Roadmap Strategy: The Vertical Slice

Rather than building wide, shallow features that leave the user experience disjointed, the **Dronacharya** implementation strategy follows an aggressive **Vertical Slice Approach**. We implement one complete, end-to-end learning journey—from account registration to Python recursion simulation, Socratic mentor debugging, and public portfolio verification—before expanding outward.

```mermaid
gantt
    title Dronacharya 13-Phase Implementation Sprint
    dateFormat  X
    axisFormat %d

    section Foundation
    Phase 1: Repo Setup & Stack Init        :active, p1, 0, 1
    Phase 2: Design Tokens & Base CSS       :p2, 1, 2
    Phase 3: App Shell & Global Nav         :p3, 2, 3
    Phase 4: Auth & Student Profiles        :p4, 3, 4

    section Core Learning Loop
    Phase 5: Student Courtyard Dashboard    :p5, 4, 5
    Phase 6: Learning Path & Mission Map    :p6, 5, 6
    Phase 7: Missions & Gamification Engine :p7, 6, 7
    Phase 8: Acharya AI Socratic Drawer     :p8, 7, 8
    Phase 9: Pyodide WebAssembly Simulator  :p9, 8, 10

    section Proof & Delivery
    Phase 10: Capstone Project Workspace    :p10, 10, 11
    Phase 11: Public Verifiable Portfolio   :p11, 11, 12
    Phase 12: Squad Hub & Leaderboard (P1)  :p12, 12, 13
    Phase 13: E2E Testing, Polish & Deploy  :p13, 13, 14
```

---

## 2. Phase-by-Phase Execution Plan

### Phase 1: Repository Audit & Tech Stack Initialization
* **Objectives:** Establish modern Next.js 14 App Router project with TypeScript, ESLint, Prettier, and Prisma ORM.
* **Key Tasks:**
  1. Initialize Next.js project with App Router and Tailwind CSS (`npx create-next-app@latest`).
  2. Configure `tsconfig.json` with strict path aliases (`@/components`, `@/lib`, etc.).
  3. Initialize Prisma schema with PostgreSQL provider connecting to Supabase.
* **Deliverables:** Clean running server on `localhost:3000` with connected database.
* **Effort:** 3 hours. | **Docs Reference:** [11-TECH-STACK-AND-ARCHITECTURE.md](./11-TECH-STACK-AND-ARCHITECTURE.md)

---

### Phase 2: Design System & Styling Token Implementation
* **Objectives:** Build foundational CSS token architecture reflecting the Indian Gurukul identity.
* **Key Tasks:**
  1. Define CSS custom properties in `app/globals.css` (Warm Ivory `#F6F1E7`, Forest Green `#354B3A`, Deep Ink `#252820`, Antique Brass `#B49A65`).
  2. Configure Google Fonts (`Lora`, `Inter`, `Noto Sans Devanagari`).
  3. Author reusable base button and card classes (`.btn-primary`, `.btn-secondary`, `.card-parchment`).
* **Deliverables:** Storybook / Styleguide page demonstrating typography, colors, and buttons.
* **Effort:** 4 hours. | **Docs Reference:** [04-UI-UX-DESIGN-SYSTEM.md](./04-UI-UX-DESIGN-SYSTEM.md)

---

### Phase 3: Application Shell & Global Navigation
* **Objectives:** Create responsive master layout, top navigation bar, and mobile bottom bar.
* **Key Tasks:**
  1. Implement `TopNav` with Dronacharya logo mark, zone breadcrumbs, and streak indicator.
  2. Implement responsive mobile navigation drawer.
  3. Add theme toggle (Warm Light vs Night Ink).
* **Deliverables:** Navigable layout shell across all core route templates.
* **Effort:** 3 hours. | **Docs Reference:** [06-DESIGN-AND-INTERACTION-FLOWS.md](./06-DESIGN-AND-INTERACTION-FLOWS.md)

---

### Phase 4: Authentication & Student Profiles
* **Objectives:** Implement secure JWT authentication and onboarding profile configuration.
* **Key Tasks:**
  1. Build `/auth` login/signup screens with form validation.
  2. Implement `/api/auth/register` and `/api/auth/login` route handlers.
  3. Build `/onboarding` step for track selection and language preference (EN/HI/Hinglish).
* **Deliverables:** Fully functioning user registration and session management.
* **Effort:** 5 hours. | **Docs Reference:** [12-DATABASE-SCHEMA.md](./12-DATABASE-SCHEMA.md), [13-API-AND-BACKEND-SPECIFICATION.md](./13-API-AND-BACKEND-SPECIFICATION.md)

---

### Phase 5: Student Courtyard Dashboard
* **Objectives:** Provide the central landing hub for returning students.
* **Key Tasks:**
  1. Build active course progress card with BKT mastery indicator.
  2. Render daily focus streak counter and XP odometer.
  3. Display "Next Recommended Mission" dynamic action card.
* **Deliverables:** `SCREEN-DASH-01` populated with live database data.
* **Effort:** 4 hours. | **Docs Reference:** [05-PAGE-AND-SCREEN-SPECIFICATION.md](./05-PAGE-AND-SCREEN-SPECIFICATION.md)

---

### Phase 6: Learning Paths & Questline DAG
* **Objectives:** Implement visual mission progression map with sequential unlock dependencies.
* **Key Tasks:**
  1. Build Directed Acyclic Graph (DAG) questline renderer for "Python Algorithmic Mastery".
  2. Connect unlock logic to prerequisite BKT mastery scores ($P(L) \ge 0.70$).
* **Deliverables:** `/paths/python-algorithms` quest map showing locked, unlocked, and completed nodes.
* **Effort:** 5 hours. | **Docs Reference:** [03-FEATURE-SPECIFICATION.md](./03-FEATURE-SPECIFICATION.md)

---

### Phase 7: Missions & Gamification Engine
* **Objectives:** Implement narrative mission briefing and XP transaction engine.
* **Key Tasks:**
  1. Create `/missions/:id` view showing the real-world problem context (e.g., postal routing).
  2. Implement `POST /api/progress/xp-award` with anti-grind fatigue governors.
  3. Build celebratory modal (`SCREEN-RSLT-01`) with Antique Brass seal reveal.
* **Deliverables:** Working gamified mission loop with database persistence.
* **Effort:** 5 hours. | **Docs Reference:** [09-GAMIFICATION-AND-LEARNING-ENGINE.md](./09-GAMIFICATION-AND-LEARNING-ENGINE.md)

---

### Phase 8: Acharya AI Socratic Drawer
* **Objectives:** Integrate Google Gemini 1.5 Flash API with progressive 4-tier Socratic prompts.
* **Key Tasks:**
  1. Build slide-out `AcharyaDrawer` with quick-prompt chips.
  2. Implement `POST /api/mentor/hint` with strict non-spoiler system prompts.
  3. Add Hindi / Hinglish translation toggle for mentor guidance.
* **Deliverables:** Intelligent conversational drawer providing contextual hints without leaking answers.
* **Effort:** 6 hours. | **Docs Reference:** [08-AI-MENTOR-AND-FEEDBACK.md](./08-AI-MENTOR-AND-FEEDBACK.md)

---

### Phase 9: Pyodide WebAssembly Python Simulator (The Core Wonder)
* **Objectives:** Embed a safe, lightning-fast Python runtime directly in the browser.
* **Key Tasks:**
  1. Configure `pyodideWorker.ts` in public Web Worker thread.
  2. Embed Monaco Editor with Python syntax highlighting and keyboard shortcut (`Cmd+Enter`).
  3. Implement automated test harness runner with stdout/stderr capture and diff rendering.
  4. Implement $5,000\text{ms}$ execution watchdog timer.
* **Deliverables:** Zero-cost, instantaneous in-browser code simulator passing real test cases.
* **Effort:** 8 hours. | **Docs Reference:** [10-SIMULATORS-AND-PRACTICAL-PROJECTS.md](./10-SIMULATORS-AND-PRACTICAL-PROJECTS.md)

---

### Phase 10: Capstone Project Workspace & Rubric Evaluation
* **Objectives:** Enable students to submit multi-file capstone projects and receive structured evaluations.
* **Key Tasks:**
  1. Build `/projects/lru-cache` multi-tab code editor.
  2. Author 4-dimension rubric scoring engine (Functionality, Edge Cases, Complexity, Style).
  3. Generate cryptographic SHA-256 completion hash.
* **Deliverables:** Automated project evaluation generating a verified credential.
* **Effort:** 6 hours. | **Docs Reference:** [03-FEATURE-SPECIFICATION.md](./03-FEATURE-SPECIFICATION.md)

---

### Phase 11: Public Verifiable Portfolio
* **Objectives:** Create unauthenticated showcase portfolio for recruiters and peers.
* **Key Tasks:**
  1. Build `/u/:username` route with SSR for lightning-fast recruiter load times.
  2. Render Mastery Radar Chart, earned Seals gallery, and passed project code logs.
  3. Implement "Inspect Execution Proof" verification modal.
* **Deliverables:** High-credibility public student portfolio.
* **Effort:** 4 hours. | **Docs Reference:** [05-PAGE-AND-SCREEN-SPECIFICATION.md](./05-PAGE-AND-SCREEN-SPECIFICATION.md)

---

### Phase 12: Gurukul Squads Hub & Cohort Leaderboard (P1 Scope)
* **Objectives:** Provide squad formation and collaborative cohort visibility.
* **Key Tasks:**
  1. Implement squad creation with unique 6-character join codes.
  2. Render weekly squad mastery leaderboard weighted by learning improvement.
* **Deliverables:** Collaborative community hub for peer motivation.
* **Effort:** 4 hours (P1). | **Docs Reference:** [03-FEATURE-SPECIFICATION.md](./03-FEATURE-SPECIFICATION.md)

---

### Phase 13: E2E Testing, Visual Polish & Production Deployment
* **Objectives:** Execute smoke tests, ensure zero contrast defects, and deploy to Vercel.
* **Key Tasks:**
  1. Run automated Playwright E2E suite covering the full user journey.
  2. Audit WCAG 2.1 AA accessibility compliance across all screens.
  3. Deploy production build to Vercel with environment secrets configured.
* **Deliverables:** Live, blazing-fast public production deployment for Hackathon presentation.
* **Effort:** 4 hours. | **Docs Reference:** [16-TESTING-AND-ACCEPTANCE.md](./16-TESTING-AND-ACCEPTANCE.md)

---

## 3. Implementation Status Audit (Verified Production Build)

| Phase | Module | Implementation Status | Test & Build Outcome |
|:---|:---|:---|:---|
| Phase 1 | Repository & Next.js 16 App Router | **COMPLETED** | Verified with TypeScript 5 strict compilation |
| Phase 2 | Brand Tokens & Indian Gurukul CSS | **COMPLETED** | Warm Ivory, Forest Green, Antique Brass, Lora & Inter configured |
| Phase 3 | App Shell & TopNav with Suspense | **COMPLETED** | Responsive mobile drawer, streak counter, Acharya AI trigger |
| Phase 4 | Authentication & Student Onboarding | **COMPLETED** | `/auth` sign in & `/onboarding` career track calibration |
| Phase 5 | Student Courtyard Dashboard | **COMPLETED** | BKT radar progress, XP odometer, rank badge, mission recommendations |
| Phase 6 | Learning Paths & Questline DAG | **COMPLETED** | `/paths` mission graph with prerequisite unlock logic |
| Phase 7 | Missions & Gamification Engine | **COMPLETED** | Anti-grind fatigue governors, XP formulas, celebration confetti |
| Phase 8 | Acharya AI Socratic Drawer | **COMPLETED** | 4-Tier hints, Hinglish/Hindi/English code-switching, fallback rulebook |
| Phase 9 | Pyodide WebAssembly Python Simulator | **COMPLETED** | Browser sandbox runner, unit test assertions, stdout capture |
| Phase 10 | Capstone Projects & Rubric Engine | **COMPLETED** | Multi-file LRU Cache workspace, 4-tier rubric evaluation ($94/100$) |
| Phase 11 | Public Verifiable Portfolio | **COMPLETED** | `/portfolio/[username]` with test proof inspector & SHA-256 seals |
| Phase 12 | Gurukul Squads Hub & Leaderboard | **COMPLETED** | `/squads` with join code `KASHI7`, weekly goals, peer review station |
| Phase 13 | Production Build Verification | **COMPLETED** | `next build` compiled with 0 errors across all 19 static/dynamic routes |

