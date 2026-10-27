// Dronacharya Code Dungeon: Interactive 3-Star Victory Modal
'use client';

import React, { useEffect } from 'react';
import confetti from 'canvas-confetti';
import {
  Trophy,
  Sparkles,
  ArrowRight,
  RotateCcw,
  Star,
  CheckCircle2,
  Code2,
} from 'lucide-react';
import { DungeonCampaignLevel } from '@/lib/simulator/dungeon-engine';

interface DungeonVictoryModalProps {
  isOpen: boolean;
  level: DungeonCampaignLevel;
  levelNumber: number;
  xpEarned: number;
  totalXp: number;
  starsEarned: 1 | 2 | 3;
  codeLines: number;
  parLines: number;
  onNextLevel: () => void;
  onReplayLevel: () => void;
}

export function DungeonVictoryModal({
  isOpen,
  level,
  levelNumber,
  xpEarned,
  totalXp,
  starsEarned = 3,
  codeLines,
  parLines,
  onNextLevel,
  onReplayLevel,
}: DungeonVictoryModalProps) {
  useEffect(() => {
    if (isOpen) {
      confetti({
        particleCount: 90,
        spread: 80,
        origin: { y: 0.6 },
        colors: ['#FBBF24', '#6C5CE7', '#10B981', '#38BDF8'],
      });
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const isFinalLevel = levelNumber === 5;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs select-none">
      <div className="relative w-full max-w-lg bg-[#FAF6EE] border-4 border-[#1E1E24] rounded-2xl shadow-[8px_8px_0px_#1E1E24] p-6 text-center animate-in fade-in zoom-in-95 duration-200">
        {/* Trophy Header Icon */}
        <div className="w-16 h-16 mx-auto mb-3 rounded-2xl bg-[#FEF3C7] border-3 border-[#1E1E24] shadow-[4px_4px_0px_#1E1E24] flex items-center justify-center text-3xl animate-bounce">
          🏆
        </div>

        <span className="text-xs font-black uppercase text-[#D97706] tracking-wider bg-[#FEF3C7] px-3 py-1 rounded-full border border-[#D97706]/40 inline-block mb-2">
          Level {levelNumber} Conquered!
        </span>

        <h2 className="font-serif font-black text-2xl sm:text-3xl text-[#1E1E24] mb-1">
          {level.title} Cleared!
        </h2>

        <p className="text-xs sm:text-sm text-[#4A4A58] mb-4">
          Your Python script brought the Hero to victory through logic, sensors, and loops.
        </p>

        {/* 3-Star Rating Showcase */}
        <div className="card-game p-3 bg-white border-2 border-[#1E1E24] shadow-[3px_3px_0px_#1E1E24] mb-4 flex flex-col items-center gap-1.5">
          <div className="flex items-center gap-2">
            {[1, 2, 3].map((starIdx) => (
              <Star
                key={`star-${starIdx}`}
                className={`w-8 h-8 transition-all duration-300 ${
                  starIdx <= starsEarned
                    ? 'text-[#FBBF24] fill-[#FBBF24] drop-shadow-[0_0_8px_rgba(251,191,36,0.6)] scale-110'
                    : 'text-slate-200 fill-slate-200'
                }`}
              />
            ))}
          </div>

          <div className="flex items-center gap-3 text-xs font-mono font-bold mt-1">
            <span className="text-[#059669]">
              {starsEarned === 3
                ? '⭐⭐⭐ Perfect 3-Star Master!'
                : starsEarned === 2
                ? '⭐⭐ 2-Star Code Adept!'
                : '⭐ 1-Star Cleared!'}
            </span>
            <span className="text-[#64748B]">|</span>
            <span
              className={`flex items-center gap-1 ${
                codeLines <= parLines ? 'text-[#059669]' : 'text-[#D97706]'
              }`}
            >
              <Code2 className="w-3.5 h-3.5" />
              Lines: {codeLines} / Par: {parLines}
            </span>
          </div>
        </div>

        {/* XP Award & Stats Card */}
        <div className="card-game p-3 bg-white border-2 border-[#1E1E24] shadow-[3px_3px_0px_#1E1E24] mb-6 flex items-center justify-around">
          <div>
            <span className="text-[10px] font-black uppercase text-[#059669] block">
              XP Earned
            </span>
            <span className="font-serif font-black text-2xl text-[#10B981]">
              +{xpEarned} XP
            </span>
          </div>

          <div className="w-px h-10 bg-[#1E1E24]/20" />

          <div>
            <span className="text-[10px] font-black uppercase text-[#6C5CE7] block">
              Total Guild XP
            </span>
            <span className="font-serif font-black text-2xl text-[#1E1E24]">
              {totalXp}
            </span>
          </div>
        </div>

        {/* Buttons: Next Quest vs Replay */}
        <div className="flex items-center justify-center gap-3">
          <button
            onClick={onReplayLevel}
            className="btn-arcade text-xs py-2.5 px-4 btn-arcade-white flex items-center gap-1.5 shadow-[3px_3px_0px_#1E1E24]"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Optimize Code</span>
          </button>

          {!isFinalLevel ? (
            <button
              onClick={onNextLevel}
              className="btn-arcade text-xs py-2.5 px-6 btn-arcade-green text-[#1E1E24] font-black flex items-center gap-1.5 shadow-[3px_3px_0px_#1E1E24]"
            >
              <span>Next Quest</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          ) : (
            <button
              onClick={onReplayLevel}
              className="btn-arcade text-xs py-2.5 px-6 btn-arcade-yellow text-[#1E1E24] font-black flex items-center gap-1.5 shadow-[3px_3px_0px_#1E1E24]"
            >
              <Sparkles className="w-4 h-4" />
              <span>Grand Champion!</span>
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
