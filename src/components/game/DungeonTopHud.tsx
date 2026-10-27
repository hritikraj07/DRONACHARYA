// Dronacharya Code Dungeon: Top RPG Progression HUD & Campaign Level Navigator
'use client';

import React from 'react';
import {
  Sparkles,
  Volume2,
  VolumeX,
  ChevronDown,
  Award,
  CheckCircle2,
  Circle,
  Shield,
  Heart,
  Flame,
  Star,
} from 'lucide-react';
import {
  DungeonCampaignLevel,
  DUNGEON_CAMPAIGN_LEVELS,
} from '@/lib/simulator/dungeon-engine';

interface DungeonTopHudProps {
  currentLevel: DungeonCampaignLevel;
  levelNumber: number;
  onSelectLevel: (lvl: number) => void;
  hp: number;
  maxHp?: number;
  xp: number;
  playerLevel: number;
  gemsCount: number;
  streak?: number;
  completedGoals: Record<string, boolean>;
  isMuted: boolean;
  onToggleMute: () => void;
  levelStars?: Record<number, number>;
}

export function DungeonTopHud({
  currentLevel,
  levelNumber,
  onSelectLevel,
  hp,
  maxHp = 100,
  xp,
  playerLevel,
  gemsCount,
  streak = 3,
  completedGoals,
  isMuted,
  onToggleMute,
  levelStars = {},
}: DungeonTopHudProps) {
  const currentLevelProgress = Math.min(100, Math.round(((xp % 200) / 200) * 100));
  const healthPercent = Math.max(0, Math.min(100, (hp / maxHp) * 100));

  return (
    <div className="w-full space-y-3 select-none">
      {/* 1. Main Ribbon: Player Stats, Hearts, Gems & Audio */}
      <div className="card-game p-3 sm:p-4 bg-white border-2 border-[#1E1E24] shadow-[4px_4px_0px_#1E1E24] flex flex-wrap items-center justify-between gap-3">
        {/* Left: Player Badge & Level */}
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2 bg-[#FEF3C7] border-2 border-[#1E1E24] px-3 py-1.5 rounded-xl shadow-[2px_2px_0px_#1E1E24]">
            <span className="text-lg">🧙‍♂️</span>
            <div>
              <span className="text-[9px] font-black uppercase text-[#D97706] block leading-none">
                Python Guild
              </span>
              <span className="font-serif font-black text-xs sm:text-sm text-[#1E1E24]">
                Lv. {playerLevel}
              </span>
            </div>
          </div>

          {/* XP Progress Bar */}
          <div className="hidden md:flex flex-col w-28 sm:w-36">
            <div className="flex justify-between text-[10px] font-bold text-[#4A4A58] mb-0.5">
              <span>Guild XP</span>
              <span className="font-mono">{xp} XP</span>
            </div>
            <div className="w-full h-2.5 bg-slate-100 rounded-full border border-[#1E1E24] overflow-hidden">
              <div
                className="h-full bg-[#10B981] transition-all duration-300 rounded-full"
                style={{ width: `${currentLevelProgress}%` }}
              />
            </div>
          </div>

          {/* Health Bar (100 HP) */}
          <div className="flex flex-col w-28 sm:w-36">
            <div className="flex justify-between text-[10px] font-bold text-[#4A4A58] mb-0.5">
              <span className="flex items-center gap-1 text-[#EF4444]">
                <Heart className="w-3 h-3 fill-current" /> HP
              </span>
              <span className="font-mono text-[#EF4444] font-black">
                {hp}/{maxHp}
              </span>
            </div>
            <div className="w-full h-2.5 bg-slate-100 rounded-full border border-[#1E1E24] overflow-hidden">
              <div
                className={`h-full transition-all duration-300 rounded-full ${
                  healthPercent > 50
                    ? 'bg-[#10B981]'
                    : healthPercent > 25
                    ? 'bg-[#F59E0B]'
                    : 'bg-[#EF4444] animate-pulse'
                }`}
                style={{ width: `${healthPercent}%` }}
              />
            </div>
          </div>
        </div>

        {/* Center: Campaign Level Selector Dropdown */}
        <div className="flex items-center gap-2">
          <div className="relative">
            <select
              value={levelNumber}
              onChange={(e) => onSelectLevel(Number(e.target.value))}
              aria-label="Select Python Chronicles Level"
              className="appearance-none bg-[#FAF6EE] border-2 border-[#1E1E24] font-serif font-black text-xs sm:text-sm text-[#1E1E24] pl-3 pr-8 py-2 rounded-xl shadow-[2px_2px_0px_#1E1E24] cursor-pointer hover:bg-white focus:outline-none"
            >
              {Object.values(DUNGEON_CAMPAIGN_LEVELS).map((lvl) => {
                const stars = levelStars[lvl.levelNumber] || 0;
                const starStr = stars > 0 ? ` (${'★'.repeat(stars)})` : '';
                return (
                  <option key={`lvl-${lvl.levelNumber}`} value={lvl.levelNumber}>
                    Level {lvl.levelNumber}: {lvl.title} {starStr}
                  </option>
                );
              })}
            </select>
            <ChevronDown className="w-4 h-4 text-[#1E1E24] absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
          </div>
        </div>

        {/* Right: Mana Gems, Streak, Audio Mute */}
        <div className="flex items-center gap-2 sm:gap-3">
          {/* Gems counter */}
          <div className="flex items-center gap-1.5 bg-[#E0F2FE] border-2 border-[#1E1E24] px-2.5 py-1.5 rounded-xl shadow-[2px_2px_0px_#1E1E24]">
            <span className="text-sm">💎</span>
            <span className="font-mono font-black text-xs text-[#0284C7]">
              {gemsCount}
            </span>
          </div>

          {/* Streak */}
          <div className="hidden sm:flex items-center gap-1 bg-[#FEF3C7] border-2 border-[#1E1E24] px-2.5 py-1.5 rounded-xl shadow-[2px_2px_0px_#1E1E24]">
            <Flame className="w-3.5 h-3.5 text-[#F59E0B] fill-current" />
            <span className="font-mono font-black text-xs text-[#D97706]">
              {streak}d
            </span>
          </div>

          {/* Sound Mute Toggle */}
          <button
            onClick={onToggleMute}
            className="p-2 rounded-xl border-2 border-[#1E1E24] bg-white hover:bg-black/5 shadow-[2px_2px_0px_#1E1E24] transition-transform active:translate-y-0.5"
            title={isMuted ? 'Unmute game sounds' : 'Mute game sounds'}
          >
            {isMuted ? (
              <VolumeX className="w-4 h-4 text-[#94A3B8]" />
            ) : (
              <Volume2 className="w-4 h-4 text-[#6C5CE7]" />
            )}
          </button>
        </div>
      </div>

      {/* 2. Quest Objectives Checklist Ribbon */}
      <div className="card-game p-3 bg-[#FAF6EE] border-2 border-[#1E1E24] shadow-[3px_3px_0px_#1E1E24] rounded-xl flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <Award className="w-4 h-4 text-[#F59E0B]" />
          <div>
            <span className="text-xs font-black uppercase text-[#1E1E24] mr-2">
              Level {levelNumber}: {currentLevel.title}
            </span>
            <span className="text-[11px] font-mono text-[#6C5CE7] font-semibold hidden md:inline">
              [{currentLevel.subtitle}]
            </span>
          </div>
        </div>

        {/* Dynamic Goal Checkpoints */}
        <div className="flex flex-wrap items-center gap-2">
          {currentLevel.objectives.map((obj) => {
            const isCompleted = completedGoals[obj.id] || false;
            return (
              <span
                key={obj.id}
                className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-bold border transition-colors ${
                  isCompleted
                    ? 'bg-[#D1FAE5] text-[#065F46] border-[#059669]'
                    : 'bg-white text-[#4A4A58] border-[#1E1E24]/30'
                }`}
              >
                {isCompleted ? (
                  <CheckCircle2 className="w-3 h-3 text-[#059669]" />
                ) : (
                  <Circle className="w-3 h-3 text-[#94A3B8]" />
                )}
                <span>{obj.label}</span>
              </span>
            );
          })}
        </div>
      </div>
    </div>
  );
}
