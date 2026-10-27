// Dronacharya Mission Simulator & Bug-to-Battle Arena
// Immersive 3-Panel Game Workspace: Real Python Execution, Interactive 2D Grid / Laser Chamber, Progressive Hints & Battle Challenges
'use client';

import React, { useState, useEffect, useRef, Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { useDronacharya } from '@/lib/store';
import { executeRobotCode, RobotSimulationResult, RobotSimulationFrame } from '@/lib/simulator/robot-code-executor';
import { executePythonChallenge, ExecutionResult } from '@/lib/simulator/python-runner';
import { PlayableGridEngine } from '@/components/game/PlayableGridEngine';
import { CellFilterEngine, BioCell } from '@/components/game/CellFilterEngine';
import { recordGameProgress, deductHeart, getActiveSession, triggerSaveProgressModal } from '@/lib/db/auth-db';
import { AcharyaDrawer } from '@/components/mentor/AcharyaDrawer';
import {
  Code2,
  Play,
  Sparkles,
  CheckCircle2,
  XCircle,
  Terminal,
  RefreshCw,
  ArrowRight,
  HelpCircle,
  AlertTriangle,
  Zap,
  Gamepad2,
  ShieldCheck,
  Award,
  ChevronRight,
  RotateCcw,
  Target,
  Flame,
  Star,
  Layers,
  ChevronDown,
  X,
} from 'lucide-react';
import confetti from 'canvas-confetti';

interface MissionSpec {
  id: string;
  stageNumber: number;
  realmName: string;
  title: string;
  concept: string;
  story: string;
  instructions: string[];
  initialCode: string;
  xpReward: number;
  initialCells?: BioCell[];
}

const MISSIONS: Record<string, MissionSpec> = {
  'mission-rescue-robot': {
    id: 'mission-rescue-robot',
    stageNumber: 3,
    realmName: 'Loop Lab',
    title: 'Rescue the Robot: Facility Navigation',
    concept: 'Loops & Sequential Automation',
    story:
      'The research facility has suffered a sudden containment breach. Exploration rover Arya is stranded at tile (0, 0). Program its propulsion system using Python loops and movement commands to navigate around obstacle barriers, collect energy cells, and dock at the Emergency Beacon at tile (5, 5).',
    instructions: [
      'Write for-loops with range(count) to repeat steps efficiently.',
      'Use robot.move_right(), robot.move_down(), robot.move_left(), robot.move_up().',
      'Collect energy cells with robot.collect() to keep power above 0%.',
      'Avoid damaged blast doors at (1,1), (1,2), (3,2), and (2,3).',
    ],
    initialCode: `# Mission 1: Rescue Rover Arya
# Objective: Reach Extraction Beacon at (5, 5) with battery > 0%
# Available commands:
#   robot.move_right(n)
#   robot.move_down(n)
#   robot.move_left(n)
#   robot.move_up(n)
#   robot.collect()

# Step 1: Move right along row 0 to the first energy cell
for step in range(2):
    robot.move_right()

robot.collect()

# Step 2: Navigate around the central obstacles
# TODO: Program the remaining loops to guide Arya safely to (5, 5)!
`,
    xpReward: 150,
  },
  'mission-hazard-filter': {
    id: 'mission-hazard-filter',
    stageNumber: 4,
    realmName: 'Decision Forest',
    title: 'Filter Damaged Cells: Hazard Decontamination',
    concept: 'Conditions & Boolean Logic',
    story:
      'Radiation inside the bio-computing vault has corrupted data cells. You must program the sterilization drone to filter incoming streams of cells, admitting uncorrupted cells (positive values) while purging contaminated specimens (negative values).',
    instructions: [
      'Define filter_healthy_cells(data_cells: list) -> list.',
      'Loop through data_cells using for cell in data_cells:.',
      'Check if cell > 0 before adding it to clean_vault.',
      'Return the clean_vault list containing only positive charges.',
    ],
    initialCode: `# Mission 2: Hazard Filter Protocol
# Objective: Return a new list containing ONLY healthy cells (charge > 0)

def filter_healthy_cells(data_cells: list) -> list:
    clean_vault = []
    
    # TODO: Loop through data_cells and append only positive cells
    for cell in data_cells:
        if cell > 0:
            clean_vault.append(cell)
            
    return clean_vault
`,
    xpReward: 150,
    initialCells: [
      { id: 1, charge: 45, isContaminated: false },
      { id: 2, charge: -20, isContaminated: true },
      { id: 3, charge: 80, isContaminated: false },
      { id: 4, charge: -35, isContaminated: true },
      { id: 5, charge: 65, isContaminated: false },
    ],
  },
};

function SimulatorContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const missionParam = searchParams.get('mission') || 'mission-rescue-robot';
  const { state } = useDronacharya();

  const currentMission = MISSIONS[missionParam] || MISSIONS['mission-rescue-robot'];

  // Code & Execution State
  const [code, setCode] = useState(currentMission.initialCode);
  const [isRunning, setIsRunning] = useState(false);
  const [activeTab, setActiveTab] = useState<'arena' | 'code' | 'guide' | 'terminal'>('arena');
  const [terminalSubTab, setTerminalSubTab] = useState<'console' | 'diagnostics' | 'tests'>('console');
  const [consoleLogs, setConsoleLogs] = useState<string[]>([
    `🎮 Initialized mission: ${currentMission.title}`,
    '💡 Ready for Python code execution.',
  ]);

  // Robot Grid Simulation State
  const [robotSimResult, setRobotSimResult] = useState<RobotSimulationResult | null>(null);
  const [currentFrameIndex, setCurrentFrameIndex] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);
  const [animationSpeed, setAnimationSpeed] = useState<number>(1);
  const [collectedBatteries, setCollectedBatteries] = useState<number[]>([]);

  // Cell Filter Simulation State
  const [cells, setCells] = useState<BioCell[]>(currentMission.initialCells || []);
  const [activeCellIndex, setActiveCellIndex] = useState(-1);
  const [matrixVaultCount, setMatrixVaultCount] = useState(0);
  const [quarantineCount, setQuarantineCount] = useState(0);
  const [filterSimResult, setFilterSimResult] = useState<ExecutionResult | null>(null);

  // Progressive Hints (4 Tiers)
  const [hintTier, setHintTier] = useState<number>(0);

  // Modals & Battle Challenge State
  const [isCelebrationOpen, setIsCelebrationOpen] = useState(false);
  const [isBattleChallengeOpen, setIsBattleChallengeOpen] = useState(false);
  const [isMentorOpen, setIsMentorOpen] = useState(false);
  const [proactiveTrigger, setProactiveTrigger] = useState<{
    type: 'collision' | 'error' | 'battery' | 'syntax';
    message: string;
    line?: number;
  } | null>(null);
  const [battleCode, setBattleCode] = useState(
    `# Battle Challenge: Booster Protocol
# The rover activated an auxiliary capacitor!
# Multiply each positive energy cell by 2 before appending.

def boosted_rescue(cells: list) -> list:
    boosted = []
    # TODO: Multiply positive cells by 2
    for c in cells:
        if c > 0:
            boosted.append(c * 2)
    return boosted
`
  );
  const [battleResult, setBattleResult] = useState<ExecutionResult | null>(null);
  const [battleCompleted, setBattleCompleted] = useState(false);

  const animationTimerRef = useRef<NodeJS.Timeout | null>(null);

  // Synchronize on mission change
  useEffect(() => {
    setCode(currentMission.initialCode);
    setRobotSimResult(null);
    setCurrentFrameIndex(0);
    setIsAnimating(false);
    setCollectedBatteries([]);
    setHintTier(0);
    setIsCelebrationOpen(false);
    setIsBattleChallengeOpen(false);
    setBattleCompleted(false);
    setCells(currentMission.initialCells || []);
    setMatrixVaultCount(0);
    setQuarantineCount(0);
    setActiveCellIndex(-1);
    setConsoleLogs([
      `🎮 Realm: ${currentMission.realmName} — ${currentMission.title}`,
      '💡 Review your mission objectives and write code to control the simulation.',
    ]);
  }, [currentMission.id]);

  // Clean timer on unmount
  useEffect(() => {
    return () => {
      if (animationTimerRef.current) clearTimeout(animationTimerRef.current);
    };
  }, []);

  // Reset simulation arena
  const handleReset = () => {
    if (animationTimerRef.current) clearTimeout(animationTimerRef.current);
    setIsAnimating(false);
    setCurrentFrameIndex(0);
    setCollectedBatteries([]);
    setCells(currentMission.initialCells || []);
    setActiveCellIndex(-1);
    setMatrixVaultCount(0);
    setQuarantineCount(0);
    setConsoleLogs((prev) => [...prev.slice(-4), '🔄 Simulation reset to initial coordinates.']);
  };

  // Run Robot Code Simulation
  const handleRunRobotCode = () => {
    if (isAnimating) return;
    handleReset();
    setIsRunning(true);

    const result = executeRobotCode(code);
    setRobotSimResult(result);

    // Stream console logs
    setConsoleLogs((prev) => [
      ...prev,
      '▶ Compiling & executing Python commands...',
      `⚡ Interpreted ${result.frames.length - 1} actions. Commencing rover simulation...`,
    ]);

    // Animate frames step-by-step
    setIsAnimating(true);
    let frameIdx = 0;
    const frames = result.frames;
    const collected: number[] = [];

    const delay = Math.max(120, 500 / animationSpeed);

    const stepAnimation = () => {
      if (frameIdx < frames.length) {
        const frame = frames[frameIdx];
        setCurrentFrameIndex(frameIdx);

        if (frame.collectedBatteryIndex !== undefined) {
          collected.push(frame.collectedBatteryIndex);
          setCollectedBatteries([...collected]);
        }

        setConsoleLogs((prev) => [...prev.slice(-6), frame.logMessage]);

        frameIdx++;
        animationTimerRef.current = setTimeout(stepAnimation, delay);
      } else {
        // Animation completed
        setIsAnimating(false);
        setIsRunning(false);

        if (result.success) {
          try {
            confetti({
              particleCount: 90,
              spread: 70,
              origin: { y: 0.6 },
            });
          } catch (e) {}

          // Record progress to Supabase and local store
          recordGameProgress({
            missionId: currentMission.id,
            earnedXp: currentMission.xpReward,
            subject: 'python-basics',
          });

          setIsCelebrationOpen(true);
        } else {
          // Deduct a heart on collision/failure
          deductHeart();
          setTerminalSubTab('diagnostics');

          // Proactively alert Acharya AI Socratic Mentor
          if (result.hitObstacle) {
            setProactiveTrigger({
              type: 'collision',
              message: `Rover Arya collided with a damaged blast door barrier at (${result.finalX}, ${result.finalY})!`,
            });
            setIsMentorOpen(true);
          } else if (result.depleted) {
            setProactiveTrigger({
              type: 'battery',
              message: `Arya's battery depleted at (${result.finalX}, ${result.finalY}) before reaching Emergency Beacon (5, 5).`,
            });
            setIsMentorOpen(true);
          } else if (result.outOfBounds) {
            setProactiveTrigger({
              type: 'error',
              message: `Rover stepped outside the facility perimeter boundary at (${result.finalX}, ${result.finalY}).`,
            });
            setIsMentorOpen(true);
          } else if (!result.reachedTarget) {
            setProactiveTrigger({
              type: 'syntax',
              message: `Rover Arya halted at (${result.finalX}, ${result.finalY}), short of destination (5, 5).`,
            });
            setIsMentorOpen(true);
          }
        }
      }
    };

    animationTimerRef.current = setTimeout(stepAnimation, delay);
  };

  // Run Cell Filter Simulation
  const handleRunCellFilter = async () => {
    setIsRunning(true);
    handleReset();

    const testCases = [
      { id: 't1', inputDescription: 'filter_healthy_cells([45, -20, 80])', expectedOutput: '[45, 80]', codeSnippet: 'assert filter_healthy_cells([45, -20, 80]) == [45, 80]' },
      { id: 't2', inputDescription: 'filter_healthy_cells([-5, -10, -15])', expectedOutput: '[]', codeSnippet: 'assert filter_healthy_cells([-5, -10, -15]) == []' },
      { id: 't3', inputDescription: 'filter_healthy_cells([10, 20, 30])', expectedOutput: '[10, 20, 30]', codeSnippet: 'assert filter_healthy_cells([10, 20, 30]) == [10, 20, 30]' },
    ];

    const result = await executePythonChallenge(code, testCases, currentMission.id);
    setFilterSimResult(result);
    setIsRunning(false);

    // Animate conveyor inspection
    const testCells = currentMission.initialCells || [];
    let idx = 0;
    let vault = 0;
    let purged = 0;

    const animateConveyor = () => {
      if (idx < testCells.length) {
        setActiveCellIndex(idx);
        const cell = testCells[idx];
        if (cell.charge > 0) {
          vault++;
          setMatrixVaultCount(vault);
        } else {
          purged++;
          setQuarantineCount(purged);
        }
        idx++;
        setTimeout(animateConveyor, 400);
      } else {
        if (result.allPassed) {
          try {
            confetti({
              particleCount: 90,
              spread: 70,
              origin: { y: 0.6 },
            });
          } catch (e) {}

          recordGameProgress({
            missionId: currentMission.id,
            earnedXp: currentMission.xpReward,
            subject: 'python-basics',
          });

          setIsCelebrationOpen(true);
        } else {
          deductHeart();
          setTerminalSubTab('diagnostics');

          const failedTest = result.testResults?.find((t) => !t.passed);
          setProactiveTrigger({
            type: 'error',
            message:
              result.stderr ||
              result.diagnosticExplanation ||
              (failedTest
                ? `Test failed: ${failedTest.description}. Expected ${failedTest.expected}.`
                : 'Cell filter protocol failed to quarantine contaminated cells.'),
          });
          setIsMentorOpen(true);
        }
      }
    };

    animateConveyor();
  };

  // Run Follow-Up Battle Challenge
  const handleRunBattleChallenge = async () => {
    setIsRunning(true);
    const battleTests = [
      { id: 'b1', inputDescription: 'boosted_rescue([10, -5, 20])', expectedOutput: '[20, 40]', codeSnippet: 'assert boosted_rescue([10, -5, 20]) == [20, 40]' },
      { id: 'b2', inputDescription: 'boosted_rescue([5, 15])', expectedOutput: '[10, 30]', codeSnippet: 'assert boosted_rescue([5, 15]) == [10, 30]' },
    ];

    const res = await executePythonChallenge(battleCode, battleTests, 'mission-battle');
    setBattleResult(res);
    setIsRunning(false);

    if (res.allPassed) {
      setBattleCompleted(true);
      try {
        confetti({
          particleCount: 100,
          spread: 80,
          origin: { y: 0.5 },
        });
      } catch (e) {}
      recordGameProgress({
        missionId: 'battle-challenge-booster',
        earnedXp: 50,
        subject: 'python-basics',
      });
    }
  };

  const currentFrame = robotSimResult?.frames[currentFrameIndex];

  return (
    <div className="w-full max-w-7xl mx-auto px-3 sm:px-6 py-6 flex-1 flex flex-col gap-5 overflow-x-hidden">
      {/* Top Mission Banner & Realm Switcher */}
      <div className="bg-white border-2 border-[#1E1E24] rounded-2xl p-4 sm:p-5 shadow-[4px_4px_0px_#1E1E24] flex flex-col xl:flex-row xl:items-center justify-between gap-4 overflow-hidden">
        <div className="flex-1 min-w-0">
          <div className="flex flex-wrap items-center gap-2 mb-2">
            <span className="px-2.5 py-0.5 rounded-full bg-[#EDE9FE] border border-[#1E1E24] text-[11px] font-black text-[#6C5CE7] shrink-0">
              Stage {currentMission.stageNumber}: {currentMission.realmName}
            </span>
            <span className="px-2.5 py-0.5 rounded-full bg-[#FEF3C7] border border-[#1E1E24] text-[11px] font-black text-[#D97706] flex items-center gap-1 shrink-0">
              <Star className="w-3 h-3 fill-[#F59E0B]" />
              <span>+{currentMission.xpReward} XP</span>
            </span>
            <span className="px-2.5 py-0.5 rounded-full bg-[#D1FAE5] border border-[#1E1E24] text-[11px] font-black text-[#059669] shrink-0">
              Concept: {currentMission.concept}
            </span>
          </div>

          <h1 className="font-serif font-black text-xl sm:text-2xl text-[#1E1E24] break-words">
            {currentMission.title}
          </h1>
        </div>

        {/* Mission Switcher & Mode Launchers (Responsive with wrap) */}
        <div className="flex flex-wrap items-center gap-2 shrink-0 max-w-full">
          {/* Active Quests Group */}
          <div className="flex items-center gap-1.5 p-1 bg-[#FAF6EE] border border-[#1E1E24]/20 rounded-xl shrink-0">
            <Link
              href="/simulator?mission=mission-rescue-robot"
              className={`btn-arcade text-xs px-3 py-1.5 whitespace-nowrap ${
                currentMission.id === 'mission-rescue-robot'
                  ? 'btn-arcade-purple'
                  : 'btn-arcade-white'
              }`}
            >
              Quest 1: Rescue Robot
            </Link>
            <Link
              href="/simulator?mission=mission-hazard-filter"
              className={`btn-arcade text-xs px-3 py-1.5 whitespace-nowrap ${
                currentMission.id === 'mission-hazard-filter'
                  ? 'btn-arcade-purple'
                  : 'btn-arcade-white'
              }`}
            >
              Quest 2: Filter Cells
            </Link>
          </div>

          {/* Quick Action Tools */}
          <div className="flex flex-wrap items-center gap-1.5">
            <button
              onClick={() => setIsMentorOpen(true)}
              className="btn-arcade text-xs px-3 py-1.5 bg-[#EDE9FE] hover:bg-[#DDD6FE] text-[#6C5CE7] border-2 border-[#1E1E24] shadow-[2px_2px_0px_#1E1E24] flex items-center gap-1.5 cursor-pointer whitespace-nowrap"
              title="Open Acharya Socratic AI Mentor"
            >
              <Sparkles className="w-3.5 h-3.5 fill-[#FFD214]" />
              <span>Acharya AI</span>
            </button>
            <Link
              href="/learn/py-less-1-1"
              className="btn-arcade text-xs px-3 py-1.5 bg-[#FEF3C7] hover:bg-[#FDE68A] text-[#D97706] border-2 border-[#1E1E24] shadow-[2px_2px_0px_#1E1E24] flex items-center gap-1.5 cursor-pointer whitespace-nowrap"
              title="Launch Rover Arya's Python Odyssey RPG Arena"
            >
              <span>🚀 Python Odyssey</span>
            </Link>
            <Link
              href="/dungeon"
              className="btn-arcade text-xs px-3 py-1.5 btn-arcade-yellow flex items-center gap-1.5 shadow-[2px_2px_0px_#1E1E24] whitespace-nowrap"
            >
              <span>⚔️ Code Dungeon</span>
            </Link>
          </div>
        </div>
      </div>

      {/* Mobile Tab Switcher */}
      <div className="grid grid-cols-2 sm:grid-cols-4 lg:hidden border-2 border-[#1E1E24] rounded-xl bg-white p-1 gap-1 shadow-[2px_2px_0px_#1E1E24]">
        <button
          onClick={() => setActiveTab('arena')}
          className={`py-2 px-2 text-xs font-bold rounded-lg transition-all text-center ${
            activeTab === 'arena' ? 'bg-[#6C5CE7] text-white shadow-xs' : 'text-[#4A4A58] hover:bg-slate-100'
          }`}
        >
          🎮 Game Arena
        </button>
        <button
          onClick={() => setActiveTab('code')}
          className={`py-2 px-2 text-xs font-bold rounded-lg transition-all text-center ${
            activeTab === 'code' ? 'bg-[#6C5CE7] text-white shadow-xs' : 'text-[#4A4A58] hover:bg-slate-100'
          }`}
        >
          💻 Code Editor
        </button>
        <button
          onClick={() => setActiveTab('guide')}
          className={`py-2 px-2 text-xs font-bold rounded-lg transition-all text-center ${
            activeTab === 'guide' ? 'bg-[#6C5CE7] text-white shadow-xs' : 'text-[#4A4A58] hover:bg-slate-100'
          }`}
        >
          📜 Codex Guide
        </button>
        <button
          onClick={() => setActiveTab('terminal')}
          className={`py-2 px-2 text-xs font-bold rounded-lg transition-all text-center ${
            activeTab === 'terminal' ? 'bg-[#6C5CE7] text-white shadow-xs' : 'text-[#4A4A58] hover:bg-slate-100'
          }`}
        >
          📟 Output
        </button>
      </div>

      {/* =========================================================================
          COORDINATED 3-PANEL GAMEPLAY WORKSPACE (Desktop: 3 Columns)
         ========================================================================= */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 flex-1 items-start">
        {/* PANEL A: QUEST CODEX (Left, 3.5 cols) */}
        <div className={`lg:col-span-4 space-y-4 ${activeTab !== 'guide' ? 'hidden lg:block' : 'block'}`}>
          {/* Mission Story & Objective Card */}
          <div className="card-game p-5 bg-white">
            <span className="text-[10px] font-black uppercase tracking-wider px-2 py-0.5 rounded bg-[#FEF3C7] border border-[#1E1E24] text-[#D97706] mb-2 inline-block">
              Quest Briefing
            </span>
            <h2 className="font-serif font-black text-lg text-[#1E1E24] mb-2">
              Story Narrative
            </h2>
            <p className="text-xs text-[#4A4A58] leading-relaxed mb-4">
              {currentMission.story}
            </p>

            <h3 className="font-serif font-black text-sm text-[#1E1E24] mb-2 flex items-center gap-1.5">
              <Target className="w-4 h-4 text-[#6C5CE7]" />
              <span>Directives & Constraints</span>
            </h3>
            <ul className="space-y-1.5 mb-4">
              {currentMission.instructions.map((inst, i) => (
                <li key={i} className="flex items-start gap-2 text-xs text-[#1E1E24]">
                  <span className="w-3.5 h-3.5 rounded-full bg-[#10B981] text-white flex items-center justify-center text-[9px] font-black shrink-0 mt-0.5">
                    ✓
                  </span>
                  <span>{inst}</span>
                </li>
              ))}
            </ul>

            {/* Optional Bonus Stars */}
            <div className="pt-3 border-t-2 border-[#1E1E24]/15">
              <span className="text-[10px] font-black uppercase tracking-wider text-[#7E7E8F] block mb-1.5">
                Optional Challenge Stars
              </span>
              <div className="space-y-1 text-[11px] font-bold text-[#4A4A58]">
                <div className="flex items-center gap-1.5">
                  <Star className="w-3.5 h-3.5 text-[#F59E0B]" />
                  <span>Energy Conservation: Finish with &gt; 20% battery</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <Star className="w-3.5 h-3.5 text-[#F59E0B]" />
                  <span>Flawless Flight: 0 barrier collisions</span>
                </div>
              </div>
            </div>
          </div>

          {/* Progressive 4-Tier Hints Card */}
          <div className="card-game p-5 bg-[#FAF6EE]">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-1.5">
                <Sparkles className="w-4 h-4 text-[#6C5CE7]" />
                <h3 className="font-serif font-black text-sm text-[#1E1E24]">
                  Socratic Hints ({hintTier}/4)
                </h3>
              </div>
              {hintTier < 4 && (
                <button
                  onClick={() => setHintTier((prev) => Math.min(4, prev + 1))}
                  className="px-2.5 py-1 rounded-lg bg-white border border-[#1E1E24] text-[10px] font-black text-[#6C5CE7] hover:bg-[#EDE9FE] shadow-xs"
                >
                  Unlock Hint {hintTier + 1}
                </button>
              )}
            </div>

            {hintTier === 0 ? (
              <p className="text-xs text-[#7E7E8F] italic">
                Stuck on logic? Click "Unlock Hint" to reveal progressive clues from Mentor Dronacharya.
              </p>
            ) : (
              <div className="space-y-2 text-xs">
                {hintTier >= 1 && (
                  <div className="p-2.5 rounded-lg bg-white border border-[#1E1E24]">
                    <span className="font-bold text-[#10B981] block mb-0.5">Tier 1 • Concept:</span>
                    <span>Use for-loops with range(n) to group repeated directional steps.</span>
                  </div>
                )}
                {hintTier >= 2 && (
                  <div className="p-2.5 rounded-lg bg-white border border-[#1E1E24]">
                    <span className="font-bold text-[#3B82F6] block mb-0.5">Tier 2 • Direction:</span>
                    <span>Tile (2,0) contains an energy cell. Collect it early to keep Arya powered.</span>
                  </div>
                )}
                {hintTier >= 3 && (
                  <div className="p-2.5 rounded-lg bg-white border border-[#1E1E24]">
                    <span className="font-bold text-[#D97706] block mb-0.5">Tier 3 • Debugging:</span>
                    <span>Avoid the rock at (1,1). Moving right along row 0 avoids all central walls!</span>
                  </div>
                )}
                {hintTier >= 4 && (
                  <div className="p-2.5 rounded-lg bg-[#FEF3C7] border border-[#1E1E24]">
                    <span className="font-bold text-[#DC2626] block mb-0.5">Tier 4 • Code Template:</span>
                    <pre className="font-mono text-[10px] text-[#1E1E24] bg-white p-2 rounded border border-[#1E1E24]/20 overflow-x-auto">
{`for step in range(3):
    robot.move_right()
robot.collect()
for step in range(4):
    robot.move_down()`}
                    </pre>
                  </div>
                )}
              </div>
            )}

            <button
              onClick={() => setIsMentorOpen(true)}
              className="w-full mt-3 py-2 px-3 rounded-xl bg-[#6C5CE7] hover:bg-[#5848c2] text-white text-xs font-black flex items-center justify-center gap-2 border-2 border-[#1E1E24] shadow-[2px_2px_0px_#1E1E24] cursor-pointer transition-all active:translate-y-0.5"
            >
              <Sparkles className="w-3.5 h-3.5 fill-[#FFD214]" />
              <span>Consult Acharya Socratic AI</span>
            </button>
          </div>
        </div>

        {/* PANEL B: PLAYABLE GAME ARENA (Middle, 4 cols) */}
        <div className={`lg:col-span-4 ${activeTab !== 'arena' ? 'hidden lg:block' : 'block'}`}>
          {currentMission.id === 'mission-rescue-robot' ? (
            <PlayableGridEngine
              currentFrame={currentFrame}
              isAnimating={isAnimating}
              onReset={handleReset}
              speed={animationSpeed}
              onSetSpeed={setAnimationSpeed}
              collectedBatteries={collectedBatteries}
            />
          ) : (
            <CellFilterEngine
              cells={cells}
              activeCellIndex={activeCellIndex}
              isScanning={isRunning}
              matrixVaultCount={matrixVaultCount}
              quarantineCount={quarantineCount}
              onReset={handleReset}
            />
          )}
        </div>

        {/* PANEL C: CODE STUDIO & MULTI-TAB TERMINAL (Right, 4 cols) */}
        <div className={`lg:col-span-4 space-y-4 ${activeTab !== 'code' && activeTab !== 'terminal' ? 'hidden lg:block' : 'block'}`}>
          {/* Real Code Workspace */}
          <div className="card-game p-4 bg-white flex flex-col justify-between">
            <div className="flex items-center justify-between pb-2.5 mb-2.5 border-b-2 border-[#1E1E24]/15">
              <div className="flex items-center gap-1.5">
                <Code2 className="w-4 h-4 text-[#6C5CE7]" />
                <span className="font-serif font-black text-xs text-[#1E1E24]">
                  Python Code Studio
                </span>
              </div>

              <button
                onClick={() => setCode(currentMission.initialCode)}
                className="text-[11px] font-bold text-[#7E7E8F] hover:text-[#EF4444] flex items-center gap-1"
                title="Reset code template"
              >
                <RotateCcw className="w-3 h-3" />
                <span>Reset Template</span>
              </button>
            </div>

            {/* Code Textarea with line numbers aesthetic */}
            <div className="relative rounded-xl border-2 border-[#1E1E24] bg-[#1E1E24] p-3 shadow-[2px_2px_0px_#1E1E24] overflow-hidden">
              <textarea
                value={code}
                onChange={(e) => setCode(e.target.value)}
                rows={13}
                spellCheck={false}
                className="w-full bg-transparent font-mono text-xs text-[#FAF6EE] focus:outline-none resize-none leading-relaxed selection:bg-[#6C5CE7]"
                placeholder="Write your Python commands here..."
              />
            </div>

            {/* Action Bar: Run Mission */}
            <div className="mt-4 flex items-center gap-2">
              <button
                onClick={
                  currentMission.id === 'mission-rescue-robot'
                    ? handleRunRobotCode
                    : handleRunCellFilter
                }
                disabled={isRunning || isAnimating}
                className="btn-arcade btn-arcade-purple flex-1 py-2.5 text-xs"
              >
                {isRunning || isAnimating ? (
                  <>
                    <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                    <span>Executing Game Loop...</span>
                  </>
                ) : (
                  <>
                    <Play className="w-3.5 h-3.5 fill-white" />
                    <span>Run Code &amp; Test Arena</span>
                  </>
                )}
              </button>

              <button
                onClick={() => setIsMentorOpen(true)}
                type="button"
                className="btn-arcade btn-arcade-yellow py-2.5 px-3.5 text-xs flex items-center gap-1.5 shrink-0 cursor-pointer"
                title="Consult Acharya Socratic AI Mentor"
              >
                <Sparkles className="w-3.5 h-3.5 fill-current" />
                <span className="hidden sm:inline">Ask Acharya</span>
              </button>
            </div>
          </div>

          {/* Multi-Tab Terminal / Diagnostics / Test Results */}
          <div className="card-game p-4 bg-[#FAF6EE]">
            {/* Terminal Tab Switcher */}
            <div className="flex items-center gap-1 border-b-2 border-[#1E1E24]/15 pb-2 mb-3">
              <button
                onClick={() => setTerminalSubTab('console')}
                className={`px-2.5 py-1 rounded-md text-[11px] font-black border transition-all ${
                  terminalSubTab === 'console'
                    ? 'bg-[#1E1E24] text-white border-[#1E1E24]'
                    : 'bg-white text-[#4A4A58] border-transparent hover:border-[#1E1E24]'
                }`}
              >
                📟 Console Log
              </button>
              <button
                onClick={() => setTerminalSubTab('diagnostics')}
                className={`px-2.5 py-1 rounded-md text-[11px] font-black border transition-all ${
                  terminalSubTab === 'diagnostics'
                    ? 'bg-[#EF4444] text-white border-[#1E1E24]'
                    : 'bg-white text-[#4A4A58] border-transparent hover:border-[#1E1E24]'
                }`}
              >
                ⚔️ Bug-to-Battle
              </button>
              <button
                onClick={() => setTerminalSubTab('tests')}
                className={`px-2.5 py-1 rounded-md text-[11px] font-black border transition-all ${
                  terminalSubTab === 'tests'
                    ? 'bg-[#10B981] text-white border-[#1E1E24]'
                    : 'bg-white text-[#4A4A58] border-transparent hover:border-[#1E1E24]'
                }`}
              >
                ✓ Test Results
              </button>
            </div>

            {/* TAB 1: CONSOLE LOG */}
            {terminalSubTab === 'console' && (
              <div className="h-32 bg-[#1E1E24] border-2 border-[#1E1E24] rounded-xl p-3 font-mono text-[11px] text-[#A29BFE] overflow-y-auto space-y-1">
                {consoleLogs.map((log, i) => (
                  <div key={i} className="leading-tight">
                    {log}
                  </div>
                ))}
              </div>
            )}

            {/* TAB 2: BUG-TO-BATTLE DIAGNOSTICS */}
            {terminalSubTab === 'diagnostics' && (
              <div className="h-32 bg-white border-2 border-[#1E1E24] rounded-xl p-3 text-xs overflow-y-auto">
                {robotSimResult?.failureReason ? (
                  <div className="space-y-1.5 text-xs text-[#DC2626]">
                    <span className="font-bold block flex items-center gap-1">
                      <AlertTriangle className="w-3.5 h-3.5" />
                      {robotSimResult.failureReason}
                    </span>
                    <p className="text-[11px] text-[#4A4A58]">
                      {robotSimResult.diagnostic.hint2}
                    </p>
                  </div>
                ) : filterSimResult?.diagnosticExplanation ? (
                  <div className="space-y-1 text-xs text-[#4A4A58]">
                    <span className="font-bold text-[#DC2626] block">
                      Diagnostic Notice:
                    </span>
                    <p className="text-[11px] leading-relaxed">
                      {filterSimResult.diagnosticExplanation}
                    </p>
                  </div>
                ) : (
                  <p className="text-xs text-[#10B981] font-bold">
                    ✓ No active runtime bugs detected. Your code passed all observable boundary checks!
                  </p>
                )}
              </div>
            )}

            {/* TAB 3: UNIT TEST RESULTS */}
            {terminalSubTab === 'tests' && (
              <div className="h-32 bg-white border-2 border-[#1E1E24] rounded-xl p-3 text-xs overflow-y-auto space-y-1.5">
                {currentMission.id === 'mission-rescue-robot' ? (
                  <div className="space-y-1 text-[11px]">
                    <div className="flex items-center justify-between">
                      <span>Reach Beacon (5, 5):</span>
                      <span className={robotSimResult?.reachedTarget ? 'text-[#10B981] font-bold' : 'text-[#7E7E8F]'}>
                        {robotSimResult?.reachedTarget ? 'PASSED' : 'PENDING'}
                      </span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span>Avoid Barriers:</span>
                      <span className={robotSimResult && !robotSimResult.hitObstacle ? 'text-[#10B981] font-bold' : 'text-[#7E7E8F]'}>
                        {robotSimResult && !robotSimResult.hitObstacle ? 'PASSED' : 'PENDING'}
                      </span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span>Battery &gt; 0%:</span>
                      <span className={robotSimResult && !robotSimResult.depleted ? 'text-[#10B981] font-bold' : 'text-[#7E7E8F]'}>
                        {robotSimResult && !robotSimResult.depleted ? 'PASSED' : 'PENDING'}
                      </span>
                    </div>
                  </div>
                ) : (
                  filterSimResult?.testResults?.map((t) => (
                    <div key={t.testId} className="flex items-center justify-between text-[11px]">
                      <span className="truncate max-w-[200px]">{t.description}</span>
                      <span className={t.passed ? 'text-[#10B981] font-bold' : 'text-[#EF4444] font-bold'}>
                        {t.passed ? 'PASSED' : 'FAILED'}
                      </span>
                    </div>
                  )) || <p className="text-xs text-[#7E7E8F]">Run the filter mission to inspect unit tests.</p>
                )}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* =========================================================================
          POST-MISSION CELEBRATION MODAL (Section 12)
         ========================================================================= */}
      {isCelebrationOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#1E1E24]/60 backdrop-blur-xs">
          <div className="relative w-full max-w-lg bg-white border-3 border-[#1E1E24] rounded-2xl shadow-[6px_6px_0px_#1E1E24] p-6 sm:p-8 animate-in zoom-in-95 text-center">
            {/* Close button */}
            <button
              onClick={() => setIsCelebrationOpen(false)}
              className="absolute top-4 right-4 p-1.5 rounded-lg border-2 border-[#1E1E24] bg-[#F2ECE0] text-[#1E1E24] hover:bg-[#FEE2E2]"
            >
              <X className="w-4 h-4" />
            </button>

            {/* Victory Badge */}
            <div className="w-16 h-16 rounded-2xl bg-[#FBBF24] border-2 border-[#1E1E24] text-[#1E1E24] mx-auto flex items-center justify-center shadow-[3px_3px_0px_#1E1E24] mb-3 animate-bounce">
              <Award className="w-8 h-8" />
            </div>

            <span className="text-[10px] font-black uppercase tracking-wider px-3 py-1 rounded-full bg-[#EDE9FE] border-2 border-[#1E1E24] text-[#6C5CE7] inline-block mb-2">
              Mission Completed
            </span>

            <h2 className="font-serif font-black text-2xl text-[#1E1E24] mb-1">
              Quest Cleared: {currentMission.title}!
            </h2>
            <p className="text-xs text-[#4A4A58] mb-6 max-w-sm mx-auto">
              Your Python commands executed flawlessly! You turned theoretical loops into observable machine movement.
            </p>

            {/* Reward Stats Grid */}
            <div className="grid grid-cols-3 gap-3 mb-6">
              <div className="bg-[#FEF3C7] border-2 border-[#1E1E24] rounded-xl p-3 text-center shadow-[2px_2px_0px_#1E1E24]">
                <span className="text-[10px] font-black uppercase text-[#D97706] block">Mastery XP</span>
                <span className="font-serif font-black text-xl text-[#1E1E24]">+{currentMission.xpReward}</span>
              </div>
              <div className="bg-[#D1FAE5] border-2 border-[#1E1E24] rounded-xl p-3 text-center shadow-[2px_2px_0px_#1E1E24]">
                <span className="text-[10px] font-black uppercase text-[#059669] block">Tests Passed</span>
                <span className="font-serif font-black text-xl text-[#059669]">100%</span>
              </div>
              <div className="bg-[#EDE9FE] border-2 border-[#1E1E24] rounded-xl p-3 text-center shadow-[2px_2px_0px_#1E1E24]">
                <span className="text-[10px] font-black uppercase text-[#6C5CE7] block">Realm</span>
                <span className="font-serif font-black text-base text-[#6C5CE7] truncate block">{currentMission.realmName}</span>
              </div>
            </div>

            {/* Guest Progress Cloud Sync Prompt */}
            {!getActiveSession() && (
              <div className="mb-5 p-3 rounded-xl bg-[#FEF3C7] border-2 border-[#1E1E24] shadow-[3px_3px_0px_#1E1E24] text-center">
                <p className="text-xs font-bold text-[#1E1E24] mb-2">
                  Quest cleared in Guest Mode! Sign in to save your streak and sync your achievements.
                </p>
                <button
                  onClick={() => triggerSaveProgressModal('simulator_quest_complete')}
                  className="btn-arcade btn-arcade-gold py-2 px-4 text-xs w-full flex items-center justify-center gap-1.5"
                >
                  <Sparkles className="w-3.5 h-3.5 text-[#071426]" />
                  <span>Sign In to Save Progress</span>
                </button>
              </div>
            )}

            {/* Actions */}
            <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
              <button
                onClick={() => {
                  setIsCelebrationOpen(false);
                  setIsBattleChallengeOpen(true);
                }}
                className="btn-arcade btn-arcade-gold w-full sm:w-auto py-2.5 px-6 text-xs flex items-center justify-center gap-2"
              >
                <Zap className="w-4 h-4 fill-[#071426]" />
                <span>Try Battle Challenge (+50 XP)</span>
              </button>

              <Link
                href="/paths"
                className="btn-arcade btn-arcade-purple w-full sm:w-auto py-2.5 px-6 text-xs flex items-center justify-center gap-2"
              >
                <span>Continue on World Map</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>
        </div>
      )}

      {/* =========================================================================
          FOLLOW-UP BATTLE CHALLENGE MODAL (Section 8 & 9)
         ========================================================================= */}
      {isBattleChallengeOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#1E1E24]/60 backdrop-blur-xs">
          <div className="relative w-full max-w-lg bg-white border-3 border-[#1E1E24] rounded-2xl shadow-[6px_6px_0px_#1E1E24] p-6 sm:p-8 animate-in zoom-in-95">
            <button
              onClick={() => setIsBattleChallengeOpen(false)}
              className="absolute top-4 right-4 p-1.5 rounded-lg border-2 border-[#1E1E24] bg-[#F2ECE0] text-[#1E1E24] hover:bg-[#FEE2E2]"
            >
              <X className="w-4 h-4" />
            </button>

            <div className="flex items-center gap-2 mb-2">
              <Flame className="w-5 h-5 text-[#F59E0B]" />
              <span className="text-xs font-black uppercase tracking-wider text-[#D97706]">
                Independent Battle Challenge
              </span>
            </div>

            <h3 className="font-serif font-black text-xl text-[#1E1E24] mb-1">
              Booster Capacitor Protocol
            </h3>
            <p className="text-xs text-[#4A4A58] mb-4 leading-relaxed">
              Prove independent mastery! Modify the loop logic to multiply every positive energy cell by 2 before adding to the returned list.
            </p>

            <div className="rounded-xl border-2 border-[#1E1E24] bg-[#1E1E24] p-3 mb-4 shadow-[2px_2px_0px_#1E1E24]">
              <textarea
                value={battleCode}
                onChange={(e) => setBattleCode(e.target.value)}
                rows={7}
                spellCheck={false}
                className="w-full bg-transparent font-mono text-xs text-[#FAF6EE] focus:outline-none resize-none leading-relaxed"
              />
            </div>

            {battleCompleted && (
              <div className="mb-4 p-3 rounded-xl bg-[#D1FAE5] border-2 border-[#10B981] text-xs font-black text-[#059669] flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 shrink-0" />
                <span>Battle Challenge Mastered! +50 Bonus XP Awarded!</span>
              </div>
            )}

            <div className="flex items-center justify-between">
              <button
                onClick={() => setIsBattleChallengeOpen(false)}
                className="btn-arcade btn-arcade-white text-xs py-2 px-4"
              >
                Done
              </button>
              <button
                onClick={handleRunBattleChallenge}
                disabled={isRunning}
                className="btn-arcade btn-arcade-purple text-xs py-2.5 px-6 flex items-center gap-1.5"
              >
                <span>{isRunning ? 'Testing...' : 'Verify Solution'}</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        </div>
      )}

      {/* AI Mentor Drawer */}
      <AcharyaDrawer
        isOpen={isMentorOpen}
        onClose={() => setIsMentorOpen(false)}
        contextCode={code}
        contextError={consoleLogs.filter((l) => l.includes('ERROR') || l.includes('COLLISION') || l.includes('Crash') || l.includes('depleted') || l.includes('Error')).join('\n')}
        activeMissionTitle={currentMission.title}
        missionGoal={currentMission.instructions.join(' ')}
        language="python"
        simulatorState={{
          roverPos: robotSimResult ? [robotSimResult.finalX, robotSimResult.finalY] : [0, 0],
          targetPos: [5, 5],
          battery: robotSimResult ? robotSimResult.finalBattery : 100,
          status: robotSimResult?.hitObstacle
            ? 'crashed_obstacle'
            : robotSimResult?.depleted
            ? 'battery_depleted'
            : robotSimResult?.success
            ? 'success'
            : 'incomplete_goal',
          lastCollisionCoord: robotSimResult?.hitObstacle ? [robotSimResult.finalX, robotSimResult.finalY] : undefined,
        }}
        proactiveTrigger={proactiveTrigger}
        onClearProactiveTrigger={() => setProactiveTrigger(null)}
      />
    </div>
  );
}

export default function SimulatorPage() {
  return (
    <Suspense fallback={<div className="p-8 text-center text-xs font-bold">Loading Game Arena...</div>}>
      <SimulatorContent />
    </Suspense>
  );
}
