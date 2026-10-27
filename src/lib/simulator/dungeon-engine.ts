// Dronacharya Code Dungeon & Craft Realm Game Engine
// Deterministic 10x10 Voxel Sandbox & Dungeon Crawler Engine with 4 RPG Floors

export type TileType =
  | 'grass'
  | 'wall'
  | 'wood'
  | 'stone'
  | 'iron'
  | 'crystal'
  | 'lava'
  | 'water'
  | 'bridge'
  | 'chest'
  | 'mimic'
  | 'spike'
  | 'gate'
  | 'enemy'
  | 'boss'
  | 'portal';

export type Direction = 'up' | 'down' | 'left' | 'right';

export interface TileData {
  x: number;
  y: number;
  type: TileType;
  durability?: number;
  isMimic?: boolean;
  isOpen?: boolean;
  enemyHp?: number;
  maxHp?: number;
}

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

export interface DungeonSimulationFrame {
  stepIndex: number;
  action: 'idle' | 'move' | 'mine' | 'craft' | 'place' | 'attack' | 'scan' | 'damage' | 'victory';
  x: number;
  y: number;
  facing: Direction;
  hp: number;
  inventory: DungeonInventory;
  logMessage: string;
  targetCoord?: { x: number; y: number };
  tileMutations?: { x: number; y: number; newType: TileType }[];
  damageTaken?: number;
  floatingText?: { text: string; color: string };
  soundToPlay?: 'move' | 'mine' | 'craft' | 'place' | 'attack' | 'damage' | 'victory';
}

export interface DungeonFloorSpec {
  floorNumber: number;
  title: string;
  realmName: string;
  concept: string;
  story: string;
  xpReward: number;
  startX: number;
  startY: number;
  startFacing: Direction;
  portalX: number;
  portalY: number;
  initialTiles: TileData[];
  initialInventory: DungeonInventory;
  initialCode: string;
  solutionExample: string;
  subGoals: { id: string; label: string }[];
  hintPrompts: string[];
  bossData?: {
    name: string;
    hp: number;
    maxHp: number;
    weaknesses: string[];
    x: number;
    y: number;
    w: number;
    h: number;
  };
}

export interface DungeonSimulationResult {
  success: boolean;
  frames: DungeonSimulationFrame[];
  finalHp: number;
  finalX: number;
  finalY: number;
  finalInventory: DungeonInventory;
  completedGoals: Record<string, boolean>;
  logs: string[];
  diagnostic: {
    state: 'success' | 'failure' | 'error';
    summary: string;
    socraticHint: string;
    suggestedSnippet: string;
  };
}

// Direction vector helpers
export const DIR_OFFSETS: Record<Direction, { dx: number; dy: number }> = {
  up: { dx: 0, dy: -1 },
  down: { dx: 0, dy: 1 },
  left: { dx: -1, dy: 0 },
  right: { dx: 1, dy: 0 },
};

// Crafting Recipe Definitions
export interface CraftingRecipe {
  id: keyof DungeonInventory;
  name: string;
  icon: string;
  description: string;
  requirements: Partial<Record<keyof DungeonInventory, number>>;
  resultCount: number;
}

export const CRAFTING_RECIPES: CraftingRecipe[] = [
  {
    id: 'bridge',
    name: 'Wooden Bridge',
    icon: '🌉',
    description: 'Walkable bridge to place over lava and deep gaps.',
    requirements: { wood: 3 },
    resultCount: 1,
  },
  {
    id: 'bridge',
    name: 'Stone Bridge',
    icon: '🧱',
    description: 'Reinforced bridge crafted from stone quarry blocks.',
    requirements: { stone: 3, wood: 1 },
    resultCount: 1,
  },
  {
    id: 'key',
    name: 'Logic Key',
    icon: '🔑',
    description: 'Unlocks ancient dungeon sentinel gates.',
    requirements: { iron: 2, crystal: 1 },
    resultCount: 1,
  },
  {
    id: 'blade',
    name: 'Logic Blade',
    icon: '🗡️',
    description: 'Deals 50 damage to corrupted bug monsters.',
    requirements: { iron: 2, wood: 1 },
    resultCount: 1,
  },
  {
    id: 'shield',
    name: 'Mana Ward Shield',
    icon: '🛡️',
    description: 'Absorbs lethal spikes and boss shockwaves.',
    requirements: { crystal: 2, stone: 2 },
    resultCount: 1,
  },
];

// Helper to create empty 10x10 grid with stone border
function createBaseGrid(): TileData[] {
  const tiles: TileData[] = [];
  for (let y = 0; y < 10; y++) {
    for (let x = 0; x < 10; x++) {
      const isBorder = x === 0 || x === 9 || y === 0 || y === 9;
      tiles.push({
        x,
        y,
        type: isBorder ? 'wall' : 'grass',
      });
    }
  }
  return tiles;
}

