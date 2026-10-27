# Dronacharya — Platform Documentation Index & Architectural Blueprint

> **"From Knowledge to Mastery"**  
> *AI-Powered Gamified Learning Platform Reimagining the Gurukul for the Digital Age*

---

## 1. Executive Summary

**Dronacharya** is an intelligent, gamified learning platform inspired by Guru Dronacharya of the Indian epic Mahabharata—the timeless symbol of discipline, precision, focus, and mastery. Modern education is inundated with passive information: students binge video courses, skim PDFs, pass superficial multiple-choice tests, yet remain unable to write production code, tune machine learning models, or build viable businesses. 

Dronacharya bridges the chasm between theoretical comprehension and practical execution through an unbroken pedagogical continuum:

$$\mathbf{Discover} \longrightarrow \mathbf{Understand} \longrightarrow \mathbf{Practise} \longrightarrow \mathbf{Play} \longrightarrow \mathbf{Experiment} \longrightarrow \mathbf{Build} \longrightarrow \mathbf{Demonstrate} \longrightarrow \mathbf{Master}$$

This documentation corpus forms the definitive Single Source of Truth (SSOT) for architects, UI/UX engineers, AI researchers, and developers constructing the Dronacharya platform.

---

## 2. Master Documentation Directory

The documentation is organized across five modular pillars: Strategy, Design, Learning Intelligence, Technical Architecture, and Delivery.

