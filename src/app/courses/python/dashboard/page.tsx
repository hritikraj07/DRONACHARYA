// Dronacharya Python Learning Dashboard
// Comprehensive game-based dashboard inspired by the Choose Your Path paradigm
// Integrated seamlessly into the Dronacharya design system
'use client';

import React, { useState, useEffect, Suspense } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import {
  BookOpen,
  Gamepad2,
  Code2,
  Award,
  Lock,
  ArrowRight,
  CheckCircle2,
  Clock,
  Flame,
  Target,
  Terminal,
  Compass,
  Play,
  FolderCode,
  X,
} from 'lucide-react';
import { COURSES_CATALOG } from '@/lib/data/course-system';
import { getEffectiveUser, RegisteredUser } from '@/lib/db/auth-db';
import {
  getPythonCourseProgress,
  PythonProgressData,
  ALL_PYTHON_LESSONS,
} from '@/lib/curriculum/python-progress';

export default function PythonDashboardPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-[#FAF6EE] flex flex-col items-center justify-center p-4">
          <div className="w-10 h-10 border-4 border-[#6C5CE7] border-t-transparent rounded-full animate-spin mb-4" />
          <p className="font-mono text-xs font-bold text-gray-500">
            Initializing Python Learning Dashboard...
          </p>
        </div>
      }
    >
      <PythonDashboardContent />
    </Suspense>
  );
}

// 3 Featured Python Missions Specification
interface FeaturedMission {
  id: string;
  missionId: string;
  title: string;
  description: string;
  difficulty: 'Easy' | 'Medium' | 'Hard';
  estimatedTime: string;
  xpReward: number;
  concept: string;
  icon: React.ComponentType<{ className?: string }>;
  tags: string[];
}

const FEATURED_MISSIONS: FeaturedMission[] = [
  {
    id: 'hello-python',
    missionId: 'mission-hello-python',
    title: 'Hello, Python!',
    description: 'Write your first Python program and make it print something to the Gurukul console.',
    difficulty: 'Easy',
    estimatedTime: '5 mins',
    xpReward: 50,
    concept: 'print() & Syntax',
    icon: Terminal,
    tags: ['Beginner', 'Standard I/O'],
  },
  {
    id: 'calculator',
    missionId: 'mission-calculator',
    title: 'Build a Calculator',
    description: 'Build a simple calculator using functions, arithmetic operators, and conditional branching.',
    difficulty: 'Medium',
    estimatedTime: '15 mins',
    xpReward: 100,
    concept: 'Functions & Logic',
    icon: Code2,
    tags: ['Functions', 'Control Flow'],
  },
  {
    id: 'todo-list',
    missionId: 'mission-todo-list',
    title: 'Create a To-Do List',
    description: 'Create a Python program to manage daily tasks, track completion, and organize your agenda.',
    difficulty: 'Medium',
    estimatedTime: '20 mins',
    xpReward: 150,
    concept: 'Lists & Dictionaries',
    icon: Target,
    tags: ['Data Structures', 'State'],
  },
];

// Python Portfolio Projects Specification
interface PythonProject {
  id: string;
  title: string;
  subtitle: string;
  description: string;
  concepts: string[];
  difficulty: string;
  xpReward: number;
  starterMission: string;
}

const PYTHON_PROJECTS: PythonProject[] = [
  {
    id: 'proj-rpg',
    title: 'Terminal RPG Dungeon Crawler',
    subtitle: 'Battle mechanics, character stats & loot system',
    description:
      'Build a text-based fantasy RPG game engine in pure Python. Implement player HP, enemy AI encounters, dice-roll combat, and inventory management.',
    concepts: ['Functions', 'Dictionaries', 'While Loops', 'Randomization'],
    difficulty: 'Intermediate',
    xpReward: 300,
    starterMission: 'mission-rescue-robot',
  },
  {
    id: 'proj-budget',
    title: 'Smart Pocket Money & Expense Tracker',
    subtitle: 'Financial ledger with category breakdown',
    description:
      'Create a command-line financial manager to track allowances, categorize spending into food/study/games, and compute net savings.',
    concepts: ['Lists of Dicts', 'String Formatting', 'Aggregations', 'Loops'],
    difficulty: 'Beginner-Friendly',
    xpReward: 250,
    starterMission: 'mission-calculator',
  },
  {
    id: 'proj-cipher',
    title: 'Password Security & Cipher Auditor',
    subtitle: 'Entropy analyzer and strong password generator',
    description:
      'Develop a security utility that generates cryptographically strong passwords and evaluates strength based on length, symbols, and case variations.',
    concepts: ['String Manipulation', 'ASCII Codes', 'Boolean Logic', 'Sets'],
    difficulty: 'Intermediate',
    xpReward: 300,
    starterMission: 'mission-todo-list',
  },
];

