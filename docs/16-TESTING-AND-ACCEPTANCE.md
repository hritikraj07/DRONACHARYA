# Dronacharya — Testing, Quality Assurance & Acceptance Specification

---

## 1. Quality Strategy & Testing Pyramid

The testing strategy for **Dronacharya** verifies functionality across three tiers:
1. **Unit & Algorithm Tests:** BKT mathematical precision, XP formula accuracy, and Zod schema validations.
2. **Integration & Sandbox Tests:** Pyodide WebAssembly worker stability, timeout termination, and API route responses.
3. **End-to-End & AI Evaluation:** Playwright user journeys and automated LLM prompt non-spoiler adherence checks.

```
          / \
         / E2E \       Playwright User Journey Flow (10%)
        /-------\
       / Integr. \     API Handlers, Pyodide Worker, Gemini API (30%)
      /-----------\
     /  Unit Tests \   BKT Formulas, XP Engine, Zod Schemas (60%)
    /---------------\
```

---

## 2. Core Unit & Mathematical Tests

### 2.1 Bayesian Knowledge Tracing (BKT) Precision Test
* **Objective:** Verify that $P(L_t)$ updates correctly within $[0.01, 0.99]$ bounds and penalizes hint reliance.
* **Test Case (`TC-UNIT-BKT`):**
  ```typescript
  import { updateBKT } from '@/lib/bkt';

  describe('BKT Knowledge Tracing Engine', () => {
    it('should increment mastery upon unassisted correct submission', () => {
      const prior = 0.30;
      const posterior = updateBKT(prior, true, 0);
      expect(posterior).toBeGreaterThan(prior);
      expect(posterior).toBeCloseTo(0.48, 1);
    });

    it('should penalize mastery when multiple hints are used despite correct code', () => {
      const prior = 0.50;
      const posterior = updateBKT(prior, true, 3); // 3 hints used
      expect(posterior).toBeLessThan(prior);
    });
  });
  ```

---

## 3. Simulator & Sandbox Integration Tests

### 3.1 Infinite Loop Termination Test (`TC-SIM-WATCHDOG`)
* **Objective:** Confirm that malicious or accidental infinite loops (`while True: pass`) do not freeze the main browser thread and are killed within $5,000\text{ms}$.
* **Procedure:**
  1. Post `code: "while True: pass"` to the Web Worker.
  2. Verify that the watchdog timer fires at $5,000\text{ms} \pm 200\text{ms}$.
  3. Verify that `worker.terminate()` is executed.
  4. Verify that the UI displays the error: `"Execution terminated: Code exceeded 5000ms limit."`
  5. Verify that a fresh worker is spawned and ready for subsequent execution.

---

## 4. AI Socratic Eval Benchmark (Non-Spoiler Verification)

To guarantee that Acharya AI never leaks full homework solutions, a regression suite evaluates 50 test prompts against Gemini 1.5:

| Eval Metric | Acceptance Criterion | Evaluation Method |
|:---|:---|:---|
| **Zero Direct Solutions** | $100\%$ pass rate | Automated regex scanner checks if generated output matches the exact function declaration and body from the mission answer key. |
| **Socratic Tone Adherence**| $\ge 95\%$ pass rate | Evaluated by an LLM-as-a-judge against the criteria: "Did the response pose a probing question instead of stating the final fact?" |
| **Language Accuracy** | $\ge 98\%$ correct vocabulary | Automated token inspection ensuring Hindi/Hinglish vocabulary matches expected pedagogical terminology. |

---

## 5. Playwright End-to-End Acceptance Tests

```typescript
// tests/e2e/core-journey.spec.ts
import { test, expect } from '@playwright/test';

test('Full Student Journey: Register -> Mission -> Sandbox -> Pass -> Portfolio', async ({ page }) => {
  // 1. Visit Homepage & Register
  await page.goto('/');
  await page.click('text=Enter the Gurukul');
  await page.fill('input[name="email"]', 'aarav.test@dronacharya.edu');
  await page.fill('input[name="password"]', 'Password123!');
  await page.click('button[type="submit"]');

  // 2. Complete Onboarding
  await expect(page).toHaveURL('/onboarding');
  await page.click('text=Python & Algorithms');
  await page.click('text=Hinglish');
  await page.click('button:has-text("Enter Courtyard")');

  // 3. Open First Mission
  await expect(page).toHaveURL('/dashboard');
  await page.click('text=The Labyrinth of Fibonacci');

  // 4. Simulator Code Execution
  await expect(page).toHaveURL(/\/simulator\/.+/);
  await page.waitForSelector('.monaco-editor');
  
  // Enter correct recursive code
  const code = `
def route_cost(n):
    if n <= 1:
        return n
    return route_cost(n-1) + route_cost(n-2)
`;
  await page.evaluate((c) => (window as any).monacoEditor.setValue(c), code);
  await page.click('button:has-text("Run Mission Tests")');

  // 5. Verify Success Modal & Seal
  await expect(page.locator('.modal-results')).toBeVisible({ timeout: 10000 });
  await expect(page.locator('text=Seal of the Recursive Archer')).toBeVisible();

  // 6. Inspect Portfolio
  await page.goto('/u/aarav.test');
  await expect(page.locator('text=Seal of the Recursive Archer')).toBeVisible();
});
```

---

## 6. Demo-Day Smoke Test Checklist (5-Minute Pre-Stage Run)

Execute this manual checklist 15 minutes before taking the presentation stage:

- [ ] **Database Connection:** Supabase status is green; query latency $<50\text{ms}$.
- [ ] **Gemini API Quota:** API key is active with adequate quota headroom; test ping returns HTTP 200.
- [ ] **Wasm Cache Pre-warm:** Ensure Pyodide CDN assets (`pyodide.asm.js`, `pyodide.asm.wasm`) load from browser cache without network delay.
- [ ] **Audio Cue Check:** Celebratory temple gong audio file loads and plays at comfortable volume ($40\%$).
- [ ] **Mobile Responsiveness:** View demo screen at $390\text{px}$ width; ensure Acharya drawer opens smoothly without horizontal scrollbar overflow.
