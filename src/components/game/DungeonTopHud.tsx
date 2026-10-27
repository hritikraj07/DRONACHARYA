// Dronacharya Code Dungeon & Craft Realm: Top HUD Bar, Inventory Hotbar & Quest Tracker
'use client';

import React from 'react';
import {
  Heart,
  Sparkles,
  Volume2,
  VolumeX,
  ChevronDown,
  Award,
  Layers,
  Wrench,
  CheckCircle2,
  Circle,
  Shield,
  Pickaxe,
} from 'lucide-react';
import {
  DungeonInventory,
  DungeonFloorSpec,
} from '@/lib/simulator/dungeon-engine';
import { DungeonSound } from '@/lib/simulator/audio-synth';

interface DungeonTopHudProps {
  floorSpec: DungeonFloorSpec;
  currentFloor: number;
  onSelectFloor: (floor: number) => void;
  hp: number;
  maxHp?: number;
  xp: number;
  level: number;
  inventory: DungeonInventory;
  completedGoals: Record<string, boolean>;
  onOpenCraftingModal: () => void;
  isMuted: boolean;
  onToggleMute: () => void;
}

export function DungeonTopHud({
  floorSpec,
  currentFloor,
  onSelectFloor,
  hp,
  maxHp = 3,
  xp,
  level,
  inventory,
  completedGoals,
  onOpenCraftingModal,
  isMuted,
  onToggleMute,
}: DungeonTopHudProps) {
  const currentLevelProgress = Math.min(100, Math.round(((xp % 200) / 200) * 100));

  return (
    <div className="w-full space-y-3 select-none">
      {/* 1. Main Top Stats & Inventory Ribbon */}
      <div className="card-game p-3 sm:p-4 bg-white border-2 border-[#1E1E24] shadow-[4px_4px_0px_#1E1E24] flex flex-wrap items-center justify-between gap-3">
        {/* Left: Player Level & Hearts */}
        <div className="flex items-center gap-3">
          {/* Level Badge */}
          <div className="flex items-center gap-2 bg-[#FEF3C7] border-2 border-[#1E1E24] px-3 py-1.5 rounded-xl shadow-[2px_2px_0px_#1E1E24]">
            <span className="text-base">🧙‍♂️</span>
            <div>
              <span className="text-[9px] font-black uppercase text-[#D97706] block leading-none">
                Apprentice
              </span>
              <span className="font-serif font-black text-xs sm:text-sm text-[#1E1E24]">
                Lv. {level}
              </span>
            </div>
          </div>

          {/* XP Bar */}
          <div className="hidden md:flex flex-col w-32 sm:w-40">
            <div className="flex justify-between text-[10px] font-bold text-[#4A4A58] mb-1">
              <span>XP Progress</span>
              <span>{xp} XP</span>
            </div>
            <div className="w-full h-2.5 bg-slate-100 rounded-full border border-[#1E1E24] overflow-hidden">
              <div
                className="h-full bg-[#10B981] transition-all duration-300 rounded-full"
                style={{ width: `${currentLevelProgress}%` }}
              />
            </div>
          </div>

          {/* Hearts Counter */}
          <div
            className={`flex items-center gap-1 bg-[#FEE2E2] border-2 border-[#1E1E24] px-3 py-1.5 rounded-xl shadow-[2px_2px_0px_#1E1E24] ${
              hp < maxHp ? 'animate-bounce' : ''
            }`}
          >
            {Array.from({ length: maxHp }).map((_, i) => (
              <span
                key={`heart-${i}`}
                className={`text-base transition-transform ${
                  i < hp ? 'scale-110 drop-shadow-xs' : 'opacity-25 grayscale'
                }`}
              >
                ❤️
              </span>
            ))}
            <span className="font-serif font-black text-xs text-[#DC2626] ml-1">
              {hp}/{maxHp}
            </span>
          </div>
        </div>

        {/* Center: Minecraft-Style Inventory Hotbar Dock */}
        <div className="flex items-center gap-1.5 bg-[#2D2A32] p-1.5 rounded-xl border-2 border-[#1E1E24] shadow-[2px_2px_0px_#1E1E24]">
          {/* Wood */}
          <div
            className="w-10 h-10 rounded-lg bg-[#3F3B45] border border-[#1E1E24] flex flex-col items-center justify-center relative group"
            title={`Wood: ${inventory.wood}`}
          >
            <span className="text-sm">🪵</span>
            <span className="absolute bottom-0 right-0.5 text-[9px] font-mono font-black text-amber-300">
              {inventory.wood}
            </span>
          </div>

          {/* Stone */}
          <div
            className="w-10 h-10 rounded-lg bg-[#3F3B45] border border-[#1E1E24] flex flex-col items-center justify-center relative group"
            title={`Stone: ${inventory.stone}`}
          >
            <span className="text-sm">🪨</span>
            <span className="absolute bottom-0 right-0.5 text-[9px] font-mono font-black text-slate-300">
              {inventory.stone}
            </span>
          </div>

          {/* Iron */}
          <div
            className="w-10 h-10 rounded-lg bg-[#3F3B45] border border-[#1E1E24] flex flex-col items-center justify-center relative group"
            title={`Iron: ${inventory.iron}`}
          >
            <span className="text-sm">⛏️</span>
            <span className="absolute bottom-0 right-0.5 text-[9px] font-mono font-black text-orange-400">
              {inventory.iron}
            </span>
          </div>

          {/* Crystal */}
          <div
            className="w-10 h-10 rounded-lg bg-[#3F3B45] border border-[#1E1E24] flex flex-col items-center justify-center relative group"
            title={`Crystal: ${inventory.crystal}`}
          >
            <span className="text-sm">💎</span>
            <span className="absolute bottom-0 right-0.5 text-[9px] font-mono font-black text-cyan-300">
              {inventory.crystal}
            </span>
          </div>

          {/* Bridge */}
          <div
            className="w-10 h-10 rounded-lg bg-[#3F3B45] border border-[#1E1E24] flex flex-col items-center justify-center relative group"
            title={`Bridges: ${inventory.bridge}`}
          >
            <span className="text-sm">🌉</span>
            <span className="absolute bottom-0 right-0.5 text-[9px] font-mono font-black text-emerald-300">
              {inventory.bridge}
            </span>
          </div>

          {/* Key / Blade */}
          <div
            className="w-10 h-10 rounded-lg bg-[#3F3B45] border border-[#1E1E24] flex flex-col items-center justify-center relative group"
            title={inventory.key > 0 ? `Keys: ${inventory.key}` : `Blade: ${inventory.blade}`}
          >
            <span className="text-sm">{inventory.key > 0 ? '🔑' : '🗡️'}</span>
            <span className="absolute bottom-0 right-0.5 text-[9px] font-mono font-black text-yellow-300">
              {inventory.key > 0 ? inventory.key : inventory.blade}
            </span>
          </div>

          {/* Craft Modal Trigger Button */}
          <button
            onClick={onOpenCraftingModal}
            className="btn-arcade text-[10px] py-1.5 px-2.5 btn-arcade-yellow flex items-center gap-1 shadow-none ml-1 cursor-pointer"
            title="Open Crafting & Recipe Book"
          >
            <Wrench className="w-3 h-3" />
            <span className="hidden sm:inline">Craft</span>
          </button>
        </div>

        {/* Right: Sound Mute & Floor Navigation Dropdown */}
        <div className="flex items-center gap-2">
          {/* Audio Mute Button */}
          <button
            onClick={onToggleMute}
            className="w-9 h-9 rounded-xl bg-white border-2 border-[#1E1E24] shadow-[2px_2px_0px_#1E1E24] flex items-center justify-center text-[#1E1E24] hover:bg-slate-100 cursor-pointer"
            title={isMuted ? 'Unmute 8-Bit Retro Audio' : 'Mute Audio'}
          >
            {isMuted ? (
              <VolumeX className="w-4 h-4 text-slate-400" />
            ) : (
              <Volume2 className="w-4 h-4 text-[#10B981]" />
            )}
          </button>

          {/* Floor Switcher Selector */}
          <div className="flex items-center gap-1 bg-[#FAF6EE] p-1 rounded-xl border-2 border-[#1E1E24]">
            {[1, 2, 3, 4].map((f) => (
              <button
                key={`floor-btn-${f}`}
                onClick={() => onSelectFloor(f)}
                className={`px-2.5 py-1 text-xs font-black rounded-lg transition-all cursor-pointer ${
                  currentFloor === f
                    ? 'bg-[#6C5CE7] text-white shadow-xs'
                    : 'text-[#4A4A58] hover:bg-white'
                }`}
              >
                F{f}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* 2. Quest Objective & Sub-Goals Banner */}
      <div className="card-game p-3 sm:p-4 bg-[#EDE9FE] border-2 border-[#1E1E24] shadow-[3px_3px_0px_#1E1E24] flex flex-col md:flex-row items-start md:items-center justify-between gap-3">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="text-[10px] font-black uppercase text-[#6C5CE7] bg-white px-2 py-0.5 rounded border border-[#6C5CE7]/30">
              Floor {currentFloor} • {floorSpec.realmName}
            </span>
            <span className="text-[10px] font-black text-[#D97706] bg-[#FEF3C7] px-2 py-0.5 rounded border border-[#D97706]/30">
              +{floorSpec.xpReward} XP
            </span>
          </div>
          <h2 className="font-serif font-black text-sm sm:text-base text-[#1E1E24]">
            {floorSpec.title}
          </h2>
          <p className="text-xs text-[#4A4A58] max-w-2xl">{floorSpec.story}</p>
        </div>

        {/* Live Sub-Goals Tracker */}
        <div className="bg-white p-2.5 rounded-xl border border-[#1E1E24]/20 shadow-xs w-full md:w-auto shrink-0 space-y-1">
          <span className="text-[10px] font-black uppercase text-[#7E7E8F] block mb-1">
            Floor Objectives:
          </span>
          <div className="space-y-1">
            {floorSpec.subGoals.map((goal) => {
              const isDone = Boolean(completedGoals[goal.id]);
              return (
                <div
                  key={goal.id}
                  className="flex items-center gap-1.5 text-[11px] font-bold"
                >
                  {isDone ? (
                    <CheckCircle2 className="w-3.5 h-3.5 text-[#10B981] shrink-0" />
                  ) : (
                    <Circle className="w-3.5 h-3.5 text-slate-300 shrink-0" />
                  )}
                  <span className={isDone ? 'line-through text-slate-400' : 'text-[#1E1E24]'}>
                    {goal.label}
                  </span>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
