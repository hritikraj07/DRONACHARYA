// Dronacharya Structured Python Curriculum (10 Stages, 112 Topics)
// Strict sequence hierarchy: Course -> Stage -> Module -> Lesson -> Activities -> Mastery Assessment -> Mission -> Independent Challenge -> Next Lesson
// Complies with no-random-progression, explicit prerequisite verification, and clear contentStatus flags.

export type ContentStatus = 'available' | 'in_progress' | 'coming_soon';
export type ActivityType =
  | 'predict_output'
  | 'fill_missing_code'
  | 'find_bug'
  | 'write_program'
  | 'trace_variables'
  | 'game_mission'
  | 'transfer_puzzle';

export interface ActivityTestCase {
  inputDescription: string;
  expectedOutput: string;
  codeSnippet: string;
  isHidden?: boolean;
}

export interface Activity {
  id: string;
  lessonId: string;
  sequenceNumber: number;
  activityType: ActivityType;
  learningObjective: string;
  prompt: string;
  instructions: string;
  starterCode?: string;
  expectedOutput?: string;
  testCases?: ActivityTestCase[];
  predictOptions?: { id: string; text: string; isCorrect: boolean }[];
  hints: [string, string, string, string]; // [1. Direction, 2. Focus, 3. Explanation, 4. Guided Correction]
  solution: string;
  explanation: string;
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  requiredConcepts: string[];
  xpReward: number;
}

export interface MasteryAssessment {
  id: string;
  lessonId: string;
  title: string;
  objective: string;
  passThresholdPercent: number; // e.g. 80
  starterCode: string;
  solutionCode: string;
  testCases: ActivityTestCase[];
  transferChallengePrompt: string;
  transferStarterCode: string;
  transferTestCases: ActivityTestCase[];
  xpReward: number;
}

export interface CurriculumTopic {
  id: string;
  sequenceNumber: number; // 1 to 112
  stageId: string;
  stageNumber: number; // 1 to 10
  stageTitle: string;
  moduleId: string;
  moduleTitle: string;
  title: string;
  slug: string;
  description: string;
  learningObjectives: string[];
  prerequisiteLessonIds: string[];
  difficulty: 'Beginner' | 'Intermediate' | 'Advanced';
  estimatedMinutes: number;
  conceptsIntroduced: string[];
  allowedConcepts: string[];
  contentStatus: ContentStatus;
  missionId?: string;
  projectId?: string;
  lessonContent?: {
    storyIntro: string;
    storyIntroHinglish?: string;
    conceptExplanation: string;
    conceptExplanationHinglish?: string;
    analogy: string;
    codeExample: string;
    codeExampleExplanation: string;
    interactiveTryStarter: string;
    tryExplanation: string;
    commonMistakes: string[];
  };
  activities?: Activity[];
  masteryAssessment?: MasteryAssessment;
}

export interface CurriculumStage {
  id: string;
  stageNumber: number;
  title: string;
  tagline: string;
  description: string;
  color: string;
  accentBg: string;
  realmName: string; // Connected to World Map
  projectTitle: string;
  projectDescription: string;
  projectSlug: string;
  totalTopics: number;
  topics: CurriculumTopic[];
}

