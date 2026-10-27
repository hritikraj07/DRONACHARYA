// Dronacharya Premium Gaming Authentication Gateway
// Glassmorphism login card, interactive coding universe background, guest demo quick-start, and Supabase integration
'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import {
  authenticateUser,
  registerUser,
  createGuestSession,
  setActiveSession,
  AVAILABLE_CLASSES,
  AVAILABLE_SUBJECTS,
} from '@/lib/db/auth-db';
import { CosmicInteractiveBg } from '@/components/game/CosmicInteractiveBg';
import {
  ArrowRight,
  Sparkles,
  AlertCircle,
  CheckCircle2,
  Lock,
  Mail,
  User,
  ChevronDown,
  Gamepad2,
  Play,
  Zap,
  GraduationCap,
  ArrowLeft,
  Heart,
  Code2,
  ShieldCheck,
  Cpu,
  Bot,
  Trophy,
  Users,
  Flame,
} from 'lucide-react';

export default function AuthPage() {
  const router = useRouter();

  // Mode: 'signin' | 'signup' | 'guest'
  const [authMode, setAuthMode] = useState<'signin' | 'signup' | 'guest'>('signin');
  const [signupStep, setSignupStep] = useState<1 | 2 | 3>(1);

  // Form Fields
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [studentClass, setStudentClass] = useState(AVAILABLE_CLASSES[1]); // Default Class 10
  const [targetSubject, setTargetSubject] = useState(AVAILABLE_SUBJECTS[0].id);

  // Guest Demo Selection State
  const [guestSubject, setGuestSubject] = useState(AVAILABLE_SUBJECTS[0].id);
  const [guestClass, setGuestClass] = useState(AVAILABLE_CLASSES[1]);

  // UI Status
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const params = new URLSearchParams(window.location.search);
      const modeParam = params.get('mode');
      if (modeParam === 'signup' || modeParam === 'signin' || modeParam === 'guest') {
        setAuthMode(modeParam);
      }
    }
    const session = typeof window !== 'undefined' ? localStorage.getItem('dronacharya_active_session_v2') : null;
    if (session) {
      window.location.href = '/';
    }
  }, []);

  // Handle standard user Sign In
  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);
    setSuccessMsg(null);
    setIsSubmitting(true);

    const cleanEmail = email.trim();
    setEmail(cleanEmail);

    const result = await authenticateUser({ email: cleanEmail, password });
    setIsSubmitting(false);

    if (result.success && result.user) {
      setSuccessMsg(`Welcome back, ${result.user.name}! Entering your learning dashboard...`);
      setActiveSession(result.user, result.session);
      window.dispatchEvent(new Event('dronacharya_session_change'));
      window.dispatchEvent(new Event('storage'));
      setTimeout(() => {
        window.location.href = '/';
      }, 300);
    } else {
      setErrorMsg(result.error || 'Authentication failed. Please verify credentials.');
    }
  };

  // Step 1 -> Step 2 validation
  const handleProceedToStep2 = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);
    if (!fullName.trim()) {
      setErrorMsg('Please enter your full name.');
      return;
    }
    const cleanEmail = email.trim();
    setEmail(cleanEmail);
    if (!cleanEmail || !cleanEmail.includes('@')) {
      setErrorMsg('Please enter a valid email address.');
      return;
    }
    if (password.length < 6) {
      setErrorMsg('Password must be at least 6 characters long.');
      return;
    }
    setSignupStep(2);
  };

  // Step 2 -> Step 3
  const handleProceedToStep3 = () => {
    setErrorMsg(null);
    if (!studentClass) {
      setErrorMsg('Please select your class standard.');
      return;
    }
    setSignupStep(3);
  };

  // Final SignUp Submit
  const handleFinalSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);
    setSuccessMsg(null);
    setIsSubmitting(true);

    const cleanEmail = email.trim();
    setEmail(cleanEmail);

    const result = await registerUser({
      name: fullName.trim(),
      email: cleanEmail,
      password,
      studentClass,
      targetSubject,
    });
    setIsSubmitting(false);

    if (result.success && result.user) {
      setSuccessMsg(`Account established! Welcome, ${result.user.name}! Entering your world...`);
      setActiveSession(result.user, result.session);
      window.dispatchEvent(new Event('dronacharya_session_change'));
      window.dispatchEvent(new Event('storage'));
      setTimeout(() => {
        window.location.href = '/';
      }, 400);
    } else {
      setErrorMsg(result.error || 'Registration failed.');
    }
  };

  // Handle Instant Guest Demo Launch
  const handleLaunchGuestDemo = () => {
    setIsSubmitting(true);
    setSuccessMsg('Launching Instant Guest Demo...');

    // Create session directly with chosen course and class
    createGuestSession(guestSubject, guestClass);
    window.dispatchEvent(new Event('dronacharya_session_change'));
    window.dispatchEvent(new Event('storage'));

    setTimeout(() => {
      window.location.href = '/';
    }, 400);
  };

  const selectedGuestSubjectObj =
    AVAILABLE_SUBJECTS.find((s) => s.id === guestSubject) || AVAILABLE_SUBJECTS[0];

  return (
    <div className="fixed inset-0 z-50 bg-[#080B14] text-white flex flex-col overflow-y-auto antialiased">
      {/* 1. Sleek Top Header Navigation on Auth */}
      <header className="relative z-20 w-full px-4 sm:px-8 h-16 flex items-center justify-between border-b border-white/10 bg-[#080B14]/85 backdrop-blur-md shrink-0">
        <Link href="/" className="flex items-center gap-3 group">
          <div className="w-9 h-9 rounded-xl bg-[#6C5CE7] text-white flex items-center justify-center font-serif text-lg font-bold border border-white/20 group-hover:scale-105 transition-transform">
            द्रो
          </div>
          <div className="flex flex-col">
            <span className="font-serif font-black text-base sm:text-lg text-white tracking-tight leading-none flex items-center gap-1.5">
              DRONACHARYA
              <span className="w-2 h-2 rounded-full bg-[#10B981] animate-ping" />
            </span>
            <span className="text-[9px] tracking-widest uppercase text-[#FFC83D] font-black mt-0.5">
              Coding Adventure
            </span>
          </div>
        </Link>

        <Link
          href="/"
          className="px-4 py-2 rounded-xl bg-white/10 hover:bg-white/20 text-white border border-white/20 text-xs font-bold backdrop-blur-md transition-colors flex items-center gap-1.5 group cursor-pointer"
        >
          <ArrowLeft className="w-3.5 h-3.5 group-hover:-translate-x-0.5 transition-transform" />
          <span>Return to Portal</span>
        </Link>
      </header>

      {/* 2. Upgraded Interactive Cosmic Coding Universe Background with 3D Parallax */}
      <CosmicInteractiveBg />

      {/* 3. Center Authentication & Guest Demo Card + Side Companion Telemetry */}
      <main className="relative z-10 flex-1 flex items-center justify-center py-6 sm:py-10 px-4 sm:px-6 my-auto w-full max-w-7xl mx-auto">
        <div className="w-full flex items-center justify-center gap-6 xl:gap-8">
          {/* ========================================================
              LEFT DESKTOP WIDGET: ACHARYA AI COMPANION MENTOR
             ======================================================== */}
          <div
            className="hidden lg:flex flex-col w-72 shrink-0 p-5 rounded-2xl border border-white/50 text-[#1E1E24] relative self-stretch justify-between"
            style={{
              backgroundColor: 'rgba(255, 255, 255, 0.62)',
              backdropFilter: 'blur(20px) saturate(175%)',
              WebkitBackdropFilter: 'blur(20px) saturate(175%)',
              boxShadow: 'none',
            }}
          >
            {/* Top Tag & Status */}
            <div>
              <div className="flex items-center justify-between text-[10px] font-mono font-bold text-slate-500 mb-3 border-b border-slate-200/80 pb-2">
                <span>[AI.MENTOR.v2.4]</span>
                <span className="flex items-center gap-1 text-emerald-600 font-extrabold">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-ping" />
                  ONLINE
                </span>
              </div>

              {/* Avatar + Title */}
              <div className="flex items-center gap-3 mb-4">
                <div className="w-11 h-11 rounded-xl bg-gradient-to-tr from-[#6C5CE7] to-[#A29BFE] text-white flex items-center justify-center shrink-0 border border-white/80">
                  <Bot className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="text-xs font-black uppercase tracking-wider text-slate-900">Acharya AI</h3>
                  <p className="text-[11px] text-slate-500 font-medium">Digital Gurukul Mentor</p>
                </div>
              </div>

              {/* Speech bubble */}
              <div className="p-3.5 rounded-xl bg-white/75 border border-slate-200/90 text-xs font-medium text-slate-700 leading-relaxed relative mb-4">
                <span className="font-bold text-[#6C5CE7]">&quot;Namaste, Scholar!</span> No boring slides here. You will command rovers, build algorithms, and solve interactive quests in Python.&quot;
              </div>

              {/* Perks list */}
              <div className="space-y-2 text-xs font-semibold text-slate-700">
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 rounded-md bg-emerald-100 text-emerald-700 flex items-center justify-center text-[10px] font-bold">✓</div>
                  <span>Instant in-browser Python</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 rounded-md bg-emerald-100 text-emerald-700 flex items-center justify-center text-[10px] font-bold">✓</div>
                  <span>Playable 2D Game Simulators</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 rounded-md bg-emerald-100 text-emerald-700 flex items-center justify-center text-[10px] font-bold">✓</div>
                  <span>Real-time code diagnosis</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 rounded-md bg-emerald-100 text-emerald-700 flex items-center justify-center text-[10px] font-bold">✓</div>
                  <span>Permanent Cloud Save</span>
                </div>
              </div>
            </div>

            {/* Bottom tip */}
            <div className="pt-3 border-t border-slate-200/80 mt-4 text-[11px] text-slate-500 font-medium flex items-center gap-1.5">
              <Zap className="w-3.5 h-3.5 text-amber-500 shrink-0" />
              <span>Tip: Guest Demo lets you play immediately without logging in.</span>
            </div>
          </div>

          {/* ========================================================
              CENTER AUTHENTICATION & GUEST DEMO CARD
             ======================================================== */}
          <div className="relative w-full max-w-xl shrink-0">
            {/* Corner Cyber Brackets */}
            <div className="absolute -top-3 left-2 text-[9px] font-mono text-slate-400 select-none pointer-events-none hidden sm:block">
              ┌─ [GURUKUL.SECURE]
            </div>
            <div className="absolute -top-3 right-2 text-[9px] font-mono text-slate-400 select-none pointer-events-none hidden sm:block">
              [REALM.01] ─┐
            </div>

            {/* Professional Glassmorphism Card (Translucent Frosted Glass, clean edges, 1px border, no shadow) */}
            <div
              className="w-full p-6 sm:p-9 rounded-2xl text-[#1E1E24] relative border border-white/60 backdrop-blur-2xl"
              style={{
                backgroundColor: 'rgba(255, 255, 255, 0.62)',
                backdropFilter: 'blur(22px) saturate(180%)',
                WebkitBackdropFilter: 'blur(22px) saturate(180%)',
                boxShadow: 'none',
              }}
            >
            {/* 1. Live Platform Network Ticker Pill */}
            <div className="flex items-center justify-between gap-2 px-3.5 py-1.5 rounded-full bg-white/65 border border-white/70 backdrop-blur-md mb-5 text-[11px] font-bold text-slate-700">
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping shrink-0" />
                <span className="hidden sm:inline">Gurukul Network Online</span>
                <span className="sm:hidden">Online</span>
                <span className="text-slate-300">•</span>
                <span className="text-[#6C5CE7] font-extrabold flex items-center gap-1">
                  <Code2 className="w-3.5 h-3.5 text-[#6C5CE7]" />
                  Python 3.12 Engine
                </span>
              </div>
              <div className="flex items-center gap-1.5 text-amber-800 text-[10px] font-extrabold bg-amber-100/90 px-2.5 py-0.5 rounded-full border border-amber-300/70">
                <Sparkles className="w-3 h-3 text-amber-600" />
                <span>8 Active Coding Lands</span>
              </div>
            </div>

            {/* Brand Header */}
            <div className="text-center mb-5">
              <div className="relative inline-block mb-2">
                <div className="w-12 h-12 rounded-xl bg-[#6C5CE7] text-white flex items-center justify-center font-serif text-2xl font-black border border-[#6C5CE7]">
                  द्रो
                </div>
                <span className="absolute -bottom-1 -right-1 w-3.5 h-3.5 rounded-full bg-[#10B981] border-2 border-white flex items-center justify-center">
                  <span className="w-1.5 h-1.5 rounded-full bg-white animate-pulse" />
                </span>
              </div>

              <h1 className="font-serif font-black text-2xl sm:text-3xl text-[#1E1E24] tracking-tight">
                {authMode === 'guest'
                  ? 'Guest Demo: Select Your Course'
                  : authMode === 'signup'
                  ? 'Begin Your Coding Adventure'
                  : 'Sign In to Your Quest'}
              </h1>

              <div className="flex items-center justify-center gap-2 mt-2">
                <div className="h-px w-10 bg-slate-200/80" />
                <span className="text-[10px] text-[#6C5CE7] font-black uppercase tracking-widest flex items-center gap-1 bg-[#EDE9FE]/90 px-2.5 py-0.5 rounded-full border border-indigo-200/70">
                  <Sparkles className="w-3 h-3 text-[#D97706]" />
                  <span>Gurukul Gateway</span>
                </span>
                <div className="h-px w-10 bg-slate-200/80" />
              </div>

              <p className="text-xs sm:text-sm text-[#4A4A58] font-medium mt-1.5 max-w-md mx-auto leading-relaxed">
                {authMode === 'guest'
                  ? 'No registration needed. Choose your programming track to start playing immediately.'
                  : authMode === 'signup'
                  ? 'Complete 3 quick steps to tailor your interactive programming world.'
                  : 'Enter your credentials to load your saved progress & character state.'}
              </p>
            </div>

            {/* 2. Interactive Feature Badges Strip (Playable Simulators • AI Mentor • Gamified XP) */}
            <div className="grid grid-cols-3 gap-2 mb-5">
              <div className="p-2.5 rounded-xl bg-white/65 border border-white/70 backdrop-blur-xs text-center transition-all hover:bg-white/85">
                <Gamepad2 className="w-4 h-4 mx-auto text-[#6C5CE7] mb-1" />
                <span className="block text-[10px] font-black uppercase text-slate-900 leading-tight">Playable Simulators</span>
                <span className="block text-[9px] text-slate-500 font-medium leading-tight mt-0.5">2D Rover & Algorithms</span>
              </div>
              <div className="p-2.5 rounded-xl bg-white/65 border border-white/70 backdrop-blur-xs text-center transition-all hover:bg-white/85">
                <Bot className="w-4 h-4 mx-auto text-amber-600 mb-1" />
                <span className="block text-[10px] font-black uppercase text-slate-900 leading-tight">Acharya AI Mentor</span>
                <span className="block text-[9px] text-slate-500 font-medium leading-tight mt-0.5">Real-time Code Diagnostics</span>
              </div>
              <div className="p-2.5 rounded-xl bg-white/65 border border-white/70 backdrop-blur-xs text-center transition-all hover:bg-white/85">
                <Heart className="w-4 h-4 mx-auto text-rose-500 fill-rose-500/20 mb-1" />
                <span className="block text-[10px] font-black uppercase text-slate-900 leading-tight">Mastery XP & Hearts</span>
                <span className="block text-[9px] text-slate-500 font-medium leading-tight mt-0.5">Gamified Quest Loop</span>
              </div>
            </div>

            {/* Live Community Activity Bar */}
            <div className="flex items-center justify-around px-3 py-1.5 rounded-xl bg-white/50 border border-slate-200/70 mb-5 text-[10px] font-bold text-slate-600 backdrop-blur-xs">
              <span className="flex items-center gap-1 text-slate-700">
                <Users className="w-3 h-3 text-[#6C5CE7]" />
                <span>1,840+ Active Scholars</span>
              </span>
              <span className="text-slate-300">•</span>
              <span className="flex items-center gap-1 text-slate-700">
                <Flame className="w-3 h-3 text-orange-500" />
                <span>48k+ Loops Run Today</span>
              </span>
              <span className="text-slate-300">•</span>
              <span className="flex items-center gap-1 text-slate-700">
                <Trophy className="w-3 h-3 text-amber-500" />
                <span>98.4% Pass Rate</span>
              </span>
            </div>

            {/* Quick Start / Play Instantly Guest Banner */}
            {authMode !== 'guest' && (
              <div
                className="mb-5 p-3.5 sm:p-4 rounded-xl border border-amber-300/80 transition-colors flex flex-col sm:flex-row sm:items-center justify-between gap-3 relative bg-amber-100/75 backdrop-blur-xs"
                style={{
                  boxShadow: 'none',
                }}
              >
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-amber-200/90 text-[#1E1E24] flex items-center justify-center shrink-0 font-black border border-amber-300">
                    <Gamepad2 className="w-5 h-5 text-amber-900" />
                  </div>
                  <div>
                    <div className="font-bold text-xs sm:text-sm text-slate-900 flex items-center gap-2">
                      <span>Ready to start your adventure?</span>
                      <span className="text-[10px] bg-emerald-600 text-white px-2 py-0.5 rounded-full font-bold">
                        Instant
                      </span>
                    </div>
                    <div className="text-[11px] sm:text-xs text-slate-700 font-medium mt-0.5">
                      Explore the coding world without creating an account.
                    </div>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => {
                    setAuthMode('guest');
                    setErrorMsg(null);
                  }}
                  className="bg-[#1E1E24] hover:bg-slate-800 text-[#FBBF24] font-bold py-2 px-3.5 rounded-xl text-xs transition-colors shrink-0 flex items-center justify-center gap-1.5 cursor-pointer self-start sm:self-auto border border-[#1E1E24]"
                >
                  <Play className="w-3.5 h-3.5 fill-[#FBBF24]" />
                  <span>Play as Guest</span>
                </button>
              </div>
            )}

            {/* Current Active Mission Rover Callout */}
            <div className="flex items-center justify-between px-3 py-1.5 rounded-lg bg-indigo-50/70 border border-indigo-200/70 mb-5 text-[11px] font-medium text-slate-700 backdrop-blur-xs">
              <span className="flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-indigo-600 animate-pulse" />
                <span>Sector Online: <strong>Stage 3 Loop Lab (Rover Arya)</strong></span>
              </span>
              <span className="text-[10px] font-bold text-[#6C5CE7] bg-white/80 px-2 py-0.5 rounded border border-indigo-200">
                +150 XP
              </span>
            </div>

            {/* Segmented Tab Switcher (Sign In vs Create Account vs Guest Demo) */}
            <div className="flex bg-slate-900/10 p-1 rounded-xl border border-slate-300/60 mb-5 relative backdrop-blur-xs">
              <button
                type="button"
                onClick={() => {
                  setAuthMode('signin');
                  setErrorMsg(null);
                }}
                className={`flex-1 py-2 text-xs font-bold rounded-lg transition-colors cursor-pointer relative ${
                  authMode === 'signin'
                    ? 'bg-white/95 text-[#6C5CE7] border border-white/80'
                    : 'text-slate-700 hover:text-slate-900 border border-transparent'
                }`}
              >
                Sign In
              </button>
              <button
                type="button"
                onClick={() => {
                  setAuthMode('signup');
                  setSignupStep(1);
                  setErrorMsg(null);
                }}
                className={`flex-1 py-2 text-xs font-bold rounded-lg transition-colors cursor-pointer relative ${
                  authMode === 'signup'
                    ? 'bg-white/95 text-[#6C5CE7] border border-white/80'
                    : 'text-slate-700 hover:text-slate-900 border border-transparent'
                }`}
              >
                Create Account
              </button>
              <button
                type="button"
                onClick={() => {
                  setAuthMode('guest');
                  setErrorMsg(null);
                }}
                className={`flex-1 py-2 text-xs font-bold rounded-lg transition-colors cursor-pointer flex items-center justify-center gap-1.5 relative ${
                  authMode === 'guest'
                    ? 'bg-white/95 text-amber-700 border border-white/80'
                    : 'text-slate-700 hover:text-slate-900 border border-transparent'
                }`}
              >
                <Gamepad2 className="w-3.5 h-3.5 text-amber-600" />
                <span>Guest Demo</span>
              </button>
            </div>

            {/* Feedback Alerts */}
            {errorMsg && (
              <div className="mb-4 p-3.5 rounded-xl bg-red-500/10 border border-red-500/30 text-xs text-red-700 font-bold flex items-start gap-2.5 backdrop-blur-xs animate-in fade-in duration-150">
                <AlertCircle className="w-4 h-4 shrink-0 mt-0.5 text-red-600" />
                <span>{errorMsg}</span>
              </div>
            )}

            {successMsg && (
              <div className="mb-4 p-3.5 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-xs text-emerald-800 font-bold flex items-center gap-2.5 backdrop-blur-xs animate-in fade-in duration-150">
                <CheckCircle2 className="w-4 h-4 shrink-0 text-emerald-600" />
                <span>{successMsg}</span>
              </div>
            )}

            {/* ========================================================
                VIEW 1: GUEST DEMO — SELECT COURSE & LAUNCH DIRECTLY
               ======================================================== */}
            {authMode === 'guest' && (
              <div className="space-y-4">
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <label className="font-bold text-xs text-slate-800 uppercase tracking-wider">
                      1. Choose Your Programming Course:
                    </label>
                    <span className="text-[10px] bg-[#10B981] text-white font-bold px-2 py-0.5 rounded-md">
                      Playable 2D Game
                    </span>
                  </div>

                  {/* Course Selection Cards */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                    {AVAILABLE_SUBJECTS.map((sub) => {
                      const isSelected = guestSubject === sub.id;
                      return (
                        <div
                          key={sub.id}
                          onClick={() => setGuestSubject(sub.id)}
                          className={`p-3.5 rounded-xl border transition-colors cursor-pointer flex flex-col justify-between backdrop-blur-xs ${
                            isSelected
                              ? 'bg-amber-100/85 border-amber-400 ring-1 ring-amber-400'
                              : 'bg-white/60 hover:bg-white/80 border-slate-200/90'
                          }`}
                        >
                          <div className="flex items-center justify-between">
                            <span className="font-bold text-xs text-slate-900">{sub.name}</span>
                            {sub.isAvailable ? (
                              <span className="text-[9px] bg-emerald-100 text-emerald-800 border border-emerald-200 px-2 py-0.5 rounded-full font-bold">
                                Live Game
                              </span>
                            ) : (
                              <span className="text-[9px] bg-slate-100 text-slate-500 border border-slate-200 px-2 py-0.5 rounded-full font-medium">
                                Coming Soon
                              </span>
                            )}
                          </div>
                          <p className="text-[10px] text-slate-600 mt-1 line-clamp-2 font-medium">
                            {sub.tagline}
                          </p>
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* Class Selection for Guest Demo */}
                <div>
                  <label className="block font-bold text-xs text-slate-800 mb-1.5 uppercase tracking-wider">
                    2. Select Class / Standard:
                  </label>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                    {AVAILABLE_CLASSES.map((cls) => {
                      const isSelected = guestClass === cls;
                      return (
                        <button
                          key={cls}
                          type="button"
                          onClick={() => setGuestClass(cls)}
                          className={`py-2 px-2 rounded-xl border text-xs font-bold transition-colors cursor-pointer backdrop-blur-xs ${
                            isSelected
                              ? 'bg-[#6C5CE7] text-white border-[#6C5CE7]'
                              : 'bg-white/60 text-slate-700 hover:bg-white/80 border-slate-200/90'
                          }`}
                        >
                          {cls}
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Course Preview Callout */}
                <div className="p-3.5 rounded-xl bg-indigo-50/70 border border-indigo-200/70 space-y-1 backdrop-blur-xs">
                  <div className="flex items-center gap-1.5 text-xs font-bold text-[#6C5CE7]">
                    <Zap className="w-3.5 h-3.5 text-amber-500" />
                    <span>Launching: {selectedGuestSubjectObj.name} ({guestClass})</span>
                  </div>
                  <p className="text-[11px] text-slate-600 font-medium leading-relaxed">
                    Direct access with 5 full player hearts, interactive 2D simulation grid, and Acharya AI mentor.
                  </p>
                </div>

                {/* Launch Action */}
                <div className="pt-2 flex flex-col sm:flex-row items-center gap-3">
                  <button
                    type="button"
                    onClick={handleLaunchGuestDemo}
                    disabled={isSubmitting}
                    className="w-full py-3.5 text-xs sm:text-sm font-bold rounded-xl bg-amber-400 hover:bg-amber-500 text-slate-900 transition-colors flex items-center justify-center gap-2 cursor-pointer disabled:opacity-60 border border-amber-400"
                  >
                    <span>{isSubmitting ? 'Entering Arena...' : `🚀 Start ${selectedGuestSubjectObj.name} as Guest`}</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>

                  <button
                    type="button"
                    onClick={() => setAuthMode('signin')}
                    className="w-full sm:w-auto py-3 px-4 rounded-xl bg-white/70 hover:bg-white/90 text-xs font-bold text-slate-700 border border-slate-200/90 shrink-0 transition-colors cursor-pointer backdrop-blur-xs"
                  >
                    ← Back to Login
                  </button>
                </div>
              </div>
            )}

            {/* ========================================================
                VIEW 2: SIGN IN FORM (Clean Edges & Zero Shadows)
               ======================================================== */}
            {authMode === 'signin' && (
              <form onSubmit={handleSignIn} className="space-y-4 text-xs sm:text-sm">
                <div>
                  <label className="block font-bold text-xs text-slate-800 mb-1.5">
                    Email Address
                  </label>
                  <div className="relative group">
                    <Mail className="w-4 h-4 text-slate-400 group-focus-within:text-[#6C5CE7] absolute left-3.5 top-3.5 transition-colors pointer-events-none" />
                    <input
                      type="email"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      onBlur={() => setEmail((prev) => prev.trim())}
                      placeholder="student@learning.edu"
                      className="w-full pl-10 pr-4 py-3 rounded-xl bg-white/55 hover:bg-white/70 focus:bg-white/95 border border-slate-300/80 text-xs sm:text-sm font-bold text-slate-900 placeholder:text-slate-400 focus:border-[#6C5CE7] focus:outline-none transition-all backdrop-blur-xs"
                    />
                  </div>
                </div>

                <div>
                  <label className="block font-bold text-xs text-slate-800 mb-1.5">
                    Password
                  </label>
                  <div className="relative group">
                    <Lock className="w-4 h-4 text-slate-400 group-focus-within:text-[#6C5CE7] absolute left-3.5 top-3.5 transition-colors pointer-events-none" />
                    <input
                      type="password"
                      required
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="Enter your database password"
                      className="w-full pl-10 pr-4 py-3 rounded-xl bg-white/55 hover:bg-white/70 focus:bg-white/95 border border-slate-300/80 text-xs sm:text-sm font-bold text-slate-900 placeholder:text-slate-400 focus:border-[#6C5CE7] focus:outline-none transition-all backdrop-blur-xs"
                    />
                  </div>
                </div>

                {/* Primary Call to Action Button */}
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full py-3.5 px-6 rounded-xl bg-[#6C5CE7] hover:bg-[#5843D8] text-white font-bold text-xs sm:text-sm border border-[#6C5CE7] transition-colors flex items-center justify-center gap-2 cursor-pointer disabled:opacity-60 disabled:cursor-not-allowed group mt-2"
                >
                  <span>{isSubmitting ? 'Verifying Credentials...' : 'Verify Credentials & Start Quest'}</span>
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </button>

                <div className="text-center pt-2 text-slate-500 text-xs font-medium">
                  Don&apos;t have an account yet?{' '}
                  <button
                    type="button"
                    onClick={() => {
                      setAuthMode('signup');
                      setSignupStep(1);
                    }}
                    className="text-[#6C5CE7] hover:text-[#5843D8] font-bold underline cursor-pointer transition-colors"
                  >
                    Start Step-by-Step Setup
                  </button>
                </div>
              </form>
            )}

            {/* ========================================================
                VIEW 3: STEP-BY-STEP SIGN UP WIZARD
               ======================================================== */}
            {authMode === 'signup' && (
              <div>
                {/* Step Stepper Header */}
                <div className="flex items-center justify-between mb-6 px-1">
                  <div className="flex items-center gap-2">
                    <div
                      className={`w-7 h-7 rounded-xl flex items-center justify-center font-bold text-xs border transition-colors ${
                        signupStep >= 1
                          ? 'bg-[#6C5CE7] text-white border-[#6C5CE7]'
                          : 'bg-slate-100 text-slate-400 border-slate-200'
                      }`}
                    >
                      1
                    </div>
                    <span className={`text-xs font-bold ${signupStep === 1 ? 'text-[#6C5CE7]' : 'text-slate-500'}`}>
                      Account
                    </span>
                  </div>

                  <div className={`flex-1 h-px mx-3 ${signupStep >= 2 ? 'bg-[#6C5CE7]' : 'bg-slate-200'}`} />

                  <div className="flex items-center gap-2">
                    <div
                      className={`w-7 h-7 rounded-xl flex items-center justify-center font-bold text-xs border transition-colors ${
                        signupStep >= 2
                          ? 'bg-[#6C5CE7] text-white border-[#6C5CE7]'
                          : 'bg-slate-100 text-slate-400 border-slate-200'
                      }`}
                    >
                      2
                    </div>
                    <span className={`text-xs font-bold ${signupStep === 2 ? 'text-[#6C5CE7]' : 'text-slate-500'}`}>
                      Class
                    </span>
                  </div>

                  <div className={`flex-1 h-px mx-3 ${signupStep >= 3 ? 'bg-[#6C5CE7]' : 'bg-slate-200'}`} />

                  <div className="flex items-center gap-2">
                    <div
                      className={`w-7 h-7 rounded-xl flex items-center justify-center font-bold text-xs border transition-colors ${
                        signupStep >= 3
                          ? 'bg-[#6C5CE7] text-white border-[#6C5CE7]'
                          : 'bg-slate-100 text-slate-400 border-slate-200'
                      }`}
                    >
                      3
                    </div>
                    <span className={`text-xs font-bold ${signupStep === 3 ? 'text-[#6C5CE7]' : 'text-slate-500'}`}>
                      Language
                    </span>
                  </div>
                </div>

                {/* STEP 1: Full Name, Email, Password */}
                {signupStep === 1 && (
                  <form onSubmit={handleProceedToStep2} className="space-y-4 text-xs sm:text-sm">
                    <div>
                      <div className="font-bold text-sm text-slate-900 mb-0.5">
                        Step 1: Scholar Identification
                      </div>
                      <p className="text-slate-600 text-xs mb-3 font-medium">
                        Enter your name and login credentials to establish your saved account:
                      </p>
                    </div>

                    <div>
                      <label className="block font-bold text-xs text-slate-800 mb-1.5">Full Name</label>
                      <div className="relative group">
                        <User className="w-4 h-4 text-slate-400 group-focus-within:text-[#6C5CE7] absolute left-3.5 top-3.5 transition-colors pointer-events-none" />
                        <input
                          type="text"
                          required
                          value={fullName}
                          onChange={(e) => setFullName(e.target.value)}
                          placeholder="Aryabhata Sharma"
                          className="w-full pl-10 pr-4 py-3 rounded-xl bg-white/55 hover:bg-white/70 focus:bg-white/95 border border-slate-300/80 text-xs sm:text-sm font-bold text-slate-900 placeholder:text-slate-400 focus:border-[#6C5CE7] focus:outline-none transition-all backdrop-blur-xs"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block font-bold text-xs text-slate-800 mb-1.5">Email Address</label>
                      <div className="relative group">
                        <Mail className="w-4 h-4 text-slate-400 group-focus-within:text-[#6C5CE7] absolute left-3.5 top-3.5 transition-colors pointer-events-none" />
                        <input
                          type="email"
                          required
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                          onBlur={() => setEmail((prev) => prev.trim())}
                          placeholder="student@learning.edu"
                          className="w-full pl-10 pr-4 py-3 rounded-xl bg-white/55 hover:bg-white/70 focus:bg-white/95 border border-slate-300/80 text-xs sm:text-sm font-bold text-slate-900 placeholder:text-slate-400 focus:border-[#6C5CE7] focus:outline-none transition-all backdrop-blur-xs"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block font-bold text-xs text-slate-800 mb-1.5">Password</label>
                      <div className="relative group">
                        <Lock className="w-4 h-4 text-slate-400 group-focus-within:text-[#6C5CE7] absolute left-3.5 top-3.5 transition-colors pointer-events-none" />
                        <input
                          type="password"
                          required
                          value={password}
                          onChange={(e) => setPassword(e.target.value)}
                          placeholder="At least 6 characters"
                          className="w-full pl-10 pr-4 py-3 rounded-xl bg-white/55 hover:bg-white/70 focus:bg-white/95 border border-slate-300/80 text-xs sm:text-sm font-bold text-slate-900 placeholder:text-slate-400 focus:border-[#6C5CE7] focus:outline-none transition-all backdrop-blur-xs"
                        />
                      </div>
                    </div>

                    <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-2">
                      <button
                        type="button"
                        onClick={() => setAuthMode('signin')}
                        className="text-slate-500 hover:text-slate-900 font-bold text-xs order-2 sm:order-1 cursor-pointer transition-colors"
                      >
                        Already registered? Sign In
                      </button>
                      <button
                        type="submit"
                        className="w-full sm:w-auto py-3 px-6 rounded-xl bg-[#6C5CE7] hover:bg-[#5843D8] text-white font-bold text-xs sm:text-sm border border-[#6C5CE7] flex items-center justify-center gap-1.5 order-1 sm:order-2 cursor-pointer transition-colors"
                      >
                        <span>Continue to Step 2</span>
                        <ArrowRight className="w-4 h-4" />
                      </button>
                    </div>
                  </form>
                )}

                {/* STEP 2: CLASS STANDARD SELECTION */}
                {signupStep === 2 && (
                  <div className="space-y-4 text-xs sm:text-sm">
                    <div>
                      <div className="font-bold text-sm text-slate-900 mb-0.5">
                        Step 2: Select Your Class Standard
                      </div>
                      <p className="text-slate-600 text-xs mb-3 font-medium">
                        Curriculum is strictly tailored up to 12th Pass:
                      </p>
                    </div>

                    <div className="grid grid-cols-1 gap-2.5">
                      {AVAILABLE_CLASSES.map((cls) => {
                        const isSelected = studentClass === cls;
                        return (
                          <div
                            key={cls}
                            onClick={() => setStudentClass(cls)}
                            className={`p-3.5 rounded-xl border transition-colors cursor-pointer flex items-center justify-between backdrop-blur-xs ${
                              isSelected
                                ? 'bg-amber-100/85 border-amber-400 font-bold'
                                : 'bg-white/60 hover:bg-white/80 border-slate-200/90'
                            }`}
                          >
                            <div className="flex items-center gap-2.5">
                              <GraduationCap className={`w-4 h-4 ${isSelected ? 'text-amber-600' : 'text-slate-400'}`} />
                              <span className="font-bold text-xs text-slate-900">{cls}</span>
                            </div>

                            <span className="text-[10px] text-slate-600 font-medium">
                              {cls === 'Class 9'
                                ? 'Foundations & Algorithmic Logic'
                                : cls === 'Class 10'
                                ? 'Core Problem Solving & Python'
                                : cls === 'Class 11'
                                ? 'CS Principles & Loops'
                                : 'Advanced Systems & Capstones'}
                            </span>
                          </div>
                        );
                      })}
                    </div>

                    <div className="flex items-center justify-between pt-3">
                      <button
                        type="button"
                        onClick={() => setSignupStep(1)}
                        className="py-2.5 px-4 rounded-xl bg-white/70 hover:bg-white/90 text-xs font-bold text-slate-700 border border-slate-200/90 cursor-pointer transition-colors backdrop-blur-xs"
                      >
                        ← Back
                      </button>
                      <button
                        type="button"
                        onClick={handleProceedToStep3}
                        className="py-3 px-6 rounded-xl bg-[#6C5CE7] hover:bg-[#5843D8] text-white font-bold text-xs sm:text-sm border border-[#6C5CE7] flex items-center gap-1.5 cursor-pointer transition-colors"
                      >
                        <span>Continue to Step 3</span>
                        <ArrowRight className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                )}

                {/* STEP 3: PROGRAMMING LANGUAGE SELECTION */}
                {signupStep === 3 && (
                  <form onSubmit={handleFinalSignUp} className="space-y-4 text-xs sm:text-sm">
                    <div>
                      <div className="font-bold text-sm text-slate-900 mb-0.5">
                        Step 3: Select Programming Realm
                      </div>
                      <p className="text-slate-600 text-xs mb-3 font-medium">
                        Choose the language you want to learn through playable 2D games and quests:
                      </p>
                    </div>

                    <div>
                      <label className="block font-bold text-xs text-slate-800 mb-1.5">
                        Programming Language:
                      </label>
                      <div className="relative">
                        <select
                          value={targetSubject}
                          onChange={(e) => setTargetSubject(e.target.value)}
                          className="w-full appearance-none px-4 py-3 border border-slate-300/80 rounded-xl bg-white/70 hover:bg-white/85 text-xs sm:text-sm font-bold text-slate-900 focus:outline-none focus:border-[#6C5CE7] cursor-pointer pr-10 backdrop-blur-xs"
                        >
                          {AVAILABLE_SUBJECTS.map((sub) => (
                            <option key={sub.id} value={sub.id}>
                              {sub.name} — {sub.tagline}
                            </option>
                          ))}
                        </select>
                        <ChevronDown className="w-4 h-4 text-slate-600 absolute right-3.5 top-3.5 pointer-events-none" />
                      </div>
                    </div>

                    <div className="p-3.5 rounded-xl bg-indigo-50/70 border border-indigo-200/70 space-y-1.5 backdrop-blur-xs">
                      <div className="flex items-center gap-2 text-xs font-bold text-[#6C5CE7]">
                        <Gamepad2 className="w-4 h-4 text-rose-500" />
                        <span>Included Mission: Rescue the Robot with Python Loops</span>
                      </div>
                      <p className="text-[11px] text-slate-600 font-medium leading-relaxed">
                        You will play an animated 2D grid game to steer the robot, collect energy cells, avoid space obstacles, and reach the base beacon.
                      </p>
                    </div>

                    <div className="flex items-center justify-between pt-3">
                      <button
                        type="button"
                        onClick={() => setSignupStep(2)}
                        className="py-2.5 px-4 rounded-xl bg-white/70 hover:bg-white/90 text-xs font-bold text-slate-700 border border-slate-200/90 cursor-pointer transition-colors backdrop-blur-xs"
                      >
                        ← Back
                      </button>
                      <button
                        type="submit"
                        disabled={isSubmitting}
                        className="py-3.5 px-6 rounded-xl bg-amber-400 hover:bg-amber-500 text-slate-900 font-bold text-xs sm:text-sm transition-colors flex items-center gap-1.5 cursor-pointer disabled:opacity-60 border border-amber-400"
                      >
                        <span>{isSubmitting ? 'Setting up...' : '🚀 Finish Setup & Enter Game Arena'}</span>
                      </button>
                    </div>
                  </form>
                )}
              </div>
            )}

            {/* 4. Trust, Cloud & Tech Stack Bar */}
            <div className="mt-6 pt-4 border-t border-slate-200/80 flex flex-col sm:flex-row items-center justify-between gap-2 text-[10px] text-slate-500 font-medium">
              <div className="flex items-center gap-1.5">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                <span>Encrypted Cloud Sync via Supabase Auth</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="flex items-center gap-1">
                  <Cpu className="w-3 h-3 text-[#6C5CE7]" />
                  Python 3.12 WebAssembly
                </span>
                <span>•</span>
                <span>Zero Local Setup Required</span>
              </div>
            </div>
          </div>
        </div>

        {/* ========================================================
            RIGHT DESKTOP WIDGET: ACTIVE SECTOR MISSION TELEMETRY
           ======================================================== */}
        <div
          className="hidden lg:flex flex-col w-72 shrink-0 p-5 rounded-2xl border border-white/50 text-[#1E1E24] relative self-stretch justify-between"
          style={{
            backgroundColor: 'rgba(255, 255, 255, 0.62)',
            backdropFilter: 'blur(20px) saturate(175%)',
            WebkitBackdropFilter: 'blur(20px) saturate(175%)',
            boxShadow: 'none',
          }}
        >
          {/* Top Tag & Status */}
          <div>
            <div className="flex items-center justify-between text-[10px] font-mono font-bold text-slate-500 mb-3 border-b border-slate-200/80 pb-2">
              <span>[SECTOR.RADAR // 03]</span>
              <span className="flex items-center gap-1 text-[#6C5CE7] font-extrabold">
                <span className="w-1.5 h-1.5 rounded-full bg-[#6C5CE7] animate-pulse" />
                ACTIVE
              </span>
            </div>

            {/* Rover Mission Lore */}
            <div className="mb-4">
              <div className="flex items-center gap-2 mb-1">
                <Gamepad2 className="w-4 h-4 text-rose-500" />
                <h3 className="text-xs font-black uppercase tracking-wider text-slate-900">Rover Arya Rescue</h3>
              </div>
              <p className="text-[11px] text-slate-600 font-medium leading-relaxed">
                The Clockwork Citadel operates on infinite automated gear cycles. Guide Rover Arya using Python for-loops!
              </p>
            </div>

            {/* Telemetry Metrics */}
            <div className="space-y-2 mb-4">
              <div className="p-2.5 rounded-xl bg-white/75 border border-slate-200/90 text-xs">
                <div className="flex items-center justify-between text-[11px] text-slate-500 mb-1">
                  <span>Battery Cell</span>
                  <span className="font-bold text-emerald-600">100% Full</span>
                </div>
                <div className="w-full h-1.5 bg-slate-200 rounded-full overflow-hidden">
                  <div className="h-full bg-emerald-500 rounded-full w-full" />
                </div>
              </div>

              <div className="p-2.5 rounded-xl bg-white/75 border border-slate-200/90 text-xs flex items-center justify-between">
                <span className="text-[11px] text-slate-600 font-medium">Core Concept:</span>
                <span className="font-mono font-bold text-[11px] text-[#6C5CE7] bg-indigo-50 px-1.5 py-0.5 rounded border border-indigo-200">
                  for i in range(5):
                </span>
              </div>

              <div className="p-2.5 rounded-xl bg-white/75 border border-slate-200/90 text-xs flex items-center justify-between">
                <span className="text-[11px] text-slate-600 font-medium">Mission Reward:</span>
                <span className="font-bold text-[11px] text-amber-700 flex items-center gap-1">
                  <Trophy className="w-3.5 h-3.5 text-amber-500" />
                  +150 XP
                </span>
              </div>
            </div>
          </div>

          {/* Quick Demo Button */}
          <div className="pt-3 border-t border-slate-200/80 mt-4">
            <button
              type="button"
              onClick={() => {
                setAuthMode('guest');
                setGuestSubject('python');
                setErrorMsg(null);
              }}
              className="w-full py-2.5 px-3 rounded-xl bg-amber-400 hover:bg-amber-500 text-slate-900 text-xs font-bold border border-amber-400 transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
            >
              <Play className="w-3.5 h-3.5 fill-slate-900" />
              <span>Test Mission in Guest Mode</span>
            </button>
          </div>
        </div>
      </div>
    </main>
    </div>
  );
}
