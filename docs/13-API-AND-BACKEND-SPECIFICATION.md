# Dronacharya — API & Backend Service Specification

---

## 1. API Architecture Overview

The **Dronacharya** API is designed using RESTful conventions implemented as Next.js 14 App Router Route Handlers (`app/api/.../route.ts`). All requests and responses communicate via JSON envelopes, with strict validation enforced by **Zod** schemas.

### 1.1 Global Response Envelope

```typescript
export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: {
    code: string;       // e.g., 'UNAUTHORIZED', 'VALIDATION_ERROR', 'RATE_LIMITED'
    message: string;    // Human-readable message
    details?: unknown;  // Granular Zod field issues
  };
  timestamp: string;
}
```

---

## 2. API Endpoint Inventory

| Endpoint | Method | Priority | Description | Auth Required |
|:---|:---|:---|:---|:---|
| `/api/auth/register` | `POST` | P0 | Create new student account | Public |
| `/api/auth/login` | `POST` | P0 | Authenticate user & issue JWT | Public |
| `/api/users/profile` | `GET` | P0 | Fetch authenticated student profile | Bearer JWT |
| `/api/users/profile` | `PATCH` | P0 | Update preferences, language, bio | Bearer JWT |
| `/api/assessments/diagnostic` | `POST` | P0 | Process adaptive diagnostic submission | Bearer JWT |
| `/api/paths` | `GET` | P0 | List published learning tracks | Bearer JWT |
| `/api/paths/:id` | `GET` | P0 | Fetch path questline DAG with unlock states | Bearer JWT |
| `/api/missions/:id` | `GET` | P0 | Fetch mission brief & starter challenge code | Bearer JWT |
| `/api/challenges/:id/submit` | `POST` | P0 | Validate test results & update BKT mastery | Bearer JWT |
| `/api/mentor/hint` | `POST` | P0 | Request Socratic guidance from Acharya AI | Bearer JWT |
| `/api/mentor/diagnose` | `POST` | P0 | Diagnose code exception/stack trace | Bearer JWT |
| `/api/projects` | `GET` | P0 | List capstone project catalog | Bearer JWT |
| `/api/projects/:id/submit` | `POST` | P0 | Submit capstone project for rubric eval | Bearer JWT |
| `/api/portfolio/:username` | `GET` | P0 | Public portfolio & verified proof route | Public |
| `/api/achievements` | `GET` | P0 | List student unlocked seals and badges | Bearer JWT |
| `/api/teams` | `GET` / `POST` | P1 | List or create Gurukul squads | Bearer JWT |
| `/api/leaderboard` | `GET` | P1 | Fetch weekly cohort mastery standings | Bearer JWT |

---

## 3. Deep-Dive Endpoint Specifications

### 3.1 Acharya AI Socratic Guidance (`POST /api/mentor/hint`)
* **Purpose:** Generate progressive non-spoiler hints for a student stuck on a coding challenge.
* **Rate Limit:** 10 requests / minute per user.
* **Request Payload (Validated via Zod):**

```json
{
  "mission_id": "mission-fib-labyrinth",
  "current_code": "def route_cost(n):\n    return route_cost(n-1) + route_cost(n-2)",
  "error_output": "RecursionError: maximum recursion depth exceeded",
  "hint_tier": 1,
  "language_preference": "hinglish"
}
```

* **Success Response (`200 OK`):**

```json
{
  "success": true,
  "data": {
    "mentor_name": "Acharya AI",
    "hint_tier": 1,
    "analysis": "A recursive call occurs infinitely because no base boundary is defined.",
    "guidance_text": "Dhyan se dekho: jab 'n' decrease hote-hote 0 ya 1 par pahuchega, tab function kya return karega? Kya tumne rukne ka koi conditional rule likha hai?",
    "socratic_question": "What is the simplest value of n where you know the answer without any calculation?"
  },
  "timestamp": "2026-10-27T13:19:00Z"
}
```

---

### 3.2 Challenge Completion & BKT Update (`POST /api/challenges/:id/submit`)
* **Purpose:** Ingest verified client-side test execution proof, update Bayesian Knowledge Tracing scores, and award Mastery XP.
* **Request Payload:**

```json
{
  "challenge_id": "chal-fib-01",
  "submitted_code": "def route_cost(n):\n    if n <= 1: return n\n    return route_cost(n-1) + route_cost(n-2)",
  "tests_passed_count": 5,
  "tests_total_count": 5,
  "execution_time_ms": 42.5,
  "hints_used_count": 1
}
```

* **Success Response (`200 OK`):**

```json
{
  "success": true,
  "data": {
    "all_passed": true,
    "xp_awarded": 102,
    "total_xp": 842,
    "bkt_update": {
      "skill_id": "py.recursion.base_case",
      "prior_mastery": 0.35,
      "updated_mastery": 0.78,
      "status": "MASTERED"
    },
    "unlocked_next_mission_id": "mission-memoization-vault",
    "seal_awarded": {
      "id": "seal-recursive-archer",
      "title": "Seal of the Recursive Archer",
      "verification_hash": "a8f3b2049e7d81c4"
    }
  },
  "timestamp": "2026-10-27T13:19:05Z"
}
```

---

### 3.3 Public Portfolio Data Route (`GET /api/portfolio/:username`)
* **Purpose:** Serve unauthenticated recruiter and public requests for verified student accomplishments.
* **Cache-Control:** `public, s-maxage=300, stale-while-revalidate=600`.
* **Success Response (`200 OK`):**

```json
{
  "success": true,
  "data": {
    "student": {
      "username": "aarav-sharma",
      "full_name": "Aarav Sharma",
      "rank_tier": "Vidvan (Scholar)",
      "total_xp": 4250,
      "streak_days": 18
    },
    "verified_skills": [
      { "name": "Dynamic Programming", "mastery_score": 0.94, "verified": true },
      { "name": "Systems Caching & Concurrency", "mastery_score": 0.89, "verified": true }
    ],
    "projects": [
      {
        "id": "proj-lru-cache",
        "title": "In-Memory LRU Cache with TTL",
        "score": 96.0,
        "repo_url": "https://github.com/aarav/dronacharya-lru-cache",
        "passed_tests": 16,
        "submission_date": "2026-10-24"
      }
    ],
    "earned_seals": [
      { "id": "seal-recursive-archer", "title": "Seal of the Recursive Archer", "hash": "a8f3b2049e7d81c4" }
    ]
  },
  "timestamp": "2026-10-27T13:19:10Z"
}
```
