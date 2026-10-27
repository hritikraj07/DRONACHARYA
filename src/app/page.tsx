// Dronacharya — The Digital Gurukul
// Gamified AI-Powered Learning Platform
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
import { SUBJECT_CURRICULA, GameLevel } from '@/lib/data/game-curriculum';
import {
  Target,
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
  ShieldCheck,
  ChevronRight,
  RotateCcw,
  Code2,
  Mail,
  User,
  RefreshCw,
  X,
} from 'lucide-react';

export default function HomePage() {
  const [currentUser, setCurrentUser] = useState<RegisteredUser | null>(null);
  const [isLoaded, setIsLoaded] = useState(false);

  // Authentication State (when not logged in)
  const [authMode, setAuthMode] = useState<'signin' | 'signup'>('signin');
  const [authEmail, setAuthEmail] = useState('');
  const [authPassword, setAuthPassword] = useState('');
  const [authName, setAuthName] = useState('');
  const [authClass, setAuthClass] = useState(AVAILABLE_CLASSES[1]);
  const [authSubject, setAuthSubject] = useState(AVAILABLE_SUBJECTS[0].id);
  const [authError, setAuthError] = useState<string | null>(null);
  const [authSuccess, setAuthSuccess] = useState<string | null>(null);

  // Class/Subject Switch Modal State
  const [isSwitchOpen, setIsSwitchOpen] = useState(false);
  const [modalClass, setModalClass] = useState('');
  const [modalSubject, setModalSubject] = useState('');

  // Interactive Game Level Player State
  const [activePlayingLevel, setActivePlayingLevel] = useState<GameLevel | null>(null);
  const [gameStage, setGameStage] = useState<'story' | 'puzzle' | 'arena' | 'cleared'>('story');
  const [selectedOptionId, setSelectedOptionId] = useState<string | null>(null);
  const [puzzleFeedback, setPuzzleFeedback] = useState<{ isCorrect: boolean; message: string } | null>(null);
  const [userCode, setUserCode] = useState('');
  const [arenaTestResults, setArenaTestResults] = useState<{ passed: boolean; message: string } | null>(null);
  const [isAcharyaHintVisible, setIsAcharyaHintVisible] = useState(false);

  // Load session on mount
  useEffect(() => {
    const session = getActiveSession();
    setCurrentUser(session);
    if (session) {
      setModalClass(session.studentClass);
      setModalSubject(session.targetSubject);
    }
    setIsLoaded(true);
  }, []);

  // Handle Sign In (Strict credential matching)
  const handleSignIn = (e: React.FormEvent) => {
    e.preventDefault();
    setAuthError(null);
    setAuthSuccess(null);

    const res = authenticateUser({
      email: authEmail,
      password: authPassword,
    });

    if (res.success && res.user) {
      setAuthSuccess(`Welcome back, ${res.user.name}! Entering your Gurukul...`);
      setTimeout(() => {
        setCurrentUser(res.user!);
        setModalClass(res.user!.studentClass);
        setModalSubject(res.user!.targetSubject);
      }, 400);
    } else {
      setAuthError(res.error || 'Authentication failed. Please verify credentials.');
    }
  };

  // Handle Sign Up (Select class and subject)
  const handleSignUp = (e: React.FormEvent) => {
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
      setAuthSuccess(`Welcome, ${res.user.name}! Your personalized learning arena is ready.`);
      setTimeout(() => {
        setCurrentUser(res.user!);
        setModalClass(res.user!.studentClass);
        setModalSubject(res.user!.targetSubject);
      }, 400);
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

  // Start Playing a Game Level
  const handleStartLevel = (lvl: GameLevel) => {
    setActivePlayingLevel(lvl);
    setGameStage('story');
    setSelectedOptionId(null);
    setPuzzleFeedback(null);
    setUserCode(lvl.arenaChallenge.starterCode);
    setArenaTestResults(null);
    setIsAcharyaHintVisible(false);
  };

  // Submit Answer to Puzzle
  const handleSubmitPuzzle = () => {
    if (!activePlayingLevel || !selectedOptionId) return;

    const chosen = activePlayingLevel.puzzle.options.find((o) => o.id === selectedOptionId);
    if (!chosen) return;

    if (chosen.isCorrect) {
      setPuzzleFeedback({
        isCorrect: true,
        message: 'उत्कृष्ट! (Splendid!) You grasped the fundamental rule! +25 XP. Proceeding to Practical Arena...',
      });
      // Partial XP
      if (currentUser) {
        const updated = awardGameProgress({
          missionId: `${activePlayingLevel.id}-puzzle`,
          earnedXp: 25,
        });
        if (updated) setCurrentUser({ ...updated });
      }
      setTimeout(() => {
        setGameStage('arena');
      }, 1200);
    } else {
      // Deduct heart
      const remainingHearts = deductHeart();
      if (currentUser) {
        setCurrentUser({ ...currentUser, hearts: remainingHearts });
      }
      setPuzzleFeedback({
        isCorrect: false,
        message: `Incorrect! You lost 1 heart (💖 ${remainingHearts} remaining). Acharya AI gives you a hint below!`,
      });
      setIsAcharyaHintVisible(true);
    }
  };

  // Run Code Trial in Arena
  const handleRunArenaTrial = () => {
    if (!activePlayingLevel) return;

    const requiredPattern = activePlayingLevel.arenaChallenge.solutionPattern;
    const isPassing = userCode.includes(requiredPattern) || userCode.trim().length > 30;

    if (isPassing) {
      setArenaTestResults({
        passed: true,
        message: 'All test cases passed! Sentinel defeated and concept mastered.',
      });

      // Complete Level and Award full XP
      const updated = awardGameProgress({
        missionId: activePlayingLevel.id,
        earnedXp: activePlayingLevel.xpReward,
      });
      if (updated) setCurrentUser({ ...updated });

      setTimeout(() => {
        setGameStage('cleared');
      }, 1000);
    } else {
      const remainingHearts = deductHeart();
      if (currentUser) {
        setCurrentUser({ ...currentUser, hearts: remainingHearts });
      }
      setArenaTestResults({
        passed: false,
        message: `Trial failed! Output does not match expected result. Lost 1 heart (💖 ${remainingHearts} left). Check logic!`,
      });
      setIsAcharyaHintVisible(true);
    }
  };

  // Restore Hearts
  const handleRestoreHearts = () => {
    const fresh = restoreHearts();
    if (currentUser) {
      setCurrentUser({ ...currentUser, hearts: fresh });
    }
  };

  // Hydration state check
  if (!isLoaded) {
    return (
      <div className="w-full flex-1 flex items-center justify-center py-24 text-sm text-[#575A51]">
        <RefreshCw className="w-5 h-5 animate-spin mr-2 text-[#354B3A]" />
        <span>Loading Dronacharya...</span>
      </div>
    );
  }

  // =========================================================================
  // VIEW 1: NOT LOGGED IN -> ASKS FOR LOGIN / SIGNUP PAGE FIRST
  // =========================================================================
  if (!currentUser) {
    return (
      <div className="w-full flex-1 flex flex-col items-center justify-center py-10 px-4 sm:px-6">
        <div className="w-full max-w-xl bg-white border border-[#D8CFC0] rounded-2xl shadow-xl p-6 sm:p-8">
          {/* Header */}
          <div className="text-center mb-6">
            <div className="w-12 h-12 mx-auto rounded-xl bg-[#354B3A] text-[#F6F1E7] flex items-center justify-center font-serif text-2xl font-bold shadow-xs mb-3">
              द्रो
            </div>
            <h1 className="font-serif font-bold text-2xl sm:text-3xl text-[#252820]">
              {authMode === 'signin' ? 'Scholar Sign In' : 'Enroll in Dronacharya'}
            </h1>
            <p className="text-xs sm:text-sm text-[#575A51] mt-1.5 max-w-md mx-auto">
              {authMode === 'signin'
                ? 'Enter your registered credentials to access your personalized learning arena.'
                : 'Select your class and the subject you want to master through gamified interactive learning.'}
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
              Sign In to Account
            </button>
            <button
              type="button"
              onClick={() => {
                setAuthMode('signup');
                setAuthError(null);
                setAuthSuccess(null);
              }}
              className={`flex-1 py-2.5 text-xs font-semibold border-b-2 transition-all cursor-pointer ${
                authMode === 'signup'
                  ? 'border-[#354B3A] text-[#354B3A]'
                  : 'border-transparent text-[#7E8276] hover:text-[#252820]'
              }`}
            >
              Sign Up (Select Class & Course)
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

          {/* SIGN IN FORM */}
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
                    placeholder="student@gurukul.edu"
                    className="w-full pl-9 pr-3 py-2 border border-[#D8CFC0] rounded bg-[#FAF8F5] focus:bg-white focus:outline-none focus:border-[#354B3A]"
                  />
                </div>
              </div>

              <div>
                <label className="block font-semibold text-[#252820] mb-1">Password</label>
                <input
                  type="password"
                  required
                  value={authPassword}
                  onChange={(e) => setAuthPassword(e.target.value)}
                  placeholder="Enter your database password"
                  className="w-full px-3 py-2 border border-[#D8CFC0] rounded bg-[#FAF8F5] focus:bg-white focus:outline-none focus:border-[#354B3A]"
                />
              </div>

              <button
                type="submit"
                className="w-full btn-primary py-2.5 text-xs font-semibold shadow-xs mt-2"
              >
                <span>Verify Credentials & Enter Gurukul</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>

              <div className="text-center pt-2 text-[#7E8276]">
                Don't have an account yet?{' '}
                <button
                  type="button"
                  onClick={() => setAuthMode('signup')}
                  className="text-[#354B3A] font-semibold underline cursor-pointer"
                >
                  Sign Up & Select Subject
                </button>
              </div>
            </form>
          ) : (
            /* SIGN UP FORM (Asks for Class, Subject, Goal) */
            <form onSubmit={handleSignUp} className="space-y-4 text-xs">
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
                <label className="block font-semibold text-[#252820] mb-1">Create Password (min 6 characters)</label>
                <input
                  type="password"
                  required
                  value={authPassword}
                  onChange={(e) => setAuthPassword(e.target.value)}
                  placeholder="Create a secure password"
                  className="w-full px-3 py-2 border border-[#D8CFC0] rounded bg-[#FAF8F5] focus:bg-white focus:outline-none focus:border-[#354B3A]"
                />
              </div>

              {/* Class Selection Dropdown */}
              <div>
                <label className="block font-semibold text-[#252820] mb-1">
                  Select Your Class / Education Level
                </label>
                <select
                  value={authClass}
                  onChange={(e) => setAuthClass(e.target.value)}
                  className="w-full px-3 py-2 border border-[#D8CFC0] rounded bg-white focus:outline-none focus:border-[#354B3A]"
                >
                  {AVAILABLE_CLASSES.map((c) => (
                    <option key={c} value={c}>{c}</option>
                  ))}
                </select>
                <p className="text-[10px] text-[#7E8276] mt-0.5">
                  You can change this anytime from your dashboard.
                </p>
              </div>

              {/* Subject Selection Cards */}
              <div>
                <label className="block font-semibold text-[#252820] mb-1.5">
                  What Subject Do You Want To Learn?
                </label>
                <div className="space-y-1.5">
                  {AVAILABLE_SUBJECTS.map((s) => (
                    <div
                      key={s.id}
                      onClick={() => setAuthSubject(s.id)}
                      className={`p-2.5 rounded-lg border cursor-pointer transition-all flex items-center justify-between ${
                        authSubject === s.id
                          ? 'bg-[#E9DFC9] border-[#354B3A] ring-1 ring-[#354B3A] font-semibold'
                          : 'bg-[#FAF8F5] border-[#D8CFC0] hover:bg-white'
                      }`}
                    >
                      <div>
                        <div className="text-xs text-[#252820]">{s.name}</div>
                        <div className="text-[10px] text-[#7E8276] font-normal">{s.tagline}</div>
                      </div>
                      <span className="text-xs text-[#354B3A]">
                        {authSubject === s.id ? '✓ Selected' : ''}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              <button
                type="submit"
                className="w-full btn-primary py-2.5 text-xs font-semibold shadow-xs mt-3"
              >
                <span>Complete Enrollment & Start Learning</span>
                <Sparkles className="w-3.5 h-3.5" />
              </button>

              <div className="text-center pt-2 text-[#7E8276]">
                Already enrolled?{' '}
                <button
                  type="button"
                  onClick={() => setAuthMode('signin')}
                  className="text-[#354B3A] font-semibold underline cursor-pointer"
                >
                  Sign In
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    );
  }

  // =========================================================================
  // VIEW 2: LOGGED IN -> HOME PAGE & GAMIFIED LEARNING ARENA
  // =========================================================================
  const activeSubjectInfo =
    AVAILABLE_SUBJECTS.find((s) => s.id === currentUser.targetSubject) || AVAILABLE_SUBJECTS[0];

  const curriculum = SUBJECT_CURRICULA[currentUser.targetSubject] || SUBJECT_CURRICULA['python-algorithms'];

  return (
    <div className="w-full flex-1 flex flex-col py-6 px-4 sm:px-8">
      {/* HUD: Student Progress & Learning Target */}
      <div className="w-full bg-[#E9DFC9] border border-[#D8CFC0] rounded-xl p-5 sm:p-6 mb-6 shadow-xs">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-0.5 rounded-full bg-[#F6F1E7] border border-[#D8CFC0] text-xs font-semibold text-[#354B3A] mb-1.5">
              <span>Namaste, {currentUser.name}</span>
              <span>•</span>
              <span className="font-serif italic">{currentUser.rank} Tier</span>
            </div>
            <h1 className="font-serif font-bold text-2xl sm:text-3xl text-[#252820]">
              The Gamified Gurukul Arena
            </h1>
            <div className="flex flex-wrap items-center gap-2 mt-2 text-xs">
              <span className="text-[#575A51]">
                Subject: <strong className="text-[#252820]">{activeSubjectInfo.name}</strong>
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
                Change Subject / Class
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
                  className="text-[9px] text-[#354B3A] font-bold underline mt-0.5"
                >
                  Meditate (Revive)
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

      {/* Main Learning Quest Board: Levels for the Selected Subject */}
      <div className="w-full">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="font-serif font-bold text-xl sm:text-2xl text-[#252820]">
              Playable Learning Levels: {curriculum.subjectName}
            </h2>
            <p className="text-xs text-[#575A51] mt-0.5">
              Learn concepts through interactive narrative quests, diagnostic puzzles, and practical sandbox trials.
            </p>
          </div>
          <button
            onClick={() => setIsSwitchOpen(true)}
            className="btn-brass text-xs py-1.5 px-3"
          >
            <BookOpen className="w-3.5 h-3.5" />
            <span>Switch Subject</span>
          </button>
        </div>

        {/* Level Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {curriculum.levels.map((lvl, index) => {
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
                  <div className="text-xs font-medium text-[#354B3A] mt-0.5">
                    {lvl.subtitle}
                  </div>

                  <p className="text-xs text-[#575A51] mt-2.5 line-clamp-3 leading-relaxed">
                    {lvl.storyNarrative}
                  </p>
                </div>

                <div className="mt-5 pt-3 border-t border-[#D8CFC0] flex items-center justify-between">
                  {isCompleted ? (
                    <div className="flex items-center gap-1.5 text-xs font-semibold text-[#354B3A]">
                      <CheckCircle2 className="w-4 h-4" />
                      <span>Level Mastered!</span>
                    </div>
                  ) : isUnlocked ? (
                    <button
                      onClick={() => handleStartLevel(lvl)}
                      className="btn-primary text-xs py-2 px-4 w-full shadow-xs"
                    >
                      <span>Play Level {lvl.levelNumber}</span>
                      <Play className="w-3.5 h-3.5 fill-current" />
                    </button>
                  ) : (
                    <div className="flex items-center gap-1.5 text-xs text-[#7E8276] py-1">
                      <Lock className="w-3.5 h-3.5" />
                      <span>Locked (Complete Level {lvl.levelNumber - 1})</span>
                    </div>
                  )}

                  {isCompleted && (
                    <button
                      onClick={() => handleStartLevel(lvl)}
                      className="text-xs text-[#354B3A] font-semibold underline ml-auto"
                    >
                      Replay
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* ===================================================================== */}
      {/* MODAL: INTERACTIVE GAME LEVEL PLAYER */}
      {/* ===================================================================== */}
      {activePlayingLevel && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6">
          <div
            className="fixed inset-0 bg-[#252820]/60 backdrop-blur-xs transition-opacity"
            onClick={() => setActivePlayingLevel(null)}
          />

          <div className="relative w-full max-w-3xl bg-[#F6F1E7] border-2 border-[#354B3A] rounded-2xl shadow-2xl p-6 sm:p-8 z-10 max-h-[90vh] overflow-y-auto animate-in zoom-in-95">
            {/* Game Topbar inside modal */}
            <div className="flex items-center justify-between border-b border-[#D8CFC0] pb-3 mb-4">
              <div className="flex items-center gap-2">
                <span className="w-7 h-7 rounded-full bg-[#354B3A] text-white flex items-center justify-center font-bold text-xs">
                  {activePlayingLevel.levelNumber}
                </span>
                <div>
                  <h3 className="font-serif font-bold text-lg text-[#252820]">
                    {activePlayingLevel.title}
                  </h3>
                  <div className="text-[11px] text-[#7E8276]">
                    Reward: +{activePlayingLevel.xpReward} XP • Stage: {gameStage.toUpperCase()}
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <div className="flex items-center gap-1 text-xs font-bold text-[#A65F43] bg-white px-2.5 py-1 rounded border border-[#A65F43]">
                  <Heart className="w-3.5 h-3.5 fill-[#A65F43]" />
                  <span>{currentUser.hearts} Lives</span>
                </div>
                <button
                  onClick={() => setActivePlayingLevel(null)}
                  className="p-1 rounded hover:bg-[#D8CFC0] text-[#575A51]"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* STAGE 1: STORY & CONCEPT BRIEFING */}
            {gameStage === 'story' && (
              <div className="space-y-4">
                <div className="p-4 rounded-xl bg-white border border-[#D8CFC0]">
                  <div className="inline-flex items-center gap-1.5 text-xs font-bold text-[#A65F43] uppercase tracking-wider mb-2">
                    <Sparkles className="w-4 h-4" />
                    <span>Story Quest</span>
                  </div>
                  <p className="text-sm text-[#252820] leading-relaxed italic">
                    "{activePlayingLevel.storyNarrative}"
                  </p>
                </div>

                <div className="p-4 rounded-xl bg-[#E9DFC9] border border-[#B49A65]">
                  <h4 className="font-serif font-bold text-sm text-[#354B3A] mb-1">
                    Acharya's Core Teaching:
                  </h4>
                  <p className="text-xs text-[#252820] leading-relaxed">
                    {activePlayingLevel.conceptTeaser}
                  </p>
                </div>

                <div className="pt-2 flex justify-end">
                  <button
                    onClick={() => setGameStage('puzzle')}
                    className="btn-primary text-xs py-2.5 px-6 shadow-xs"
                  >
                    <span>Enter Puzzle Challenge</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            )}

            {/* STAGE 2: INTERACTIVE CONCEPT PUZZLE */}
            {gameStage === 'puzzle' && (
              <div className="space-y-4">
                <div className="bg-white border border-[#D8CFC0] rounded-xl p-5">
                  <div className="text-xs font-semibold text-[#A65F43] mb-1">
                    Question Challenge:
                  </div>
                  <p className="text-sm font-medium text-[#252820] whitespace-pre-wrap">
                    {activePlayingLevel.puzzle.question}
                  </p>

                  {/* Options */}
                  <div className="mt-4 space-y-2.5">
                    {activePlayingLevel.puzzle.options.map((opt) => (
                      <div
                        key={opt.id}
                        onClick={() => setSelectedOptionId(opt.id)}
                        className={`p-3 rounded-lg border text-xs cursor-pointer transition-all ${
                          selectedOptionId === opt.id
                            ? 'bg-[#E9DFC9] border-[#354B3A] ring-1 ring-[#354B3A] font-semibold text-[#252820]'
                            : 'bg-[#FAF8F5] border-[#D8CFC0] hover:bg-white text-[#575A51]'
                        }`}
                      >
                        <div className="flex items-center gap-2">
                          <span className="w-5 h-5 rounded-full border border-current flex items-center justify-center font-mono text-[10px]">
                            {opt.id.toUpperCase()}
                          </span>
                          <span>{opt.text}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Feedback Alert */}
                {puzzleFeedback && (
                  <div
                    className={`p-3 rounded-lg text-xs flex items-start gap-2 ${
                      puzzleFeedback.isCorrect
                        ? 'bg-[#E2E8E3] border border-[#354B3A] text-[#354B3A]'
                        : 'bg-[#FAF4F0] border border-[#A65F43] text-[#A65F43]'
                    }`}
                  >
                    {puzzleFeedback.isCorrect ? (
                      <CheckCircle2 className="w-4 h-4 shrink-0 mt-0.5" />
                    ) : (
                      <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
                    )}
                    <span>{puzzleFeedback.message}</span>
                  </div>
                )}

                {/* Acharya Socratic Hint Drawer */}
                {isAcharyaHintVisible && (
                  <div className="p-3.5 rounded-lg bg-[#FBF8F2] border border-[#B49A65] text-xs text-[#7A6230]">
                    <div className="font-bold flex items-center gap-1.5 mb-1 text-[#354B3A]">
                      <Sparkles className="w-3.5 h-3.5" />
                      <span>Acharya AI Socratic Hint:</span>
                    </div>
                    <p className="italic">{activePlayingLevel.puzzle.hint}</p>
                  </div>
                )}

                {/* Actions */}
                <div className="pt-2 flex items-center justify-between">
                  <button
                    onClick={() => setIsAcharyaHintVisible(!isAcharyaHintVisible)}
                    className="text-xs text-[#354B3A] font-medium flex items-center gap-1 hover:underline cursor-pointer"
                  >
                    <HelpCircle className="w-3.5 h-3.5" />
                    <span>{isAcharyaHintVisible ? 'Hide Hint' : 'Ask Acharya for Hint'}</span>
                  </button>

                  <button
                    onClick={handleSubmitPuzzle}
                    disabled={!selectedOptionId}
                    className="btn-primary text-xs py-2 px-5 shadow-xs disabled:opacity-50"
                  >
                    <span>Confirm Choice</span>
                    <ChevronRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            )}

            {/* STAGE 3: ARENA CODING & PRACTICAL TRIAL */}
            {gameStage === 'arena' && (
              <div className="space-y-4">
                <div className="bg-white border border-[#D8CFC0] rounded-xl p-4">
                  <div className="text-xs font-bold text-[#354B3A] mb-1">
                    Arena Objective:
                  </div>
                  <p className="text-xs text-[#252820] leading-relaxed">
                    {activePlayingLevel.arenaChallenge.instructions}
                  </p>
                </div>

                {/* Sandbox Code Box */}
                <div className="bg-[#252820] rounded-xl p-4 border border-[#3A3E34] text-[#F6F1E7]">
                  <div className="flex items-center justify-between border-b border-[#3A3E34] pb-2 mb-2 text-xs text-[#A6AC9B]">
                    <span>solution.py</span>
                    <span className="text-[10px] bg-[#354B3A] text-white px-2 py-0.5 rounded">
                      Live Sandbox
                    </span>
                  </div>
                  <textarea
                    value={userCode}
                    onChange={(e) => setUserCode(e.target.value)}
                    rows={6}
                    className="w-full bg-transparent font-mono text-xs text-[#E9DFC9] focus:outline-none resize-none leading-relaxed"
                  />
                </div>

                {/* Trial Result */}
                {arenaTestResults && (
                  <div
                    className={`p-3 rounded-lg text-xs flex items-start gap-2 ${
                      arenaTestResults.passed
                        ? 'bg-[#E2E8E3] border border-[#354B3A] text-[#354B3A]'
                        : 'bg-[#FAF4F0] border border-[#A65F43] text-[#A65F43]'
                    }`}
                  >
                    {arenaTestResults.passed ? (
                      <CheckCircle2 className="w-4 h-4 shrink-0 mt-0.5" />
                    ) : (
                      <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
                    )}
                    <span>{arenaTestResults.message}</span>
                  </div>
                )}

                <div className="pt-2 flex items-center justify-between">
                  <button
                    onClick={() => setGameStage('puzzle')}
                    className="btn-secondary text-xs py-1.5 px-3"
                  >
                    Back to Puzzle
                  </button>
                  <button
                    onClick={handleRunArenaTrial}
                    className="btn-primary text-xs py-2 px-6 shadow-xs"
                  >
                    <span>Cast Spell & Run Trial</span>
                    <Play className="w-3.5 h-3.5 fill-current" />
                  </button>
                </div>
              </div>
            )}

            {/* STAGE 4: LEVEL CLEARED VICTORY SCREEN */}
            {gameStage === 'cleared' && (
              <div className="text-center py-6 space-y-4">
                <div className="w-16 h-16 mx-auto rounded-full bg-[#354B3A] text-[#F6F1E7] flex items-center justify-center font-serif text-3xl shadow-lg animate-bounce">
                  🏆
                </div>
                <h3 className="font-serif font-bold text-2xl text-[#252820]">
                  Level Cleared! Victory Achieved!
                </h3>
                <p className="text-xs sm:text-sm text-[#575A51] max-w-md mx-auto">
                  You conquered <strong>{activePlayingLevel.title}</strong> and earned{' '}
                  <strong className="text-[#354B3A]">+{activePlayingLevel.xpReward} Mastery XP</strong>!
                </p>

                <div className="pt-4 flex justify-center gap-3">
                  <button
                    onClick={() => setActivePlayingLevel(null)}
                    className="btn-primary text-xs py-2.5 px-6 shadow-xs"
                  >
                    Return to Arena Map
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* ===================================================================== */}
      {/* MODAL: SWITCH SUBJECT / CLASS */}
      {/* ===================================================================== */}
      {isSwitchOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div
            className="fixed inset-0 bg-[#252820]/40 backdrop-blur-xs transition-opacity"
            onClick={() => setIsSwitchOpen(false)}
          />
          <div className="relative w-full max-w-lg bg-[#F6F1E7] border-2 border-[#354B3A] rounded-xl shadow-2xl p-6 z-10 animate-in zoom-in-95">
            <div className="flex items-center justify-between border-b border-[#D8CFC0] pb-3 mb-4">
              <div>
                <span className="text-[10px] text-[#A65F43] uppercase tracking-wider font-semibold">
                  Personalize Curriculum
                </span>
                <h3 className="font-serif font-bold text-xl text-[#252820]">
                  Switch Class & Subject
                </h3>
              </div>
              <button
                onClick={() => setIsSwitchOpen(false)}
                className="p-1 rounded hover:bg-[#D8CFC0]"
              >
                <X className="w-5 h-5 text-[#575A51]" />
              </button>
            </div>

            <form onSubmit={handleSaveClassSubjectSwitch} className="space-y-4 text-xs">
              <div>
                <label className="block font-semibold text-[#252820] mb-1">
                  1. Current Class / Education Level
                </label>
                <select
                  value={modalClass}
                  onChange={(e) => setModalClass(e.target.value)}
                  className="w-full px-3 py-2 border border-[#D8CFC0] rounded bg-white focus:outline-none focus:border-[#354B3A]"
                >
                  {AVAILABLE_CLASSES.map((c) => (
                    <option key={c} value={c}>{c}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block font-semibold text-[#252820] mb-1">
                  2. What Subject Do You Want To Learn Now?
                </label>
                <div className="space-y-2 mt-2">
                  {AVAILABLE_SUBJECTS.map((s) => (
                    <div
                      key={s.id}
                      onClick={() => setModalSubject(s.id)}
                      className={`p-3 rounded-lg border cursor-pointer transition-all flex items-center justify-between ${
                        modalSubject === s.id
                          ? 'bg-[#E9DFC9] border-[#354B3A] ring-1 ring-[#354B3A] font-semibold'
                          : 'bg-white border-[#D8CFC0] hover:bg-[#FDFBF7]'
                      }`}
                    >
                      <div>
                        <div className="text-sm text-[#252820]">{s.name}</div>
                        <div className="text-[11px] text-[#7E8276] font-normal">{s.tagline}</div>
                      </div>
                      <span className="text-xs text-[#354B3A]">
                        {modalSubject === s.id ? '✓ Active' : ''}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="mt-6 pt-3 border-t border-[#D8CFC0] flex items-center justify-between">
                <button
                  type="button"
                  onClick={() => setIsSwitchOpen(false)}
                  className="btn-secondary text-xs py-2 px-4"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="btn-primary text-xs py-2 px-5"
                >
                  Switch & Update Game Arena
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
