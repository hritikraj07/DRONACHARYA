// Dronacharya Master Curriculum Data & Diagnostic Trials
import { LearningPath, MasterySeal, CapstoneProject, GurukulSquad } from '@/types';

export const INITIAL_SKILLS = [
  { id: 'py.recursion.base_case', name: 'Recursive Base Cases', domain: 'Algorithms', description: 'Terminating recursive call stacks safely' },
  { id: 'py.recursion.memoization', name: 'Memoization & Overlap', domain: 'Algorithms', description: 'Caching recursive outputs to prevent O(2^n) exponential blowup' },
  { id: 'py.ds.doubly_linked_list', name: 'Doubly-Linked Lists', domain: 'Data Structures', description: 'Bidirectional pointer traversal and O(1) removal' },
  { id: 'py.ds.hash_map', name: 'Hash Map Lookup', domain: 'Data Structures', description: 'Amortized O(1) key-value access and collision handling' },
  { id: 'sys.cache.lru_eviction', name: 'LRU Cache Eviction', domain: 'Systems', description: 'Least Recently Used cache invalidation and memory boundaries' },
  { id: 'ml.hyperparameters', name: 'ML Hyperparameters', domain: 'Machine Learning', description: 'Learning rate, batch size, and regularization tradeoffs' },
];

export const DIAGNOSTIC_QUESTIONS = [
  {
    id: 'diag-01',
    difficulty: 'foundational',
    skillId: 'py.recursion.base_case',
    title: 'The Infinite Spiral',
    prompt: 'Look at the following Python function. What will occur when `countdown(3)` is executed?',
    codeSnippet: 'def countdown(n):\n    print(n)\n    return countdown(n - 1)',
    options: [
      { id: 'a', text: 'It prints 3, 2, 1, 0 and halts normally.' },
      { id: 'b', text: 'It triggers a RecursionError due to missing base condition.', isCorrect: true },
      { id: 'c', text: 'It prints 3 indefinitely without error.' },
      { id: 'd', text: 'It returns None after printing 3.' },
    ],
    explanation: 'Without a stopping condition (e.g., `if n <= 0: return`), the call stack grows continuously until exceeding the maximum recursion depth.',
  },
  {
    id: 'diag-02',
    difficulty: 'intermediate',
    skillId: 'py.recursion.memoization',
    title: 'Exponential Redundancy',
    prompt: 'A naive recursive Fibonacci implementation `fib(n) = fib(n-1) + fib(n-2)` takes O(2^n) time. Why?',
    options: [
      { id: 'a', text: 'Because addition of integers takes exponential time in Python.' },
      { id: 'b', text: 'Because it repeatedly recomputes the exact same subproblems in recursive branches.', isCorrect: true },
      { id: 'c', text: 'Because Python handles memory poorly for integers above 100.' },
      { id: 'd', text: 'Because the base case is evaluated twice per call.' },
    ],
    explanation: 'Subproblems like `fib(3)` are evaluated multiple times across branches. Caching (memoization) reduces complexity to linear O(n).',
  },
  {
    id: 'diag-03',
    difficulty: 'advanced',
    skillId: 'sys.cache.lru_eviction',
    title: 'Optimal Cache Eviction',
    prompt: 'Which combination of data structures allows both O(1) key retrieval and O(1) least-recently-used node eviction?',
    options: [
      { id: 'a', text: 'Binary Search Tree + Array' },
      { id: 'b', text: 'Hash Map + Doubly-Linked List', isCorrect: true },
      { id: 'c', text: 'Sorted Array + Circular Queue' },
      { id: 'd', text: 'Min-Heap + Stack' },
    ],
    explanation: 'A Hash Map provides O(1) key-to-node lookup, while a Doubly-Linked List allows O(1) node detachment and insertion at the head/tail.',
  },
];

