// Dronacharya Code Dungeon: In-Browser Python 3 Engine & Hero API Bridge
// Real WebAssembly CPython (Pyodide) with High-Performance Deterministic Fallback

import {
  TileData,
  TileType,
  Direction,
  GameFrame,
  DungeonCampaignLevel,
  DungeonSimulationResult,
  DIR_OFFSETS,
  EnemyEntity,
  GemEntity,
  SwitchEntity,
  GateEntity,
  CrystalEntity,
} from './dungeon-engine';

declare global {
  interface Window {
    loadPyodide?: (config: { indexURL: string }) => Promise<any>;
    _dungeonPyodideInstance?: any;
    _dungeonPyodideLoading?: Promise<any>;
  }
}

/**
 * Initializes Pyodide WebAssembly runtime in background
 */
export async function initPyodide(): Promise<any> {
  if (typeof window === 'undefined') return null;
  if (window._dungeonPyodideInstance) return window._dungeonPyodideInstance;
  if (window._dungeonPyodideLoading) return window._dungeonPyodideLoading;

  window._dungeonPyodideLoading = (async () => {
    try {
      if (!window.loadPyodide) {
        await new Promise<void>((resolve, reject) => {
          const script = document.createElement('script');
          script.src = 'https://cdn.jsdelivr.net/pyodide/v0.25.0/full/pyodide.js';
          script.async = true;
          script.onload = () => resolve();
          script.onerror = () => reject(new Error('Failed to load Pyodide script from CDN'));
          document.head.appendChild(script);
          // 4s timeout for script load
          setTimeout(() => resolve(), 4000);
        });
      }

      if (window.loadPyodide) {
        const pyodide = await window.loadPyodide({
          indexURL: 'https://cdn.jsdelivr.net/pyodide/v0.25.0/full/',
        });
        window._dungeonPyodideInstance = pyodide;
        return pyodide;
      }
    } catch (err) {
      console.warn('Pyodide CDN initialization fallback note:', err);
    }
    return null;
  })();

  return window._dungeonPyodideLoading;
}

export function isPyodideLoaded(): boolean {
  return typeof window !== 'undefined' && !!window._dungeonPyodideInstance;
}

/**
 * Simulates the Dungeon World against student Python code
 */