// -------------------------------------------------------------
// STAGE 1: PYTHON FOUNDATIONS (Topics 1 - 13)
// -------------------------------------------------------------
const STAGE_1_TOPICS: CurriculumTopic[] = [
  {
    id: 'py-topic-1',
    sequenceNumber: 1,
    stageId: 'stage-1',
    stageNumber: 1,
    stageTitle: 'Python Foundations',
    moduleId: 'mod-1-1',
    moduleTitle: 'First Signals & Environment',
    title: 'Introduction to Python and Running Code',
    slug: 'intro-python-running-code',
    description: 'Understand how Python code executes line-by-line in the Digital Gurukul interpreter.',
    learningObjectives: [
      'Understand how high-level Python code translates to machine actions',
      'Learn how the interpreter reads code sequentially from top to bottom',
      'Execute your first command inside the sandboxed environment',
    ],
    prerequisiteLessonIds: [],
    difficulty: 'Beginner',
    estimatedMinutes: 5,
    conceptsIntroduced: ['interpreter', 'sequential_execution', 'script'],
    allowedConcepts: ['interpreter', 'sequential_execution'],
    contentStatus: 'available',
    missionId: 'mission-starter-shrine',
    lessonContent: {
      storyIntro: 'Welcome, young scholar. Inside the Digital Gurukul, ancient computational spirits speak a clean language named Python. Unlike messy low-level machine bits, Python reads like plain English. When you write instructions, the Python Interpreter reads each line sequentially from top to bottom.',
      storyIntroHinglish: 'Digital Gurukul me aapka swagat hai! Python ek high-level programming language hai jo English jaisi aasan lagti hai. Python Interpreter aapke likhe commands ko line-by-line sequentially execute karta hai.',
      conceptExplanation: 'A computer program is just a recipe: a list of instructions followed in exact order. In Python, each line is an instruction. The interpreter begins at line 1, executes it, moves to line 2, and continues until the program terminates.',
      conceptExplanationHinglish: 'Program ek recipe ki tarah hota hai: instructions ka step-by-step order. Python Interpreter pehli line se shuru karta hai aur neeche tak sequentially chalata hai.',
      analogy: 'Imagine reading a sheet of music or a recipe: you cannot jump to step 4 before completing step 1.',
      codeExample: `# Line 1: Python reads this first
print("System Initialized")
# Line 2: Python reads this next
print("Gurukul Terminal Ready")`,
      codeExampleExplanation: 'Python executes line 2 only after line 1 completes.',
      interactiveTryStarter: `print("Initiating Dronacharya Core...")
print("Scholar connection verified.")`,
      tryExplanation: 'Click "Run Example" to see how both lines print sequentially in the console.',
      commonMistakes: [
        'Expecting commands to run out of order: Python ALWAYS runs top to bottom.',
        'Spelling Python commands with capital letters like Print() instead of print().',
      ],
    },
    activities: [
      {
        id: 'act-1-1',
        lessonId: 'py-topic-1',
        sequenceNumber: 1,
        activityType: 'predict_output',
        learningObjective: 'Predict the sequential order of output lines',
        prompt: 'In what exact order will the following program print its output?',
        instructions: 'Read the lines and select the output sequence that reflects top-to-bottom execution.',
        starterCode: `print("Alpha")
print("Beta")
print("Gamma")`,
        predictOptions: [
          { id: 'opt-a', text: 'Gamma, Beta, Alpha', isCorrect: false },
          { id: 'opt-b', text: 'Alpha, Beta, Gamma', isCorrect: true },
          { id: 'opt-c', text: 'All three simultaneously on one line', isCorrect: false },
        ],
        hints: [
          'Direction: Python executes lines sequentially from top to bottom.',
          'Focus: Look at which print statement appears on line 1.',
          'Explanation: Line 1 prints "Alpha", line 2 prints "Beta", line 3 prints "Gamma".',
          'Guided Correction: Select the option that begins with Alpha and ends with Gamma.',
        ],
        solution: 'Alpha, Beta, Gamma',
        explanation: 'Because Python executes sequentially line-by-line, line 1 executes before line 2 and line 3.',
        difficulty: 'beginner',
        requiredConcepts: ['sequential_execution'],
        xpReward: 25,
      },
      {
        id: 'act-1-2',
        lessonId: 'py-topic-1',
        sequenceNumber: 2,
        activityType: 'write_program',
        learningObjective: 'Write two sequential print commands',
        prompt: 'Transmit the startup sequence to the terminal.',
        instructions: 'Write two print statements: First print "System Online", then on the second line print "Ready for Training".',
        starterCode: `# Write two print statements below:
`,
        expectedOutput: 'System Online\nReady for Training',
        testCases: [
          {
            inputDescription: 'Prints System Online on line 1',
            expectedOutput: 'System Online',
            codeSnippet: 'stdout:System Online',
          },
          {
            inputDescription: 'Prints Ready for Training on line 2',
            expectedOutput: 'Ready for Training',
            codeSnippet: 'stdout:Ready for Training',
          },
        ],
        hints: [
          'Direction: Use the print() function on two separate lines.',
          'Focus: Put quotes around the text you want to output.',
          'Explanation: Write print("System Online") on line 1 and print("Ready for Training") on line 2.',
          'Guided Correction: print("System Online")\\nprint("Ready for Training")',
        ],
        solution: `print("System Online")\nprint("Ready for Training")`,
        explanation: 'Each print() statement outputs text and moves the cursor to a new line.',
        difficulty: 'beginner',
        requiredConcepts: ['sequential_execution'],
        xpReward: 35,
      },
    ],
    masteryAssessment: {
      id: 'mast-1',
      lessonId: 'py-topic-1',
      title: 'Mastery Trial: Sequential Transmission',
      objective: 'Demonstrate that you can order print statements to reconstruct an emergency transmission.',
      passThresholdPercent: 80,
      starterCode: `# Transmit 3 lines in order: "Status: OK", "Power: 100", "Mission: Rescue"
print("Status: OK")
`,
      solutionCode: `print("Status: OK")
print("Power: 100")
print("Mission: Rescue")`,
      testCases: [
        {
          inputDescription: 'Reconstructs the 3 status lines',
          expectedOutput: 'Status: OK\nPower: 100\nMission: Rescue',
          codeSnippet: 'stdout:Status: OK',
        },
      ],
      transferChallengePrompt: 'Now output a farewell sequence: "Disconnecting...", followed by "Offline."',
      transferStarterCode: `# Transfer Challenge:
`,
      transferTestCases: [
        {
          inputDescription: 'Outputs Disconnecting... then Offline.',
          expectedOutput: 'Disconnecting...\nOffline.',
          codeSnippet: 'stdout:Disconnecting...',
        },
      ],
      xpReward: 50,
    },
  },
  {
    id: 'py-topic-2',
    sequenceNumber: 2,
    stageId: 'stage-1',
    stageNumber: 1,
    stageTitle: 'Python Foundations',
    moduleId: 'mod-1-1',
    moduleTitle: 'First Signals & Environment',
    title: 'print() and Basic Output',
    slug: 'print-and-basic-output',
    description: 'Learn the syntax of print(), quotes, multiple arguments, and newline behavior.',
    learningObjectives: [
      'Master the syntax of the print() function',
      'Understand single versus double quotes for text literals',
      'Use commas to print multiple items separated by a space',
    ],
    prerequisiteLessonIds: ['py-topic-1'],
    difficulty: 'Beginner',
    estimatedMinutes: 6,
    conceptsIntroduced: ['print_function', 'string_literals', 'multi_args'],
    allowedConcepts: ['sequential_execution', 'print_function', 'string_literals'],
    contentStatus: 'available',
    lessonContent: {
      storyIntro: 'Autonomous Rover Arya is trapped in a dim valley. It needs you to send coordinates and status reports through its console radio. In Python, print() is your loudspeaker.',
      storyIntroHinglish: 'Rover Arya ko console par messages aur status bhejne ke liye hum `print()` function use karte hain.',
      conceptExplanation: '`print()` takes whatever is placed inside its parentheses and sends it to the standard output. When printing text (strings), enclose the text in quotes. You can also print multiple items separated by a comma: `print("Energy:", 100)` will display `Energy: 100`.',
      conceptExplanationHinglish: '`print()` parentheses ke andar jo bhi likha hota hai use screen par print karta hai. Text ko quotes ke andar likhte hain aur commas se multiple items ek sath print kar sakte hain.',
      analogy: 'Think of print() like sending a postcard: the parentheses are the envelope, and the quotes protect your written words.',
      codeExample: `print("Coordinates:", 45, 90)
print('Quotes can be single or double!')`,
      codeExampleExplanation: 'The first line prints three values separated by spaces. The second line shows single quotes work just like double quotes.',
      interactiveTryStarter: `print("Battery Level:", 85)
print("Rover Status:", "Active")`,
      tryExplanation: 'Try modifying the battery number and see the formatted output.',
      commonMistakes: [
        'Mismatched quotes: "Hello\' will cause a SyntaxError.',
        'Forgetting parentheses: print "Hello" is invalid Python 3.',
      ],
    },
    activities: [
      {
        id: 'act-2-1',
        lessonId: 'py-topic-2',
        sequenceNumber: 1,
        activityType: 'find_bug',
        learningObjective: 'Fix syntax error in quotes',
        prompt: 'The transmission failed because of a syntax error. Find and fix it!',
        instructions: 'Fix the closing quote so the string literal matches.',
        starterCode: `print("Beacon Signal Activated')`,
        hints: [
          'Direction: Look at the quotation marks around the string.',
          'Focus: The opening quote is a double quote (").',
          'Explanation: Strings must end with the same type of quote they began with.',
          'Guided Correction: Change the trailing single quote to a double quote.',
        ],
        solution: `print("Beacon Signal Activated")`,
        explanation: 'In Python, string literals must start and end with matching quotation marks.',
        difficulty: 'beginner',
        requiredConcepts: ['string_literals', 'print_function'],
        xpReward: 30,
      },
      {
        id: 'act-2-2',
        lessonId: 'py-topic-2',
        sequenceNumber: 2,
        activityType: 'write_program',
        learningObjective: 'Print multiple values with commas',
        prompt: 'Broadcast the rover beacon info.',
        instructions: 'Use a single print() statement with commas to output: `Beacon: 404 Status: OK`',
        starterCode: `# Print multiple arguments with commas:
`,
        expectedOutput: 'Beacon: 404 Status: OK',
        testCases: [
          {
            inputDescription: 'Prints Beacon: 404 Status: OK',
            expectedOutput: 'Beacon: 404 Status: OK',
            codeSnippet: 'stdout:Beacon: 404 Status: OK',
          },
        ],
        hints: [
          'Direction: Pass each token separated by a comma into print().',
          'Focus: print("Beacon:", 404, "Status:", "OK")',
          'Explanation: Python automatically puts a space between items separated by commas.',
          'Guided Correction: print("Beacon:", 404, "Status:", "OK")',
        ],
        solution: `print("Beacon:", 404, "Status:", "OK")`,
        explanation: 'Commas inside print() separate arguments and display them with space separators.',
        difficulty: 'beginner',
        requiredConcepts: ['multi_args', 'print_function'],
        xpReward: 35,
      },
    ],
  },
  {
    id: 'py-topic-3',
    sequenceNumber: 3,
    stageId: 'stage-1',
    stageNumber: 1,
    stageTitle: 'Python Foundations',
    moduleId: 'mod-1-1',
    moduleTitle: 'First Signals & Environment',
    title: 'Comments and Readable Code',
    slug: 'comments-readable-code',
    description: 'Use single-line (#) and docstrings to document code without affecting execution.',
    learningObjectives: [
      'Learn how the # hash symbol tells Python to ignore a line',
      'Understand why professional engineers write clear comments',
      'Use comments to temporarily disable code during debugging',
    ],
    prerequisiteLessonIds: ['py-topic-2'],
    difficulty: 'Beginner',
    estimatedMinutes: 5,
    conceptsIntroduced: ['comments', 'code_documentation'],
    allowedConcepts: ['sequential_execution', 'print_function', 'comments'],
    contentStatus: 'available',
    lessonContent: {
      storyIntro: 'Ancient scrolls in the Gurukul library contain annotations left by master coders. In Python, programmers leave notes using the `#` symbol. The computer ignores these completely.',
      storyIntroHinglish: 'Python me comments likhne ke liye hum `#` symbol use karte hain. Computer in notes ko completely ignore karta hai.',
      conceptExplanation: 'Any text following a `#` on that line is a comment. Comments do not run, produce zero output, and are used solely to explain WHY something was written to your human teammates.',
      conceptExplanationHinglish: '`#` ke baad likha koi bhi text comment hota hai. Ye program ka output badalta nahi hai, sirf humans ke samajhne ke liye hota hai.',
      analogy: 'Sticky notes on a textbook: they help you understand, but they are not part of the exam text.',
      codeExample: `# Calibrate primary thrust
print("Thrust engaged")  # 50% power`,
      codeExampleExplanation: 'Line 1 is ignored completely. Line 2 prints "Thrust engaged" and ignores the comment after it.',
      interactiveTryStarter: `# This line will NOT print
print("Only this line will print!")
# print("This line is commented out")`,
      tryExplanation: 'Run this code to see that commented lines never appear in the output.',
      commonMistakes: [
        'Writing comments without the `#` symbol: Python will attempt to parse them and throw a SyntaxError.',
      ],
    },
    activities: [
      {
        id: 'act-3-1',
        lessonId: 'py-topic-3',
        sequenceNumber: 1,
        activityType: 'find_bug',
        learningObjective: 'Comment out broken debug statement',
        prompt: 'A broken test line is crashing the rover! Comment it out using `#`.',
        instructions: 'Add `#` at the beginning of the line that calls `BROKEN_COMMAND()` so only the valid print executes.',
        starterCode: `print("Emergency Protocol Online")
BROKEN_COMMAND()`,
        hints: [
          'Direction: Add a # symbol at the very start of line 2.',
          'Focus: # BROKEN_COMMAND()',
          'Explanation: Putting # disables that line from running.',
          'Guided Correction: # BROKEN_COMMAND()',
        ],
        solution: `print("Emergency Protocol Online")\n# BROKEN_COMMAND()`,
        explanation: 'Commenting out broken code prevents the interpreter from executing invalid statements.',
        difficulty: 'beginner',
        requiredConcepts: ['comments'],
        xpReward: 25,
      },
    ],
  },
  {
    id: 'py-topic-4',
    sequenceNumber: 4,
    stageId: 'stage-1',
    stageNumber: 1,
    stageTitle: 'Python Foundations',
    moduleId: 'mod-1-2',
    moduleTitle: 'Data & Variables',
    title: 'Variables and Naming Rules',
    slug: 'variables-and-naming-rules',
    description: 'Store and update values in named memory identifiers following snake_case convention.',
    learningObjectives: [
      'Understand how variables bind names to values in memory',
      'Follow Python snake_case naming rules and reserved keywords',
      'Reassign variable values to track changing state',
    ],
    prerequisiteLessonIds: ['py-topic-2'],
    difficulty: 'Beginner',
    estimatedMinutes: 8,
    conceptsIntroduced: ['variables', 'assignment_operator', 'snake_case', 'state_mutation'],
    allowedConcepts: ['print_function', 'string_literals', 'variables'],
    contentStatus: 'available',
    missionId: 'mission-variable-valley',
    lessonContent: {
      storyIntro: 'Rover Arya cannot remember anything unless we give it named storage boxes. In Python, variables are named labels that point to data stored in computer memory.',
      storyIntroHinglish: 'Variable ek box ya label ki tarah hota hai jisme hum koi value store karte hain aur baad me naam se access karte hain.',
      conceptExplanation: 'To store a value, write the variable name, the assignment operator `=`, and the value: `energy = 100`. Python variable names must start with a letter or underscore, cannot contain spaces, and convention dictates using `snake_case` (all lowercase with underscores).',
      conceptExplanationHinglish: 'Variable banane ke liye `variable_name = value` likhein. Python me naming rule hai `snake_case` use karna jaise `battery_level = 80`.',
      analogy: 'A labeled jar in your kitchen: "sugar", "salt". The label tells you what is inside without checking every time.',
      codeExample: `rover_name = "Arya"
battery = 95
print("Rover:", rover_name)
print("Battery:", battery)

# Reassigning
battery = 80
print("Updated Battery:", battery)`,
      codeExampleExplanation: 'We store "Arya" and 95, print them, and then mutate the battery value to 80.',
      interactiveTryStarter: `rover_speed = 12
print("Current Speed:", rover_speed)
rover_speed = 25
print("Accelerated Speed:", rover_speed)`,
      tryExplanation: 'Notice how the same variable rover_speed changes value over time.',
      commonMistakes: [
        'Starting variable names with numbers like `1rover`: invalid syntax in Python.',
        'Using spaces in variable names like `rover speed = 10`: use `rover_speed = 10`.',
        'Confusing `=` (assignment) with `==` (equality check).',
      ],
    },
    activities: [
      {
        id: 'act-4-1',
        lessonId: 'py-topic-4',
        sequenceNumber: 1,
        activityType: 'write_program',
        learningObjective: 'Declare and print variables',
        prompt: 'Create two variables for the rover.',
        instructions: 'Declare a variable `pilot_name` with value `"Arjun"`, and a variable `power_units` with value `50`. Then print both using `print(pilot_name, power_units)`.',
        starterCode: `# Declare variables and print them:
`,
        expectedOutput: 'Arjun 50',
        testCases: [
          {
            inputDescription: 'Prints Arjun 50 from variables',
            expectedOutput: 'Arjun 50',
            codeSnippet: 'stdout:Arjun 50',
          },
        ],
        hints: [
          'Direction: pilot_name = "Arjun" and power_units = 50.',
          'Focus: Put quotes on "Arjun", but numbers do not need quotes.',
          'Explanation: Type: pilot_name = "Arjun"\\npower_units = 50\\nprint(pilot_name, power_units)',
          'Guided Correction: pilot_name = "Arjun"\\npower_units = 50\\nprint(pilot_name, power_units)',
        ],
        solution: `pilot_name = "Arjun"\npower_units = 50\nprint(pilot_name, power_units)`,
        explanation: 'Variables store values in memory and can be passed into print().',
        difficulty: 'beginner',
        requiredConcepts: ['variables', 'assignment_operator'],
        xpReward: 35,
      },
    ],
  },
  {
    id: 'py-topic-5',
    sequenceNumber: 5,
    stageId: 'stage-1',
    stageNumber: 1,
    stageTitle: 'Python Foundations',
    moduleId: 'mod-1-2',
    moduleTitle: 'Data & Variables',
    title: 'Integers, Floats, Strings, and Booleans',
    slug: 'integers-floats-strings-booleans',
    description: 'Master the four core fundamental scalar data types in Python.',
    learningObjectives: [
      'Distinguish whole integers (int) from decimal floating-point numbers (float)',
      'Recognize text strings (str) and boolean truth values (True / False)',
      'Choose the appropriate data type for different problem requirements',
    ],
    prerequisiteLessonIds: ['py-topic-4'],
    difficulty: 'Beginner',
    estimatedMinutes: 8,
    conceptsIntroduced: ['int', 'float', 'str', 'bool'],
    allowedConcepts: ['variables', 'print_function', 'int', 'float', 'str', 'bool'],
    contentStatus: 'available',
    lessonContent: {
      storyIntro: 'Computers do not treat all data the same. A rover battery percentage has decimals (98.5), fuel cells are counted in whole numbers (4), the rover name is text ("Arya"), and whether shields are active is a binary True or False.',
      storyIntroHinglish: 'Python me 4 basic data types hote hain: int (whole numbers), float (decimals), str (text), aur bool (True ya False).',
      conceptExplanation: '1. `int`: Whole numbers like `42` or `-10`.\n2. `float`: Numbers with decimal points like `3.14` or `98.5`.\n3. `str`: Characters enclosed in quotes like `"Dronacharya"`.\n4. `bool`: Logical values, exactly `True` or `False` (capitalized).',
      conceptExplanationHinglish: '1. `int`: 10, 25, -5 jaise poore number.\n2. `float`: 4.5, 99.9 jaise decimal number.\n3. `str`: "hello" jaise quotes me text.\n4. `bool`: Sirf do values: `True` ya `False`.',
      analogy: 'Different containers in a toolbox: a ruler for decimals, a counter for whole parts, a label for names, and an ON/OFF switch for booleans.',
      codeExample: `rover_id = 7              # int
fuel_level = 88.75        # float
station_name = "Outpost"  # str
shields_up = True         # bool

print(rover_id, fuel_level, station_name, shields_up)`,
      codeExampleExplanation: 'Shows all 4 scalar types assigned to descriptive variable names.',
      interactiveTryStarter: `gold_coins = 150
multiplier = 1.5
player_title = "Knight"
is_alive = True
print(gold_coins, multiplier, player_title, is_alive)`,
      tryExplanation: 'Run to verify all 4 data types print seamlessly.',
      commonMistakes: [
        'Writing boolean values in lowercase: `true` or `false` will cause a NameError in Python. Always use `True` or `False`.',
        'Putting quotes around numbers: `"42"` is a string, not an integer.',
      ],
    },
    activities: [
      {
        id: 'act-5-1',
        lessonId: 'py-topic-5',
        sequenceNumber: 1,
        activityType: 'predict_output',
        learningObjective: 'Identify data types',
        prompt: 'Which of the following values is a `float` in Python?',
        instructions: 'Select the floating-point decimal literal.',
        starterCode: `a = 100\nb = "100.5"\nc = 100.5\nd = True`,
        predictOptions: [
          { id: 'opt-a', text: '100 (variable a)', isCorrect: false },
          { id: 'opt-b', text: '"100.5" (variable b)', isCorrect: false },
          { id: 'opt-c', text: '100.5 (variable c)', isCorrect: true },
          { id: 'opt-d', text: 'True (variable d)', isCorrect: false },
        ],
        hints: [
          'Direction: Floats have decimal points and are NOT surrounded by quotes.',
          'Focus: Look at variable c.',
          'Explanation: "100.5" is in quotes (str), 100 is whole (int), 100.5 is float.',
          'Guided Correction: Variable c is the float.',
        ],
        solution: '100.5 (variable c)',
        explanation: 'In Python, numbers with decimal points without quotes are of type float.',
        difficulty: 'beginner',
        requiredConcepts: ['float', 'data_types'],
        xpReward: 30,
      },
    ],
  },
  {
    id: 'py-topic-6',
    sequenceNumber: 6,
    stageId: 'stage-1',
    stageNumber: 1,
    stageTitle: 'Python Foundations',
    moduleId: 'mod-1-2',
    moduleTitle: 'Data & Variables',
    title: 'The type() Function',
    slug: 'the-type-function',
    description: 'Inspect the runtime data type of any variable or literal using type().',
    learningObjectives: [
      'Call type() to inspect object types at runtime',
      'Understand class outputs: <class int>, <class float>, <class str>, <class bool>',
    ],
    prerequisiteLessonIds: ['py-topic-5'],
    difficulty: 'Beginner',
    estimatedMinutes: 5,
    conceptsIntroduced: ['type_inspection', 'type_function'],
    allowedConcepts: ['variables', 'print_function', 'int', 'float', 'str', 'bool', 'type_function'],
    contentStatus: 'available',
    lessonContent: {
      storyIntro: 'When Rover Arya receives an encrypted packet from deep space, it cannot tell whether it received a number or text. The `type()` sensor scans any piece of data and reveals its classification.',
      storyIntroHinglish: 'Kisi bhi variable ya data ka type jaan-ne ke liye hum `type()` function use karte hain.',
      conceptExplanation: 'Passing a variable or value into `type(x)` returns its data type. When printed, you see `<class \'int\'>`, `<class \'str\'>`, `<class \'float\'>`, or `<class \'bool\'>`.',
      conceptExplanationHinglish: '`type(x)` use karne par Python batata hai ki `x` kis type ka hai, jaise `<class \'int\'>`.',
      analogy: 'A scanner at airport security that identifies if an object is liquid, metal, or paper.',
      codeExample: `score = 500
print(type(score))
ratio = 0.75
print(type(ratio))`,
      codeExampleExplanation: 'Prints <class \'int\'> then <class \'float\'>.',
      interactiveTryStarter: `mystery = "Dronacharya"
print("Type of mystery is:", type(mystery))`,
      tryExplanation: 'Try changing mystery to 42 or True and re-run.',
      commonMistakes: [
        'Calling type without print: `type(x)` inspects the type, but does not print it unless wrapped in `print(type(x))`.',
      ],
    },
    activities: [
      {
        id: 'act-6-1',
        lessonId: 'py-topic-6',
        sequenceNumber: 1,
        activityType: 'write_program',
        learningObjective: 'Print the type of a float',
        prompt: 'Inspect the battery voltage.',
        instructions: 'Create a variable `voltage = 12.6` and print its type using `print(type(voltage))`.',
        starterCode: `# Inspect type of voltage:
`,
        expectedOutput: "<class 'float'>",
        testCases: [
          {
            inputDescription: "Prints <class 'float'>",
            expectedOutput: "<class 'float'>",
            codeSnippet: "stdout:<class 'float'>",
          },
        ],
        hints: [
          'Direction: voltage = 12.6, then print(type(voltage)).',
          'Focus: type(voltage) returns the float class.',
          'Explanation: print(type(voltage)) displays the class.',
          'Guided Correction: voltage = 12.6\\nprint(type(voltage))',
        ],
        solution: `voltage = 12.6\nprint(type(voltage))`,
        explanation: 'Calling print(type(voltage)) outputs <class \'float\'>.',
        difficulty: 'beginner',
        requiredConcepts: ['type_function', 'float'],
        xpReward: 30,
      },
    ],
  },
  {
    id: 'py-topic-7',
    sequenceNumber: 7,
    stageId: 'stage-1',
    stageNumber: 1,
    stageTitle: 'Python Foundations',
    moduleId: 'mod-1-3',
    moduleTitle: 'Input & Conversions',
    title: 'User Input with input()',
    slug: 'user-input-with-input',
    description: 'Capture live text typed by users and store it inside variables.',
    learningObjectives: [
      'Use the input() function to prompt the user and pause execution',
      'Understand that input() ALWAYS returns data as a text string (str)',
    ],
    prerequisiteLessonIds: ['py-topic-5'],
    difficulty: 'Beginner',
    estimatedMinutes: 7,
    conceptsIntroduced: ['input_function', 'user_prompts', 'string_input'],
    allowedConcepts: ['variables', 'print_function', 'str', 'input_function'],
    contentStatus: 'available',
    lessonContent: {
      storyIntro: 'A true Gurukul dialogue goes both ways! Rover Arya does not want to just speak to you; it needs you to type commands back into its cockpit console.',
      storyIntroHinglish: 'User se input lene ke liye hum `input()` function use karte hain. Yaad rakhein ki `input()` hamesha String (text) return karta hai.',
      conceptExplanation: '`input("Prompt text: ")` displays the prompt and halts execution until the user types their response and hits Enter. Whatever they typed is captured as a **string**.',
      conceptExplanationHinglish: '`input("Apna naam likhein: ")` user ko prompt dikhata hai aur user ke type kiye hue text ko string ke roop me return karta hai.',
      analogy: 'A microphone waiting for you to speak: whatever sounds you make are recorded into a audio track.',
      codeExample: `# Simulated user input
user_name = "Scholar"
print("Greetings,", user_name)`,
      codeExampleExplanation: 'Captures user name and greets them.',
      interactiveTryStarter: `player = "Arya"
print("Welcome to Gurukul,", player)`,
      tryExplanation: 'In our sandbox, input simulations provide preset inputs for automated testing.',
      commonMistakes: [
        'Forgetting that input() gives strings: if user types 5, Python stores `"5"`, not the integer `5`.',
      ],
    },
    activities: [
      {
        id: 'act-7-1',
        lessonId: 'py-topic-7',
        sequenceNumber: 1,
        activityType: 'predict_output',
        learningObjective: 'Recognize input return type',
        prompt: 'If a user types `25` into `age = input("Enter age: ")`, what is the data type of `age`?',
        instructions: 'Select the resulting type of input().',
        starterCode: `age = input("Enter age: ") # user types: 25`,
        predictOptions: [
          { id: 'opt-int', text: 'int (integer 25)', isCorrect: false },
          { id: 'opt-str', text: 'str (text string "25")', isCorrect: true },
          { id: 'opt-float', text: 'float (25.0)', isCorrect: false },
        ],
        hints: [
          'Direction: input() always returns text.',
          'Focus: Even if digits are typed, Python wraps them in quotes.',
          'Explanation: input() returns "25", which is a string.',
          'Guided Correction: Select str.',
        ],
        solution: 'str (text string "25")',
        explanation: 'The input() function always returns user input as a string (str).',
        difficulty: 'beginner',
        requiredConcepts: ['input_function', 'string_input'],
        xpReward: 30,
      },
    ],
  },
  {
    id: 'py-topic-8',
    sequenceNumber: 8,
    stageId: 'stage-1',
    stageNumber: 1,
    stageTitle: 'Python Foundations',
    moduleId: 'mod-1-3',
    moduleTitle: 'Input & Conversions',
    title: 'Type Conversion (int, float, str)',
    slug: 'type-conversion',
    description: 'Convert strings to numbers and numbers to strings using int(), float(), and str().',
    learningObjectives: [
      'Convert numeric strings into integers using int()',
      'Convert numbers into floating decimals using float()',
      'Convert numbers to text strings using str() for concatenation',
    ],
    prerequisiteLessonIds: ['py-topic-7'],
    difficulty: 'Beginner',
    estimatedMinutes: 8,
    conceptsIntroduced: ['type_casting', 'int_conversion', 'float_conversion', 'str_conversion'],
    allowedConcepts: ['variables', 'int', 'float', 'str', 'type_casting'],
    contentStatus: 'available',
    lessonContent: {
      storyIntro: 'Because `input()` gives you text `"10"`, you cannot directly add `"10" + 5`—Python will complain with a TypeError. We must use Type Casting to transform text digits into real math numbers.',
      storyIntroHinglish: 'String ko number me badalne ke liye hum `int("10")` ya `float("10.5")` use karte hain. Is process ko Type Casting bolte hain.',
      conceptExplanation: '1. `int("42")` $\\rightarrow$ `42` (converts string to whole integer).\n2. `float("3.14")` $\\rightarrow$ `3.14` (converts string to decimal).\n3. `str(100)` $\\rightarrow$ `"100"` (converts number to string).',
      conceptExplanationHinglish: '`int("25")` string se number banata hai jisse hum math calculation kar sakein.',
      analogy: 'Unpacking an item from a cardboard shipping box so you can actually plug it in and use it.',
      codeExample: `text_num = "50"
real_num = int(text_num)
total = real_num + 20
print("Total Energy:", total)`,
      codeExampleExplanation: 'Converts "50" to integer 50, then adds 20 to get 70.',
      interactiveTryStarter: `raw_val = "100"
converted = int(raw_val)
print("Double is:", converted * 2)`,
      tryExplanation: 'Run to see mathematical multiplication succeed after conversion.',
      commonMistakes: [
        'Trying to convert words: `int("hello")` causes a ValueError.',
        'Trying to convert decimal string with int(): `int("3.14")` fails; use `float("3.14")` first.',
      ],
    },
    activities: [
      {
        id: 'act-8-1',
        lessonId: 'py-topic-8',
        sequenceNumber: 1,
        activityType: 'find_bug',
        learningObjective: 'Fix TypeError by casting string to integer',
        prompt: 'The rover computer crashed because it tried to add a string to a number! Fix it.',
        instructions: 'Wrap `raw_charge` in `int()` so the addition calculates 100 + 25.',
        starterCode: `raw_charge = "100"
total = raw_charge + 25  # Fix this line
print(total)`,
        hints: [
          'Direction: You cannot add string + int directly.',
          'Focus: Use int(raw_charge).',
          'Explanation: total = int(raw_charge) + 25',
          'Guided Correction: Change line 2 to: total = int(raw_charge) + 25',
        ],
        solution: `raw_charge = "100"\ntotal = int(raw_charge) + 25\nprint(total)`,
        explanation: 'Converting raw_charge to an int allows arithmetic addition to yield 125.',
        difficulty: 'beginner',
        requiredConcepts: ['type_casting', 'int_conversion'],
        xpReward: 35,
      },
    ],
  },
  {
    id: 'py-topic-9',
    sequenceNumber: 9,
    stageId: 'stage-1',
    stageNumber: 1,
    stageTitle: 'Python Foundations',
    moduleId: 'mod-1-4',
    moduleTitle: 'Operators & Calculations',
    title: 'Arithmetic Operators (+, -, *, /, //, %, **)',
    slug: 'arithmetic-operators',
    description: 'Perform math calculations: addition, subtraction, division, floor division, modulo, and power.',
    learningObjectives: [
      'Use +, -, *, and / for basic arithmetic',
      'Understand integer floor division // vs regular division /',
      'Use the modulo operator % to find remainders',
      'Use the exponent operator ** for powers',
    ],
    prerequisiteLessonIds: ['py-topic-8'],
    difficulty: 'Beginner',
    estimatedMinutes: 9,
    conceptsIntroduced: ['arithmetic_operators', 'floor_division', 'modulo', 'exponent'],
    allowedConcepts: ['variables', 'int', 'float', 'arithmetic_operators'],
    contentStatus: 'available',
    lessonContent: {
      storyIntro: 'Rover Arya needs to calculate fuel burn rates, battery percentages, and grid coordinates. Python comes with a built-in scientific calculator.',
      storyIntroHinglish: 'Python me calculations ke liye basic operators: `+` (add), `-` (subtract), `*` (multiply), `/` (divide), `//` (floor divide), `%` (remainder/modulo), aur `**` (power) hote hain.',
      conceptExplanation: '`+`, `-`, `*` do what you expect.\n`/` always returns a float (e.g. `7 / 2 = 3.5`).\n`//` chops off the decimal (e.g. `7 // 2 = 3`).\n`%` gives the remainder (e.g. `7 % 2 = 1`).\n`**` raises to a power (e.g. `2 ** 3 = 8`).',
      conceptExplanationHinglish: '`7 / 2` 3.5 deta hai. `7 // 2` sirf 3 deta hai. Aur `7 % 2` bacha hua remainder (1) deta hai.',
      analogy: 'Dividing 7 rotis between 2 scholars: each gets 3 full rotis (//), and 1 roti is left over (%).',
      codeExample: `print("Regular Div:", 7 / 2)   # 3.5
print("Floor Div:", 7 // 2)     # 3
print("Remainder:", 7 % 2)      # 1
print("2 cubed:", 2 ** 3)       # 8`,
      codeExampleExplanation: 'Demonstrates regular float division, floor division, modulo remainder, and power exponent.',
      interactiveTryStarter: `battery = 50
cells_collected = 3 * 15
print("Total Energy:", battery + cells_collected)`,
      tryExplanation: 'Calculates 50 + 45 = 95.',
      commonMistakes: [
        'Dividing by zero: `10 / 0` triggers ZeroDivisionError.',
        'Confusing `^` with `**`: in Python, `^` is bitwise XOR, NOT power! Use `**` for exponents.',
      ],
    },
    activities: [
      {
        id: 'act-9-1',
        lessonId: 'py-topic-9',
        sequenceNumber: 1,
        activityType: 'write_program',
        learningObjective: 'Calculate remainder using modulo',
        prompt: 'Check remaining power cells after packing into bundles of 4.',
        instructions: 'You have 19 power cells. Calculate and print the leftover remainder after dividing by 4 using `%`.',
        starterCode: `cells = 19
# Calculate and print cells % 4
`,
        expectedOutput: '3',
        testCases: [
          {
            inputDescription: 'Calculates 19 % 4 which is 3',
            expectedOutput: '3',
            codeSnippet: 'stdout:3',
          },
        ],
        hints: [
          'Direction: Use the % modulo operator.',
          'Focus: print(cells % 4)',
          'Explanation: 19 = (4 * 4) + 3 remainder.',
          'Guided Correction: print(cells % 4)',
        ],
        solution: `cells = 19\nprint(cells % 4)`,
        explanation: '19 % 4 divides 19 by 4 (which is 4) with a remainder of 3.',
        difficulty: 'beginner',
        requiredConcepts: ['modulo', 'arithmetic_operators'],
        xpReward: 35,
      },
    ],
  },
  {
    id: 'py-topic-10',
    sequenceNumber: 10,
    stageId: 'stage-1',
    stageNumber: 1,
    stageTitle: 'Python Foundations',
    moduleId: 'mod-1-4',
    moduleTitle: 'Operators & Calculations',
    title: 'Comparison Operators (==, !=, <, >, <=, >=)',
    slug: 'comparison-operators',
    description: 'Compare values to produce True or False answers for program decision-making.',
    learningObjectives: [
      'Compare equality using == and inequality using !=',
      'Compare relative magnitude using <, >, <=, >=',
      'Understand that all comparison expressions evaluate to a boolean (True or False)',
    ],
    prerequisiteLessonIds: ['py-topic-9'],
    difficulty: 'Beginner',
    estimatedMinutes: 8,
    conceptsIntroduced: ['comparison_operators', 'equality', 'boolean_evaluation'],
    allowedConcepts: ['variables', 'int', 'float', 'comparison_operators'],
    contentStatus: 'available',
    lessonContent: {
      storyIntro: 'Before Rover Arya can step into a lava canyon, it must ask: "Is my shield greater than 50?" Comparisons are the questions programs ask to make smart decisions.',
      storyIntroHinglish: 'Do values ko compare karne ke liye comparison operators use hote hain: `==` (equal), `!=` (not equal), `<`, `>`, `<=`, `>=`. Inka result hamesha True ya False hota hai.',
      conceptExplanation: 'Comparison operators compare two values and evaluate to `True` or `False`.\n`==`: Are they equal?\n`!=`: Are they NOT equal?\n`>`: Greater than?\n`<`: Less than?\n`>=`: Greater than or equal?\n`<=`: Less than or equal?',
      conceptExplanationHinglish: 'Comparison ka result True ya False hota hai. Yaad rakhein: Single `=` assign karta hai, Double `==` check karta hai.',
      analogy: 'A gatekeeper measuring height at a rollercoaster: "Are you >= 4 feet tall?" Result: Yes (True) or No (False).',
      codeExample: `battery = 75
print("Is battery full?", battery == 100)  # False
print("Is battery safe?", battery >= 50)   # True
print("Is battery not zero?", battery != 0)# True`,
      codeExampleExplanation: 'Evaluates 3 comparison expressions and prints their boolean results.',
      interactiveTryStarter: `fuel = 40
print("Low fuel warning:", fuel < 20)
print("Normal fuel status:", fuel >= 20)`,
      tryExplanation: 'Change fuel to 15 and see the boolean outputs invert.',
      commonMistakes: [
        'Using single `=` instead of double `==`: `if x = 10` is a SyntaxError. Always use `==` for comparison.',
      ],
    },
    activities: [
      {
        id: 'act-10-1',
        lessonId: 'py-topic-10',
        sequenceNumber: 1,
        activityType: 'predict_output',
        learningObjective: 'Evaluate comparison expressions',
        prompt: 'What will `print(15 != 20)` output?',
        instructions: 'Determine the boolean value of the inequality.',
        starterCode: `print(15 != 20)`,
        predictOptions: [
          { id: 'opt-true', text: 'True', isCorrect: true },
          { id: 'opt-false', text: 'False', isCorrect: false },
          { id: 'opt-err', text: 'SyntaxError', isCorrect: false },
        ],
        hints: [
          'Direction: != means "is NOT equal to".',
          'Focus: Is 15 different from 20?',
          'Explanation: Yes, 15 is not equal to 20, so the expression is True.',
          'Guided Correction: Select True.',
        ],
        solution: 'True',
        explanation: 'Because 15 is not equal to 20, the condition 15 != 20 evaluates to True.',
        difficulty: 'beginner',
        requiredConcepts: ['comparison_operators', 'equality'],
        xpReward: 30,
      },
    ],
  },
  {
    id: 'py-topic-11',
    sequenceNumber: 11,
    stageId: 'stage-1',
    stageNumber: 1,
    stageTitle: 'Python Foundations',
    moduleId: 'mod-1-4',
    moduleTitle: 'Operators & Calculations',
    title: 'Logical Operators (and, or, not)',
    slug: 'logical-operators',
    description: 'Combine multiple boolean conditions using and, or, and not.',
    learningObjectives: [
      'Combine conditions with "and" (both must be True)',
      'Combine conditions with "or" (at least one must be True)',
      'Invert conditions with "not" (flips True to False and vice versa)',
    ],
    prerequisiteLessonIds: ['py-topic-10'],
    difficulty: 'Beginner',
    estimatedMinutes: 8,
    conceptsIntroduced: ['logical_operators', 'and_operator', 'or_operator', 'not_operator'],
    allowedConcepts: ['variables', 'comparison_operators', 'logical_operators'],
    contentStatus: 'available',
    lessonContent: {
      storyIntro: 'Arya can only initiate atmospheric entry if BOTH fuel is above 20% AND shields are active. In Python, logical operators glue simple checks into complex mission rules.',
      storyIntroHinglish: 'Multiple conditions ko jodane ke liye hum `and`, `or`, aur `not` use karte hain.',
      conceptExplanation: '1. `and`: Returns `True` only if BOTH sides are `True`.\n2. `or`: Returns `True` if EITHER side is `True`.\n3. `not`: Flips the boolean (`not True` $\\rightarrow$ `False`).',
      conceptExplanationHinglish: '`and` me dono condition sach honi chahiye. `or` me koi ek bhi sach ho to chalta hai. `not` True ko False aur False ko True bana deta hai.',
      analogy: 'Security door: Needs Password AND Fingerprint (both). Emergency exit: Push Bar OR Break Glass (either).',
      codeExample: `battery = 80
has_key = True

can_open = (battery > 20) and has_key
print("Can open door:", can_open)       # True
print("Battery empty?", not (battery > 0)) # False`,
      codeExampleExplanation: 'Demonstrates and with two conditions and not inverting a check.',
      interactiveTryStarter: `shields = 40
has_passcode = False
access = (shields > 50) or has_passcode
print("Access granted:", access)`,
      tryExplanation: 'Run to verify False or False yields False.',
      commonMistakes: [
        'Writing `&&` or `||`: Python uses plain English words `and` and `or`, NOT symbols like C/Java.',
      ],
    },
    activities: [
      {
        id: 'act-11-1',
        lessonId: 'py-topic-11',
        sequenceNumber: 1,
        activityType: 'write_program',
        learningObjective: 'Use and operator',
        prompt: 'Check rover launch criteria.',
        instructions: 'Create `power = 90` and `clear_weather = True`. Print `power > 75 and clear_weather`.',
        starterCode: `# Check launch criteria:
`,
        expectedOutput: 'True',
        testCases: [
          {
            inputDescription: 'Prints True when both conditions match',
            expectedOutput: 'True',
            codeSnippet: 'stdout:True',
          },
        ],
        hints: [
          'Direction: power = 90\\nclear_weather = True',
          'Focus: print(power > 75 and clear_weather)',
          'Explanation: 90 > 75 is True, and clear_weather is True, so result is True.',
          'Guided Correction: power = 90\\nclear_weather = True\\nprint(power > 75 and clear_weather)',
        ],
        solution: `power = 90\nclear_weather = True\nprint(power > 75 and clear_weather)`,
        explanation: 'Both sub-expressions are True, so the and operator evaluates to True.',
        difficulty: 'beginner',
        requiredConcepts: ['logical_operators', 'and_operator'],
        xpReward: 35,
      },
    ],
  },
  {
    id: 'py-topic-12',
    sequenceNumber: 12,
    stageId: 'stage-1',
    stageNumber: 1,
    stageTitle: 'Python Foundations',
    moduleId: 'mod-1-5',
    moduleTitle: 'Text & Formatting',
    title: 'String Indexing and Slicing',
    slug: 'string-indexing-and-slicing',
    description: 'Extract individual characters and substrings using zero-based index and slice [start:stop].',
    learningObjectives: [
      'Access individual characters using 0-based indexing text[0]',
      'Use negative indexing text[-1] to access from the end',
      'Slice substrings using text[start:stop] (stop is exclusive)',
    ],
    prerequisiteLessonIds: ['py-topic-5'],
    difficulty: 'Beginner',
    estimatedMinutes: 8,
    conceptsIntroduced: ['string_indexing', 'zero_based_index', 'string_slicing', 'negative_indexing'],
    allowedConcepts: ['variables', 'str', 'string_indexing', 'string_slicing'],
    contentStatus: 'available',
    lessonContent: {
      storyIntro: 'An incoming distress transmission from deep space is scrambled: `"ERR_GURUKUL_SIGNAL"`. Arya needs to extract just the first letter code or slice out the sector name.',
      storyIntroHinglish: 'Python me text (String) ke har character ka ek number hota hai jise index bolte hain. Indexing 0 se shuru hoti hai. Slicing se hum text ka hissa nikaal sakte hain: `text[start:stop]`.',
      conceptExplanation: 'Strings are sequences of characters numbered starting at 0.\n`word = "PYTHON"`\n`word[0]` is `"P"`, `word[1]` is `"Y"`.\n`word[-1]` is the last character `"N"`.\nSlicing: `word[0:2]` gives `"PY"` (up to, but NOT including index 2).',
      conceptExplanationHinglish: '0-based indexing: pehla character 0 par hota hai. Aakhri character `[-1]` par hota hai. Slicing me `[0:3]` 0, 1, 2 index leta hai.',
      analogy: 'Ruler markings: the distance between tick mark 0 and tick mark 2 spans the first two centimeters.',
      codeExample: `beacon = "GURUKUL"
print("First letter:", beacon[0])   # G
print("Last letter:", beacon[-1])   # L
print("First 4 letters:", beacon[0:4]) # GURU`,
      codeExampleExplanation: 'Extracts single characters and slices substrings.',
      interactiveTryStarter: `code = "ROVER-ARYA"
print("Prefix:", code[0:5])
print("Suffix:", code[6:])`,
      tryExplanation: 'Run to extract "ROVER" and "ARYA" cleanly.',
      commonMistakes: [
        'Forgetting stop is exclusive: `text[0:3]` gives 3 characters (0, 1, 2), NOT index 3.',
        'Index out of range: asking for `text[100]` on a short string causes an IndexError.',
      ],
    },
    activities: [
      {
        id: 'act-12-1',
        lessonId: 'py-topic-12',
        sequenceNumber: 1,
        activityType: 'write_program',
        learningObjective: 'Extract first and last characters',
        prompt: 'Extract security tokens from the distress code.',
        instructions: 'Given `signal = "PHOENIX"`, print the first character `signal[0]` and last character `signal[-1]` separated by a space.',
        starterCode: `signal = "PHOENIX"
# Print first and last characters:
`,
        expectedOutput: 'P X',
        testCases: [
          {
            inputDescription: 'Prints P X',
            expectedOutput: 'P X',
            codeSnippet: 'stdout:P X',
          },
        ],
        hints: [
          'Direction: print(signal[0], signal[-1])',
          'Focus: signal[0] gives "P", signal[-1] gives "X".',
          'Explanation: Commas inside print() will separate them with a space.',
          'Guided Correction: print(signal[0], signal[-1])',
        ],
        solution: `signal = "PHOENIX"\nprint(signal[0], signal[-1])`,
        explanation: 'Index 0 retrieves P, index -1 retrieves X.',
        difficulty: 'beginner',
        requiredConcepts: ['string_indexing', 'negative_indexing'],
        xpReward: 35,
      },
    ],
  },
  {
    id: 'py-topic-13',
    sequenceNumber: 13,
    stageId: 'stage-1',
    stageNumber: 1,
    stageTitle: 'Python Foundations',
    moduleId: 'mod-1-5',
    moduleTitle: 'Text & Formatting',
    title: 'String Methods and f-strings',
    slug: 'string-methods-and-f-strings',
    description: 'Transform strings using .upper(), .lower(), .strip(), and format with modern f-strings.',
    learningObjectives: [
      'Call string transformation methods like .upper(), .lower(), .replace()',
      'Use modern f-strings f"Hello, {name}" for clean variable interpolation',
      'Complete Stage 1 Capstone Project: Character Creator',
    ],
    prerequisiteLessonIds: ['py-topic-12'],
    difficulty: 'Beginner',
    estimatedMinutes: 10,
    conceptsIntroduced: ['string_methods', 'f_strings', 'string_formatting', 'interpolation'],
    allowedConcepts: ['variables', 'str', 'string_methods', 'f_strings'],
    contentStatus: 'available',
    projectId: 'proj-stage-1-character-creator',
    lessonContent: {
      storyIntro: 'Before leaving the Starter Village, Arya must assemble a full Scholar Identity Badge using f-strings and format text cleanly for the digital hall of fame.',
      storyIntroHinglish: 'Modern Python me text format karne ke liye hum `f"Hello, {name}"` (f-string) use karte hain. String methods jaise `.upper()` text ko uppercase bana dete hain.',
      conceptExplanation: '1. Methods are actions attached to strings: `"hello".upper()` $\\rightarrow$ `"HELLO"`.\n2. f-strings: prefix a string with `f` and embed variables inside `{}`: `f"Rover: {name}, Energy: {battery}%"` automatically inserts the variable values.',
      conceptExplanationHinglish: 'f-string likhne ke liye quote se pehle `f` lagate hain aur curly brackets `{variable}` me variable ka naam likhte hain.',
      analogy: 'A customized birthday card where the printer automatically fills in the recipient\'s name into the pre-printed greeting.',
      codeExample: `name = "arya"
level = 10
print(f"Agent {name.upper()} is Level {level}!")`,
      codeExampleExplanation: 'Converts arya to uppercase ARYA and embeds level 10 into the sentence.',
      interactiveTryStarter: `player = "Arjun"
score = 450
print(f"Scholar [{player}] has earned {score} XP!")`,
      tryExplanation: 'Change the score and observe clean, readable formatting.',
      commonMistakes: [
        'Forgetting the `f` prefix before the quotation mark: `"Hello {name}"` prints the literal text `{name}`.',
      ],
    },
    activities: [
      {
        id: 'act-13-1',
        lessonId: 'py-topic-13',
        sequenceNumber: 1,
        activityType: 'write_program',
        learningObjective: 'Format string using an f-string',
        prompt: 'Generate the rover status broadcast using an f-string.',
        instructions: 'Given `rover = "Arya"` and `battery = 98`, print: `Rover Arya is at 98% power.` using an f-string.',
        starterCode: `rover = "Arya"
battery = 98
# Print using an f-string:
`,
        expectedOutput: 'Rover Arya is at 98% power.',
        testCases: [
          {
            inputDescription: 'Prints formatted status message',
            expectedOutput: 'Rover Arya is at 98% power.',
            codeSnippet: 'stdout:Rover Arya is at 98% power.',
          },
        ],
        hints: [
          'Direction: Use f"Rover {rover} is at {battery}% power."',
          'Focus: Put f before the quote and curly braces around variables.',
          'Explanation: print(f"Rover {rover} is at {battery}% power.")',
          'Guided Correction: print(f"Rover {rover} is at {battery}% power.")',
        ],
        solution: `rover = "Arya"\nbattery = 98\nprint(f"Rover {rover} is at {battery}% power.")`,
        explanation: 'f-strings cleanly interpolate variables into the formatted string literal.',
        difficulty: 'beginner',
        requiredConcepts: ['f_strings', 'string_formatting'],
        xpReward: 40,
      },
    ],
    masteryAssessment: {
      id: 'mast-stage-1',
      lessonId: 'py-topic-13',
      title: 'Stage 1 Capstone Project: Character Creator',
      objective: 'Synthesize variables, data types, calculations, and f-strings to generate a full RPG hero profile.',
      passThresholdPercent: 80,
      starterCode: `# Stage 1 Project: Character Creator
name = "Eklavya"
role = "Archer"
hp = 100
attack = 25

# Print formatted character card:
# Line 1: Hero: EKLAVYA [Archer]
# Line 2: HP: 100 | Attack: 25
`,
      solutionCode: `name = "Eklavya"
role = "Archer"
hp = 100
attack = 25

print(f"Hero: {name.upper()} [{role}]")
print(f"HP: {hp} | Attack: {attack}")`,
      testCases: [
        {
          inputDescription: 'Prints Hero: EKLAVYA [Archer]',
          expectedOutput: 'Hero: EKLAVYA [Archer]',
          codeSnippet: 'stdout:Hero: EKLAVYA [Archer]',
        },
        {
          inputDescription: 'Prints HP: 100 | Attack: 25',
          expectedOutput: 'HP: 100 | Attack: 25',
          codeSnippet: 'stdout:HP: 100 | Attack: 25',
        },
      ],
      transferChallengePrompt: 'Now create a second hero named "Bhima" [Warrior] with HP 200 and Attack 40.',
      transferStarterCode: `# Transfer Challenge: Bhima
`,
      transferTestCases: [
        {
          inputDescription: 'Prints Hero: BHIMA [Warrior]',
          expectedOutput: 'Hero: BHIMA [Warrior]',
          codeSnippet: 'stdout:Hero: BHIMA [Warrior]',
        },
      ],
      xpReward: 100,
    },
  },
];

