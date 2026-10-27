# Dronacharya — Page & Screen Specification

---

## 1. Document Overview

This specification details the wireframes, component composition, interactive states, responsive behavior, and MVP designation for all 22 screens across the **Dronacharya** platform. Every screen strictly adheres to the design tokens and typography defined in [04-UI-UX-DESIGN-SYSTEM.md](./04-UI-UX-DESIGN-SYSTEM.md).

---

## 2. Screen Inventory & MVP Status

| Screen ID | Screen Name | Route | Priority | MVP Status |
|:---|:---|:---|:---|:---|
| `SCREEN-LAND-01` | Public Landing Page | `/` | P0 | Core MVP |
| `SCREEN-AUTH-01` | Authentication (Sign In / Sign Up) | `/auth` | P0 | Core MVP |
| `SCREEN-ONB-01` | Onboarding & Track Selection | `/onboarding` | P0 | Core MVP |
| `SCREEN-DIAG-01` | Adaptive Diagnostic Trial | `/diagnostic` | P0 | Core MVP |
| `SCREEN-DASH-01` | Student Dashboard (Gurukul Courtyard)| `/dashboard` | P0 | Core MVP |
| `SCREEN-PATH-01` | Learning Path & Quest Map | `/paths/:id` | P0 | Core MVP |
| `SCREEN-CRSE-01` | Subject Overview & Syllabus | `/courses/:id` | P1 | v1.1 |
| `SCREEN-LESN-01` | Interactive Conceptual Lesson | `/lessons/:id` | P0 | Core MVP |
| `SCREEN-MISS-01` | Mission Briefing & Challenge | `/missions/:id` | P0 | Core MVP |
| `SCREEN-SIM-01` | WebAssembly Python Simulator | `/simulator/:id`| P0 | Core MVP |
| `SCREEN-AIML-01` | AI/ML Parameter Studio | `/simulators/ai-ml`| P2 | Concept Mockup |
| `SCREEN-BIZ-01` | Virtual Business Simulator | `/simulators/biz`| P2 | Concept Mockup |
| `SCREEN-MENT-01` | Acharya AI Mentor Drawer | Global Overlay | P0 | Core MVP |
| `SCREEN-RSLT-01` | Challenge Results & Feedback Modal| Global Modal | P0 | Core MVP |
| `SCREEN-PROJ-01` | Capstone Project Workspace | `/projects/:id` | P0 | Core MVP |
| `SCREEN-PROJ-02` | Project Rubric Evaluation | `/projects/:id/eval`| P0 | Core MVP |
| `SCREEN-PORT-01` | Public Verifiable Portfolio | `/u/:username` | P0 | Core MVP |
| `SCREEN-ACH-01` | Mastery Seals & Achievements Gallery| `/achievements` | P0 | Core MVP |
| `SCREEN-TEAM-01` | Gurukul Squad Workspace | `/squads/:id` | P1 | v1.1 |
| `SCREEN-TOUR-01` | Tournament Arena | `/tournaments/:id`| P2 | Future |
| `SCREEN-LEAD-01` | Cohort Mastery Leaderboard | `/leaderboard` | P1 | v1.1 |
| `SCREEN-SETT-01` | Student Profile & Settings | `/settings` | P0 | Core MVP |

---

## 3. Core Screen Deep-Dive Specifications

### 3.1 Screen: Public Landing Page (`SCREEN-LAND-01`)
* **Purpose:** Introduce Dronacharya's value proposition, demonstrate the cultural-intellectual ethos, and convert visitors into enrolled learners.
* **Layout & Grid:** 12-column responsive grid, centered container ($1200\text{px}$ max-width).
* **Key Components:**
  1. *Header Navigation:* Minimal logo (Arrow of Ekagrata), Nav Links ("The Pedagogy", "Paths", "Demonstration", "About"), "Enter Gurukul" CTA button.
  2. *Hero Section:* Lora heading: *"Where Theory Becomes Instinct."* Subheading explaining the Gurukul methodology. Primary CTA: "Begin Diagnostic Trial" (`Forest Green`).
  3. *The 8-Stage Wheel:* Interactive visualization showing the journey from *Discover* to *Master*.
  4. *Live Simulator Teaser:* Embedded non-editable code block showing an interactive call-stack animation.
  5. *Footer:* Institutional links, DPDP privacy guarantee, bilingual language switch.
