// Dronacharya Python Mastery Map: Vedic-Tech Diorama Overworld
// Repurposed interactive World Map landscape combining tactile clay/polymer terrain,
// miniature Vedic-tech motifs (The Gurukul Tree, Field Rover Arya, Terracotta Huts,
// Stone Archways, and the Temple-Castle Peak), cyber-blue electric pathways, and live syllabus integration.
'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { COURSES_CATALOG, Chapter } from '@/lib/data/course-system';
import { getPythonCourseProgress, PythonProgressData } from '@/lib/curriculum/python-progress';
import { DungeonSound } from '@/lib/simulator/audio-synth';
import {
  Compass,
  Lock,
  CheckCircle2,
  Play,
  Sparkles,
  ArrowRight,
  ShieldCheck,
  Award,
  Zap,
  Target,
  ChevronRight,
  Flame,
  X,
  Volume2,
  VolumeX,
  Cpu,
  Bot,
  BookOpen,
  MapPin,
  Trees,
  Layers,
  ScrollText,
  RotateCcw,
} from 'lucide-react';

interface DioramaZone {
  id: string;
  altitudeLevel: 1 | 2 | 3 | 4;
  altitudeMeters: string;
  chapterNumber: number;
  title: string;
  realmName: string;
  conceptName: string;
  description: string;
  lore: string;
  icon: string;
  badge: string;
  xpReward: number;
  lessonsCount: number;
  targetUrl: string;
  status: 'completed' | 'active' | 'locked';
  objectives: string[];
  runeCode: string;
  landmark: string;
}