// -------------------------------------------------------------
// STAGE 2: CONDITIONS AND LOOPS (Topics 14 - 25)
// -------------------------------------------------------------
const STAGE_2_TOPICS: CurriculumTopic[] = [
  {
    id: 'py-topic-14',
    sequenceNumber: 14,
    stageId: 'stage-2',
    stageNumber: 2,
    stageTitle: 'Conditions and Loops',
    moduleId: 'mod-2-1',
    moduleTitle: 'Decision Logic',
    title: 'Boolean Expressions',
    slug: 'boolean-expressions',
    description: 'Construct compound truth evaluations that control branching flow.',
    learningObjectives: ['Evaluate boolean expressions', 'Predict truth outcomes under changing state'],
    prerequisiteLessonIds: ['py-topic-10', 'py-topic-11'],
    difficulty: 'Beginner',
    estimatedMinutes: 6,
    conceptsIntroduced: ['compound_booleans', 'truth_tables'],
    allowedConcepts: ['boolean_evaluation', 'comparison_operators', 'logical_operators'],
    contentStatus: 'available',
    lessonContent: {
      storyIntro: 'Entering Decision Forest, the path splits into multiple ravines. Rover Arya must evaluate boolean conditions before committing to a route.',
      storyIntroHinglish: 'Decision Forest me aage badhne se pehle Rover ko check karna hoga ki rasta safe hai ya nahi.',
      conceptExplanation: 'A boolean expression is any piece of code that evaluates to either `True` or `False`. You can combine them using `and`, `or`, and comparison operators.',
      conceptExplanationHinglish: 'Boolean expression hamesha True ya False deta hai.',
      analogy: 'A traffic light sensor: (Cars Waiting AND Green Light) determines whether traffic moves.',
      codeExample: `battery = 50
solar_charging = True
is_safe = (battery > 20) or solar_charging
print("Is safe to explore?", is_safe)`,
      codeExampleExplanation: 'Evaluates composite boolean expression.',
      interactiveTryStarter: `energy = 15
has_shield = False
can_cross_lava = (energy >= 50) and has_shield
print("Can cross lava:", can_cross_lava)`,
      tryExplanation: 'Change energy to 60 and has_shield to True to see it become True.',
      commonMistakes: ['Assuming empty values are True: 0 and empty strings "" are False.'],
    },
    activities: [
      {
        id: 'act-14-1',
        lessonId: 'py-topic-14',
        sequenceNumber: 1,
        activityType: 'predict_output',
        learningObjective: 'Evaluate compound expression',
        prompt: 'What does `print(10 > 5 and not (2 == 3))` evaluate to?',
        instructions: 'Determine final boolean outcome.',
        starterCode: `print(10 > 5 and not (2 == 3))`,
        predictOptions: [
          { id: 'opt-t', text: 'True', isCorrect: true },
          { id: 'opt-f', text: 'False', isCorrect: false },
        ],
        hints: [
          'Direction: 10 > 5 is True.',
          'Focus: 2 == 3 is False, so not (False) is True.',
          'Explanation: True and True evaluates to True.',
          'Guided Correction: Select True.',
        ],
        solution: 'True',
        explanation: 'Both sub-expressions are True, so the conjunction is True.',
        difficulty: 'beginner',
        requiredConcepts: ['compound_booleans'],
        xpReward: 30,
      },
    ],
  },
  {
    id: 'py-topic-15',
    sequenceNumber: 15,
    stageId: 'stage-2',
    stageNumber: 2,
    stageTitle: 'Conditions and Loops',
    moduleId: 'mod-2-1',
    moduleTitle: 'Decision Logic',
    title: 'if Statements and Indentation',
    slug: 'if-statements-indentation',
    description: 'Execute code conditionally based on truth values, using 4-space indentation.',
    learningObjectives: ['Write an if statement with trailing colon', 'Master Python 4-space indentation block rule'],
    prerequisiteLessonIds: ['py-topic-14'],
    difficulty: 'Beginner',
    estimatedMinutes: 8,
    conceptsIntroduced: ['if_statement', 'indentation_blocks', 'colon_syntax'],
    allowedConcepts: ['if_statement', 'indentation_blocks', 'boolean_evaluation'],
    contentStatus: 'available',
    missionId: 'mission-decision-gate',
    lessonContent: {
      storyIntro: 'An automated security gate stands before Arya. If the battery is above 50%, the gate opens. If not, the program simply skips the gate-opening commands.',
      storyIntroHinglish: 'Decision lene ke liye `if` statement use hota hai. Python me indentation (spaces) se pata chalta hai ki kaun sa code if block ke andar hai.',
      conceptExplanation: 'An `if` statement checks a condition followed by a colon `:`. If the condition is `True`, all indented lines beneath it execute. If `False`, Python skips the indented block.',
      conceptExplanationHinglish: 'Agar condition True hai to if ke andar ka indented code chalega, varna skip ho jayega.',
      analogy: 'An umbrella rule: IF it is raining, open the umbrella. Otherwise, keep walking normally.',
      codeExample: `battery = 75
if battery > 50:
    print("Power adequate.")
    print("Gate opening...")
print("Mission proceeding.")`,
      codeExampleExplanation: 'Both indented prints execute because 75 > 50. The unindented print always runs.',
      interactiveTryStarter: `hazard_detected = True
if hazard_detected:
    print("WARNING: Diverting course!")
print("Sensors scanning.")`,
      tryExplanation: 'Change hazard_detected to False and notice the warning disappears.',
      commonMistakes: [
        'Forgetting the colon `:` at the end of the `if condition:` line.',
        'Mixing tabs and spaces or forgetting indentation, causing an IndentationError.',
      ],
    },
    activities: [
      {
        id: 'act-15-1',
        lessonId: 'py-topic-15',
        sequenceNumber: 1,
        activityType: 'write_program',
        learningObjective: 'Write an if statement with indentation',
        prompt: 'Check shield integrity.',
        instructions: 'Given `shield = 30`, write an `if shield < 50:` statement that prints `"Warning: Low Shields"` when true.',
        starterCode: `shield = 30
# Write if statement:
`,
        expectedOutput: 'Warning: Low Shields',
        testCases: [
          {
            inputDescription: 'Prints warning when shield < 50',
            expectedOutput: 'Warning: Low Shields',
            codeSnippet: 'stdout:Warning: Low Shields',
          },
        ],
        hints: [
          'Direction: if shield < 50:',
          'Focus: Indent the print statement by 4 spaces.',
          'Explanation: if shield < 50:\\n    print("Warning: Low Shields")',
          'Guided Correction: if shield < 50:\\n    print("Warning: Low Shields")',
        ],
        solution: `shield = 30\nif shield < 50:\n    print("Warning: Low Shields")`,
        explanation: 'Because shield (30) < 50 is True, the indented print executes.',
        difficulty: 'beginner',
        requiredConcepts: ['if_statement', 'indentation_blocks'],
        xpReward: 35,
      },
    ],
  },
  {
    id: 'py-topic-16',
    sequenceNumber: 16,
    stageId: 'stage-2',
    stageNumber: 2,
    stageTitle: 'Conditions and Loops',
    moduleId: 'mod-2-1',
    moduleTitle: 'Decision Logic',
    title: 'if / else Branching',
    slug: 'if-else-branching',
    description: 'Provide an alternative fallback branch when an if condition evaluates to False.',
    learningObjectives: ['Implement binary branching with if / else', 'Guarantee that exactly one branch executes'],
    prerequisiteLessonIds: ['py-topic-15'],
    difficulty: 'Beginner',
    estimatedMinutes: 7,
    conceptsIntroduced: ['if_else', 'binary_branching', 'fallback_branch'],
    allowedConcepts: ['if_statement', 'if_else'],
    contentStatus: 'available',
    lessonContent: {
      storyIntro: 'At a crossroads, Arya cannot simply do nothing. It must either take the Bridge (if intact) OR divert to the Mountain Pass (else).',
      storyIntroHinglish: 'Jab do raste hon ki agar ye sach hai to ye karo, VARNA (else) wo karo, tab hum `if...else` use karte hain.',
      conceptExplanation: '`else:` runs whenever the preceding `if` condition was `False`. Exactly ONE of the two blocks will execute.',
      conceptExplanationHinglish: 'if aur else me se exactly ek block chalta hai.',
      analogy: 'Coin toss: IF Heads, player 1 goes; ELSE, player 2 goes.',
      codeExample: `bridge_intact = False
if bridge_intact:
    print("Crossing the bridge.")
else:
    print("Bridge broken! Taking mountain detour.")`,
      codeExampleExplanation: 'Because bridge_intact is False, the else block runs.',
      interactiveTryStarter: `battery = 10
if battery >= 20:
    print("Normal drive mode.")
else:
    print("Low power reserve mode active.")`,
      tryExplanation: 'Change battery to 50 and observe the branch switch.',
      commonMistakes: ['Putting a condition on else: `else x > 5:` is a SyntaxError. `else:` takes NO condition.'],
    },
    activities: [
      {
        id: 'act-16-1',
        lessonId: 'py-topic-16',
        sequenceNumber: 1,
        activityType: 'write_program',
        learningObjective: 'Implement if/else branch',
        prompt: 'Check rover clearance.',
        instructions: 'Given `fuel = 8`, if `fuel >= 10` print `"Cleared"`, else print `"Refuel Required"`.',
        starterCode: `fuel = 8
# Write if/else:
`,
        expectedOutput: 'Refuel Required',
        testCases: [
          {
            inputDescription: 'Prints Refuel Required for fuel = 8',
            expectedOutput: 'Refuel Required',
            codeSnippet: 'stdout:Refuel Required',
          },
        ],
        hints: [
          'Direction: if fuel >= 10:\\n    print("Cleared")\\nelse:\\n    print("Refuel Required")',
          'Focus: else must have a colon and no condition.',
          'Explanation: Since 8 is not >= 10, the else branch executes.',
          'Guided Correction: if fuel >= 10:\\n    print("Cleared")\\nelse:\\n    print("Refuel Required")',
        ],
        solution: `fuel = 8\nif fuel >= 10:\n    print("Cleared")\nelse:\n    print("Refuel Required")`,
        explanation: 'Because fuel is 8 (< 10), the else branch runs.',
        difficulty: 'beginner',
        requiredConcepts: ['if_else'],
        xpReward: 35,
      },
    ],
  },
  {
    id: 'py-topic-17',
    sequenceNumber: 17,
    stageId: 'stage-2',
    stageNumber: 2,
    stageTitle: 'Conditions and Loops',
    moduleId: 'mod-2-1',
    moduleTitle: 'Decision Logic',
    title: 'if / elif / else Multi-Way Branching',
    slug: 'if-elif-else-multi-way',
    description: 'Evaluate multiple sequential conditions where only the first true condition executes.',
    learningObjectives: ['Chain multiple conditions with elif (else if)', 'Understand top-down short-circuit evaluation'],
    prerequisiteLessonIds: ['py-topic-16'],
    difficulty: 'Beginner',
    estimatedMinutes: 8,
    conceptsIntroduced: ['elif_chains', 'multi_way_branching', 'short_circuit_selection'],
    allowedConcepts: ['if_statement', 'if_else', 'elif_chains'],
    contentStatus: 'available',
    lessonContent: {
      storyIntro: 'Arya reads battery levels: Above 80 is Green, 40 to 80 is Yellow, below 40 is Red. Two branches are not enough; we need `elif` (else if).',
      storyIntroHinglish: 'Jab do se zyada options check karne hon, hum `if`, `elif`, aur `else` use karte hain.',
      conceptExplanation: 'Python tests each condition in order. As soon as ONE condition is `True`, its block executes and ALL remaining `elif`/`else` branches are skipped.',
      conceptExplanationHinglish: 'Python pehli True condition milte hi use execute karta hai aur baki saare elif/else skip kar deta hai.',
      analogy: 'Exam grading: >= 90 is A, elif >= 80 is B, elif >= 70 is C, else is D.',
      codeExample: `score = 85
if score >= 90:
    print("Rank: Acharya")
elif score >= 75:
    print("Rank: Vidvan")
else:
    print("Rank: Sadhaka")`,
      codeExampleExplanation: 'Because score is 85, it skips the first if, hits score >= 75 (True), prints Vidvan, and skips else.',
      interactiveTryStarter: `dist = 3
if dist <= 1:
    print("Target within melee range!")
elif dist <= 5:
    print("Target within arrow range!")
else:
    print("Target out of range.")`,
      tryExplanation: 'Change dist and test different outcomes.',
      commonMistakes: [
        'Wrong order of conditions: checking `if score >= 50:` before `elif score >= 90:` will capture everything at 50 and never reach 90.',
      ],
    },
    activities: [
      {
        id: 'act-17-1',
        lessonId: 'py-topic-17',
        sequenceNumber: 1,
        activityType: 'write_program',
        learningObjective: 'Implement 3-way elif condition',
        prompt: 'Classify rover battery status.',
        instructions: 'Given `bat = 55`, if `bat > 75` print `"High"`, elif `bat >= 30` print `"Medium"`, else print `"Low"`.',
        starterCode: `bat = 55
# Write if / elif / else:
`,
        expectedOutput: 'Medium',
        testCases: [
          {
            inputDescription: 'Prints Medium for bat = 55',
            expectedOutput: 'Medium',
            codeSnippet: 'stdout:Medium',
          },
        ],
        hints: [
          'Direction: if bat > 75:\\n    print("High")\\nelif bat >= 30:\\n    print("Medium")\\nelse:\\n    print("Low")',
          'Focus: Check >= 30 on the elif line.',
          'Explanation: 55 is not > 75, but is >= 30, so Medium prints.',
          'Guided Correction: if bat > 75:\\n    print("High")\\nelif bat >= 30:\\n    print("Medium")\\nelse:\\n    print("Low")',
        ],
        solution: `bat = 55\nif bat > 75:\n    print("High")\nelif bat >= 30:\n    print("Medium")\nelse:\n    print("Low")`,
        explanation: 'The elif condition evaluates to True and executes.',
        difficulty: 'beginner',
        requiredConcepts: ['elif_chains'],
        xpReward: 35,
      },
    ],
  },
  {
    id: 'py-topic-18',
    sequenceNumber: 18,
    stageId: 'stage-2',
    stageNumber: 2,
    stageTitle: 'Conditions and Loops',
    moduleId: 'mod-2-1',
    moduleTitle: 'Decision Logic',
    title: 'Nested Conditions',
    slug: 'nested-conditions',
    description: 'Place if statements inside other if blocks to create multi-level decision trees.',
    learningObjectives: ['Indent if statements inside other if blocks', 'Trace multi-level decision logic'],
    prerequisiteLessonIds: ['py-topic-17'],
    difficulty: 'Beginner',
    estimatedMinutes: 7,
    conceptsIntroduced: ['nested_if', 'multi_tier_indentation'],
    allowedConcepts: ['if_statement', 'nested_if', 'elif_chains'],
    contentStatus: 'available',
    lessonContent: {
      storyIntro: 'At the dungeon vault door, Arya must first have the Master Key. Only THEN does the scanner check if the vault code matches.',
      storyIntroHinglish: 'Ek if ke andar doosra if likhne ko nested condition bolte hain.',
      conceptExplanation: 'Indenting an `if` statement 4 more spaces inside an outer `if` creates a nested condition that is only tested if the outer condition passes.',
      conceptExplanationHinglish: 'Outer if True hone par hi inner if check hota hai.',
      analogy: 'Unlocking your front door before opening your bedroom closet.',
      codeExample: `has_key = True
pin = 1234
if has_key:
    if pin == 1234:
        print("Vault Unlocked!")`,
      codeExampleExplanation: 'Both levels of check must pass.',
      interactiveTryStarter: `logged_in = True
is_admin = True
if logged_in:
    if is_admin:
        print("Admin console accessible.")`,
      tryExplanation: 'Test turning logged_in to False.',
      commonMistakes: ['Over-nesting when an `and` operator would be cleaner: `if a and b:` is often preferred.'],
    },
    activities: [
      {
        id: 'act-18-1',
        lessonId: 'py-topic-18',
        sequenceNumber: 1,
        activityType: 'predict_output',
        learningObjective: 'Trace nested condition',
        prompt: 'What will print when `power = 100` and `shields = 20`?',
        instructions: 'Follow the indentation levels.',
        starterCode: `power = 100
shields = 20
if power > 50:
    if shields > 50:
        print("Full Defense")
    else:
        print("Power OK, Shields Weak")`,
        predictOptions: [
          { id: 'opt-1', text: 'Full Defense', isCorrect: false },
          { id: 'opt-2', text: 'Power OK, Shields Weak', isCorrect: true },
          { id: 'opt-3', text: 'Nothing prints', isCorrect: false },
        ],
        hints: [
          'Direction: power (100) > 50 is True, so outer if runs.',
          'Focus: shields (20) > 50 is False, so inner else runs.',
          'Explanation: The inner else block prints "Power OK, Shields Weak".',
          'Guided Correction: Select Power OK, Shields Weak.',
        ],
        solution: 'Power OK, Shields Weak',
        explanation: 'Outer check passes, inner check fails and triggers inner else.',
        difficulty: 'beginner',
        requiredConcepts: ['nested_if'],
        xpReward: 30,
      },
    ],
  },
  {
    id: 'py-topic-19',
    sequenceNumber: 19,
    stageId: 'stage-2',
    stageNumber: 2,
    stageTitle: 'Conditions and Loops',
    moduleId: 'mod-2-2',
    moduleTitle: 'Repetition & Loops',
    title: 'for Loops and Iteration',
    slug: 'for-loops-and-iteration',
    description: 'Repeat actions for each item in a collection or sequence without duplicate code.',
    learningObjectives: ['Write a for loop with "for item in sequence:" syntax', 'Understand loop variable binding on each pass'],
    prerequisiteLessonIds: ['py-topic-15'],
    difficulty: 'Beginner',
    estimatedMinutes: 9,
    conceptsIntroduced: ['for_loop', 'iteration', 'loop_variable'],
    allowedConcepts: ['for_loop', 'sequential_execution', 'iteration'],
    contentStatus: 'available',
    missionId: 'mission-rescue-robot',
    lessonContent: {
      storyIntro: 'Stranded rover Arya needs to gather 5 power cells scattered across the grid. Writing `robot.move_forward()` 5 separate times is tedious and error-prone. A `for` loop automates repetition.',
      storyIntroHinglish: 'Kisi bhi kaam ko repeat karne ke liye hum `for` loop use karte hain. Har item ke liye loop ek baar chalta hai.',
      conceptExplanation: 'The syntax `for item in sequence:` tells Python to take each item one by one, assign it to the variable `item`, and execute the indented loop body.',
      conceptExplanationHinglish: '`for step in [1, 2, 3]:` me loop 3 baar chalega aur har baar step ki value badlegi.',
      analogy: 'A conveyor belt: for each package on the belt, the robotic arm puts a stamp on it.',
      codeExample: `for step in [1, 2, 3]:
    print("Taking step number:", step)
print("Journey complete!")`,
      codeExampleExplanation: 'Executes the indented line 3 times, once for each value in the list.',
      interactiveTryStarter: `for cell in [10, 20, 30]:
    print("Absorbed energy cell:", cell)`,
      tryExplanation: 'Run to see the loop body execute for each number in the collection.',
      commonMistakes: [
        'Forgetting the colon at the end of the `for item in sequence:` line.',
        'Not indenting the body of the loop.',
      ],
    },
    activities: [
      {
        id: 'act-19-1',
        lessonId: 'py-topic-19',
        sequenceNumber: 1,
        activityType: 'write_program',
        learningObjective: 'Write a basic for loop',
        prompt: 'Transmit 3 calibration pulses.',
        instructions: 'Write a for loop over `[1, 2, 3]` that prints `Pulse sent!` on each iteration.',
        starterCode: `# Write for loop over [1, 2, 3]:
`,
        expectedOutput: 'Pulse sent!\nPulse sent!\nPulse sent!',
        testCases: [
          {
            inputDescription: 'Prints Pulse sent! three times',
            expectedOutput: 'Pulse sent!\nPulse sent!\nPulse sent!',
            codeSnippet: 'stdout:Pulse sent!',
          },
        ],
        hints: [
          'Direction: for i in [1, 2, 3]:',
          'Focus: print("Pulse sent!") indented inside.',
          'Explanation: for i in [1, 2, 3]:\\n    print("Pulse sent!")',
          'Guided Correction: for i in [1, 2, 3]:\\n    print("Pulse sent!")',
        ],
        solution: `for i in [1, 2, 3]:\n    print("Pulse sent!")`,
        explanation: 'The loop executes its indented block 3 times.',
        difficulty: 'beginner',
        requiredConcepts: ['for_loop'],
        xpReward: 35,
      },
    ],
  },
  {
    id: 'py-topic-20',
    sequenceNumber: 20,
    stageId: 'stage-2',
    stageNumber: 2,
    stageTitle: 'Conditions and Loops',
    moduleId: 'mod-2-2',
    moduleTitle: 'Repetition & Loops',
    title: 'The range() Function',
    slug: 'the-range-function',
    description: 'Generate numeric sequences efficiently with range(stop), range(start, stop), and range(start, stop, step).',
    learningObjectives: [
      'Use range(n) to repeat loops exactly n times (0 to n-1)',
      'Use range(start, stop) with exclusive stop boundary',
      'Use range(start, stop, step) to count by intervals or backwards',
    ],
    prerequisiteLessonIds: ['py-topic-19'],
    difficulty: 'Beginner',
    estimatedMinutes: 8,
    conceptsIntroduced: ['range_function', 'range_bounds', 'step_interval'],
    allowedConcepts: ['for_loop', 'range_function', 'range_bounds'],
    contentStatus: 'available',
    missionId: 'mission-rescue-robot',
    lessonContent: {
      storyIntro: 'What if Arya needs to travel 100 tiles? Typing `[1, 2, 3, ... 100]` manually would take all day! `range(100)` automatically generates that sequence instantly.',
      storyIntroHinglish: 'Loop ko kisi number tak chalane ke liye `range()` use karte hain. `range(5)` 0 se 4 tak 5 numbers generate karta hai.',
      conceptExplanation: '1. `range(5)`: generates `0, 1, 2, 3, 4` (stops before 5).\n2. `range(1, 6)`: generates `1, 2, 3, 4, 5`.\n3. `range(0, 10, 2)`: counts by 2s: `0, 2, 4, 6, 8`.',
      conceptExplanationHinglish: '`range(1, 5)` me aakhri number (5) include nahi hota, sirf 1 se 4 tak chalta hai.',
      analogy: 'An alarm clock timer set to ring every 5 minutes.',
      codeExample: `for count in range(3):
    print("Step:", count)  # Prints 0, 1, 2`,
      codeExampleExplanation: 'range(3) runs 3 times with count starting at 0 and ending at 2.',
      interactiveTryStarter: `for i in range(1, 4):
    print("Tile coordinate:", i)`,
      tryExplanation: 'Notice it prints 1, 2, 3.',
      commonMistakes: [
        'Off-by-one errors: `range(10)` runs 10 times, but the numbers are 0 through 9, not 1 through 10.',
      ],
    },
    activities: [
      {
        id: 'act-20-1',
        lessonId: 'py-topic-20',
        sequenceNumber: 1,
        activityType: 'write_program',
        learningObjective: 'Loop with range',
        prompt: 'Move rover forward 4 times.',
        instructions: 'Use a `for step in range(4):` loop to print `"Move Forward"` 4 times.',
        starterCode: `# Use range(4):
`,
        expectedOutput: 'Move Forward\nMove Forward\nMove Forward\nMove Forward',
        testCases: [
          {
            inputDescription: 'Prints Move Forward 4 times',
            expectedOutput: 'Move Forward\nMove Forward\nMove Forward\nMove Forward',
            codeSnippet: 'stdout:Move Forward',
          },
        ],
        hints: [
          'Direction: for step in range(4):',
          'Focus: Indent print("Move Forward").',
          'Explanation: for step in range(4):\\n    print("Move Forward")',
          'Guided Correction: for step in range(4):\\n    print("Move Forward")',
        ],
        solution: `for step in range(4):\n    print("Move Forward")`,
        explanation: 'range(4) produces 4 iterations: 0, 1, 2, 3.',
        difficulty: 'beginner',
        requiredConcepts: ['range_function', 'for_loop'],
        xpReward: 35,
      },
    ],
  },
  {
    id: 'py-topic-21',
    sequenceNumber: 21,
    stageId: 'stage-2',
    stageNumber: 2,
    stageTitle: 'Conditions and Loops',
    moduleId: 'mod-2-2',
    moduleTitle: 'Repetition & Loops',
    title: 'while Loops and Loop Conditions',
    slug: 'while-loops-and-conditions',
    description: 'Repeat a code block as long as a boolean condition remains True.',
    learningObjectives: ['Implement while loop with loop condition', 'Update loop control variable to prevent infinite loops'],
    prerequisiteLessonIds: ['py-topic-15', 'py-topic-20'],
    difficulty: 'Beginner',
    estimatedMinutes: 8,
    conceptsIntroduced: ['while_loop', 'loop_condition', 'infinite_loop_prevention'],
    allowedConcepts: ['while_loop', 'boolean_evaluation', 'state_mutation'],
    contentStatus: 'available',
    lessonContent: {
      storyIntro: 'A `for` loop runs a fixed number of times. But what if Arya does not know how far the beacon is? A `while` loop runs AS LONG AS the battery has power.',
      storyIntroHinglish: 'Jab hume pehle se na pata ho ki kitni baar chalana hai, tab `while` loop use karte hain. Ye tab tak chalta hai jab tak condition True rahe.',
      conceptExplanation: '`while condition:` tests the condition before each iteration. If `True`, it executes the body and tests again. Make sure something inside the loop changes the condition, or it will run forever (an infinite loop)!',
      conceptExplanationHinglish: 'Har round ke baad condition dobara check hoti hai. Loop ke andar variable ko update karna zaroori hai varna infinite loop ban jayega.',
      analogy: 'Eating dinner: WHILE you are hungry, take another bite. Once full, stop.',
      codeExample: `battery = 3
while battery > 0:
    print(f"Pumping power... {battery} cells left.")
    battery -= 1
print("Battery empty!")`,
      codeExampleExplanation: 'Runs 3 times until battery decrements to 0.',
      interactiveTryStarter: `count = 1
while count <= 3:
    print("Ping:", count)
    count += 1`,
      tryExplanation: 'Run to verify controlled loop termination.',
      commonMistakes: [
        'Forgetting to increment or decrement: `while x > 0:` without changing `x` creates an infinite loop that crashes your browser.',
      ],
    },
    activities: [
      {
        id: 'act-21-1',
        lessonId: 'py-topic-21',
        sequenceNumber: 1,
        activityType: 'find_bug',
        learningObjective: 'Fix infinite loop bug',
        prompt: 'This while loop is stuck in an infinite cycle because countdown is never updated! Fix it.',
        instructions: 'Add `count -= 1` inside the while loop so it terminates.',
        starterCode: `count = 3
while count > 0:
    print(count)
    # Add decrement here:
`,
        expectedOutput: '3\n2\n1',
        testCases: [
          {
            inputDescription: 'Prints 3, 2, 1 and terminates',
            expectedOutput: '3\n2\n1',
            codeSnippet: 'stdout:1',
          },
        ],
        hints: [
          'Direction: Subtract 1 from count on each pass.',
          'Focus: count -= 1',
          'Explanation: Add count -= 1 indented inside the while loop.',
          'Guided Correction: count = 3\\nwhile count > 0:\\n    print(count)\\n    count -= 1',
        ],
        solution: `count = 3\nwhile count > 0:\n    print(count)\n    count -= 1`,
        explanation: 'Decrementing count guarantees the loop condition eventually becomes False.',
        difficulty: 'beginner',
        requiredConcepts: ['while_loop', 'infinite_loop_prevention'],
        xpReward: 35,
      },
    ],
  },
  {
    id: 'py-topic-22',
    sequenceNumber: 22,
    stageId: 'stage-2',
    stageNumber: 2,
    stageTitle: 'Conditions and Loops',
    moduleId: 'mod-2-2',
    moduleTitle: 'Repetition & Loops',
    title: 'break and continue Statements',
    slug: 'break-and-continue',
    description: 'Exit loops early with break or skip the current iteration with continue.',
    learningObjectives: ['Interrupt and exit a loop immediately using break', 'Skip the remainder of an iteration using continue'],
    prerequisiteLessonIds: ['py-topic-21'],
    difficulty: 'Beginner',
    estimatedMinutes: 7,
    conceptsIntroduced: ['break_statement', 'continue_statement', 'loop_control'],
    allowedConcepts: ['for_loop', 'while_loop', 'break_statement', 'continue_statement'],
    contentStatus: 'available',
    lessonContent: {
      storyIntro: 'While scanning energy cells, if Arya discovers an explosive mine, it must immediately abort the scan (`break`). If it finds inert dust, it skips it (`continue`) and checks the next cell.',
      storyIntroHinglish: 'Loop ko beech me hi rokne ke liye `break` use karte hain. Current round ko skip karke agle round par jaane ke liye `continue` use karte hain.',
      conceptExplanation: '`break`: Terminates the entire loop instantly. Execution resumes at the line following the loop.\n`continue`: Skips the rest of the current iteration and jumps directly to the next loop pass.',
      conceptExplanationHinglish: '`break` poora loop khatam karta hai. `continue` sirf us ek round ko skip karta hai.',
      analogy: 'Searching your pocket for keys: once found, STOP searching (break). If you touch a coin, skip it and keep feeling (continue).',
      codeExample: `for num in range(5):
    if num == 3:
        break  # Stops loop at 3
    print(num) # Prints 0, 1, 2`,
      codeExampleExplanation: 'Stops immediately when num reaches 3.',
      interactiveTryStarter: `for i in range(5):
    if i == 2:
        continue  # Skips 2
    print("Num:", i)`,
      tryExplanation: 'Notice number 2 is skipped while 0, 1, 3, 4 print.',
      commonMistakes: ['Placing break or continue outside of a loop: this triggers a SyntaxError.'],
    },
    activities: [
      {
        id: 'act-22-1',
        lessonId: 'py-topic-22',
        sequenceNumber: 1,
        activityType: 'write_program',
        learningObjective: 'Use break to stop at target',
        prompt: 'Search for target code 7.',
        instructions: 'Loop through `[2, 5, 7, 9, 12]`. Print each number. If the number is `7`, print `"Found 7!"` and `break`.',
        starterCode: `numbers = [2, 5, 7, 9, 12]
# Loop and break when 7 is found:
`,
        expectedOutput: '2\n5\n7\nFound 7!',
        testCases: [
          {
            inputDescription: 'Prints numbers up to 7 and breaks',
            expectedOutput: '2\n5\n7\nFound 7!',
            codeSnippet: 'stdout:Found 7!',
          },
        ],
        hints: [
          'Direction: for n in numbers:',
          'Focus: if n == 7: print("Found 7!"); break',
          'Explanation: Print n first, then check if n == 7.',
          'Guided Correction: for n in numbers:\\n    print(n)\\n    if n == 7:\\n        print("Found 7!")\\n        break',
        ],
        solution: `numbers = [2, 5, 7, 9, 12]\nfor n in numbers:\n    print(n)\n    if n == 7:\n        print("Found 7!")\n        break`,
        explanation: 'When 7 is reached, break terminates the loop before 9 or 12 are processed.',
        difficulty: 'beginner',
        requiredConcepts: ['break_statement', 'for_loop'],
        xpReward: 35,
      },
    ],
  },
  {
    id: 'py-topic-23',
    sequenceNumber: 23,
    stageId: 'stage-2',
    stageNumber: 2,
    stageTitle: 'Conditions and Loops',
    moduleId: 'mod-2-3',
    moduleTitle: 'Advanced Looping & Tracing',
    title: 'Nested Loops and 2D Grids',
    slug: 'nested-loops-and-2d-grids',
    description: 'Nest loops to process 2D rows and columns in the robot coordinate grid.',
    learningObjectives: ['Run an inner loop inside an outer loop', 'Traverse row/col coordinates (x, y)'],
    prerequisiteLessonIds: ['py-topic-20'],
    difficulty: 'Intermediate',
    estimatedMinutes: 9,
    conceptsIntroduced: ['nested_loops', 'grid_traversal', 'coordinate_loops'],
    allowedConcepts: ['for_loop', 'range_function', 'nested_loops'],
    contentStatus: 'available',
    missionId: 'mission-rescue-robot',
    lessonContent: {
      storyIntro: 'The facility grid has 3 rows and 3 columns. To scan every tile in the quadrant, Arya runs an outer loop for rows, and for each row, an inner loop across columns.',
      storyIntroHinglish: 'Loop ke andar doosra loop lagane ko nested loop bolte hain. 2D grids (rows aur columns) traverse karne ke liye ye bahut useful hota hai.',
      conceptExplanation: 'For every single turn of the outer loop, the inner loop runs to completion from start to finish.',
      conceptExplanationHinglish: 'Outer loop ke har 1 step ke liye, inner loop poora chalta hai.',
      analogy: 'A clock: For every 1 hour (outer), the minute hand completes 60 minutes (inner).',
      codeExample: `for row in range(2):
    for col in range(2):
        print(f"Tile ({row}, {col})")`,
      codeExampleExplanation: 'Generates (0,0), (0,1), (1,0), (1,1).',
      interactiveTryStarter: `for r in range(2):
    for c in range(3):
        print(f"Scanning [{r},{c}]")`,
      tryExplanation: 'Notice it performs 2 * 3 = 6 scans.',
      commonMistakes: ['Using the same loop variable name for both outer and inner loops (e.g. `for i ... for i ...`). Always use distinct names!'],
    },
    activities: [
      {
        id: 'act-23-1',
        lessonId: 'py-topic-23',
        sequenceNumber: 1,
        activityType: 'write_program',
        learningObjective: 'Traverse 2x2 grid',
        prompt: 'Scan a 2x2 grid.',
        instructions: 'Use nested loops over `range(2)` for `x` and `y` to print `(x, y)` coordinates.',
        starterCode: `# Nested loop for 2x2 grid:
`,
        expectedOutput: '0 0\n0 1\n1 0\n1 1',
        testCases: [
          {
            inputDescription: 'Prints 0 0, 0 1, 1 0, 1 1',
            expectedOutput: '0 0\n0 1\n1 0\n1 1',
            codeSnippet: 'stdout:1 1',
          },
        ],
        hints: [
          'Direction: for x in range(2):\\n    for y in range(2):',
          'Focus: print(x, y)',
          'Explanation: for x in range(2):\\n    for y in range(2):\\n        print(x, y)',
          'Guided Correction: for x in range(2):\\n    for y in range(2):\\n        print(x, y)',
        ],
        solution: `for x in range(2):\n    for y in range(2):\n        print(x, y)`,
        explanation: 'Inner loop executes 2 times for each of the 2 outer loop passes.',
        difficulty: 'intermediate',
        requiredConcepts: ['nested_loops'],
        xpReward: 35,
      },
    ],
  },
  {
    id: 'py-topic-24',
    sequenceNumber: 24,
    stageId: 'stage-2',
    stageNumber: 2,
    stageTitle: 'Conditions and Loops',
    moduleId: 'mod-2-3',
    moduleTitle: 'Advanced Looping & Tracing',
    title: 'Loop Tracing and State Accumulation',
    slug: 'loop-tracing-and-accumulation',
    description: 'Trace changing variable states through successive loop cycles using accumulator patterns.',
    learningObjectives: ['Trace loop variables step-by-step on paper or mental model', 'Use running total accumulator pattern (total += x)'],
    prerequisiteLessonIds: ['py-topic-20', 'py-topic-21'],
    difficulty: 'Intermediate',
    estimatedMinutes: 8,
    conceptsIntroduced: ['loop_tracing', 'accumulator_pattern', 'running_total'],
    allowedConcepts: ['for_loop', 'variables', 'arithmetic_operators', 'accumulator_pattern'],
    contentStatus: 'available',
    lessonContent: {
      storyIntro: 'To restore power to Arya, we must sum up all collected energy values. An accumulator starts at 0 and adds each cell\'s value one by one.',
      storyIntroHinglish: 'Loop ke sath running total nikalne ke pattern ko accumulator pattern bolte hain: `total = 0`, fir `total += value`.',
      conceptExplanation: 'Initialize `total = 0` before the loop. Inside the loop, write `total += item`. After the loop finishes, `total` holds the accumulated sum.',
      conceptExplanationHinglish: 'Loop se pehle total = 0 rakhein, loop ke andar add karein.',
      analogy: 'A piggy bank: start with 0 coins, drop in a coin each day, then count the total at the end.',
      codeExample: `total_energy = 0
for cell in [10, 20, 30]:
    total_energy += cell
print("Total Energy:", total_energy) # 60`,
      codeExampleExplanation: '0 + 10 = 10, 10 + 20 = 30, 30 + 30 = 60.',
      interactiveTryStarter: `sum_val = 0
for n in [5, 15, 25]:
    sum_val += n
print("Final Sum:", sum_val)`,
      tryExplanation: 'Calculates 5 + 15 + 25 = 45.',
      commonMistakes: [
        'Placing `total = 0` INSIDE the loop: this resets total back to 0 on every turn!',
      ],
    },
    activities: [
      {
        id: 'act-24-1',
        lessonId: 'py-topic-24',
        sequenceNumber: 1,
        activityType: 'write_program',
        learningObjective: 'Accumulate sum in a loop',
        prompt: 'Calculate total rover shield power.',
        instructions: 'Given `boosts = [10, 20, 15]`, compute the sum in `total_shields` using a loop and print it.',
        starterCode: `boosts = [10, 20, 15]
total_shields = 0
# Accumulate and print total_shields:
`,
        expectedOutput: '45',
        testCases: [
          {
            inputDescription: 'Calculates 10 + 20 + 15 = 45',
            expectedOutput: '45',
            codeSnippet: 'stdout:45',
          },
        ],
        hints: [
          'Direction: for b in boosts: total_shields += b',
          'Focus: Print total_shields outside the loop.',
          'Explanation: for b in boosts:\\n    total_shields += b\\nprint(total_shields)',
          'Guided Correction: for b in boosts:\\n    total_shields += b\\nprint(total_shields)',
        ],
        solution: `boosts = [10, 20, 15]\ntotal_shields = 0\nfor b in boosts:\n    total_shields += b\nprint(total_shields)`,
        explanation: 'Accumulates each boost into total_shields giving 45.',
        difficulty: 'intermediate',
        requiredConcepts: ['accumulator_pattern'],
        xpReward: 35,
      },
    ],
  },
  {
    id: 'py-topic-25',
    sequenceNumber: 25,
    stageId: 'stage-2',
    stageNumber: 2,
    stageTitle: 'Conditions and Loops',
    moduleId: 'mod-2-3',
    moduleTitle: 'Advanced Looping & Tracing',
    title: 'Infinite Loops and Off-by-One Errors',
    slug: 'infinite-loops-and-off-by-one',
    description: 'Diagnose and fix the two most notorious loop bugs: infinite cycles and boundary off-by-one errors.',
    learningObjectives: ['Detect why a loop never terminates', 'Correct boundary conditions to avoid off-by-one misses'],
    prerequisiteLessonIds: ['py-topic-24'],
    difficulty: 'Intermediate',
    estimatedMinutes: 9,
    conceptsIntroduced: ['off_by_one', 'infinite_loops', 'boundary_debugging'],
    allowedConcepts: ['for_loop', 'while_loop', 'range_bounds', 'boundary_debugging'],
    contentStatus: 'available',
    projectId: 'proj-stage-2-robot-navigator',
    lessonContent: {
      storyIntro: 'The final trial of the Loop Lab requires debugging. An apprentice coded a rover that either walks off the edge of the world or loops forever in circles.',
      storyIntroHinglish: 'Loop me do sabse common bugs hote hain: Off-by-one error (1 kam ya 1 zyada chalna) aur Infinite loop (kabhi na rukna).',
      conceptExplanation: '1. Off-by-one: `range(5)` gives 0 to 4. If you needed 1 to 5, use `range(1, 6)`.\n2. Infinite loop: Ensure `while` conditions change towards False.',
      conceptExplanationHinglish: 'range(1, 6) se 1 se 5 tak chalta hai.',
      analogy: 'Fence post problem: To build a 10-meter fence with posts every 1 meter, you need 11 posts, not 10.',
      codeExample: `# Correct range for 1 to 5 inclusive:
for num in range(1, 6):
    print(num)  # 1, 2, 3, 4, 5`,
      codeExampleExplanation: 'Stop value 6 ensures 5 is included.',
      interactiveTryStarter: `val = 1
while val < 4:
    print("Valid pass:", val)
    val += 1`,
      tryExplanation: 'Terminates cleanly at 4.',
      commonMistakes: ['Using `range(len(items) + 1)` which causes an IndexError.'],
    },
    activities: [
      {
        id: 'act-25-1',
        lessonId: 'py-topic-25',
        sequenceNumber: 1,
        activityType: 'find_bug',
        learningObjective: 'Fix off-by-one range error',
        prompt: 'The mission requires visiting all 5 checkpoints labeled 1 to 5. But the loop only reaches 4! Fix it.',
        instructions: 'Change `range(1, 5)` to `range(1, 6)` so checkpoint 5 is reached.',
        starterCode: `# Fix the off-by-one boundary:
for checkpoint in range(1, 5):
    print("Checkpoint", checkpoint)
`,
        expectedOutput: 'Checkpoint 1\nCheckpoint 2\nCheckpoint 3\nCheckpoint 4\nCheckpoint 5',
        testCases: [
          {
            inputDescription: 'Visits Checkpoint 1 through 5',
            expectedOutput: 'Checkpoint 1\nCheckpoint 2\nCheckpoint 3\nCheckpoint 4\nCheckpoint 5',
            codeSnippet: 'stdout:Checkpoint 5',
          },
        ],
        hints: [
          'Direction: range(start, stop) excludes stop.',
          'Focus: Change 5 to 6 in range(1, 5).',
          'Explanation: for checkpoint in range(1, 6):',
          'Guided Correction: for checkpoint in range(1, 6):\\n    print("Checkpoint", checkpoint)',
        ],
        solution: `for checkpoint in range(1, 6):\n    print("Checkpoint", checkpoint)`,
        explanation: 'range(1, 6) includes 1 through 5.',
        difficulty: 'intermediate',
        requiredConcepts: ['off_by_one', 'range_bounds'],
        xpReward: 35,
      },
    ],
    masteryAssessment: {
      id: 'mast-stage-2',
      lessonId: 'py-topic-25',
      title: 'Stage 2 Capstone: Robot Grid Navigator',
      objective: 'Combine loops, conditions, and accumulator tracking to navigate through an obstacle corridor.',
      passThresholdPercent: 80,
      starterCode: `# Stage 2 Project: Robot Grid Navigator
# Steps: for step in range(1, 6):
# If step is 3, print: "Obstacle avoided at step 3"
# Else print: f"Step {step} completed"
`,
      solutionCode: `for step in range(1, 6):
    if step == 3:
        print("Obstacle avoided at step 3")
    else:
        print(f"Step {step} completed")`,
      testCases: [
        {
          inputDescription: 'Navigates 5 steps avoiding obstacle at 3',
          expectedOutput: 'Step 1 completed\nStep 2 completed\nObstacle avoided at step 3\nStep 4 completed\nStep 5 completed',
          codeSnippet: 'stdout:Obstacle avoided at step 3',
        },
      ],
      transferChallengePrompt: 'Modify the loop to avoid obstacles at BOTH step 2 AND step 4.',
      transferStarterCode: `# Transfer Challenge: Double Obstacle
`,
      transferTestCases: [
        {
          inputDescription: 'Avoids obstacles at 2 and 4',
          expectedOutput: 'Step 1 completed\nObstacle avoided at step 2\nStep 3 completed\nObstacle avoided at step 4\nStep 5 completed',
          codeSnippet: 'stdout:Obstacle avoided at step 4',
        },
      ],
      xpReward: 120,
    },
  },
];

