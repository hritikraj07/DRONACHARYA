// Dronacharya Authentication Gateway (Sign In, Sign Up, Guest Demo)
// Translucent frosted neo-brutalist aesthetic with minimal scrollability, confirm password, and course dropdown
'use client';

import React, { useState, useEffect, useRef, Suspense } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import {
  authenticateUser,
  registerUser,
  createGuestSession,
  setActiveSession,
  AVAILABLE_SUBJECTS,
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
  ChevronDown,
  ShieldCheck,
  Cpu,
  BookOpen,
} from 'lucide-react';

function AuthContent() {
  const router = useRouter();
  const searchParams = useSearchParams();

  // Mode: 'signin' | 'signup' | 'guest'
  const [authMode, setAuthMode] = useState<'signin' | 'signup' | 'guest'>('signin');

  // Form Fields
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [selectedSubject, setSelectedSubject] = useState('python');
  const [courseDropdownOpen, setCourseDropdownOpen] = useState(false);
  const courseDropdownRef = useRef<HTMLDivElement>(null);
  const [rememberMe, setRememberMe] = useState(true);

  // UI Status
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);
  const [infoMsg, setInfoMsg] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  // Sync mode from URL searchParams automatically whenever query changes
  useEffect(() => {
    const modeParam = searchParams.get('mode');
    if (modeParam === 'signup' || modeParam === 'signin' || modeParam === 'guest') {
      setAuthMode(modeParam);
    }
  }, [searchParams]);

  // Check existing session
  useEffect(() => {
    const session =
      typeof window !== 'undefined'
        ? localStorage.getItem('dronacharya_active_session_v2')
        : null;
    if (session) {
      window.location.href = '/';
    }
  }, []);

  // Close course dropdown on click outside
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (courseDropdownRef.current && !courseDropdownRef.current.contains(e.target as Node)) {
        setCourseDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
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

  // Unified mode switcher that keeps state & URL query aligned
  const switchMode = (mode: 'signin' | 'signup' | 'guest') => {
    setAuthMode(mode);
    setErrorMsg(null);
    setSuccessMsg(null);
    setInfoMsg(null);
    router.replace(`/auth?mode=${mode}`, { scroll: false });
  };

  const handleGenerateSafePassword = () => {
    const prefixes = ['Quest', 'Hero', 'Code', 'Drona', 'Arcade', 'Gurukul'];
    const prefix = prefixes[Math.floor(Math.random() * prefixes.length)];
    const num = Math.floor(100 + Math.random() * 900);
    const symbols = ['!', '#', '$', '@', '*'];
    const symbol = symbols[Math.floor(Math.random() * symbols.length)];
    const generated = `${prefix}#${num}${symbol}`;
    setPassword(generated);
    setConfirmPassword(generated);
    setShowPassword(true);
    setShowConfirmPassword(true);
    setInfoMsg(`Generated safe password applied to both fields!`);
  };

  // Handle standard user Sign In
  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);
    setSuccessMsg(null);
    setInfoMsg(null);
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
      }, 350);
    } else {
      setErrorMsg(result.error || 'Authentication failed. Please check credentials.');
    }
  };

  // Handle new user Sign Up
  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);
    setSuccessMsg(null);
    setInfoMsg(null);

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

    if (password !== confirmPassword) {
      setErrorMsg('Passwords do not match. Please verify both password fields.');
      return;
    }

    setIsSubmitting(true);

    const result = await registerUser({
      name: fullName.trim(),
      email: cleanEmail,
      password,
      targetSubject: selectedSubject || 'python',
    });
    setIsSubmitting(false);

    if (result.success && result.user) {
      setSuccessMsg(`Account established! Welcome, ${result.user.name}!`);
      setActiveSession(result.user, result.session);
      window.dispatchEvent(new Event('dronacharya_session_change'));
      window.dispatchEvent(new Event('storage'));
      setTimeout(() => {
        window.location.href = '/';
      }, 350);
    } else {
      setErrorMsg(result.error || 'Registration failed.');
    }
  };

  // Handle Instant Guest Demo Launch
  const handleLaunchGuestDemo = (subjectId?: string) => {
    const sub = subjectId || selectedSubject || 'python';
    setIsSubmitting(true);
    setSuccessMsg('Launching Instant Guest Demo...');

    createGuestSession(sub);
    window.dispatchEvent(new Event('dronacharya_session_change'));
    window.dispatchEvent(new Event('storage'));

    setTimeout(() => {
      window.location.href = '/courses';
    }, 300);
  };

  const selectedSubjectObj = AVAILABLE_SUBJECTS.find((s) => s.id === selectedSubject) || AVAILABLE_SUBJECTS[0];

  return (
    <div className="relative flex-1 flex flex-col justify-center items-center py-6 sm:py-10 px-4 min-h-[calc(100vh-3.5rem)]">
      {/* Centered Auth Card Wrapper */}
      <div className="relative z-10 w-full max-w-lg flex flex-col items-center justify-center">
        {/* ========================================================
            MAIN AUTHENTICATION CARD (Translucent Frosted Neo-Brutalist)
           ======================================================== */}
        <div
          className="w-full max-w-lg rounded-3xl border-3 border-[#1E1E24] shadow-[8px_8px_0px_#1E1E24] p-5 sm:p-7 text-[#1E1E24] transition-all relative overflow-hidden"
          style={{
            backgroundColor: 'rgba(250, 246, 238, 0.78)',
            backdropFilter: 'blur(16px)',
            WebkitBackdropFilter: 'blur(16px)',
          }}
        >
          {/* Brand Logo & Header */}
          <div className="text-center mb-4">
            <img
              src="/logo.png"
              alt="Dronacharya Logo"
              className="w-12 h-12 rounded-2xl border-2 border-[#1E1E24] object-cover shadow-[2px_2px_0px_#1E1E24] mb-2 mx-auto bg-white/80"
            />

            <h1 className="font-serif font-black text-2xl sm:text-3xl text-[#1E1E24] tracking-tight">
              {authMode === 'guest'
                ? 'Guest Demo'
                : authMode === 'signup'
                ? 'Create Account'
                : 'Sign In'}
            </h1>

            <p className="text-xs text-[#4A4A58] font-bold mt-1 max-w-sm mx-auto">
              {authMode === 'guest'
                ? 'Explore all courses and interactive studios with zero signup required.'
                : authMode === 'signup'
                ? 'Embark on RPG quests, earn XP, and unlock verifiable achievements.'
                : 'Enter your credentials to load your saved progress and rank.'}
            </p>
          </div>

          {/* 3-Tab Switcher: Sign In | Sign Up | Guest Demo */}
          <div className="flex bg-white/70 backdrop-blur-md p-1 rounded-2xl border-2 border-[#1E1E24] mb-4 shadow-[2px_2px_0px_#1E1E24]">
            <button
              type="button"
              onClick={() => switchMode('signin')}
              className={`flex-1 py-1.5 text-xs font-black rounded-xl transition-all cursor-pointer ${
                authMode === 'signin'
                  ? 'bg-[#6C5CE7] text-white shadow-[2px_2px_0px_#1E1E24]'
                  : 'text-[#4A4A58] hover:text-[#1E1E24]'
              }`}
            >
              Sign In
            </button>

            <button
              type="button"
              onClick={() => switchMode('signup')}
              className={`flex-1 py-1.5 text-xs font-black rounded-xl transition-all cursor-pointer ${
                authMode === 'signup'
                  ? 'bg-[#6C5CE7] text-white shadow-[2px_2px_0px_#1E1E24]'
                  : 'text-[#4A4A58] hover:text-[#1E1E24]'
              }`}
            >
              Sign Up
            </button>

            <button
              type="button"
              onClick={() => switchMode('guest')}
              className={`flex-1 py-1.5 text-xs font-black rounded-xl transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
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
            <div className="mb-3.5 p-3 rounded-xl bg-rose-50/95 border-2 border-rose-300 text-xs text-rose-800 font-bold flex items-start gap-2 animate-in fade-in">
              <AlertCircle className="w-4 h-4 shrink-0 mt-0.5 text-rose-600" />
              <span>{errorMsg}</span>
            </div>
          )}

          {successMsg && (
            <div className="mb-3.5 p-3 rounded-xl bg-emerald-50/95 border-2 border-emerald-300 text-xs text-emerald-800 font-bold flex items-center gap-2 animate-in fade-in">
              <CheckCircle2 className="w-4 h-4 shrink-0 text-emerald-600" />
              <span>{successMsg}</span>
            </div>
          )}

          {infoMsg && (
            <div className="mb-3.5 p-3 rounded-xl bg-purple-50/95 border-2 border-purple-300 text-xs text-purple-900 font-bold flex items-center gap-2 animate-in fade-in">
              <Sparkles className="w-4 h-4 shrink-0 text-[#6C5CE7]" />
              <span>{infoMsg}</span>
            </div>
          )}

          {/* ========================================================
              TAB 1: SIGN IN FORM
             ======================================================== */}
          {authMode === 'signin' && (
            <form onSubmit={handleSignIn} className="space-y-3.5">
              <div>
                <label className="block text-xs font-black text-[#1E1E24] mb-1">
                  Email Address
                </label>
                <div className="relative">
                  <Mail className="w-4 h-4 text-[#7E7E8F] absolute left-3.5 top-2.5" />
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    onBlur={() => setEmail((e) => e.trim())}
                    placeholder="explorer@gurukul.edu"
                    className="w-full pl-10 pr-4 py-2 rounded-xl bg-white/70 backdrop-blur-sm border-2 border-[#1E1E24] text-xs sm:text-sm text-[#1E1E24] placeholder-gray-500 focus:outline-hidden focus:border-[#6C5CE7] focus:bg-white transition-colors shadow-[2px_2px_0px_rgba(30,30,36,0.06)]"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-black text-[#1E1E24] mb-1">
                  Password
                </label>
                <div className="relative">
                  <Lock className="w-4 h-4 text-[#7E7E8F] absolute left-3.5 top-2.5" />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    required
                    autoComplete="current-password"
                    data-lpignore="true"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full pl-10 pr-10 py-2 rounded-xl bg-white/70 backdrop-blur-sm border-2 border-[#1E1E24] text-xs sm:text-sm text-[#1E1E24] placeholder-gray-500 focus:outline-hidden focus:border-[#6C5CE7] focus:bg-white transition-colors shadow-[2px_2px_0px_rgba(30,30,36,0.06)]"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3.5 top-2.5 text-[#7E7E8F] hover:text-[#1E1E24] cursor-pointer"
                    tabIndex={-1}
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              {/* Remember Me & Forgot Password Helper */}
              <div className="flex items-center justify-between text-xs font-bold pt-0.5">
                <label className="flex items-center gap-1.5 cursor-pointer text-[#4A4A58] select-none hover:text-[#1E1E24]">
                  <input
                    type="checkbox"
                    checked={rememberMe}
                    onChange={(e) => setRememberMe(e.target.checked)}
                    className="w-4 h-4 rounded border-2 border-[#1E1E24] text-[#6C5CE7] accent-[#6C5CE7] cursor-pointer"
                  />
                  <span>Remember me</span>
                </label>

                <button
                  type="button"
                  onClick={() =>
                    setInfoMsg(
                      'Forgot password? Enter your registered email to reset via Supabase Auth or try the Guest Demo!'
                    )
                  }
                  className="text-[#6C5CE7] hover:underline font-black cursor-pointer text-xs"
                >
                  Forgot password?
                </button>
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full btn-arcade btn-arcade-purple py-2.5 px-6 text-xs sm:text-sm flex items-center justify-center gap-2 mt-1 shadow-[3px_3px_0px_#1E1E24]"
              >
                <span>{isSubmitting ? 'Signing in...' : 'Sign In to Quest'}</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </form>
          )}

          {/* ========================================================
              TAB 2: SIGN UP FORM (With Confirm Password & Course Dropdown)
             ======================================================== */}
          {authMode === 'signup' && (
            <form onSubmit={handleSignUp} className="space-y-3">
              <div>
                <label className="block text-xs font-black text-[#1E1E24] mb-1">
                  Adventurer Name
                </label>
                <div className="relative">
                  <User className="w-4 h-4 text-[#7E7E8F] absolute left-3.5 top-2.5" />
                  <input
                    type="text"
                    required
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    placeholder="e.g. Arjun Dev"
                    className="w-full pl-10 pr-4 py-2 rounded-xl bg-white/70 backdrop-blur-sm border-2 border-[#1E1E24] text-xs sm:text-sm text-[#1E1E24] placeholder-gray-500 focus:outline-hidden focus:border-[#6C5CE7] focus:bg-white transition-colors shadow-[2px_2px_0px_rgba(30,30,36,0.06)]"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-black text-[#1E1E24] mb-1">
                  Email Address
                </label>
                <div className="relative">
                  <Mail className="w-4 h-4 text-[#7E7E8F] absolute left-3.5 top-2.5" />
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    onBlur={() => setEmail((e) => e.trim())}
                    placeholder="arjun@adventure.io"
                    className="w-full pl-10 pr-4 py-2 rounded-xl bg-white/70 backdrop-blur-sm border-2 border-[#1E1E24] text-xs sm:text-sm text-[#1E1E24] placeholder-gray-500 focus:outline-hidden focus:border-[#6C5CE7] focus:bg-white transition-colors shadow-[2px_2px_0px_rgba(30,30,36,0.06)]"
                  />
                </div>
              </div>

              {/* Password */}
              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="block text-xs font-black text-[#1E1E24]">
                    Password (min 6 characters)
                  </label>
                  <button
                    type="button"
                    onClick={handleGenerateSafePassword}
                    className="text-[10px] text-[#6C5CE7] hover:underline font-black flex items-center gap-1 cursor-pointer bg-purple-50/80 px-2 py-0.5 rounded-md border border-[#6C5CE7]/30 transition-colors"
                  >
                    <span>🎲 Generate Safe</span>
                  </button>
                </div>
                <div className="relative">
                  <Lock className="w-4 h-4 text-[#7E7E8F] absolute left-3.5 top-2.5" />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    required
                    autoComplete="new-password"
                    data-lpignore="true"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full pl-10 pr-10 py-2 rounded-xl bg-white/70 backdrop-blur-sm border-2 border-[#1E1E24] text-xs sm:text-sm text-[#1E1E24] placeholder-gray-500 focus:outline-hidden focus:border-[#6C5CE7] focus:bg-white transition-colors shadow-[2px_2px_0px_rgba(30,30,36,0.06)]"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3.5 top-2.5 text-[#7E7E8F] hover:text-[#1E1E24] cursor-pointer"
                    tabIndex={-1}
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              {/* Confirm Password Section */}
              <div>
                <label className="block text-xs font-black text-[#1E1E24] mb-1">
                  Confirm Password
                </label>
                <div className="relative">
                  <Lock className="w-4 h-4 text-[#7E7E8F] absolute left-3.5 top-2.5" />
                  <input
                    type={showConfirmPassword ? 'text' : 'password'}
                    required
                    autoComplete="new-password"
                    data-lpignore="true"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    placeholder="••••••••"
                    className={`w-full pl-10 pr-10 py-2 rounded-xl bg-white/70 backdrop-blur-sm border-2 ${
                      confirmPassword && confirmPassword !== password
                        ? 'border-rose-500 focus:border-rose-500'
                        : confirmPassword && confirmPassword === password
                        ? 'border-emerald-500 focus:border-emerald-500'
                        : 'border-[#1E1E24] focus:border-[#6C5CE7]'
                    } text-xs sm:text-sm text-[#1E1E24] placeholder-gray-500 focus:outline-hidden focus:bg-white transition-colors shadow-[2px_2px_0px_rgba(30,30,36,0.06)]`}
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute right-3.5 top-2.5 text-[#7E7E8F] hover:text-[#1E1E24] cursor-pointer"
                    tabIndex={-1}
                  >
                    {showConfirmPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
                {confirmPassword && confirmPassword !== password && (
                  <p className="text-[10px] text-rose-600 font-bold mt-1">Passwords do not match.</p>
                )}
                {confirmPassword && confirmPassword === password && (
                  <p className="text-[10px] text-emerald-600 font-bold mt-1">✓ Passwords match</p>
                )}
              </div>

              {/* Starting Course Selection (Custom Neo-Brutalist Dropdown - No Class, No Realm) */}
              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="block text-xs font-black text-[#1E1E24] flex items-center gap-1.5">
                    <BookOpen className="w-3.5 h-3.5 text-[#6C5CE7]" />
                    <span>Select Starting Course</span>
                  </label>
                  <span className="text-[10px] text-emerald-700 font-bold bg-emerald-100 px-1.5 py-0.2 rounded border border-emerald-300">
                    Active
                  </span>
                </div>
                <div className="relative" ref={courseDropdownRef}>
                  <button
                    type="button"
                    onClick={() => setCourseDropdownOpen(!courseDropdownOpen)}
                    className={`w-full px-3.5 py-2 rounded-xl bg-white/80 backdrop-blur-md border-2 border-[#1E1E24] text-xs sm:text-sm font-bold text-[#1E1E24] transition-all cursor-pointer flex items-center justify-between shadow-[2px_2px_0px_#1E1E24] ${
                      courseDropdownOpen ? 'bg-amber-50 ring-2 ring-[#6C5CE7]' : 'hover:bg-white'
                    }`}
                  >
                    <div className="flex items-center gap-2">
                      <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 inline-block animate-pulse" />
                      <span className="font-black text-[#1E1E24]">{selectedSubjectObj.name}</span>
                      <span className="text-[10px] text-gray-500 hidden sm:inline font-mono">
                        ({selectedSubjectObj.tagline})
                      </span>
                    </div>
                    <ChevronDown
                      className={`w-4 h-4 text-[#1E1E24] transition-transform duration-200 ${
                        courseDropdownOpen ? 'rotate-180 text-[#6C5CE7]' : ''
                      }`}
                    />
                  </button>

                  {/* Custom Styled Neo-Brutalist Dropdown Menu */}
                  {courseDropdownOpen && (
                    <div className="absolute bottom-full mb-1.5 left-0 right-0 z-40 bg-[#FAF6EE] border-3 border-[#1E1E24] rounded-2xl shadow-[6px_6px_0px_#1E1E24] p-1.5 animate-in fade-in-50 zoom-in-95 duration-150 max-h-56 overflow-y-auto">
                      <div className="px-2.5 py-1 text-[9px] font-black uppercase text-gray-400 tracking-wider">
                        Select Curriculum Course
                      </div>
                      <div className="space-y-1">
                        {AVAILABLE_SUBJECTS.map((s) => {
                          const isSelected = selectedSubject === s.id;
                          const isPlayable = !s.isComingSoon;
                          return (
                            <button
                              type="button"
                              key={s.id}
                              onClick={() => {
                                if (isPlayable) {
                                  setSelectedSubject(s.id);
                                  setCourseDropdownOpen(false);
                                }
                              }}
                              disabled={!isPlayable}
                              className={`w-full px-3 py-1.5 rounded-xl text-left text-xs font-bold transition-all flex items-center justify-between cursor-pointer ${
                                !isPlayable
                                  ? 'opacity-40 cursor-not-allowed bg-gray-100 text-gray-400'
                                  : isSelected
                                  ? 'bg-[#FFD214] text-[#1E1E24] font-black border-2 border-[#1E1E24] shadow-[2px_2px_0px_#1E1E24]'
                                  : 'text-[#1E1E24] hover:bg-white border-2 border-transparent hover:border-[#1E1E24] hover:shadow-[2px_2px_0px_#1E1E24]'
                              }`}
                            >
                              <div className="flex items-center gap-2">
                                <span>{s.name}</span>
                                <span className="text-[10px] text-gray-500 font-mono">
                                  {isPlayable ? '• Playable' : '• Coming Soon'}
                                </span>
                              </div>
                              {isSelected && (
                                <CheckCircle2 className="w-4 h-4 text-[#1E1E24] fill-[#1E1E24] text-white" />
                              )}
                            </button>
                          );
                        })}
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Code of Conduct & Honor Code */}
              <p className="text-[10px] text-gray-500 font-bold leading-tight">
                By embarking, you accept the Gurukul Code of Conduct & Academic Honor Code.
              </p>

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full btn-arcade btn-arcade-purple py-2.5 px-6 text-xs sm:text-sm flex items-center justify-center gap-2 mt-2 shadow-[3px_3px_0px_#1E1E24]"
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
            <div className="space-y-4">
              <div className="p-3 rounded-2xl bg-[#FEF3C7]/90 border-2 border-[#1E1E24] text-xs text-amber-900 font-bold leading-relaxed shadow-[2px_2px_0px_#1E1E24]">
                ⚡ <strong>Instant Exploration:</strong> Jump straight into live coding quests, interactive test assertions, and 2D mini-game simulators without creating an account.
              </div>

              <div>
                <label className="block text-xs font-black text-[#1E1E24] mb-1.5">
                  Choose Course to Start:
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {AVAILABLE_SUBJECTS.map((s) => {
                    const isSelected = selectedSubject === s.id;
                    const isPlayable = !s.isComingSoon;
                    return (
                      <div
                        key={s.id}
                        onClick={() => {
                          if (isPlayable) {
                            setSelectedSubject(s.id);
                          }
                        }}
                        className={`p-2.5 rounded-2xl border-2 transition-all flex flex-col justify-between ${
                          !isPlayable
                            ? 'opacity-50 cursor-not-allowed bg-gray-100/60 border-gray-300'
                            : isSelected
                            ? 'bg-[#FFD214]/90 border-[#1E1E24] shadow-[3px_3px_0px_#1E1E24] cursor-pointer'
                            : 'bg-white/70 backdrop-blur-md border-[#1E1E24] hover:bg-white/90 shadow-[2px_2px_0px_#1E1E24] cursor-pointer'
                        }`}
                      >
                        <div className="flex items-center justify-between">
                          <span className="font-black text-xs text-[#1E1E24]">{s.name}</span>
                          <span
                            className={`text-[9px] font-mono font-bold px-1.5 py-0.2 rounded border ${
                              isPlayable
                                ? 'text-emerald-800 bg-emerald-100 border-emerald-300'
                                : 'text-gray-600 bg-gray-200 border-gray-300'
                            }`}
                          >
                            {isPlayable ? 'Playable' : 'Soon'}
                          </span>
                        </div>
                        <span className="text-[10px] text-gray-600 font-bold mt-1 line-clamp-1">
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
                className="w-full btn-arcade btn-arcade-gold py-3 px-6 text-xs sm:text-sm flex items-center justify-center gap-2 shadow-[3px_3px_0px_#1E1E24]"
              >
                <Zap className="w-4 h-4 fill-current" />
                <span>{isSubmitting ? 'Entering course...' : 'Enter as Guest Explorer Now →'}</span>
              </button>
            </div>
          )}

          {/* Quick Switch Text Links */}
          <div className="mt-4 text-center text-xs font-bold text-gray-600">
            {authMode === 'signin' ? (
              <p>
                Don&apos;t have an account?{' '}
                <button
                  type="button"
                  onClick={() => switchMode('signup')}
                  className="text-[#6C5CE7] hover:underline font-black cursor-pointer"
                >
                  Create one for free
                </button>
                {' or '}
                <button
                  type="button"
                  onClick={() => switchMode('guest')}
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
                  onClick={() => switchMode('signin')}
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
                  onClick={() => switchMode('signup')}
                  className="text-[#6C5CE7] hover:underline font-black cursor-pointer"
                >
                  Sign up for an account
                </button>
              </p>
            )}
          </div>

          {/* ========================================================
              TRUST, CLOUD & TECH STACK BADGES
             ======================================================== */}
          <div className="mt-4 pt-3 border-t-2 border-[#1E1E24]/15 flex flex-col sm:flex-row items-center justify-between gap-1.5 text-[10px] text-gray-600 font-bold">
            <div className="flex items-center gap-1.5">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
              <span>Encrypted Cloud Sync via Supabase Auth</span>
            </div>
            <div className="flex items-center gap-1.5 flex-wrap justify-center">
              <span className="flex items-center gap-1">
                <Cpu className="w-3.5 h-3.5 text-[#6C5CE7] shrink-0" />
                In-Browser Python Sandbox
              </span>
              <span>•</span>
              <span>Zero Local Setup Required</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function AuthPage() {
  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center font-bold text-xs">Loading Quest Gateway...</div>}>
      <AuthContent />
    </Suspense>
  );
}
