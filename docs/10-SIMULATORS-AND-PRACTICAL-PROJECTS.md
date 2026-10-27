# Dronacharya — Simulators & Practical Projects Specification

---

## 1. Simulator Framework & Theory-to-Practice Continuum

The central thesis of **Dronacharya** is that theoretical concepts must be tested immediately in practical, interactive sandboxes. A student reading about "Time Complexity" or "Recursion" must see stack frames grow in memory, trigger errors safely, and optimize performance in real time.

```
+---------------------------------------------------------------------------------------+
|                         THEORY-TO-PRACTICE CONTINUUM                                  |
+---------------------------------------------------------------------------------------+
|  THEORETICAL INSIGHT            |  INTERACTIVE SIMULATOR    |  VERIFIABLE OUTCOME     |
|  - Recursive Call Stacks        |  - Python Pyodide Wasm    |  - Passed Edge Tests    |
|  - Overfitting & Regularization |  - ML Parameter Studio    |  - Loss Convergence     |
|  - Burn Rate & Unit Economics   |  - Startup Cashflow Sim   |  - Profitable Runway    |
+---------------------------------------------------------------------------------------+
```

---

## 2. Primary MVP Simulator: Sandboxed WebAssembly Python Runtime

### 2.1 Technical Architecture
The core MVP simulator executes student-written Python 3.11 code directly on the client machine using **Pyodide** inside a dedicated browser **Web Worker**.

```mermaid
graph LR
    subgraph Browser Main Thread
        Editor["Monaco Editor (Code)"]
        UIControls["Run Button / Keyboard Shortcut"]
        Console["Terminal Console (stdout / stderr)"]
    end
    
    subgraph Web Worker Sandbox (Isolated Thread)
        WorkerHandler["Worker Message Broker"]
        PyodideInstance["Pyodide 0.25 Wasm Engine"]
        TestHarness["Test Harness & Assertion Runner"]
    end
    
    UIControls -->|postMessage({code, tests, timeout: 5000})| WorkerHandler
    Editor -.-> UIControls
    WorkerHandler --> PyodideInstance
    PyodideInstance --> TestHarness
    TestHarness -->|postMessage({stdout, stderr, results, time_ms})| Console
```

### 2.2 Security & Sandbox Isolation Constraints
1. **Zero Server Vulnerability:** Because code executes on the user's browser, malicious scripts (`os.system("rm -rf /")`) cannot compromise platform infrastructure.
2. **Main Thread Non-Blocking:** Heavy computation or infinite loops (`while True: pass`) run entirely in the background thread, keeping the UI responsive at $60\text{ fps}$.
3. **Hard Timeout Governor:** The Web Worker maintains an internal watchdog timer. If an execution exceeds $5,000\text{ms}$, the main thread terminates the worker via `worker.terminate()`, re-spawns a fresh instance, and displays a friendly diagnostic.
4. **Network & Storage Isolation:** The Pyodide instance is initialized with standard sockets disabled, preventing arbitrary external HTTP requests or access to cookies/localStorage.

### 2.3 Web Worker Implementation Blueprint

```typescript
// pyodideWorker.ts
import { loadPyodide, type PyodideInterface } from 'pyodide';

let pyodide: PyodideInterface | null = null;

async function getPyodide() {
  if (!pyodide) {
    pyodide = await loadPyodide({
      indexURL: 'https://cdn.jsdelivr.net/pyodide/v0.25.0/full/'
    });
  }
  return pyodide;
}

self.onmessage = async (e: MessageEvent) => {
  const { code, testSuite } = e.data;
  let stdout = '';
  let stderr = '';

  try {
    const py = await getPyodide();
    py.setStdout({ batched: (str) => { stdout += str + '\n'; } });
    py.setStderr({ batched: (str) => { stderr += str + '\n'; } });

    // Combine user code with test harness
    const fullScript = `
${code}

# Test Harness
${testSuite}
`;
    const startTime = performance.now();
    await py.runPythonAsync(fullScript);
    const executionTimeMs = performance.now() - startTime;

    self.postMessage({
      status: 'success',
      stdout,
      stderr,
      executionTimeMs,
      testsPassed: true
    });
  } catch (err: any) {
    self.postMessage({
      status: 'error',
      stdout,
      stderr: err.toString(),
      testsPassed: false
    });
  }
};
```

---

## 3. Real-World Capstone Project Framework

### 3.1 Project Structure: In-Memory Key-Value Cache with TTL & LRU
To prove industry readiness, students complete multi-file capstones rather than isolated code snippets.

* **Repository Template:**
  * `cache/store.py`: Core key-value store class.
  * `cache/lru_policy.py`: Doubly-linked list eviction policy.
  * `cache/ttl_manager.py`: Timestamp expiration worker.
  * `tests/test_cache.py`: Deterministic test suite with concurrency simulation.

### 3.2 Transparent 4-Tier Evaluation Rubric

Every project submission is evaluated against an objective $100$-point rubric:

| Dimension | Weight | Evaluation Criteria | Verification Method |
|:---|:---|:---|:---|
| **1. Functional Correctness** | $40\%$ | All baseline operations (`get`, `set`, `delete`) work as specified. | 10 Automated Unit Tests |
| **2. Edge-Case Resilience** | $25\%$ | Handles zero-capacity, high volume TTL evictions, and duplicate key sets cleanly. | 6 Hidden Stress Tests |
| **3. Performance & Complexity**| $20\%$ | Cache lookup and eviction perform in strictly $O(1)$ time complexity. | Execution timer & operation counter |
| **4. Architectural Cleanliness**| $15\%$ | Clear docstrings, modular class division, and adherence to PEP-8 conventions. | Flake8 linter & AI code review |

---

## 4. Distinction Between Executable Simulators & Conceptual Mockups

To preserve architectural honesty:
* **Fully Executable in MVP (P0):**
  * *Python Algorithmic & Systems Simulator:* Live WebAssembly execution, unit test runner, stdout capture, and Socratic hint integration.
* **Conceptual UI Blueprints for Future Scope (P2):**
  * *AI/ML Parameter Studio:* Visual parameter sliders (Learning Rate $\alpha$, Epochs, Dropout) with pre-rendered loss curves and confusion matrices to illustrate concepts without running multi-gigabyte GPU tensors in browser memory.
  * *Virtual Business & Startup Simulator:* Turn-based financial simulation calculating customer acquisition cost (CAC), lifetime value (LTV), and cash runway based on student decisions.
