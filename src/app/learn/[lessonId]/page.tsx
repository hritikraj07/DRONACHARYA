// Interactive Coding Lesson Laboratory
// Integrates with 112-topic structured curriculum, prerequisite checks, anti-cheat XP, and targeted revision guidance
'use client';

import React, { useState, useEffect, Suspense } from 'react';
import Link from 'next/link';
import { useParams, useRouter } from 'next/navigation';
import {
  findTopicById,
  findTopicBySlug,
  ALL_PYTHON_TOPICS,
  CurriculumTopic,
} from '@/lib/data/python-curriculum-112';
import {
  findLessonById as findLegacyLessonById,
} from '@/lib/data/course-system';
import {
  runPythonCode,
  validatePythonExercise,
  ExerciseValidationResult,
  PythonRunResult,
} from '@/lib/simulator/python-interpreter';
import {
  getLearnerProgress,
  checkPrerequisites,
  evaluateActivityAttempt,
  completeLessonAndUnlockNext,
  getNextRecommendedActivity,
  LearnerProgressState,
} from '@/lib/curriculum/progression-engine';
import { useDronacharya } from '@/lib/store';
import { getActiveSession, triggerSaveProgressModal } from '@/lib/db/auth-db';
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
  Gamepad2,
  Terminal,
  Zap,
  Globe,
  Award,
  ChevronRight,
  ShieldCheck,
  Lock,
  AlertTriangle,
  Info,
} from 'lucide-react';
import confetti from 'canvas-confetti';

export default function LessonPage() {
  return (
    <Suspense
      fallback={
        <div className="max-w-5xl mx-auto py-16 px-4 text-center">
          <div className="inline-block animate-spin w-8 h-8 border-4 border-[#6C5CE7] border-t-transparent rounded-full mb-4" />
          <p className="font-mono text-sm font-bold text-gray-500">Loading interactive lesson laboratory...</p>
        </div>
      }
    >
      <LessonContent />
    </Suspense>
  );
}

