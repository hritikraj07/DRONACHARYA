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
      <header className="relative z-20 w-full px-4 sm:px-8 h-16 flex items-center justify-between border-b border-white/10 bg-[#080B14]/75 backdrop-blur-md shrink-0">
        <Link href="/" className="flex items-center gap-3 group">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-[#7257FF] to-[#5843D8] text-white flex items-center justify-center font-serif text-lg font-bold border border-white/30 shadow-[0_4px_12px_rgba(114,87,255,0.4)] group-hover:scale-105 transition-all">
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
          className="px-4 py-2 rounded-xl bg-white/10 hover:bg-white/20 text-white border border-white/20 text-xs font-black backdrop-blur-md transition-all flex items-center gap-1.5 shadow-sm hover:shadow-[0_0_15px_rgba(255,255,255,0.15)] group cursor-pointer"
        >
          <ArrowLeft className="w-3.5 h-3.5 group-hover:-translate-x-0.5 transition-transform" />
          <span>Return to Portal</span>
        </Link>
      </header>

      {/* 2. Upgraded Interactive Cosmic Coding Universe Background */}
      <CosmicInteractiveBg />

      {/* 3. Center Authentication & Guest Demo Card */}
      <main className="relative z-10 flex-1 flex items-center justify-center py-10 px-4 sm:px-6 my-auto">
        <div className="relative w-full max-w-xl">
          {/* Ambient Purple-Cyan Glow Behind Glass Card */}
          <div
            className="absolute -inset-1.5 bg-gradient-to-r from-[#7257FF]/30 via-[#21D4FD]/20 to-[#FFC83D]/25 rounded-[32px] blur-2xl opacity-75 -z-10 pointer-events-none"
            aria-hidden="true"
          />

          {/* Premium Glassmorphism Card (Ivory Translucent Canvas) */}
          <div
            className="w-full p-6 sm:p-9 rounded-[26px] text-[#1E1E24] transition-all duration-300 relative"
            style={{
              backgroundColor: 'rgba(255, 252, 245, 0.88)',
              backdropFilter: 'blur(28px) saturate(160%)',
              WebkitBackdropFilter: 'blur(28px) saturate(160%)',
              border: '1.5px solid rgba(255, 255, 255, 0.85)',
              boxShadow:
                '0 24px 80px -12px rgba(0, 0, 0, 0.45), 0 0 35px -8px rgba(114, 87, 255, 0.25), inset 0 1px 1px 0 rgba(255, 255, 255, 0.95)',
            }}
          >
            {/* Brand Header */}
            <div className="text-center mb-6">
              <div className="relative inline-block mb-2.5">
                <div className="w-13 h-13 rounded-2xl bg-gradient-to-br from-[#7257FF] to-[#5843D8] text-white flex items-center justify-center font-serif text-2xl font-black shadow-[0_8px_20px_rgba(114,87,255,0.45)] border border-white/40 ring-4 ring-[#7257FF]/15">
                  द्रो
                </div>
                <span className="absolute -bottom-1 -right-1 w-4 h-4 rounded-full bg-[#10B981] border-2 border-white flex items-center justify-center shadow-xs">
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

              <div className="flex items-center justify-center gap-2 mt-2.5">
                <div className="h-px w-10 bg-gradient-to-r from-transparent via-[#7257FF]/40 to-transparent" />
                <span className="text-[10px] text-[#7257FF] font-black uppercase tracking-widest flex items-center gap-1 bg-[#EDE9FE]/80 px-2.5 py-0.5 rounded-full border border-[#7257FF]/25 shadow-xs">
                  <Sparkles className="w-3 h-3 text-[#D97706]" />
                  <span>Gurukul Gateway</span>
                </span>
                <div className="h-px w-10 bg-gradient-to-r from-transparent via-[#7257FF]/40 to-transparent" />
              </div>

              <p className="text-xs sm:text-sm text-[#4A4A58] font-semibold mt-2 max-w-md mx-auto leading-relaxed">
                {authMode === 'guest'
                  ? 'No registration needed. Choose your programming track to start playing immediately.'
                  : authMode === 'signup'
                  ? 'Complete 3 quick steps to tailor your interactive programming world.'
                  : 'Enter your credentials to load your saved progress & character state.'}
              </p>
            </div>

            {/* Redesigned Quick Start / Play Instantly Guest Banner */}
            {authMode !== 'guest' && (
              <div
                className="mb-5 p-3.5 sm:p-4 rounded-2xl border transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-3 relative overflow-hidden"
                style={{
                  background:
                    'linear-gradient(135deg, rgba(254, 243, 199, 0.95) 0%, rgba(254, 215, 170, 0.9) 100%)',
                  borderColor: 'rgba(245, 158, 11, 0.45)',
                  boxShadow:
                    '0 8px 24px -6px rgba(245, 158, 11, 0.25), inset 0 1px 0 rgba(255, 255, 255, 0.9)',
                }}
              >
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#FBBF24] to-[#F59E0B] text-[#1E1E24] flex items-center justify-center shrink-0 font-black shadow-[0_4px_12px_rgba(245,158,11,0.35)] border border-amber-200">
                    <Gamepad2 className="w-5 h-5 text-[#1E1E24]" />
                  </div>
                  <div>
                    <div className="font-black text-xs sm:text-sm text-[#1E1E24] flex items-center gap-2">
                      <span>Ready to start your adventure?</span>
                      <span className="text-[10px] bg-[#10B981] text-white px-2 py-0.5 rounded-full font-black shadow-xs">
                        Instant
                      </span>
                    </div>
                    <div className="text-[11px] sm:text-xs text-[#5D4037] font-semibold mt-0.5">
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
                  className="bg-[#1E1E24] hover:bg-[#2D2D3A] text-[#FBBF24] font-black py-2.5 px-4 rounded-xl text-xs shadow-md hover:shadow-lg active:scale-95 transition-all shrink-0 flex items-center justify-center gap-1.5 cursor-pointer self-start sm:self-auto border border-[#1E1E24]"
                >
                  <Play className="w-3.5 h-3.5 fill-[#FBBF24]" />
                  <span>Play as Guest</span>
                </button>
              </div>
            )}

            {/* Redesigned Glass Tab Switcher (Sign In vs Create Account vs Guest Demo) */}
            <div className="flex bg-[#1E1E24]/6 p-1 rounded-xl border border-[#1E1E24]/10 mb-5 relative">
              <button
                type="button"
                onClick={() => {
                  setAuthMode('signin');
                  setErrorMsg(null);
                }}
                className={`flex-1 py-2 text-xs font-black rounded-lg transition-all cursor-pointer relative ${
                  authMode === 'signin'
                    ? 'bg-white text-[#6C5CE7] shadow-[0_2px_8px_rgba(0,0,0,0.08)] border border-white/60'
                    : 'text-[#64748B] hover:text-[#1E1E24]'
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
                className={`flex-1 py-2 text-xs font-black rounded-lg transition-all cursor-pointer relative ${
                  authMode === 'signup'
                    ? 'bg-white text-[#6C5CE7] shadow-[0_2px_8px_rgba(0,0,0,0.08)] border border-white/60'
                    : 'text-[#64748B] hover:text-[#1E1E24]'
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
                className={`flex-1 py-2 text-xs font-black rounded-lg transition-all cursor-pointer flex items-center justify-center gap-1.5 relative ${
                  authMode === 'guest'
                    ? 'bg-white text-[#D97706] shadow-[0_2px_8px_rgba(0,0,0,0.08)] border border-white/60'
                    : 'text-[#64748B] hover:text-[#1E1E24]'
                }`}
              >
                <Gamepad2 className="w-3.5 h-3.5 text-[#F59E0B]" />
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
                    <label className="font-black text-xs text-[#1E1E24] uppercase tracking-wider">
                      1. Choose Your Programming Course:
                    </label>
                    <span className="text-[10px] bg-[#10B981] text-white font-black px-2 py-0.5 rounded-md shadow-xs">
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
                          className={`p-3.5 rounded-xl border transition-all cursor-pointer flex flex-col justify-between ${
                            isSelected
                              ? 'bg-gradient-to-br from-[#FEF3C7] to-[#FDE68A] border-[#D97706] shadow-[0_4px_14px_rgba(217,119,6,0.25)] ring-2 ring-[#D97706]/30'
                              : 'bg-white/80 hover:bg-white border-[#1E1E24]/15 shadow-xs'
                          }`}
                        >
                          <div className="flex items-center justify-between">
                            <span className="font-black text-xs text-[#1E1E24]">{sub.name}</span>
                            {sub.isAvailable ? (
                              <span className="text-[9px] bg-[#10B981] text-white px-2 py-0.5 rounded-full font-black">
                                Live Game
                              </span>
                            ) : (
                              <span className="text-[9px] bg-gray-100 text-[#7E7E8F] px-2 py-0.5 rounded-full font-bold">
                                Coming Soon
                              </span>
                            )}
                          </div>
                          <p className="text-[10px] text-[#4A4A58] mt-1 line-clamp-2 font-medium">
                            {sub.tagline}
                          </p>
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* Class Selection for Guest Demo */}
                <div>
                  <label className="block font-black text-xs text-[#1E1E24] mb-1.5 uppercase tracking-wider">
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
                          className={`py-2 px-2 rounded-xl border text-xs font-black transition-all cursor-pointer ${
                            isSelected
                              ? 'bg-gradient-to-r from-[#7257FF] to-[#5843D8] text-white border-transparent shadow-[0_4px_12px_rgba(114,87,255,0.35)]'
                              : 'bg-white/80 text-[#4A4A58] hover:bg-white border-[#1E1E24]/15'
                          }`}
                        >
                          {cls}
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Course Preview Callout */}
                <div className="p-3.5 rounded-xl bg-[#FAF6EE] border border-[#1E1E24]/15 shadow-xs space-y-1">
                  <div className="flex items-center gap-1.5 text-xs font-black text-[#6C5CE7]">
                    <Zap className="w-3.5 h-3.5 text-[#F59E0B]" />
                    <span>Launching: {selectedGuestSubjectObj.name} ({guestClass})</span>
                  </div>
                  <p className="text-[11px] text-[#4A4A58] font-medium leading-relaxed">
                    Direct access with 5 full player hearts, interactive 2D simulation grid, and Acharya AI mentor.
                  </p>
                </div>

                {/* Launch Action */}
                <div className="pt-2 flex flex-col sm:flex-row items-center gap-3">
                  <button
                    type="button"
                    onClick={handleLaunchGuestDemo}
                    disabled={isSubmitting}
                    className="w-full py-3.5 text-xs sm:text-sm font-black rounded-xl bg-gradient-to-r from-[#FBBF24] via-[#F59E0B] to-[#D97706] text-[#1E1E24] shadow-[0_8px_24px_-4px_rgba(245,158,11,0.4)] hover:shadow-[0_12px_28px_-4px_rgba(245,158,11,0.55)] active:scale-[0.98] transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-60 border border-amber-200/50"
                  >
                    <span>{isSubmitting ? 'Entering Arena...' : `🚀 Start ${selectedGuestSubjectObj.name} as Guest`}</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>

                  <button
                    type="button"
                    onClick={() => setAuthMode('signin')}
                    className="w-full sm:w-auto py-3 px-4 rounded-xl bg-white/80 hover:bg-white text-xs font-black text-[#4A4A58] hover:text-[#1E1E24] border border-[#1E1E24]/15 shrink-0 transition-all cursor-pointer"
                  >
                    ← Back to Login
                  </button>
                </div>
              </div>
            )}

            {/* ========================================================
                VIEW 2: SIGN IN FORM (Premium Glass Input Fields & CTA)
               ======================================================== */}
            {authMode === 'signin' && (
              <form onSubmit={handleSignIn} className="space-y-4 text-xs sm:text-sm">
                <div>
                  <label className="block font-black text-xs text-[#1E1E24] mb-1.5">
                    Email Address
                  </label>
                  <div className="relative group">
                    <Mail className="w-4 h-4 text-[#94A3B8] group-focus-within:text-[#7257FF] absolute left-3.5 top-3.5 transition-colors pointer-events-none" />
                    <input
                      type="email"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      onBlur={() => setEmail((prev) => prev.trim())}
                      placeholder="student@learning.edu"
                      className="w-full pl-10 pr-4 py-3 rounded-xl bg-white/80 border border-[#1E1E24]/20 text-xs sm:text-sm font-bold text-[#1E1E24] placeholder:text-[#94A3B8] focus:bg-white focus:border-[#7257FF] focus:ring-4 focus:ring-[#7257FF]/15 focus:outline-none transition-all shadow-[0_1px_2px_rgba(0,0,0,0.04)]"
                    />
                  </div>
                </div>

                <div>
                  <label className="block font-black text-xs text-[#1E1E24] mb-1.5">
                    Password
                  </label>
                  <div className="relative group">
                    <Lock className="w-4 h-4 text-[#94A3B8] group-focus-within:text-[#7257FF] absolute left-3.5 top-3.5 transition-colors pointer-events-none" />
                    <input
                      type="password"
                      required
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="Enter your database password"
                      className="w-full pl-10 pr-4 py-3 rounded-xl bg-white/80 border border-[#1E1E24]/20 text-xs sm:text-sm font-bold text-[#1E1E24] placeholder:text-[#94A3B8] focus:bg-white focus:border-[#7257FF] focus:ring-4 focus:ring-[#7257FF]/15 focus:outline-none transition-all shadow-[0_1px_2px_rgba(0,0,0,0.04)]"
                    />
                  </div>
                </div>

                {/* Primary Call to Action Button */}
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full py-3.5 px-6 rounded-xl bg-gradient-to-r from-[#7257FF] via-[#6348F0] to-[#5843D8] hover:from-[#7E65FF] hover:to-[#6348F0] text-white font-black text-xs sm:text-sm shadow-[0_8px_24px_-4px_rgba(114,87,255,0.45)] hover:shadow-[0_12px_28px_-4px_rgba(114,87,255,0.6)] active:scale-[0.98] border border-white/20 transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-60 disabled:cursor-not-allowed group mt-2"
                >
                  <span>{isSubmitting ? 'Verifying Credentials...' : 'Verify Credentials & Start Quest'}</span>
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </button>

                <div className="text-center pt-2 text-[#7E7E8F] text-xs font-semibold">
                  Don&apos;t have an account yet?{' '}
                  <button
                    type="button"
                    onClick={() => {
                      setAuthMode('signup');
                      setSignupStep(1);
                    }}
                    className="text-[#6C5CE7] hover:text-[#5843D8] font-black underline cursor-pointer transition-colors"
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
                      className={`w-7 h-7 rounded-xl flex items-center justify-center font-black text-xs border transition-all ${
                        signupStep >= 1
                          ? 'bg-[#7257FF] text-white border-[#7257FF] shadow-[0_2px_8px_rgba(114,87,255,0.35)]'
                          : 'bg-gray-100 text-[#7E7E8F] border-gray-200'
                      }`}
                    >
                      1
                    </div>
                    <span className={`text-xs font-black ${signupStep === 1 ? 'text-[#7257FF]' : 'text-[#7E7E8F]'}`}>
                      Account
                    </span>
                  </div>

                  <div className={`flex-1 h-0.5 mx-3 ${signupStep >= 2 ? 'bg-[#7257FF]' : 'bg-[#1E1E24]/15'}`} />

                  <div className="flex items-center gap-2">
                    <div
                      className={`w-7 h-7 rounded-xl flex items-center justify-center font-black text-xs border transition-all ${
                        signupStep >= 2
                          ? 'bg-[#7257FF] text-white border-[#7257FF] shadow-[0_2px_8px_rgba(114,87,255,0.35)]'
                          : 'bg-gray-100 text-[#7E7E8F] border-gray-200'
                      }`}
                    >
                      2
                    </div>
                    <span className={`text-xs font-black ${signupStep === 2 ? 'text-[#7257FF]' : 'text-[#7E7E8F]'}`}>
                      Class
                    </span>
                  </div>

                  <div className={`flex-1 h-0.5 mx-3 ${signupStep >= 3 ? 'bg-[#7257FF]' : 'bg-[#1E1E24]/15'}`} />

                  <div className="flex items-center gap-2">
                    <div
                      className={`w-7 h-7 rounded-xl flex items-center justify-center font-black text-xs border transition-all ${
                        signupStep >= 3
                          ? 'bg-[#7257FF] text-white border-[#7257FF] shadow-[0_2px_8px_rgba(114,87,255,0.35)]'
                          : 'bg-gray-100 text-[#7E7E8F] border-gray-200'
                      }`}
                    >
                      3
                    </div>
                    <span className={`text-xs font-black ${signupStep === 3 ? 'text-[#7257FF]' : 'text-[#7E7E8F]'}`}>
                      Language
                    </span>
                  </div>
                </div>

                {/* STEP 1: Full Name, Email, Password */}
                {signupStep === 1 && (
                  <form onSubmit={handleProceedToStep2} className="space-y-4 text-xs sm:text-sm">
                    <div>
                      <div className="font-black text-sm text-[#1E1E24] mb-0.5">
                        Step 1: Scholar Identification
                      </div>
                      <p className="text-[#4A4A58] text-xs mb-3 font-medium">
                        Enter your name and login credentials to establish your saved account:
                      </p>
                    </div>

                    <div>
                      <label className="block font-black text-xs text-[#1E1E24] mb-1.5">Full Name</label>
                      <div className="relative group">
                        <User className="w-4 h-4 text-[#94A3B8] group-focus-within:text-[#7257FF] absolute left-3.5 top-3.5 transition-colors pointer-events-none" />
                        <input
                          type="text"
                          required
                          value={fullName}
                          onChange={(e) => setFullName(e.target.value)}
                          placeholder="Aryabhata Sharma"
                          className="w-full pl-10 pr-4 py-3 rounded-xl bg-white/80 border border-[#1E1E24]/20 text-xs sm:text-sm font-bold text-[#1E1E24] placeholder:text-[#94A3B8] focus:bg-white focus:border-[#7257FF] focus:ring-4 focus:ring-[#7257FF]/15 focus:outline-none transition-all shadow-[0_1px_2px_rgba(0,0,0,0.04)]"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block font-black text-xs text-[#1E1E24] mb-1.5">Email Address</label>
                      <div className="relative group">
                        <Mail className="w-4 h-4 text-[#94A3B8] group-focus-within:text-[#7257FF] absolute left-3.5 top-3.5 transition-colors pointer-events-none" />
                        <input
                          type="email"
                          required
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                          onBlur={() => setEmail((prev) => prev.trim())}
                          placeholder="student@learning.edu"
                          className="w-full pl-10 pr-4 py-3 rounded-xl bg-white/80 border border-[#1E1E24]/20 text-xs sm:text-sm font-bold text-[#1E1E24] placeholder:text-[#94A3B8] focus:bg-white focus:border-[#7257FF] focus:ring-4 focus:ring-[#7257FF]/15 focus:outline-none transition-all shadow-[0_1px_2px_rgba(0,0,0,0.04)]"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block font-black text-xs text-[#1E1E24] mb-1.5">Password</label>
                      <div className="relative group">
                        <Lock className="w-4 h-4 text-[#94A3B8] group-focus-within:text-[#7257FF] absolute left-3.5 top-3.5 transition-colors pointer-events-none" />
                        <input
                          type="password"
                          required
                          value={password}
                          onChange={(e) => setPassword(e.target.value)}
                          placeholder="At least 6 characters"
                          className="w-full pl-10 pr-4 py-3 rounded-xl bg-white/80 border border-[#1E1E24]/20 text-xs sm:text-sm font-bold text-[#1E1E24] placeholder:text-[#94A3B8] focus:bg-white focus:border-[#7257FF] focus:ring-4 focus:ring-[#7257FF]/15 focus:outline-none transition-all shadow-[0_1px_2px_rgba(0,0,0,0.04)]"
                        />
                      </div>
                    </div>

                    <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-2">
                      <button
                        type="button"
                        onClick={() => setAuthMode('signin')}
                        className="text-[#7E7E8F] hover:text-[#1E1E24] font-bold text-xs order-2 sm:order-1 cursor-pointer"
                      >
                        Already registered? Sign In
                      </button>
                      <button
                        type="submit"
                        className="w-full sm:w-auto py-3 px-6 rounded-xl bg-gradient-to-r from-[#7257FF] via-[#6348F0] to-[#5843D8] hover:from-[#7E65FF] hover:to-[#6348F0] text-white font-black text-xs sm:text-sm shadow-[0_8px_20px_-4px_rgba(114,87,255,0.4)] flex items-center justify-center gap-1.5 order-1 sm:order-2 cursor-pointer transition-all"
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
                      <div className="font-black text-sm text-[#1E1E24] mb-0.5">
                        Step 2: Select Your Class Standard
                      </div>
                      <p className="text-[#4A4A58] text-xs mb-3 font-medium">
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
                            className={`p-3.5 rounded-xl border transition-all cursor-pointer flex items-center justify-between ${
                              isSelected
                                ? 'bg-gradient-to-r from-[#FEF3C7] to-[#FDE68A] border-[#D97706] shadow-[0_4px_12px_rgba(217,119,6,0.2)] font-black'
                                : 'bg-white/80 hover:bg-white border-[#1E1E24]/15'
                            }`}
                          >
                            <div className="flex items-center gap-2.5">
                              <GraduationCap className={`w-4 h-4 ${isSelected ? 'text-[#D97706]' : 'text-[#7E7E8F]'}`} />
                              <span className="font-black text-xs text-[#1E1E24]">{cls}</span>
                            </div>

                            <span className="text-[10px] text-[#4A4A58] font-semibold">
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
                        className="py-2.5 px-4 rounded-xl bg-white/80 hover:bg-white text-xs font-black text-[#4A4A58] border border-[#1E1E24]/15 cursor-pointer transition-all"
                      >
                        ← Back
                      </button>
                      <button
                        type="button"
                        onClick={handleProceedToStep3}
                        className="py-3 px-6 rounded-xl bg-gradient-to-r from-[#7257FF] via-[#6348F0] to-[#5843D8] hover:from-[#7E65FF] hover:to-[#6348F0] text-white font-black text-xs sm:text-sm shadow-[0_8px_20px_-4px_rgba(114,87,255,0.4)] flex items-center gap-1.5 cursor-pointer transition-all"
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
                      <div className="font-black text-sm text-[#1E1E24] mb-0.5">
                        Step 3: Select Programming Realm
                      </div>
                      <p className="text-[#4A4A58] text-xs mb-3 font-medium">
                        Choose the language you want to learn through playable 2D games and quests:
                      </p>
                    </div>

                    <div>
                      <label className="block font-black text-xs text-[#1E1E24] mb-1.5">
                        Programming Language:
                      </label>
                      <div className="relative">
                        <select
                          value={targetSubject}
                          onChange={(e) => setTargetSubject(e.target.value)}
                          className="w-full appearance-none px-4 py-3 border border-[#1E1E24]/20 rounded-xl bg-white text-xs sm:text-sm font-black text-[#1E1E24] focus:outline-none focus:border-[#7257FF] focus:ring-4 focus:ring-[#7257FF]/15 cursor-pointer pr-10 shadow-xs"
                        >
                          {AVAILABLE_SUBJECTS.map((sub) => (
                            <option key={sub.id} value={sub.id}>
                              {sub.name} — {sub.tagline}
                            </option>
                          ))}
                        </select>
                        <ChevronDown className="w-4 h-4 text-[#1E1E24] absolute right-3.5 top-3.5 pointer-events-none" />
                      </div>
                    </div>

                    <div className="p-3.5 rounded-xl bg-[#FAF6EE] border border-[#1E1E24]/15 space-y-1.5">
                      <div className="flex items-center gap-2 text-xs font-black text-[#6C5CE7]">
                        <Gamepad2 className="w-4 h-4 text-[#EF4444]" />
                        <span>Included Mission: Rescue the Robot with Python Loops</span>
                      </div>
                      <p className="text-[11px] text-[#4A4A58] font-medium leading-relaxed">
                        You will play an animated 2D grid game to steer the robot, collect energy cells, avoid space obstacles, and reach the base beacon.
                      </p>
                    </div>

                    <div className="flex items-center justify-between pt-3">
                      <button
                        type="button"
                        onClick={() => setSignupStep(2)}
                        className="py-2.5 px-4 rounded-xl bg-white/80 hover:bg-white text-xs font-black text-[#4A4A58] border border-[#1E1E24]/15 cursor-pointer transition-all"
                      >
                        ← Back
                      </button>
                      <button
                        type="submit"
                        disabled={isSubmitting}
                        className="py-3.5 px-6 rounded-xl bg-gradient-to-r from-[#FBBF24] via-[#F59E0B] to-[#D97706] text-[#1E1E24] font-black text-xs sm:text-sm shadow-[0_8px_24px_-4px_rgba(245,158,11,0.4)] hover:shadow-[0_12px_28px_-4px_rgba(245,158,11,0.55)] active:scale-[0.98] transition-all flex items-center gap-1.5 cursor-pointer disabled:opacity-60 border border-amber-200/50"
                      >
                        <span>{isSubmitting ? 'Setting up...' : '🚀 Finish Setup & Enter Game Arena'}</span>
                      </button>
                    </div>
                  </form>
                )}
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}