export const INITIAL_LEARNING_PATHS: LearningPath[] = [
  {
    id: 'python-algorithms',
    title: 'Python Computational Mastery',
    slug: 'python-algorithms',
    category: 'algorithms',
    description: 'Master algorithmic thinking, recursion, and optimal data structures through interactive Gurukul trials.',
    icon: 'Terminal',
    missions: [
      {
        id: 'mission-fib-labyrinth',
        pathId: 'python-algorithms',
        sequenceOrder: 1,
        title: 'The Labyrinth of Fibonacci',
        subtitle: 'Dynamic Recursion & Terminating Conditions',
        narrativeContext: 'An automated postal transit hub in Varanasi must compute parcel delivery costs across branching transit networks. A naive implementation is crashing their dispatch nodes.',
        conceptBriefing: 'Recursion requires two pillars: a Base Case that provides immediate return, and a Recursive Step that breaks the problem into smaller identical units.',
        conceptVisualType: 'call-tree',
        primarySkillId: 'py.recursion.base_case',
        xpReward: 120,
        estTimeMinutes: 15,
        isUnlocked: true,
        isCompleted: false,
        initialCode: `# Mission 1: The Labyrinth of Fibonacci
# Problem: Compute route_cost(n) such that:
#   route_cost(0) = 0
#   route_cost(1) = 1
#   route_cost(n) = route_cost(n-1) + route_cost(n-2)

def route_cost(n: int) -> int:
    # BUG: Missing base conditions! Fix this function.
    return route_cost(n - 1) + route_cost(n - 2)
`,
        solutionPattern: 'if n <= 1: return n',
        visibleTests: [
          { id: 't1', inputDescription: 'route_cost(0)', expectedOutput: '0', codeSnippet: 'assert route_cost(0) == 0' },
          { id: 't2', inputDescription: 'route_cost(1)', expectedOutput: '1', codeSnippet: 'assert route_cost(1) == 1' },
          { id: 't3', inputDescription: 'route_cost(6)', expectedOutput: '8', codeSnippet: 'assert route_cost(6) == 8' },
        ],
        hiddenTests: [
          { id: 't4', inputDescription: 'route_cost(10)', expectedOutput: '55', codeSnippet: 'assert route_cost(10) == 55', isHidden: true },
          { id: 't5', inputDescription: 'route_cost(12)', expectedOutput: '144', codeSnippet: 'assert route_cost(12) == 144', isHidden: true },
        ],
      },
      {
        id: 'mission-memo-vault',
        pathId: 'python-algorithms',
        sequenceOrder: 2,
        title: 'The Memoization Vault',
        subtitle: 'Eliminating Exponential Redundancy',
        narrativeContext: 'The postal network route cost function works for small values, but calculating route_cost(35) freezes the server for over 5 seconds. You must implement a cache dictionary.',
        conceptBriefing: 'Memoization stores previously calculated results in a dictionary. Before executing recursive calls, check if the argument exists in the lookup table.',
        conceptVisualType: 'hash-map',
        primarySkillId: 'py.recursion.memoization',
        xpReward: 160,
        estTimeMinutes: 20,
        isUnlocked: false,
        isCompleted: false,
        initialCode: `# Mission 2: The Memoization Vault
# Optimize route_cost with a memo dictionary to run in O(n) linear time.

memo = {}

def fast_route_cost(n: int) -> int:
    # TODO: Check if n in memo, return cached answer.
    # Otherwise calculate and store in memo before returning.
    if n <= 1:
        return n
    return fast_route_cost(n - 1) + fast_route_cost(n - 2)
`,
        solutionPattern: 'if n in memo: return memo[n]',
        visibleTests: [
          { id: 'm1', inputDescription: 'fast_route_cost(10)', expectedOutput: '55', codeSnippet: 'assert fast_route_cost(10) == 55' },
          { id: 'm2', inputDescription: 'fast_route_cost(30)', expectedOutput: '832040', codeSnippet: 'assert fast_route_cost(30) == 832040' },
        ],
        hiddenTests: [
          { id: 'm3', inputDescription: 'fast_route_cost(40)', expectedOutput: '102334155', codeSnippet: 'assert fast_route_cost(40) == 102334155', isHidden: true },
        ],
      },
      {
        id: 'mission-hash-sifter',
        pathId: 'python-algorithms',
        sequenceOrder: 3,
        title: 'The Anagram Sifter',
        subtitle: 'Hash Map Frequency Verification',
        narrativeContext: 'Ancient Sanskrit manuscripts were transcribed across multiple palm leaves. You must build an algorithm to verify whether two verses are exact anagrams of each other.',
        conceptBriefing: 'A Hash Map tracks character frequencies. In O(n) time, compare letter counts across both words.',
        conceptVisualType: 'hash-map',
        primarySkillId: 'py.ds.hash_map',
        xpReward: 180,
        estTimeMinutes: 20,
        isUnlocked: false,
        isCompleted: false,
        initialCode: `# Mission 3: The Anagram Sifter
# Return True if s1 and s2 contain identical character frequencies.

def is_verse_anagram(s1: str, s2: str) -> bool:
    # TODO: Implement frequency counter dictionary
    pass
`,
        solutionPattern: 'counts = {}',
        visibleTests: [
          { id: 'a1', inputDescription: 'is_verse_anagram("listen", "silent")', expectedOutput: 'True', codeSnippet: 'assert is_verse_anagram("listen", "silent") is True' },
          { id: 'a2', inputDescription: 'is_verse_anagram("drona", "arjuna")', expectedOutput: 'False', codeSnippet: 'assert is_verse_anagram("drona", "arjuna") is False' },
        ],
        hiddenTests: [
          { id: 'a3', inputDescription: 'is_verse_anagram("gurukul", "kulugur")', expectedOutput: 'True', codeSnippet: 'assert is_verse_anagram("gurukul", "kulugur") is True', isHidden: true },
        ],
      },
    ],
  },
];

