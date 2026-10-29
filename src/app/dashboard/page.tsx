// Student Quest Hub: CodeDex-inspired Player Headquarters
'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useDronacharya } from '@/lib/store';
import { getActiveSession, getGuestSession, triggerSaveProgressModal, RegisteredUser, AVAILABLE_SUBJECTS } from '@/lib/db/auth-db';
import { getVaultState, VaultState } from '@/lib/game/vault-ledger';
import {
  ArrowRight,
  Target,
  Code2,
  FolderGit2,
  Play,
  CheckCircle2,
  BookOpen,
  Sparkles,
  Award,
  Zap,
  Gamepad2,
  Compass,
  Star,
  Flame,
  Heart,
  ShieldCheck,
  Pickaxe,
  Shield,
  Settings,
} from 'lucide-react';

export default function DashboardPage() {
  const router = useRouter();
  const { state } = useDronacharya();
  const [currentUser, setCurrentUser] = useState<RegisteredUser | null>(null);
  const [isGuest, setIsGuest] = useState(false);
  const [vaultState, setVaultState] = useState<VaultState>({
    securityVault: 500,
    withdrawableVault: 0,
    unlockedQuests: [],
    unlockedSeals: [],
  });

  useEffect(() => {
    const syncUser = () => {
      const active = getActiveSession();
      if (active) {
        setCurrentUser(active);
        setIsGuest(false);
      } else {
        const guest = getGuestSession();
        setCurrentUser(guest);
        setIsGuest(true);
      }
    };
    syncUser();
    setVaultState(getVaultState());

    const syncVault = () => setVaultState(getVaultState());

    window.addEventListener('dronacharya_session_change', syncUser);
    window.addEventListener('storage', syncUser);
    window.addEventListener('dronacharya_vault_changed', syncVault);
    return () => {
      window.removeEventListener('dronacharya_session_change', syncUser);
      window.removeEventListener('storage', syncUser);
      window.removeEventListener('dronacharya_vault_changed', syncVault);
    };
  }, []);

  const activeSubjectObj =
    AVAILABLE_SUBJECTS.find((s) => s.id === currentUser?.targetSubject) || AVAILABLE_SUBJECTS[0];

  const totalXp = currentUser?.totalXp || 0;
  const currentLevel = currentUser?.level || 1;
  const nextLevelXp = currentLevel * 200;
  const currentLevelProgress = Math.min(100, Math.round(((totalXp % 200) / 200) * 100));

  return (
    <div className="w-full px-4 sm:px-6 lg:px-8 py-8 max-w-7xl mx-auto space-y-8 overflow-x-hidden">
      {/* 0. Guest Mode Call-to-Action Banner */}
      {isGuest && (
        <div className="card-game p-4 sm:p-5 bg-[#FEF3C7] border-2 border-[#1E1E24] shadow-[4px_4px_0px_#1E1E24] flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-xl bg-[#F59E0B] text-white flex items-center justify-center text-xl font-black border-2 border-[#1E1E24] shadow-[2px_2px_0px_#1E1E24] shrink-0">
              🕹️
            </div>
            <div>
              <div className="inline-flex items-center gap-1.5 text-xs font-black uppercase text-[#D97706] tracking-wider">
                <span>Guest Explorer Mode</span>
                <span className="w-2 h-2 rounded-full bg-[#10B981] animate-ping" />
              </div>
              <p className="text-xs sm:text-sm text-[#1E1E24] font-bold">
                You are playing as a Guest! Your streak, {totalXp} XP, and completed quests are saved locally in this browser.
              </p>
            </div>
          </div>
          <button
            onClick={() => triggerSaveProgressModal('dashboard_guest_banner')}
            className="btn-game-yellow text-xs py-2.5 px-5 shrink-0 flex items-center gap-1.5 shadow-[2px_2px_0px_#1E1E24] cursor-pointer"
          >
            <Sparkles className="w-4 h-4 text-[#1E1E24]" />
            <span>Sign In to Save Progress</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      )}

      {/* 1. Player Status Hero Banner */}
      <div className="card-game p-6 sm:p-8 bg-[#FAF6EE] shadow-[6px_6px_0px_#1E1E24]">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#EDE9FE] border-2 border-[#1E1E24] text-xs font-black text-[#6C5CE7] shadow-[2px_2px_0px_#1E1E24]">
              <Sparkles className="w-3.5 h-3.5 text-[#6C5CE7]" />
              <span>Adventurer Headquarters</span>
            </div>
            <h1 className="font-serif font-black text-3xl sm:text-4xl text-[#1E1E24]">
              {isGuest ? 'Welcome, Guest Explorer!' : `Welcome back, ${currentUser?.name || 'Apprentice'}!`}
            </h1>
            <p className="text-xs sm:text-sm text-[#4A4A58] font-medium max-w-xl flex items-center flex-wrap gap-2">
              <span>Active Course: <strong className="text-[#1E1E24]">{activeSubjectObj.name}</strong></span>
              <Link
                href="/settings"
                className="inline-flex items-center gap-1 text-[11px] font-bold text-[#6C5CE7] hover:text-[#5b4bc4] bg-white px-2 py-0.5 rounded-lg border border-slate-300 shadow-xs hover:border-[#6C5CE7] transition-all"
                title="Change active course in Profile Settings"
              >
                <Settings className="w-3 h-3 text-[#6C5CE7]" />
                <span>Switch Course</span>
              </Link>
            </p>
          </div>

          {/* Quick HUD Metrics */}
          <div className="flex flex-wrap items-center gap-3">
            <div className="bg-[#FEF3C7] border-2 border-[#1E1E24] rounded-xl px-4 py-2.5 shadow-[2px_2px_0px_#1E1E24] text-center">
              <span className="text-[10px] font-black uppercase text-[#D97706] block">Level</span>
              <span className="font-serif font-black text-xl text-[#1E1E24]">Lv. {currentLevel}</span>
            </div>
            <div className="bg-[#D1FAE5] border-2 border-[#1E1E24] rounded-xl px-4 py-2.5 shadow-[2px_2px_0px_#1E1E24] text-center">
              <span className="text-[10px] font-black uppercase text-[#059669] block">Total XP</span>
              <span className="font-serif font-black text-xl text-[#059669]">{totalXp}</span>
            </div>
            <div className="bg-[#FAF6EE] border-2 border-[#1E1E24] rounded-xl px-3.5 py-2.5 shadow-[2px_2px_0px_#1E1E24] text-center">
              <span className="text-[10px] font-black uppercase text-amber-800 block">🔒 Security Vault</span>
              <span className="font-serif font-black text-lg text-[#1E1E24]">₹{vaultState.securityVault}</span>
            </div>
            <div className="bg-[#D1FAE5] border-2 border-[#10B981] rounded-xl px-3.5 py-2.5 shadow-[2px_2px_0px_#1E1E24] text-center">
              <span className="text-[10px] font-black uppercase text-emerald-800 block">💸 Withdrawable</span>
              <span className="font-serif font-black text-lg text-emerald-700">₹{vaultState.withdrawableVault}</span>
            </div>
            <div className="bg-[#FEE2E2] border-2 border-[#1E1E24] rounded-xl px-3 py-2.5 shadow-[2px_2px_0px_#1E1E24] text-center">
              <span className="text-[10px] font-black uppercase text-[#DC2626] block">Hearts</span>
              <span className="font-serif font-black text-lg text-[#EF4444]">{currentUser?.hearts ?? 3} ❤️</span>
            </div>
          </div>
        </div>

        {/* Level XP Progress Bar */}
        <div className="mt-6 pt-4 border-t-2 border-[#1E1E24]/15">
          <div className="flex items-center justify-between text-xs font-bold text-[#4A4A58] mb-1.5">
            <span>Next Level Progression</span>
            <span>{totalXp % 200} / 200 XP to Level {currentLevel + 1}</span>
          </div>
          <div className="w-full h-3 bg-white border-2 border-[#1E1E24] rounded-full overflow-hidden shadow-xs">
            <div
              className="h-full bg-[#6C5CE7] transition-all duration-500 rounded-full"
              style={{ width: `${currentLevelProgress}%` }}
            />
          </div>
        </div>
      </div>

      {/* 2. Main Two-Column Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Column: Active Quests */}
        <div className="lg:col-span-7 space-y-6">
          {/* Featured Game Mode: Gurukul Code Dungeon & Craft Realm */}
          <div className="card-game p-6 bg-gradient-to-br from-[#FAF6EE] to-[#FEF3C7] border-2 border-[#1E1E24] shadow-[6px_6px_0px_#1E1E24] relative overflow-hidden">
            {/* Background decorative corner icon */}
            <div className="absolute -right-4 -bottom-4 text-7xl opacity-10 select-none pointer-events-none">
              ⚔️
            </div>

            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-black text-[#1E1E24] bg-[#FBBF24] px-3 py-1 rounded-full border border-[#1E1E24] shadow-[1.5px_1.5px_0px_#1E1E24] flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5" />
                <span>New Game Mode • Dungeon &amp; Craft</span>
              </span>
              <span className="text-xs font-black text-[#6C5CE7] bg-[#EDE9FE] px-2.5 py-0.5 rounded border border-[#1E1E24]">
                Up to +350 XP / Floor
              </span>
            </div>

            <h2 className="font-serif font-black text-2xl text-[#1E1E24] mb-1 flex items-center gap-2">
              <span>Code Dungeon &amp; Craft Realm</span>
              <span className="text-lg">⚔️⛏️</span>
            </h2>
            <p className="text-xs font-bold text-[#D97706] mb-2">
              Voxel Mining, Bridge Crafting &amp; 4 Dungeon Boss Floors
            </p>
            <p className="text-xs text-[#4A4A58] leading-relaxed mb-4">
              Mine resources, craft wooden &amp; stone bridges, disarm mimics with <code className="font-bold text-[#6C5CE7]">hero.scan()</code>, and defeat the Syntax Golem Boss with loop functions to earn the exclusive <strong>Dungeon Architect Seal</strong>.
            </p>

            {/* Floor badges preview */}
            <div className="flex flex-wrap items-center gap-1.5 mb-5">
              <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-white border border-[#1E1E24]/20 text-[#1E1E24]">
                F1: Voxel Quarry (Variables)
              </span>
              <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-white border border-[#1E1E24]/20 text-[#1E1E24]">
                F2: Loops Labyrinth (Loops)
              </span>
              <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-white border border-[#1E1E24]/20 text-[#1E1E24]">
                F3: Sentinel Gate (Conditionals)
              </span>
              <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-white border border-[#1E1E24]/20 text-[#1E1E24]">
                F4: Syntax Golem (Boss)
              </span>
            </div>

            <div className="flex items-center justify-between pt-4 border-t-2 border-[#1E1E24]/15">
              <span className="text-xs font-bold text-[#7E7E8F]">
                10x10 Voxel Grid • 8-Bit Audio • Socratic AI
              </span>

              <Link
                href="/dungeon"
                className="btn-arcade text-xs py-2 px-5 btn-arcade-yellow shadow-[3px_3px_0px_#1E1E24] flex items-center gap-1.5"
              >
                <span>Enter Dungeon ⚔️</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          </div>

          {/* Featured Game Mode: Rover Arya's Python Odyssey (2D RPG Arena) */}
          <div className="card-game p-6 bg-gradient-to-br from-[#FAF6EE] via-[#EDE9FE] to-[#FEF3C7] border-2 border-[#1E1E24] shadow-[6px_6px_0px_#1E1E24] relative overflow-hidden">
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-black text-white bg-[#6C5CE7] px-3 py-1 rounded-full border border-[#1E1E24] shadow-[1.5px_1.5px_0px_#1E1E24] flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 fill-[#FFD214]" />
                <span>2D RPG Game Arena • 5 Quests</span>
              </span>
              <span className="text-xs font-black text-[#059669] bg-[#D1FAE5] px-2.5 py-0.5 rounded border border-[#1E1E24]">
                ₹10 Unlocked / Quest
              </span>
            </div>

            <h2 className="font-serif font-black text-2xl text-[#1E1E24] mb-1 flex items-center gap-2">
              <span>Rover Arya&apos;s Python Odyssey</span>
              <span className="text-lg">🎮🚀</span>
            </h2>
            <p className="text-xs font-bold text-[#6C5CE7] mb-2">
              Learn Real Python: Syntax, Variables, Conditionals &amp; Loops through 4 Playable Realms
            </p>
            <p className="text-xs text-[#4A4A58] leading-relaxed mb-4">
              Control Rover Arya across an 8x8 interactive canvas. Solve real coding challenges to awaken optical sensors, cross voltage bridges, charge thrusters, deflect laser barriers, and harvest energy loops to unlock your <strong>Guru Dakshina Vault</strong>!
            </p>

            <div className="flex items-center justify-between pt-4 border-t-2 border-[#1E1E24]/15">
              <div className="flex items-center gap-2 text-xs font-mono font-bold text-[#6C5CE7]">
                <span>🔒 ₹{vaultState.securityVault}</span>
                <span>→</span>
                <span className="text-emerald-700 font-black">💸 ₹{vaultState.withdrawableVault} Unlocked</span>
              </div>

              <Link
                href="/learn/py-less-1-1"
                className="btn-arcade text-xs py-2 px-5 btn-arcade-yellow shadow-[3px_3px_0px_#1E1E24] flex items-center gap-1.5 cursor-pointer"
              >
                <span>Play Python Odyssey 🎮</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          </div>

          {/* Active Featured Mission: Rescue the Robot */}
          <div className="card-game p-6 bg-white shadow-[4px_4px_0px_#6C5CE7] relative">
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-black text-[#6C5CE7] bg-[#EDE9FE] px-3 py-1 rounded-full border border-[#1E1E24] shadow-[1.5px_1.5px_0px_#1E1E24]">
                Next Quest: Stage 3 • Loop Lab
              </span>
              <span className="text-xs font-black text-[#D97706] bg-[#FEF3C7] px-2.5 py-0.5 rounded border border-[#1E1E24]">
                +150 XP
              </span>
            </div>

            <h2 className="font-serif font-black text-2xl text-[#1E1E24] mb-1">
              Rescue the Robot: Facility Navigation
            </h2>
            <p className="text-xs font-bold text-[#6C5CE7] mb-2">
              Concept: Python Loops &amp; Machine Steps
            </p>
            <p className="text-xs text-[#4A4A58] leading-relaxed mb-5">
              Rover Arya is stranded! Program a series of for-loops to navigate through the 6x6 facility grid, collect energy cells, and dock at the emergency beacon without hitting obstacle blast doors.
            </p>

            <div className="flex items-center justify-between pt-4 border-t-2 border-[#1E1E24]/15">
              <span className="text-xs font-bold text-[#7E7E8F]">
                Real Python Code • 2D Interactive Grid
              </span>

              <Link
                href="/simulator?mission=mission-rescue-robot"
                className="btn-game-purple text-xs py-2 px-5 shadow-[3px_3px_0px_#1E1E24]"
              >
                <span>Launch Mission</span>
                <Play className="w-3.5 h-3.5 fill-white" />
              </Link>
            </div>
          </div>

          {/* Quick World Map Link Card */}
          <div className="card-game p-6 bg-white flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-[#EDE9FE] border-2 border-[#1E1E24] flex items-center justify-center text-[#6C5CE7] shadow-[2px_2px_0px_#1E1E24]">
                <Compass className="w-6 h-6" />
              </div>
              <div>
                <h3 className="font-serif font-black text-lg text-[#1E1E24]">
                  Interactive World Map
                </h3>
                <p className="text-xs text-[#4A4A58]">
                  Explore all 8 programming regions from Starter Village to Project Kingdom.
                </p>
              </div>
            </div>

            <Link
              href="/paths"
              className="btn-game-white text-xs py-2 px-4 shadow-[2px_2px_0px_#1E1E24]"
            >
              <span>View Map</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>

        {/* Right Column: Practical Projects & Mastery */}
        <div className="lg:col-span-5 space-y-6">
          {/* Guru Dakshina Two-Vault Commitment Ledger Card */}
          <div className="card-game p-6 bg-[#FEF3C7] border-2 border-[#1E1E24] shadow-[4px_4px_0px_#1E1E24]">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-black uppercase tracking-wider text-[#D97706] flex items-center gap-1.5">
                <Sparkles className="w-4 h-4" />
                Anti-Dropout Engine
              </span>
              <span className="text-[10px] font-black bg-white px-2 py-0.5 rounded border border-[#1E1E24]">
                Guru Dakshina
              </span>
            </div>

            <h3 className="font-serif font-black text-xl text-[#1E1E24] mb-2">
              Two-Vault Commitment Ledger
            </h3>
            <p className="text-xs text-[#4A4A58] leading-relaxed mb-4">
              Your locked commitment vault transfers ₹10 into your withdrawable balance for every quest and test harness you conquer. Zero dropouts, 100% refund upon completion.
            </p>

            <div className="grid grid-cols-2 gap-2 mb-4">
              <div className="p-2.5 rounded-xl bg-white border border-[#1E1E24] text-center">
                <span className="text-[10px] font-bold text-gray-500 block">🔒 Security Vault</span>
                <span className="text-base font-black text-[#D97706]">₹450</span>
              </div>
              <div className="p-2.5 rounded-xl bg-white border border-[#1E1E24] text-center">
                <span className="text-[10px] font-bold text-gray-500 block">💸 Withdrawable</span>
                <span className="text-base font-black text-[#059669]">₹50</span>
              </div>
            </div>

            <Link
              href="/simulator"
              className="btn-arcade btn-arcade-gold w-full text-xs py-2.5 text-center flex items-center justify-center gap-1.5"
            >
              <span>Launch Practice Quest (+₹10)</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          {/* Interactive Coding Arena Card */}
          <div className="card-game p-6 bg-white border-2 border-[#1E1E24] shadow-[4px_4px_0px_#1E1E24]">
            <h3 className="font-serif font-black text-base text-[#1E1E24] mb-2 flex items-center gap-2">
              <Gamepad2 className="w-5 h-5 text-[#6C5CE7]" />
              <span>Interactive Practice Arenas</span>
            </h3>
            <p className="text-xs text-[#4A4A58] mb-4 leading-relaxed">
              Real code controlling autonomous rovers and hazardous decontamination bio-cells:
            </p>

            <div className="space-y-2.5">
              <Link
                href="/simulator?mission=mission-rescue-robot"
                className="p-3 rounded-xl bg-[#FAF6EE] border-2 border-[#1E1E24] flex items-center justify-between hover:bg-[#EDE9FE] transition-colors"
              >
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg bg-[#6C5CE7] border border-[#1E1E24] flex items-center justify-center text-white font-bold text-xs">
                    🎮
                  </div>
                  <div>
                    <span className="font-black text-xs text-[#1E1E24] block">Rover Arya Rescue</span>
                    <span className="text-[11px] text-[#7E7E8F]">Navigate loops & battery bounds</span>
                  </div>
                </div>
                <ArrowRight className="w-4 h-4 text-[#6C5CE7]" />
              </Link>

              <Link
                href="/simulator?mission=mission-hazard-filter"
                className="p-3 rounded-xl bg-[#FAF6EE] border-2 border-[#1E1E24] flex items-center justify-between hover:bg-[#FEF3C7] transition-colors"
              >
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg bg-[#F59E0B] border border-[#1E1E24] flex items-center justify-center text-white font-bold text-xs">
                    ⚡
                  </div>
                  <div>
                    <span className="font-black text-xs text-[#1E1E24] block">Bio-Cell Hazard Filter</span>
                    <span className="text-[11px] text-[#7E7E8F]">Conditional logic & arrays</span>
                  </div>
                </div>
                <ArrowRight className="w-4 h-4 text-[#D97706]" />
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
