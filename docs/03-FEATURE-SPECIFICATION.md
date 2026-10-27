# Dronacharya — Comprehensive Feature Specification

---

## 1. Document Overview

This specification details the architecture, behavior, data contracts, state handling, and MVP implementation strategies across all six core pillars of the **Dronacharya** platform. Every feature is specified with production-grade rigor to ensure unambiguous implementation by coding agents and human engineers alike.

---

## 2. Pillar A: AI-Powered Personalised Learning

### 2.1 Feature A1: Adaptive Diagnostic Assessment (`AI-001`)
* **Purpose:** Rapidly diagnose the student's initial mastery frontier without overwhelming them with lengthy, traditional examinations.
* **User Experience:** An elegant 3-question interactive trial styled as the *Archery Trial of Drona*. Questions calibrate dynamically after each submission based on correctness and confidence.
* **Detailed Behavior:**
  1. Question 1 begins at difficulty level $\theta = 0.5$ (Intermediate).
  2. If correct in $<60\text{s}$, difficulty scales to $\theta = 0.8$ (Advanced); if incorrect, difficulty drops to $\theta = 0.2$ (Foundational).
  3. Responses are evaluated server-side to prevent client-side answer inspection.
* **Inputs & Outputs:**
  * *Input:* `user_id`, `topic_id`, `question_id`, `selected_option_or_code`, `response_time_ms`.
  * *Output:* `{ next_question_id: string, is_complete: boolean, calibrated_mastery: float }`.
* **AI Involvement:** Analyzes student code or multiple-choice rationale to estimate latent mastery parameters using Item Response Theory (IRT).
* **Backend Requirements:** Next.js Route Handler `POST /api/assessments/diagnostic`.
* **Database Dependencies:** `assessments`, `questions`, `user_skill_mastery`.
* **States:**
  * *Loading:* Subtle antique brass spinner with manuscript divider.
  * *Error:* "Trial interrupted. Reconnecting to Acharya..." with retry button.
  * *Empty:* "No diagnostic available for this track yet."
* **Acceptance Criteria:** Must complete in $\le 3$ questions and output an initial skill vector for at least 5 sub-topics.
* **MVP Strategy:** Implement 10 curated questions across Python basics, loops, and recursion with pre-calculated IRT weights.

### 2.2 Feature A2: Bayesian Knowledge Tracing Engine (`AI-002`, `AI-003`)
* **Purpose:** Continuously maintain a probabilistic model of the student's understanding for every individual skill node.
* **Detailed Behavior:**
  * Tracks four standard parameters: $P(L_0)$ (initial mastery), $P(T)$ (transition probability), $P(G)$ (guess probability), and $P(S)$ (slip probability).
  * Upon every practice attempt, updates the posterior probability $P(L_t | \text{evidence})$.
  * If $P(L_t) < 0.60$, automatically unlocks a targeted remedial quest in the learning path.
* **Inputs & Outputs:**
  * *Input:* `{ user_id, skill_id, is_correct, hints_used_count }`.
  * *Output:* `{ updated_mastery: float, state_changed: boolean, recommended_node_id: string }`.
* **Acceptance Criteria:** Mastery score increases upon unassisted passes and decreases upon repeated hint reliance or failed runs.

---

## 3. Pillar B: Learn by Playing (Gamification Engine)

### 3.1 Feature B1: Quest & Mission Journey Architecture (`GAME-001`)
* **Purpose:** Transform dry syllabus lists into an engaging narrative questline without adopting childish cartoon visuals.
* **User Experience:** An editorial Indian manuscript map showing nodes connected by fine geometric lines. Unlocked nodes glow in soft forest green; locked nodes are muted sage grey.
* **Detailed Behavior:**
  * Missions have 3 distinct segments: Briefing (Discover), Sandbox (Experiment), and Evaluation (Demonstrate).
  * Nodes unlock sequentially based on prerequisite mastery thresholds ($P(L) \ge 0.70$).
* **Inputs & Outputs:**
  * *Input:* `path_id`, `user_id`.
  * *Output:* Array of `{ node_id, title, status: 'locked'|'unlocked'|'mastered', xp_reward, est_time_mins }`.
* **MVP Strategy:** Provide one complete end-to-end questline: "Python Computational Mastery" with 5 sequential nodes.

### 3.2 Feature B2: Mastery XP & Anti-Grind Engine (`GAME-002`, `GAME-004`)
* **Purpose:** Reward intellectual mastery and disciplined persistence while strictly penalizing point-farming and shallow grinding.
* **XP Formulation:**
  $$\text{XP}_{\text{awarded}} = \text{BaseXP} \times \text{DifficultyMultiplier} \times \left(1 - 0.15 \times \text{HintsUsed}\right) \times \text{FatigueFactor}$$
  * Where $\text{FatigueFactor} = \max\left(0.20, 1.0 - 0.015 \times \max(0, \text{MinutesToday} - 60)\right)$.
* **Acceptance Criteria:** A user attempting the same solved challenge repeatedly receives 0 XP after the second pass.

---

## 4. Pillar C: Theory-to-Practice Simulators

