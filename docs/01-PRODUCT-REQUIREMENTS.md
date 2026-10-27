# Dronacharya — Product Requirements Document (PRD) & Traceability Matrix

---

## 1. Document Overview

This document specifies the complete functional and non-functional requirements for the **Dronacharya** platform. Every requirement is assigned a permanent, unique identifier and mapped through a rigorous **Requirements Traceability Matrix (RTM)** to ensure end-to-end alignment from problem statement to unit and end-to-end acceptance tests.

### 1.1 Priority Definitions
* **P0 (Critical / MVP):** Must be fully functional and demonstrable for the Hackathon release. Core learning loop cannot function without it.
* **P1 (High / v1.1):** High-value enhancements that enrich the experience; targeted for post-hackathon sprint or polished demo tracks.
* **P2 (Medium / Future):** Enterprise, multi-cohort, or advanced ecosystem extensions.

---

## 2. User Personas & User Stories

### Persona 1: Aarav Sharma (The Aspiring Full-Stack / Systems Engineer)
* **Profile:** 3rd-year engineering student; theoretical knowledge of algorithms, but lacks confidence writing runnable code.
* **Goal:** Practice writing recursive logic and data structures hands-on with immediate, intelligent feedback.
* **Key User Story:** *As Aarav, I want to write Python code in a safe simulator and receive progressive hints when I encounter bugs, so that I can understand where my logic failed without having the answer spoiled.*

### Persona 2: Priya Patel (The Transitioning Data Analyst)
* **Profile:** Commerce background; learning Python and data analytics; English is her second language.
* **Goal:** Grasp tricky programming concepts in Hindi/Hinglish and build verifiable portfolio projects.
* **Key User Story:** *As Priya, I want my AI mentor to explain recursion and list comprehensions in conversational Hindi/English, so that language barriers do not impede my technical comprehension.*

### Persona 3: Prof. Raghavan (The Gurukul Cohort Mentor)
* **Profile:** Academic instructor managing 60 students in an advanced engineering lab.
* **Goal:** Track actual skill mastery, verify project integrity, and run friendly coding tournaments.
* **Key User Story:** *As Prof. Raghavan, I want to view a student's public portfolio with verified test execution traces, so that I know their skills are authentic and self-demonstrated.*

---

## 3. Functional Requirements

### 3.1 Category A: AI-Powered Personalised Learning (`AI-XXX`)
* **AI-001 (P0): Baseline Knowledge Assessment:** The system shall administer a brief 3-to-5 question adaptive diagnostic quiz to newly onboarded students to assess their baseline proficiency.
* **AI-002 (P0): Bayesian Knowledge Tracing (BKT):** The system shall compute and maintain a real-time mastery score ($P(L_k) \in [0.0, 1.0]$) for each granular skill node in a learning path.
* **AI-003 (P0): Dynamic Path Adaptation:** If a student's mastery score falls below 0.60 on a prerequisite skill, the system shall automatically inject a remedial practice quest before advancing.
* **AI-004 (P1): Learning Pace Estimation:** The system shall evaluate time-on-task and trial-failure velocity to adjust challenge difficulty between *Beginner (Sadhaka)*, *Practitioner (Abhyasi)*, and *Master (Acharya)*.
* **AI-005 (P1): Personalised Explanation Synthesis:** The system shall dynamically generate tailored concept summaries reflecting the student's demonstrated strengths and analogies.

### 3.2 Category B: Learn by Playing & Gamification (`GAME-XXX`)
* **GAME-001 (P0): Quest & Mission System:** Learning objectives shall be structured as narrative-driven missions with clear objectives, constraints, and completion criteria.
* **GAME-002 (P0): Fair Mastery XP Engine:** The platform shall award XP based strictly on conceptual mastery, unit test passes, and problem solving—not purely on speed or grinding.
* **GAME-003 (P0): Mastery Seals (Badges):** The platform shall unlock cryptographic, verifiable digital Seals upon completing milestone challenges (e.g., *Seal of the Recursive Archer*).
* **GAME-004 (P1): Anti-Grind Fatigue Limits:** The system shall introduce diminishing XP returns after 45 minutes of continuous repetitive quiz solving to prevent dopamine farming and encourage restful reflection.
* **GAME-005 (P1): Focus Streaks:** The system shall award streak multipliers for consistent daily active learning, featuring a one-day grace freeze to prevent toxic streak anxiety.

