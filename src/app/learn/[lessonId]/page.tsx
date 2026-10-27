// Codédex-Authentic Split-Screen Quest Learning Laboratory
// Supports HTML, CSS, JavaScript web sandbox preview and Python Pyodide execution
'use client';

import React, { useState, useEffect, useRef, Suspense } from 'react';
import Link from 'next/link';
import { useParams, useRouter } from 'next/navigation';
import {
  findLessonById,
  findCourseBySlugOrId,
  Lesson,
  Chapter,
  Course,
} from '@/lib/data/course-system';
import {
  buildWebPreviewDocument,
  validateWebExercise,
  WebValidationResult,
  WebConsoleMessage,
} from '@/lib/simulator/web-interpreter';
import {
  runPythonCode,
  validatePythonExercise,
  ExerciseValidationResult,
} from '@/lib/simulator/python-interpreter';
import { recordGameProgress } from '@/lib/db/auth-db';
import { AcharyaDrawer } from '@/components/mentor/AcharyaDrawer';
import { PythonOdysseyArena } from '@/components/game/PythonOdysseyArena';
import {
  BookOpen,
  ArrowRight,
  ArrowLeft,
  Play,
  RotateCcw,
  Sparkles,
  CheckCircle2,
  XCircle,
  HelpCircle,
  Lightbulb,
  Terminal,
  Zap,
  Globe,
  Award,
  ChevronRight,
  ChevronLeft,
  Code2,
  Eye,
  Copy,
  Check,
  Compass,
  AlertCircle,
  Flame,
  Volume2,
  Monitor,
  Smartphone,
  Lock,
  RefreshCw,
} from 'lucide-react';
import confetti from 'canvas-confetti';

export default function LearnLessonPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-[#F5F2EB] flex flex-col items-center justify-center p-4">
          <div className="w-12 h-12 border-4 border-[#6C5CE7] border-t-transparent rounded-full animate-spin mb-4" />
          <p className="font-mono text-sm font-bold text-[#1E1E24]">
            Summoning Quest Laboratory...
          </p>
        </div>
      }
    >
      <QuestLearningLab />
    </Suspense>
  );
}