// Helper to generate coming_soon structured metadata for stages 3 through 10
function createUpcomingTopic(
  seq: number,
  stageNum: number,
  stageTitle: string,
  modId: string,
  modTitle: string,
  title: string,
  slug: string,
  desc: string,
  prereqs: string[],
  diff: 'Beginner' | 'Intermediate' | 'Advanced',
  mins: number,
  concepts: string[],
  projId?: string
): CurriculumTopic {
  return {
    id: `py-topic-${seq}`,
    sequenceNumber: seq,
    stageId: `stage-${stageNum}`,
    stageNumber: stageNum,
    stageTitle,
    moduleId: modId,
    moduleTitle: modTitle,
    title,
    slug,
    description: desc,
    learningObjectives: [
      `Understand theoretical foundations of ${title}`,
      `Identify practical industry use-cases and syntax patterns`,
      `Fulfill prerequisite requirements before advanced project work`,
    ],
    prerequisiteLessonIds: prereqs,
    difficulty: diff,
    estimatedMinutes: mins,
    conceptsIntroduced: concepts,
    allowedConcepts: concepts,
    contentStatus: 'coming_soon',
    projectId: projId,
  };
}

// -------------------------------------------------------------
// STAGES 3 - 10 METADATA (Topics 26 - 112)
// -------------------------------------------------------------
const STAGE_3_TOPICS: CurriculumTopic[] = [
  createUpcomingTopic(26, 3, 'Data Structures', 'mod-3-1', 'Lists & Sequences', 'Lists', 'lists', 'Create and initialize mutable list sequences.', ['py-topic-25'], 'Intermediate', 10, ['lists', 'mutability']),
  createUpcomingTopic(27, 3, 'Data Structures', 'mod-3-1', 'Lists & Sequences', 'Indexing and Slicing Lists', 'indexing-slicing-lists', 'Access elements and slice sublists using zero-based indices.', ['py-topic-26'], 'Intermediate', 10, ['list_indexing', 'list_slicing']),
  createUpcomingTopic(28, 3, 'Data Structures', 'mod-3-1', 'Lists & Sequences', 'List Methods (.append, .pop, .insert)', 'list-methods', 'Mutate collections using standard list methods.', ['py-topic-27'], 'Intermediate', 12, ['list_methods', 'append', 'pop']),
  createUpcomingTopic(29, 3, 'Data Structures', 'mod-3-1', 'Lists & Sequences', 'Iterating Through Lists', 'iterating-through-lists', 'Iterate through lists with for-loops and enumerate().', ['py-topic-28'], 'Intermediate', 10, ['list_iteration', 'enumerate']),
  createUpcomingTopic(30, 3, 'Data Structures', 'mod-3-2', 'Tuples & Sets', 'Tuples', 'tuples', 'Store immutable ordered sequences using tuples.', ['py-topic-29'], 'Intermediate', 10, ['tuples', 'immutability']),
  createUpcomingTopic(31, 3, 'Data Structures', 'mod-3-2', 'Tuples & Sets', 'Sets', 'sets', 'Store unique unordered elements and perform set algebra.', ['py-topic-30'], 'Intermediate', 10, ['sets', 'uniqueness', 'set_operations']),
  createUpcomingTopic(32, 3, 'Data Structures', 'mod-3-3', 'Dictionaries', 'Dictionaries', 'dictionaries', 'Store key-value associative mappings.', ['py-topic-31'], 'Intermediate', 12, ['dict', 'key_value_pairs']),
  createUpcomingTopic(33, 3, 'Data Structures', 'mod-3-3', 'Dictionaries', 'Dictionary Methods (.keys, .values, .items)', 'dictionary-methods', 'Traverse keys, values, and items in dictionaries.', ['py-topic-32'], 'Intermediate', 10, ['dict_methods', 'items']),
  createUpcomingTopic(34, 3, 'Data Structures', 'mod-3-4', 'Comprehensions', 'Nested Data Structures', 'nested-data-structures', 'Model complex real-world data with lists of dicts.', ['py-topic-33'], 'Intermediate', 12, ['nested_structures']),
  createUpcomingTopic(35, 3, 'Data Structures', 'mod-3-4', 'Comprehensions', 'List Comprehensions', 'list-comprehensions', 'Construct elegant one-line filtered and mapped lists.', ['py-topic-34'], 'Intermediate', 12, ['list_comprehensions']),
  createUpcomingTopic(36, 3, 'Data Structures', 'mod-3-4', 'Comprehensions', 'Set and Dictionary Comprehensions', 'set-dict-comprehensions', 'Transform dictionaries and sets using comprehension syntax.', ['py-topic-35'], 'Intermediate', 12, ['dict_comprehensions'], 'proj-stage-3-inventory-leaderboard'),
];

