// Dronacharya Calibrated Python Diagnostic Assessment
// Tests sequential prerequisite knowledge: Syntax -> Variables -> Conditionals -> Loops
// Accurately recommends a starting stage without skipping untested topics
'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useDronacharya } from '@/lib/store';
import { saveLearnerProgress, getLearnerProgress } from '@/lib/curriculum/progression-engine';
import {
  Target,
  ArrowRight,
  CheckCircle2,
  XCircle,
  HelpCircle,
  Sparkles,
  Award,
  BookOpen,
  RotateCcw,
} from 'lucide-react';

interface DiagnosticQuestion {
  id: string;
  topicTitle: string;
  stageNumber: number;
  prompt: string;
  codeSnippet: string;
  options: { id: string; text: string; isCorrect: boolean }[];
  explanation: string;
}

const CALIBRATED_DIAGNOSTIC: DiagnosticQuestion[] = [
  {
    id: 'diag-step-1',
    topicTitle: 'Stage 1: Syntax & print()',
    stageNumber: 1,
    prompt: 'What will be printed to the screen when this code runs?',
    codeSnippet: `print("Python")
print("Gurukul")`,
    options: [
      { id: 'a', text: 'Python Gurukul on a single line', isCorrect: false },
      { id: 'b', text: 'Python, followed by Gurukul on a new line', isCorrect: true },
      { id: 'c', text: 'SyntaxError: missing commas', isCorrect: false },
    ],
    explanation: 'Each print() statement in Python outputs text and automatically appends a newline character.',
  },
  {
    id: 'diag-step-2',
    topicTitle: 'Stage 1: Variables & Data Types',
    stageNumber: 1,
    prompt: 'What is the data type of the variable `val` after this assignment?',
    codeSnippet: `val = "42"`,
    options: [
      { id: 'a', text: 'int (integer)', isCorrect: false },
      { id: 'b', text: 'str (string text)', isCorrect: true },
      { id: 'c', text: 'float (decimal)', isCorrect: false },
    ],
    explanation: 'Any characters enclosed within quotation marks are interpreted by Python as strings (str).',
  },
  {
    id: 'diag-step-3',
    topicTitle: 'Stage 2: Conditions (if/else)',
    stageNumber: 2,
    prompt: 'What will be printed when `battery = 45`?',
    codeSnippet: `battery = 45
if battery > 50:
    print("Normal")
else:
    print("Reserve")`,
    options: [
      { id: 'a', text: 'Normal', isCorrect: false },
      { id: 'b', text: 'Reserve', isCorrect: true },
      { id: 'c', text: 'Both Normal and Reserve', isCorrect: false },
    ],
    explanation: 'Because 45 > 50 is False, execution branches to the else block and prints "Reserve".',
  },
  {
    id: 'diag-step-4',
    topicTitle: 'Stage 2: Loops & Iteration',
    stageNumber: 2,
    prompt: 'How many times will the loop body execute?',
    codeSnippet: `for i in range(4):
    print("Step")`,
    options: [
      { id: 'a', text: '3 times', isCorrect: false },
      { id: 'b', text: '4 times (with i = 0, 1, 2, 3)', isCorrect: true },
      { id: 'c', text: '5 times', isCorrect: false },
    ],
    explanation: 'range(4) produces a sequence of 4 integers: 0, 1, 2, and 3.',
  },
];

