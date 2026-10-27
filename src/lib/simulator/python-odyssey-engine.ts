// Dronacharya Rover Arya's Odyssey: Python 2D RPG Simulation Engine
// Executes, validates, and translates student Python code into interactive 8x8 RPG canvas simulation frames

export interface OdysseyCoord {
  x: number;
  y: number;
}

export type RealmId = 'starter-village' | 'variable-valley' | 'conditional-castle' | 'loop-lab';

export interface OdysseyQuestSpec {
  id: string; // e.g. 'py-less-1-1'
  chapterNumber: number;
  lessonNumber: string; // e.g. '1.1'
  realmId: RealmId;
  realmName: string;
  title: string;
  concept: string;
  instructions: string;
  starterCode: string;
  solutionCode: string;
  xpReward: number;
  vaultReward: number; // ₹10
  sealReward?: string;
  startPos: OdysseyCoord;
  targetPos: OdysseyCoord;
  briefing: {
    story: string;
    storyHinglish: string;
    syntaxTip: string;
    syntaxTipHinglish: string;
    expectedPattern: string;
  };
}

export interface OdysseySimFrame {
  step: number;
  roverX: number;
  roverY: number;
  status: 'SLEEPING' | 'AWAKENED' | 'DRIVING' | 'SHIELD_UP' | 'COLLECTING' | 'LASER_HIT' | 'VICTORY';
  headlightsOn: boolean;
  shieldActive: boolean;
  batteryLevel: number;
  gateOpen?: boolean;
  bridgeActive?: boolean;
  collectedItems: OdysseyCoord[];
  logMessage: string;
  toast?: { text: string; type: 'xp' | 'damage' | 'vault' | 'info' };
}

export interface OdysseyExecutionResult {
  success: boolean;
  frames: OdysseySimFrame[];
  stdout: string[];
  error?: string;
  socraticHint?: string;
  detectedLine?: number;
  hitLaser?: boolean;
  sparksRejected?: boolean;
  dryRuleViolated?: boolean;
}

