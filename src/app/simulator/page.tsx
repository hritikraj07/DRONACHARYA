// Dronacharya Simulators Hub: Theory-to-Practice Workspace
'use client';

import React, { useState, Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
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
  Cpu,
  TrendingUp,
  RefreshCw,
} from 'lucide-react';

function SimulatorContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const missionParam = searchParams.get('mission');
  const { state, completeMission } = useDronacharya();

  // Active Tab: 'python' | 'ml' | 'business'
  const [activeTab, setActiveTab] = useState<'python' | 'ml' | 'business'>('python');

  // Active Mission
  const activePath = state.learningPaths[0];
  const currentMission =
    activePath?.missions.find((m) => m.id === missionParam) || activePath?.missions[0];

  // Simulator Editor State
  const [code, setCode] = useState(currentMission.initialCode);
  const [isRunning, setIsRunning] = useState(false);
  const [execResult, setExecResult] = useState<ExecutionResult | null>(null);
  const [hintsUsedCount, setHintsUsedCount] = useState(0);

  // Mentor Drawer & Celebration Modals
  const [isMentorOpen, setIsMentorOpen] = useState(false);
  const [isCelebrationOpen, setIsCelebrationOpen] = useState(false);
  const [awardedXp, setAwardedXp] = useState(0);
  const [awardedSeal, setAwardedSeal] = useState<any>(null);

  // Synchronize starter code if mission changes without cascading effect
  const [prevMissionId, setPrevMissionId] = useState(currentMission.id);
  if (prevMissionId !== currentMission.id) {
    setPrevMissionId(currentMission.id);
    setCode(currentMission.initialCode);
    setExecResult(null);
  }

  // Execute Code in WebAssembly Sandbox
  const handleRunCode = async () => {
    setIsRunning(true);
    setExecResult(null);

    const allTests = [...currentMission.visibleTests, ...currentMission.hiddenTests];
    const result = await executePythonChallenge(code, allTests);
    setExecResult(result);
    setIsRunning(false);

    if (result.allPassed) {
      const award = completeMission(currentMission.id, hintsUsedCount);
      setAwardedXp(award.earnedXp);
      setAwardedSeal(award.awardedSeal);
      setIsCelebrationOpen(true);
    }
  };

  // ML Simulator State
  const [learningRate, setLearningRate] = useState(0.01);
  const [epochs, setEpochs] = useState(50);
  const [regularization, setRegularization] = useState(0.001);
  const [lossResult, setLossResult] = useState({ trainLoss: 0.142, valLoss: 0.168, accuracy: 94.2 });

  const handleSimulateML = () => {
    // Deterministic ML parameter simulation
    const baseLoss = 0.5;
    const epochDecay = Math.exp(-epochs / 30);
    const lrFactor = learningRate > 0.05 ? 1.4 : learningRate < 0.001 ? 1.2 : 0.8;
    const trainLoss = Number((baseLoss * epochDecay * lrFactor).toFixed(3));
    const valLoss = Number((trainLoss + regularization * 10 + (learningRate > 0.05 ? 0.08 : 0.02)).toFixed(3));
    const accuracy = Number(Math.min(99.4, Math.max(62.0, (1 - valLoss) * 100)).toFixed(1));
    setLossResult({ trainLoss, valLoss, accuracy });
  };

  // Business Simulator State
  const [pricePoint, setPricePoint] = useState(499);
  const [marketingBudget, setMarketingBudget] = useState(25000);
  const [infraCost, setInfraCost] = useState(8000);
  const [bizOutcome, setBizOutcome] = useState({ customers: 125, revenue: 62375, netProfit: 29375, runwayMonths: 18 });

  const handleSimulateBiz = () => {
    const cac = 200;
    const customers = Math.round(marketingBudget / cac);
    const revenue = customers * pricePoint;
    const totalExpenses = marketingBudget + infraCost;
    const netProfit = revenue - totalExpenses;
    const runwayMonths = netProfit >= 0 ? 36 : Math.max(1, Math.round(150000 / Math.abs(netProfit)));
    setBizOutcome({ customers, revenue, netProfit, runwayMonths });
  };

  return (
    <div className="flex-1 flex flex-col max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 w-full">
      {/* Simulator Navigation Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#D8CFC0] pb-4 mb-6">
        <div>
          <div className="flex items-center gap-2 text-xs font-semibold text-[#A65F43] uppercase tracking-wider">
            <Code2 className="w-4 h-4" />
            <span>Theory-to-Practice Arena</span>
          </div>
          <h1 className="font-serif font-bold text-2xl text-[#252820] mt-0.5">
            {activeTab === 'python'
              ? currentMission.title
              : activeTab === 'ml'
              ? 'Machine Learning Parameter Studio'
              : 'Virtual Startup Unit Economics Simulator'}
          </h1>
        </div>

        {/* Simulator Category Selector */}
        <div className="flex items-center gap-1 bg-[#E9DFC9]/60 p-1 rounded-lg border border-[#D8CFC0] text-xs font-medium">
          <button
            onClick={() => setActiveTab('python')}
            className={`px-3 py-1.5 rounded transition-all flex items-center gap-1.5 ${
              activeTab === 'python' ? 'bg-[#354B3A] text-white shadow-xs' : 'text-[#575A51] hover:text-[#252820]'
            }`}
          >
            <Terminal className="w-3.5 h-3.5" />
            <span>Python Wasm</span>
          </button>
          <button
            onClick={() => setActiveTab('ml')}
            className={`px-3 py-1.5 rounded transition-all flex items-center gap-1.5 ${
              activeTab === 'ml' ? 'bg-[#354B3A] text-white shadow-xs' : 'text-[#575A51] hover:text-[#252820]'
            }`}
          >
            <Cpu className="w-3.5 h-3.5" />
            <span>AI/ML Studio</span>
          </button>
          <button
            onClick={() => setActiveTab('business')}
            className={`px-3 py-1.5 rounded transition-all flex items-center gap-1.5 ${
              activeTab === 'business' ? 'bg-[#354B3A] text-white shadow-xs' : 'text-[#575A51] hover:text-[#252820]'
            }`}
          >
            <TrendingUp className="w-3.5 h-3.5" />
            <span>Startup Sim</span>
          </button>
        </div>
      </div>

      {/* TAB 1: PYTHON WEBASSEMBLY SIMULATOR */}
      {activeTab === 'python' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 flex-1">
          {/* Left Panel: Narrative, Briefing & Unit Test Checklist */}
          <div className="lg:col-span-5 space-y-5">
            <div className="card-ivory">
              <span className="text-[11px] font-semibold text-[#354B3A] uppercase tracking-wider">
                Mission Objective
              </span>
              <h2 className="font-serif font-bold text-lg text-[#252820] mt-0.5">
                {currentMission.subtitle}
              </h2>
              <p className="text-xs text-[#575A51] mt-2 leading-relaxed">
                {currentMission.narrativeContext}
              </p>

              <div className="mt-4 p-3 rounded bg-[#FAF4F0] border border-[#A65F43]/30 text-xs text-[#252820]">
                <strong className="text-[#A65F43] block mb-1">Theoretical Insight:</strong>
                {currentMission.conceptBriefing}
              </div>
            </div>

            {/* Test Cases Checklist */}
            <div className="card-ivory">
              <h3 className="font-serif font-bold text-sm text-[#252820] mb-3">
                Unit Test Specifications
              </h3>
              <div className="space-y-2 text-xs">
                {currentMission.visibleTests.map((t) => (
                  <div
                    key={t.id}
                    className="p-2.5 rounded bg-[#FDFBF7] border border-[#D8CFC0] flex items-center justify-between font-mono"
                  >
                    <span>{t.inputDescription}</span>
                    <span className="text-[#354B3A] font-semibold">→ {t.expectedOutput}</span>
                  </div>
                ))}
                <div className="p-2.5 rounded bg-[#F0EAE1] border border-[#D8CFC0] text-[#7E8276] text-center italic text-[11px]">
                  + 2 Hidden Edge-Case Verification Tests
                </div>
              </div>
            </div>
          </div>

          {/* Right Panel: Code Editor & Terminal Sandbox */}
          <div className="lg:col-span-7 flex flex-col gap-4">
            <div className="card-ivory p-0 overflow-hidden flex flex-col border border-[#D8CFC0] shadow-sm">
              {/* Editor Header Bar */}
              <div className="bg-[#252820] px-4 py-2.5 flex items-center justify-between text-xs text-[#F6F1E7]">
                <div className="flex items-center gap-2 font-mono text-[11px]">
                  <span className="w-2.5 h-2.5 rounded-full bg-[#B49A65]"></span>
                  <span>solution.py</span>
                  <span className="text-[#A6AC9B]">• Python 3.11</span>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => {
                      setHintsUsedCount((prev) => prev + 1);
                      setIsMentorOpen(true);
                    }}
                    className="btn-brass text-[11px] py-1 px-2.5"
                  >
                    <Sparkles className="w-3 h-3 text-[#B49A65]" />
                    <span>Consult Acharya AI</span>
                  </button>
                  <button
                    onClick={() => setCode(currentMission.initialCode)}
                    className="p-1 text-[#A6AC9B] hover:text-white"
                    title="Reset Starter Code"
                  >
                    <RefreshCw className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>

              {/* Code Textarea / Monaco-equivalent lightweight editor */}
              <textarea
                value={code}
                onChange={(e) => setCode(e.target.value)}
                rows={12}
                className="w-full p-4 bg-[#1E201B] text-[#E9DFC9] font-mono text-xs leading-relaxed focus:outline-none resize-none"
                spellCheck={false}
              />

              {/* Action Run Bar */}
              <div className="bg-[#F6F1E7] px-4 py-3 border-t border-[#D8CFC0] flex items-center justify-between">
                <div className="text-[11px] text-[#7E8276]">
                  Runs in isolated client Web Worker • Zero server latency
                </div>
                <button
                  onClick={handleRunCode}
                  disabled={isRunning}
                  className="btn-primary text-xs py-2 px-5 shadow-sm"
                >
                  <Play className={`w-3.5 h-3.5 fill-current ${isRunning ? 'animate-spin' : ''}`} />
                  <span>{isRunning ? 'Executing Sandbox...' : 'Run Mission Tests'}</span>
                </button>
              </div>
            </div>

            {/* Terminal Console Output */}
            <div className="rounded-lg bg-[#252820] text-[#F6F1E7] p-4 font-mono text-xs shadow-md border border-[#D8CFC0]">
              <div className="flex items-center justify-between border-b border-[#3A3E34] pb-2 mb-2 text-[#A6AC9B] text-[11px]">
                <div className="flex items-center gap-1.5">
                  <Terminal className="w-3.5 h-3.5" />
                  <span>Terminal Console (stdout / stderr)</span>
                </div>
                {execResult && (
                  <span className="text-[#B49A65]">{execResult.executionTimeMs} ms</span>
                )}
              </div>

              {!execResult && !isRunning && (
                <div className="text-[#7E8276] italic py-2">
                  Click &apos;Run Mission Tests&apos; to execute in browser WebAssembly sandbox.
                </div>
              )}

              {isRunning && (
                <div className="text-[#B49A65] py-2 flex items-center gap-2">
                  <Sparkles className="w-4 h-4 animate-spin" />
                  <span>Executing assertions in WebAssembly sandbox...</span>
                </div>
              )}

              {execResult && (
                <div className="space-y-2">
                  {execResult.stderr && (
                    <div className="p-2.5 rounded bg-[#A65F43]/20 border border-[#A65F43] text-[#FAF4F0]">
                      <div className="font-semibold text-[#A65F43] mb-1">Execution Exception:</div>
                      <pre className="whitespace-pre-wrap">{execResult.stderr}</pre>
                      <button
                        onClick={() => {
                          setHintsUsedCount((prev) => prev + 1);
                          setIsMentorOpen(true);
                        }}
                        className="mt-2 text-[11px] text-[#FAF4F0] underline font-sans flex items-center gap-1 hover:text-[#B49A65]"
                      >
                        <Sparkles className="w-3 h-3 text-[#B49A65]" />
                        Ask Acharya AI why this error occurred
                      </button>
                    </div>
                  )}

                  {execResult.stdout && (
                    <pre className="text-[#E9DFC9] whitespace-pre-wrap">{execResult.stdout}</pre>
                  )}

                  {/* Test Cases Results Matrix */}
                  <div className="mt-3 pt-3 border-t border-[#3A3E34] space-y-1.5">
                    {execResult.testResults.map((tr) => (
                      <div
                        key={tr.testId}
                        className={`flex items-center justify-between text-[11px] p-1.5 rounded ${
                          tr.passed ? 'bg-[#354B3A]/20 text-[#354B3A]' : 'bg-[#A65F43]/20 text-[#FAF4F0]'
                        }`}
                      >
                        <span className="flex items-center gap-1.5">
                          {tr.passed ? (
                            <CheckCircle2 className="w-3.5 h-3.5 text-[#354B3A]" />
                          ) : (
                            <XCircle className="w-3.5 h-3.5 text-[#A65F43]" />
                          )}
                          <span>{tr.description}</span>
                        </span>
                        <span>{tr.passed ? 'PASSED' : `FAILED (Expected ${tr.expected})`}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: AI / ML PARAMETER STUDIO */}
      {activeTab === 'ml' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          <div className="lg:col-span-6 card-ivory space-y-6">
            <div>
              <h2 className="font-serif font-bold text-xl text-[#252820]">
                Hyperparameter Tuning Experiment
              </h2>
              <p className="text-xs text-[#575A51] mt-1">
                Adjust learning rate, training epochs, and L2 regularization to observe model convergence and loss curves.
              </p>
            </div>

            {/* Sliders */}
            <div className="space-y-4 text-xs">
              <div>
                <div className="flex justify-between font-medium mb-1">
                  <span>Learning Rate (α):</span>
                  <span className="font-mono text-[#354B3A]">{learningRate}</span>
                </div>
                <input
                  type="range"
                  min="0.001"
                  max="0.1"
                  step="0.005"
                  value={learningRate}
                  onChange={(e) => setLearningRate(parseFloat(e.target.value))}
                  className="w-full accent-[#354B3A]"
                />
              </div>

              <div>
                <div className="flex justify-between font-medium mb-1">
                  <span>Training Epochs:</span>
                  <span className="font-mono text-[#354B3A]">{epochs}</span>
                </div>
                <input
                  type="range"
                  min="10"
                  max="150"
                  step="10"
                  value={epochs}
                  onChange={(e) => setEpochs(parseInt(e.target.value, 10))}
                  className="w-full accent-[#354B3A]"
                />
              </div>

              <div>
                <div className="flex justify-between font-medium mb-1">
                  <span>L2 Regularization (λ):</span>
                  <span className="font-mono text-[#354B3A]">{regularization}</span>
                </div>
                <input
                  type="range"
                  min="0.0001"
                  max="0.01"
                  step="0.001"
                  value={regularization}
                  onChange={(e) => setRegularization(parseFloat(e.target.value))}
                  className="w-full accent-[#354B3A]"
                />
              </div>
            </div>

            <button
              onClick={handleSimulateML}
              className="btn-primary w-full text-xs py-2.5"
            >
              Run Training Simulation
            </button>
          </div>

          <div className="lg:col-span-6 card-parchment flex flex-col justify-between">
            <div>
              <h3 className="font-serif font-bold text-lg text-[#252820] mb-3">
                Simulation Convergence Metrics
              </h3>
              <div className="grid grid-cols-3 gap-3 text-center mb-6">
                <div className="p-3 rounded bg-white border border-[#D8CFC0]">
                  <div className="text-[10px] text-[#7E8276] uppercase">Train Loss</div>
                  <div className="font-serif font-bold text-lg text-[#354B3A] mt-1">{lossResult.trainLoss}</div>
                </div>
                <div className="p-3 rounded bg-white border border-[#D8CFC0]">
                  <div className="text-[10px] text-[#7E8276] uppercase">Validation Loss</div>
                  <div className="font-serif font-bold text-lg text-[#A65F43] mt-1">{lossResult.valLoss}</div>
                </div>
                <div className="p-3 rounded bg-white border border-[#D8CFC0]">
                  <div className="text-[10px] text-[#7E8276] uppercase">Accuracy</div>
                  <div className="font-serif font-bold text-lg text-[#B49A65] mt-1">{lossResult.accuracy}%</div>
                </div>
              </div>

              <div className="p-4 rounded bg-white border border-[#D8CFC0] text-xs leading-relaxed text-[#575A51]">
                <strong className="text-[#252820] block mb-1">Acharya ML Analysis:</strong>
                {learningRate > 0.05
                  ? 'Warning: Learning rate is overly aggressive. Notice how validation loss begins to diverge due to gradient oscillation.'
                  : epochs < 30
                  ? 'The model appears underfitted. Increasing epochs allows loss to converge smoothly.'
                  : 'Optimal convergence zone! Regularization prevents overfitting on the test boundary.'}
              </div>
            </div>

            <div className="text-[11px] text-[#7E8276] mt-4 pt-3 border-t border-[#D8CFC0]">
              Mathematical model computes loss convergence using deterministic gradient simulation.
            </div>
          </div>
        </div>
      )}

      {/* TAB 3: STARTUP & BUSINESS SIMULATOR */}
      {activeTab === 'business' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          <div className="lg:col-span-6 card-ivory space-y-6">
            <div>
              <h2 className="font-serif font-bold text-xl text-[#252820]">
                SaaS Startup Unit Economics Simulator
              </h2>
              <p className="text-xs text-[#575A51] mt-1">
                Make decisions on subscription pricing, customer acquisition marketing (CAC), and cloud infrastructure costs.
              </p>
            </div>

            <div className="space-y-4 text-xs">
              <div>
                <div className="flex justify-between font-medium mb-1">
                  <span>Monthly Subscription Price (₹):</span>
                  <span className="font-mono text-[#354B3A]">₹{pricePoint}</span>
                </div>
                <input
                  type="range"
                  min="199"
                  max="1999"
                  step="50"
                  value={pricePoint}
                  onChange={(e) => setPricePoint(parseInt(e.target.value, 10))}
                  className="w-full accent-[#354B3A]"
                />
              </div>

              <div>
                <div className="flex justify-between font-medium mb-1">
                  <span>Monthly Marketing Ad Spend (₹):</span>
                  <span className="font-mono text-[#354B3A]">₹{marketingBudget.toLocaleString()}</span>
                </div>
                <input
                  type="range"
                  min="5000"
                  max="100000"
                  step="5000"
                  value={marketingBudget}
                  onChange={(e) => setMarketingBudget(parseInt(e.target.value, 10))}
                  className="w-full accent-[#354B3A]"
                />
              </div>

              <div>
                <div className="flex justify-between font-medium mb-1">
                  <span>Cloud & Infrastructure Expenses (₹):</span>
                  <span className="font-mono text-[#354B3A]">₹{infraCost.toLocaleString()}</span>
                </div>
                <input
                  type="range"
                  min="2000"
                  max="50000"
                  step="2000"
                  value={infraCost}
                  onChange={(e) => setInfraCost(parseInt(e.target.value, 10))}
                  className="w-full accent-[#354B3A]"
                />
              </div>
            </div>

            <button
              onClick={handleSimulateBiz}
              className="btn-primary w-full text-xs py-2.5"
            >
              Simulate Unit Economics
            </button>
          </div>

          <div className="lg:col-span-6 card-parchment flex flex-col justify-between">
            <div>
              <h3 className="font-serif font-bold text-lg text-[#252820] mb-3">
                Financial Health & Cash Runway
              </h3>
              <div className="grid grid-cols-2 gap-3 mb-6">
                <div className="p-3 rounded bg-white border border-[#D8CFC0]">
                  <div className="text-[10px] text-[#7E8276] uppercase">Monthly Revenue</div>
                  <div className="font-serif font-bold text-xl text-[#354B3A] mt-1">₹{bizOutcome.revenue.toLocaleString()}</div>
                  <div className="text-[10px] text-[#575A51] mt-0.5">{bizOutcome.customers} active subscribers</div>
                </div>
                <div className="p-3 rounded bg-white border border-[#D8CFC0]">
                  <div className="text-[10px] text-[#7E8276] uppercase">Net Monthly Profit</div>
                  <div className={`font-serif font-bold text-xl mt-1 ${bizOutcome.netProfit >= 0 ? 'text-[#354B3A]' : 'text-[#A65F43]'}`}>
                    ₹{bizOutcome.netProfit.toLocaleString()}
                  </div>
                  <div className="text-[10px] text-[#575A51] mt-0.5">Runway: {bizOutcome.runwayMonths} months</div>
                </div>
              </div>

              <div className="p-4 rounded bg-white border border-[#D8CFC0] text-xs leading-relaxed text-[#575A51]">
                <strong className="text-[#252820] block mb-1">Acharya Business Verdict:</strong>
                {bizOutcome.netProfit > 0
                  ? 'Strong unit economics! Your customer lifetime value (LTV) comfortably exceeds acquisition costs (CAC).'
                  : 'Critical burn rate: marketing expenses outpace subscription cash generation. Consider optimizing conversion or raising prices.'}
              </div>
            </div>

            <div className="text-[11px] text-[#7E8276] mt-4 pt-3 border-t border-[#D8CFC0]">
              Simulation computes real startup LTV/CAC ratios and burn rate equations.
            </div>
          </div>
        </div>
      )}

      {/* Acharya AI Contextual Drawer */}
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
          // Unlock memoization mission
          const next = activePath.missions[1];
          if (next) {
            router.push(`/simulator?mission=${next.id}`);
          }
        }}
      />
    </div>
  );
}

export default function SimulatorPage() {
  return (
    <Suspense fallback={<div className="p-8 text-center text-xs text-[#7E8276]">Loading Dronacharya Simulator...</div>}>
      <SimulatorContent />
    </Suspense>
  );
}
