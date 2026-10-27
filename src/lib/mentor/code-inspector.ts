// Dronacharya Deep Code & Error AST/Regex Inspector
// Zero-Key / Offline Intelligent Socratic Fallback Engine
// Dynamically inspects live student code line-by-line, extracting exact line numbers,
// variable names, loop counters, and simulator telemetry.

export interface CodeInspectionContext {
  missionTitle?: string;
  missionGoal?: string;
  code: string;
  consoleError?: string;
  simulatorState?: {
    roverPos?: [number, number];
    targetPos?: [number, number];
    battery?: number;
    heartsLeft?: number;
    status?: 'crashed_obstacle' | 'syntax_error' | 'infinite_loop' | 'incomplete_goal' | 'battery_depleted' | 'success';
    lastCollisionCoord?: [number, number];
    currentCellIndex?: number;
  };
  language?: 'python' | 'html' | 'css' | 'javascript';
  preferredLanguage?: 'en' | 'hinglish' | 'hi';
  hintTier?: 1 | 2 | 3;
  studentQuery?: string;
}

export interface InspectionResult {
  detectedLine?: number;
  lineContent?: string;
  issueCategory: 'syntax' | 'indentation' | 'loop_bounds' | 'collision' | 'battery' | 'condition' | 'missing_construct' | 'logic_general';
  tier1Probe: string;
  tier2Compass: string;
  tier3Blueprint: string;
  socraticQuestion: string;
  extractedSymbol?: string;
}

/**
 * Inspect Python Code Line-by-Line with deep pattern detection
 */
