// Dronacharya Code Dungeon: The Python Chronicles
// Game Engine Specifications for 5 Playable RPG Campaign Levels

export type TileType =
  | 'stone'
  | 'wall'
  | 'spike'
  | 'lava'
  | 'gem'
  | 'switch'
  | 'gate'
  | 'enemy'
  | 'boss'
  | 'crystal'
  | 'portal'
  | 'chest';

export type Direction = 'up' | 'down' | 'left' | 'right';

export interface TileData {
  x: number;
  y: number;
  type: TileType;
  entityId?: string;
  isOpen?: boolean;
  isToggled?: boolean;
  hp?: number;
  maxHp?: number;
  enemyType?: 'goblin' | 'skeleton' | 'boss';
}

export interface EnemyEntity {
  id: string;
  name: string;
  type: 'goblin' | 'skeleton' | 'boss';
  x: number;
  y: number;
  hp: number;
  maxHp: number;
  attackPower: number;
  distance?: number;
}

export interface GemEntity {
  id: string;
  x: number;
  y: number;
  collected: boolean;
  distance?: number;
}

export interface SwitchEntity {
  id: string;
  x: number;
  y: number;
  toggled: boolean;
  targetGateId?: string;
}

export interface GateEntity {
  id: string;
  x: number;
  y: number;
  isOpen: boolean;
}

export interface CrystalEntity {
  id: string;
  x: number;
  y: number;
  used: boolean;
}

export interface GameFrame {
  tick: number;
  actionType:
    | 'idle'
    | 'move'
    | 'attack'
    | 'collect'
    | 'toggle'
    | 'say'
    | 'hurt'
    | 'heal'
    | 'victory'
    | 'fizzle';
  fromPos: { x: number; y: number };
  toPos: { x: number; y: number };
  facing: Direction;
  targetId?: string;
  heroHp: number;
  maxHp: number;
  logMessage: string;
  sourceLine?: number;
  damageTaken?: number;
  damageDealt?: number;
  floatingText?: { text: string; color: string };
  soundToPlay?:
    | 'move'
    | 'attack'
    | 'collect'
    | 'switch'
    | 'damage'
    | 'victory'
    | 'fizzle'
    | 'heal';
  tileMutations?: { x: number; y: number; newType: TileType }[];
  speechBubble?: string;
  enemyHps?: Record<string, number>;
  bossHp?: number;
  shakeScreen?: boolean;
  gemsCount?: number;
}

export interface DungeonCampaignLevel {
  levelNumber: number;
  title: string;
  subtitle: string;
  concept: string;
  story: string;
  parLines: number;
  xpReward: number;
  gridWidth: number;
  gridHeight: number;
  startX: number;
  startY: number;
  startFacing: Direction;
  portalX: number;
  portalY: number;
  initialTiles: TileData[];
  enemies: EnemyEntity[];
  gems: GemEntity[];
  switches: SwitchEntity[];
  gates: GateEntity[];
  crystals: CrystalEntity[];
  initialCode: string;
  solutionExample: string;
  objectives: { id: string; label: string; completed?: boolean }[];
  hints: string[];
}

export interface DungeonSimulationResult {
  success: boolean;
  frames: GameFrame[];
  finalHp: number;
  finalX: number;
  finalY: number;
  gemsCollected: number;
  totalGems: number;
  codeLines: number;
  parLines: number;
  starsEarned: 1 | 2 | 3;
  completedGoals: Record<string, boolean>;
  logs: string[];
  diagnostic?: {
    state: 'success' | 'failure' | 'error';
    summary: string;
    socraticHint: string;
    suggestedSnippet: string;
    errorLine?: number;
    rawTraceback?: string;
  };
}

export const DIR_OFFSETS: Record<Direction, { dx: number; dy: number }> = {
  up: { dx: 0, dy: -1 },
  down: { dx: 0, dy: 1 },
  left: { dx: -1, dy: 0 },
  right: { dx: 1, dy: 0 },
};

function createBaseArena(width: number, height: number): TileData[] {
  const tiles: TileData[] = [];
  for (let y = 0; y < height; y++) {
    for (let x = 0; x < width; x++) {
      const isBorder = x === 0 || x === width - 1 || y === 0 || y === height - 1;
      tiles.push({
        x,
        y,
        type: isBorder ? 'wall' : 'stone',
      });
    }
  }
  return tiles;
}

