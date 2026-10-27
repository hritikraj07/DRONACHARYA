// Dronacharya Hierarchical Course & Curriculum System
// Hierarchy: COURSES -> CHAPTERS -> LESSONS -> EXERCISES -> MISSIONS -> CHALLENGES -> PROJECTS
// Full Python 101 learning path with stories, explanations, examples, interactive exercises, 4-tier hints, boss challenges, and game mission links.

export interface ExerciseTestCase {
  inputDescription: string;
  expectedOutput: string;
  codeSnippet: string; // e.g. "stdout:Hello, World!" or "result == 50"
}

export interface Exercise {
  id: string;
  type: 'code' | 'predict';
  title: string;
  instructions: string;
  prompt: string;
  initialCode: string;
  solutionCode: string;
  testCases: ExerciseTestCase[];
  predictOptions?: { id: string; text: string; isCorrect: boolean }[];
  explanation: string;
  hints: [string, string, string, string]; // [Conceptual, Directional, Debugging, CodeSnippet]
  xpReward: number;
}

export interface Lesson {
  id: string;
  chapterId: string;
  sequenceOrder: number;
  title: string;
  subtitle: string;
  storyIntro: string;
  storyIntroHinglish?: string;
  conceptExplanation: string;
  conceptExplanationHinglish?: string;
  codeExample: string;
  codeExampleExplanation: string;
  interactiveTryStarter: string;
  tryExplanation: string;
  exercise: Exercise;
  connectedGameMissionId?: string;
  xpReward: number;
}

export interface BossChallenge {
  id: string;
  title: string;
  description: string;
  objective: string;
  starterCode: string;
  solutionCode: string;
  testCases: ExerciseTestCase[];
  hints: string[];
  xpReward: number;
}

export interface Chapter {
  id: string;
  courseId: string;
  chapterNumber: number;
  title: string;
  conceptName: string;
  description: string;
  realmName: string; // Connected to World Map: Starter Village, Variable Valley, etc.
  iconName: string;
  color: string;
  lessons: Lesson[];
  bossChallenge: BossChallenge;
  connectedGameMissionId?: string;
  connectedProjectId?: string;
}

export interface Course {
  id: string;
  slug: string;
  title: string;
  language: string;
  level: 'Beginner' | 'Intermediate' | 'Advanced';
  tagline: string;
  description: string;
  totalChapters: number;
  totalLessons: number;
  xpReward: number;
  iconName: string;
  badgeText: string;
  badgeColor: string;
  isAvailable: boolean;
  chapters: Chapter[];
}