### 3.3 Category C: Theory-to-Practice Simulators (`SIM-XXX`)
* **SIM-001 (P0): WebAssembly Sandboxed Code Execution:** The platform shall execute student Python code directly inside the browser using Pyodide (Wasm) in an isolated Web Worker with memory (<128MB) and CPU timeout limits (5000ms).
* **SIM-002 (P0): Visual Test Runner & Output Console:** The simulator shall capture stdout, stderr, and evaluate code against visible and hidden unit test cases, displaying detailed visual diffs.
* **SIM-003 (P1): Interactive Parameter Visualizer:** For algorithmic and ML concepts, the simulator shall provide slider-based hyperparameter tuning with immediate graphical feedback.
* **SIM-004 (P2): Virtual Business & Startup Simulator:** The platform shall offer interactive balance-sheet and unit-economics simulations for management learners.

### 3.4 Category D: Socratic AI Mentor & Feedback (`MENT-XXX`)
* **MENT-001 (P0): 4-Tier Progressive Hint System:** The AI Mentor (*Acharya AI*) shall provide tiered assistance:
  * *Tier 1:* Conceptual question / directional nudge.
  * *Tier 2:* Code pattern / syntax reminder without answering.
  * *Tier 3:* Pinpointed line of logic breakdown.
  * *Tier 4:* Walkthrough of an analogous example (never the exact solution).
* **MENT-002 (P0): Misconception Diagnosis:** When code execution fails, the AI Mentor shall analyze the stack trace and code logic to explain *why* the bug occurred in plain language.
* **MENT-003 (P0): Multilingual Support (English & Hindi/Hinglish):** The mentor shall support fluid code-switching between English, standard Hindi (Devanagari), and Hinglish (Latin script) based on user preference.
* **MENT-004 (P1): Contextual In-IDE Drawer:** The mentor shall live in a slide-out drawer that automatically ingests the student's current code, test results, and mission brief.

### 3.5 Category E: Real-World Projects & Skill Proof (`PROJ-XXX`)
* **PROJ-001 (P0): Capstone Mini-Project Workspace:** Students shall build multi-step milestone projects (e.g., "Build an In-Memory Key-Value Store with TTL").
* **PROJ-002 (P0): Transparent Rubric Assessment:** Projects shall be evaluated against a deterministic 4-tier rubric (Functionality, Edge Cases, Code Style, Time Complexity).
* **PROJ-003 (P0): Public Verifiable Portfolio:** The platform shall host a publicly accessible profile (`/u/:username`) showcasing completed projects, passing test runs, and earned Skill Seals.
* **PROJ-004 (P1): Exportable Skill Certificate:** Students shall be able to download cryptographically signed SVG/PDF skill credentials with verification URLs.

### 3.6 Category F: Collaborative Learning & Tournaments (`COLLAB-XXX`)
* **COLLAB-001 (P1): Gurukul Study Squads (Teams):** Students shall be able to form squads of 3–5 peers to tackle shared missions and track collective mastery.
* **COLLAB-002 (P1): Peer Code Reviews:** Students shall be prompted to provide structured feedback on peer submissions using a predefined rubric.
* **COLLAB-003 (P2): Gurukul Tournaments:** Time-boxed group challenges where points are weighted by team collaboration, code elegance, and test coverage rather than pure speed.

---

## 4. Non-Functional Requirements (NFRs)

| NFR ID | Category | Requirement Description | Target Metric |
|:---|:---|:---|:---|
| **NFR-001** | Performance | Time to First Meaningful Paint (FMP) on 4G network | $< 1.8\text{ seconds}$ |
| **NFR-002** | Sandbox Security | Total isolation of client-side code execution | 0% main-thread blocking; 0% access to `localStorage` or `window` cookies from untrusted scripts |
| **NFR-003** | AI Latency | Socratic hint generation response time (streaming TTFT) | $< 1.2\text{ seconds}$ to first token |
| **NFR-004** | Accessibility | Adherence to WCAG 2.1 Level AA standards | 100% color contrast compliance ($\ge 4.5:1$ for normal text) |
| **NFR-005** | Responsiveness | Responsive across desktop, tablet, and mobile devices | Viewports from $375\text{px}$ to $2560\text{px}$ supported |
| **NFR-006** | Data Privacy | Compliance with Digital Personal Data Protection Act 2023 | Encrypted student PII at rest; right to delete profile data |

---

## 5. Requirements Traceability Matrix (RTM)

This matrix maps every foundational requirement from the original problem statement through user stories, screens, backend services, database models, and test cases.

