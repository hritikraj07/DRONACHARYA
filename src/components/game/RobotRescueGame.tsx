// Dronacharya Robot Rescue: Interactive 2D Grid Game
// Replaces static MCQs with a real, playable visual game engine for learning Python loops & logic
'use client';

import React, { useState, useEffect, useRef } from 'react';
import {
  Play,
  RotateCcw,
  Sparkles,
  Heart,
  Award,
  Zap,
  ShieldAlert,
  HelpCircle,
  CheckCircle2,
  AlertTriangle,
  ChevronRight,
  Terminal,
  Code2,
  Gamepad2,
} from 'lucide-react';
import confetti from 'canvas-confetti';

export interface RobotRescueGameProps {
  onLevelComplete?: (xpEarned: number) => void;
  onHeartLost?: () => void;
  heartsRemaining?: number;
}

interface TilePosition {
  x: number;
  y: number;
}

// 5x5 Grid Layout
const GRID_SIZE = 5;
const START_POS: TilePosition = { x: 0, y: 0 };
const TARGET_POS: TilePosition = { x: 4, y: 4 };
const INITIAL_BATTERIES: TilePosition[] = [
  { x: 3, y: 0 },
  { x: 4, y: 1 },
];
const OBSTACLES: TilePosition[] = [
  { x: 1, y: 1 },
  { x: 3, y: 2 },
  { x: 2, y: 3 },
];

// Playable Coding Strategies
interface GameStrategy {
  id: string;
  name: string;
  badge: string;
  description: string;
  code: string;
  moves: ('RIGHT' | 'DOWN' | 'LEFT' | 'UP' | 'COLLECT')[];
  expectedOutcome: 'win' | 'collision' | 'out_of_battery';
  hint: string;
}

const STRATEGIES: GameStrategy[] = [
  {
    id: 'strategy-perimeter',
    name: 'Strategy A: Loop Along Perimeter (Recommended)',
    badge: 'Loop & Collect',
    description: 'Use a for-loop of range(3) along row 0 to grab the battery, then loop down safely avoiding the obstacle zone.',
    code: `# Strategy A: Loop & Collect
for step in range(3):
    robot.move("RIGHT")

robot.collect_battery()

for step in range(4):
    robot.move("DOWN")

robot.move("RIGHT")`,
    moves: ['RIGHT', 'RIGHT', 'RIGHT', 'COLLECT', 'DOWN', 'DOWN', 'DOWN', 'DOWN', 'RIGHT'],
    expectedOutcome: 'win',
    hint: 'This path bypasses the rock at (1,1), collects the energy cell at (3,0), and safely docks into the base at (4,4)!',
  },
  {
    id: 'strategy-diagonal',
    name: 'Strategy B: Diagonal Rush (Risky Step-Down)',
    badge: 'Collision Risk',
    description: 'Attempts to step DOWN then RIGHT alternatingly in a 2-step loop.',
    code: `# Strategy B: Diagonal Rush
for step in range(2):
    robot.move("DOWN")
    robot.move("RIGHT")  # Hits rock at (1, 1)!`,
    moves: ['DOWN', 'RIGHT'],
    expectedOutcome: 'collision',
    hint: 'Stepping DOWN then RIGHT lands directly on the asteroid rock at tile (1,1)! Check the coordinates.',
  },
  {
    id: 'strategy-lowbattery',
    name: 'Strategy C: Direct March (Skip Batteries)',
    badge: 'Battery Risk',
    description: 'Marches straight down column 0, ignoring battery cells. Runs out of energy before docking.',
    code: `# Strategy C: Direct March
for step in range(4):
    robot.move("DOWN")

for step in range(4):
    robot.move("RIGHT")`,
    moves: ['DOWN', 'DOWN', 'DOWN', 'DOWN', 'RIGHT', 'RIGHT', 'RIGHT', 'RIGHT'],
    expectedOutcome: 'out_of_battery',
    hint: 'Skipping the battery cells leaves the rover with 0% battery before it can complete the march to (4,4).',
  },
];