export function inspectPythonCode(ctx: CodeInspectionContext): InspectionResult {
  const lines = ctx.code.split('\n');
  const error = (ctx.consoleError || '').toLowerCase();
  const sim = ctx.simulatorState;

  // 1. Check for Python Syntax Errors: Missing Colons
  for (let idx = 0; idx < lines.length; idx++) {
    const lineNum = idx + 1;
    const raw = lines[idx];
    const trimmed = raw.trim();

    if (trimmed.startsWith('#') || trimmed.length === 0) continue;

    // Colon checks on control structures
    const isControlHeader =
      /^(for\b|if\b|elif\b|else\b|while\b|def\b)/.test(trimmed);

    if (isControlHeader && !trimmed.endsWith(':')) {
      const keyword = trimmed.split(/\s+/)[0];
      return {
        detectedLine: lineNum,
        lineContent: trimmed,
        issueCategory: 'syntax',
        extractedSymbol: keyword,
        tier1Probe: `Apprentice, look closely at **Line ${lineNum}** where you wrote \`${trimmed}\`. What punctuation mark is mandatory at the end of a \`${keyword}\` statement in Python before beginning the indented block?`,
        tier2Compass: `In Python, compound statements (like \`${keyword}\`) must always terminate with a colon (\`:\`). This tells the Python parser that the instructions indented below belong inside this block.`,
        tier3Blueprint: `Append a colon to Line ${lineNum}:\n\`${trimmed}:\``,
        socraticQuestion: `How does adding a colon (\`:\`) tell Python which code runs inside the \`${keyword}\` block?`,
      };
    }
  }

  // 2. Check for Indentation Errors (e.g., line after colon is not indented)
  for (let idx = 0; idx < lines.length - 1; idx++) {
    const lineNum = idx + 1;
    const raw = lines[idx];
    const trimmed = raw.trim();

    if (trimmed.endsWith(':') && !trimmed.startsWith('#')) {
      // Find next non-empty, non-comment line
      let nextIdx = idx + 1;
      while (nextIdx < lines.length && (lines[nextIdx].trim() === '' || lines[nextIdx].trim().startsWith('#'))) {
        nextIdx++;
      }

      if (nextIdx < lines.length) {
        const nextRaw = lines[nextIdx];
        const curIndent = raw.search(/\S|$/);
        const nextIndent = nextRaw.search(/\S|$/);

        if (nextIndent <= curIndent) {
          const nextLineNum = nextIdx + 1;
          const nextTrimmed = nextRaw.trim();
          return {
            detectedLine: nextLineNum,
            lineContent: nextTrimmed,
            issueCategory: 'indentation',
            tier1Probe: `Notice **Line ${nextLineNum}** (\`${nextTrimmed}\`) immediately following your \`${trimmed}\` on Line ${lineNum}. Why did Python raise an \`IndentationError\` here?`,
            tier2Compass: `Python uses whitespace indentation rather than curly braces to define code blocks. Any statement following a colon (\`:\`) must be indented (typically 4 spaces) deeper than the parent header.`,
            tier3Blueprint: `Indent Line ${nextLineNum} with 4 spaces:\n\`    ${nextTrimmed}\``,
            socraticQuestion: `How many spaces did you indent on Line ${nextLineNum} compared to Line ${lineNum}?`,
          };
        }
      }
    }
  }

  // 3. Check for Simulator Obstacle Collision
  if (sim?.status === 'crashed_obstacle' || sim?.lastCollisionCoord || error.includes('collision') || error.includes('obstacle')) {
    const colCoord = sim?.lastCollisionCoord || [1, 1];
    // Find movement loop in code
    const moveLineIdx = lines.findIndex((l) => l.includes('robot.move_') || l.includes('move_right') || l.includes('move_down'));
    const detectedLine = moveLineIdx !== -1 ? moveLineIdx + 1 : 1;
    const lineContent = moveLineIdx !== -1 ? lines[moveLineIdx].trim() : 'robot.move()';

    return {
      detectedLine,
      lineContent,
      issueCategory: 'collision',
      tier1Probe: `Critical Alert! Rover Arya collided with a reinforced blast door at coordinate **(${colCoord[0]}, ${colCoord[1]})**! Inspect your trajectory near **Line ${detectedLine}**—what coordinates should Arya bypass before turning?`,
      tier2Compass: `The obstacle lies directly at (${colCoord[0]}, ${colCoord[1]}). If you move down or right too early, Arya crashes. You must keep Arya along Row 0 until at least Column 3 or 4 before descending into the corridor.`,
      tier3Blueprint: `Adjust your outer loop count so Arya moves further right before stepping down:\n\`for step in range(___):\n    robot.move_right()\``,
      socraticQuestion: `At what column can Arya safely move downward without striking the obstacle at (${colCoord[0]}, ${colCoord[1]})?`,
    };
  }

  // 4. Check for Battery Depletion in Simulator
  if (sim?.status === 'battery_depleted' || error.includes('battery') || error.includes('power')) {
    const hasCollect = lines.some((l) => l.includes('robot.collect'));
    return {
      detectedLine: lines.findIndex((l) => l.includes('robot.move')) + 1 || 1,
      lineContent: 'robot.collect()',
      issueCategory: 'battery',
      tier1Probe: `Arya's propulsion drained the battery to 0% before reaching the Extraction Beacon! Did you instruct the rover to recharge from the energy cells along the path?`,
      tier2Compass: `Each movement step consumes battery power. When Arya lands on an energy cell tile, you must execute \`robot.collect()\` to replenish power before continuing into the deeper labyrinth.`,
      tier3Blueprint: `Call the collection subroutine right after reaching a cell:\n\`robot.collect()\``,
      socraticQuestion: `Which tile coordinates contain energy cells, and when should Arya trigger \`collect()\`?`,
    };
  }

  // 5. Check Loop Bounds & Off-by-One in Rescue Rover
  const rangeMatch = ctx.code.match(/range\s*\(\s*(\d+)\s*\)/);
  if (rangeMatch) {
    const rangeVal = parseInt(rangeMatch[1], 10);
    const rangeLineIdx = lines.findIndex((l) => l.includes(`range(${rangeVal})`));
    const detectedLine = rangeLineIdx !== -1 ? rangeLineIdx + 1 : 1;

    if (sim?.roverPos && (sim.roverPos[0] < 5 || sim.roverPos[1] < 5)) {
      const [curX, curY] = sim.roverPos;
      return {
        detectedLine,
        lineContent: lines[rangeLineIdx]?.trim() || `range(${rangeVal})`,
        issueCategory: 'loop_bounds',
        extractedSymbol: `range(${rangeVal})`,
        tier1Probe: `Examine **Line ${detectedLine}** where you set \`range(${rangeVal})\`. Rover Arya stopped short at coordinate **(${curX}, ${curY})**! How many remaining steps does Arya need to reach the Beacon at (5, 5)?`,
        tier2Compass: `A loop with \`range(${rangeVal})\` executes its body exactly ${rangeVal} times. Because Arya started at (0, 0), moving ${rangeVal} tiles leaves Arya at tile ${curX}. To reach the next sector, the loop iteration count must equal the target distance.`,
        tier3Blueprint: `Increase your range iteration parameter:\n\`for step in range(___):\``,
        socraticQuestion: `If Arya is at tile ${curX} and needs to reach tile 5, what should be passed into \`range()\`?`,
      };
    }
  }

  // 6. Check for Hazard Filter Protocol (Conditionals)
  if (ctx.missionTitle?.toLowerCase().includes('hazard') || ctx.code.includes('filter_healthy_cells')) {
    const conditionLineIdx = lines.findIndex((l) => l.includes('if cell') || l.includes('if '));
    if (conditionLineIdx !== -1) {
      const condLine = lines[conditionLineIdx].trim();
      const detectedLine = conditionLineIdx + 1;

      if (condLine.includes('<') || condLine.includes('== 0')) {
        return {
          detectedLine,
          lineContent: condLine,
          issueCategory: 'condition',
          tier1Probe: `Examine your filter condition on **Line ${detectedLine}**: \`${condLine}\`. The sterilization drone must admit ONLY positive, uncorrupted data charges. What comparison operator selects positive numbers?`,
          tier2Compass: `Healthy cells have positive charges (charge > 0). If your \`if\` condition checks for negative or zero values (\`< 0\`), the vault quarantines the healthy cells instead of preserving them.`,
          tier3Blueprint: `Compare each cell against zero using the greater-than operator:\n\`if cell > 0:\``,
          socraticQuestion: `What is the mathematical threshold for a positive number?`,
        };
      }
    }

    // Check if append is called
    const hasAppend = ctx.code.includes('.append(');
    if (!hasAppend) {
      return {
        detectedLine: lines.findIndex((l) => l.includes('def filter_')) + 1 || 1,
        lineContent: 'clean_vault.append(...)',
        issueCategory: 'missing_construct',
        tier1Probe: `Your function iterates over the cells, but how does an approved cell get stored inside the \`clean_vault\` list?`,
        tier2Compass: `Python lists use the \`.append(item)\` method to add new elements to the end of the collection. Once your condition evaluates to True, append that cell to \`clean_vault\`.`,
        tier3Blueprint: `Store the cell in your accumulation list:\n\`clean_vault.append(cell)\``,
        socraticQuestion: `Which Python list method adds a new element to the collection?`,
      };
    }
  }

  // 7. General Fallback with Line-Specific Analysis
  const firstCodeLineIdx = lines.findIndex((l) => l.trim().length > 0 && !l.trim().startsWith('#'));
  const fallbackLine = firstCodeLineIdx !== -1 ? firstCodeLineIdx + 1 : 1;
  const fallbackContent = firstCodeLineIdx !== -1 ? lines[firstCodeLineIdx].trim() : lines[0] || '';

  return {
    detectedLine: fallbackLine,
    lineContent: fallbackContent,
    issueCategory: 'logic_general',
    tier1Probe: `Look at **Line ${fallbackLine}** (\`${fallbackContent}\`). Walk through the logic step-by-step: what state does this command produce before the next operation runs?`,
    tier2Compass: `Compare what your code currently does against the mission goal: verify each variable's value and the sequence in which operations execute.`,
    tier3Blueprint: `Review your logic flow:\n\`# Expected: Verify step order on Line ${fallbackLine}\``,
    socraticQuestion: `What specific output or state change did you expect Line ${fallbackLine} to cause?`,
  };
}

