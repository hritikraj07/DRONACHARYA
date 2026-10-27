// Dronacharya Code Dungeon & Craft Realm: Victory & Mastery Seal Award Modal
'use client';

import React, { useEffect } from 'react';
import Link from 'next/link';
import confetti from 'canvas-confetti';
import {
  Trophy,
  Sparkles,
  ArrowRight,
  Shield,
  RotateCcw,
  CheckCircle2,
  Award,
} from 'lucide-react';
import { DungeonFloorSpec } from '@/lib/simulator/dungeon-engine';

interface DungeonVictoryModalProps {
  isOpen: boolean;
  floorSpec: DungeonFloorSpec;
  floorNumber: number;
  xpEarned: number;
  totalXp: number;
  onNextFloor: () => void;
  onReplayFloor: () => void;
  isArchitectSealUnlocked?: boolean;
}

export function DungeonVictoryModal({
  isOpen,
  floorSpec,
  floorNumber,
  xpEarned,
  totalXp,
  onNextFloor,
  onReplayFloor,
  isArchitectSealUnlocked,
}: DungeonVictoryModalProps) {
  useEffect(() => {
    if (isOpen) {
      // Fire confetti cannon
      confetti({
        particleCount: 80,
        spread: 70,
        origin: { y: 0.6 },
        colors: ['#FBBF24', '#6C5CE7', '#10B981', '#38BDF8'],
      });
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const isFinalFloor = floorNumber === 4;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs select-none">
      <div className="relative w-full max-w-lg bg-[#FAF6EE] border-4 border-[#1E1E24] rounded-2xl shadow-[8px_8px_0px_#1E1E24] p-6 text-center animate-in fade-in zoom-in-95 duration-200">
        {/* Trophy Header Icon */}
        <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-[#FEF3C7] border-3 border-[#1E1E24] shadow-[4px_4px_0px_#1E1E24] flex items-center justify-center text-3xl animate-bounce">
          🏆
        </div>

        <span className="text-xs font-black uppercase text-[#D97706] tracking-wider bg-[#FEF3C7] px-3 py-1 rounded-full border border-[#D97706]/40 inline-block mb-2">
          Floor {floorNumber} Conquered!
        </span>

        <h2 className="font-serif font-black text-2xl sm:text-3xl text-[#1E1E24] mb-2">
          {floorSpec.title} Cleared!
        </h2>

        <p className="text-xs sm:text-sm text-[#4A4A58] mb-6">
          Apprentice, your logic has tamed the dungeon blocks and pierced the ancient portals.
        </p>

        {/* XP Award & Stats Card */}
        <div className="card-game p-4 bg-white border-2 border-[#1E1E24] shadow-[3px_3px_0px_#1E1E24] mb-6 flex items-center justify-around">
          <div>
            <span className="text-[10px] font-black uppercase text-[#059669] block">
              XP Awarded
            </span>
            <span className="font-serif font-black text-2xl text-[#10B981]">
              +{xpEarned} XP
            </span>
          </div>

          <div className="w-px h-10 bg-[#1E1E24]/20" />

          <div>
            <span className="text-[10px] font-black uppercase text-[#6C5CE7] block">
              Total Gurukul XP
            </span>
            <span className="font-serif font-black text-2xl text-[#1E1E24]">
              {totalXp}
            </span>
          </div>
        </div>

        {/* Final Boss Cleared: Dungeon Architect Seal Award! */}
        {isFinalFloor && (
          <div className="card-game p-4 bg-[#EDE9FE] border-2 border-[#1E1E24] shadow-[4px_4px_0px_#1E1E24] mb-6 text-left flex items-center gap-4">
            <div className="w-14 h-14 rounded-2xl bg-[#6C5CE7] border-2 border-[#1E1E24] shadow-[2px_2px_0px_#1E1E24] flex items-center justify-center text-3xl text-white shrink-0 animate-pulse">
              🛡️
            </div>
            <div>
              <div className="flex items-center gap-1.5 text-xs font-black uppercase text-[#6C5CE7]">
                <Sparkles className="w-3.5 h-3.5" />
                <span>Dungeon Trophy Unlocked!</span>
              </div>
              <h3 className="font-serif font-black text-base text-[#1E1E24]">
                Dungeon Architect Trophy
              </h3>
              <p className="text-[11px] text-[#4A4A58]">
                Conquered all 4 Code Dungeon &amp; Craft Floors. Verifiable on your public portfolio!
              </p>
            </div>
          </div>
        )}

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
          <button
            onClick={onReplayFloor}
            className="w-full sm:w-auto btn-arcade text-xs py-2.5 px-4 btn-arcade-white flex items-center justify-center gap-1.5 cursor-pointer"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Replay Floor</span>
          </button>

          {!isFinalFloor ? (
            <button
              onClick={onNextFloor}
              className="w-full sm:w-auto btn-arcade text-xs py-2.5 px-5 btn-arcade-yellow flex items-center justify-center gap-1.5 shadow-[3px_3px_0px_#1E1E24] cursor-pointer"
            >
              <span>Next Dungeon Floor</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          ) : (
            <Link
              href="/dashboard"
              className="w-full sm:w-auto btn-arcade text-xs py-2.5 px-5 btn-arcade-purple flex items-center justify-center gap-1.5 shadow-[3px_3px_0px_#1E1E24] cursor-pointer"
            >
              <span>Return to Quest Hub</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          )}
        </div>
      </div>
    </div>
  );
}
