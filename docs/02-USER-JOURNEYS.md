# Dronacharya — End-to-End User Journeys & Interaction Flows

---

## 1. Document Overview

This document specifies the primary student, mentor, and cohort user journeys through the **Dronacharya** platform. Every journey is mapped sequentially from user triggers to system actions, UI state transitions, and database updates, accompanied by comprehensive Mermaid flowcharts.

---

## 2. Journey 1: Student Onboarding & Diagnostic Assessment

### 2.1 Context & Objective
A new user arrives on Dronacharya, registers an account, configures learning preferences (focus track, preferred language), and completes a calibrated 3-question diagnostic assessment to establish their initial Knowledge Tracing baseline.

```mermaid
sequenceDiagram
    autonumber
    actor Student
    participant UI as Dronacharya UI
    participant Auth as Auth Service
    participant AI as Personalisation Engine
    participant DB as PostgreSQL DB

    Student->>UI: Lands on Homepage & Clicks "Enter the Gurukul"
    UI->>Student: Displays Registration Form (Email, Password, Name)
    Student->>UI: Submits credentials
    UI->>Auth: POST /api/auth/register
    Auth->>DB: Insert User & Profile (default role: student)
    Auth-->>UI: JWT Session Token
    UI->>Student: Redirects to Step 1: Learning Focus & Language Choice
    Student->>UI: Selects "Python & Algorithms" + "Hinglish (Hindi/English)"
    UI->>DB: PATCH /api/users/profile
    UI->>Student: Presents Step 2: "3-Minute Diagnostic Archery Trial"
    loop Diagnostic Trial (3 Adaptive Questions)
        UI->>AI: GET /api/assessments/diagnostic/next-question
        AI-->>UI: Calibrated Question (Difficulty: D)
        Student->>UI: Selects or types solution
        UI->>AI: POST /api/assessments/diagnostic/submit
        AI->>AI: Recalculate estimated theta (ability)
    end
    AI->>DB: Seed initial skill mastery scores in `user_skill_mastery`
    AI->>DB: Generate custom Learning Path & First Mission
    UI-->>Student: Displays Tailored Dashboard with "Mission 1: The Labyrinth of Fibonacci"
```

---

## 3. Journey 2: The Core Learning Loop (Discover to Build)

### 3.1 Step-by-Step Flow
1. **Discover:** The student opens *Mission 1: The Labyrinth of Fibonacci*. A narrative intro describes an automated postal distribution center in Varanasi struggling to optimize parcel routing using dynamic recursion.
2. **Understand:** The student reads a concise 2-minute visual briefing demonstrating recursive stack frames with an interactive call-tree slider.
3. **Practise:** A quick 2-question comprehension check validates the concept of a "Base Case" vs. "Recursive Step".
4. **Play & Experiment:** The student opens the integrated **Python WebAssembly Simulator**. The code template contains a skeleton function:
   ```python
   def route_cost(n: int) -> int:
       # TODO: Complete recursive calculation
       pass
   ```
5. **Debug with Acharya AI:** The student runs the code. A `RecursionError: maximum recursion depth exceeded` is thrown. The student clicks "Consult Acharya AI".
6. **Socratic Guidance:** Acharya AI observes the stack trace and provides a Tier-1 nudge in Hinglish:
   > *"Dhyan se dekho: jab $n$ kam hota jata hai, tumhara code kab rukta hai? Kya tumne base case likha hai?"*
7. **Build & Demonstrate:** The student implements `if n <= 1: return n`, clicks "Run Mission Tests". All 5 test cases pass.
8. **Mastery Seal:** 120 Mastery XP is awarded, and the skill seal **"Seeker of Recursion"** is unlocked on the student's profile.

```mermaid
graph TD
    Start(["Student Opens Mission"]) --> Intro["Discover: Read Real-world Context"]
    Intro --> Concept["Understand: Interactive Visual Call Tree"]
    Concept --> Drill["Practise: 2-Question Comprehension Check"]
    Drill --> OpenSim["Experiment: Open WebAssembly Simulator"]
    OpenSim --> WriteCode["Student Writes Code"]
    WriteCode --> RunCode{"Run Unit Tests"}
    RunCode -- "Fail / Error" --> CallMentor["Click 'Consult Acharya AI'"]
    CallMentor --> SocraticHint["Receive Tier-1 Conceptual Nudge (Hinglish)"]
    SocraticHint --> WriteCode
    RunCode -- "All Tests Pass" --> AwardXP["Award Mastery XP + Update BKT Mastery"]
    AwardXP --> CheckMilestone{"Capstone Complete?"}
    CheckMilestone -- "Yes" --> MintSeal["Mint 'Seeker of Recursion' Seal"]
    CheckMilestone -- "No" --> NextMission["Unlock Next Sequential Quest"]
    MintSeal --> UpdatePortfolio["Push Verified Code Proof to Portfolio"]
    UpdatePortfolio --> End(["Return to Dashboard"])
```

---

## 4. Journey 3: Interacting with Acharya AI (Socratic Escalation)

