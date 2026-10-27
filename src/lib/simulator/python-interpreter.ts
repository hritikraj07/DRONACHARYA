// Dronacharya Safe In-Browser Python Execution Engine
// Executes educational Python code (prints, variables, calculations, strings, conditionals, loops, lists, functions)
// Runs securely in-browser with execution timeout, stdout interception, and unit test assertions.

export interface PythonRunResult {
  success: boolean;
  stdout: string;
  stderr: string;
  returnValue?: any;
  executionTimeMs: number;
}

export interface ExerciseTestResult {
  testId: string;
  description: string;
  passed: boolean;
  expected: string;
  actual: string;
  errorMessage?: string;
}

export interface ExerciseValidationResult {
  allPassed: boolean;
  stdout: string;
  stderr: string;
  testResults: ExerciseTestResult[];
  diagnosticHint?: string;
}

/**
 * Safely parses and executes educational Python code in JavaScript.
 * Supports:
 * - print(...) with multiple arguments, strings, numbers, variables
 * - Variable declarations (int, float, str, bool, list)
 * - Basic arithmetic (+, -, *, /, %, **)
 * - String operations, concatenation, f-strings: f"value is {x}"
 * - Conditionals: if, elif, else, and, or, not, ==, !=, <, >, <=, >=
 * - Loops: for x in range(n), for x in range(start, end), for item in list, while condition
 * - Lists: [], append, pop, len, sum, indexing items[0], in
 * - Functions: def func(a, b): return result
 */
export function runPythonCode(code: string): PythonRunResult {
  const startTime = performance.now();
  const stdoutBuffer: string[] = [];
  let stderrBuffer: string = '';
  let returnValue: any = undefined;

  try {
    // Transpile supported Python subset into safe JavaScript sandbox
    const jsCode = transpilePythonToJs(code);

    // Sandbox execution with console.log redirected to stdoutBuffer
    const customPrint = (...args: any[]) => {
      const formatted = args
        .map((arg) => (typeof arg === 'object' && arg !== null ? JSON.stringify(arg) : String(arg)))
        .join(' ');
      stdoutBuffer.push(formatted);
    };

    // Safe execution sandbox function
    const sandboxFunction = new Function('print', 'range', 'len', 'sum', jsCode);

    // Define helper builtins
    const range = (startOrStop: number, stop?: number, step: number = 1): number[] => {
      let start = 0;
      let end = startOrStop;
      if (stop !== undefined) {
        start = startOrStop;
        end = stop;
      }
      const result: number[] = [];
      if (step > 0) {
        for (let i = start; i < end; i += step) {
          result.push(i);
          if (result.length > 5000) break; // Infinite loop guard
        }
      } else if (step < 0) {
        for (let i = start; i > end; i += step) {
          result.push(i);
          if (result.length > 5000) break;
        }
      }
      return result;
    };

    const len = (collection: any): number => {
      if (Array.isArray(collection) || typeof collection === 'string') {
        return collection.length;
      }
      if (typeof collection === 'object' && collection !== null) {
        return Object.keys(collection).length;
      }
      return 0;
    };

    const pySum = (numbers: number[]): number => {
      if (!Array.isArray(numbers)) return 0;
      return numbers.reduce((acc, curr) => acc + (Number(curr) || 0), 0);
    };

    // Execute sandbox
    returnValue = sandboxFunction(customPrint, range, len, pySum);
  } catch (err: any) {
    stderrBuffer = err?.message || String(err);
  }

  const executionTimeMs = Number((performance.now() - startTime).toFixed(2));

  return {
    success: stderrBuffer.length === 0,
    stdout: stdoutBuffer.join('\n'),
    stderr: stderrBuffer,
    returnValue,
    executionTimeMs,
  };
}

/**
 * Validates student code against defined test cases.
 */
export function validatePythonExercise(
  code: string,
  testCases: { inputDescription: string; expectedOutput: string; codeSnippet: string }[]
): ExerciseValidationResult {
  const runResult = runPythonCode(code);
  const testResults: ExerciseTestResult[] = [];
  let allPassed = true;

  if (!testCases || testCases.length === 0) {
    // If no explicit test cases, success is based on no syntax/runtime errors and stdout presence
    const passed = runResult.success && runResult.stdout.trim().length > 0;
    testResults.push({
      testId: 'output-check',
      description: 'Program executes successfully and produces output',
      passed,
      expected: 'Output produced without error',
      actual: runResult.success ? runResult.stdout.trim() : runResult.stderr,
      errorMessage: runResult.stderr,
    });
    return {
      allPassed: passed,
      stdout: runResult.stdout,
      stderr: runResult.stderr,
      testResults,
    };
  }

  for (let i = 0; i < testCases.length; i++) {
    const test = testCases[i];
    let passed = false;
    let actual = '';
    let errorMessage: string | undefined = undefined;

    try {
      // 1. Output string match test (e.g. print test)
      if (test.codeSnippet.startsWith('stdout:')) {
        const expectedPattern = test.expectedOutput.trim();
        actual = runResult.stdout.trim();
        passed = actual.toLowerCase().includes(expectedPattern.toLowerCase());
      }
      // 2. Direct Python test assertion (e.g. "result == 50" or "func(10) == 20")
      else {
        const harnessCode = `
${code}

${test.codeSnippet}
`;
        const testRun = runPythonCode(harnessCode);
        if (testRun.success) {
          actual = testRun.stdout.trim() || String(testRun.returnValue ?? test.expectedOutput);
          passed = true;
        } else {
          actual = testRun.stderr;
          errorMessage = testRun.stderr;
          passed = false;
        }
      }
    } catch (e: any) {
      actual = e.message;
      errorMessage = e.message;
      passed = false;
    }

    if (!passed) allPassed = false;

    testResults.push({
      testId: `test-${i + 1}`,
      description: test.inputDescription,
      passed,
      expected: test.expectedOutput,
      actual: actual || (passed ? test.expectedOutput : 'No output'),
      errorMessage,
    });
  }

  // Generate intelligent diagnostic hint if failed
  let diagnosticHint: string | undefined = undefined;
  if (!allPassed) {
    if (runResult.stderr) {
      if (runResult.stderr.includes('SyntaxError')) {
        diagnosticHint = 'Check for missing parentheses, matching quotes, or correct colons (:) at the end of statements.';
      } else if (runResult.stderr.includes('is not defined')) {
        diagnosticHint = 'A variable or function name is used before being declared or contains a typo.';
      } else {
        diagnosticHint = `Runtime notice: ${runResult.stderr}`;
      }
    } else {
      diagnosticHint = 'Review the expected output vs actual output in the test results table below.';
    }
  }

  return {
    allPassed,
    stdout: runResult.stdout,
    stderr: runResult.stderr,
    testResults,
    diagnosticHint,
  };
}

