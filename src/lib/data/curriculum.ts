// Dronacharya Simplified Learning Curriculum
// Focus: Turning theoretical knowledge into practical skills through interactive missions
import { LearningPath, MasterySeal, CapstoneProject, GurukulSquad } from '@/types';

export const INITIAL_SKILLS = [
  { id: 'py.loops.basics', name: 'Python Loops', domain: 'Programming Basics', description: 'Looping through sequences and lists with for loops' },
  { id: 'py.logic.conditions', name: 'Conditionals (If/Else)', domain: 'Programming Basics', description: 'Making decisions and filtering items in code' },
  { id: 'py.functions.returns', name: 'Functions & Return Values', domain: 'Programming Basics', description: 'Packaging logic into reusable functions' },
  { id: 'py.lists.operations', name: 'List Operations', domain: 'Data Basics', description: 'Accessing, slicing, and aggregating list elements' },
];

export const DIAGNOSTIC_QUESTIONS = [
  {
    id: 'diag-01',
    difficulty: 'beginner',
    skillId: 'py.loops.basics',
    title: 'Looping in Python',
    prompt: 'Which syntax correctly loops through every item in a list named `battery_cells`?',
    codeSnippet: 'battery_cells = [10, 20, 30]\n# Which loop visits each number?',
    options: [
      { id: 'a', text: 'for cell in battery_cells:', isCorrect: true },
      { id: 'b', text: 'loop cell in battery_cells:', isCorrect: false },
      { id: 'c', text: 'repeat(battery_cells):', isCorrect: false },
      { id: 'd', text: 'foreach battery_cells as cell:', isCorrect: false },
    ],
    explanation: 'Python uses the "for item in list:" syntax to iterate over elements one by one.',
  },
  {
    id: 'diag-02',
    difficulty: 'beginner',
    skillId: 'py.loops.basics',
    title: 'Accumulating Values in a Loop',
    prompt: 'What will be the final value of `total` after this code runs?',
    codeSnippet: 'total = 0\nfor x in [5, 10, 15]:\n    total += x\nprint(total)',
    options: [
      { id: 'a', text: '15', isCorrect: false },
      { id: 'b', text: '30 (5 + 10 + 15)', isCorrect: true },
      { id: 'c', text: '0', isCorrect: false },
      { id: 'd', text: '10', isCorrect: false },
    ],
    explanation: 'The loop executes 3 times, adding 5, then 10, then 15 to the running total (giving 30).',
  },
];