export function RobotRescueGame({
  onLevelComplete,
  onHeartLost,
  heartsRemaining = 3,
}: RobotRescueGameProps) {
  // Game Play State
  const [selectedStrategyId, setSelectedStrategyId] = useState<string>(STRATEGIES[0].id);
  const [robotPos, setRobotPos] = useState<TilePosition>(START_POS);
  const [batteries, setBatteries] = useState<TilePosition[]>(INITIAL_BATTERIES);
  const [batteryLevel, setBatteryLevel] = useState<number>(60); // 60%
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [gameResult, setGameResult] = useState<'idle' | 'running' | 'won' | 'collision' | 'depleted'>('idle');
  const [consoleLogs, setConsoleLogs] = useState<string[]>([
    '🎮 Robot Rescue Engine Initialized.',
    '📍 Mission: Navigate rover to Base 🏁. Collect ⚡ to keep battery above 0%.',
  ]);
  const [activeStepIndex, setActiveStepIndex] = useState<number>(-1);
  const [speedMs, setSpeedMs] = useState<number>(450);
  const [showAcharyaHint, setShowAcharyaHint] = useState<boolean>(false);

  const activeStrategy = STRATEGIES.find((s) => s.id === selectedStrategyId) || STRATEGIES[0];
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  // Clean timer on unmount
  useEffect(() => {
    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, []);

  // Reset Game Board
  const resetGame = () => {
    if (timerRef.current) clearTimeout(timerRef.current);
    setIsPlaying(false);
    setRobotPos(START_POS);
    setBatteries(INITIAL_BATTERIES);
    setBatteryLevel(60);
    setGameResult('idle');
    setActiveStepIndex(-1);
    setConsoleLogs((prev) => [
      ...prev.slice(-3),
      `🔄 Reset board to starting coordinates (${START_POS.x}, ${START_POS.y}).`,
    ]);
  };

  // Switch Strategy
  const handleSelectStrategy = (id: string) => {
    if (isPlaying) return;
    setSelectedStrategyId(id);
    resetGame();
  };

  // Play Game Execution Step-by-Step
  const handlePlayGame = () => {
    if (isPlaying) return;

    resetGame();
    setIsPlaying(true);
    setGameResult('running');
    setConsoleLogs((prev) => [
      ...prev,
      `▶ Executing: "${activeStrategy.name}"`,
      `[PYTHON] Starting loop execution...`,
    ]);

    let currentX = START_POS.x;
    let currentY = START_POS.y;
    let currentBat = 60;
    let currentBatteries = [...INITIAL_BATTERIES];
    const moves = activeStrategy.moves;

    let step = 0;

    const executeNextMove = () => {
      if (step >= moves.length) {
        // Finished all moves: Check if reached target
        if (currentX === TARGET_POS.x && currentY === TARGET_POS.y) {
          setGameResult('won');
          setIsPlaying(false);
          setConsoleLogs((prev) => [
            ...prev,
            `🌟 VICTORY! Rover docked at Base Beacon (${TARGET_POS.x}, ${TARGET_POS.y}) with ${currentBat}% battery!`,
            `🏆 Concept Mastered: For-Loops & Sequential Logic!`,
          ]);

          try {
            confetti({
              particleCount: 80,
              spread: 70,
              origin: { y: 0.6 },
            });
          } catch (e) {}

          if (onLevelComplete) {
            onLevelComplete(100);
          }
        } else {
          // Stopped short
          setGameResult('depleted');
          setIsPlaying(false);
          setConsoleLogs((prev) => [
            ...prev,
            `⚠️ Rover stopped at (${currentX}, ${currentY}), short of target (${TARGET_POS.x}, ${TARGET_POS.y}).`,
          ]);
          if (onHeartLost) onHeartLost();
        }
        return;
      }

      const move = moves[step];
      setActiveStepIndex(step);

      if (move === 'COLLECT') {
        // Check if on battery tile
        const foundIndex = currentBatteries.findIndex(
          (b) => b.x === currentX && b.y === currentY
        );
        if (foundIndex !== -1) {
          currentBatteries = currentBatteries.filter((_, idx) => idx !== foundIndex);
          setBatteries([...currentBatteries]);
          currentBat = Math.min(100, currentBat + 35);
          setBatteryLevel(currentBat);
          setConsoleLogs((prev) => [
            ...prev,
            `⚡ [STEP ${step + 1}] robot.collect_battery() -> Found Energy Cell at (${currentX}, ${currentY})! Battery +35% -> ${currentBat}%`,
          ]);
        } else {
          setConsoleLogs((prev) => [
            ...prev,
            `⚡ [STEP ${step + 1}] robot.collect_battery() -> No battery cell here.`,
          ]);
        }
      } else {
        // Movement: -10% battery
        currentBat = Math.max(0, currentBat - 10);
        setBatteryLevel(currentBat);

        if (move === 'RIGHT') currentX += 1;
        if (move === 'LEFT') currentX -= 1;
        if (move === 'DOWN') currentY += 1;
        if (move === 'UP') currentY -= 1;

        setRobotPos({ x: currentX, y: currentY });
        setConsoleLogs((prev) => [
          ...prev,
          `🤖 [STEP ${step + 1}] robot.move("${move}") -> Position: (${currentX}, ${currentY}) | Battery: ${currentBat}%`,
        ]);

        // Collision Check with Obstacles
        const hitRock = OBSTACLES.some((o) => o.x === currentX && o.y === currentY);
        if (hitRock) {
          setGameResult('collision');
          setIsPlaying(false);
          setConsoleLogs((prev) => [
            ...prev,
            `💥 CRASH ALERT! Rover collided with space rock at (${currentX}, ${currentY})!`,
            `💔 1 Life Lost. Acharya Hint: Check loop range & coordinates!`,
          ]);
          if (onHeartLost) onHeartLost();
          return;
        }

        // Battery Depleted Check
        if (currentBat <= 0 && !(currentX === TARGET_POS.x && currentY === TARGET_POS.y)) {
          setGameResult('depleted');
          setIsPlaying(false);
          setConsoleLogs((prev) => [
            ...prev,
            `🪫 POWER DEPLETED! Battery reached 0% at (${currentX}, ${currentY}). Rover shut down.`,
            `💔 1 Life Lost. Tip: Collect battery cells along the way!`,
          ]);
          if (onHeartLost) onHeartLost();
          return;
        }

        // Reached Beacon
        if (currentX === TARGET_POS.x && currentY === TARGET_POS.y) {
          setGameResult('won');
          setIsPlaying(false);
          setConsoleLogs((prev) => [
            ...prev,
            `🌟 VICTORY! Base Beacon reached! Mission Complete!`,
          ]);

          try {
            confetti({
              particleCount: 90,
              spread: 70,
              origin: { y: 0.6 },
            });
          } catch (e) {}

          if (onLevelComplete) {
            onLevelComplete(100);
          }
          return;
        }
      }

      step++;
      timerRef.current = setTimeout(executeNextMove, speedMs);
    };

    timerRef.current = setTimeout(executeNextMove, speedMs);
  };

  return (
    <div className="w-full bg-[#FAF8F5] border-2 border-[#354B3A]/30 rounded-2xl p-4 sm:p-6 shadow-xl">
      {/* Game HUD Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-[#D8CFC0] pb-4 mb-5">
        <div className="flex items-center gap-2.5">
          <div className="w-9 h-9 rounded-xl bg-[#354B3A] text-[#F6F1E7] flex items-center justify-center font-bold text-lg shadow-xs">
            🤖
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="font-serif font-bold text-lg text-[#252820]">
                Rescue the Robot: 2D Loop Odyssey
              </h3>
              <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-full bg-[#E2E8E3] text-[#354B3A] border border-[#354B3A]">
                Level 1: Loops
              </span>
            </div>
            <p className="text-xs text-[#575A51]">
              Pick your Python loop strategy, then <strong>play the live game</strong> to guide the rover!
            </p>
          </div>
        </div>

        {/* HUD Vitals */}
        <div className="flex items-center gap-3">
          {/* Battery Level Gauge */}
          <div className="bg-white border border-[#D8CFC0] rounded-lg px-3 py-1.5 flex items-center gap-2 shadow-2xs">
            <Zap className={`w-4 h-4 ${batteryLevel > 30 ? 'text-[#B49A65]' : 'text-[#A65F43] animate-pulse'}`} />
            <div>
              <div className="text-[9px] uppercase font-bold text-[#7E8276] leading-none">Battery</div>
              <div className="text-xs font-mono font-bold text-[#252820] leading-tight">
                {batteryLevel}%
              </div>
            </div>
          </div>

          {/* Player Lives */}
          <div className="bg-white border border-[#A65F43] rounded-lg px-3 py-1.5 flex items-center gap-2 shadow-2xs text-[#A65F43]">
            <Heart className="w-4 h-4 fill-[#A65F43]" />
            <div>
              <div className="text-[9px] uppercase font-bold text-[#7E8276] leading-none">Lives</div>
              <div className="text-xs font-mono font-bold leading-tight">
                {heartsRemaining} / 3
              </div>
            </div>
          </div>

          {/* Reset Game Button */}
          <button
            onClick={resetGame}
            disabled={isPlaying}
            className="p-2 rounded bg-white border border-[#D8CFC0] hover:bg-[#E9DFC9] text-[#575A51] disabled:opacity-50 transition-colors"
            title="Reset Board"
          >
            <RotateCcw className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Main Game Interface: Left Board + Right Strategy Deck */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* 2D VISUAL GRID BOARD (5 Cols) */}
        <div className="lg:col-span-5 flex flex-col items-center">
          <div className="text-xs font-bold text-[#354B3A] uppercase tracking-wider mb-2 flex items-center gap-1.5">
            <Gamepad2 className="w-4 h-4" />
            <span>Interactive 5×5 Arena Map</span>
          </div>

          {/* Visual Grid Container */}
          <div className="relative bg-[#252820] p-3 rounded-2xl shadow-2xl border-2 border-[#3A3E34] w-full max-w-[340px]">
            {/* Grid Coordinates (0 to 4) */}
            <div className="grid grid-cols-5 gap-1.5 aspect-square">
              {Array.from({ length: GRID_SIZE * GRID_SIZE }).map((_, index) => {
                const x = index % GRID_SIZE;
                const y = Math.floor(index / GRID_SIZE);

                const isRobotHere = robotPos.x === x && robotPos.y === y;
                const isTargetHere = TARGET_POS.x === x && TARGET_POS.y === y;
                const isObstacleHere = OBSTACLES.some((o) => o.x === x && o.y === y);
                const isBatteryHere = batteries.some((b) => b.x === x && b.y === y);

                return (
                  <div
                    key={`${x}-${y}`}
                    className={`relative rounded-lg flex flex-col items-center justify-center transition-all duration-300 ${
                      isRobotHere
                        ? 'bg-[#354B3A] text-white ring-2 ring-[#B49A65] scale-105 z-10 shadow-lg'
                        : isTargetHere
                        ? 'bg-[#2B3D2F] border-2 border-dashed border-[#B49A65]'
                        : isObstacleHere
                        ? 'bg-[#382622] border border-[#A65F43]/50'
                        : isBatteryHere
                        ? 'bg-[#383320] border border-[#B49A65]/40'
                        : 'bg-[#2E332A] border border-[#3A3E34] hover:bg-[#383D33]'
                    }`}
                  >
                    {/* Small Coordinate Label */}
                    <span className="absolute top-0.5 left-1 text-[8px] font-mono text-[#7E8276]/60">
                      {x},{y}
                    </span>

                    {/* Cell Content Icon */}
                    {isRobotHere && (
                      <div className="text-xl animate-bounce">🤖</div>
                    )}
                    {!isRobotHere && isTargetHere && (
                      <div className="text-lg animate-pulse" title="Base Beacon">
                        🏁
                      </div>
                    )}
                    {!isRobotHere && isObstacleHere && (
                      <div className="text-base" title="Asteroid Rock">
                        🪨
                      </div>
                    )}
                    {!isRobotHere && isBatteryHere && (
                      <div className="text-base animate-pulse" title="Energy Cell (+35%)">
                        ⚡
                      </div>
                    )}
                  </div>
                );
              })}
            </div>

            {/* Map Legend */}
            <div className="flex items-center justify-between mt-3 text-[10px] text-[#A6AC9B] px-1 font-medium">
              <span>🤖 Rover</span>
              <span>⚡ Cell (+35%)</span>
              <span>🪨 Rock</span>
              <span>🏁 Base</span>
            </div>
          </div>

          {/* Game Speed Controls */}
          <div className="flex items-center gap-2 mt-3 text-xs text-[#575A51]">
            <span className="text-[11px]">Speed:</span>
            <button
              onClick={() => setSpeedMs(600)}
              className={`px-2 py-0.5 rounded text-[10px] border ${
                speedMs === 600 ? 'bg-[#354B3A] text-white border-[#354B3A]' : 'bg-white border-[#D8CFC0]'
              }`}
            >
              Slow
            </button>
            <button
              onClick={() => setSpeedMs(400)}
              className={`px-2 py-0.5 rounded text-[10px] border ${
                speedMs === 400 ? 'bg-[#354B3A] text-white border-[#354B3A]' : 'bg-white border-[#D8CFC0]'
              }`}
            >
              Normal
            </button>
            <button
              onClick={() => setSpeedMs(200)}
              className={`px-2 py-0.5 rounded text-[10px] border ${
                speedMs === 200 ? 'bg-[#354B3A] text-white border-[#354B3A]' : 'bg-white border-[#D8CFC0]'
              }`}
            >
              Fast
            </button>
          </div>
        </div>

        {/* RIGHT: STRATEGY DECK & CODE EXECUTION (7 Cols) */}
        <div className="lg:col-span-7 flex flex-col justify-between space-y-4">
          <div>
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-bold text-[#A65F43] uppercase tracking-wider flex items-center gap-1">
                <Code2 className="w-4 h-4" />
                <span>Select Code Strategy to Play in Game:</span>
              </span>
              <button
                onClick={() => setShowAcharyaHint(!showAcharyaHint)}
                className="text-xs text-[#354B3A] font-semibold flex items-center gap-1 hover:underline cursor-pointer"
              >
                <HelpCircle className="w-3.5 h-3.5" />
                <span>{showAcharyaHint ? 'Hide Hint' : 'AI Hint'}</span>
              </button>
            </div>

            {/* Strategy Options Cards (NO boring MCQ! Playable tactics!) */}
            <div className="space-y-2.5">
              {STRATEGIES.map((strat) => {
                const isSelected = selectedStrategyId === strat.id;
                return (
                  <div
                    key={strat.id}
                    onClick={() => handleSelectStrategy(strat.id)}
                    className={`p-3 rounded-xl border-2 cursor-pointer transition-all ${
                      isSelected
                        ? 'bg-[#E9DFC9] border-[#354B3A] shadow-sm ring-1 ring-[#354B3A]'
                        : 'bg-white border-[#D8CFC0] hover:border-[#354B3A]/60'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-1">
                      <div className="flex items-center gap-2">
                        <span
                          className={`w-4 h-4 rounded-full border-2 flex items-center justify-center ${
                            isSelected
                              ? 'border-[#354B3A] bg-[#354B3A]'
                              : 'border-[#7E8276] bg-white'
                          }`}
                        >
                          {isSelected && <div className="w-1.5 h-1.5 rounded-full bg-white" />}
                        </span>
                        <span className="font-semibold text-xs text-[#252820]">
                          {strat.name}
                        </span>
                      </div>
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-white border border-[#D8CFC0] text-[#575A51]">
                        {strat.badge}
                      </span>
                    </div>

                    <p className="text-[11px] text-[#575A51] ml-6 leading-relaxed">
                      {strat.description}
                    </p>
                  </div>
                );
              })}
            </div>

            {/* Acharya Socratic AI Hint Box */}
            {showAcharyaHint && (
              <div className="mt-3 p-3 rounded-xl bg-[#FBF8F2] border border-[#B49A65] text-xs text-[#7A6230] animate-in fade-in">
                <div className="font-bold flex items-center gap-1.5 mb-1 text-[#354B3A]">
                  <Sparkles className="w-3.5 h-3.5 text-[#B49A65]" />
                  <span>Dronacharya AI Hint:</span>
                </div>
                <p className="italic">{activeStrategy.hint}</p>
              </div>
            )}

            {/* Code Inspection Terminal */}
            <div className="mt-3 bg-[#252820] rounded-xl p-3 border border-[#3A3E34] text-xs">
              <div className="flex items-center justify-between border-b border-[#3A3E34] pb-1.5 mb-2 text-[#A6AC9B]">
                <div className="flex items-center gap-1.5">
                  <Terminal className="w-3.5 h-3.5 text-[#B49A65]" />
                  <span className="font-mono text-[11px]">loop_logic.py</span>
                </div>
                <span className="text-[10px] bg-[#354B3A] text-white px-1.5 py-0.5 rounded">
                  Active Code
                </span>
              </div>
              <pre className="font-mono text-xs text-[#E9DFC9] overflow-x-auto leading-relaxed">
                {activeStrategy.code}
              </pre>
            </div>
          </div>

          {/* Feedback & Result Alerts */}
          {gameResult === 'won' && (
            <div className="p-3 rounded-xl bg-[#E2E8E3] border-2 border-[#354B3A] text-xs text-[#354B3A] font-semibold flex items-center gap-2.5 animate-in zoom-in-95">
              <CheckCircle2 className="w-5 h-5 shrink-0" />
              <div>
                <div className="font-bold text-sm">Level Cleared! +100 Mastery XP Earned!</div>
                <div className="text-[11px] font-normal text-[#252820]">
                  You successfully executed the loop sequences, gathered energy, and guided the rover home.
                </div>
              </div>
            </div>
          )}

          {gameResult === 'collision' && (
            <div className="p-3 rounded-xl bg-[#FAF4F0] border-2 border-[#A65F43] text-xs text-[#A65F43] flex items-center gap-2.5 animate-in shake">
              <AlertTriangle className="w-5 h-5 shrink-0" />
              <div>
                <div className="font-bold">Collision Detected! Rover damaged.</div>
                <div className="text-[11px] text-[#252820]">
                  The loop steered into asteroid rock at (1, 1). Switch to Strategy A to bypass!
                </div>
              </div>
            </div>
          )}

          {gameResult === 'depleted' && (
            <div className="p-3 rounded-xl bg-[#FAF4F0] border-2 border-[#A65F43] text-xs text-[#A65F43] flex items-center gap-2.5">
              <Zap className="w-5 h-5 shrink-0" />
              <div>
                <div className="font-bold">Battery Depleted!</div>
                <div className="text-[11px] text-[#252820]">
                  The rover ran out of power before reaching the beacon. Make sure to collect batteries!
                </div>
              </div>
            </div>
          )}

          {/* Action Button: PLAY GAME WITH SELECTED STRATEGY */}
          <div className="pt-2">
            <button
              onClick={handlePlayGame}
              disabled={isPlaying}
              className="w-full btn-primary py-3 text-sm font-bold shadow-md flex items-center justify-center gap-2 hover:scale-[1.01] active:scale-[0.99] transition-all cursor-pointer"
            >
              <Play className={`w-4 h-4 ${isPlaying ? 'animate-spin' : ''}`} />
              <span>
                {isPlaying ? 'Running Code & Playing in Arena...' : '▶ Play Selected Code Strategy in Game!'}
              </span>
            </button>
          </div>
        </div>
      </div>

      {/* Real-Time Game Terminal Logs */}
      <div className="mt-5 bg-[#1F221B] rounded-xl p-3 border border-[#3A3E34] text-xs">
        <div className="flex items-center justify-between text-[#A6AC9B] pb-1 border-b border-[#3A3E34]/50 mb-1.5 text-[11px]">
          <span>Game Telemetry Console</span>
          <span className="text-[10px] text-[#7E8276]">Status: {gameResult.toUpperCase()}</span>
        </div>
        <div className="font-mono text-[11px] text-[#A6AC9B] space-y-0.5 max-h-24 overflow-y-auto">
          {consoleLogs.map((log, i) => (
            <div
              key={i}
              className={`${
                log.includes('VICTORY')
                  ? 'text-[#68D391] font-bold'
                  : log.includes('CRASH') || log.includes('ALERT')
                  ? 'text-[#FC8181] font-bold'
                  : log.includes('BATTERY')
                  ? 'text-[#F6E05E]'
                  : 'text-[#E9DFC9]'
              }`}
            >
              {log}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