const STAGE_4_TOPICS: CurriculumTopic[] = [
  createUpcomingTopic(37, 4, 'Functions and Problem Solving', 'mod-4-1', 'Function Basics', 'Defining and Calling Functions', 'defining-calling-functions', 'Encapsulate reusable logic with def.', ['py-topic-36'], 'Intermediate', 12, ['def_statement', 'function_calls']),
  createUpcomingTopic(38, 4, 'Functions and Problem Solving', 'mod-4-1', 'Function Basics', 'Parameters and Arguments', 'parameters-and-arguments', 'Pass data into functions via parameters.', ['py-topic-37'], 'Intermediate', 10, ['parameters', 'arguments']),
  createUpcomingTopic(39, 4, 'Functions and Problem Solving', 'mod-4-1', 'Function Basics', 'Return Values', 'return-values', 'Return computed values to callers using return.', ['py-topic-38'], 'Intermediate', 10, ['return_statement']),
  createUpcomingTopic(40, 4, 'Functions and Problem Solving', 'mod-4-2', 'Advanced Functions', 'Default and Keyword Arguments', 'default-keyword-arguments', 'Configure flexible parameter defaults.', ['py-topic-39'], 'Intermediate', 10, ['default_args', 'kwargs']),
  createUpcomingTopic(41, 4, 'Functions and Problem Solving', 'mod-4-2', 'Advanced Functions', 'Variable Scope (Local vs Global)', 'variable-scope', 'Understand LEGB variable resolution rules.', ['py-topic-40'], 'Intermediate', 10, ['scope', 'local_global']),
  createUpcomingTopic(42, 4, 'Functions and Problem Solving', 'mod-4-2', 'Advanced Functions', 'Recursion', 'recursion', 'Solve self-similar subproblems with base cases.', ['py-topic-41'], 'Intermediate', 15, ['recursion', 'base_case']),
  createUpcomingTopic(43, 4, 'Functions and Problem Solving', 'mod-4-3', 'Functional Tools', 'Lambda Functions', 'lambda-functions', 'Create anonymous one-line inline functions.', ['py-topic-42'], 'Intermediate', 10, ['lambda']),
  createUpcomingTopic(44, 4, 'Functions and Problem Solving', 'mod-4-3', 'Functional Tools', 'map(), filter(), and zip()', 'map-filter-zip', 'Process iterables functionally with builtins.', ['py-topic-43'], 'Intermediate', 12, ['map', 'filter', 'zip']),
  createUpcomingTopic(45, 4, 'Functions and Problem Solving', 'mod-4-4', 'Algorithms', 'Searching and Sorting', 'searching-and-sorting', 'Linear search, binary search, and sorted().', ['py-topic-44'], 'Intermediate', 15, ['searching', 'sorting']),
  createUpcomingTopic(46, 4, 'Functions and Problem Solving', 'mod-4-4', 'Algorithms', 'Frequency Counting and Hash Maps', 'frequency-counting-hash-maps', 'Count occurrences efficiently with dict and Counter.', ['py-topic-45'], 'Intermediate', 12, ['frequency_counter']),
  createUpcomingTopic(47, 4, 'Functions and Problem Solving', 'mod-4-4', 'Algorithms', 'Introduction to Big O Notation', 'introduction-to-big-o', 'Analyze time and space complexity of algorithms.', ['py-topic-46'], 'Intermediate', 15, ['big_o', 'complexity'], 'proj-stage-4-mini-game-engine'),
];