export function WorldMap() {
  const router = useRouter();

  // Progress and sound states
  const [courseProgress, setCourseProgress] = useState<PythonProgressData>(() =>
    getPythonCourseProgress()
  );
  const [isMuted, setIsMuted] = useState<boolean>(false);
  const [activeAltitudeFocus, setActiveAltitudeFocus] = useState<number | null>(null);

  // Interactive inspect dialogs
  const [selectedZone, setSelectedZone] = useState<DioramaZone | null>(null);
  const [showRoverTelemetry, setShowRoverTelemetry] = useState<boolean>(false);
  const [showGurukulCodex, setShowGurukulCodex] = useState<boolean>(false);
  const [showCapstoneModal, setShowCapstoneModal] = useState<boolean>(false);

  // Sync user progress & audio
  useEffect(() => {
    setIsMuted(DungeonSound.isMuted());

    const sync = () => {
      setCourseProgress(getPythonCourseProgress());
    };

    window.addEventListener('dronacharya_session_change', sync);
    window.addEventListener('storage', sync);

    return () => {
      window.removeEventListener('dronacharya_session_change', sync);
      window.removeEventListener('storage', sync);
    };
  }, []);

  const handleToggleSound = () => {
    const next = DungeonSound.toggleMute();
    setIsMuted(next);
  };

  const playClick = () => {
    if (!isMuted) DungeonSound.playMove();
  };

  const playSelect = () => {
    if (!isMuted) DungeonSound.playCollect();
  };

  // Python course data from syllabus
  const pythonCourse = COURSES_CATALOG.find((c) => c.id === 'python') || COURSES_CATALOG[0];
  const chapters = pythonCourse.chapters || [];

  // Determine stage unlock states based on completed activities
  const completedKeys = courseProgress.completedMissionKeys || [];
  const stage1Completed = completedKeys.some(
    (k) => k.includes('stage1-mission-6') || k.includes('py-less-1-1')
  );
  const stage2Completed = completedKeys.some((k) => k.includes('py-less-2-1') || k.includes('calculator'));
  const stage3Completed = completedKeys.some((k) => k.includes('py-less-3-1') || k.includes('hazard-filter'));

  // Four Core Zones defined with Vedic-Tech Diorama motifs
  const dioramaZones: DioramaZone[] = [
    {
      id: 'zone-1-starter',
      altitudeLevel: 1,
      altitudeMeters: '0m – 300m',
      chapterNumber: 1,
      title: 'Chapter 1: Hello World & Syntax',
      realmName: 'Starter Village & Rover Plains',
      conceptName: 'print() & String Transmissions',
      description:
        'Wake stranded field rover Arya on the starter plains. Master string literals, console output, and indentation fundamentals.',
      lore: 'At the foot of the ancient Gurukul peaks lies the Starter Village. Terracotta huts surround the clear resin river, where Field Rover Arya awaits your first code incantation across the wooden bridge.',
      icon: '🏕️',
      badge: 'Level 1 Base Plain',
      xpReward: 130,
      lessonsCount: 2,
      targetUrl: '/courses/python/stage-1',
      status: stage1Completed ? 'completed' : 'active',
      objectives: [
        'Commune with the Ancient Logic Gate',
        'Output strings with the print() function',
        'Combine comma-separated values & numbers',
        'Awaken Rover Arya with verified telemetry',
      ],
      runeCode: 'print("Hello, Gurukul!")',
      landmark: 'Rover Arya Field Station & Wooden River Bridge',
    },
    {
      id: 'zone-2-valley',
      altitudeLevel: 2,
      altitudeMeters: '400m – 800m',
      chapterNumber: 2,
      title: 'Chapter 2: Variables & State',
      realmName: 'Variable Valley & The Gurukul Tree',
      conceptName: 'State Memory & Dynamic Registers',
      description:
        'Ascend the tiered terracotta cliffs to the sacred Gurukul Tree. Store battery reserves, coordinates, and health in dynamic variable registers.',
      lore: 'The colossal Gurukul Tree has shaded scholars for centuries. Its sculpted roots clasp the stone plateau, while its leaves glow with ancient cyber-runes storing immutable variables and dynamic program state.',
      icon: '🌲',
      badge: 'Level 2 Tiered Cliffs',
      xpReward: 170,
      lessonsCount: 2,
      targetUrl: '/learn/py-less-2-1',
      status: stage1Completed ? (stage2Completed ? 'completed' : 'active') : 'locked',
      objectives: [
        'Declare memory registers with variable assignment =',
        'Store integer health, battery, and float coordinates',
        'Perform arithmetic calculations on live registers',
        'Read and mutate program state without syntax leaks',
      ],
      runeCode: 'energy = 100\nrover_x = 12',
      landmark: 'Centuries-Old Gurukul Tree & Memory Archive',
    },
    {
      id: 'zone-3-castle',
      altitudeLevel: 3,
      altitudeMeters: '900m – 1200m',
      chapterNumber: 3,
      title: 'Chapter 3: Conditionals & Decisions',
      realmName: 'Conditional Castle & Logic Gates',
      conceptName: 'Branching if, elif, else Logic',
      description:
        'Navigate the steep mountain pass carved with monolithic stone archways. Equip Arya with autonomous hazard-avoidance and boolean branch decisions.',
      lore: 'Perched on the high windswept slopes, Conditional Castle guards the mountain pass. Double stone archways test every traveler: only code with valid boolean comparisons may cross the bridge.',
      icon: '🏰',
      badge: 'Level 3 High Peaks',
      xpReward: 170,
      lessonsCount: 2,
      targetUrl: '/learn/py-less-3-1',
      status: stage2Completed ? (stage3Completed ? 'completed' : 'active') : 'locked',
      objectives: [
        'Evaluate True and False boolean conditions',
        'Construct indented if / elif / else branching logic',
        'Verify sensor distance thresholds (> , < , ==)',
        'Pass the Autonomous Obstacle Evasion sentinel test',
      ],
      runeCode: 'if distance > 10:\n    print("Safe")',
      landmark: 'Monolithic Stone Archways & Logic Gate Pass',
    },
    {
      id: 'zone-4-summit',
      altitudeLevel: 4,
      altitudeMeters: '1300m – 1600m',
      chapterNumber: 4,
      title: 'Chapter 4: Loops & Repetition',
      realmName: 'Loop Lab & Capstone Summit Peak',
      conceptName: 'For Loops, Range Iteration & Capstone',
      description:
        'Reach the highest altitude: the grand Temple-Castle peak. Automate continuous wheel rotations with for-loops and construct the Stage Capstone Project.',
      lore: 'The apex of the Python realm. Volumetric clouds drift past the golden shikhara temple spires. Here, continuous iteration powers the Chrono Wheel, and the massive hanging vellum scroll presents the ultimate trial.',
      icon: '🏔️',
      badge: 'Level 4 Capstone Summit',
      xpReward: 350,
      lessonsCount: 2,
      targetUrl: '/learn/py-less-4-1',
      status: stage3Completed ? 'active' : 'locked',
      objectives: [
        'Execute repeated routines using for-loops and range()',
        'Automate grid navigation without code duplication',
        'Synthesize loops, branches, and variables',
        'Complete the Stage 1 Capstone: Character Creator',
      ],
      runeCode: 'for step in range(5):\n    rover.move()',
      landmark: 'Grand Temple-Castle Peak & Hanging Vellum Scroll',
    },
  ];

  return (
    <div className="w-full space-y-6">
      {/* =========================================================================
          1. DIORAMA CONTROL CONSOLE & ATMOSPHERIC BANNER
         ========================================================================= */}
      <div className="bg-[#FAF6EE] border-3 border-[#1E1E24] rounded-3xl p-5 sm:p-6 shadow-[6px_6px_0px_#1E1E24] relative overflow-hidden">
        {/* Background circuit & parchment ambient grain */}
        <div
          className="absolute inset-0 opacity-10 pointer-events-none"
          style={{
            backgroundImage:
              'radial-gradient(#1E1E24 1.5px, transparent 1.5px), radial-gradient(#6C5CE7 1px, transparent 1px)',
            backgroundSize: '24px 24px',
            backgroundPosition: '0 0, 12px 12px',
          }}
        />

        <div className="relative z-10 flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          {/* Header Title & Theme description */}
          <div className="space-y-2">
            <div className="flex items-center gap-2 flex-wrap">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#FFD214] border-2 border-[#1E1E24] shadow-[2px_2px_0px_#1E1E24] text-xs font-pixel font-black text-[#1E1E24]">
                <Compass className="w-3.5 h-3.5" />
                <span>VEDIC-TECH DIORAMA</span>
              </span>
              <span className="text-xs font-mono font-bold text-[#6C5CE7] bg-[#6C5CE7]/10 px-2.5 py-1 rounded-lg border border-[#6C5CE7]/30">
                Miniature Python Overworld
              </span>
            </div>

            <h2 className="text-2xl sm:text-3xl font-serif font-black text-[#1E1E24] tracking-tight">
              Python Mastery Map: The 4 Ascents
            </h2>
            <p className="text-xs sm:text-sm font-bold text-[#4A4A58] max-w-2xl leading-relaxed">
              Ascend from the Starter Plains through Variable Valley and Conditional Castle to the grand Temple-Castle Summit. Real progress synchronizes dynamically with your completed Python activities.
            </p>
          </div>

          {/* Quick Metrics & Sound Toggle */}
          <div className="flex items-center gap-3 shrink-0 flex-wrap">
            {/* Overall Course Progress Pill */}
            <div className="bg-white border-2 border-[#1E1E24] rounded-2xl p-3 shadow-[3px_3px_0px_#1E1E24] min-w-[140px]">
              <div className="flex items-center justify-between text-[10px] font-mono font-black text-gray-500 mb-1">
                <span>PROGRESS</span>
                <span className="text-[#6C5CE7] font-black">{courseProgress.percent}%</span>
              </div>
              <div className="w-full h-2.5 rounded-full bg-gray-100 border border-[#1E1E24] overflow-hidden p-0.5">
                <div
                  className="h-full rounded-full bg-gradient-to-r from-[#6C5CE7] via-[#38BDF8] to-[#FFD214] transition-all duration-500"
                  style={{ width: `${Math.max(6, courseProgress.percent)}%` }}
                />
              </div>
            </div>

            {/* Cleared Activities Badge */}
            <div className="bg-[#FEF3C7] border-2 border-[#1E1E24] rounded-2xl p-3 shadow-[3px_3px_0px_#1E1E24] text-center min-w-[110px]">
              <span className="text-[10px] font-mono font-bold text-[#D97706] block">ACTIVITIES</span>
              <span className="font-serif font-black text-base text-[#1E1E24]">
                {courseProgress.completedActivitiesCount} / {courseProgress.totalActivitiesCount}
              </span>
            </div>

            {/* Audio Toggle */}
            <button
              onClick={handleToggleSound}
              className={`p-3 rounded-2xl border-2 border-[#1E1E24] shadow-[3px_3px_0px_#1E1E24] transition-all cursor-pointer ${
                isMuted ? 'bg-rose-50 text-rose-600' : 'bg-white text-[#1E1E24] hover:bg-[#FAF6EE]'
              }`}
              title={isMuted ? 'Unmute 8-bit Audio' : 'Mute Audio'}
            >
              {isMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
            </button>
          </div>
        </div>

        {/* Altitude Focus Filter Bar */}
        <div className="mt-5 pt-4 border-t-2 border-[#1E1E24]/20 flex items-center justify-between flex-wrap gap-2">
          <div className="flex items-center gap-1.5 text-xs font-mono font-bold text-[#1E1E24]">
            <Layers className="w-3.5 h-3.5 text-[#6C5CE7]" />
            <span>ALTITUDE FILTER:</span>
          </div>

          <div className="flex items-center gap-1.5 flex-wrap">
            <button
              onClick={() => {
                setActiveAltitudeFocus(null);
                playClick();
              }}
              className={`px-3 py-1 rounded-xl text-xs font-bold transition-all border-2 cursor-pointer ${
                activeAltitudeFocus === null
                  ? 'bg-[#1E1E24] text-white border-[#1E1E24] shadow-[2px_2px_0px_#6C5CE7]'
                  : 'bg-white text-[#4A4A58] border-[#1E1E24]/40 hover:border-[#1E1E24]'
              }`}
            >
              🗺️ Full Landscape
            </button>
            {dioramaZones.map((z) => {
              const isSelected = activeAltitudeFocus === z.altitudeLevel;
              return (
                <button
                  key={z.id}
                  onClick={() => {
                    setActiveAltitudeFocus(z.altitudeLevel);
                    playClick();
                  }}
                  className={`px-3 py-1 rounded-xl text-xs font-bold transition-all border-2 cursor-pointer ${
                    isSelected
                      ? 'bg-[#FFD214] text-[#1E1E24] border-[#1E1E24] shadow-[2px_2px_0px_#1E1E24] font-black'
                      : 'bg-white text-[#4A4A58] border-[#1E1E24]/40 hover:border-[#1E1E24]'
                  }`}
                >
                  {z.icon} L{z.altitudeLevel}: {z.realmName.split('&')[0].trim()}
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* =========================================================================
          2. THE VEDIC-TECH DIORAMA CANVAS (Sculpted Clay & Volumetric Depth)
         ========================================================================= */}
      <div className="relative rounded-3xl border-3 border-[#1E1E24] shadow-[8px_8px_0px_#1E1E24] overflow-hidden bg-gradient-to-b from-[#87CEEB]/25 via-[#FAF6EE] to-[#E9DFCE] min-h-[620px] p-4 sm:p-8">
        {/* Volumetric Sunbeam / Overhead Ambient Light */}
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            background:
              'radial-gradient(circle at 15% 15%, rgba(255, 236, 179, 0.45) 0%, transparent 55%), radial-gradient(circle at 85% 85%, rgba(108, 92, 231, 0.08) 0%, transparent 60%)',
          }}
        />

        {/* Ambient Topographical Contours */}
        <div
          className="absolute inset-0 opacity-15 pointer-events-none"
          style={{
            backgroundImage:
              'radial-gradient(#2D6A4F 1px, transparent 1px), radial-gradient(#C25B34 1px, transparent 1px)',
            backgroundSize: '36px 36px',
            backgroundPosition: '0 0, 18px 18px',
          }}
        />

        {/* Floating Cotton-like Clouds (Layered Depth) */}
        <div className="absolute top-6 left-8 pointer-events-none opacity-85 select-none animate-pulse duration-1000">
          <div className="relative px-5 py-2.5 bg-white/90 backdrop-blur-xs rounded-full border-2 border-white shadow-[0_8px_16px_rgba(0,0,0,0.06)] flex items-center gap-1.5 text-xs font-mono font-bold text-sky-700">
            <span>☁️</span>
            <span className="text-[10px] tracking-wider uppercase font-pixel">ALT 300m</span>
          </div>
        </div>

        <div className="absolute top-20 right-12 pointer-events-none opacity-80 select-none hidden md:block">
          <div className="px-6 py-3 bg-white/95 backdrop-blur-xs rounded-full border-2 border-white shadow-[0_10px_20px_rgba(0,0,0,0.08)] flex items-center gap-2 text-xs font-mono font-bold text-sky-800">
            <span>☁️</span>
            <span className="text-[10px] tracking-wider uppercase font-pixel">ALT 1200m MIST</span>
          </div>
        </div>

        {/* =========================================================================
            SVG ELECTRIC DATA LIGHTNING PATH (Cyber-blue glowing milestone connectors)
           ========================================================================= */}
        <svg
          className="absolute inset-0 w-full h-full pointer-events-none z-0"
          xmlns="http://www.w3.org/2000/svg"
        >
          <defs>
            {/* Cyber-blue electric glow filter */}
            <filter id="cyberGlow" x="-20%" y="-20%" width="140%" height="140%">
              <feGaussianBlur stdDeviation="3.5" result="blur" />
              <feMerge>
                <feMergeNode in="blur" />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>
            <linearGradient id="cyberGradient" x1="0%" y1="100%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#38BDF8" />
              <stop offset="50%" stopColor="#6C5CE7" />
              <stop offset="100%" stopColor="#FFD214" />
            </linearGradient>
          </defs>

          {/* Smooth path from base level to summit */}
          <path
            d="M 160 520 C 240 450, 220 360, 360 330 C 500 300, 560 210, 720 180 C 860 150, 940 100, 1020 80"
            fill="none"
            stroke="#1E1E24"
            strokeWidth="8"
            strokeLinecap="round"
          />
          <path
            d="M 160 520 C 240 450, 220 360, 360 330 C 500 300, 560 210, 720 180 C 860 150, 940 100, 1020 80"
            fill="none"
            stroke="url(#cyberGradient)"
            strokeWidth="4"
            strokeLinecap="round"
            strokeDasharray="8 6"
            className="animate-pulse"
            filter="url(#cyberGlow)"
          />
        </svg>

        {/* =========================================================================
            INTERACTIVE TERRAIN NODES & SCULPTED DIORAMA FEATURES
           ========================================================================= */}
        <div className="relative z-10 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 items-stretch">
          {dioramaZones.map((zone) => {
            const isCompleted = zone.status === 'completed';
            const isActive = zone.status === 'active';
            const isLocked = zone.status === 'locked';
            const isFocused =
              activeAltitudeFocus === null || activeAltitudeFocus === zone.altitudeLevel;

            return (
              <div
                key={zone.id}
                onClick={() => {
                  setSelectedZone(zone);
                  playSelect();
                }}
                className={`relative rounded-3xl border-3 border-[#1E1E24] p-5 transition-all duration-300 flex flex-col justify-between cursor-pointer ${
                  !isFocused ? 'opacity-35 scale-95 blur-[1px]' : 'opacity-100 hover:-translate-y-1'
                } ${
                  isActive
                    ? 'bg-white shadow-[6px_6px_0px_#6C5CE7] ring-3 ring-[#6C5CE7]'
                    : isCompleted
                    ? 'bg-emerald-50/90 shadow-[5px_5px_0px_#10B981]'
                    : 'bg-[#FAF6EE]/80 shadow-[4px_4px_0px_#1E1E24] opacity-80'
                }`}
                style={{
                  backdropFilter: 'blur(12px)',
                }}
              >
                {/* Active Indicator Pin */}
                {isActive && (
                  <div className="absolute -top-3.5 right-4 z-20 flex items-center gap-1.5 px-3 py-0.5 rounded-full bg-[#6C5CE7] text-white text-[10px] font-pixel font-bold border-2 border-[#1E1E24] shadow-[2px_2px_0px_#1E1E24] animate-bounce">
                    <span className="w-2 h-2 rounded-full bg-[#FFD214] animate-ping" />
                    <span>YOU ARE HERE</span>
                  </div>
                )}

                {/* Altitude Tag & Status Header */}
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-[10px] font-pixel uppercase tracking-wider px-2 py-0.5 rounded-md border border-[#1E1E24] bg-[#FAF6EE] text-[#1E1E24] shadow-[1px_1px_0px_#1E1E24]">
                      {zone.altitudeMeters}
                    </span>

                    {isCompleted ? (
                      <span className="inline-flex items-center gap-1 text-[11px] font-black text-emerald-800 bg-emerald-100 px-2 py-0.5 rounded-full border border-emerald-500">
                        <CheckCircle2 className="w-3.5 h-3.5" />
                        <span>CLEARED</span>
                      </span>
                    ) : isActive ? (
                      <span className="inline-flex items-center gap-1 text-[11px] font-black text-purple-900 bg-purple-100 px-2 py-0.5 rounded-full border border-purple-400">
                        <Play className="w-3 h-3 fill-current" />
                        <span>ACTIVE</span>
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1 text-[11px] font-bold text-gray-500 bg-gray-100 px-2 py-0.5 rounded-full border border-gray-300">
                        <Lock className="w-3 h-3" />
                        <span>LOCKED</span>
                      </span>
                    )}
                  </div>

                  {/* Sculpted Miniature Landmark Icon */}
                  <div className="relative mb-3 flex items-center justify-between">
                    <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-white to-amber-50 border-2 border-[#1E1E24] shadow-[3px_3px_0px_#1E1E24] flex items-center justify-center text-3xl">
                      {zone.icon}
                    </div>

                    <span className="text-[11px] font-mono font-bold px-2 py-0.5 rounded-md bg-[#FAF6EE] border border-[#1E1E24]/30 text-gray-600">
                      Stage {zone.chapterNumber}
                    </span>
                  </div>

                  {/* Zone Realm Title */}
                  <h3 className="font-serif font-black text-lg text-[#1E1E24] leading-tight mb-1">
                    {zone.realmName}
                  </h3>
                  <span className="text-xs font-mono font-bold text-[#6C5CE7] block mb-2">
                    {zone.conceptName}
                  </span>

                  <p className="text-xs text-[#4A4A58] line-clamp-3 leading-relaxed font-bold">
                    {zone.description}
                  </p>

                  {/* Miniature Landmark Detail */}
                  <div className="mt-3 p-2 rounded-xl bg-[#FAF6EE] border border-[#1E1E24]/30 text-[11px] text-[#1E1E24] font-bold flex items-center gap-1.5">
                    <MapPin className="w-3.5 h-3.5 text-[#6C5CE7] shrink-0" />
                    <span className="truncate">{zone.landmark}</span>
                  </div>
                </div>

                {/* Milestone Bottom Action & XP */}
                <div className="mt-5 pt-3 border-t-2 border-[#1E1E24]/20 flex items-center justify-between">
                  <span className="text-xs font-mono font-black text-amber-900 bg-[#FFD214]/30 px-2 py-0.5 rounded border border-amber-400">
                    +{zone.xpReward} XP
                  </span>

                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      setSelectedZone(zone);
                      playSelect();
                    }}
                    className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl border-2 border-[#1E1E24] text-xs font-black transition-all cursor-pointer shadow-[2px_2px_0px_#1E1E24] ${
                      isActive
                        ? 'bg-[#6C5CE7] text-white hover:bg-[#5949D6]'
                        : isCompleted
                        ? 'bg-[#10B981] text-white hover:bg-[#059669]'
                        : 'bg-white text-[#1E1E24] hover:bg-gray-100'
                    }`}
                  >
                    <span>{isActive ? 'Enter Quest' : isCompleted ? 'Review' : 'Inspect'}</span>
                    <ArrowRight className="w-3 h-3" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>

        {/* =========================================================================
            3. INTERACTIVE TERRAIN DIORAMA PROPS (Rover Arya, Gurukul Tree, Vellum Scroll)
           ========================================================================= */}
        <div className="relative z-10 mt-8 pt-6 border-t-2 border-[#1E1E24]/20 grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Prop 1: Field Rover Arya Miniature */}
          <div
            onClick={() => {
              setShowRoverTelemetry(true);
              playSelect();
            }}
            className="p-4 rounded-2xl bg-white/90 border-2 border-[#1E1E24] shadow-[4px_4px_0px_#1E1E24] hover:-translate-y-1 transition-all cursor-pointer flex items-center justify-between group"
          >
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-xl bg-sky-100 border-2 border-[#1E1E24] shadow-[2px_2px_0px_#1E1E24] flex items-center justify-center text-2xl group-hover:rotate-6 transition-transform">
                🤖
              </div>
              <div>
                <div className="flex items-center gap-1.5">
                  <span className="font-serif font-black text-sm text-[#1E1E24]">Rover Arya</span>
                  <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping" />
                </div>
                <p className="text-[11px] font-bold text-gray-600">
                  Stranded in Starter Village • Ready for transmission
                </p>
              </div>
            </div>

            <span className="text-xs font-mono font-black text-[#6C5CE7] group-hover:underline">
              HUD →
            </span>
          </div>

          {/* Prop 2: The Gurukul Tree Library Archive */}
          <div
            onClick={() => {
              setShowGurukulCodex(true);
              playSelect();
            }}
            className="p-4 rounded-2xl bg-white/90 border-2 border-[#1E1E24] shadow-[4px_4px_0px_#1E1E24] hover:-translate-y-1 transition-all cursor-pointer flex items-center justify-between group"
          >
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-xl bg-amber-100 border-2 border-[#1E1E24] shadow-[2px_2px_0px_#1E1E24] flex items-center justify-center text-2xl group-hover:rotate-6 transition-transform">
                🌳
              </div>
              <div>
                <div className="flex items-center gap-1.5">
                  <span className="font-serif font-black text-sm text-[#1E1E24]">The Gurukul Tree</span>
                  <span className="text-[10px] font-pixel bg-amber-200 px-1 rounded text-amber-900">
                    CODEX
                  </span>
                </div>
                <p className="text-[11px] font-bold text-gray-600">
                  Sculpted roots • Memory register shlokas
                </p>
              </div>
            </div>

            <span className="text-xs font-mono font-black text-[#6C5CE7] group-hover:underline">
              Archive →
            </span>
          </div>

          {/* Prop 3: Capstone Summit Hanging Vellum Scroll */}
          <div
            onClick={() => {
              setShowCapstoneModal(true);
              playSelect();
            }}
            className="p-4 rounded-2xl bg-gradient-to-r from-amber-50 to-purple-50 border-2 border-[#1E1E24] shadow-[4px_4px_0px_#1E1E24] hover:-translate-y-1 transition-all cursor-pointer flex items-center justify-between group"
          >
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-xl bg-[#FFD214] border-2 border-[#1E1E24] shadow-[2px_2px_0px_#1E1E24] flex items-center justify-center text-2xl group-hover:rotate-6 transition-transform">
                📜
              </div>
              <div>
                <div className="flex items-center gap-1.5">
                  <span className="font-serif font-black text-sm text-[#1E1E24]">Capstone Scroll</span>
                  <span className="text-[10px] font-pixel bg-[#6C5CE7] text-white px-1.5 rounded">
                    SUMMIT
                  </span>
                </div>
                <p className="text-[11px] font-bold text-gray-600">
                  Character Creator • Stage synthesis project
                </p>
              </div>
            </div>

            <span className="text-xs font-mono font-black text-[#6C5CE7] group-hover:underline">
              Briefing →
            </span>
          </div>
        </div>
      </div>

      {/* =========================================================================
          MODAL 1: ZONE CODEX & DIRECT LESSON LAUNCHER
         ========================================================================= */}
      {selectedZone && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-200">
          <div className="relative w-full max-w-lg bg-[#FAF6EE] text-[#1E1E24] rounded-3xl border-4 border-[#1E1E24] shadow-[10px_10px_0px_#1E1E24] p-6 sm:p-7 space-y-5 animate-in zoom-in-95">
            {/* Close Button */}
            <button
              onClick={() => setSelectedZone(null)}
              className="absolute top-4 right-4 p-2 rounded-xl bg-white border-2 border-[#1E1E24] text-[#1E1E24] shadow-[2px_2px_0px_#1E1E24] hover:bg-rose-50 cursor-pointer transition-colors"
            >
              <X className="w-4 h-4" />
            </button>

            {/* Header info */}
            <div className="flex items-start gap-4">
              <div className="w-16 h-16 rounded-2xl bg-white border-2 border-[#1E1E24] shadow-[3px_3px_0px_#1E1E24] flex items-center justify-center text-3xl shrink-0">
                {selectedZone.icon}
              </div>
              <div>
                <span className="text-[10px] font-pixel px-2 py-0.5 rounded bg-[#FFD214] border border-[#1E1E24] text-[#1E1E24] font-black">
                  {selectedZone.badge} • {selectedZone.altitudeMeters}
                </span>
                <h2 className="font-serif font-black text-2xl text-[#1E1E24] mt-1">
                  {selectedZone.realmName}
                </h2>
                <span className="text-xs font-mono font-bold text-[#6C5CE7] block">
                  {selectedZone.title}
                </span>
              </div>
            </div>

            {/* Realm Lore & Story */}
            <div className="bg-white border-2 border-[#1E1E24] rounded-2xl p-4 shadow-[2px_2px_0px_#1E1E24] space-y-1.5">
              <span className="text-[10px] font-mono font-black text-gray-500 uppercase tracking-wider block">
                Vedic-Tech Lore & Landscape
              </span>
              <p className="text-xs font-bold text-[#4A4A58] leading-relaxed">
                {selectedZone.lore}
              </p>
            </div>

            {/* Code Rune preview */}
            <div className="p-3 rounded-xl bg-[#1E1E24] text-[#FAF6EE] font-mono text-xs border-2 border-[#1E1E24] shadow-[2px_2px_0px_#1E1E24]">
              <span className="text-[10px] text-emerald-400 font-bold block mb-1">
                # Core Syntax Rune:
              </span>
              <pre className="text-cyan-300 font-bold whitespace-pre-wrap">{selectedZone.runeCode}</pre>
            </div>

            {/* Milestone Quests */}
            <div className="space-y-2">
              <h4 className="text-xs font-mono font-black uppercase text-[#1E1E24] flex items-center gap-1.5">
                <Target className="w-4 h-4 text-[#FFD214]" />
                <span>Objectives in this Realm ({selectedZone.objectives.length})</span>
              </h4>
              <div className="space-y-1.5 max-h-36 overflow-y-auto pr-1">
                {selectedZone.objectives.map((obj, i) => (
                  <div
                    key={i}
                    className="flex items-center gap-2 p-2 bg-white rounded-xl border border-[#1E1E24] text-xs font-bold text-[#1E1E24]"
                  >
                    <span className="w-4 h-4 rounded-full bg-[#10B981] text-white flex items-center justify-center text-[10px] font-black shrink-0">
                      ✓
                    </span>
                    <span className="truncate">{obj}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Action Bar */}
            <div className="pt-3 border-t-2 border-[#1E1E24] flex items-center justify-between gap-3">
              <button
                onClick={() => setSelectedZone(null)}
                className="btn-arcade btn-arcade-white px-4 py-2.5 text-xs font-black cursor-pointer shadow-[2px_2px_0px_#1E1E24]"
              >
                Close Codex
              </button>

              <Link
                href={selectedZone.targetUrl}
                className="btn-arcade btn-arcade-gold px-6 py-2.5 text-xs font-black flex items-center gap-2 shadow-[3px_3px_0px_#1E1E24]"
              >
                <Play className="w-3.5 h-3.5 fill-current" />
                <span>
                  {selectedZone.status === 'completed'
                    ? 'Replay Challenge'
                    : selectedZone.chapterNumber === 1
                    ? 'Launch Stage 1 Quest'
                    : 'Start Lesson Lab'}
                </span>
              </Link>
            </div>
          </div>
        </div>
      )}

      {/* =========================================================================
          MODAL 2: ROVER ARYA TELEMETRY HUD
         ========================================================================= */}
      {showRoverTelemetry && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-200">
          <div className="relative w-full max-w-md bg-[#181822] text-[#FAF6EE] rounded-3xl border-4 border-[#38BDF8] shadow-[10px_10px_0px_#1E1E24] p-6 space-y-5 animate-in zoom-in-95">
            <div className="flex items-center justify-between border-b border-[#2C2C3A] pb-3">
              <div className="flex items-center gap-2">
                <span className="text-2xl">🤖</span>
                <div>
                  <h3 className="font-mono font-black text-sm text-cyan-300">
                    [ROVER.ARYA // TELEMETRY]
                  </h3>
                  <span className="text-[10px] text-gray-400">Autonomous Explorer v2.4</span>
                </div>
              </div>
              <button
                onClick={() => setShowRoverTelemetry(false)}
                className="w-8 h-8 rounded-xl bg-[#232332] text-gray-300 flex items-center justify-center hover:text-white cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Telemetry Metrics */}
            <div className="space-y-3 font-mono text-xs">
              <div className="p-3 rounded-xl bg-[#121218] border border-[#2C2C3A] flex items-center justify-between">
                <span className="text-gray-400">Current Position:</span>
                <span className="text-emerald-400 font-bold">Starter Village Plains (12, 45)</span>
              </div>

              <div className="p-3 rounded-xl bg-[#121218] border border-[#2C2C3A] flex items-center justify-between">
                <span className="text-gray-400">Battery Cell:</span>
                <span className="text-emerald-400 font-bold">100% Full Capacity</span>
              </div>

              <div className="p-3 rounded-xl bg-[#121218] border border-[#2C2C3A] flex items-center justify-between">
                <span className="text-gray-400">Sensor Status:</span>
                <span className="text-cyan-300 font-bold">Awaiting Python Transmission</span>
              </div>
            </div>

            <p className="text-xs font-sans text-gray-300 leading-relaxed font-bold">
              Rover Arya responds to Python commands! Use <code className="text-amber-300">print()</code> in Stage 1 to activate its navigation sensors and steer through the hazard grid.
            </p>

            <div className="flex items-center gap-3 pt-2">
              <Link
                href="/courses/python/stage-1"
                className="btn-arcade btn-arcade-gold flex-1 py-2.5 text-xs text-center font-black"
              >
                Transmit Code in Stage 1 →
              </Link>
            </div>
          </div>
        </div>
      )}

      {/* =========================================================================
          MODAL 3: THE GURUKUL TREE LIBRARY ARCHIVE
         ========================================================================= */}
      {showGurukulCodex && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-200">
          <div className="relative w-full max-w-lg bg-[#FAF6EE] text-[#1E1E24] rounded-3xl border-4 border-[#1E1E24] shadow-[10px_10px_0px_#1E1E24] p-6 sm:p-7 space-y-5 animate-in zoom-in-95">
            <div className="flex items-center justify-between border-b-2 border-[#1E1E24] pb-3">
              <div className="flex items-center gap-2">
                <Trees className="w-6 h-6 text-emerald-700" />
                <h3 className="font-serif font-black text-xl text-[#1E1E24]">
                  The Gurukul Tree Archive
                </h3>
              </div>
              <button
                onClick={() => setShowGurukulCodex(false)}
                className="w-8 h-8 rounded-xl bg-white border-2 border-[#1E1E24] flex items-center justify-center font-black hover:bg-rose-50 cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="p-4 rounded-2xl bg-amber-50 border-2 border-amber-300 text-xs font-bold text-amber-950 leading-relaxed space-y-2">
              <span className="font-pixel text-[11px] text-amber-800 block">
                VEDIC ALGORITHMIC SHLOKA:
              </span>
              <p className="italic font-serif text-sm">
                &quot;Just as roots draw nourishment into enduring tree bark, a program draws transient inputs into persistent variable registers.&quot;
              </p>
            </div>

            <div className="space-y-2.5 text-xs font-bold text-gray-700">
              <div className="p-3 rounded-xl bg-white border border-[#1E1E24]">
                <strong className="text-[#6C5CE7] block mb-1">1. Immutable Concept Memory:</strong>
                Variables store values that can be referenced, checked, and updated without re-reading external input.
              </div>
              <div className="p-3 rounded-xl bg-white border border-[#1E1E24]">
                <strong className="text-[#10B981] block mb-1">2. Socratic Verification:</strong>
                Learn by debugging syntax mismatches before running high-complexity algorithmic pipelines.
              </div>
            </div>

            <div className="pt-2 flex justify-end">
              <button
                onClick={() => setShowGurukulCodex(false)}
                className="btn-arcade btn-arcade-white px-5 py-2 text-xs font-black"
              >
                Close Archive
              </button>
            </div>
          </div>
        </div>
      )}

      {/* =========================================================================
          MODAL 4: HANGING VELLUM SCROLL (Stage Capstone Project: Character Creator)
         ========================================================================= */}
      {showCapstoneModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-200">
          <div className="relative w-full max-w-xl bg-[#FAF6EE] text-[#1E1E24] rounded-3xl border-4 border-[#1E1E24] shadow-[10px_10px_0px_#1E1E24] p-6 sm:p-8 space-y-5 animate-in zoom-in-95">
            <div className="flex items-center justify-between border-b-2 border-[#1E1E24] pb-3">
              <div className="flex items-center gap-2">
                <ScrollText className="w-6 h-6 text-[#6C5CE7]" />
                <div>
                  <h3 className="font-serif font-black text-xl text-[#1E1E24]">
                    Stage Capstone Project
                  </h3>
                  <span className="text-[10px] font-mono font-bold text-gray-500">
                    Character Creator • RPG Synthesizer
                  </span>
                </div>
              </div>
              <button
                onClick={() => setShowCapstoneModal(false)}
                className="w-8 h-8 rounded-xl bg-white border-2 border-[#1E1E24] flex items-center justify-center font-black hover:bg-rose-50 cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Description Card */}
            <div className="p-4 rounded-2xl bg-white border-2 border-[#1E1E24] shadow-[2px_2px_0px_#1E1E24] space-y-2">
              <span className="text-[10px] font-pixel text-[#D97706] block uppercase">
                ⚔️ Grand Summit Challenge
              </span>
              <p className="text-xs font-bold text-[#4A4A58] leading-relaxed">
                Synthesize all four core concepts—variables, data types, arithmetic calculations, and formatted string output—into a complete RPG character generation program.
              </p>
            </div>

            {/* Project Code Spec */}
            <div className="p-3.5 rounded-2xl bg-[#181822] text-[#FAF6EE] font-mono text-xs border-2 border-[#1E1E24] shadow-[2px_2px_0px_#1E1E24] space-y-1.5">
              <span className="text-emerald-400 font-bold block text-[11px]">
                # Expected Output Specification:
              </span>
              <pre className="text-cyan-300 font-bold">
{`Hero: EKLAVYA [Archer]
HP: 100 | Attack: 25 | Level: 1`}
              </pre>
            </div>

            {/* Rubric Criteria */}
            <div className="grid grid-cols-2 gap-2 text-xs font-bold">
              <div className="p-2.5 rounded-xl bg-white border border-[#1E1E24]">
                <span className="text-[#6C5CE7] block text-[10px] font-pixel">40 PTS</span>
                <span>Correct variable assignments & data types</span>
              </div>
              <div className="p-2.5 rounded-xl bg-white border border-[#1E1E24]">
                <span className="text-[#10B981] block text-[10px] font-pixel">30 PTS</span>
                <span>Formatted text strings & f-string syntax</span>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="pt-3 border-t-2 border-[#1E1E24] flex items-center justify-between gap-3">
              <button
                onClick={() => setShowCapstoneModal(false)}
                className="btn-arcade btn-arcade-white px-4 py-2.5 text-xs font-black cursor-pointer shadow-[2px_2px_0px_#1E1E24]"
              >
                Back to Map
              </button>

              <Link
                href="/learn/py-topic-13"
                className="btn-arcade btn-arcade-gold px-6 py-2.5 text-xs font-black flex items-center gap-2 shadow-[3px_3px_0px_#1E1E24]"
              >
                <Play className="w-3.5 h-3.5 fill-current" />
                <span>Launch Character Creator ⚔️</span>
              </Link>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
