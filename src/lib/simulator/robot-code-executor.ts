// Dronacharya Safe Python Robot Code Interpreter & Simulation Bridge
// Interprets student Python movement loops & API commands into verifiable step-by-step game frames
export interface TilePosition {
  x: number;
  y: number;
}

export const GRID_COLS = 6;
export const GRID_ROWS = 6;
export const START_COORDS: TilePosition = { x: 0, y: 0 };
export const EXIT_COORDS: TilePosition = { x: 5, y: 5 };

export const OBSTACLE_COORDS: TilePosition[] = [
  { x: 1, y: 1 },
  { x: 1, y: 2 },
  { x: 3, y: 2 },
  { x: 2, y: 3 },
  { x: 4, y: 3 },
];

export const BATTERY_COORDS: TilePosition[] = [
  { x: 2, y: 0 },
  { x: 4, y: 1 },
  { x: 3, y: 4 },
];

export interface RobotSimulationFrame {
  stepIndex: number;
  action: string;
  x: number;
  y: number;
  battery: number;
  collectedBatteryIndex?: number;
  event?: 'move' | 'collect' | 'collision' | 'depleted' | 'out_of_bounds' | 'victory';
  logMessage: string;
}

export interface RobotSimulationResult {
  success: boolean;
  frames: RobotSimulationFrame[];
  finalX: number;
  finalY: number;
  finalBattery: number;
  hitObstacle: boolean;
  depleted: boolean;
  outOfBounds: boolean;
  reachedTarget: boolean;
  loopCount: number;
  codeLinesCount: number;
  failureReason?: string;
  diagnostic: {
    explanation: string;
    hint1: string;
    hint2: string;
    hint3: string;
    codeExample: string;
  };
  optionalObjectives: {
    noCollisions: boolean;
    batterySaved: boolean;
    usedLoop: boolean;
  };
}

/**
 * Safely parses and interprets student Python code to control the Robot rover.
 * Supports:
 * - for loops: for <var> in range(<count>):
 * - robot.move_right(n) / robot.move_down(n) / robot.move_left(n) / robot.move_up(n)
 * - robot.move("RIGHT" | "DOWN" | "LEFT" | "UP")
 * - robot.collect() / robot.collect_battery()
 * - Sequential or nested function blocks
 */
