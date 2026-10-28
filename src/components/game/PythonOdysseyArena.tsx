// Dronacharya Rover Arya's Odyssey: Split-Screen 2D RPG & Python Arena
// Interactive 8x8 Canvas Game Engine with Real-Time Python Execution,
// Two-Vault Guru Dakshina Tracker (₹500 Security -> Withdrawable Vault),
// 8-Bit Web Audio, and Context-Aware Acharya AI Mentor.
'use client';

import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import {
  ODYSSEY_QUESTS,
  OdysseyQuestSpec,
  OdysseySimFrame,
  OdysseyCoord,
  executeOdysseyQuest,
  findOdysseyQuest,
} from '@/lib/simulator/python-odyssey-engine';
import { getVaultState, transferToWithdrawable, VaultState } from '@/lib/game/vault-ledger';
import { odysseyAudio } from '@/lib/game/odyssey-audio';
import { deductHeart, recordGameProgress, getActiveSession, getGuestSession } from '@/lib/db/auth-db';
import { AcharyaDrawer } from '@/components/mentor/AcharyaDrawer';
import {
  Play,
  RotateCcw,
  SkipForward,
  Sparkles,
  Volume2,
  VolumeX,
  Heart,
  Award,
  Lock,
  Coins,
  Shield,
  Zap,
  CheckCircle2,
  AlertTriangle,
  ChevronRight,
  Code2,
  BookOpen,
  ArrowRight,
  X,
  Compass,
  Flame,
} from 'lucide-react';
import confetti from 'canvas-confetti';

interface PythonOdysseyArenaProps {
  initialQuestId?: string;
  onQuestChange?: (questId: string) => void;
}

