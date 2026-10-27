// Dronacharya Course Syllabus & Chapters Roadmap
// Detailed chapter breakdown, lessons list, boss challenge trials, and connected game missions
'use client';

import React, { useState, useEffect, Suspense } from 'react';
import Link from 'next/link';
import { useParams, useRouter } from 'next/navigation';
import { findCourseBySlugOrId, Chapter, Lesson } from '@/lib/data/course-system';
import {
  BookOpen,
  ArrowRight,
  Sparkles,
  CheckCircle2,
  Lock,
  Gamepad2,
  Terminal,
  Zap,
  Play,
  Award,
  ChevronRight,
  ShieldCheck,
  FolderGit2,
  Compass,
} from 'lucide-react';
import { getLearnerProgress } from '@/lib/curriculum/progression-engine';

export default function CourseDetailPage() {
  return (
    <Suspense
      fallback={
        <div className="max-w-5xl mx-auto py-16 px-4 text-center">
          <div className="inline-block animate-spin w-8 h-8 border-4 border-[#6C5CE7] border-t-transparent rounded-full mb-4" />
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
  const rawId = (params?.courseId as string) || 'python-101';
  const course = findCourseBySlugOrId(rawId);

  const [completedLessonIds, setCompletedLessonIds] = useState<string[]>([]);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const p = getLearnerProgress();
      setCompletedLessonIds(p.completedLessonIds);
    }
  }, []);

  if (!course) {
    return (
      <div className="max-w-4xl mx-auto py-16 px-4 text-center">
        <h1 className="text-2xl font-black text-[#1E1E24]">Course Not Found</h1>
        <Link href="/courses" className="btn-game-purple mt-4 inline-flex py-2 px-4 text-xs font-black">
          ← Return to Courses
        </Link>
      </div>
    );
  }

  // Calculate stats
  const totalLessons = course.chapters.reduce((sum, ch) => sum + ch.lessons.length, 0);
  const completedCount = course.chapters.reduce((sum, ch) => {
    return sum + ch.lessons.filter((l) => completedLessonIds.includes(l.id)).length;
  }, 0);
  const completionPct = totalLessons > 0 ? Math.round((completedCount / totalLessons) * 100) : 0;

  // Find first uncompleted lesson
  let nextLessonId = 'py-less-1-1';
  for (const ch of course.chapters) {
    for (const l of ch.lessons) {
      if (!completedLessonIds.includes(l.id)) {
        nextLessonId = l.id;
        break;
      }
    }
    if (nextLessonId !== 'py-less-1-1') break;
  }

  return (
    <div className="w-full max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      {/* Breadcrumb */}
      <div className="flex items-center gap-2 text-xs font-bold text-[#4A4A58] mb-6">
        <Link href="/courses" className="hover:text-[#6C5CE7] flex items-center gap-1">
          <BookOpen className="w-3.5 h-3.5" />
          <span>Courses</span>
        </Link>
        <ChevronRight className="w-3.5 h-3.5 text-[#A0A0B0]" />
        <span className="text-[#1E1E24] font-black">{course.title}</span>
      </div>

      {/* Course Hero Card */}
      <div className="mb-10 card-game p-6 sm:p-8 bg-white border-2 border-[#1E1E24] shadow-[6px_6px_0px_#1E1E24]">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          <div className="max-w-2xl space-y-3">
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-black uppercase px-2.5 py-0.5 rounded-lg bg-[#6C5CE7] text-white border border-[#1E1E24] shadow-[1px_1px_0px_#1E1E24]">
                {course.language}
              </span>
              <span className="text-[10px] font-black uppercase px-2.5 py-0.5 rounded-lg bg-[#FBBF24] text-[#1E1E24] border border-[#1E1E24] shadow-[1px_1px_0px_#1E1E24]">
                {course.level}
              </span>
              <span className="text-xs font-black text-[#10B981]">
                {completionPct}% Complete ({completedCount}/{totalLessons} Lessons)
              </span>
            </div>

            <h1 className="font-black text-2xl sm:text-4xl text-[#1E1E24]">
              {course.title}
            </h1>

            <p className="text-xs sm:text-sm text-[#4A4A58] font-bold leading-relaxed">
              {course.description}
            </p>

            {/* Overall Progress Bar */}
            <div className="pt-2 max-w-md">
              <div className="w-full h-3 bg-[#FAF6EE] border-2 border-[#1E1E24] rounded-full overflow-hidden">
                <div
                  className="h-full bg-[#10B981] transition-all"
                  style={{ width: `${completionPct}%` }}
                />
              </div>
            </div>
          </div>

          <div className="shrink-0 flex flex-col gap-3 min-w-[200px]">
            <Link
              href={`/learn/${nextLessonId}`}
              className="btn-game-yellow py-3 px-6 text-xs font-black shadow-[4px_4px_0px_#1E1E24] flex items-center justify-center gap-2 text-center"
            >
              <Play className="w-3.5 h-3.5 fill-current" />
              <span>{completedCount > 0 ? 'Continue Lesson Journey' : 'Start Lesson 1.1'}</span>
            </Link>

            <Link
              href="/paths"
              className="btn-game-purple py-2 px-6 text-xs font-black shadow-[2px_2px_0px_#1E1E24] flex items-center justify-center gap-2 text-center"
            >
              <Compass className="w-3.5 h-3.5" />
              <span>View Interactive World Map</span>
            </Link>
          </div>
        </div>
      </div>

      {/* Chapters & Lessons Syllabus Section */}
      <div className="space-y-8">
        <div className="flex items-center justify-between border-b-2 border-[#1E1E24] pb-3">
          <h2 className="font-black text-xl sm:text-2xl text-[#1E1E24] flex items-center gap-2">
            <BookOpen className="w-5 h-5 text-[#6C5CE7]" />
            <span>Chapter Curriculum & Quest Objectives</span>
          </h2>
          <span className="text-xs font-black text-[#4A4A58]">
            {course.chapters.length} Progressive Chapters
          </span>
        </div>

        <div className="space-y-6">
          {course.chapters.map((chapter) => {
            const isChapterMastered = chapter.lessons.every((l) => completedLessonIds.includes(l.id));

            return (
              <div
                key={chapter.id}
                className="card-game p-6 bg-white border-2 border-[#1E1E24] shadow-[4px_4px_0px_#1E1E24] space-y-5"
              >
                {/* Chapter Banner */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b-2 border-[#1E1E24] pb-4">
                  <div className="flex items-start gap-3">
                    <div
                      className="w-10 h-10 rounded-xl border-2 border-[#1E1E24] text-white flex items-center justify-center font-black text-sm shrink-0 shadow-[2px_2px_0px_#1E1E24]"
                      style={{ backgroundColor: chapter.color }}
                    >
                      {chapter.chapterNumber}
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-[10px] font-black uppercase text-[#6C5CE7]">
                          Realm: {chapter.realmName}
                        </span>
                        {isChapterMastered && (
                          <span className="text-[9px] bg-[#10B981] text-white px-2 py-0.2 rounded font-black border border-[#1E1E24]">
                            Chapter Mastered ✓
                          </span>
                        )}
                      </div>
                      <h3 className="font-black text-lg text-[#1E1E24] leading-tight">
                        {chapter.title}
                      </h3>
                      <p className="text-xs text-[#4A4A58] font-bold mt-0.5">
                        {chapter.description}
                      </p>
                    </div>
                  </div>

                  <span className="text-xs font-black text-[#FBBF24] bg-[#1E1E24] px-3 py-1 rounded-lg border border-[#1E1E24] shrink-0 self-start sm:self-auto">
                    {chapter.lessons.length} Lessons + Boss Trial
                  </span>
                </div>

                {/* Lesson Cards Grid */}
                <div className="space-y-2.5">
                  <div className="text-[11px] font-black uppercase text-[#1E1E24] tracking-wider">
                    Interactive Lessons in this Chapter:
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    {chapter.lessons.map((lesson) => {
                      const isDone = completedLessonIds.includes(lesson.id);

                      return (
                        <Link
                          key={lesson.id}
                          href={`/learn/${lesson.id}`}
                          className={`p-3.5 rounded-xl border-2 border-[#1E1E24] transition-all flex items-center justify-between gap-3 group ${
                            isDone
                              ? 'bg-[#D1FAE5] shadow-[2px_2px_0px_#1E1E24]'
                              : 'bg-white hover:bg-[#FAF6EE] shadow-[3px_3px_0px_#1E1E24]'
                          }`}
                        >
                          <div className="flex items-center gap-2.5 min-w-0">
                            <div
                              className={`w-7 h-7 rounded-lg border-2 border-[#1E1E24] flex items-center justify-center font-black text-xs shrink-0 ${
                                isDone ? 'bg-[#10B981] text-white' : 'bg-[#FAF6EE] text-[#1E1E24]'
                              }`}
                            >
                              {isDone ? '✓' : lesson.sequenceOrder}
                            </div>
                            <div className="min-w-0">
                              <h4 className="font-black text-xs text-[#1E1E24] truncate group-hover:text-[#6C5CE7]">
                                {lesson.title}
                              </h4>
                              <p className="text-[10px] text-[#4A4A58] font-bold truncate">
                                {lesson.subtitle}
                              </p>
                            </div>
                          </div>

                          <div className="flex items-center gap-1 text-[11px] font-black text-[#6C5CE7] shrink-0">
                            <span>+{lesson.xpReward} XP</span>
                            <ChevronRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
                          </div>
                        </Link>
                      );
                    })}
                  </div>
                </div>

                {/* Connected Playable Game Mission Banner (if applicable, e.g. Rescue the Robot) */}
                {chapter.connectedGameMissionId && (
                  <div className="p-4 rounded-xl bg-[#FAF6EE] border-2 border-[#1E1E24] shadow-[3px_3px_0px_#1E1E24] flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl bg-[#6C5CE7] text-white flex items-center justify-center border-2 border-[#1E1E24] shadow-[2px_2px_0px_#1E1E24] shrink-0">
                        <Gamepad2 className="w-5 h-5" />
                      </div>
                      <div>
                        <div className="flex items-center gap-1.5 font-black text-xs text-[#1E1E24]">
                          <span>Connected Game Mission: Rescue the Robot (2D Grid Simulation)</span>
                          <span className="text-[9px] bg-[#10B981] text-white px-1.5 py-0.2 rounded font-black">Live</span>
                        </div>
                        <p className="text-[11px] text-[#4A4A58] font-bold mt-0.5">
                          Write Python code that directly propels the rover across obstacles and collects batteries!
                        </p>
                      </div>
                    </div>

                    <Link
                      href={`/simulator?mission=${chapter.connectedGameMissionId}`}
                      className="btn-game-purple py-2 px-4 text-xs font-black shadow-[2px_2px_0px_#1E1E24] shrink-0 flex items-center gap-1.5"
                    >
                      <Play className="w-3.5 h-3.5 fill-current" />
                      <span>Play Mission Simulator</span>
                    </Link>
                  </div>
                )}

                {/* Connected Capstone Project (if applicable) */}
                {chapter.connectedProjectId && (
                  <div className="p-4 rounded-xl bg-[#FEF3C7] border-2 border-[#1E1E24] shadow-[3px_3px_0px_#1E1E24] flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl bg-[#FBBF24] text-[#1E1E24] flex items-center justify-center border-2 border-[#1E1E24] shadow-[2px_2px_0px_#1E1E24] shrink-0">
                        <FolderGit2 className="w-5 h-5" />
                      </div>
                      <div>
                        <div className="font-black text-xs text-[#1E1E24]">
                          Connected Capstone Project: Autonomous Rover Navigation
                        </div>
                        <p className="text-[11px] text-[#4A4A58] font-bold mt-0.5">
                          Multi-file production architecture evaluated against a transparent 100-point rubric.
                        </p>
                      </div>
                    </div>

                    <Link
                      href="/projects"
                      className="btn-game-yellow py-2 px-4 text-xs font-black shadow-[2px_2px_0px_#1E1E24] shrink-0 flex items-center gap-1.5"
                    >
                      <Award className="w-3.5 h-3.5" />
                      <span>Open Capstone Studio</span>
                    </Link>
                  </div>
                )}

                {/* Chapter Boss Challenge Card */}
                <div className="p-4 rounded-xl bg-[#1E1E24] text-white border-2 border-[#1E1E24] shadow-[3px_3px_0px_#1E1E24] flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div className="space-y-1">
                    <div className="flex items-center gap-1.5 text-xs font-black text-[#FBBF24]">
                      <Zap className="w-4 h-4" />
                      <span>{chapter.bossChallenge.title}</span>
                    </div>
                    <p className="text-[11px] text-[#A0A0B0] font-bold">
                      {chapter.bossChallenge.description}
                    </p>
                  </div>

                  <Link
                    href={`/learn/${chapter.lessons[0].id}`}
                    className="btn-game-yellow py-2 px-4 text-xs font-black shadow-[2px_2px_0px_#FAF6EE] shrink-0 text-center"
                  >
                    <span>Enter Boss Challenge Trial</span>
                  </Link>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