export const ODYSSEY_QUESTS: OdysseyQuestSpec[] = [
  // =========================================================================
  // QUEST 1: Starter Village — Lesson 1.1: The First Incantation
  // =========================================================================
  {
    id: 'py-less-1-1',
    chapterNumber: 1,
    lessonNumber: '1.1',
    realmId: 'starter-village',
    realmName: 'Starter Village',
    title: 'The First Incantation',
    concept: 'print() & String Quotes',
    instructions: 'Use the `print()` function with double quotes to transmit the awakening incantation and open the ancient stone gate.',
    starterCode: `# Quest 1: The First Incantation
# Objective: Awaken Rover Arya using print() with quotes
# Example: print("AWAKEN ARYA")

print("AWAKEN ARYA")
`,
    solutionCode: `print("AWAKEN ARYA")`,
    xpReward: 30,
    vaultReward: 10,
    startPos: { x: 4, y: 1 },
    targetPos: { x: 4, y: 4 },
    briefing: {
      story: 'Field Rover Arya is powered down in a dark, overgrown ruin inside Starter Village. Optical sensors are completely offline, and an ancient stone gate blocks the pathway. Only a valid Python print incantation can reignite its core.',
      storyHinglish: 'Starter Village ke khandahar me Rover Arya band pada hai. Optical sensors offline hain aur ek purana pathar ka gate rasta rok raha hai. Sirf valid Python print incantation se hi Arya ko jagaya ja sakta hai.',
      syntaxTip: 'In Python, use print("Your Text Here"). Letters are case-sensitive—always use lowercase print, never Print.',
      syntaxTipHinglish: 'Python me print("Text") likha jata hai. Dhyan rahe print hamesha lowercase hota hai, Print nahi.',
      expectedPattern: 'print("...")',
    },
  },

  // =========================================================================
  // QUEST 2: Starter Village — Lesson 1.2: Numbers vs. Text Strings
  // =========================================================================
  {
    id: 'py-less-1-2',
    chapterNumber: 1,
    lessonNumber: '1.2',
    realmId: 'starter-village',
    realmName: 'Starter Village',
    title: 'Numbers vs. Text Strings',
    concept: 'Quotes Make Strings; Raw Numbers Calculate',
    instructions: 'Transmit telemetry to both pedestals: a text label in quotes and a raw calculated number (e.g., `print("Power:", 95)` or `print(25 + 25)` without quotes) to activate the bridge.',
    starterCode: `# Quest 2: Numbers vs. Text Strings
# Communications Beacon (pedestal left) expects text: "Power:"
# Voltage Regulator (pedestal right) expects a calculation: 25 + 25 or 95 without quotes!

print("Power:", 95)
`,
    solutionCode: `print("Power:", 95)`,
    xpReward: 30,
    vaultReward: 10,
    startPos: { x: 2, y: 3 },
    targetPos: { x: 5, y: 3 },
    briefing: {
      story: 'Rover Arya reaches a deep chasm. Two ancient pedestals guard the broken bridge: the Communications Beacon expects a string ("Power:"), while the Voltage Regulator demands a raw number calculation (like 25 + 25 = 50 or 95). If you wrap numbers in quotes, the regulator will spark and reject it!',
      storyHinglish: 'Arya ek gahri khai par pahunchti hai. Yahan do pedestals hain: Beacon ko text string chahiye ("Power:"), aur Voltage Regulator ko raw number calculation (jaise 25 + 25 ya 95). Agar number ko quotes me daala, toh regulator spark karega!',
      syntaxTip: 'Quotes like "95" create text strings. Raw numbers without quotes like 95 or 25 + 25 execute mathematical logic.',
      syntaxTipHinglish: 'Quotes me "95" text ban jata hai, bina quotes ke 95 number calculate hota hai.',
      expectedPattern: 'print("Power:", 95)',
    },
  },

  // =========================================================================
  // QUEST 3: Variable Valley — Lesson 2.1: Declaring Variable Registers
  // =========================================================================
  {
    id: 'py-less-2-1',
    chapterNumber: 2,
    lessonNumber: '2.1',
    realmId: 'variable-valley',
    realmName: 'Variable Valley',
    title: 'Declaring Variable Registers',
    concept: 'Variables & State Memory with =',
    instructions: 'Declare variable registers `battery = 100` and `target_x = 5` to charge Arya’s thrusters and drive to the power crystal.',
    starterCode: `# Quest 3: Declaring Variable Registers
# Memory registers are wiped (battery = 0, target_x = None)
# Assign variables to ignite thrusters and drive to coordinate target_x:

battery = 100
target_x = 5
print("Battery:", battery)
`,
    solutionCode: `battery = 100\ntarget_x = 5\nprint("Battery:", battery)`,
    xpReward: 30,
    vaultReward: 10,
    startPos: { x: 1, y: 4 },
    targetPos: { x: 5, y: 4 },
    briefing: {
      story: 'Inside Variable Valley’s magnetic cavern, Rover Arya’s memory banks have reset. A magnetic vault door features live HUD gauges tied directly to your Python code. Assign the battery variable to charge up and target_x to drive.',
      storyHinglish: 'Variable Valley ke andar Arya ki memory wipe ho gayi hai. Canvas par live gauges aapke Python variables se connected hain. battery aur target_x assign karke thrusters start karein.',
      syntaxTip: 'Create persistent state with variable_name = value. In Python, single = assigns a value to a memory register.',
      syntaxTipHinglish: 'Variable banane ke liye variable_name = value likha jata hai.',
      expectedPattern: 'battery = 100 and target_x = 5',
    },
  },

  // =========================================================================
  // QUEST 4: Conditional Castle — Lesson 3.1: The If Statement
  // =========================================================================
  {
    id: 'py-less-3-1',
    chapterNumber: 3,
    lessonNumber: '3.1',
    realmId: 'conditional-castle',
    realmName: 'Conditional Castle',
    title: 'The If Statement & Shields',
    concept: 'Branching Conditions & Boolean Evaluation',
    instructions: 'Write an `if` statement to activate Rover Arya’s plasma shield before driving through the lethal red laser corridor.',
    starterCode: `# Quest 4: The If Statement
# Active laser barrier detected across column 3!
# Write an if block to activate the protective plasma shield:

barrier_detected = True

if barrier_detected:
    rover.activate_shield()
    print("Shield Activated")
`,
    solutionCode: `barrier_detected = True\nif barrier_detected:\n    rover.activate_shield()`,
    xpReward: 30,
    vaultReward: 10,
    sealReward: 'Condition Sentinel Seal',
    startPos: { x: 1, y: 3 },
    targetPos: { x: 6, y: 3 },
    briefing: {
      story: 'In Conditional Castle, an active pulsing red laser barrier cuts straight through the corridor. If Arya crosses without a plasma shield, the laser hits for 1 Heart of damage! Write an if condition to evaluate barrier_detected and activate the shield.',
      storyHinglish: 'Conditional Castle me red laser barrier rasta rok raha hai. Bina shield ke move karne par 1 Heart loose hoga. if condition likhkar shield activate karein.',
      syntaxTip: 'Write if condition: with a colon at the end, and indent the next statement by 4 spaces.',
      syntaxTipHinglish: 'if condition: ke baad colon lagayein aur agali line ko 4 spaces indent karein.',
      expectedPattern: 'if barrier_detected: rover.activate_shield()',
    },
  },

  // =========================================================================
  // QUEST 5: Loop Lab — Lesson 4.1: Counting with for and range()
  // =========================================================================
  {
    id: 'py-less-4-1',
    chapterNumber: 4,
    lessonNumber: '4.1',
    realmId: 'loop-lab',
    realmName: 'Loop Lab',
    title: 'Counting with for and range()',
    concept: 'Loops & Iterative Repetition',
    instructions: 'Write a `for` loop using `range(5)` to harvest all 5 energy cells and reach the extraction teleport vortex.',
    starterCode: `# Quest 5: Counting with for and range()
# A cybernetic hallway holds 5 energy cells.
# DO NOT repeat manual commands (DRY rule enforced!)
# Use a for loop with range(5):

for step in range(5):
    rover.move_right()
    print("Harvested cell:", step + 1)
`,
    solutionCode: `for step in range(5):\n    rover.move_right()`,
    xpReward: 30,
    vaultReward: 10,
    sealReward: 'Loop Navigator Seal',
    startPos: { x: 1, y: 3 },
    targetPos: { x: 6, y: 3 },
    briefing: {
      story: 'Loop Lab features an 8-tile cybernetic hallway lined with 5 glowing green energy cells. The lab’s AI enforces the "DRY (Don\'t Repeat Yourself)" rule—manually typing 5 move commands is rejected! Automate repetition using for step in range(5):.',
      storyHinglish: 'Loop Lab me 5 energy cells hain. Manually 5 baar command likhna "DRY Rule" se block ho jata hai. for step in range(5): loop se repeat karein.',
      syntaxTip: 'for variable in range(count): repeats the indented block count times.',
      syntaxTipHinglish: 'for step in range(count): loop block ko count baar repeat karta hai.',
      expectedPattern: 'for step in range(5): rover.move_right()',
    },
  },
];

