// Dronacharya Code Dungeon: The Python Chronicles
// Interactive 2D/2.5D RPG Game-Based Learning Environment
'use client';

import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useDronacharya } from '@/lib/store';
import {
  getActiveSession,
  getGuestSession,
  deductHeart,
  RegisteredUser,
} from '@/lib/db/auth-db';
import {
  DUNGEON_CAMPAIGN_LEVELS,
  DungeonCampaignLevel,
  TileData,
  Direction,
  GameFrame,
  EnemyEntity,
  GemEntity,
  SwitchEntity,
  GateEntity,
  CrystalEntity,
} from '@/lib/simulator/dungeon-engine';
import {
  executeDungeonPythonCode,
  initPyodide,
  isPyodideLoaded,
} from '@/lib/simulator/dungeon-python-bridge';
import { DungeonSound } from '@/lib/simulator/audio-synth';
import { DungeonCanvas } from '@/components/game/DungeonCanvas';
import { DungeonTopHud } from '@/components/game/DungeonTopHud';
import { DungeonCodeEditor } from '@/components/game/DungeonCodeEditor';
import { DungeonVictoryModal } from '@/components/game/DungeonVictoryModal';
import { AcharyaDrawer } from '@/components/mentor/AcharyaDrawer';
import {
  ArrowLeft,
  Gamepad2,
  Sparkles,
  BookOpen,
  Award,
  Zap,
} from 'lucide-react';

