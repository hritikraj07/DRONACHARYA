// Dronacharya Course Syllabus & Chapters Roadmap
// Faithful Codédex syllabus with collapsible chapter accordions, prerequisites, and dynamic lesson routing
'use client';

import React, { useState, useEffect, Suspense } from 'react';
import Link from 'next/link';
import { useParams, useRouter } from 'next/navigation';
import { findCourseBySlugOrId, Chapter, Lesson } from '@/lib/data/course-system';
import {
  BookOpen,
  ArrowRight,
  ArrowLeft,
  Sparkles,
  CheckCircle2,
  Lock,
  Gamepad2,
  Terminal,
  Zap,
  Play,
  Award,
  ChevronRight,
  ChevronDown,
  ShieldCheck,
  Compass,
  AlertCircle,
} from 'lucide-react';
import { getLearnerProgress } from '@/lib/curriculum/progression-engine';

export default function CourseDetailPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-[#F5F2EB] flex flex-col items-center justify-center p-4">
          <div className="w-10 h-10 border-4 border-[#6C5CE7] border-t-transparent rounded-full animate-spin mb-4" />
          <p className="font-mono text-sm font-bold text-gray-500">Loading course curriculum...</p>
        </div>
      }
    >
      <CourseDetailContent />
    </Suspense>
  );
}

