// Dronacharya Authentication & Registration Gateway with Interactive Cosmic Background
// Includes Guest Demo mode (no credentials required) with immediate Course Selection & Launch
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
  ShieldCheck,
  ArrowRight,
  BookOpen,
  GraduationCap,
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
  Terminal,
  Code2,
  Globe,
  RotateCcw,
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
      setSuccessMsg(`Welcome, ${result.user.name}! Your game arena is ready.`);
      setActiveSession(result.user, result.session);
      window.dispatchEvent(new Event('dronacharya_session_change'));
      window.dispatchEvent(new Event('storage'));
      setTimeout(() => {
        window.location.href = '/';
      }, 300);
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
    <div className="fixed inset-0 z-50 bg-[#090A0F] text-white flex flex-col overflow-y-auto">
      {/* 1. Sleek Top Header Navigation on Auth */}
      <div className="relative z-20 w-full px-4 sm:px-6 h-16 flex items-center justify-between border-b-2 border-white/10 bg-[#090A0F]/80 backdrop-blur-md shrink-0">
        <Link href="/" className="flex items-center gap-2.5 group">
          <div className="w-9 h-9 rounded-xl bg-[#6C5CE7] text-white flex items-center justify-center font-serif text-lg font-bold border-2 border-white/20 shadow-[2px_2px_0px_#1E1E24]">
            द्रो
          </div>
          <div className="flex flex-col">
            <span className="font-serif font-black text-base sm:text-lg text-white tracking-tight leading-none flex items-center gap-1.5">
              DRONACHARYA
              <span className="w-2 h-2 rounded-full bg-[#10B981] animate-ping" />
            </span>
            <span className="text-[9px] tracking-widest uppercase text-[#FBBF24] font-black mt-0.5">
              Coding Adventure
            </span>
          </div>
        </Link>

        <Link
          href="/"
          className="btn-game-white text-xs py-1.5 px-3.5 font-black flex items-center gap-1 shadow-[2px_2px_0px_#1E1E24]"
        >
          ← Return to Portal
        </Link>
      </div>

      {/* 2. Interactive Cosmic Space Background (Active strictly on auth page) */}
      <CosmicInteractiveBg />

      {/* 3. Center Authentication & Guest Demo Card */}
      <div className="relative z-10 flex-1 flex items-center justify-center py-10 px-4 sm:px-6">
        <div className="w-full max-w-xl card-game bg-white p-6 sm:p-8 shadow-[8px_8px_0px_#1E1E24] border-2 border-[#1E1E24] rounded-2xl animate-in fade-in zoom-in-95 duration-200 text-[#1E1E24]">
        {/* Brand Header */}
        <div className="text-center mb-5">
          <div className="w-12 h-12 mx-auto rounded-xl bg-[#6C5CE7] text-white flex items-center justify-center font-serif text-2xl font-bold border-2 border-[#1E1E24] shadow-[3px_3px_0px_#1E1E24] mb-2.5">
            द्रो
          </div>
          <h1 className="font-serif font-black text-2xl sm:text-3xl text-[#1E1E24]">
            {authMode === 'guest'
              ? 'Guest Demo: Select Your Course'
              : authMode === 'signup'
              ? 'Begin Your Coding Adventure'
              : 'Sign In to Your Quest'}
          </h1>
          <p className="text-xs sm:text-sm text-[#4A4A58] font-bold mt-1 max-w-md mx-auto">
            {authMode === 'guest'
              ? 'No registration needed. Choose your programming track to start playing immediately.'
              : authMode === 'signup'
              ? 'Complete 3 quick steps to tailor your interactive programming world.'
              : 'Enter your credentials to load your saved progress & character state.'}
          </p>
        </div>

        {/* Guest Demo Quick Callout Banner (shown on signin/signup) */}
        {authMode !== 'guest' && (
          <div className="mb-5 p-3.5 rounded-xl bg-[#FBBF24]/20 border-2 border-[#1E1E24] shadow-[3px_3px_0px_#1E1E24] flex flex-col sm:flex-row sm:items-center justify-between gap-2.5">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-[#FBBF24] border border-[#1E1E24] flex items-center justify-center text-[#1E1E24] shrink-0 font-black">
                <Gamepad2 className="w-4 h-4" />
              </div>
              <div>
                <div className="font-black text-xs text-[#1E1E24] flex items-center gap-1.5">
                  <span>Want to play immediately without signing in?</span>
                  <span className="text-[10px] bg-[#10B981] text-white px-1.5 py-0.2 rounded font-black">Free</span>
                </div>
                <div className="text-[11px] text-[#4A4A58] font-medium">
                  Jump directly to course selection & interactive 2D gameplay.
                </div>
              </div>
            </div>

            <button
              type="button"
              onClick={() => {
                setAuthMode('guest');
                setErrorMsg(null);
              }}
              className="btn-game-yellow py-1.5 px-3.5 text-xs font-black shadow-[2px_2px_0px_#1E1E24] shrink-0 flex items-center justify-center gap-1"
            >
              <Play className="w-3.5 h-3.5 fill-[#1E1E24]" />
              <span>Guest Demo</span>
            </button>
          </div>
        )}

        {/* Tab Switcher (Sign In vs New Apprentice vs Guest Demo) */}
        <div className="flex border-b-2 border-[#1E1E24] mb-5">
          <button
            type="button"
            onClick={() => {
              setAuthMode('signin');
              setErrorMsg(null);
            }}
            className={`flex-1 py-2 text-xs font-black border-b-2 transition-all cursor-pointer ${
              authMode === 'signin'
                ? 'border-[#6C5CE7] text-[#6C5CE7]'
                : 'border-transparent text-[#7E7E8F] hover:text-[#1E1E24]'
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
            className={`flex-1 py-2 text-xs font-black border-b-2 transition-all cursor-pointer ${
              authMode === 'signup'
                ? 'border-[#6C5CE7] text-[#6C5CE7]'
                : 'border-transparent text-[#7E7E8F] hover:text-[#1E1E24]'
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
            className={`flex-1 py-2 text-xs font-black border-b-2 transition-all cursor-pointer flex items-center justify-center gap-1 ${
              authMode === 'guest'
                ? 'border-[#FBBF24] text-[#D97706] bg-[#FEF3C7]/40'
                : 'border-transparent text-[#7E7E8F] hover:text-[#1E1E24]'
            }`}
          >
            <Gamepad2 className="w-3.5 h-3.5 text-[#F59E0B]" />
            <span>Guest Demo</span>
          </button>
        </div>

        {/* Feedback Alerts */}
        {errorMsg && (
          <div className="mb-4 p-3 rounded-xl bg-[#FEE2E2] border-2 border-[#EF4444] text-xs text-[#DC2626] font-black flex items-start gap-2 shadow-[2px_2px_0px_#EF4444]">
            <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
            <span>{errorMsg}</span>
          </div>
        )}

        {successMsg && (
          <div className="mb-4 p-3 rounded-xl bg-[#D1FAE5] border-2 border-[#10B981] text-xs text-[#059669] font-black flex items-center gap-2 shadow-[2px_2px_0px_#10B981]">
            <CheckCircle2 className="w-4 h-4 shrink-0" />
            <span>{successMsg}</span>
          </div>
        )}

        {/* ========================================================
            VIEW 1: GUEST DEMO — SELECT COURSE & LAUNCH DIRECTLY
           ======================================================== */}
        {authMode === 'guest' && (
          <div className="space-y-4">
            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="font-black text-xs text-[#1E1E24] uppercase tracking-wider">
                  1. Choose Your Programming Course:
                </label>
                <span className="text-[10px] bg-[#10B981] text-white font-black px-2 py-0.5 rounded border border-[#1E1E24]">
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
                      className={`p-3 rounded-xl border-2 border-[#1E1E24] cursor-pointer transition-all flex flex-col justify-between ${
                        isSelected
                          ? 'bg-[#FBBF24] shadow-[3px_3px_0px_#1E1E24] font-black'
                          : 'bg-white hover:bg-[#FAF6EE] shadow-[2px_2px_0px_#1E1E24]'
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <span className="font-black text-xs text-[#1E1E24]">{sub.name}</span>
                        {sub.isAvailable ? (
                          <span className="text-[9px] bg-[#10B981] text-white px-1.5 py-0.2 rounded font-black">
                            Live Game
                          </span>
                        ) : (
                          <span className="text-[9px] bg-[#FAF6EE] border border-[#1E1E24] text-[#7E7E8F] px-1.5 py-0.2 rounded font-bold">
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
                      className={`py-2 px-2 rounded-xl border-2 border-[#1E1E24] text-xs font-black transition-all ${
                        isSelected
                          ? 'bg-[#6C5CE7] text-white shadow-[2px_2px_0px_#1E1E24]'
                          : 'bg-white text-[#4A4A58] hover:bg-[#FAF6EE] shadow-[1px_1px_0px_#1E1E24]'
                      }`}
                    >
                      {cls}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Course Preview Callout */}
            <div className="p-3.5 rounded-xl bg-[#FAF6EE] border-2 border-[#1E1E24] shadow-[2px_2px_0px_#1E1E24] space-y-1">
              <div className="flex items-center gap-1.5 text-xs font-black text-[#6C5CE7]">
                <Zap className="w-3.5 h-3.5 text-[#FBBF24]" />
                <span>Launching: {selectedGuestSubjectObj.name} ({guestClass})</span>
              </div>
              <p className="text-[11px] text-[#4A4A58] font-medium leading-relaxed">
                Direct access with full 5/5 player hearts, interactive 2D simulation grid, and Acharya AI mentor.
              </p>
            </div>

            {/* Launch Action */}
            <div className="pt-2 flex flex-col sm:flex-row items-center gap-3">
              <button
                type="button"
                onClick={handleLaunchGuestDemo}
                disabled={isSubmitting}
                className="btn-game-yellow w-full py-3 text-xs font-black shadow-[4px_4px_0px_#1E1E24] flex items-center justify-center gap-2"
              >
                <span>{isSubmitting ? 'Entering Arena...' : `🚀 Start ${selectedGuestSubjectObj.name} as Guest`}</span>
                <ArrowRight className="w-4 h-4" />
              </button>

              <button
                type="button"
                onClick={() => setAuthMode('signin')}
                className="btn-game-white w-full sm:w-auto py-2.5 px-4 text-xs font-black shrink-0"
              >
                ← Back to Login
              </button>
            </div>
          </div>
        )}

        {/* ========================================================
            VIEW 2: SIGN IN FORM
           ======================================================== */}
        {authMode === 'signin' && (
          <form onSubmit={handleSignIn} className="space-y-4 text-xs">
            <div>
              <label className="block font-bold text-[#1E1E24] mb-1">Email Address</label>
              <div className="relative">
                <Mail className="w-4 h-4 text-[#7E7E8F] absolute left-3 top-2.5" />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  onBlur={() => setEmail((prev) => prev.trim())}
                  placeholder="student@learning.edu"
                  className="w-full pl-9 pr-3 py-2 border-2 border-[#1E1E24] rounded-xl bg-[#FAF6EE] focus:bg-white focus:outline-none font-bold"
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
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter your database password"
                  className="w-full pl-9 pr-3 py-2 border-2 border-[#1E1E24] rounded-xl bg-[#FAF6EE] focus:bg-white focus:outline-none font-bold"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="btn-game-purple w-full py-2.5 text-xs shadow-[3px_3px_0px_#1E1E24] mt-2 font-black flex items-center justify-center gap-1.5"
            >
              <span>{isSubmitting ? 'Verifying...' : 'Verify Credentials & Start Quest'}</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>

            <div className="text-center pt-2 text-[#7E7E8F] font-bold">
              Don&apos;t have an account yet?{' '}
              <button
                type="button"
                onClick={() => {
                  setAuthMode('signup');
                  setSignupStep(1);
                }}
                className="text-[#6C5CE7] font-black underline cursor-pointer"
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
            <div className="flex items-center justify-between mb-6 px-2">
              <div className="flex items-center gap-1.5">
                <div
                  className={`w-7 h-7 rounded-xl flex items-center justify-center font-black text-xs border-2 border-[#1E1E24] shadow-[1.5px_1.5px_0px_#1E1E24] ${
                    signupStep >= 1 ? 'bg-[#6C5CE7] text-white' : 'bg-[#E8E1D2] text-[#7E7E8F]'
                  }`}
                >
                  1
                </div>
                <span className={`text-xs font-black ${signupStep === 1 ? 'text-[#6C5CE7]' : 'text-[#7E7E8F]'}`}>
                  Account
                </span>
              </div>

              <div className={`flex-1 h-0.5 mx-2 ${signupStep >= 2 ? 'bg-[#6C5CE7]' : 'bg-[#1E1E24]/20'}`} />

              <div className="flex items-center gap-1.5">
                <div
                  className={`w-7 h-7 rounded-xl flex items-center justify-center font-black text-xs border-2 border-[#1E1E24] shadow-[1.5px_1.5px_0px_#1E1E24] ${
                    signupStep >= 2 ? 'bg-[#6C5CE7] text-white' : 'bg-[#E8E1D2] text-[#7E7E8F]'
                  }`}
                >
                  2
                </div>
                <span className={`text-xs font-black ${signupStep === 2 ? 'text-[#6C5CE7]' : 'text-[#7E7E8F]'}`}>
                  Class
                </span>
              </div>

              <div className={`flex-1 h-0.5 mx-2 ${signupStep >= 3 ? 'bg-[#6C5CE7]' : 'bg-[#1E1E24]/20'}`} />

              <div className="flex items-center gap-1.5">
                <div
                  className={`w-7 h-7 rounded-xl flex items-center justify-center font-black text-xs border-2 border-[#1E1E24] shadow-[1.5px_1.5px_0px_#1E1E24] ${
                    signupStep >= 3 ? 'bg-[#6C5CE7] text-white' : 'bg-[#E8E1D2] text-[#7E7E8F]'
                  }`}
                >
                  3
                </div>
                <span className={`text-xs font-black ${signupStep === 3 ? 'text-[#6C5CE7]' : 'text-[#7E7E8F]'}`}>
                  Language
                </span>
              </div>
            </div>

            {/* STEP 1: Full Name, Email, Password */}
            {signupStep === 1 && (
              <form onSubmit={handleProceedToStep2} className="space-y-4 text-xs">
                <div>
                  <div className="font-black text-sm text-[#1E1E24] mb-1">
                    Step 1: Scholar Identification
                  </div>
                  <p className="text-[#4A4A58] text-[11px] mb-3">
                    Enter your name and login credentials to establish your saved account:
                  </p>
                </div>

                <div>
                  <label className="block font-bold text-[#1E1E24] mb-1">Full Name</label>
                  <div className="relative">
                    <User className="w-4 h-4 text-[#7E7E8F] absolute left-3 top-2.5" />
                    <input
                      type="text"
                      required
                      value={fullName}
                      onChange={(e) => setFullName(e.target.value)}
                      placeholder="Aryabhata Sharma"
                      className="w-full pl-9 pr-3 py-2 border-2 border-[#1E1E24] rounded-xl bg-[#FAF6EE] focus:bg-white focus:outline-none font-bold"
                    />
                  </div>
                </div>

                <div>
                  <label className="block font-bold text-[#1E1E24] mb-1">Email Address</label>
                  <div className="relative">
                    <Mail className="w-4 h-4 text-[#7E7E8F] absolute left-3 top-2.5" />
                    <input
                      type="email"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      onBlur={() => setEmail((prev) => prev.trim())}
                      placeholder="student@learning.edu"
                      className="w-full pl-9 pr-3 py-2 border-2 border-[#1E1E24] rounded-xl bg-[#FAF6EE] focus:bg-white focus:outline-none font-bold"
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
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="At least 6 characters"
                      className="w-full pl-9 pr-3 py-2 border-2 border-[#1E1E24] rounded-xl bg-[#FAF6EE] focus:bg-white focus:outline-none font-bold"
                    />
                  </div>
                </div>

                <div className="flex items-center justify-between pt-2">
                  <button
                    type="button"
                    onClick={() => setAuthMode('signin')}
                    className="text-[#7E7E8F] hover:text-[#1E1E24] font-bold text-xs"
                  >
                    Already registered? Sign In
                  </button>
                  <button
                    type="submit"
                    className="btn-game-purple py-2 px-5 text-xs shadow-[3px_3px_0px_#1E1E24] flex items-center gap-1.5"
                  >
                    <span>Continue to Step 2: Select Class</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </form>
            )}

            {/* STEP 2: CLASS STANDARD SELECTION (Strictly up to 12th Pass) */}
            {signupStep === 2 && (
              <div className="space-y-4 text-xs">
                <div>
                  <div className="font-black text-sm text-[#1E1E24] mb-1">
                    Step 2: Select Your Class Standard
                  </div>
                  <p className="text-[#4A4A58] text-[11px] mb-3">
                    Curriculum is strictly tailored up to 12th Pass (no irrelevant university topics):
                  </p>
                </div>

                <div className="grid grid-cols-1 gap-2.5">
                  {AVAILABLE_CLASSES.map((cls) => {
                    const isSelected = studentClass === cls;
                    return (
                      <div
                        key={cls}
                        onClick={() => setStudentClass(cls)}
                        className={`p-3 rounded-xl border-2 border-[#1E1E24] cursor-pointer transition-all flex items-center justify-between ${
                          isSelected
                            ? 'bg-[#FBBF24] shadow-[3px_3px_0px_#1E1E24] font-black'
                            : 'bg-white hover:bg-[#F2ECE0] shadow-[2px_2px_0px_#1E1E24]'
                        }`}
                      >
                        <div className="flex items-center gap-2.5">
                          <span className="font-black text-xs text-[#1E1E24]">{cls}</span>
                        </div>

                        <span className="text-[10px] text-[#4A4A58] font-bold">
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
                    className="btn-game-white py-2 px-4 text-xs font-black"
                  >
                    ← Back
                  </button>
                  <button
                    type="button"
                    onClick={handleProceedToStep3}
                    className="btn-game-purple py-2 px-5 text-xs shadow-[3px_3px_0px_#1E1E24] flex items-center gap-1.5"
                  >
                    <span>Continue to Step 3: Select Language</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            )}

            {/* STEP 3: PROGRAMMING LANGUAGE IN DROPDOWN BUTTON */}
            {signupStep === 3 && (
              <form onSubmit={handleFinalSignUp} className="space-y-4 text-xs">
                <div>
                  <div className="font-black text-sm text-[#1E1E24] mb-1">
                    Step 3: Select Programming Realm
                  </div>
                  <p className="text-[#4A4A58] text-[11px] mb-3">
                    Choose the language you want to learn through playable 2D games and quests:
                  </p>
                </div>

                <div>
                  <label className="block font-black text-[#1E1E24] mb-1.5">
                    Programming Language (Select from dropdown):
                  </label>
                  <div className="relative">
                    <select
                      value={targetSubject}
                      onChange={(e) => setTargetSubject(e.target.value)}
                      className="w-full appearance-none px-3.5 py-2.5 border-2 border-[#1E1E24] rounded-xl bg-white text-xs font-black text-[#1E1E24] focus:outline-none shadow-[3px_3px_0px_#1E1E24] cursor-pointer pr-10"
                    >
                      {AVAILABLE_SUBJECTS.map((sub) => (
                        <option key={sub.id} value={sub.id}>
                          {sub.name} — {sub.tagline}
                        </option>
                      ))}
                    </select>
                    <ChevronDown className="w-4 h-4 text-[#1E1E24] absolute right-3.5 top-3 pointer-events-none" />
                  </div>
                </div>

                <div className="p-3.5 rounded-xl bg-[#FAF6EE] border-2 border-[#1E1E24] shadow-[3px_3px_0px_#1E1E24] space-y-1.5">
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
                    className="btn-game-white py-2 px-4 text-xs font-black"
                  >
                    ← Back
                  </button>
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="btn-game-yellow py-2.5 px-6 text-xs font-black shadow-[4px_4px_0px_#1E1E24] flex items-center gap-1.5"
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
  </div>
  );
}
