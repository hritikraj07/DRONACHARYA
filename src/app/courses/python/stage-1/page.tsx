// Dronacharya | Stage 1: Code Quest — The First Command
// A gamified 2D pixel-art Python adventure combining 4 core learning mechanics:
// 1. Learn by Doing (Write code)
// 2. Reverse Teaching (Reconstruct code from desired output)
// 3. Error Finding (Debug syntax & logic errors)
// 4. Output Prediction (Think & predict output before running)
'use client';

import React, { useState, useEffect, useRef, Suspense } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import {
  Play,
  RotateCcw,
  Lightbulb,
  CheckCircle2,
  XCircle,
  AlertTriangle,
  ArrowRight,
  ArrowLeft,
  Lock,
  Unlock,
  Sparkles,
  Terminal,
  Volume2,
  VolumeX,
  Award,
  ChevronRight,
  ChevronLeft,
  Code2,
  Check,
  Compass,
  X,
  Target,
  BookOpen,
  Send,
  Zap,
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { runPythonCode } from '@/lib/simulator/python-interpreter';
import { initPyodide, isPyodideLoaded } from '@/lib/simulator/dungeon-python-bridge';
import { DungeonSound } from '@/lib/simulator/audio-synth';
import { recordGameProgress, getActiveSession, RegisteredUser } from '@/lib/db/auth-db';

export default function Stage1Page() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-[#1E1E24] flex flex-col items-center justify-center p-4 text-[#FAF6EE]">
          <div className="w-12 h-12 border-4 border-[#FFD214] border-t-transparent rounded-full animate-spin mb-4" />
          <p className="font-pixel text-xs text-[#FFD214] tracking-widest">
            ENTERING ANCIENT CODE REALM...
          </p>
        </div>
      }
    >
      <Stage1AdventureContent />
    </Suspense>
  );
}

// =============================================================================
// MISSION SPECIFICATION FOR STAGE 1 (6 Missions covering the 4 mechanics)
// =============================================================================
export interface Stage1Mission {
  id: number;
  missionKey: string;
  title: string;
  subtitle: string;
  mechanic:
    | 'learn_by_doing'
    | 'reverse_teaching'
    | 'error_finding'
    | 'output_prediction'
    | 'synthesis_boss';
  mechanicBadge: string;
  mentorDialogue: string;
  objective: string;
  starterCode: string;
  targetOutput?: string;
  predictionQuestion?: string;
  predictionOptions?: { id: string; text: string; isCorrect: boolean }[];
  predictionExplanation?: string;
  hints: string[];
  successMessage: string;
  explanation: string;
  xpReward: number;
}

