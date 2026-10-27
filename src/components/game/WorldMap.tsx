// Dronacharya Interactive Game World Map
// Visual programming regions inspired by CodeDex with connected pathways, checkpoints, and real quest links
'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import {
  Compass,
  Lock,
  CheckCircle2,
  Play,
  Sparkles,
  ArrowRight,
  ShieldCheck,
  Star,
  Award,
  Zap,
  ChevronRight,
  Flame,
  X,
  Target,
} from 'lucide-react';

export interface WorldRegion {
  id: string;
  stageNumber: number;
  name: string;
  concept: string;
  tagline: string;
  accentColor: string;
  bgLight: string;
  borderColor: string;
  xpReward: number;
  missionId: string;
  status: 'completed' | 'active' | 'locked';
  story: string;
  objectives: string[];
  iconType: 'village' | 'valley' | 'lab' | 'forest' | 'fortress' | 'islands' | 'dungeon' | 'kingdom';
}

export const WORLD_REGIONS: WorldRegion[] = [
  {
    id: 'starter-village',
    stageNumber: 1,
    name: 'Starter Village',
    concept: 'Programming Fundamentals',
    tagline: 'First commands, output printing, and mathematical operators',
    accentColor: '#10B981',
    bgLight: '#D1FAE5',
    borderColor: '#059669',
    xpReward: 100,
    missionId: 'quest-starter',
    status: 'completed',
    story: 'Your journey begins at the Sacred Shrine of Dronacharya. Here, young apprentices attune their terminals to send their first signals into the digital realm.',
    objectives: [
      'Understand program flow and sequential execution',
      'Display output with print() statements',
      'Execute arithmetic operations on numeric values',
    ],
    iconType: 'village',
  },
  {
    id: 'variable-valley',
    stageNumber: 2,
    name: 'Variable Valley',
    concept: 'Variables & Data Containers',
    tagline: 'Memory registers, strings, integers, and state mutation',
    accentColor: '#3B82F6',
    bgLight: '#DBEAFE',
    borderColor: '#2563EB',
    xpReward: 120,
    missionId: 'quest-variables',
    status: 'completed',
    story: 'In the crystal caverns of Variable Valley, energy charges shift constantly. Master the art of binding values to named memory identifiers.',
    objectives: [
      'Declare and reassign variable identifiers',
      'Distinguish integers, floats, booleans, and text strings',
      'Perform string formatting and variable interpolation',
    ],
    iconType: 'valley',
  },
  {
    id: 'loop-lab',
    stageNumber: 3,
    name: 'Loop Lab',
    concept: 'Loops & Repetition',
    tagline: 'Iterate through sequences, range counters, and automate rover steps',
    accentColor: '#6C5CE7',
    bgLight: '#EDE9FE',
    borderColor: '#5843D8',
    xpReward: 150,
    missionId: 'mission-rescue-robot',
    status: 'active', // Active quest!
    story: 'The Clockwork Citadel operates on infinite automated gear cycles. The rover "Arya" is trapped in a maze and must be programmed using loops to reach the emergency extraction beacon.',
    objectives: [
      'Write for-loops using range(start, stop, step)',
      'Accumulate state across iterations',
      'Navigate the rover around obstacle barriers without depleting battery',
    ],
    iconType: 'lab',
  },
  {
    id: 'decision-forest',
    stageNumber: 4,
    name: 'Decision Forest',
    concept: 'Conditions & Boolean Logic',
    tagline: 'Branching logic, if/elif/else gates, and hazard filtering',
    accentColor: '#F59E0B',
    bgLight: '#FEF3C7',
    borderColor: '#D97706',
    xpReward: 150,
    missionId: 'mission-hazard-filter',
    status: 'active',
    story: 'A dense canopy of binary decision trees where every step splits into True or False branches. Decontaminate infected cells by filtering out negative charge specimens.',
    objectives: [
      'Evaluate truthiness with comparison operators (>, <, ==, !=)',
      'Combine conditions with and, or, and not',
      'Filter and quarantine contaminated specimen arrays',
    ],
    iconType: 'forest',
  },
  {
    id: 'function-fortress',
    stageNumber: 5,
    name: 'Function Fortress',
    concept: 'Modular Functions & Return Values',
    tagline: 'Encapsulate reusable logic, parameters, and return signatures',
    accentColor: '#EF4444',
    bgLight: '#FEE2E2',
    borderColor: '#DC2626',
    xpReward: 180,
    missionId: 'quest-functions',
    status: 'locked',
    story: 'The high bastion of architecture where wizards never repeat themselves. Forge modular subroutine spells that take inputs and yield purified results.',
    objectives: [
      'Define functions with def and formal parameters',
      'Return computed results with the return keyword',
      'Handle variable scope between local and global contexts',
    ],
    iconType: 'fortress',
  },
  {
    id: 'array-islands',
    stageNumber: 6,
    name: 'Array Islands',
    concept: 'Lists, Slicing & Collections',
    tagline: 'Ordered sequences, slicing, element mutation, and list algorithms',
    accentColor: '#00CEC9',
    bgLight: '#CCFBF1',
    borderColor: '#0F766E',
    xpReward: 200,
    missionId: 'quest-arrays',
    status: 'locked',
    story: 'An archipelago of interconnected data vaults floating in cyberspace. Organize player inventories, filter sequences, and extract nested loot tables.',
    objectives: [
      'Index and slice lists with [start:stop:step]',
      'Append, remove, and sort elements dynamically',
      'Transform collections using list comprehensions',
    ],
    iconType: 'islands',
  },
  {
    id: 'debugging-dungeon',
    stageNumber: 7,
    name: 'Debugging Dungeon',
    concept: 'Bug-to-Battle & Error Slaying',
    tagline: 'Hunt syntax beasts, trace stack frames, and squash runtime exceptions',
    accentColor: '#8B5CF6',
    bgLight: '#F3E8FF',
    borderColor: '#7C3AED',
    xpReward: 220,
    missionId: 'quest-debugging',
    status: 'locked',
    story: 'Beneath the gurukul lies the treacherous dungeon of unhandled bugs. Face the dreaded Off-By-One Basilisk and decipher cryptic error messages.',
    objectives: [
      'Read and interpret Python tracebacks and error types',
      'Identify and repair IndexError, TypeError, and NameError',
      'Implement defensive try/except guards',
    ],
    iconType: 'dungeon',
  },
  {
    id: 'project-kingdom',
    stageNumber: 8,
    name: 'Project Kingdom',
    concept: 'Capstone Practical Applications',
    tagline: 'Synthesize all knowledge into a complete playable software project',
    accentColor: '#F59E0B',
    bgLight: '#FEF3C7',
    borderColor: '#B45309',
    xpReward: 300,
    missionId: 'project-capstone',
    status: 'locked',
    story: 'The summit of achievement. Stand before Acharya Dronacharya and demonstrate full practical mastery by building an end-to-end coding artifact.',
    objectives: [
      'Architect multi-component software from problem specs',
      'Pass rigorous automated integration tests',
      'Mint a verifiable Mastery Seal for your portfolio',
    ],
    iconType: 'kingdom',
  },
];

