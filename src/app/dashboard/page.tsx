// Student Quest Hub: CodeDex-inspired Player Headquarters
'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useDronacharya } from '@/lib/store';
import { getActiveSession, getGuestSession, triggerSaveProgressModal, RegisteredUser, AVAILABLE_SUBJECTS } from '@/lib/db/auth-db';
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
} from 'lucide-react';

export default function DashboardPage() {
  const router = useRouter();
  const { state } = useDronacharya();
  const [currentUser, setCurrentUser] = useState<RegisteredUser | null>(null);
  const [isGuest, setIsGuest] = useState(false);

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
    window.addEventListener('dronacharya_session_change', syncUser);
    window.addEventListener('storage', syncUser);
    return () => {
      window.removeEventListener('dronacharya_session_change', syncUser);
      window.removeEventListener('storage', syncUser);
    };
  }, []);

  const activeSubjectObj =
    AVAILABLE_SUBJECTS.find((s) => s.id === currentUser?.targetSubject) || AVAILABLE_SUBJECTS[0];

  const totalXp = currentUser?.totalXp || 0;
  const currentLevel = currentUser?.level || 1;
  const nextLevelXp = currentLevel * 200;
  const currentLevelProgress = Math.min(100, Math.round(((totalXp % 200) / 200) * 100));

  return (
    <div className="w-full px-4 sm:px-6 lg:px-8 py-8 max-w-7xl mx-auto space-y-8">
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
            <span>Save Progress to Supabase</span>
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
            <p className="text-xs sm:text-sm text-[#4A4A58] font-medium max-w-xl">
              Current Curriculum: <strong className="text-[#1E1E24]">{activeSubjectObj.name}</strong> • Level: <strong>{currentUser?.studentClass || 'Class 10'}</strong>
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
            <div className="bg-[#FEE2E2] border-2 border-[#1E1E24] rounded-xl px-4 py-2.5 shadow-[2px_2px_0px_#1E1E24] text-center">
              <span className="text-[10px] font-black uppercase text-[#DC2626] block">Hearts</span>
              <span className="font-serif font-black text-xl text-[#EF4444]">{currentUser?.hearts ?? 3} ❤️</span>
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
          {/* Capstone Project Card */}
          <div className="card-game p-6 bg-[#FEF3C7]">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-black uppercase tracking-wider text-[#D97706] flex items-center gap-1.5">
                <FolderGit2 className="w-4 h-4" />
                Practical Project
              </span>
              <span className="text-[10px] font-black bg-white px-2 py-0.5 rounded border border-[#1E1E24]">
                Capstone Track
              </span>
            </div>

            <h3 className="font-serif font-black text-xl text-[#1E1E24] mb-2">
              Autonomous Robot Fleet Controller
            </h3>
            <p className="text-xs text-[#4A4A58] leading-relaxed mb-4">
              Build a complete command-line Python software system that coordinates multiple exploration rovers, schedules battery routes, and exports performance logs.
            </p>

            <Link
              href="/projects"
              className="btn-game-yellow w-full text-xs py-2.5 text-center shadow-[3px_3px_0px_#1E1E24]"
            >
              <span>Open Project Lab</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          {/* Mastery Seals Card */}
          <div className="card-game p-6 bg-white">
            <h3 className="font-serif font-black text-base text-[#1E1E24] mb-2 flex items-center gap-2">
              <Award className="w-5 h-5 text-[#F59E0B]" />
              <span>Verifiable Mastery Seals</span>
            </h3>
            <p className="text-xs text-[#4A4A58] mb-4">
              Seals unlocked by proving independent coding mastery in the Bug-to-Battle arena:
            </p>

            <div className="space-y-2.5">
              <div className="p-3 rounded-xl bg-[#FAF6EE] border-2 border-[#1E1E24] flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-[#10B981] border border-[#1E1E24] flex items-center justify-center text-white font-bold text-xs">
                  ✓
                </div>
                <div>
                  <span className="font-black text-xs text-[#1E1E24] block">Loop Navigator Seal</span>
                  <span className="text-[11px] text-[#7E7E8F]">Demonstrated sequential range loops and state accumulators</span>
                </div>
              </div>

              <div className="p-3 rounded-xl bg-[#FAF6EE] border-2 border-[#1E1E24] flex items-center gap-3 opacity-60">
                <div className="w-8 h-8 rounded-lg bg-[#E8E1D2] border border-[#1E1E24] flex items-center justify-center text-[#7E7E8F] font-bold text-xs">
                  🔒
                </div>
                <div>
                  <span className="font-black text-xs text-[#1E1E24] block">Condition Sentinel Seal</span>
                  <span className="text-[11px] text-[#7E7E8F]">Requires completing Stage 4: Hazard Filter</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