const STAGE_1_MISSIONS: Stage1Mission[] = [
  // MISSION 1: LEARN BY DOING
  {
    id: 1,
    missionKey: 'stage1-mission-1-first-contact',
    title: 'Mission 1 — First Contact',
    subtitle: 'Awaken the Ancient Gate',
    mechanic: 'learn_by_doing',
    mechanicBadge: 'Learn by Doing',
    mentorDialogue:
      'Welcome, young coder! This ancient gate understands Python. Give it a message to make it respond.',
    objective:
      'Use the print() function to send the message "Open the gate!" to the ancient gatekeeper.',
    starterCode: 'print("Open the gate!")',
    targetOutput: 'Open the gate!',
    hints: [
      'Think about which Python function displays a message: in Python, we use print().',
      'Text inside Python must be wrapped in quotation marks: "your message here".',
      'Click the RUN CODE button to execute the command and see how the gate reacts!',
    ],
    successMessage:
      'The ancient runes hum with azure light! The gate recognizes your Python invocation.',
    explanation:
      'The print() function is Python’s primary way of displaying information to the screen or console. The text wrapped inside quotation marks is called a string literal.',
    xpReward: 50,
  },

  // MISSION 2: REVERSE TEACHING #1
  {
    id: 2,
    missionKey: 'stage1-mission-2-restore-message',
    title: 'Mission 2 — Restore the Message',
    subtitle: 'Rebuild from Desired Output',
    mechanic: 'reverse_teaching',
    mechanicBadge: 'Reverse Teaching',
    mentorDialogue:
      'The gate has forgotten its command, but it remembers the message it needs. Rebuild the Python instruction that produces this exact output.',
    objective:
      'Look at the required TARGET OUTPUT in the amber panel below. Write the Python code that recreates this exact output.',
    starterCode: '# Rebuild the Python command to produce the target output\n',
    targetOutput: 'Welcome, Coder!',
    hints: [
      'Start with the output you need. What instruction could produce it?',
      'Use the print() function and pass the exact string "Welcome, Coder!" inside parentheses.',
      'Write: print("Welcome, Coder!") exactly, maintaining spelling and capital letters.',
    ],
    successMessage:
      'Brilliant reverse-engineering! The gate echoes your greeting back into the temple.',
    explanation:
      'Reverse teaching trains you to work backward from a desired result to the code that creates it. Software engineers use this exact mental model when building software to specifications.',
    xpReward: 50,
  },

  // MISSION 3: ERROR FINDING (SYNTAX ERROR)
  {
    id: 3,
    missionKey: 'stage1-mission-3-repair-ancient-script',
    title: 'Mission 3 — Repair the Ancient Script',
    subtitle: 'The Missing Bracket',
    mechanic: 'error_finding',
    mechanicBadge: 'Error Finding',
    mentorDialogue:
      'The gate’s command is damaged. Find the mistake and repair the code.',
    objective:
      'The starter code is missing something essential. Inspect the syntax error, repair the code, and run it to produce "Open the gate!".',
    starterCode: 'print("Open the gate!"',
    targetOutput: 'Open the gate!',
    hints: [
      'The code may look almost correct. Check its syntax, then compare its output with the target.',
      'Notice that the opening parenthesis "(" was never closed. Every opening bracket in Python needs a matching closing bracket ")".',
      'Add a closing parenthesis ")" at the end of the line: print("Open the gate!")',
    ],
    successMessage:
      'Syntax restored! The circuit is complete and the gate’s primary seal turns green.',
    explanation:
      'When you forget a closing parenthesis, Python raises a SyntaxError: \'(\' was never closed. Python cannot execute code until all parentheses and brackets are properly balanced.',
    xpReward: 50,
  },

  // MISSION 4: ERROR FINDING (LOGIC BUG) & DUAL CHANT
  {
    id: 4,
    missionKey: 'stage1-mission-4-wrong-command',
    title: 'Mission 4 — The Wrong Command',
    subtitle: 'Logic Debugging & Dual Sequence',
    mechanic: 'error_finding',
    mechanicBadge: 'Logic Debugging',
    mentorDialogue:
      'The command runs, but the gate still refuses to open. The message is wrong! Restore the gate’s lost instructions to display both lines in the correct order.',
    objective:
      'Fix the logic: replace the wrong message and print both required lines in the exact sequential order.',
    starterCode: 'print("Close the gate!")',
    targetOutput: 'Ancient Code Realm\nGate Unlocked!',
    hints: [
      'Syntactically valid code can still produce the wrong output! You need two separate print() commands.',
      'First line should print "Ancient Code Realm". Second line should print "Gate Unlocked!".',
      'Write two print statements on two lines:\nprint("Ancient Code Realm")\nprint("Gate Unlocked!")',
    ],
    successMessage:
      'Both lines recited in perfect order! The gate mechanism unlocks its secondary tumblers.',
    explanation:
      'Programs can run without crashing and still be incorrect. A "logic bug" happens when code executes cleanly but does not accomplish what you intended. Multiple statements execute sequentially from top to bottom.',
    xpReward: 50,
  },

  // MISSION 5: PREDICT THE OUTPUT
  {
    id: 5,
    missionKey: 'stage1-mission-5-predict-signal',
    title: 'Mission 5 — Predict the Signal',
    subtitle: 'Think Before Running',
    mechanic: 'output_prediction',
    mechanicBadge: 'Output Prediction',
    mentorDialogue:
      'A true coder reads and predicts code before hitting execute. Study the snippet and predict its exact terminal output.',
    objective:
      'Predict how Python handles multiple print statements before executing the program.',
    starterCode: 'print("Hello")\nprint("Python")',
    targetOutput: 'Hello\nPython',
    predictionQuestion:
      'When this program runs, how will the two words appear in the terminal output?',
    predictionOptions: [
      {
        id: 'opt-two-lines',
        text: 'Hello\nPython (On two separate lines)',
        isCorrect: true,
      },
      {
        id: 'opt-single-line-space',
        text: 'Hello Python (On one single line with a space)',
        isCorrect: false,
      },
      {
        id: 'opt-single-line-nospace',
        text: 'HelloPython (Glued together without spaces)',
        isCorrect: false,
      },
      {
        id: 'opt-quotes-printed',
        text: '"Hello" "Python" (With quotation marks visible)',
        isCorrect: false,
      },
    ],
    predictionExplanation:
      'In Python, every print() call automatically appends an invisible newline character (\\n) by default, moving the terminal cursor to the next line for any subsequent print statements.',
    hints: [
      'Consider what happens at the end of each print() statement.',
      'Does print() stay on the same line or advance to a new row?',
      'In Python, each print() call ends with an automatic newline, so the second word begins on the next row.',
    ],
    successMessage:
      'Spot on prediction! You read code like an ancient compiler.',
    explanation:
      'In Python, print() automatically appends a newline (\\n) at the end of each statement. Quotation marks tell Python that the text is a string, but the quotes themselves are never printed in the output.',
    xpReward: 50,
  },

  // MISSION 6: THE FINAL GATE (SYNTHESIS BOSS CHALLENGE)
  {
    id: 6,
    missionKey: 'stage1-mission-6-final-gate',
    title: 'Mission 6 — The Final Gate',
    subtitle: 'The Synthesis Boss Challenge',
    mechanic: 'synthesis_boss',
    mechanicBadge: 'Boss Challenge',
    mentorDialogue:
      'The guardian seal is heavily corrupted! Multiple syntax errors and missing quotes are blocking the gatekeeper sequence. Repair all errors to unlock the gate once and for all!',
    objective:
      'Repair all syntax errors across the 3 damaged lines to output the exact 3-line activation sequence.',
    starterCode:
      'print("=== CODE REALM ==="\nprint("Seeker: Ready")\nprint(Gate: OPEN)',
    targetOutput:
      '=== CODE REALM ===\nSeeker: Ready\nGate: OPEN',
    hints: [
      'Inspect each line carefully. Look for missing parentheses and missing quotation marks.',
      'Line 1 is missing a closing ")". Line 3 has raw words without quotes.',
      'Line 1 should be: print("=== CODE REALM ===")\nLine 3 should be: print("Gate: OPEN")',
    ],
    successMessage:
      'THE ANCIENT GATE SLIDES OPEN! All seals dissolved in blinding light!',
    explanation:
      'Congratulations! You have mastered the foundational mechanics of Python: writing commands, reverse-engineering code from desired output, locating and repairing syntax errors, fixing logic bugs, and predicting program flow.',
    xpReward: 100,
  },
];

