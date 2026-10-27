// Adaptive Diagnostic Assessment: The Archery Trial of Drona
'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useDronacharya } from '@/lib/store';
import { DIAGNOSTIC_QUESTIONS } from '@/lib/data/curriculum';
import {
  Target,
  ArrowRight,
  CheckCircle2,
  XCircle,
  HelpCircle,
  Sparkles,
  Award,
} from 'lucide-react';

export default function DiagnosticPage() {
  const router = useRouter();
  const { state, completeOnboarding } = useDronacharya();

  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedOptionId, setSelectedOptionId] = useState<string | null>(null);
  const [showExplanation, setShowExplanation] = useState(false);
  const [correctAnswersCount, setCorrectAnswersCount] = useState(0);
  const [isFinished, setIsFinished] = useState(false);

  const currentQ = DIAGNOSTIC_QUESTIONS[currentIndex];

  const handleSelectOption = (optId: string) => {
    if (showExplanation) return;
    setSelectedOptionId(optId);
  };

  const handleCheckAnswer = () => {
    if (!selectedOptionId) return;
    const selectedOption = currentQ.options.find((o) => o.id === selectedOptionId);
    if (selectedOption?.isCorrect) {
      setCorrectAnswersCount((prev) => prev + 1);
    }
    setShowExplanation(true);
  };

  const handleNext = () => {
    if (currentIndex + 1 < DIAGNOSTIC_QUESTIONS.length) {
      setCurrentIndex((prev) => prev + 1);
      setSelectedOptionId(null);
      setShowExplanation(false);
    } else {
      setIsFinished(true);
    }
  };

  const handleCompleteTrial = () => {
    // Calculate initial mastery score based on performance
    const initialSkillScore = 0.25 + (correctAnswersCount / DIAGNOSTIC_QUESTIONS.length) * 0.45;
    completeOnboarding(state.user.targetTrack, state.user.preferredLanguage, initialSkillScore);
    router.push('/dashboard');
  };

  if (isFinished) {
    const accuracy = Math.round((correctAnswersCount / DIAGNOSTIC_QUESTIONS.length) * 100);
    return (
      <div className="max-w-xl mx-auto px-4 py-16 text-center">
        <div className="w-16 h-16 mx-auto rounded-2xl bg-[#FBBF24] border-2 border-[#1E1E24] text-[#1E1E24] shadow-[4px_4px_0px_#1E1E24] flex items-center justify-center mb-4">
          <Award className="w-8 h-8" />
        </div>
        <h2 className="font-black text-3xl sm:text-4xl text-[#1E1E24]">
          Diagnostic Trial Completed!
        </h2>
        <p className="text-sm text-[#4A4A58] font-bold mt-2">
          Your initial baseline has been recorded into the Bayesian Knowledge Tracing ledger.
        </p>

        <div className="my-6 p-6 rounded-2xl bg-white border-2 border-[#1E1E24] shadow-[4px_4px_0px_#1E1E24] grid grid-cols-2 gap-4">
          <div>
            <div className="text-xs text-[#4A4A58] font-black uppercase tracking-wider">Calibration Score</div>
            <div className="font-black text-3xl text-[#6C5CE7] mt-1">{accuracy}%</div>
          </div>
          <div>
            <div className="text-xs text-[#4A4A58] font-black uppercase tracking-wider">Starting Mastery</div>
            <div className="font-black text-3xl text-[#10B981] mt-1">
              {accuracy >= 66 ? 'Intermediate' : 'Foundational'}
            </div>
          </div>
        </div>

        <button
          onClick={handleCompleteTrial}
          className="btn-game-yellow w-full py-3.5 text-sm font-black shadow-[4px_4px_0px_#1E1E24] flex items-center justify-center gap-2"
        >
          <span>Enter Player Dashboard</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto px-4 py-12">
      {/* Trial Header */}
      <div className="flex items-center justify-between border-b-2 border-[#1E1E24] pb-4 mb-8">
        <div>
          <div className="flex items-center gap-2 text-xs font-black text-[#6C5CE7] uppercase tracking-wider">
            <Target className="w-4 h-4" />
            <span>The Archery Trial of Drona</span>
          </div>
          <h1 className="font-black text-2xl text-[#1E1E24] mt-1">
            Question {currentIndex + 1} of {DIAGNOSTIC_QUESTIONS.length}
          </h1>
        </div>
        <div className="text-xs text-[#4A4A58] font-mono font-bold bg-[#FAF6EE] px-2.5 py-1 rounded-lg border border-[#1E1E24]">
          Skill: {currentQ.skillId}
        </div>
      </div>

      {/* Question Card */}
      <div className="card-game mb-6">
        <h2 className="font-black text-lg text-[#1E1E24]">
          {currentQ.title}
        </h2>
        <p className="text-sm text-[#4A4A58] font-bold mt-2 leading-relaxed">
          {currentQ.prompt}
        </p>

        {currentQ.codeSnippet && (
          <div className="mt-3 p-3.5 rounded-xl bg-[#141419] text-[#FAF6EE] font-mono text-xs border-2 border-[#1E1E24]">
            <pre>{currentQ.codeSnippet}</pre>
          </div>
        )}

        {/* Options Grid */}
        <div className="mt-5 space-y-2.5">
          {currentQ.options.map((opt) => {
            const isSelected = selectedOptionId === opt.id;
            let optStyle = 'bg-white border-2 border-[#1E1E24] hover:bg-[#FAF6EE] shadow-[2px_2px_0px_#1E1E24]';

            if (isSelected) {
              optStyle = 'bg-[#FBBF24] border-2 border-[#1E1E24] shadow-[3px_3px_0px_#1E1E24] font-black';
            }

            if (showExplanation) {
              if (opt.isCorrect) {
                optStyle = 'bg-[#10B981] text-white border-2 border-[#1E1E24] font-black shadow-[3px_3px_0px_#1E1E24]';
              } else if (isSelected && !opt.isCorrect) {
                optStyle = 'bg-[#EF4444] text-white border-2 border-[#1E1E24] line-through shadow-[3px_3px_0px_#1E1E24]';
              }
            }

            return (
              <div
                key={opt.id}
                onClick={() => handleSelectOption(opt.id)}
                className={`p-3.5 rounded-xl text-xs cursor-pointer transition-all flex items-start gap-3 ${optStyle}`}
              >
                <span className="w-5 h-5 rounded-md border-2 border-current flex items-center justify-center font-black text-[10px] shrink-0 mt-0.5">
                  {opt.id.toUpperCase()}
                </span>
                <span className="flex-1 font-bold">{opt.text}</span>
              </div>
            );
          })}
        </div>

        {/* Socratic Feedback & Explanation */}
        {showExplanation && (
          <div className="mt-5 p-3.5 rounded-xl bg-[#FAF6EE] border-2 border-[#1E1E24] text-xs font-bold leading-relaxed text-[#1E1E24] shadow-[3px_3px_0px_#1E1E24] animate-in fade-in duration-150">
            <div className="font-black text-[#6C5CE7] flex items-center gap-1.5 mb-1">
              <Sparkles className="w-3.5 h-3.5 text-[#FBBF24]" />
              <span>Acharya Explanation:</span>
            </div>
            <p className="text-[#4A4A58]">{currentQ.explanation}</p>
          </div>
        )}
      </div>

      {/* Bottom Action Controls */}
      <div className="flex items-center justify-between">
        <div className="text-xs text-[#4A4A58] font-bold">
          Progress: {currentIndex + 1} / {DIAGNOSTIC_QUESTIONS.length}
        </div>

        {!showExplanation ? (
          <button
            onClick={handleCheckAnswer}
            disabled={!selectedOptionId}
            className="btn-game-yellow text-xs py-2.5 px-6 font-black shadow-[3px_3px_0px_#1E1E24] disabled:opacity-40"
          >
            Check Answer
          </button>
        ) : (
          <button
            onClick={handleNext}
            className="btn-game-purple text-xs py-2.5 px-6 font-black shadow-[3px_3px_0px_#1E1E24] flex items-center gap-1.5"
          >
            <span>{currentIndex + 1 < DIAGNOSTIC_QUESTIONS.length ? 'Next Question' : 'Complete Trial'}</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        )}
      </div>
    </div>
  );
}