export default function DungeonPage() {
  const router = useRouter();
  const { state } = useDronacharya();
  const [currentUser, setCurrentUser] = useState<RegisteredUser | null>(null);

  // Active Level (1 to 5)
  const [currentLevelNumber, setCurrentLevelNumber] = useState<number>(1);
  const currentLevel: DungeonCampaignLevel =
    DUNGEON_CAMPAIGN_LEVELS[currentLevelNumber] || DUNGEON_CAMPAIGN_LEVELS[1];

  // World & Grid State
  const [tiles, setTiles] = useState<TileData[]>([]);
  const [heroX, setHeroX] = useState<number>(currentLevel.startX);
  const [heroY, setHeroY] = useState<number>(currentLevel.startY);
  const [facing, setFacing] = useState<Direction>(currentLevel.startFacing);
  const [heroHp, setHeroHp] = useState<number>(100);
  const [gemsCount, setGemsCount] = useState<number>(0);
  const [completedGoals, setCompletedGoals] = useState<Record<string, boolean>>({});

  const [enemies, setEnemies] = useState<EnemyEntity[]>([]);
  const [gems, setGems] = useState<GemEntity[]>([]);
  const [switches, setSwitches] = useState<SwitchEntity[]>([]);
  const [gates, setGates] = useState<GateEntity[]>([]);
  const [crystals, setCrystals] = useState<CrystalEntity[]>([]);

  // Code & Execution State
  const [code, setCode] = useState<string>(currentLevel.initialCode);
  const [isRunning, setIsRunning] = useState<boolean>(false);
  const [isPaused, setIsPaused] = useState<boolean>(false);
  const [speed, setSpeed] = useState<1 | 2 | 4>(1);
  const [isMuted, setIsMuted] = useState<boolean>(false);
  const [activeFrame, setActiveFrame] = useState<GameFrame | null>(null);
  const [pathTrail, setPathTrail] = useState<{ x: number; y: number }[]>([]);
  const [logs, setConsoleLogs] = useState<string[]>([
    `⚔️ Welcome to Level ${currentLevel.levelNumber}: ${currentLevel.title}`,
    `💡 ${currentLevel.concept}`,
    '🐍 Python 3 Spellbook initialized. Write code and press "Run Code ▶".',
  ]);
  const [diagnostic, setDiagnostic] = useState<any>(undefined);
  const [isPyodideActive, setIsPyodideActive] = useState<boolean>(false);

  // Star ratings per level (persisted in localStorage)
  const [levelStars, setLevelStars] = useState<Record<number, number>>({});

  // Simulation Frame Buffer & Animation Timers
  const simulationFramesRef = useRef<GameFrame[]>([]);
  const currentFrameIdxRef = useRef<number>(0);
  const animationTimerRef = useRef<NodeJS.Timeout | null>(null);

  // Victory Modal State
  const [victoryModalOpen, setVictoryModalOpen] = useState(false);
  const [awardedXp, setAwardedXp] = useState(0);
  const [earnedStars, setEarnedStars] = useState<1 | 2 | 3>(3);
  const [lastCodeLines, setLastCodeLines] = useState<number>(0);

  // Acharya AI Mentor Drawer State
  const [mentorDrawerOpen, setMentorDrawerOpen] = useState(false);
  const [mentorErrorContext, setMentorErrorContext] = useState<string>('');

  // 1. Initialize user, audio, and load Pyodide on mount
  useEffect(() => {
    setIsMuted(DungeonSound.isMuted());

    const syncUser = () => {
      const active = getActiveSession();
      if (active) setCurrentUser(active);
      else setCurrentUser(getGuestSession());
    };
    syncUser();

    // Load saved stars
    try {
      const saved = localStorage.getItem('dronacharya_dungeon_stars');
      if (saved) setLevelStars(JSON.parse(saved));
    } catch {}

    // Preload Pyodide in background
    initPyodide().then((instance) => {
      if (instance) setIsPyodideActive(true);
    });

    window.addEventListener('dronacharya_session_change', syncUser);
    return () => {
      window.removeEventListener('dronacharya_session_change', syncUser);
      if (animationTimerRef.current) clearInterval(animationTimerRef.current);
    };
  }, []);

  // 2. Load and reset level
  const loadLevel = (lvlNum: number) => {
    if (animationTimerRef.current) clearInterval(animationTimerRef.current);
    const spec = DUNGEON_CAMPAIGN_LEVELS[lvlNum] || DUNGEON_CAMPAIGN_LEVELS[1];

    setCurrentLevelNumber(lvlNum);
    setTiles(spec.initialTiles.map((t) => ({ ...t })));
    setHeroX(spec.startX);
    setHeroY(spec.startY);
    setFacing(spec.startFacing);
    setHeroHp(100);
    setGemsCount(0);
    setCompletedGoals({});

    setEnemies(spec.enemies.map((e) => ({ ...e })));
    setGems(spec.gems.map((g) => ({ ...g })));
    setSwitches(spec.switches.map((s) => ({ ...s })));
    setGates(spec.gates.map((g) => ({ ...g })));
    setCrystals(spec.crystals.map((c) => ({ ...c })));

    setCode(spec.initialCode);
    setIsRunning(false);
    setIsPaused(false);
    setActiveFrame(null);
    setPathTrail([{ x: spec.startX, y: spec.startY }]);
    setConsoleLogs([
      `⚔️ Level ${spec.levelNumber}: ${spec.title} loaded.`,
      `💡 Concept: ${spec.concept}`,
      `🎯 3-Star Goal: Complete in under ${spec.parLines} lines of Python code!`,
    ]);
    setDiagnostic(undefined);
    setVictoryModalOpen(false);
    simulationFramesRef.current = [];
    currentFrameIdxRef.current = 0;
  };

  // Initial level setup
  useEffect(() => {
    loadLevel(currentLevelNumber);
  }, [currentLevelNumber]);

  // 3. Frame playback stepper
  const applyFrame = (frame: GameFrame) => {
    setActiveFrame(frame);
    setHeroX(frame.toPos.x);
    setHeroY(frame.toPos.y);
    setFacing(frame.facing);
    setHeroHp(frame.heroHp);
    if (frame.gemsCount !== undefined) setGemsCount(frame.gemsCount);
    setPathTrail((prev) => [...prev, { x: frame.toPos.x, y: frame.toPos.y }]);

    // Mutate tiles
    if (frame.tileMutations) {
      setTiles((prev) => {
        const next = [...prev];
        frame.tileMutations?.forEach((mut) => {
          const found = next.find((t) => t.x === mut.x && t.y === mut.y);
          if (found) found.type = mut.newType;
        });
        return next;
      });
    }

    // Play sound FX
    if (frame.soundToPlay) {
      switch (frame.soundToPlay) {
        case 'move':
          DungeonSound.playMove();
          break;
        case 'attack':
          DungeonSound.playAttack();
          break;
        case 'collect':
          DungeonSound.playCollect();
          break;
        case 'switch':
          DungeonSound.playSwitch();
          break;
        case 'heal':
          DungeonSound.playHeal();
          break;
        case 'damage':
          DungeonSound.playDamage();
          break;
        case 'fizzle':
          DungeonSound.playSpellFizzle();
          break;
        case 'victory':
          DungeonSound.playVictory();
          break;
      }
    }
  };

  // 4. Run Code Simulation
  const handleRunCode = async () => {
    if (isRunning) return;

    // Reset world entities before run
    const spec = DUNGEON_CAMPAIGN_LEVELS[currentLevelNumber];
    setTiles(spec.initialTiles.map((t) => ({ ...t })));
    setHeroX(spec.startX);
    setHeroY(spec.startY);
    setFacing(spec.startFacing);
    setHeroHp(100);
    setGemsCount(0);
    setPathTrail([{ x: spec.startX, y: spec.startY }]);
    setEnemies(spec.enemies.map((e) => ({ ...e })));
    setGems(spec.gems.map((g) => ({ ...g })));
    setSwitches(spec.switches.map((s) => ({ ...s })));
    setGates(spec.gates.map((g) => ({ ...g })));
    setCrystals(spec.crystals.map((c) => ({ ...c })));

    // Execute Python script
    const result = await executeDungeonPythonCode(spec, code);
    simulationFramesRef.current = result.frames;
    currentFrameIdxRef.current = 0;
    setConsoleLogs(result.logs);
    setDiagnostic(result.diagnostic);
    setIsRunning(true);
    setIsPaused(false);
    setLastCodeLines(result.codeLines);

    const delayMs = speed === 1 ? 240 : speed === 2 ? 120 : 60;
    if (animationTimerRef.current) clearInterval(animationTimerRef.current);

    animationTimerRef.current = setInterval(() => {
      if (currentFrameIdxRef.current >= simulationFramesRef.current.length) {
        if (animationTimerRef.current) clearInterval(animationTimerRef.current);
        setIsRunning(false);

        // Apply completed goals
        setCompletedGoals(result.completedGoals);

        if (result.success) {
          DungeonSound.playVictory();
          const xp = spec.xpReward;
          setAwardedXp(xp);
          setEarnedStars(result.starsEarned);

          // Save star rating
          setLevelStars((prev) => {
            const next = {
              ...prev,
              [currentLevelNumber]: Math.max(prev[currentLevelNumber] || 0, result.starsEarned),
            };
            try {
              localStorage.setItem('dronacharya_dungeon_stars', JSON.stringify(next));
            } catch {}
            return next;
          });

          setVictoryModalOpen(true);
        } else if (result.finalHp <= 0) {
          deductHeart();
        }
        return;
      }

      const frame = simulationFramesRef.current[currentFrameIdxRef.current];
      currentFrameIdxRef.current += 1;
      applyFrame(frame);
    }, delayMs);
  };

  // 5. Step Forward (1 Tick)
  const handleStepForward = async () => {
    if (simulationFramesRef.current.length === 0) {
      const spec = DUNGEON_CAMPAIGN_LEVELS[currentLevelNumber];
      const result = await executeDungeonPythonCode(spec, code);
      simulationFramesRef.current = result.frames;
      currentFrameIdxRef.current = 0;
      setConsoleLogs(result.logs);
      setDiagnostic(result.diagnostic);
      setLastCodeLines(result.codeLines);
    }

    if (currentFrameIdxRef.current < simulationFramesRef.current.length) {
      const frame = simulationFramesRef.current[currentFrameIdxRef.current];
      currentFrameIdxRef.current += 1;
      applyFrame(frame);
    }
  };

  // 6. Pause / Resume
  const handlePause = () => {
    if (animationTimerRef.current) {
      clearInterval(animationTimerRef.current);
      animationTimerRef.current = null;
      setIsPaused(true);
      setIsRunning(false);
    }
  };

  // Speed Toggle
  const handleToggleSpeed = () => {
    setSpeed((prev) => (prev === 1 ? 2 : prev === 2 ? 4 : 1));
  };

  const handleToggleMute = () => {
    const next = DungeonSound.toggleMute();
    setIsMuted(next);
  };

  // Deep Context Sync with Acharya AI Mentor
  const handleAskMentorHelp = (studentCode: string, errorSummary?: string) => {
    setMentorErrorContext(
      errorSummary ||
        `Level ${currentLevelNumber}: "${currentLevel.title}" failure. Code line count: ${lastCodeLines}. Objectives incomplete.`
    );
    setMentorDrawerOpen(true);
  };

  return (
    <div className="w-full min-h-screen bg-[#FAF6EE] text-[#1E1E24] px-3 sm:px-6 py-6 max-w-7xl mx-auto space-y-6 overflow-x-hidden">
      {/* 0. Top Navigation & Breadcrumb */}
      <div className="flex flex-wrap items-center justify-between gap-3">
        <Link
          href="/dashboard"
          className="btn-arcade text-xs py-2 px-3.5 btn-arcade-white flex items-center gap-1.5 shadow-[2px_2px_0px_#1E1E24]"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Back to Quest Hub</span>
        </Link>

        <div className="flex items-center gap-2">
          <button
            onClick={() => handleAskMentorHelp(code, diagnostic?.summary)}
            className="btn-arcade text-xs py-2 px-3.5 btn-arcade-yellow flex items-center gap-1.5 shadow-[2px_2px_0px_#1E1E24] font-black"
          >
            <Sparkles className="w-3.5 h-3.5 text-[#6C5CE7] fill-current" />
            <span>Ask Acharya Mentor</span>
          </button>

          <Link
            href="/simulator"
            className="text-xs font-bold text-[#6C5CE7] hover:underline flex items-center gap-1 hidden sm:flex"
          >
            <Gamepad2 className="w-3.5 h-3.5" />
            <span>Practice Simulator</span>
          </Link>
        </div>
      </div>

      {/* 1. Top HUD Ribbon */}
      <DungeonTopHud
        currentLevel={currentLevel}
        levelNumber={currentLevelNumber}
        onSelectLevel={loadLevel}
        hp={heroHp}
        maxHp={100}
        xp={currentUser?.totalXp || state.user.totalXp}
        playerLevel={currentUser?.level || 1}
        gemsCount={gemsCount}
        completedGoals={completedGoals}
        isMuted={isMuted}
        onToggleMute={handleToggleMute}
        levelStars={levelStars}
      />

      {/* 2. Main Split-Screen Gameplay Arena (Desktop: Left 55% Stage, Right 45% Code Editor) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left Pane (55% width): 2D/2.5D Dungeon Canvas Stage */}
        <div className="lg:col-span-7 flex flex-col items-center">
          <DungeonCanvas
            gridWidth={currentLevel.gridWidth}
            gridHeight={currentLevel.gridHeight}
            tiles={tiles}
            heroX={heroX}
            heroY={heroY}
            facing={facing}
            heroHp={heroHp}
            maxHp={100}
            activeFrame={activeFrame}
            pathTrail={pathTrail}
            isAnimating={isRunning}
            enemies={enemies}
            gems={gems}
            switches={switches}
            gates={gates}
            crystals={crystals}
            onQuickInsertCode={(snippet) => {
              setCode((prev) => prev + (prev.endsWith('\n') ? '' : '\n') + snippet + '\n');
            }}
          />
        </div>

        {/* Right Pane (45% width): Real Python 3 Spellbook Editor & Combat Console */}
        <div className="lg:col-span-5 flex flex-col">
          <DungeonCodeEditor
            code={code}
            onChangeCode={setCode}
            isRunning={isRunning}
            isPaused={isPaused}
            onRunCode={handleRunCode}
            onStepForward={handleStepForward}
            onPause={handlePause}
            onResetLevel={() => loadLevel(currentLevelNumber)}
            speed={speed}
            onToggleSpeed={handleToggleSpeed}
            logs={logs}
            diagnostic={diagnostic}
            levelNumber={currentLevelNumber}
            parLines={currentLevel.parLines}
            isPyodideActive={isPyodideActive}
            onAskMentorHelp={handleAskMentorHelp}
          />
        </div>
      </div>

      {/* 3. Victory & Star Rating Modal */}
      <DungeonVictoryModal
        isOpen={victoryModalOpen}
        level={currentLevel}
        levelNumber={currentLevelNumber}
        xpEarned={awardedXp}
        totalXp={currentUser?.totalXp || state.user.totalXp}
        starsEarned={earnedStars}
        codeLines={lastCodeLines}
        parLines={currentLevel.parLines}
        onNextLevel={() => {
          if (currentLevelNumber < 5) loadLevel(currentLevelNumber + 1);
        }}
        onReplayLevel={() => loadLevel(currentLevelNumber)}
      />

      {/* 4. Deep Context Synced Acharya AI Mentor Drawer */}
      <AcharyaDrawer
        isOpen={mentorDrawerOpen}
        onClose={() => setMentorDrawerOpen(false)}
        contextCode={code}
        contextError={mentorErrorContext}
        activeMissionTitle={`The Python Chronicles — Level ${currentLevelNumber}: ${currentLevel.title}`}
        missionGoal={`${currentLevel.concept}. Sub-goals: ${currentLevel.objectives
          .map((o) => o.label)
          .join('; ')}. Par lines: ${currentLevel.parLines}.`}
        language="python"
      />
    </div>
  );
}