This journey illustrates the strict non-spoiler escalation protocol enforced by Acharya AI when a student is stuck on a syntax or logic bug.

```mermaid
sequenceDiagram
    autonumber
    actor Student
    participant IDE as Simulator IDE
    participant Drawer as Acharya AI Drawer
    participant LLM as Gemini 1.5 Service

    Student->>IDE: Clicks "Run Tests"
    IDE-->>Student: Displays Test Failure (Expected: 13, Got: 0)
    Student->>Drawer: Opens Drawer & Clicks "Why is my answer 0?"
    Drawer->>LLM: POST /api/mentor/hint {code, test_output, hint_level: 1}
    LLM-->>Drawer: Tier 1 Nudge: "Check what value your base case returns when n == 0."
    Drawer-->>Student: Renders Tier 1 Nudge
    Student->>IDE: Modifies code, reruns, fails again
    Student->>Drawer: Requests deeper hint (Clicks "Still stuck")
    Drawer->>LLM: POST /api/mentor/hint {code, test_output, hint_level: 2}
    LLM-->>Drawer: Tier 2 Code Pattern: "A standard recursive structure returns 0 for n=0 and 1 for n=1. What does your line 4 currently return?"
    Drawer-->>Student: Renders Tier 2 Pattern
    Student->>IDE: Fixes line 4: `if n == 0: return 0`
    Student->>IDE: Clicks "Run Tests" -> All Passed!
    Drawer-->>Student: Acharya AI: "Shabash! You identified the base case independently."
```

---

## 5. Journey 4: Real-World Capstone Project Submission & Rubric Evaluation

```mermaid
sequenceDiagram
    autonumber
    actor Student
    participant UI as Project Workspace
    participant Eval as Rubric Evaluation Engine
    participant DB as Database
    participant Portfolio as Public Portfolio Page

    Student->>UI: Selects Project: "In-Memory Cache with TTL & LRU Eviction"
    UI->>Student: Provides 4-stage Project Brief, Test Specifications & Rubric
    Student->>UI: Writes multi-file solution (cache.py, lru_node.py)
    Student->>UI: Runs Local Milestone Test Suites
    Student->>UI: Clicks "Submit for Evaluation"
    UI->>Eval: POST /api/projects/submit {files, repo_url, user_id}
    Eval->>Eval: 1. Run Automated Test Suite (Functional & Edge Cases)
    Eval->>Eval: 2. Static Analysis (Cyclomatic Complexity, PEP-8)
    Eval->>Eval: 3. AI Rubric Evaluation (Architecture, Documentation)
    Eval->>DB: Store `project_submissions` with scores (94/100)
    Eval->>DB: Update `user_skill_mastery` (Data Structures: 0.95)
    Eval->>DB: Insert into `portfolio_entries` with execution signature
    Eval-->>UI: Return detailed evaluation breakdown + Rubric Badge
    UI->>Student: Displays "Mastery Verified!" with link to Public Portfolio
    Student->>Portfolio: Views `/u/aarav-sharma` -> Project is live with verified code badge
```

---

## 6. Journey 5: Squad Formation & Peer Collaboration (v1.1)

```mermaid
graph TD
    A["Student visits 'Gurukul Squads' Tab"] --> B{"Has Squad?"}
    B -- "No" --> C["Browse Squads or Click 'Create Squad'"]
    C --> D["Invites 3 Peers via Cohort Code"]
    D --> E["Squad Formed: 'Varanasi Coders'"]
    B -- "Yes" --> F["Open Squad Mission Board"]
    E --> F
    F --> G["Select Weekly Challenge: 'Distributed Hash Ring'"]
    G --> H["Squad Members claim task modules"]
    H --> I["Peer Review: Student A reviews Student B's logic"]
    I --> J["Consolidated Submission Evaluated"]
    J --> K["Squad Collective Mastery Points Awarded"]
```

---

## 7. Journey 6: Public Portfolio Inspection by a Tech Recruiter

```mermaid
sequenceDiagram
    autonumber
    actor Recruiter as Tech Recruiter / Employer
    participant Web as Public Web Browser
    participant PortfolioAPI as Public Portfolio Route
    participant DB as Database

    Recruiter->>Web: Navigates to `dronacharya.edu/u/aarav-sharma`
    Web->>PortfolioAPI: GET /api/portfolio/aarav-sharma
    PortfolioAPI->>DB: Fetch verified projects, skill seals, mastery traces
    PortfolioAPI-->>Web: Return Portfolio JSON Data
    Web-->>Recruiter: Renders Minimalist, Indian-Crafted Portfolio:
    Note over Web,Recruiter: - 4 Capstone Projects with Passed Test Runs<br/>- Skill Seals: "Master of Recursion", "LRU Cache Architect"<br/>- Radar Chart of Verified Mastery<br/>- "Inspect Execution Proof" Button
    Recruiter->>Web: Clicks "Inspect Execution Proof" on LRU Project
    Web-->>Recruiter: Modal opens showing Pyodide execution logs & unit test matrix
    Recruiter->>Web: Clicks "Contact Candidate"
```