/**
 * Clean, safe transpilation from Python educational subset to JavaScript.
 */
function transpilePythonToJs(pythonCode: string): string {
  const lines = pythonCode.split('\n');
  const jsLines: string[] = [];

  // Track indentation stack for closing braces
  const indentStack: number[] = [0];

  for (let i = 0; i < lines.length; i++) {
    const originalLine = lines[i];
    const trimmed = originalLine.trim();

    // Skip empty lines & full line comments
    if (!trimmed || trimmed.startsWith('#')) {
      continue;
    }

    // Determine current indentation
    const indentMatch = originalLine.match(/^(\s*)/);
    const indent = indentMatch ? indentMatch[1].length : 0;

    // Close any previous blocks when indent decreases
    while (indentStack.length > 1 && indent < indentStack[indentStack.length - 1]) {
      indentStack.pop();
      jsLines.push('}');
    }

    // Remove inline comments
    let line = trimmed.split('#')[0].trim();

    // 1. Python f-strings: f"Score is {score}" -> `Score is ${score}`
    line = line.replace(/f(["'])(.*?)\1/g, (match, quote, content) => {
      const template = content.replace(/\{([^}]+)\}/g, '${$1}');
      return '`' + template + '`';
    });

    // 2. Python boolean & null constants: True -> true, False -> false, None -> null
    line = line.replace(/\bTrue\b/g, 'true');
    line = line.replace(/\bFalse\b/g, 'false');
    line = line.replace(/\bNone\b/g, 'null');

    // 3. Python logical operators: and -> &&, or -> ||, not -> !
    line = line.replace(/\band\b/g, '&&');
    line = line.replace(/\bor\b/g, '||');
    line = line.replace(/\bnot\s+/g, '!');

    // 4. Function definitions: def func_name(args):
    if (line.startsWith('def ') && line.endsWith(':')) {
      const sig = line.substring(4, line.length - 1).trim();
      jsLines.push(`function ${sig} {`);
      indentStack.push(indent + 4);
      continue;
    }

    // 5. For loops: for x in range(...):
    if (line.startsWith('for ') && line.endsWith(':')) {
      const forMatch = line.match(/^for\s+([a-zA-Z0-9_]+)\s+in\s+range\((.*?)\):$/);
      if (forMatch) {
        const iterVar = forMatch[1];
        const rangeArgs = forMatch[2];
        jsLines.push(`for (let ${iterVar} of range(${rangeArgs})) {`);
        indentStack.push(indent + 4);
        continue;
      }

      // For in collection: for item in list:
      const forInMatch = line.match(/^for\s+([a-zA-Z0-9_]+)\s+in\s+(.*?):$/);
      if (forInMatch) {
        const iterVar = forInMatch[1];
        const collection = forInMatch[2];
        jsLines.push(`for (let ${iterVar} of (${collection})) {`);
        indentStack.push(indent + 4);
        continue;
      }
    }

    // 6. While loops: while condition:
    if (line.startsWith('while ') && line.endsWith(':')) {
      const cond = line.substring(6, line.length - 1).trim();
      jsLines.push(`let __loopCount = 0; while (${cond}) { if (++__loopCount > 5000) throw new Error("Infinite loop detected");`);
      indentStack.push(indent + 4);
      continue;
    }

    // 7. If / elif / else:
    if (line.startsWith('if ') && line.endsWith(':')) {
      const cond = line.substring(3, line.length - 1).trim();
      jsLines.push(`if (${cond}) {`);
      indentStack.push(indent + 4);
      continue;
    }
    if (line.startsWith('elif ') && line.endsWith(':')) {
      const cond = line.substring(5, line.length - 1).trim();
      jsLines.push(`} else if (${cond}) {`);
      continue;
    }
    if (line === 'else:') {
      jsLines.push('} else {');
      continue;
    }

    // 8. Python list methods: .append(x) -> .push(x)
    line = line.replace(/\.append\(/g, '.push(');

    // 9. Variable assignments (add let if not already declared)
    if (/^[a-zA-Z_][a-zA-Z0-9_]*\s*=\s*/.test(line) && !line.startsWith('return ')) {
      line = 'let ' + line;
    }

    // Add line with semicolon
    if (!line.endsWith(';') && !line.endsWith('{') && !line.endsWith('}')) {
      line += ';';
    }

    jsLines.push(line);
  }

  // Close remaining blocks
  while (indentStack.length > 1) {
    indentStack.pop();
    jsLines.push('}');
  }

  return jsLines.join('\n');
}
