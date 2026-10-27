// Dronacharya — Gamified AI-Powered Learning Platform
// Transforms theoretical programming knowledge into verifiable skill through 2D games and live code
'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import {
  getActiveSession,
  setActiveSession,
  authenticateUser,
  registerUser,
  updateUserLearningSelection,
  awardGameProgress,
  deductHeart,
  restoreHearts,
  RegisteredUser,
  AVAILABLE_CLASSES,
  AVAILABLE_SUBJECTS,
} from '@/lib/db/auth-db';
import { SUBJECT_CURRICULA } from '@/lib/data/game-curriculum';
import { RobotRescueGame } from '@/components/game/RobotRescueGame';
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
} from 'lucide-react';

export default function HomePage() {
  const [currentUser, setCurrentUser] = useState<RegisteredUser | null>(null);
  const [isLoaded, setIsLoaded] = useState(false);

  // Authentication State
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

  // Switch Modal State
  const [isSwitchOpen, setIsSwitchOpen] = useState(false);
  const [modalClass, setModalClass] = useState('');
  const [modalSubject, setModalSubject] = useState('');

  // Synchronize active session on mount & on custom event
  useEffect(() => {
    const syncUser = () => {
      const session = getActiveSession();
      setCurrentUser(session);
      if (session) {
        setModalClass(session.studentClass);
        setModalSubject(session.targetSubject);
      }
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

  // Handle Sign In (Strict database credential matching)
  const handleSignIn = (e: React.FormEvent) => {
    e.preventDefault();
    setAuthError(null);
    setAuthSuccess(null);

    const res = authenticateUser({
      email: authEmail,
      password: authPassword,
    });

    if (res.success && res.user) {
      setAuthSuccess(`Welcome back, ${res.user.name}! Entering your learning arena...`);
      setActiveSession(res.user);
      window.dispatchEvent(new Event('dronacharya_session_change'));
      window.dispatchEvent(new Event('storage'));
      setTimeout(() => {
        setCurrentUser(res.user!);
        setModalClass(res.user!.studentClass);
        setModalSubject(res.user!.targetSubject);
      }, 250);
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
    if (!authEmail.trim() || !authEmail.includes('@')) {
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

  // Step 3 Completion -> Register in Database
  const handleFinalSignUp = (e: React.FormEvent) => {
    e.preventDefault();
    setAuthError(null);
    setAuthSuccess(null);

    const res = registerUser({
      name: authName,
      email: authEmail,
      password: authPassword,
      studentClass: authClass,
      targetSubject: authSubject,
    });

    if (res.success && res.user) {
      setAuthSuccess(`Welcome, ${res.user.name}! Your game arena is ready.`);
      setActiveSession(res.user);
      window.dispatchEvent(new Event('dronacharya_session_change'));
      window.dispatchEvent(new Event('storage'));
      setTimeout(() => {
        setCurrentUser(res.user!);
        setModalClass(res.user!.studentClass);
        setModalSubject(res.user!.targetSubject);
      }, 250);
    } else {
      setAuthError(res.error || 'Registration failed.');
    }
  };

  // Handle Switch Subject / Class
  const handleSaveClassSubjectSwitch = (e: React.FormEvent) => {
    e.preventDefault();
    const updated = updateUserLearningSelection({
      studentClass: modalClass,
      targetSubject: modalSubject,
    });
    if (updated) {
      setCurrentUser({ ...updated });
      setIsSwitchOpen(false);
    }
  };

  // Restore Hearts
  const handleRestoreHearts = () => {
    const updated = restoreHearts();
    if (updated && currentUser) {
      setCurrentUser({ ...currentUser, hearts: 3 });
    }
  };

  // Callback from Game Component when level is completed
  const handleGameLevelComplete = (xpEarned: number) => {
    if (currentUser) {
      const updated = awardGameProgress({
        missionId: 'level-1-robot-rescue',
        earnedXp: xpEarned,
      });
      if (updated) {
        setCurrentUser({ ...updated });
      }
    }
  };

  // Callback when heart is lost during game collision
  const handleHeartLost = () => {
    const remaining = deductHeart();
    if (currentUser) {
      setCurrentUser({ ...currentUser, hearts: remaining });
    }
  };

  if (!isLoaded) {
    return (
      <div className="w-full flex-1 flex items-center justify-center py-24 text-sm text-[#575A51]">
        <RefreshCw className="w-5 h-5 animate-spin mr-2 text-[#354B3A]" />
        <span>Loading Dronacharya...</span>
      </div>
    );
  }

  // =========================================================================
  // VIEW 1: NOT LOGGED IN -> STEP-BY-STEP ONBOARDING WIZARD
  // =========================================================================
  if (!currentUser) {
    return (
      <div className="w-full flex-1 flex flex-col items-center justify-center py-8 px-4 sm:px-6">
        <div className="w-full max-w-xl bg-white border border-[#D8CFC0] rounded-2xl shadow-xl p-6 sm:p-8">
          {/* Header */}
          <div className="text-center mb-6">
            <div className="w-12 h-12 mx-auto rounded-xl bg-[#354B3A] text-[#F6F1E7] flex items-center justify-center font-serif text-2xl font-bold shadow-xs mb-3">
              द्रो
            </div>
            <h1 className="font-serif font-bold text-2xl sm:text-3xl text-[#252820]">
              {authMode === 'signin' ? 'Sign In to Continue' : 'What do you want to learn?'}
            </h1>
            <p className="text-xs sm:text-sm text-[#575A51] mt-1.5 max-w-md mx-auto">
              {authMode === 'signin'
                ? 'Enter your registered credentials to jump straight into your game arena.'
                : 'Complete the 3 quick steps to tailor your interactive gaming curriculum.'}
            </p>
          </div>

          {/* Mode Switcher Tabs */}
          <div className="flex border-b border-[#D8CFC0] mb-6">
            <button
              type="button"
              onClick={() => {
                setAuthMode('signin');
                setAuthError(null);
                setAuthSuccess(null);
              }}
              className={`flex-1 py-2.5 text-xs font-semibold border-b-2 transition-all cursor-pointer ${
                authMode === 'signin'
                  ? 'border-[#354B3A] text-[#354B3A]'
                  : 'border-transparent text-[#7E8276] hover:text-[#252820]'
              }`}
            >
              Sign In
            </button>
            <button
              type="button"
              onClick={() => {
                setAuthMode('signup');
                setAuthError(null);
                setAuthSuccess(null);
                setSignupStep(1);
              }}
              className={`flex-1 py-2.5 text-xs font-semibold border-b-2 transition-all cursor-pointer ${
                authMode === 'signup'
                  ? 'border-[#354B3A] text-[#354B3A]'
                  : 'border-transparent text-[#7E8276] hover:text-[#252820]'
              }`}
            >
              New Student (Step-by-Step)
            </button>
          </div>

          {/* Feedback alerts */}
          {authError && (
            <div className="mb-4 p-3 rounded-lg bg-[#FAF4F0] border border-[#A65F43] text-xs text-[#A65F43] flex items-start gap-2">
              <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
              <span>{authError}</span>
            </div>
          )}

          {authSuccess && (
            <div className="mb-4 p-3 rounded-lg bg-[#E2E8E3] border border-[#354B3A] text-xs text-[#354B3A] font-semibold flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 shrink-0" />
              <span>{authSuccess}</span>
            </div>
          )}

          {/* =========================================================================
              SIGN IN FORM (Single fast screen for existing accounts)
             ========================================================================= */}
          {authMode === 'signin' ? (
            <form onSubmit={handleSignIn} className="space-y-4 text-xs">
              <div>
                <label className="block font-semibold text-[#252820] mb-1">Email Address</label>
                <div className="relative">
                  <Mail className="w-4 h-4 text-[#7E8276] absolute left-3 top-2.5" />
                  <input
                    type="email"
                    required
                    value={authEmail}
                    onChange={(e) => setAuthEmail(e.target.value)}
                    placeholder="student@learning.edu"
                    className="w-full pl-9 pr-3 py-2 border border-[#D8CFC0] rounded bg-[#FAF8F5] focus:bg-white focus:outline-none focus:border-[#354B3A]"
                  />
                </div>
              </div>

              <div>
                <label className="block font-semibold text-[#252820] mb-1">Password</label>
                <div className="relative">
                  <Lock className="w-4 h-4 text-[#7E8276] absolute left-3 top-2.5" />
                  <input
                    type="password"
                    required
                    value={authPassword}
                    onChange={(e) => setAuthPassword(e.target.value)}
                    placeholder="Enter your database password"
                    className="w-full pl-9 pr-3 py-2 border border-[#D8CFC0] rounded bg-[#FAF8F5] focus:bg-white focus:outline-none focus:border-[#354B3A]"
                  />
                </div>
              </div>

              <button
                type="submit"
                className="w-full btn-primary py-2.5 text-xs font-semibold shadow-xs mt-2"
              >
                <span>Verify Credentials & Start Learning</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>

              <div className="text-center pt-2 text-[#7E8276]">
                Don't have an account yet?{' '}
                <button
                  type="button"
                  onClick={() => {
                    setAuthMode('signup');
                    setSignupStep(1);
                  }}
                  className="text-[#354B3A] font-semibold underline cursor-pointer"
                >
                  Start Step-by-Step Setup
                </button>
              </div>
            </form>
          ) : (
            /* =========================================================================
                STEP-BY-STEP SIGN UP WIZARD (Step 1 -> Step 2 -> Step 3)
               ========================================================================= */
            <div>
              {/* Visual Step Progress Indicator */}
              <div className="flex items-center justify-between mb-6 px-2">
                {/* Step 1 Pill */}
                <div className="flex items-center gap-1.5">
                  <div
                    className={`w-6 h-6 rounded-full flex items-center justify-center font-bold text-xs ${
                      signupStep >= 1
                        ? 'bg-[#354B3A] text-white'
                        : 'bg-[#D8CFC0] text-[#575A51]'
                    }`}
                  >
                    1
                  </div>
                  <span className={`text-[11px] font-semibold ${signupStep === 1 ? 'text-[#354B3A]' : 'text-[#7E8276]'}`}>
                    Account
                  </span>
                </div>

                <div className={`flex-1 h-0.5 mx-2 ${signupStep >= 2 ? 'bg-[#354B3A]' : 'bg-[#D8CFC0]'}`} />

                {/* Step 2 Pill */}
                <div className="flex items-center gap-1.5">
                  <div
                    className={`w-6 h-6 rounded-full flex items-center justify-center font-bold text-xs ${
                      signupStep >= 2
                        ? 'bg-[#354B3A] text-white'
                        : 'bg-[#D8CFC0] text-[#575A51]'
                    }`}
                  >
                    2
                  </div>
                  <span className={`text-[11px] font-semibold ${signupStep === 2 ? 'text-[#354B3A]' : 'text-[#7E8276]'}`}>
                    Class
                  </span>
                </div>

                <div className={`flex-1 h-0.5 mx-2 ${signupStep >= 3 ? 'bg-[#354B3A]' : 'bg-[#D8CFC0]'}`} />

                {/* Step 3 Pill */}
                <div className="flex items-center gap-1.5">
                  <div
                    className={`w-6 h-6 rounded-full flex items-center justify-center font-bold text-xs ${
                      signupStep === 3
                        ? 'bg-[#354B3A] text-white'
                        : 'bg-[#D8CFC0] text-[#575A51]'
                    }`}
                  >
                    3
                  </div>
                  <span className={`text-[11px] font-semibold ${signupStep === 3 ? 'text-[#354B3A]' : 'text-[#7E8276]'}`}>
                    Language
                  </span>
                </div>
              </div>

              {/* STEP 1: ACCOUNT CREDENTIALS */}
              {signupStep === 1 && (
                <form onSubmit={handleProceedToStep2} className="space-y-4 text-xs">
                  <div>
                    <label className="block font-semibold text-[#252820] mb-1">Full Name</label>
                    <div className="relative">
                      <User className="w-4 h-4 text-[#7E8276] absolute left-3 top-2.5" />
                      <input
                        type="text"
                        required
                        value={authName}
                        onChange={(e) => setAuthName(e.target.value)}
                        placeholder="e.g. Arjun Sharma"
                        className="w-full pl-9 pr-3 py-2 border border-[#D8CFC0] rounded bg-[#FAF8F5] focus:bg-white focus:outline-none focus:border-[#354B3A]"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block font-semibold text-[#252820] mb-1">Email Address</label>
                    <div className="relative">
                      <Mail className="w-4 h-4 text-[#7E8276] absolute left-3 top-2.5" />
                      <input
                        type="email"
                        required
                        value={authEmail}
                        onChange={(e) => setAuthEmail(e.target.value)}
                        placeholder="your.email@example.com"
                        className="w-full pl-9 pr-3 py-2 border border-[#D8CFC0] rounded bg-[#FAF8F5] focus:bg-white focus:outline-none focus:border-[#354B3A]"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block font-semibold text-[#252820] mb-1">
                      Create Password (min 6 characters)
                    </label>
                    <div className="relative">
                      <Lock className="w-4 h-4 text-[#7E8276] absolute left-3 top-2.5" />
                      <input
                        type="password"
                        required
                        value={authPassword}
                        onChange={(e) => setAuthPassword(e.target.value)}
                        placeholder="Create a secure password"
                        className="w-full pl-9 pr-3 py-2 border border-[#D8CFC0] rounded bg-[#FAF8F5] focus:bg-white focus:outline-none focus:border-[#354B3A]"
                      />
                    </div>
                  </div>

                  <div className="pt-2">
                    <button
                      type="submit"
                      className="w-full btn-primary py-2.5 text-xs font-semibold shadow-xs flex items-center justify-center gap-1.5"
                    >
                      <span>Continue to Step 2: Choose Class</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                  </div>

                  <div className="text-center pt-2 text-[#7E8276]">
                    Already registered?{' '}
                    <button
                      type="button"
                      onClick={() => setAuthMode('signin')}
                      className="text-[#354B3A] font-semibold underline cursor-pointer"
                    >
                      Sign In instead
                    </button>
                  </div>
                </form>
              )}

              {/* STEP 2: CLASS SELECTION (Kept separately & only 12th pass, no custom topic) */}
              {signupStep === 2 && (
                <div className="space-y-4 text-xs">
                  <div>
                    <div className="font-serif font-bold text-sm text-[#252820] mb-1">
                      Step 2: Choose Your Class Standard
                    </div>
                    <p className="text-[#575A51] text-[11px] mb-3">
                      Each class level is calibrated separately (up to 12th Pass):
                    </p>
                  </div>

                  {/* 4 Separate Class Option Cards */}
                  <div className="space-y-2">
                    {AVAILABLE_CLASSES.map((cls) => {
                      const isSelected = authClass === cls;
                      return (
                        <div
                          key={cls}
                          onClick={() => setAuthClass(cls)}
                          className={`p-3 rounded-xl border-2 cursor-pointer transition-all flex items-center justify-between ${
                            isSelected
                              ? 'bg-[#E9DFC9] border-[#354B3A] shadow-xs ring-1 ring-[#354B3A]'
                              : 'bg-[#FAF8F5] border-[#D8CFC0] hover:bg-white hover:border-[#354B3A]/60'
                          }`}
                        >
                          <div className="flex items-center gap-2.5">
                            <div
                              className={`w-4 h-4 rounded-full border-2 flex items-center justify-center ${
                                isSelected ? 'border-[#354B3A] bg-[#354B3A]' : 'border-[#7E8276] bg-white'
                              }`}
                            >
                              {isSelected && <div className="w-1.5 h-1.5 rounded-full bg-white" />}
                            </div>
                            <span className="font-bold text-xs text-[#252820]">{cls}</span>
                          </div>

                          <span className="text-[10px] text-[#575A51] font-medium">
                            {cls === 'Class 9'
                              ? 'Foundations & Algorithmic Logic'
                              : cls === 'Class 10'
                              ? 'Core Problem Solving & Board Prep'
                              : cls === 'Class 11'
                              ? 'CS Principles & Loop Engineering'
                              : 'Advanced Systems & Competitive Prep'}
                          </span>
                        </div>
                      );
                    })}
                  </div>

                  {/* Step 2 Navigation Buttons */}
                  <div className="flex items-center justify-between pt-3">
                    <button
                      type="button"
                      onClick={() => setSignupStep(1)}
                      className="px-4 py-2 border border-[#D8CFC0] rounded hover:bg-[#E9DFC9] text-[#575A51] font-semibold text-xs transition-colors"
                    >
                      ← Back
                    </button>
                    <button
                      type="button"
                      onClick={handleProceedToStep3}
                      className="btn-primary py-2 px-5 text-xs font-semibold shadow-xs flex items-center gap-1.5"
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
                    <div className="font-serif font-bold text-sm text-[#252820] mb-1">
                      Step 3: Select Programming Language
                    </div>
                    <p className="text-[#575A51] text-[11px] mb-3">
                      Choose the language you want to learn through playable 2D games:
                    </p>
                  </div>

                  {/* Dropdown Button for Programming Languages */}
                  <div>
                    <label className="block font-semibold text-[#252820] mb-1.5">
                      Programming Language (Select from dropdown):
                    </label>
                    <div className="relative">
                      <select
                        value={authSubject}
                        onChange={(e) => setAuthSubject(e.target.value)}
                        className="w-full appearance-none px-3.5 py-2.5 border-2 border-[#354B3A] rounded-xl bg-white text-xs font-bold text-[#252820] focus:outline-none shadow-xs cursor-pointer pr-10"
                      >
                        {AVAILABLE_SUBJECTS.map((sub) => (
                          <option key={sub.id} value={sub.id}>
                            {sub.name} — {sub.tagline}
                          </option>
                        ))}
                      </select>
                      <ChevronDown className="w-4 h-4 text-[#354B3A] absolute right-3.5 top-3 pointer-events-none" />
                    </div>
                  </div>

                  {/* Live Game Preview Box */}
                  <div className="p-3.5 rounded-xl bg-[#FAF8F5] border border-[#B49A65] space-y-1.5">
                    <div className="flex items-center gap-2 text-xs font-bold text-[#354B3A]">
                      <Gamepad2 className="w-4 h-4 text-[#A65F43]" />
                      <span>Included Game: Rescue the Robot with Python Loops</span>
                    </div>
                    <p className="text-[11px] text-[#575A51] leading-relaxed">
                      You will play an animated 2D grid game to steer the robot, collect energy cells, avoid space rocks, and reach the base beacon.
                    </p>
                    <div className="flex items-center gap-3 pt-1 text-[10px] text-[#7E8276] font-semibold">
                      <span>• 3 Starting Lives ❤️</span>
                      <span>• Real 2D Grid Movement</span>
                      <span>• No Static MCQs</span>
                    </div>
                  </div>

                  {/* Step 3 Navigation Buttons */}
                  <div className="flex items-center justify-between pt-3">
                    <button
                      type="button"
                      onClick={() => setSignupStep(2)}
                      className="px-4 py-2 border border-[#D8CFC0] rounded hover:bg-[#E9DFC9] text-[#575A51] font-semibold text-xs transition-colors"
                    >
                      ← Back
                    </button>
                    <button
                      type="submit"
                      className="btn-primary py-2.5 px-6 text-xs font-bold shadow-md flex items-center gap-1.5"
                    >
                      <span>🚀 Finish Setup & Enter Game Arena</span>
                    </button>
                  </div>
                </form>
              )}
            </div>
          )}
        </div>
      </div>
    );
  }

  // =========================================================================
  // VIEW 2: LOGGED IN -> GAMIFIED LEARNING HUB & 2D PLAYABLE GAME
  // =========================================================================
  const activeSubjectInfo =
    AVAILABLE_SUBJECTS.find((s) => s.id === currentUser.targetSubject) || AVAILABLE_SUBJECTS[0];

  const curriculum =
    SUBJECT_CURRICULA[currentUser.targetSubject] || SUBJECT_CURRICULA['python-basics'] || SUBJECT_CURRICULA['python-algorithms'];

  return (
    <div className="w-full flex-1 flex flex-col py-6 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
      {/* HUD: Student Progress & Learning Target */}
      <div className="w-full bg-[#E9DFC9] border border-[#D8CFC0] rounded-xl p-4 sm:p-6 mb-6 shadow-xs">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-0.5 rounded-full bg-[#F6F1E7] border border-[#D8CFC0] text-xs font-semibold text-[#354B3A] mb-1.5">
              <span>Namaste, {currentUser.name}</span>
              <span>•</span>
              <span className="font-serif italic">{currentUser.rank} Tier</span>
            </div>
            <h1 className="font-serif font-bold text-2xl sm:text-3xl text-[#252820]">
              The Gamified Learning Arena
            </h1>
            <div className="flex flex-wrap items-center gap-2 mt-2 text-xs">
              <span className="text-[#575A51]">
                Language: <strong className="text-[#252820]">{activeSubjectInfo.name}</strong>
              </span>
              <span className="text-[#7E8276]">•</span>
              <span className="text-[#575A51]">
                Class: <strong className="text-[#252820]">{currentUser.studentClass}</strong>
              </span>
              {/* Quick Switch Button */}
              <button
                onClick={() => setIsSwitchOpen(true)}
                className="ml-1 text-[11px] font-bold text-[#A65F43] underline hover:text-[#354B3A] cursor-pointer"
              >
                Change Language / Class
              </button>
            </div>
          </div>

          {/* Quick Stats Grid */}
          <div className="flex items-center gap-3">
            {/* Lives / Hearts */}
            <div className="bg-white border border-[#A65F43] rounded-lg px-3 py-2 text-center shadow-xs">
              <div className="text-[10px] text-[#7E8276] uppercase tracking-wider font-semibold flex items-center justify-center gap-1">
                <Heart className="w-3.5 h-3.5 fill-[#A65F43] text-[#A65F43]" />
                <span>Lives</span>
              </div>
              <div className="font-serif font-bold text-base text-[#A65F43] mt-0.5">
                {currentUser.hearts} / 3
              </div>
              {currentUser.hearts < 3 && (
                <button
                  onClick={handleRestoreHearts}
                  className="text-[9px] text-[#354B3A] font-bold underline mt-0.5 cursor-pointer"
                >
                  Revive (+3 ❤️)
                </button>
              )}
            </div>

            {/* Streak */}
            <div className="bg-white border border-[#D8CFC0] rounded-lg px-3 py-2 text-center shadow-xs">
              <div className="text-[10px] text-[#7E8276] uppercase tracking-wider font-semibold flex items-center justify-center gap-1">
                <Flame className="w-3.5 h-3.5 text-[#A65F43]" />
                <span>Streak</span>
              </div>
              <div className="font-serif font-bold text-base text-[#A65F43] mt-0.5">
                {currentUser.currentStreak}d
              </div>
              <div className="text-[9px] text-[#354B3A]">Active</div>
            </div>

            {/* XP Points */}
            <div className="bg-white border border-[#B49A65] rounded-lg px-3.5 py-2 text-center shadow-xs">
              <div className="text-[10px] text-[#7E8276] uppercase tracking-wider font-semibold flex items-center justify-center gap-1">
                <Award className="w-3.5 h-3.5 text-[#B49A65]" />
                <span>Mastery XP</span>
              </div>
              <div className="font-serif font-bold text-base text-[#354B3A] mt-0.5">
                {currentUser.totalXp}
              </div>
              <div className="text-[9px] text-[#7E8276]">Lvl {currentUser.level || 1}</div>
            </div>
          </div>
        </div>
      </div>

      {/* =========================================================================
          PRIMARY PLAYABLE 2D GAME ARENA (NO MCQs! Play the actual game!)
         ========================================================================= */}
      <div className="mb-8">
        <RobotRescueGame
          onLevelComplete={handleGameLevelComplete}
          onHeartLost={handleHeartLost}
          heartsRemaining={currentUser.hearts}
        />
      </div>

      {/* Learning Quests & Practical Simulator Missions */}
      <div className="w-full">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="font-serif font-bold text-xl sm:text-2xl text-[#252820]">
              Missions & Code Challenges: {activeSubjectInfo.name}
            </h2>
            <p className="text-xs text-[#575A51] mt-0.5">
              Reinforce the loop concepts learned in the game with live Python test suites and practical projects.
            </p>
          </div>

          <Link href="/simulator" className="btn-brass text-xs py-1.5 px-3 flex items-center gap-1.5">
            <Terminal className="w-3.5 h-3.5" />
            <span>Open Python Sandbox</span>
          </Link>
        </div>

        {/* Level Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {curriculum?.levels?.map((lvl, index) => {
            const isCompleted = currentUser.completedMissions.includes(lvl.id);
            const isUnlocked = index === 0 || currentUser.completedMissions.includes(curriculum.levels[index - 1].id);

            return (
              <div
                key={lvl.id}
                className={`rounded-xl border p-5 flex flex-col justify-between transition-all ${
                  isCompleted
                    ? 'bg-[#E2E8E3] border-[#354B3A]'
                    : isUnlocked
                    ? 'bg-white border-[#354B3A] shadow-md ring-1 ring-[#354B3A]/20'
                    : 'bg-[#F0EAE1]/70 border-[#D8CFC0] opacity-75'
                }`}
              >
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-[11px] font-bold text-[#A65F43] uppercase tracking-wider">
                      Stage {lvl.levelNumber}
                    </span>
                    <span className="text-xs font-semibold text-[#7A6230] bg-[#FBF8F2] px-2 py-0.5 rounded border border-[#B49A65]">
                      +{lvl.xpReward} XP
                    </span>
                  </div>

                  <h3 className="font-serif font-bold text-lg text-[#252820] leading-snug">
                    {lvl.title}
                  </h3>

                  <p className="text-xs text-[#575A51] mt-2 line-clamp-2">
                    {lvl.storyNarrative}
                  </p>
                </div>

                <div className="pt-4 border-t border-[#D8CFC0] mt-4 flex items-center justify-between">
                  {isCompleted ? (
                    <span className="inline-flex items-center gap-1 text-xs font-bold text-[#354B3A]">
                      <CheckCircle2 className="w-4 h-4" />
                      <span>Completed</span>
                    </span>
                  ) : isUnlocked ? (
                    <Link
                      href={`/simulator?mission=${lvl.id}`}
                      className="btn-primary text-xs py-1.5 px-3.5 w-full flex items-center justify-center gap-1"
                    >
                      <Play className="w-3.5 h-3.5" />
                      <span>Launch Mission Simulator</span>
                    </Link>
                  ) : (
                    <span className="text-xs text-[#7E8276] flex items-center gap-1">
                      <span>Locked (Complete Stage {lvl.levelNumber - 1})</span>
                    </span>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* CLASS & LANGUAGE SWITCH MODAL */}
      {isSwitchOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div
            className="fixed inset-0 bg-[#252820]/60 backdrop-blur-xs transition-opacity"
            onClick={() => setIsSwitchOpen(false)}
          />

          <div className="relative w-full max-w-md bg-white border border-[#D8CFC0] rounded-2xl shadow-2xl p-6 z-10 animate-in zoom-in-95">
            <div className="flex items-center justify-between border-b border-[#D8CFC0] pb-3 mb-4">
              <h3 className="font-serif font-bold text-lg text-[#252820]">
                Switch Learning Settings
              </h3>
              <button
                onClick={() => setIsSwitchOpen(false)}
                className="p-1 rounded hover:bg-[#FAF8F5] text-[#575A51]"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveClassSubjectSwitch} className="space-y-4 text-xs">
              <div>
                <label className="block font-semibold text-[#252820] mb-1.5">
                  Select Your Class (Up to 12th Pass):
                </label>
                <div className="space-y-1.5">
                  {AVAILABLE_CLASSES.map((c) => (
                    <div
                      key={c}
                      onClick={() => setModalClass(c)}
                      className={`p-2.5 rounded-lg border cursor-pointer transition-all flex items-center justify-between ${
                        modalClass === c
                          ? 'bg-[#E9DFC9] border-[#354B3A] font-bold text-[#252820]'
                          : 'bg-[#FAF8F5] border-[#D8CFC0] hover:bg-white text-[#575A51]'
                      }`}
                    >
                      <span>{c}</span>
                      {modalClass === c && <CheckCircle2 className="w-4 h-4 text-[#354B3A]" />}
                    </div>
                  ))}
                </div>
              </div>

              <div>
                <label className="block font-semibold text-[#252820] mb-1.5">
                  Programming Language (Dropdown Menu):
                </label>
                <div className="relative">
                  <select
                    value={modalSubject}
                    onChange={(e) => setModalSubject(e.target.value)}
                    className="w-full appearance-none px-3.5 py-2.5 border-2 border-[#354B3A] rounded-xl bg-white text-xs font-bold text-[#252820] focus:outline-none cursor-pointer pr-10"
                  >
                    {AVAILABLE_SUBJECTS.map((s) => (
                      <option key={s.id} value={s.id}>
                        {s.name} — {s.tagline}
                      </option>
                    ))}
                  </select>
                  <ChevronDown className="w-4 h-4 text-[#354B3A] absolute right-3.5 top-3 pointer-events-none" />
                </div>
              </div>

              <div className="pt-2 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsSwitchOpen(false)}
                  className="px-4 py-2 border border-[#D8CFC0] rounded hover:bg-[#FAF8F5] text-[#575A51]"
                >
                  Cancel
                </button>
                <button type="submit" className="btn-primary py-2 px-5">
                  Save Changes
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
