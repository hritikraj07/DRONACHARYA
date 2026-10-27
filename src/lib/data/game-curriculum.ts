// Multi-Subject Gamified Learning Curriculum
// Transforms every concept into a playable game level with interactive trials and challenges

export interface GameLevel {
  id: string;
  levelNumber: number;
  title: string;
  subtitle: string;
  storyNarrative: string;
  conceptTeaser: string;
  xpReward: number;
  puzzle: {
    question: string;
    codeSnippet?: string;
    options: { id: string; text: string; isCorrect: boolean }[];
    hint: string;
  };
  arenaChallenge: {
    instructions: string;
    starterCode: string;
    solutionPattern: string;
    testCases: { input: string; expected: string }[];
  };
}

export interface SubjectCurriculum {
  subjectId: string;
  subjectName: string;
  category: string;
  levels: GameLevel[];
}

export const SUBJECT_CURRICULA: Record<string, SubjectCurriculum> = {
  'python-basics': {
    subjectId: 'python-basics',
    subjectName: 'Python Programming',
    category: 'Programming',
    levels: [
      {
        id: 'py-lvl-1',
        levelNumber: 1,
        title: 'Level 1: Rescue the Robot',
        subtitle: 'Learn Python Loops',
        storyNarrative: 'A rescue robot is stranded in the field with a depleted battery. It has gathered scattered power cells on the ground. Write a loop to calculate the total energy from all collected battery cells so the robot can power up and return to base!',
        conceptTeaser: 'Loops let you repeat code for every item in a list. In Python, write: "for cell in battery_cells:" and add each cell to total_energy.',
        xpReward: 50,
        puzzle: {
          question: 'Which loop syntax correctly visits each item in a list named `battery_cells` in Python?',
          options: [
            { id: 'a', text: 'loop cell in battery_cells:', isCorrect: false },
            { id: 'b', text: 'for cell in battery_cells:', isCorrect: true },
            { id: 'c', text: 'repeat(battery_cells):', isCorrect: false },
            { id: 'd', text: 'foreach battery_cells as cell:', isCorrect: false },
          ],
          hint: 'Python uses the keyword "for" followed by the variable name and "in list:".',
        },
        arenaChallenge: {
          instructions: 'Write a function `rescue_robot(battery_cells: list) -> int` that loops through battery_cells and returns the sum of all cell charges.',
          starterCode: `def rescue_robot(battery_cells: list) -> int:
    total_energy = 0
    # TODO: Write a loop to add each cell in battery_cells to total_energy
    for cell in battery_cells:
        total_energy += cell
    return total_energy
`,
          solutionPattern: 'for cell in battery_cells:',
          testCases: [
            { input: 'rescue_robot([10, 20, 30])', expected: '60' },
            { input: 'rescue_robot([5, 15, 25, 35])', expected: '80' },
            { input: 'rescue_robot([0, 0, 50])', expected: '50' },
            { input: 'rescue_robot([])', expected: '0' },
          ],
        },
      },
      {
        id: 'py-lvl-2',
        levelNumber: 2,
        title: 'Level 2: Filter Damaged Cells',
        subtitle: 'Loops with If Conditions',
        storyNarrative: 'Some battery cells are damaged and carry negative charges! Update your loop to only add healthy cells that have positive values (> 0).',
        conceptTeaser: 'Use an "if cell > 0:" check inside your loop to filter out unwanted or damaged items.',
        xpReward: 75,
        puzzle: {
          question: 'What will `sum([x for x in [10, -5, 20] if x > 0])` equal?',
          options: [
            { id: 'a', text: '25', isCorrect: false },
            { id: 'b', text: '30 (10 + 20)', isCorrect: true },
            { id: 'c', text: '-5', isCorrect: false },
            { id: 'd', text: '0', isCorrect: false },
          ],
          hint: 'The condition filters out -5, so only 10 and 20 are added, giving 30.',
        },
        arenaChallenge: {
          instructions: 'Write a function `filter_healthy_cells(battery_cells: list) -> int` that only sums numbers greater than 0.',
          starterCode: `def filter_healthy_cells(battery_cells: list) -> int:
    total = 0
    # TODO: Add only positive numbers (> 0)
    for cell in battery_cells:
        if cell > 0:
            total += cell
    return total
`,
          solutionPattern: 'if cell > 0:',
          testCases: [
            { input: 'filter_healthy_cells([10, -5, 20])', expected: '30' },
            { input: 'filter_healthy_cells([-1, -2, -3])', expected: '0' },
            { input: 'filter_healthy_cells([50, -10, 50])', expected: '100' },
          ],
        },
      },
      {
        id: 'py-lvl-3',
        levelNumber: 3,
        title: 'Level 3: Robot Grid Navigator',
        subtitle: 'Guiding the Robot Home',
        storyNarrative: 'The robot is charged! Now process a list of direction commands ("UP", "DOWN", "LEFT", "RIGHT") to navigate it across coordinate obstacles back to the base camp.',
        conceptTeaser: 'Combine loops with multiple if/elif branches to update (x, y) coordinates step-by-step.',
        xpReward: 100,
        puzzle: {
          question: 'If a robot starts at (0, 0) and processes ["RIGHT", "RIGHT", "UP"], what is its final coordinate?',
          options: [
            { id: 'a', text: '(0, 3)', isCorrect: false },
            { id: 'b', text: '(2, 1)', isCorrect: true },
            { id: 'c', text: '(1, 2)', isCorrect: false },
            { id: 'd', text: '(3, 0)', isCorrect: false },
          ],
          hint: 'Moving RIGHT increases x twice: x=2. Moving UP increases y once: y=1. Final position: (2, 1).',
        },
        arenaChallenge: {
          instructions: 'Write a function `move_robot(commands: list) -> list` that starts at [0, 0] and updates coordinates for "UP" and "RIGHT".',
          starterCode: `def move_robot(commands: list) -> list:
    x, y = 0, 0
    for cmd in commands:
        if cmd == "RIGHT":
            x += 1
        elif cmd == "UP":
            y += 1
    return [x, y]
`,
          solutionPattern: 'for cmd in commands:',
          testCases: [
            { input: 'move_robot(["RIGHT", "RIGHT", "UP"])', expected: '[2, 1]' },
            { input: 'move_robot(["UP", "UP"])', expected: '[0, 2]' },
            { input: 'move_robot([])', expected: '[0, 0]' },
          ],
        },
      },
    ],
  },
  'mathematics-calculus': {
    subjectId: 'mathematics-calculus',
    subjectName: 'Mathematics & Calculus',
    category: 'Pure Mathematics',
    levels: [
      {
        id: 'math-lvl-1',
        levelNumber: 1,
        title: 'Level 1: The Slope of Velocity (Derivatives)',
        subtitle: 'Instantaneous Rate of Change',
        storyNarrative: 'An arrow is launched from Arjuna’s bow with height function h(t) = -5t^2 + 20t. Predict the exact velocity at t = 2 seconds to neutralize the wind demon.',
        conceptTeaser: 'The derivative d/dt[h(t)] gives the exact instantaneous velocity at any point in time.',
        xpReward: 60,
        puzzle: {
          question: 'What is the derivative of f(x) = 3x^2 + 5x with respect to x?',
          options: [
            { id: 'a', text: '6x + 5', isCorrect: true },
            { id: 'b', text: '3x + 5', isCorrect: false },
            { id: 'c', text: '6x^2', isCorrect: false },
            { id: 'd', text: '15x', isCorrect: false },
          ],
          hint: 'Power rule: d/dx[x^n] = n*x^(n-1). Thus 3*(2x) + 5 = 6x + 5.',
        },
        arenaChallenge: {
          instructions: 'Write a Python function `arrow_velocity(t: float) -> float` computing the derivative of h(t) = -5t^2 + 20t, which is v(t) = -10t + 20.',
          starterCode: `def arrow_velocity(t: float) -> float:
    # v(t) = dh/dt = -10*t + 20
    return -10 * t + 20
`,
          solutionPattern: '-10 * t + 20',
          testCases: [
            { input: 'arrow_velocity(0)', expected: '20' },
            { input: 'arrow_velocity(2)', expected: '0' },
          ],
        },
      },
      {
        id: 'math-lvl-2',
        levelNumber: 2,
        title: 'Level 2: The Energy Shield of Integration',
        subtitle: 'Area Under the Curve & Accumulation',
        storyNarrative: 'To cast the Mahasudharshana Shield, you must integrate the mana influx curve f(x) = 2x from 0 to 4 meters.',
        conceptTeaser: 'Integration calculates accumulated area. ∫ 2x dx = x^2. Over [0, 4], the area is 4^2 - 0 = 16.',
        xpReward: 80,
        puzzle: {
          question: 'What is the definite integral of f(x) = 2x from x = 0 to x = 3?',
          options: [
            { id: 'a', text: '6', isCorrect: false },
            { id: 'b', text: '9', isCorrect: true },
            { id: 'c', text: '12', isCorrect: false },
            { id: 'd', text: '18', isCorrect: false },
          ],
          hint: '∫ 2x dx = x^2. Evaluating at 3 gives 3^2 - 0 = 9.',
        },
        arenaChallenge: {
          instructions: 'Write a function `shield_energy(x: float) -> float` returning x^2 (the integral of 2x from 0 to x).',
          starterCode: `def shield_energy(x: float) -> float:
    # Area = x ** 2
    return x ** 2
`,
          solutionPattern: 'x ** 2',
          testCases: [
            { input: 'shield_energy(3)', expected: '9' },
            { input: 'shield_energy(5)', expected: '25' },
          ],
        },
      },
    ],
  },
  'physics-mechanics': {
    subjectId: 'physics-mechanics',
    subjectName: 'Physics & Mechanics',
    category: 'Applied Science',
    levels: [
      {
        id: 'phy-lvl-1',
        levelNumber: 1,
        title: 'Level 1: The Force of Newton',
        subtitle: 'F = ma & Momentum Equilibrium',
        storyNarrative: 'A runaway boulder of mass m = 50 kg rolls toward the Gurukul gate with acceleration a = 4 m/s^2. Calculate the opposing force required to halt it.',
        conceptTeaser: 'Newton’s Second Law: Force = Mass × Acceleration (F = ma). 50 kg × 4 m/s^2 = 200 Newtons.',
        xpReward: 60,
        puzzle: {
          question: 'If a mass of 10 kg accelerates at 9.8 m/s^2, what net force is acting upon it?',
          options: [
            { id: 'a', text: '98 Newtons', isCorrect: true },
            { id: 'b', text: '0.98 Newtons', isCorrect: false },
            { id: 'c', text: '19.8 Newtons', isCorrect: false },
          ],
          hint: 'F = m * a = 10 * 9.8 = 98 N.',
        },
        arenaChallenge: {
          instructions: 'Write a function `halt_force(mass: float, acceleration: float) -> float` implementing F = m * a.',
          starterCode: `def halt_force(mass: float, acceleration: float) -> float:
    return mass * acceleration
`,
          solutionPattern: 'mass * acceleration',
          testCases: [
            { input: 'halt_force(50, 4)', expected: '200' },
            { input: 'halt_force(10, 9.8)', expected: '98' },
          ],
        },
      },
    ],
  },
  'ai-ml-studio': {
    subjectId: 'ai-ml-studio',
    subjectName: 'Applied AI & Machine Learning',
    category: 'Intelligent Systems',
    levels: [
      {
        id: 'ml-lvl-1',
        levelNumber: 1,
        title: 'Level 1: Training the Artificial Golem',
        subtitle: 'Perceptrons & Binary Classification',
        storyNarrative: 'You have crafted an automated guard golem. You must tune its decision threshold so it allows Gurukul scholars in while stopping goblin intruders.',
        conceptTeaser: 'A perceptron computes a weighted sum w·x + b. If greater than 0, it predicts class 1 (Scholar); otherwise class 0.',
        xpReward: 70,
        puzzle: {
          question: 'If weighted sum z = 2.5 and activation is step function (z >= 0 ? 1 : 0), what is output?',
          options: [
            { id: 'a', text: '1 (Active / Scholar)', isCorrect: true },
            { id: 'b', text: '0 (Inactive)', isCorrect: false },
            { id: 'c', text: '-1', isCorrect: false },
          ],
          hint: 'Since z = 2.5 >= 0, the threshold fires: 1.',
        },
        arenaChallenge: {
          instructions: 'Write a function `classify_visitor(feature_val: float, weight: float, bias: float) -> int` returning 1 if feature_val*weight + bias >= 0 else 0.',
          starterCode: `def classify_visitor(feature_val: float, weight: float, bias: float) -> int:
    return 1 if (feature_val * weight + bias) >= 0 else 0
`,
          solutionPattern: 'feature_val * weight + bias >= 0',
          testCases: [
            { input: 'classify_visitor(2, 3, -4)', expected: '1' },
            { input: 'classify_visitor(1, 2, -5)', expected: '0' },
          ],
        },
      },
    ],
  },
  'data-structures': {
    subjectId: 'data-structures',
    subjectName: 'Data Structures & Systems',
    category: 'Core Engineering',
    levels: [
      {
        id: 'ds-lvl-1',
        levelNumber: 1,
        title: 'Level 1: The Hash Vault of Amortized O(1)',
        subtitle: 'Constant Time Lookup & Key Storage',
        storyNarrative: 'The library contains 100,000 palm-leaf manuscripts. Linear search is far too slow! Index them with a Hash Map to locate any verse instantly.',
        conceptTeaser: 'A Hash Map hashes string keys to memory buckets, enabling O(1) amortized lookup.',
        xpReward: 65,
        puzzle: {
          question: 'What is the average time complexity to lookup a key in a Python dictionary?',
          options: [
            { id: 'a', text: 'O(1) Constant Time', isCorrect: true },
            { id: 'b', text: 'O(n) Linear Time', isCorrect: false },
            { id: 'c', text: 'O(n^2) Quadratic Time', isCorrect: false },
          ],
          hint: 'Hash tables map keys to index locations directly in O(1) on average.',
        },
        arenaChallenge: {
          instructions: 'Write a function `find_manuscript(catalog: dict, title: str) -> str` returning catalog[title] if present, otherwise "Not Found".',
          starterCode: `def find_manuscript(catalog: dict, title: str) -> str:
    return catalog.get(title, "Not Found")
`,
          solutionPattern: 'catalog.get(title',
          testCases: [
            { input: 'find_manuscript({"gita": "Section 4"}, "gita")', expected: 'Section 4' },
            { input: 'find_manuscript({}, "vedas")', expected: 'Not Found' },
          ],
        },
      },
    ],
  },
};

SUBJECT_CURRICULA['python-algorithms'] = SUBJECT_CURRICULA['python-basics'];
