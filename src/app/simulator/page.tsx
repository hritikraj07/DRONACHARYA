// Dronacharya Mission Simulator & Bug-to-Battle Arena
// Executes student Python code safely, displays responsive 2D grid feedback, and evaluates follow-up understanding
'use client';

import React, { useState, useEffect, Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { useDronacharya } from '@/lib/store';
import { executePythonChallenge, ExecutionResult } from '@/lib/simulator/python-runner';
import { XpCelebrationModal } from '@/components/gamification/XpCelebrationModal';
import { AcharyaDrawer } from '@/components/mentor/AcharyaDrawer';
import {
  Code2,
  Play,
  Sparkles,
  CheckCircle2,
  XCircle,
  Terminal,
  RefreshCw,
  FolderGit2,
  ArrowRight,
  HelpCircle,
  AlertTriangle,
  Zap,
  Gamepad2,
  ShieldCheck,
  Award,
  ChevronRight,
  RotateCcw,
} from 'lucide-react';
import confetti from 'canvas-confetti';

function SimulatorContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const missionParam = searchParams.get('mission');
  const { state, completeMission } = useDronacharya();

  // Active Path & Mission
  const activePath = state.learningPaths[0];
  const activeMissionId = missionParam || 'mission-rescue-robot';
  const currentMission =
    activePath?.missions.find((m) => m.id === activeMissionId) || activePath?.missions[0];

  // Code Editor State
  const [code, setCode] = useState(currentMission.initialCode);
  const [isRunning, setIsRunning] = useState(false);
  const [execResult, setExecResult] = useState<ExecutionResult | null>(null);
  const [hintsRevealed, setHintsRevealed] = useState(0);
  const [attemptsCount, setAttemptsCount] = useState(0);

  // 2D Visual Grid State
  const [gridRoverState, setGridRoverState] = useState<'idle' | 'running' | 'success' | 'failed'>('idle');
  const [robotEnergy, setRobotEnergy] = useState(0);

  // Follow-Up Understanding Check State (Section 8)
  const [showUnderstandingCheck, setShowUnderstandingCheck] = useState(false);
  const [followUpCode, setFollowUpCode] = useState(
    `# Follow-Up Challenge: Booster Protocol
# The rover has activated a booster cell!
# Multiply each positive battery cell by 2 before adding it to total_energy.

def boosted_rescue_robot(battery_cells: list) -> int:
    total_energy = 0
    # TODO: Loop and multiply each cell by 2
    
    return total_energy
`
  );
  const [followUpResult, setFollowUpResult] = useState<ExecutionResult | null>(null);
  const [followUpCompleted, setFollowUpCompleted] = useState(false);

  // Modals & Drawers
  const [isMentorOpen, setIsMentorOpen] = useState(false);
  const [isCelebrationOpen, setIsCelebrationOpen] = useState(false);
  const [awardedXp, setAwardedXp] = useState(0);
  const [awardedSeal, setAwardedSeal] = useState<any>(null);

  // Synchronize when mission changes
  useEffect(() => {
    setCode(currentMission.initialCode);
    setExecResult(null);
    setHintsRevealed(0);
    setGridRoverState('idle');
    setRobotEnergy(0);
    setShowUnderstandingCheck(false);
    setFollowUpCompleted(false);
    setFollowUpResult(null);
  }, [currentMission.id]);

  // Progressive Hints per Mission
  const progressiveHints =
    currentMission.id === 'mission-rescue-robot'
      ? [
          'Hint 1: Use a for-loop: "for cell in battery_cells:" to look at each number in the list.',
          'Hint 2: Inside the indented loop block, add the current cell to your total: "total_energy += cell".',
          'Hint 3: Ensure "return total_energy" is on the left margin outside the loop, so it returns after all cells are counted.',
        ]
      : [
          'Hint 1: Loop through each cell: "for cell in battery_cells:".',
          'Hint 2: Add an if condition: "if cell > 0:" before adding to total_energy.',
          'Hint 3: Only positive cells should be added; negative numbers are automatically skipped.',
        ];

  // Execute Code in Python Sandbox
  const handleRunCode = async () => {
    setIsRunning(true);
    setGridRoverState('running');
    setAttemptsCount((prev) => prev + 1);

    const allTests = [...currentMission.visibleTests, ...currentMission.hiddenTests];
    const result = await executePythonChallenge(code, allTests, currentMission.id);
    setExecResult(result);
    setIsRunning(false);

    if (result.allPassed) {
      setGridRoverState('success');
      setRobotEnergy(100);

      try {
        confetti({
          particleCount: 75,
          spread: 60,
          origin: { y: 0.6 },
        });
      } catch (e) {}

      const award = completeMission(currentMission.id, hintsRevealed);
      setAwardedXp(award.earnedXp);
      setAwardedSeal(award.awardedSeal);
      setShowUnderstandingCheck(true);
    } else {
      setGridRoverState('failed');
      setRobotEnergy(0);
    }
  };

  // Run Follow-Up Understanding Check
  const handleRunFollowUpCheck = async () => {
    setIsRunning(true);
    const followUpTests = [
      { id: 'f1', inputDescription: 'boosted_rescue_robot([10, 20])', expectedOutput: '60', codeSnippet: 'assert boosted_rescue_robot([10, 20]) == 60' },
      { id: 'f2', inputDescription: 'boosted_rescue_robot([5, 15, 25])', expectedOutput: '90', codeSnippet: 'assert boosted_rescue_robot([5, 15, 25]) == 90' },
    ];

    const result = await executePythonChallenge(followUpCode, followUpTests, 'mission-followup');
    setFollowUpResult(result);
    setIsRunning(false);

    if (result.allPassed) {
      setFollowUpCompleted(true);
      try {
        confetti({
          particleCount: 90,
          spread: 80,
          origin: { y: 0.5 },
        });
      } catch (e) {}
    }
  };

  const handleRevealNextHint = () => {
    if (hintsRevealed < progressiveHints.length) {
      setHintsRevealed((prev) => prev + 1);
    }
  };

  return (
    <div className="flex-1 flex flex-col max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 w-full">
      {/* Top Breadcrumb & Mission Navigation */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#D8CFC0] pb-4 mb-6">
        <div>
          <div className="flex items-center gap-2 text-xs font-semibold text-[#A65F43] uppercase tracking-wider">
            <Code2 className="w-4 h-4" />
            <span>Interactive Mission Arena</span>
            <span className="text-[#7E8276]">•</span>
            <span className="text-[#354B3A]">Attempts: {attemptsCount}</span>
          </div>
          <h1 className="font-serif font-bold text-2xl sm:text-3xl text-[#252820] mt-0.5">
            {currentMission.title}
          </h1>
          <p className="text-xs text-[#575A51] mt-0.5">
            {currentMission.subtitle} • Bug-to-Battle Real Code Execution
          </p>
        </div>

        {/* Mission Switcher Tabs */}
        <div className="flex items-center gap-2">
          {activePath.missions.map((m, idx) => {
            const isActive = m.id === currentMission.id;
            return (
              <Link
                key={m.id}
                href={`/simulator?mission=${m.id}`}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold border transition-all flex items-center gap-1.5 ${
                  isActive
                    ? 'bg-[#354B3A] text-white border-[#354B3A] shadow-xs'
                    : 'bg-white text-[#575A51] border-[#D8CFC0] hover:bg-[#FAF8F5]'
                }`}
              >
                <span>Mission {idx + 1}</span>
                {m.isCompleted && <CheckCircle2 className="w-3.5 h-3.5 text-[#B49A65]" />}
              </Link>
            );
          })}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* LEFT COLUMN: 2D GAME AREA + BUG-TO-BATTLE DIAGNOSTICS */}
        <div className="lg:col-span-5 space-y-5">
          {/* 1. VISIBLE 2D GRID GAME AREA */}
          <div className="bg-[#252820] text-[#F6F1E7] rounded-2xl p-4 border-2 border-[#3A3E34] shadow-xl">
            <div className="flex items-center justify-between border-b border-[#3A3E34] pb-2 mb-3">
              <div className="flex items-center gap-2">
                <Gamepad2 className="w-4 h-4 text-[#B49A65]" />
                <span className="font-serif font-bold text-xs uppercase tracking-wider text-[#E9DFC9]">
                  Live 2D Grid Game Arena
                </span>
              </div>
              <div className="flex items-center gap-1.5 text-[11px] text-[#A6AC9B]">
                <Zap className={`w-3.5 h-3.5 ${robotEnergy > 0 ? 'text-[#F6E05E]' : 'text-[#7E8276]'}`} />
                <span>Rover Power: {robotEnergy}%</span>
              </div>
            </div>

            {/* Visual 4x4 Grid Board */}
            <div className="bg-[#1A1C16] p-3 rounded-xl border border-[#2D3126] max-w-[280px] mx-auto">
              <div className="grid grid-cols-4 gap-1.5 aspect-square">
                {Array.from({ length: 16 }).map((_, i) => {
                  const x = i % 4;
                  const y = Math.floor(i / 4);
                  const isStart = x === 0 && y === 0;
                  const isBattery1 = x === 2 && y === 0;
                  const isBattery2 = x === 1 && y === 2;
                  const isBeacon = x === 3 && y === 3;

                  return (
                    <div
                      key={i}
                      className={`relative rounded-lg flex items-center justify-center transition-all duration-300 ${
                        isStart && gridRoverState !== 'success'
                          ? 'bg-[#354B3A] text-white ring-2 ring-[#B49A65]'
                          : isBeacon && gridRoverState === 'success'
                          ? 'bg-[#354B3A] text-white ring-2 ring-[#68D391] scale-105'
                          : isBeacon
                          ? 'bg-[#2B3D2F] border-2 border-dashed border-[#B49A65]'
                          : isBattery1 || isBattery2
                          ? 'bg-[#332E1D] border border-[#B49A65]/40'
                          : 'bg-[#23271E] border border-[#30362A]'
                      }`}
                    >
                      <span className="absolute top-0.5 left-1 text-[7px] text-[#7E8276]/60 font-mono">
                        {x},{y}
                      </span>
                      {isStart && gridRoverState !== 'success' && (
                        <span className="text-lg animate-bounce">🤖</span>
                      )}
                      {isBeacon && gridRoverState === 'success' && (
                        <span className="text-xl animate-bounce">🤖</span>
                      )}
                      {isBeacon && gridRoverState !== 'success' && (
                        <span className="text-base">🏁</span>
                      )}
                      {(isBattery1 || isBattery2) && gridRoverState !== 'success' && (
                        <span className="text-sm animate-pulse">⚡</span>
                      )}
                    </div>
                  );
                })}
              </div>

              {/* Status readout under grid */}
              <div className="mt-3 text-center text-xs font-mono">
                {gridRoverState === 'idle' && (
                  <span className="text-[#A6AC9B]">Rover awaiting Python loop execution...</span>
                )}
                {gridRoverState === 'running' && (
                  <span className="text-[#B49A65] flex items-center justify-center gap-1.5 animate-pulse">
                    <Sparkles className="w-3.5 h-3.5" />
                    <span>Evaluating your loop in sandbox...</span>
                  </span>
                )}
                {gridRoverState === 'success' && (
                  <span className="text-[#68D391] font-bold">
                    🌟 All battery energy added! Rover reached beacon!
                  </span>
                )}
                {gridRoverState === 'failed' && (
                  <span className="text-[#FC8181] font-bold">
                    ⚠️ Loop incomplete: Rover did not receive required energy.
                  </span>
                )}
              </div>
            </div>
          </div>

          {/* 2. BUG-TO-BATTLE DIAGNOSTIC PANEL (Activates on error) */}
          {execResult && !execResult.allPassed && (
            <div className="bg-[#FAF4F0] border-2 border-[#A65F43] rounded-2xl p-5 shadow-md animate-in fade-in">
              <div className="flex items-center gap-2 text-xs font-bold text-[#A65F43] uppercase tracking-wider mb-2">
                <AlertTriangle className="w-4 h-4" />
                <span>Bug-to-Battle: Observable Failure</span>
              </div>

              <p className="text-xs text-[#252820] leading-relaxed mb-3">
                {execResult.diagnosticExplanation}
              </p>

              {/* Suggested Socratic Hint */}
              {execResult.suggestedHint && (
                <div className="p-3 rounded-xl bg-white border border-[#A65F43]/40 text-xs text-[#7A6230] mb-3">
                  <div className="font-semibold text-[#A65F43] flex items-center gap-1.5 mb-1">
                    <Sparkles className="w-3.5 h-3.5" />
                    <span>Dronacharya Socratic Hint:</span>
                  </div>
                  <p className="italic">{execResult.suggestedHint}</p>
                </div>
              )}

              <div className="flex items-center justify-between pt-1">
                <button
                  onClick={handleRevealNextHint}
                  disabled={hintsRevealed >= progressiveHints.length}
                  className="text-xs font-semibold text-[#354B3A] underline disabled:opacity-50 cursor-pointer"
                >
                  {hintsRevealed < progressiveHints.length
                    ? `Unlock Step Hint (${hintsRevealed + 1}/${progressiveHints.length})`
                    : 'All hints unlocked'}
                </button>

                <button
                  onClick={() => {
                    // Refocus and clear result to retry
                    setGridRoverState('idle');
                  }}
                  className="px-3 py-1 rounded bg-[#A65F43] text-white text-xs font-semibold hover:bg-[#8B4E36] transition-colors"
                >
                  Retry Code ↻
                </button>
              </div>
            </div>
          )}

          {/* 3. STORY & PROGRESSIVE HINTS ACCORDION */}
          <div className="bg-white border border-[#D8CFC0] rounded-2xl p-5 shadow-xs space-y-3">
            <div>
              <div className="text-xs font-bold text-[#354B3A] uppercase tracking-wider mb-1">
                Mission Objective
              </div>
              <p className="text-xs text-[#252820] leading-relaxed">
                {currentMission.narrativeContext}
              </p>
            </div>

            <div className="pt-3 border-t border-[#D8CFC0]">
              <div className="flex items-center justify-between mb-2">
                <div className="text-xs font-bold text-[#252820] flex items-center gap-1.5">
                  <HelpCircle className="w-4 h-4 text-[#B49A65]" />
                  <span>Progressive Hints</span>
                </div>
                <span className="text-[11px] text-[#7E8276]">
                  {hintsRevealed} of {progressiveHints.length} revealed
                </span>
              </div>

              {hintsRevealed === 0 ? (
                <p className="text-xs text-[#575A51]">
                  Try coding the loop first. If you get stuck, progressive hints unlock step-by-step.
                </p>
              ) : (
                <div className="space-y-2">
                  {progressiveHints.slice(0, hintsRevealed).map((hint, idx) => (
                    <div
                      key={idx}
                      className="p-2.5 rounded-lg bg-[#FBF8F2] border border-[#B49A65] text-xs text-[#7A6230]"
                    >
                      {hint}
                    </div>
                  ))}
                </div>
              )}

              {hintsRevealed < progressiveHints.length && (
                <button
                  onClick={handleRevealNextHint}
                  className="mt-2.5 text-xs font-semibold text-[#354B3A] underline hover:text-[#2B3D2F] cursor-pointer"
                >
                  {hintsRevealed === 0 ? 'Reveal Hint 1' : `Reveal Hint ${hintsRevealed + 1}`}
                </button>
              )}
            </div>
          </div>
        </div>

        {/* RIGHT COLUMN: CODE EDITOR, RUNNER & UNDERSTANDING CHECK */}
        <div className="lg:col-span-7 flex flex-col gap-5">
          {/* Code Editor Box */}
          <div className="bg-white rounded-2xl overflow-hidden border-2 border-[#D8CFC0] shadow-md flex flex-col">
            {/* Editor Bar */}
            <div className="bg-[#252820] px-4 py-2.5 flex items-center justify-between text-xs text-[#F6F1E7]">
              <div className="flex items-center gap-2 font-mono text-[11px]">
                <span className="w-2.5 h-2.5 rounded-full bg-[#B49A65]" />
                <span>solution.py</span>
                <span className="text-[#A6AC9B]">• Python 3.11</span>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => setCode(currentMission.initialCode)}
                  className="p-1 text-[#A6AC9B] hover:text-white"
                  title="Reset to Starter Code"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>

            {/* Code Textarea */}
            <textarea
              value={code}
              onChange={(e) => setCode(e.target.value)}
              rows={11}
              className="w-full p-4 bg-[#1E201B] text-[#E9DFC9] font-mono text-xs leading-relaxed focus:outline-none resize-none"
              spellCheck={false}
            />

            {/* Run Action Bar */}
            <div className="bg-[#FAF8F5] px-4 py-3 border-t border-[#D8CFC0] flex items-center justify-between">
              <div className="text-[11px] text-[#7E8276] flex items-center gap-1.5">
                <ShieldCheck className="w-3.5 h-3.5 text-[#354B3A]" />
                <span>Runs securely in client WebAssembly sandbox</span>
              </div>
              <button
                onClick={handleRunCode}
                disabled={isRunning}
                className="btn-primary text-xs py-2.5 px-6 font-bold shadow-sm flex items-center gap-2"
              >
                <Play className={`w-3.5 h-3.5 ${isRunning ? 'animate-spin' : ''}`} />
                <span>{isRunning ? 'Executing...' : 'Run Mission Tests ▶'}</span>
              </button>
            </div>
          </div>

          {/* Test Results Console */}
          <div className="rounded-2xl bg-[#252820] text-[#F6F1E7] p-4 font-mono text-xs shadow-md border border-[#3A3E34]">
            <div className="flex items-center justify-between border-b border-[#3A3E34] pb-2 mb-2 text-[#A6AC9B] text-[11px]">
              <div className="flex items-center gap-1.5">
                <Terminal className="w-3.5 h-3.5 text-[#B49A65]" />
                <span>Test Suite Evaluation</span>
              </div>
              {execResult && (
                <span className="text-[#B49A65]">{execResult.executionTimeMs} ms</span>
              )}
            </div>

            {!execResult && !isRunning && (
              <div className="text-[#7E8276] italic py-2">
                Click &apos;Run Mission Tests ▶&apos; to execute your loop against the test harness.
              </div>
            )}

            {execResult && (
              <div className="space-y-2 pt-1 font-sans">
                {execResult.testResults.map((tr) => (
                  <div
                    key={tr.testId}
                    className={`p-2.5 rounded-lg border flex items-center justify-between text-xs ${
                      tr.passed
                        ? 'bg-[#354B3A]/25 border-[#354B3A] text-[#E2E8E3]'
                        : 'bg-[#A65F43]/25 border-[#A65F43] text-[#FAF4F0]'
                    }`}
                  >
                    <div className="flex items-center gap-2">
                      {tr.passed ? (
                        <CheckCircle2 className="w-4 h-4 text-[#68D391] shrink-0" />
                      ) : (
                        <XCircle className="w-4 h-4 text-[#FC8181] shrink-0" />
                      )}
                      <div>
                        <span className="font-mono text-xs">{tr.description}</span>
                        {!tr.passed && (
                          <div className="text-[11px] text-[#FC8181] mt-0.5 font-mono">
                            Expected: {tr.expected} | Your code returned: {tr.actual || 'None'}
                          </div>
                        )}
                      </div>
                    </div>
                    <span className="text-[10px] font-bold uppercase tracking-wider font-mono">
                      {tr.passed ? 'PASSED' : 'FAILED'}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* SECTION 8: FOLLOW-UP UNDERSTANDING CHECK */}
          {showUnderstandingCheck && (
            <div className="p-5 rounded-2xl bg-[#E2E8E3] border-2 border-[#354B3A] shadow-md animate-in zoom-in-95 space-y-3">
              <div className="flex items-center justify-between border-b border-[#354B3A]/30 pb-2">
                <div className="flex items-center gap-2">
                  <Award className="w-5 h-5 text-[#354B3A]" />
                  <h3 className="font-serif font-bold text-sm text-[#252820]">
                    Understanding Check: Booster Protocol
                  </h3>
                </div>
                <span className="text-[10px] bg-[#354B3A] text-white px-2 py-0.5 rounded font-bold">
                  Independent Challenge
                </span>
              </div>

              <p className="text-xs text-[#252820] leading-relaxed">
                Great job solving the first challenge! Now let&apos;s verify you can apply the loop concept independently.
                The rover&apos;s booster cell is online: <strong>multiply each cell by 2</strong> before adding it to <code>total_energy</code>.
              </p>

              <textarea
                value={followUpCode}
                onChange={(e) => setFollowUpCode(e.target.value)}
                rows={7}
                className="w-full p-3 bg-[#1E201B] text-[#E9DFC9] font-mono text-xs rounded-xl focus:outline-none resize-none leading-relaxed"
                spellCheck={false}
              />

              <div className="flex items-center justify-between pt-1">
                <span className="text-[11px] text-[#354B3A] font-semibold">
                  {followUpCompleted ? '✓ Understanding Check Mastered!' : 'Test your independent application'}
                </span>

                <button
                  onClick={handleRunFollowUpCheck}
                  disabled={isRunning || followUpCompleted}
                  className="btn-primary text-xs py-2 px-5 font-bold shadow-xs flex items-center gap-1.5"
                >
                  <Play className="w-3.5 h-3.5" />
                  <span>{followUpCompleted ? 'Completed ✓' : 'Run Booster Check'}</span>
                </button>
              </div>

              {followUpResult && (
                <div className="mt-2 text-xs">
                  {followUpResult.allPassed ? (
                    <div className="p-2.5 rounded bg-[#354B3A]/20 border border-[#354B3A] text-[#354B3A] font-semibold">
                      🎉 Splendid! You demonstrated true conceptual mastery of loops!
                    </div>
                  ) : (
                    <div className="p-2.5 rounded bg-[#A65F43]/20 border border-[#A65F43] text-[#A65F43]">
                      Not quite: verify that you multiplied each cell by 2 (e.g. <code>cell * 2</code>).
                    </div>
                  )}
                </div>
              )}
            </div>
          )}

          {/* Link to Practical Project */}
          <div className="p-4 rounded-xl bg-[#FAF8F5] border border-[#B49A65] flex items-center justify-between shadow-2xs">
            <div>
              <div className="text-[10px] text-[#A65F43] font-bold uppercase tracking-wider">
                Connect Concept to Practical Project
              </div>
              <div className="text-xs font-bold text-[#252820] mt-0.5">
                Robot Grid Navigator Project
              </div>
              <div className="text-[11px] text-[#575A51]">
                Apply loops to guide the robot across coordinates and manage battery power.
              </div>
            </div>
            <Link
              href="/projects"
              className="btn-brass text-xs py-1.5 px-3.5 shrink-0 flex items-center gap-1.5"
            >
              <span>Open Project</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>
      </div>

      {/* AI Socratic Mentor Drawer */}
      <AcharyaDrawer
        isOpen={isMentorOpen}
        onClose={() => setIsMentorOpen(false)}
        contextCode={code}
        contextError={execResult?.stderr}
        activeMissionTitle={currentMission.title}
      />

      {/* XP & Seal Celebration Modal */}
      <XpCelebrationModal
        isOpen={isCelebrationOpen}
        onClose={() => setIsCelebrationOpen(false)}
        earnedXp={awardedXp}
        awardedSeal={awardedSeal}
        onContinue={() => {
          setIsCelebrationOpen(false);
        }}
      />
    </div>
  );
}

export default function SimulatorPage() {
  return (
    <Suspense fallback={<div className="p-8 text-center text-xs text-[#7E8276]">Loading Mission Simulator...</div>}>
      <SimulatorContent />
    </Suspense>
  );
}
