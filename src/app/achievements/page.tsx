// Mastery Seals & Achievements Gallery
'use client';

import React from 'react';
import Link from 'next/link';
import { useDronacharya } from '@/lib/store';
import {
  Award,
  ShieldCheck,
  Lock,
  CheckCircle2,
  Sparkles,
  ExternalLink,
  Flame,
  Zap,
} from 'lucide-react';

export default function AchievementsPage() {
  const { state } = useDronacharya();

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-10 w-full">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b-2 border-[#1E1E24] pb-6 mb-8">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#FBBF24] border-2 border-[#1E1E24] shadow-[2px_2px_0px_#1E1E24] text-xs font-black text-[#1E1E24] mb-2">
            <Award className="w-3.5 h-3.5 text-[#1E1E24]" />
            <span>Proof of Skill Gallery</span>
          </div>
          <h1 className="font-black text-3xl sm:text-4xl text-[#1E1E24]">
            Mastery Seals & Badges
          </h1>
          <p className="text-sm text-[#4A4A58] font-bold mt-1">
            Unlike superficial checkboxes, Dronacharya seals are cryptographically minted upon passing rigorous automated unit tests.
          </p>
        </div>

        <div className="p-3.5 rounded-xl bg-white border-2 border-[#1E1E24] shadow-[3px_3px_0px_#1E1E24] text-right">
          <div className="text-[10px] text-[#4A4A58] font-black uppercase tracking-wider">Seals Unlocked</div>
          <div className="font-black text-2xl text-[#6C5CE7]">
            {state.seals.filter((s) => s.isUnlocked).length} / {state.seals.length}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {state.seals.map((seal) => (
          <div
            key={seal.id}
            className={`p-6 rounded-2xl border-2 border-[#1E1E24] transition-all flex flex-col justify-between ${
              seal.isUnlocked
                ? 'bg-white shadow-[4px_4px_0px_#1E1E24]'
                : 'bg-[#F2ECE0]/60 opacity-60 shadow-[2px_2px_0px_#1E1E24]'
            }`}
          >
            <div>
              <div className="flex items-center justify-between mb-4">
                <span className="text-3xl">{seal.isUnlocked ? '🌟' : '🔒'}</span>
                <span
                  className={`text-[10px] font-black uppercase tracking-wider px-2.5 py-1 rounded-lg border-2 border-[#1E1E24] ${
                    seal.isUnlocked
                      ? 'bg-[#10B981] text-white shadow-[2px_2px_0px_#1E1E24]'
                      : 'bg-[#FAF6EE] text-[#4A4A58]'
                  }`}
                >
                  {seal.isUnlocked ? 'Verified Active' : 'Locked'}
                </span>
              </div>

              <span className="text-[11px] font-black text-[#6C5CE7] uppercase tracking-wider">
                {seal.category}
              </span>
              <h2 className="font-black text-lg text-[#1E1E24] mt-1">
                {seal.title}
              </h2>
              <p className="text-xs text-[#4A4A58] font-bold mt-2 leading-relaxed">
                {seal.description}
              </p>
            </div>

            <div className="mt-6 pt-4 border-t-2 border-[#1E1E24]">
              {seal.isUnlocked ? (
                <div className="text-[10px] font-mono text-[#4A4A58] font-bold truncate">
                  SHA-256 Proof: {seal.verificationHash.slice(0, 24)}...
                </div>
              ) : (
                <Link
                  href="/simulator?mission=mission-rescue-robot"
                  className="btn-game-purple text-xs py-1.5 px-3 flex items-center justify-center gap-1 shadow-[2px_2px_0px_#1E1E24]"
                >
                  <span>Pass Mission to Unlock →</span>
                </Link>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
