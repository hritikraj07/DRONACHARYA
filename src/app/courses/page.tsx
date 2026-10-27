// Dronacharya Course Catalog & Adventure Realms
// Faithful Codédex-inspired catalog featuring 4 active playable tracks and locked Coming Soon tracks
'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { COURSES_CATALOG, Course } from '@/lib/data/course-system';
import { CourseCardBanner } from '@/components/course/CourseCardBanner';
import {
  BookOpen,
  Terminal,
  Globe,
  Code2,
  Lock,
  ArrowRight,
  Sparkles,
  CheckCircle2,
  Zap,
  Play,
  RotateCcw,
  Compass,
  Award,
  Layers,
  Palette,
  FileCode2,
  Database,
  Cpu,
  Brain,
  GitBranch,
} from 'lucide-react';

type FilterTab = 'All' | 'Active' | 'HTML' | 'CSS' | 'JavaScript' | 'Python' | 'Coming Soon';

export default function CoursesPage() {
  const router = useRouter();
  const [activeFilter, setActiveFilter] = useState<FilterTab>('All');
  const [completedLessonIds, setCompletedLessonIds] = useState<string[]>([]);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      try {
        const saved = JSON.parse(
          localStorage.getItem('dronacharya_completed_lessons_v1') || '[]'
        );
        setCompletedLessonIds(saved);
      } catch (e) {}
    }
  }, []);

  // Filter courses based on tab
  const filteredCourses = COURSES_CATALOG.filter((c) => {
    if (activeFilter === 'All') return true;
    if (activeFilter === 'Active') return !c.isComingSoon;
    if (activeFilter === 'Coming Soon') return c.isComingSoon;
    if (activeFilter === 'HTML') return c.id === 'html';
    if (activeFilter === 'CSS') return c.id === 'css';
    if (activeFilter === 'JavaScript') return c.id === 'javascript';
    if (activeFilter === 'Python') return c.id === 'python';
    return true;
  });

  const activeCount = COURSES_CATALOG.filter((c) => !c.isComingSoon).length;
  const comingSoonCount = COURSES_CATALOG.filter((c) => c.isComingSoon).length;

  return (
    <div className="min-h-screen bg-[#F5F2EB] py-10 px-4 sm:px-6 lg:px-8 text-[#1E1E24] overflow-x-hidden">
      <div className="max-w-6xl mx-auto space-y-10">
        {/* HEADER SECTION */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 border-b-2 border-[#1E1E24] pb-8">
          <div className="space-y-3">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#FFD214] border-2 border-[#1E1E24] shadow-[2px_2px_0px_#1E1E24] text-xs font-black text-[#1E1E24]">
              <Compass className="w-3.5 h-3.5" />
              <span>DRONACHARYA ⋆˙⟡ CURRICULUM</span>
            </div>
            <h1 className="text-3xl sm:text-5xl font-black text-[#1E1E24] tracking-tight">
              Course Catalog
            </h1>
            <p className="text-sm sm:text-base font-bold text-[#4A4A58] max-w-2xl leading-relaxed">
              Step into interactive coding adventures. Write real typed code in your browser, complete hands-on missions, and build portfolio-worthy artifacts.
            </p>
          </div>

          {/* Quick Counter Badges */}
          <div className="flex items-center gap-3">
            <div className="bg-white border-2 border-[#1E1E24] rounded-xl px-4 py-2 shadow-[3px_3px_0px_#1E1E24] text-center">
              <div className="font-mono text-xl font-black text-[#00B894]">{activeCount}</div>
              <div className="text-[10px] font-black uppercase text-gray-500">Playable Tracks</div>
            </div>
            <div className="bg-white border-2 border-[#1E1E24] rounded-xl px-4 py-2 shadow-[3px_3px_0px_#1E1E24] text-center">
              <div className="font-mono text-xl font-black text-amber-500">{comingSoonCount}</div>
              <div className="text-[10px] font-black uppercase text-gray-500">In Workshop</div>
            </div>
          </div>
        </div>

        {/* FILTER PILLS */}
        <div className="flex flex-wrap items-center gap-2 pb-2">
          {(
            [
              'All',
              'Active',
              'HTML',
              'CSS',
              'JavaScript',
              'Python',
              'Coming Soon',
            ] as const
          ).map((filter) => {
            const isSelected = activeFilter === filter;
            return (
              <button
                key={filter}
                onClick={() => setActiveFilter(filter)}
                className={`px-4 py-2 text-xs font-black whitespace-nowrap btn-arcade ${
                  isSelected ? 'btn-arcade-dark' : 'btn-arcade-white'
                }`}
              >
                {filter === 'All' && 'All Tracks'}
                {filter === 'Active' && 'Active Quests ⚔️'}
                {filter === 'HTML' && 'HTML'}
                {filter === 'CSS' && 'CSS'}
                {filter === 'JavaScript' && 'JavaScript'}
                {filter === 'Python' && 'Python'}
                {filter === 'Coming Soon' && 'Coming Soon ⏳'}
              </button>
            );
          })}
        </div>

        {/* FEATURED HERO BANNER FOR ACTIVE TRACKS (When viewing All or Active) */}
        {(activeFilter === 'All' || activeFilter === 'Active') && (
          <div className="bg-gradient-to-r from-[#6C5CE7] to-[#4834D4] text-white rounded-3xl border-2 border-[#1E1E24] p-6 sm:p-8 shadow-[8px_8px_0px_#1E1E24] relative overflow-hidden">
            <div className="relative z-10 max-w-2xl space-y-3">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#FFD214] text-[#1E1E24] font-black text-xs border border-[#1E1E24] shadow-[2px_2px_0px_#1E1E24]">
                <Sparkles className="w-3.5 h-3.5" />
                <span>Recommended Starter Path</span>
              </div>
              <h2 className="text-2xl sm:text-4xl font-black tracking-tight">
                Python Programming Course 🐍
              </h2>
              <p className="text-xs sm:text-sm font-bold text-purple-100 leading-relaxed">
                Step into the live game-based Python universe! Control Rover Arya, master loops, conditionals, and functions in real sandboxed Python, or battle monsters in the Python Code Dungeon.
              </p>
              <div className="pt-2 flex flex-wrap items-center gap-3">
                <Link
                  href="/courses/python/dashboard"
                  className="btn-arcade btn-arcade-gold px-5 py-2.5 flex items-center gap-1.5 cursor-pointer"
                >
                  <span>Launch Python Dashboard →</span>
                </Link>
                <Link
                  href="/dungeon"
                  className="btn-arcade btn-arcade-white px-5 py-2.5 flex items-center gap-1.5 cursor-pointer"
                >
                  <span>⚔️ Python Dungeon Arena</span>
                </Link>
              </div>
            </div>
          </div>
        )}

        {/* COURSES GRID */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredCourses.map((c) => {
            const isComingSoon = c.isComingSoon;
            const firstLessonId = c.chapters[0]?.lessons[0]?.id || `${c.id}-less-1-1`;
            const totalLessons = c.chapters.reduce(
              (sum, ch) => sum + ch.lessons.length,
              0
            );

            // Completed lessons calculation
            const completedCount = c.chapters.reduce((sum, ch) => {
              return (
                sum +
                ch.lessons.filter((l) => completedLessonIds.includes(l.id)).length
              );
            }, 0);

            return (
              <div
                key={c.id}
                className={`bg-white rounded-2xl border-2 border-[#1E1E24] overflow-hidden flex flex-col justify-between transition-all duration-200 ${
                  isComingSoon
                    ? 'opacity-85 bg-gray-50 shadow-[4px_4px_0px_#A0A0B0]'
                    : 'shadow-[6px_6px_0px_#1E1E24] hover:-translate-y-1 hover:shadow-[8px_8px_0px_#1E1E24]'
                }`}
              >
                {/* Visual Header Banner matching Image 1 */}
                <div className="border-b-2 border-[#1E1E24]">
                  <CourseCardBanner courseId={c.id} />
                </div>

                <div className="p-6 flex-1 flex flex-col justify-between space-y-4">
                  <div className="space-y-3">
                    {/* Badge Row matching Image 1: BEGINNER • {LANG} and ACTIVE REALM */}
                    <div className="flex items-center justify-between gap-2">
                      <span className="px-2.5 py-1 rounded-md text-[10px] font-pixel uppercase tracking-wide border-2 border-[#1E1E24] bg-[#E0F2FE] text-[#0284C7] shadow-[2px_2px_0px_#1E1E24]">
                        {c.level || 'BEGINNER'} • {c.language}
                      </span>
                      {isComingSoon ? (
                        <span className="flex items-center gap-1 text-[10px] font-pixel text-amber-800 bg-[#FEF3C7] px-2.5 py-1 rounded-md border-2 border-[#1E1E24] shadow-[2px_2px_0px_#1E1E24]">
                          <Lock className="w-3 h-3" />
                          <span>COMING SOON</span>
                        </span>
                      ) : (
                        <span className="text-[10px] font-pixel text-emerald-800 bg-[#DCFCE7] px-2.5 py-1 rounded-md border-2 border-[#1E1E24] shadow-[2px_2px_0px_#1E1E24]">
                          ACTIVE COURSE
                        </span>
                      )}
                    </div>

                    {/* Title with retro gaming accents ★ ✧ */}
                    <h3 className="font-pixel text-xs sm:text-sm font-bold text-[#1E1E24] leading-relaxed">
                      {c.title} <span className="text-amber-500 font-sans text-xs">★ ✧</span>
                    </h3>

                    <p className="text-xs font-bold text-gray-600 line-clamp-2 leading-relaxed">
                      {c.description}
                    </p>
                  </div>

                  <div className="space-y-3 pt-3 border-t-2 border-[#1E1E24]/10">
                    {/* Chapters and XP Meta Row */}
                    <div className="flex items-center justify-between text-xs font-mono font-black text-[#1E1E24]">
                      <span>
                        {c.chapters.length} {c.chapters.length === 1 ? 'Chapter' : 'Chapters'}
                      </span>
                      <span className="text-emerald-700">+{c.xpReward || 500} XP</span>
                    </div>

                    {/* Action Buttons: Syllabus & Play → */}
                    {isComingSoon ? (
                      <button
                        disabled
                        className="w-full btn-arcade btn-arcade-dark opacity-50 py-2.5 px-3 cursor-not-allowed flex items-center justify-center gap-1.5"
                      >
                        <Lock className="w-3.5 h-3.5" />
                        <span>Coming Soon ⏳</span>
                      </button>
                    ) : (
                      <div className="grid grid-cols-2 gap-2">
                        <Link
                          href={`/courses/${c.id}`}
                          className="btn-arcade btn-arcade-white py-2.5 px-3 text-center text-xs font-bold cursor-pointer select-none"
                        >
                          <span>Syllabus</span>
                        </Link>
                        <Link
                          href={c.id === 'python' ? '/courses/python/dashboard' : `/learn/${firstLessonId}`}
                          className="btn-arcade btn-arcade-gold py-2.5 px-3 flex items-center justify-center gap-1 text-xs font-black cursor-pointer select-none"
                        >
                          <span>Play</span>
                          <ArrowRight className="w-3.5 h-3.5" />
                        </Link>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