export function PythonOdysseyArena({
  initialQuestId = 'py-less-1-1',
  onQuestChange,
}: PythonOdysseyArenaProps) {
  const router = useRouter();

  // Active Quest State
  const [currentQuestId, setCurrentQuestId] = useState<string>(initialQuestId);
  const quest: OdysseyQuestSpec = findOdysseyQuest(currentQuestId);

  // Python Code Editor State
  const [code, setCode] = useState<string>(quest.starterCode);
  const [consoleLogs, setConsoleLogs] = useState<string[]>([
    `🎮 Initialized Quest: ${quest.realmName} — ${quest.title}`,
    '💡 Review your mission objectives and write code to control Rover Arya.',
  ]);

  // Two-Vault Guru Dakshina State
  const [vault, setVault] = useState<VaultState>({
    securityVault: 500,
    withdrawableVault: 0,
    unlockedQuests: [],
    unlockedSeals: [],
  });

  // User Stats & Hearts State
  const [hearts, setHearts] = useState<number>(3);
  const [totalXp, setTotalXp] = useState<number>(0);
  const [isMuted, setIsMuted] = useState<boolean>(false);
  const [isBriefingOpen, setIsBriefingOpen] = useState<boolean>(true);
  const [briefingLanguage, setBriefingLanguage] = useState<'en' | 'hinglish'>('en');

  // Simulation Animation State
  const [isRunning, setIsRunning] = useState<boolean>(false);
  const [isAnimating, setIsAnimating] = useState<boolean>(false);
  const [currentFrameIndex, setCurrentFrameIndex] = useState<number>(0);
  const [simulationFrames, setSimulationFrames] = useState<OdysseySimFrame[]>([]);
  const [victoryModalOpen, setVictoryModalOpen] = useState<boolean>(false);
  const [awardedSeal, setAwardedSeal] = useState<string | null>(null);
  const [coinTransferAnimation, setCoinTransferAnimation] = useState<boolean>(false);
  const [heartShake, setHeartShake] = useState<boolean>(false);

  // Acharya AI Mentor Integration
  const [isMentorOpen, setIsMentorOpen] = useState<boolean>(false);
  const [proactiveTrigger, setProactiveTrigger] = useState<{
    type: 'collision' | 'error' | 'battery' | 'syntax';
    message: string;
    line?: number;
  } | null>(null);

  // Canvas Ref
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const animationTimerRef = useRef<NodeJS.Timeout | null>(null);

  // Sync Vault and Audio on mount
  useEffect(() => {
    setVault(getVaultState());
    setIsMuted(odysseyAudio.getMuted());

    const handleVaultChange = () => setVault(getVaultState());
    const handleAudioChange = () => setIsMuted(odysseyAudio.getMuted());

    window.addEventListener('dronacharya_vault_changed', handleVaultChange);
    window.addEventListener('dronacharya_odyssey_audio_change', handleAudioChange);

    // Sync session hearts & XP
    const session = getActiveSession() || getGuestSession();
    if (session) {
      setHearts(session.hearts ?? 3);
      setTotalXp(session.totalXp ?? 0);
    }

    return () => {
      window.removeEventListener('dronacharya_vault_changed', handleVaultChange);
      window.removeEventListener('dronacharya_odyssey_audio_change', handleAudioChange);
      if (animationTimerRef.current) clearTimeout(animationTimerRef.current);
    };
  }, []);

  // Update on quest prop change
  useEffect(() => {
    if (initialQuestId && initialQuestId !== currentQuestId) {
      handleSwitchQuest(initialQuestId);
    }
  }, [initialQuestId]);

  // Synchronize on quest switch
  const handleSwitchQuest = (newQuestId: string) => {
    if (animationTimerRef.current) clearTimeout(animationTimerRef.current);
    const newQuest = findOdysseyQuest(newQuestId);
    setCurrentQuestId(newQuestId);
    setCode(newQuest.starterCode);
    setCurrentFrameIndex(0);
    setSimulationFrames([]);
    setIsRunning(false);
    setIsAnimating(false);
    setVictoryModalOpen(false);
    setProactiveTrigger(null);
    setConsoleLogs([
      `🎮 Realm: ${newQuest.realmName} — ${newQuest.title}`,
      `📜 Objective: ${newQuest.instructions}`,
      '💡 Ready for Python code execution.',
    ]);
    if (onQuestChange) onQuestChange(newQuestId);
  };

  // Reset current quest arena
  const handleReset = () => {
    if (animationTimerRef.current) clearTimeout(animationTimerRef.current);
    setIsRunning(false);
    setIsAnimating(false);
    setCurrentFrameIndex(0);
    setSimulationFrames([]);
    setVictoryModalOpen(false);
    setConsoleLogs((prev) => [...prev.slice(-4), '🔄 Arena simulation reset to initial coordinates.']);
  };

  // Trigger heart loss animation
  const triggerHeartLoss = () => {
    const remaining = deductHeart();
    setHearts(remaining);
    setHeartShake(true);
    odysseyAudio.playErrorSound();
    setTimeout(() => setHeartShake(false), 800);
  };

  // Execute Code and Run Animation
  const handleRunCode = () => {
    if (isAnimating) return;
    handleReset();
    setIsRunning(true);

    const result = executeOdysseyQuest(quest, code);

    // Append stdout to logs
    if (result.stdout.length > 0) {
      setConsoleLogs((prev) => [...prev.slice(-4), ...result.stdout]);
    }

    // Handle failure immediately if no frames generated
    if (!result.success || result.frames.length === 0) {
      setIsRunning(false);
      triggerHeartLoss();

      // Proactively alert Acharya AI
      setProactiveTrigger({
        type: result.sparksRejected ? 'error' : result.hitLaser ? 'collision' : 'syntax',
        message: result.error || 'Your code encountered a diagnostic exception.',
        line: result.detectedLine,
      });

      setConsoleLogs((prev) => [
        ...prev,
        `❌ [SIMULATION HALTED]: ${result.error || 'Code verification failed.'}`,
      ]);
      return;
    }

    // Success path: start frame animation
    setSimulationFrames(result.frames);
    setIsAnimating(true);
    let frameIdx = 0;
    const frames = result.frames;

    odysseyAudio.playStepSound();

    const stepAnimation = () => {
      if (frameIdx < frames.length) {
        const frame = frames[frameIdx];
        setCurrentFrameIndex(frameIdx);

        // Sound triggers
        if (frame.status === 'AWAKENED') odysseyAudio.playAwakenSound();
        if (frame.status === 'COLLECTING') odysseyAudio.playCollectSound();
        if (frame.status === 'SHIELD_UP') odysseyAudio.playShieldDeflectSound();
        if (frame.status === 'VICTORY') odysseyAudio.playVictoryFanfare();
        if (frame.status === 'DRIVING') odysseyAudio.playStepSound();

        setConsoleLogs((prev) => [...prev.slice(-5), frame.logMessage]);

        frameIdx++;
        animationTimerRef.current = setTimeout(stepAnimation, 280);
      } else {
        // Animation finished
        setIsAnimating(false);
        setIsRunning(false);

        // Award progress
        recordGameProgress({
          missionId: quest.id,
          earnedXp: quest.xpReward,
          levelId: quest.id,
          subject: 'python',
        });

        // Trigger Two-Vault transfer (+₹10)
        const vaultRes = transferToWithdrawable(quest.id, quest.vaultReward, quest.sealReward);
        setVault(getVaultState());

        if (quest.sealReward) {
          setAwardedSeal(quest.sealReward);
        }

        // Confetti celebration
        try {
          confetti({
            particleCount: 90,
            spread: 70,
            origin: { y: 0.6 },
            colors: ['#6C5CE7', '#FFD214', '#00B894', '#FF7675'],
          });
        } catch (e) {}

        // Open victory modal & coin transfer animation
        setCoinTransferAnimation(true);
        setVictoryModalOpen(true);
      }
    };

    animationTimerRef.current = setTimeout(stepAnimation, 250);
  };

  // Step-by-Step Frame Advancement
  const handleStepForward = () => {
    if (simulationFrames.length === 0) {
      const result = executeOdysseyQuest(quest, code);
      if (result.success && result.frames.length > 0) {
        setSimulationFrames(result.frames);
        setCurrentFrameIndex(0);
      }
      return;
    }
    const nextIdx = Math.min(simulationFrames.length - 1, currentFrameIndex + 1);
    setCurrentFrameIndex(nextIdx);
    const frame = simulationFrames[nextIdx];
    if (frame) {
      setConsoleLogs((prev) => [...prev.slice(-5), `[STEP ${nextIdx}]: ${frame.logMessage}`]);
      odysseyAudio.playStepSound();
    }
  };

  // Next Quest Advancement
  const handleNextQuest = () => {
    setVictoryModalOpen(false);
    const curIdx = ODYSSEY_QUESTS.findIndex((q) => q.id === quest.id);
    if (curIdx !== -1 && curIdx < ODYSSEY_QUESTS.length - 1) {
      const nextQ = ODYSSEY_QUESTS[curIdx + 1];
      handleSwitchQuest(nextQ.id);
      router.push(`/learn/${nextQ.id}`);
    } else {
      router.push('/courses/python/dashboard');
    }
  };

  // =========================================================================
  // 2D CANVAS RENDER LOOP (8x8 RPG GRID)
  // =========================================================================
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const GRID_SIZE = 8;
    const TILE_PX = canvas.width / GRID_SIZE;

    // Active frame info
    const frame: OdysseySimFrame = simulationFrames[currentFrameIndex] || {
      step: 0,
      roverX: quest.startPos.x,
      roverY: quest.startPos.y,
      status: quest.id === 'py-less-1-1' ? 'SLEEPING' : 'AWAKENED',
      headlightsOn: quest.id !== 'py-less-1-1',
      shieldActive: false,
      batteryLevel: 100,
      gateOpen: false,
      bridgeActive: false,
      collectedItems: [],
      logMessage: '',
    };

    // 1. Draw Realm Background Tiles
    for (let r = 0; r < GRID_SIZE; r++) {
      for (let c = 0; c < GRID_SIZE; c++) {
        const x = c * TILE_PX;
        const y = r * TILE_PX;

        // Base tile styling per Realm
        if (quest.realmId === 'starter-village') {
          // Overgrown Ruin Cobblestone & Grass
          ctx.fillStyle = (c + r) % 2 === 0 ? '#1E2530' : '#232D3B';
          ctx.fillRect(x, y, TILE_PX, TILE_PX);

          // Grass accent dots
          if ((c * 3 + r * 7) % 5 === 0) {
            ctx.fillStyle = '#22C55E';
            ctx.fillRect(x + TILE_PX * 0.3, y + TILE_PX * 0.3, 3, 3);
          }
        } else if (quest.realmId === 'variable-valley') {
          // Magnetic Obsidian Cavern
          ctx.fillStyle = (c + r) % 2 === 0 ? '#18122B' : '#20163B';
          ctx.fillRect(x, y, TILE_PX, TILE_PX);

          // Crystal sparkles
          if ((c + r * 2) % 4 === 0) {
            ctx.fillStyle = '#A855F7';
            ctx.fillRect(x + TILE_PX * 0.4, y + TILE_PX * 0.4, 2, 2);
          }
        } else if (quest.realmId === 'conditional-castle') {
          // Castle Stone & Crimson Carpet Corridor
          const isCarpet = r === 3;
          ctx.fillStyle = isCarpet ? '#450A0A' : (c + r) % 2 === 0 ? '#1C1917' : '#292524';
          ctx.fillRect(x, y, TILE_PX, TILE_PX);
        } else {
          // Loop Lab Cybernetic Circuit Grid
          ctx.fillStyle = (c + r) % 2 === 0 ? '#0B132B' : '#1C2541';
          ctx.fillRect(x, y, TILE_PX, TILE_PX);

          // Circuit lines
          ctx.strokeStyle = '#3A506B';
          ctx.lineWidth = 0.5;
          ctx.strokeRect(x, y, TILE_PX, TILE_PX);
        }

        // Tile Border Lines
        ctx.strokeStyle = 'rgba(255, 255, 255, 0.05)';
        ctx.lineWidth = 1;
        ctx.strokeRect(x, y, TILE_PX, TILE_PX);
      }
    }

    // 2. Quest 1 Specific: Ancient Stone Gate at (4, 2)
    if (quest.id === 'py-less-1-1' && !frame.gateOpen) {
      const gx = 4 * TILE_PX;
      const gy = 2 * TILE_PX;
      ctx.fillStyle = '#475569';
      ctx.fillRect(gx + 4, gy + 4, TILE_PX - 8, TILE_PX - 8);
      ctx.strokeStyle = '#F59E0B';
      ctx.lineWidth = 2;
      ctx.strokeRect(gx + 6, gy + 6, TILE_PX - 12, TILE_PX - 12);
      ctx.fillStyle = '#FEF08A';
      ctx.font = 'bold 10px monospace';
      ctx.textAlign = 'center';
      ctx.fillText('🔒 GATE', gx + TILE_PX / 2, gy + TILE_PX / 2 + 3);
    }

    // 3. Quest 2 Specific: Abyss Chasm & Energy Bridge across (2,3) -> (5,3)
    if (quest.id === 'py-less-1-2') {
      // Pedestal 1: Communications Beacon at (2, 2)
      ctx.fillStyle = '#6366F1';
      ctx.fillRect(2 * TILE_PX + 8, 2 * TILE_PX + 8, TILE_PX - 16, TILE_PX - 16);
      ctx.fillStyle = '#FFFFFF';
      ctx.font = 'bold 8px monospace';
      ctx.textAlign = 'center';
      ctx.fillText('"TEXT"', 2 * TILE_PX + TILE_PX / 2, 2 * TILE_PX + TILE_PX / 2 + 3);

      // Pedestal 2: Voltage Regulator at (5, 2)
      ctx.fillStyle = '#F59E0B';
      ctx.fillRect(5 * TILE_PX + 8, 2 * TILE_PX + 8, TILE_PX - 16, TILE_PX - 16);
      ctx.fillStyle = '#1E1E24';
      ctx.font = 'bold 8px monospace';
      ctx.textAlign = 'center';
      ctx.fillText('95V', 5 * TILE_PX + TILE_PX / 2, 5 * TILE_PX + TILE_PX / 2 + 3);

      // Energy Bridge Tiles across (3, 3) and (4, 3)
      for (let c = 3; c <= 4; c++) {
        const bx = c * TILE_PX;
        const by = 3 * TILE_PX;
        if (frame.bridgeActive) {
          ctx.fillStyle = 'rgba(6, 182, 212, 0.7)';
          ctx.fillRect(bx + 2, by + 4, TILE_PX - 4, TILE_PX - 8);
          ctx.strokeStyle = '#22D3EE';
          ctx.lineWidth = 2;
          ctx.strokeRect(bx + 4, by + 6, TILE_PX - 8, TILE_PX - 12);
        } else {
          // Abyss Void Hole
          ctx.fillStyle = '#05070B';
          ctx.fillRect(bx + 2, by + 2, TILE_PX - 4, TILE_PX - 4);
          ctx.strokeStyle = 'rgba(239, 68, 68, 0.4)';
          ctx.lineWidth = 1;
          ctx.strokeRect(bx + 4, by + 4, TILE_PX - 8, TILE_PX - 8);
        }
      }
    }

    // 4. Quest 4 Specific: Pulsing Red Laser Barrier down Column 3
    if (quest.id === 'py-less-3-1') {
      const lx = 3 * TILE_PX + TILE_PX / 2;
      ctx.strokeStyle = 'rgba(239, 68, 68, 0.8)';
      ctx.lineWidth = 6;
      ctx.beginPath();
      ctx.moveTo(lx, 0);
      ctx.lineTo(lx, canvas.height);
      ctx.stroke();

      // Laser Glow
      ctx.strokeStyle = '#FCA5A5';
      ctx.lineWidth = 2;
      ctx.stroke();
    }

    // 5. Quest 5 Specific: 5 Glowing Green Energy Cells in Loop Lab
    if (quest.id === 'py-less-4-1') {
      for (let i = 1; i <= 5; i++) {
        const cellX = i * TILE_PX;
        const cellY = 3 * TILE_PX;
        const isCollected = frame.collectedItems.some((ci) => ci.x === i && ci.y === 3);

        if (!isCollected) {
          // Energy Cell Sprite
          ctx.fillStyle = '#10B981';
          ctx.beginPath();
          ctx.arc(cellX + TILE_PX / 2, cellY + TILE_PX / 2, 8, 0, Math.PI * 2);
          ctx.fill();

          ctx.fillStyle = '#6EE7B7';
          ctx.beginPath();
          ctx.arc(cellX + TILE_PX / 2, cellY + TILE_PX / 2, 4, 0, Math.PI * 2);
          ctx.fill();
        }
      }
    }

    // 6. Draw Extraction Target / Beacon Tile
    const tx = quest.targetPos.x * TILE_PX;
    const ty = quest.targetPos.y * TILE_PX;
    ctx.strokeStyle = '#FBBF24';
    ctx.lineWidth = 2;
    ctx.strokeRect(tx + 4, ty + 4, TILE_PX - 8, TILE_PX - 8);
    ctx.fillStyle = 'rgba(251, 191, 36, 0.2)';
    ctx.fillRect(tx + 6, ty + 6, TILE_PX - 12, TILE_PX - 12);
    ctx.fillStyle = '#FBBF24';
    ctx.font = 'bold 12px sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText('🎯', tx + TILE_PX / 2, ty + TILE_PX / 2 + 4);

    // 7. Draw Rover Arya Sprite at (roverX, roverY)
    const rx = frame.roverX * TILE_PX + TILE_PX / 2;
    const ry = frame.roverY * TILE_PX + TILE_PX / 2;
    const isSleeping = frame.status === 'SLEEPING';

    // Headlights Cones if awake
    if (frame.headlightsOn) {
      ctx.fillStyle = 'rgba(254, 240, 138, 0.25)';
      ctx.beginPath();
      ctx.moveTo(rx + 10, ry - 6);
      ctx.lineTo(rx + TILE_PX * 0.9, ry - TILE_PX * 0.4);
      ctx.lineTo(rx + TILE_PX * 0.9, ry + TILE_PX * 0.4);
      ctx.lineTo(rx + 10, ry + 6);
      ctx.closePath();
      ctx.fill();
    }

    // Rover Chassis (Metallic Rounded Box)
    ctx.fillStyle = isSleeping ? '#475569' : '#6C5CE7';
    ctx.strokeStyle = '#1E1E24';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.roundRect(rx - 16, ry - 14, 32, 28, 6);
    ctx.fill();
    ctx.stroke();

    // Tread Tracks (Top and Bottom)
    ctx.fillStyle = '#1E293B';
    ctx.fillRect(rx - 14, ry - 16, 28, 4);
    ctx.fillRect(rx - 14, ry + 12, 28, 4);

    // Glass Dome Cockpit
    ctx.fillStyle = isSleeping ? '#334155' : '#00CEC9';
    ctx.beginPath();
    ctx.arc(rx, ry, 6, 0, Math.PI * 2);
    ctx.fill();

    // Antenna & LED
    ctx.strokeStyle = '#1E1E24';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(rx - 6, ry - 14);
    ctx.lineTo(rx - 6, ry - 22);
    ctx.stroke();

    ctx.fillStyle = isSleeping ? '#94A3B8' : '#22C55E';
    ctx.beginPath();
    ctx.arc(rx - 6, ry - 22, 3, 0, Math.PI * 2);
    ctx.fill();

    // Thruster Trail Flames if driving
    if (frame.status === 'DRIVING' || frame.status === 'COLLECTING') {
      ctx.fillStyle = '#F59E0B';
      ctx.beginPath();
      ctx.moveTo(rx - 16, ry - 4);
      ctx.lineTo(rx - 24, ry);
      ctx.lineTo(rx - 16, ry + 4);
      ctx.closePath();
      ctx.fill();
    }

    // Spherical Plasma Shield Bubble
    if (frame.shieldActive) {
      ctx.strokeStyle = 'rgba(6, 182, 212, 0.9)';
      ctx.lineWidth = 3;
      ctx.fillStyle = 'rgba(6, 182, 212, 0.25)';
      ctx.beginPath();
      ctx.arc(rx, ry, 22, 0, Math.PI * 2);
      ctx.fill();
      ctx.stroke();
    }

    // Floating Toast Overlay on Canvas
    if (frame.toast) {
      ctx.fillStyle = '#1E1E24';
      ctx.strokeStyle = '#FFD214';
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.roundRect(canvas.width / 2 - 110, 20, 220, 32, 8);
      ctx.fill();
      ctx.stroke();

      ctx.fillStyle = '#FFD214';
      ctx.font = 'bold 11px monospace';
      ctx.textAlign = 'center';
      ctx.fillText(frame.toast.text, canvas.width / 2, 40);
    }
  }, [currentFrameIndex, simulationFrames, quest.id]);

  return (
    <div className="w-full flex flex-col bg-[#F5F2EB] text-[#1E1E24] select-none">
      {/* =========================================================================
          A. TOP RPG & GURU DAKSHINA TWO-VAULT HUD BAR
         ========================================================================= */}
      <header className="h-16 bg-white border-b-2 border-[#1E1E24] px-4 sm:px-6 flex items-center justify-between z-20 shrink-0 gap-3">
        {/* Left: Realm & Quest Selector */}
        <div className="flex items-center gap-3">
          <Link
            href="/courses/python/dashboard"
            className="flex items-center gap-1.5 text-xs font-black text-[#4A4A58] hover:text-[#1E1E24] p-1.5 rounded-lg hover:bg-[#FAF6EE] border border-transparent hover:border-[#1E1E24]"
            title="Return to Python Dashboard"
          >
            <span>← Dashboard</span>
          </Link>

          <div className="h-5 w-[2px] bg-gray-200 hidden sm:block" />

          {/* Quest Selector Dropdown */}
          <div className="flex items-center gap-2">
            <span className="text-[10px] font-black uppercase tracking-wider text-white bg-[#6C5CE7] px-2 py-0.5 rounded shadow-[1px_1px_0px_#1E1E24]">
              {quest.realmName}
            </span>

            <select
              value={quest.id}
              onChange={(e) => handleSwitchQuest(e.target.value)}
              className="text-xs font-black bg-[#FAF6EE] border-2 border-[#1E1E24] rounded-lg px-2 py-1 shadow-[2px_2px_0px_#1E1E24] cursor-pointer"
            >
              {ODYSSEY_QUESTS.map((q) => {
                const isCleared = vault.unlockedQuests.includes(q.id);
                return (
                  <option key={q.id} value={q.id}>
                    {isCleared ? '✓ ' : ''}Lesson {q.lessonNumber}: {q.title}
                  </option>
                );
              })}
            </select>
          </div>
        </div>

        {/* Center: Two-Vault Psychological Commitment Tracker */}
        <div className="hidden md:flex items-center gap-2">
          {/* Security Vault */}
          <div className="flex items-center gap-1.5 bg-[#FAF6EE] border-2 border-[#1E1E24] px-3 py-1 rounded-xl shadow-[2px_2px_0px_#1E1E24]">
            <Lock className="w-3.5 h-3.5 text-amber-600" />
            <span className="text-[10px] font-black uppercase text-amber-800">Security Vault:</span>
            <span className="font-mono text-xs font-black text-[#1E1E24]">₹{vault.securityVault}</span>
          </div>

          <span className="text-gray-400 font-bold">→</span>

          {/* Withdrawable Vault */}
          <div
            className={`flex items-center gap-1.5 bg-[#D1FAE5] border-2 border-[#10B981] px-3 py-1 rounded-xl shadow-[2px_2px_0px_#1E1E24] transition-all ${
              coinTransferAnimation ? 'scale-110 ring-2 ring-emerald-400 animate-pulse' : ''
            }`}
          >
            <Coins className="w-3.5 h-3.5 text-emerald-600" />
            <span className="text-[10px] font-black uppercase text-emerald-800">Withdrawable:</span>
            <span className="font-mono text-xs font-black text-emerald-700">₹{vault.withdrawableVault}</span>
          </div>
        </div>

        {/* Right: Hearts, XP, Audio & Acharya AI */}
        <div className="flex items-center gap-3">
          {/* Hearts */}
          <div
            className={`flex items-center gap-1 bg-[#FEE2E2] border-2 border-[#1E1E24] px-2.5 py-1 rounded-xl shadow-[2px_2px_0px_#1E1E24] text-xs font-black text-[#DC2626] transition-transform ${
              heartShake ? 'animate-bounce ring-2 ring-rose-500' : ''
            }`}
          >
            <Heart className="w-3.5 h-3.5 fill-current" />
            <span>{hearts}</span>
          </div>

          {/* Audio Toggle */}
          <button
            onClick={() => {
              const newMute = odysseyAudio.toggleMute();
              setIsMuted(newMute);
            }}
            className="p-1.5 rounded-lg border-2 border-[#1E1E24] bg-white hover:bg-slate-100 shadow-[1.5px_1.5px_0px_#1E1E24] cursor-pointer"
            title={isMuted ? 'Unmute 8-Bit Audio' : 'Mute 8-Bit Audio'}
          >
            {isMuted ? <VolumeX className="w-4 h-4 text-gray-400" /> : <Volume2 className="w-4 h-4 text-[#6C5CE7]" />}
          </button>

          {/* Acharya AI Button */}
          <button
            onClick={() => setIsMentorOpen(true)}
            className="btn-arcade text-xs px-3 py-1.5 bg-[#EDE9FE] hover:bg-[#DDD6FE] text-[#6C5CE7] border-2 border-[#1E1E24] shadow-[2px_2px_0px_#1E1E24] flex items-center gap-1.5 cursor-pointer"
          >
            <Sparkles className="w-3.5 h-3.5 fill-[#FFD214]" />
            <span className="hidden sm:inline">Acharya AI</span>
          </button>
        </div>
      </header>

      {/* =========================================================================
          MAIN SPLIT-SCREEN WORKSPACE (Left: 55% Game Canvas • Right: 45% Spellbook)
         ========================================================================= */}
      <div className="flex-1 flex flex-col lg:flex-row overflow-hidden min-h-[calc(100vh-4rem)]">
        {/* =========================================================================
            B. LEFT PANE: INTERACTIVE 2D GAME CANVAS & LESSON CARD (55% Width)
           ========================================================================= */}
        <div className="w-full lg:w-[55%] flex flex-col bg-[#0B0D17] border-b-2 lg:border-b-0 lg:border-r-2 border-[#1E1E24] p-4 sm:p-5 overflow-y-auto space-y-4">
          {/* Collapsible Mini Lesson Briefing Card ("Learn While Playing") */}
          <div className="bg-[#FAF6EE] border-2 border-[#1E1E24] rounded-2xl p-4 shadow-[4px_4px_0px_#1E1E24]">
            <div className="flex items-center justify-between pb-2 border-b border-[#1E1E24]/15">
              <div className="flex items-center gap-2">
                <BookOpen className="w-4 h-4 text-[#6C5CE7]" />
                <span className="text-xs font-black uppercase text-[#1E1E24]">
                  Quest Directives • {quest.concept}
                </span>
              </div>

              <div className="flex items-center gap-2 text-[10px]">
                <button
                  onClick={() => setBriefingLanguage('en')}
                  className={`px-1.5 py-0.5 rounded font-black border ${
                    briefingLanguage === 'en' ? 'bg-[#6C5CE7] text-white border-[#1E1E24]' : 'bg-white text-gray-600'
                  }`}
                >
                  EN
                </button>
                <button
                  onClick={() => setBriefingLanguage('hinglish')}
                  className={`px-1.5 py-0.5 rounded font-black border ${
                    briefingLanguage === 'hinglish' ? 'bg-[#6C5CE7] text-white border-[#1E1E24]' : 'bg-white text-gray-600'
                  }`}
                >
                  Hinglish
                </button>
                <button
                  onClick={() => setIsBriefingOpen(!isBriefingOpen)}
                  className="font-black text-gray-500 hover:text-black ml-1"
                >
                  {isBriefingOpen ? '▲' : '▼'}
                </button>
              </div>
            </div>

            {isBriefingOpen && (
              <div className="pt-2.5 space-y-2 text-xs">
                <p className="text-[#4A4A58] font-bold leading-relaxed">
                  {briefingLanguage === 'hinglish' ? quest.briefing.storyHinglish : quest.briefing.story}
                </p>
                <div className="p-2.5 rounded-xl bg-[#EDE9FE] border border-[#6C5CE7]/30 text-[#4C1D95] font-mono text-[11px] font-bold">
                  💡 {briefingLanguage === 'hinglish' ? quest.briefing.syntaxTipHinglish : quest.briefing.syntaxTip}
                </div>
              </div>
            )}
          </div>

          {/* Interactive 2D RPG Canvas Container */}
          <div className="flex-1 flex flex-col items-center justify-center bg-[#07090E] rounded-2xl border-2 border-[#1E1E24] p-3 shadow-[6px_6px_0px_#1E1E24] relative">
            <canvas
              ref={canvasRef}
              width={480}
              height={480}
              className="w-full max-w-[480px] aspect-square rounded-xl border border-white/10 shadow-inner"
            />

            {/* In-Canvas Mini HUD Overlay */}
            <div className="w-full max-w-[480px] mt-2.5 flex items-center justify-between text-[11px] font-mono text-gray-300 px-1">
              <span className="flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
                <span>Status: {simulationFrames[currentFrameIndex]?.status || (quest.id === 'py-less-1-1' ? 'SLEEPING' : 'READY')}</span>
              </span>
              <span className="text-[#FBBF24] font-bold">
                Coords: ({simulationFrames[currentFrameIndex]?.roverX ?? quest.startPos.x}, {simulationFrames[currentFrameIndex]?.roverY ?? quest.startPos.y})
              </span>
            </div>
          </div>
        </div>

        {/* =========================================================================
            C. RIGHT PANE: PYTHON SPELLBOOK & TERMINAL OUTPUT (45% Width)
           ========================================================================= */}
        <div className="w-full lg:w-[45%] flex flex-col bg-[#12131C] text-gray-100 overflow-hidden">
          {/* SPELLBOOK HEADER BAR */}
          <div className="h-12 bg-[#1A1C29] border-b-2 border-[#1E1E24] px-4 flex items-center justify-between shrink-0 select-none">
            <div className="flex items-center gap-2">
              <Code2 className="w-4 h-4 text-[#FFD214]" />
              <span className="font-mono text-xs font-bold text-gray-300">
                spellbook_main.py
              </span>
            </div>

            {/* Action Buttons */}
            <div className="flex items-center gap-2">
              <button
                onClick={() => setCode(quest.starterCode)}
                title="Reset template"
                className="p-1.5 rounded-lg text-gray-400 hover:text-white hover:bg-[#25283B] transition-colors cursor-pointer"
              >
                <RotateCcw className="w-3.5 h-3.5" />
              </button>

              <button
                onClick={handleStepForward}
                disabled={isRunning || isAnimating}
                title="Step frame forward"
                className="px-2.5 py-1 text-xs font-mono font-bold bg-[#25283B] hover:bg-[#32364F] text-gray-300 rounded-lg border border-gray-700 flex items-center gap-1 cursor-pointer disabled:opacity-40"
              >
                <SkipForward className="w-3 h-3" />
                <span>Step</span>
              </button>

              <button
                onClick={handleRunCode}
                disabled={isRunning || isAnimating}
                className="btn-arcade btn-arcade-purple text-xs py-1.5 px-4 flex items-center gap-1.5 shadow-[2px_2px_0px_#1E1E24] cursor-pointer disabled:opacity-50"
              >
                {isAnimating ? (
                  <span className="flex items-center gap-1">
                    <span className="w-2 h-2 rounded-full bg-white animate-ping" />
                    Simulating...
                  </span>
                ) : (
                  <>
                    <Play className="w-3.5 h-3.5 fill-current" />
                    <span>Run Code ▶</span>
                  </>
                )}
              </button>
            </div>
          </div>

          {/* PYTHON CODE EDITOR TEXTAREA (TOP HALF) */}
          <div className="h-[52%] flex bg-[#12131C] border-b-2 border-[#1E1E24] overflow-hidden">
            {/* Line Numbers */}
            <div className="w-10 bg-[#0E0F17] text-gray-600 font-mono text-xs py-3 select-none text-right pr-2 space-y-1 overflow-hidden shrink-0">
              {Array.from({ length: 30 }).map((_, i) => (
                <div key={i} className="leading-5">
                  {i + 1}
                </div>
              ))}
            </div>

            <textarea
              value={code}
              onChange={(e) => setCode(e.target.value)}
              spellCheck={false}
              className="flex-1 bg-[#12131C] text-emerald-300 font-mono text-xs sm:text-sm p-3 outline-none resize-none leading-5 selection:bg-[#6C5CE7]/40"
              placeholder="# Write your Python quest commands here..."
            />
          </div>

          {/* LOWER HALF: LIVE TELEMETRY & TERMINAL OUTPUT */}
          <div className="h-[48%] flex flex-col bg-[#0E0F17]">
            <div className="h-9 bg-[#161824] border-b border-[#2B2E42] px-3 flex items-center justify-between shrink-0 select-none text-xs font-mono">
              <span className="text-gray-400 font-bold">📟 Pyodide Console &amp; Odyssey Telemetry</span>
              <button
                onClick={() => setConsoleLogs([])}
                className="text-[10px] text-gray-500 hover:text-white"
              >
                Clear
              </button>
            </div>

            <div className="flex-1 p-3 overflow-y-auto font-mono text-xs space-y-1.5 text-gray-300 select-text">
              {consoleLogs.map((log, idx) => (
                <div
                  key={idx}
                  className={`leading-tight ${
                    log.includes('❌') || log.includes('SyntaxError') || log.includes('REJECTED') || log.includes('HALTED')
                      ? 'text-rose-400 bg-rose-950/20 px-1 rounded'
                      : log.includes('🏆') || log.includes('Activated') || log.includes('Mastered')
                      ? 'text-emerald-300 font-bold'
                      : 'text-gray-300'
                  }`}
                >
                  <span className="text-[#FFD214] select-none mr-1.5">›</span>
                  <span>{log}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* =========================================================================
          VICTORY CELEBRATION MODAL WITH TWO-VAULT TRANSFER (+₹10)
         ========================================================================= */}
      {victoryModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-150">
          <div className="w-full max-w-md bg-[#FAF6EE] border-4 border-[#1E1E24] rounded-2xl p-6 shadow-[8px_8px_0px_#1E1E24] text-center space-y-4 animate-in zoom-in-95 duration-200">
            <div className="w-16 h-16 rounded-2xl bg-[#D1FAE5] border-2 border-[#10B981] text-4xl flex items-center justify-center mx-auto shadow-[3px_3px_0px_#1E1E24]">
              🏆
            </div>

            <div>
              <span className="text-xs font-black uppercase text-[#059669] tracking-wider block mb-1">
                Quest Victory!
              </span>
              <h2 className="font-serif font-black text-2xl text-[#1E1E24]">
                {quest.title} Mastered!
              </h2>
              <p className="text-xs text-[#4A4A58] font-bold mt-1">
                You successfully programmed Rover Arya through {quest.realmName}!
              </p>
            </div>

            {/* Guru Dakshina Rupee Transfer Animation */}
            <div className="p-3.5 rounded-xl bg-gradient-to-r from-[#FEF3C7] to-[#D1FAE5] border-2 border-[#1E1E24] shadow-[2px_2px_0px_#1E1E24] space-y-2">
              <div className="text-[11px] font-black uppercase tracking-wider text-[#92400E]">
                Guru Dakshina Commitment Unlock
              </div>
              <div className="flex items-center justify-center gap-3 text-sm font-black">
                <span className="text-gray-600 line-through">Security: ₹{vault.securityVault + 10}</span>
                <span className="text-[#10B981] animate-bounce">🪙 +₹10</span>
                <span className="text-emerald-700 font-mono">Withdrawable: ₹{vault.withdrawableVault}</span>
              </div>
            </div>

            {/* Rewards Breakdown */}
            <div className="flex items-center justify-center gap-4 text-xs font-black">
              <span className="text-[#6C5CE7] bg-[#EDE9FE] px-3 py-1 rounded-full border border-[#6C5CE7]">
                +{quest.xpReward} XP Earned
              </span>
              {awardedSeal && (
                <span className="text-[#D97706] bg-[#FEF3C7] px-3 py-1 rounded-full border border-[#D97706] flex items-center gap-1">
                  <Award className="w-3.5 h-3.5" />
                  <span>{awardedSeal}</span>
                </span>
              )}
            </div>

            {/* Advance Button */}
            <div className="pt-2 flex items-center justify-between gap-3">
              <button
                onClick={() => setVictoryModalOpen(false)}
                className="btn-arcade btn-arcade-white text-xs py-2 px-4 flex-1 cursor-pointer"
              >
                Review Code
              </button>
              <button
                onClick={handleNextQuest}
                className="btn-arcade btn-arcade-purple text-xs py-2 px-6 flex-1 flex items-center justify-center gap-1.5 cursor-pointer shadow-[3px_3px_0px_#1E1E24]"
              >
                <span>Next Quest</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        </div>
      )}

      {/* =========================================================================
          ACHARYA AI SOCRATIC MENTOR DRAWER
         ========================================================================= */}
      <AcharyaDrawer
        isOpen={isMentorOpen}
        onClose={() => setIsMentorOpen(false)}
        contextCode={code}
        contextError={consoleLogs.filter((l) => l.includes('Error') || l.includes('REJECTED') || l.includes('HALTED') || l.includes('❌')).join('\n')}
        activeMissionTitle={`Rover Arya's Odyssey: ${quest.realmName} — ${quest.title}`}
        missionGoal={quest.instructions}
        language="python"
        simulatorState={{
          roverPos: [
            simulationFrames[currentFrameIndex]?.roverX ?? quest.startPos.x,
            simulationFrames[currentFrameIndex]?.roverY ?? quest.startPos.y,
          ],
          targetPos: [quest.targetPos.x, quest.targetPos.y],
          battery: simulationFrames[currentFrameIndex]?.batteryLevel ?? 100,
          status: proactiveTrigger ? 'syntax_error' : 'incomplete_goal',
        }}
        proactiveTrigger={proactiveTrigger}
        onClearProactiveTrigger={() => setProactiveTrigger(null)}
      />
    </div>
  );
}