function PythonDashboardContent() {
  const router = useRouter();

  // Python course data
  const pythonCourse =
    COURSES_CATALOG.find((c) => c.id === 'python') || COURSES_CATALOG[0];

  // User and progress state
  const [currentUser, setCurrentUser] = useState<RegisteredUser | null>(null);
  const [progressData, setProgressData] = useState<PythonProgressData>(() =>
    getPythonCourseProgress()
  );
  const [isProjectsModalOpen, setIsProjectsModalOpen] = useState(false);
  const [isSyllabusModalOpen, setIsSyllabusModalOpen] = useState(false);

  // Sync state on mount and on storage events
  useEffect(() => {
    const syncProgress = () => {
      const session = getEffectiveUser();
      setCurrentUser(session);
      setProgressData(getPythonCourseProgress());
    };

    syncProgress();
    window.addEventListener('dronacharya_session_change', syncProgress);
    window.addEventListener('storage', syncProgress);

    return () => {
      window.removeEventListener('dronacharya_session_change', syncProgress);
      window.removeEventListener('storage', syncProgress);
    };
  }, []);

  const {
    totalLessonsCount,
    completedLessonsCount,
    totalMissionsCount,
    completedMissionsCount,
    totalProjectsCount,
    completedProjectsCount,
    totalActivitiesCount,
    completedActivitiesCount,
    percent: calculatedPercent,
    completedLessonIds,
    completedMissionKeys,
    completedProjectIds,
  } = progressData;

  // SVG Progress Ring calculations
  const ringRadius = 40;
  const ringCircumference = 2 * Math.PI * ringRadius;
  const ringStrokeOffset =
    ringCircumference - (calculatedPercent / 100) * ringCircumference;

  // Next recommended lesson id
  const nextLessonId =
    ALL_PYTHON_LESSONS.find((id) => !completedLessonIds.includes(id)) ||
    ALL_PYTHON_LESSONS[0] ||
    'py-less-1-1';

  // Prerequisite unlocks:
  // Card 1 (Basics) is always unlocked.
  // Card 2 (Missions) requires Card 1 completion (all 5 lessons completed).
  const isCard1Complete = completedLessonsCount >= 5;
  // Card 3 (Projects) requires Card 2 completion (all 3 featured missions completed).
  const isCard2Complete = isCard1Complete && completedMissionsCount >= 3;
  // Card 4 (Certification) requires Card 3 completion (at least 1 project completed).
  const isCard3Complete = isCard2Complete && completedProjectsCount >= 1;

  return (
    <div className="w-full flex flex-col items-center min-h-screen text-[#1E1E24] pb-20 overflow-x-hidden">

      <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 space-y-10">
        {/* =========================================================================
            A. PYTHON COURSE HERO (Version removed & Progress Bar brought here)
           ========================================================================= */}
        <section
          className="relative w-full rounded-3xl border-3 border-[#1E1E24] p-6 sm:p-8 lg:p-10 shadow-[8px_8px_0px_#1E1E24] overflow-hidden"
          style={{
            backgroundColor: 'rgba(255, 255, 255, 0.78)',
            backdropFilter: 'blur(20px) saturate(150%)',
            WebkitBackdropFilter: 'blur(20px) saturate(150%)',
          }}
        >
          {/* Subtle Ambient Decorative Gradients */}
          <div className="absolute top-0 right-0 w-96 h-96 bg-gradient-to-br from-[#306998]/10 via-[#FFD43B]/10 to-transparent rounded-full blur-3xl pointer-events-none -mr-20 -mt-20" />

          <div className="relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            {/* Left Column: Course Logo, Title & Tagline */}
            <div className="lg:col-span-7 space-y-4">
              {/* Badge Row (Python version removed as requested) */}
              <div className="flex flex-wrap items-center gap-2">
                <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#306998] text-white border-2 border-[#1E1E24] shadow-[2px_2px_0px_#1E1E24] text-[11px] font-pixel">
                  <span>🐍 PYTHON</span>
                </div>
                <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-emerald-100 text-emerald-800 border border-emerald-300">
                  ● Beginner Friendly
                </span>
                <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-purple-100 text-purple-800 border border-purple-300">
                  ⚡ Project Based
                </span>
                <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-amber-100 text-amber-800 border border-amber-300">
                  ✨ AI Mentor
                </span>
              </div>

              {/* Course Title & Catchphrase */}
              <div className="space-y-1">
                <div className="flex items-center gap-3">
                  <h1 className="text-3xl sm:text-5xl font-serif font-black tracking-tight text-[#1E1E24]">
                    Python
                  </h1>
                  <span className="text-2xl sm:text-3xl font-black text-amber-500 animate-pulse">
                    ⋆˙⟡
                  </span>
                </div>
                <p className="text-base sm:text-xl font-serif font-bold text-[#6C5CE7]">
                  “Think in Logic. Build in Python.”
                </p>
              </div>

              {/* Description */}
              <p className="text-xs sm:text-sm font-bold text-[#4A4A58] leading-relaxed max-w-2xl">
                From the basics to real-world projects — learn Python by solving missions,
                writing code and building useful programs. Control autonomous rovers,
                craft calculations, and defeat dungeon bugs in real in-browser execution.
              </p>

              {/* Primary Call to Action Buttons */}
              <div className="pt-2 flex flex-wrap items-center gap-3">
                <Link
                  href="/courses/python/stage-1"
                  className="btn-arcade btn-arcade-gold px-6 py-3 text-xs sm:text-sm font-black flex items-center gap-2 cursor-pointer shadow-[3px_3px_0px_#1E1E24]"
                >
                  <Play className="w-4 h-4 fill-current" />
                  <span>Play Stage 1 Now →</span>
                </Link>
                <Link
                  href="/dungeon"
                  className="btn-arcade btn-arcade-purple px-5 py-3 text-xs sm:text-sm font-black flex items-center gap-2 cursor-pointer shadow-[3px_3px_0px_#1E1E24]"
                >
                  <span>⚔️ Enter Code Dungeon</span>
                </Link>
                <button
                  type="button"
                  onClick={() => setIsSyllabusModalOpen(true)}
                  className="btn-arcade btn-arcade-white px-4 py-3 text-xs font-bold flex items-center gap-1.5 cursor-pointer shadow-[3px_3px_0px_#1E1E24]"
                >
                  <BookOpen className="w-3.5 h-3.5 text-[#306998]" />
                  <span>Curriculum Syllabus</span>
                </button>
              </div>
            </div>

            {/* Right Column: Course Progress Panel (Relocated into Hero, Python version removed) */}
            <div className="lg:col-span-5 flex flex-col items-center justify-center w-full">
              <div
                className="p-5 sm:p-6 rounded-3xl border-3 border-[#1E1E24] shadow-[6px_6px_0px_#1E1E24] space-y-4 w-full"
                style={{
                  backgroundColor: 'rgba(250, 246, 238, 0.88)',
                  backdropFilter: 'blur(16px)',
                  WebkitBackdropFilter: 'blur(16px)',
                }}
              >
                {/* Header */}
                <div className="flex items-center justify-between pb-3 border-b-2 border-[#1E1E24]/10">
                  <div className="flex items-center gap-2.5">
                    <div className="w-8 h-8 rounded-xl bg-purple-100 border-2 border-[#1E1E24] flex items-center justify-center shadow-[1.5px_1.5px_0px_#1E1E24]">
                      <Flame className="w-4 h-4 text-[#6C5CE7] fill-current" />
                    </div>
                    <div>
                      <h3 className="font-serif font-black text-sm text-[#1E1E24]">
                        Course Progress
                      </h3>
                      <span className="text-[10px] font-bold text-gray-500 uppercase tracking-wider block">
                        Python Mastery Track
                      </span>
                    </div>
                  </div>

                  <span className="text-xs font-pixel font-bold px-2.5 py-1 rounded-md bg-white border-2 border-[#1E1E24] shadow-[1.5px_1.5px_0px_#1E1E24] text-[#1E1E24]">
                    {calculatedPercent}%
                  </span>
                </div>

                {/* Circular Progress Ring & Status */}
                <div className="flex items-center gap-4 py-1">
                  <div className="relative w-20 h-20 shrink-0 flex items-center justify-center">
                    <svg className="w-full h-full -rotate-90" viewBox="0 0 100 100">
                      <circle
                        cx="50"
                        cy="50"
                        r={ringRadius}
                        className="text-slate-200"
                        strokeWidth="9"
                        stroke="currentColor"
                        fill="transparent"
                      />
                      <circle
                        cx="50"
                        cy="50"
                        r={ringRadius}
                        className="text-[#6C5CE7] transition-all duration-700 ease-out"
                        strokeWidth="9"
                        strokeDasharray={ringCircumference}
                        strokeDashoffset={ringStrokeOffset}
                        strokeLinecap="round"
                        stroke="currentColor"
                        fill="transparent"
                      />
                    </svg>
                    <div className="absolute flex flex-col items-center justify-center text-center">
                      <span className="font-serif font-black text-base text-[#1E1E24] leading-none">
                        {calculatedPercent}%
                      </span>
                      <span className="text-[8px] font-bold text-gray-400 uppercase mt-0.5">
                        Done
                      </span>
                    </div>
                  </div>

                  {/* Encouraging message / Streak message */}
                  <div className="space-y-1 min-w-0 flex-1">
                    {calculatedPercent === 0 ? (
                      <p className="text-[11px] font-bold text-gray-600 leading-snug">
                        🚀 Complete your first quest to earn XP and fill your mastery ring!
                      </p>
                    ) : calculatedPercent >= 100 ? (
                      <p className="text-[11px] font-bold text-emerald-700 leading-snug">
                        🏆 Outstanding! You have mastered all active Python quests.
                      </p>
                    ) : (
                      <p className="text-[11px] font-bold text-[#6C5CE7] leading-snug">
                        🔥 Great momentum! Keep solving missions to unlock new ranks.
                      </p>
                    )}
                    <div className="flex items-center gap-2 text-[10px] font-mono text-gray-500 font-bold">
                      <span>Rank:</span>
                      <span className="text-[#1E1E24] font-black">
                        {currentUser?.rank || 'Sadhaka'}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Horizontal Progress Bar */}
                <div className="space-y-1">
                  <div className="w-full h-2.5 rounded-full bg-white border-2 border-[#1E1E24] overflow-hidden p-0.5">
                    <div
                      className="h-full rounded-full bg-gradient-to-r from-[#6C5CE7] via-[#A29BFE] to-[#FFD214] transition-all duration-500"
                      style={{ width: `${Math.max(4, calculatedPercent)}%` }}
                    />
                  </div>
                </div>

                {/* Detailed Breakdown Counters Grid */}
                <div className="grid grid-cols-3 gap-2 pt-1 border-t-2 border-[#1E1E24]/10 text-center">
                  <div className="p-2 rounded-xl bg-white border border-[#1E1E24]/20 shadow-[1px_1px_0px_#1E1E24]">
                    <span className="block text-[9px] font-bold text-gray-400 uppercase">
                      Lessons
                    </span>
                    <span className="font-mono text-xs font-black text-[#1E1E24]">
                      {completedLessonsCount}/{totalLessonsCount}
                    </span>
                  </div>
                  <div className="p-2 rounded-xl bg-white border border-[#1E1E24]/20 shadow-[1px_1px_0px_#1E1E24]">
                    <span className="block text-[9px] font-bold text-gray-400 uppercase">
                      Missions
                    </span>
                    <span className="font-mono text-xs font-black text-emerald-700">
                      {completedMissionsCount}/{totalMissionsCount}
                    </span>
                  </div>
                  <div className="p-2 rounded-xl bg-white border border-[#1E1E24]/20 shadow-[1px_1px_0px_#1E1E24]">
                    <span className="block text-[9px] font-bold text-gray-400 uppercase">
                      Projects
                    </span>
                    <span className="font-mono text-xs font-black text-[#6C5CE7]">
                      {completedProjectsCount}/{totalProjectsCount}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* =========================================================================
            B. CHOOSE YOUR PATH (4 Interactive Learning Paths)
           ========================================================================= */}
        <section className="space-y-5">
          <div className="flex items-center justify-between flex-wrap gap-2 border-b-2 border-[#1E1E24] pb-3">
            <div>
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#FFD214] text-[#1E1E24] text-xs font-black border-2 border-[#1E1E24] shadow-[2px_2px_0px_#1E1E24]">
                <Compass className="w-3.5 h-3.5" />
                <span>CHOOSE YOUR PATH</span>
              </div>
              <h2 className="text-2xl sm:text-3xl font-serif font-black text-[#1E1E24] mt-1.5">
                Choose Your Path
              </h2>
            </div>
            <p className="text-xs sm:text-sm font-bold text-gray-600 max-w-md">
              Progress through Python fundamentals, test your skills in interactive missions, build real software, and earn credentials as you advance.
            </p>
          </div>

          {/* 4 Cards Grid (Horizontal 4-column row on Desktop, Responsive 2-column on tablet, 1 on mobile) */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 items-stretch">
            {/* CARD 1: Learn Basics */}
            <div
              className="p-5 sm:p-6 rounded-3xl border-3 border-[#1E1E24] shadow-[6px_6px_0px_#1E1E24] hover:-translate-y-1 hover:shadow-[8px_8px_0px_#1E1E24] transition-all flex flex-col justify-between h-full group"
              style={{
                backgroundColor: 'rgba(255, 255, 255, 0.82)',
                backdropFilter: 'blur(16px)',
                WebkitBackdropFilter: 'blur(16px)',
              }}
            >
              <div className="space-y-3.5">
                <div className="flex items-center justify-between">
                  <span className="w-8 h-8 rounded-xl bg-[#E0F2FE] border-2 border-[#1E1E24] text-[#0284C7] font-pixel text-xs font-black flex items-center justify-center shadow-[1.5px_1.5px_0px_#1E1E24]">
                    01
                  </span>
                  <div className="w-9 h-9 rounded-xl bg-[#FAF6EE] border-2 border-[#1E1E24] flex items-center justify-center shadow-[2px_2px_0px_#1E1E24]">
                    <BookOpen className="w-4 h-4 text-[#306998]" />
                  </div>
                </div>

                <div className="space-y-1">
                  <h3 className="font-serif font-black text-lg text-[#1E1E24] group-hover:text-[#6C5CE7] transition-colors">
                    Learn Basics
                  </h3>
                  <span className="text-[10px] font-black uppercase text-[#0284C7] tracking-wider block">
                    Core Fundamentals
                  </span>
                </div>

                <p className="text-xs font-bold text-gray-600 leading-relaxed">
                  Master Python fundamentals from scratch. Learn syntax, variables, data types, if/else conditionals, loops, lists, and reusable functions.
                </p>
              </div>

              <div className="pt-4 mt-4 border-t-2 border-[#1E1E24]/10">
                <Link
                  href="/courses/python/stage-1"
                  className="btn-arcade btn-arcade-gold w-full py-2.5 text-xs font-black flex items-center justify-center gap-1.5 cursor-pointer shadow-[2px_2px_0px_#1E1E24]"
                >
                  <span>Start Learning</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            </div>

            {/* CARD 2: Play Missions */}
            <div
              className={`p-5 sm:p-6 rounded-3xl border-3 border-[#1E1E24] shadow-[6px_6px_0px_#1E1E24] transition-all flex flex-col justify-between h-full group ${
                isCard1Complete ? 'hover:-translate-y-1 hover:shadow-[8px_8px_0px_#1E1E24]' : 'opacity-85'
              }`}
              style={{
                backgroundColor: 'rgba(255, 255, 255, 0.82)',
                backdropFilter: 'blur(16px)',
                WebkitBackdropFilter: 'blur(16px)',
              }}
            >
              <div className="space-y-3.5">
                <div className="flex items-center justify-between">
                  <span className="w-8 h-8 rounded-xl bg-[#DCFCE7] border-2 border-[#1E1E24] text-emerald-800 font-pixel text-xs font-black flex items-center justify-center shadow-[1.5px_1.5px_0px_#1E1E24]">
                    02
                  </span>
                  <div className="flex items-center gap-2">
                    {!isCard1Complete && (
                      <span className="text-[10px] font-black uppercase text-slate-500 bg-slate-200/80 px-2 py-0.5 rounded-md border border-slate-300 flex items-center gap-1">
                        <Lock className="w-2.5 h-2.5" /> Locked
                      </span>
                    )}
                    <div className="w-9 h-9 rounded-xl bg-[#FAF6EE] border-2 border-[#1E1E24] flex items-center justify-center shadow-[2px_2px_0px_#1E1E24]">
                      <Gamepad2 className="w-4 h-4 text-emerald-600" />
                    </div>
                  </div>
                </div>

                <div className="space-y-1">
                  <h3 className="font-serif font-black text-lg text-[#1E1E24] group-hover:text-[#6C5CE7] transition-colors">
                    Play Missions
                  </h3>
                  <span className="text-[10px] font-black uppercase text-emerald-700 tracking-wider block">
                    Interactive Arenas
                  </span>
                </div>

                <p className="text-xs font-bold text-gray-600 leading-relaxed">
                  Solve coding puzzles, debug scripts, and program autonomous rover Arya in interactive 2D simulations. Defeat dungeon monsters with typed code.
                </p>
              </div>

              <div className="pt-4 mt-4 border-t-2 border-[#1E1E24]/10">
                {isCard1Complete ? (
                  <a
                    href="#featured-missions"
                    className="btn-arcade btn-arcade-white w-full py-2.5 text-xs font-black flex items-center justify-center gap-1.5 cursor-pointer shadow-[2px_2px_0px_#1E1E24]"
                  >
                    <span>Play Missions</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </a>
                ) : (
                  <button
                    disabled
                    type="button"
                    className="w-full py-2.5 px-3 rounded-xl bg-slate-100/90 border-2 border-slate-300 text-slate-500 text-xs font-bold flex items-center justify-center gap-1.5 cursor-not-allowed select-none shadow-[2px_2px_0px_#A0A0B0]"
                  >
                    <Lock className="w-3.5 h-3.5 shrink-0 text-slate-400" />
                    <span>Complete previous to unlock this level</span>
                  </button>
                )}
              </div>
            </div>

            {/* CARD 3: Build Projects */}
            <div
              className={`p-5 sm:p-6 rounded-3xl border-3 border-[#1E1E24] shadow-[6px_6px_0px_#1E1E24] transition-all flex flex-col justify-between h-full group ${
                isCard2Complete ? 'hover:-translate-y-1 hover:shadow-[8px_8px_0px_#1E1E24]' : 'opacity-85'
              }`}
              style={{
                backgroundColor: 'rgba(255, 255, 255, 0.82)',
                backdropFilter: 'blur(16px)',
                WebkitBackdropFilter: 'blur(16px)',
              }}
            >
              <div className="space-y-3.5">
                <div className="flex items-center justify-between">
                  <span className="w-8 h-8 rounded-xl bg-[#EDE9FE] border-2 border-[#1E1E24] text-[#6C5CE7] font-pixel text-xs font-black flex items-center justify-center shadow-[1.5px_1.5px_0px_#1E1E24]">
                    03
                  </span>
                  <div className="flex items-center gap-2">
                    {!isCard2Complete && (
                      <span className="text-[10px] font-black uppercase text-slate-500 bg-slate-200/80 px-2 py-0.5 rounded-md border border-slate-300 flex items-center gap-1">
                        <Lock className="w-2.5 h-2.5" /> Locked
                      </span>
                    )}
                    <div className="w-9 h-9 rounded-xl bg-[#FAF6EE] border-2 border-[#1E1E24] flex items-center justify-center shadow-[2px_2px_0px_#1E1E24]">
                      <Code2 className="w-4 h-4 text-[#6C5CE7]" />
                    </div>
                  </div>
                </div>

                <div className="space-y-1">
                  <h3 className="font-serif font-black text-lg text-[#1E1E24] group-hover:text-[#6C5CE7] transition-colors">
                    Build Projects
                  </h3>
                  <span className="text-[10px] font-black uppercase text-[#6C5CE7] tracking-wider block">
                    Portfolio Builders
                  </span>
                </div>

                <p className="text-xs font-bold text-gray-600 leading-relaxed">
                  Create practical, real-world Python applications to showcase in your developer portfolio. Build calculators, expense trackers, and RPG engines.
                </p>
              </div>

              <div className="pt-4 mt-4 border-t-2 border-[#1E1E24]/10">
                {isCard2Complete ? (
                  <button
                    type="button"
                    onClick={() => setIsProjectsModalOpen(true)}
                    className="btn-arcade btn-arcade-purple w-full py-2.5 text-xs font-black flex items-center justify-center gap-1.5 cursor-pointer shadow-[2px_2px_0px_#1E1E24]"
                  >
                    <span>Build Projects</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                ) : (
                  <button
                    disabled
                    type="button"
                    className="w-full py-2.5 px-3 rounded-xl bg-slate-100/90 border-2 border-slate-300 text-slate-500 text-xs font-bold flex items-center justify-center gap-1.5 cursor-not-allowed select-none shadow-[2px_2px_0px_#A0A0B0]"
                  >
                    <Lock className="w-3.5 h-3.5 shrink-0 text-slate-400" />
                    <span>Complete previous to unlock this level</span>
                  </button>
                )}
              </div>
            </div>

            {/* CARD 4: Get Certified */}
            <div
              className={`p-5 sm:p-6 rounded-3xl border-3 border-[#1E1E24] shadow-[6px_6px_0px_#1E1E24] flex flex-col justify-between h-full group ${
                isCard3Complete ? 'hover:-translate-y-1 hover:shadow-[8px_8px_0px_#1E1E24]' : 'opacity-85'
              }`}
              style={{
                backgroundColor: 'rgba(255, 255, 255, 0.75)',
                backdropFilter: 'blur(16px)',
                WebkitBackdropFilter: 'blur(16px)',
              }}
            >
              <div className="space-y-3.5">
                <div className="flex items-center justify-between">
                  <span className="w-8 h-8 rounded-xl bg-amber-100 border-2 border-[#1E1E24] text-amber-900 font-pixel text-xs font-black flex items-center justify-center shadow-[1.5px_1.5px_0px_#1E1E24]">
                    04
                  </span>
                  <div className="flex items-center gap-2">
                    {!isCard3Complete && (
                      <span className="text-[10px] font-black uppercase text-slate-500 bg-slate-200/80 px-2 py-0.5 rounded-md border border-slate-300 flex items-center gap-1">
                        <Lock className="w-2.5 h-2.5" /> Locked
                      </span>
                    )}
                    <div className="w-9 h-9 rounded-xl bg-[#FAF6EE] border-2 border-[#1E1E24] flex items-center justify-center shadow-[2px_2px_0px_#1E1E24]">
                      <Award className="w-4 h-4 text-amber-500" />
                    </div>
                  </div>
                </div>

                <div className="space-y-1">
                  <h3 className="font-serif font-black text-lg text-[#1E1E24]">
                    Get Certified
                  </h3>
                  <span className="text-[10px] font-black uppercase text-amber-700 tracking-wider block">
                    Accredited Seal
                  </span>
                </div>

                <p className="text-xs font-bold text-gray-600 leading-relaxed">
                  Complete the curriculum, pass the comprehensive Python mastery examination, and earn your verified Dronacharya Certificate.
                </p>
              </div>

              <div className="pt-4 mt-4 border-t-2 border-[#1E1E24]/10">
                {isCard3Complete ? (
                  <button
                    type="button"
                    className="btn-arcade btn-arcade-gold w-full py-2.5 text-xs font-black flex items-center justify-center gap-1.5 cursor-pointer shadow-[2px_2px_0px_#1E1E24]"
                  >
                    <span>Take Exam</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                ) : (
                  <button
                    disabled
                    type="button"
                    className="w-full py-2.5 px-3 rounded-xl bg-slate-100/90 border-2 border-slate-300 text-slate-500 text-xs font-bold flex items-center justify-center gap-1.5 cursor-not-allowed select-none shadow-[2px_2px_0px_#A0A0B0]"
                  >
                    <Lock className="w-3.5 h-3.5 shrink-0 text-slate-400" />
                    <span>Complete previous to unlock this level</span>
                  </button>
                )}
              </div>
            </div>
          </div>
        </section>

        {/* =========================================================================
            C. FEATURED PYTHON MISSIONS (Full Width Section)
           ========================================================================= */}
        <section id="featured-missions" className="space-y-5 scroll-mt-28">
          <div className="flex items-center justify-between flex-wrap gap-2 border-b-2 border-[#1E1E24] pb-3">
            <div>
              <h2 className="text-xl sm:text-2xl font-serif font-black text-[#1E1E24] flex items-center gap-2">
                <Target className="w-5 h-5 text-[#6C5CE7]" />
                <span>Featured Python Missions</span>
              </h2>
              <p className="text-xs font-bold text-gray-500 mt-0.5">
                Launch in-browser sandbox simulations with immediate assertion tests.
              </p>
            </div>

            <Link
              href="/simulator"
              className="text-xs font-black text-[#6C5CE7] hover:underline flex items-center gap-1 group"
            >
              <span>View All Missions</span>
              <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
            </Link>
          </div>

          {/* Mission Cards Grid (3 Columns full width) */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
            {FEATURED_MISSIONS.map((m) => {
              const Icon = m.icon;
              const isDone = completedMissionKeys.some(
                (k) => k === m.missionId || k.includes(m.id)
              );

              return (
                <div
                  key={m.id}
                  className="p-5 rounded-3xl border-3 border-[#1E1E24] shadow-[5px_5px_0px_#1E1E24] flex flex-col justify-between gap-4 hover:-translate-y-1 hover:shadow-[7px_7px_0px_#1E1E24] transition-all group"
                  style={{
                    backgroundColor: 'rgba(255, 255, 255, 0.82)',
                    backdropFilter: 'blur(16px)',
                    WebkitBackdropFilter: 'blur(16px)',
                  }}
                >
                  <div className="space-y-3">
                    {/* Top meta row */}
                    <div className="flex items-center justify-between gap-2">
                      <span
                        className={`px-2 py-0.5 rounded-md text-[10px] font-pixel border-2 border-[#1E1E24] ${
                          m.difficulty === 'Easy'
                            ? 'bg-emerald-100 text-emerald-800'
                            : 'bg-amber-100 text-amber-800'
                        }`}
                      >
                        {m.difficulty}
                      </span>

                      <div className="flex items-center gap-1 text-[11px] font-mono text-gray-500 font-bold">
                        <Clock className="w-3 h-3" />
                        <span>{m.estimatedTime}</span>
                      </div>
                    </div>

                    {/* Title and Icon */}
                    <div className="flex items-start gap-2.5">
                      <div className="w-8 h-8 rounded-xl bg-[#FAF6EE] border-2 border-[#1E1E24] flex items-center justify-center shrink-0 shadow-[1.5px_1.5px_0px_#1E1E24]">
                        <Icon className="w-4 h-4 text-[#306998]" />
                      </div>
                      <div>
                        <h3 className="font-serif font-black text-sm text-[#1E1E24] group-hover:text-[#6C5CE7] transition-colors leading-tight">
                          {m.title}
                        </h3>
                        <span className="text-[10px] font-mono text-gray-500 font-bold">
                          +{m.xpReward} XP
                        </span>
                      </div>
                    </div>

                    {/* Description */}
                    <p className="text-xs font-bold text-gray-600 line-clamp-3 leading-relaxed">
                      {m.description}
                    </p>
                  </div>

                  {/* Launch Button */}
                  <div className="pt-3 border-t-2 border-[#1E1E24]/10">
                    <Link
                      href={`/simulator?mission=${m.missionId}`}
                      className={`btn-arcade w-full py-2 text-xs font-black flex items-center justify-center gap-1.5 cursor-pointer shadow-[2px_2px_0px_#1E1E24] ${
                        isDone ? 'btn-arcade-white' : 'btn-arcade-gold'
                      }`}
                    >
                      {isDone ? (
                        <>
                          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                          <span>Replay Mission</span>
                        </>
                      ) : (
                        <>
                          <Play className="w-3.5 h-3.5 fill-current" />
                          <span>Launch Mission</span>
                        </>
                      )}
                    </Link>
                  </div>
                </div>
              );
            })}
          </div>
        </section>
      </div>

      {/* =========================================================================
          PROJECTS MODAL: VIEW PYTHON PROJECTS
         ========================================================================= */}
      {isProjectsModalOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-150"
          onClick={() => setIsProjectsModalOpen(false)}
        >
          <div
            className="relative w-full max-w-3xl bg-[#FAF6EE] rounded-3xl border-3 border-[#1E1E24] shadow-[8px_8px_0px_#1E1E24] p-6 sm:p-8 max-h-[85vh] overflow-y-auto text-[#1E1E24] space-y-6 animate-in zoom-in-95 duration-150"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div className="flex items-start justify-between pb-4 border-b-2 border-[#1E1E24]/20">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-2xl bg-[#EDE9FE] border-2 border-[#1E1E24] shadow-[2px_2px_0px_#1E1E24] flex items-center justify-center shrink-0">
                  <FolderCode className="w-6 h-6 text-[#6C5CE7]" />
                </div>
                <div>
                  <h3 className="font-serif font-black text-xl text-[#1E1E24]">
                    Python Portfolio Projects
                  </h3>
                  <p className="text-xs font-bold text-gray-500">
                    Real, working software applications to build and showcase in your developer folio.
                  </p>
                </div>
              </div>

              <button
                onClick={() => setIsProjectsModalOpen(false)}
                className="p-2 rounded-xl bg-white border-2 border-[#1E1E24] shadow-[2px_2px_0px_#1E1E24] hover:bg-rose-50 hover:text-rose-600 transition-all cursor-pointer shrink-0"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Projects List */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {PYTHON_PROJECTS.map((p) => (
                <div
                  key={p.id}
                  className="p-4 rounded-2xl bg-white border-2 border-[#1E1E24] shadow-[3px_3px_0px_#1E1E24] flex flex-col justify-between gap-4"
                >
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] font-pixel px-2 py-0.5 rounded bg-purple-50 text-[#6C5CE7] border border-purple-200">
                        {p.difficulty}
                      </span>
                      <span className="text-[10px] font-mono font-bold text-emerald-700">
                        +{p.xpReward} XP
                      </span>
                    </div>

                    <h4 className="font-serif font-black text-sm text-[#1E1E24] leading-tight">
                      {p.title}
                    </h4>
                    <p className="text-[11px] font-bold text-gray-500 leading-snug">
                      {p.subtitle}
                    </p>

                    <p className="text-xs font-bold text-gray-600 leading-relaxed pt-1">
                      {p.description}
                    </p>

                    {/* Concept pills */}
                    <div className="flex flex-wrap gap-1 pt-2">
                      {p.concepts.map((c) => (
                        <span
                          key={c}
                          className="text-[9px] font-mono px-1.5 py-0.5 rounded bg-slate-100 text-slate-700 font-bold border border-slate-200"
                        >
                          {c}
                        </span>
                      ))}
                    </div>
                  </div>

                  <div className="pt-3 border-t-2 border-[#1E1E24]/10">
                    <Link
                      href={`/simulator?mission=${p.starterMission}`}
                      onClick={() => setIsProjectsModalOpen(false)}
                      className="btn-arcade btn-arcade-gold w-full py-2 text-xs font-black flex items-center justify-center gap-1 shadow-[2px_2px_0px_#1E1E24]"
                    >
                      <span>Code Project</span>
                      <ArrowRight className="w-3 h-3" />
                    </Link>
                  </div>
                </div>
              ))}
            </div>

            <div className="pt-2 text-center text-xs font-bold text-gray-500">
              💡 Completed projects are automatically linked to your public Gurukul player folio.
            </div>
          </div>
        </div>
      )}

      {/* =========================================================================
          SYLLABUS MODAL: VIEW PYTHON CURRICULUM SYLLABUS
         ========================================================================= */}
      {isSyllabusModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-150">
          <div className="relative w-full max-w-3xl bg-[#FAF6EE] border-4 border-[#1E1E24] rounded-3xl p-6 sm:p-8 shadow-[10px_10px_0px_#1E1E24] max-h-[88vh] overflow-y-auto space-y-5 animate-in zoom-in-95 duration-150">
            {/* Header */}
            <div className="flex items-center justify-between border-b-2 border-[#1E1E24] pb-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl bg-[#306998] border-2 border-[#1E1E24] shadow-[2px_2px_0px_#1E1E24] flex items-center justify-center text-white font-bold">
                  <BookOpen className="w-5 h-5 text-white" />
                </div>
                <div>
                  <h3 className="font-serif font-black text-xl text-[#1E1E24]">
                    Python Curriculum Syllabus
                  </h3>
                  <p className="text-xs font-bold text-gray-500">
                    4 Chapters • 5 Interactive Quests • Rover Arya Simulator & Dungeon
                  </p>
                </div>
              </div>

              <button
                onClick={() => setIsSyllabusModalOpen(false)}
                className="p-2 rounded-xl bg-white border-2 border-[#1E1E24] shadow-[2px_2px_0px_#1E1E24] hover:bg-rose-50 hover:text-rose-600 transition-all cursor-pointer shrink-0"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Syllabus Chapters Accordion / Cards */}
            <div className="space-y-3.5">
              {pythonCourse.chapters.map((ch, idx) => (
                <div
                  key={ch.id}
                  className="p-4 rounded-2xl bg-white border-2 border-[#1E1E24] shadow-[3px_3px_0px_#1E1E24] space-y-3"
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-xl bg-[#6C5CE7] border-2 border-[#1E1E24] text-white flex items-center justify-center font-pixel text-xs font-bold shadow-[1.5px_1.5px_0px_#1E1E24]">
                        {idx + 1}
                      </div>
                      <div>
                        <span className="text-[9px] font-black uppercase text-[#6C5CE7] tracking-wider block">
                          Realm: {(ch as any).realm || 'Gurukul Territory'}
                        </span>
                        <h4 className="font-serif font-black text-sm text-[#1E1E24]">
                          {ch.title}
                        </h4>
                      </div>
                    </div>
                    <span className="text-[10px] font-mono font-bold text-gray-500 px-2 py-0.5 rounded bg-slate-100 border border-slate-200 shrink-0">
                      {ch.lessons.length} {ch.lessons.length === 1 ? 'Quest' : 'Quests'}
                    </span>
                  </div>

                  <p className="text-xs font-bold text-gray-600 leading-relaxed">
                    {ch.description}
                  </p>

                  <div className="pt-2 border-t border-[#1E1E24]/10 flex flex-wrap gap-2">
                    {ch.lessons.map((lesson) => {
                      const isDone = completedLessonIds.includes(lesson.id);
                      return (
                        <Link
                          key={lesson.id}
                          href="/courses/python/stage-1"
                          onClick={() => setIsSyllabusModalOpen(false)}
                          className={`text-xs font-bold px-3 py-1.5 rounded-xl border-2 flex items-center gap-1.5 transition-all ${
                            isDone
                              ? 'bg-emerald-50 text-emerald-800 border-emerald-600 shadow-[2px_2px_0px_#059669]'
                              : 'bg-[#FAF6EE] text-[#1E1E24] border-[#1E1E24] hover:bg-[#FFD214] shadow-[2px_2px_0px_#1E1E24]'
                          }`}
                        >
                          {isDone ? (
                            <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                          ) : (
                            <Play className="w-3 h-3 text-[#6C5CE7] fill-current" />
                          )}
                          <span>{lesson.title}</span>
                        </Link>
                      );
                    })}
                  </div>
                </div>
              ))}
            </div>

            {/* Bottom Actions */}
            <div className="pt-2 flex items-center justify-between flex-wrap gap-3 border-t-2 border-[#1E1E24]">
              <Link
                href="/paths"
                onClick={() => setIsSyllabusModalOpen(false)}
                className="text-xs font-black text-[#6C5CE7] hover:underline flex items-center gap-1"
              >
                <span>🗺️ Open Interactive Python World Map</span>
                <ArrowRight className="w-3 h-3" />
              </Link>
              <Link
                href="/courses/python/stage-1"
                onClick={() => setIsSyllabusModalOpen(false)}
                className="btn-arcade btn-arcade-gold px-4 py-2 text-xs font-black flex items-center gap-1.5 shadow-[2px_2px_0px_#1E1E24]"
              >
                <span>Start Stage 1 Quest</span>
                <ArrowRight className="w-3 h-3" />
              </Link>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