* **States:**
  * *Default:* Warm Ivory background with subtle jaali hero texture.

---

### 3.2 Screen: WebAssembly Python Simulator (`SCREEN-SIM-01`)
* **Purpose:** The primary hands-on execution workspace where students write code, debug errors, and run unit tests.
* **Layout Structure:** 2-column split viewport:
  ```
  +-------------------------------------------------------------------------+
  | Top Bar: Mission Title | Back to Path | Acharya AI (Drawer Trigger) | XP|
  +-----------------------------------+-------------------------------------+
  | LEFT PANEL (40% width):           | RIGHT PANEL (60% width):            |
  | 1. Mission Narrative Brief        | 1. Monaco Editor (Python 3.11)      |
  | 2. Input/Output Constraints       | 2. Action Bar:                      |
  | 3. Test Cases (Visible vs Hidden) |    [Run Code]  [Submit Mission]     |
  | 4. Theory Nudge Link              | 3. Terminal Console (stdout/stderr) |
  |                                   | 4. Test Results Matrix (Pass/Fail)  |
  +-----------------------------------+-------------------------------------+
  ```
* **Interactive Behavior:**
  * Clicking "Run Code" transmits the string to the Pyodide Web Worker.
  * Console streams execution output line by line.
  * If an exception occurs, a discrete Terracotta pill appears: *"Acharya AI: I see an issue on line 6. Click for guidance."*
* **States:**
  * *Running:* Button shows a spinning brass wheel; terminal indicates *"Executing in Pyodide sandbox..."*.
  * *Error:* Console displays syntax error or stack trace in dark charcoal box with red line indicators.
  * *Success:* Modal `SCREEN-RSLT-01` pops up with celebratory gong audio cue, XP tally, and "Advance to Next Quest" button.

---

### 3.3 Screen: Acharya AI Mentor Drawer (`SCREEN-MENT-01`)
* **Purpose:** Contextual, Socratic AI assistance directly inside the learning and coding workspaces.
* **Layout:** Slide-over drawer ($420\text{px}$ width) animating smoothly from the right viewport edge.
* **Key Components:**
  1. *Drawer Header:* Avatar (Antique brass seal motif), Title: "Acharya AI", Language toggle (EN | HI | Hinglish).
  2. *Context Banner:* "Reviewing your current code in `route_cost()`".
  3. *Chat Stream:* Bubble dialogue with alternating messages.
  4. *Hint Escalator Selector:* Visual tier indicator:
     - `[Tier 1: Conceptual Nudge]`
     - `[Tier 2: Code Pattern]`
     - `[Tier 3: Pinpoint Bug]`
     - `[Tier 4: Analogy]`
  5. *Chat Input:* Text field with preset quick prompts: *"Explain the error"*, *"Give me a hint"*, *"Explain in Hindi"*.
* **Interactions:**
  * Clicking `[Tier 1: Nudge]` automatically posts a contextual prompt without revealing the answer.

---

### 3.4 Screen: Public Verifiable Portfolio (`SCREEN-PORT-01`)
* **Purpose:** An undeniable, high-credibility proof-of-work portfolio for job hunting and peer review.
* **Layout:** Scholarly editorial folio design.
* **Key Components:**
  1. *Student Folio Header:* Name, Avatar, Gurukul Cohort, Total Mastery XP, Verified Skill Seal count.
  2. *Mastery Radar Chart:* Multi-axis chart displaying evaluated proficiency across Algorithms, Systems, AI, and Software Engineering.
  3. *Capstone Projects Grid:* Each project card shows:
     - Project Title (e.g., "In-Memory LRU Cache with TTL").
     - Live execution status badge: `All 14 Tests Passing`.
     - Repository & code snapshot link.
     - "Inspect Test Evidence" button (opens a modal displaying the exact unit tests passed).
  4. *Earned Seals Shelf:* Antique brass medals with engraved icons and mint dates.
* **States:**
  * *Unauthenticated Visitor:* Can view all verified evidence; "Fork/Inspect Project" buttons are public.
  * *Owner:* Displays "Edit Bio" and "Share Portfolio URL" buttons.
