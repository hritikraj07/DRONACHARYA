// Dronacharya Code Dungeon & Craft Realm: Main Split-Screen Interactive Game Page
'use client';

import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useDronacharya } from '@/lib/store';
import {
  getActiveSession,
  getGuestSession,
  deductHeart,
  restoreHearts,
  RegisteredUser,
} from '@/lib/db/auth-db';
import {
  DUNGEON_FLOORS,
  DungeonFloorSpec,
  TileData,
  Direction,
  DungeonInventory,
  DungeonSimulationFrame,
  DungeonSimulationResult,
  executeDungeonCode,
  CraftingRecipe,
} from '@/lib/simulator/dungeon-engine';
import { DungeonSound } from '@/lib/simulator/audio-synth';
import { DungeonCanvas } from '@/components/game/DungeonCanvas';
import { DungeonTopHud } from '@/components/game/DungeonTopHud';
import { DungeonCodeEditor } from '@/components/game/DungeonCodeEditor';
import { CraftingModal } from '@/components/game/CraftingModal';
import { DungeonVictoryModal } from '@/components/game/DungeonVictoryModal';
import { ArrowLeft, Gamepad2, Sparkles, HelpCircle } from 'lucide-react';

export default function DungeonPage() {
  const router = useRouter();
  const { state, completeDungeonFloor } = useDronacharya();
  const [currentUser, setCurrentUser] = useState<RegisteredUser | null>(null);

  // Active Floor & Spec
  const [currentFloor, setCurrentFloor] = useState<number>(1);
  const floorSpec: DungeonFloorSpec = DUNGEON_FLOORS[currentFloor] || DUNGEON_FLOORS[1];

  // Game Grid & Avatar State
  const [tiles, setTiles] = useState<TileData[]>(floorSpec.initialTiles);
  const [heroX, setHeroX] = useState<number>(floorSpec.startX);
  const [heroY, setHeroY] = useState<number>(floorSpec.startY);
  const [facing, setFacing] = useState<Direction>(floorSpec.startFacing);
  const [heroHp, setHeroHp] = useState<number>(3);
  const [inventory, setInventory] = useState<DungeonInventory>({ ...floorSpec.initialInventory });
  const [completedGoals, setCompletedGoals] = useState<Record<string, boolean>>({});
  const [bossHp, setBossHp] = useState<number>(floorSpec.bossData ? floorSpec.bossData.hp : 100);

  // Code & Execution State
  const [code, setCode] = useState<string>(floorSpec.initialCode);
  const [isRunning, setIsRunning] = useState<boolean>(false);
  const [speed, setSpeed] = useState<1 | 2>(1);
  const [isMuted, setIsMuted] = useState<boolean>(false);
  const [activeFrame, setActiveFrame] = useState<DungeonSimulationFrame | null>(null);
  const [pathTrail, setPathTrail] = useState<{ x: number; y: number }[]>([]);
  const [logs, setConsoleLogs] = useState<string[]>([
    `⚔️ Entered ${floorSpec.title}.`,
    '💡 Spellbook initialized. Write code and press "Run Code ▶".',
  ]);
  const [diagnostic, setDiagnostic] = useState<DungeonSimulationResult['diagnostic'] | undefined>(undefined);

  // Step-by-step Frame Queue Debugger
  const simulationFramesRef = useRef<DungeonSimulationFrame[]>([]);
  const currentFrameIdxRef = useRef<number>(0);
  const animationTimerRef = useRef<NodeJS.Timeout | null>(null);

  // Modals
  const [craftModalOpen, setCraftModalOpen] = useState(false);
  const [victoryModalOpen, setVictoryModalOpen] = useState(false);
  const [awardedXp, setAwardedXp] = useState(0);

  // Initialize and sync user
  useEffect(() => {
    setIsMuted(DungeonSound.isMuted());
    const syncUser = () => {
      const active = getActiveSession();
      if (active) setCurrentUser(active);
      else setCurrentUser(getGuestSession());
    };
    syncUser();
    window.addEventListener('dronacharya_session_change', syncUser);
    return () => {
      window.removeEventListener('dronacharya_session_change', syncUser);
      if (animationTimerRef.current) clearInterval(animationTimerRef.current);
    };
  }, []);

  // Floor reset handler
  const loadFloor = (floorNum: number) => {
    if (animationTimerRef.current) clearInterval(animationTimerRef.current);
    const spec = DUNGEON_FLOORS[floorNum] || DUNGEON_FLOORS[1];
    setCurrentFloor(floorNum);
    setTiles(spec.initialTiles.map((t) => ({ ...t })));
    setHeroX(spec.startX);
    setHeroY(spec.startY);
    setFacing(spec.startFacing);
    setHeroHp(3);
    setInventory({ ...spec.initialInventory });
    setCode(spec.initialCode);
    setIsRunning(false);
    setActiveFrame(null);
    setPathTrail([{ x: spec.startX, y: spec.startY }]);
    setConsoleLogs([
      `⚔️ Loaded ${spec.title} (${spec.realmName}).`,
      '💡 Ready for Python/JS command execution.',
    ]);
    setDiagnostic(undefined);
    setVictoryModalOpen(false);
    setCompletedGoals({});
    setBossHp(spec.bossData ? spec.bossData.hp : 100);
    simulationFramesRef.current = [];
    currentFrameIdxRef.current = 0;
  };

  // Run full simulation
  const handleRunCode = () => {
    if (isRunning) return;

    // Reset board before re-executing
    const spec = DUNGEON_FLOORS[currentFloor];
    const initialClone = spec.initialTiles.map((t) => ({ ...t }));
    setTiles(initialClone);
    setHeroX(spec.startX);
    setHeroY(spec.startY);
    setFacing(spec.startFacing);
    setHeroHp(3);
    setInventory({ ...spec.initialInventory });
    setPathTrail([{ x: spec.startX, y: spec.startY }]);

    // Execute code through deterministic state machine
    const result = executeDungeonCode(currentFloor, code, initialClone);
    simulationFramesRef.current = result.frames;
    currentFrameIdxRef.current = 0;
    setConsoleLogs(result.logs);
    setDiagnostic(result.diagnostic);
    setIsRunning(true);

    const tickDelay = speed === 1 ? 250 : 125;

    if (animationTimerRef.current) clearInterval(animationTimerRef.current);

    animationTimerRef.current = setInterval(() => {
      if (currentFrameIdxRef.current >= simulationFramesRef.current.length) {
        if (animationTimerRef.current) clearInterval(animationTimerRef.current);
        setIsRunning(false);

        // Apply final goals & check victory
        setCompletedGoals(result.completedGoals);

        if (result.success) {
          DungeonSound.playVictory();
          const xp = spec.xpReward;
          setAwardedXp(xp);
          completeDungeonFloor(currentFloor, xp);
          setVictoryModalOpen(true);
        } else if (result.finalHp <= 0) {
          deductHeart();
        }
        return;
      }

      const frame = simulationFramesRef.current[currentFrameIdxRef.current];
      currentFrameIdxRef.current += 1;

      // Apply frame state
      setActiveFrame(frame);
      setHeroX(frame.x);
      setHeroY(frame.y);
      setFacing(frame.facing);
      setHeroHp(frame.hp);
      setInventory(frame.inventory);
      setPathTrail((prev) => [...prev, { x: frame.x, y: frame.y }]);

      // Mutate tiles if frame specifies
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

      // Play matching Web Audio sound
      if (frame.soundToPlay) {
        switch (frame.soundToPlay) {
          case 'move':
            DungeonSound.playMove();
            break;
          case 'mine':
            DungeonSound.playMine();
            break;
          case 'craft':
            DungeonSound.playCraft();
            break;
          case 'place':
            DungeonSound.playPlace();
            break;
          case 'attack':
            DungeonSound.playAttack();
            break;
          case 'damage':
            DungeonSound.playDamage();
            break;
          case 'victory':
            DungeonSound.playVictory();
            break;
        }
      }
    }, tickDelay);
  };

  // Step Forward debugger
  const handleStepForward = () => {
    if (simulationFramesRef.current.length === 0) {
      // Calculate frames first
      const spec = DUNGEON_FLOORS[currentFloor];
      const initialClone = spec.initialTiles.map((t) => ({ ...t }));
      const result = executeDungeonCode(currentFloor, code, initialClone);
      simulationFramesRef.current = result.frames;
      currentFrameIdxRef.current = 0;
      setConsoleLogs(result.logs);
      setDiagnostic(result.diagnostic);
    }

    if (currentFrameIdxRef.current < simulationFramesRef.current.length) {
      const frame = simulationFramesRef.current[currentFrameIdxRef.current];
      currentFrameIdxRef.current += 1;

      setActiveFrame(frame);
      setHeroX(frame.x);
      setHeroY(frame.y);
      setFacing(frame.facing);
      setHeroHp(frame.hp);
      setInventory(frame.inventory);
      setPathTrail((prev) => [...prev, { x: frame.x, y: frame.y }]);

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

      if (frame.soundToPlay) {
        DungeonSound.playMove();
      }
    }
  };

  // Craft item from manual recipe book
  const handleCraftItem = (recipe: CraftingRecipe) => {
    setInventory((prev) => {
      const next = { ...prev };
      Object.entries(recipe.requirements).forEach(([item, reqCount]) => {
        const k = item as keyof DungeonInventory;
        next[k] = Math.max(0, next[k] - (reqCount || 0));
      });
      next[recipe.id] += recipe.resultCount;
      return next;
    });

    setConsoleLogs((prev) => [
      ...prev,
      `🔨 Manually crafted ${recipe.name}! (+${recipe.resultCount})`,
    ]);
  };

  const handleToggleMute = () => {
    const next = DungeonSound.toggleMute();
    setIsMuted(next);
  };

  return (
    <div className="w-full min-h-screen bg-[#FAF6EE] text-[#1E1E24] px-3 sm:px-6 py-6 max-w-7xl mx-auto space-y-6">
      {/* 0. Breadcrumb & Back Navigation */}
      <div className="flex items-center justify-between">
        <Link
          href="/dashboard"
          className="btn-arcade text-xs py-2 px-3.5 btn-arcade-white flex items-center gap-1.5 shadow-[2px_2px_0px_#1E1E24]"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Back to Quest Hub</span>
        </Link>

        <div className="flex items-center gap-2">
          <Link
            href="/simulator"
            className="text-xs font-bold text-[#6C5CE7] hover:underline flex items-center gap-1"
          >
            <Gamepad2 className="w-3.5 h-3.5" />
            <span>Practice Simulator</span>
          </Link>
        </div>
      </div>

      {/* 1. Top HUD Ribbon */}
      <DungeonTopHud
        floorSpec={floorSpec}
        currentFloor={currentFloor}
        onSelectFloor={loadFloor}
        hp={heroHp}
        xp={currentUser?.totalXp || state.user.totalXp}
        level={currentUser?.level || 1}
        inventory={inventory}
        completedGoals={completedGoals}
        onOpenCraftingModal={() => setCraftModalOpen(true)}
        isMuted={isMuted}
        onToggleMute={handleToggleMute}
      />

      {/* 2. Main Split-Screen Gameplay Arena (Desktop: Left 55%, Right 45%) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left Pane (55% width): 2D Grid / Voxel Canvas */}
        <div className="lg:col-span-7 flex flex-col items-center">
          <DungeonCanvas
            tiles={tiles}
            heroX={heroX}
            heroY={heroY}
            facing={facing}
            heroHp={heroHp}
            activeFrame={activeFrame}
            pathTrail={pathTrail}
            isAnimating={isRunning}
            bossHp={bossHp}
            onQuickInsertCode={(snippet) => {
              setCode((prev) => prev + (prev.endsWith('\n') ? '' : '\n') + snippet + '\n');
            }}
          />
        </div>

        {/* Right Pane (45% width): Spellbook Code Editor & Socratic Acharya AI */}
        <div className="lg:col-span-5 flex flex-col">
          <DungeonCodeEditor
            code={code}
            onChangeCode={setCode}
            isRunning={isRunning}
            onRunCode={handleRunCode}
            onStepForward={handleStepForward}
            onResetFloor={() => loadFloor(currentFloor)}
            speed={speed}
            onToggleSpeed={() => setSpeed(speed === 1 ? 2 : 1)}
            logs={logs}
            diagnostic={diagnostic}
            floorNumber={currentFloor}
            inventory={inventory}
            onCraftItem={handleCraftItem}
          />
        </div>
      </div>

      {/* 3. Crafting & Blueprints Modal */}
      <CraftingModal
        isOpen={craftModalOpen}
        onClose={() => setCraftModalOpen(false)}
        inventory={inventory}
        onCraftItem={handleCraftItem}
        onInsertCodeSnippet={(snippet) => {
          setCode((prev) => prev + (prev.endsWith('\n') ? '' : '\n') + snippet + '\n');
        }}
      />

      {/* 4. Victory & Seal Modal */}
      <DungeonVictoryModal
        isOpen={victoryModalOpen}
        floorSpec={floorSpec}
        floorNumber={currentFloor}
        xpEarned={awardedXp}
        totalXp={currentUser?.totalXp || state.user.totalXp}
        onNextFloor={() => {
          if (currentFloor < 4) loadFloor(currentFloor + 1);
        }}
        onReplayFloor={() => loadFloor(currentFloor)}
        isArchitectSealUnlocked={currentFloor === 4}
      />
    </div>
  );
}