export function findOdysseyQuest(questId: string): OdysseyQuestSpec {
  return ODYSSEY_QUESTS.find((q) => q.id === questId) || ODYSSEY_QUESTS[0];
}

/**
 * Deterministic Python Odyssey Code Interpreter & Simulation Animator
 */
export function executeOdysseyQuest(
  quest: OdysseyQuestSpec,
  studentCode: string
): OdysseyExecutionResult {
  const lines = studentCode.split('\n');
  const stdout: string[] = [];

  // =========================================================================
  // 1. QUEST 1: The First Incantation (Starter Village)
  // =========================================================================
  if (quest.id === 'py-less-1-1') {
    // Check for capital P: Print(...)
    const capitalPrintLine = lines.findIndex((l) => /^\s*Print\s*\(/.test(l));
    if (capitalPrintLine !== -1) {
      return {
        success: false,
        frames: [],
        stdout: [`SyntaxError: name 'Print' is not defined on line ${capitalPrintLine + 1}`],
        error: `In Python, functions are case-sensitive! You wrote Print with a capital P on Line ${capitalPrintLine + 1}.`,
        detectedLine: capitalPrintLine + 1,
        socraticHint: 'Python command names are strictly lowercase. How should `print` be written?',
      };
    }

    // Check for missing quotes in print: print(hello)
    const unquotedPrintLine = lines.findIndex(
      (l) => /^\s*print\s*\([^"']+\)/.test(l) && !/print\s*\(\s*\d+\s*\)/.test(l)
    );
    if (unquotedPrintLine !== -1) {
      return {
        success: false,
        frames: [],
        stdout: [`NameError: unquoted string literal on line ${unquotedPrintLine + 1}`],
        error: `On Line ${unquotedPrintLine + 1}, your text string is missing double quotes around it!`,
        detectedLine: unquotedPrintLine + 1,
        socraticHint: 'In Python, words must be enclosed in quotes "" so the computer knows it is a text string.',
      };
    }

    // Check for valid print statement
    const hasValidPrint = lines.some((l) => /print\s*\(\s*["'].+["']\s*\)/i.test(l));

    if (!hasValidPrint) {
      return {
        success: false,
        frames: [],
        stdout: ['# No valid print() incantation detected.'],
        error: 'Rover Arya remains asleep. Transmit an awakening incantation using print("...")!',
        socraticHint: 'Write print("AWAKEN ARYA") to send the awakening pulse.',
      };
    }

    // Extract printed message
    const matched = studentCode.match(/print\s*\(\s*["']([^"']+)["']\s*\)/);
    const printedMsg = matched ? matched[1] : 'AWAKEN ARYA';
    stdout.push(printedMsg);

    // Build success simulation frames
    const frames: OdysseySimFrame[] = [
      {
        step: 0,
        roverX: 4,
        roverY: 1,
        status: 'SLEEPING',
        headlightsOn: false,
        shieldActive: false,
        batteryLevel: 20,
        gateOpen: false,
        collectedItems: [],
        logMessage: '📡 Incantation received: "' + printedMsg + '"',
        toast: { text: 'Core Ignited! ⚡', type: 'info' },
      },
      {
        step: 1,
        roverX: 4,
        roverY: 1,
        status: 'AWAKENED',
        headlightsOn: true,
        shieldActive: false,
        batteryLevel: 60,
        gateOpen: false,
        collectedItems: [],
        logMessage: '💡 Optical sensors online! Headlights illuminated.',
        toast: { text: 'Headlights Online', type: 'info' },
      },
      {
        step: 2,
        roverX: 4,
        roverY: 1,
        status: 'AWAKENED',
        headlightsOn: true,
        shieldActive: false,
        batteryLevel: 80,
        gateOpen: true,
        collectedItems: [],
        logMessage: '🔓 Ancient stone gate glyph unlocks and dissolves!',
        toast: { text: 'Gate Dissolved!', type: 'info' },
      },
      {
        step: 3,
        roverX: 4,
        roverY: 2,
        status: 'DRIVING',
        headlightsOn: true,
        shieldActive: false,
        batteryLevel: 85,
        gateOpen: true,
        collectedItems: [],
        logMessage: '🚗 Rover Arya drives through the open gateway...',
      },
      {
        step: 4,
        roverX: 4,
        roverY: 3,
        status: 'DRIVING',
        headlightsOn: true,
        shieldActive: false,
        batteryLevel: 90,
        gateOpen: true,
        collectedItems: [],
        logMessage: '🚗 Approaching the village extraction beacon...',
      },
      {
        step: 5,
        roverX: 4,
        roverY: 4,
        status: 'VICTORY',
        headlightsOn: true,
        shieldActive: false,
        batteryLevel: 100,
        gateOpen: true,
        collectedItems: [{ x: 4, y: 4 }],
        logMessage: '🏆 Beacon Activated! Starter Village Quest 1 Mastered!',
        toast: { text: '+30 XP • +₹10 Vault Unlocked! 💸', type: 'vault' },
      },
    ];

    return { success: true, frames, stdout };
  }

  // =========================================================================
  // QUEST 2: Numbers vs. Text Strings (Starter Village)
  // =========================================================================
  if (quest.id === 'py-less-1-2') {
    // Check if the student wrapped arithmetic inside quotes: print("25 + 25") or print("95")
    const quotedMath = lines.some((l) => /print\s*\(\s*["']\s*(\d+\s*[\+\-\*\/]\s*\d+|\d+)\s*["']\s*\)/.test(l));
    if (quotedMath) {
      return {
        success: false,
        frames: [],
        stdout: ['[VOLTAGE REGULATOR] ⚠️ REJECTED: Received literal text string instead of numeric calculation!'],
        error: 'The Voltage Regulator sparked and rejected the input! You wrapped numbers in quotes, making it a string.',
        sparksRejected: true,
        socraticHint: 'Quotes make text strings (e.g. "50"). Remove quotes around numbers so Python calculates them mathematically!',
      };
    }

    // Check for comma multi-item print or raw calculation
    const hasCommaPrint = lines.some((l) => /print\s*\(\s*["'][^"']+["']\s*,\s*(\d+|[a-zA-Z_]\w*|\d+\s*[\+\-\*\/]\s*\d+)\s*\)/.test(l));
    const hasMathCalculation = lines.some((l) => /print\s*\(\s*\d+\s*[\+\-\*\/]\s*\d+\s*\)/.test(l) || /print\s*\(\s*\d+\s*\)/.test(l));

    if (!hasCommaPrint && !hasMathCalculation) {
      return {
        success: false,
        frames: [],
        stdout: ['# Communications Beacon awaiting text string & numeric reading.'],
        error: 'The energy bridge remains broken. Print both a text string and a number (e.g., print("Power:", 95))!',
        socraticHint: 'Use commas inside print() to combine a text string with a raw number: print("Power:", 95)',
      };
    }

    stdout.push('Power: 95');

    const frames: OdysseySimFrame[] = [
      {
        step: 0,
        roverX: 2,
        roverY: 3,
        status: 'AWAKENED',
        headlightsOn: true,
        shieldActive: false,
        batteryLevel: 95,
        bridgeActive: false,
        collectedItems: [],
        logMessage: '📡 Communications Beacon & Voltage Regulator calibrated.',
        toast: { text: 'Voltage Matched: 95V ⚡', type: 'info' },
      },
      {
        step: 1,
        roverX: 2,
        roverY: 3,
        status: 'AWAKENED',
        headlightsOn: true,
        shieldActive: false,
        batteryLevel: 95,
        bridgeActive: true,
        collectedItems: [],
        logMessage: '⚡ Radiant cyan energy bridge materializes across the chasm!',
        toast: { text: 'Bridge Materialized! 🌉', type: 'info' },
      },
      {
        step: 2,
        roverX: 3,
        roverY: 3,
        status: 'DRIVING',
        headlightsOn: true,
        shieldActive: false,
        batteryLevel: 93,
        bridgeActive: true,
        collectedItems: [],
        logMessage: '🚗 Arya crossing the shimmering energy bridge...',
      },
      {
        step: 3,
        roverX: 4,
        roverY: 3,
        status: 'DRIVING',
        headlightsOn: true,
        shieldActive: false,
        batteryLevel: 91,
        bridgeActive: true,
        collectedItems: [],
        logMessage: '🚗 Successfully traversing the chasm...',
      },
      {
        step: 4,
        roverX: 5,
        roverY: 3,
        status: 'VICTORY',
        headlightsOn: true,
        shieldActive: false,
        batteryLevel: 100,
        bridgeActive: true,
        collectedItems: [{ x: 5, y: 3 }],
        logMessage: '🏆 Bridge Crossed! Numbers vs. Text Strings Mastered!',
        toast: { text: '+30 XP • +₹10 Vault Unlocked! 💸', type: 'vault' },
      },
    ];

    return { success: true, frames, stdout };
  }

  // =========================================================================
  // QUEST 3: Declaring Variable Registers (Variable Valley)
  // =========================================================================
  if (quest.id === 'py-less-2-1') {
    // Check for variable declaration: battery = <number>
    const hasBattery = /battery\s*=\s*\d+/.test(studentCode);
    const hasTargetX = /target_x\s*=\s*\d+/.test(studentCode) || /x\s*=\s*\d+/.test(studentCode);

    if (!hasBattery) {
      return {
        success: false,
        frames: [],
        stdout: ['# Variable bank empty: battery register is 0%.'],
        error: 'Rover Arya memory bank is empty! Declare the variable `battery = 100` (or `85`) to power the thrusters.',
        socraticHint: 'Declare a variable in Python by writing: battery = 100',
      };
    }

    stdout.push('Battery: 100');
    stdout.push('Target X: 5');

    const frames: OdysseySimFrame[] = [
      {
        step: 0,
        roverX: 1,
        roverY: 4,
        status: 'AWAKENED',
        headlightsOn: true,
        shieldActive: false,
        batteryLevel: 20,
        collectedItems: [],
        logMessage: '💾 Allocating memory registers: battery = 100...',
        toast: { text: 'Memory Allocated! 💾', type: 'info' },
      },
      {
        step: 1,
        roverX: 1,
        roverY: 4,
        status: 'AWAKENED',
        headlightsOn: true,
        shieldActive: false,
        batteryLevel: 100,
        collectedItems: [],
        logMessage: '🔥 Thrusters ignited! HUD gauge charged to 100%.',
        toast: { text: 'Thrusters 100% Charged 🔥', type: 'info' },
      },
      {
        step: 2,
        roverX: 2,
        roverY: 4,
        status: 'DRIVING',
        headlightsOn: true,
        shieldActive: false,
        batteryLevel: 98,
        collectedItems: [],
        logMessage: '🚗 Accelerating down Variable Valley cavern...',
      },
      {
        step: 3,
        roverX: 3,
        roverY: 4,
        status: 'DRIVING',
        headlightsOn: true,
        shieldActive: false,
        batteryLevel: 95,
        collectedItems: [],
        logMessage: '🚗 Passing magnetic vault pillars...',
      },
      {
        step: 4,
        roverX: 4,
        roverY: 4,
        status: 'DRIVING',
        headlightsOn: true,
        shieldActive: false,
        batteryLevel: 92,
        collectedItems: [],
        logMessage: '🚗 Locking onto power crystal coordinates...',
      },
      {
        step: 5,
        roverX: 5,
        roverY: 4,
        status: 'VICTORY',
        headlightsOn: true,
        shieldActive: false,
        batteryLevel: 100,
        collectedItems: [{ x: 5, y: 4 }],
        logMessage: '💎 Power Crystal Collected! Variable Valley Mastered!',
        toast: { text: '+30 XP • +₹10 Vault Unlocked! 💸', type: 'vault' },
      },
    ];

    return { success: true, frames, stdout };
  }

  // =========================================================================
  // QUEST 4: The If Statement (Conditional Castle)
  // =========================================================================
  if (quest.id === 'py-less-3-1') {
    // Check for if statement
    const hasIf = /if\s+[\w\s><=!]+:/.test(studentCode);
    const activatesShield = /rover\.activate_shield\(\)|shield_up\s*=\s*True|print\s*\(\s*["']Clear Path["']\s*\)/i.test(studentCode);

    if (!hasIf) {
      return {
        success: false,
        frames: [],
        stdout: ['[DANGER] Laser barrier active across column 3! Rover has no conditional shield rule.'],
        error: 'Rover Arya cannot cross blindly without an if check! Write an `if` block to activate the shield.',
        socraticHint: 'Write: if barrier_detected: rover.activate_shield()',
      };
    }

    if (!activatesShield) {
      return {
        success: false,
        frames: [],
        stdout: ['[HAZARD] Laser beam struck Rover Arya! -1 Heart.'],
        error: 'The laser hit Arya because the shield was not activated inside your if block!',
        hitLaser: true,
        socraticHint: 'Inside your if statement, indent and call rover.activate_shield() or set shield_up = True.',
      };
    }

    stdout.push('Shield Activated: True');
    stdout.push('Deflected Laser at Col 3');

    const frames: OdysseySimFrame[] = [
      {
        step: 0,
        roverX: 1,
        roverY: 3,
        status: 'AWAKENED',
        headlightsOn: true,
        shieldActive: false,
        batteryLevel: 95,
        collectedItems: [],
        logMessage: '🔍 Evaluating condition: if barrier_detected is True...',
      },
      {
        step: 1,
        roverX: 1,
        roverY: 3,
        status: 'SHIELD_UP',
        headlightsOn: true,
        shieldActive: true,
        batteryLevel: 95,
        collectedItems: [],
        logMessage: '🛡️ Blue plasma shield bubble activated around Arya!',
        toast: { text: 'Plasma Shield Active 🛡️', type: 'info' },
      },
      {
        step: 2,
        roverX: 2,
        roverY: 3,
        status: 'SHIELD_UP',
        headlightsOn: true,
        shieldActive: true,
        batteryLevel: 90,
        collectedItems: [],
        logMessage: '🚗 Approaching the humming red laser barrier...',
      },
      {
        step: 3,
        roverX: 3,
        roverY: 3,
        status: 'SHIELD_UP',
        headlightsOn: true,
        shieldActive: true,
        batteryLevel: 85,
        collectedItems: [],
        logMessage: '✨ LASER DEFLECTED! Plasma shield safely deflected laser beam bolts!',
        toast: { text: 'Laser Deflected! ✨', type: 'info' },
      },
      {
        step: 4,
        roverX: 4,
        roverY: 3,
        status: 'SHIELD_UP',
        headlightsOn: true,
        shieldActive: true,
        batteryLevel: 80,
        collectedItems: [],
        logMessage: '🚗 Advancing safely beyond the hazard corridor...',
      },
      {
        step: 5,
        roverX: 5,
        roverY: 3,
        status: 'DRIVING',
        headlightsOn: true,
        shieldActive: false,
        batteryLevel: 78,
        collectedItems: [],
        logMessage: '🚗 Entering the Castle Throne Room...',
      },
      {
        step: 6,
        roverX: 6,
        roverY: 3,
        status: 'VICTORY',
        headlightsOn: true,
        shieldActive: false,
        batteryLevel: 100,
        collectedItems: [{ x: 6, y: 3 }],
        logMessage: '👑 Throne Room Reached! Condition Sentinel Seal Unlocked!',
        toast: { text: '+30 XP • +₹10 Vault • Condition Sentinel Seal 🛡️', type: 'vault' },
      },
    ];

    return { success: true, frames, stdout };
  }

  // =========================================================================
  // QUEST 5: Counting with for and range() (Loop Lab)
  // =========================================================================
  if (quest.id === 'py-less-4-1') {
    // Check for DRY Rule violation: manual duplicate move commands
    const moveCount = (studentCode.match(/rover\.move|print\s*\(\s*["']Burst/g) || []).length;
    const hasForLoop = /for\s+\w+\s+in\s+range\s*\(\s*\d+\s*\)\s*:/.test(studentCode);

    if (moveCount >= 3 && !hasForLoop) {
      return {
        success: false,
        frames: [],
        stdout: ['[DRY RULE VIOLATOR DETECTED] ❌ Don’t Repeat Yourself: Repeating manual commands is strictly forbidden in Loop Lab!'],
        error: 'DRY Rule Violation: You repeated commands manually! Automate this using `for step in range(5):`.',
        dryRuleViolated: true,
        socraticHint: 'Use a for-loop: for step in range(5): rover.move_right()',
      };
    }

    if (!hasForLoop) {
      return {
        success: false,
        frames: [],
        stdout: ['# Loop Lab conveyor awaiting for-loop iteration.'],
        error: 'Write a `for` loop using `range(5)` to harvest all energy cells.',
        socraticHint: 'Write: for step in range(5): with an indented move or print statement.',
      };
    }

    // Check range count
    const rangeMatch = studentCode.match(/range\s*\(\s*(\d+)\s*\)/);
    const rangeVal = rangeMatch ? parseInt(rangeMatch[1], 10) : 5;

    if (rangeVal < 4) {
      return {
        success: false,
        frames: [],
        stdout: [`[STOPPED SHORT] Loop finished after only ${rangeVal} iterations. Extraction portal is 5 tiles away!`],
        error: `Rover Arya stopped ${5 - rangeVal} tiles short! You set range(${rangeVal}). How many iterations are needed to reach tile 6?`,
        socraticHint: 'Change your range count to 5 so Arya can harvest all 5 cells and reach the portal.',
      };
    }

    stdout.push('Executing for-loop: range(5)');
    for (let i = 0; i < 5; i++) {
      stdout.push(`Harvested cell: ${i + 1}`);
    }

    const collected: OdysseyCoord[] = [];
    const frames: OdysseySimFrame[] = [
      {
        step: 0,
        roverX: 1,
        roverY: 3,
        status: 'AWAKENED',
        headlightsOn: true,
        shieldActive: false,
        batteryLevel: 25,
        collectedItems: [],
        logMessage: '🔄 Commencing for-loop automation: 5 iterations...',
      },
    ];

    for (let i = 1; i <= 5; i++) {
      const curX = 1 + i;
      collected.push({ x: curX - 1, y: 3 });
      frames.push({
        step: i,
        roverX: curX,
        roverY: 3,
        status: i === 5 ? 'VICTORY' : 'COLLECTING',
        headlightsOn: true,
        shieldActive: false,
        batteryLevel: Math.min(100, 25 + i * 15),
        collectedItems: [...collected],
        logMessage: `⚡ Step ${i}/5: Harvested Energy Cell ${i}! Power +15%`,
        toast: { text: `+XP Energy Cell ${i} ⚡`, type: 'xp' },
      });
    }

    // Final portal dock
    frames.push({
      step: 6,
      roverX: 6,
      roverY: 3,
      status: 'VICTORY',
      headlightsOn: true,
      shieldActive: false,
      batteryLevel: 100,
      collectedItems: [...collected, { x: 6, y: 3 }],
      logMessage: '🌀 Docked at Extraction Teleport Vortex! Loop Lab Mastered!',
      toast: { text: '+30 XP • +₹10 Vault • Loop Navigator Seal 🌀', type: 'vault' },
    });

    return { success: true, frames, stdout };
  }

  return {
    success: false,
    frames: [],
    stdout: ['# Unknown quest ID.'],
  };
}