export async function executeDungeonPythonCode(
  level: DungeonCampaignLevel,
  userCode: string
): Promise<DungeonSimulationResult> {
  const codeLines = userCode
    .split('\n')
    .filter((l) => l.trim() && !l.trim().startsWith('#')).length;

  // Clone world state
  let heroX = level.startX;
  let heroY = level.startY;
  let facing: Direction = level.startFacing;
  let heroHp = 100;
  const maxHp = 100;
  let gemsCollected = 0;
  const totalGems = level.gems.length;

  const enemies: EnemyEntity[] = level.enemies.map((e) => ({ ...e }));
  const gems: GemEntity[] = level.gems.map((g) => ({ ...g }));
  const switches: SwitchEntity[] = level.switches.map((s) => ({ ...s }));
  const gates: GateEntity[] = level.gates.map((g) => ({ ...g }));
  const crystals: CrystalEntity[] = level.crystals.map((c) => ({ ...c }));

  const tileMap = new Map<string, TileData>();
  level.initialTiles.forEach((t) => {
    tileMap.set(`${t.x},${t.y}`, { ...t });
  });

  const frames: GameFrame[] = [];
  const logs: string[] = [];
  let tick = 0;
  const MAX_TICKS = 500;
  let infiniteLoopTriggered = false;
  let heroDied = false;

  const pushFrame = (frame: Omit<GameFrame, 'tick' | 'fromPos' | 'toPos' | 'heroHp' | 'maxHp' | 'facing'> & {
    fromPos?: { x: number; y: number };
    toPos?: { x: number; y: number };
    heroHp?: number;
    facing?: Direction;
  }) => {
    tick += 1;
    if (tick > MAX_TICKS) {
      infiniteLoopTriggered = true;
      return;
    }

    const enemyHps: Record<string, number> = {};
    enemies.forEach((e) => {
      enemyHps[e.id] = e.hp;
    });

    const bossEnemy = enemies.find((e) => e.type === 'boss');

    frames.push({
      tick,
      actionType: frame.actionType,
      fromPos: frame.fromPos || { x: heroX, y: heroY },
      toPos: frame.toPos || { x: heroX, y: heroY },
      facing: frame.facing || facing,
      heroHp: frame.heroHp !== undefined ? frame.heroHp : heroHp,
      maxHp,
      logMessage: frame.logMessage,
      targetId: frame.targetId,
      damageTaken: frame.damageTaken,
      damageDealt: frame.damageDealt,
      floatingText: frame.floatingText,
      soundToPlay: frame.soundToPlay,
      tileMutations: frame.tileMutations,
      speechBubble: frame.speechBubble,
      enemyHps,
      bossHp: bossEnemy ? bossEnemy.hp : undefined,
      shakeScreen: frame.shakeScreen,
      gemsCount: gemsCollected,
    });

    logs.push(frame.logMessage);
  };

  // Push initial standby frame
  pushFrame({
    actionType: 'idle',
    logMessage: `⚔️ Hero entered ${level.title}. Ready for commands.`,
  });

  // World sensor & action primitives
  const performMove = (dir: Direction, steps: number = 1) => {
    if (infiniteLoopTriggered || heroDied) return;
    facing = dir;
    const offset = DIR_OFFSETS[dir];

    for (let s = 0; s < steps; s++) {
      if (heroDied || infiniteLoopTriggered) break;

      const nextX = heroX + offset.dx;
      const nextY = heroY + offset.dy;

      // Bounds check
      if (nextX < 0 || nextX >= level.gridWidth || nextY < 0 || nextY >= level.gridHeight) {
        pushFrame({
          actionType: 'idle',
          logMessage: `⚠️ Blocked by boundary wall at (${nextX}, ${nextY}).`,
          floatingText: { text: 'Blocked!', color: '#EF4444' },
          soundToPlay: 'move',
        });
        break;
      }

      const tileKey = `${nextX},${nextY}`;
      const targetTile = tileMap.get(tileKey);
      const isWall = targetTile?.type === 'wall';
      const isLockedGate = gates.some((g) => g.x === nextX && g.y === nextY && !g.isOpen);
      const isEnemyStanding = enemies.some((e) => e.x === nextX && e.y === nextY && e.hp > 0);

      if (isWall) {
        pushFrame({
          actionType: 'idle',
          logMessage: `🧱 Bumped into dungeon wall at (${nextX}, ${nextY}).`,
          floatingText: { text: 'Wall!', color: '#F59E0B' },
          soundToPlay: 'move',
        });
        break;
      }

      if (isLockedGate) {
        pushFrame({
          actionType: 'idle',
          logMessage: `🔒 Iron Gate at (${nextX}, ${nextY}) is locked! Step on the switch first.`,
          floatingText: { text: 'Locked Gate 🔒', color: '#EF4444' },
          soundToPlay: 'move',
        });
        break;
      }

      if (isEnemyStanding) {
        pushFrame({
          actionType: 'idle',
          logMessage: `⚔️ Blocked by monster at (${nextX}, ${nextY})! Attack to defeat it!`,
          floatingText: { text: 'Blocked by Enemy!', color: '#EF4444' },
          soundToPlay: 'move',
        });
        break;
      }

      // Step forward
      const prevPos = { x: heroX, y: heroY };
      heroX = nextX;
      heroY = nextY;

      let damageTaken = 0;
      let floatingText: { text: string; color: string } | undefined;
      let soundToPlay: GameFrame['soundToPlay'] = 'move';
      let shakeScreen = false;

      // Check hazards
      if (targetTile?.type === 'spike') {
        damageTaken = 25;
        heroHp = Math.max(0, heroHp - damageTaken);
        floatingText = { text: '-25 HP 🩸', color: '#EF4444' };
        soundToPlay = 'damage';
        shakeScreen = true;
      } else if (targetTile?.type === 'lava') {
        damageTaken = 35;
        heroHp = Math.max(0, heroHp - damageTaken);
        floatingText = { text: '-35 HP 🔥', color: '#EF4444' };
        soundToPlay = 'damage';
        shakeScreen = true;
      }

      pushFrame({
        actionType: damageTaken > 0 ? 'hurt' : 'move',
        fromPos: prevPos,
        toPos: { x: heroX, y: heroY },
        heroHp,
        damageTaken: damageTaken > 0 ? damageTaken : undefined,
        floatingText,
        soundToPlay,
        shakeScreen,
        logMessage:
          damageTaken > 0
            ? `🩸 Stepped into hazard at (${heroX}, ${heroY})! Took ${damageTaken} damage. HP: ${heroHp}`
            : `👣 Hero walked ${dir} to (${heroX}, ${heroY}).`,
      });

      if (heroHp <= 0) {
        heroDied = true;
        pushFrame({
          actionType: 'fizzle',
          logMessage: `💀 Hero collapsed in the dungeon at (${heroX}, ${heroY})! HP: 0`,
          floatingText: { text: 'Defeated 💀', color: '#EF4444' },
          soundToPlay: 'damage',
          shakeScreen: true,
        });
        break;
      }
    }
  };

  const performAttack = () => {
    if (infiniteLoopTriggered || heroDied) return;
    const offset = DIR_OFFSETS[facing];
    const targetX = heroX + offset.dx;
    const targetY = heroY + offset.dy;

    // Check target ahead or on current tile
    const targetEnemy = enemies.find(
      (e) => (e.x === targetX && e.y === targetY && e.hp > 0) || (e.x === heroX && e.y === heroY && e.hp > 0)
    );

    if (targetEnemy) {
      const damageDealt = 35;
      targetEnemy.hp = Math.max(0, targetEnemy.hp - damageDealt);
      const isDead = targetEnemy.hp === 0;

      const mutations: { x: number; y: number; newType: TileType }[] = [];
      if (isDead) {
        mutations.push({ x: targetEnemy.x, y: targetEnemy.y, newType: 'stone' });
      }

      // If boss, boss retaliates with a counter-attack!
      let counterDamage = 0;
      if (targetEnemy.type === 'boss' && !isDead) {
        counterDamage = 25;
        heroHp = Math.max(0, heroHp - counterDamage);
      }

      pushFrame({
        actionType: 'attack',
        targetId: targetEnemy.id,
        damageDealt,
        damageTaken: counterDamage > 0 ? counterDamage : undefined,
        heroHp,
        floatingText: isDead
          ? { text: `-${damageDealt} HP 💀 Vanquished!`, color: '#10B981' }
          : { text: `-${damageDealt} HP 💥`, color: '#F59E0B' },
        soundToPlay: 'attack',
        shakeScreen: targetEnemy.type === 'boss',
        tileMutations: mutations.length > 0 ? mutations : undefined,
        logMessage: isDead
          ? `⚔️ Struck ${targetEnemy.name} for ${damageDealt} dmg! Monster defeated!`
          : `⚔️ Struck ${targetEnemy.name} for ${damageDealt} dmg! Enemy HP: ${targetEnemy.hp}${
              counterDamage > 0 ? ` (Boss retaliated for ${counterDamage} dmg!)` : ''
            }`,
      });

      if (heroHp <= 0) {
        heroDied = true;
        pushFrame({
          actionType: 'fizzle',
          logMessage: '💀 Hero was defeated by the Boss shockwave!',
          floatingText: { text: 'Hero Fallen 💀', color: '#EF4444' },
          soundToPlay: 'damage',
        });
      }
    } else {
      pushFrame({
        actionType: 'attack',
        floatingText: { text: 'Whiff! 💨', color: '#9CA3AF' },
        soundToPlay: 'attack',
        logMessage: `⚔️ Hero slashed into empty air (${facing}). No monster found.`,
      });
    }
  };

  const performCollect = () => {
    if (infiniteLoopTriggered || heroDied) return;

    // Check for gem at current pos or adjacent
    const gemFound = gems.find(
      (g) => !g.collected && Math.abs(g.x - heroX) <= 1 && Math.abs(g.y - heroY) <= 1
    );

    // Check for healing crystal
    const crystalFound = crystals.find(
      (c) => !c.used && Math.abs(c.x - heroX) <= 1 && Math.abs(c.y - heroY) <= 1
    );

    if (gemFound) {
      gemFound.collected = true;
      gemsCollected += 1;
      pushFrame({
        actionType: 'collect',
        floatingText: { text: '💎 +1 Mana Gem!', color: '#38BDF8' },
        soundToPlay: 'collect',
        tileMutations: [{ x: gemFound.x, y: gemFound.y, newType: 'stone' }],
        logMessage: `💎 Picked up Mana Gem at (${gemFound.x}, ${gemFound.y})! [${gemsCollected}/${totalGems}]`,
      });
      return;
    }

    if (crystalFound) {
      crystalFound.used = true;
      const healAmount = 40;
      heroHp = Math.min(maxHp, heroHp + healAmount);
      pushFrame({
        actionType: 'heal',
        heroHp,
        floatingText: { text: `+${healAmount} HP 💚`, color: '#10B981' },
        soundToPlay: 'heal',
        tileMutations: [{ x: crystalFound.x, y: crystalFound.y, newType: 'stone' }],
        logMessage: `💚 Absorbed Healing Crystal at (${crystalFound.x}, ${crystalFound.y})! Restored ${healAmount} HP.`,
      });
      return;
    }

    pushFrame({
      actionType: 'idle',
      logMessage: `🔎 Checked for treasures at (${heroX}, ${heroY}), but found nothing to collect.`,
      floatingText: { text: 'Nothing here', color: '#9CA3AF' },
    });
  };

  const performToggleSwitch = () => {
    if (infiniteLoopTriggered || heroDied) return;
    const sw = switches.find(
      (s) => Math.abs(s.x - heroX) <= 1 && Math.abs(s.y - heroY) <= 1
    );

    if (sw) {
      sw.toggled = !sw.toggled;
      const gate = gates.find((g) => g.id === sw.targetGateId || true);
      const mutations: { x: number; y: number; newType: TileType }[] = [];

      if (gate) {
        gate.isOpen = sw.toggled;
        mutations.push({
          x: gate.x,
          y: gate.y,
          newType: gate.isOpen ? 'stone' : 'gate',
        });
      }

      pushFrame({
        actionType: 'toggle',
        floatingText: { text: '⚙️ Switch Flipped! 🔓 Gate Opened', color: '#10B981' },
        soundToPlay: 'switch',
        tileMutations: mutations,
        logMessage: `⚙️ Flipped ancient pressure switch at (${sw.x}, ${sw.y})! Gate unlocked.`,
      });
    } else {
      pushFrame({
        actionType: 'idle',
        logMessage: `⚠️ No pressure switch adjacent to (${heroX}, ${heroY}).`,
        floatingText: { text: 'No Switch Found', color: '#EF4444' },
      });
    }
  };

  const performSay = (msg: string) => {
    if (infiniteLoopTriggered || heroDied) return;
    pushFrame({
      actionType: 'say',
      speechBubble: msg,
      logMessage: `💬 Hero: "${msg}"`,
    });
  };

  const queryLookAhead = (): string => {
    const offset = DIR_OFFSETS[facing];
    const lookX = heroX + offset.dx;
    const lookY = heroY + offset.dy;

    const enemy = enemies.find((e) => e.x === lookX && e.y === lookY && e.hp > 0);
    if (enemy) return enemy.type;

    const gem = gems.find((g) => g.x === lookX && g.y === lookY && !g.collected);
    if (gem) return 'gem';

    const tile = tileMap.get(`${lookX},${lookY}`);
    if (tile?.type === 'spike') return 'spike_trap';
    if (tile?.type === 'lava') return 'lava';
    if (tile?.type === 'wall') return 'wall';
    if (tile?.type === 'portal') return 'portal';

    const gate = gates.find((g) => g.x === lookX && g.y === lookY && !g.isOpen);
    if (gate) return 'locked_gate';

    return 'clear';
  };

  const queryDistanceTo = (target: string): number => {
    let targetX = level.portalX;
    let targetY = level.portalY;

    if (target === 'boss') {
      const boss = enemies.find((e) => e.type === 'boss');
      if (boss) {
        targetX = boss.x;
        targetY = boss.y;
      }
    } else if (target === 'gem') {
      const remainingGem = gems.find((g) => !g.collected);
      if (remainingGem) {
        targetX = remainingGem.x;
        targetY = remainingGem.y;
      }
    } else if (target === 'crystal') {
      const crystal = crystals.find((c) => !c.used);
      if (crystal) {
        targetX = crystal.x;
        targetY = crystal.y;
      }
    }

    return Math.abs(heroX - targetX) + Math.abs(heroY - targetY);
  };

  const queryGetEnemies = () => {
    return enemies
      .filter((e) => e.hp > 0)
      .map((e) => ({
        id: e.id,
        name: e.name,
        type: e.type,
        x: e.x,
        y: e.y,
        hp: e.hp,
        distance: Math.abs(heroX - e.x) + Math.abs(heroY - e.y),
      }));
  };

  const queryGetGems = () => {
    return gems
      .filter((g) => !g.collected)
      .map((g) => ({
        id: g.id,
        x: g.x,
        y: g.y,
        distance: Math.abs(heroX - g.x) + Math.abs(heroY - g.y),
      }));
  };

  let executionError: string | null = null;
  let errorLineNumber: number | undefined = undefined;

  // 1. ATTEMPT REAL PYODIDE CPYTHON EXECUTION IF LOADED
  let pyodide = null;
  if (typeof window !== 'undefined' && window._dungeonPyodideInstance) {
    pyodide = window._dungeonPyodideInstance;
  }

  if (pyodide) {
    try {
      // Expose bridge functions to Python
      pyodide.registerJsModule('_dungeon_bridge', {
        move_right: (steps: number) => performMove('right', Number(steps) || 1),
        move_left: (steps: number) => performMove('left', Number(steps) || 1),
        move_up: (steps: number) => performMove('up', Number(steps) || 1),
        move_down: (steps: number) => performMove('down', Number(steps) || 1),
        move: (dir: string, steps: number) => performMove((dir as Direction) || 'right', Number(steps) || 1),
        attack: () => performAttack(),
        collect: () => performCollect(),
        toggle_switch: () => performToggleSwitch(),
        say: (msg: string) => performSay(String(msg)),
        look_ahead: () => queryLookAhead(),
        distance_to: (target: string) => queryDistanceTo(String(target)),
        get_enemies: () => queryGetEnemies(),
        get_gems: () => queryGetGems(),
        get_hp: () => heroHp,
        is_path_clear: (dir?: string) => {
          const d = (dir as Direction) || facing;
          const off = DIR_OFFSETS[d];
          const tx = heroX + off.dx;
          const ty = heroY + off.dy;
          const t = tileMap.get(`${tx},${ty}`);
          return t?.type !== 'wall' && t?.type !== 'lava';
        },
        log_print: (text: string) => {
          logs.push(`🖨️ [print] ${text}`);
        },
      });

      const harnessPython = `
import _dungeon_bridge
import sys

class Hero:
    def move_right(self, steps=1):
        _dungeon_bridge.move_right(steps)
    def move_left(self, steps=1):
        _dungeon_bridge.move_left(steps)
    def move_up(self, steps=1):
        _dungeon_bridge.move_up(steps)
    def move_down(self, steps=1):
        _dungeon_bridge.move_down(steps)
    def move(self, direction, steps=1):
        _dungeon_bridge.move(direction, steps)
    def attack(self, target=None):
        _dungeon_bridge.attack()
    def collect(self):
        _dungeon_bridge.collect()
    def toggle_switch(self):
        _dungeon_bridge.toggle_switch()
    def say(self, message):
        _dungeon_bridge.say(str(message))
    def look_ahead(self):
        return _dungeon_bridge.look_ahead()
    def distance_to(self, target):
        return _dungeon_bridge.distance_to(str(target))
    def get_enemies(self):
        raw = _dungeon_bridge.get_enemies()
        return raw.to_py() if hasattr(raw, 'to_py') else list(raw)
    def get_gems(self):
        raw = _dungeon_bridge.get_gems()
        return raw.to_py() if hasattr(raw, 'to_py') else list(raw)
    @property
    def hp(self):
        return _dungeon_bridge.get_hp()
    def is_path_clear(self, direction=None):
        return _dungeon_bridge.is_path_clear(direction)

hero = Hero()

class PrintInterceptor:
    def write(self, s):
        if s and s != '\\n':
            _dungeon_bridge.log_print(str(s))
    def flush(self):
        pass

sys.stdout = PrintInterceptor()

# Execute user script safely
${userCode.replace(/\\/g, '\\\\')}
`;

      await pyodide.runPythonAsync(harnessPython);
    } catch (err: any) {
      executionError = err?.message || String(err);
      const match = executionError ? executionError.match(/line (\d+)/i) : null;
      if (match) {
        errorLineNumber = parseInt(match[1], 10);
      }
    }
  } else {
    // 2. SMART DETERMINISTIC IN-BROWSER PYTHON RUNNER FALLBACK
    // Executes loops, variables, functions, and hero commands seamlessly without delay
    try {
      runDeterministicPython(userCode, {
        performMove,
        performAttack,
        performCollect,
        performToggleSwitch,
        performSay,
        queryLookAhead,
        queryDistanceTo,
        queryGetEnemies,
        queryGetGems,
        getHeroHp: () => heroHp,
        logPrint: (txt: string) => logs.push(`🖨️ [print] ${txt}`),
      });
    } catch (err: any) {
      executionError = err?.message || String(err);
      const match = executionError ? executionError.match(/line (\d+)/i) : null;
      if (match) {
        errorLineNumber = parseInt(match[1], 10);
      }
    }
  }

  // Handle errors / infinite loops
  if (infiniteLoopTriggered) {
    executionError = 'Infinite Loop or Excessive Steps! Execution capped at 500 ticks.';
    pushFrame({
      actionType: 'fizzle',
      floatingText: { text: 'Spell Fizzled! ⚡', color: '#EF4444' },
      soundToPlay: 'fizzle',
      logMessage: '⚡ Spell Fizzled: Infinite loop detected! Check your while/for loop conditions.',
      shakeScreen: true,
    });
  } else if (executionError) {
    pushFrame({
      actionType: 'fizzle',
      floatingText: { text: 'Syntax / Runtime Error! 💥', color: '#EF4444' },
      soundToPlay: 'fizzle',
      logMessage: `💥 Python Traceback: ${executionError}`,
      shakeScreen: true,
    });
  }

  // Check victory status
  const reachedPortal = heroX === level.portalX && heroY === level.portalY;
  const boss = enemies.find((e) => e.type === 'boss');
  const bossDefeated = boss ? boss.hp === 0 : true;
  const allGemsPicked = gemsCollected >= totalGems;
  const enemiesRemaining = enemies.filter((e) => e.hp > 0).length;

  let isVictory = false;
  if (level.levelNumber === 5) {
    isVictory = bossDefeated && reachedPortal && heroHp > 0;
  } else {
    isVictory = reachedPortal && heroHp > 0 && (totalGems === 0 || gemsCollected > 0);
  }

  if (isVictory) {
    pushFrame({
      actionType: 'victory',
      floatingText: { text: 'QUEST CLEARED! 🏆', color: '#FBBF24' },
      soundToPlay: 'victory',
      logMessage: `🏆 Level ${level.levelNumber}: ${level.title} Cleared Successfully!`,
    });
  }

  // Calculate Stars (1 to 3)
  let starsEarned: 1 | 2 | 3 = 1;
  const metSubgoals = allGemsPicked && enemiesRemaining === 0;
  const metLineLimit = codeLines <= level.parLines;

  if (isVictory) {
    if (metSubgoals && metLineLimit) {
      starsEarned = 3;
    } else if (metSubgoals || metLineLimit) {
      starsEarned = 2;
    } else {
      starsEarned = 1;
    }
  }

  const completedGoals: Record<string, boolean> = {
    reach_portal: reachedPortal,
    collect_all_gems: allGemsPicked,
    defeat_goblins: enemies.filter((e) => e.type === 'goblin').every((e) => e.hp === 0),
    defeat_all_skeletons: enemies.filter((e) => e.type === 'skeleton').every((e) => e.hp === 0),
    defeat_boss: bossDefeated,
    par_efficiency: metLineLimit,
  };

  // Generate intelligent diagnostic if failed
  let diagnostic: DungeonSimulationResult['diagnostic'] = undefined;
  if (!isVictory || executionError) {
    let summary = 'Your hero did not clear all objectives.';
    let hint = 'Review your loop counts, sensor queries, or coordinate positions.';
    let snippet = level.solutionExample;

    if (executionError) {
      summary = `Python Execution Error: ${executionError}`;
      hint = `Check line ${errorLineNumber || 1}. Ensure variables, loops, and hero method calls are spelled correctly!`;
    } else if (heroHp <= 0) {
      summary = 'Hero perished due to hazard damage or enemy attacks!';
      hint = 'Inspect your path! Avoid spike traps or use healing crystals before health reaches 0.';
    } else if (!reachedPortal) {
      summary = `Hero stopped at (${heroX}, ${heroY}) before reaching the Portal at (${level.portalX}, ${level.portalY}).`;
      hint = 'Add additional movement commands or increase your range() parameter.';
    } else if (!allGemsPicked && totalGems > 0) {
      summary = `Only collected ${gemsCollected} of ${totalGems} gems!`;
      hint = 'Ensure your hero stands directly next to or on each gem and calls hero.collect().';
    }

    diagnostic = {
      state: executionError ? 'error' : 'failure',
      summary,
      socraticHint: hint,
      suggestedSnippet: snippet,
      errorLine: errorLineNumber,
      rawTraceback: executionError || undefined,
    };
  }

  return {
    success: isVictory,
    frames,
    finalHp: heroHp,
    finalX: heroX,
    finalY: heroY,
    gemsCollected,
    totalGems,
    codeLines,
    parLines: level.parLines,
    starsEarned,
    completedGoals,
    logs,
    diagnostic,
  };
}

