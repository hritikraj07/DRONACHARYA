// Dronacharya Interactive Mission Workspace
// Focus: Turn theoretical loop knowledge into working Python code
'use client';

import React, { useState, Suspense } from 'react';
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
} from 'lucide-react';

function SimulatorContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const missionParam = searchParams.get('mission');
  const { state, completeMission } = useDronacharya();

  // Active Mission
  const activePath = state.learningPaths[0];
  const currentMission =
    activePath?.missions.find((m) => m.id === missionParam) || activePath?.missions[0];

  // Editor & Runner State
  const [code, setCode] = useState(currentMission.initialCode);
  const [isRunning, setIsRunning] = useState(false);
  const [execResult, setExecResult] = useState<ExecutionResult | null>(null);
  const [hintsRevealed, setHintsRevealed] = useState(0);

  // Mentor Drawer & Celebration Modals
  const [isMentorOpen, setIsMentorOpen] = useState(false);
  const [isCelebrationOpen, setIsCelebrationOpen] = useState(false);
  const [awardedXp, setAwardedXp] = useState(0);
  const [awardedSeal, setAwardedSeal] = useState<any>(null);

  // Synchronize starter code if mission changes
  const [prevMissionId, setPrevMissionId] = useState(currentMission.id);
  if (prevMissionId !== currentMission.id) {
    setPrevMissionId(currentMission.id);
    setCode(currentMission.initialCode);
    setExecResult(null);
    setHintsRevealed(0);
  }

  // Progressive Hints list
  const progressiveHints = [
    'Hint 1: Use a for loop to visit each battery cell: "for cell in battery_cells:"',
    'Hint 2: Inside the loop, add each cell to your running total: "total_energy += cell"',
    'Hint 3: Make sure you "return total_energy" after the loop finishes, outside the indented block.',
  ];

  // Execute Code in Pyodide WebAssembly Sandbox
  const handleRunCode = async () => {
    setIsRunning(true);
    setExecResult(null);

    const allTests = [...currentMission.visibleTests, ...currentMission.hiddenTests];
    const result = await executePythonChallenge(code, allTests);
    setExecResult(result);
    setIsRunning(false);

    if (result.allPassed) {
      const award = completeMission(currentMission.id, hintsRevealed);
      setAwardedXp(award.earnedXp);
      setAwardedSeal(award.awardedSeal);
      setIsCelebrationOpen(true);
    }
  };

  const handleRevealNextHint = () => {
    if (hintsRevealed < progressiveHints.length) {
      setHintsRevealed((prev) => prev + 1);
    }
  };

  return (
    <div className="flex-1 flex flex-col max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 w-full">
      {/* Header Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#D8CFC0] pb-4 mb-6">
        <div>
          <div className="flex items-center gap-2 text-xs font-semibold text-[#A65F43] uppercase tracking-wider">
            <Code2 className="w-4 h-4" />
            <span>Interactive Mission</span>
          </div>
          <h1 className="font-serif font-bold text-2xl text-[#252820] mt-0.5">
            {currentMission.title}
          </h1>
          <p className="text-xs text-[#575A51] mt-0.5">
            {currentMission.subtitle} • Interactive Python Challenge
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => setIsMentorOpen(true)}
            className="btn-brass text-xs py-1.5 px-3 shadow-xs"
          >
            <Sparkles className="w-3.5 h-3.5 text-[#B49A65]" />
            <span>Ask AI Mentor</span>
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left Column: Concept Explanation & Progressive Hints */}
        <div className="lg:col-span-5 space-y-4">
          {/* Concept Explanation Card */}
          <div className="bg-white border border-[#D8CFC0] rounded-xl p-5 shadow-xs">
            <div className="text-xs font-bold text-[#354B3A] uppercase tracking-wider mb-2">
              The Mission Story
            </div>
            <p className="text-xs text-[#252820] leading-relaxed">
              {currentMission.narrativeContext}
            </p>

            <div className="mt-4 pt-3 border-t border-[#D8CFC0]">
              <div className="text-xs font-bold text-[#A65F43] mb-1">
                Concept: How Loops Work
              </div>
              <p className="text-xs text-[#575A51] leading-relaxed">
                {currentMission.conceptBriefing}
              </p>
            </div>
          </div>

          {/* Progressive Hints Card */}
          <div className="bg-white border border-[#D8CFC0] rounded-xl p-5 shadow-xs">
            <div className="flex items-center justify-between mb-2">
              <div className="text-xs font-bold text-[#252820] flex items-center gap-1.5">
                <HelpCircle className="w-4 h-4 text-[#B49A65]" />
                <span>Progressive Hints</span>
              </div>
              <span className="text-[11px] text-[#7E8276]">
                {hintsRevealed} of {progressiveHints.length} used
              </span>
            </div>

            {hintsRevealed === 0 ? (
              <p className="text-xs text-[#575A51]">
                Need a nudge? You can unlock step-by-step hints if you get stuck.
              </p>
            ) : (
              <div className="space-y-2 mb-3">
                {progressiveHints.slice(0, hintsRevealed).map((hint, idx) => (
                  <div key={idx} className="p-2.5 rounded-lg bg-[#FBF8F2] border border-[#B49A65] text-xs text-[#7A6230]">
                    {hint}
                  </div>
                ))}
              </div>
            )}

            {hintsRevealed < progressiveHints.length && (
              <button
                onClick={handleRevealNextHint}
                className="mt-3 text-xs font-semibold text-[#354B3A] underline hover:text-[#2B3D2F] cursor-pointer"
              >
                {hintsRevealed === 0 ? 'Reveal Hint 1' : `Reveal Hint ${hintsRevealed + 1}`}
              </button>
            )}
          </div>

          {/* Connected Practical Project Teaser */}
          <div className="p-4 rounded-xl bg-[#E9DFC9]/60 border border-[#B49A65] flex items-center justify-between">
            <div>
              <div className="text-[10px] text-[#A65F43] font-bold uppercase tracking-wider">
                Next Practical Step
              </div>
              <div className="text-xs font-bold text-[#252820] mt-0.5">
                Robot Grid Navigator Project
              </div>
              <div className="text-[11px] text-[#575A51]">
                Apply loops to guide the robot across coordinates.
              </div>
            </div>
            <Link
              href="/projects"
              className="btn-brass text-xs py-1.5 px-3 shrink-0"
            >
              <span>View Project</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>

        {/* Right Column: Code Editor & Predefined Tests Runner */}
        <div className="lg:col-span-7 flex flex-col gap-4">
          <div className="bg-white rounded-xl overflow-hidden border border-[#D8CFC0] shadow-sm flex flex-col">
            {/* Editor Top Bar */}
            <div className="bg-[#252820] px-4 py-2.5 flex items-center justify-between text-xs text-[#F6F1E7]">
              <div className="flex items-center gap-2 font-mono text-[11px]">
                <span className="w-2.5 h-2.5 rounded-full bg-[#B49A65]"></span>
                <span>solution.py</span>
                <span className="text-[#A6AC9B]">• Python 3.11</span>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => setCode(currentMission.initialCode)}
                  className="p-1 text-[#A6AC9B] hover:text-white"
                  title="Reset Code"
                >
                  <RefreshCw className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>

            {/* Code Textarea */}
            <textarea
              value={code}
              onChange={(e) => setCode(e.target.value)}
              rows={10}
              className="w-full p-4 bg-[#1E201B] text-[#E9DFC9] font-mono text-xs leading-relaxed focus:outline-none resize-none"
              spellCheck={false}
            />

            {/* Execution Trigger Bar */}
            <div className="bg-[#FAF8F5] px-4 py-3 border-t border-[#D8CFC0] flex items-center justify-between">
              <div className="text-[11px] text-[#7E8276]">
                Runs safely inside your browser using WebAssembly
              </div>
              <button
                onClick={handleRunCode}
                disabled={isRunning}
                className="btn-primary text-xs py-2 px-5 shadow-sm"
              >
                <Play className={`w-3.5 h-3.5 fill-current ${isRunning ? 'animate-spin' : ''}`} />
                <span>{isRunning ? 'Running Tests...' : 'Run Mission Tests'}</span>
              </button>
            </div>
          </div>

          {/* Test Results & Output Console */}
          <div className="rounded-xl bg-[#252820] text-[#F6F1E7] p-4 font-mono text-xs shadow-md border border-[#D8CFC0]">
            <div className="flex items-center justify-between border-b border-[#3A3E34] pb-2 mb-2 text-[#A6AC9B] text-[11px]">
              <div className="flex items-center gap-1.5">
                <Terminal className="w-3.5 h-3.5" />
                <span>Test Evaluation Results</span>
              </div>
              {execResult && (
                <span className="text-[#B49A65]">{execResult.executionTimeMs} ms</span>
              )}
            </div>

            {!execResult && !isRunning && (
              <div className="text-[#7E8276] italic py-2">
                Click &apos;Run Mission Tests&apos; to evaluate your function against predefined test cases.
              </div>
            )}

            {isRunning && (
              <div className="text-[#B49A65] py-2 flex items-center gap-2">
                <Sparkles className="w-4 h-4 animate-spin" />
                <span>Testing your code with test cases...</span>
              </div>
            )}

            {execResult && (
              <div className="space-y-3 pt-1">
                {/* Standard error or syntax exception */}
                {execResult.stderr && (
                  <div className="p-2.5 rounded bg-[#A65F43]/20 border border-[#A65F43] text-[#FAF4F0]">
                    <div className="font-semibold text-[#A65F43] mb-1">Python Error:</div>
                    <pre className="whitespace-pre-wrap">{execResult.stderr}</pre>
                    <div className="mt-2 text-[11px] text-[#E9DFC9] font-sans">
                      Check your indentation and syntax. Make sure the function name is spelled correctly.
                    </div>
                  </div>
                )}

                {/* Predefined Test Cases Table */}
                <div className="space-y-1.5 font-sans">
                  {execResult.testResults.map((tr) => (
                    <div
                      key={tr.testId}
                      className={`p-2.5 rounded border flex items-center justify-between text-xs ${
                        tr.passed
                          ? 'bg-[#354B3A]/20 border-[#354B3A] text-[#E2E8E3]'
                          : 'bg-[#A65F43]/20 border-[#A65F43] text-[#FAF4F0]'
                      }`}
                    >
                      <div className="flex items-center gap-2">
                        {tr.passed ? (
                          <CheckCircle2 className="w-4 h-4 text-[#354B3A] shrink-0" />
                        ) : (
                          <XCircle className="w-4 h-4 text-[#A65F43] shrink-0" />
                        )}
                        <div>
                          <span className="font-mono">{tr.description}</span>
                          {!tr.passed && (
                            <div className="text-[11px] text-[#A65F43] mt-0.5">
                              Expected: <span className="font-mono">{tr.expected}</span> | Your output: <span className="font-mono">{tr.actual || 'None'}</span>
                            </div>
                          )}
                        </div>
                      </div>
                      <span className="text-[10px] font-bold uppercase tracking-wider">
                        {tr.passed ? 'PASSED' : 'FAILED'}
                      </span>
                    </div>
                  ))}
                </div>

                {/* Summary Advice */}
                {execResult.allPassed ? (
                  <div className="p-3 rounded-lg bg-[#354B3A]/30 border border-[#354B3A] text-[#E2E8E3] font-sans flex items-center justify-between">
                    <div>
                      <div className="font-bold text-sm">🎉 Success! All tests passed!</div>
                      <div className="text-xs text-[#A6AC9B] mt-0.5">
                        You mastered Python loops in Rescue the Robot.
                      </div>
                    </div>
                    <Link
                      href="/projects"
                      className="btn-brass text-xs py-1.5 px-3"
                    >
                      <span>Apply in Project →</span>
                    </Link>
                  </div>
                ) : (
                  <div className="p-3 rounded-lg bg-[#FAF4F0]/10 border border-[#D8CFC0]/30 text-xs font-sans text-[#E9DFC9]">
                    <strong>Why did it fail?</strong> Your code did not return the expected sum for all inputs. Review your loop: make sure you add each cell to <code>total_energy</code> and return it.
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* AI Mentor Drawer */}
      <AcharyaDrawer
        isOpen={isMentorOpen}
        onClose={() => setIsMentorOpen(false)}
        contextCode={code}
        contextError={execResult?.stderr}
        activeMissionTitle={currentMission.title}
      />

      {/* XP & Badge Celebration Modal */}
      <XpCelebrationModal
        isOpen={isCelebrationOpen}
        onClose={() => setIsCelebrationOpen(false)}
        earnedXp={awardedXp}
        awardedSeal={awardedSeal}
        onContinue={() => {
          setIsCelebrationOpen(false);
          router.push('/projects');
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