function LessonContent() {
  const router = useRouter();
  const params = useParams();
  const rawId = (params?.lessonId as string) || 'py-topic-1';

  // State management
  const [progress, setProgress] = useState<LearnerProgressState | null>(null);
  const [preferredDialect, setPreferredDialect] = useState<'english' | 'hinglish'>('english');
  const [showDiagnosticAnswers, setShowDiagnosticAnswers] = useState<boolean>(false);

  // Try it yourself state
  const [tryCode, setTryCode] = useState<string>('');
  const [tryRunning, setTryRunning] = useState<boolean>(false);
  const [tryResult, setTryResult] = useState<PythonRunResult | null>(null);

  // Exercise state
  const [exerciseCode, setExerciseCode] = useState<string>('');
  const [exerciseRunning, setExerciseRunning] = useState<boolean>(false);
  const [exerciseResult, setExerciseResult] = useState<ExerciseValidationResult | null>(null);
  const [exercisePassed, setExercisePassed] = useState<boolean>(false);
  const [awardedXp, setAwardedXp] = useState<number>(0);
  const [revisionAdvice, setRevisionAdvice] = useState<string | null>(null);

  // Progressive Hint System (1 to 4)
  const [hintTier, setHintTier] = useState<number>(0);
  const [showSolution, setShowSolution] = useState<boolean>(false);

  // Load progress
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const p = getLearnerProgress();
      setProgress(p);
    }
  }, []);

  // Resolve Topic (Checks 112 curriculum first, then legacy format)
  const topic: CurriculumTopic | undefined =
    findTopicById(rawId) ||
    findTopicBySlug(rawId) ||
    (() => {
      // If legacy ID like py-less-1-1 passed, map to py-topic-1
      if (rawId.startsWith('py-less-')) {
        const parts = rawId.split('-');
        const chap = parseInt(parts[2] || '1', 10);
        const less = parseInt(parts[3] || '1', 10);
        return findTopicById(`py-topic-${(chap - 1) * 2 + less}`) || findTopicById('py-topic-1');
      }
      return findTopicById('py-topic-1');
    })();

  // Check prerequisites
  const currentCompleted = progress?.completedLessonIds || [];
  const prereqCheck = topic ? checkPrerequisites(topic.id, currentCompleted) : { canUnlock: true, missingPrerequisites: [], explanation: '' };

  // Set starter code when topic changes
  useEffect(() => {
    if (topic?.lessonContent) {
      setTryCode(topic.lessonContent.interactiveTryStarter);
      const firstAct = topic.activities?.[0];
      setExerciseCode(firstAct?.starterCode || firstAct?.solution || '# Write your solution:\n');
      setTryResult(null);
      setExerciseResult(null);
      setExercisePassed(false);
      setAwardedXp(0);
      setRevisionAdvice(null);
      setHintTier(0);
      setShowSolution(false);
    }
  }, [topic?.id]);

  if (!topic) {
    return (
      <div className="max-w-4xl mx-auto py-16 px-4 text-center">
        <h1 className="text-2xl font-black text-[#1E1E24]">Topic Not Found</h1>
        <p className="text-sm text-[#4A4A58] mt-2 font-bold">
          The requested curriculum topic does not exist.
        </p>
        <Link href="/paths" className="btn-game-purple mt-4 inline-flex py-2 px-4 text-xs font-black">
          ← Return to Roadmap
        </Link>
      </div>
    );
  }

  // PREREQUISITE LOCK SCREEN
  if (!prereqCheck.canUnlock) {
    return (
      <div className="max-w-3xl mx-auto py-16 px-4">
        <div className="bg-white rounded-2xl border-2 border-[#1E1E24] p-8 shadow-[8px_8px_0px_#1E1E24] text-center space-y-6">
          <div className="w-16 h-16 mx-auto rounded-2xl bg-[#FEE2E2] border-2 border-[#EF4444] text-[#EF4444] flex items-center justify-center">
            <Lock className="w-8 h-8" />
          </div>

          <div>
            <span className="text-xs font-black uppercase tracking-wider text-gray-400">
              Topic #{topic.sequenceNumber} • Stage {topic.stageNumber}
            </span>
            <h1 className="text-2xl sm:text-3xl font-black text-[#1E1E24] mt-1">
              Lesson Locked: Prerequisites Required
            </h1>
            <p className="text-sm font-bold text-[#4A4A58] mt-2 max-w-xl mx-auto">
              In Dronacharya Gurukul, lessons build directly on prior concepts. You cannot jump ahead without demonstrating mastery of the prerequisites.
            </p>
          </div>

          <div className="p-4 rounded-xl bg-[#FAF6EE] border-2 border-[#1E1E24] max-w-md mx-auto text-left space-y-2">
            <div className="text-xs font-black uppercase text-[#EF4444] flex items-center gap-1.5">
              <AlertTriangle className="w-4 h-4" />
              <span>Required Uncompleted Lessons:</span>
            </div>
            <ul className="space-y-2">
              {prereqCheck.missingPrerequisites.map((p) => (
                <li key={p.id} className="flex items-center justify-between text-xs font-bold text-[#1E1E24]">
                  <span>Lesson {p.sequenceNumber}: {p.title}</span>
                  <Link
                    href={`/learn/${p.id}`}
                    className="text-[#6C5CE7] hover:underline font-black flex items-center gap-1"
                  >
                    <span>Start Lesson</span>
                    <ArrowRight className="w-3 h-3" />
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div className="pt-4 flex justify-center gap-4">
            <Link href="/paths" className="btn-game-yellow py-2.5 px-6 text-xs font-black">
              ← Return to Roadmap
            </Link>
            {prereqCheck.missingPrerequisites[0] && (
              <Link
                href={`/learn/${prereqCheck.missingPrerequisites[0].id}`}
                className="btn-game-purple py-2.5 px-6 text-xs font-black"
              >
                Go to Lesson {prereqCheck.missingPrerequisites[0].sequenceNumber} →
              </Link>
            )}
          </div>
        </div>
      </div>
    );
  }

  // COMING SOON NOTICE IF CONTENT NOT READY
  if (topic.contentStatus === 'coming_soon' || !topic.lessonContent) {
    return (
      <div className="max-w-3xl mx-auto py-16 px-4">
        <div className="bg-white rounded-2xl border-2 border-[#1E1E24] p-8 shadow-[8px_8px_0px_#1E1E24] text-center space-y-6">
          <div className="w-16 h-16 mx-auto rounded-2xl bg-blue-100 border-2 border-blue-500 text-blue-600 flex items-center justify-center">
            <Sparkles className="w-8 h-8" />
          </div>

          <div>
            <span className="text-xs font-black uppercase tracking-wider text-blue-600">
              Curriculum Metadata Active • Stage {topic.stageNumber}
            </span>
            <h1 className="text-2xl sm:text-3xl font-black text-[#1E1E24] mt-1">
              Topic #{topic.sequenceNumber}: {topic.title}
            </h1>
            <p className="text-sm font-bold text-[#4A4A58] mt-2 max-w-xl mx-auto">
              {topic.description}
            </p>
          </div>

          <div className="p-4 rounded-xl bg-[#FAF6EE] border-2 border-[#1E1E24] max-w-md mx-auto text-left space-y-2 text-xs font-bold text-[#4A4A58]">
            <div className="font-black text-[#1E1E24]">Learning Objectives:</div>
            <ul className="list-disc pl-4 space-y-1">
              {topic.learningObjectives.map((obj, i) => (
                <li key={i}>{obj}</li>
              ))}
            </ul>
          </div>

          <div className="pt-2 text-xs font-bold text-gray-500">
            Interactive laboratory for this topic is currently in authoring. Play fully completed Stage 1 & 2 lessons first!
          </div>

          <div className="pt-2 flex justify-center gap-4">
            <Link href="/paths" className="btn-game-purple py-2.5 px-6 text-xs font-black">
              ← Return to Roadmap
            </Link>
            <Link href="/learn/py-topic-1" className="btn-game-yellow py-2.5 px-6 text-xs font-black">
              Play Topic #1 →
            </Link>
          </div>
        </div>
      </div>
    );
  }

  const act = topic.activities?.[0];

  // Try it yourself execution
  const handleRunTryCode = () => {
    setTryRunning(true);
    setTimeout(() => {
      const res = runPythonCode(tryCode);
      setTryResult(res);
      setTryRunning(false);
    }, 200);
  };

  // Exercise validation
  const handleCheckExercise = () => {
    if (!act) return;
    setExerciseRunning(true);

    setTimeout(() => {
      const tests = act.testCases || [
        {
          inputDescription: 'Produces valid output',
          expectedOutput: act.expectedOutput || '',
          codeSnippet: act.expectedOutput ? `stdout:${act.expectedOutput}` : 'stdout:OK',
        },
      ];

      const validation = validatePythonExercise(exerciseCode, tests);
      setExerciseResult(validation);
      setExerciseRunning(false);

      const isCorrect = validation.allPassed;
      setExercisePassed(isCorrect);

      // Evaluate attempt with progression engine
      const evalRes = evaluateActivityAttempt({
        topicId: topic.id,
        activityId: act.id,
        isCorrect,
        score: isCorrect ? 100 : 0,
        hintsUsed: hintTier,
        xpReward: act.xpReward || 35,
      });

      if (evalRes.awardedXp > 0) {
        setAwardedXp(evalRes.awardedXp);
        confetti({ particleCount: 75, spread: 60, origin: { y: 0.7 } });
      }

      if (evalRes.needsRevision && evalRes.strugglingConcept) {
        setRevisionAdvice(
          `You have struggled with ${evalRes.strugglingConcept}. Check Hint ${Math.min(4, hintTier + 1)} or review earlier lessons on the roadmap.`
        );
      }

      // Mark lesson complete and unlock next topic
      if (isCorrect) {
        completeLessonAndUnlockNext(topic.id, 100);
      }
    }, 300);
  };

  // Find next topic in sequence
  const nextTopic = ALL_PYTHON_TOPICS.find((t) => t.sequenceNumber === topic.sequenceNumber + 1);

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 py-6 w-full space-y-6">
      {/* Top Breadcrumb & Status Navigation */}
      <div className="flex flex-wrap items-center justify-between gap-3 bg-white p-3.5 rounded-xl border-2 border-[#1E1E24] shadow-[3px_3px_0px_#1E1E24]">
        <div className="flex items-center gap-2 text-xs font-black text-[#4A4A58]">
          <Link href="/paths" className="hover:text-[#6C5CE7] flex items-center gap-1">
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Roadmap</span>
          </Link>
          <span>/</span>
          <span className="text-[#6C5CE7]">{topic.stageTitle}</span>
          <span>/</span>
          <span className="text-[#1E1E24]">Topic #{topic.sequenceNumber}</span>
        </div>

        {/* Dialect Switcher & Mentor Diagnostic Info */}
        <div className="flex items-center gap-2">
          <button
            onClick={() => setShowDiagnosticAnswers(!showDiagnosticAnswers)}
            className="flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-black bg-[#FAF6EE] text-[#4A4A58] border border-[#1E1E24] hover:bg-white"
          >
            <Info className="w-3.5 h-3.5 text-[#6C5CE7]" />
            <span>Why Am I Learning This?</span>
          </button>

          <button
            onClick={() => setPreferredDialect(preferredDialect === 'english' ? 'hinglish' : 'english')}
            className="flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-black bg-[#FAF6EE] text-[#4A4A58] border border-[#1E1E24] hover:bg-white"
          >
            <Globe className="w-3.5 h-3.5 text-[#10B981]" />
            <span>{preferredDialect === 'english' ? 'EN (English)' : 'HI (Hinglish)'}</span>
          </button>
        </div>
      </div>

      {/* Expandable Core Diagnostic Answers (The 6 Questions) */}
      {showDiagnosticAnswers && (
        <div className="p-4 rounded-xl bg-[#FAF6EE] border-2 border-[#1E1E24] shadow-[3px_3px_0px_#1E1E24] text-xs font-bold text-[#4A4A58] space-y-2 animate-fade-in">
          <div className="font-black text-[#1E1E24] text-sm flex items-center gap-1.5">
            <Sparkles className="w-4 h-4 text-[#6C5CE7]" />
            <span>Curriculum Mentor Explanations (6 Core Objectives)</span>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pt-2">
            <div>
              <span className="font-black text-[#6C5CE7]">1. What am I learning?</span>
              <p className="mt-0.5">{topic.title} (Concepts: {topic.conceptsIntroduced.join(', ')})</p>
            </div>
            <div>
              <span className="font-black text-[#6C5CE7]">2. Why is this taught?</span>
              <p className="mt-0.5">{topic.description}</p>
            </div>
            <div>
              <span className="font-black text-[#6C5CE7]">3. Prerequisites needed:</span>
              <p className="mt-0.5">
                {topic.prerequisiteLessonIds.length === 0
                  ? 'Foundational entry point (None)'
                  : topic.prerequisiteLessonIds.map((id) => findTopicById(id)?.title || id).join(', ')}
              </p>
            </div>
            <div>
              <span className="font-black text-[#6C5CE7]">4. What unlocks next?</span>
              <p className="mt-0.5">
                Pass code tests with 100% assertions to unlock Topic #{topic.sequenceNumber + 1}.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Main Two-Column Lesson Lab */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left Column (Theory, Story, Explanation, Code Example) */}
        <div className="lg:col-span-5 space-y-6">
          {/* Section A & B: Story & Concept */}
          <div className="bg-white rounded-2xl border-2 border-[#1E1E24] p-5 shadow-[4px_4px_0px_#1E1E24] space-y-4">
            <div>
              <span className="text-[11px] font-black uppercase tracking-wider text-[#6C5CE7] bg-[#EDE9FE] px-2 py-0.5 rounded">
                Topic #{topic.sequenceNumber} • {topic.difficulty}
              </span>
              <h1 className="text-xl sm:text-2xl font-black text-[#1E1E24] mt-2">
                {topic.title}
              </h1>
            </div>

            {/* Story / Lore */}
            <div className="p-3.5 rounded-xl bg-[#FAF6EE] border-2 border-[#1E1E24]/20 space-y-1">
              <div className="text-[11px] font-black uppercase text-[#F59E0B] flex items-center gap-1">
                <Sparkles className="w-3.5 h-3.5" />
                <span>Mission Lore</span>
              </div>
              <p className="text-xs sm:text-sm font-bold text-[#4A4A58] leading-relaxed">
                {preferredDialect === 'hinglish' && topic.lessonContent.storyIntroHinglish
                  ? topic.lessonContent.storyIntroHinglish
                  : topic.lessonContent.storyIntro}
              </p>
            </div>

            {/* Concept Explanation */}
            <div className="space-y-2">
              <h3 className="text-sm font-black text-[#1E1E24]">Concept Explanation:</h3>
              <p className="text-xs sm:text-sm font-bold text-[#4A4A58] whitespace-pre-line leading-relaxed">
                {preferredDialect === 'hinglish' && topic.lessonContent.conceptExplanationHinglish
                  ? topic.lessonContent.conceptExplanationHinglish
                  : topic.lessonContent.conceptExplanation}
              </p>
            </div>

            {/* Real World Analogy */}
            {topic.lessonContent.analogy && (
              <div className="p-3 rounded-lg bg-[#E0F2FE] border border-[#0284C7] text-xs font-bold text-[#0369A1]">
                <span className="font-black">Analogy: </span>
                {topic.lessonContent.analogy}
              </div>
            )}

            {/* Common Mistakes */}
            {topic.lessonContent.commonMistakes && topic.lessonContent.commonMistakes.length > 0 && (
              <div className="p-3 rounded-lg bg-[#FEF2F2] border border-[#EF4444] text-xs font-bold text-[#991B1B] space-y-1">
                <div className="font-black uppercase flex items-center gap-1">
                  <AlertTriangle className="w-3.5 h-3.5" />
                  <span>Common Pitfalls to Avoid:</span>
                </div>
                <ul className="list-disc pl-4 space-y-0.5">
                  {topic.lessonContent.commonMistakes.map((m, i) => (
                    <li key={i}>{m}</li>
                  ))}
                </ul>
              </div>
            )}
          </div>

          {/* Section C: Code Example */}
          <div className="bg-white rounded-2xl border-2 border-[#1E1E24] p-5 shadow-[4px_4px_0px_#1E1E24] space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-black text-[#1E1E24] flex items-center gap-1.5">
                <Terminal className="w-4 h-4 text-[#10B981]" />
                <span>Reference Code Example</span>
              </h3>
              <span className="text-[10px] font-black uppercase text-gray-400 bg-gray-100 px-2 py-0.5 rounded">
                Python 3
              </span>
            </div>

            <pre className="p-3.5 rounded-xl bg-[#1E1E24] text-[#FAF6EE] font-mono text-xs overflow-x-auto border-2 border-[#1E1E24] leading-relaxed">
              <code>{topic.lessonContent.codeExample}</code>
            </pre>

            <p className="text-xs font-bold text-[#4A4A58]">
              {topic.lessonContent.codeExampleExplanation}
            </p>
          </div>
        </div>

        {/* Right Column (Try It Yourself, Practice Exercise, Tests, Console) */}
        <div className="lg:col-span-7 space-y-6">
          {/* Section D & E: Try It Yourself Sandbox */}
          <div className="bg-white rounded-2xl border-2 border-[#1E1E24] p-5 shadow-[4px_4px_0px_#1E1E24] space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-black text-[#1E1E24] flex items-center gap-1.5">
                <Play className="w-4 h-4 text-[#6C5CE7]" />
                <span>Try It Yourself (Live Sandbox)</span>
              </h3>
              <button
                onClick={() => setTryCode(topic.lessonContent?.interactiveTryStarter || '')}
                className="text-[11px] font-black text-gray-500 hover:text-[#1E1E24] flex items-center gap-1"
              >
                <RotateCcw className="w-3 h-3" />
                <span>Reset</span>
              </button>
            </div>

            <p className="text-xs font-bold text-[#4A4A58]">
              {topic.lessonContent.tryExplanation}
            </p>

            {/* Interactive Code Editor */}
            <div className="relative rounded-xl border-2 border-[#1E1E24] overflow-hidden bg-[#1E1E24]">
              <div className="flex items-center justify-between px-3 py-1.5 bg-[#121316] border-b border-gray-700 text-[11px] font-mono text-gray-400">
                <span>sandbox_experiment.py</span>
                <span>Python Interpreter</span>
              </div>
              <textarea
                value={tryCode}
                onChange={(e) => setTryCode(e.target.value)}
                rows={4}
                className="w-full p-3 font-mono text-xs text-[#10B981] bg-[#1E1E24] focus:outline-none resize-y leading-relaxed"
                spellCheck={false}
              />
            </div>

            {/* Run Button */}
            <div className="flex items-center justify-between">
              <button
                onClick={handleRunTryCode}
                disabled={tryRunning}
                className="btn-game-purple py-2 px-5 text-xs font-black flex items-center gap-2"
              >
                <Play className="w-3.5 h-3.5 fill-current" />
                <span>{tryRunning ? 'Executing...' : 'Run Example'}</span>
              </button>
              <span className="text-[11px] font-bold text-gray-400">
                Safe Sandboxed Execution
              </span>
            </div>

            {/* Stdout Console */}
            {tryResult && (
              <div className="p-3 rounded-xl bg-[#090A0F] border-2 border-[#1E1E24] font-mono text-xs space-y-1">
                <div className="text-[10px] uppercase font-black tracking-wider text-gray-500">
                  Terminal Output (stdout):
                </div>
                {tryResult.stderr ? (
                  <div className="text-[#EF4444] font-bold">{tryResult.stderr}</div>
                ) : (
                  <pre className="text-[#10B981] whitespace-pre-wrap">{tryResult.stdout || '(No text output)'}</pre>
                )}
              </div>
            )}
          </div>

          {/* Section G: Practice Exercise & Evaluation */}
          {act && (
            <div className="bg-white rounded-2xl border-2 border-[#1E1E24] p-5 shadow-[4px_4px_0px_#1E1E24] space-y-4">
              <div className="flex items-center justify-between border-b border-[#1E1E24]/10 pb-3">
                <div>
                  <span className="text-[10px] font-black uppercase text-[#059669] bg-[#D1FAE5] px-2 py-0.5 rounded">
                    Practice Exercise #{act.sequenceNumber}
                  </span>
                  <h3 className="text-base font-black text-[#1E1E24] mt-1">
                    {act.learningObjective}
                  </h3>
                </div>
                <span className="text-xs font-black text-[#F59E0B] bg-[#FEF3C7] px-2.5 py-1 rounded-lg border border-[#F59E0B]">
                  +{act.xpReward} XP
                </span>
              </div>

              <div className="space-y-1 text-xs font-bold text-[#4A4A58]">
                <p className="text-[#1E1E24] font-black">{act.prompt}</p>
                <p>{act.instructions}</p>
              </div>

              {/* Targeted Revision Advice if user is struggling */}
              {revisionAdvice && (
                <div className="p-3 rounded-xl bg-[#FEF3C7] border border-[#F59E0B] text-xs font-bold text-[#B45309] flex items-start gap-2">
                  <AlertTriangle className="w-4 h-4 flex-shrink-0 mt-0.5" />
                  <span>{revisionAdvice}</span>
                </div>
              )}

              {/* Exercise Code Editor */}
              <div className="relative rounded-xl border-2 border-[#1E1E24] overflow-hidden bg-[#1E1E24]">
                <div className="flex items-center justify-between px-3 py-1.5 bg-[#121316] border-b border-gray-700 text-[11px] font-mono text-gray-400">
                  <span>exercise_solution.py</span>
                  <span>Type Code Here</span>
                </div>
                <textarea
                  value={exerciseCode}
                  onChange={(e) => setExerciseCode(e.target.value)}
                  rows={5}
                  className="w-full p-3 font-mono text-xs text-[#FAF6EE] bg-[#1E1E24] focus:outline-none resize-y leading-relaxed"
                  spellCheck={false}
                />
              </div>

              {/* Test Action Controls */}
              <div className="flex flex-wrap items-center justify-between gap-2">
                <button
                  onClick={handleCheckExercise}
                  disabled={exerciseRunning}
                  className="btn-game-purple py-2 px-6 text-xs font-black flex items-center gap-2"
                >
                  <CheckCircle2 className="w-4 h-4" />
                  <span>{exerciseRunning ? 'Evaluating...' : 'Check Solution'}</span>
                </button>

                {/* Progressive Hints Button */}
                <button
                  onClick={() => setHintTier((prev) => Math.min(4, prev + 1))}
                  className="flex items-center gap-1.5 text-xs font-black text-[#6C5CE7] hover:underline"
                >
                  <Lightbulb className="w-3.5 h-3.5" />
                  <span>
                    {hintTier === 0
                      ? 'Need a Hint?'
                      : hintTier < 4
                      ? `Hint (${hintTier}/4) • Next Hint`
                      : 'All Hints Revealed'}
                  </span>
                </button>
              </div>

              {/* Progressive Hints Display */}
              {hintTier > 0 && (
                <div className="p-3.5 rounded-xl bg-[#FAF6EE] border-2 border-[#1E1E24] space-y-2 text-xs font-bold text-[#4A4A58]">
                  <div className="font-black text-[#1E1E24] flex items-center gap-1 text-[11px] uppercase tracking-wider">
                    <HelpCircle className="w-3.5 h-3.5 text-[#6C5CE7]" />
                    <span>Progressive Guidance ({hintTier}/4):</span>
                  </div>
                  {act.hints.slice(0, hintTier).map((hint, idx) => (
                    <div key={idx} className="p-2 rounded bg-white border border-gray-200">
                      <span className="font-black text-[#6C5CE7]">Hint {idx + 1}: </span>
                      {hint}
                    </div>
                  ))}
                  {hintTier >= 3 && !showSolution && (
                    <button
                      onClick={() => setShowSolution(true)}
                      className="text-[11px] font-black text-gray-500 hover:text-red-600 underline"
                    >
                      Show Full Solution
                    </button>
                  )}
                  {showSolution && (
                    <div className="p-2.5 rounded bg-red-50 border border-red-200 text-xs font-mono text-red-900">
                      <div className="font-sans font-black text-[10px] uppercase text-red-600 mb-1">
                        Worked Reference Solution:
                      </div>
                      <code>{act.solution}</code>
                    </div>
                  )}
                </div>
              )}

              {/* Test Results Output */}
              {exerciseResult && (
                <div
                  className={`p-4 rounded-xl border-2 space-y-2 ${
                    exerciseResult.allPassed
                      ? 'bg-[#F0FDF4] border-[#10B981] text-[#065F46]'
                      : 'bg-[#FEF2F2] border-[#EF4444] text-[#991B1B]'
                  }`}
                >
                  <div className="flex items-center justify-between text-xs font-black">
                    <span className="flex items-center gap-1.5">
                      {exerciseResult.allPassed ? (
                        <>
                          <CheckCircle2 className="w-4 h-4 text-[#10B981]" />
                          <span>All Automated Tests Passed! (+{awardedXp || act.xpReward} XP)</span>
                        </>
                      ) : (
                        <>
                          <XCircle className="w-4 h-4 text-[#EF4444]" />
                          <span>Validation Failed • Tests Not Satisfied</span>
                        </>
                      )}
                    </span>
                  </div>

                  {exerciseResult.stdout && (
                    <div className="font-mono text-xs bg-black/80 text-white p-2 rounded">
                      Output: {exerciseResult.stdout}
                    </div>
                  )}

                  {/* Individual test assertions */}
                  <div className="space-y-1 text-xs font-bold pt-1">
                    {exerciseResult.testResults.map((t, i) => (
                      <div key={i} className="flex items-center gap-1.5">
                        {t.passed ? (
                          <CheckCircle2 className="w-3.5 h-3.5 text-[#10B981]" />
                        ) : (
                          <XCircle className="w-3.5 h-3.5 text-[#EF4444]" />
                        )}
                        <span>{t.description}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Next Step Navigation when passed */}
              {exercisePassed && (
                <div className="pt-4 border-t border-[#1E1E24]/10 space-y-3">
                  <div className="flex flex-wrap items-center justify-between gap-3">
                    <div className="text-xs font-bold text-[#10B981] flex items-center gap-1">
                      <Sparkles className="w-4 h-4" />
                      <span>Topic #{topic.sequenceNumber} Completed & Verified (+{awardedXp || 35} XP)</span>
                    </div>

                    <div className="flex items-center gap-2">
                      {topic.missionId && (
                        <Link
                          href={`/simulator?mission=${topic.missionId}`}
                          className="btn-game-yellow py-2 px-4 text-xs font-black flex items-center gap-1.5"
                        >
                          <Gamepad2 className="w-3.5 h-3.5" />
                          <span>Play Mission</span>
                        </Link>
                      )}

                      {nextTopic ? (
                        <Link
                          href={`/learn/${nextTopic.id}`}
                          className="btn-game-purple py-2 px-4 text-xs font-black flex items-center gap-1.5"
                        >
                          <span>Next: Lesson #{nextTopic.sequenceNumber}</span>
                          <ArrowRight className="w-3.5 h-3.5" />
                        </Link>
                      ) : (
                        <Link
                          href="/paths"
                          className="btn-game-purple py-2 px-4 text-xs font-black flex items-center gap-1.5"
                        >
                          <span>Return to Roadmap</span>
                          <ArrowRight className="w-3.5 h-3.5" />
                        </Link>
                      )}
                    </div>
                  </div>

                  {/* Guest Explorer Sync CTA */}
                  {!getActiveSession() && (
                    <div className="p-3 rounded-xl bg-[#FEF3C7] border-2 border-[#1E1E24] shadow-[2px_2px_0px_#1E1E24] flex flex-col sm:flex-row items-center justify-between gap-2.5">
                      <div className="text-xs font-bold text-[#1E1E24]">
                        <span>🕹️ Solved as Guest Explorer! </span>
                        <span className="text-[#4A4A58]">Create a free account to save your streak and sync your achievements to Supabase.</span>
                      </div>
                      <button
                        onClick={() => triggerSaveProgressModal('lesson_passed')}
                        className="btn-game-yellow text-xs py-1.5 px-3.5 font-black shrink-0 flex items-center gap-1 shadow-[2px_2px_0px_#1E1E24] cursor-pointer"
                      >
                        <Sparkles className="w-3.5 h-3.5 text-[#1E1E24]" />
                        <span>Save Progress</span>
                      </button>
                    </div>
                  )}
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
