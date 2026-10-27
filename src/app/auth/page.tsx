// Dronacharya Premium Translucent Gaming Authentication Gateway
// Simplified, completely translucent frosted glass login with Sign In, Sign Up, and Guest Demo
'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import {
  authenticateUser,
  registerUser,
  createGuestSession,
  setActiveSession,
  AVAILABLE_SUBJECTS,
} from '@/lib/db/auth-db';
import { CosmicInteractiveBg } from '@/components/game/CosmicInteractiveBg';
import {
  ArrowRight,
  Sparkles,
  AlertCircle,
  CheckCircle2,
  Lock,
  Eye,
  EyeOff,
  Mail,
  User,
  Gamepad2,
  Zap,
  ArrowLeft,
  ChevronDown,
  Code2,
} from 'lucide-react';

export default function AuthPage() {
  const router = useRouter();

  // Mode: 'signin' | 'signup' | 'guest'
  const [authMode, setAuthMode] = useState<'signin' | 'signup' | 'guest'>('signin');

  // Form Fields
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [selectedSubject, setSelectedSubject] = useState('html');

  // UI Status
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const handleGenerateSafePassword = () => {
    const prefixes = ['Quest', 'Hero', 'Code', 'Drona', 'Arcade', 'Gurukul'];
    const prefix = prefixes[Math.floor(Math.random() * prefixes.length)];
    const num = Math.floor(100 + Math.random() * 900);
    const symbols = ['!', '#', '$', '@', '*'];
    const symbol = symbols[Math.floor(Math.random() * symbols.length)];
    const generated = `${prefix}#${num}${symbol}`;
    setPassword(generated);
    setShowPassword(true);
  };

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const params = new URLSearchParams(window.location.search);
      const modeParam = params.get('mode');
      if (modeParam === 'signup' || modeParam === 'signin' || modeParam === 'guest') {
        setAuthMode(modeParam);
      }
    }
    const session =
      typeof window !== 'undefined'
        ? localStorage.getItem('dronacharya_active_session_v2')
        : null;
    if (session) {
      window.location.href = '/';
    }
  }, []);

  // Sync document title with active auth mode
  useEffect(() => {
    if (authMode === 'signin') {
      document.title = 'Sign In ⋆˙⟡ Dronacharya';
    } else if (authMode === 'signup') {
      document.title = 'Sign Up ⋆˙⟡ Dronacharya';
    } else {
      document.title = 'Guest Demo ⋆˙⟡ Dronacharya';
    }
  }, [authMode]);

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
      setSuccessMsg(`Welcome back, ${result.user.name}! Entering realm...`);
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

  // Handle standard user Sign Up (Clean, single-step)
  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);
    setSuccessMsg(null);

    if (!fullName.trim()) {
      setErrorMsg('Please enter your adventurer name.');
      return;
    }

    const cleanEmail = email.trim();
    setEmail(cleanEmail);
    if (!cleanEmail || !cleanEmail.includes('@')) {
      setErrorMsg('Please enter a valid email address.');
      return;
    }

    if (password.length < 6) {
      setErrorMsg('Password must be at least 6 characters.');
      return;
    }

    setIsSubmitting(true);

    const result = await registerUser({
      name: fullName.trim(),
      email: cleanEmail,
      password,
      studentClass: 'Class 10',
      targetSubject: selectedSubject,
    });
    setIsSubmitting(false);

    if (result.success && result.user) {
      setSuccessMsg(`Account established! Welcome, ${result.user.name}!`);
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
  const handleLaunchGuestDemo = (subjectId?: string) => {
    const sub = subjectId || selectedSubject || 'html';
    setIsSubmitting(true);
    setSuccessMsg('Launching Instant Guest Demo...');

    createGuestSession(sub, 'Class 10');
    window.dispatchEvent(new Event('dronacharya_session_change'));
    window.dispatchEvent(new Event('storage'));

    setTimeout(() => {
      window.location.href = '/courses';
    }, 300);
  };

  // Active playable subjects (HTML, CSS, JavaScript, Python)
  const activeSubjects = AVAILABLE_SUBJECTS.filter((s) => !s.isComingSoon);

  return (
    <div className="fixed inset-0 z-50 bg-[#080B14] text-white flex flex-col overflow-y-auto antialiased select-none">
      {/* 1. Sleek Top Header Navigation */}
      <header className="relative z-20 w-full px-4 sm:px-8 h-16 flex items-center justify-between border-b border-white/10 bg-[#080B14]/70 backdrop-blur-md shrink-0">
        <Link href="/" className="flex items-center gap-2.5 group">
          <img
            src="/logo.png"
            alt="Dronacharya Logo"
            className="w-9 h-9 rounded-xl border border-white/20 object-cover shadow-[0_0_15px_rgba(108,92,231,0.4)] group-hover:scale-105 transition-transform bg-[#FAF6EE]"
          />
          <div className="flex flex-col">
            <span className="font-serif font-black text-base sm:text-lg text-white tracking-tight leading-none flex items-center gap-1.5">
              DRONACHARYA ⋆˙⟡
              <span className="w-2 h-2 rounded-full bg-[#10B981] animate-ping" />
            </span>
            <span className="text-[9px] tracking-widest uppercase text-[#FFC83D] font-black mt-0.5">
              Coding Adventure
            </span>
          </div>
        </Link>

        <Link
          href="/"
          className="btn-arcade btn-arcade-dark px-4 py-2 text-xs flex items-center gap-1.5"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Return to Portal</span>
        </Link>
      </header>

      {/* 2. Interactive Cosmic Grid Background with 3D Parallax */}
      <CosmicInteractiveBg />

      {/* 3. Center Authentication Card (Completely Translucent Frosted Glass, No Side Boxes) */}
      <main className="relative z-10 flex-1 flex items-center justify-center py-8 px-4 sm:px-6 my-auto w-full max-w-xl mx-auto">
        <div
          className="w-full rounded-3xl p-6 sm:p-9 border border-white/20 relative overflow-hidden backdrop-blur-2xl transition-all"
          style={{
            backgroundColor: 'rgba(15, 23, 42, 0.42)',
            backdropFilter: 'blur(30px) saturate(190%)',
            WebkitBackdropFilter: 'blur(30px) saturate(190%)',
            boxShadow: '0 8px 32px 0 rgba(0, 0, 0, 0.45)',
          }}
        >
          {/* Subtle Ambient Radial Highlight inside card */}
          <div className="absolute -top-24 -left-24 w-48 h-48 bg-[#6C5CE7]/20 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute -bottom-24 -right-24 w-48 h-48 bg-[#00B894]/20 rounded-full blur-3xl pointer-events-none" />

          {/* Brand Logo & Header */}
          <div className="text-center mb-6 relative z-10">
            <img
              src="/logo.png"
              alt="Dronacharya Logo"
              className="w-14 h-14 rounded-2xl border-2 border-white/30 object-cover shadow-[0_0_25px_rgba(108,92,231,0.6)] mb-3 mx-auto bg-[#FAF6EE]"
            />

            <h1 className="font-serif font-black text-2xl sm:text-3xl text-white tracking-tight">
              {authMode === 'guest'
                ? 'Guest Demo'
                : authMode === 'signup'
                ? 'Create Account'
                : 'Sign In'}
            </h1>

            <p className="text-xs sm:text-sm text-gray-300 font-medium mt-1.5 max-w-sm mx-auto">
              {authMode === 'guest'
                ? 'Explore all realms and interactive studios with zero signup required.'
                : authMode === 'signup'
                ? 'Embark on RPG quests, earn XP, and unlock verifiable achievements.'
                : 'Enter your credentials to load your saved progress and rank.'}
            </p>
          </div>

          {/* Simple 3-Tab Switcher: Sign In | Sign Up | Guest Demo */}
          <div className="flex bg-black/40 p-1.5 rounded-2xl border border-white/15 mb-6 relative z-10">
            <button
              type="button"
              onClick={() => {
                setAuthMode('signin');
                setErrorMsg(null);
                setSuccessMsg(null);
              }}
              className={`flex-1 py-2 text-xs font-bold rounded-xl transition-all ${
                authMode === 'signin'
                  ? 'bg-white/20 text-white border border-white/30 shadow-sm'
                  : 'text-gray-400 hover:text-white hover:bg-white/5 border border-transparent'
              }`}
            >
              Sign In
            </button>

            <button
              type="button"
              onClick={() => {
                setAuthMode('signup');
                setErrorMsg(null);
                setSuccessMsg(null);
              }}
              className={`flex-1 py-2 text-xs font-bold rounded-xl transition-all ${
                authMode === 'signup'
                  ? 'bg-white/20 text-white border border-white/30 shadow-sm'
                  : 'text-gray-400 hover:text-white hover:bg-white/5 border border-transparent'
              }`}
            >
              Sign Up
            </button>

            <button
              type="button"
              onClick={() => {
                setAuthMode('guest');
                setErrorMsg(null);
                setSuccessMsg(null);
              }}
              className={`flex-1 py-2 text-xs font-bold rounded-xl transition-all flex items-center justify-center gap-1.5 ${
                authMode === 'guest'
                  ? 'bg-[#FFD214]/25 text-[#FFD214] border border-[#FFD214]/40 shadow-sm'
                  : 'text-gray-400 hover:text-white hover:bg-white/5 border border-transparent'
              }`}
            >
              <Zap className="w-3.5 h-3.5 text-[#FFD214]" />
              <span>Guest Demo</span>
            </button>
          </div>

          {/* Feedback Alerts */}
          {errorMsg && (
            <div className="mb-5 p-3.5 rounded-xl bg-rose-500/20 border border-rose-500/40 text-xs text-rose-200 font-bold flex items-start gap-2.5 animate-in fade-in relative z-10">
              <AlertCircle className="w-4 h-4 shrink-0 mt-0.5 text-rose-400" />
              <span>{errorMsg}</span>
            </div>
          )}

          {successMsg && (
            <div className="mb-5 p-3.5 rounded-xl bg-emerald-500/20 border border-emerald-500/40 text-xs text-emerald-200 font-bold flex items-center gap-2.5 animate-in fade-in relative z-10">
              <CheckCircle2 className="w-4 h-4 shrink-0 text-emerald-400" />
              <span>{successMsg}</span>
            </div>
          )}

          {/* ========================================================
              TAB 1: SIGN IN FORM
             ======================================================== */}
          {authMode === 'signin' && (
            <form onSubmit={handleSignIn} className="space-y-4 relative z-10">
              <div>
                <label className="block text-xs font-bold text-gray-200 mb-1.5">
                  Email Address
                </label>
                <div className="relative">
                  <Mail className="w-4 h-4 text-gray-400 absolute left-3.5 top-3" />
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    onBlur={() => setEmail((e) => e.trim())}
                    placeholder="explorer@gurukul.edu"
                    className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-white/[0.07] border border-white/20 text-xs sm:text-sm text-white placeholder-gray-400 focus:outline-none focus:border-[#6C5CE7] focus:bg-white/[0.12] transition-colors"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-200 mb-1.5">
                  Password
                </label>
                <div className="relative">
                  <Lock className="w-4 h-4 text-gray-400 absolute left-3.5 top-3" />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    required
                    autoComplete="current-password"
                    data-lpignore="true"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full pl-10 pr-10 py-2.5 rounded-xl bg-white/[0.07] border border-white/20 text-xs sm:text-sm text-white placeholder-gray-400 focus:outline-none focus:border-[#6C5CE7] focus:bg-white/[0.12] transition-colors"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3.5 top-3 text-gray-400 hover:text-white cursor-pointer"
                    tabIndex={-1}
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full btn-arcade btn-arcade-purple py-3 px-6 text-xs sm:text-sm flex items-center justify-center gap-2 mt-2"
              >
                <span>{isSubmitting ? 'Signing in...' : 'Sign In to Quest'}</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </form>
          )}

          {/* ========================================================
              TAB 2: SIGN UP FORM (Clean, Single Step)
             ======================================================== */}
          {authMode === 'signup' && (
            <form onSubmit={handleSignUp} className="space-y-4 relative z-10">
              <div>
                <label className="block text-xs font-bold text-gray-200 mb-1.5">
                  Adventurer Name
                </label>
                <div className="relative">
                  <User className="w-4 h-4 text-gray-400 absolute left-3.5 top-3" />
                  <input
                    type="text"
                    required
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    placeholder="e.g. Arjun Dev"
                    className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-white/[0.07] border border-white/20 text-xs sm:text-sm text-white placeholder-gray-400 focus:outline-none focus:border-[#6C5CE7] focus:bg-white/[0.12] transition-colors"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-200 mb-1.5">
                  Email Address
                </label>
                <div className="relative">
                  <Mail className="w-4 h-4 text-gray-400 absolute left-3.5 top-3" />
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    onBlur={() => setEmail((e) => e.trim())}
                    placeholder="arjun@adventure.io"
                    className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-white/[0.07] border border-white/20 text-xs sm:text-sm text-white placeholder-gray-400 focus:outline-none focus:border-[#6C5CE7] focus:bg-white/[0.12] transition-colors"
                  />
                </div>
              </div>

              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <label className="block text-xs font-bold text-gray-200">
                    Password (min 6 characters)
                  </label>
                  <button
                    type="button"
                    onClick={handleGenerateSafePassword}
                    className="text-[10px] text-[#FFD214] hover:underline font-bold flex items-center gap-1 cursor-pointer bg-white/10 px-2 py-0.5 rounded-md border border-white/20"
                  >
                    <span>🎲 Safe Password</span>
                  </button>
                </div>
                <div className="relative">
                  <Lock className="w-4 h-4 text-gray-400 absolute left-3.5 top-3" />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    required
                    autoComplete="new-password"
                    data-lpignore="true"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full pl-10 pr-10 py-2.5 rounded-xl bg-white/[0.07] border border-white/20 text-xs sm:text-sm text-white placeholder-gray-400 focus:outline-none focus:border-[#6C5CE7] focus:bg-white/[0.12] transition-colors"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3.5 top-3 text-gray-400 hover:text-white cursor-pointer"
                    tabIndex={-1}
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-200 mb-1.5">
                  Starting Realm Track
                </label>
                <div className="grid grid-cols-2 gap-2">
                  {activeSubjects.map((s) => {
                    const isSelected = selectedSubject === s.id;
                    return (
                      <button
                        type="button"
                        key={s.id}
                        onClick={() => setSelectedSubject(s.id)}
                        className={`p-2.5 rounded-xl border text-left transition-all ${
                          isSelected
                            ? 'bg-[#6C5CE7]/30 border-[#6C5CE7] text-white'
                            : 'bg-white/[0.05] border-white/10 text-gray-300 hover:bg-white/10'
                        }`}
                      >
                        <span className="block text-xs font-bold">{s.name}</span>
                        <span className="text-[10px] text-gray-400 truncate block">
                          {s.tagline}
                        </span>
                      </button>
                    );
                  })}
                </div>
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full btn-arcade btn-arcade-purple py-3 px-6 text-xs sm:text-sm flex items-center justify-center gap-2 mt-3"
              >
                <span>{isSubmitting ? 'Creating account...' : 'Create Account & Begin Quest'}</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </form>
          )}

          {/* ========================================================
              TAB 3: GUEST DEMO (Fast 1-Click Launch)
             ======================================================== */}
          {authMode === 'guest' && (
            <div className="space-y-5 relative z-10">
              <div className="p-3.5 rounded-2xl bg-[#FFD214]/10 border border-[#FFD214]/30 text-xs text-amber-200 leading-relaxed">
                ⚡ <strong>Instant Exploration:</strong> Jump straight into live coding quests, interactive test assertions, and 2D mini-game simulators without creating an account.
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-200 mb-2">
                  Choose Realm to Start:
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                  {activeSubjects.map((s) => {
                    const isSelected = selectedSubject === s.id;
                    return (
                      <div
                        key={s.id}
                        onClick={() => setSelectedSubject(s.id)}
                        className={`p-3.5 rounded-2xl border cursor-pointer transition-all flex flex-col justify-between ${
                          isSelected
                            ? 'bg-[#FFD214]/20 border-[#FFD214] text-white shadow-[0_0_15px_rgba(255,210,20,0.25)]'
                            : 'bg-white/[0.05] border-white/15 text-gray-300 hover:bg-white/10'
                        }`}
                      >
                        <div className="flex items-center justify-between">
                          <span className="font-black text-xs text-white">{s.name}</span>
                          <span className="text-[10px] font-mono font-bold text-[#00B894] bg-[#00B894]/20 px-1.5 py-0.5 rounded">
                            Playable
                          </span>
                        </div>
                        <span className="text-[11px] text-gray-400 mt-1 line-clamp-1">
                          {s.tagline}
                        </span>
                      </div>
                    );
                  })}
                </div>
              </div>

              <button
                type="button"
                onClick={() => handleLaunchGuestDemo(selectedSubject)}
                disabled={isSubmitting}
                className="w-full btn-arcade btn-arcade-gold py-3.5 px-6 text-xs sm:text-sm flex items-center justify-center gap-2"
              >
                <Zap className="w-4 h-4 fill-current" />
                <span>{isSubmitting ? 'Entering realm...' : 'Enter as Guest Explorer Now →'}</span>
              </button>
            </div>
          )}

          {/* Quick Switch Text Link */}
          <div className="mt-6 text-center text-xs text-gray-400 relative z-10">
            {authMode === 'signin' ? (
              <p>
                Don&apos;t have an account?{' '}
                <button
                  type="button"
                  onClick={() => setAuthMode('signup')}
                  className="text-[#FFD214] hover:underline font-bold cursor-pointer"
                >
                  Create one for free
                </button>
                {' or '}
                <button
                  type="button"
                  onClick={() => setAuthMode('guest')}
                  className="text-emerald-400 hover:underline font-bold cursor-pointer"
                >
                  Try guest demo
                </button>
              </p>
            ) : authMode === 'signup' ? (
              <p>
                Already have an account?{' '}
                <button
                  type="button"
                  onClick={() => setAuthMode('signin')}
                  className="text-[#FFD214] hover:underline font-bold cursor-pointer"
                >
                  Sign in here
                </button>
              </p>
            ) : (
              <p>
                Want to save permanent progress?{' '}
                <button
                  type="button"
                  onClick={() => setAuthMode('signup')}
                  className="text-[#FFD214] hover:underline font-bold cursor-pointer"
                >
                  Sign up for an account
                </button>
              </p>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}
