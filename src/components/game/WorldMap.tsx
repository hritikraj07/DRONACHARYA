// Dronacharya Interactive Course World Map
// Authentic RPG Overworld Game Map for each respective curriculum track (Python, HTML, CSS, JavaScript)
// Matches website theme with warm parchment, neo-brutalist arcade styling, connected adventure trails, and single-click quest launching.
'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { COURSES_CATALOG, Course, Chapter } from '@/lib/data/course-system';
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
  BookOpen,
  MapPin,
  Code2,
  Globe,
  Palette,
  Terminal,
} from 'lucide-react';

interface StageWaypoint {
  id: string;
  chapterNumber: number;
  title: string;
  realmName: string;
  conceptName: string;
  description: string;
  color: string;
  iconName: string;
  xpReward: number;
  lessonsCount: number;
  firstLessonId: string;
  status: 'completed' | 'active' | 'locked';
  storyIntro?: string;
  objectives: string[];
}

export function WorldMap() {
  const [selectedCourseId, setSelectedCourseId] = useState<string>('python');
  const [selectedStage, setSelectedStage] = useState<StageWaypoint | null>(null);

  // Available interactive tracks
  const availableCourses = COURSES_CATALOG.filter((c) => c.isAvailable);
  const currentCourse =
    availableCourses.find((c) => c.id === selectedCourseId) || availableCourses[0];

  // Map chapters into sequential game waypoints
  const waypoints: StageWaypoint[] = (currentCourse.chapters || []).map((ch, idx) => {
    // First stage completed, second active, others locked for guest preview
    const status: 'completed' | 'active' | 'locked' =
      idx === 0 ? 'completed' : idx === 1 ? 'active' : 'locked';

    const firstLesson = ch.lessons && ch.lessons[0];
    const totalXp = (ch.lessons || []).reduce((acc, l) => acc + (l.xpReward || 30), 0) + 50;

    return {
      id: ch.id,
      chapterNumber: ch.chapterNumber,
      title: ch.title,
      realmName: ch.realmName || `Realm ${ch.chapterNumber}`,
      conceptName: ch.conceptName || ch.title,
      description: ch.description,
      color: ch.color || currentCourse.themeColor || '#6C5CE7',
      iconName: ch.iconName,
      xpReward: totalXp,
      lessonsCount: (ch.lessons || []).length,
      firstLessonId: firstLesson?.id || `${currentCourse.id}-less-1-1`,
      status,
      storyIntro: firstLesson?.storyIntro || ch.description,
      objectives: (ch.lessons || []).map((l) => l.subtitle || l.title),
    };
  });

  const clearedCount = waypoints.filter((w) => w.status === 'completed').length;
  const totalWaypoints = waypoints.length;
  const totalXpEarned = waypoints
    .filter((w) => w.status === 'completed')
    .reduce((acc, w) => acc + w.xpReward, 0);

  return (
    <div className="w-full space-y-6">
      {/* =========================================================================
          COURSE SELECTOR TABS (Respective Course Map Switcher)
         ========================================================================= */}
      <div className="bg-[#FAF6EE] border-2 border-[#1E1E24] rounded-2xl p-3 sm:p-4 shadow-[4px_4px_0px_#1E1E24]">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <Compass className="w-5 h-5 text-[#6C5CE7]" />
            <span className="font-serif font-black text-sm text-[#1E1E24] uppercase tracking-wider">
              Select Curriculum Realm:
            </span>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            {availableCourses.map((c) => {
              const isSelected = c.id === currentCourse.id;
              return (
                <button
                  key={c.id}
                  onClick={() => {
                    setSelectedCourseId(c.id);
                    setSelectedStage(null);
                  }}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-black border-2 border-[#1E1E24] transition-all cursor-pointer ${
                    isSelected
                      ? 'bg-[#FFD214] text-[#1E1E24] shadow-[2px_2px_0px_#1E1E24] scale-105'
                      : 'bg-white text-[#4A4A58] hover:bg-[#FAF6EE] hover:text-[#1E1E24] shadow-[1px_1px_0px_#1E1E24]'
                  }`}
                >
                  {c.id === 'python' && <span>🐍</span>}
                  {c.id === 'html' && <span>🌐</span>}
                  {c.id === 'css' && <span>🎨</span>}
                  {c.id === 'javascript' && <span>⚡</span>}
                  <span>{c.title.split(':')[0]}</span>
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* =========================================================================
          WORLD MAP HERO BOARD (Matches Website Theme & BG)
         ========================================================================= */}
      <div className="relative bg-[#FAF6EE] border-2 border-[#1E1E24] rounded-3xl p-6 sm:p-8 shadow-[6px_6px_0px_#1E1E24] overflow-hidden">
        {/* Subtle Retro Map Grid & Topographic Ambient Background */}
        <div
          className="absolute inset-0 opacity-15 pointer-events-none"
          style={{
            backgroundImage:
              'radial-gradient(#1E1E24 1.5px, transparent 1.5px), radial-gradient(#6C5CE7 1px, transparent 1px)',
            backgroundSize: '24px 24px',
            backgroundPosition: '0 0, 12px 12px',
          }}
        />

        {/* Floating Decorative RPG Scenery Landmarks */}
        <div className="absolute top-4 right-6 opacity-30 select-none pointer-events-none text-4xl hidden sm:block">
          ⛰️ 🏰 🌲
        </div>
        <div className="absolute bottom-4 left-6 opacity-30 select-none pointer-events-none text-3xl hidden sm:block">
          🏕️ 🌳 📜
        </div>

        {/* Map Header */}
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-4 border-b-2 border-[#1E1E24] pb-6 mb-8">
          <div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#EDE9FE] border-2 border-[#1E1E24] text-xs font-black text-[#6C5CE7] shadow-[2px_2px_0px_#1E1E24] mb-2">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Interactive Adventure Map</span>
            </div>
            <h1 className="font-serif font-black text-2xl sm:text-3xl text-[#1E1E24]">
              {currentCourse.title}: Overworld Trail
            </h1>
            <p className="text-xs sm:text-sm text-[#4A4A58] font-bold mt-1 max-w-2xl">
              {currentCourse.tagline} Follow the sequential milestone trail to conquer every coding quest.
            </p>
          </div>

          {/* Stats Badges */}
          <div className="flex items-center gap-3 shrink-0">
            <div className="bg-white border-2 border-[#1E1E24] rounded-xl px-4 py-2 shadow-[2px_2px_0px_#1E1E24] text-center">
              <span className="text-[10px] font-black uppercase tracking-wider text-[#4A4A58] block">
                Cleared Stages
              </span>
              <span className="font-serif font-black text-lg text-[#00B894]">
                {clearedCount} / {totalWaypoints}
              </span>
            </div>

            <div className="bg-[#FEF3C7] border-2 border-[#1E1E24] rounded-xl px-4 py-2 shadow-[2px_2px_0px_#1E1E24] text-center">
              <span className="text-[10px] font-black uppercase tracking-wider text-[#D97706] block">
                Earned XP
              </span>
              <span className="font-serif font-black text-lg text-[#1E1E24]">
                {totalXpEarned} XP
              </span>
            </div>
          </div>
        </div>

        {/* =========================================================================
            CONNECTED ROADMAP TRAIL (Curved SVG Road & Sequential Milestones)
           ========================================================================= */}
        <div className="relative z-10 space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 relative">
            {waypoints.map((waypoint, index) => {
              const isCompleted = waypoint.status === 'completed';
              const isActive = waypoint.status === 'active';
              const isLocked = waypoint.status === 'locked';

              return (
                <div
                  key={waypoint.id}
                  onClick={() => setSelectedStage(waypoint)}
                  className={`relative rounded-2xl border-2 border-[#1E1E24] p-5 transition-all cursor-pointer flex flex-col justify-between ${
                    isActive
                      ? 'bg-white shadow-[6px_6px_0px_#6C5CE7] ring-2 ring-[#6C5CE7] scale-[1.02]'
                      : isCompleted
                      ? 'bg-emerald-50/80 shadow-[4px_4px_0px_#00B894] hover:bg-emerald-50'
                      : 'bg-white/70 shadow-[3px_3px_0px_#1E1E24] opacity-85 hover:opacity-100 hover:bg-white'
                  }`}
                >
                  {/* "YOU ARE HERE" Animated Mascot Pin for Active Stage */}
                  {isActive && (
                    <div className="absolute -top-3.5 right-3 z-20 flex items-center gap-1.5 px-3 py-0.5 rounded-full bg-[#6C5CE7] text-white text-[10px] font-black border-2 border-[#1E1E24] shadow-[2px_2px_0px_#1E1E24] animate-bounce">
                      <span className="w-2 h-2 rounded-full bg-[#FFD214] animate-ping" />
                      <span>YOU ARE HERE</span>
                    </div>
                  )}

                  <div>
                    {/* Top Stage Bar */}
                    <div className="flex items-center justify-between mb-3">
                      <span className="text-[10px] font-black uppercase tracking-wider px-2.5 py-0.5 rounded-lg border-2 border-[#1E1E24] bg-[#FAF6EE] text-[#1E1E24] shadow-[1px_1px_0px_#1E1E24]">
                        Stage {waypoint.chapterNumber}
                      </span>

                      {isCompleted ? (
                        <span className="inline-flex items-center gap-1 text-[11px] font-black text-emerald-800 bg-emerald-100 px-2 py-0.5 rounded-full border border-emerald-400">
                          <CheckCircle2 className="w-3.5 h-3.5" />
                          <span>Cleared</span>
                        </span>
                      ) : isActive ? (
                        <span className="inline-flex items-center gap-1 text-[11px] font-black text-purple-900 bg-purple-100 px-2 py-0.5 rounded-full border border-purple-400">
                          <Play className="w-3 h-3 fill-current" />
                          <span>In Progress</span>
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 text-[11px] font-bold text-gray-500 bg-gray-100 px-2 py-0.5 rounded-full border border-gray-300">
                          <Lock className="w-3 h-3" />
                          <span>Locked</span>
                        </span>
                      )}
                    </div>

                    {/* Landmark Icon Avatar */}
                    <div
                      className="w-14 h-14 rounded-2xl border-2 border-[#1E1E24] flex items-center justify-center mb-3 shadow-[2px_2px_0px_#1E1E24] text-2xl"
                      style={{ backgroundColor: waypoint.color + '25' }}
                    >
                      {currentCourse.id === 'python' && (
                        <span>{index === 0 ? '🏕️' : index === 1 ? '🌲' : index === 2 ? '🌀' : index === 3 ? '🏰' : '🤖'}</span>
                      )}
                      {currentCourse.id === 'html' && (
                        <span>{index === 0 ? '🌱' : index === 1 ? '⚓' : '🏛️'}</span>
                      )}
                      {currentCourse.id === 'css' && (
                        <span>{index === 0 ? '🎨' : index === 1 ? '📦' : '📐'}</span>
                      )}
                      {currentCourse.id === 'javascript' && (
                        <span>{index === 0 ? '📜' : index === 1 ? '⚡' : '🔮'}</span>
                      )}
                    </div>

                    {/* Realm Name & Concept */}
                    <h3 className="font-serif font-black text-base text-[#1E1E24] leading-tight mb-1">
                      {waypoint.realmName}
                    </h3>
                    <span className="text-xs font-bold text-[#6C5CE7] block mb-2">
                      {waypoint.conceptName}
                    </span>

                    <p className="text-xs text-[#4A4A58] line-clamp-2 leading-relaxed">
                      {waypoint.description}
                    </p>
                  </div>

                  {/* Stage Bottom Footer */}
                  <div className="mt-4 pt-3 border-t-2 border-[#1E1E24]/20 flex items-center justify-between">
                    <span className="text-[11px] font-black text-amber-800 bg-amber-100 px-2 py-0.5 rounded-md border border-amber-300">
                      +{waypoint.xpReward} XP
                    </span>

                    {isActive || isCompleted ? (
                      <Link
                        href={`/learn/${waypoint.firstLessonId}`}
                        className="inline-flex items-center gap-1 text-xs font-black bg-[#6C5CE7] hover:bg-[#5A4AD1] text-white px-3 py-1 rounded-xl border-2 border-[#1E1E24] shadow-[2px_2px_0px_#1E1E24] transition-all hover:scale-105 active:scale-95"
                      >
                        <span>Play</span>
                        <ArrowRight className="w-3 h-3" />
                      </Link>
                    ) : (
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          setSelectedStage(waypoint);
                        }}
                        className="text-xs font-bold text-[#1E1E24] hover:underline flex items-center gap-0.5"
                      >
                        <span>Inspect</span>
                        <ChevronRight className="w-3.5 h-3.5" />
                      </button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* =========================================================================
          STAGE CODEX MODAL (Direct 1-Click Launch & Story Lore)
         ========================================================================= */}
      {selectedStage && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div
            className="fixed inset-0 bg-[#090A0F]/60 backdrop-blur-xs transition-opacity"
            onClick={() => setSelectedStage(null)}
          />
          <div className="relative w-full max-w-lg bg-[#FAF6EE] border-2 border-[#1E1E24] rounded-2xl p-6 sm:p-7 shadow-[8px_8px_0px_#1E1E24] z-10 animate-in zoom-in-95 duration-150">
            {/* Close Button */}
            <button
              onClick={() => setSelectedStage(null)}
              className="absolute top-4 right-4 p-1.5 rounded-xl border-2 border-[#1E1E24] bg-white hover:bg-rose-100 text-[#1E1E24] shadow-[2px_2px_0px_#1E1E24] transition-colors"
            >
              <X className="w-4 h-4" />
            </button>

            {/* Modal Header */}
            <div className="flex items-start gap-4 mb-4">
              <div
                className="w-14 h-14 rounded-2xl border-2 border-[#1E1E24] flex items-center justify-center shrink-0 shadow-[2px_2px_0px_#1E1E24] text-3xl"
                style={{ backgroundColor: selectedStage.color + '25' }}
              >
                🏕️
              </div>
              <div>
                <span className="text-[10px] font-black uppercase tracking-wider px-2 py-0.5 rounded-md border border-[#1E1E24] bg-[#EDE9FE] text-[#6C5CE7]">
                  Stage {selectedStage.chapterNumber} • {selectedStage.conceptName}
                </span>
                <h2 className="font-serif font-black text-2xl text-[#1E1E24] mt-1">
                  {selectedStage.realmName}
                </h2>
                <p className="text-xs text-emerald-700 font-bold">
                  +{selectedStage.xpReward} XP • {selectedStage.lessonsCount} Quests
                </p>
              </div>
            </div>

            {/* Story Lore */}
            <div className="bg-white border-2 border-[#1E1E24] rounded-xl p-4 mb-4 shadow-[2px_2px_0px_#1E1E24]">
              <span className="text-[10px] font-black uppercase tracking-wider text-[#6C5CE7] block mb-1">
                Realm Lore & Objective
              </span>
              <p className="text-xs text-[#2D3436] font-bold leading-relaxed">
                {selectedStage.storyIntro || selectedStage.description}
              </p>
            </div>

            {/* Quests in this Stage */}
            <div className="mb-5 space-y-2">
              <h4 className="text-xs font-black uppercase tracking-wider text-[#1E1E24] flex items-center gap-1.5">
                <Target className="w-4 h-4 text-[#FFD214]" />
                <span>Quests in this Milestone</span>
              </h4>
              <div className="space-y-1.5 max-h-36 overflow-y-auto pr-1">
                {selectedStage.objectives.map((obj, i) => (
                  <div
                    key={i}
                    className="flex items-center gap-2 p-2 bg-white rounded-lg border border-[#1E1E24] text-xs font-bold text-[#4A4A58]"
                  >
                    <span className="w-4 h-4 rounded-full bg-[#10B981] text-white flex items-center justify-center text-[10px] font-black shrink-0">
                      ✓
                    </span>
                    <span className="truncate">{obj}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Footer Buttons */}
            <div className="flex items-center justify-between pt-3 border-t-2 border-[#1E1E24]">
              <button
                onClick={() => setSelectedStage(null)}
                className="px-4 py-2 rounded-xl border-2 border-[#1E1E24] bg-white text-xs font-black text-[#1E1E24] shadow-[2px_2px_0px_#1E1E24] hover:bg-gray-50"
              >
                Close Codex
              </button>

              <Link
                href={`/learn/${selectedStage.firstLessonId}`}
                className="inline-flex items-center gap-1.5 px-6 py-2.5 rounded-xl border-2 border-[#1E1E24] bg-[#FFD214] hover:bg-[#F0C400] text-[#1E1E24] font-black text-xs shadow-[3px_3px_0px_#1E1E24] transition-all hover:scale-105 active:scale-95"
              >
                <Play className="w-3.5 h-3.5 fill-current" />
                <span>Launch Stage Quest</span>
              </Link>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