export const INITIAL_LEARNING_PATHS: LearningPath[] = [
  {
    id: 'python-basics',
    title: 'Python Programming',
    slug: 'python-basics',
    category: 'algorithms',
    description: 'Learn Python loops, conditionals, and functions by solving practical coding challenges.',
    icon: 'Terminal',
    missions: [
      {
        id: 'mission-rescue-robot',
        pathId: 'python-basics',
        sequenceOrder: 1,
        title: 'Rescue the Robot',
        subtitle: 'Learn Python Loops',
        narrativeContext: 'A small rescue robot is stranded in the field with a depleted battery. It has gathered power cells scattered on the ground. Write a loop to calculate the total energy from all collected battery cells so the robot can power up and return to base.',
        conceptBriefing: 'Loops allow your computer to repeat actions for every item in a list. Instead of writing separate additions for each cell, use "for cell in battery_cells:" and accumulate the energy into a running total.',
        conceptVisualType: 'call-tree',
        primarySkillId: 'py.loops.basics',
        xpReward: 100,
        estTimeMinutes: 10,
        isUnlocked: true,
        isCompleted: false,
        initialCode: `# Mission: Rescue the Robot
# Goal: Write a function to calculate total energy from all battery cells.

def rescue_robot(battery_cells: list) -> int:
    total_energy = 0
    # TODO: Write a loop to add each cell in battery_cells to total_energy
    
    return total_energy
`,
        solutionPattern: 'for cell in battery_cells:',
        visibleTests: [
          { id: 't1', inputDescription: 'rescue_robot([10, 20, 30])', expectedOutput: '60', codeSnippet: 'assert rescue_robot([10, 20, 30]) == 60' },
          { id: 't2', inputDescription: 'rescue_robot([5, 15, 25, 35])', expectedOutput: '80', codeSnippet: 'assert rescue_robot([5, 15, 25, 35]) == 80' },
          { id: 't3', inputDescription: 'rescue_robot([0, 0, 50])', expectedOutput: '50', codeSnippet: 'assert rescue_robot([0, 0, 50]) == 50' },
        ],
        hiddenTests: [
          { id: 't4', inputDescription: 'rescue_robot([])', expectedOutput: '0', codeSnippet: 'assert rescue_robot([]) == 0', isHidden: true },
          { id: 't5', inputDescription: 'rescue_robot([100])', expectedOutput: '100', codeSnippet: 'assert rescue_robot([100]) == 100', isHidden: true },
        ],
      },
      {
        id: 'mission-hazard-filter',
        pathId: 'python-basics',
        sequenceOrder: 2,
        title: 'Filter Damaged Cells',
        subtitle: 'Loops with If/Else Conditions',
        narrativeContext: 'Some power cells are damaged and contain negative charges. Upgrade your function to skip any negative values and only count healthy positive cells.',
        conceptBriefing: 'Inside a loop, you can use an "if cell > 0:" check to decide whether to add a value or ignore it.',
        conceptVisualType: 'call-tree',
        primarySkillId: 'py.logic.conditions',
        xpReward: 120,
        estTimeMinutes: 12,
        isUnlocked: false,
        isCompleted: false,
        initialCode: `# Mission: Filter Damaged Cells
# Only add cells that have positive energy (> 0).

def filter_healthy_cells(battery_cells: list) -> int:
    total_energy = 0
    # TODO: Loop through cells and add only positive numbers
    for cell in battery_cells:
        if cell > 0:
            total_energy += cell
    return total_energy
`,
        solutionPattern: 'if cell > 0:',
        visibleTests: [
          { id: 'h1', inputDescription: 'filter_healthy_cells([10, -5, 20])', expectedOutput: '30', codeSnippet: 'assert filter_healthy_cells([10, -5, 20]) == 30' },
          { id: 'h2', inputDescription: 'filter_healthy_cells([-1, -2, -3])', expectedOutput: '0', codeSnippet: 'assert filter_healthy_cells([-1, -2, -3]) == 0' },
        ],
        hiddenTests: [
          { id: 'h3', inputDescription: 'filter_healthy_cells([50, -10, 50])', expectedOutput: '100', codeSnippet: 'assert filter_healthy_cells([50, -10, 50]) == 100', isHidden: true },
        ],
      },
    ],
  },
];

export const INITIAL_SEALS: MasterySeal[] = [
  {
    id: 'seal-robot-rescuer',
    title: 'Robot Rescuer Badge',
    category: 'Python Programming',
    description: 'Awarded for successfully mastering loops to rescue the stranded field robot.',
    iconName: 'Award',
    requiredSkillId: 'py.loops.basics',
    verificationHash: 'rob01-rescue-loop-verified',
    isUnlocked: false,
  },
  {
    id: 'seal-grid-navigator',
    title: 'Robot Navigator Badge',
    category: 'Applied Projects',
    description: 'Awarded for applying loops and conditionals to navigate a robot across coordinate grids.',
    iconName: 'Compass',
    requiredSkillId: 'py.logic.conditions',
    verificationHash: 'rob02-navigator-verified',
    isUnlocked: false,
  },
  {
    id: 'seal-dungeon-architect',
    title: 'Dungeon Architect Seal',
    category: 'Game & Systems Engineering',
    description: 'Conquered all 4 Code Dungeon & Craft Floors: Voxel Quarry, Labyrinth of Loops, Sentinel Gate, and Syntax Golem Boss.',
    iconName: 'Shield',
    requiredSkillId: 'dungeon.craft.mastery',
    verificationHash: 'dng01-dungeon-architect-verified',
    isUnlocked: false,
  },
];

