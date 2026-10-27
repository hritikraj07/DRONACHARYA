# Dronacharya — AI-Powered Gamified Learning Platform

> *"From Knowledge to Mastery: Reimagining the Ancient Indian Gurukul for Modern Engineers"*

---

## 1. Overview

**Dronacharya** is a full-stack, AI-powered gamified learning platform inspired by Guru Dronacharya of the Indian epic *Mahabharata*. It bridges the chasm between passive online lecture streaming and real-world practical mastery through an unbroken 8-stage pedagogical loop:

$$\mathbf{Discover} \longrightarrow \mathbf{Understand} \longrightarrow \mathbf{Practise} \longrightarrow \mathbf{Play} \longrightarrow \mathbf{Experiment} \longrightarrow \mathbf{Build} \longrightarrow \mathbf{Demonstrate} \longrightarrow \mathbf{Master}$$

---

## 2. Six Core Pillars Implemented

1. **AI-Powered Personalised Learning:**
   - 3-Question Adaptive Diagnostic Trial evaluating baseline ability.
   - Dynamic **Bayesian Knowledge Tracing (BKT)** updating mastery probabilities $P(L_k) \in [0.0, 1.0]$.
   - Automatic injection of remedial practice quests when prerequisite mastery drops below $0.60$.
2. **Learn by Playing (Gamification Engine):**
   - Narrative-driven missions with server-validated Mastery XP.
   - Anti-grind fatigue governor reducing XP after 60 daily minutes to encourage healthy reflection.
   - Gurukul Mastery Ranks: *Sadhaka (Seeker)*, *Abhyasi (Practitioner)*, *Vidvan (Scholar)*, and *Acharya (Master Guide)*.
   - Daily Focus Streaks with automatic 14-day Grace Freezes.
   - Verifiable, cryptographically signed Antique Brass **Mastery Seals**.
3. **Theory-to-Practice Simulators:**
   - **Python WebAssembly Simulator:** Executes student Python 3.11 code directly in an isolated browser Web Worker (via Pyodide) with zero server cloud costs, instantaneous execution, and watchdog timeout guards.
   - **AI/ML Parameter Studio:** Interactive sliders for Learning Rate ($\alpha$), Epochs, and L2 Regularization with real-time loss convergence curves.
   - **Startup & Business Simulator:** Interactive SaaS unit economics calculator modeling Customer Acquisition Cost (CAC), Lifetime Value (LTV), and cash runway.
4. **Acharya AI Socratic Mentor:**
   - Persistent conversational slide-out drawer accessible across all screens.
   - 4-Tier Non-Spoiler Hint Escalator: *1. Conceptual Nudge* $\to$ *2. Structural Pattern* $\to$ *3. Line Pinpoint* $\to$ *4. Parallel Analogy*.
   - Trilingual support: English, standard Hindi (Devanagari), and natural conversational Hinglish.
   - Live Gemini 1.5 API integration when `GEMINI_API_KEY` is present, paired with an intelligent deterministic Socratic rulebook fallback.
5. **Real-World Projects & Proof of Skill:**
   - Multi-file Capstone Project Workspace (*In-Memory LRU Cache with TTL*).
   - 4-Tier Transparent Rubric Evaluation (Functionality, Edge Cases, Complexity, Code Style).
   - Public Verifiable Portfolio (`/portfolio/:username`) with an auditable "Inspect Execution Proof" modal.
6. **Collaborative Learning (Gurukul Squads):**
   - 3-5 member study guilds (*Kashi Algorithmic Guild*).
   - Shared weekly milestone goals and squad collective XP.
   - Peer review station to request and submit code reviews for Gurukul Honor points.

---

## 3. Technology Stack & Design System

- **Framework:** Next.js 16 (App Router) + TypeScript + Tailwind CSS
- **Design Tokens:**
  - *Warm Ivory (`#F6F1E7`):* Primary light canvas ($75–85\%$ of surfaces)
  - *Parchment (`#E9DFC9`):* Secondary card and panel surfaces
  - *Deep Ink (`#252820`):* High-contrast typography and defined borders
  - *Forest Green (`#354B3A`):* Primary brand accent and action buttons
  - *Antique Brass (`#B49A65`):* Mastery seals, ranks, and achievements
  - *Muted Terracotta (`#A65F43`):* Alerts, action highlights, and hints
- **Typography:** Lora (Editorial Headings), Inter (UI & Body), JetBrains Mono (Code)
- **Icons & Visuals:** Lucide React & Canvas Confetti

---

## 4. Getting Started

### Prerequisites
- Node.js 18+ (tested on Node v24)
- npm 9+

### Installation & Development Run
```bash
# 1. Install dependencies
npm install

# 2. Run local development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

### Production Build
```bash
npm run build
npm run start
```

---

## 5. Documentation Single Source of Truth

Complete, architectural specifications are stored in the `/docs` directory:
- [docs/README.md](./docs/README.md) — Documentation index and reading paths
- [docs/00-PROJECT-OVERVIEW.md](./docs/00-PROJECT-OVERVIEW.md) — Product vision & problem statement
- [docs/01-PRODUCT-REQUIREMENTS.md](./docs/01-PRODUCT-REQUIREMENTS.md) — Traceability matrix (RTM)
- [docs/04-UI-UX-DESIGN-SYSTEM.md](./docs/04-UI-UX-DESIGN-SYSTEM.md) — Design tokens & styling rules
- [docs/07-AI-AND-PERSONALISATION.md](./docs/07-AI-AND-PERSONALISATION.md) — Bayesian Knowledge Tracing math
- [docs/08-AI-MENTOR-AND-FEEDBACK.md](./docs/08-AI-MENTOR-AND-FEEDBACK.md) — Socratic hint protocols
- [docs/10-SIMULATORS-AND-PRACTICAL-PROJECTS.md](./docs/10-SIMULATORS-AND-PRACTICAL-PROJECTS.md) — Pyodide sandbox architecture
