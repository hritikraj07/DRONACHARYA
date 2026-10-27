// Dronacharya Safe Client-Side Web Sandbox & Evaluation Engine
// Supports real-time preview document generation and automated objective assertions for HTML, CSS, and JavaScript.

export interface WebConsoleMessage {
  level: 'log' | 'warn' | 'error' | 'info';
  message: string;
  timestamp: number;
}

export interface WebRunResult {
  success: boolean;
  html: string;
  css: string;
  js: string;
  srcDoc: string;
  consoleLogs: WebConsoleMessage[];
  error?: string;
}

export interface WebTestResult {
  testId: string;
  description: string;
  passed: boolean;
  expected: string;
  actual: string;
  errorMessage?: string;
}

export interface WebValidationResult {
  allPassed: boolean;
  testResults: WebTestResult[];
  consoleLogs: string[];
  diagnosticHint?: string;
}

/**
 * Builds a self-contained, sandboxed HTML document string suitable for iframe srcdoc.
 * Intercepts console logs and runtime errors and posts them safely to window.parent.
 */
export function buildWebPreviewDocument(
  html: string = '',
  css: string = '',
  js: string = ''
): string {
  // Clean inputs
  const safeHtml = html || '<div class="preview-empty" style="padding: 2rem; text-align: center; color: #888; font-family: sans-serif;">Write code to see live preview</div>';
  const safeCss = css || '';
  const safeJs = js || '';

  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>Dronacharya Web Sandbox</title>
  <style>
    /* Reset & Sandbox defaults */
    *, *::before, *::after {
      box-sizing: border-box;
    }
    body {
      margin: 0;
      padding: 1rem;
      font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif;
      color: #1e1e24;
      background-color: #ffffff;
      line-height: 1.5;
    }
    img {
      max-width: 100%;
      height: auto;
    }
    /* User CSS */
    ${safeCss}
  </style>
  <script>
    (function() {
      function serialize(args) {
        return Array.from(args).map(function(item) {
          if (item === null) return 'null';
          if (item === undefined) return 'undefined';
          if (typeof item === 'object') {
            try { return JSON.stringify(item); } catch (e) { return String(item); }
          }
          return String(item);
        }).join(' ');
      }

      var origLog = console.log;
      var origWarn = console.warn;
      var origError = console.error;
      var origInfo = console.info;

      console.log = function() {
        var msg = serialize(arguments);
        try {
          window.parent.postMessage({ type: 'DRONACHARYA_WEB_CONSOLE', level: 'log', message: msg, timestamp: Date.now() }, '*');
        } catch(e) {}
        origLog.apply(console, arguments);
      };

      console.warn = function() {
        var msg = serialize(arguments);
        try {
          window.parent.postMessage({ type: 'DRONACHARYA_WEB_CONSOLE', level: 'warn', message: msg, timestamp: Date.now() }, '*');
        } catch(e) {}
        origWarn.apply(console, arguments);
      };

      console.error = function() {
        var msg = serialize(arguments);
        try {
          window.parent.postMessage({ type: 'DRONACHARYA_WEB_CONSOLE', level: 'error', message: msg, timestamp: Date.now() }, '*');
        } catch(e) {}
        origError.apply(console, arguments);
      };

      console.info = function() {
        var msg = serialize(arguments);
        try {
          window.parent.postMessage({ type: 'DRONACHARYA_WEB_CONSOLE', level: 'info', message: msg, timestamp: Date.now() }, '*');
        } catch(e) {}
        origInfo.apply(console, arguments);
      };

      window.onerror = function(message, source, lineno, colno, error) {
        var errMsg = 'Error (Line ' + lineno + '): ' + message;
        try {
          window.parent.postMessage({ type: 'DRONACHARYA_WEB_CONSOLE', level: 'error', message: errMsg, timestamp: Date.now() }, '*');
        } catch(e) {}
      };
    })();
  </script>
</head>
<body>
  ${safeHtml}
  <script>
    try {
      ${safeJs}
    } catch (err) {
      console.error(err.message || String(err));
    }
  </script>
</body>
</html>`;
}

/**
 * Validates student solution for HTML, CSS, or JavaScript interactive exercises.
 */
export async function validateWebExercise(
  code: { html?: string; css?: string; js?: string },
  testCases: { inputDescription: string; expectedOutput: string; codeSnippet: string }[],
  language: 'html' | 'css' | 'javascript'
): Promise<WebValidationResult> {
  const html = code.html || '';
  const css = code.css || '';
  const js = code.js || '';
  const consoleLogs: string[] = [];

  // Parse HTML DOM in browser environment if available
  let doc: Document | null = null;
  if (typeof window !== 'undefined' && typeof DOMParser !== 'undefined') {
    try {
      const parser = new DOMParser();
      doc = parser.parseFromString(html, 'text/html');
    } catch (e) {
      console.warn('DOMParser notice:', e);
    }
  }

  // Execute JavaScript safely in an isolated function if language is JavaScript
  if (language === 'javascript' && js.trim().length > 0) {
    try {
      const customLog = (...args: any[]) => {
        const line = args.map((a) => (typeof a === 'object' ? JSON.stringify(a) : String(a))).join(' ');
        consoleLogs.push(line);
      };

      // Wrap in sandbox
      const sandboxed = new Function('console', `
        "use strict";
        try {
          ${js}
        } catch (e) {
          console.error(e.message || String(e));
        }
      `);
      sandboxed({
        log: customLog,
        warn: customLog,
        error: customLog,
        info: customLog,
      });
    } catch (err: any) {
      consoleLogs.push(`SyntaxError: ${err.message}`);
    }
  }

  const testResults: WebTestResult[] = [];

  for (let i = 0; i < testCases.length; i++) {
    const tc = testCases[i];
    const snippet = tc.codeSnippet || '';
    let passed = false;
    let actual = '';

    // RULE 1: HTML Tag existence e.g. "tag:h1" or "tag:p"
    if (snippet.startsWith('tag:')) {
      const targetTag = snippet.replace('tag:', '').trim().toLowerCase();
      if (doc) {
        const found = doc.getElementsByTagName(targetTag);
        passed = found.length > 0;
        actual = passed ? `Found <${targetTag}> (${found.length} elements)` : `No <${targetTag}> found`;
      } else {
        const tagRegex = new RegExp(`<${targetTag}\\b`, 'i');
        passed = tagRegex.test(html);
        actual = passed ? `Found <${targetTag}>` : `No <${targetTag}> in HTML`;
      }
    }
    // RULE 2: HTML Attribute check e.g. "attr:img[src]" or "attr:a[href]"
    else if (snippet.startsWith('attr:')) {
      const match = snippet.match(/attr:([a-z0-9_-]+)\[([a-z0-9_-]+)\]/i);
      if (match) {
        const [, tagName, attrName] = match;
        if (doc) {
          const elements = doc.getElementsByTagName(tagName.toLowerCase());
          let attrFound = false;
          for (let elIdx = 0; elIdx < elements.length; elIdx++) {
            if (elements[elIdx].hasAttribute(attrName)) {
              attrFound = true;
              break;
            }
          }
          passed = attrFound;
          actual = passed ? `Found <${tagName} ${attrName}="...">` : `Missing ${attrName} on <${tagName}>`;
        } else {
          const attrRegex = new RegExp(`<${tagName}\\b[^>]*\\b${attrName}\\s*=`, 'i');
          passed = attrRegex.test(html);
          actual = passed ? `Found ${attrName} attribute` : `Missing ${attrName} attribute`;
        }
      }
    }
    // RULE 3: CSS Selector or Property check e.g. "css:color" or "css:flex"
    else if (snippet.startsWith('css:')) {
      const targetProp = snippet.replace('css:', '').trim().toLowerCase();
      const cssLower = css.toLowerCase();
      passed = cssLower.includes(targetProp);
      actual = passed ? `Found CSS rule matching '${targetProp}'` : `CSS is missing '${targetProp}'`;
    }
    // RULE 4: Console stdout match e.g. "stdout:Hello World"
    else if (snippet.startsWith('stdout:')) {
      const expectedStdout = snippet.replace('stdout:', '').trim();
      const matched = consoleLogs.some((l) => l.trim().includes(expectedStdout));
      passed = matched;
      actual = consoleLogs.join(' \n') || '(no console output)';
    }
    // RULE 5: Text content presence e.g. "text:Portfolio"
    else if (snippet.startsWith('text:')) {
      const targetText = snippet.replace('text:', '').trim().toLowerCase();
      const fullText = (html + ' ' + js).toLowerCase();
      passed = fullText.includes(targetText);
      actual = passed ? `Contains '${targetText}'` : `Text '${targetText}' not found in code`;
    }
    // RULE 6: Direct code substring matching
    else if (snippet.startsWith('code:')) {
      const codeTarget = snippet.replace('code:', '').trim();
      const fullCode = html + '\n' + css + '\n' + js;
      passed = fullCode.includes(codeTarget);
      actual = passed ? `Contains code snippet` : `Required code '${codeTarget}' not found`;
    }
    // Default fallback check
    else {
      const fullCode = html + '\n' + css + '\n' + js;
      passed = fullCode.includes(tc.expectedOutput) || (consoleLogs.length > 0 && consoleLogs.join(' ').includes(tc.expectedOutput));
      actual = passed ? `Passed validation` : `Expected '${tc.expectedOutput}'`;
    }

    testResults.push({
      testId: `test-${i + 1}`,
      description: tc.inputDescription,
      passed,
      expected: tc.expectedOutput,
      actual: actual || (passed ? tc.expectedOutput : 'Did not match objective requirements'),
      errorMessage: passed ? undefined : `Objective incomplete: ${tc.inputDescription}`,
    });
  }

  const allPassed = testResults.length > 0 && testResults.every((t) => t.passed);
  let diagnosticHint: string | undefined = undefined;

  if (!allPassed) {
    const firstFailed = testResults.find((t) => !t.passed);
    diagnosticHint = firstFailed
      ? `Review: ${firstFailed.description}. Ensure the expected elements or styles are defined.`
      : 'Make sure all instructions in the Codex checklist are met.';
  }

  return {
    allPassed,
    testResults,
    consoleLogs,
    diagnosticHint,
  };
}