export const INITIAL_CAPSTONES: CapstoneProject[] = [
  {
    id: 'capstone-robot-navigator',
    title: 'Robot Grid Navigator',
    slug: 'robot-grid-navigator',
    category: 'Practical Python Project',
    description: 'Connect what you learned in "Rescue the Robot" to a practical project. Build a step-by-step grid navigation program that reads movement commands, avoids boundaries, and guides the robot home.',
    learningObjectives: [
      'Use Python loops to process a sequence of robot movement commands.',
      'Track robot coordinates (x, y) and remaining battery accurately.',
      'Stop safely if the robot reaches the edge or runs out of battery.',
      'Pass automated test cases verifying that the robot finishes at the expected coordinates.',
    ],
    prerequisites: ['Python Loops', 'Conditionals (If/Else)', 'Basic Coordinates'],
    milestones: [
      { id: 'm1', title: 'Milestone 1: Movement Loop', description: 'Loop through commands and update coordinates for UP, DOWN, LEFT, and RIGHT.', testChecklist: ['Coordinate update logic', 'Loop termination'], isCompleted: false },
      { id: 'm2', title: 'Milestone 2: Battery Management', description: 'Deduct 1 battery point per move and stop if battery drops to 0.', testChecklist: ['Battery check', 'Prevent negative battery'], isCompleted: false },
    ],
    starterFiles: {
      'robot_navigator.py': `# Practical Project: Robot Grid Navigator
# Apply your loop and conditional knowledge to guide the robot home!

def navigate_robot(grid_size: int, commands: list, battery: int) -> dict:
    """
    Guides the robot across a grid from (0, 0).
    Commands: 'UP', 'DOWN', 'LEFT', 'RIGHT'
    Each move consumes 1 battery.
    """
    x, y = 0, 0
    moves_completed = 0

    for move in commands:
        if battery <= 0:
            break
            
        if move == 'UP' and y < grid_size - 1:
            y += 1
        elif move == 'DOWN' and y > 0:
            y -= 1
        elif move == 'RIGHT' and x < grid_size - 1:
            x += 1
        elif move == 'LEFT' and x > 0:
            x -= 1
            
        battery -= 1
        moves_completed += 1

    return {
        "final_position": (x, y),
        "remaining_battery": battery,
        "moves_completed": moves_completed
    }
`,
      'test_navigator.py': `# Test Harness for Robot Grid Navigator
from robot_navigator import navigate_robot

def run_tests():
    # Test 1: Moving right and up
    res1 = navigate_robot(5, ['RIGHT', 'RIGHT', 'UP'], 10)
    assert res1['final_position'] == (2, 1), f"Expected (2, 1), got {res1['final_position']}"
    assert res1['remaining_battery'] == 7, f"Expected 7, got {res1['remaining_battery']}"

    # Test 2: Battery runs out
    res2 = navigate_robot(5, ['RIGHT', 'RIGHT', 'RIGHT'], 2)
    assert res2['final_position'] == (2, 0), f"Expected (2, 0), got {res2['final_position']}"
    assert res2['remaining_battery'] == 0, f"Expected 0, got {res2['remaining_battery']}"

    print("All Robot Navigator tests passed successfully!")

if __name__ == '__main__':
    run_tests()
`,
    },
    rubricCriteria: {
      functionality: '40 pts: Correct grid coordinate calculation and battery tracking.',
      edgeCases: '30 pts: Safely handles empty commands and battery running out.',
      complexity: '15 pts: Clean linear loop processing without unnecessary complexity.',
      codeStyle: '15 pts: Readable variable names and clear comments.',
    },
    isSubmitted: false,
    isVerified: false,
  },
];

export const INITIAL_SQUADS: GurukulSquad[] = [
  {
    id: 'squad-beginners',
    name: 'Python Learners Club',
    joinCode: 'PY2026',
    description: 'A friendly group of learners mastering programming step by step.',
    members: [
      { userId: 'u-1', username: 'kavya-reddy', fullName: 'Kavya Reddy', role: 'member', contributionXp: 200 },
      { userId: 'u-2', username: 'priya-p', fullName: 'Priya Patel', role: 'member', contributionXp: 180 },
    ],
    collectiveXp: 380,
    weeklyGoal: 'Complete Rescue the Robot challenge',
    activeChallenge: 'Robot Grid Navigation',
    progressPercentage: 75,
  },
];
