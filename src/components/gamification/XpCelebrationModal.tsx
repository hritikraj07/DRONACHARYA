// Dronacharya XP & Mastery Seal Celebration Modal
'use client';

import React, { useEffect } from 'react';
import confetti from 'canvas-confetti';
import { MasterySeal } from '@/types';
import { Award, CheckCircle2, ArrowRight } from 'lucide-react';

interface XpCelebrationModalProps {
  isOpen: boolean;
  onClose: () => void;
  earnedXp: number;
  awardedSeal?: MasterySeal;
  onContinue: () => void;
}

export function XpCelebrationModal({
  isOpen,
  onClose,
  earnedXp,
  awardedSeal,
  onContinue,
}: XpCelebrationModalProps) {
  useEffect(() => {
    if (isOpen) {
      // Trigger subtle, tasteful brass/forest green confetti
      confetti({
        particleCount: 40,
        spread: 60,
        origin: { y: 0.7 },
        colors: ['#354B3A', '#B49A65', '#A65F43', '#E9DFC9'],
      });
    }
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-[#252820]/40 backdrop-blur-xs transition-opacity"
        onClick={onClose}
      />

      {/* Modal Dialog */}
      <div className="relative w-full max-w-md bg-[#F6F1E7] border-2 border-[#B49A65] rounded-xl shadow-2xl p-6 text-center z-10 animate-in zoom-in-95 duration-200">
        <div className="w-16 h-16 mx-auto rounded-full bg-[#E2E8E3] text-[#354B3A] flex items-center justify-center mb-4">
          <CheckCircle2 className="w-9 h-9" />
        </div>

        <h2 className="font-serif font-bold text-2xl text-[#252820]">
          Trial Completed!
        </h2>
        <p className="text-xs text-[#575A51] mt-1">
          You demonstrated conceptual understanding and passed all unit test cases.
        </p>

        {/* XP Awarded Banner */}
        <div className="my-5 p-4 rounded-lg bg-[#E9DFC9]/60 border border-[#D8CFC0] flex items-center justify-center gap-3">
          <Award className="w-6 h-6 text-[#B49A65]" />
          <div className="text-left">
            <div className="font-serif font-bold text-xl text-[#354B3A]">
              +{earnedXp} Mastery XP
            </div>
            <div className="text-[11px] text-[#7E8276]">Added to Gurukul Ledger</div>
          </div>
        </div>

        {/* Seal Unlocked (if any) */}
        {awardedSeal && (
          <div className="p-3.5 mb-5 rounded-lg bg-[#FAF4F0] border border-[#B49A65] text-left">
            <div className="flex items-center gap-2 text-xs font-semibold text-[#A65F43] uppercase tracking-wider mb-1">
              <span>🌟</span> Cryptographic Seal Minted
            </div>
            <div className="font-serif font-bold text-sm text-[#252820]">
              {awardedSeal.title}
            </div>
            <p className="text-[11px] text-[#575A51] mt-0.5">{awardedSeal.description}</p>
            <div className="mt-2 text-[10px] text-[#7E8276] font-mono truncate">
              Proof Hash: {awardedSeal.verificationHash.slice(0, 24)}...
            </div>
          </div>
        )}

        <div className="flex items-center gap-3 mt-6">
          <button
            onClick={onClose}
            className="flex-1 btn-secondary text-xs py-2.5"
          >
            Review Code
          </button>
          <button
            onClick={onContinue}
            className="flex-1 btn-primary text-xs py-2.5 flex items-center justify-center gap-2"
          >
            <span>Next Mission</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
}
