# Dronacharya — Gamification & Learning Mechanics Engine

---

## 1. Gamification Philosophy: Mastery Over Grinding

In Dronacharya, gamification is designed as a solemn, motivating pilgrimage toward true intellectual mastery (*Siddhi*), rather than an addictive casino of dopamine-triggering chimes and arbitrary badges.

### 1.1 Non-Negotiable Principles:
1. **Zero Point Inflation:** XP is strictly backed by demonstrated conceptual problem-solving, passed unit tests, or peer contributions.
2. **Anti-Grind Governors:** Repetitive solving of trivial questions yields diminishing returns. Quality and depth are prioritized over volume and velocity.
3. **Compassionate Consistency:** Streaks celebrate dedicated practice, but include automatic grace freezes so that real life or illness does not destroy months of progress.
4. **Fair, Collaborative Recognition:** Leaderboards rank cohorts on mastery improvement, code quality, and peer assistance rather than pure reflex speed.

---

## 2. Mastery XP Formulation

XP is awarded dynamically across four discrete learning activities:

```
Total XP Earned = (Base_Challenge_XP * Difficulty_Mult * Hint_Factor * Retention_Bonus) * Daily_Fatigue_Governor
```

### 2.1 Formula Parameters

| Parameter | Value Range | Logic / Rationale |
|:---|:---|:---|
| $\text{Base\_Challenge\_XP}$ | $50 - 250\text{ XP}$ | Varies by mission scope (Drill: 50, Mission: 120, Capstone: 250). |
| $\text{Difficulty\_Mult}$ | $1.0\times, 1.5\times, 2.2\times$ | Foundational ($1.0$), Intermediate ($1.5$), Advanced ($2.2$). |
| $\text{Hint\_Factor}$ | $1.00 \to 0.55$ | $\max(0.55, 1.0 - 0.15 \times \text{HintsUsed})$. Using hints never reduces XP to zero, encouraging students to seek guidance rather than quitting. |
| $\text{Retention\_Bonus}$ | $1.00\times \text{ or } 1.30\times$ | $1.30\times$ multiplier awarded when correctly revisiting a spaced-repetition challenge after 7 days. |
| $\text{Daily\_Fatigue\_Governor}$ | $1.00 \to 0.20$ | Drops by $1.5\%$ per minute after $60$ minutes of daily active coding, bottoming at $0.20$ to discourage unhealthy binge sessions. |

### 2.2 Concrete Example Calculation
* **Scenario:** Aarav solves an Advanced Mission ($\text{Base} = 120\text{ XP}$, $\text{Mult} = 2.2\times$). He uses 1 Tier-1 Hint ($\text{Hint\_Factor} = 1.0 - 0.15 = 0.85$). He has been coding for 30 minutes today ($\text{Fatigue} = 1.00$).
* **Calculation:**
  $$\text{XP} = 120 \times 2.2 \times 0.85 \times 1.0 = \mathbf{224.4 \implies 224\text{ XP}}$$

---

## 3. Gurukul Mastery Ranks (Levels)

Progression is organized into four dignified academic tiers:

| Rank Title | Cultural Epithet | Required XP | Capabilities & Privileges Unlocked |
|:---|:---|:---|:---|
| **Tier 1: Sadhaka** | The Seeker | $0 - 999\text{ XP}$ | Access to foundational tracks, Pyodide sandbox, Acharya AI Tier 1-4 hints. |
| **Tier 2: Abhyasi** | The Practitioner | $1,000 - 3,499\text{ XP}$ | Unlocks Capstone Project Workspace, peer review participation. |
| **Tier 3: Vidvan** | The Scholar | $3,500 - 8,999\text{ XP}$ | Unlocks Squad creation, multi-language sandbox, complex data structures. |
| **Tier 4: Acharya** | The Master Guide | $9,000+\text{ XP}$ | Eligible to mentor junior squads, author custom missions, verified employer showcase. |

---

## 4. Mastery Seals (Cryptographic Skill Badges)

Unlike arbitrary stickers, **Mastery Seals** represent verified, auditable milestones. Each seal is rendered as a handcrafted Indian antique brass medallion in the UI.

```
       .---.
     /   |   \     SEAL OF THE RECURSIVE ARCHER
    |   -O-   |    - Category: Algorithms & Data Structures
     \   |   /     - Verification: Passed 8/8 Tests (incl. 2 hidden edge cases)
       '---'       - Signed SHA-256 Hash: `e3b0c44298fc1c14...`
```

### 4.1 Initial Seal Inventory for MVP
1. **Seal of the Precision Base (Recursion Mastery):** Awarded for correctly implementing terminating recursive calls with memory optimization.
2. **Seal of the Iron Ring (Data Structures):** Awarded for building a custom Doubly Linked List with zero memory leaks.
3. **Seal of the Fast Vault (Systems Engineering):** Awarded for completing the In-Memory Cache Capstone with LRU eviction.
4. **Seal of the Generous Sage (Peer Collaboration):** Awarded for conducting 3 thorough, helpful peer reviews rated $\ge 4.5/5$.

---

## 5. Focus Streaks with "Grace Freeze"

* **The Goal:** Build a habitual daily learning ritual (*Abhyasa*).
* **The Danger:** Losing a 45-day streak due to a university exam, illness, or travel creates demotivation and abandonment.
* **The Dronacharya Solution:**
  * Every student is granted **1 Automatic Grace Freeze** every 14 days.
  * If a day is missed, the freeze is consumed silently without breaking the streak counter.
  * The student receives a welcoming notification: *"Your Gurukul seat was preserved yesterday. Welcome back to practice."*

---

## 6. Anti-Cheating & Integrity Safeguards

1. **Client-Side Test Obfuscation:** While basic tests are visible to assist debugging, $40\%$ of unit tests executed by the Pyodide test runner are fetched server-side with randomized parameter generation to prevent hardcoded `if input == x: return y` cheat submissions.
2. **Keystroke & Timing Heuristics:** Code paste events exceeding 200 characters in $<500\text{ms}$ trigger an automated code explanation probe by Acharya AI (*"Explain the time complexity of the list comprehension you just added."*).
3. **Duplicate Submission Penalty:** Re-submitting an already-passed challenge awards $0\text{ XP}$ and does not increment streak counters.