function CourseDetailContent() {
  const params = useParams();
  const rawId = (params?.courseId as string) || 'html';
  const course = findCourseBySlugOrId(rawId);

  const [completedLessonIds, setCompletedLessonIds] = useState<string[]>([]);
  // Accordion state: Set of open chapter IDs (open all by default)
  const [openChapters, setOpenChapters] = useState<Record<string, boolean>>({});

  useEffect(() => {
    if (typeof window !== 'undefined') {
      try {
        const p = getLearnerProgress();
        setCompletedLessonIds(p.completedLessonIds || []);
      } catch (e) {}
    }
  }, []);

  useEffect(() => {
    if (course) {
      // Default open all chapters
      const initOpen: Record<string, boolean> = {};
      course.chapters.forEach((ch) => {
        initOpen[ch.id] = true;
      });
      setOpenChapters(initOpen);
    }
  }, [course?.id]);

  const toggleChapter = (chapterId: string) => {
    setOpenChapters((prev) => ({
      ...prev,
      [chapterId]: !prev[chapterId],
    }));
  };

  if (!course) {
    return (
      <div className="min-h-screen bg-[#F5F2EB] flex flex-col items-center justify-center p-6 text-center">
        <h1 className="text-2xl font-black text-[#1E1E24]">Course Realm Not Found</h1>
        <p className="text-sm font-bold text-gray-500 mt-2">The requested curriculum does not exist.</p>
        <Link
          href="/courses"
          className="mt-4 px-6 py-2.5 bg-[#6C5CE7] text-white font-black text-xs rounded-xl border-2 border-[#1E1E24] shadow-[3px_3px_0px_#1E1E24]"
        >
          ← Return to Courses Catalog
        </Link>
      </div>
    );
  }

  // Calculate completion stats
  const totalLessons = course.chapters.reduce((sum, ch) => sum + ch.lessons.length, 0);
  const completedCount = course.chapters.reduce((sum, ch) => {
    return sum + ch.lessons.filter((l) => completedLessonIds.includes(l.id)).length;
  }, 0);
  const completionPct = totalLessons > 0 ? Math.round((completedCount / totalLessons) * 100) : 0;

  // Find next lesson to play
  let nextLessonId = course.chapters[0]?.lessons[0]?.id || `${course.id}-less-1-1`;
  for (const ch of course.chapters) {
    for (const l of ch.lessons) {
      if (!completedLessonIds.includes(l.id)) {
        nextLessonId = l.id;
        break;
      }
    }
    if (nextLessonId !== course.chapters[0]?.lessons[0]?.id) break;
  }

  // COMING SOON VIEW
  if (course.isComingSoon) {
    return (
      <div className="min-h-screen bg-[#F5F2EB] py-12 px-4 sm:px-6 lg:px-8 text-[#1E1E24]">
        <div className="max-w-3xl mx-auto space-y-6">
          <Link
            href="/courses"
            className="inline-flex items-center gap-1.5 text-xs font-black text-[#4A4A58] hover:text-[#1E1E24]"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Back to All Courses</span>
          </Link>

          <div className="bg-white rounded-3xl border-2 border-[#1E1E24] p-8 sm:p-12 shadow-[8px_8px_0px_#1E1E24] text-center space-y-6">
            <div className="w-20 h-20 mx-auto rounded-3xl bg-amber-100 border-2 border-[#1E1E24] text-amber-700 flex items-center justify-center shadow-[4px_4px_0px_#1E1E24]">
              <Lock className="w-10 h-10" />
            </div>

            <div className="space-y-2">
              <span className="px-3 py-1 rounded-full bg-amber-200 text-amber-900 border border-[#1E1E24] text-xs font-black uppercase">
                Coming Soon ⏳
              </span>
              <h1 className="text-3xl sm:text-4xl font-black text-[#1E1E24] mt-2">
                {course.title}
              </h1>
              <p className="text-sm font-bold text-[#4A4A58] max-w-lg mx-auto">
                {course.description}
              </p>
            </div>

            <div className="p-5 rounded-2xl bg-[#FAF6EE] border-2 border-[#1E1E24] max-w-md mx-auto text-left space-y-3">
              <div className="text-xs font-black text-[#1E1E24] uppercase flex items-center gap-1.5">
                <Sparkles className="w-4 h-4 text-[#6C5CE7]" />
                <span>What our educators are crafting:</span>
              </div>
              <ul className="text-xs font-bold text-[#4A4A58] space-y-2 pl-4 list-disc">
                <li>Interactive browser laboratories with zero external setup</li>
                <li>Visual game-based challenges & boss battles</li>
                <li>Progressive real-time assertions with instant feedback</li>
                <li>Socratic mentorship with Acharya AI guidance</li>
              </ul>
            </div>

            <div className="pt-4 flex flex-wrap justify-center gap-3">
              <Link
                href="/courses"
                className="px-6 py-3 bg-[#1E1E24] text-white font-black text-xs rounded-xl border-2 border-[#1E1E24] shadow-[3px_3px_0px_#6C5CE7] transition-all hover:scale-105"
              >
                ← Explore Active Quests
              </Link>
              <Link
                href="/learn/html-less-1-1"
                className="px-6 py-3 bg-[#FFD214] text-[#1E1E24] font-black text-xs rounded-xl border-2 border-[#1E1E24] shadow-[3px_3px_0px_#1E1E24] transition-all hover:scale-105"
              >
                Play HTML 101 Now →
              </Link>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // ACTIVE COURSE SYLLABUS VIEW
  return (
    <div className="min-h-screen bg-[#F5F2EB] py-10 px-4 sm:px-6 lg:px-8 text-[#1E1E24]">
      <div className="max-w-5xl mx-auto space-y-8">
        {/* Breadcrumb Navigation */}
        <div className="flex items-center gap-2 text-xs font-bold text-[#4A4A58]">
          <Link href="/courses" className="hover:text-[#1E1E24] flex items-center gap-1">
            <BookOpen className="w-3.5 h-3.5" />
            <span>Courses</span>
          </Link>
          <ChevronRight className="w-3.5 h-3.5 text-gray-400" />
          <span className="text-[#1E1E24] font-black">{course.title}</span>
        </div>

        {/* HERO COURSE CARD */}
        <div className="bg-white rounded-3xl border-2 border-[#1E1E24] p-6 sm:p-8 shadow-[8px_8px_0px_#1E1E24] flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="max-w-2xl space-y-3">
            <div className="flex items-center gap-2 flex-wrap">
              <span
                className="px-3 py-1 rounded-lg text-xs font-mono font-black uppercase text-white shadow-[2px_2px_0px_#1E1E24] border border-[#1E1E24]"
                style={{ backgroundColor: course.themeColor || '#6C5CE7' }}
              >
                {course.language}
              </span>
              <span className="px-3 py-1 rounded-lg text-xs font-black uppercase bg-[#FFD214] text-[#1E1E24] border border-[#1E1E24] shadow-[2px_2px_0px_#1E1E24]">
                {course.level}
              </span>
              <span className="px-3 py-1 rounded-lg text-xs font-black bg-emerald-100 text-emerald-800 border border-emerald-300">
                +{course.xpReward || 250} Total XP
              </span>
            </div>

            <h1 className="text-2xl sm:text-4xl font-black text-[#1E1E24] tracking-tight">
              {course.title}
            </h1>

            <p className="text-xs sm:text-sm font-bold text-[#4A4A58] leading-relaxed">
              {course.description}
            </p>

            {/* Progress Bar */}
            <div className="pt-2 max-w-md space-y-1.5">
              <div className="flex justify-between text-xs font-mono font-bold text-gray-500">
                <span>Progress: {completionPct}%</span>
                <span>{completedCount} of {totalLessons} Quests</span>
              </div>
              <div className="w-full h-3 bg-[#FAF6EE] border-2 border-[#1E1E24] rounded-full overflow-hidden">
                <div
                  className="h-full bg-[#00B894] transition-all duration-300"
                  style={{ width: `${completionPct}%` }}
                />
              </div>
            </div>
          </div>

          {/* Action CTAs */}
          <div className="shrink-0 flex flex-col gap-3 min-w-[200px]">
            <Link
              href={`/learn/${nextLessonId}`}
              className="btn-arcade btn-arcade-purple py-3 px-6 flex items-center justify-center gap-2 text-center"
            >
              <Play className="w-3.5 h-3.5 fill-current" />
              <span>{completedCount > 0 ? 'Continue Quest' : 'Start Chapter 1'}</span>
            </Link>

            <Link
              href="/simulator"
              className="btn-arcade btn-arcade-white py-2.5 px-6 flex items-center justify-center gap-2 text-center"
            >
              <Gamepad2 className="w-3.5 h-3.5" />
              <span>Free Code Sandbox</span>
            </Link>
          </div>
        </div>

        {/* SYLLABUS CHAPTER ACCORDIONS */}
        <div className="space-y-4">
          <div className="flex items-center justify-between border-b-2 border-[#1E1E24] pb-3">
            <h2 className="font-black text-lg sm:text-xl text-[#1E1E24] flex items-center gap-2">
              <BookOpen className="w-5 h-5 text-[#6C5CE7]" />
              <span>Realm Chapters & Quests</span>
            </h2>
            <span className="text-xs font-mono font-bold text-gray-500">
              {course.chapters.length} Chapters • {totalLessons} Interactive Quests
            </span>
          </div>

          <div className="space-y-4">
            {course.chapters.map((chapter) => {
              const isOpen = openChapters[chapter.id] ?? true;
              const chapterMastered = chapter.lessons.every((l) =>
                completedLessonIds.includes(l.id)
              );

              return (
                <div
                  key={chapter.id}
                  className="bg-white rounded-2xl border-2 border-[#1E1E24] shadow-[4px_4px_0px_#1E1E24] overflow-hidden"
                >
                  {/* Chapter Accordion Header */}
                  <button
                    onClick={() => toggleChapter(chapter.id)}
                    className="w-full p-4 sm:p-5 flex items-center justify-between text-left hover:bg-[#FAF6EE] transition-colors border-b-2 border-transparent focus:outline-none"
                  >
                    <div className="flex items-center gap-3 sm:gap-4">
                      <div
                        className="w-10 h-10 rounded-xl border-2 border-[#1E1E24] text-white flex items-center justify-center font-mono font-black text-sm shrink-0 shadow-[2px_2px_0px_#1E1E24]"
                        style={{ backgroundColor: chapter.color || '#6C5CE7' }}
                      >
                        {chapter.chapterNumber}
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="text-[10px] font-black uppercase text-[#6C5CE7]">
                            Realm: {chapter.realmName}
                          </span>
                          {chapterMastered && (
                            <span className="text-[9px] bg-emerald-500 text-white px-2 py-0.5 rounded font-black border border-[#1E1E24]">
                              Mastered ✓
                            </span>
                          )}
                        </div>
                        <h3 className="font-black text-base sm:text-lg text-[#1E1E24]">
                          {chapter.title}
                        </h3>
                        <p className="text-xs font-bold text-gray-500 mt-0.5 hidden sm:block">
                          {chapter.description}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-3 shrink-0">
                      <span className="text-xs font-mono font-bold text-gray-400 hidden md:inline">
                        {chapter.lessons.length} {chapter.lessons.length === 1 ? 'Quest' : 'Quests'}
                      </span>
                      {isOpen ? (
                        <ChevronDown className="w-5 h-5 text-gray-500" />
                      ) : (
                        <ChevronRight className="w-5 h-5 text-gray-500" />
                      )}
                    </div>
                  </button>

                  {/* Chapter Lessons List */}
                  {isOpen && (
                    <div className="divide-y-2 divide-gray-100 bg-[#FAF6EE] p-3 sm:p-4 space-y-2">
                      {chapter.lessons.map((less, idx) => {
                        const isDone = completedLessonIds.includes(less.id);
                        return (
                          <div
                            key={less.id}
                            className="bg-white rounded-xl border-2 border-[#1E1E24] p-3.5 sm:p-4 flex items-center justify-between gap-4 shadow-[2px_2px_0px_#1E1E24] hover:shadow-[3px_3px_0px_#1E1E24] transition-all"
                          >
                            <div className="flex items-center gap-3 sm:gap-4 min-w-0">
                              <div
                                className={`w-8 h-8 rounded-lg border-2 border-[#1E1E24] flex items-center justify-center font-mono text-xs font-black shrink-0 ${
                                  isDone
                                    ? 'bg-emerald-400 text-white'
                                    : 'bg-[#FAF6EE] text-[#1E1E24]'
                                }`}
                              >
                                {isDone ? (
                                  <CheckCircle2 className="w-4 h-4" />
                                ) : (
                                  idx + 1
                                )}
                              </div>
                              <div className="min-w-0">
                                <h4 className="font-black text-xs sm:text-sm text-[#1E1E24] truncate">
                                  {less.title}
                                </h4>
                                <p className="text-[11px] font-bold text-gray-500 truncate">
                                  {less.subtitle}
                                </p>
                              </div>
                            </div>

                            <div className="flex items-center gap-2 sm:gap-3 shrink-0">
                              <span className="text-[11px] font-mono font-black text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200 hidden sm:inline">
                                +{less.xpReward || 30} XP
                              </span>

                              <Link
                                href={`/learn/${less.id}`}
                                className="px-3.5 py-1.5 bg-[#6C5CE7] hover:bg-[#5A4AD1] text-white font-black text-xs rounded-lg border border-[#1E1E24] shadow-[2px_2px_0px_#1E1E24] flex items-center gap-1 transition-transform hover:scale-105"
                              >
                                <span>{isDone ? 'Review' : 'Play'}</span>
                                <ArrowRight className="w-3 h-3" />
                              </Link>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
