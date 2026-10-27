// Dronacharya Authentication Gateway (Sign In, Sign Up, Guest Demo)
// Matches the warm Gurukul adventure realm background and aesthetic
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
  AVAILABLE_CLASSES,
} from '@/lib/db/auth-db';
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
  Zap,
  GraduationCap,
  ChevronDown,
} from 'lucide-react';

export default function AuthPage() {
  const router = useRouter();

  // Mode: 'signin' | 'signup' | 'guest'
  const [authMode, setAuthMode] = useState<'signin' | 'signup' | 'guest'>('signin');

  // Form Fields
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [studentClass, setStudentClass] = useState('Class 10');
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
      setSuccessMsg(`Welcome back, ${result.user.name}!`);
      setActiveSession(result.user, result.session);
      window.dispatchEvent(new Event('dronacharya_session_change'));
      window.dispatchEvent(new Event('storage'));
      setTimeout(() => {
        window.location.href = '/';
      }, 400);
    } else {
      setErrorMsg(result.error || 'Authentication failed. Please check credentials.');
    }
  };

  // Handle new user Sign Up
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
      studentClass: studentClass || 'Class 10',
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
    <div className="relative flex-1 flex flex-col justify-center items-center py-10 px-4 sm:px-6">
      {/* Center Authentication Card with Gurukul Neo-Brutalist Styling */}
      <div className="relative z-10 w-full max-w-xl bg-white/95 backdrop-blur-md rounded-3xl border-3 border-[#1E1E24] shadow-[8px_8px_0px_#1E1E24] p-6 sm:p-9 text-[#1E1E24] transition-all">
        {/* Brand Logo & Header */}
        <div className="text-center mb-6">
          <img
            src="/logo.png"
            alt="Dronacharya Logo"
            className="w-14 h-14 rounded-2xl border-2 border-[#1E1E24] object-cover shadow-[3px_3px_0px_#1E1E24] mb-3 mx-auto bg-[#FAF6EE]"
          />

          <h1 className="font-serif font-black text-2xl sm:text-3xl text-[#1E1E24] tracking-tight">
            {authMode === 'guest'
              ? 'Guest Demo'
              : authMode === 'signup'
              ? 'Create Account'
              : 'Sign In'}
          </h1>

          <p className="text-xs sm:text-sm text-[#4A4A58] font-bold mt-1.5 max-w-sm mx-auto">
            {authMode === 'guest'
              ? 'Explore all realms and interactive studios with zero signup required.'
              : authMode === 'signup'
              ? 'Embark on RPG quests, earn XP, and unlock verifiable achievements.'
              : 'Enter your credentials to load your saved progress and rank.'}
          </p>
        </div>

        {/* 3-Tab Switcher: Sign In | Sign Up | Guest Demo */}
        <div className="flex bg-[#FAF6EE] p-1.5 rounded-2xl border-2 border-[#1E1E24] mb-6 shadow-[2px_2px_0px_#1E1E24]">
          <button
            type="button"
            onClick={() => {
              setAuthMode('signin');
              setErrorMsg(null);
              setSuccessMsg(null);
            }}
            className={`flex-1 py-2 text-xs font-black rounded-xl transition-all cursor-pointer ${
              authMode === 'signin'
                ? 'bg-[#6C5CE7] text-white shadow-[2px_2px_0px_#1E1E24]'
                : 'text-[#4A4A58] hover:text-[#1E1E24]'
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
            className={`flex-1 py-2 text-xs font-black rounded-xl transition-all cursor-pointer ${
              authMode === 'signup'
                ? 'bg-[#6C5CE7] text-white shadow-[2px_2px_0px_#1E1E24]'
                : 'text-[#4A4A58] hover:text-[#1E1E24]'
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
            className={`flex-1 py-2 text-xs font-black rounded-xl transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
              authMode === 'guest'
                ? 'bg-[#FFD214] text-[#1E1E24] shadow-[2px_2px_0px_#1E1E24]'
                : 'text-[#4A4A58] hover:text-[#1E1E24]'
            }`}
          >
            <Zap className="w-3.5 h-3.5 fill-current" />
            <span>Guest Demo</span>
          </button>
        </div>

        {/* Feedback Alerts */}
        {errorMsg && (
          <div className="mb-5 p-3.5 rounded-xl bg-rose-50 border-2 border-rose-300 text-xs text-rose-800 font-bold flex items-start gap-2.5 animate-in fade-in">
            <AlertCircle className="w-4 h-4 shrink-0 mt-0.5 text-rose-600" />
            <span>{errorMsg}</span>
          </div>
        )}

        {successMsg && (
          <div className="mb-5 p-3.5 rounded-xl bg-emerald-50 border-2 border-emerald-300 text-xs text-emerald-800 font-bold flex items-center gap-2.5 animate-in fade-in">
            <CheckCircle2 className="w-4 h-4 shrink-0 text-emerald-600" />
            <span>{successMsg}</span>
          </div>
        )}

        {/* ========================================================
            TAB 1: SIGN IN FORM
           ======================================================== */}
        {authMode === 'signin' && (
          <form onSubmit={handleSignIn} className="space-y-4">
            <div>
              <label className="block text-xs font-black text-[#1E1E24] mb-1.5">
                Email Address
              </label>
              <div className="relative">
                <Mail className="w-4 h-4 text-[#7E7E8F] absolute left-3.5 top-3" />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  onBlur={() => setEmail((e) => e.trim())}
                  placeholder="explorer@gurukul.edu"
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-[#FAF6EE] border-2 border-[#1E1E24] text-xs sm:text-sm text-[#1E1E24] placeholder-gray-500 focus:outline-hidden focus:border-[#6C5CE7] focus:bg-white transition-colors"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-black text-[#1E1E24] mb-1.5">
                Password
              </label>
              <div className="relative">
                <Lock className="w-4 h-4 text-[#7E7E8F] absolute left-3.5 top-3" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  required
                  autoComplete="current-password"
                  data-lpignore="true"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full pl-10 pr-10 py-2.5 rounded-xl bg-[#FAF6EE] border-2 border-[#1E1E24] text-xs sm:text-sm text-[#1E1E24] placeholder-gray-500 focus:outline-hidden focus:border-[#6C5CE7] focus:bg-white transition-colors"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3.5 top-3 text-[#7E7E8F] hover:text-[#1E1E24] cursor-pointer"
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
            TAB 2: SIGN UP FORM
           ======================================================== */}
        {authMode === 'signup' && (
          <form onSubmit={handleSignUp} className="space-y-4">
            <div>
              <label className="block text-xs font-black text-[#1E1E24] mb-1.5">
                Adventurer Name
              </label>
              <div className="relative">
                <User className="w-4 h-4 text-[#7E7E8F] absolute left-3.5 top-3" />
                <input
                  type="text"
                  required
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  placeholder="e.g. Arjun Dev"
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-[#FAF6EE] border-2 border-[#1E1E24] text-xs sm:text-sm text-[#1E1E24] placeholder-gray-500 focus:outline-hidden focus:border-[#6C5CE7] focus:bg-white transition-colors"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-black text-[#1E1E24] mb-1.5">
                Email Address
              </label>
              <div className="relative">
                <Mail className="w-4 h-4 text-[#7E7E8F] absolute left-3.5 top-3" />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  onBlur={() => setEmail((e) => e.trim())}
                  placeholder="arjun@adventure.io"
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-[#FAF6EE] border-2 border-[#1E1E24] text-xs sm:text-sm text-[#1E1E24] placeholder-gray-500 focus:outline-hidden focus:border-[#6C5CE7] focus:bg-white transition-colors"
                />
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="block text-xs font-black text-[#1E1E24]">
                  Password (min 6 characters)
                </label>
                <button
                  type="button"
                  onClick={handleGenerateSafePassword}
                  className="text-[10px] text-[#6C5CE7] hover:underline font-black flex items-center gap-1 cursor-pointer bg-[#EDE9FE] px-2 py-0.5 rounded-md border border-[#6C5CE7]/30"
                >
                  <span>🎲 Generate Safe Password</span>
                </button>
              </div>
              <div className="relative">
                <Lock className="w-4 h-4 text-[#7E7E8F] absolute left-3.5 top-3" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  required
                  autoComplete="new-password"
                  data-lpignore="true"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full pl-10 pr-10 py-2.5 rounded-xl bg-[#FAF6EE] border-2 border-[#1E1E24] text-xs sm:text-sm text-[#1E1E24] placeholder-gray-500 focus:outline-hidden focus:border-[#6C5CE7] focus:bg-white transition-colors"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3.5 top-3 text-[#7E7E8F] hover:text-[#1E1E24] cursor-pointer"
                  tabIndex={-1}
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            {/* Student Class Selection Field */}
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="block text-xs font-black text-[#1E1E24] flex items-center gap-1.5">
                  <GraduationCap className="w-3.5 h-3.5 text-[#6C5CE7]" />
                  <span>Student Class / Grade</span>
                </label>
                <span className="text-[10px] text-gray-500 font-bold">Curriculum Level</span>
              </div>
              <div className="relative">
                <select
                  value={studentClass}
                  onChange={(e) => setStudentClass(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl bg-[#FAF6EE] border-2 border-[#1E1E24] text-xs sm:text-sm font-bold text-[#1E1E24] focus:outline-hidden focus:border-[#6C5CE7] focus:bg-white transition-colors cursor-pointer appearance-none shadow-[2px_2px_0px_#1E1E24]"
                >
                  {AVAILABLE_CLASSES.map((cls) => (
                    <option key={cls} value={cls}>
                      {cls}
                    </option>
                  ))}
                </select>
                <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-3.5 text-gray-700">
                  <ChevronDown className="w-4 h-4" />
                </div>
              </div>
            </div>

            <div>
              <label className="block text-xs font-black text-[#1E1E24] mb-1.5">
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
                      className={`p-2.5 rounded-xl border-2 text-left transition-all cursor-pointer ${
                        isSelected
                          ? 'bg-[#EDE9FE] border-[#6C5CE7] shadow-[2px_2px_0px_#6C5CE7]'
                          : 'bg-[#FAF6EE] border-[#1E1E24] hover:bg-white'
                      }`}
                    >
                      <span className="block text-xs font-black text-[#1E1E24]">{s.name}</span>
                      <span className="text-[10px] text-gray-500 truncate block font-bold">
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
            TAB 3: GUEST DEMO
           ======================================================== */}
        {authMode === 'guest' && (
          <div className="space-y-5">
            <div className="p-3.5 rounded-2xl bg-[#FEF3C7] border-2 border-[#1E1E24] text-xs text-amber-900 font-bold leading-relaxed shadow-[2px_2px_0px_#1E1E24]">
              ⚡ <strong>Instant Exploration:</strong> Jump straight into live coding quests, interactive test assertions, and 2D mini-game simulators without creating an account.
            </div>

            <div>
              <label className="block text-xs font-black text-[#1E1E24] mb-2">
                Choose Realm to Start:
              </label>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                {activeSubjects.map((s) => {
                  const isSelected = selectedSubject === s.id;
                  return (
                    <div
                      key={s.id}
                      onClick={() => setSelectedSubject(s.id)}
                      className={`p-3.5 rounded-2xl border-2 cursor-pointer transition-all flex flex-col justify-between ${
                        isSelected
                          ? 'bg-[#FFD214] border-[#1E1E24] shadow-[3px_3px_0px_#1E1E24]'
                          : 'bg-[#FAF6EE] border-[#1E1E24] hover:bg-white shadow-[2px_2px_0px_#1E1E24]'
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <span className="font-black text-xs text-[#1E1E24]">{s.name}</span>
                        <span className="text-[10px] font-mono font-bold text-emerald-800 bg-emerald-100 px-1.5 py-0.5 rounded border border-emerald-300">
                          Playable
                        </span>
                      </div>
                      <span className="text-[11px] text-gray-600 font-bold mt-1 line-clamp-1">
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
        <div className="mt-6 text-center text-xs font-bold text-gray-600">
          {authMode === 'signin' ? (
            <p>
              Don&apos;t have an account?{' '}
              <button
                type="button"
                onClick={() => setAuthMode('signup')}
                className="text-[#6C5CE7] hover:underline font-black cursor-pointer"
              >
                Create one for free
              </button>
              {' or '}
              <button
                type="button"
                onClick={() => setAuthMode('guest')}
                className="text-amber-600 hover:underline font-black cursor-pointer"
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
                className="text-[#6C5CE7] hover:underline font-black cursor-pointer"
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
                className="text-[#6C5CE7] hover:underline font-black cursor-pointer"
              >
                Sign up for an account
              </button>
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