| Req ID | Category | Feature Name | User Story | UI Screen | API / Backend Service | Database Tables | Test Case ID | Priority | MVP Status |
|:---|:---|:---|:---|:---|:---|:---|:---|:---|:---|
| **REQ-001** | Auth | Student Authentication | As a student, I want to sign up securely with email/password. | `SCREEN-AUTH-01` | `POST /api/auth/register` | `users`, `profiles` | `TC-AUTH-01` | P0 | Included |
| **REQ-002** | Onboarding | Profile Setup & Interests | As a student, I want to select my career tracks and preferred language. | `SCREEN-ONB-01` | `PATCH /api/users/profile` | `profiles` | `TC-ONB-01` | P0 | Included |
| **AI-001** | AI Personalization | Baseline Diagnostic Quiz | As a student, I want an initial quiz to test my skills so I don't waste time on basics. | `SCREEN-DIAG-01` | `POST /api/assessments/diagnostic` | `assessments`, `questions` | `TC-AI-01` | P0 | Included |
| **AI-002** | AI Personalization | Knowledge Tracing Engine | As a student, my path should adjust dynamically based on my mastery. | `SCREEN-DASH-01` | `GET /api/progress/mastery` | `user_skill_mastery` | `TC-AI-02` | P0 | Included |
| **AI-003** | AI Personalization | Remedial Mission Injection | As a student, if I fail a concept, I want tailored practice before moving ahead. | `SCREEN-PATH-01` | `POST /api/paths/adapt` | `learning_paths`, `missions` | `TC-AI-03` | P0 | Included |
| **GAME-001**| Gamification | Mission Questline View | As a student, I want my course presented as an epic quest journey. | `SCREEN-PATH-01` | `GET /api/paths/:id` | `learning_paths`, `missions` | `TC-GAME-01` | P0 | Included |
| **GAME-002**| Gamification | Mastery XP Transactions | As a student, I want to earn XP for solving real problems. | `SCREEN-GAME-01` | `POST /api/progress/xp-award` | `xp_transactions` | `TC-GAME-02` | P0 | Included |
| **GAME-003**| Gamification | Achievement Seals Unlock | As a student, I want to earn tangible seals when mastering key skills. | `SCREEN-ACH-01` | `GET /api/achievements` | `achievements`, `user_seals` | `TC-GAME-03` | P0 | Included |
| **SIM-001** | Simulator | Sandboxed Python Runtime | As a student, I want to run Python code directly in my browser safely. | `SCREEN-SIM-01` | Web Worker / Pyodide Client Runtime | None (Client-side) | `TC-SIM-01` | P0 | Included |
| **SIM-002** | Simulator | Automated Unit Test Runner | As a student, I want immediate visual test pass/fail results. | `SCREEN-SIM-01` | Client Test Runner Worker | `challenge_submissions` | `TC-SIM-02` | P0 | Included |
| **MENT-001**| AI Mentor | 4-Tier Socratic Hinting | As a student, I want hints that guide my thinking without giving the answer. | `SCREEN-MENT-01` | `POST /api/mentor/hint` | `mentor_conversations` | `TC-MENT-01` | P0 | Included |
| **MENT-002**| AI Mentor | Misconception Diagnosis | As a student, I want clear explanations for why my code threw an error. | `SCREEN-MENT-01` | `POST /api/mentor/diagnose` | `mentor_conversations` | `TC-MENT-02` | P0 | Included |
| **MENT-003**| AI Mentor | Multilingual Hindi Support | As a student, I want to ask questions in Hindi or Hinglish. | `SCREEN-MENT-01` | `POST /api/mentor/chat` | `mentor_conversations` | `TC-MENT-03` | P0 | Included |
| **PROJ-001**| Real-World Projects | Capstone Project Workspace| As a student, I want to build a substantial multi-file project. | `SCREEN-PROJ-01` | `GET /api/projects/:id` | `projects`, `project_milestones`| `TC-PROJ-01`| P0 | Included |
| **PROJ-002**| Real-World Projects | Rubric Evaluation Engine | As a student, I want transparent feedback across test cases and code structure. | `SCREEN-PROJ-02` | `POST /api/projects/:id/submit`| `project_submissions` | `TC-PROJ-02` | P0 | Included |
| **PROJ-003**| Skill Proof | Public Verifiable Portfolio| As a student, I want a public link showing my verified work to employers. | `SCREEN-PORT-01` | `GET /api/portfolio/:username` | `portfolio_entries` | `TC-PORT-01` | P0 | Included |
| **COLLAB-001**| Collaboration | Gurukul Squad Hub | As a student, I want to study in a team of 4 peers. | `SCREEN-TEAM-01` | `GET /api/teams/:id` | `teams`, `team_members` | `TC-COL-01` | P1 | Deferred to v1.1 |
| **COLLAB-002**| Collaboration | Cohort Leaderboard | As a student, I want to see how my squad is performing on mastery. | `SCREEN-LEAD-01` | `GET /api/leaderboard` | `leaderboard_snapshots` | `TC-COL-02` | P1 | Deferred to v1.1 |
