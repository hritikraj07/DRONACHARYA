# Dronacharya — AI-Powered Gamified Learning Platform

> *"From Knowledge to Mastery: Reimagining the Ancient Indian Gurukul for Modern Engineers"*

---

## 1. Executive Overview

**Dronacharya** is a full-stack, intelligent gamified learning platform inspired by Guru Dronacharya of the Indian epic *Mahabharata*—the timeless symbol of discipline, precision, focus, and mastery. It bridges the chasm between passive online lecture streaming and real-world practical execution through an unbroken 8-stage pedagogical continuum:

$$\mathbf{Discover} \longrightarrow \mathbf{Understand} \longrightarrow \mathbf{Practise} \longrightarrow \mathbf{Play} \longrightarrow \mathbf{Experiment} \longrightarrow \mathbf{Build} \longrightarrow \mathbf{Demonstrate} \longrightarrow \mathbf{Master}$$

---

## 2. Six Core Pillars Implemented

1. **AI-Powered Personalised Learning:**
   - 3-Question Adaptive Diagnostic Trial evaluating baseline ability.
   - Dynamic **Bayesian Knowledge Tracing (BKT)** updating mastery probabilities $P(L_k) \in [0.0, 1.0]$.
   - Automatic injection of remedial practice quests when prerequisite mastery drops below $0.60$.
2. **Learn by Playing (Gamification Engine):**
   - Narrative-driven interactive coding quests with server-validated Mastery XP.
   - Anti-grind fatigue governor reducing XP after 60 daily minutes to encourage healthy reflection.
   - Gurukul Mastery Ranks: *Sadhaka (Seeker)*, *Abhyasi (Practitioner)*, *Vidvan (Scholar)*, and *Acharya (Master Guide)*.
   - Daily Focus Streaks with automatic 14-day Grace Freezes.
   - Verifiable, cryptographically signed **Quest Badges & Milestones**.
3. **Theory-to-Practice Simulators:**
   - **Interactive 2D Python RPG Arena ("Rover Arya's Odyssey"):** Interactive game canvas controlled through real Python code with visual navigation, battery collection, dynamic fog-of-war, and AST analysis.
   - **Full Web Laboratory Sandbox:** Live dual-screen environment with HTML, CSS, and JavaScript real-time DOM sandbox previews and automatic test suite assertion.
   - **AI/ML Parameter Studio:** Interactive sliders for Learning Rate ($\alpha$), Epochs, and L2 Regularization with real-time loss convergence curves.
   - **Startup & Business Simulator:** Interactive SaaS unit economics calculator modeling Customer Acquisition Cost (CAC), Lifetime Value (LTV), and cash runway.
4. **Acharya AI Socratic Mentor:**
   - Persistent conversational slide-out drawer accessible across all screens.
   - Contextual AST code analyzer inspecting student syntax and live console errors in real time.
   - 4-Tier Non-Spoiler Hint Escalator: *1. Conceptual Nudge* $\to$ *2. Structural Pattern* $\to$ *3. Line Pinpoint* $\to$ *4. Parallel Analogy*.
   - Trilingual support: English, standard Hindi (Devanagari), and natural conversational Hinglish.
   - Multi-provider AI Engine supporting Groq (Llama 3.3 70B), Gemini 1.5 Flash, OpenAI GPT-4o-mini, and an offline AST inspector.
5. **Code Dungeon & Proof of Skill:**
   - Multi-floor 2D procedural Code Dungeon with voxel quarries, lava rivers, and dynamic bridge crafting.
   - Public Verifiable Portfolio (`/portfolio/:username`) displaying earned badges, skill vectors, and auditable execution proofs.
6. **Collaborative Learning (Gurukul Squads):**
   - 3-5 member study guilds (*Kashi Algorithmic Guild*).
   - Shared weekly milestone goals and squad collective XP.
   - Peer review station to request and submit code reviews for Gurukul Honor points.

---

## 3. Technology Stack & Design System

- **Framework:** Next.js 16 (Turbopack, App Router) + TypeScript + Tailwind CSS
- **Design Tokens & Warm Canvas Aesthetic:**
  - *Warm Ivory (`#FAF6EE` / `#F5F2EB`):* Primary canvas and parchment surfaces
  - *Deep Charcoal (`#1E1E24`):* Neo-brutalist 2px borders and typography
  - *Arcade Gold (`#FFD214`):* Interactive highlights, CTA buttons, and rank accents
  - *Royal Purple (`#6C5CE7`):* Primary curriculum badges and mentor accents
  - *Emerald Green (`#00B894`):* Success states, cleared milestones, and pass badges
- **Typography:** Lora (Editorial Headings), Inter (UI & Body), JetBrains Mono (Code)
- **Audio & Animations:** Web Audio API 8-bit synthesizer + Canvas Confetti + Custom Pixel Cursor

---

## 4. Master Documentation Directory (SSOT)

Complete, architectural specifications are stored in the `docs/` directory:

```
docs/
├── 00-PROJECT-OVERVIEW.md                 # Product Vision, Brand, Problem Statement & Strategy
├── 01-PRODUCT-REQUIREMENTS.md             # Functional & Non-Functional Requirements + Traceability Matrix
├── 02-USER-JOURNEYS.md                    # Detailed End-to-End Flows with Mermaid Visualizations
├── 03-FEATURE-SPECIFICATION.md            # Deep-dive Specs for all 6 Core Pillars & Sub-features
├── 04-UI-UX-DESIGN-SYSTEM.md              # Indian-Inspired Design System, Tokens, Typography & Rules
├── 05-PAGE-AND-SCREEN-SPECIFICATION.md    # Screen-by-Screen Layouts, States & Interactive Specs
├── 06-DESIGN-AND-INTERACTION-FLOWS.md     # Information Architecture, Navigation & State Diagrams
├── 07-AI-AND-PERSONALISATION.md           # Knowledge Tracing, Adaptive Engine & Prompt Schemas
├── 08-AI-MENTOR-AND-FEEDBACK.md           # Acharya AI Socratic Mentor, Hint Hierarchies & Multilingual
├── 09-GAMIFICATION-AND-LEARNING-ENGINE.md # XP Mechanics, Mastery Levels, Anti-Grind & Leaderboards
├── 10-SIMULATORS-AND-PRACTICAL-PROJECTS.md# Theory-to-Practice Simulation Sandboxes & Portfolios
├── 11-TECH-STACK-AND-ARCHITECTURE.md      # Full-Stack Next.js/Supabase Architecture & Trade-offs
├── 12-DATABASE-SCHEMA.md                  # Relational PostgreSQL Schema, DDL SQL & Seed Structures
├── 13-API-AND-BACKEND-SPECIFICATION.md    # REST & Server Action Endpoints, Request/Response Schemas
├── 14-SECURITY-PRIVACY-AND-RELIABILITY.md # Sandbox Isolation, DPDP Compliance & Prompt Guardrails
├── 15-MVP-IMPLEMENTATION-ROADMAP.md       # 13-Phase Realistic Hackathon & Production Rollout Plan
├── 16-TESTING-AND-ACCEPTANCE.md           # Automated, E2E, AI-Evaluation & Demo Smoke Testing
├── 17-HACKATHON-DEMO-AND-PITCH.md         # 3-min & 5-min Pitch Scripts, Demo Datasets & Rubrics
└── 18-DECISIONS-AND-OPEN-QUESTIONS.md     # Architecture Decision Records (ADRs) & Open Questions
```

### Document Summary Matrix

| Document | Primary Audience | Key Topics Covered |
|:---|:---|:---|
| [00-PROJECT-OVERVIEW.md](docs/00-PROJECT-OVERVIEW.md) | Leadership, Judges, Team | Cultural vision, problem-solution fit, Gurukul philosophy, impact metrics |
| [01-PRODUCT-REQUIREMENTS.md](docs/01-PRODUCT-REQUIREMENTS.md) | Product Managers, Engineers | 45+ Traceable Requirements (REQ, AI, GAME, SIM, PROJ, COLLAB), Personas |
| [02-USER-JOURNEYS.md](docs/02-USER-JOURNEYS.md) | UX Designers, Frontend | 8 Key journeys from Onboarding to Tournament with Mermaid diagrams |
| [03-FEATURE-SPECIFICATION.md](docs/03-FEATURE-SPECIFICATION.md) | Full-Stack Developers | Exhaustive specification of all six core solution modules |
| [04-UI-UX-DESIGN-SYSTEM.md](docs/04-UI-UX-DESIGN-SYSTEM.md) | UI/UX Designers, Frontend | Warm Ivory, Charcoal, Arcade Gold tokens, Lora & Inter typography |
| [05-PAGE-AND-SCREEN-SPECIFICATION.md](docs/05-PAGE-AND-SCREEN-SPECIFICATION.md) | Frontend Developers | Wireframes, state transitions (loading, empty, error), key screen specs |
| [06-DESIGN-AND-INTERACTION-FLOWS.md](docs/06-DESIGN-AND-INTERACTION-FLOWS.md) | Frontend Developers | Information Architecture, modal patterns, responsive drawer rules |
| [07-AI-AND-PERSONALISATION.md](docs/07-AI-AND-PERSONALISATION.md) | AI Engineers, Backend | Bayesian Knowledge Tracing, Adaptive difficulty, JSON prompt schemas |
| [08-AI-MENTOR-AND-FEEDBACK.md](docs/08-AI-MENTOR-AND-FEEDBACK.md) | AI Engineers, Prompt Crafters | Socratic guidance, 4-tier progressive hints, Hindi/English bilingual routing |
| [09-GAMIFICATION-AND-LEARNING-ENGINE.md](docs/09-GAMIFICATION-AND-LEARNING-ENGINE.md) | Game Designers, Backend | Mastery-based XP formulas, Quest Badges, Anti-grind fatigue governors |
| [10-SIMULATORS-AND-PRACTICAL-PROJECTS.md](docs/10-SIMULATORS-AND-PRACTICAL-PROJECTS.md) | Sandbox Engineers | Pyodide WebAssembly runner, 2D RPG canvas, Verifiable portfolios |
| [11-TECH-STACK-AND-ARCHITECTURE.md](docs/11-TECH-STACK-AND-ARCHITECTURE.md) | Tech Leads, DevOps | Next.js 16 App Router, Turbopack, Tailwind design tokens, Edge runtime |
| [12-DATABASE-SCHEMA.md](docs/12-DATABASE-SCHEMA.md) | Database Admins, Backend | Relational PostgreSQL Schema, DDL SQL, Indexes, Foreign Keys, JSONB schemas |
| [13-API-AND-BACKEND-SPECIFICATION.md](docs/13-API-AND-BACKEND-SPECIFICATION.md) | Backend Developers | Multi-LLM `/api/acharya` endpoint, telemetry contracts, error envelopes |
| [14-SECURITY-PRIVACY-AND-RELIABILITY.md](docs/14-SECURITY-PRIVACY-AND-RELIABILITY.md) | Security Leads, DevSecOps | Sandbox Isolation, DPDP Compliance & Prompt Guardrails |
| [15-MVP-IMPLEMENTATION-ROADMAP.md](docs/15-MVP-IMPLEMENTATION-ROADMAP.md) | Scrum Masters, Devs | 13-Phase sprint delivery plan, critical path milestones, effort estimates |
| [16-TESTING-AND-ACCEPTANCE.md](docs/16-TESTING-AND-ACCEPTANCE.md) | QA Engineers, Testers | Vitest, E2E test suites, LLM evaluation benchmarks, smoke checklists |
| [17-HACKATHON-DEMO-AND-PITCH.md](docs/17-HACKATHON-DEMO-AND-PITCH.md) | Presenters, Founders | High-impact pitch narrative, 3-min demo walk, seeded demo personas |
| [18-DECISIONS-AND-OPEN-QUESTIONS.md](docs/18-DECISIONS-AND-OPEN-QUESTIONS.md) | System Architects | 8 Architecture Decision Records (ADRs), trade-offs, deferred features |