const STAGE_5_TOPICS: CurriculumTopic[] = [
  createUpcomingTopic(48, 5, 'Errors, Files, and Modules', 'mod-5-1', 'Exception Handling', 'Syntax, Runtime, and Logic Errors', 'syntax-runtime-logic-errors', 'Categorize and diagnose bugs.', ['py-topic-47'], 'Intermediate', 10, ['error_types']),
  createUpcomingTopic(49, 5, 'Errors, Files, and Modules', 'mod-5-1', 'Exception Handling', 'Reading Tracebacks', 'reading-tracebacks', 'Read stack traces to pinpoint error line numbers.', ['py-topic-48'], 'Intermediate', 10, ['tracebacks']),
  createUpcomingTopic(50, 5, 'Errors, Files, and Modules', 'mod-5-1', 'Exception Handling', 'try, except, else, and finally', 'try-except-else-finally', 'Safely handle exceptions without crashing.', ['py-topic-49'], 'Intermediate', 12, ['try_except']),
  createUpcomingTopic(51, 5, 'Errors, Files, and Modules', 'mod-5-1', 'Exception Handling', 'Raising Exceptions', 'raising-exceptions', 'Enforce invariants with raise and custom errors.', ['py-topic-50'], 'Intermediate', 10, ['raise_exception']),
  createUpcomingTopic(52, 5, 'Errors, Files, and Modules', 'mod-5-2', 'File I/O', 'Reading and Writing Files', 'reading-and-writing-files', 'Persist data to disk with open(), read(), write().', ['py-topic-51'], 'Intermediate', 12, ['file_io']),
  createUpcomingTopic(53, 5, 'Errors, Files, and Modules', 'mod-5-2', 'File I/O', 'Context Managers and with', 'context-managers-and-with', 'Safely manage file handles and auto-closing.', ['py-topic-52'], 'Intermediate', 10, ['with_statement']),
  createUpcomingTopic(54, 5, 'Errors, Files, and Modules', 'mod-5-3', 'Modules & Formats', 'Modules and Imports', 'modules-and-imports', 'Organize code across multiple .py files.', ['py-topic-53'], 'Intermediate', 12, ['imports', 'modules']),
  createUpcomingTopic(55, 5, 'Errors, Files, and Modules', 'mod-5-3', 'Modules & Formats', 'Packages and Project Organization', 'packages-project-org', 'Structure directories with __init__.py.', ['py-topic-54'], 'Intermediate', 12, ['packages']),
  createUpcomingTopic(56, 5, 'Errors, Files, and Modules', 'mod-5-3', 'Modules & Formats', 'JSON and CSV Data Handling', 'json-and-csv', 'Serialize and parse structured data.', ['py-topic-55'], 'Intermediate', 12, ['json_parsing', 'csv']),
  createUpcomingTopic(57, 5, 'Errors, Files, and Modules', 'mod-5-3', 'Modules & Formats', 'Debugging and Logging', 'debugging-and-logging', 'Use logging instead of ad-hoc print statements.', ['py-topic-56'], 'Intermediate', 12, ['logging'], 'proj-stage-5-saved-progress-adventure'),
];