// Custom SVGs for Game World Landmarks
function RegionIllustration({ type }: { type: WorldRegion['iconType'] }) {
  switch (type) {
    case 'village':
      return (
        <svg viewBox="0 0 64 64" className="w-12 h-12" fill="none">
          <rect x="8" y="24" width="48" height="32" rx="4" fill="#10B981" stroke="#1E1E24" strokeWidth="2.5" />
          <path d="M4 24L32 6L60 24H4Z" fill="#34D399" stroke="#1E1E24" strokeWidth="2.5" />
          <rect x="26" y="38" width="12" height="18" rx="2" fill="#FEF3C7" stroke="#1E1E24" strokeWidth="2" />
          <circle cx="32" cy="18" r="3" fill="#FBBF24" />
        </svg>
      );
    case 'valley':
      return (
        <svg viewBox="0 0 64 64" className="w-12 h-12" fill="none">
          <path d="M6 56L22 20L36 38L48 14L58 56H6Z" fill="#60A5FA" stroke="#1E1E24" strokeWidth="2.5" />
          <polygon points="32,24 38,34 32,44 26,34" fill="#FDE047" stroke="#1E1E24" strokeWidth="2" />
          <circle cx="48" cy="14" r="3" fill="#FFFFFF" />
        </svg>
      );
    case 'lab':
      return (
        <svg viewBox="0 0 64 64" className="w-12 h-12" fill="none">
          <rect x="12" y="14" width="40" height="42" rx="6" fill="#8B5CF6" stroke="#1E1E24" strokeWidth="2.5" />
          <circle cx="32" cy="32" r="10" fill="#FDE047" stroke="#1E1E24" strokeWidth="2" />
          <path d="M32 26V32L36 36" stroke="#1E1E24" strokeWidth="2.5" strokeLinecap="round" />
          <rect x="22" y="6" width="20" height="8" rx="2" fill="#6C5CE7" stroke="#1E1E24" strokeWidth="2" />
        </svg>
      );
    case 'forest':
      return (
        <svg viewBox="0 0 64 64" className="w-12 h-12" fill="none">
          <rect x="28" y="42" width="8" height="16" fill="#78350F" stroke="#1E1E24" strokeWidth="2" />
          <polygon points="32,10 52,32 12,32" fill="#10B981" stroke="#1E1E24" strokeWidth="2.5" />
          <polygon points="32,24 50,44 14,44" fill="#059669" stroke="#1E1E24" strokeWidth="2.5" />
        </svg>
      );
    case 'fortress':
      return (
        <svg viewBox="0 0 64 64" className="w-12 h-12" fill="none">
          <rect x="10" y="24" width="44" height="34" rx="2" fill="#EF4444" stroke="#1E1E24" strokeWidth="2.5" />
          <path d="M10 24L10 16L18 16L18 24L26 24L26 16L34 16L34 24L42 24L42 16L50 16L50 24" stroke="#1E1E24" strokeWidth="2.5" fill="#DC2626" />
          <path d="M26 58V40C26 36 38 36 38 40V58" fill="#FDE047" stroke="#1E1E24" strokeWidth="2" />
        </svg>
      );
    case 'islands':
      return (
        <svg viewBox="0 0 64 64" className="w-12 h-12" fill="none">
          <ellipse cx="32" cy="46" rx="26" ry="12" fill="#14B8A6" stroke="#1E1E24" strokeWidth="2.5" />
          <path d="M24 40C24 28 34 24 38 22" stroke="#78350F" strokeWidth="3" strokeLinecap="round" />
          <circle cx="38" cy="22" r="8" fill="#22C55E" stroke="#1E1E24" strokeWidth="2" />
        </svg>
      );
    case 'dungeon':
      return (
        <svg viewBox="0 0 64 64" className="w-12 h-12" fill="none">
          <path d="M10 54V28C10 16 54 16 54 28V54H10Z" fill="#4B5563" stroke="#1E1E24" strokeWidth="2.5" />
          <circle cx="24" cy="34" r="4" fill="#EF4444" stroke="#1E1E24" strokeWidth="1.5" />
          <circle cx="40" cy="34" r="4" fill="#EF4444" stroke="#1E1E24" strokeWidth="1.5" />
          <path d="M24 46H40" stroke="#1E1E24" strokeWidth="2.5" strokeLinecap="round" />
        </svg>
      );
    case 'kingdom':
      return (
        <svg viewBox="0 0 64 64" className="w-12 h-12" fill="none">
          <path d="M8 22L20 48H44L56 22L42 32L32 14L22 32L8 22Z" fill="#FBBF24" stroke="#1E1E24" strokeWidth="2.5" />
          <circle cx="32" cy="14" r="3" fill="#EF4444" />
          <circle cx="8" cy="22" r="3" fill="#3B82F6" />
          <circle cx="56" cy="22" r="3" fill="#10B981" />
          <rect x="18" y="48" width="28" height="6" rx="2" fill="#D97706" stroke="#1E1E24" strokeWidth="2" />
        </svg>
      );
  }
}

