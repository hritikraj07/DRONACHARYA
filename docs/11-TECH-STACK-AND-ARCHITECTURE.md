# Dronacharya — Tech Stack & Full-Stack System Architecture

---

## 1. System Architecture Overview

**Dronacharya** is engineered as a modern, high-performance, modular web application utilizing a Next.js full-stack architecture, paired with client-side WebAssembly execution to achieve zero server infrastructure costs for code sandboxing.

```mermaid
graph TB
    subgraph Client Layer (Browser)
        ReactUI["Next.js React Client (App Router)<br/>Tailwind CSS + Design Tokens"]
        Monaco["Monaco Code Editor"]
        WebWorker["Web Worker Sandbox (Pyodide Wasm)"]
        StateStore["Zustand Client State (User, Quest, IDE)"]
    end

    subgraph Edge & API Gateway (Vercel)
        NextServer["Next.js 14 Route Handlers & Server Actions"]
        AuthMiddleware["JWT / Supabase Auth Middleware"]
        RateLimiter["Upstash Redis Rate Limiter"]
    end

    subgraph Intelligence Layer (AI Services)
        GeminiAPI["Google Gemini 1.5 Flash / Pro API<br/>Socratic Prompt Engine & JSON Schema Validation"]
        SemanticCache["Redis Semantic Response Cache"]
    end

    subgraph Data & Persistence Layer (Supabase / PostgreSQL)
        PostgresDB[("PostgreSQL Relational DB<br/>(Prisma / Drizzle ORM)")]
        StorageBucket["Supabase Object Storage<br/>(Student Project Artifacts & SVGs)"]
    end

    ReactUI --> NextServer
    Monaco --> WebWorker
    NextServer --> AuthMiddleware
    NextServer --> RateLimiter
    NextServer --> GeminiAPI
    GeminiAPI <--> SemanticCache
    NextServer --> PostgresDB
    NextServer --> StorageBucket
```

---

## 2. Technology Stack Selection & Justification

| Layer | Selected Technology | Alternative Considered | Justification & Architectural Trade-offs |
|:---|:---|:---|:---|
| **Framework** | **Next.js 14+ (App Router)** | Vite + Express / React SPA | Single unified full-stack codebase with React Server Components (RSC) for fast SSR, automatic route optimization, and seamless API Route Handlers. |
| **Language** | **TypeScript 5.x** | Vanilla JavaScript | Strict type-safety across database models, API payloads, and AI JSON response contracts. |
| **Styling** | **Tailwind CSS + CSS Tokens** | Vanilla CSS / Styled Components | Enables rapid utility-first composition while strictly anchoring colors and spacing to Dronacharya CSS custom properties (`--color-bg-primary`, etc.). |
| **Database** | **PostgreSQL (via Supabase)** | MongoDB / SQLite | Relational schema is mandatory for complex many-to-many relationships (prerequisites, skill mastery vectors, rubric scores, squads). |
| **ORM** | **Prisma ORM** | Drizzle ORM / Raw SQL | Auto-generated type-safe client, robust schema migration tooling, and excellent developer velocity for hackathons. |
| **Code Sandbox**| **Pyodide 0.25 (WebAssembly)** | Docker / Judge0 / AWS Lambda | **Zero Cloud Server Cost & Latency:** Code executes on the student's browser with 0ms server queue times and absolute security isolation from our backend. |
| **AI Engine** | **Google Gemini 1.5 Flash** | OpenAI GPT-4o / Claude 3.5 | Superior latency ($<1.2\text{s}$ TTFT), large context window for ingesting full code repos, native JSON schema enforcement, and cost-efficient tier limits. |
| **State** | **Zustand** | Redux Toolkit / Context API | Lightweight, boilerplate-free state management for IDE tabs, terminal output, and Acharya AI drawer states. |

---

## 3. Sandboxed Execution Architecture

To ensure total host security and zero server costs:
1. **Client-Side Execution:** Untrusted user code is never shipped to or executed on the Vercel/Node.js backend.
2. **Worker Isolation:** The Pyodide runtime runs in an isolated `Worker` thread. It communicates with the UI strictly via structured `postMessage` envelopes.
3. **Infinite Loop Protection:** A $5,000\text{ms}$ watchdog timer on the main thread kills the worker via `worker.terminate()` if execution hangs.

---

## 4. Pragmatic Hackathon Alternatives

To ensure the system can be delivered within tight hackathon deadlines:

| Standard Production Component | Pragmatic Hackathon Alternative | Transition Path to Production |
|:---|:---|:---|
| Real-time WebSockets (Socket.io) for squad chat | Optimistic UI polling via React Query (`refetchInterval: 3000`) | Migrate to Supabase Realtime Channels in v1.1 |
| Multi-language sandbox (Java, C++, Go) | Python 3.11 exclusive Pyodide sandbox | Integrate Docker-backed Judge0 cluster for compiled languages |
| Fine-tuned LLM on pedagogical transcripts | Zero-shot Gemini 1.5 Flash with robust system prompts & JSON schemas | Fine-tune an open-source Llama-3 model on Indian educational curricula |
| Distributed Redis Cluster | In-memory Next.js LRU cache + Vercel KV | Deploy managed Upstash Redis cluster |