function QuestLearningLab() {
  const router = useRouter();
  const params = useParams();
  const rawId = (params?.lessonId as string) || 'html-less-1-1';

  // Resolved lesson data
  const lessonData = findLessonById(rawId);
  const lesson = lessonData?.lesson;
  const chapter = lessonData?.chapter;
  const course = lessonData?.course;
  const prevLesson = lessonData?.prevLesson;
  const nextLesson = lessonData?.nextLesson;

  // Course language detection
  const courseLang = (course?.language || '').toLowerCase();
  const courseId = (course?.id || '').toLowerCase();
  const isPython = courseId === 'python' || courseLang === 'python' || rawId.startsWith('py-');
  const isHtmlCourse = (courseId === 'html' || courseLang === 'html' || rawId.startsWith('html-')) && !isPython;
  const isCssCourse = (courseId === 'css' || courseLang === 'css' || rawId.startsWith('css-')) && !isPython;
  const isJsCourse = (courseId === 'javascript' || courseId === 'js' || courseLang === 'javascript' || rawId.startsWith('js-')) && !isPython;
  const isWeb = !isPython;

  // Language dialect preference
  const [dialect, setDialect] = useState<'english' | 'hinglish'>('english');
  const [isAcharyaOpen, setIsAcharyaOpen] = useState(false);
  const [proactiveTrigger, setProactiveTrigger] = useState<{
    type: 'collision' | 'error' | 'battery' | 'syntax';
    message: string;
    line?: number;
  } | null>(null);
  const [copiedCode, setCopiedCode] = useState(false);

  // Progressive Hint Tier (0: hidden, 1: nudge, 2: clue, 3: blueprint, 4: solution)
  const [hintTier, setHintTier] = useState<number>(0);

  // Web Code Studio State
  const [activeTab, setActiveTab] = useState<'html' | 'css' | 'js'>('html');
  const [htmlCode, setHtmlCode] = useState<string>('');
  const [cssCode, setCssCode] = useState<string>('');
  const [jsCode, setJsCode] = useState<string>('');
  const [pythonCode, setPythonCode] = useState<string>('');

  // Mobile Responsive Preview Toggle in Browser Sandbox
  const [isMobilePreview, setIsMobilePreview] = useState<boolean>(false);

  // Execution & Validation State
  const [isRunning, setIsRunning] = useState<boolean>(false);
  const [exercisePassed, setExercisePassed] = useState<boolean>(false);
  const [awardedXp, setAwardedXp] = useState<number>(0);
  const [testResults, setTestResults] = useState<
    { description: string; passed: boolean; expected?: string; actual?: string }[]
  >([]);
  const [consoleLogs, setConsoleLogs] = useState<WebConsoleMessage[]>([]);
  const [previewDoc, setPreviewDoc] = useState<string>('');

  // Iframe Ref
  const iframeRef = useRef<HTMLIFrameElement>(null);

  // Initialize Code when lesson loads
  useEffect(() => {
    if (!lesson) return;

    if (isPython) {
      setPythonCode(
        lesson.exercise?.initialCode ||
          lesson.interactiveTryStarter ||
          '# Write your Python quest solution:\n'
      );
    } else if (isHtmlCourse) {
      setActiveTab('html');
      const initialHtml =
        lesson.starterHtml ||
        lesson.exercise?.initialCode ||
        '<!-- HTML Playground -->\n<div class="quest-box">\n  <h2>Hello Adventurer!</h2>\n</div>';
      const initialCss = lesson.starterCss || '';
      const initialJs = lesson.starterJs || '';
      setHtmlCode(initialHtml);
      setCssCode(initialCss);
      setJsCode(initialJs);
      setPreviewDoc(buildWebPreviewDocument(initialHtml, initialCss, initialJs));
    } else if (isCssCourse) {
      setActiveTab('css');
      const initialHtml =
        lesson.starterHtml ||
        '<div class="quest-card">\n  <h2>CSS Realm</h2>\n  <p>Style this element.</p>\n</div>';
      const initialCss =
        lesson.starterCss ||
        lesson.exercise?.initialCode ||
        '/* CSS Realm */\nbody {\n  font-family: sans-serif;\n  padding: 1.5rem;\n}';
      const initialJs = lesson.starterJs || '';
      setHtmlCode(initialHtml);
      setCssCode(initialCss);
      setJsCode(initialJs);
      setPreviewDoc(buildWebPreviewDocument(initialHtml, initialCss, initialJs));
    } else if (isJsCourse) {
      setActiveTab('js');
      const initialHtml =
        lesson.starterHtml ||
        '<div id="app">\n  <h1 id="title">Interactive Quest</h1>\n  <button id="btn">Click Me</button>\n</div>';
      const initialCss = lesson.starterCss || 'body { font-family: sans-serif; padding: 20px; }';
      const initialJs =
        lesson.starterJs ||
        lesson.exercise?.initialCode ||
        '// JavaScript Arena\nconsole.log("Welcome to Dronacharya Studio!");';
      setHtmlCode(initialHtml);
      setCssCode(initialCss);
      setJsCode(initialJs);
      setPreviewDoc(buildWebPreviewDocument(initialHtml, initialCss, initialJs));
    } else {
      setActiveTab('html');
      const initialHtml = lesson.starterHtml || lesson.exercise?.initialCode || '';
      const initialCss = lesson.starterCss || '';
      const initialJs = lesson.starterJs || '';
      setHtmlCode(initialHtml);
      setCssCode(initialCss);
      setJsCode(initialJs);
      setPreviewDoc(buildWebPreviewDocument(initialHtml, initialCss, initialJs));
    }

    // Reset validation state
    setExercisePassed(false);
    setAwardedXp(0);
    setHintTier(0);
    setConsoleLogs([]);

    // Initialize test results as pending
    if (lesson.exercise?.testCases) {
      setTestResults(
        lesson.exercise.testCases.map((tc) => ({
          description: tc.inputDescription,
          passed: false,
          expected: tc.expectedOutput,
        }))
      );
    } else {
      setTestResults([]);
    }
  }, [lesson?.id, course?.language, course?.id, rawId]);

  // Listen for iframe console events
  useEffect(() => {
    const handleWindowMessage = (e: MessageEvent) => {
      if (e.data && e.data.type === 'DRONACHARYA_WEB_CONSOLE') {
        setConsoleLogs((prev) => [
          ...prev.slice(-49),
          {
            level: e.data.level || 'log',
            message: e.data.message || '',
            timestamp: e.data.timestamp || Date.now(),
          },
        ]);
      }
    };

    window.addEventListener('message', handleWindowMessage);
    return () => window.removeEventListener('message', handleWindowMessage);
  }, []);

  // Update live preview document when web code changes (debounced)
  useEffect(() => {
    if (isPython) return;
    const timer = setTimeout(() => {
      setPreviewDoc(buildWebPreviewDocument(htmlCode, cssCode, jsCode));
    }, 400);
    return () => clearTimeout(timer);
  }, [htmlCode, cssCode, jsCode, isPython]);

  // Handle Reset to initial starter code
  const handleResetCode = () => {
    if (!lesson) return;
    if (isPython) {
      setPythonCode(lesson.exercise?.initialCode || lesson.interactiveTryStarter || '# Write your solution:\n');
    } else if (isHtmlCourse) {
      const h = lesson.starterHtml || lesson.exercise?.initialCode || '';
      setHtmlCode(h);
      setCssCode(lesson.starterCss || '');
      setJsCode(lesson.starterJs || '');
      setPreviewDoc(buildWebPreviewDocument(h, lesson.starterCss || '', lesson.starterJs || ''));
    } else if (isCssCourse) {
      const c = lesson.starterCss || lesson.exercise?.initialCode || '';
      setCssCode(c);
      setHtmlCode(lesson.starterHtml || '');
      setJsCode(lesson.starterJs || '');
      setPreviewDoc(buildWebPreviewDocument(lesson.starterHtml || '', c, lesson.starterJs || ''));
    } else if (isJsCourse) {
      const j = lesson.starterJs || lesson.exercise?.initialCode || '';
      setJsCode(j);
      setHtmlCode(lesson.starterHtml || '');
      setCssCode(lesson.starterCss || '');
      setPreviewDoc(buildWebPreviewDocument(lesson.starterHtml || '', lesson.starterCss || '', j));
    } else {
      setHtmlCode(lesson.starterHtml || lesson.exercise?.initialCode || '');
      setCssCode(lesson.starterCss || '');
      setJsCode(lesson.starterJs || '');
      setPreviewDoc(buildWebPreviewDocument(
        lesson.starterHtml || '',
        lesson.starterCss || '',
        lesson.starterJs || ''
      ));
    }
    setConsoleLogs([]);
    setExercisePassed(false);
  };

  // Keyboard shortcut Ctrl+Enter to Run
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key === 'Enter') {
        e.preventDefault();
        handleRunAndValidate();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  });

  // Handle Run & Validation
  const handleRunAndValidate = async () => {
    if (!lesson || isRunning) return;
    setIsRunning(true);

    if (isPython) {
      // Execute Python via Pyodide
      const runRes = runPythonCode(pythonCode);
      const testCases = lesson.exercise?.testCases || [
        {
          inputDescription: 'Code executes without syntax errors',
          expectedOutput: 'OK',
          codeSnippet: 'stdout:.*',
        },
      ];

      const validation = validatePythonExercise(pythonCode, testCases);

      // Add to console logs
      const msgs: WebConsoleMessage[] = [];
      if (runRes.stdout) {
        msgs.push({ level: 'log', message: runRes.stdout, timestamp: Date.now() });
      }
      if (runRes.stderr) {
        msgs.push({ level: 'error', message: runRes.stderr, timestamp: Date.now() });
      }
      setConsoleLogs(msgs);

      const passed = validation.allPassed;
      setExercisePassed(passed);
      setTestResults(
        validation.testResults.map((t) => ({
          description: t.description,
          passed: t.passed,
          expected: t.expected,
          actual: t.actual,
        }))
      );

      if (passed) {
        handleSuccessPass();
      } else {
        const firstFailed = validation.testResults.find((t) => !t.passed);
        setProactiveTrigger({
          type: runRes.stderr ? 'syntax' : 'error',
          message:
            runRes.stderr ||
            (firstFailed
              ? `Verification failed: ${firstFailed.description}`
              : 'Python code executed but did not satisfy the quest conditions.'),
        });
        setIsAcharyaOpen(true);
      }
      setIsRunning(false);
    } else {
      // Web Validation (HTML, CSS, JS)
      const testCases = lesson.exercise?.testCases || [];
      const webLang = (isCssCourse ? 'css' : isJsCourse ? 'javascript' : 'html') as any;
      const validation: WebValidationResult = await validateWebExercise(
        { html: htmlCode, css: cssCode, js: jsCode },
        testCases,
        webLang
      );

      // Force preview refresh
      setPreviewDoc(buildWebPreviewDocument(htmlCode, cssCode, jsCode));

      if (validation.consoleLogs && validation.consoleLogs.length > 0) {
        setConsoleLogs((prev) => [
          ...prev,
          ...validation.consoleLogs.map((c) => ({
            level: 'log' as const,
            message: c,
            timestamp: Date.now(),
          })),
        ]);
      }

      setTestResults(
        validation.testResults.map((t) => ({
          description: t.description,
          passed: t.passed,
          expected: t.expected,
          actual: t.actual,
        }))
      );

      const passed = validation.allPassed;
      setExercisePassed(passed);

      if (passed) {
        handleSuccessPass();
      } else {
        const firstFailed = validation.testResults.find((t) => !t.passed);
        setProactiveTrigger({
          type: 'error',
          message:
            firstFailed?.description ||
            'Web markup/scripting did not pass all quest test cases.',
        });
        setIsAcharyaOpen(true);
      }
      setIsRunning(false);
    }
  };

  // Celebration & XP Dispatch on Successful Quest
  const handleSuccessPass = () => {
    if (!lesson) return;
    const earned = lesson.exercise?.xpReward || lesson.xpReward || 50;
    setAwardedXp(earned);

    // Save to guest / authenticated session
    recordGameProgress({
      missionId: lesson.id,
      earnedXp: earned,
      levelId: lesson.id,
      subject: course?.id || 'web',
    });

    // Confetti celebration
    try {
      confetti({
        particleCount: 80,
        spread: 70,
        origin: { y: 0.6 },
        colors: ['#6C5CE7', '#FFD214', '#00B894', '#FF7675'],
      });
    } catch (e) {}
  };

  // Copy code example helper
  const handleCopyCode = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedCode(true);
    setTimeout(() => setCopiedCode(false), 2000);
  };

  if (!lesson || !course || !chapter) {
    return (
      <div className="min-h-screen bg-[#F5F2EB] flex flex-col items-center justify-center p-6 text-center">
        <div className="w-16 h-16 rounded-2xl bg-amber-100 border-2 border-amber-400 text-amber-700 flex items-center justify-center mb-4">
          <AlertCircle className="w-8 h-8" />
        </div>
        <h1 className="text-2xl font-black text-[#1E1E24]">Quest Not Found</h1>
        <p className="text-sm font-bold text-[#4A4A58] mt-2 max-w-md">
          The requested quest ({rawId}) does not exist in the Dronacharya curriculum realm.
        </p>
        <Link
          href="/courses"
          className="mt-6 inline-flex items-center gap-2 bg-[#6C5CE7] hover:bg-[#5A4AD1] text-white font-black px-6 py-3 rounded-xl border-2 border-[#1E1E24] shadow-[4px_4px_0px_#1E1E24]"
        >
          <Compass className="w-4 h-4" />
          <span>Explore All Realm Quests</span>
        </Link>
      </div>
    );
  }

  // Python Quests: Render Rover Arya's Odyssey 2D RPG Adventure Game Arena
  if (isPython) {
    return <PythonOdysseyArena initialQuestId={rawId} />;
  }

  // Hints array from exercise
  const hints = lesson.exercise?.hints || [
    'Read the quest story instructions closely.',
    'Check your syntax and tag enclosures.',
    'Review the concept explanation above for a blueprint.',
    lesson.exercise?.solutionCode
      ? `Solution:\n${lesson.exercise.solutionCode}`
      : 'Review the lesson example for complete code structure.',
  ];

  return (
    <div className="h-screen flex flex-col bg-[#F5F2EB] text-[#1E1E24] overflow-hidden">
      {/* TOP HEADER: BREADCRUMBS & QUEST CONTROLS */}
      <header className="h-14 bg-white border-b-2 border-[#1E1E24] px-4 flex items-center justify-between z-20 shrink-0">
        <div className="flex items-center gap-3">
          <Link
            href={`/courses/${course.id}`}
            className="flex items-center gap-1.5 text-xs font-black text-[#4A4A58] hover:text-[#1E1E24] transition-colors p-1.5 rounded-lg hover:bg-[#FAF6EE] border border-transparent hover:border-[#1E1E24]"
          >
            <ArrowLeft className="w-4 h-4" />
            <span className="hidden sm:inline">Back to Syllabus</span>
          </Link>

          <div className="h-5 w-[2px] bg-gray-200 hidden sm:block" />

          {/* Breadcrumb Info */}
          <div className="flex items-center gap-2 text-xs font-bold">
            <span
              className="px-2 py-0.5 rounded-md font-mono text-[11px] font-black uppercase text-white shadow-[2px_2px_0px_#1E1E24]"
              style={{ backgroundColor: course.themeColor || '#6C5CE7' }}
            >
              {course.title.split(' ')[0]}
            </span>
            <ChevronRight className="w-3.5 h-3.5 text-gray-400" />
            <span className="text-gray-500 hidden md:inline truncate max-w-[150px]">
              {chapter.title}
            </span>
            <ChevronRight className="w-3.5 h-3.5 text-gray-400 hidden md:inline" />
            <span className="font-black text-[#1E1E24] truncate max-w-[200px]">
              {lesson.title}
            </span>
          </div>
        </div>

        {/* Right Header: Dialect Toggle & Acharya AI */}
        <div className="flex items-center gap-2.5">
          {/* English / Hinglish Toggle */}
          <div className="flex items-center bg-[#FAF6EE] border-2 border-[#1E1E24] rounded-xl p-0.5 shadow-[2px_2px_0px_#1E1E24]">
            <button
              onClick={() => setDialect('english')}
              className={`px-2.5 py-1 text-[11px] font-black rounded-lg transition-all ${
                dialect === 'english'
                  ? 'bg-[#1E1E24] text-white'
                  : 'text-[#4A4A58] hover:text-[#1E1E24]'
              }`}
            >
              EN
            </button>
            <button
              onClick={() => setDialect('hinglish')}
              className={`px-2.5 py-1 text-[11px] font-black rounded-lg transition-all ${
                dialect === 'hinglish'
                  ? 'bg-[#6C5CE7] text-white'
                  : 'text-[#4A4A58] hover:text-[#1E1E24]'
              }`}
            >
              Hinglish
            </button>
          </div>

          {/* Ask Acharya AI Button */}
          <button
            onClick={() => setIsAcharyaOpen(true)}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-[#FFD214] hover:bg-[#F0C400] text-[#1E1E24] font-black text-xs rounded-xl border-2 border-[#1E1E24] shadow-[2px_2px_0px_#1E1E24] transition-all hover:translate-x-[1px] hover:translate-y-[1px]"
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Ask Acharya AI</span>
          </button>
        </div>
      </header>

      {/* MAIN SPLIT-SCREEN WORKSPACE */}
      <div className="flex-1 flex flex-col lg:flex-row overflow-hidden">
        {/* ============================================================== */}
        {/* LEFT PANEL: QUEST CODEX & INSTRUCTIONS (Scrollable) */}
        {/* ============================================================== */}
        <div className="w-full lg:w-1/2 h-1/2 lg:h-full bg-white border-b-2 lg:border-b-0 lg:border-r-2 border-[#1E1E24] overflow-y-auto p-5 sm:p-7 space-y-6">
          {/* Quest Progress Tracker */}
          <div className="flex items-center justify-between text-xs font-black">
            <span className="text-gray-400 uppercase tracking-wider font-mono">
              Quest {lesson.sequenceOrder} of {chapter.lessons.length}
            </span>
            <span className="inline-flex items-center gap-1 text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-full border border-emerald-300 font-mono text-[11px]">
              <Award className="w-3.5 h-3.5" />
              <span>+{lesson.xpReward || 40} XP</span>
            </span>
          </div>

          {/* Title & Subtitle */}
          <div>
            <h1 className="text-2xl sm:text-3xl font-black text-[#1E1E24] leading-tight">
              {lesson.title}
            </h1>
            <p className="text-sm font-bold text-[#636E72] mt-1">
              {lesson.subtitle}
            </p>
          </div>

          {/* Quest Lore Hook */}
          <div className="bg-[#FAF6EE] border-2 border-[#1E1E24] rounded-2xl p-4 sm:p-5 shadow-[4px_4px_0px_#1E1E24] relative overflow-hidden">
            <div className="absolute top-2 right-2 opacity-10">
              <Compass className="w-16 h-16 text-[#1E1E24]" />
            </div>
            <div className="flex items-center gap-2 text-xs font-black uppercase text-[#6C5CE7] mb-2">
              <Sparkles className="w-4 h-4" />
              <span>Quest Mission Lore</span>
            </div>
            <p className="text-sm font-bold text-[#2D3436] leading-relaxed">
              {dialect === 'hinglish' && lesson.storyIntroHinglish
                ? lesson.storyIntroHinglish
                : lesson.storyIntro}
            </p>
          </div>

          {/* Concept Explanation */}
          <div className="space-y-3">
            <div className="flex items-center gap-2 text-xs font-black uppercase text-[#1E1E24]">
              <BookOpen className="w-4 h-4 text-[#6C5CE7]" />
              <span>Scroll of Knowledge</span>
            </div>
            <div className="text-sm font-bold text-[#4A4A58] leading-relaxed">
              {dialect === 'hinglish' && lesson.conceptExplanationHinglish
                ? lesson.conceptExplanationHinglish
                : lesson.conceptExplanation}
            </div>

            {/* Syntax-Highlighted Code Example */}
            {lesson.codeExample && (
              <div className="mt-3 bg-[#1E1E28] text-gray-100 rounded-xl border-2 border-[#1E1E24] overflow-hidden shadow-[4px_4px_0px_#1E1E24]">
                <div className="px-3.5 py-2 bg-[#12131C] border-b border-gray-700 flex items-center justify-between text-xs font-mono font-bold text-gray-400">
                  <span className="flex items-center gap-1.5">
                    <Code2 className="w-3.5 h-3.5 text-[#FFD214]" />
                    <span>Example Code</span>
                  </span>
                  <button
                    onClick={() => handleCopyCode(lesson.codeExample || '')}
                    className="flex items-center gap-1 hover:text-white transition-colors p-1"
                  >
                    {copiedCode ? (
                      <>
                        <Check className="w-3.5 h-3.5 text-emerald-400" />
                        <span className="text-emerald-400">Copied!</span>
                      </>
                    ) : (
                      <>
                        <Copy className="w-3.5 h-3.5" />
                        <span>Copy</span>
                      </>
                    )}
                  </button>
                </div>
                <pre className="p-4 text-xs sm:text-sm font-mono overflow-x-auto text-emerald-300 leading-relaxed">
                  <code>{lesson.codeExample}</code>
                </pre>
              </div>
            )}

            {lesson.codeExampleExplanation && (
              <p className="text-xs font-bold text-gray-500 italic mt-1.5">
                💡 {lesson.codeExampleExplanation}
              </p>
            )}
          </div>

          {/* OBJECTIVE CHECKLIST */}
          <div className="bg-white border-2 border-[#1E1E24] rounded-2xl p-5 shadow-[4px_4px_0px_#1E1E24] space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-xs font-black uppercase text-[#1E1E24]">
                <Zap className="w-4 h-4 text-amber-500" />
                <span>Quest Objectives</span>
              </div>
              <span className="text-[11px] font-mono font-bold text-gray-500">
                {testResults.filter((t) => t.passed).length} / {testResults.length} Completed
              </span>
            </div>

            <div className="space-y-2">
              {testResults.length > 0 ? (
                testResults.map((t, idx) => (
                  <div
                    key={idx}
                    className={`flex items-start gap-3 p-3 rounded-xl border-2 transition-all ${
                      t.passed
                        ? 'bg-emerald-50 border-emerald-500 text-emerald-900 shadow-[2px_2px_0px_#10B981]'
                        : 'bg-[#FAF6EE] border-[#1E1E24] text-[#2D3436]'
                    }`}
                  >
                    <div className="mt-0.5 shrink-0">
                      {t.passed ? (
                        <CheckCircle2 className="w-5 h-5 text-emerald-600" />
                      ) : (
                        <div className="w-5 h-5 rounded-full border-2 border-[#1E1E24] flex items-center justify-center font-mono text-[10px] font-black text-[#1E1E24] bg-white">
                          {idx + 1}
                        </div>
                      )}
                    </div>
                    <div className="flex-1 text-xs sm:text-sm font-bold">
                      <p className={t.passed ? 'line-through text-emerald-800' : ''}>
                        {t.description}
                      </p>
                    </div>
                  </div>
                ))
              ) : (
                <div className="p-3 bg-[#FAF6EE] rounded-xl border-2 border-[#1E1E24] text-xs font-bold text-gray-600">
                  {lesson.exercise?.instructions || 'Run your code to complete this quest!'}
                </div>
              )}
            </div>
          </div>

          {/* PROGRESSIVE 4-TIER HINT SYSTEM */}
          <div className="border-2 border-[#1E1E24] rounded-2xl p-4 bg-[#FAF6EE] shadow-[4px_4px_0px_#1E1E24] space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-1.5 text-xs font-black uppercase text-[#1E1E24]">
                <Lightbulb className="w-4 h-4 text-amber-500" />
                <span>Progressive Hint Drawer</span>
              </div>
              <span className="text-[11px] font-mono font-bold text-gray-500">
                Tier {hintTier} of 4
              </span>
            </div>

            {hintTier === 0 ? (
              <button
                onClick={() => setHintTier(1)}
                className="w-full py-2.5 px-4 bg-white hover:bg-amber-50 border-2 border-[#1E1E24] rounded-xl text-xs font-black text-[#1E1E24] shadow-[2px_2px_0px_#1E1E24] flex items-center justify-center gap-2 transition-transform hover:translate-x-[1px] hover:translate-y-[1px]"
              >
                <HelpCircle className="w-4 h-4 text-amber-500" />
                <span>Stuck? Reveal Gentle Nudge (Tier 1)</span>
              </button>
            ) : (
              <div className="space-y-2.5">
                {/* Hints 1 to hintTier */}
                {hints.slice(0, hintTier).map((hintText, idx) => (
                  <div
                    key={idx}
                    className="p-3 bg-white border-2 border-[#1E1E24] rounded-xl shadow-[2px_2px_0px_#1E1E24] space-y-1"
                  >
                    <div className="flex items-center gap-1.5 text-[10px] font-mono font-black uppercase text-[#6C5CE7]">
                      <span>
                        {idx === 0
                          ? '🌱 Tier 1: Gentle Nudge'
                          : idx === 1
                          ? '🔍 Tier 2: Conceptual Clue'
                          : idx === 2
                          ? '📐 Tier 3: Code Blueprint'
                          : '🔑 Tier 4: Complete Solution'}
                      </span>
                    </div>
                    <p className="text-xs font-bold text-[#2D3436] whitespace-pre-wrap font-mono">
                      {hintText}
                    </p>
                  </div>
                ))}

                {hintTier < 4 && (
                  <button
                    onClick={() => setHintTier((prev) => Math.min(4, prev + 1))}
                    className="w-full py-1.5 px-3 bg-white hover:bg-amber-50 border border-[#1E1E24] rounded-lg text-xs font-black text-[#1E1E24] flex items-center justify-center gap-1.5 transition-colors"
                  >
                    <span>Unlock Tier {hintTier + 1} Hint →</span>
                  </button>
                )}
              </div>
            )}
          </div>

          {/* Bottom Quest Navigation */}
          <div className="pt-2 flex items-center justify-between">
            {prevLesson ? (
              <Link
                href={`/learn/${prevLesson.id}`}
                className="inline-flex items-center gap-1.5 text-xs font-black text-[#4A4A58] hover:text-[#1E1E24] py-2 px-3 rounded-xl border border-gray-300 hover:border-[#1E1E24] bg-white transition-all shadow-[2px_2px_0px_#E2E8F0]"
              >
                <ArrowLeft className="w-3.5 h-3.5" />
                <span>Previous Quest</span>
              </Link>
            ) : <div />}

            {nextLesson ? (
              <Link
                href={`/learn/${nextLesson.id}`}
                className={`inline-flex items-center gap-1.5 text-xs font-black py-2 px-4 rounded-xl border-2 border-[#1E1E24] transition-all ${
                  exercisePassed
                    ? 'bg-[#00B894] hover:bg-[#00A383] text-white shadow-[4px_4px_0px_#1E1E24] animate-pulse'
                    : 'bg-white hover:bg-gray-50 text-[#1E1E24] shadow-[2px_2px_0px_#1E1E24]'
                }`}
              >
                <span>Next Quest</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            ) : (
              <Link
                href={`/courses/${course.id}`}
                className="inline-flex items-center gap-1.5 text-xs font-black bg-[#FFD214] text-[#1E1E24] py-2 px-4 rounded-xl border-2 border-[#1E1E24] shadow-[2px_2px_0px_#1E1E24]"
              >
                <span>Finish Realm →</span>
              </Link>
            )}
          </div>
        </div>

        {/* ============================================================== */}
        {/* RIGHT PANEL: INTERACTIVE CODE STUDIO & SANDBOX */}
        {/* ============================================================== */}
        <div className="w-full lg:w-1/2 h-1/2 lg:h-full flex flex-col bg-[#12131C] text-gray-100 overflow-hidden">
          {/* STUDIO BAR: TABS & CONTROLS */}
          <div className="h-12 bg-[#1A1C29] border-b-2 border-[#1E1E24] px-4 flex items-center justify-between shrink-0 select-none">
            {/* Dynamic File Tabs */}
            <div className="flex items-center gap-1.5 overflow-x-auto py-1">
              {isPython ? (
                <button
                  className="px-3 py-1.5 rounded-lg text-xs font-mono font-bold flex items-center gap-1.5 bg-[#25283B] text-[#FFD214] border border-[#3E425E]"
                >
                  <span className="w-2 h-2 rounded-full bg-[#FFD214]" />
                  <span>main.py</span>
                </button>
              ) : isHtmlCourse ? (
                <button
                  onClick={() => setActiveTab('html')}
                  className="px-3 py-1.5 rounded-lg text-xs font-mono font-bold flex items-center gap-1.5 bg-[#25283B] text-[#FF7675] border border-[#FF7675]/50 shadow-sm"
                >
                  <span className="w-2 h-2 rounded-full bg-[#FF7675]" />
                  <span>index.html</span>
                </button>
              ) : isCssCourse ? (
                <button
                  onClick={() => setActiveTab('css')}
                  className="px-3 py-1.5 rounded-lg text-xs font-mono font-bold flex items-center gap-1.5 bg-[#25283B] text-[#74B9FF] border border-[#74B9FF]/50 shadow-sm"
                >
                  <span className="w-2 h-2 rounded-full bg-[#74B9FF]" />
                  <span>styles.css</span>
                </button>
              ) : isJsCourse ? (
                <button
                  onClick={() => setActiveTab('js')}
                  className="px-3 py-1.5 rounded-lg text-xs font-mono font-bold flex items-center gap-1.5 bg-[#25283B] text-[#FFEAA7] border border-[#FFEAA7]/50 shadow-sm"
                >
                  <span className="w-2 h-2 rounded-full bg-[#FFEAA7]" />
                  <span>script.js</span>
                </button>
              ) : (
                <>
                  <button
                    onClick={() => setActiveTab('html')}
                    className={`px-3 py-1.5 rounded-lg text-xs font-mono font-bold flex items-center gap-1.5 transition-all ${
                      activeTab === 'html'
                        ? 'bg-[#25283B] text-[#FF7675] border border-[#FF7675]/50 shadow-sm'
                        : 'text-gray-400 hover:text-white hover:bg-[#1E2030]'
                    }`}
                  >
                    <span className="w-2 h-2 rounded-full bg-[#FF7675]" />
                    <span>index.html</span>
                  </button>

                  <button
                    onClick={() => setActiveTab('css')}
                    className={`px-3 py-1.5 rounded-lg text-xs font-mono font-bold flex items-center gap-1.5 transition-all ${
                      activeTab === 'css'
                        ? 'bg-[#25283B] text-[#74B9FF] border border-[#74B9FF]/50 shadow-sm'
                        : 'text-gray-400 hover:text-white hover:bg-[#1E2030]'
                    }`}
                  >
                    <span className="w-2 h-2 rounded-full bg-[#74B9FF]" />
                    <span>styles.css</span>
                  </button>

                  <button
                    onClick={() => setActiveTab('js')}
                    className={`px-3 py-1.5 rounded-lg text-xs font-mono font-bold flex items-center gap-1.5 transition-all ${
                      activeTab === 'js'
                        ? 'bg-[#25283B] text-[#FFEAA7] border border-[#FFEAA7]/50 shadow-sm'
                        : 'text-gray-400 hover:text-white hover:bg-[#1E2030]'
                    }`}
                  >
                    <span className="w-2 h-2 rounded-full bg-[#FFEAA7]" />
                    <span>script.js</span>
                  </button>
                </>
              )}
            </div>

            {/* Studio Action Buttons */}
            <div className="flex items-center gap-2">
              <button
                onClick={handleResetCode}
                title="Reset code to original starter"
                className="p-1.5 rounded-lg text-gray-400 hover:text-white hover:bg-[#25283B] transition-colors"
              >
                <RotateCcw className="w-4 h-4" />
              </button>

              {/* Primary Run Button */}
              <button
                onClick={handleRunAndValidate}
                disabled={isRunning}
                className="flex items-center gap-1.5 px-4 py-1.5 bg-[#6C5CE7] hover:bg-[#5A4AD1] text-white font-black text-xs rounded-xl border border-white/20 shadow-[0_2px_8px_rgba(108,92,231,0.5)] transition-all hover:scale-105 active:scale-95 disabled:opacity-50"
              >
                {isRunning ? (
                  <div className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                ) : (
                  <Play className="w-3.5 h-3.5 fill-current" />
                )}
                <span>Run & Validate</span>
                <span className="text-[10px] opacity-70 hidden md:inline font-mono">
                  (Ctrl+↵)
                </span>
              </button>

              {/* Unlocked Next Button if Passed */}
              {exercisePassed && nextLesson && (
                <Link
                  href={`/learn/${nextLesson.id}`}
                  className="flex items-center gap-1 px-3 py-1.5 bg-[#00B894] hover:bg-[#00A383] text-white font-black text-xs rounded-xl border border-white/20 shadow-[0_2px_8px_rgba(0,184,148,0.5)] animate-pulse"
                >
                  <span>Next Quest</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              )}
            </div>
          </div>

          {/* CODE EDITOR TEXTAREA (TOP HALF OF RIGHT PANEL) */}
          <div className="flex-1 min-h-0 flex bg-[#12131C] border-b-2 border-[#1E1E24] overflow-hidden">
            {/* Line Numbers Simulation */}
            <div className="w-10 bg-[#0E0F17] text-gray-600 font-mono text-xs py-3 select-none text-right pr-2 space-y-1 overflow-hidden shrink-0">
              {Array.from({ length: 40 }).map((_, i) => (
                <div key={i} className="leading-5">
                  {i + 1}
                </div>
              ))}
            </div>

            {/* Editable Text Area */}
            <div className="flex-1 relative">
              {isPython ? (
                <textarea
                  value={pythonCode}
                  onChange={(e) => setPythonCode(e.target.value)}
                  spellCheck={false}
                  placeholder="# Write your Python code here..."
                  className="w-full h-full bg-[#12131C] text-emerald-300 font-mono text-xs sm:text-sm p-3 outline-none resize-none leading-5 selection:bg-[#6C5CE7]/40"
                />
              ) : isCssCourse || activeTab === 'css' ? (
                <textarea
                  value={cssCode}
                  onChange={(e) => setCssCode(e.target.value)}
                  spellCheck={false}
                  placeholder="/* Write CSS styles here */"
                  className="w-full h-full bg-[#12131C] text-blue-200 font-mono text-xs sm:text-sm p-3 outline-none resize-none leading-5 selection:bg-[#6C5CE7]/40"
                />
              ) : isJsCourse || activeTab === 'js' ? (
                <textarea
                  value={jsCode}
                  onChange={(e) => setJsCode(e.target.value)}
                  spellCheck={false}
                  placeholder="// Write JavaScript code here"
                  className="w-full h-full bg-[#12131C] text-yellow-200 font-mono text-xs sm:text-sm p-3 outline-none resize-none leading-5 selection:bg-[#6C5CE7]/40"
                />
              ) : (
                <textarea
                  value={htmlCode}
                  onChange={(e) => setHtmlCode(e.target.value)}
                  spellCheck={false}
                  placeholder="<!-- Write HTML here -->"
                  className="w-full h-full bg-[#12131C] text-orange-200 font-mono text-xs sm:text-sm p-3 outline-none resize-none leading-5 selection:bg-[#6C5CE7]/40"
                />
              )}
            </div>
          </div>

          {/* LOWER HALF: REALISTIC LIVE BROWSER SANDBOX (WEB) OR INTERACTIVE OUTPUT (PYTHON) */}
          {isWeb ? (
            <div className="flex-1 min-h-0 flex flex-col bg-[#161824] border-t-2 border-[#1E1E24] overflow-hidden">
              {/* Modern Browser Chrome Toolbar */}
              <div className="h-10 bg-[#1A1C29] border-b border-[#2B2E42] px-3 flex items-center justify-between shrink-0 select-none gap-2">
                {/* Left: Window Controls & Nav */}
                <div className="flex items-center gap-2.5 shrink-0">
                  <div className="flex items-center gap-1.5">
                    <span className="w-2.5 h-2.5 rounded-full bg-[#EF4444] border border-[#DC2626]" />
                    <span className="w-2.5 h-2.5 rounded-full bg-[#F59E0B] border border-[#D97706]" />
                    <span className="w-2.5 h-2.5 rounded-full bg-[#10B981] border border-[#059669]" />
                  </div>

                  <div className="flex items-center gap-1 ml-1 text-gray-500">
                    <button
                      disabled
                      aria-label="Back"
                      className="p-1 rounded text-gray-600 cursor-not-allowed opacity-50"
                    >
                      <ChevronLeft className="w-3.5 h-3.5" />
                    </button>
                    <button
                      onClick={() => {
                        setPreviewDoc(buildWebPreviewDocument(htmlCode, cssCode, jsCode));
                      }}
                      title="Reload Live Preview"
                      className="p-1 rounded text-gray-400 hover:text-white hover:bg-[#25283B] transition-colors"
                    >
                      <RefreshCw className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>

                {/* Center: URL Omnibar */}
                <div className="flex-1 max-w-md flex items-center gap-1.5 bg-[#0E0F17] px-3 py-1 rounded-full border border-[#2B2E42] text-[11px] font-mono text-gray-300 shadow-inner">
                  <Lock className="w-3 h-3 text-[#00B894] shrink-0" />
                  <span className="text-gray-400">https://</span>
                  <span className="text-emerald-400 font-semibold truncate">gurukul.preview</span>
                  <span className="text-gray-500 truncate">/{course?.id || 'web'}/{lesson.id}.html</span>
                </div>

                {/* Right: Live Status & Responsive Device Toggle */}
                <div className="flex items-center gap-2 shrink-0">
                  <div className="hidden sm:flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-emerald-950/70 border border-emerald-500/30 text-[10px] font-mono font-bold text-emerald-400">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                    <span>LIVE PREVIEW</span>
                  </div>

                  <button
                    onClick={() => setIsMobilePreview(!isMobilePreview)}
                    title={isMobilePreview ? 'Switch to Full Desktop View' : 'Switch to Mobile Responsive View'}
                    className={`p-1.5 rounded-lg text-xs font-mono font-bold flex items-center gap-1 transition-colors ${
                      isMobilePreview
                        ? 'bg-[#6C5CE7] text-white shadow-sm'
                        : 'text-gray-400 hover:text-white hover:bg-[#25283B]'
                    }`}
                  >
                    {isMobilePreview ? (
                      <Monitor className="w-3.5 h-3.5" />
                    ) : (
                      <Smartphone className="w-3.5 h-3.5" />
                    )}
                    <span className="hidden md:inline text-[10px]">
                      {isMobilePreview ? '375px' : 'Desktop'}
                    </span>
                  </button>
                </div>
              </div>

              {/* Browser Canvas Body: 100% Flush, no left gap */}
              <div className="flex-1 overflow-hidden relative w-full h-full bg-white">
                {isMobilePreview ? (
                  <div className="w-full h-full flex items-center justify-center bg-[#0E0F17]">
                    <div className="h-[96%] w-[375px] max-w-[95%] bg-white rounded-2xl border-4 border-[#2B2E42] shadow-2xl overflow-hidden flex flex-col transition-all">
                      {/* Mobile speaker notch */}
                      <div className="h-4 bg-[#1E2030] flex items-center justify-center shrink-0">
                        <div className="w-12 h-1 rounded-full bg-gray-600" />
                      </div>
                      <iframe
                        ref={iframeRef}
                        srcDoc={previewDoc}
                        title="Dronacharya Mobile Web Sandbox"
                        sandbox="allow-scripts allow-modals"
                        className="w-full flex-1 bg-white border-0"
                      />
                    </div>
                  </div>
                ) : (
                  <iframe
                    ref={iframeRef}
                    srcDoc={previewDoc}
                    title="Dronacharya Desktop Web Sandbox"
                    sandbox="allow-scripts allow-modals"
                    className="w-full h-full bg-white border-0 block"
                  />
                )}
              </div>
            </div>
          ) : (
            <div className="h-1/2 flex flex-col bg-[#0E0F17] border-t-2 border-[#1E1E24]">
              {/* Python Output Bar */}
              <div className="h-10 bg-[#161824] border-b border-[#2B2E42] px-3 flex items-center justify-between shrink-0 select-none">
                <div className="flex items-center gap-2.5">
                  <div className="flex items-center gap-1.5">
                    <span className="w-2.5 h-2.5 rounded-full bg-[#EF4444]" />
                    <span className="w-2.5 h-2.5 rounded-full bg-[#F59E0B]" />
                    <span className="w-2.5 h-2.5 rounded-full bg-[#10B981]" />
                  </div>
                  <div className="flex items-center gap-1.5 text-xs font-mono font-bold text-gray-200">
                    <span className="text-[#FFD214]">Pyodide 3.11</span>
                    <span className="text-gray-500">·</span>
                    <span className="text-gray-400">Standard Output</span>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <div className="flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-emerald-950/70 border border-emerald-500/30 text-[10px] font-mono font-bold text-emerald-400">
                    <span className={`w-1.5 h-1.5 rounded-full ${isRunning ? 'bg-amber-400 animate-ping' : 'bg-emerald-400'}`} />
                    <span>{isRunning ? 'EXECUTING...' : 'READY'}</span>
                  </div>

                  {consoleLogs.length > 0 && (
                    <button
                      onClick={() => setConsoleLogs([])}
                      className="text-[11px] font-mono text-gray-400 hover:text-white px-2 py-0.5 rounded hover:bg-[#25283B] transition-colors"
                    >
                      Clear Output
                    </button>
                  )}
                </div>
              </div>

              {/* Monospace Output Screen */}
              <div className="flex-1 p-3 overflow-y-auto font-mono text-xs space-y-1 text-gray-300 select-text">
                {consoleLogs.length === 0 ? (
                  <div className="text-gray-500 italic p-3 select-none flex flex-col gap-1">
                    <span># Output terminal ready.</span>
                    <span># Press &quot;Run &amp; Validate&quot; (or Ctrl+Enter) to execute your Python script.</span>
                  </div>
                ) : (
                  consoleLogs.map((log, i) => (
                    <div
                      key={i}
                      className={`flex items-start gap-2 py-0.5 ${
                        log.level === 'error'
                          ? 'text-rose-400 bg-rose-950/20 px-1 rounded'
                          : log.level === 'warn'
                          ? 'text-amber-300'
                          : 'text-gray-200'
                      }`}
                    >
                      <span className="text-[#FFD214] select-none">›</span>
                      <span className="whitespace-pre-wrap">{log.message}</span>
                    </div>
                  ))
                )}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* ACHARYA AI MENTOR DRAWER */}
      <AcharyaDrawer
        isOpen={isAcharyaOpen}
        onClose={() => setIsAcharyaOpen(false)}
        contextCode={
          isPython
            ? pythonCode
            : isCssCourse
            ? cssCode
            : isJsCourse
            ? jsCode
            : htmlCode
        }
        contextError={
          consoleLogs.find((l) => l.level === 'error')?.message || ''
        }
        activeMissionTitle={`${course.title}: ${lesson.title}`}
        missionGoal={lesson.exercise?.instructions || lesson.subtitle || lesson.storyIntro || ''}
        language={isPython ? 'python' : isCssCourse ? 'css' : isJsCourse ? 'javascript' : 'html'}
        proactiveTrigger={proactiveTrigger}
        onClearProactiveTrigger={() => setProactiveTrigger(null)}
      />
    </div>
  );
}