```
docs/
├── README.md                              # This Documentation Index
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

---

## 3. Document Summary Matrix

| Document | Primary Audience | Key Topics Covered |
|:---|:---|:---|
| [00-PROJECT-OVERVIEW.md](./00-PROJECT-OVERVIEW.md) | Leadership, Judges, Team | Cultural vision, problem-solution fit, Gurukul philosophy, impact metrics |
| [01-PRODUCT-REQUIREMENTS.md](./01-PRODUCT-REQUIREMENTS.md) | Product Managers, Engineers | 45+ Traceable Requirements (REQ, AI, GAME, SIM, PROJ, COLLAB), Personas |
| [02-USER-JOURNEYS.md](./02-USER-JOURNEYS.md) | UX Designers, Frontend | 8 Key journeys from Onboarding to Tournament with Mermaid diagrams |
| [03-FEATURE-SPECIFICATION.md](./03-FEATURE-SPECIFICATION.md) | Full-Stack Developers | Exhaustive specification of all six core solution modules |
| [04-UI-UX-DESIGN-SYSTEM.md](./04-UI-UX-DESIGN-SYSTEM.md) | UI/UX Designers, Frontend | Warm Ivory, Forest Green, Antique Brass tokens, Lora & Inter typography |
| [05-PAGE-AND-SCREEN-SPECIFICATION.md](./05-PAGE-AND-SCREEN-SPECIFICATION.md) | Frontend Developers | Wireframes, state transitions (loading, empty, error), 22 key screen specs |
| [06-DESIGN-AND-INTERACTION-FLOWS.md](./06-DESIGN-AND-INTERACTION-FLOWS.md) | Frontend Developers | Information Architecture, modal patterns, responsive drawer rules |
| [07-AI-AND-PERSONALISATION.md](./07-AI-AND-PERSONALISATION.md) | AI Engineers, Backend | Bayesian Knowledge Tracing, Adaptive difficulty, JSON prompt schemas |
| [08-AI-MENTOR-AND-FEEDBACK.md](./08-AI-MENTOR-AND-FEEDBACK.md) | AI Engineers, Prompt Crafters | Socratic guidance, 4-tier progressive hints, Hindi/English bilingual routing |
| [09-GAMIFICATION-AND-LEARNING-ENGINE.md](./09-GAMIFICATION-AND-LEARNING-ENGINE.md) | Game Designers, Backend | Mastery-based XP formulas, Skill Seals, Anti-grind fatigue governors |
| [10-SIMULATORS-AND-PRACTICAL-PROJECTS.md](./10-SIMULATORS-AND-PRACTICAL-PROJECTS.md) | Sandbox Engineers | Pyodide WebAssembly runner, AI/ML sandbox, Startup sim, Verifiable portfolios |
| [11-TECH-STACK-AND-ARCHITECTURE.md](./11-TECH-STACK-AND-ARCHITECTURE.md) | Tech Leads, DevOps | Next.js 14 App Router, Supabase, Tailwind design tokens, Vercel edge runtime |
| [12-DATABASE-SCHEMA.md](./12-DATABASE-SCHEMA.md) | Database Admins, Backend | 19 PostgreSQL tables, DDL SQL, Indexes, Foreign Keys, JSONB schemas |
| [13-API-AND-BACKEND-SPECIFICATION.md](./13-API-AND-BACKEND-SPECIFICATION.md) | Backend Developers | 30+ REST endpoints, request payloads, response envelopes, error codes |
| [14-SECURITY-PRIVACY-AND-RELIABILITY.md](./14-SECURITY-PRIVACY-AND-RELIABILITY.md) | Security Leads, DevSecOps | Web Worker sandboxing, Prompt injection shields, Indian DPDP Act compliance |
| [15-MVP-IMPLEMENTATION-ROADMAP.md](./15-MVP-IMPLEMENTATION-ROADMAP.md) | Scrum Masters, Devs | 13-Phase sprint delivery plan, critical path milestones, effort estimates |
| [16-TESTING-AND-ACCEPTANCE.md](./16-TESTING-AND-ACCEPTANCE.md) | QA Engineers, Testers | Vitest, Playwright E2E suites, LLM Hallucination benchmarks, smoke checklists |
| [17-HACKATHON-DEMO-AND-PITCH.md](./17-HACKATHON-DEMO-AND-PITCH.md) | Presenters, Founders | High-impact pitch narrative, 3-min demo walk, seeded demo personas |
| [18-DECISIONS-AND-OPEN-QUESTIONS.md](./18-DECISIONS-AND-OPEN-QUESTIONS.md) | System Architects | 8 Architecture Decision Records (ADRs), trade-offs, deferred features |

---

## 4. Recommended Reading Paths

### For AI Coding Agents Implementing Features
1. Start with [04-UI-UX-DESIGN-SYSTEM.md](./04-UI-UX-DESIGN-SYSTEM.md) to initialize CSS tokens and styling utilities.
2. Read [11-TECH-STACK-AND-ARCHITECTURE.md](./11-TECH-STACK-AND-ARCHITECTURE.md) and [12-DATABASE-SCHEMA.md](./12-DATABASE-SCHEMA.md) to initialize models.
3. Consult [03-FEATURE-SPECIFICATION.md](./03-FEATURE-SPECIFICATION.md) and [05-PAGE-AND-SCREEN-SPECIFICATION.md](./05-PAGE-AND-SCREEN-SPECIFICATION.md) for individual page generation.
4. Reference [08-AI-MENTOR-AND-FEEDBACK.md](./08-AI-MENTOR-AND-FEEDBACK.md) and [10-SIMULATORS-AND-PRACTICAL-PROJECTS.md](./10-SIMULATORS-AND-PRACTICAL-PROJECTS.md) for complex agentic/sandboxed behavior.

### For Hackathon Evaluators and Judges
1. Begin with [00-PROJECT-OVERVIEW.md](./00-PROJECT-OVERVIEW.md) for the core thesis and problem differentiation.
2. Review [17-HACKATHON-DEMO-AND-PITCH.md](./17-HACKATHON-DEMO-AND-PITCH.md) for the 3-minute live demonstration flow.
3. Inspect [01-PRODUCT-REQUIREMENTS.md](./01-PRODUCT-REQUIREMENTS.md) for the complete traceability matrix.

---

## 5. Architectural Invariants

Every engineer and AI agent contributing to Dronacharya must adhere to these five non-negotiable architectural invariants:

1. **Brand Aesthetic Integrity:** Dronacharya is an intellectual, Indian-inspired digital Gurukul. The visual baseline is **Warm Ivory (`#F6F1E7`)** background with **Forest Green (`#354B3A`)** brand accents and **Deep Ink (`#252820`)** typography. Neon cyberpunk glows, random card rainbow gradients, and generic AI glassmorphism are strictly prohibited.
2. **Pedagogical Socratic Primacy:** The AI Mentor (*Acharya AI*) must never immediately output complete homework solutions. It must guide the student through progressive tier-1 to tier-4 hints, rewarding deductive reasoning.
3. **Safe Sandboxed Execution:** Untrusted user code in the Simulator must never execute on the central backend without containment. All client-side code executes inside isolated Web Workers / WebAssembly runtimes (e.g., Pyodide).
4. **Verifiable Proof of Skill:** A skill badge or portfolio certificate is never awarded purely for reading or answering multiple choice questions. It requires reproducible evidence (interactive challenge completion, passed unit tests, or evaluated project artifacts).
5. **Traceability and Stability:** All code implementations must map directly to Requirement IDs (`REQ-XXX`, `AI-XXX`, `GAME-XXX`, etc.) defined in [01-PRODUCT-REQUIREMENTS.md](./01-PRODUCT-REQUIREMENTS.md).