// 4 Playable Dungeon Floors Specifications
export const DUNGEON_FLOORS: Record<number, DungeonFloorSpec> = {
  1: {
    floorNumber: 1,
    title: 'The Voxel Quarry',
    realmName: 'Variables & Data Types',
    concept: 'Variables & Resource Storing',
    story:
      'The ancient Quarry Chasm blocks the path to the Gurukul Citadel! Across the searing Lava River lies the Sanctuary Gateway. Harvest 3 Wood from the Whispering Trees, store them in your inventory variables, craft a Wooden Bridge, and place it across the lava to cross safely.',
    xpReward: 200,
    startX: 1,
    startY: 2,
    startFacing: 'right',
    portalX: 8,
    portalY: 4,
    initialInventory: {
      wood: 0,
      stone: 0,
      iron: 0,
      crystal: 0,
      bridge: 0,
      key: 0,
      blade: 0,
      shield: 0,
    },
    subGoals: [
      { id: 'mine_wood', label: 'Harvest at least 3 Wood blocks (🪵 x3)' },
      { id: 'craft_bridge', label: 'Craft a Bridge using hero.craft("bridge")' },
      { id: 'place_bridge', label: 'Place Bridge over Lava at column 6' },
      { id: 'reach_portal', label: 'Reach the Quarry Gateway at (8, 4)' },
    ],
    hintPrompts: [
      'How do I harvest wood?',
      'How do I craft the bridge?',
      'Why did I take damage in lava?',
      'Give me a Socratic hint 💡',
    ],
    initialCode: `# Floor 1: The Voxel Quarry (Variables & Data Types)
# Objective: Mine 3 Wood, craft a Bridge, and place it across the Lava River!
#
# Available Spellbook Commands:
#   hero.move("right" | "left" | "up" | "down", steps=1)
#   hero.mine("right" | "left" | "up" | "down")
#   hero.craft("bridge")
#   hero.place("bridge", "right" | "left" | "up" | "down")

# Step 1: Walk to the Whispering Tree at (2, 2)
hero.move("right")
hero.mine("right")

# Step 2: Harvest the remaining trees
hero.move("down")
hero.mine("right")
hero.move("up", 2)
hero.mine("right")

# Step 3: Craft the bridge using your 3 collected wood!
hero.craft("bridge")

# Step 4: Walk up to the Lava River and place the bridge!
# TODO: Move to (5, 4), place the bridge to the right, and walk through to (8, 4)!
hero.move("down", 3)
hero.move("right", 3)
hero.place("bridge", "right")
hero.move("right", 3)
`,
    solutionExample: `hero.move("right")
hero.mine("right")
hero.move("down")
hero.mine("right")
hero.move("up", 2)
hero.mine("right")
hero.craft("bridge")
hero.move("down", 3)
hero.move("right", 3)
hero.place("bridge", "right")
hero.move("right", 3)`,
    initialTiles: (() => {
      const g = createBaseGrid();
      const setTile = (x: number, y: number, type: TileType) => {
        const found = g.find((t) => t.x === x && t.y === y);
        if (found) found.type = type;
      };

      // Trees (Wood)
      setTile(2, 1, 'wood');
      setTile(3, 2, 'wood');
      setTile(2, 3, 'wood');

      // Stone blocks
      setTile(4, 1, 'stone');
      setTile(4, 7, 'stone');

      // Lava River down column 6
      for (let y = 1; y < 9; y++) {
        setTile(6, y, 'lava');
      }

      // Portal at (8, 4)
      setTile(8, 4, 'portal');

      return g;
    })(),
  },

  2: {
    floorNumber: 2,
    title: 'The Labyrinth of Loops',
    realmName: 'Loops & Sequences',
    concept: 'For & While Loops',
    story:
      'Rows of rare Mana Crystals line this subterranean cavern! Writing single commands is too tedious and drains stamina. Program a Python for-loop to harvest the 5 crystals in row 2, gather 2 Iron Ores, craft the ancient Logic Key, and unlock the Dungeon Gate to the Portal.',
    xpReward: 250,
    startX: 1,
    startY: 2,
    startFacing: 'right',
    portalX: 8,
    portalY: 8,
    initialInventory: {
      wood: 0,
      stone: 0,
      iron: 0,
      crystal: 0,
      bridge: 0,
      key: 0,
      blade: 0,
      shield: 0,
    },
    subGoals: [
      { id: 'harvest_crystals', label: 'Harvest all 5 Mana Crystals using a for-loop (💎 x5)' },
      { id: 'mine_iron', label: 'Mine 2 Iron Ore blocks (⛏️ x2)' },
      { id: 'craft_key', label: 'Craft a Logic Key with hero.craft("key")' },
      { id: 'unlock_gate', label: 'Unlock the Gate and reach the Portal at (8, 8)' },
    ],
    hintPrompts: [
      'How to write the for-loop?',
      'Where is the Iron Ore?',
      'How to unlock the Gate?',
      'Give me a Socratic hint 💡',
    ],
    initialCode: `# Floor 2: The Labyrinth of Loops (For & While Loops)
# Objective: Automate crystal harvesting with a loop, mine iron, and craft the key!

# Step 1: Use a for-loop with range(5) to harvest 5 crystals along row 2!
for i in range(5):
    hero.mine("right")
    hero.move("right")

# Step 2: Move down to the Iron Ore vein at (6, 5) and (6, 6)
hero.move("down", 3)
hero.mine("down")
hero.move("down")
hero.mine("down")

# Step 3: Craft the Logic Key (requires 2 Iron + 1 Crystal)
hero.craft("key")

# Step 4: Proceed to the Locked Gate at (8, 7) and open it!
hero.move("right", 2)
hero.move("down", 1)
hero.move("right") # Unlocks gate with key
hero.move("down")  # Step onto Portal at (8, 8)
`,
    solutionExample: `for i in range(5):
    hero.mine("right")
    hero.move("right")
hero.move("down", 3)
hero.mine("down")
hero.move("down")
hero.mine("down")
hero.craft("key")
hero.move("right", 2)
hero.move("down", 1)
hero.move("right")
hero.move("down")`,
    initialTiles: (() => {
      const g = createBaseGrid();
      const setTile = (x: number, y: number, type: TileType) => {
        const found = g.find((t) => t.x === x && t.y === y);
        if (found) found.type = type;
      };

      // 5 Crystals in a row along row 2: x=2,3,4,5,6
      for (let x = 2; x <= 6; x++) {
        setTile(x, 2, 'crystal');
      }

      // Walls creating loop corridor
      setTile(1, 3, 'wall');
      setTile(2, 3, 'wall');
      setTile(3, 3, 'wall');
      setTile(4, 3, 'wall');
      setTile(5, 3, 'wall');

      // Iron Ores at (6, 5) and (6, 6)
      setTile(6, 5, 'iron');
      setTile(6, 6, 'iron');

      // Spikes trap warning in corridor
      setTile(4, 6, 'spike');
      setTile(5, 6, 'spike');

      // Locked Gate at (8, 7)
      setTile(8, 7, 'gate');

      // Portal at (8, 8)
      setTile(8, 8, 'portal');

      return g;
    })(),
  },

  3: {
    floorNumber: 3,
    title: "The Sentinel's Gate",
    realmName: 'Conditionals & Booleans',
    concept: 'If / Else & hero.scan()',
    story:
      'Corrupted Bug Mimics have infested the treasure vaults! They look identical to normal chests, but opening one directly causes severe damage. Use `hero.scan(direction)` to inspect each chest before interacting. If it is a Mimic, strike it down with `hero.attack()`!',
    xpReward: 250,
    startX: 1,
    startY: 1,
    startFacing: 'right',
    portalX: 8,
    portalY: 8,
    initialInventory: {
      wood: 3,
      stone: 2,
      iron: 2,
      crystal: 1,
      bridge: 1,
      key: 1,
      blade: 1,
      shield: 0,
    },
    subGoals: [
      { id: 'scan_mimic', label: 'Use hero.scan() to inspect suspicious chests' },
      { id: 'defeat_mimic', label: 'Attack and defeat the Mimic at (4, 1)' },
      { id: 'bridge_lava', label: 'Place a bridge across the lava fissure at (6, 5)' },
      { id: 'reach_portal', label: 'Safely reach the Sanctuary Portal at (8, 8)' },
    ],
    hintPrompts: [
      'How does hero.scan() work?',
      'How to safely attack the mimic?',
      'Why is my health dropping?',
      'Give me a Socratic hint 💡',
    ],
    initialCode: `# Floor 3: The Sentinel's Gate (Conditionals & Booleans)
# Objective: Scan adjacent tiles, attack mimics with if/else, and cross lava safely!

# Available Inspection:
#   tile_info = hero.scan("right" | "down" | ...)
#   tile_info returns { type: "mimic" | "chest" | "lava" | "empty", is_mimic: bool }

# Step 1: Walk to tile (3, 1) and scan the chest on the right
hero.move("right", 2)
tile = hero.scan("right")

# Step 2: Use an if-condition to inspect the chest
if tile.type == "mimic" or tile.is_mimic:
    hero.attack("right") # Destroy the Corrupted Bug Mimic!
else:
    hero.move("right")

# Step 3: Now navigate towards the lava pit at (6, 5)
hero.move("down", 4)
hero.move("right", 2)

lava_check = hero.scan("right")
if lava_check.type == "lava":
    hero.place("bridge", "right")
    hero.move("right", 2)

# Step 4: Advance to the Portal at (8, 8)
hero.move("down", 3)
hero.move("right")
`,
    solutionExample: `hero.move("right", 2)
tile = hero.scan("right")
if tile.type == "mimic" or tile.is_mimic:
    hero.attack("right")
hero.move("down", 4)
hero.move("right", 2)
lava_check = hero.scan("right")
if lava_check.type == "lava":
    hero.place("bridge", "right")
hero.move("right", 2)
hero.move("down", 3)
hero.move("right")`,
    initialTiles: (() => {
      const g = createBaseGrid();
      const setTile = (x: number, y: number, type: TileType, isMimic = false) => {
        const found = g.find((t) => t.x === x && t.y === y);
        if (found) {
          found.type = type;
          if (isMimic) found.isMimic = true;
        }
      };

      // Mimic disguised as chest at (4, 1)
      setTile(4, 1, 'mimic', true);

      // Real treasure chest at (1, 6)
      setTile(1, 6, 'chest', false);

      // Lava gap at (6, 5)
      setTile(6, 5, 'lava');
      setTile(6, 6, 'lava');

      // Bug monster at (7, 3)
      setTile(7, 3, 'enemy');

      // Walls forcing path
      setTile(2, 2, 'wall');
      setTile(3, 2, 'wall');
      setTile(4, 2, 'wall');
      setTile(5, 2, 'wall');

      // Portal at (8, 8)
      setTile(8, 8, 'portal');

      return g;
    })(),
  },

  4: {
    floorNumber: 4,
    title: 'The Syntax Golem Boss Arena',
    realmName: 'Functions & Arrays',
    concept: 'Functions, Lists & Boss Battles',
    story:
      'Deep inside the Obsidian Core, the ancient Syntax Golem awakens! The Golem is shielded by rotating elemental armor. Write a reusable attack function `cast_spell(element)` and iterate through the boss weakness array `["fire", "ice", "thunder", "fire"]` to shatter its shields and claim the legendary Dungeon Architect Seal!',
    xpReward: 350,
    startX: 4,
    startY: 8,
    startFacing: 'up',
    portalX: 4,
    portalY: 1,
    initialInventory: {
      wood: 4,
      stone: 4,
      iron: 4,
      crystal: 4,
      bridge: 2,
      key: 1,
      blade: 1,
      shield: 1,
    },
    bossData: {
      name: 'Syntax Golem Titan',
      hp: 100,
      maxHp: 100,
      weaknesses: ['fire', 'ice', 'thunder', 'fire'],
      x: 4,
      y: 4,
      w: 2,
      h: 2,
    },
    subGoals: [
      { id: 'define_function', label: 'Define reusable attack function def cast_spell(elem):' },
      { id: 'loop_weaknesses', label: 'Iterate over weaknesses list ["fire", "ice", "thunder", "fire"]' },
      { id: 'defeat_boss', label: 'Shatter the Syntax Golem (Reduce HP to 0)' },
      { id: 'claim_seal', label: 'Claim the Dungeon Architect Seal at the Citadel Portal!' },
    ],
    hintPrompts: [
      'How to define the cast_spell function?',
      'What are the boss weaknesses?',
      'Why is the boss not taking damage?',
      'Give me a Socratic hint 💡',
    ],
    initialCode: `# Floor 4: The Syntax Golem Boss Arena (Functions & Lists)
# Objective: Define a spell function, loop through weaknesses array, and defeat the Boss!

# Step 1: Define a reusable function to cast elemental strikes
def cast_spell(element):
    # Strike the boss directly ahead with the chosen element!
    hero.attack("up", element)

# Step 2: The Syntax Golem's elemental weakness array:
weaknesses = ["fire", "ice", "thunder", "fire"]

# Step 3: Advance to the arena strike zone at (4, 6)
hero.move("up", 2)

# Step 4: Loop through each elemental weakness to breach its armor!
for elem in weaknesses:
    cast_spell(elem)

# Step 5: With the Golem defeated, walk through the core to (4, 1)!
hero.move("up", 5)
`,
    solutionExample: `def cast_spell(element):
    hero.attack("up", element)

weaknesses = ["fire", "ice", "thunder", "fire"]
hero.move("up", 2)
for elem in weaknesses:
    cast_spell(elem)
hero.move("up", 5)`,
    initialTiles: (() => {
      const g = createBaseGrid();
      const setTile = (x: number, y: number, type: TileType) => {
        const found = g.find((t) => t.x === x && t.y === y);
        if (found) found.type = type;
      };

      // Syntax Golem Boss at center 4,4 and 5,4 and 4,3 and 5,3
      setTile(4, 4, 'boss');
      setTile(5, 4, 'boss');
      setTile(4, 3, 'boss');
      setTile(5, 3, 'boss');

      // Decorative arena pillars
      setTile(2, 3, 'wall');
      setTile(7, 3, 'wall');
      setTile(2, 6, 'wall');
      setTile(7, 6, 'wall');

      // Portal at top (4, 1)
      setTile(4, 1, 'portal');

      return g;
    })(),
  },
};