/**
 * Inspect Web Code (HTML, CSS, JS) Line-by-Line
 */
export function inspectWebCode(ctx: CodeInspectionContext): InspectionResult {
  const lines = ctx.code.split('\n');

  // Check HTML Tag matching
  if (ctx.language === 'html' || ctx.code.includes('<') && ctx.code.includes('>')) {
    const openTags: { tag: string; line: number }[] = [];
    const selfClosing = ['img', 'br', 'hr', 'input', 'meta', 'link'];

    for (let idx = 0; idx < lines.length; idx++) {
      const lineNum = idx + 1;
      const line = lines[idx];

      const tagMatches = line.matchAll(/<\/?([a-zA-Z0-9]+)[^>]*>/g);
      for (const m of tagMatches) {
        const full = m[0];
        const tag = m[1].toLowerCase();

        if (selfClosing.includes(tag) || full.endsWith('/>')) continue;

        if (full.startsWith('</')) {
          // Closing tag
          if (openTags.length > 0 && openTags[openTags.length - 1].tag === tag) {
            openTags.pop();
          }
        } else {
          // Opening tag
          openTags.push({ tag, line: lineNum });
        }
      }
    }

    if (openTags.length > 0) {
      const unclosed = openTags[openTags.length - 1];
      return {
        detectedLine: unclosed.line,
        lineContent: lines[unclosed.line - 1]?.trim() || `<${unclosed.tag}>`,
        issueCategory: 'syntax',
        extractedSymbol: unclosed.tag,
        tier1Probe: `Apprentice, look at **Line ${unclosed.line}** where you opened a \`<${unclosed.tag}>\` tag. What matching element is required to close this block in HTML?`,
        tier2Compass: `Every non-void HTML container tag must have a corresponding closing tag with a forward slash (\`</${unclosed.tag}>\`). Without it, child elements may bleed into the surrounding layout.`,
        tier3Blueprint: `Close your tag after its content:\n\`</${unclosed.tag}>\``,
        socraticQuestion: `Where in your document should the \`</${unclosed.tag}>\` closing tag be placed?`,
      };
    }
  }

  // Check CSS missing semicolons
  if (ctx.language === 'css' || ctx.code.includes('{') && ctx.code.includes(':')) {
    for (let idx = 0; idx < lines.length; idx++) {
      const lineNum = idx + 1;
      const trimmed = lines[idx].trim();

      if (trimmed.includes(':') && !trimmed.endsWith(';') && !trimmed.endsWith('{') && !trimmed.startsWith('/*')) {
        return {
          detectedLine: lineNum,
          lineContent: trimmed,
          issueCategory: 'syntax',
          tier1Probe: `Check **Line ${lineNum}** in your CSS: \`${trimmed}\`. What punctuation mark ends every CSS property declaration?`,
          tier2Compass: `In CSS rulesets, each property declaration must terminate with a semicolon (\`;\`). Missing a semicolon causes the browser parser to invalidate the subsequent rule.`,
          tier3Blueprint: `Add a semicolon at the end of Line ${lineNum}:\n\`${trimmed};\``,
          socraticQuestion: `Why does CSS require semicolons between distinct property declarations?`,
        };
      }
    }
  }

  return inspectPythonCode(ctx);
}