export const COURSES_CATALOG: Course[] = [
  {
    id: 'python-101',
    slug: 'python-realm',
    title: 'Python 101: The Python Realm',
    language: 'Python',
    level: 'Beginner',
    tagline: 'Learn real Python programming through code-driven adventure missions.',
    description: 'Master core programming fundamentals from your first print statement to variables, branching conditions, loops, lists, and reusable functions. Control autonomous rover Arya in interactive 2D simulations.',
    totalChapters: 8,
    totalLessons: 18,
    xpReward: 1200,
    iconName: 'Terminal',
    badgeText: 'Fully Playable',
    badgeColor: 'bg-[#10B981] text-white',
    isAvailable: true,
    chapters: [
      {
        id: 'py-ch-1',
        courseId: 'python-101',
        chapterNumber: 1,
        title: 'Chapter 1: Hello World & Syntax',
        conceptName: 'Text Output & Syntax Fundamentals',
        description: 'Wake the stranded field rover Arya with your very first code incantation. Learn print(), strings, and case-sensitive syntax.',
        realmName: 'Starter Village',
        iconName: 'Sparkles',
        color: '#6C5CE7',
        lessons: [
          {
            id: 'py-less-1-1',
            chapterId: 'py-ch-1',
            sequenceOrder: 1,
            title: 'Lesson 1.1: The First Incantation',
            subtitle: 'Awaken the Rover with print()',
            storyIntro: 'Deep inside the ancient Digital Gurukul, an autonomous exploration rover named Arya sits powered down. A flashing green terminal awaits your transmission. In Python, programmers use the `print()` command to speak to computers and output text to the console screen.',
            storyIntroHinglish: 'Digital Gurukul ke andar Arya naam ka autonomous exploration rover band pada hai. Python me computer se baat karne ke liye aur console pe message bhejne ke liye hum `print()` command use karte hain.',
            conceptExplanation: 'The `print()` function displays text on the screen. Any words enclosed in quotes (like `"Hello"`) are called **Strings**. The parentheses `()` instruct Python to execute the function.',
            conceptExplanationHinglish: '`print()` function screen par text dikhata hai. Quotes ke andar likhi cheezein `"Hello"` Strings kahlati hain. Parentheses `()` Python ko command execute karne ke liye bolti hain.',
            codeExample: `print("Hello, World!")
print("Rover Arya online.")`,
            codeExampleExplanation: 'Line 1 sends "Hello, World!" to the screen. Line 2 prints a status message on a new line.',
            interactiveTryStarter: `print("Hello, Gurukul!")
print("System diagnostic initialized.")`,
            tryExplanation: 'Click "Run Example" to see how Python executes each line from top to bottom.',
            xpReward: 30,
            exercise: {
              id: 'ex-1-1',
              type: 'code',
              title: 'Exercise: Transmit the Beacon Signal',
              instructions: 'Write a Python program that prints the message: `Beacon Activated`',
              prompt: 'Use the `print()` function with double quotes around the message.',
              initialCode: `# Write your print statement below:
`,
              solutionCode: `print("Beacon Activated")`,
              testCases: [
                {
                  inputDescription: 'Console outputs "Beacon Activated"',
                  expectedOutput: 'Beacon Activated',
                  codeSnippet: 'stdout:Beacon Activated',
                },
              ],
              explanation: 'The `print("Beacon Activated")` statement transmits the string directly to the stdout console.',
              hints: [
                'In Python, displaying text requires the print() command.',
                'Enclose the text in double quotes inside the parentheses: print("...")',
                'Make sure the spelling and capitalization match: "Beacon Activated"',
                'Write: print("Beacon Activated")',
              ],
              xpReward: 40,
            },
          },
          {
            id: 'py-less-1-2',
            chapterId: 'py-ch-1',
            sequenceOrder: 2,
            title: 'Lesson 1.2: Numbers vs. Text Strings',
            subtitle: 'Quotes make strings; raw numbers calculate',
            storyIntro: 'Rover Arya needs to report both its name and its current radar coordinates. Notice that when you print a number without quotes, Python treats it as a numerical value ready for math!',
            storyIntroHinglish: 'Rover Arya ko apna naam aur radar coordinates batane hain. Jab aap bina quotes ke number likhte hain, toh Python usko mathematical number manta hai!',
            conceptExplanation: 'Text inside quotes like `"100"` is a string (characters). A number without quotes like `100` is an integer. You can print multiple items by separating them with commas: `print("Battery:", 100)`.',
            conceptExplanationHinglish: 'Quotes ke andar `"100"` ek text string hai, jabki bina quotes ke `100` ek integer number hai. Comma laga ke aap ek sath print kar sakte hain.',
            codeExample: `print("Battery Level:", 100)
print("Sensors Active:", 4)`,
            codeExampleExplanation: 'Commas inside print() automatically insert a single space between the arguments.',
            interactiveTryStarter: `print("Coordinates:", 12, 45)
print("Status:", "Nominal")`,
            tryExplanation: 'Run this to see how commas join strings and numbers seamlessly.',
            xpReward: 30,
            exercise: {
              id: 'ex-1-2',
              type: 'code',
              title: 'Exercise: Report Rover Telemetry',
              instructions: 'Print the exact text: `Power: 95` using `print("Power:", 95)` or a combined string.',
              prompt: 'Transmit the power level to the base station.',
              initialCode: `# Print the power reading:
`,
              solutionCode: `print("Power:", 95)`,
              testCases: [
                {
                  inputDescription: 'Console outputs "Power: 95"',
                  expectedOutput: 'Power: 95',
                  codeSnippet: 'stdout:Power: 95',
                },
              ],
              explanation: 'Separating the string "Power:" and the integer 95 with a comma outputs "Power: 95".',
              hints: [
                'You can pass multiple items to print() separated by commas.',
                'The first argument should be "Power:" and the second 95.',
                'Write: print("Power:", 95)',
                'Code: print("Power:", 95)',
              ],
              xpReward: 40,
            },
          },
        ],
        bossChallenge: {
          id: 'boss-ch-1',
          title: "Boss Challenge: The Oracle's Transmission",
          description: 'To clear Chapter 1 and unlock Variable Valley, transmit a 2-line official telemetry dispatch.',
          objective: 'Output Line 1: `DRONACHARYA ROVER ONLINE` and Line 2: `SECTOR: 7`',
          starterCode: `# Transmit the 2-line Oracle broadcast:
`,
          solutionCode: `print("DRONACHARYA ROVER ONLINE")
print("SECTOR:", 7)`,
          testCases: [
            {
              inputDescription: 'Contains "DRONACHARYA ROVER ONLINE"',
              expectedOutput: 'DRONACHARYA ROVER ONLINE',
              codeSnippet: 'stdout:DRONACHARYA ROVER ONLINE',
            },
            {
              inputDescription: 'Contains "SECTOR: 7"',
              expectedOutput: 'SECTOR: 7',
              codeSnippet: 'stdout:SECTOR: 7',
            },
          ],
          hints: [
            'Use two separate print() statements.',
            'Line 1 prints "DRONACHARYA ROVER ONLINE". Line 2 prints "SECTOR: 7".',
          ],
          xpReward: 80,
        },
      },
      {
        id: 'py-ch-2',
        courseId: 'python-101',
        chapterNumber: 2,
        title: 'Chapter 2: Variables & Data Types',
        conceptName: 'Storing Information in Variables',
        description: 'Variables are labeled boxes in computer memory. Store energy levels, names, and calculate rover speed.',
        realmName: 'Variable Valley',
        iconName: 'Cpu',
        color: '#FBBF24',
        lessons: [
          {
            id: 'py-less-2-1',
            chapterId: 'py-ch-2',
            sequenceOrder: 1,
            title: 'Lesson 2.1: Memory Containers',
            subtitle: 'Assigning values with the = operator',
            storyIntro: 'Rover Arya cannot just recite static numbers—its battery changes as it explores! In Python, we store values inside named variables so we can read and modify them later.',
            storyIntroHinglish: 'Arya rover static numbers par nahi chal sakta—uski battery travel karte waqt kam-jyada hoti hai! Python me hum values ko variables me store karte hain.',
            conceptExplanation: 'Think of a variable as a labeled container. Write `variable_name = value`. For example: `battery = 80`. To read the value later, simply use the variable name.',
            conceptExplanationHinglish: 'Variable ek labeled dabba jaisa hota hai. `battery = 80` likhne se 80 value battery naam ke variable me store ho jati hai.',
            codeExample: `rover_name = "Arya"
battery_pct = 85
print("Rover:", rover_name)
print("Battery:", battery_pct)`,
            codeExampleExplanation: 'Here, `rover_name` holds text and `battery_pct` holds an integer.',
            interactiveTryStarter: `energy = 50
energy = energy + 25
print("Total Energy:", energy)`,
            tryExplanation: 'Notice how the value of energy was updated from 50 to 75!',
            xpReward: 35,
            exercise: {
              id: 'ex-2-1',
              type: 'code',
              title: 'Exercise: Create an Energy Variable',
              instructions: 'Create a variable named `shields` and set it to `100`. Then print `shields`.',
              prompt: 'Store 100 in shields and print it.',
              initialCode: `# Create the shields variable and print it:
`,
              solutionCode: `shields = 100
print(shields)`,
              testCases: [
                {
                  inputDescription: 'Output displays 100',
                  expectedOutput: '100',
                  codeSnippet: 'stdout:100',
                },
              ],
              explanation: 'Assigning `shields = 100` stores the integer, and `print(shields)` reads and outputs it.',
              hints: [
                'Write the variable name, then an equals sign, then 100.',
                'shields = 100',
                'Next line: print(shields)',
                'Code:\nshields = 100\nprint(shields)',
              ],
              xpReward: 45,
            },
          },
          {
            id: 'py-less-2-2',
            chapterId: 'py-ch-2',
            sequenceOrder: 2,
            title: 'Lesson 2.2: Calculations & Arithmetic',
            subtitle: 'Using +, -, *, / to compute coordinates',
            storyIntro: 'The rover calculates travel time by multiplying its current distance by speed. Python provides built-in arithmetic operators for instant math.',
            storyIntroHinglish: 'Rover travel time calculate karne ke liye distance aur speed ko multiply karta hai. Python me math operators built-in hote hain.',
            conceptExplanation: 'Python supports: `+` (addition), `-` (subtraction), `*` (multiplication), `/` (division), and `%` (remainder).',
            conceptExplanationHinglish: 'Python me `+`, `-`, `*`, `/`, `%` operators se calculations ki ja sakti hain.',
            codeExample: `speed = 5
time = 10
distance = speed * time
print("Distance covered:", distance)`,
            codeExampleExplanation: 'The `*` symbol multiplies 5 by 10 to assign 50 into `distance`.',
            interactiveTryStarter: `current_battery = 90
consumption_per_km = 4
km_traveled = 5
remaining = current_battery - (consumption_per_km * km_traveled)
print("Remaining Battery:", remaining)`,
            tryExplanation: 'Calculates 90 - (4 * 5) = 70.',
            xpReward: 35,
            exercise: {
              id: 'ex-2-2',
              type: 'code',
              title: 'Exercise: Calculate Total Power Cells',
              instructions: 'Given `base_cells = 4` and `bonus_cells = 6`, calculate `total = base_cells + bonus_cells` and print `total`.',
              prompt: 'Sum base_cells and bonus_cells.',
              initialCode: `base_cells = 4
bonus_cells = 6
# Calculate total and print it:
`,
              solutionCode: `base_cells = 4
bonus_cells = 6
total = base_cells + bonus_cells
print(total)`,
              testCases: [
                {
                  inputDescription: 'Total equals 10',
                  expectedOutput: '10',
                  codeSnippet: 'stdout:10',
                },
              ],
              explanation: 'Adding 4 and 6 stores 10 into `total`, which is printed.',
              hints: [
                'Use the + operator to add base_cells and bonus_cells.',
                'total = base_cells + bonus_cells',
                'Then: print(total)',
                'Code:\ntotal = base_cells + bonus_cells\nprint(total)',
              ],
              xpReward: 45,
            },
          },
        ],
        bossChallenge: {
          id: 'boss-ch-2',
          title: 'Boss Challenge: Telemetry Energy Calculator',
          description: 'Calculate remaining rover power after moving across 3 exploration sectors.',
          objective: 'Given `start_energy = 100` and `drain = 15`, calculate `final_energy = start_energy - (drain * 3)` and print `final_energy`.',
          starterCode: `start_energy = 100
drain = 15
# Calculate and print final_energy:
`,
          solutionCode: `start_energy = 100
drain = 15
final_energy = start_energy - (drain * 3)
print(final_energy)`,
          testCases: [
            {
              inputDescription: 'Outputs 55 (100 - 45)',
              expectedOutput: '55',
              codeSnippet: 'stdout:55',
            },
          ],
          hints: [
            'Multiply drain by 3, then subtract from start_energy.',
            'final_energy = start_energy - (drain * 3)',
            'print(final_energy)',
          ],
          xpReward: 90,
        },
      },
      {
        id: 'py-ch-3',
        courseId: 'python-101',
        chapterNumber: 3,
        title: 'Chapter 3: Conditions & Decision Making',
        conceptName: 'if, elif, and else logic',
        description: 'Give the rover autonomous judgment. Check battery thresholds and make choices using boolean conditions.',
        realmName: 'Decision Forest',
        iconName: 'Compass',
        color: '#10B981',
        lessons: [
          {
            id: 'py-less-3-1',
            chapterId: 'py-ch-3',
            sequenceOrder: 1,
            title: 'Lesson 3.1: If / Else Branching',
            subtitle: 'Branching execution paths based on truth',
            storyIntro: 'Rover Arya reaches a crossroads in the Decision Forest. If battery is above 20%, it can safely take the rocky shortcut; otherwise, it must reroute to the solar station!',
            storyIntroHinglish: 'Arya ek chauraha par pahunchta hai. Agar battery 20% se jyada hai toh shortcut le sakta hai, nahi toh solar charging station jana hoga!',
            conceptExplanation: 'An `if` statement checks a condition. If true, the indented block runs. If false, the `else` block runs.',
            conceptExplanationHinglish: '`if` statement condition check karta hai. Agar sach hai toh `if` block chalega, varna `else` block chalega.',
            codeExample: `battery = 45

if battery > 20:
    print("Path Safe")
else:
    print("Recharge Needed")`,
            codeExampleExplanation: 'Since 45 > 20 is True, Python outputs "Path Safe".',
            interactiveTryStarter: `battery = 15

if battery > 20:
    print("Path Safe")
else:
    print("Recharge Needed")`,
            tryExplanation: 'Change battery to 15 and see the else branch execute!',
            xpReward: 40,
            exercise: {
              id: 'ex-3-1',
              type: 'code',
              title: 'Exercise: Sensor Threat Check',
              instructions: 'Given `threat_level = 7`, write an if statement: if `threat_level > 5`, print `Shields Up`, otherwise print `All Clear`.',
              prompt: 'Implement the shield condition check.',
              initialCode: `threat_level = 7
# Write your if / else logic below:
`,
              solutionCode: `threat_level = 7
if threat_level > 5:
    print("Shields Up")
else:
    print("All Clear")`,
              testCases: [
                {
                  inputDescription: 'Outputs "Shields Up" for threat_level = 7',
                  expectedOutput: 'Shields Up',
                  codeSnippet: 'stdout:Shields Up',
                },
              ],
              explanation: '7 > 5 evaluates to True, triggering the if branch.',
              hints: [
                'Start with: if threat_level > 5:',
                'Indent the next line with 4 spaces: print("Shields Up")',
                'Add the else: branch on unindented line.',
                'Code:\nif threat_level > 5:\n    print("Shields Up")\nelse:\n    print("All Clear")',
              ],
              xpReward: 50,
            },
          },
        ],
        bossChallenge: {
          id: 'boss-ch-3',
          title: 'Boss Challenge: Security Gate Protocol',
          description: 'Evaluate sensor clearance codes to grant access to Loop Lab.',
          objective: 'Given `passcode = 77`, if passcode == 77 print `Access Granted`, else print `Access Denied`.',
          starterCode: `passcode = 77
# Check passcode:
`,
          solutionCode: `passcode = 77
if passcode == 77:
    print("Access Granted")
else:
    print("Access Denied")`,
          testCases: [
            {
              inputDescription: 'Outputs "Access Granted"',
              expectedOutput: 'Access Granted',
              codeSnippet: 'stdout:Access Granted',
            },
          ],
          hints: ['Use == to compare equality in Python.'],
          xpReward: 90,
        },
      },
      {
        id: 'py-ch-4',
        courseId: 'python-101',
        chapterNumber: 4,
        title: 'Chapter 4: Loops & Repetition',
        conceptName: 'For Loops & Code-Controlled Navigation',
        description: 'Automate repetitive tasks. Write loops to move Rover Arya across grid mazes and collect scattered energy cells.',
        realmName: 'Loop Lab',
        iconName: 'RotateCcw',
        color: '#EF4444',
        connectedGameMissionId: 'mission-rescue-robot',
        lessons: [
          {
            id: 'py-less-4-1',
            chapterId: 'py-ch-4',
            sequenceOrder: 1,
            title: 'Lesson 4.1: The Power of For Loops',
            subtitle: 'Repeat instructions using range(n)',
            storyIntro: 'Instead of typing `robot.move_right()` five times in a row, programmers use loops! A single loop can command the rover to move 5, 50, or 500 steps cleanly.',
            storyIntroHinglish: 'Ek hi command ko 5 baar likhne ki jagah, programmers loop use karte hain! Ek chhota loop rover ko 5 ya 500 steps move karwa sakta hai.',
            conceptExplanation: '`for step in range(5):` tells Python to repeat the indented block 5 times, with `step` taking values 0, 1, 2, 3, and 4.',
            conceptExplanationHinglish: '`for step in range(5):` block ko 5 baar repeat karta hai.',
            codeExample: `for step in range(3):
    print("Stepping forward:", step)`,
            codeExampleExplanation: 'Outputs "Stepping forward: 0", "Stepping forward: 1", "Stepping forward: 2".',
            interactiveTryStarter: `total_moves = 0
for i in range(4):
    total_moves = total_moves + 1
    print("Move #", total_moves)
print("Finished navigation.")`,
            tryExplanation: 'The indented print runs 4 times. The final print runs once at the end.',
            xpReward: 40,
            exercise: {
              id: 'ex-4-1',
              type: 'code',
              title: 'Exercise: Loop 5 Propulsion Steps',
              instructions: 'Write a for loop that iterates 5 times using `range(5)`. Inside the loop, print `Pulse`.',
              prompt: 'Repeat print("Pulse") 5 times with a loop.',
              initialCode: `# Write a for loop using range(5):
`,
              solutionCode: `for i in range(5):
    print("Pulse")`,
              testCases: [
                {
                  inputDescription: 'Prints "Pulse" 5 times',
                  expectedOutput: 'Pulse\nPulse\nPulse\nPulse\nPulse',
                  codeSnippet: 'stdout:Pulse',
                },
              ],
              explanation: 'A for loop with range(5) executes its body exactly 5 times.',
              hints: [
                'Start with: for i in range(5):',
                'Indent the body: print("Pulse")',
                'Code:\nfor i in range(5):\n    print("Pulse")',
                'Write: for i in range(5):\n    print("Pulse")',
              ],
              xpReward: 50,
            },
          },
        ],
        bossChallenge: {
          id: 'boss-ch-4',
          title: 'Boss Challenge: Rescue the Robot Maze (Playable Game)',
          description: 'Navigate Rover Arya across the 6x6 research grid to the extraction beacon at (5, 5) while picking up battery cells.',
          objective: 'Drive the real 2D game rover to the beacon using Python loops.',
          starterCode: `# Command rover across the 6x6 grid:
for i in range(2):
    robot.move_right()
robot.collect()
for i in range(3):
    robot.move_right()
for i in range(5):
    robot.move_down()
`,
          solutionCode: `for i in range(2):
    robot.move_right()
robot.collect()
for i in range(3):
    robot.move_right()
for i in range(5):
    robot.move_down()`,
          testCases: [
            {
              inputDescription: 'Reaches coordinates (5, 5)',
              expectedOutput: 'Target Reached',
              codeSnippet: 'rescue_robot_sim',
            },
          ],
          hints: [
            'Use robot.move_right() and robot.move_down().',
            'Pick up the battery at (2, 0) using robot.collect().',
          ],
          xpReward: 150,
        },
      },
      {
        id: 'py-ch-5',
        courseId: 'python-101',
        chapterNumber: 5,
        title: 'Chapter 5: Lists & Data Collections',
        conceptName: 'Storing & Iterating Collections',
        description: 'Organize groups of items. Filter damaged battery cells on an automated conveyor belt in the laser scanner.',
        realmName: 'Array Islands',
        iconName: 'Layers',
        color: '#3B82F6',
        connectedGameMissionId: 'mission-hazard-filter',
        lessons: [
          {
            id: 'py-less-5-1',
            chapterId: 'py-ch-5',
            sequenceOrder: 1,
            title: 'Lesson 5.1: Creating and Summing Lists',
            subtitle: 'Square brackets [] hold collections',
            storyIntro: 'Rover Arya has gathered a basket of energy cells. Each cell has an energy rating. In Python, square brackets `[]` create a List to hold multiple items together.',
            storyIntroHinglish: 'Arya ne kayi battery cells collect kiye hain. Python me `[]` square brackets se list banti hai jisme kayi items ek sath store hote hain.',
            conceptExplanation: '`cells = [10, 20, 30]` creates a list with three numbers. You can loop through each item with `for cell in cells:`.',
            conceptExplanationHinglish: '`cells = [10, 20, 30]` se ek list banti hai. `for cell in cells:` se hum har item ko bari-bari access kar sakte hain.',
            codeExample: `cells = [10, 25, 15]
total = 0
for c in cells:
    total = total + c
print("Total Energy:", total)`,
            codeExampleExplanation: 'Loops through 10, 25, 15 and sums them to 50.',
            interactiveTryStarter: `readings = [5, 10, 15, 20]
print("Number of readings:", len(readings))
print("First reading:", readings[0])
print("Sum:", sum(readings))`,
            tryExplanation: 'Python provides built-in helpers like len() and sum() for lists!',
            xpReward: 45,
            exercise: {
              id: 'ex-5-1',
              type: 'code',
              title: 'Exercise: Sum Healthy Battery Cells',
              instructions: 'Given `inventory = [20, 30, 40]`, calculate the sum of all elements into `total_power` and print `total_power`.',
              prompt: 'Calculate sum of [20, 30, 40].',
              initialCode: `inventory = [20, 30, 40]
# Calculate and print total_power:
`,
              solutionCode: `inventory = [20, 30, 40]
total_power = sum(inventory)
print(total_power)`,
              testCases: [
                {
                  inputDescription: 'Total equals 90',
                  expectedOutput: '90',
                  codeSnippet: 'stdout:90',
                },
              ],
              explanation: 'Summing 20 + 30 + 40 yields 90.',
              hints: [
                'You can use sum(inventory) or a for loop.',
                'total_power = sum(inventory)',
                'print(total_power)',
                'Code:\ninventory = [20, 30, 40]\ntotal_power = sum(inventory)\nprint(total_power)',
              ],
              xpReward: 55,
            },
          },
        ],
        bossChallenge: {
          id: 'boss-ch-5',
          title: 'Boss Challenge: Filter Damaged Cells (Playable Laser Chamber)',
          description: 'Filter corrupted samples from the conveyor belt into the hazard chute while routing healthy cells to the matrix vault.',
          objective: 'Process the cell stream using list conditions.',
          starterCode: `def filter_healthy_cells(battery_cells):
    total = 0
    for cell in battery_cells:
        if cell > 0:
            total += cell
    return total
`,
          solutionCode: `def filter_healthy_cells(battery_cells):
    total = 0
    for cell in battery_cells:
        if cell > 0:
            total += cell
    return total`,
          testCases: [
            {
              inputDescription: 'filter_healthy_cells([10, -5, 20]) == 30',
              expectedOutput: '30',
              codeSnippet: 'print(filter_healthy_cells([10, -5, 20]))',
            },
          ],
          hints: ['Check if cell > 0 before adding to total.'],
          xpReward: 160,
        },
      },
      {
        id: 'py-ch-6',
        courseId: 'python-101',
        chapterNumber: 6,
        title: 'Chapter 6: Functions & Reusability',
        conceptName: 'Defining Modular Procedures',
        description: 'Package your logic into reusable functions with `def`. Write procedures that take parameters and return answers.',
        realmName: 'Function Fortress',
        iconName: 'Code2',
        color: '#8B5CF6',
        lessons: [
          {
            id: 'py-less-6-1',
            chapterId: 'py-ch-6',
            sequenceOrder: 1,
            title: 'Lesson 6.1: Defining Functions with def',
            subtitle: 'Write once, call anywhere',
            storyIntro: 'The engineers at Function Fortress do not rewrite the rover propulsion formulas every time. They encapsulate instructions into a Function that can be called with a single word.',
            storyIntroHinglish: 'Function Fortress ke engineers bar-bar same code nahi likhte. Wo code ko ek Function me pack kar dete hain jise ek naam se call kiya ja sake.',
            conceptExplanation: 'Define a function using `def function_name(param):`. Inside, perform actions and send back results using `return`.',
            conceptExplanationHinglish: '`def function_name(a, b):` se function banta hai aur `return` se output wapas milta hai.',
            codeExample: `def recharge(current, boost):
    return current + boost

print(recharge(50, 30))`,
            codeExampleExplanation: 'Calls recharge with 50 and 30, returning 80.',
            interactiveTryStarter: `def calculate_speed(distance, time):
    return distance / time

print("Rover Speed:", calculate_speed(100, 5))`,
            tryExplanation: 'The function divides 100 by 5 to return 20.0.',
            xpReward: 45,
            exercise: {
              id: 'ex-6-1',
              type: 'code',
              title: 'Exercise: Write a Doubler Function',
              instructions: 'Define a function `double_energy(amount)` that returns `amount * 2`. Call it with `25` and print the result.',
              prompt: 'Create double_energy and print double_energy(25).',
              initialCode: `# Define double_energy(amount) below:
`,
              solutionCode: `def double_energy(amount):
    return amount * 2

print(double_energy(25))`,
              testCases: [
                {
                  inputDescription: 'double_energy(25) outputs 50',
                  expectedOutput: '50',
                  codeSnippet: 'stdout:50',
                },
              ],
              explanation: 'The function receives 25, multiplies by 2, returns 50, which is printed.',
              hints: [
                'Write: def double_energy(amount):',
                '    return amount * 2',
                'print(double_energy(25))',
                'Code:\ndef double_energy(amount):\n    return amount * 2\nprint(double_energy(25))',
              ],
              xpReward: 55,
            },
          },
        ],
        bossChallenge: {
          id: 'boss-ch-6',
          title: 'Boss Challenge: Autonomous Patrol Command System',
          description: 'Construct a multi-parameter function `patrol_cost(steps, cost_per_step)` that calculates total battery required.',
          objective: 'Define patrol_cost(steps, cost_per_step) returning steps * cost_per_step.',
          starterCode: `# Define patrol_cost:
`,
          solutionCode: `def patrol_cost(steps, cost_per_step):
    return steps * cost_per_step

print(patrol_cost(10, 4))`,
          testCases: [
            {
              inputDescription: 'patrol_cost(10, 4) outputs 40',
              expectedOutput: '40',
              codeSnippet: 'stdout:40',
            },
          ],
          hints: ['Multiply steps by cost_per_step and return the result.'],
          xpReward: 120,
        },
      },
      {
        id: 'py-ch-7',
        courseId: 'python-101',
        chapterNumber: 7,
        title: 'Chapter 7: Debugging & Bug-to-Battle',
        conceptName: 'Diagnosing & Fixing Syntax and Logic Errors',
        description: 'Every great programmer is a master detective. Learn to read error tracebacks, off-by-one errors, and squash software bugs.',
        realmName: 'Debugging Dungeon',
        iconName: 'ShieldAlert',
        color: '#F97316',
        lessons: [
          {
            id: 'py-less-7-1',
            chapterId: 'py-ch-7',
            sequenceOrder: 1,
            title: 'Lesson 7.1: Syntax and Indentation Traps',
            subtitle: 'Colons, parentheses, and indentation depth',
            storyIntro: 'A corrupted transmission entered the dungeon! The code crashed with a `SyntaxError`. In Python, every loop, if statement, and function MUST end with a colon `:` and have indented code underneath.',
            storyIntroHinglish: 'Dungeon me ek kharab code mila jo `SyntaxError` de raha hai! Python me har loop, if, aur def ke baad colon `:` lagana aur indentation rakhna zaroori hota hai.',
            conceptExplanation: 'Common errors include missing colons `: `, unclosed quotes `"`, and mismatched parentheses `()`. Always check the line number indicated in the traceback.',
            conceptExplanationHinglish: 'Colons bhul jana ya quotes close na karna sabse common errors hote hain.',
            codeExample: `# Buggy Code:
# if battery > 50
#     print("Safe")

# Corrected Code:
battery = 60
if battery > 50:
    print("Safe")`,
            codeExampleExplanation: 'Notice the colon `:` after the condition.',
            interactiveTryStarter: `# Fix the missing colon below:
speed = 20
if speed > 10:
    print("Speed OK")`,
            tryExplanation: 'Ensure the colon is present and the line is indented.',
            xpReward: 45,
            exercise: {
              id: 'ex-7-1',
              type: 'code',
              title: 'Exercise: Fix the Corrupted Print',
              instructions: 'The code below has an unclosed quote and missing parenthesis. Fix the bugs so it prints `System Restored`.',
              prompt: 'Fix the syntax error in the code.',
              initialCode: `print("System Restored
`,
              solutionCode: `print("System Restored")`,
              testCases: [
                {
                  inputDescription: 'Outputs "System Restored"',
                  expectedOutput: 'System Restored',
                  codeSnippet: 'stdout:System Restored',
                },
              ],
              explanation: 'Adding the closing quote and closing parenthesis resolves the SyntaxError.',
              hints: [
                'Ensure the string ends with a closing quote: "',
                'Ensure the print function ends with a closing parenthesis: )',
                'print("System Restored")',
                'Code: print("System Restored")',
              ],
              xpReward: 55,
            },
          },
        ],
        bossChallenge: {
          id: 'boss-ch-7',
          title: 'Boss Challenge: The Corrupted Archive',
          description: 'A critical routine has 3 combined syntax and logic errors. Repair all of them to pass the test suite.',
          objective: 'Fix the function so calculate_energy([5, 10, 15]) returns 30.',
          starterCode: `def calculate_energy(cells):
    total = 0
    for c in cells:
        total = total + c
    return total

print(calculate_energy([5, 10, 15]))
`,
          solutionCode: `def calculate_energy(cells):
    total = 0
    for c in cells:
        total = total + c
    return total

print(calculate_energy([5, 10, 15]))`,
          testCases: [
            {
              inputDescription: 'calculate_energy([5, 10, 15]) outputs 30',
              expectedOutput: '30',
              codeSnippet: 'stdout:30',
            },
          ],
          hints: ['Make sure the loop accumulates all items and returns total.'],
          xpReward: 140,
        },
      },
      {
        id: 'py-ch-8',
        courseId: 'python-101',
        chapterNumber: 8,
        title: 'Chapter 8: Project Kingdom',
        conceptName: 'Capstone Project & Rubric Verification',
        description: 'Prove real mastery by engineering complete production capstones. Submit code for automated unit tests and rubric evaluation.',
        realmName: 'Project Kingdom',
        iconName: 'Award',
        color: '#FBBF24',
        connectedProjectId: 'capstone-rover-navigator',
        lessons: [
          {
            id: 'py-less-8-1',
            chapterId: 'py-ch-8',
            sequenceOrder: 1,
            title: 'Lesson 8.1: Capstone Specification & Verification',
            subtitle: 'Engineering full-scale navigation modules',
            storyIntro: 'You have crossed from the Starter Village to the Project Kingdom! Now, you are invited to assemble the full autonomous navigation module in the Capstone Workspace.',
            storyIntroHinglish: 'Aapne Starter Village se Project Kingdom tak ka safar tay kar liya hai! Ab aap Capstone Workspace me pura autonomous navigation system banayenge.',
            conceptExplanation: 'Capstones evaluate: 1. Functionality (40%), 2. Edge Cases (25%), 3. Complexity (20%), and 4. Code Style (15%). Passing mints a cryptographically signed Mastery Seal to your public portfolio.',
            conceptExplanationHinglish: 'Capstones aapke pure program ki quality, edge cases aur code style ko test karte hain.',
            codeExample: `# Multi-file Capstone Structure:
# - robot_navigator.py (Core pathfinding loop)
# - grid.py (Obstacle detection)
# - battery.py (Consumption thresholds)`,
            codeExampleExplanation: 'Real industry projects are organized into clean modular files.',
            interactiveTryStarter: `print("Ready to enter Capstone Kingdom.")`,
            tryExplanation: 'Open the Project Workspace to start your multi-file capstone.',
            xpReward: 50,
            exercise: {
              id: 'ex-8-1',
              type: 'code',
              title: 'Exercise: Verify Capstone Readiness',
              instructions: 'Print `Capstone Ready` to verify your environment.',
              prompt: 'Transmit the readiness signal.',
              initialCode: `# Print Capstone Ready:
`,
              solutionCode: `print("Capstone Ready")`,
              testCases: [
                {
                  inputDescription: 'Outputs "Capstone Ready"',
                  expectedOutput: 'Capstone Ready',
                  codeSnippet: 'stdout:Capstone Ready',
                },
              ],
              explanation: 'Environment verified.',
              hints: [
                'Concept: Check that your print() function outputs the exact capstone initialization string.',
                'Location: Type print("Capstone Ready") in your editor.',
                'Error: Make sure capitalization and quotes match "Capstone Ready".',
                'Solution: print("Capstone Ready")',
              ],
              xpReward: 50,
            },
          },
        ],
        bossChallenge: {
          id: 'boss-ch-8',
          title: 'Boss Challenge: Autonomous Rover Navigation Capstone',
          description: 'Deploy the full multi-file autonomous rover navigation program with battery optimization.',
          objective: 'Open the Capstone Workspace and submit for 100-point rubric verification.',
          starterCode: `print("Navigate to /projects for full Capstone Workspace.")`,
          solutionCode: `print("Navigate to /projects for full Capstone Workspace.")`,
          testCases: [
            {
              inputDescription: 'Direct link to /projects',
              expectedOutput: 'Capstone Workspace Available',
              codeSnippet: 'stdout:projects',
            },
          ],
          hints: ['Visit /projects to access the multi-file code studio.'],
          xpReward: 350,
        },
      },
    ],
  },
  {
    id: 'web-101',
    slug: 'web-development',
    title: 'Web Dev 101: Canvas & JavaScript',
    language: 'JavaScript',
    level: 'Intermediate',
    tagline: 'Interactive DOM Canvas, Event Listeners, and Game Loops.',
    description: 'Craft dynamic interactive canvases, responsive visual logic, and physics simulations using modern JavaScript.',
    totalChapters: 6,
    totalLessons: 14,
    xpReward: 950,
    iconName: 'Globe',
    badgeText: 'Curriculum in Training',
    badgeColor: 'bg-[#F2ECE0] text-[#7E7E8F] border border-[#1E1E24]',
    isAvailable: false,
    chapters: [],
  },
  {
    id: 'c-101',
    slug: 'c-programming',
    title: 'C 101: Memory Mazes & Pointers',
    language: 'C',
    level: 'Intermediate',
    tagline: 'Hardware Registers, Pointer Arithmetic, and Memory Safety.',
    description: 'Navigate memory pointers across hardware registers without buffer overruns. Master low-level memory control.',
    totalChapters: 6,
    totalLessons: 12,
    xpReward: 1100,
    iconName: 'Code2',
    badgeText: 'Curriculum in Training',
    badgeColor: 'bg-[#F2ECE0] text-[#7E7E8F] border border-[#1E1E24]',
    isAvailable: false,
    chapters: [],
  },
  {
    id: 'ai-101',
    slug: 'ai-basics',
    title: 'AI 101: Machine Perception',
    language: 'Python',
    level: 'Advanced',
    tagline: 'Perceptrons, Decision Trees, and Data Classifiers.',
    description: 'Train decision boundaries to identify anomalies and calibrate autonomous guards in complex research stations.',
    totalChapters: 5,
    totalLessons: 10,
    xpReward: 1300,
    iconName: 'Cpu',
    badgeText: 'Curriculum in Training',
    badgeColor: 'bg-[#F2ECE0] text-[#7E7E8F] border border-[#1E1E24]',
    isAvailable: false,
    chapters: [],
  },
];

/**
 * Helper to find a specific lesson by ID across all courses and chapters.
 */
export function findLessonById(lessonId: string): {
  lesson: Lesson;
  chapter: Chapter;
  course: Course;
  prevLesson: Lesson | null;
  nextLesson: Lesson | null;
} | null {
  for (const course of COURSES_CATALOG) {
    for (const chapter of course.chapters) {
      const idx = chapter.lessons.findIndex((l) => l.id === lessonId);
      if (idx !== -1) {
        const lesson = chapter.lessons[idx];
        const prevLesson = idx > 0 ? chapter.lessons[idx - 1] : null;
        const nextLesson = idx < chapter.lessons.length - 1 ? chapter.lessons[idx + 1] : null;
        return { lesson, chapter, course, prevLesson, nextLesson };
      }
    }
  }
  return null;
}

/**
 * Helper to find a course by slug or ID.
 */
export function findCourseBySlugOrId(idOrSlug: string): Course | null {
  return (
    COURSES_CATALOG.find((c) => c.id === idOrSlug || c.slug === idOrSlug) ||
    COURSES_CATALOG[0]
  );
}
