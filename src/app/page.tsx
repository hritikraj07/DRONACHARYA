// Dronacharya — Gamified AI-Powered Coding Adventure
// Faithful Codédex Clone with Dronacharya Branding (DRONACHARYA ⋆˙⟡)
'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import {
  getActiveSession,
  setActiveSession,
  authenticateUser,
  registerUser,
  createGuestSession,
  RegisteredUser,
  AVAILABLE_CLASSES,
  AVAILABLE_SUBJECTS,
} from '@/lib/db/auth-db';
import { COURSES_CATALOG, Course } from '@/lib/data/course-system';
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
  Globe,
  Palette,
  ExternalLink,
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
  const [authClass, setAuthClass] = useState(AVAILABLE_CLASSES[1]);
  const [authSubject, setAuthSubject] = useState('html');
  const [authError, setAuthError] = useState<string | null>(null);
  const [authSuccess, setAuthSuccess] = useState<string | null>(null);

  // Hero In-Browser Code Studio State
  const [activeCodeTab, setActiveCodeTab] = useState<'python' | 'html' | 'javascript'>('python');
  const [isExecutingCode, setIsExecutingCode] = useState(false);
  const [codeOutput, setCodeOutput] = useState<string>(
    `> Python 3.12 initialized in browser via Pyodide.\n> Ready to run! Click "Run Code ▶" above.`
  );

  const CODE_SNIPPETS = {
    python: {
      fileName: 'main.py',
      badge: 'Python 101',
      badgeColor: '#306998',
      code: [
        '# 🐍 Python 101: Your First Quest',
        'adventurer = "Scholar"',
        'xp = 100',
        'skills = ["Loops", "Functions", "Logic"]',
        '',
        'print(f"🌟 Welcome to Gurukul, {adventurer}!")',
        'print(f"⚔️ Mastered {len(skills)} core skills.")',
        'print(f"✨ Quest 1 Complete • +{xp} XP Earned!")',
      ],
      defaultOutput: `> 🌟 Welcome to Gurukul, Scholar!\n> ⚔️ Mastered 3 core skills.\n> ✨ Quest 1 Complete • +100 XP Earned!\n> Status: 100% Success • Level Up Available`,
    },
    html: {
      fileName: 'index.html',
      badge: 'HTML 101',
      badgeColor: '#E44D26',
      code: [
        '<!-- 🌐 Web Studio: Responsive Card -->',
        '<div class="adventure-badge">',
        '  <h2>DRONACHARYA ⋆˙⟡</h2>',
        '  <p>Learn web development by doing.</p>',
        '  <button class="cta-btn">Start Quest</button>',
        '</div>',
      ],
      defaultOutput: `> HTML DOM Tree parsed successfully.\n> Rendered 4 elements in preview viewport.\n> CSS styles matched & applied cleanly.`,
    },
    javascript: {
      fileName: 'app.js',
      badge: 'JavaScript 101',
      badgeColor: '#F7DF1E',
      code: [
        '// ⚡ JavaScript 101: Interactive Logic',
        'const scholar = { name: "Explorer", hearts: 5 };',
        'let totalXp = 250;',
        '',
        'function unlockBadge(badgeName) {',
        '  return `🏆 Seal Unlocked: [${badgeName}] (+50 XP)`;',
        '}',
        '',
        'console.log(unlockBadge("Logic Labyrinth"));',
      ],
      defaultOutput: `> 🏆 Seal Unlocked: [Logic Labyrinth] (+50 XP)\n> Total Scholar XP: 300\n> 🛡️ Hearts remaining: 5/5`,
    },
  };

  // Course Filter State
  const [journeyFilter, setJourneyFilter] = useState<'all' | 'active' | 'coming'>('all');

  // Sync user state on mount
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

  const handleRunCode = () => {
    setIsExecutingCode(true);
    setTimeout(() => {
      setIsExecutingCode(false);
      setCodeOutput(CODE_SNIPPETS[activeCodeTab].defaultOutput);
      try {
        confetti({ particleCount: 40, spread: 60, origin: { y: 0.6 } });
      } catch (e) {}
    }, 350);
  };

  // Handle Sign In
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
      setAuthSuccess(`Welcome back, ${res.user.name}! Entering your learning realm...`);
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
      setAuthError('Please enter your adventurer name.');
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
      setAuthError('Please select your experience grade.');
      return;
    }
    setSignupStep(3);
  };

  // Step 3 Completion -> Register in Database
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
      setAuthSuccess(`Welcome, ${res.user.name}! Your adventure begins.`);
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

  // Filtered courses for Journey section
  const displayedCourses = COURSES_CATALOG.filter((c) => {
    if (journeyFilter === 'active') return !c.isComingSoon;
    if (journeyFilter === 'coming') return c.isComingSoon;
    return true;
  });

  return (
    <div className="w-full flex flex-col items-center bg-[#F5F2EB] text-[#1E1E24] overflow-x-hidden">
      {/* =========================================================================
          1. CODÉDEX HERO SECTION WITH AMBIENT ADVENTURE SCENERY
         ========================================================================= */}
      <section className="relative w-full overflow-hidden">
        {/* Ambient Adventure Landscape Scenery (Ghibli / Retro 16-Bit Fantasy Mountains & Gurukul Peak, No Flowers) */}
        <div className="absolute inset-0 z-0 pointer-events-none select-none overflow-hidden">
          <img
            src="/adventure-hero-bg.jpg"
            alt="Dronacharya Adventure Realm Scenery"
            className="w-full h-full object-cover object-top opacity-35 sm:opacity-40 filter saturate-110"
          />
          {/* Smooth Multi-Stop Gradient Mask: Seamlessly transitions into #F5F2EB */}
          <div
            className="absolute inset-0"
            style={{
              background:
                'linear-gradient(to bottom, rgba(245, 242, 235, 0.15) 0%, rgba(245, 242, 235, 0.45) 45%, rgba(245, 242, 235, 0.85) 75%, #F5F2EB 100%)',
            }}
          />
        </div>

        <div className="relative z-10 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 sm:pt-14 pb-12 sm:pb-16">
          <div className="grid grid-cols-1 md:grid-cols-12 gap-8 lg:gap-12 items-center">
            {/* Left Column: Authentic Codédex Copy & Dual CTAs */}
            <div className="md:col-span-6 lg:col-span-6 space-y-6">
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#FFD214] border-2 border-[#1E1E24] shadow-[2px_2px_0px_#1E1E24]">
                <Sparkles className="w-4 h-4 text-[#1E1E24]" />
                <span className="text-xs font-black uppercase tracking-wider text-[#1E1E24]">
                  THE DIGITAL GURUKUL ⋆˙⟡ CODING ADVENTURE
                </span>
              </div>

              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black text-[#1E1E24] leading-[1.05] tracking-tight">
                START YOUR <br />
                <span className="inline-block pb-2 pr-1 bg-gradient-to-r from-[#6C5CE7] via-[#FF7675] to-[#FFD214] bg-clip-text text-transparent">
                  Coding Adventure
                </span>{' '}
                <span className="text-[#FFD214] text-3xl sm:text-4xl">⋆˙⟡</span>
              </h1>

              <p className="text-sm sm:text-base text-[#4A4A58] max-w-xl font-bold leading-relaxed">
                The most fun and beginner-friendly way to learn to code. Level up through bite-sized RPG quests, code live in browser studios, and build real-world web apps & games.
              </p>

              {/* Dual CTAs (Tactile Arcade Buttons) */}
              <div className="flex flex-wrap items-center gap-4 pt-1">
                <button
                  onClick={() => {
                    setAuthMode('signup');
                    setIsAuthModalOpen(true);
                  }}
                  className="btn-arcade btn-arcade-gold px-7 py-3.5 flex items-center gap-2"
                >
                  <Sparkles className="w-4 h-4 text-[#071426]" />
                  <span>Start Your Adventure 🚀</span>
                </button>

                <Link
                  href="/courses"
                  className="btn-arcade btn-arcade-white px-6 py-3.5 flex items-center gap-2"
                >
                  <Compass className="w-4 h-4 text-[#6C5CE7]" />
                  <span>Explore All Quests →</span>
                </Link>
              </div>

              {/* Feature Bullets */}
              <div className="flex flex-wrap items-center gap-4 pt-1 text-xs font-bold text-[#4A4A58]">
                <div className="flex items-center gap-1.5">
                  <span className="w-2.5 h-2.5 rounded-full bg-[#00B894]" />
                  <span>100% Free Sandbox</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <span className="w-2.5 h-2.5 rounded-full bg-[#6C5CE7]" />
                  <span>Zero Installs (In-Browser)</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <span className="w-2.5 h-2.5 rounded-full bg-[#FFD214]" />
                  <span>Socratic AI Mentorship</span>
                </div>
              </div>
            </div>

            {/* Right Column: In-Browser Interactive Code Studio */}
            <div className="md:col-span-6 lg:col-span-6">
              <div className="bg-[#1E1E24] rounded-3xl border-3 border-[#1E1E24] shadow-[8px_8px_0px_#1E1E24] overflow-hidden text-white font-mono text-xs">
                {/* Studio Window Header Bar */}
                <div className="bg-[#2A2B36] px-4 py-3 border-b-2 border-[#12131A] flex items-center justify-between gap-3">
                  {/* Dots and File Tabs */}
                  <div className="flex items-center gap-2.5 overflow-x-auto scrollbar-none">
                    <div className="flex items-center gap-1.5 pr-2 border-r border-gray-700">
                      <span className="w-3 h-3 rounded-full bg-[#FF5F56] border border-[#E0443E]" />
                      <span className="w-3 h-3 rounded-full bg-[#FFBD2E] border border-[#DEA123]" />
                      <span className="w-3 h-3 rounded-full bg-[#27C93F] border border-[#1AAB29]" />
                    </div>
                    {/* File Tabs */}
                    {(['python', 'html', 'javascript'] as const).map((tab) => (
                      <button
                        key={tab}
                        onClick={() => {
                          setActiveCodeTab(tab);
                          setCodeOutput(CODE_SNIPPETS[tab].defaultOutput);
                        }}
                        className={`px-3 py-1 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer ${
                          activeCodeTab === tab
                            ? 'bg-[#1E1E24] text-white border border-gray-600 shadow-[1px_1px_0px_#000]'
                            : 'text-gray-400 hover:text-white hover:bg-[#343542]'
                        }`}
                      >
                        <span>{CODE_SNIPPETS[tab].fileName}</span>
                      </button>
                    ))}
                  </div>

                  {/* Run Button (Tactile Cyan Pill Button) */}
                  <button
                    onClick={handleRunCode}
                    disabled={isExecutingCode}
                    className="btn-arcade btn-arcade-cyan text-xs py-1.5 px-3.5 shrink-0"
                  >
                    {isExecutingCode ? (
                      <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                    ) : (
                      <Play className="w-3.5 h-3.5 fill-current" />
                    )}
                    <span>Run Code</span>
                  </button>
                </div>

                {/* Code Editor View */}
                <div className="p-4 bg-[#181920] space-y-1 text-xs sm:text-[13px] leading-relaxed border-b-2 border-[#12131A] select-text overflow-x-auto font-mono">
                  {CODE_SNIPPETS[activeCodeTab].code.map((line, idx) => (
                    <div key={idx} className="flex gap-4">
                      <span className="w-5 text-right text-gray-600 select-none text-xs">{idx + 1}</span>
                      <span className="text-gray-200">
                        {line.startsWith('#') || line.startsWith('<!--') || line.startsWith('//') ? (
                          <span className="text-gray-500 italic">{line}</span>
                        ) : line.includes('def ') || line.includes('function ') || line.includes('const ') || line.includes('let ') ? (
                          <span>
                            <span className="text-[#FF7675] font-bold">{line.split(' ')[0]} </span>
                            <span className="text-[#74B9FF]">{line.slice(line.split(' ')[0].length + 1)}</span>
                          </span>
                        ) : line.includes('print') || line.includes('console.log') ? (
                          <span>
                            <span className="text-[#FFD214] font-bold">{line.split('(')[0]}</span>(
                            <span className="text-[#55EFC4]">{line.slice(line.indexOf('(') + 1, -1)}</span>)
                          </span>
                        ) : (
                          line
                        )}
                      </span>
                    </div>
                  ))}
                </div>

                {/* Output Terminal Area */}
                <div className="p-3.5 bg-[#12131A] space-y-1.5">
                  <div className="flex items-center justify-between text-[10px] text-gray-500 uppercase tracking-widest font-black">
                    <span className="flex items-center gap-1.5">
                      <Terminal className="w-3.5 h-3.5 text-[#00B894]" />
                      Interactive Console
                    </span>
                    <span className="text-[#00B894] font-bold">● Pyodide Ready</span>
                  </div>
                  <pre className="text-xs font-mono text-[#55EFC4] whitespace-pre-wrap leading-relaxed">
                    {codeOutput}
                  </pre>
                </div>

                {/* Bottom Simulator Bar */}
                <div className="p-3 bg-[#1E1E24] border-t border-gray-800 flex items-center justify-between gap-3">
                  <span className="text-xs text-gray-400 font-bold">Want to code freely?</span>
                  <Link
                    href="/simulator"
                    className="btn-arcade btn-arcade-purple text-xs py-1.5 px-3.5 flex items-center gap-1.5"
                  >
                    <span>Open Full Simulator</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* =========================================================================
          FEATURED LEARNING JOURNEYS
         ========================================================================= */}
      <section className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 space-y-8">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div>
            <span className="text-xs font-black uppercase tracking-wider text-[#6C5CE7] bg-[#EDE9FE] px-3 py-1 rounded-full border border-[#1E1E24] shadow-[1.5px_1.5px_0px_#1E1E24]">
              Curriculum Realms
            </span>
            <h2 className="text-3xl sm:text-4xl font-black text-[#1E1E24] mt-2">
              Explore 250+ hours of free interactive coding lessons.
            </h2>
            <p className="text-xs sm:text-sm text-[#4A4A58] font-bold mt-1 max-w-xl">
              Learn to code with fun, interactive courses handcrafted by educators. Start with fundamentals or dive directly into specialized disciplines.
            </p>
          </div>

          {/* Filter Pills (Strictly on one line without text wrapping) */}
          <div className="flex items-center gap-1.5 sm:gap-2 bg-white border-2 border-[#1E1E24] rounded-xl p-1 shadow-[2px_2px_0px_#1E1E24] self-start md:self-auto overflow-x-auto flex-nowrap shrink-0">
            <button
              onClick={() => setJourneyFilter('all')}
              className={`px-3 sm:px-4 py-1.5 text-xs font-black rounded-lg transition-all whitespace-nowrap shrink-0 ${
                journeyFilter === 'all'
                  ? 'bg-[#1E1E24] text-white'
                  : 'text-[#4A4A58] hover:text-[#1E1E24]'
              }`}
            >
              All Realms
            </button>
            <button
              onClick={() => setJourneyFilter('active')}
              className={`px-3 sm:px-4 py-1.5 text-xs font-black rounded-lg transition-all whitespace-nowrap shrink-0 ${
                journeyFilter === 'active'
                  ? 'bg-[#00B894] text-white'
                  : 'text-[#4A4A58] hover:text-[#1E1E24]'
              }`}
            >
              Active Quests (4)
            </button>
            <button
              onClick={() => setJourneyFilter('coming')}
              className={`px-3 sm:px-4 py-1.5 text-xs font-black rounded-lg transition-all whitespace-nowrap shrink-0 ${
                journeyFilter === 'coming'
                  ? 'bg-amber-500 text-white'
                  : 'text-[#4A4A58] hover:text-[#1E1E24]'
              }`}
            >
              Coming Soon (6)
            </button>
          </div>
        </div>

        {/* Courses Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {displayedCourses.slice(0, 6).map((c) => {
            const firstLessonId = c.chapters[0]?.lessons[0]?.id || `${c.id}-less-1-1`;
            return (
              <div
                key={c.id}
                className={`bg-white rounded-2xl border-2 border-[#1E1E24] p-6 flex flex-col justify-between ${
                  c.isComingSoon
                    ? 'opacity-80 bg-gray-50 shadow-[3px_3px_0px_#A0A0B0]'
                    : 'shadow-[6px_6px_0px_#1E1E24] hover:-translate-y-1 hover:shadow-[8px_8px_0px_#1E1E24] transition-all'
                }`}
              >
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span
                      className="px-2.5 py-0.5 rounded-lg text-xs font-mono font-black uppercase text-white shadow-[1.5px_1.5px_0px_#1E1E24]"
                      style={{ backgroundColor: c.themeColor || '#6C5CE7' }}
                    >
                      {c.language}
                    </span>
                    {c.isComingSoon ? (
                      <span className="flex items-center gap-1 text-[11px] font-black text-amber-800 bg-amber-100 px-2 py-0.5 rounded-lg border border-amber-300">
                        <Lock className="w-3 h-3" />
                        <span>Coming Soon ⏳</span>
                      </span>
                    ) : (
                      <span className="text-[11px] font-black text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded-lg border border-emerald-300">
                        +{c.xpReward || 250} XP
                      </span>
                    )}
                  </div>

                  <h3 className="text-xl font-black text-[#1E1E24]">{c.title}</h3>
                  <p className="text-xs font-bold text-gray-500 line-clamp-2 leading-relaxed">
                    {c.description}
                  </p>
                </div>

                <div className="pt-6 border-t border-gray-100 mt-4">
                  {c.isComingSoon ? (
                    <button
                      disabled
                      className="w-full btn-arcade btn-arcade-dark opacity-50 py-2.5 px-3 cursor-not-allowed flex items-center justify-center gap-1.5"
                    >
                      <Lock className="w-3.5 h-3.5" />
                      <span>Coming Soon ⏳</span>
                    </button>
                  ) : (
                    <Link
                      href={`/learn/${firstLessonId}`}
                      className="w-full btn-arcade btn-arcade-purple py-2.5 px-3 flex items-center justify-center gap-1.5"
                    >
                      <span>Start Quest 1.1</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </Link>
                  )}
                </div>
              </div>
            );
          })}
        </div>

        <div className="text-center pt-2">
          <Link
            href="/courses"
            className="inline-flex items-center gap-2 text-xs font-black text-[#6C5CE7] hover:underline"
          >
            <span>View All Curricula Realms</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </section>

      {/* =========================================================================
          4. "LEVEL UP YOUR LEARNING" GAMIFICATION GRID
         ========================================================================= */}
      <section className="w-full bg-white border-y-2 border-[#1E1E24] py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-6xl mx-auto space-y-12">
          <div className="text-center max-w-2xl mx-auto space-y-3">
            <span className="text-xs font-black uppercase tracking-wider text-[#FFD214] bg-[#1E1E24] px-3.5 py-1 rounded-full shadow-[2px_2px_0px_#6C5CE7]">
              Gamification Engine
            </span>
            <h2 className="text-3xl sm:text-4xl font-black text-[#1E1E24]">
              Level Up Your Learning
            </h2>
            <p className="text-xs sm:text-sm text-[#4A4A58] font-bold">
              Traditional computer science courses are dry and passive. Dronacharya transforms every milestone into an RPG adventure.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Card 1: XP & Badges */}
            <div className="bg-[#FAF6EE] rounded-3xl border-2 border-[#1E1E24] p-7 shadow-[6px_6px_0px_#1E1E24] space-y-4">
              <div className="w-12 h-12 rounded-2xl bg-[#EDE9FE] border-2 border-[#1E1E24] text-[#6C5CE7] flex items-center justify-center shadow-[2px_2px_0px_#1E1E24]">
                <Award className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-black text-[#1E1E24]">
                RPG XP & Collectible Badges
              </h3>
              <p className="text-xs font-bold text-[#4A4A58] leading-relaxed">
                Earn mastery experience points on every validated challenge. Mint verifiable Mastery Seals to showcase on your digital adventurer resume.
              </p>
            </div>

            {/* Card 2: Daily Coding Streaks */}
            <div className="bg-[#FAF6EE] rounded-3xl border-2 border-[#1E1E24] p-7 shadow-[6px_6px_0px_#1E1E24] space-y-4">
              <div className="w-12 h-12 rounded-2xl bg-amber-100 border-2 border-[#1E1E24] text-amber-600 flex items-center justify-center shadow-[2px_2px_0px_#1E1E24]">
                <Flame className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-black text-[#1E1E24]">
                Daily Coding Streaks
              </h3>
              <p className="text-xs font-bold text-[#4A4A58] leading-relaxed">
                Protect your streak flame by solving at least one quest per day. Use Gurukul freeze shields when life gets busy so your momentum never dies.
              </p>
            </div>

            {/* Card 3: Socratic Acharya AI */}
            <div className="bg-[#FAF6EE] rounded-3xl border-2 border-[#1E1E24] p-7 shadow-[6px_6px_0px_#1E1E24] space-y-4">
              <div className="w-12 h-12 rounded-2xl bg-emerald-100 border-2 border-[#1E1E24] text-emerald-600 flex items-center justify-center shadow-[2px_2px_0px_#1E1E24]">
                <Sparkles className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-black text-[#1E1E24]">
                Socratic Acharya AI Mentor
              </h3>
              <p className="text-xs font-bold text-[#4A4A58] leading-relaxed">
                Never get stuck. Acharya AI analyzes your observable bugs and guides your mental model using Socratic questions without spoiling direct answers.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* =========================================================================
          5. "PRACTICE YOUR CODING CHOPS" MINI-GAME ARENA
         ========================================================================= */}
      <section className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 space-y-8">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div>
            <span className="text-xs font-black uppercase tracking-wider text-[#00B894] bg-emerald-50 px-3 py-1 rounded-full border border-emerald-300">
              Interactive Practice Arenas
            </span>
            <h2 className="text-3xl sm:text-4xl font-black text-[#1E1E24] mt-2">
              Practice Your Coding Chops
            </h2>
            <p className="text-xs sm:text-sm text-[#4A4A58] font-bold mt-1">
              Apply what you learn in playful, code-controlled game simulations.
            </p>
          </div>

          <Link
            href="/simulator"
            className="btn-arcade btn-arcade-dark px-5 py-2.5 flex items-center gap-1.5 self-start md:self-auto"
          >
            <span>Open Simulator Hub</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Practice Arena 1: Rover Rescue */}
          <div className="bg-white rounded-3xl border-2 border-[#1E1E24] p-7 shadow-[6px_6px_0px_#1E1E24] space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-xs font-mono font-black text-[#6C5CE7] bg-[#EDE9FE] px-2.5 py-1 rounded-lg border border-[#1E1E24]">
                Stage 3 • Loop Lab
              </span>
              <span className="text-xs font-black text-amber-700 bg-amber-50 px-2 py-0.5 rounded border border-amber-300">
                +150 XP
              </span>
            </div>
            <h3 className="text-2xl font-black text-[#1E1E24]">
              Rescue Exploration Rover Arya
            </h3>
            <p className="text-xs font-bold text-gray-500 leading-relaxed">
              Program an autonomous exploration rover through an infected research labyrinth. Collect power cells, evade hazardous debris, and reach the extraction beacon before battery failure.
            </p>
            <div className="p-3 rounded-xl bg-[#1E1E24] text-emerald-300 font-mono text-xs">
              <code>for step in range(3):<br />&nbsp;&nbsp;rover.move_right()<br />rover.collect()</code>
            </div>
            <Link
              href="/simulator?mission=mission-rescue-robot"
              className="w-full btn-arcade btn-arcade-purple py-2.5 px-4 flex items-center justify-center gap-1.5"
            >
              <span>Launch Rover Arena</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          {/* Practice Arena 2: Hazard Filter */}
          <div className="bg-white rounded-3xl border-2 border-[#1E1E24] p-7 shadow-[6px_6px_0px_#1E1E24] space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-xs font-mono font-black text-amber-700 bg-amber-50 px-2.5 py-1 rounded-lg border border-[#1E1E24]">
                Stage 4 • Decision Forest
              </span>
              <span className="text-xs font-black text-amber-700 bg-amber-50 px-2 py-0.5 rounded border border-amber-300">
                +150 XP
              </span>
            </div>
            <h3 className="text-2xl font-black text-[#1E1E24]">
              Decontaminate Bio-Data Stream
            </h3>
            <p className="text-xs font-bold text-gray-500 leading-relaxed">
              Radiation has scrambled incoming biological sensor packets. Write conditional loops to inspect sensor arrays, routing clean samples into the cold vault while burning corrupted cells.
            </p>
            <div className="p-3 rounded-xl bg-[#1E1E24] text-amber-300 font-mono text-xs">
              <code>for cell in incoming_stream:<br />&nbsp;&nbsp;if cell &gt; 0:<br />&nbsp;&nbsp;&nbsp;&nbsp;vault.append(cell)</code>
            </div>
            <Link
              href="/simulator?mission=mission-hazard-filter"
              className="w-full btn-arcade btn-arcade-gold py-2.5 px-4 flex items-center justify-center gap-1.5"
            >
              <span>Launch Hazard Arena</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>
      </section>

      {/* =========================================================================
          FINAL CTA BANNER
         ========================================================================= */}
      <section className="w-full bg-[#FAF6EE] border-t-2 border-[#1E1E24] py-16 px-4 sm:px-6">
        <div className="max-w-4xl mx-auto text-center space-y-6">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#FFD214] border-2 border-[#1E1E24] shadow-[2px_2px_0px_#1E1E24] text-xs font-black">
            <Sparkles className="w-3.5 h-3.5" />
            <span>NO INSTALLATIONS REQUIRED</span>
          </div>

          <h2 className="text-3xl sm:text-5xl font-black text-[#1E1E24] tracking-tight">
            Ready to start your coding adventure?
          </h2>

          <p className="text-sm sm:text-base font-bold text-[#4A4A58] max-w-xl mx-auto">
            Join learners across the realm today. Write your first line of code in seconds with zero configuration.
          </p>

          <div className="flex flex-wrap justify-center gap-4 pt-2">
            <button
              onClick={() => {
                setAuthMode('signup');
                setIsAuthModalOpen(true);
              }}
              className="btn-arcade btn-arcade-purple px-8 py-3.5"
            >
              Start Free Adventure Now →
            </button>
            <button
              onClick={handleInstantGuestLaunch}
              className="btn-arcade btn-arcade-gold px-6 py-3.5"
            >
              ⚡ Instant 1-Click Guest Demo
            </button>
          </div>
        </div>
      </section>

      {/* =========================================================================
          AUTHENTICATION MODAL (Guest Demo + Supabase Login/Signup)
         ========================================================================= */}
      {isAuthModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
          <div className="relative w-full max-w-lg bg-white border-3 border-[#1E1E24] rounded-3xl shadow-[8px_8px_0px_#1E1E24] p-6 sm:p-8 animate-in zoom-in-95">
            <button
              onClick={() => setIsAuthModalOpen(false)}
              className="absolute top-4 right-4 p-1.5 rounded-xl border-2 border-[#1E1E24] bg-[#FAF6EE] text-[#1E1E24] hover:bg-rose-100"
            >
              <X className="w-4 h-4" />
            </button>

            {/* Header */}
            <div className="text-center mb-6">
              <img
                src="/logo.png"
                alt="Dronacharya Logo"
                className="w-14 h-14 rounded-2xl border-2 border-[#1E1E24] object-cover shadow-[3px_3px_0px_#1E1E24] mx-auto mb-3 bg-[#FAF6EE]"
              />
              <h2 className="text-2xl font-black text-[#1E1E24]">
                {authMode === 'signin' ? 'Sign In to Your Adventure' : 'Join Dronacharya ⋆˙⟡'}
              </h2>
              <p className="text-xs text-[#4A4A58] font-bold mt-1">
                {authMode === 'signin'
                  ? 'Enter credentials to load your saved progress & rank.'
                  : 'Start learning in browser with zero setup required.'}
              </p>
            </div>

            {/* Quick 1-Click Guest Demo Button */}
            <div className="mb-5 p-3 rounded-2xl bg-[#FFD214]/20 border-2 border-[#1E1E24] shadow-[2px_2px_0px_#1E1E24] flex items-center justify-between gap-2">
              <div>
                <div className="font-black text-xs text-[#1E1E24] flex items-center gap-1.5">
                  <span>Want to explore without an account?</span>
                  <span className="text-[10px] bg-[#00B894] text-white px-1.5 py-0.2 rounded font-black">
                    Instant
                  </span>
                </div>
                <div className="text-[11px] text-[#4A4A58] font-bold">
                  Play as Guest Demo directly.
                </div>
              </div>
              <button
                type="button"
                onClick={handleInstantGuestLaunch}
                className="btn-arcade btn-arcade-gold py-1.5 px-3.5 flex items-center gap-1 shrink-0"
              >
                <Zap className="w-3.5 h-3.5" />
                <span>Play as Guest</span>
              </button>
            </div>

            {/* Auth Mode Tabs */}
            <div className="flex border-b-2 border-[#1E1E24] mb-6">
              <button
                type="button"
                onClick={() => {
                  setAuthMode('signin');
                  setAuthError(null);
                }}
                className={`flex-1 py-2 text-xs font-black border-b-2 transition-all ${
                  authMode === 'signin'
                    ? 'border-[#6C5CE7] text-[#6C5CE7]'
                    : 'border-transparent text-gray-400'
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
                className={`flex-1 py-2 text-xs font-black border-b-2 transition-all ${
                  authMode === 'signup'
                    ? 'border-[#6C5CE7] text-[#6C5CE7]'
                    : 'border-transparent text-gray-400'
                }`}
              >
                New Apprentice
              </button>
            </div>

            {/* Error & Success Feedback */}
            {authError && (
              <div className="mb-4 p-3 rounded-xl bg-rose-50 border-2 border-rose-400 text-xs text-rose-700 font-bold flex items-start gap-2">
                <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
                <span>{authError}</span>
              </div>
            )}

            {authSuccess && (
              <div className="mb-4 p-3 rounded-xl bg-emerald-50 border-2 border-emerald-400 text-xs text-emerald-800 font-bold flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 shrink-0" />
                <span>{authSuccess}</span>
              </div>
            )}

            {/* SIGN IN FORM */}
            {authMode === 'signin' ? (
              <form onSubmit={handleSignIn} className="space-y-4 text-xs font-bold">
                <div>
                  <label className="block text-[#1E1E24] mb-1">Email Address</label>
                  <div className="relative">
                    <Mail className="w-4 h-4 text-gray-400 absolute left-3 top-2.5" />
                    <input
                      type="email"
                      required
                      value={authEmail}
                      onChange={(e) => setAuthEmail(e.target.value)}
                      onBlur={() => setAuthEmail((e) => e.trim())}
                      placeholder="scholar@gurukul.edu"
                      className="w-full pl-9 pr-3 py-2 border-2 border-[#1E1E24] rounded-xl bg-[#FAF6EE] focus:bg-white focus:outline-none"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-[#1E1E24] mb-1">Password</label>
                  <div className="relative">
                    <Lock className="w-4 h-4 text-gray-400 absolute left-3 top-2.5" />
                    <input
                      type="password"
                      required
                      value={authPassword}
                      onChange={(e) => setAuthPassword(e.target.value)}
                      placeholder="••••••••"
                      className="w-full pl-9 pr-3 py-2 border-2 border-[#1E1E24] rounded-xl bg-[#FAF6EE] focus:bg-white focus:outline-none"
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  className="w-full btn-arcade btn-arcade-purple py-2.5 mt-2"
                >
                  Enter Adventure Realm →
                </button>
              </form>
            ) : (
              /* SIGN UP WIZARD */
              <div>
                {/* Step Indicators */}
                <div className="flex items-center justify-between mb-5 px-4 text-xs font-black">
                  <div className={`flex items-center gap-1.5 ${signupStep >= 1 ? 'text-[#6C5CE7]' : 'text-gray-400'}`}>
                    <span className="w-5 h-5 rounded-full bg-[#EDE9FE] border border-[#1E1E24] flex items-center justify-center text-[10px]">1</span>
                    <span>Account</span>
                  </div>
                  <div className="w-8 h-0.5 bg-gray-300" />
                  <div className={`flex items-center gap-1.5 ${signupStep >= 2 ? 'text-[#6C5CE7]' : 'text-gray-400'}`}>
                    <span className="w-5 h-5 rounded-full bg-[#EDE9FE] border border-[#1E1E24] flex items-center justify-center text-[10px]">2</span>
                    <span>Class</span>
                  </div>
                  <div className="w-8 h-0.5 bg-gray-300" />
                  <div className={`flex items-center gap-1.5 ${signupStep >= 3 ? 'text-[#6C5CE7]' : 'text-gray-400'}`}>
                    <span className="w-5 h-5 rounded-full bg-[#EDE9FE] border border-[#1E1E24] flex items-center justify-center text-[10px]">3</span>
                    <span>Track</span>
                  </div>
                </div>

                {/* Step 1: Account Info */}
                {signupStep === 1 && (
                  <form onSubmit={handleProceedToStep2} className="space-y-4 text-xs font-bold">
                    <div>
                      <label className="block text-[#1E1E24] mb-1">Explorer Name</label>
                      <input
                        type="text"
                        required
                        value={authName}
                        onChange={(e) => setAuthName(e.target.value)}
                        placeholder="e.g. Robin Hood"
                        className="w-full px-3 py-2 border-2 border-[#1E1E24] rounded-xl bg-[#FAF6EE] focus:bg-white focus:outline-none"
                      />
                    </div>
                    <div>
                      <label className="block text-[#1E1E24] mb-1">Email Address</label>
                      <input
                        type="email"
                        required
                        value={authEmail}
                        onChange={(e) => setAuthEmail(e.target.value)}
                        onBlur={() => setAuthEmail((e) => e.trim())}
                        placeholder="robin@adventure.dev"
                        className="w-full px-3 py-2 border-2 border-[#1E1E24] rounded-xl bg-[#FAF6EE] focus:bg-white focus:outline-none"
                      />
                    </div>
                    <div>
                      <label className="block text-[#1E1E24] mb-1">Password (min 6 chars)</label>
                      <input
                        type="password"
                        required
                        value={authPassword}
                        onChange={(e) => setAuthPassword(e.target.value)}
                        placeholder="••••••••"
                        className="w-full px-3 py-2 border-2 border-[#1E1E24] rounded-xl bg-[#FAF6EE] focus:bg-white focus:outline-none"
                      />
                    </div>
                    <button
                      type="submit"
                      className="w-full btn-arcade btn-arcade-purple py-2.5"
                    >
                      Next: Choose Experience Grade →
                    </button>
                  </form>
                )}

                {/* Step 2: Class Selection */}
                {signupStep === 2 && (
                  <div className="space-y-4 text-xs font-bold">
                    <label className="block text-[#1E1E24]">Select Your Current Level:</label>
                    <div className="space-y-2">
                      {AVAILABLE_CLASSES.map((c) => (
                        <div
                          key={c}
                          onClick={() => setAuthClass(c)}
                          className={`p-3 rounded-xl border-2 border-[#1E1E24] cursor-pointer transition-all flex items-center justify-between ${
                            authClass === c ? 'bg-[#FFD214] shadow-[2px_2px_0px_#1E1E24] font-black' : 'bg-white hover:bg-gray-50'
                          }`}
                        >
                          <span>{c}</span>
                          {authClass === c && <CheckCircle2 className="w-4 h-4 text-[#1E1E24]" />}
                        </div>
                      ))}
                    </div>
                    <div className="flex gap-2 pt-2">
                      <button onClick={() => setSignupStep(1)} className="btn-arcade btn-arcade-white py-2 px-4">
                        Back
                      </button>
                      <button
                        onClick={handleProceedToStep3}
                        className="flex-1 btn-arcade btn-arcade-purple py-2 px-4"
                      >
                        Next: Choose Realm Track →
                      </button>
                    </div>
                  </div>
                )}

                {/* Step 3: Track Selection (Active Only) */}
                {signupStep === 3 && (
                  <div className="space-y-4 text-xs font-bold">
                    <label className="block text-[#1E1E24]">Select Your Active Starting Track:</label>
                    <div className="space-y-2">
                      {AVAILABLE_SUBJECTS.filter((s) => !s.isComingSoon).map((s) => (
                        <div
                          key={s.id}
                          onClick={() => setAuthSubject(s.id)}
                          className={`p-3 rounded-xl border-2 border-[#1E1E24] cursor-pointer transition-all flex items-center justify-between ${
                            authSubject === s.id ? 'bg-[#EDE9FE] border-[#6C5CE7] shadow-[2px_2px_0px_#6C5CE7] font-black' : 'bg-white hover:bg-gray-50'
                          }`}
                        >
                          <div>
                            <span className="block font-black text-[#1E1E24]">{s.name}</span>
                            <span className="text-[11px] text-gray-500">{s.tagline}</span>
                          </div>
                          {authSubject === s.id && <CheckCircle2 className="w-4 h-4 text-[#6C5CE7]" />}
                        </div>
                      ))}
                    </div>
                    <div className="flex gap-2 pt-2">
                      <button onClick={() => setSignupStep(2)} className="btn-arcade btn-arcade-white py-2 px-4">
                        Back
                      </button>
                      <button
                        onClick={handleFinalSignUp}
                        className="flex-1 btn-arcade btn-arcade-gold py-2.5 px-4"
                      >
                        Embark on Quest Now! 🚀
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
