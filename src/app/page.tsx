// Dronacharya — Gamified AI-Powered Coding Adventure
// CodeDex-inspired playful portal: Playable hero mini-game, 8-realm world map, gameplay loop & Supabase auth
'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import {
  getActiveSession,
  setActiveSession,
  authenticateUser,
  registerUser,
  createGuestSession,
  updateUserLearningSelection,
  RegisteredUser,
  AVAILABLE_CLASSES,
  AVAILABLE_SUBJECTS,
} from '@/lib/db/auth-db';
import { WorldMap } from '@/components/game/WorldMap';
import {
  Sparkles,
  Heart,
  Award,
  Flame,
  Play,
  Lock,
  CheckCircle2,
  AlertCircle,
  HelpCircle,
  BookOpen,
  ArrowRight,
  ChevronRight,
  RotateCcw,
  Code2,
  Mail,
  User,
  RefreshCw,
  X,
  GraduationCap,
  ChevronDown,
  Gamepad2,
  Terminal,
  Zap,
  Star,
  Target,
  Compass,
  Layers,
  ShieldCheck,
  Cpu,
} from 'lucide-react';
import confetti from 'canvas-confetti';

export default function HomePage() {
  const [currentUser, setCurrentUser] = useState<RegisteredUser | null>(null);
  const [isLoaded, setIsLoaded] = useState(false);

  // Authentication Modal State
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [authMode, setAuthMode] = useState<'signin' | 'signup'>('signup');
  const [signupStep, setSignupStep] = useState<1 | 2 | 3>(1);

  // Form Fields
  const [authEmail, setAuthEmail] = useState('');
  const [authPassword, setAuthPassword] = useState('');
  const [authName, setAuthName] = useState('');
  const [authClass, setAuthClass] = useState(AVAILABLE_CLASSES[1]); // Default Class 10
  const [authSubject, setAuthSubject] = useState(AVAILABLE_SUBJECTS[0].id); // Python Programming
  const [authError, setAuthError] = useState<string | null>(null);
  const [authSuccess, setAuthSuccess] = useState<string | null>(null);

  // Hero Playable Interactive Mini-Game State
  const [heroRoverPos, setHeroRoverPos] = useState({ x: 0, y: 0 });
  const [heroBattery, setHeroBattery] = useState(80);
  const [heroBatteryCollected, setHeroBatteryCollected] = useState(false);
  const [heroWon, setHeroWon] = useState(false);
  const [heroConsoleMsg, setHeroConsoleMsg] = useState('Type or click commands below to test real rover propulsion.');

  // Synchronize active session on mount & on custom event
  useEffect(() => {
    const syncUser = () => {
      const session = getActiveSession();
      setCurrentUser(session);
    };
    syncUser();
    window.addEventListener('dronacharya_session_change', syncUser);
    window.addEventListener('storage', syncUser);
    setIsLoaded(true);

    return () => {
      window.removeEventListener('dronacharya_session_change', syncUser);
      window.removeEventListener('storage', syncUser);
    };
  }, []);

  // Handle Hero Mini-Game Movement Commands
  const handleHeroCommand = (cmd: 'RIGHT' | 'DOWN' | 'COLLECT' | 'RESET') => {
    if (cmd === 'RESET') {
      setHeroRoverPos({ x: 0, y: 0 });
      setHeroBattery(80);
      setHeroBatteryCollected(false);
      setHeroWon(false);
      setHeroConsoleMsg('Rover reset to launch pad (0, 0).');
      return;
    }

    if (cmd === 'COLLECT') {
      if (heroRoverPos.x === 2 && heroRoverPos.y === 0 && !heroBatteryCollected) {
        setHeroBatteryCollected(true);
        setHeroBattery((b) => Math.min(100, b + 25));
        setHeroConsoleMsg('⚡ robot.collect() -> Energized! +25% battery added.');
      } else {
        setHeroConsoleMsg('robot.collect() -> No battery cell at this tile.');
      }
      return;
    }

    let nextX = heroRoverPos.x;
    let nextY = heroRoverPos.y;

    if (cmd === 'RIGHT') nextX = Math.min(3, nextX + 1);
    if (cmd === 'DOWN') nextY = Math.min(3, nextY + 1);

    const newBat = Math.max(0, heroBattery - 10);
    setHeroBattery(newBat);
    setHeroRoverPos({ x: nextX, y: nextY });
    setHeroConsoleMsg(`robot.move("${cmd}") -> New tile (${nextX}, ${nextY}) | Battery: ${newBat}%`);

    if (nextX === 3 && nextY === 3) {
      setHeroWon(true);
      setHeroConsoleMsg('🎉 Extraction Beacon reached! Mission Complete!');
      try {
        confetti({ particleCount: 50, spread: 60, origin: { y: 0.5 } });
      } catch (e) {}
    }
  };

  // Handle Sign In (Supabase with trimmed email & cookies)
  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    setAuthError(null);
    setAuthSuccess(null);

    const cleanEmail = authEmail.trim();
    setAuthEmail(cleanEmail);

    const res = await authenticateUser({
      email: cleanEmail,
      password: authPassword,
    });

    if (res.success && res.user) {
      setAuthSuccess(`Welcome back, ${res.user.name}! Entering your learning arena...`);
      setActiveSession(res.user, res.session);
      window.dispatchEvent(new Event('dronacharya_session_change'));
      window.dispatchEvent(new Event('storage'));
      setTimeout(() => {
        setCurrentUser(res.user!);
        setIsAuthModalOpen(false);
      }, 300);
    } else {
      setAuthError(res.error || 'Authentication failed. Please verify credentials.');
    }
  };

  // Step 1 Validation -> Proceed to Step 2
  const handleProceedToStep2 = (e: React.FormEvent) => {
    e.preventDefault();
    setAuthError(null);
    if (!authName.trim()) {
      setAuthError('Please enter your full name.');
      return;
    }
    const cleanEmail = authEmail.trim();
    setAuthEmail(cleanEmail);
    if (!cleanEmail || !cleanEmail.includes('@')) {
      setAuthError('Please enter a valid email address.');
      return;
    }
    if (authPassword.length < 6) {
      setAuthError('Password must be at least 6 characters long.');
      return;
    }
    setSignupStep(2);
  };

  // Step 2 Validation -> Proceed to Step 3
  const handleProceedToStep3 = () => {
    setAuthError(null);
    if (!authClass) {
      setAuthError('Please select your class standard.');
      return;
    }
    setSignupStep(3);
  };

  // Step 3 Completion -> Register in Supabase Database
  const handleFinalSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    setAuthError(null);
    setAuthSuccess(null);

    const cleanEmail = authEmail.trim();
    setAuthEmail(cleanEmail);

    const res = await registerUser({
      name: authName.trim(),
      email: cleanEmail,
      password: authPassword,
      studentClass: authClass,
      targetSubject: authSubject,
    });

    if (res.success && res.user) {
      setAuthSuccess(`Welcome, ${res.user.name}! Your game arena is ready.`);
      setActiveSession(res.user, res.session);
      window.dispatchEvent(new Event('dronacharya_session_change'));
      window.dispatchEvent(new Event('storage'));
      setTimeout(() => {
        setCurrentUser(res.user!);
        setIsAuthModalOpen(false);
      }, 300);
    } else {
      setAuthError(res.error || 'Registration failed.');
    }
  };

  const handleInstantGuestLaunch = () => {
    const guestUser = createGuestSession(authSubject, authClass);
    setCurrentUser(guestUser);
    setIsAuthModalOpen(false);
    window.dispatchEvent(new Event('dronacharya_session_change'));
    window.dispatchEvent(new Event('storage'));
  };

  return (
    <div className="w-full flex flex-col items-center">
      {/* =========================================================================
          1. CODEDEX-INSPIRED HERO: "Don't Just Learn to Code. Play Your Way Through It."
         ========================================================================= */}
      <section className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 pb-16">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
          {/* Left Column: Bold Copy & Actions */}
          <div className="lg:col-span-7 space-y-6">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#EDE9FE] border-2 border-[#1E1E24] shadow-[2px_2px_0px_#1E1E24]">
              <Sparkles className="w-4 h-4 text-[#6C5CE7]" />
              <span className="text-xs font-black uppercase tracking-wider text-[#6C5CE7]">
                Gamified Programming Adventure
              </span>
            </div>

            <h1 className="font-serif font-black text-4xl sm:text-5xl lg:text-6xl text-[#1E1E24] leading-[1.08] tracking-tight">
              Don't Just Learn to Code.{' '}
              <span className="inline-block bg-[#FBBF24] px-2 py-0.5 rounded-xl border-3 border-[#1E1E24] shadow-[4px_4px_0px_#1E1E24] transform -rotate-1">
                Play Your Way
              </span>{' '}
              Through It.
            </h1>

            <p className="text-sm sm:text-base text-[#4A4A58] max-w-xl font-medium leading-relaxed">
              Explore 8 vibrant programming worlds, write real Python code to command robots and defeat challenges, and learn from every mistake with your Socratic AI mentor.
            </p>

            {/* CTAs */}
            <div className="flex flex-wrap items-center gap-3 pt-2">
              {currentUser ? (
                <Link
                  href="/simulator?mission=mission-rescue-robot"
                  className="btn-game-purple text-sm py-3.5 px-8 shadow-[4px_4px_0px_#1E1E24]"
                >
                  <Gamepad2 className="w-5 h-5 fill-white" />
                  <span>Resume Quest ({currentUser.name})</span>
                  <ArrowRight className="w-4 h-4" />
                </Link>
              ) : (
                <button
                  onClick={() => {
                    setAuthMode('signup');
                    setSignupStep(1);
                    setIsAuthModalOpen(true);
                  }}
                  className="btn-game-purple text-sm py-3.5 px-8 shadow-[4px_4px_0px_#1E1E24]"
                >
                  <Sparkles className="w-5 h-5 text-[#FBBF24]" />
                  <span>Start Your Adventure</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              )}

              <Link
                href="/paths"
                className="btn-game-white text-sm py-3.5 px-6 shadow-[4px_4px_0px_#1E1E24]"
              >
                <Compass className="w-4 h-4 text-[#6C5CE7]" />
                <span>Explore Worlds</span>
              </Link>
            </div>

            {/* Quick Badges */}
            <div className="flex flex-wrap items-center gap-4 pt-2 text-xs font-bold text-[#4A4A58]">
              <div className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full bg-[#10B981]" />
                <span>Real Python Code Execution</span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full bg-[#6C5CE7]" />
                <span>Bug-to-Battle Diagnostics</span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full bg-[#F59E0B]" />
                <span>Verifiable Mastery Seals</span>
              </div>
            </div>
          </div>

          {/* Right Column: Interactive Playable Mini-Game Hero Widget */}
          <div className="lg:col-span-5">
            <div className="card-game p-5 bg-white shadow-[6px_6px_0px_#1E1E24]">
              {/* Widget Header */}
              <div className="flex items-center justify-between pb-3 mb-3 border-b-2 border-[#1E1E24]/15">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-[#10B981] animate-ping" />
                  <span className="font-serif font-black text-xs text-[#1E1E24]">
                    Interactive Mission Preview: Rover Arya
                  </span>
                </div>
                <span className="text-[10px] font-black uppercase tracking-wider px-2 py-0.5 rounded bg-[#FEF3C7] border border-[#1E1E24] text-[#D97706]">
                  Live Sandbox
                </span>
              </div>

              {/* 4x4 Mini Grid Arena */}
              <div className="relative aspect-square max-w-[280px] mx-auto border-3 border-[#1E1E24] rounded-2xl bg-[#FAF6EE] shadow-[3px_3px_0px_#1E1E24] p-2 mb-4">
                <div className="grid grid-cols-4 grid-rows-4 w-full h-full gap-1">
                  {Array.from({ length: 4 }).map((_, r) =>
                    Array.from({ length: 4 }).map((_, c) => {
                      const isRover = heroRoverPos.x === c && heroRoverPos.y === r;
                      const isBattery = c === 2 && r === 0 && !heroBatteryCollected;
                      const isTarget = c === 3 && r === 3;
                      const isObstacle = (c === 1 && r === 1) || (c === 2 && r === 2);

                      return (
                        <div
                          key={`${r}-${c}`}
                          className={`relative rounded-lg border border-[#1E1E24]/20 flex items-center justify-center ${
                            isTarget
                              ? 'bg-[#CCFBF1] border-2 border-[#14B8A6]'
                              : isObstacle
                              ? 'bg-[#FEE2E2] border-2 border-[#EF4444]'
                              : (r + c) % 2 === 0
                              ? 'bg-white'
                              : 'bg-[#F2ECE0]'
                          }`}
                        >
                          <span className="absolute top-0.5 left-1 text-[7px] text-[#7E7E8F]/40 font-bold">
                            {c},{r}
                          </span>

                          {isObstacle && !isRover && (
                            <span className="text-xs">🪨</span>
                          )}

                          {isBattery && !isRover && (
                            <Zap className="w-3.5 h-3.5 text-[#F59E0B] fill-[#F59E0B] animate-bounce" />
                          )}

                          {isTarget && !isRover && (
                            <span className="text-xs font-black">🏁</span>
                          )}

                          {isRover && (
                            <div className="w-6 h-6 rounded-md bg-[#6C5CE7] border border-[#1E1E24] flex items-center justify-center text-white text-[10px] font-black shadow-[1.5px_1.5px_0px_#1E1E24]">
                              🤖
                            </div>
                          )}
                        </div>
                      );
                    })
                  )}
                </div>
              </div>

              {/* Console Output Strip */}
              <div className="bg-[#1E1E24] border-2 border-[#1E1E24] rounded-xl p-2.5 mb-3 text-[11px] font-mono text-[#A29BFE] truncate">
                {heroConsoleMsg}
              </div>

              {/* Code Command Buttons */}
              <div className="grid grid-cols-4 gap-1.5 mb-3">
                <button
                  onClick={() => handleHeroCommand('RIGHT')}
                  className="btn-game-white text-[11px] py-1.5 font-mono"
                  title="robot.move_right()"
                >
                  .move_right()
                </button>
                <button
                  onClick={() => handleHeroCommand('DOWN')}
                  className="btn-game-white text-[11px] py-1.5 font-mono"
                  title="robot.move_down()"
                >
                  .move_down()
                </button>
                <button
                  onClick={() => handleHeroCommand('COLLECT')}
                  className="btn-game-yellow text-[11px] py-1.5 font-mono"
                  title="robot.collect()"
                >
                  .collect()
                </button>
                <button
                  onClick={() => handleHeroCommand('RESET')}
                  className="btn-game-coral text-[11px] py-1.5 font-mono"
                  title="Reset Simulation"
                >
                  .reset()
                </button>
              </div>

              {/* Enter Full Simulator CTA */}
              <Link
                href="/simulator?mission=mission-rescue-robot"
                className="btn-game-purple w-full py-2.5 text-xs text-center shadow-[3px_3px_0px_#1E1E24]"
              >
                <span>Launch Full 6x6 Coding Simulator</span>
                <ChevronRight className="w-4 h-4" />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* =========================================================================
          2. THE 6-STEP GAMEPLAY LOOP (Section 1)
         ========================================================================= */}
      <section className="w-full bg-white border-y-2 border-[#1E1E24] py-14 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center max-w-2xl mx-auto mb-12">
            <span className="text-xs font-black uppercase tracking-wider text-[#6C5CE7] bg-[#EDE9FE] px-3 py-1 rounded-full border border-[#1E1E24] shadow-[1.5px_1.5px_0px_#1E1E24]">
              The Core Gameplay Loop
            </span>
            <h2 className="font-serif font-black text-3xl sm:text-4xl text-[#1E1E24] mt-3">
              How You Master Programming
            </h2>
            <p className="text-xs sm:text-sm text-[#4A4A58] mt-2 font-medium">
              Every quest is an active coding experiment. No boring multiple-choice questions. Real code directly controls game outcomes.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-6 gap-4">
            {[
              { step: '01', title: 'Explore', desc: 'Journey across 8 connected programming realms on the World Map.', color: '#10B981', bg: '#D1FAE5' },
              { step: '02', title: 'Accept Quest', desc: 'Receive real mission briefs, story directives, and constraints.', color: '#3B82F6', bg: '#DBEAFE' },
              { step: '03', title: 'Write Code', desc: 'Author real Python programs in the integrated studio.', color: '#6C5CE7', bg: '#EDE9FE' },
              { step: '04', title: 'Run Arena', desc: 'Watch your code navigate rovers and inspect bio-cells.', color: '#F59E0B', bg: '#FEF3C7' },
              { step: '05', title: 'Battle Bugs', desc: 'Analyze observable failures with progressive Socratic hints.', color: '#EF4444', bg: '#FEE2E2' },
              { step: '06', title: 'Master & Mint', desc: 'Solve follow-up battle challenges to earn verifiable Mastery Seals.', color: '#8B5CF6', bg: '#F3E8FF' },
            ].map((s, i) => (
              <div
                key={i}
                className="card-game p-4 flex flex-col justify-between hover:translate-y-[-2px] transition-all"
                style={{ backgroundColor: '#FAF6EE' }}
              >
                <div>
                  <span
                    className="text-xs font-black px-2 py-0.5 rounded-md border border-[#1E1E24] inline-block mb-3"
                    style={{ backgroundColor: s.bg, color: s.color }}
                  >
                    STEP {s.step}
                  </span>
                  <h3 className="font-serif font-black text-lg text-[#1E1E24] mb-1">
                    {s.title}
                  </h3>
                  <p className="text-xs text-[#4A4A58] leading-relaxed">
                    {s.desc}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* =========================================================================
          3. INTERACTIVE WORLD MAP SHOWCASE (Section 3)
         ========================================================================= */}
      <section className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <WorldMap />
      </section>

      {/* =========================================================================
          4. FEATURED CODING MISSIONS (Section 4)
         ========================================================================= */}
      <section className="w-full bg-[#F2ECE0] border-t-2 border-[#1E1E24] py-14 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-10">
            <div>
              <span className="text-xs font-black uppercase tracking-wider text-[#D97706] bg-[#FEF3C7] px-3 py-1 rounded-full border border-[#1E1E24] shadow-[1.5px_1.5px_0px_#1E1E24]">
                Featured Quests
              </span>
              <h2 className="font-serif font-black text-3xl sm:text-4xl text-[#1E1E24] mt-2">
                Playable Missions
              </h2>
              <p className="text-xs sm:text-sm text-[#4A4A58] mt-1 font-medium">
                Jump directly into our playable 2D coding simulators.
              </p>
            </div>

            <Link
              href="/simulator"
              className="btn-game-purple text-xs py-2.5 px-5 shadow-[3px_3px_0px_#1E1E24]"
            >
              <span>View All Missions</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Mission Card 1: Robot Rescue */}
            <div className="card-game p-6 bg-white flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between mb-3">
                  <span className="text-xs font-black text-[#6C5CE7] bg-[#EDE9FE] px-2.5 py-0.5 rounded-full border border-[#1E1E24]">
                    Stage 3 • Loop Lab
                  </span>
                  <span className="text-xs font-black text-[#D97706] bg-[#FEF3C7] px-2 py-0.5 rounded border border-[#1E1E24]">
                    +150 XP
                  </span>
                </div>

                <h3 className="font-serif font-black text-xl text-[#1E1E24] mb-2">
                  Rescue the Robot: Facility Navigation
                </h3>
                <p className="text-xs text-[#4A4A58] leading-relaxed mb-4">
                  A research facility has locked down! Program exploration rover Arya through a 6x6 grid using loops, battery pickups, and obstacle evasion to reach the emergency extraction beacon.
                </p>

                <div className="p-3 rounded-xl bg-[#FAF6EE] border-2 border-[#1E1E24] mb-4 text-xs font-mono text-[#6C5CE7]">
                  for step in range(3):<br />
                  &nbsp;&nbsp;&nbsp;&nbsp;robot.move_right()<br />
                  robot.collect()
                </div>
              </div>

              <Link
                href="/simulator?mission=mission-rescue-robot"
                className="btn-game-purple text-xs py-2.5 px-5 w-full text-center shadow-[3px_3px_0px_#1E1E24]"
              >
                <span>Launch Mission 1 Simulator</span>
                <ChevronRight className="w-4 h-4" />
              </Link>
            </div>

            {/* Mission Card 2: Hazard Filter */}
            <div className="card-game p-6 bg-white flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between mb-3">
                  <span className="text-xs font-black text-[#F59E0B] bg-[#FEF3C7] px-2.5 py-0.5 rounded-full border border-[#1E1E24]">
                    Stage 4 • Decision Forest
                  </span>
                  <span className="text-xs font-black text-[#D97706] bg-[#FEF3C7] px-2 py-0.5 rounded border border-[#1E1E24]">
                    +150 XP
                  </span>
                </div>

                <h3 className="font-serif font-black text-xl text-[#1E1E24] mb-2">
                  Filter Damaged Cells: Hazard Decontamination
                </h3>
                <p className="text-xs text-[#4A4A58] leading-relaxed mb-4">
                  Radiation has infected biological data cells! Write loops and conditionals to scan incoming cells, routing healthy specimens into the matrix vault while purging negative hazards.
                </p>

                <div className="p-3 rounded-xl bg-[#FAF6EE] border-2 border-[#1E1E24] mb-4 text-xs font-mono text-[#F59E0B]">
                  for cell in data_cells:<br />
                  &nbsp;&nbsp;&nbsp;&nbsp;if cell &gt; 0:<br />
                  &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;clean_vault.append(cell)
                </div>
              </div>

              <Link
                href="/simulator?mission=mission-hazard-filter"
                className="btn-game-yellow text-xs py-2.5 px-5 w-full text-center shadow-[3px_3px_0px_#1E1E24]"
              >
                <span>Launch Mission 2 Simulator</span>
                <ChevronRight className="w-4 h-4" />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* =========================================================================
          5. AUTHENTICATION MODAL (Supabase with trim & session cookies)
         ========================================================================= */}
      {isAuthModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#1E1E24]/60 backdrop-blur-xs">
          <div className="relative w-full max-w-lg bg-white border-3 border-[#1E1E24] rounded-2xl shadow-[6px_6px_0px_#1E1E24] p-6 sm:p-8 animate-in zoom-in-95">
            <button
              onClick={() => setIsAuthModalOpen(false)}
              className="absolute top-4 right-4 p-1.5 rounded-lg border-2 border-[#1E1E24] bg-[#F2ECE0] text-[#1E1E24] hover:bg-[#FEE2E2]"
            >
              <X className="w-4 h-4" />
            </button>

            {/* Header */}
            <div className="text-center mb-6">
              <div className="w-12 h-12 rounded-xl bg-[#6C5CE7] text-white flex items-center justify-center font-serif text-2xl font-bold border-2 border-[#1E1E24] shadow-[3px_3px_0px_#1E1E24] mx-auto mb-3">
                द्रो
              </div>
              <h2 className="font-serif font-black text-2xl text-[#1E1E24]">
                {authMode === 'signin' ? 'Sign In to Your Adventure' : 'Join Dronacharya AI'}
              </h2>
              <p className="text-xs text-[#4A4A58] mt-1">
                {authMode === 'signin'
                  ? 'Enter credentials to load your saved progress & character state.'
                  : 'Complete 3 quick steps to tailor your interactive gaming curriculum.'}
              </p>
            </div>

            {/* Quick Guest Demo Option */}
            <div className="mb-4 p-3 rounded-xl bg-[#FBBF24]/20 border-2 border-[#1E1E24] shadow-[2px_2px_0px_#1E1E24] flex items-center justify-between gap-2">
              <div>
                <div className="font-black text-xs text-[#1E1E24] flex items-center gap-1">
                  <span>No login required?</span>
                  <span className="text-[10px] bg-[#10B981] text-white px-1.5 py-0.2 rounded font-black">Free</span>
                </div>
                <div className="text-[11px] text-[#4A4A58] font-medium">Play as Guest Demo directly.</div>
              </div>
              <button
                type="button"
                onClick={handleInstantGuestLaunch}
                className="btn-game-yellow py-1.5 px-3.5 text-xs font-black shadow-[2px_2px_0px_#1E1E24] flex items-center gap-1 shrink-0"
              >
                <Gamepad2 className="w-3.5 h-3.5" />
                <span>Play as Guest</span>
              </button>
            </div>

            {/* Tabs */}
            <div className="flex border-b-2 border-[#1E1E24] mb-6">
              <button
                type="button"
                onClick={() => {
                  setAuthMode('signin');
                  setAuthError(null);
                }}
                className={`flex-1 py-2 text-xs font-black border-b-2 transition-all cursor-pointer ${
                  authMode === 'signin'
                    ? 'border-[#6C5CE7] text-[#6C5CE7]'
                    : 'border-transparent text-[#7E7E8F]'
                }`}
              >
                Sign In
              </button>
              <button
                type="button"
                onClick={() => {
                  setAuthMode('signup');
                  setSignupStep(1);
                  setAuthError(null);
                }}
                className={`flex-1 py-2 text-xs font-black border-b-2 transition-all cursor-pointer ${
                  authMode === 'signup'
                    ? 'border-[#6C5CE7] text-[#6C5CE7]'
                    : 'border-transparent text-[#7E7E8F]'
                }`}
              >
                New Apprentice (Step-by-Step)
              </button>
            </div>

            {/* Feedback Alerts */}
            {authError && (
              <div className="mb-4 p-3 rounded-xl bg-[#FEE2E2] border-2 border-[#EF4444] text-xs text-[#DC2626] font-bold flex items-start gap-2">
                <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
                <span>{authError}</span>
              </div>
            )}

            {authSuccess && (
              <div className="mb-4 p-3 rounded-xl bg-[#D1FAE5] border-2 border-[#10B981] text-xs text-[#059669] font-bold flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 shrink-0" />
                <span>{authSuccess}</span>
              </div>
            )}

            {/* SIGN IN FORM */}
            {authMode === 'signin' ? (
              <form onSubmit={handleSignIn} className="space-y-4 text-xs">
                <div>
                  <label className="block font-bold text-[#1E1E24] mb-1">Email Address</label>
                  <div className="relative">
                    <Mail className="w-4 h-4 text-[#7E7E8F] absolute left-3 top-2.5" />
                    <input
                      type="email"
                      required
                      value={authEmail}
                      onChange={(e) => setAuthEmail(e.target.value)}
                      onBlur={() => setAuthEmail((e) => e.trim())}
                      placeholder="student@learning.edu"
                      className="w-full pl-9 pr-3 py-2 border-2 border-[#1E1E24] rounded-xl bg-[#FAF6EE] focus:bg-white focus:outline-none"
                    />
                  </div>
                </div>

                <div>
                  <label className="block font-bold text-[#1E1E24] mb-1">Password</label>
                  <div className="relative">
                    <Lock className="w-4 h-4 text-[#7E7E8F] absolute left-3 top-2.5" />
                    <input
                      type="password"
                      required
                      value={authPassword}
                      onChange={(e) => setAuthPassword(e.target.value)}
                      placeholder="Enter your database password"
                      className="w-full pl-9 pr-3 py-2 border-2 border-[#1E1E24] rounded-xl bg-[#FAF6EE] focus:bg-white focus:outline-none"
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  className="btn-game-purple w-full py-2.5 text-xs shadow-[3px_3px_0px_#1E1E24] mt-2"
                >
                  <span>Verify Credentials &amp; Enter Arena</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </form>
            ) : (
              /* STEP-BY-STEP SIGN UP WIZARD */
              <div>
                {/* Step Indicators */}
                <div className="flex items-center justify-between mb-5 px-4 text-xs font-black">
                  <div className={`flex items-center gap-1.5 ${signupStep >= 1 ? 'text-[#6C5CE7]' : 'text-[#7E7E8F]'}`}>
                    <span className="w-5 h-5 rounded-full bg-[#EDE9FE] border border-[#1E1E24] flex items-center justify-center text-[10px]">1</span>
                    <span>Account</span>
                  </div>
                  <div className="w-8 h-0.5 bg-[#1E1E24]/20" />
                  <div className={`flex items-center gap-1.5 ${signupStep >= 2 ? 'text-[#6C5CE7]' : 'text-[#7E7E8F]'}`}>
                    <span className="w-5 h-5 rounded-full bg-[#EDE9FE] border border-[#1E1E24] flex items-center justify-center text-[10px]">2</span>
                    <span>Class</span>
                  </div>
                  <div className="w-8 h-0.5 bg-[#1E1E24]/20" />
                  <div className={`flex items-center gap-1.5 ${signupStep >= 3 ? 'text-[#6C5CE7]' : 'text-[#7E7E8F]'}`}>
                    <span className="w-5 h-5 rounded-full bg-[#EDE9FE] border border-[#1E1E24] flex items-center justify-center text-[10px]">3</span>
                    <span>Language</span>
                  </div>
                </div>

                {/* Step 1: Account Info */}
                {signupStep === 1 && (
                  <form onSubmit={handleProceedToStep2} className="space-y-4 text-xs">
                    <div>
                      <label className="block font-bold text-[#1E1E24] mb-1">Full Name</label>
                      <input
                        type="text"
                        required
                        value={authName}
                        onChange={(e) => setAuthName(e.target.value)}
                        placeholder="e.g. Arjun Sharma"
                        className="w-full px-3 py-2 border-2 border-[#1E1E24] rounded-xl bg-[#FAF6EE] focus:bg-white focus:outline-none"
                      />
                    </div>
                    <div>
                      <label className="block font-bold text-[#1E1E24] mb-1">Email Address</label>
                      <input
                        type="email"
                        required
                        value={authEmail}
                        onChange={(e) => setAuthEmail(e.target.value)}
                        onBlur={() => setAuthEmail((e) => e.trim())}
                        placeholder="arjun@gurukul.edu"
                        className="w-full px-3 py-2 border-2 border-[#1E1E24] rounded-xl bg-[#FAF6EE] focus:bg-white focus:outline-none"
                      />
                    </div>
                    <div>
                      <label className="block font-bold text-[#1E1E24] mb-1">Create Password (min 6 chars)</label>
                      <input
                        type="password"
                        required
                        value={authPassword}
                        onChange={(e) => setAuthPassword(e.target.value)}
                        placeholder="Password"
                        className="w-full px-3 py-2 border-2 border-[#1E1E24] rounded-xl bg-[#FAF6EE] focus:bg-white focus:outline-none"
                      />
                    </div>
                    <button type="submit" className="btn-game-purple w-full py-2.5 text-xs shadow-[3px_3px_0px_#1E1E24]">
                      <span>Next: Select Class Standard</span>
                      <ArrowRight className="w-4 h-4" />
                    </button>
                  </form>
                )}

                {/* Step 2: Class Standard Selection */}
                {signupStep === 2 && (
                  <div className="space-y-4 text-xs">
                    <label className="block font-bold text-[#1E1E24]">Select Your Current Level / Standard:</label>
                    <div className="space-y-2">
                      {AVAILABLE_CLASSES.map((c) => (
                        <div
                          key={c}
                          onClick={() => setAuthClass(c)}
                          className={`p-3 rounded-xl border-2 border-[#1E1E24] cursor-pointer transition-all flex items-center justify-between ${
                            authClass === c ? 'bg-[#FBBF24] shadow-[2px_2px_0px_#1E1E24] font-black' : 'bg-white hover:bg-[#F2ECE0]'
                          }`}
                        >
                          <span>{c}</span>
                          {authClass === c && <CheckCircle2 className="w-4 h-4 text-[#1E1E24]" />}
                        </div>
                      ))}
                    </div>
                    <div className="flex gap-2 pt-2">
                      <button onClick={() => setSignupStep(1)} className="btn-game-white py-2 px-4 text-xs">Back</button>
                      <button onClick={handleProceedToStep3} className="btn-game-purple flex-1 py-2 text-xs">Next: Choose Language</button>
                    </div>
                  </div>
                )}

                {/* Step 3: Programming Language */}
                {signupStep === 3 && (
                  <div className="space-y-4 text-xs">
                    <label className="block font-bold text-[#1E1E24]">Select Starting Language / Realm:</label>
                    <div className="space-y-2">
                      {AVAILABLE_SUBJECTS.map((s) => (
                        <div
                          key={s.id}
                          onClick={() => setAuthSubject(s.id)}
                          className={`p-3 rounded-xl border-2 border-[#1E1E24] cursor-pointer transition-all flex items-center justify-between ${
                            authSubject === s.id ? 'bg-[#EDE9FE] border-[#6C5CE7] shadow-[2px_2px_0px_#1E1E24] font-black' : 'bg-white hover:bg-[#F2ECE0]'
                          }`}
                        >
                          <div>
                            <span className="block font-bold text-[#1E1E24]">{s.name}</span>
                            <span className="text-[11px] text-[#7E7E8F]">{s.tagline}</span>
                          </div>
                          {authSubject === s.id && <CheckCircle2 className="w-4 h-4 text-[#6C5CE7]" />}
                        </div>
                      ))}
                    </div>
                    <div className="flex gap-2 pt-2">
                      <button onClick={() => setSignupStep(2)} className="btn-game-white py-2 px-4 text-xs">Back</button>
                      <button onClick={handleFinalSignUp} className="btn-game-yellow flex-1 py-2.5 text-xs font-black shadow-[3px_3px_0px_#1E1E24]">
                        Create Character &amp; Start Quest
                      </button>
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