### Recommended Reading Paths

- **For Developers & Engineers:**
  1. Start with [docs/04-UI-UX-DESIGN-SYSTEM.md](docs/04-UI-UX-DESIGN-SYSTEM.md) for styling tokens and component patterns.
  2. Review [docs/11-TECH-STACK-AND-ARCHITECTURE.md](docs/11-TECH-STACK-AND-ARCHITECTURE.md) and [docs/12-DATABASE-SCHEMA.md](docs/12-DATABASE-SCHEMA.md).
  3. Reference [docs/08-AI-MENTOR-AND-FEEDBACK.md](docs/08-AI-MENTOR-AND-FEEDBACK.md) for the Acharya Socratic AI architecture.
- **For Evaluators & Judges:**
  1. Begin with [docs/00-PROJECT-OVERVIEW.md](docs/00-PROJECT-OVERVIEW.md) for the core thesis, cultural vision, and problem statement.
  2. Review [docs/17-HACKATHON-DEMO-AND-PITCH.md](docs/17-HACKATHON-DEMO-AND-PITCH.md) for the high-impact demonstration flow.
  3. Inspect [docs/01-PRODUCT-REQUIREMENTS.md](docs/01-PRODUCT-REQUIREMENTS.md) for the full requirement traceability matrix.

---

## 5. Architectural Invariants

Every engineer and AI agent contributing to Dronacharya must adhere to these five architectural invariants:

1. **Brand Aesthetic Integrity:** Dronacharya is an intellectual, Indian-inspired digital Gurukul. The visual baseline is **Warm Ivory / Parchment (`#FAF6EE`)** canvas with **Deep Charcoal (`#1E1E24`)** borders, **Arcade Gold (`#FFD214`)**, and **Royal Purple (`#6C5CE7`)** accents. Generic neon cyberpunk glows, gradient mesh clutter, and plain white minimum-viable cards are prohibited.
2. **Pedagogical Socratic Primacy:** The AI Mentor (*Acharya AI*) must never immediately output complete homework solutions. It must guide the student through progressive tier-1 to tier-4 hints, rewarding deductive reasoning.
3. **Safe Sandboxed Execution:** Untrusted user code in the Simulator must never execute on the central backend without containment. All client-side code executes inside isolated Web Workers / WebAssembly runtimes (e.g., Pyodide).
4. **Verifiable Proof of Skill:** A skill badge or portfolio certificate is never awarded purely for reading or answering multiple choice questions. It requires reproducible evidence (interactive challenge completion, passed unit tests, or evaluated project artifacts).
5. **Traceability and Stability:** All code implementations must map directly to Requirement IDs (`REQ-XXX`, `AI-XXX`, `GAME-XXX`, etc.) defined in [docs/01-PRODUCT-REQUIREMENTS.md](docs/01-PRODUCT-REQUIREMENTS.md).

---

## 6. Getting Started

### Prerequisites
- Node.js 18+ (tested on Node v20/v24)
- npm 9+

### Installation & Development Run
```bash
# 1. Install dependencies
npm install

# 2. Run local development server (Turbopack)
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

### Production Build
```bash
npm run build
npm run start
```
