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
} from 'lucide-react';

export default function AchievementsPage() {
  const { state } = useDronacharya();

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-10 w-full">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-[#D8CFC0] pb-6 mb-8">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-0.5 rounded-full bg-[#E9DFC9] border border-[#B49A65] text-xs font-semibold text-[#7A6230] mb-2">
            <Award className="w-3.5 h-3.5 text-[#B49A65]" />
            <span>Proof of Skill Gallery</span>
          </div>
          <h1 className="font-serif font-bold text-3xl sm:text-4xl text-[#252820]">
            Mastery Seals & Credentials
          </h1>
          <p className="text-sm text-[#575A51] mt-1">
            Unlike superficial badges, Dronacharya seals are cryptographically minted upon passing rigorous automated unit tests.
          </p>
        </div>

        <div className="text-right">
          <div className="text-xs text-[#7E8276]">Seals Earned</div>
          <div className="font-serif font-bold text-2xl text-[#B49A65]">
            {state.seals.filter((s) => s.isUnlocked).length} / {state.seals.length}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {state.seals.map((seal) => (
          <div
            key={seal.id}
            className={`p-6 rounded-xl border transition-all flex flex-col justify-between ${
              seal.isUnlocked
                ? 'bg-[#FBF8F2] border-[#B49A65] shadow-md ring-1 ring-[#B49A65]/40'
                : 'bg-[#F0EAE1]/50 border-[#D8CFC0] opacity-60'
            }`}
          >
            <div>
              <div className="flex items-center justify-between mb-4">
                <span className="text-3xl">{seal.isUnlocked ? '🌟' : '🔒'}</span>
                <span
                  className={`text-[10px] font-semibold uppercase tracking-wider px-2 py-0.5 rounded ${
                    seal.isUnlocked
                      ? 'bg-[#E2E8E3] text-[#354B3A]'
                      : 'bg-[#D8CFC0] text-[#7E8276]'
                  }`}
                >
                  {seal.isUnlocked ? 'Verified Active' : 'Locked'}
                </span>
              </div>

              <span className="text-[11px] font-semibold text-[#A65F43] uppercase tracking-wider">
                {seal.category}
              </span>
              <h2 className="font-serif font-bold text-lg text-[#252820] mt-1">
                {seal.title}
              </h2>
              <p className="text-xs text-[#575A51] mt-2 leading-relaxed">
                {seal.description}
              </p>
            </div>

            <div className="mt-6 pt-4 border-t border-[#D8CFC0]/60">
              {seal.isUnlocked ? (
                <div className="text-[10px] font-mono text-[#7E8276] truncate">
                  SHA-256 Proof: {seal.verificationHash.slice(0, 24)}...
                </div>
              ) : (
                <Link
                  href="/simulator"
                  className="text-xs text-[#354B3A] font-semibold hover:underline flex items-center gap-1"
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