function Stage1AdventureContent() {
  const router = useRouter();

  // Active mission state
  const [currentMissionIndex, setCurrentMissionIndex] = useState<number>(0);
  const activeMission = STAGE_1_MISSIONS[currentMissionIndex];

  // User and progress state
  const [currentUser, setCurrentUser] = useState<RegisteredUser | null>(null);
  const [completedMissions, setCompletedMissions] = useState<string[]>([]);
  const [stage1Completed, setStage1Completed] = useState<boolean>(false);

  // Coding environment state
  const [code, setCode] = useState<string>(activeMission.starterCode);
  const [stdout, setStdout] = useState<string>('');
  const [stderr, setStderr] = useState<string>('');
  const [isRunning, setIsRunning] = useState<boolean>(false);
  const [lastRunPassed, setLastRunPassed] = useState<boolean | null>(null);

  // Prediction mechanic state (for Mission 5)
  const [selectedPrediction, setSelectedPrediction] = useState<string | null>(null);
  const [predictionSubmitted, setPredictionSubmitted] = useState<boolean>(false);
  const [predictionCorrect, setPredictionCorrect] = useState<boolean | null>(null);

  // Progressive Hints state
  const [hintLevel, setHintLevel] = useState<number>(0);
  const [showHintBox, setShowHintBox] = useState<boolean>(false);

  // Visual game world states
  const [gateOpen, setGateOpen] = useState<boolean>(false);
  const [isCastingMagic, setIsCastingMagic] = useState<boolean>(false);
  const [playerSpeech, setPlayerSpeech] = useState<string | null>(null);
  const [runesLit, setRunesLit] = useState<boolean>(false);
  const [isMuted, setIsMuted] = useState<boolean>(false);

  // Completion modal state
  const [showVictoryModal, setShowVictoryModal] = useState<boolean>(false);
  const [earnedXpTotal, setEarnedXpTotal] = useState<number>(0);

  // Code editor textarea reference
  const editorRef = useRef<HTMLTextAreaElement>(null);

  // 1. Initialize user, audio, and load Pyodide on mount
  useEffect(() => {
    setIsMuted(DungeonSound.isMuted());

    // Preload Pyodide runtime in background
    initPyodide().catch(() => {});

    // Sync session and progress
    const syncUser = () => {
      const session = getActiveSession();
      setCurrentUser(session);

      try {
        const savedMissions = localStorage.getItem('dronacharya_stage1_missions');
        if (savedMissions) {
          const parsed = JSON.parse(savedMissions);
          setCompletedMissions(parsed);
          if (parsed.includes('stage1-mission-6-final-gate')) {
            setStage1Completed(true);
            setGateOpen(true);
            setRunesLit(true);
          }
        }
      } catch {}
    };

    syncUser();
    window.addEventListener('dronacharya_session_change', syncUser);
    window.addEventListener('storage', syncUser);

    return () => {
      window.removeEventListener('dronacharya_session_change', syncUser);
      window.removeEventListener('storage', syncUser);
    };
  }, []);

  // 2. When active mission changes, update starter code & reset states
  useEffect(() => {
    setCode(activeMission.starterCode);
    setStdout('');
    setStderr('');
    setLastRunPassed(null);
    setHintLevel(0);
    setShowHintBox(false);
    setSelectedPrediction(null);
    setPredictionSubmitted(false);
    setPredictionCorrect(null);
    setPlayerSpeech(null);

    // If this mission is already completed, show passed state
    if (completedMissions.includes(activeMission.missionKey)) {
      setLastRunPassed(true);
    }
  }, [currentMissionIndex, activeMission]);

  // Handle Tab key in editor
  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Tab') {
      e.preventDefault();
      const start = e.currentTarget.selectionStart;
      const end = e.currentTarget.selectionEnd;
      const newCode = code.substring(0, start) + '    ' + code.substring(end);
      setCode(newCode);
      setTimeout(() => {
        if (editorRef.current) {
          editorRef.current.selectionStart = editorRef.current.selectionEnd = start + 4;
        }
      }, 0);
    } else if ((e.ctrlKey || e.metaKey) && e.key === 'Enter') {
      e.preventDefault();
      handleRunCode();
    }
  };

  // Toggle audio
  const handleToggleSound = () => {
    const next = DungeonSound.toggleMute();
    setIsMuted(next);
  };

  // Reset current mission code
  const handleResetCode = () => {
    setCode(activeMission.starterCode);
    setStdout('');
    setStderr('');
    setLastRunPassed(null);
    setPlayerSpeech(null);
    DungeonSound.playMove();
  };

  // Request next progressive hint
  const handleGetHint = () => {
    setShowHintBox(true);
    setHintLevel((prev) => Math.min(activeMission.hints.length - 1, prev + 1));
    DungeonSound.playCollect();
  };

  // 3. EXECUTE STUDENT PYTHON CODE & VALIDATE
  const handleRunCode = async () => {
    if (isRunning) return;
    setIsRunning(true);
    setIsCastingMagic(true);
    setStdout('');
    setStderr('');
    setLastRunPassed(null);

    DungeonSound.playCraft();

    // Mission 5 requires prediction submission first
    if (activeMission.mechanic === 'output_prediction' && !selectedPrediction) {
      setIsRunning(false);
      setIsCastingMagic(false);
      setStderr('Notice: Please select your output prediction before running the program!');
      DungeonSound.playDamage();
      return;
    }

    // Execute Python in sandbox interpreter
    const runRes = runPythonCode(code);

    // Format output
    const cleanStdout = runRes.stdout.trim();
    const cleanTarget = activeMission.targetOutput ? activeMission.targetOutput.trim() : '';

    setStdout(runRes.stdout);
    setStderr(runRes.stderr);

    // Show player speech bubble in pixel canvas
    if (cleanStdout) {
      const speech = cleanStdout.split('\n')[0].substring(0, 32);
      setPlayerSpeech(speech);
    }

    // Determine pass / fail
    let passed = false;

    if (activeMission.mechanic === 'output_prediction') {
      // Validate prediction choice
      const selectedOpt = activeMission.predictionOptions?.find(
        (o) => o.id === selectedPrediction
      );
      const isPredRight = !!selectedOpt?.isCorrect;
      setPredictionSubmitted(true);
      setPredictionCorrect(isPredRight);

      // Program must also run without syntax error
      passed = isPredRight && runRes.success;
    } else {
      // Compare normalized output for code writing, reverse teaching, and debugging
      const normalize = (s: string) =>
        s
          .replace(/\r\n/g, '\n')
          .trim()
          .replace(/["']/g, '"'); // Accept single/double quotes equality

      const stdoutNorm = normalize(cleanStdout);
      const targetNorm = normalize(cleanTarget);

      passed = runRes.success && stdoutNorm === targetNorm;
    }

    setLastRunPassed(passed);
    setIsRunning(false);

    setTimeout(() => {
      setIsCastingMagic(false);
    }, 600);

    // HANDLE SUCCESS PASS
    if (passed) {
      DungeonSound.playVictory();
      setRunesLit(true);

      // Save mission completion
      const newCompleted = Array.from(
        new Set([...completedMissions, activeMission.missionKey])
      );
      setCompletedMissions(newCompleted);

      try {
        localStorage.setItem(
          'dronacharya_stage1_missions',
          JSON.stringify(newCompleted)
        );
      } catch {}

      // Award XP via centralized auth-db
      recordGameProgress({
        missionId: activeMission.missionKey,
        earnedXp: activeMission.xpReward,
        subject: 'python',
        levelId: 'stage-1',
      });

      // Special handling for Mission 6 (Final Gate Boss Challenge)
      if (activeMission.id === 6) {
        setGateOpen(true);
        setStage1Completed(true);
        try {
          localStorage.setItem('dronacharya_stage1_completed', 'true');
        } catch {}

        // Confetti burst
        confetti({
          particleCount: 120,
          spread: 80,
          origin: { y: 0.6 },
          colors: ['#FFD214', '#6C5CE7', '#10B981', '#38BDF8'],
        });

        // Open Stage 1 victory modal after gate animation
        setTimeout(() => {
          setShowVictoryModal(true);
        }, 1200);
      }
    } else {
      DungeonSound.playDamage();
    }
  };

  // Calculate overall Stage 1 progress percent
  const stage1ProgressPercent = Math.round(
    (completedMissions.length / STAGE_1_MISSIONS.length) * 100
  );

  return (
    <div className="w-full min-h-screen bg-[#1E1E24] text-[#FAF6EE] flex flex-col items-center select-none pb-16 overflow-x-hidden">
      {/* =======================================================================
          TOP HUD & STAGE NAVIGATION BAR
         ======================================================================= */}
      <header className="w-full bg-[#18181D] border-b-3 border-[#2A2A32] sticky top-0 z-40 shadow-[0_4px_12px_rgba(0,0,0,0.5)]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-2.5 flex flex-wrap items-center justify-between gap-3">
          {/* Back Button & Title */}
          <div className="flex items-center gap-3">
            <Link
              href="/courses/python/dashboard"
              className="p-2 rounded-xl bg-[#262630] border-2 border-[#3A3A48] hover:bg-[#323240] hover:border-[#FFD214] transition-all text-[#FAF6EE] flex items-center gap-1.5 text-xs font-bold shadow-[2px_2px_0px_#000]"
              title="Return to Python Stage Map & Dashboard"
            >
              <ArrowLeft className="w-4 h-4" />
              <span className="hidden sm:inline">Stage Map</span>
            </Link>

            <div>
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-pixel px-2 py-0.5 rounded bg-[#FFD214] text-[#1E1E24] font-black">
                  STAGE 1
                </span>
                <h1 className="font-serif font-black text-sm sm:text-base text-white tracking-wide flex items-center gap-1.5">
                  <span>Code Quest: The First Command</span>
                  <span className="text-[#FFD214]">⋆˙⟡</span>
                </h1>
              </div>
              <p className="text-[11px] font-bold text-gray-400 hidden sm:block">
                Ancient Code Realm • Communicating through Python
              </p>
            </div>
          </div>

          {/* Mission Indicator & HUD Controls */}
          <div className="flex items-center gap-3">
            {/* Progress Bar & Counters */}
            <div className="hidden md:flex flex-col items-end gap-1">
              <div className="flex items-center gap-2 text-xs font-mono font-bold">
                <span className="text-gray-400">STAGE PROGRESS:</span>
                <span className="text-[#FFD214]">{stage1ProgressPercent}%</span>
                <span className="text-gray-500">
                  ({completedMissions.length}/{STAGE_1_MISSIONS.length})
                </span>
              </div>
              <div className="w-36 h-2 rounded-full bg-[#2A2A35] border border-[#3A3A48] overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-[#6C5CE7] via-[#A29BFE] to-[#FFD214] transition-all duration-500"
                  style={{ width: `${stage1ProgressPercent}%` }}
                />
              </div>
            </div>

            {/* Audio Toggle */}
            <button
              onClick={handleToggleSound}
              className={`p-2 rounded-xl border-2 transition-all cursor-pointer shadow-[2px_2px_0px_#000] ${
                isMuted
                  ? 'bg-rose-950/40 border-rose-800 text-rose-300'
                  : 'bg-[#262630] border-[#3A3A48] text-[#FFD214] hover:bg-[#323240]'
              }`}
              title={isMuted ? 'Unmute 8-bit Audio' : 'Mute Audio'}
            >
              {isMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
            </button>
          </div>
        </div>

        {/* Mission Selector Dots / Tabs */}
        <div className="bg-[#121216] border-t border-[#262632] px-4 sm:px-6 lg:px-8 py-2">
          <div className="max-w-7xl mx-auto flex items-center justify-between gap-2 overflow-x-auto scrollbar-none">
            <span className="text-[10px] font-pixel text-gray-400 uppercase tracking-wider shrink-0 mr-1">
              Missions:
            </span>

            <div className="flex items-center gap-1.5 sm:gap-2 flex-nowrap">
              {STAGE_1_MISSIONS.map((m, idx) => {
                const isSelected = idx === currentMissionIndex;
                const isDone = completedMissions.includes(m.missionKey);

                return (
                  <button
                    key={m.id}
                    onClick={() => setCurrentMissionIndex(idx)}
                    className={`px-2.5 py-1 rounded-lg text-xs font-pixel font-bold flex items-center gap-1.5 transition-all cursor-pointer whitespace-nowrap border ${
                      isSelected
                        ? 'bg-[#FFD214] text-[#1E1E24] border-[#1E1E24] shadow-[2px_2px_0px_#000] scale-105'
                        : isDone
                        ? 'bg-emerald-950/60 text-emerald-300 border-emerald-700/80 hover:bg-emerald-900/60'
                        : 'bg-[#22222C] text-gray-400 border-[#323240] hover:text-white hover:bg-[#2B2B38]'
                    }`}
                  >
                    <span>{m.id}</span>
                    {isDone ? (
                      <Check className="w-3 h-3 text-emerald-400 stroke-3" />
                    ) : (
                      <span className="w-1.5 h-1.5 rounded-full bg-gray-500" />
                    )}
                    <span className="hidden lg:inline text-[10px]">
                      {m.title.replace(/Mission \d+ — /, '')}
                    </span>
                  </button>
                );
              })}
            </div>

            {/* Next / Previous mission controls */}
            <div className="flex items-center gap-1 shrink-0 ml-auto pl-2">
              <button
                disabled={currentMissionIndex === 0}
                onClick={() => setCurrentMissionIndex((i) => Math.max(0, i - 1))}
                className="p-1 rounded bg-[#22222C] border border-[#323240] text-gray-300 disabled:opacity-30 hover:bg-[#2C2C3A] cursor-pointer"
                title="Previous Mission"
              >
                <ChevronLeft className="w-3.5 h-3.5" />
              </button>
              <button
                disabled={currentMissionIndex === STAGE_1_MISSIONS.length - 1}
                onClick={() =>
                  setCurrentMissionIndex((i) =>
                    Math.min(STAGE_1_MISSIONS.length - 1, i + 1)
                  )
                }
                className="p-1 rounded bg-[#22222C] border border-[#323240] text-gray-300 disabled:opacity-30 hover:bg-[#2C2C3A] cursor-pointer"
                title="Next Mission"
              >
                <ChevronRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* =======================================================================
          MAIN WORKSPACE: TWO COLUMNS (Visual Game Canvas Left, Coding Lab Right)
         ======================================================================= */}
      <main className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-6 grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* =====================================================================
            LEFT COLUMN (5 COLS): PIXEL-ART 2D GAME WORLD & MENTOR PANEL
           ===================================================================== */}
        <div className="lg:col-span-5 space-y-5">
          {/* 1. VISUAL 2D PIXEL-ART ADVENTURE CANVAS */}
          <div className="relative rounded-3xl border-3 border-[#2A2A35] bg-[#121217] shadow-[6px_6px_0px_#0A0A0E] overflow-hidden">
            {/* Canvas Header / Status Bar */}
            <div className="flex items-center justify-between px-4 py-2 bg-[#1A1A22] border-b-2 border-[#2A2A35] text-xs font-mono">
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-ping" />
                <span className="text-gray-300 font-bold">Ancient Gate of Logic</span>
              </div>
              <span
                className={`text-[10px] font-pixel px-2 py-0.5 rounded border ${
                  gateOpen
                    ? 'bg-emerald-950 text-emerald-300 border-emerald-600'
                    : 'bg-rose-950 text-rose-300 border-rose-800'
                }`}
              >
                {gateOpen ? 'GATE UNLOCKED 🔓' : 'GATE SEALED 🔒'}
              </span>
            </div>

            {/* Central Animated Pixel-Art Game Scene */}
            <div className="relative w-full h-64 sm:h-72 bg-gradient-to-b from-[#0F172A] via-[#1E1B4B] to-[#181822] flex items-center justify-center overflow-hidden">
              {/* Starry Sky / Particles */}
              <div className="absolute inset-0 opacity-40 pointer-events-none">
                <div className="absolute top-4 left-10 w-1 h-1 bg-white rounded-full animate-ping" />
                <div className="absolute top-8 right-16 w-1.5 h-1.5 bg-[#FFD214] rounded-full animate-pulse" />
                <div className="absolute top-16 left-36 w-1 h-1 bg-cyan-300 rounded-full" />
                <div className="absolute top-20 right-40 w-1 h-1 bg-purple-300 rounded-full animate-pulse" />
              </div>

              {/* Distant Temple Ruins Silhouettes */}
              <div className="absolute bottom-16 inset-x-0 h-20 bg-gradient-to-t from-[#151520] to-transparent opacity-80" />

              {/* Stone Cobblestone Courtyard Floor */}
              <div className="absolute bottom-0 inset-x-0 h-20 bg-[#16161D] border-t-2 border-[#2C2C3A]">
                <div className="w-full h-full opacity-20 bg-[radial-gradient(#4B5563_1px,transparent_1px)] [background-size:8px_8px]" />
              </div>

              {/* LEFT MONOLITHIC PILLAR & TORCH */}
              <div className="absolute bottom-6 left-6 sm:left-10 w-10 sm:w-12 h-44 bg-[#23232E] border-2 border-[#383848] rounded-t-lg shadow-lg flex flex-col items-center justify-between p-1 z-10">
                {/* Flaming Brazier Torch */}
                <div className="relative -top-3 flex flex-col items-center">
                  <div className="w-4 h-4 rounded-full bg-gradient-to-t from-amber-600 via-amber-400 to-yellow-200 animate-bounce shadow-[0_0_12px_#F59E0B]" />
                  <div className="w-6 h-2 bg-[#3A3A4A] rounded-xs border border-black" />
                </div>
                {/* Glowing Runes on Pillar */}
                <div
                  className={`space-y-2 text-[9px] font-mono font-black transition-all duration-700 ${
                    runesLit
                      ? 'text-[#38BDF8] drop-shadow-[0_0_6px_#38BDF8]'
                      : 'text-gray-600'
                  }`}
                >
                  <div>def</div>
                  <div>print</div>
                  <div>&gt;&gt;&gt;</div>
                </div>
                <div className="w-full h-3 bg-[#1A1A22] rounded-xs" />
              </div>

              {/* RIGHT MONOLITHIC PILLAR & TORCH */}
              <div className="absolute bottom-6 right-6 sm:right-10 w-10 sm:w-12 h-44 bg-[#23232E] border-2 border-[#383848] rounded-t-lg shadow-lg flex flex-col items-center justify-between p-1 z-10">
                {/* Flaming Brazier Torch */}
                <div className="relative -top-3 flex flex-col items-center">
                  <div className="w-4 h-4 rounded-full bg-gradient-to-t from-amber-600 via-amber-400 to-yellow-200 animate-bounce shadow-[0_0_12px_#F59E0B]" />
                  <div className="w-6 h-2 bg-[#3A3A4A] rounded-xs border border-black" />
                </div>
                {/* Glowing Runes on Pillar */}
                <div
                  className={`space-y-2 text-[9px] font-mono font-black transition-all duration-700 ${
                    runesLit
                      ? 'text-[#38BDF8] drop-shadow-[0_0_6px_#38BDF8]'
                      : 'text-gray-600'
                  }`}
                >
                  <div>str</div>
                  <div>len</div>
                  <div>&lt;/&gt;</div>
                </div>
                <div className="w-full h-3 bg-[#1A1A22] rounded-xs" />
              </div>

              {/* CENTRAL ANCIENT GATE */}
              <div className="relative w-44 sm:w-52 h-48 sm:h-52 z-10 flex flex-col items-center">
                {/* Gate Overhead Arch & Keystone Crystal */}
                <div className="relative w-full h-10 bg-[#282836] border-2 border-[#3E3E50] rounded-t-2xl flex items-center justify-center shadow-md">
                  {/* Arcane Crystal */}
                  <div
                    className={`w-5 h-5 rounded-md rotate-45 border-2 transition-all duration-700 flex items-center justify-center ${
                      gateOpen
                        ? 'bg-[#10B981] border-[#34D399] shadow-[0_0_16px_#10B981] animate-pulse'
                        : runesLit
                        ? 'bg-[#38BDF8] border-[#7DD3FC] shadow-[0_0_12px_#38BDF8]'
                        : 'bg-[#475569] border-[#64748B]'
                    }`}
                  >
                    <span className="text-[8px] font-bold text-black -rotate-45">λ</span>
                  </div>
                </div>

                {/* Gate Interior / Doors Container */}
                <div className="relative w-full flex-1 bg-black/80 border-x-2 border-b-2 border-[#3E3E50] overflow-hidden flex">
                  {/* Left Door */}
                  <div
                    className={`w-1/2 h-full bg-[#1C1C26] border-r border-[#2C2C3A] flex flex-col justify-around p-2 transition-transform duration-1000 ease-in-out ${
                      gateOpen ? '-translate-x-full' : 'translate-x-0'
                    }`}
                  >
                    <div className="w-full h-1 bg-[#3A3A4C]" />
                    <div
                      className={`text-center font-mono text-[9px] font-bold transition-colors ${
                        runesLit ? 'text-[#FFD214]' : 'text-gray-600'
                      }`}
                    >
                      print()
                    </div>
                    <div className="w-full h-1 bg-[#3A3A4C]" />
                  </div>

                  {/* Right Door */}
                  <div
                    className={`w-1/2 h-full bg-[#1C1C26] border-l border-[#2C2C3A] flex flex-col justify-around p-2 transition-transform duration-1000 ease-in-out ${
                      gateOpen ? 'translate-x-full' : 'translate-x-0'
                    }`}
                  >
                    <div className="w-full h-1 bg-[#3A3A4C]" />
                    <div
                      className={`text-center font-mono text-[9px] font-bold transition-colors ${
                        runesLit ? 'text-[#FFD214]' : 'text-gray-600'
                      }`}
                    >
                      &quot;str&quot;
                    </div>
                    <div className="w-full h-1 bg-[#3A3A4C]" />
                  </div>

                  {/* Behind the doors: Radiant Gate Portal when Unlocked */}
                  {gateOpen && (
                    <div className="absolute inset-0 bg-gradient-to-t from-[#FFD214] via-[#6C5CE7] to-[#38BDF8] animate-pulse flex items-center justify-center">
                      <div className="w-16 h-28 rounded-full bg-white/70 blur-xs animate-ping" />
                      <span className="relative z-10 font-pixel text-xs text-[#1E1E24] font-black">
                        PATHWAY OPEN
                      </span>
                    </div>
                  )}

                  {/* Padlock Icon & Rune Center Seal */}
                  {!gateOpen && (
                    <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                      <div className="p-2.5 rounded-full bg-[#1A1A22] border-2 border-[#3E3E50] shadow-md flex items-center justify-center">
                        <Lock className="w-5 h-5 text-amber-400" />
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* PLAYER CHARACTER (Arya the young coder apprentice) */}
              <div
                className={`absolute bottom-4 left-1/2 -translate-x-1/2 z-20 flex flex-col items-center transition-all duration-500 ${
                  gateOpen ? 'scale-90 -translate-y-8' : 'scale-100'
                }`}
              >
                {/* Speech Bubble when code outputs text */}
                {playerSpeech && (
                  <div className="relative -top-1 bg-[#FAF6EE] text-[#1E1E24] text-[11px] font-mono font-bold px-2.5 py-1 rounded-xl border-2 border-[#1E1E24] shadow-[2px_2px_0px_#000] animate-in zoom-in-95 max-w-[180px] truncate text-center">
                    &quot;{playerSpeech}&quot;
                  </div>
                )}

                {/* Magical Energy Orb when casting code */}
                {isCastingMagic && (
                  <div className="absolute -top-4 w-12 h-12 rounded-full bg-cyan-400/40 blur-xs animate-ping" />
                )}

                {/* Pixel Avatar Representation */}
                <div className="text-3xl sm:text-4xl filter drop-shadow-[0_4px_6px_rgba(0,0,0,0.8)]">
                  🧙‍♂️
                </div>
                <span className="text-[9px] font-pixel px-1.5 py-0.2 rounded bg-black/80 text-[#FFD214] border border-[#3A3A48] mt-0.5">
                  Arya (Coder)
                </span>
              </div>
            </div>
          </div>

          {/* 2. ACHARYA DRONACHARYA MENTOR & FEEDBACK PANEL */}
          <div className="p-4 sm:p-5 rounded-2xl bg-[#181820] border-2 border-[#2C2C3A] shadow-[4px_4px_0px_#0A0A0E] space-y-3">
            {/* Header with Avatar */}
            <div className="flex items-start gap-3">
              <div className="w-12 h-12 rounded-2xl bg-[#282538] border-2 border-[#FFD214] flex items-center justify-center shrink-0 shadow-[2px_2px_0px_#000]">
                <img
                  src="/logo.png"
                  alt="Dronacharya"
                  className="w-9 h-9 object-contain"
                />
              </div>

              <div className="space-y-0.5 min-w-0 flex-1">
                <div className="flex items-center gap-2">
                  <h3 className="font-serif font-black text-sm text-white">
                    Acharya Dronacharya
                  </h3>
                  <span className="text-[10px] font-pixel px-1.5 py-0.2 rounded bg-purple-950 text-purple-300 border border-purple-700">
                    AI Mentor
                  </span>
                </div>
                <p className="text-xs font-bold text-gray-400">
                  Guide of the Ancient Code Realm
                </p>
              </div>
            </div>

            {/* Mentor Dialogue */}
            <div className="p-3 rounded-xl bg-[#22222E] border border-[#343445] text-xs font-serif font-bold text-[#FAF6EE] leading-relaxed relative">
              <span className="text-[#FFD214] text-base font-serif mr-1">“</span>
              <span>{activeMission.mentorDialogue}</span>
              <span className="text-[#FFD214] text-base font-serif ml-1">”</span>
            </div>

            {/* Objective statement */}
            <div className="flex items-start gap-2 pt-1 text-xs font-mono font-bold text-gray-300">
              <Target className="w-4 h-4 text-[#FFD214] shrink-0 mt-0.5" />
              <span>{activeMission.objective}</span>
            </div>

            {/* Progressive Hint Reveal Box */}
            {showHintBox && (
              <div className="p-3 rounded-xl bg-amber-950/40 border border-amber-600/70 text-xs text-amber-200 space-y-1 animate-in fade-in duration-150">
                <div className="flex items-center justify-between text-[11px] font-bold text-amber-400 font-mono">
                  <span>
                    💡 HINT {hintLevel + 1} OF {activeMission.hints.length}:
                  </span>
                  {hintLevel < activeMission.hints.length - 1 && (
                    <button
                      onClick={handleGetHint}
                      className="text-xs text-[#FFD214] hover:underline cursor-pointer"
                    >
                      Next Hint →
                    </button>
                  )}
                </div>
                <p className="font-sans leading-relaxed">
                  {activeMission.hints[hintLevel]}
                </p>
              </div>
            )}
          </div>
        </div>

        {/* =====================================================================
            RIGHT COLUMN (7 COLS): PYTHON LAB (Editor, Run Button, Consoles)
           ===================================================================== */}
        <div className="lg:col-span-7 space-y-4">
          {/* Mission Category Pill & XP Tag */}
          <div className="flex items-center justify-between flex-wrap gap-2 pb-1">
            <div className="flex items-center gap-2">
              <span className="text-xs font-pixel px-2.5 py-1 rounded-md bg-[#6C5CE7] text-white border border-[#8376EB]">
                {activeMission.mechanicBadge}
              </span>
              <span className="text-xs font-bold text-gray-400">
                {activeMission.subtitle}
              </span>
            </div>

            <div className="flex items-center gap-1.5 text-xs font-mono font-bold text-[#FFD214] bg-[#2A2A38] px-2.5 py-1 rounded-lg border border-[#3E3E52]">
              <Sparkles className="w-3.5 h-3.5" />
              <span>+{activeMission.xpReward} XP</span>
            </div>
          </div>

          {/* REVERSE TEACHING: TARGET OUTPUT CONSOLE (Dedicated for Reverse Missions 2 & 4) */}
          {activeMission.targetOutput &&
            activeMission.mechanic === 'reverse_teaching' && (
              <div className="p-4 rounded-2xl bg-amber-950/30 border-2 border-amber-500/70 shadow-[3px_3px_0px_#000] space-y-2">
                <div className="flex items-center justify-between text-xs font-pixel font-bold text-amber-300">
                  <div className="flex items-center gap-1.5">
                    <Target className="w-4 h-4 text-amber-400" />
                    <span>TARGET OUTPUT REQUIRED</span>
                  </div>
                  <span className="text-[10px] text-amber-400/80">REVERSE CHALLENGE</span>
                </div>

                <div className="p-3 rounded-xl bg-black/80 border border-amber-500/40 font-mono text-xs sm:text-sm font-bold text-amber-200 whitespace-pre-wrap">
                  {activeMission.targetOutput}
                </div>

                <p className="text-[11px] font-bold text-gray-400">
                  Write the Python instruction in the editor below that creates this exact output.
                </p>
              </div>
            )}

          {/* OUTPUT PREDICTION: INTERACTIVE CARDS (Dedicated for Mission 5) */}
          {activeMission.mechanic === 'output_prediction' && (
            <div className="p-4 rounded-2xl bg-[#20202C] border-2 border-[#38384C] shadow-[3px_3px_0px_#000] space-y-3">
              <div className="flex items-center gap-2 text-xs font-pixel font-bold text-[#FFD214]">
                <Zap className="w-4 h-4" />
                <span>PREDICT THE OUTPUT FIRST:</span>
              </div>

              <p className="text-xs font-bold text-gray-300">
                {activeMission.predictionQuestion}
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 pt-1">
                {activeMission.predictionOptions?.map((opt) => {
                  const isChosen = selectedPrediction === opt.id;

                  return (
                    <button
                      key={opt.id}
                      onClick={() => {
                        setSelectedPrediction(opt.id);
                        setPredictionSubmitted(false);
                      }}
                      className={`p-3 rounded-xl border-2 text-left transition-all cursor-pointer flex items-start gap-2.5 ${
                        isChosen
                          ? 'bg-[#2E284A] border-[#FFD214] text-white shadow-[2px_2px_0px_#FFD214]'
                          : 'bg-[#181822] border-[#343445] text-gray-300 hover:border-gray-500'
                      }`}
                    >
                      <div
                        className={`w-4 h-4 rounded-full border-2 mt-0.5 shrink-0 flex items-center justify-center ${
                          isChosen
                            ? 'border-[#FFD214] bg-[#FFD214]'
                            : 'border-gray-500 bg-transparent'
                        }`}
                      >
                        {isChosen && <div className="w-1.5 h-1.5 rounded-full bg-black" />}
                      </div>

                      <div className="font-mono text-xs font-bold whitespace-pre-wrap leading-tight">
                        {opt.text}
                      </div>
                    </button>
                  );
                })}
              </div>

              {predictionSubmitted && (
                <div
                  className={`p-3 rounded-xl border text-xs font-sans leading-relaxed animate-in fade-in duration-150 ${
                    predictionCorrect
                      ? 'bg-emerald-950/50 border-emerald-500 text-emerald-200'
                      : 'bg-rose-950/50 border-rose-500 text-rose-200'
                  }`}
                >
                  <div className="font-bold font-mono text-xs mb-1">
                    {predictionCorrect ? '✅ PREDICTION ACCURATE!' : '❌ INCORRECT PREDICTION'}
                  </div>
                  {activeMission.predictionExplanation}
                </div>
              )}
            </div>
          )}

          {/* PYTHON CODE EDITOR */}
          <div className="rounded-2xl border-2 border-[#38384C] bg-[#14141B] shadow-[4px_4px_0px_#0A0A0E] overflow-hidden">
            {/* Editor Top Bar */}
            <div className="px-4 py-2.5 bg-[#1B1B25] border-b border-[#2C2C3C] flex items-center justify-between text-xs font-mono">
              <div className="flex items-center gap-2">
                <div className="flex items-center gap-1.5">
                  <span className="w-2.5 h-2.5 rounded-full bg-rose-500" />
                  <span className="w-2.5 h-2.5 rounded-full bg-amber-500" />
                  <span className="w-2.5 h-2.5 rounded-full bg-emerald-500" />
                </div>
                <span className="text-gray-400 font-bold ml-1">gate_command.py</span>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={handleResetCode}
                  className="px-2 py-1 rounded bg-[#262635] hover:bg-[#323245] text-gray-300 hover:text-white text-[11px] font-mono flex items-center gap-1 transition-colors cursor-pointer"
                  title="Reset code to initial challenge state"
                >
                  <RotateCcw className="w-3 h-3" />
                  <span>Reset</span>
                </button>
                <button
                  onClick={handleGetHint}
                  className="px-2 py-1 rounded bg-[#2A2318] hover:bg-[#3D3322] text-amber-300 text-[11px] font-mono flex items-center gap-1 transition-colors cursor-pointer border border-amber-600/40"
                  title="Get Socratic hint"
                >
                  <Lightbulb className="w-3 h-3 text-[#FFD214]" />
                  <span>Hint</span>
                </button>
              </div>
            </div>

            {/* Code Input Area with line numbers */}
            <div className="p-3 bg-[#111116] flex gap-3 text-xs sm:text-sm font-mono leading-relaxed">
              {/* Line Numbers */}
              <div className="select-none text-gray-600 text-right pr-2 border-r border-[#242432] space-y-0.5">
                {code.split('\n').map((_, idx) => (
                  <div key={idx}>{idx + 1}</div>
                ))}
              </div>

              {/* Editable Python Textarea */}
              <textarea
                ref={editorRef}
                value={code}
                onChange={(e) => setCode(e.target.value)}
                onKeyDown={handleKeyDown}
                rows={Math.max(4, code.split('\n').length)}
                className="w-full bg-transparent text-[#FAF6EE] focus:outline-none resize-none font-mono selection:bg-[#6C5CE7] selection:text-white"
                placeholder="# Write your Python code here..."
                spellCheck={false}
              />
            </div>

            {/* Editor Action Bar with RUN CODE Button */}
            <div className="px-4 py-2.5 bg-[#181822] border-t border-[#262635] flex items-center justify-between flex-wrap gap-2">
              <span className="text-[11px] font-mono text-gray-500">
                Shortcut: <kbd className="px-1.5 py-0.5 bg-[#252535] rounded text-gray-300">Ctrl</kbd> + <kbd className="px-1.5 py-0.5 bg-[#252535] rounded text-gray-300">Enter</kbd>
              </span>

              <button
                onClick={handleRunCode}
                disabled={isRunning}
                className="btn-arcade btn-arcade-gold px-5 py-2.5 text-xs font-black flex items-center gap-2 cursor-pointer shadow-[2px_2px_0px_#000] disabled:opacity-50"
              >
                {isRunning ? (
                  <>
                    <div className="w-3.5 h-3.5 border-2 border-black border-t-transparent rounded-full animate-spin" />
                    <span>Executing...</span>
                  </>
                ) : (
                  <>
                    <Play className="w-3.5 h-3.5 fill-current" />
                    <span>RUN CODE ▶</span>
                  </>
                )}
              </button>
            </div>
          </div>

          {/* TERMINAL OUTPUT CONSOLE */}
          <div className="rounded-2xl border-2 border-[#2C2C3C] bg-[#0E0E14] shadow-[4px_4px_0px_#0A0A0E] overflow-hidden">
            <div className="px-4 py-2 bg-[#171720] border-b border-[#242432] flex items-center justify-between text-xs font-mono">
              <div className="flex items-center gap-2 text-gray-400">
                <Terminal className="w-3.5 h-3.5 text-[#38BDF8]" />
                <span className="font-bold">OUTPUT CONSOLE (stdout)</span>
              </div>

              {lastRunPassed !== null && (
                <span
                  className={`text-[10px] font-pixel px-2 py-0.5 rounded border ${
                    lastRunPassed
                      ? 'bg-emerald-950 text-emerald-300 border-emerald-600'
                      : 'bg-rose-950 text-rose-300 border-rose-800'
                  }`}
                >
                  {lastRunPassed ? 'PASSED ✅' : 'FAILED ❌'}
                </span>
              )}
            </div>

            {/* Console Output Content */}
            <div className="p-4 font-mono text-xs sm:text-sm min-h-[90px] max-h-48 overflow-y-auto space-y-2">
              {stdout ? (
                <pre className="text-emerald-400 font-bold whitespace-pre-wrap">
                  {stdout}
                </pre>
              ) : !stderr && lastRunPassed === null ? (
                <p className="text-gray-600 italic">
                  Run your Python code to see output displayed here...
                </p>
              ) : null}

              {/* Genuine Python Traceback / Stderr */}
              {stderr && (
                <div className="p-2.5 rounded-lg bg-rose-950/40 border border-rose-800/60 text-rose-300 whitespace-pre-wrap font-mono text-xs">
                  {stderr}
                </div>
              )}
            </div>

            {/* Success Feedback Banner */}
            {lastRunPassed && (
              <div className="px-4 py-3 bg-emerald-950/60 border-t border-emerald-600/60 text-emerald-200 flex items-center justify-between flex-wrap gap-2 text-xs">
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                  <span className="font-bold">{activeMission.successMessage}</span>
                </div>

                {currentMissionIndex < STAGE_1_MISSIONS.length - 1 && (
                  <button
                    onClick={() => setCurrentMissionIndex((i) => i + 1)}
                    className="btn-arcade btn-arcade-white px-3 py-1.5 text-xs font-black flex items-center gap-1 cursor-pointer shadow-[2px_2px_0px_#000]"
                  >
                    <span>Next Mission</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                )}
              </div>
            )}
          </div>
        </div>
      </main>

      {/* =======================================================================
          STAGE 1 VICTORY & COMPLETION MODAL
         ======================================================================= */}
      {showVictoryModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-xs animate-in fade-in duration-200">
          <div className="relative w-full max-w-xl bg-[#FAF6EE] text-[#1E1E24] rounded-3xl border-4 border-[#1E1E24] shadow-[10px_10px_0px_#000] p-6 sm:p-8 space-y-6 text-center animate-in zoom-in-95">
            {/* Header Badge & Icon */}
            <div className="space-y-2">
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#FFD214] border-2 border-[#1E1E24] shadow-[2px_2px_0px_#1E1E24] text-xs font-pixel font-bold">
                <Award className="w-4 h-4 text-[#1E1E24]" />
                <span>STAGE 1 CLEARED</span>
              </div>
              <h2 className="text-2xl sm:text-3xl font-serif font-black text-[#1E1E24]">
                The First Command Conquered!
              </h2>
              <p className="text-xs sm:text-sm font-bold text-gray-600 max-w-md mx-auto">
                You have communed with the Ancient Gate, mastered the print() function, reconstructed lost code, repaired broken syntax, and predicted program execution.
              </p>
            </div>

            {/* Achievement Summary Pills */}
            <div className="grid grid-cols-2 gap-2.5 text-xs font-bold text-left">
              <div className="p-3 rounded-xl bg-white border-2 border-[#1E1E24] shadow-[2px_2px_0px_#1E1E24] space-y-1">
                <span className="text-[10px] font-pixel text-[#0284C7] block uppercase">
                  ✓ Learn by Doing
                </span>
                <span className="text-xs font-serif font-bold text-[#1E1E24]">
                  print() & String Literals
                </span>
              </div>
              <div className="p-3 rounded-xl bg-white border-2 border-[#1E1E24] shadow-[2px_2px_0px_#1E1E24] space-y-1">
                <span className="text-[10px] font-pixel text-[#6C5CE7] block uppercase">
                  ✓ Reverse Teaching
                </span>
                <span className="text-xs font-serif font-bold text-[#1E1E24]">
                  Working from Desired Output
                </span>
              </div>
              <div className="p-3 rounded-xl bg-white border-2 border-[#1E1E24] shadow-[2px_2px_0px_#1E1E24] space-y-1">
                <span className="text-[10px] font-pixel text-emerald-700 block uppercase">
                  ✓ Error Finding
                </span>
                <span className="text-xs font-serif font-bold text-[#1E1E24]">
                  Parenthesis & Syntax Debugging
                </span>
              </div>
              <div className="p-3 rounded-xl bg-white border-2 border-[#1E1E24] shadow-[2px_2px_0px_#1E1E24] space-y-1">
                <span className="text-[10px] font-pixel text-amber-700 block uppercase">
                  ✓ Output Prediction
                </span>
                <span className="text-xs font-serif font-bold text-[#1E1E24]">
                  Newline (\\n) Mechanics
                </span>
              </div>
            </div>

            {/* XP Awarded Callout */}
            <div className="p-4 rounded-2xl bg-amber-100 border-2 border-[#1E1E24] flex items-center justify-around">
              <div>
                <span className="block text-[10px] font-mono text-gray-500 font-bold">TOTAL XP GAINED</span>
                <span className="font-pixel text-lg sm:text-xl text-emerald-800 font-black">+350 XP</span>
              </div>
              <div className="w-px h-8 bg-gray-300" />
              <div>
                <span className="block text-[10px] font-mono text-gray-500 font-bold">RANK UPDATED</span>
                <span className="font-serif text-sm font-black text-[#1E1E24]">Vidvan Apprentice</span>
              </div>
            </div>

            {/* Locked Stages Notice */}
            <div className="p-3 rounded-xl bg-slate-100 border border-slate-300 text-xs font-bold text-gray-500 flex items-center justify-center gap-2">
              <Lock className="w-3.5 h-3.5 text-slate-400" />
              <span>Stages 2–5 (Treasure Variables, Fix the Code, Logic Gate, Boss) are currently COMING SOON.</span>
            </div>

            {/* Action Buttons */}
            <div className="flex items-center gap-3 pt-2">
              <Link
                href="/courses/python/dashboard"
                className="btn-arcade btn-arcade-gold flex-1 py-3 text-xs sm:text-sm font-black flex items-center justify-center gap-2 shadow-[3px_3px_0px_#1E1E24]"
              >
                <span>Return to Stage Map</span>
                <ArrowRight className="w-4 h-4" />
              </Link>

              <button
                onClick={() => setShowVictoryModal(false)}
                className="btn-arcade btn-arcade-white px-4 py-3 text-xs font-bold cursor-pointer shadow-[3px_3px_0px_#1E1E24]"
              >
                Replay Missions
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