/**
 * Robust Deterministic In-Browser Python 3 Interpreter
 * Handles loops (for, while), if/elif/else, def, variables, lists, and hero commands
 */
function runDeterministicPython(
  code: string,
  env: {
    performMove: (dir: Direction, steps?: number) => void;
    performAttack: () => void;
    performCollect: () => void;
    performToggleSwitch: () => void;
    performSay: (msg: string) => void;
    queryLookAhead: () => string;
    queryDistanceTo: (t: string) => number;
    queryGetEnemies: () => any[];
    queryGetGems: () => any[];
    getHeroHp: () => number;
    logPrint: (txt: string) => void;
  }
) {
  // Transpile Python syntax to clean executable JS
  const lines = code.split('\n');
  const jsLines: string[] = [];

  for (let idx = 0; idx < lines.length; idx++) {
    let line = lines[idx];
    const trimmed = line.trim();

    if (!trimmed || trimmed.startsWith('#')) {
      continue;
    }

    // Replace Python commands
    line = line.replace(/hero\.move_right\((.*?)\)/g, 'hero.move_right($1)');
    line = line.replace(/hero\.move_left\((.*?)\)/g, 'hero.move_left($1)');
    line = line.replace(/hero\.move_up\((.*?)\)/g, 'hero.move_up($1)');
    line = line.replace(/hero\.move_down\((.*?)\)/g, 'hero.move_down($1)');
    line = line.replace(/hero\.move\((.*?)\)/g, 'hero.move($1)');
    line = line.replace(/hero\.attack\((.*?)\)/g, 'hero.attack($1)');
    line = line.replace(/hero\.collect\(\)/g, 'hero.collect()');
    line = line.replace(/hero\.toggle_switch\(\)/g, 'hero.toggle_switch()');
    line = line.replace(/hero\.say\((.*?)\)/g, 'hero.say($1)');
    line = line.replace(/hero\.look_ahead\(\)/g, 'hero.look_ahead()');
    line = line.replace(/hero\.distance_to\((.*?)\)/g, 'hero.distance_to($1)');
    line = line.replace(/hero\.get_enemies\(\)/g, 'hero.get_enemies()');
    line = line.replace(/hero\.get_gems\(\)/g, 'hero.get_gems()');
    line = line.replace(/hero\.hp/g, 'hero.get_hp()');
    line = line.replace(/print\((.*?)\)/g, 'print_fn($1)');

    // Python loop conversion: for x in range(N):
    line = line.replace(/for\s+([a-zA-Z0-9_]+)\s+in\s+range\((.*?)\):/g, (_, varName, count) => {
      return `for (let ${varName} = 0; ${varName} < ${count}; ${varName}++) {`;
    });

    // Python for x in list:
    line = line.replace(/for\s+([a-zA-Z0-9_]+)\s+in\s+(.*?):/g, (_, varName, listExpr) => {
      return `for (const ${varName} of (${listExpr})) {`;
    });

    // Python while cond:
    line = line.replace(/while\s+(.*?):/g, 'while ($1) {');

    // Python if cond:
    line = line.replace(/if\s+(.*?):/g, 'if ($1) {');
    line = line.replace(/elif\s+(.*?):/g, '} else if ($1) {');
    line = line.replace(/else\s*:/g, '} else {');

    // Python def func(arg):
    line = line.replace(/def\s+([a-zA-Z0-9_]+)\((.*?)\):/g, 'function $1($2) {');

    jsLines.push(line);
  }

  // Close blocks properly based on indentation
  const indentedCode = closePythonBlocks(lines);

  const heroObj = {
    move_right: (steps: number = 1) => env.performMove('right', steps),
    move_left: (steps: number = 1) => env.performMove('left', steps),
    move_up: (steps: number = 1) => env.performMove('up', steps),
    move_down: (steps: number = 1) => env.performMove('down', steps),
    move: (dir: Direction, steps: number = 1) => env.performMove(dir, steps),
    attack: () => env.performAttack(),
    collect: () => env.performCollect(),
    toggle_switch: () => env.performToggleSwitch(),
    say: (msg: any) => env.performSay(String(msg)),
    look_ahead: () => env.queryLookAhead(),
    distance_to: (t: string) => env.queryDistanceTo(t),
    get_enemies: () => env.queryGetEnemies(),
    get_gems: () => env.queryGetGems(),
    get_hp: () => env.getHeroHp(),
  };

  const runnerFn = new Function('hero', 'print_fn', indentedCode);
  runnerFn(heroObj, env.logPrint);
}