// 5 Playable Levels for "The Python Chronicles"
export const DUNGEON_CAMPAIGN_LEVELS: Record<number, DungeonCampaignLevel> = {
  // =========================================================================
  // LEVEL 1: DUNGEON AWAKENING (Functions & Arguments)
  // =========================================================================
  1: {
    levelNumber: 1,
    title: 'Dungeon Awakening',
    subtitle: 'Methods & Arguments',
    concept: 'Calling methods on the hero object and passing integer steps.',
    story:
      'Awaken, young Pyromancer! The dungeon corridors are strewn with glittering Mana Gems. Call hero.move_right(), hero.move_down(), and hero.collect() to navigate the corridor, dodge the ancient spike traps, and reach the Sanctuary Portal!',
    parLines: 6,
    xpReward: 150,
    gridWidth: 10,
    gridHeight: 8,
    startX: 1,
    startY: 1,
    startFacing: 'right',
    portalX: 8,
    portalY: 6,
    objectives: [
      { id: 'collect_all_gems', label: 'Collect all 3 Mana Gems (💎 x3)' },
      { id: 'reach_portal', label: 'Reach the Sanctuary Portal at (8, 6)' },
      { id: 'par_efficiency', label: 'Mastery: Clear in 6 lines of code or less (⭐⭐⭐)' },
    ],
    hints: [
      'Call hero.move_right(3) to walk 3 tiles in a single line!',
      'When you are standing on or next to a gem, call hero.collect().',
      'Avoid stepping on the spike traps at (4, 1) and (6, 3).',
    ],
    initialCode: `# Level 1: Dungeon Awakening (Functions & Arguments)
# Goal: Grab all 3 gems and reach the portal in under 6 lines!
#
# Available commands:
#   hero.move_right(steps=1)
#   hero.move_down(steps=1)
#   hero.move_left(steps=1)
#   hero.move_up(steps=1)
#   hero.collect()

hero.move_right(2)
hero.collect()
hero.move_down(3)
hero.collect()
hero.move_right(5)
hero.move_down(2)
hero.collect()
`,
    solutionExample: `hero.move_right(3)
hero.collect()
hero.move_down(3)
hero.collect()
hero.move_right(4)
hero.collect()
hero.move_down(2)`,
    enemies: [],
    gems: [
      { id: 'gem-1', x: 3, y: 1, collected: false },
      { id: 'gem-2', x: 3, y: 4, collected: false },
      { id: 'gem-3', x: 7, y: 4, collected: false },
    ],
    switches: [],
    gates: [],
    crystals: [],
    initialTiles: (() => {
      const tiles = createBaseArena(10, 8);
      const setT = (x: number, y: number, t: TileType) => {
        const found = tiles.find((item) => item.x === x && item.y === y);
        if (found) found.type = t;
      };

      // Interior maze walls
      setT(4, 2, 'wall');
      setT(4, 3, 'wall');
      setT(6, 4, 'wall');
      setT(6, 5, 'wall');

      // Spike traps (hazard)
      setT(4, 1, 'spike');
      setT(6, 3, 'spike');

      // Gems
      setT(3, 1, 'gem');
      setT(3, 4, 'gem');
      setT(7, 4, 'gem');

      // Portal
      setT(8, 6, 'portal');

      return tiles;
    })(),
  },

  // =========================================================================
  // LEVEL 2: THE REPEATING GAUNTLET (for & while Loops)
  // =========================================================================
  2: {
    levelNumber: 2,
    title: 'The Repeating Gauntlet',
    subtitle: 'Loops & Iteration',
    concept: 'Iterating with for loops and range() to avoid repetitive code.',
    story:
      'The Great Bridge of Loops stretches ahead with 5 evenly spaced gem stations. Brute force will fail: the dungeon sentinels enforce a strict 6-line code limit! Harness the power of a "for i in range(5):" loop to march forward and collect all treasures!',
    parLines: 6,
    xpReward: 200,
    gridWidth: 10,
    gridHeight: 8,
    startX: 1,
    startY: 3,
    startFacing: 'right',
    portalX: 8,
    portalY: 3,
    objectives: [
      { id: 'collect_all_gems', label: 'Collect all 5 Bridge Gems (💎 x5)' },
      { id: 'reach_portal', label: 'Reach the Bridge Gateway at (8, 3)' },
      { id: 'par_efficiency', label: 'Code Limit: Complete in under 6 lines using a loop (⭐⭐⭐)' },
    ],
    hints: [
      'Write "for i in range(5):" to execute code repeatedly.',
      'Inside the loop, move right and collect the gem at each station.',
      'Do not write copy-pasted commands: stay under the 6-line par limit!',
    ],
    initialCode: `# Level 2: The Repeating Gauntlet (Loops & range)
# Goal: Collect the 5 gems along the bridge and reach the portal!
# 3-STAR CHALLENGE: Strict 6-line code limit! Use a for loop.

for i in range(5):
    hero.move_right(1)
    hero.collect()

hero.move_right(2)
`,
    solutionExample: `for i in range(5):
    hero.move_right(1)
    hero.collect()
hero.move_right(2)`,
    enemies: [],
    gems: [
      { id: 'gem-1', x: 2, y: 3, collected: false },
      { id: 'gem-2', x: 3, y: 3, collected: false },
      { id: 'gem-3', x: 4, y: 3, collected: false },
      { id: 'gem-4', x: 5, y: 3, collected: false },
      { id: 'gem-5', x: 6, y: 3, collected: false },
    ],
    switches: [],
    gates: [],
    crystals: [],
    initialTiles: (() => {
      const tiles = createBaseArena(10, 8);
      const setT = (x: number, y: number, t: TileType) => {
        const found = tiles.find((item) => item.x === x && item.y === y);
        if (found) found.type = t;
      };

      // Lava flanks the bridge
      for (let x = 1; x < 9; x++) {
        setT(x, 2, 'lava');
        setT(x, 4, 'lava');
      }

      // Gems on the bridge
      for (let x = 2; x <= 6; x++) {
        setT(x, 3, 'gem');
      }

      // Portal at (8, 3)
      setT(8, 3, 'portal');

      return tiles;
    })(),
  },

  // =========================================================================
  // LEVEL 3: SHADOWS IN THE CORRIDOR (if / elif / else & Sensors)
  // =========================================================================
  3: {
    levelNumber: 3,
    title: 'Shadows in the Corridor',
    subtitle: 'Conditionals & Sensors',
    concept: 'Using hero.look_ahead() with if/elif/else to react to live hazards.',
    story:
      'Darkness enshrouds the Whispering Corridor! Ahead lie random obstacles: lurking Goblins, deadly Spikes, and valuable Gems. Use hero.look_ahead() to inspect the tile in front of you. If it is a goblin, strike with hero.attack()! If it is a gem, collect it!',
    parLines: 12,
    xpReward: 250,
    gridWidth: 10,
    gridHeight: 8,
    startX: 1,
    startY: 3,
    startFacing: 'right',
    portalX: 8,
    portalY: 3,
    objectives: [
      { id: 'defeat_goblins', label: 'Defeat all lurking Goblins along the hall' },
      { id: 'collect_gems', label: 'Gather the gems scattered along the way' },
      { id: 'reach_portal', label: 'Reach the Sanctuary Portal unharmed' },
      { id: 'par_efficiency', label: 'Mastery: Solve within 12 lines using if/elif/else (⭐⭐⭐)' },
    ],
    hints: [
      'Call "tile = hero.look_ahead()" to scan what is directly ahead.',
      'Use "if tile == \'goblin\': hero.attack()" to vanquish monsters.',
      'Use "elif tile == \'gem\': hero.move_right(); hero.collect()".',
    ],
    initialCode: `# Level 3: Shadows in the Corridor (Conditionals & Sensors)
# Goal: Inspect each tile ahead before moving!
# If goblin -> attack, if gem -> collect, else -> advance!

for step in range(7):
    tile = hero.look_ahead()
    if tile == "goblin":
        hero.attack()
    elif tile == "gem":
        hero.move_right()
        hero.collect()
    else:
        hero.move_right()
`,
    solutionExample: `for step in range(7):
    tile = hero.look_ahead()
    if tile == "goblin":
        hero.attack()
    elif tile == "gem":
        hero.move_right()
        hero.collect()
    else:
        hero.move_right()`,
    enemies: [
      {
        id: 'goblin-1',
        name: 'Shadow Goblin',
        type: 'goblin',
        x: 3,
        y: 3,
        hp: 30,
        maxHp: 30,
        attackPower: 15,
      },
      {
        id: 'goblin-2',
        name: 'Cave Goblin',
        type: 'goblin',
        x: 6,
        y: 3,
        hp: 30,
        maxHp: 30,
        attackPower: 15,
      },
    ],
    gems: [
      { id: 'gem-1', x: 2, y: 3, collected: false },
      { id: 'gem-2', x: 5, y: 3, collected: false },
    ],
    switches: [],
    gates: [],
    crystals: [],
    initialTiles: (() => {
      const tiles = createBaseArena(10, 8);
      const setT = (x: number, y: number, t: TileType) => {
        const found = tiles.find((item) => item.x === x && item.y === y);
        if (found) found.type = t;
      };

      // Hallway walls
      for (let x = 1; x < 9; x++) {
        setT(x, 2, 'wall');
        setT(x, 4, 'wall');
      }

      setT(2, 3, 'gem');
      setT(3, 3, 'enemy');
      setT(5, 3, 'gem');
      setT(6, 3, 'enemy');
      setT(8, 3, 'portal');

      return tiles;
    })(),
  },

  // =========================================================================
  // LEVEL 4: THE ALCHEMIST'S ARRAY (Lists & Custom Functions `def`)
  // =========================================================================
  4: {
    levelNumber: 4,
    title: "The Alchemist's Array",
    subtitle: 'Lists & Custom Functions',
    concept: 'Defining helper functions with def and iterating through target lists.',
    story:
      'The ancient Alchemist Citadel requires an automated combat protocol! Four Skeletons guard the central chambers. Write a reusable function "def clear_targets(targets):" that iterates over the enemy list returned by hero.get_enemies(), dispatches each foe, and triggers the pressure switch to unlock the Citadel Gate!',
    parLines: 15,
    xpReward: 300,
    gridWidth: 10,
    gridHeight: 8,
    startX: 1,
    startY: 2,
    startFacing: 'right',
    portalX: 8,
    portalY: 5,
    objectives: [
      { id: 'define_function', label: 'Define custom function "def clear_targets(targets):"' },
      { id: 'defeat_all_skeletons', label: 'Vanquish all Skeletons in the room' },
      { id: 'unlock_gate', label: 'Step on the switch to unlock the Iron Gate' },
      { id: 'par_efficiency', label: 'Mastery: Complete in 15 lines of code or less (⭐⭐⭐)' },
    ],
    hints: [
      'Define "def clear_targets(targets):" to encapsulate your attack sequence.',
      'Get active enemies using "enemies = hero.get_enemies()".',
      'Walk to the switch at (7, 2) and call hero.toggle_switch() to open the gate!',
    ],
    initialCode: `# Level 4: The Alchemist's Array (Lists & Functions)
# Goal: Define a reusable function to clear enemies and open the gate!

def clear_targets(targets):
    for enemy in targets:
        # Move adjacent to enemy and attack!
        hero.attack()

# 1. Defeat adjacent enemies
enemies = hero.get_enemies()
clear_targets(enemies)

# 2. Advance to the pressure switch and toggle it
hero.move_right(5)
hero.toggle_switch()

# 3. Walk through the unlocked gate to the portal!
hero.move_down(3)
hero.move_right(1)
`,
    solutionExample: `def clear_targets(targets):
    for enemy in targets:
        hero.move_right(enemy["distance"])
        hero.attack()

enemies = hero.get_enemies()
clear_targets(enemies)
hero.move_right(2)
hero.toggle_switch()
hero.move_down(3)
hero.move_right(1)`,
    enemies: [
      {
        id: 'skel-1',
        name: 'Bone Sentinel',
        type: 'skeleton',
        x: 3,
        y: 2,
        hp: 35,
        maxHp: 35,
        attackPower: 20,
      },
      {
        id: 'skel-2',
        name: 'Crypt Knight',
        type: 'skeleton',
        x: 5,
        y: 2,
        hp: 35,
        maxHp: 35,
        attackPower: 20,
      },
    ],
    gems: [{ id: 'gem-1', x: 4, y: 2, collected: false }],
    switches: [{ id: 'switch-1', x: 7, y: 2, toggled: false, targetGateId: 'gate-1' }],
    gates: [{ id: 'gate-1', x: 7, y: 5, isOpen: false }],
    crystals: [],
    initialTiles: (() => {
      const tiles = createBaseArena(10, 8);
      const setT = (x: number, y: number, t: TileType) => {
        const found = tiles.find((item) => item.x === x && item.y === y);
        if (found) found.type = t;
      };

      // Interior chamber walls
      for (let x = 1; x < 7; x++) {
        setT(x, 4, 'wall');
      }

      setT(3, 2, 'enemy');
      setT(4, 2, 'gem');
      setT(5, 2, 'enemy');
      setT(7, 2, 'switch');
      setT(7, 5, 'gate');
      setT(8, 5, 'portal');

      return tiles;
    })(),
  },

  // =========================================================================
  // LEVEL 5: BOSS BATTLE — THE SYNTAX GOLEM (Algorithmic Mastery)
  // =========================================================================
  5: {
    levelNumber: 5,
    title: 'The Syntax Golem Boss Battle',
    subtitle: 'Algorithmic Mastery',
    concept: 'Combining loops, health monitoring, crystals, and boss combat.',
    story:
      'The ancient Titan of corrupted syntax awakens at the chamber core! The Syntax Golem has 150 HP and deals massive shockwaves. Write an algorithmic combat loop that attacks the Golem while actively monitoring hero.hp. If health falls below 40, retreat to the Healing Crystal before resuming combat!',
    parLines: 20,
    xpReward: 500,
    gridWidth: 10,
    gridHeight: 10,
    startX: 5,
    startY: 8,
    startFacing: 'up',
    portalX: 5,
    portalY: 1,
    objectives: [
      { id: 'engage_boss', label: 'Confront the Syntax Golem at the arena center' },
      { id: 'heal_hero', label: 'Monitor hero.hp and heal at the crystal if HP < 40' },
      { id: 'defeat_boss', label: 'Shatter the Syntax Golem (Reduce HP to 0)' },
      { id: 'par_efficiency', label: 'Mastery: Defeat the Boss in 20 lines of code or less (⭐⭐⭐)' },
    ],
    hints: [
      'Call "hero.distance_to(\'boss\')" to check how many tiles remain.',
      'Check "hero.hp": if it falls below 40, move left to the crystal at (2, 5) and hero.collect()!',
      'Keep striking with hero.attack() until the Boss HP reaches 0.',
    ],
    initialCode: `# Level 5: Boss Battle — The Syntax Golem (Mastery)
# Defeat the 150 HP Syntax Golem!
# IMPORTANT: If hero.hp < 40, heal at the Crystal before attacking!

hero.say("Prepare yourself, Syntax Golem!")

# 1. Approach the Golem
hero.move_up(3)

# 2. Combat Loop: Monitor health and strike
for round in range(6):
    if hero.hp < 40:
        hero.move_left(3)
        hero.collect()  # Absorb Healing Crystal (+40 HP)
        hero.move_right(3)
    hero.attack()

# 3. Enter the Sanctuary Gateway!
hero.move_up(4)
`,
    solutionExample: `hero.say("Prepare yourself, Syntax Golem!")
hero.move_up(3)
for round in range(6):
    if hero.hp < 40:
        hero.move_left(3)
        hero.collect()
        hero.move_right(3)
    hero.attack()
hero.move_up(4)`,
    enemies: [
      {
        id: 'boss-golem',
        name: 'Syntax Golem Titan',
        type: 'boss',
        x: 5,
        y: 4,
        hp: 150,
        maxHp: 150,
        attackPower: 25,
      },
    ],
    gems: [],
    switches: [],
    gates: [],
    crystals: [{ id: 'crystal-1', x: 2, y: 5, used: false }],
    initialTiles: (() => {
      const tiles = createBaseArena(10, 10);
      const setT = (x: number, y: number, t: TileType) => {
        const found = tiles.find((item) => item.x === x && item.y === y);
        if (found) found.type = t;
      };

      // Arena hazards
      setT(3, 4, 'spike');
      setT(7, 4, 'spike');
      setT(3, 6, 'lava');
      setT(7, 6, 'lava');

      // Healing Crystal at left flank
      setT(2, 5, 'crystal');

      // Syntax Golem Boss at (5, 4)
      setT(5, 4, 'boss');

      // Exit Portal at (5, 1)
      setT(5, 1, 'portal');

      return tiles;
    })(),
  },
};

// Backward-compatible alias for existing imports
export const DUNGEON_FLOORS = DUNGEON_CAMPAIGN_LEVELS;
export type DungeonFloorSpec = DungeonCampaignLevel;
export interface DungeonInventory {
  wood: number;
  stone: number;
  iron: number;
  crystal: number;
  bridge: number;
  key: number;
  blade: number;
  shield: number;
}
export interface CraftingRecipe {
  id: keyof DungeonInventory;
  name: string;
  icon: string;
  description: string;
  requirements: Partial<Record<keyof DungeonInventory, number>>;
  resultCount: number;
}
export const CRAFTING_RECIPES: CraftingRecipe[] = [];