export function WorldMap() {
  const router = useRouter();
  const [selectedRegion, setSelectedRegion] = useState<WorldRegion | null>(null);

  return (
    <div className="w-full">
      {/* World Map Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8 bg-white border border-slate-200 rounded-2xl p-6">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#EDE9FE] border border-[#6C5CE7]/25 text-xs font-black text-[#6C5CE7] mb-2">
            <Compass className="w-3.5 h-3.5" />
            <span>Interactive World Map</span>
          </div>
          <h1 className="font-serif font-black text-2xl sm:text-3xl text-[#1E1E24]">
            Realm of Dronacharya: The Programming Odyssey
          </h1>
          <p className="text-xs sm:text-sm text-[#4A4A58] mt-1 max-w-2xl font-medium">
            Explore 8 connected coding lands. Write real code to command rovers, filter bio-data, and defeat programming challenges.
          </p>
        </div>

        {/* Global Progress Pill */}
        <div className="flex items-center gap-3 shrink-0">
          <div className="bg-[#FAF6EE] border border-slate-200 rounded-xl px-4 py-2.5 text-center">
            <span className="text-[10px] font-black uppercase tracking-wider text-[#7E7E8F] block">
              Quests Completed
            </span>
            <span className="font-serif font-black text-xl text-[#10B981]">
              2 / 8 Realms
            </span>
          </div>

          <div className="bg-[#FEF3C7] border border-amber-200 rounded-xl px-4 py-2.5 text-center">
            <span className="text-[10px] font-black uppercase tracking-wider text-[#D97706] block">
              Total XP Earned
            </span>
            <span className="font-serif font-black text-xl text-[#1E1E24]">
              220 XP
            </span>
          </div>
        </div>
      </div>

      {/* Grid of 8 Adventure Realms */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {WORLD_REGIONS.map((region) => {
          const isCompleted = region.status === 'completed';
          const isActive = region.status === 'active';
          const isLocked = region.status === 'locked';

          return (
            <div
              key={region.id}
              onClick={() => setSelectedRegion(region)}
              className={`relative rounded-2xl border p-5 transition-all cursor-pointer flex flex-col justify-between ${
                isActive
                  ? 'bg-white border-[#6C5CE7] ring-1 ring-[#6C5CE7]/30 hover:border-[#5843D8]'
                  : isCompleted
                  ? 'bg-[#F0FDF4] border-emerald-200 hover:border-emerald-300'
                  : 'bg-slate-50 border-slate-200 opacity-80 hover:opacity-100 hover:border-slate-300'
              }`}
            >
              {/* Active Player Pin Indicator */}
              {isActive && region.id === 'loop-lab' && (
                <div className="absolute -top-3.5 right-4 z-20 flex items-center gap-1.5 px-3 py-0.5 rounded-full bg-[#6C5CE7] text-white text-[10px] font-black border border-white animate-bobble">
                  <span className="w-2 h-2 rounded-full bg-[#FBBF24] animate-ping" />
                  <span>YOU ARE HERE</span>
                </div>
              )}

              <div>
                {/* Header: Stage Number & Status Pill */}
                <div className="flex items-center justify-between mb-3">
                  <span className="text-[10px] font-black uppercase tracking-wider px-2 py-0.5 rounded-md border border-slate-200 bg-white text-slate-700">
                    Stage {region.stageNumber}
                  </span>

                  {isCompleted ? (
                    <span className="inline-flex items-center gap-1 text-[11px] font-black text-[#10B981] bg-white px-2 py-0.5 rounded-full border border-emerald-200">
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      <span>Cleared</span>
                    </span>
                  ) : isActive ? (
                    <span className="inline-flex items-center gap-1 text-[11px] font-black text-[#6C5CE7] bg-[#EDE9FE] px-2 py-0.5 rounded-full border border-indigo-200">
                      <Play className="w-3 h-3 fill-[#6C5CE7]" />
                      <span>Playable</span>
                    </span>
                  ) : (
                    <span className="inline-flex items-center gap-1 text-[11px] font-bold text-[#7E7E8F] bg-slate-100 px-2 py-0.5 rounded-full border border-slate-200">
                      <Lock className="w-3 h-3" />
                      <span>Locked</span>
                    </span>
                  )}
                </div>

                {/* Illustrated Landmark Icon */}
                <div className="w-16 h-16 rounded-2xl border border-slate-200 flex items-center justify-center mb-3 bg-white">
                  <RegionIllustration type={region.iconType} />
                </div>

                {/* Title & Concept */}
                <h3 className="font-serif font-black text-lg text-[#1E1E24] leading-tight mb-1">
                  {region.name}
                </h3>
                <span className="text-xs font-bold text-[#6C5CE7] block mb-2">
                  {region.concept}
                </span>

                <p className="text-xs text-[#4A4A58] line-clamp-2 leading-relaxed">
                  {region.tagline}
                </p>
              </div>

              {/* Bottom Card Footer */}
              <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between">
                <span className="text-xs font-black text-amber-700 bg-amber-50 px-2 py-0.5 rounded-md border border-amber-200">
                  +{region.xpReward} XP
                </span>

                {isActive ? (
                  <Link
                    href={`/simulator?mission=${region.missionId}`}
                    onClick={(e) => e.stopPropagation()}
                    className="btn-game-purple text-xs py-1 px-3"
                  >
                    <span>Launch</span>
                    <ArrowRight className="w-3 h-3" />
                  </Link>
                ) : (
                  <button
                    onClick={() => setSelectedRegion(region)}
                    className="text-xs font-bold text-[#1E1E24] hover:underline flex items-center gap-0.5"
                  >
                    <span>Details</span>
                    <ChevronRight className="w-3.5 h-3.5" />
                  </button>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Selected Region Codex Modal / Drawer (Only displays when user clicks a region) */}
      {selectedRegion && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
          <div className="relative w-full max-w-xl bg-white border border-slate-200 rounded-2xl p-6 sm:p-8 animate-in zoom-in-95">
            {/* Close button */}
            <button
              onClick={() => setSelectedRegion(null)}
              className="absolute top-4 right-4 p-1.5 rounded-lg border border-slate-200 bg-slate-100 text-[#1E1E24] hover:bg-slate-200 transition-colors"
            >
              <X className="w-4 h-4" />
            </button>

            {/* Modal Header */}
            <div className="flex items-start gap-4 mb-5">
              <div className="w-16 h-16 rounded-2xl border border-slate-200 flex items-center justify-center shrink-0 bg-[#FAF6EE]">
                <RegionIllustration type={selectedRegion.iconType} />
              </div>
              <div>
                <span className="text-[10px] font-black uppercase tracking-wider px-2 py-0.5 rounded-md border border-indigo-200 bg-[#EDE9FE] text-[#6C5CE7]">
                  Stage {selectedRegion.stageNumber} • {selectedRegion.concept}
                </span>
                <h2 className="font-serif font-black text-2xl text-[#1E1E24] mt-1">
                  {selectedRegion.name}
                </h2>
                <p className="text-xs text-[#7E7E8F] font-bold">
                  Reward: +{selectedRegion.xpReward} Mastery XP
                </p>
              </div>
            </div>

            {/* Story Lore */}
            <div className="bg-[#FAF6EE] border border-slate-200 rounded-xl p-4 mb-5">
              <span className="text-[10px] font-black uppercase tracking-wider text-[#D97706] block mb-1">
                Mission Lore & Background
              </span>
              <p className="text-xs text-[#1E1E24] leading-relaxed font-medium">
                {selectedRegion.story}
              </p>
            </div>

            {/* Learning Objectives */}
            <div className="mb-6">
              <h4 className="text-xs font-black uppercase tracking-wider text-[#1E1E24] mb-2 flex items-center gap-1.5">
                <Target className="w-4 h-4 text-[#6C5CE7]" />
                Practical Skills Taught
              </h4>
              <ul className="space-y-2">
                {selectedRegion.objectives.map((obj, i) => (
                  <li key={i} className="flex items-start gap-2 text-xs text-[#4A4A58]">
                    <span className="w-4 h-4 rounded-full bg-[#10B981] text-white flex items-center justify-center text-[10px] font-black shrink-0 mt-0.5">
                      ✓
                    </span>
                    <span>{obj}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Action Bar */}
            <div className="flex items-center justify-between pt-4 border-t border-slate-200">
              <button
                onClick={() => setSelectedRegion(null)}
                className="btn-game-white text-xs py-2 px-4"
              >
                Close Codex
              </button>

              {selectedRegion.status !== 'locked' ? (
                <Link
                  href={`/simulator?mission=${selectedRegion.missionId}`}
                  className="btn-game-purple text-xs py-2.5 px-6"
                >
                  <Play className="w-4 h-4 fill-white" />
                  <span>Enter {selectedRegion.name} Simulator</span>
                </Link>
              ) : (
                <div className="text-xs font-bold text-[#7E7E8F] flex items-center gap-1">
                  <Lock className="w-4 h-4" />
                  <span>Complete Stage {selectedRegion.stageNumber - 1} to Unlock</span>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