const STAGE_6_TOPICS: CurriculumTopic[] = [
  createUpcomingTopic(58, 6, 'Object-Oriented Programming', 'mod-6-1', 'OOP Foundations', 'Classes and Objects', 'classes-and-objects', 'Define classes as blueprints for objects.', ['py-topic-57'], 'Intermediate', 12, ['classes', 'objects']),
  createUpcomingTopic(59, 6, 'Object-Oriented Programming', 'mod-6-1', 'OOP Foundations', 'self and __init__()', 'self-and-init', 'Initialize instance state with __init__.', ['py-topic-58'], 'Intermediate', 12, ['init_method', 'self_binding']),
  createUpcomingTopic(60, 6, 'Object-Oriented Programming', 'mod-6-1', 'OOP Foundations', 'Attributes and Methods', 'attributes-and-methods', 'Define instance methods and access data attributes.', ['py-topic-59'], 'Intermediate', 12, ['methods', 'attributes']),
  createUpcomingTopic(61, 6, 'Object-Oriented Programming', 'mod-6-2', 'Encapsulation & Inheritance', 'Encapsulation and Properties', 'encapsulation-and-properties', 'Protect internal state with @property.', ['py-topic-60'], 'Intermediate', 15, ['encapsulation', 'properties']),
  createUpcomingTopic(62, 6, 'Object-Oriented Programming', 'mod-6-2', 'Encapsulation & Inheritance', 'Inheritance', 'inheritance', 'Reuse and extend classes with subclassing.', ['py-topic-61'], 'Intermediate', 15, ['inheritance', 'super']),
  createUpcomingTopic(63, 6, 'Object-Oriented Programming', 'mod-6-2', 'Encapsulation & Inheritance', 'Polymorphism', 'polymorphism', 'Override methods across uniform interfaces.', ['py-topic-62'], 'Intermediate', 12, ['polymorphism']),
  createUpcomingTopic(64, 6, 'Object-Oriented Programming', 'mod-6-3', 'Advanced OOP', 'Composition', 'composition', 'Favor composition over inheritance for flexible models.', ['py-topic-63'], 'Intermediate', 12, ['composition']),
  createUpcomingTopic(65, 6, 'Object-Oriented Programming', 'mod-6-3', 'Advanced OOP', 'Special Methods (__str__, __len__, __repr__)', 'special-dunder-methods', 'Customize operators and string representations.', ['py-topic-64'], 'Intermediate', 15, ['dunder_methods']),
  createUpcomingTopic(66, 6, 'Object-Oriented Programming', 'mod-6-3', 'Advanced OOP', 'Dataclasses', 'dataclasses', 'Generate clean data containers with @dataclass.', ['py-topic-65'], 'Intermediate', 12, ['dataclasses'], 'proj-stage-6-robot-simulator'),
];

const STAGE_7_TOPICS: CurriculumTopic[] = [
  createUpcomingTopic(67, 7, 'Intermediate and Advanced Python', 'mod-7-1', 'Protocols & Iteration', 'Iterables and Iterators', 'iterables-and-iterators', 'Understand __iter__ and __next__ protocols.', ['py-topic-66'], 'Advanced', 15, ['iterators']),
  createUpcomingTopic(68, 7, 'Intermediate and Advanced Python', 'mod-7-1', 'Protocols & Iteration', 'Generators and yield', 'generators-and-yield', 'Stream large datasets with memory efficiency.', ['py-topic-67'], 'Advanced', 15, ['generators', 'yield']),
  createUpcomingTopic(69, 7, 'Intermediate and Advanced Python', 'mod-7-2', 'Decorators & Meta', 'Decorators and Closures', 'decorators-and-closures', 'Wrap functions dynamically with @decorator syntax.', ['py-topic-68'], 'Advanced', 18, ['decorators', 'closures']),
  createUpcomingTopic(70, 7, 'Intermediate and Advanced Python', 'mod-7-2', 'Decorators & Meta', 'Advanced Function Arguments (*args, **kwargs)', 'advanced-function-arguments', 'Forward arbitrary positional and keyword args.', ['py-topic-69'], 'Advanced', 12, ['args_kwargs']),
  createUpcomingTopic(71, 7, 'Intermediate and Advanced Python', 'mod-7-2', 'Decorators & Meta', 'Custom Context Managers', 'custom-context-managers', 'Implement __enter__ and __exit__ protocols.', ['py-topic-70'], 'Advanced', 15, ['context_managers']),
  createUpcomingTopic(72, 7, 'Intermediate and Advanced Python', 'mod-7-3', 'Engineering Tools', 'Regular Expressions (re module)', 'regular-expressions', 'Pattern-match text with regex.', ['py-topic-71'], 'Advanced', 15, ['regex']),
  createUpcomingTopic(73, 7, 'Intermediate and Advanced Python', 'mod-7-3', 'Engineering Tools', 'Type Hints and Mypy', 'type-hints', 'Add static type checking to Python programs.', ['py-topic-72'], 'Advanced', 15, ['type_hints', 'mypy']),
  createUpcomingTopic(74, 7, 'Intermediate and Advanced Python', 'mod-7-4', 'Quality & Packaging', 'Unit Testing with pytest and unittest', 'unit-testing', 'Write automated tests and test assertions.', ['py-topic-73'], 'Advanced', 18, ['testing', 'pytest']),
  createUpcomingTopic(75, 7, 'Intermediate and Advanced Python', 'mod-7-4', 'Quality & Packaging', 'Code Style, PEP 8, and Refactoring', 'code-style-pep8', 'Write clean, idiomatic Python code.', ['py-topic-74'], 'Advanced', 12, ['pep8', 'clean_code']),
  createUpcomingTopic(76, 7, 'Intermediate and Advanced Python', 'mod-7-4', 'Quality & Packaging', 'Virtual Environments (venv, poetry)', 'virtual-environments', 'Isolate dependencies across Python projects.', ['py-topic-75'], 'Advanced', 15, ['venv', 'packaging']),
  createUpcomingTopic(77, 7, 'Intermediate and Advanced Python', 'mod-7-4', 'Quality & Packaging', 'Reusable Software Design', 'reusable-software-design', 'Design modular, decoupled software architectures.', ['py-topic-76'], 'Advanced', 18, ['software_design'], 'proj-stage-7-tested-package'),
];

const STAGE_8_TOPICS: CurriculumTopic[] = [
  createUpcomingTopic(78, 8, 'Data Structures and Algorithms', 'mod-8-1', 'Arrays & Strings', 'Arrays and Strings in DSA', 'dsa-arrays-strings', 'Optimize array algorithms and sub-array searches.', ['py-topic-77'], 'Advanced', 20, ['array_dsa']),
  createUpcomingTopic(79, 8, 'Data Structures and Algorithms', 'mod-8-1', 'Arrays & Strings', 'Two Pointers and Sliding Windows', 'two-pointers-sliding-windows', 'Solve linear search problems in O(N) time.', ['py-topic-78'], 'Advanced', 20, ['two_pointers', 'sliding_window']),
  createUpcomingTopic(80, 8, 'Data Structures and Algorithms', 'mod-8-1', 'Arrays & Strings', 'Hashing and Frequency Maps', 'hashing-frequency-maps', 'Solve lookups in O(1) expected time.', ['py-topic-79'], 'Advanced', 18, ['hash_maps']),
  createUpcomingTopic(81, 8, 'Data Structures and Algorithms', 'mod-8-2', 'Linear Structures', 'Stacks and Queues', 'stacks-and-queues', 'LIFO and FIFO data processing with collections.deque.', ['py-topic-80'], 'Advanced', 18, ['stacks', 'queues']),
  createUpcomingTopic(82, 8, 'Data Structures and Algorithms', 'mod-8-2', 'Linear Structures', 'Linked Lists', 'linked-lists', 'Implement singly and doubly linked lists.', ['py-topic-81'], 'Advanced', 20, ['linked_lists']),
  createUpcomingTopic(83, 8, 'Data Structures and Algorithms', 'mod-8-2', 'Linear Structures', 'Binary Search', 'binary-search', 'Search sorted arrays in O(log N) time.', ['py-topic-82'], 'Advanced', 18, ['binary_search']),
  createUpcomingTopic(84, 8, 'Data Structures and Algorithms', 'mod-8-3', 'Trees & Graphs', 'Recursion and Backtracking', 'recursion-backtracking', 'Explore permutations, combinations, and mazes.', ['py-topic-83'], 'Advanced', 25, ['backtracking']),
  createUpcomingTopic(85, 8, 'Data Structures and Algorithms', 'mod-8-3', 'Trees & Graphs', 'Trees and Tree Traversal', 'trees-and-traversal', 'Binary trees, BST, BFS, DFS traversals.', ['py-topic-84'], 'Advanced', 22, ['trees', 'bst']),
  createUpcomingTopic(86, 8, 'Data Structures and Algorithms', 'mod-8-3', 'Trees & Graphs', 'Heaps and Priority Queues', 'heaps-priority-queues', 'Track min/max elements with heapq.', ['py-topic-85'], 'Advanced', 20, ['heaps']),
  createUpcomingTopic(87, 8, 'Data Structures and Algorithms', 'mod-8-3', 'Trees & Graphs', 'Graphs, BFS, and DFS', 'graphs-bfs-dfs', 'Model networks and search paths across nodes.', ['py-topic-86'], 'Advanced', 25, ['graphs', 'bfs', 'dfs']),
  createUpcomingTopic(88, 8, 'Data Structures and Algorithms', 'mod-8-4', 'Complexity', 'Sorting Algorithms', 'sorting-algorithms', 'Merge sort, quick sort, and Timsort comparison.', ['py-topic-87'], 'Advanced', 20, ['sorting_algorithms']),
  createUpcomingTopic(89, 8, 'Data Structures and Algorithms', 'mod-8-4', 'Complexity', 'Time and Space Complexity Analysis', 'complexity-analysis', 'Calculate worst, average, and best-case complexities.', ['py-topic-88'], 'Advanced', 18, ['complexity_analysis'], 'proj-stage-8-pathfinding-visualizer'),
];

