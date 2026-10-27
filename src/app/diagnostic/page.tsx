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
        <div className="w-16 h-16 mx-auto rounded-full bg-[#E2E8E3] text-[#354B3A] flex items-center justify-center mb-4">
          <Award className="w-8 h-8" />
        </div>
        <h2 className="font-serif font-bold text-3xl text-[#252820]">
          Diagnostic Trial Completed!
        </h2>
        <p className="text-sm text-[#575A51] mt-2">
          Your initial baseline has been recorded into the Bayesian Knowledge Tracing ledger.
        </p>

        <div className="my-6 p-5 rounded-lg bg-[#E9DFC9]/60 border border-[#D8CFC0] grid grid-cols-2 gap-4">
          <div>
            <div className="text-xs text-[#7E8276] uppercase tracking-wider">Calibration Score</div>
            <div className="font-serif font-bold text-2xl text-[#354B3A] mt-1">{accuracy}%</div>
          </div>
          <div>
            <div className="text-xs text-[#7E8276] uppercase tracking-wider">Starting Mastery</div>
            <div className="font-serif font-bold text-2xl text-[#B49A65] mt-1">
              {accuracy >= 66 ? 'Intermediate' : 'Foundational'}
            </div>
          </div>
        </div>

        <button
          onClick={handleCompleteTrial}
          className="btn-primary w-full py-3 text-sm shadow-md flex items-center justify-center gap-2"
        >
          <span>Enter Courtyard Dashboard</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto px-4 py-12">
      {/* Trial Header */}
      <div className="flex items-center justify-between border-b border-[#D8CFC0] pb-4 mb-8">
        <div>
          <div className="flex items-center gap-2 text-xs font-semibold text-[#A65F43] uppercase tracking-wider">
            <Target className="w-4 h-4" />
            <span>The Archery Trial of Drona</span>
          </div>
          <h1 className="font-serif font-bold text-2xl text-[#252820] mt-1">
            Question {currentIndex + 1} of {DIAGNOSTIC_QUESTIONS.length}
          </h1>
        </div>
        <div className="text-xs text-[#7E8276] font-mono">
          Skill: {currentQ.skillId}
        </div>
      </div>

      {/* Question Card */}
      <div className="card-ivory mb-6">
        <h2 className="font-serif font-bold text-lg text-[#252820]">
          {currentQ.title}
        </h2>
        <p className="text-sm text-[#575A51] mt-2 leading-relaxed">
          {currentQ.prompt}
        </p>

        {currentQ.codeSnippet && (
          <div className="mt-3 p-3 rounded bg-[#252820] text-[#E9DFC9] font-mono text-xs">
            <pre>{currentQ.codeSnippet}</pre>
          </div>
        )}

        {/* Options Grid */}
        <div className="mt-5 space-y-2.5">
          {currentQ.options.map((opt) => {
            const isSelected = selectedOptionId === opt.id;
            let optStyle = 'bg-white border-[#D8CFC0] hover:bg-[#F6F1E7]';

            if (isSelected) {
              optStyle = 'bg-[#E9DFC9] border-[#354B3A] ring-1 ring-[#354B3A]';
            }

            if (showExplanation) {
              if (opt.isCorrect) {
                optStyle = 'bg-[#E2E8E3] border-[#354B3A] text-[#354B3A] font-semibold';
              } else if (isSelected && !opt.isCorrect) {
                optStyle = 'bg-[#FAF4F0] border-[#A65F43] text-[#A65F43] line-through';
              }
            }

            return (
              <div
                key={opt.id}
                onClick={() => handleSelectOption(opt.id)}
                className={`p-3.5 rounded-lg border text-xs cursor-pointer transition-all flex items-start gap-3 ${optStyle}`}
              >
                <span className="w-5 h-5 rounded-full border border-current flex items-center justify-center font-bold text-[10px] shrink-0 mt-0.5">
                  {opt.id.toUpperCase()}
                </span>
                <span className="flex-1">{opt.text}</span>
              </div>
            );
          })}
        </div>

        {/* Socratic Feedback & Explanation */}
        {showExplanation && (
          <div className="mt-5 p-3.5 rounded-lg bg-[#F0EAE1] border border-[#D8CFC0] text-xs leading-relaxed text-[#252820] animate-in fade-in duration-150">
            <div className="font-semibold text-[#354B3A] flex items-center gap-1.5 mb-1">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Acharya Explanation:</span>
            </div>
            <p>{currentQ.explanation}</p>
          </div>
        )}
      </div>

      {/* Bottom Action Controls */}
      <div className="flex items-center justify-between">
        <div className="text-xs text-[#7E8276]">
          Progress: {currentIndex + 1} / {DIAGNOSTIC_QUESTIONS.length}
        </div>

        {!showExplanation ? (
          <button
            onClick={handleCheckAnswer}
            disabled={!selectedOptionId}
            className="btn-primary text-xs py-2.5 px-5 disabled:opacity-40"
          >
            Check Answer
          </button>
        ) : (
          <button
            onClick={handleNext}
            className="btn-primary text-xs py-2.5 px-5 flex items-center gap-1.5"
          >
            <span>{currentIndex + 1 < DIAGNOSTIC_QUESTIONS.length ? 'Next Question' : 'Complete Trial'}</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        )}
      </div>
    </div>
  );
}