// Safe Deterministic Client-Side Python/JS Interpreter for Dungeon Gameplay
export function executeDungeonCode(
  floorNumber: number,
  code: string,
  currentTiles: TileData[]
): DungeonSimulationResult {
  const spec = DUNGEON_FLOORS[floorNumber] || DUNGEON_FLOORS[1];
  let curX = spec.startX;
  let curY = spec.startY;
  let facing: Direction = spec.startFacing;
  let hp = 3;
  let inventory: DungeonInventory = { ...spec.initialInventory };
  const tilesMap = new Map<string, TileData>();

  // Deep clone tiles
  currentTiles.forEach((t) => {
    tilesMap.set(`${t.x},${t.y}`, { ...t });
  });

  const completedGoals: Record<string, boolean> = {};
  spec.subGoals.forEach((g) => {
    completedGoals[g.id] = false;
  });

  let bossHp = spec.bossData ? spec.bossData.hp : 0;
  const frames: DungeonSimulationFrame[] = [];
  const logs: string[] = [];

  function addLog(msg: string) {
    logs.push(msg);
  }

  // Push initial frame
  frames.push({
    stepIndex: 0,
    action: 'idle',
    x: curX,
    y: curY,
    facing,
    hp,
    inventory: { ...inventory },
    logMessage: `[INIT] Entered ${spec.title} at coordinate (${curX}, ${curY}).`,
    soundToPlay: undefined,
  });

  let stepCounter = 1;
  let executionError: string | null = null;
  let socraticHint = '';

  function getTile(x: number, y: number): TileData | undefined {
    return tilesMap.get(`${x},${y}`);
  }

  function setTileType(x: number, y: number, newType: TileType) {
    const t = tilesMap.get(`${x},${y}`);
    if (t) {
      t.type = newType;
    }
  }

  // Action: Move
  function doMove(dir: Direction, steps: number = 1): boolean {
    facing = dir;
    const { dx, dy } = DIR_OFFSETS[dir];

    for (let s = 0; s < steps; s++) {
      if (hp <= 0) break;
      const targetX = curX + dx;
      const targetY = curY + dy;
      const targetTile = getTile(targetX, targetY);

      if (!targetTile) {
        addLog(`⚠️ Attempted to step out of bounds at (${targetX}, ${targetY}).`);
        return false;
      }

      // Check walls
      if (targetTile.type === 'wall') {
        addLog(`🧱 Blocked: Hit a stone wall at (${targetX}, ${targetY}).`);
        frames.push({
          stepIndex: stepCounter++,
          action: 'damage',
          x: curX,
          y: curY,
          facing,
          hp,
          inventory: { ...inventory },
          logMessage: `Oof! Walked into solid wall at (${targetX}, ${targetY}).`,
          floatingText: { text: 'BLOCKED!', color: '#F59E0B' },
        });
        return false;
      }

      // Check Gate
      if (targetTile.type === 'gate') {
        if (inventory.key > 0) {
          inventory.key -= 1;
          setTileType(targetX, targetY, 'grass');
          completedGoals['unlock_gate'] = true;
          addLog(`🔑 Unlocked the Sentinel Gate at (${targetX}, ${targetY}) using a Logic Key!`);
          frames.push({
            stepIndex: stepCounter++,
            action: 'craft',
            x: curX,
            y: curY,
            facing,
            hp,
            inventory: { ...inventory },
            logMessage: `Used Logic Key to unlock Gate!`,
            tileMutations: [{ x: targetX, y: targetY, newType: 'grass' }],
            floatingText: { text: 'GATE UNLOCKED! 🔓', color: '#10B981' },
            soundToPlay: 'craft',
          });
        } else {
          addLog(`🔒 Gate at (${targetX}, ${targetY}) is locked! Requires a Logic Key.`);
          frames.push({
            stepIndex: stepCounter++,
            action: 'idle',
            x: curX,
            y: curY,
            facing,
            hp,
            inventory: { ...inventory },
            logMessage: `Locked Gate! Craft a key with 2 Iron + 1 Crystal.`,
            floatingText: { text: 'LOCKED GATE 🔒', color: '#EF4444' },
          });
          return false;
        }
      }

      // Check Lava
      if (targetTile.type === 'lava') {
        hp = Math.max(0, hp - 1);
        addLog(`🔥 Burn hazard: Stepped into molten lava at (${targetX}, ${targetY})! (-1 ❤️)`);
        frames.push({
          stepIndex: stepCounter++,
          action: 'damage',
          x: curX,
          y: curY,
          facing,
          hp,
          inventory: { ...inventory },
          logMessage: `Burned in molten lava! Place a bridge first.`,
          damageTaken: 1,
          floatingText: { text: '-1 ❤️ LAVA!', color: '#EF4444' },
          soundToPlay: 'damage',
        });
        if (hp <= 0) return false;
        continue;
      }

      // Check Spikes
      if (targetTile.type === 'spike') {
        hp = Math.max(0, hp - 1);
        addLog(`⚠️ Spike Trap triggered at (${targetX}, ${targetY})! (-1 ❤️)`);
        frames.push({
          stepIndex: stepCounter++,
          action: 'damage',
          x: targetX,
          y: targetY,
          facing,
          hp,
          inventory: { ...inventory },
          logMessage: `Stepped on hidden spikes!`,
          damageTaken: 1,
          floatingText: { text: '-1 ❤️ SPIKES!', color: '#EF4444' },
          soundToPlay: 'damage',
        });
        curX = targetX;
        curY = targetY;
        if (hp <= 0) return false;
        continue;
      }

      // Check Mimic opening directly
      if (targetTile.type === 'mimic') {
        hp = Math.max(0, hp - 2);
        addLog(`👾 Ambush! Opened a Corrupted Bug Mimic directly at (${targetX}, ${targetY})! (-2 ❤️)`);
        frames.push({
          stepIndex: stepCounter++,
          action: 'damage',
          x: curX,
          y: curY,
          facing,
          hp,
          inventory: { ...inventory },
          logMessage: `Ambushed by Mimic! Use hero.scan() and hero.attack().`,
          damageTaken: 2,
          floatingText: { text: '-2 ❤️ MIMIC AMBUSH!', color: '#EF4444' },
          soundToPlay: 'damage',
        });
        return false;
      }

      // Check Boss collision
      if (targetTile.type === 'boss' && bossHp > 0) {
        hp = Math.max(0, hp - 1);
        addLog(`💥 Golem Forcefield shockwave pushed you back at (${targetX}, ${targetY})! (-1 ❤️)`);
        frames.push({
          stepIndex: stepCounter++,
          action: 'damage',
          x: curX,
          y: curY,
          facing,
          hp,
          inventory: { ...inventory },
          logMessage: `Syntax Golem armor repelled you! Use cast_spell().`,
          damageTaken: 1,
          floatingText: { text: '-1 ❤️ SHIELD BLAST', color: '#EF4444' },
          soundToPlay: 'damage',
        });
        return false;
      }

      // Valid safe move
      curX = targetX;
      curY = targetY;
      addLog(`🚶 Moved ${dir} to (${curX}, ${curY}).`);

      // Check Portal
      if (targetTile.type === 'portal') {
        completedGoals['reach_portal'] = true;
        completedGoals['claim_seal'] = true;
        addLog(`✨ Reached Sanctuary Portal at (${curX}, ${curY})! Floor Conquered!`);
        frames.push({
          stepIndex: stepCounter++,
          action: 'victory',
          x: curX,
          y: curY,
          facing,
          hp,
          inventory: { ...inventory },
          logMessage: `🌟 Reached Gateway Portal! Floor Cleared!`,
          floatingText: { text: 'VICTORY! 🏆', color: '#10B981' },
          soundToPlay: 'victory',
        });
        return true;
      }

      frames.push({
        stepIndex: stepCounter++,
        action: 'move',
        x: curX,
        y: curY,
        facing,
        hp,
        inventory: { ...inventory },
        logMessage: `Stepped to (${curX}, ${curY}).`,
        soundToPlay: 'move',
      });
    }

    return true;
  }

  // Action: Mine
  function doMine(dir: Direction): boolean {
    facing = dir;
    const { dx, dy } = DIR_OFFSETS[dir];
    const targetX = curX + dx;
    const targetY = curY + dy;
    const targetTile = getTile(targetX, targetY);

    if (!targetTile) {
      addLog(`❌ Cannot mine: No block in direction ${dir}.`);
      return false;
    }

    if (targetTile.type === 'wood') {
      inventory.wood += 1;
      setTileType(targetX, targetY, 'grass');
      addLog(`🪵 Mined Whispering Tree at (${targetX}, ${targetY}). (Wood: ${inventory.wood})`);
      if (inventory.wood >= 3) completedGoals['mine_wood'] = true;

      frames.push({
        stepIndex: stepCounter++,
        action: 'mine',
        x: curX,
        y: curY,
        facing,
        hp,
        inventory: { ...inventory },
        targetCoord: { x: targetX, y: targetY },
        tileMutations: [{ x: targetX, y: targetY, newType: 'grass' }],
        logMessage: `Mined Wood (+1 🪵)`,
        floatingText: { text: '+1 🪵 WOOD', color: '#F59E0B' },
        soundToPlay: 'mine',
      });
      return true;
    }

    if (targetTile.type === 'stone') {
      inventory.stone += 1;
      setTileType(targetX, targetY, 'grass');
      addLog(`🪨 Mined Quarry Stone at (${targetX}, ${targetY}). (Stone: ${inventory.stone})`);

      frames.push({
        stepIndex: stepCounter++,
        action: 'mine',
        x: curX,
        y: curY,
        facing,
        hp,
        inventory: { ...inventory },
        targetCoord: { x: targetX, y: targetY },
        tileMutations: [{ x: targetX, y: targetY, newType: 'grass' }],
        logMessage: `Mined Stone (+1 🪨)`,
        floatingText: { text: '+1 🪨 STONE', color: '#7E7E8F' },
        soundToPlay: 'mine',
      });
      return true;
    }

    if (targetTile.type === 'crystal') {
      inventory.crystal += 1;
      setTileType(targetX, targetY, 'grass');
      addLog(`💎 Harvested Mana Crystal at (${targetX}, ${targetY}). (Crystal: ${inventory.crystal})`);
      if (inventory.crystal >= 5) completedGoals['harvest_crystals'] = true;

      frames.push({
        stepIndex: stepCounter++,
        action: 'mine',
        x: curX,
        y: curY,
        facing,
        hp,
        inventory: { ...inventory },
        targetCoord: { x: targetX, y: targetY },
        tileMutations: [{ x: targetX, y: targetY, newType: 'grass' }],
        logMessage: `Harvested Crystal (+1 💎)`,
        floatingText: { text: '+1 💎 CRYSTAL', color: '#38BDF8' },
        soundToPlay: 'mine',
      });
      return true;
    }

    if (targetTile.type === 'iron') {
      inventory.iron += 1;
      setTileType(targetX, targetY, 'grass');
      addLog(`⛏️ Mined Iron Ore at (${targetX}, ${targetY}). (Iron: ${inventory.iron})`);
      if (inventory.iron >= 2) completedGoals['mine_iron'] = true;

      frames.push({
        stepIndex: stepCounter++,
        action: 'mine',
        x: curX,
        y: curY,
        facing,
        hp,
        inventory: { ...inventory },
        targetCoord: { x: targetX, y: targetY },
        tileMutations: [{ x: targetX, y: targetY, newType: 'grass' }],
        logMessage: `Mined Iron (+1 ⛏️)`,
        floatingText: { text: '+1 ⛏️ IRON', color: '#F97316' },
        soundToPlay: 'mine',
      });
      return true;
    }

    addLog(`ℹ️ Tile at (${targetX}, ${targetY}) is ${targetTile.type} and cannot be mined.`);
    return false;
  }

  // Action: Craft
  function doCraft(itemName: string): boolean {
    const item = itemName.toLowerCase().trim();

    if (item === 'bridge') {
      if (inventory.wood >= 3) {
        inventory.wood -= 3;
        inventory.bridge += 1;
        completedGoals['craft_bridge'] = true;
        addLog(`🌉 Crafted Wooden Bridge! (Inventory: ${inventory.bridge} bridges)`);
        frames.push({
          stepIndex: stepCounter++,
          action: 'craft',
          x: curX,
          y: curY,
          facing,
          hp,
          inventory: { ...inventory },
          logMessage: `Crafted Wooden Bridge (+1 🌉)`,
          floatingText: { text: '+1 🌉 CRAFTED BRIDGE', color: '#10B981' },
          soundToPlay: 'craft',
        });
        return true;
      }
      if (inventory.stone >= 3 && inventory.wood >= 1) {
        inventory.stone -= 3;
        inventory.wood -= 1;
        inventory.bridge += 1;
        completedGoals['craft_bridge'] = true;
        addLog(`🌉 Crafted Stone Bridge! (Inventory: ${inventory.bridge} bridges)`);
        frames.push({
          stepIndex: stepCounter++,
          action: 'craft',
          x: curX,
          y: curY,
          facing,
          hp,
          inventory: { ...inventory },
          logMessage: `Crafted Stone Bridge (+1 🌉)`,
          floatingText: { text: '+1 🌉 STONE BRIDGE', color: '#10B981' },
          soundToPlay: 'craft',
        });
        return true;
      }
      addLog(`❌ Insufficient resources for bridge: requires 3 Wood (You have ${inventory.wood}).`);
      return false;
    }

    if (item === 'key') {
      if (inventory.iron >= 2 && inventory.crystal >= 1) {
        inventory.iron -= 2;
        inventory.crystal -= 1;
        inventory.key += 1;
        completedGoals['craft_key'] = true;
        addLog(`🔑 Crafted Logic Key! (Inventory: ${inventory.key} keys)`);
        frames.push({
          stepIndex: stepCounter++,
          action: 'craft',
          x: curX,
          y: curY,
          facing,
          hp,
          inventory: { ...inventory },
          logMessage: `Crafted Logic Key (+1 🔑)`,
          floatingText: { text: '+1 🔑 LOGIC KEY', color: '#FBBF24' },
          soundToPlay: 'craft',
        });
        return true;
      }
      addLog(`❌ Insufficient resources for key: requires 2 Iron + 1 Crystal.`);
      return false;
    }

    if (item === 'blade') {
      if (inventory.iron >= 2 && inventory.wood >= 1) {
        inventory.iron -= 2;
        inventory.wood -= 1;
        inventory.blade += 1;
        addLog(`🗡️ Crafted Logic Blade!`);
        frames.push({
          stepIndex: stepCounter++,
          action: 'craft',
          x: curX,
          y: curY,
          facing,
          hp,
          inventory: { ...inventory },
          logMessage: `Crafted Logic Blade (+1 🗡️)`,
          floatingText: { text: '+1 🗡️ LOGIC BLADE', color: '#6C5CE7' },
          soundToPlay: 'craft',
        });
        return true;
      }
      return false;
    }

    addLog(`❌ Unknown recipe: "${itemName}".`);
    return false;
  }

  // Action: Place
  function doPlace(itemName: string, dir: Direction): boolean {
    facing = dir;
    const { dx, dy } = DIR_OFFSETS[dir];
    const targetX = curX + dx;
    const targetY = curY + dy;
    const targetTile = getTile(targetX, targetY);

    if (!targetTile) {
      addLog(`❌ Cannot place: Coordinate (${targetX}, ${targetY}) is out of bounds.`);
      return false;
    }

    if (itemName.toLowerCase().includes('bridge')) {
      if (inventory.bridge <= 0) {
        addLog(`❌ You have 0 Bridges in inventory! Use hero.craft("bridge") first.`);
        return false;
      }

      inventory.bridge -= 1;
      setTileType(targetX, targetY, 'bridge');
      completedGoals['place_bridge'] = true;
      completedGoals['bridge_lava'] = true;
      addLog(`🌉 Placed Bridge at (${targetX}, ${targetY}) over ${targetTile.type}!`);

      frames.push({
        stepIndex: stepCounter++,
        action: 'place',
        x: curX,
        y: curY,
        facing,
        hp,
        inventory: { ...inventory },
        targetCoord: { x: targetX, y: targetY },
        tileMutations: [{ x: targetX, y: targetY, newType: 'bridge' }],
        logMessage: `Placed Bridge at (${targetX}, ${targetY})`,
        floatingText: { text: 'PLACED BRIDGE 🌉', color: '#FBBF24' },
        soundToPlay: 'place',
      });
      return true;
    }

    return false;
  }

  // Action: Attack
  function doAttack(dir: Direction, element?: string): boolean {
    facing = dir;
    const { dx, dy } = DIR_OFFSETS[dir];
    const targetX = curX + dx;
    const targetY = curY + dy;
    const targetTile = getTile(targetX, targetY);

    if (!targetTile) return false;

    // Attack Mimic
    if (targetTile.type === 'mimic') {
      setTileType(targetX, targetY, 'grass');
      completedGoals['defeat_mimic'] = true;
      addLog(`⚔️ Struck down Corrupted Bug Mimic at (${targetX}, ${targetY})!`);
      frames.push({
        stepIndex: stepCounter++,
        action: 'attack',
        x: curX,
        y: curY,
        facing,
        hp,
        inventory: { ...inventory },
        targetCoord: { x: targetX, y: targetY },
        tileMutations: [{ x: targetX, y: targetY, newType: 'grass' }],
        logMessage: `Defeated Bug Mimic (+50 XP)`,
        floatingText: { text: 'MIMIC DESTROYED! 💥', color: '#10B981' },
        soundToPlay: 'attack',
      });
      return true;
    }

    // Attack Boss
    if (targetTile.type === 'boss' && spec.bossData) {
      const elem = (element || '').toLowerCase().trim();
      const damage = elem ? 25 : 10;
      bossHp = Math.max(0, bossHp - damage);

      addLog(`⚔️ Struck Syntax Golem with element [${elem || 'physical'}] for ${damage} dmg! (Golem HP: ${bossHp}/100)`);

      const mutations: { x: number; y: number; newType: TileType }[] = [];
      if (bossHp <= 0) {
        completedGoals['defeat_boss'] = true;
        // Transform boss tiles to shattered grass
        mutations.push(
          { x: 4, y: 4, newType: 'grass' },
          { x: 5, y: 4, newType: 'grass' },
          { x: 4, y: 3, newType: 'grass' },
          { x: 5, y: 3, newType: 'grass' }
        );
        mutations.forEach((m) => setTileType(m.x, m.y, m.newType));
      }

      frames.push({
        stepIndex: stepCounter++,
        action: 'attack',
        x: curX,
        y: curY,
        facing,
        hp,
        inventory: { ...inventory },
        targetCoord: { x: targetX, y: targetY },
        tileMutations: mutations.length > 0 ? mutations : undefined,
        logMessage: bossHp <= 0 ? `💥 SYNTAX GOLEM SHATTERED!` : `Golem HP: ${bossHp}/100`,
        floatingText: {
          text: bossHp <= 0 ? 'BOSS DEFEATED! 🏆' : `-${damage} HP [${elem.toUpperCase()}]`,
          color: bossHp <= 0 ? '#10B981' : '#FBBF24',
        },
        soundToPlay: bossHp <= 0 ? 'victory' : 'attack',
      });
      return true;
    }

    // Generic enemy attack
    if (targetTile.type === 'enemy') {
      setTileType(targetX, targetY, 'grass');
      addLog(`⚔️ Defeated Bug Monster at (${targetX}, ${targetY})!`);
      frames.push({
        stepIndex: stepCounter++,
        action: 'attack',
        x: curX,
        y: curY,
        facing,
        hp,
        inventory: { ...inventory },
        targetCoord: { x: targetX, y: targetY },
        tileMutations: [{ x: targetX, y: targetY, newType: 'grass' }],
        logMessage: `Bug Purged!`,
        floatingText: { text: 'BUG PURGED! 💥', color: '#10B981' },
        soundToPlay: 'attack',
      });
      return true;
    }

    addLog(`⚔️ Swung blade at empty space (${targetX}, ${targetY}).`);
    return false;
  }

  // Action: Scan
  function doScan(dir: Direction): { type: string; is_mimic: boolean } {
    facing = dir;
    const { dx, dy } = DIR_OFFSETS[dir];
    const targetX = curX + dx;
    const targetY = curY + dy;
    const targetTile = getTile(targetX, targetY);

    completedGoals['scan_mimic'] = true;

    if (!targetTile) {
      return { type: 'out_of_bounds', is_mimic: false };
    }

    addLog(`🔍 Scanned ${dir} (${targetX}, ${targetY}): Type = "${targetTile.type}", is_mimic = ${Boolean(targetTile.isMimic)}`);

    frames.push({
      stepIndex: stepCounter++,
      action: 'scan',
      x: curX,
      y: curY,
      facing,
      hp,
      inventory: { ...inventory },
      targetCoord: { x: targetX, y: targetY },
      logMessage: `Scanned ${dir}: [${targetTile.type.toUpperCase()}]`,
      floatingText: {
        text: targetTile.isMimic ? '⚠️ MIMIC DETECTED!' : `TYPE: ${targetTile.type.toUpperCase()}`,
        color: targetTile.isMimic ? '#EF4444' : '#38BDF8',
      },
    });

    return {
      type: targetTile.type,
      is_mimic: Boolean(targetTile.isMimic),
    };
  }

  // Check function definition & weaknesses for Floor 4
  if (code.includes('def cast_spell') || code.includes('def strike')) {
    completedGoals['define_function'] = true;
  }
  if (code.includes('for elem in weaknesses') || code.includes('for w in weaknesses')) {
    completedGoals['loop_weaknesses'] = true;
  }

  // PARSER: Safe Line-by-Line & Block Execution
  try {
    const rawLines = code.split('\n');
    let i = 0;

    // Helper to evaluate loops and statements
    while (i < rawLines.length && hp > 0) {
      const line = rawLines[i].trim();
      i++;

      if (!line || line.startsWith('#') || line.startsWith('//')) continue;

      // FOR LOOP: for <var> in range(<count>):
      const rangeMatch = line.match(/^for\s+([a-zA-Z_]\w*)\s+in\s+range\(\s*(\d+)\s*\):/);
      if (rangeMatch) {
        const loopCount = parseInt(rangeMatch[2], 10);
        const loopBlock: string[] = [];

        // Collect indented lines
        while (i < rawLines.length) {
          const nextRaw = rawLines[i];
          if (!nextRaw.trim() || nextRaw.trim().startsWith('#')) {
            i++;
            continue;
          }
          const indent = nextRaw.match(/^\s*/)?.[0].length || 0;
          if (indent > 0) {
            loopBlock.push(nextRaw.trim());
            i++;
          } else {
            break;
          }
        }

        // Execute loop body
        for (let iter = 0; iter < Math.min(loopCount, 25); iter++) {
          if (hp <= 0) break;
          for (const cmd of loopBlock) {
            if (hp <= 0) break;
            executeLine(cmd);
          }
        }
        continue;
      }

      // FOR LIST LOOP: for elem in weaknesses:
      const listMatch = line.match(/^for\s+([a-zA-Z_]\w*)\s+in\s+weaknesses:/);
      if (listMatch) {
        const listBlock: string[] = [];
        while (i < rawLines.length) {
          const nextRaw = rawLines[i];
          if (!nextRaw.trim() || nextRaw.trim().startsWith('#')) {
            i++;
            continue;
          }
          const indent = nextRaw.match(/^\s*/)?.[0].length || 0;
          if (indent > 0) {
            listBlock.push(nextRaw.trim());
            i++;
          } else {
            break;
          }
        }

        const weaknesses = ['fire', 'ice', 'thunder', 'fire'];
        for (const elem of weaknesses) {
          if (hp <= 0) break;
          for (const cmd of listBlock) {
            if (hp <= 0) break;
            // Substitute variable call
            const replaced = cmd.replace(new RegExp(`\\b${listMatch[1]}\\b`, 'g'), `"${elem}"`);
            executeLine(replaced);
          }
        }
        continue;
      }

      // FUNCTION DEFINITION SKIP: def ...
      if (line.startsWith('def ')) {
        while (i < rawLines.length) {
          const nextRaw = rawLines[i];
          const indent = nextRaw.match(/^\s*/)?.[0].length || 0;
          if (indent > 0 || !nextRaw.trim() || nextRaw.trim().startsWith('#')) {
            i++;
          } else {
            break;
          }
        }
        continue;
      }

      // IF CONDITION
      if (line.startsWith('if ')) {
        let conditionMet = false;

        // Simplified condition evaluation
        if (line.includes('mimic')) {
          // If previous scan was mimic or adjacent is mimic
          const adjacent = [
            getTile(curX + 1, curY),
            getTile(curX - 1, curY),
            getTile(curX, curY + 1),
            getTile(curX, curY - 1),
          ];
          conditionMet = adjacent.some((t) => t && t.isMimic);
        } else if (line.includes('lava')) {
          const adjacent = [
            getTile(curX + 1, curY),
            getTile(curX - 1, curY),
            getTile(curX, curY + 1),
            getTile(curX, curY - 1),
          ];
          conditionMet = adjacent.some((t) => t && t.type === 'lava');
        } else {
          conditionMet = true;
        }

        const ifBlock: string[] = [];
        const elseBlock: string[] = [];
        let inElse = false;

        while (i < rawLines.length) {
          const nextRaw = rawLines[i];
          if (!nextRaw.trim()) {
            i++;
            continue;
          }
          const indent = nextRaw.match(/^\s*/)?.[0].length || 0;
          if (nextRaw.trim().startsWith('else:')) {
            inElse = true;
            i++;
            continue;
          }
          if (indent > 0) {
            if (inElse) elseBlock.push(nextRaw.trim());
            else ifBlock.push(nextRaw.trim());
            i++;
          } else {
            break;
          }
        }

        const blockToRun = conditionMet ? ifBlock : elseBlock;
        for (const cmd of blockToRun) {
          if (hp <= 0) break;
          executeLine(cmd);
        }
        continue;
      }

      // Single standard line execution
      executeLine(line);
    }
  } catch (err: any) {
    executionError = err?.message || 'Syntax/runtime error occurred.';
    addLog(`❌ Execution Exception: ${executionError}`);
  }

  function executeLine(cmd: string) {
    // hero.move("dir", steps?)
    const moveMatch = cmd.match(/hero\.move\(\s*["'](up|down|left|right)["'](?:\s*,\s*(\d+))?\s*\)/i);
    if (moveMatch) {
      const dir = moveMatch[1].toLowerCase() as Direction;
      const steps = moveMatch[2] ? parseInt(moveMatch[2], 10) : 1;
      doMove(dir, steps);
      return;
    }

    // hero.mine("dir")
    const mineMatch = cmd.match(/hero\.mine\(\s*["'](up|down|left|right)["']\s*\)/i);
    if (mineMatch) {
      const dir = mineMatch[1].toLowerCase() as Direction;
      doMine(dir);
      return;
    }

    // hero.craft("item")
    const craftMatch = cmd.match(/hero\.craft\(\s*["']([^"']+)["']\s*\)/i);
    if (craftMatch) {
      doCraft(craftMatch[1]);
      return;
    }

    // hero.place("item", "dir")
    const placeMatch = cmd.match(/hero\.place\(\s*["']([^"']+)["']\s*,\s*["'](up|down|left|right)["']\s*\)/i);
    if (placeMatch) {
      doPlace(placeMatch[1], placeMatch[2].toLowerCase() as Direction);
      return;
    }

    // hero.attack("dir", element?)
    const attackMatch = cmd.match(/hero\.attack\(\s*["'](up|down|left|right)["'](?:\s*,\s*["']?([^"')]+)["']?)?\s*\)/i);
    if (attackMatch) {
      const dir = attackMatch[1].toLowerCase() as Direction;
      const elem = attackMatch[2];
      doAttack(dir, elem);
      return;
    }

    // cast_spell(elem) function call
    const spellMatch = cmd.match(/(?:cast_spell|strike)\(\s*["']?([^"')]+)["']?\s*\)/i);
    if (spellMatch) {
      const elem = spellMatch[1];
      doAttack('up', elem);
      return;
    }

    // hero.scan("dir")
    const scanMatch = cmd.match(/hero\.scan\(\s*["'](up|down|left|right)["']\s*\)/i);
    if (scanMatch) {
      doScan(scanMatch[1].toLowerCase() as Direction);
      return;
    }
  }

  // Evaluate victory conditions
  const reachedTarget = curX === spec.portalX && curY === spec.portalY;
  const isFloor4BossClear = floorNumber === 4 ? bossHp <= 0 : true;
  const success = reachedTarget && hp > 0 && isFloor4BossClear;

  // Generate Socratic Hint
  if (!success) {
    if (hp <= 0) {
      socraticHint =
        'Apprentice, your hearts reached 0! Did you step into molten lava or trigger a spike trap without crafting and placing a bridge first?';
    } else if (floorNumber === 1 && inventory.bridge === 0) {
      socraticHint =
        'Notice how the Lava River blocks column 6. How could you harvest 3 Wood blocks and use `hero.craft("bridge")` before walking forward?';
    } else if (floorNumber === 2 && !completedGoals['harvest_crystals']) {
      socraticHint =
        'Apprentice, writing individual move commands takes too many lines. Try `for i in range(5):` to harvest the crystals and move right in one compact loop!';
    } else if (floorNumber === 3 && !completedGoals['defeat_mimic']) {
      socraticHint =
        'The chest on the right is suspicious! Inspect it first with `tile = hero.scan("right")`. If `tile.is_mimic == True`, what action should your hero take before moving?';
    } else if (floorNumber === 4 && bossHp > 0) {
      socraticHint =
        'The Syntax Golem resists direct brute-force strikes. Look at the `weaknesses` list. How can you define `cast_spell(element)` and loop through each elemental weakness?';
    } else {
      socraticHint = `You ended at coordinate (${curX}, ${curY}), but the Gateway Portal is at (${spec.portalX}, ${spec.portalY}). Trace your movement steps to reach the exit!`;
    }
  }

  return {
    success,
    frames,
    finalHp: hp,
    finalX: curX,
    finalY: curY,
    finalInventory: inventory,
    completedGoals,
    logs,
    diagnostic: {
      state: success ? 'success' : executionError ? 'error' : 'failure',
      summary: success
        ? `Floor ${floorNumber} Conquered! Gained +${spec.xpReward} XP!`
        : executionError || `Floor not completed. Hero at (${curX}, ${curY}).`,
      socraticHint: socraticHint || 'Review your commands and try running again!',
      suggestedSnippet: spec.solutionExample,
    },
  };
}