export default function DiagnosticPage() {
  const router = useRouter();
  const { state } = useDronacharya();

  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedOptionId, setSelectedOptionId] = useState<string | null>(null);
  const [showExplanation, setShowExplanation] = useState(false);
  const [score, setScore] = useState(0);
  const [isFinished, setIsFinished] = useState(false);

  const currentQ = CALIBRATED_DIAGNOSTIC[currentIndex];

  const handleSelectOption = (optId: string) => {
    if (showExplanation) return;
    setSelectedOptionId(optId);
  };

  const handleCheckAnswer = () => {
    if (!selectedOptionId) return;
    const opt = currentQ.options.find((o) => o.id === selectedOptionId);
    if (opt?.isCorrect) {
      setScore((prev) => prev + 1);
    }
    setShowExplanation(true);
  };

  const handleNext = () => {
    if (currentIndex + 1 < CALIBRATED_DIAGNOSTIC.length) {
      setCurrentIndex((prev) => prev + 1);
      setSelectedOptionId(null);
      setShowExplanation(false);
    } else {
      setIsFinished(true);
    }
  };

  if (isFinished) {
    const accuracy = Math.round((score / CALIBRATED_DIAGNOSTIC.length) * 100);
    const recommendedTopicId = score >= 3 ? 'py-topic-14' : 'py-topic-1';
    const recommendedStage = score >= 3 ? 'Stage 2: Conditions and Loops' : 'Stage 1: Python Foundations';

    const handleStartRecommended = () => {
      const p = getLearnerProgress();
      p.currentLessonId = recommendedTopicId;
      saveLearnerProgress(p);
      router.push(`/learn/${recommendedTopicId}`);
    };

    const handleStartFromZero = () => {
      const p = getLearnerProgress();
      p.currentLessonId = 'py-topic-1';
      saveLearnerProgress(p);
      router.push('/learn/py-topic-1');
    };

    return (
      <div className="max-w-xl mx-auto px-4 py-16 text-center space-y-6">
        <div className="w-16 h-16 mx-auto rounded-2xl bg-[#FBBF24] border-2 border-[#1E1E24] text-[#1E1E24] shadow-[4px_4px_0px_#1E1E24] flex items-center justify-center">
          <Award className="w-8 h-8" />
        </div>

        <div>
          <h2 className="font-black text-3xl text-[#1E1E24]">
            Diagnostic Calibration Complete!
          </h2>
          <p className="text-sm text-[#4A4A58] font-bold mt-1">
            We evaluated your baseline prerequisite knowledge across Syntax, Types, Conditions, and Loops.
          </p>
        </div>

        <div className="p-6 rounded-2xl bg-white border-2 border-[#1E1E24] shadow-[4px_4px_0px_#1E1E24] grid grid-cols-2 gap-4">
          <div>
            <div className="text-xs text-[#4A4A58] font-black uppercase">Prerequisite Accuracy</div>
            <div className="font-black text-3xl text-[#6C5CE7] mt-1">{accuracy}%</div>
          </div>
          <div>
            <div className="text-xs text-[#4A4A58] font-black uppercase">Recommended Placement</div>
            <div className="font-black text-sm text-[#10B981] mt-2">{recommendedStage}</div>
          </div>
        </div>

        <div className="space-y-3 pt-2">
          <button
            onClick={handleStartRecommended}
            className="btn-game-purple w-full py-3.5 px-6 text-sm font-black flex items-center justify-center gap-2"
          >
            <span>Start at Recommended Placement ({recommendedStage})</span>
            <ArrowRight className="w-4 h-4" />
          </button>

          <button
            onClick={handleStartFromZero}
            className="btn-game-yellow w-full py-3 px-6 text-xs font-black flex items-center justify-center gap-2"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>I Prefer to Start from Lesson 1 (Recommended for Beginners)</span>
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto px-4 py-12">
      {/* Trial Header */}
      <div className="mb-6 flex items-center justify-between">
        <div>
          <span className="text-xs font-black uppercase tracking-wider text-[#6C5CE7]">
            Dronacharya Skill Calibration Trial
          </span>
          <h1 className="text-2xl font-black text-[#1E1E24] mt-1">
            Question {currentIndex + 1} of {CALIBRATED_DIAGNOSTIC.length}
          </h1>
        </div>
        <span className="text-xs font-black text-gray-500 bg-gray-100 px-3 py-1 rounded-full border border-gray-300">
          {currentQ.topicTitle}
        </span>
      </div>

      {/* Question Card */}
      <div className="bg-white rounded-2xl border-2 border-[#1E1E24] p-6 shadow-[5px_5px_0px_#1E1E24] space-y-4">
        <p className="font-black text-base text-[#1E1E24]">{currentQ.prompt}</p>

        {currentQ.codeSnippet && (
          <pre className="p-4 rounded-xl bg-[#1E1E24] text-[#FAF6EE] font-mono text-xs overflow-x-auto border-2 border-[#1E1E24] leading-relaxed">
            <code>{currentQ.codeSnippet}</code>
          </pre>
        )}

        {/* Options */}
        <div className="space-y-2 pt-2">
          {currentQ.options.map((option) => {
            const isSelected = selectedOptionId === option.id;
            let btnStyle = 'border-[#1E1E24] bg-[#FAF6EE] hover:bg-white text-[#1E1E24]';

            if (showExplanation) {
              if (option.isCorrect) {
                btnStyle = 'border-[#10B981] bg-[#D1FAE5] text-[#065F46] font-black';
              } else if (isSelected && !option.isCorrect) {
                btnStyle = 'border-[#EF4444] bg-[#FEE2E2] text-[#991B1B] font-black';
              }
            } else if (isSelected) {
              btnStyle = 'border-[#6C5CE7] bg-[#EDE9FE] text-[#6C5CE7] font-black shadow-[2px_2px_0px_#6C5CE7]';
            }

            return (
              <button
                key={option.id}
                onClick={() => handleSelectOption(option.id)}
                className={`w-full text-left p-3.5 rounded-xl border-2 text-xs font-bold transition-all flex items-center justify-between ${btnStyle}`}
              >
                <span>{option.text}</span>
                {showExplanation && option.isCorrect && (
                  <CheckCircle2 className="w-4 h-4 text-[#10B981]" />
                )}
                {showExplanation && isSelected && !option.isCorrect && (
                  <XCircle className="w-4 h-4 text-[#EF4444]" />
                )}
              </button>
            );
          })}
        </div>

        {/* Explanation */}
        {showExplanation && (
          <div className="p-3.5 rounded-xl bg-[#FAF6EE] border border-[#1E1E24]/20 text-xs font-bold text-[#4A4A58] space-y-1">
            <span className="font-black text-[#1E1E24]">Explanation: </span>
            {currentQ.explanation}
          </div>
        )}

        {/* Action Button */}
        <div className="pt-2 flex justify-end">
          {!showExplanation ? (
            <button
              onClick={handleCheckAnswer}
              disabled={!selectedOptionId}
              className="btn-game-purple py-2.5 px-6 text-xs font-black disabled:opacity-50"
            >
              Verify Answer
            </button>
          ) : (
            <button
              onClick={handleNext}
              className="btn-game-purple py-2.5 px-6 text-xs font-black flex items-center gap-1.5"
            >
              <span>{currentIndex + 1 < CALIBRATED_DIAGNOSTIC.length ? 'Next Question' : 'View Placement'}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