### 4.1 Feature C1: Sandboxed WebAssembly Python IDE (`SIM-001`, `SIM-002`)
* **Purpose:** Enable instantaneous, secure, zero-cloud-cost code execution for Python algorithms directly in the user's browser.
* **User Experience:** Split-pane interface: Left pane contains the mission brief and unit test cases; Right pane contains a Monaco/CodeMirror code editor and an interactive terminal console.
* **Detailed Behavior:**
  1. The client instantiates a dedicated Web Worker running **Pyodide** (CPython compiled to Wasm).
  2. Code execution is isolated from the DOM, cookies, and local storage.
  3. An execution timeout timer kills the worker if execution exceeds $5000\text{ms}$ (infinite loop protection).
  4. Stdout and stderr are captured and streamed to the terminal console.
  5. The test runner executes 3 visible tests and 2 hidden edge-case tests.
* **Inputs & Outputs:**
  * *Input:* `code: string`, `test_suite: string`, `timeout_ms: number`.
  * *Output:* `{ stdout: string, stderr: string, passed_count: number, total_count: number, execution_time_ms: number, memory_bytes: number }`.
* **State Handling:**
  * *Loading Wasm:* "Warming up Pyodide runtime... (~1.2s)".
  * *Timeout:* "Execution terminated: Code exceeded 5000ms limit. Did you create an infinite loop?".
* **Acceptance Criteria:** Executes standard Python 3.11 code with zero backend server dependencies; stops infinite loops cleanly without freezing the browser UI.

---

## 5. Pillar D: Socratic AI Mentor ("Acharya AI")

### 5.1 Feature D1: 4-Tier Progressive Hinting (`MENT-001`, `MENT-002`)
* **Purpose:** Empower students to experience the eureka moment of solving problems themselves rather than copying LLM-generated code.
* **Detailed Behavior:**
  * The student clicks "Request Guidance".
  * Acharya AI evaluates the request against a strict Socratic prompt hierarchy:
    * **Tier 1 (Nudge):** Probes the student's assumption (e.g., *"What is the return type of `split()` when the input string is empty?"*).
    * **Tier 2 (Pattern):** Explains the underlying algorithm pattern without referencing the current variable names.
    * **Tier 3 (Line Pinpoint):** Points directly to the line containing the logical bug (e.g., *"Look at line 8: does this condition ever evaluate to True?"*).
    * **Tier 4 (Analogous Solution):** Demonstrates a completely different problem sharing the exact same structural pattern. Full homework solutions are strictly prohibited.
* **Inputs & Outputs:**
  * *Input:* `{ code: string, error_log: string, mission_id: string, hint_level: 1|2|3|4, student_lang: 'en'|'hi' }`.
  * *Output:* `{ hint_text: string, hint_level_rendered: number, follow_up_question: string }`.
* **Multilingual Capability:** Fluent code-switching between English, Devanagari Hindi, and Latin-script Hinglish.

---

## 6. Pillar E: Real-World Projects & Skill Proof

### 6.1 Feature E1: Capstone Project Workspace & Rubric Evaluation (`PROJ-001`, `PROJ-002`)
* **Purpose:** Bridge the gap from small single-function challenges to multi-file, architecture-driven real-world applications.
* **Detailed Behavior:**
  * Students develop against an industry-realistic specification (e.g., *Build an In-Memory Cache with TTL & LRU Eviction*).
  * Submission triggers a multi-stage evaluation pipeline:
    1. Automated functional tests (50% weight).
    2. Edge-case and stress tests (20% weight).
    3. Static linting & cyclomatic complexity (15% weight).
    4. AI code review assessing readability, docstrings, and modular design (15% weight).
* **Acceptance Criteria:** Generates a comprehensive score card ($0 - 100$) with actionable improvement commentary.

### 6.2 Feature E2: Verifiable Public Portfolio (`PROJ-003`)
* **Purpose:** Provide an irrefutable proof-of-competence profile that students can share with employers and recruiters.
* **Detailed Behavior:**
  * Hosted at `https://dronacharya.edu/u/:username`.
  * Each project card includes:
    * Git commit hash / timestamped submission ID.
    * Number of passing unit tests.
    * Interactive "Inspect Code & Test Runs" button.
    * Cryptographically signed Skill Seal.
* **Acceptance Criteria:** Unauthenticated public users can view the portfolio and verify the validity of any claimed skill.

---

## 7. Pillar F: Collaborative Learning & Cohorts

### 7.1 Feature F1: Gurukul Squads Hub (`COLLAB-001`)
* **Purpose:** Foster peer motivation, collaborative problem-solving, and cohort accountability.
* **User Experience:** Squad dashboard showing shared weekly goals, cohort member activity feeds, and collective mastery metrics.
* **Detailed Behavior:**
  * Squads consist of 3 to 5 students.
  * Squads earn collective "Gurukul Honor Points" when all members hit their weekly learning targets.
  * Individual members can request a peer code review on their capstone milestones.
* **MVP Strategy:** P1 feature. For MVP hackathon scope, provide UI mockups and database schema, reserving real-time WebSockets for v1.1.