export function executeRobotCode(code: string): RobotSimulationResult {
  let curX = START_COORDS.x;
  let curY = START_COORDS.y;
  let battery = 70; // Starting battery 70%
  let hitObstacle = false;
  let depleted = false;
  let outOfBounds = false;
  let reachedTarget = false;
  let loopCount = 0;

  const remainingBatteries = BATTERY_COORDS.map((b) => ({ ...b, collected: false }));
  const frames: RobotSimulationFrame[] = [
    {
      stepIndex: 0,
      action: 'START',
      x: curX,
      y: curY,
      battery,
      event: 'move',
      logMessage: `[INIT] Rover Arya activated at coordinates (${curX}, ${curY}). Battery: ${battery}%`,
    },
  ];

  let stepCounter = 1;

  // Split lines and parse loop constructs
  const lines = code.split('\n');
  const validCodeLines = lines.filter((l) => l.trim().length > 0 && !l.trim().startsWith('#'));

  // Expand code lines into sequential instructions
  const instructions: { command: string; arg?: number }[] = [];

  let i = 0;
  while (i < lines.length) {
    const rawLine = lines[i];
    const trimmed = rawLine.trim();

    if (!trimmed || trimmed.startsWith('#')) {
      i++;
      continue;
    }

    // Detect for loop: for <var> in range(<n>):
    const loopMatch = trimmed.match(/^for\s+(\w+)\s+in\s+range\(\s*(\d+)\s*\)\s*:/);
    if (loopMatch) {
      loopCount++;
      const repeatCount = Math.min(20, parseInt(loopMatch[2], 10)); // cap at 20 for safety
      const loopIndent = rawLine.search(/\S/);

      // Collect loop body lines
      const bodyLines: string[] = [];
      let j = i + 1;
      while (j < lines.length) {
        const nextRaw = lines[j];
        const nextTrimmed = nextRaw.trim();
        if (!nextTrimmed || nextTrimmed.startsWith('#')) {
          j++;
          continue;
        }
        const nextIndent = nextRaw.search(/\S/);
        if (nextIndent > loopIndent) {
          bodyLines.push(nextTrimmed);
          j++;
        } else {
          break;
        }
      }

      // Repeat loop body instructions
      for (let r = 0; r < repeatCount; r++) {
        for (const bodyLine of bodyLines) {
          instructions.push(...parseCommandsFromLine(bodyLine));
        }
      }

      i = j;
      continue;
    }

    // Plain line instruction
    instructions.push(...parseCommandsFromLine(trimmed));
    i++;
  }

  // Helper: parse single line commands
  function parseCommandsFromLine(line: string): { command: string; arg?: number }[] {
    const results: { command: string; arg?: number }[] = [];

    // robot.move_right(n)
    const moveRightMatch = line.match(/robot\.move_right\s*\(\s*(\d*)\s*\)/i);
    if (moveRightMatch) {
      const times = moveRightMatch[1] ? Math.min(10, parseInt(moveRightMatch[1], 10)) : 1;
      for (let k = 0; k < times; k++) results.push({ command: 'RIGHT' });
      return results;
    }

    // robot.move_down(n)
    const moveDownMatch = line.match(/robot\.move_down\s*\(\s*(\d*)\s*\)/i);
    if (moveDownMatch) {
      const times = moveDownMatch[1] ? Math.min(10, parseInt(moveDownMatch[1], 10)) : 1;
      for (let k = 0; k < times; k++) results.push({ command: 'DOWN' });
      return results;
    }

    // robot.move_left(n)
    const moveLeftMatch = line.match(/robot\.move_left\s*\(\s*(\d*)\s*\)/i);
    if (moveLeftMatch) {
      const times = moveLeftMatch[1] ? Math.min(10, parseInt(moveLeftMatch[1], 10)) : 1;
      for (let k = 0; k < times; k++) results.push({ command: 'LEFT' });
      return results;
    }

    // robot.move_up(n)
    const moveUpMatch = line.match(/robot\.move_up\s*\(\s*(\d*)\s*\)/i);
    if (moveUpMatch) {
      const times = moveUpMatch[1] ? Math.min(10, parseInt(moveUpMatch[1], 10)) : 1;
      for (let k = 0; k < times; k++) results.push({ command: 'UP' });
      return results;
    }

    // robot.move("RIGHT" | "DOWN" | "LEFT" | "UP")
    const moveGenericMatch = line.match(/robot\.move\s*\(\s*["'](RIGHT|DOWN|LEFT|UP)["']\s*\)/i);
    if (moveGenericMatch) {
      results.push({ command: moveGenericMatch[1].toUpperCase() });
      return results;
    }

    // robot.collect() / robot.collect_battery()
    if (/robot\.(collect|collect_battery)\s*\(\s*\)/i.test(line)) {
      results.push({ command: 'COLLECT' });
      return results;
    }

    return results;
  }

  // Step through all instructions sequentially
  for (const inst of instructions) {
    if (hitObstacle || depleted || outOfBounds || reachedTarget) break;

    if (inst.command === 'COLLECT') {
      // Find battery at curX, curY
      const batIdx = remainingBatteries.findIndex(
        (b) => !b.collected && b.x === curX && b.y === curY
      );

      if (batIdx !== -1) {
        remainingBatteries[batIdx].collected = true;
        battery = Math.min(100, battery + 25);
        frames.push({
          stepIndex: stepCounter++,
          action: 'COLLECT_BATTERY',
          x: curX,
          y: curY,
          battery,
          collectedBatteryIndex: batIdx,
          event: 'collect',
          logMessage: `[COLLECT] Found Energy Cell at (${curX}, ${curY})! +25% Power. Battery: ${battery}%`,
        });
      } else {
        frames.push({
          stepIndex: stepCounter++,
          action: 'COLLECT_NONE',
          x: curX,
          y: curY,
          battery,
          event: 'collect',
          logMessage: `[COLLECT] Attempted to collect battery at (${curX}, ${curY}), but no cell exists here.`,
        });
      }
      continue;
    }

    // Movement command
    let nextX = curX;
    let nextY = curY;

    if (inst.command === 'RIGHT') nextX += 1;
    if (inst.command === 'LEFT') nextX -= 1;
    if (inst.command === 'DOWN') nextY += 1;
    if (inst.command === 'UP') nextY -= 1;

    // Battery cost: 10% per step
    battery = Math.max(0, battery - 10);
    curX = nextX;
    curY = nextY;

    // Check Out of Bounds
    if (curX < 0 || curX >= GRID_COLS || curY < 0 || curY >= GRID_ROWS) {
      outOfBounds = true;
      frames.push({
        stepIndex: stepCounter++,
        action: `MOVE_${inst.command}`,
        x: Math.max(0, Math.min(GRID_COLS - 1, curX)),
        y: Math.max(0, Math.min(GRID_ROWS - 1, curY)),
        battery,
        event: 'out_of_bounds',
        logMessage: `[CRITICAL ERROR] Out of Bounds! Rover stepped outside the facility perimeter (${curX}, ${curY}).`,
      });
      break;
    }

    // Check Obstacle Collision
    const isHit = OBSTACLE_COORDS.some((o) => o.x === curX && o.y === curY);
    if (isHit) {
      hitObstacle = true;
      frames.push({
        stepIndex: stepCounter++,
        action: `MOVE_${inst.command}`,
        x: curX,
        y: curY,
        battery,
        event: 'collision',
        logMessage: `[COLLISION] Crash at (${curX}, ${curY})! Rover collided with a damaged blast door barrier.`,
      });
      break;
    }

    // Check Battery Depletion
    if (battery <= 0 && !(curX === EXIT_COORDS.x && curY === EXIT_COORDS.y)) {
      depleted = true;
      frames.push({
        stepIndex: stepCounter++,
        action: `MOVE_${inst.command}`,
        x: curX,
        y: curY,
        battery: 0,
        event: 'depleted',
        logMessage: `[POWER OUT] Battery exhausted at (${curX}, ${curY})! Rover shut down before reaching extraction.`,
      });
      break;
    }

    // Check Reached Beacon
    if (curX === EXIT_COORDS.x && curY === EXIT_COORDS.y) {
      reachedTarget = true;
      frames.push({
        stepIndex: stepCounter++,
        action: `MOVE_${inst.command}`,
        x: curX,
        y: curY,
        battery,
        event: 'victory',
        logMessage: `[SUCCESS] Rover Arya docked safely at Extraction Beacon (${EXIT_COORDS.x}, ${EXIT_COORDS.y}) with ${battery}% battery remaining!`,
      });
      break;
    }

    // Normal Step
    frames.push({
      stepIndex: stepCounter++,
      action: `MOVE_${inst.command}`,
      x: curX,
      y: curY,
      battery,
      event: 'move',
      logMessage: `[STEP ${stepCounter - 1}] Moved ${inst.command} to (${curX}, ${curY}). Battery: ${battery}%`,
    });
  }

  // Assess final state
  let failureReason: string | undefined = undefined;
  if (hitObstacle) {
    failureReason = `Barrier Collision: Rover hit an obstacle at tile (${curX}, ${curY}). Check loop steps.`;
  } else if (outOfBounds) {
    failureReason = `Perimeter Breach: Rover exceeded facility boundaries (${curX}, ${curY}).`;
  } else if (depleted) {
    failureReason = `Battery Depleted: Power reached 0% at (${curX}, ${curY}). Program the rover to collect energy cells along the way!`;
  } else if (!reachedTarget) {
    failureReason = `Incomplete Route: Rover stopped at (${curX}, ${curY}), but the beacon is at (${EXIT_COORDS.x}, ${EXIT_COORDS.y}).`;
  }

  const success = reachedTarget && !hitObstacle && !outOfBounds;

  // Progressive Diagnostic Hints
  const diagnostic = {
    explanation: success
      ? 'Outstanding! Your program orchestrated loops and steps to navigate the obstacle field safely.'
      : (failureReason || 'Program did not navigate rover to the target beacon.'),
    hint1: 'Conceptual Hint: Use a for-loop with range(n) to repeat identical steps without writing individual lines.',
    hint2: 'Directional Hint: Row 0 has a clear path to tile (2, 0). Collect the battery cell there to keep your power above 50%!',
    hint3: 'Debugging Hint: Obstacles are located at (1,1), (1,2), (3,2), and (2,3). Travel around the perimeter along row 0 and column 5 to bypass them completely.',
    codeExample: `# Optimal Solution Template
for step in range(3):
    robot.move_right()

robot.collect()

for step in range(4):
    robot.move_down()

for step in range(2):
    robot.move_right()

robot.move_down()`,
  };

  return {
    success,
    frames,
    finalX: curX,
    finalY: curY,
    finalBattery: battery,
    hitObstacle,
    depleted,
    outOfBounds,
    reachedTarget,
    loopCount,
    codeLinesCount: validCodeLines.length,
    failureReason,
    diagnostic,
    optionalObjectives: {
      noCollisions: !hitObstacle,
      batterySaved: battery >= 20,
      usedLoop: loopCount > 0,
    },
  };
}
