// Dronacharya Courses Overview & Adventure Realm
// CodeDex-inspired course catalogue with real progression, chapter previews, and quick-resume
'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { COURSES_CATALOG, Course } from '@/lib/data/course-system';
import { getActiveSession } from '@/lib/db/auth-db';
import {
  BookOpen,
  Terminal,
  Globe,
  Code2,
  Cpu,
  ArrowRight,
  Sparkles,
  CheckCircle2,
  Zap,
  Play,
  RotateCcw,
  Compass,
  Award,
  Gamepad2,
} from 'lucide-react';

export default function CoursesPage() {
  const [selectedLanguage, setSelectedLanguage] = useState<'All' | 'Python' | 'JavaScript' | 'C'>('All');
  const [completedLessonIds, setCompletedLessonIds] = useState<string[]>([]);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const saved = JSON.parse(localStorage.getItem('dronacharya_completed_lessons_v1') || '[]');
      setCompletedLessonIds(saved);
    }
  }, []);

  const filteredCourses = COURSES_CATALOG.filter((c) => {
    if (selectedLanguage === 'All') return true;
    return c.language.toLowerCase().includes(selectedLanguage.toLowerCase());
  });

  return (
    <div className="w-full max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b-2 border-[#1E1E24] pb-6 mb-8">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#FBBF24] border-2 border-[#1E1E24] shadow-[2px_2px_0px_#1E1E24] text-xs font-black text-[#1E1E24] mb-2">
            <Compass className="w-3.5 h-3.5 text-[#1E1E24]" />
            <span>Curriculum Guild & Courses</span>
          </div>
          <h1 className="font-black text-3xl sm:text-4xl text-[#1E1E24]">
            Programming Course Realms
          </h1>
          <p className="text-sm text-[#4A4A58] font-bold mt-1">
            Learn real typed code through structured chapters, interactive laboratories, and code-controlled game simulations.
          </p>
        </div>

        {/* Language Filter */}
        <div className="flex items-center bg-white border-2 border-[#1E1E24] rounded-xl p-1 shadow-[3px_3px_0px_#1E1E24] self-start md:self-auto">
          {(['All', 'Python', 'JavaScript', 'C'] as const).map((lang) => (
            <button
              key={lang}
              onClick={() => setSelectedLanguage(lang)}
              className={`px-3.5 py-1.5 text-xs font-black rounded-lg transition-all ${
                selectedLanguage === lang
                  ? 'bg-[#6C5CE7] text-white shadow-[1px_1px_0px_#1E1E24]'
                  : 'text-[#4A4A58] hover:text-[#1E1E24]'
              }`}
            >
              {lang}
            </button>
          ))}
        </div>
      </div>

      {/* Primary Active Course Hero Card (Python 101) */}
      <div className="mb-10 card-game p-6 sm:p-8 bg-white border-2 border-[#1E1E24] shadow-[6px_6px_0px_#1E1E24] relative overflow-hidden">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 relative z-10">
          <div className="max-w-2xl space-y-3">
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-black uppercase tracking-wider px-2.5 py-0.5 rounded-lg bg-[#10B981] text-white border border-[#1E1E24] shadow-[1px_1px_0px_#1E1E24]">
                Active Adventure Track
              </span>
              <span className="text-xs font-black text-[#6C5CE7]">
                Python 101 • 8 Chapters
              </span>
            </div>

            <h2 className="font-black text-2xl sm:text-3xl text-[#1E1E24]">
              The Python Realm: Journey of Rover Arya
            </h2>

            <p className="text-xs sm:text-sm text-[#4A4A58] font-bold leading-relaxed">
              Start from your very first `print()` statement, conquer memory variables, branching conditions, loops, and lists. Drive autonomous rover Arya through actual 2D research grids using real Python code!
            </p>

            {/* Quick Stats Pill Bar */}
            <div className="flex items-center gap-4 text-xs font-black text-[#1E1E24] pt-1 flex-wrap">
              <span className="flex items-center gap-1.5">
                <BookOpen className="w-4 h-4 text-[#6C5CE7]" />
                <span>18 Interactive Lessons</span>
              </span>
              <span className="flex items-center gap-1.5">
                <Gamepad2 className="w-4 h-4 text-[#EF4444]" />
                <span>2 Playable Game Missions</span>
              </span>
              <span className="flex items-center gap-1.5">
                <Zap className="w-4 h-4 text-[#FBBF24]" />
                <span>+1200 Total XP</span>
              </span>
            </div>
          </div>

          <div className="shrink-0 flex flex-col gap-3 min-w-[200px]">
            <Link
              href="/courses/python-101"
              className="btn-game-yellow py-3 px-6 text-xs font-black shadow-[4px_4px_0px_#1E1E24] flex items-center justify-center gap-2 text-center"
            >
              <span>Explore Chapter Roadmap</span>
              <ArrowRight className="w-4 h-4" />
            </Link>

            <Link
              href="/learn/py-less-1-1"
              className="btn-game-purple py-2.5 px-6 text-xs font-black shadow-[3px_3px_0px_#1E1E24] flex items-center justify-center gap-2 text-center"
            >
              <Play className="w-3.5 h-3.5 fill-current" />
              <span>Start Chapter 1: Lesson 1</span>
            </Link>
          </div>
        </div>
      </div>

      {/* Courses Catalog Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {filteredCourses.map((course) => {
          // Calculate completed lessons for this course
          const totalLessonsInCourse = course.chapters.reduce((sum, ch) => sum + ch.lessons.length, 0);
          const completedInThisCourse = course.chapters.reduce((sum, ch) => {
            return sum + ch.lessons.filter((l) => completedLessonIds.includes(l.id)).length;
          }, 0);
          const pct = totalLessonsInCourse > 0 ? Math.round((completedInThisCourse / totalLessonsInCourse) * 100) : 0;

          return (
            <div
              key={course.id}
              className="card-game p-6 flex flex-col justify-between bg-white border-2 border-[#1E1E24] shadow-[4px_4px_0px_#1E1E24]"
            >
              <div>
                <div className="flex items-start justify-between gap-2 mb-3">
                  <div className="flex items-center gap-2">
                    <div className="w-10 h-10 rounded-xl bg-[#6C5CE7] text-white border-2 border-[#1E1E24] flex items-center justify-center shadow-[2px_2px_0px_#1E1E24]">
                      {course.iconName === 'Terminal' && <Terminal className="w-5 h-5" />}
                      {course.iconName === 'Globe' && <Globe className="w-5 h-5" />}
                      {course.iconName === 'Code2' && <Code2 className="w-5 h-5" />}
                      {course.iconName === 'Cpu' && <Cpu className="w-5 h-5" />}
                    </div>
                    <div>
                      <span className="text-[10px] font-black uppercase text-[#6C5CE7]">
                        {course.language} • {course.level}
                      </span>
                      <h3 className="font-black text-lg text-[#1E1E24] leading-tight">
                        {course.title}
                      </h3>
                    </div>
                  </div>

                  <span className={`text-[10px] font-black px-2.5 py-0.5 rounded-lg border border-[#1E1E24] shadow-[1px_1px_0px_#1E1E24] shrink-0 ${course.badgeColor}`}>
                    {course.badgeText}
                  </span>
                </div>

                <p className="text-xs text-[#4A4A58] font-bold leading-relaxed mb-4">
                  {course.description}
                </p>

                {/* Chapters Preview List */}
                {course.chapters.length > 0 && (
                  <div className="space-y-1.5 mb-4 p-3 rounded-xl bg-[#FAF6EE] border-2 border-[#1E1E24]">
                    <div className="text-[10px] font-black text-[#1E1E24] uppercase tracking-wider mb-1">
                      Curriculum Chapters ({course.chapters.length}):
                    </div>
                    {course.chapters.slice(0, 4).map((ch) => (
                      <div key={ch.id} className="text-[11px] text-[#4A4A58] font-bold flex items-center justify-between">
                        <span>Ch {ch.chapterNumber}: {ch.title.split(':')[1] || ch.title}</span>
                        <span className="text-[10px] text-[#6C5CE7] font-black">{ch.realmName}</span>
                      </div>
                    ))}
                    {course.chapters.length > 4 && (
                      <div className="text-[10px] text-[#A0A0B0] font-bold pt-1">
                        + {course.chapters.length - 4} more chapters & capstone project...
                      </div>
                    )}
                  </div>
                )}

                {/* Progress Bar if available */}
                {course.isAvailable && (
                  <div className="space-y-1 mb-4">
                    <div className="flex justify-between text-xs font-black">
                      <span className="text-[#1E1E24]">Course Progress</span>
                      <span className="text-[#6C5CE7] font-mono">{pct}%</span>
                    </div>
                    <div className="w-full h-2.5 bg-[#FAF6EE] border-2 border-[#1E1E24] rounded-full overflow-hidden">
                      <div
                        className="h-full bg-[#10B981] transition-all"
                        style={{ width: `${pct}%` }}
                      />
                    </div>
                  </div>
                )}
              </div>

              {/* Action Button */}
              <div className="pt-2">
                {course.isAvailable ? (
                  <Link
                    href={`/courses/${course.id}`}
                    className="btn-game-yellow w-full py-2.5 text-xs font-black shadow-[3px_3px_0px_#1E1E24] flex items-center justify-center gap-1.5"
                  >
                    <span>Open Syllabus & Chapter Roadmap</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </Link>
                ) : (
                  <button
                    disabled
                    className="btn-game-white w-full py-2 text-xs font-bold opacity-60 cursor-not-allowed text-center"
                  >
                    Curriculum In Training
                  </button>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
