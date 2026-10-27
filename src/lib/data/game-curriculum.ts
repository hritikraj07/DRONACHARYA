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
  'python-algorithms': {
    subjectId: 'python-algorithms',
    subjectName: 'Python & Algorithmic Thinking',
    category: 'Computer Science',
    levels: [
      {
        id: 'py-lvl-1',
        levelNumber: 1,
        title: 'Level 1: The Spell of Variables & Logic',
        subtitle: 'Foundations of Computational Memory',
        storyNarrative: 'You stand before the Iron Gate of Drona’s Citadel. The stone sentinel demands a correct calculation of gate power before granting entry.',
        conceptTeaser: 'Variables in Python hold references to memory values. Use conditional statements to evaluate paths.',
        xpReward: 50,
        puzzle: {
          question: 'What is the value of `power` after this spell executes?\n\n```python\nmana = 10\npower = mana * 2 if mana > 5 else mana\n```',
          options: [
            { id: 'a', text: '10', isCorrect: false },
            { id: 'b', text: '20', isCorrect: true },
            { id: 'c', text: '5', isCorrect: false },
            { id: 'd', text: 'True', isCorrect: false },
          ],
          hint: 'Since `mana = 10` is greater than 5, the condition is satisfied: `mana * 2 = 20`.',
        },
        arenaChallenge: {
          instructions: 'Write a function `unlock_gate(code: int) -> bool` that returns True if the code is even and greater than 10, otherwise False.',
          starterCode: `def unlock_gate(code: int) -> bool:
    # Defeat the Sentinel: Return True if code > 10 and is even
    pass
`,
          solutionPattern: 'code > 10 and code % 2 == 0',
          testCases: [
            { input: 'unlock_gate(12)', expected: 'True' },
            { input: 'unlock_gate(9)', expected: 'False' },
            { input: 'unlock_gate(15)', expected: 'False' },
          ],
        },
      },
      {
        id: 'py-lvl-2',
        levelNumber: 2,
        title: 'Level 2: The Loop of Fire',
        subtitle: 'Iterating Through Arrays & Lists',
        storyNarrative: 'The sacred river has floating lotus stepping stones containing mana crystals. Traverse them in a single pass without burning the call stack!',
        conceptTeaser: 'Loops (`for item in array`) enable rapid aggregation and traversal in linear O(n) time.',
        xpReward: 75,
        puzzle: {
          question: 'What will `sum([x for x in [1, 2, 3, 4] if x % 2 == 0])` return?',
          options: [
            { id: 'a', text: '10', isCorrect: false },
            { id: 'b', text: '6 (2 + 4)', isCorrect: true },
            { id: 'c', text: '4', isCorrect: false },
            { id: 'd', text: '8', isCorrect: false },
          ],
          hint: 'The list comprehension filters only even numbers: [2, 4], whose sum is 6.',
        },
        arenaChallenge: {
          instructions: 'Write a function `gather_crystals(mana_list: list) -> int` that sums all values greater than 5.',
          starterCode: `def gather_crystals(mana_list: list) -> int:
    # TODO: Return sum of elements > 5
    pass
`,
          solutionPattern: 'sum(x for x in mana_list if x > 5)',
          testCases: [
            { input: 'gather_crystals([2, 6, 8, 3])', expected: '14' },
            { input: 'gather_crystals([1, 2, 3])', expected: '0' },
          ],
        },
      },
      {
        id: 'py-lvl-3',
        levelNumber: 3,
        title: 'Level 3: The Labyrinth of Recursion',
        subtitle: 'Base Conditions & Terminating Infinite Loops',
        storyNarrative: 'A deep recursive abyss opens beneath you! You must establish a stopping rule before memory overflows and destroys the Gurukul bridge.',
        conceptTeaser: 'Every recursive function must possess a Base Case that directly returns without recursive calls.',
        xpReward: 100,
        puzzle: {
          question: 'Why does `def loop(n): return loop(n-1)` trigger a RecursionError?',
          options: [
            { id: 'a', text: 'Because Python does not allow recursion.', isCorrect: false },
            { id: 'b', text: 'Because there is no base condition to arrest the countdown.', isCorrect: true },
            { id: 'c', text: 'Because subtraction takes too much CPU power.', isCorrect: false },
          ],
          hint: 'Without `if n <= 1: return`, the function never terminates and consumes all call frames.',
        },
        arenaChallenge: {
          instructions: 'Fix `route_cost(n)` so that `route_cost(0) = 0`, `route_cost(1) = 1`, and `route_cost(n) = route_cost(n-1) + route_cost(n-2)`.',
          starterCode: `def route_cost(n: int) -> int:
    # Establish base case: if n <= 1: return n
    if n <= 1:
        return n
    return route_cost(n - 1) + route_cost(n - 2)
`,
          solutionPattern: 'if n <= 1: return n',
          testCases: [
            { input: 'route_cost(0)', expected: '0' },
            { input: 'route_cost(1)', expected: '1' },
            { input: 'route_cost(6)', expected: '8' },
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