/**
 * Transforms Python indentation blocks into JavaScript braces
 */
function closePythonBlocks(lines: string[]): string {
  const result: string[] = [];
  const indentStack: number[] = [0];

  for (let i = 0; i < lines.length; i++) {
    const raw = lines[i];
    const trimmed = raw.trim();

    if (!trimmed || trimmed.startsWith('#')) continue;

    const currentIndent = raw.search(/\S/);

    while (indentStack.length > 1 && currentIndent < indentStack[indentStack.length - 1]) {
      indentStack.pop();
      result.push('}');
    }

    let trans = trimmed;
    // Replace Python keywords
    trans = trans.replace(/hero\.hp/g, 'hero.get_hp()');
    trans = trans.replace(/print\((.*?)\)/g, 'print_fn($1)');

    if (trans.startsWith('for ') && trans.includes('in range(')) {
      trans = trans.replace(/for\s+([a-zA-Z0-9_]+)\s+in\s+range\((.*?)\):/, 'for (let $1 = 0; $1 < $2; $1++) {');
      indentStack.push(currentIndent + 4);
    } else if (trans.startsWith('for ') && trans.includes('in ')) {
      trans = trans.replace(/for\s+([a-zA-Z0-9_]+)\s+in\s+(.*?):/, 'for (const $1 of ($2)) {');
      indentStack.push(currentIndent + 4);
    } else if (trans.startsWith('while ') && trans.endsWith(':')) {
      trans = trans.replace(/while\s+(.*?):/, 'while ($1) {');
      indentStack.push(currentIndent + 4);
    } else if (trans.startsWith('if ') && trans.endsWith(':')) {
      trans = trans.replace(/if\s+(.*?):/, 'if ($1) {');
      indentStack.push(currentIndent + 4);
    } else if (trans.startsWith('elif ') && trans.endsWith(':')) {
      trans = trans.replace(/elif\s+(.*?):/, '} else if ($1) {');
    } else if (trans === 'else:') {
      trans = '} else {';
    } else if (trans.startsWith('def ') && trans.endsWith(':')) {
      trans = trans.replace(/def\s+([a-zA-Z0-9_]+)\((.*?)\):/, 'function $1($2) {');
      indentStack.push(currentIndent + 4);
    }

    result.push(trans);
  }

  while (indentStack.length > 1) {
    indentStack.pop();
    result.push('}');
  }

  return result.join('\n');
}
