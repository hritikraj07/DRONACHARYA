# Dronacharya — Architecture Decision Records (ADRs) & Open Questions

---

## 1. Document Overview

This document records the foundational architectural decisions, operational trade-offs, working assumptions, and unresolved questions for the **Dronacharya** platform. Every major architectural divergence is formalized as an **Architecture Decision Record (ADR)** to prevent recurring debates during development.

---

## 2. Architecture Decision Records (ADRs)

### ADR-001: Client-Side WebAssembly (Pyodide) vs. Cloud Container Sandboxing (Judge0 / Docker)
* **Status:** **CONFIRMED**
* **Context:** The platform requires an execution sandbox where students can run untrusted Python code and unit tests. Traditional cloud sandboxing (e.g., spinning up isolated Docker containers on AWS ECS or using Judge0) introduces substantial server infrastructure costs, cold-start latency ($>2\text{s}$), and severe multi-tenant security vulnerabilities (RCE, fork bombs, crypto-mining).
* **Decision:** Execute all student code directly on the user's browser inside a dedicated **Web Worker running Pyodide 0.25 (WebAssembly)**.
* **Consequences:**
  * *Pros:* $\$0.00$ server compute cost; instantaneous execution response; host server infrastructure cannot be hacked by student scripts; offline execution capability.
  * *Cons:* Initial Wasm bundle download ($\approx 8\text{MB}$ gzipped on first visit, cached thereafter); restricted to languages compilable to Wasm (Python in MVP; C++ / Rust in future; Java requires JVM in Wasm).

---

### ADR-002: Socratic 4-Tier Escalation vs. Open-Ended AI Chat
* **Status:** **CONFIRMED**
* **Context:** Generic LLM chatbots (ChatGPT, Claude) immediately output full solutions when pasted with homework questions, depriving students of the opportunity to develop problem-solving skills.
* **Decision:** Constrain Acharya AI to a rigid 4-tier progressive hint protocol (Nudge $\to$ Pattern $\to$ Pinpoint $\to$ Parallel Analogy). Outputting the direct solution to an active challenge is blocked at the system prompt and response filter layers.
* **Consequences:**
  * *Pros:* Preserves pedagogical integrity; fosters deep understanding; differentiates Dronacharya from generic wrapper apps.
  * *Cons:* Requires meticulous prompt engineering and adversarial output filtering; students seeking immediate quick fixes may experience initial friction.

---

### ADR-003: Relational PostgreSQL (Supabase) vs. Document NoSQL (MongoDB)
* **Status:** **CONFIRMED**
* **Context:** Dronacharya’s data model contains tightly coupled relationships: prerequisite skill graphs, Bayesian Knowledge Tracing scores, XP transactions, multi-dimension rubric evaluations, and team squad memberships.
* **Decision:** Utilize **PostgreSQL (hosted on Supabase)** managed via **Prisma ORM**.
* **Consequences:**
  * *Pros:* ACID guarantees for XP transactions; relational integrity for skill prerequisites; native JSONB columns for flexible test cases and conversation logs.
  * *Cons:* Requires structured migration management during schema evolution.

---

### ADR-004: Native CSS Custom Properties + Tailwind vs. Heavy UI Component Libraries (MUI / Chakra)
* **Status:** **CONFIRMED**
* **Context:** The platform demands a unique, handcrafted Indian-inspired aesthetic (Warm Ivory, Forest Green, Antique Brass, refined serif typography) that must feel distinctly scholarly. Generic UI libraries (MUI, Ant Design) look corporate and generic.
* **Decision:** Use **Tailwind CSS anchored to custom CSS tokens** defined in `globals.css` with selective headless primitives (Radix UI) for accessibility.
* **Consequences:**
  * *Pros:* Total design control; zero bundle bloat; guaranteed consistency across color tokens and typography.
  * *Cons:* Requires handcrafting bespoke components (seals, manuscript dividers) rather than dropping in off-the-shelf widgets.

---

### ADR-005: Dual-Mode Sandbox Execution (Pyodide Wasm + Deterministic Fallback)
* **Status:** **CONFIRMED**
* **Context:** Loading Pyodide WebAssembly from CDN can encounter cold-start latency ($>3\text{s}$) on slow connections or fail in air-gapped demo environments.
* **Decision:** Implement a dual-mode execution harness that prioritizes real Pyodide CPython 3.11 Wasm when loaded, with an instantaneous deterministic in-browser test harness for immediate, offline responsiveness.
* **Consequences:**
  * *Pros:* $100\%$ demo reliability; sub-millisecond execution response; zero cloud costs.
  * *Cons:* Deterministic harness requires curated challenge test patterns for advanced missions.

---

### ADR-006: Resilient Socratic Fallback Engine for 100% Uptime
* **Status:** **CONFIRMED**
* **Context:** External LLM APIs (Gemini, OpenAI) are susceptible to rate limits, expired keys, or network outages during live hackathon judging.
* **Decision:** Provide an intelligent, trilingual (EN, HI, Hinglish) 4-tier rulebook engine that activates automatically when `GEMINI_API_KEY` is not present, with transparent UI labeling.
* **Consequences:**
  * *Pros:* The platform remains fully functional without any API keys; never crashes on stage.
  * *Cons:* Fallback responses follow predetermined pedagogical paths for known curriculum topics.

---

## 3. Working Assumptions

1. **Browser Capabilities:** The target audience runs modern evergreen browsers (Chrome 100+, Firefox 100+, Safari 16+, Edge) with WebAssembly and Web Worker support enabled.
2. **Connectivity:** While the Pyodide runtime works offline once cached, an active internet connection is assumed for logging in, querying Acharya AI, and syncing portfolio records.
3. **Language Scope for MVP:** The initial curriculum is focused entirely on **Python & Computational Problem-Solving**, with AI/ML and Business simulators showcased as conceptual prototypes.

---

## 4. Deferred Features (Backlog for v1.1 & v2)

| Feature | Target Milestone | Rationale for Deferral |
|:---|:---|:---|
| Multi-language sandbox (C++, Java, Rust) | v1.1 | Requires backend Docker cluster; Python Pyodide covers $90\%$ of computer science curriculum needs for hackathon MVP. |
| Live Voice-to-Voice Acharya AI | v2.0 | Audio streaming and low-latency speech synthesis introduce excessive third-party API dependencies and cost for initial release. |
| Real-time Collaborative Code Pairing (WebSockets) | v1.1 | Async squad missions provide $80\%$ of collaborative value without the engineering complexity of Operational Transformation (OT) / CRDTs. |
| Cryptographic Blockchain-Anchored Credentials | v2.0 | Standard SHA-256 server-signed verification hashes hosted on public URLs provide adequate tamper-proof verification for MVP employers. |

---

## 5. Unresolved Questions for Team Review

1. **Regional Language Prioritization:** In addition to English and Hindi/Hinglish, which third Indian language should receive tier-1 prompt validation? (Candidates: Tamil, Telugu, Marathi, Bengali).
2. **Pyodide Cold-Start UX:** On slow 3G connections, downloading the Pyodide Wasm bundle can take 4–6 seconds on the first visit. Should we preload the Wasm runtime during the onboarding tutorial screen?
3. **Faculty Grading Portal:** Should mentors have a separate login portal in MVP, or should we focus exclusively on the student and recruiter experiences for the hackathon judging panel?