export const INITIAL_SEALS: MasterySeal[] = [
  {
    id: 'seal-recursive-archer',
    title: 'Seal of the Recursive Archer',
    category: 'Algorithms & Data Structures',
    description: 'Awarded for mastering terminating conditions and call stack safety with zero infinite loops.',
    iconName: 'Target',
    requiredSkillId: 'py.recursion.base_case',
    verificationHash: 'd7a8f3b2049e7d81c4e20984ba16a903e61a49c9f82d1c7e90e72c81a2e9b04d',
    isUnlocked: false,
  },
  {
    id: 'seal-memoization-vault',
    title: 'Seal of the Memoization Vault',
    category: 'Algorithms & Complexity',
    description: 'Awarded for collapsing O(2^n) exponential recursion down to linear O(n) runtime.',
    iconName: 'Zap',
    requiredSkillId: 'py.recursion.memoization',
    verificationHash: '8b3c9f21e05d4a7b98c34f12a87d09e53b61c7849e01f2a34b5c6d7e8f901a2b',
    isUnlocked: false,
  },
  {
    id: 'seal-lru-architect',
    title: 'Seal of the Cache Architect',
    category: 'Systems Engineering',
    description: 'Awarded for completing the multi-file LRU In-Memory Cache Capstone with TTL eviction.',
    iconName: 'Server',
    requiredSkillId: 'sys.cache.lru_eviction',
    verificationHash: 'e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855',
    isUnlocked: false,
  },
];

export const INITIAL_CAPSTONES: CapstoneProject[] = [
  {
    id: 'lru-cache-project',
    title: 'In-Memory Cache with TTL & LRU Eviction',
    slug: 'lru-cache-project',
    category: 'Systems & Data Structures',
    description: 'Architect a production-ready, high-throughput in-memory cache supporting O(1) lookups, least-recently-used (LRU) invalidation, and Time-to-Live (TTL) key expiration.',
    learningObjectives: [
      'Implement an O(1) key-value store using Hash Maps and Doubly-Linked Lists.',
      'Handle deterministic eviction when capacity limit is breached.',
      'Simulate automated TTL background cleanup with timestamp expiry.',
      'Pass multi-threaded stress and edge-case unit test suites.',
    ],
    prerequisites: ['Python OOP', 'Doubly-Linked Lists', 'Hash Maps'],
    milestones: [
      { id: 'm1', title: 'Milestone 1: Doubly-Linked Node & List', description: 'Create Node and LinkedList with insert_head and remove_node methods.', testChecklist: ['O(1) node detachment', 'Null head/tail pointers check'], isCompleted: false },
      { id: 'm2', title: 'Milestone 2: LRU Cache Core', description: 'Combine HashMap with LinkedList to achieve get() and put() in O(1).', testChecklist: ['Capacity overflow eviction', 'Access time touch updates'], isCompleted: false },
      { id: 'm3', title: 'Milestone 3: TTL Timestamp Expiry', description: 'Store expiry timestamps and invalidate stale entries on retrieval.', testChecklist: ['Expired keys return None', 'Active keys preserved'], isCompleted: false },
    ],
    starterFiles: {
      'cache.py': `# In-Memory Cache Implementation
from typing import Any, Optional
import time

class Node:
    def __init__(self, key: str, value: Any, ttl_seconds: Optional[int] = None):
        self.key = key
        self.value = value
        self.expiry = time.time() + ttl_seconds if ttl_seconds else None
        self.prev = None
        self.next = None

class LRUCacheWithTTL:
    def __init__(self, capacity: int):
        self.capacity = capacity
        self.lookup = {}
        # TODO: Implement dummy head and tail nodes
        self.head = Node("__HEAD__", None)
        self.tail = Node("__TAIL__", None)
        self.head.next = self.tail
        self.tail.prev = self.head

    def get(self, key: str) -> Optional[Any]:
        # TODO: Return value if not expired, move to head
        return None

    def put(self, key: str, value: Any, ttl_seconds: Optional[int] = None) -> None:
        # TODO: Insert or update, evict tail if capacity exceeded
        pass
`,
      'test_cache.py': `# Unit Test Harness
def run_tests():
    # Test suite verifying O(1) behavior and TTL
    print("Testing LRU Cache...")
`,
    },
    rubricCriteria: {
      functionality: '40 pts: Correct get, put, delete, and eviction behavior across 10 tests.',
      edgeCases: '25 pts: Zero capacity, duplicate updates, and expired TTL edge cases.',
      complexity: '20 pts: Strict O(1) runtime operations without full-list scans.',
      codeStyle: '15 pts: Type hints, modular separation, and docstrings.',
    },
    isSubmitted: false,
    isVerified: false,
  },
];

export const INITIAL_SQUADS: GurukulSquad[] = [
  {
    id: 'squad-kashi-coders',
    name: 'Kashi Algorithmic Guild',
    joinCode: 'KASHI7',
    description: 'Focused on systems programming, high-performance data structures, and competitive problem-solving.',
    members: [
      { userId: 'u-1', username: 'kavya-reddy', fullName: 'Kavya Reddy', role: 'leader', contributionXp: 840 },
      { userId: 'u-2', username: 'priya-patel', fullName: 'Priya Patel', role: 'member', contributionXp: 520 },
      { userId: 'u-3', username: 'rohit-v', fullName: 'Rohit Verma', role: 'member', contributionXp: 380 },
    ],
    collectiveXp: 1740,
    weeklyGoal: 'Complete 10 Recursive & Dynamic Programming Missions',
    activeChallenge: 'The Distributed Hash Ring Simulation',
    progressPercentage: 68,
  },
];