const STAGE_9_TOPICS: CurriculumTopic[] = [
  createUpcomingTopic(90, 9, 'Practical Python Development', 'mod-9-1', 'APIs & Web', 'HTTP and APIs (requests module)', 'http-and-apis', 'Consume RESTful APIs and handle responses.', ['py-topic-89'], 'Intermediate', 18, ['http_requests', 'rest_apis']),
  createUpcomingTopic(91, 9, 'Practical Python Development', 'mod-9-1', 'APIs & Web', 'JSON Data and API Responses', 'api-json-data', 'Parse nested JSON API responses into data models.', ['py-topic-90'], 'Intermediate', 15, ['api_json']),
  createUpcomingTopic(92, 9, 'Practical Python Development', 'mod-9-2', 'Databases', 'SQLite and SQL Fundamentals', 'sqlite-and-sql-fundamentals', 'Store tabular data with sqlite3 and SQL queries.', ['py-topic-91'], 'Intermediate', 20, ['sqlite', 'sql']),
  createUpcomingTopic(93, 9, 'Practical Python Development', 'mod-9-2', 'Databases', 'Database CRUD Operations', 'database-crud', 'Create, Read, Update, and Delete database records.', ['py-topic-92'], 'Intermediate', 18, ['crud']),
  createUpcomingTopic(94, 9, 'Practical Python Development', 'mod-9-2', 'Databases', 'Python Web Development (FastAPI / Flask)', 'python-web-dev', 'Build REST endpoints and API routers.', ['py-topic-93'], 'Intermediate', 25, ['fastapi', 'web_services']),
  createUpcomingTopic(95, 9, 'Practical Python Development', 'mod-9-3', 'Data Science & Automation', 'NumPy Fundamentals', 'numpy-fundamentals', 'Perform vectorized multidimensional math with NumPy arrays.', ['py-topic-94'], 'Intermediate', 20, ['numpy', 'vectors']),
  createUpcomingTopic(96, 9, 'Practical Python Development', 'mod-9-3', 'Data Science & Automation', 'pandas for Data Processing', 'pandas-data-processing', 'Clean and analyze tabular DataFrames.', ['py-topic-95'], 'Intermediate', 22, ['pandas', 'dataframes']),
  createUpcomingTopic(97, 9, 'Practical Python Development', 'mod-9-3', 'Data Science & Automation', 'Matplotlib Data Visualization', 'matplotlib-visualization', 'Plot line graphs, bar charts, and scatter plots.', ['py-topic-96'], 'Intermediate', 18, ['matplotlib', 'data_vis']),
  createUpcomingTopic(98, 9, 'Practical Python Development', 'mod-9-3', 'Data Science & Automation', 'Automation and File Processing', 'automation-file-processing', 'Automate file batching, renaming, and reporting.', ['py-topic-97'], 'Intermediate', 18, ['automation']),
  createUpcomingTopic(99, 9, 'Practical Python Development', 'mod-9-4', 'AI & Workflows', 'Introduction to Machine Learning with scikit-learn', 'intro-machine-learning', 'Train regression and classification models.', ['py-topic-98'], 'Intermediate', 25, ['scikit_learn', 'ml_models']),
  createUpcomingTopic(100, 9, 'Practical Python Development', 'mod-9-4', 'AI & Workflows', 'Git and GitHub Workflows', 'git-github-workflows', 'Version control code, branches, and pull requests.', ['py-topic-99'], 'Intermediate', 18, ['git', 'version_control']),
  createUpcomingTopic(101, 9, 'Practical Python Development', 'mod-9-4', 'AI & Workflows', 'Deployment Fundamentals', 'deployment-fundamentals', 'Deploy Python services to cloud platforms.', ['py-topic-100'], 'Intermediate', 20, ['cloud_deploy'], 'proj-stage-9-real-world-app'),
];

const STAGE_10_TOPICS: CurriculumTopic[] = [
  createUpcomingTopic(102, 10, 'Advanced and Specialist Tracks', 'mod-10-1', 'Concurrency', 'Threading and Multiprocessing', 'threading-and-multiprocessing', 'CPU-bound vs I/O-bound parallel execution.', ['py-topic-101'], 'Advanced', 22, ['threading', 'multiprocessing']),
  createUpcomingTopic(103, 10, 'Advanced and Specialist Tracks', 'mod-10-1', 'Concurrency', 'Race Conditions and Synchronization', 'race-conditions-sync', 'Protect shared memory with Locks and Semaphores.', ['py-topic-102'], 'Advanced', 20, ['locks', 'synchronization']),
  createUpcomingTopic(104, 10, 'Advanced and Specialist Tracks', 'mod-10-1', 'Concurrency', 'Asynchronous Programming Fundamentals', 'async-fundamentals', 'Understand event loops and non-blocking I/O.', ['py-topic-103'], 'Advanced', 22, ['async_io', 'event_loop']),
  createUpcomingTopic(105, 10, 'Advanced and Specialist Tracks', 'mod-10-1', 'Concurrency', 'async / await and asyncio', 'async-await-asyncio', 'Write asynchronous concurrent network services.', ['py-topic-104'], 'Advanced', 25, ['async_await']),
  createUpcomingTopic(106, 10, 'Advanced and Specialist Tracks', 'mod-10-2', 'Architecture & Internals', 'Advanced Type Hints and Protocols', 'advanced-type-hints', 'Static duck-typing with typing.Protocol.', ['py-topic-105'], 'Advanced', 20, ['protocols', 'type_variance']),
  createUpcomingTopic(107, 10, 'Advanced and Specialist Tracks', 'mod-10-2', 'Architecture & Internals', 'Profiling and Performance Optimization', 'profiling-optimization', 'Profile execution bottlenecks with cProfile.', ['py-topic-106'], 'Advanced', 20, ['cprofile', 'optimization']),
  createUpcomingTopic(108, 10, 'Advanced and Specialist Tracks', 'mod-10-2', 'Architecture & Internals', 'Python Object Model and Memory Behavior', 'python-object-model', 'CPython reference counting, GIL, and garbage collection.', ['py-topic-107'], 'Advanced', 25, ['cpython_gil', 'garbage_collection']),
  createUpcomingTopic(109, 10, 'Advanced and Specialist Tracks', 'mod-10-3', 'Production Engineering', 'Advanced Software Architecture', 'advanced-software-architecture', 'Domain-Driven Design and Clean Architecture.', ['py-topic-108'], 'Advanced', 25, ['software_architecture']),
  createUpcomingTopic(110, 10, 'Advanced and Specialist Tracks', 'mod-10-3', 'Production Engineering', 'Production Testing and CI/CD', 'production-testing-ci', 'Configure GitHub Actions CI workflows.', ['py-topic-109'], 'Advanced', 20, ['ci_cd', 'automation_pipelines']),
  createUpcomingTopic(111, 10, 'Advanced and Specialist Tracks', 'mod-10-3', 'Production Engineering', 'Packaging and Deployment (Docker & PyPI)', 'packaging-docker-pypi', 'Containerize applications and publish Python packages.', ['py-topic-110'], 'Advanced', 22, ['docker', 'pypi_packaging']),
  createUpcomingTopic(112, 10, 'Advanced and Specialist Tracks', 'mod-10-3', 'Production Engineering', 'Specialist Capstone Project', 'specialist-capstone', 'Deploy an enterprise production system across your chosen specialization.', ['py-topic-111'], 'Advanced', 60, ['specialist_capstone'], 'proj-stage-10-specialist-capstone'),
];

// -------------------------------------------------------------
// COMPLETE 10 STAGES CATALOG
// -------------------------------------------------------------
export const PYTHON_STAGES_CATALOG: CurriculumStage[] = [
  {
    id: 'stage-1',
    stageNumber: 1,
    title: 'Stage 1: Python Foundations',
    tagline: 'First signals, variables, scalar types, operators, and formatting',
    description: 'Master the fundamental grammar of Python: sequential line execution, variables, scalar types, arithmetic, comparison, logical operators, and f-strings.',
    color: '#10B981',
    accentBg: '#D1FAE5',
    realmName: 'Starter Village',
    projectTitle: 'Character Creator',
    projectDescription: 'Build an RPG character badge generator synthesizing variables, calculations, string slicing, and f-strings.',
    projectSlug: 'proj-stage-1-character-creator',
    totalTopics: 13,
    topics: STAGE_1_TOPICS,
  },
  {
    id: 'stage-2',
    stageNumber: 2,
    title: 'Stage 2: Conditions and Loops',
    tagline: 'Branching decisions, repetition, range(), and loop tracing',
    description: 'Control program flow with boolean logic, if/elif/else branching, while loops, for loops with range(), break/continue, and 2D grid iteration.',
    color: '#6C5CE7',
    accentBg: '#EDE9FE',
    realmName: 'Decision Forest & Loop Lab',
    projectTitle: 'Robot Grid Navigator',
    projectDescription: 'Program autonomous rover movement across a 2D grid avoiding obstacles and accumulating battery reserves.',
    projectSlug: 'proj-stage-2-robot-navigator',
    totalTopics: 12,
    topics: STAGE_2_TOPICS,
  },
  {
    id: 'stage-3',
    stageNumber: 3,
    title: 'Stage 3: Data Structures',
    tagline: 'Lists, tuples, sets, dictionaries, and comprehensions',
    description: 'Organize data with mutable lists, immutable tuples, hash-backed sets, key-value dictionaries, and concise list/dict comprehensions.',
    color: '#3B82F6',
    accentBg: '#DBEAFE',
    realmName: 'Array Islands',
    projectTitle: 'Inventory and Leaderboard System',
    projectDescription: 'Build a game item inventory and score leaderboard with nested collections.',
    projectSlug: 'proj-stage-3-inventory-leaderboard',
    totalTopics: 11,
    topics: STAGE_3_TOPICS,
  },
  {
    id: 'stage-4',
    stageNumber: 4,
    title: 'Stage 4: Functions and Problem Solving',
    tagline: 'Modular logic, parameters, return values, recursion, and Big O',
    description: 'Package logic into reusable functions, master scope and recursion, use functional tools (map, filter), and analyze algorithmic complexity.',
    color: '#F59E0B',
    accentBg: '#FEF3C7',
    realmName: 'Function Fortress',
    projectTitle: 'Reusable Mini-Game Engine',
    projectDescription: 'Construct a modular game loop with state management, functional callbacks, and search algorithms.',
    projectSlug: 'proj-stage-4-mini-game-engine',
    totalTopics: 11,
    topics: STAGE_4_TOPICS,
  },
  {
    id: 'stage-5',
    stageNumber: 5,
    title: 'Stage 5: Errors, Files, and Modules',
    tagline: 'Exception handling, disk persistence, JSON, and logging',
    description: 'Handle runtime exceptions with try/except, read and write files with context managers, parse JSON/CSV, and organize code into modules.',
    color: '#EF4444',
    accentBg: '#FEE2E2',
    realmName: 'Debugging Dungeon',
    projectTitle: 'Saved-Progress Adventure Game',
    projectDescription: 'Build a file-persisted game engine that saves and loads player state using JSON and robust error recovery.',
    projectSlug: 'proj-stage-5-saved-progress-adventure',
    totalTopics: 10,
    topics: STAGE_5_TOPICS,
  },
  {
    id: 'stage-6',
    stageNumber: 6,
    title: 'Stage 6: Object-Oriented Programming',
    tagline: 'Classes, objects, inheritance, encapsulation, and dataclasses',
    description: 'Model complex domains with classes, instance attributes, methods, inheritance, polymorphism, composition, and modern dataclasses.',
    color: '#EC4899',
    accentBg: '#FCE7F3',
    realmName: 'Class Citadel',
    projectTitle: 'Object-Oriented Robot Simulator',
    projectDescription: 'Architect a multi-class robot simulation with sensors, actuators, battery systems, and inheritance hierarchies.',
    projectSlug: 'proj-stage-6-robot-simulator',
    totalTopics: 9,
    topics: STAGE_6_TOPICS,
  },
  {
    id: 'stage-7',
    stageNumber: 7,
    title: 'Stage 7: Intermediate and Advanced Python',
    tagline: 'Iterators, generators, decorators, type hints, and testing',
    description: 'Write professional, production-grade Python using generators, decorators, typing, unit testing with pytest, and packaging standards.',
    color: '#8B5CF6',
    accentBg: '#EDE9FE',
    realmName: 'Guild of Craftsmen',
    projectTitle: 'Tested Python Package',
    projectDescription: 'Build and unit-test an open-source Python utility library complete with type annotations and pyproject.toml configuration.',
    projectSlug: 'proj-stage-7-tested-package',
    totalTopics: 11,
    topics: STAGE_7_TOPICS,
  },
  {
    id: 'stage-8',
    stageNumber: 8,
    title: 'Stage 8: Data Structures and Algorithms',
    tagline: 'Two pointers, trees, graphs, heaps, BFS/DFS, and dynamic search',
    description: 'Crack algorithmic challenges: sliding windows, binary search, tree traversals, graph algorithms (BFS/DFS), and time-space analysis.',
    color: '#14B8A6',
    accentBg: '#CCFBF1',
    realmName: 'Algorithm Nexus',
    projectTitle: 'Pathfinding Visualizer',
    projectDescription: 'Implement breadth-first search and Dijkstra pathfinding visualizer across a dynamic 2D maze.',
    projectSlug: 'proj-stage-8-pathfinding-visualizer',
    totalTopics: 12,
    topics: STAGE_8_TOPICS,
  },
  {
    id: 'stage-9',
    stageNumber: 9,
    title: 'Stage 9: Practical Python Development',
    tagline: 'HTTP APIs, SQL databases, web backends, NumPy, pandas, and ML',
    description: 'Apply Python in industry: consume APIs, query SQLite databases, build FastAPI web backends, process data with pandas, and train ML models.',
    color: '#F97316',
    accentBg: '#FFEDD5',
    realmName: 'Industry Outpost',
    projectTitle: 'Real-World API & Data Analysis App',
    projectDescription: 'Deploy a FastAPI microservice backed by SQLite and a pandas analytical dashboard.',
    projectSlug: 'proj-stage-9-real-world-app',
    totalTopics: 12,
    topics: STAGE_9_TOPICS,
  },
  {
    id: 'stage-10',
    stageNumber: 10,
    title: 'Stage 10: Advanced and Specialist Tracks',
    tagline: 'Concurrency, asyncio, CPython internals, architecture, and CI/CD',
    description: 'Master advanced systems: async/await with asyncio, multiprocessing, Python object internals, clean architecture, and containerized deployment.',
    color: '#6366F1',
    accentBg: '#E0E7FF',
    realmName: 'The High Citadel of Acharyas',
    projectTitle: 'Specialist Enterprise Capstone',
    projectDescription: 'Architect, test, containerize, and deploy a high-concurrency production system with automated CI pipelines.',
    projectSlug: 'proj-stage-10-specialist-capstone',
    totalTopics: 11,
    topics: STAGE_10_TOPICS,
  },
];

// Flat lookup index for all 112 topics
export const ALL_PYTHON_TOPICS: CurriculumTopic[] = PYTHON_STAGES_CATALOG.flatMap(
  (stage) => stage.topics
);

export function findTopicById(id: string): CurriculumTopic | undefined {
  return ALL_PYTHON_TOPICS.find((t) => t.id === id);
}

export function findTopicBySlug(slug: string): CurriculumTopic | undefined {
  return ALL_PYTHON_TOPICS.find((t) => t.slug === slug);
}

export function findTopicBySequence(seq: number): CurriculumTopic | undefined {
  return ALL_PYTHON_TOPICS.find((t) => t.sequenceNumber === seq);
}

export function getStageByNumber(stageNum: number): CurriculumStage | undefined {
  return PYTHON_STAGES_CATALOG.find((s) => s.stageNumber === stageNum);
}