/**
 * Localize Socratic Guidance into the User's Preferred Dialect (English, Hinglish, Hindi)
 */
export function formatDialect(
  result: InspectionResult,
  tier: 1 | 2 | 3,
  lang: 'en' | 'hinglish' | 'hi' = 'en'
): { message: string; socraticQuestion: string } {
  let baseText = result.tier1Probe;
  if (tier === 2) baseText = `${result.tier1Probe}\n\n🧭 **Conceptual Clue:** ${result.tier2Compass}`;
  if (tier === 3) baseText = `${result.tier1Probe}\n\n🧭 **Conceptual Clue:** ${result.tier2Compass}\n\n🛠️ **Skeleton Blueprint:**\n\`\`\`\n${result.tier3Blueprint}\n\`\`\``;

  if (lang === 'hi') {
    return {
      message: `प्रणाम शिष्य! आपके कोड का विश्लेषण (पंक्ति ${result.detectedLine || 1}):\n\n${baseText}`,
      socraticQuestion: result.socraticQuestion,
    };
  }

  if (lang === 'hinglish') {
    let hinglishMsg = baseText
      .replace(/Apprentice, look closely at/gi, 'Shishya, dhyan se dekho')
      .replace(/Notice \*\*Line/gi, 'Dhyan do **Line')
      .replace(/Critical Alert!/gi, 'Khatra! Alert!')
      .replace(/What punctuation mark is mandatory/gi, 'Kaunsa punctuation mark zaroori hai')
      .replace(/Examine your filter condition/gi, 'Apni condition ko check karo')
      .replace(/Why did Python raise/gi, 'Python ne error kyu diya')
      .replace(/How many remaining steps/gi, 'Kitne aur steps chahiye');

    return {
      message: hinglishMsg,
      socraticQuestion: result.socraticQuestion,
    };
  }

  return {
    message: baseText,
    socraticQuestion: result.socraticQuestion,
  };
}
