// Interactive Coding Lesson Laboratory
// Follows the CodeDex-inspired learning cycle:
// Story -> Concept -> Example -> Try It Yourself -> Run & Understand -> Practice Exercise -> Tests -> 4-Tier Hints -> Game Mission Link
'use client';

import React, { useState, useEffect, Suspense } from 'react';
import Link from 'next/link';
import { useParams, useRouter } from 'next/navigation';
import {
  findLessonById,
  Lesson,
  Chapter,
  Course,
} from '@/lib/data/course-system';
import {
  runPythonCode,
  validatePythonExercise,
  ExerciseValidationResult,
  PythonRunResult,
} from '@/lib/simulator/python-interpreter';
import { useDronacharya } from '@/lib/store';
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
  const rawLessonId = (params?.lessonId as string) || 'py-less-1-1';

  const lessonData = findLessonById(rawLessonId) || findLessonById('py-less-1-1');

  const { state } = useDronacharya();
  const [preferredDialect, setPreferredDialect] = useState<'english' | 'hinglish'>('english');

  // Interactive Try It Yourself Editor State
  const [tryCode, setTryCode] = useState<string>('');
  const [tryRunning, setTryRunning] = useState<boolean>(false);
  const [tryResult, setTryResult] = useState<PythonRunResult | null>(null);

  // Practice Exercise Editor State
  const [exerciseCode, setExerciseCode] = useState<string>('');
  const [exerciseRunning, setExerciseRunning] = useState<boolean>(false);
  const [exerciseResult, setExerciseResult] = useState<ExerciseValidationResult | null>(null);
  const [exercisePassed, setExercisePassed] = useState<boolean>(false);

  // Progressive Hint System (1 to 4)
  const [hintTier, setHintTier] = useState<number>(0);
  const [showSolution, setShowSolution] = useState<boolean>(false);

  // Set initial code on lesson load or lesson switch
  useEffect(() => {
    if (lessonData?.lesson) {
      setTryCode(lessonData.lesson.interactiveTryStarter);
      setExerciseCode(lessonData.lesson.exercise.initialCode);
      setTryResult(null);
      setExerciseResult(null);
      setExercisePassed(false);
      setHintTier(0);
      setShowSolution(false);
    }
  }, [rawLessonId]);

  if (!lessonData) {
    return (
      <div className="max-w-4xl mx-auto py-16 px-4 text-center">
        <h1 className="text-2xl font-black text-[#1E1E24]">Lesson Not Found</h1>
        <p className="text-sm text-[#4A4A58] mt-2 font-bold">
          The requested coding lesson could not be found.
        </p>
        <Link href="/courses" className="btn-game-purple mt-4 inline-flex py-2 px-4 text-xs font-black">
          ← Return to Courses
        </Link>
      </div>
    );
  }

  const { lesson, chapter, course, prevLesson, nextLesson } = lessonData;

  // Run the Try It Yourself code snippet
  const handleRunTryCode = () => {
    setTryRunning(true);
    setTimeout(() => {
      const res = runPythonCode(tryCode);
      setTryResult(res);
      setTryRunning(false);
    }, 150);
  };

  const handleResetTryCode = () => {
    setTryCode(lesson.interactiveTryStarter);
    setTryResult(null);
  };

  // Run and validate the student's practice exercise
  const handleCheckExercise = () => {
    setExerciseRunning(true);
    setTimeout(() => {
      const validation = validatePythonExercise(exerciseCode, lesson.exercise.testCases);
      setExerciseResult(validation);
      setExerciseRunning(false);

      if (validation.allPassed) {
        setExercisePassed(true);
        try {
          confetti({ particleCount: 60, spread: 70, origin: { y: 0.6 } });
        } catch (e) {}

        // Persist completed lesson in local storage
        if (typeof window !== 'undefined') {
          const completedKey = 'dronacharya_completed_lessons_v1';
          const saved: string[] = JSON.parse(localStorage.getItem(completedKey) || '[]');
          if (!saved.includes(lesson.id)) {
            saved.push(lesson.id);
            localStorage.setItem(completedKey, JSON.stringify(saved));
          }
        }
      }
    }, 200);
  };

  const handleResetExercise = () => {
    setExerciseCode(lesson.exercise.initialCode);
    setExerciseResult(null);
    setExercisePassed(false);
  };

  const handleRevealNextHint = () => {
    if (hintTier < 4) {
      setHintTier((prev) => prev + 1);
    } else {
      setShowSolution(true);
    }
  };

  return (
    <div className="w-full max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* 1. TOP BREADCRUMB & DIALECT TOGGLE */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b-2 border-[#1E1E24] pb-4 mb-8">
        <div className="flex items-center gap-2 text-xs font-bold text-[#4A4A58] flex-wrap">
          <Link href="/courses" className="hover:text-[#6C5CE7] flex items-center gap-1">
            <BookOpen className="w-3.5 h-3.5" />
            <span>Courses</span>
          </Link>
          <ChevronRight className="w-3.5 h-3.5 text-[#A0A0B0]" />
          <Link href={`/courses/${course.id}`} className="hover:text-[#6C5CE7]">
            {course.title.split(':')[0]}
          </Link>
          <ChevronRight className="w-3.5 h-3.5 text-[#A0A0B0]" />
          <span className="text-[#1E1E24] font-black">{chapter.title.split(':')[0]}</span>
        </div>

        {/* Language Dialect Switcher */}
        <div className="flex items-center gap-2 self-start sm:self-auto">
          <div className="flex items-center bg-white border-2 border-[#1E1E24] rounded-xl p-0.5 shadow-[2px_2px_0px_#1E1E24]">
            <button
              onClick={() => setPreferredDialect('english')}
              className={`px-3 py-1 text-xs font-black rounded-lg transition-all ${
                preferredDialect === 'english'
                  ? 'bg-[#6C5CE7] text-white shadow-[1px_1px_0px_#1E1E24]'
                  : 'text-[#4A4A58] hover:text-[#1E1E24]'
              }`}
            >
              English
            </button>
            <button
              onClick={() => setPreferredDialect('hinglish')}
              className={`px-3 py-1 text-xs font-black rounded-lg transition-all flex items-center gap-1 ${
                preferredDialect === 'hinglish'
                  ? 'bg-[#FBBF24] text-[#1E1E24] shadow-[1px_1px_0px_#1E1E24]'
                  : 'text-[#4A4A58] hover:text-[#1E1E24]'
              }`}
            >
              <span>Hinglish</span>
              <span className="text-[9px] bg-[#10B981] text-white px-1 rounded font-black">AI</span>
            </button>
          </div>

          <div className="bg-[#FAF6EE] border-2 border-[#1E1E24] rounded-xl px-2.5 py-1 text-xs font-black text-[#6C5CE7] shadow-[2px_2px_0px_#1E1E24] flex items-center gap-1">
            <Zap className="w-3.5 h-3.5 text-[#FBBF24]" />
            <span>+{lesson.xpReward} XP</span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* ========================================================
            LEFT COLUMN: STORY, CONCEPT, CODE EXAMPLE & UNDERSTAND
           ======================================================== */}
        <div className="lg:col-span-6 space-y-6">
          {/* Header */}
          <div>
            <div className="inline-flex items-center gap-1.5 px-3 py-0.5 rounded-full bg-[#FAF6EE] border-2 border-[#1E1E24] shadow-[2px_2px_0px_#1E1E24] text-xs font-black text-[#6C5CE7] mb-2">
              <span>{chapter.realmName}</span>
              <span>•</span>
              <span>Lesson {lesson.sequenceOrder}</span>
            </div>
            <h1 className="font-black text-2xl sm:text-3xl text-[#1E1E24]">
              {lesson.title}
            </h1>
            <p className="text-xs sm:text-sm text-[#4A4A58] font-bold mt-1">
              {lesson.subtitle}
            </p>
          </div>

          {/* SECTION A: STORY / NARRATIVE INTRODUCTION */}
          <div className="p-4 rounded-2xl bg-[#F8F3E8] border-2 border-[#1E1E24] shadow-[4px_4px_0px_#1E1E24] space-y-2">
            <div className="flex items-center gap-2 text-xs font-black text-[#6C5CE7] uppercase tracking-wider">
              <Sparkles className="w-4 h-4 text-[#FBBF24]" />
              <span>Adventure Context & Lore</span>
            </div>
            <p className="text-xs text-[#1E1E24] font-medium leading-relaxed">
              {preferredDialect === 'hinglish' && lesson.storyIntroHinglish
                ? lesson.storyIntroHinglish
                : lesson.storyIntro}
            </p>
          </div>

          {/* SECTION B: CONCEPT EXPLANATION */}
          <div className="card-game space-y-3">
            <h2 className="font-black text-base text-[#1E1E24] flex items-center gap-2">
              <BookOpen className="w-4 h-4 text-[#6C5CE7]" />
              <span>How It Works</span>
            </h2>
            <p className="text-xs sm:text-sm text-[#4A4A58] font-bold leading-relaxed">
              {preferredDialect === 'hinglish' && lesson.conceptExplanationHinglish
                ? lesson.conceptExplanationHinglish
                : lesson.conceptExplanation}
            </p>
          </div>

          {/* SECTION C: CODE EXAMPLE */}
          <div className="card-game p-0 overflow-hidden bg-white">
            <div className="bg-[#1E1E24] px-4 py-2.5 flex items-center justify-between text-xs text-white">
              <div className="flex items-center gap-2 font-mono font-bold">
                <Terminal className="w-3.5 h-3.5 text-[#10B981]" />
                <span>syntax_example.py</span>
              </div>
              <span className="text-[10px] text-[#A0A0B0] uppercase font-bold">Python 3</span>
            </div>

            <pre className="p-4 bg-[#141419] text-[#10B981] font-mono text-xs leading-relaxed overflow-x-auto">
              <code>{lesson.codeExample}</code>
            </pre>

            <div className="p-3 bg-[#FAF6EE] border-t-2 border-[#1E1E24] text-[11px] text-[#4A4A58] font-bold">
              <strong>Line Breakdown:</strong> {lesson.codeExampleExplanation}
            </div>
          </div>

          {/* SECTION D & E: TRY IT YOURSELF & RUN CODE */}
          <div className="rounded-2xl border-2 border-[#1E1E24] shadow-[4px_4px_0px_#1E1E24] overflow-hidden bg-white">
            <div className="bg-[#FAF6EE] px-4 py-2 border-b-2 border-[#1E1E24] flex items-center justify-between">
              <span className="font-black text-xs text-[#1E1E24] flex items-center gap-1.5">
                <Play className="w-3.5 h-3.5 text-[#6C5CE7] fill-current" />
                <span>Try It Yourself (Modify & Run)</span>
              </span>
              <button
                onClick={handleResetTryCode}
                className="text-[11px] text-[#7E7E8F] hover:text-[#1E1E24] flex items-center gap-1 font-bold cursor-pointer"
                title="Reset to starter"
              >
                <RotateCcw className="w-3 h-3" />
                <span>Reset</span>
              </button>
            </div>

            <textarea
              value={tryCode}
              onChange={(e) => setTryCode(e.target.value)}
              rows={4}
              className="w-full p-3.5 bg-[#141419] text-[#FAF6EE] font-mono text-xs leading-relaxed focus:outline-none resize-none"
              spellCheck={false}
            />

            <div className="bg-[#FAF6EE] p-3 border-t-2 border-[#1E1E24] flex items-center justify-between gap-3">
              <span className="text-[11px] text-[#4A4A58] font-bold truncate">
                {lesson.tryExplanation}
              </span>
              <button
                onClick={handleRunTryCode}
                disabled={tryRunning}
                className="btn-game-purple py-1.5 px-4 text-xs font-black shadow-[2px_2px_0px_#1E1E24] flex items-center gap-1.5 shrink-0"
              >
                <Play className="w-3 h-3 fill-current" />
                <span>{tryRunning ? 'Executing...' : 'Run Example'}</span>
              </button>
            </div>

            {/* Live Stdout Terminal Output */}
            {tryResult && (
              <div className="bg-[#141419] p-3 border-t-2 border-[#1E1E24] text-xs font-mono">
                <div className="text-[10px] text-[#A0A0B0] mb-1 font-bold flex items-center justify-between">
                  <span>Terminal Output:</span>
                  <span>{tryResult.executionTimeMs}ms</span>
                </div>
                {tryResult.stdout && (
                  <pre className="text-[#FAF6EE] whitespace-pre-wrap">{tryResult.stdout}</pre>
                )}
                {tryResult.stderr && (
                  <pre className="text-[#EF4444] whitespace-pre-wrap mt-1">{tryResult.stderr}</pre>
                )}
              </div>
            )}
          </div>
        </div>

        {/* ========================================================
            RIGHT COLUMN: PRACTICE EXERCISE, TESTS, HINTS & NEXT STEP
           ======================================================== */}
        <div className="lg:col-span-6 space-y-6">
          {/* SECTION G: PRACTICE EXERCISE */}
          <div className="card-game space-y-4">
            <div className="flex items-center justify-between border-b-2 border-[#1E1E24] pb-3">
              <div>
                <span className="text-[10px] font-black text-[#6C5CE7] uppercase tracking-wider">
                  Hands-On Mission Exercise
                </span>
                <h3 className="font-black text-base text-[#1E1E24] mt-0.5">
                  {lesson.exercise.title}
                </h3>
              </div>
              <span className="bg-[#FBBF24] text-[#1E1E24] px-2.5 py-0.5 rounded-lg border-2 border-[#1E1E24] font-black text-xs shadow-[2px_2px_0px_#1E1E24]">
                +{lesson.exercise.xpReward} XP
              </span>
            </div>

            <div className="p-3 rounded-xl bg-[#FAF6EE] border-2 border-[#1E1E24] text-xs font-bold text-[#1E1E24] space-y-1">
              <div className="font-black text-[#6C5CE7]">Instructions:</div>
              <p className="text-[#4A4A58]">{lesson.exercise.instructions}</p>
            </div>

            {/* Student Code Editor */}
            <div className="rounded-xl border-2 border-[#1E1E24] overflow-hidden">
              <div className="bg-[#1E1E24] px-3.5 py-1.5 flex items-center justify-between text-xs text-white">
                <span className="font-mono text-[11px] text-[#A0A0B0]">main.py</span>
                <button
                  onClick={handleResetExercise}
                  className="text-[10px] text-[#A0A0B0] hover:text-white flex items-center gap-1 font-bold"
                >
                  <RotateCcw className="w-3 h-3" />
                  <span>Reset Exercise</span>
                </button>
              </div>

              <textarea
                value={exerciseCode}
                onChange={(e) => setExerciseCode(e.target.value)}
                rows={7}
                className="w-full p-3.5 bg-[#141419] text-[#FAF6EE] font-mono text-xs leading-relaxed focus:outline-none resize-none"
                spellCheck={false}
              />
            </div>

            {/* Check Solution Action Bar */}
            <div className="flex items-center justify-between pt-1">
              <button
                type="button"
                onClick={handleRevealNextHint}
                className="text-xs font-black text-[#6C5CE7] hover:underline flex items-center gap-1 cursor-pointer"
              >
                <Lightbulb className="w-4 h-4 text-[#FBBF24]" />
                <span>
                  {hintTier === 0
                    ? 'Need a Hint?'
                    : hintTier < 4
                    ? `Next Hint (${hintTier}/4)`
                    : 'Show Solution'}
                </span>
              </button>

              <button
                onClick={handleCheckExercise}
                disabled={exerciseRunning}
                className="btn-game-yellow py-2 px-5 text-xs font-black shadow-[3px_3px_0px_#1E1E24] flex items-center gap-1.5"
              >
                <CheckCircle2 className="w-4 h-4 text-[#1E1E24]" />
                <span>{exerciseRunning ? 'Evaluating Tests...' : 'Check Solution & Run Tests'}</span>
              </button>
            </div>

            {/* Socratic Progressive Hints Card */}
            {hintTier > 0 && (
              <div className="p-3.5 rounded-xl bg-[#FEF3C7] border-2 border-[#1E1E24] shadow-[3px_3px_0px_#1E1E24] space-y-2 text-xs">
                <div className="flex items-center justify-between">
                  <span className="font-black text-[#D97706] flex items-center gap-1">
                    <Lightbulb className="w-4 h-4" />
                    <span>
                      {hintTier === 1
                        ? 'Hint 1: Concept Direction'
                        : hintTier === 2
                        ? 'Hint 2: Logic Guidance'
                        : hintTier === 3
                        ? 'Hint 3: Error Diagnostic'
                        : 'Hint 4: Code Template'}
                    </span>
                  </span>
                  <span className="text-[10px] text-[#7E7E8F] font-bold">Tier {hintTier} of 4</span>
                </div>

                <p className="text-[#1E1E24] font-bold leading-relaxed">
                  {lesson.exercise.hints[hintTier - 1]}
                </p>

                {showSolution && (
                  <div className="mt-2 pt-2 border-t-2 border-[#1E1E24]">
                    <span className="font-black text-[#1E1E24] text-[11px]">Exact Solution Reference:</span>
                    <pre className="p-2.5 bg-[#141419] text-[#10B981] font-mono text-[11px] rounded-lg mt-1 overflow-x-auto">
                      <code>{lesson.exercise.solutionCode}</code>
                    </pre>
                  </div>
                )}
              </div>
            )}

            {/* Validation & Test Results Breakdown */}
            {exerciseResult && (
              <div className="space-y-3 pt-2">
                <div
                  className={`p-3.5 rounded-xl border-2 border-[#1E1E24] shadow-[3px_3px_0px_#1E1E24] flex items-center justify-between ${
                    exerciseResult.allPassed ? 'bg-[#D1FAE5]' : 'bg-[#FEE2E2]'
                  }`}
                >
                  <div className="flex items-center gap-2">
                    {exerciseResult.allPassed ? (
                      <CheckCircle2 className="w-5 h-5 text-[#059669]" />
                    ) : (
                      <XCircle className="w-5 h-5 text-[#DC2626]" />
                    )}
                    <div>
                      <div className="font-black text-xs text-[#1E1E24]">
                        {exerciseResult.allPassed
                          ? 'All Test Cases Passed! Quest Objective Cleared.'
                          : 'Test Verification Failed. Review output diff below.'}
                      </div>
                      <div className="text-[11px] text-[#4A4A58] font-bold">
                        {exerciseResult.testResults.filter((t) => t.passed).length} of{' '}
                        {exerciseResult.testResults.length} test cases verified.
                      </div>
                    </div>
                  </div>

                  {exerciseResult.allPassed && (
                    <span className="text-xs font-black text-[#059669] bg-white px-2 py-0.5 rounded border border-[#1E1E24]">
                      +{lesson.exercise.xpReward} XP Awarded
                    </span>
                  )}
                </div>

                {/* Individual Test Suite Results */}
                <div className="space-y-2">
                  {exerciseResult.testResults.map((t, idx) => (
                    <div
                      key={idx}
                      className="p-2.5 rounded-xl bg-[#FAF6EE] border-2 border-[#1E1E24] text-xs font-bold space-y-1"
                    >
                      <div className="flex items-center justify-between">
                        <span className="text-[#1E1E24] font-black">{t.description}</span>
                        <span
                          className={`text-[10px] px-2 py-0.5 rounded font-black border ${
                            t.passed
                              ? 'bg-[#10B981] text-white border-[#1E1E24]'
                              : 'bg-[#EF4444] text-white border-[#1E1E24]'
                          }`}
                        >
                          {t.passed ? 'PASSED' : 'FAILED'}
                        </span>
                      </div>
                      <div className="grid grid-cols-2 gap-2 text-[11px] pt-1 font-mono">
                        <div>
                          <span className="text-[#7E7E8F]">Expected: </span>
                          <span className="text-[#1E1E24]">{t.expected}</span>
                        </div>
                        <div>
                          <span className="text-[#7E7E8F]">Actual: </span>
                          <span className={t.passed ? 'text-[#059669]' : 'text-[#DC2626]'}>
                            {t.actual}
                          </span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Bug-to-Battle Guidance */}
                {exerciseResult.diagnosticHint && (
                  <div className="p-3 rounded-xl bg-[#FAF6EE] border-2 border-[#1E1E24] text-xs font-bold text-[#1E1E24]">
                    <strong className="text-[#6C5CE7]">Diagnostic Advice: </strong>
                    <span className="text-[#4A4A58]">{exerciseResult.diagnosticHint}</span>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* SECTION H: NEXT STEP / GAME MISSION CONNECTION */}
          {exercisePassed && (
            <div className="card-game bg-[#FEF3C7] border-2 border-[#1E1E24] p-5 space-y-4 animate-in fade-in zoom-in-95 duration-200">
              <div className="flex items-center gap-2 font-black text-sm text-[#1E1E24]">
                <Award className="w-5 h-5 text-[#F59E0B]" />
                <span>Lesson Mastered! Choose Your Next Move:</span>
              </div>

              {/* If connected to game mission (like Rescue the Robot) */}
              {chapter.connectedGameMissionId && (
                <div className="p-3.5 rounded-xl bg-white border-2 border-[#1E1E24] shadow-[3px_3px_0px_#1E1E24] flex items-center justify-between gap-3">
                  <div>
                    <div className="font-black text-xs text-[#1E1E24] flex items-center gap-1.5">
                      <Gamepad2 className="w-4 h-4 text-[#6C5CE7]" />
                      <span>Playable 2D Mission Ready</span>
                    </div>
                    <p className="text-[11px] text-[#4A4A58] font-bold mt-0.5">
                      Apply what you learned to drive the real rover across the grid maze!
                    </p>
                  </div>
                  <Link
                    href={`/simulator?mission=${chapter.connectedGameMissionId}`}
                    className="btn-game-purple py-2 px-4 text-xs font-black shadow-[2px_2px_0px_#1E1E24] shrink-0"
                  >
                    Launch Game Mission →
                  </Link>
                </div>
              )}

              {/* Navigation Actions */}
              <div className="flex items-center justify-between gap-3 pt-1">
                {prevLesson ? (
                  <Link
                    href={`/learn/${prevLesson.id}`}
                    className="btn-game-white py-2 px-4 text-xs font-black shadow-[2px_2px_0px_#1E1E24] flex items-center gap-1"
                  >
                    <ArrowLeft className="w-3.5 h-3.5" />
                    <span>Previous</span>
                  </Link>
                ) : (
                  <div />
                )}

                {nextLesson ? (
                  <Link
                    href={`/learn/${nextLesson.id}`}
                    className="btn-game-yellow py-2.5 px-6 text-xs font-black shadow-[4px_4px_0px_#1E1E24] flex items-center gap-1.5"
                  >
                    <span>Next Lesson: {nextLesson.title}</span>
                    <ArrowRight className="w-4 h-4" />
                  </Link>
                ) : (
                  <Link
                    href={`/courses/${course.id}`}
                    className="btn-game-yellow py-2.5 px-6 text-xs font-black shadow-[4px_4px_0px_#1E1E24] flex items-center gap-1.5"
                  >
                    <span>⚔️ Chapter Boss Challenge</span>
                    <ArrowRight className="w-4 h-4" />
                  </Link>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
