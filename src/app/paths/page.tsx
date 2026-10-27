// Dronacharya Structured Python Learning Roadmap (10 Stages, 112 Topics)
// Deterministic progression with prerequisite checking, real completion stats, and instant lesson jump
'use client';

import React, { useState, useEffect, Suspense } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import {
  PYTHON_STAGES_CATALOG,
  CurriculumStage,
  CurriculumTopic,
  findTopicById,
} from '@/lib/data/python-curriculum-112';
import {
  getLearnerProgress,
  getLessonAccessState,
  checkPrerequisites,
  getNextRecommendedActivity,
  LearnerProgressState,
  LessonAccessState,
} from '@/lib/curriculum/progression-engine';
import { WorldMap } from '@/components/game/WorldMap';
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
  ChevronRight,
  Target,
  Flame,
  Info,
  HelpCircle,
  FolderGit2,
  BookOpen,
  Map,
  X,
} from 'lucide-react';

export default function PathsPage() {
  return (
    <Suspense
      fallback={
        <div className="max-w-7xl mx-auto px-4 py-16 text-center">
          <div className="inline-block animate-spin w-8 h-8 border-4 border-[#6C5CE7] border-t-transparent rounded-full mb-4" />
          <p className="font-mono text-sm font-bold text-gray-500">Loading Python Curriculum Roadmap...</p>
        </div>
      }
    >
      <PathsContent />
    </Suspense>
  );
}

function PathsContent() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<'roadmap' | 'worldmap'>('worldmap');
  const [selectedStageNum, setSelectedStageNum] = useState<number>(1);
  const [progressState, setProgressState] = useState<LearnerProgressState | null>(null);
  const [inspectingTopic, setInspectingTopic] = useState<CurriculumTopic | null>(null);
  const [prereqNotice, setPrereqNotice] = useState<string | null>(null);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const p = getLearnerProgress();
      setProgressState(p);
    }
  }, []);

  const progress = progressState || {
    userId: 'guest',
    courseId: 'python-101',
    completedLessonIds: [],
    masteredLessonIds: [],
    completedActivityIds: [],
    currentLessonId: 'py-topic-1',
    activityAttempts: {},
    strugglingConceptTags: [],
    totalXp: 0,
    lastActiveTimestamp: '2026-10-27T00:00:00.000Z',
  };

  const recommendation = getNextRecommendedActivity(progress);

  const totalTopics = 112;
  const completedCount = progress.completedLessonIds.length;
  const masteredCount = progress.masteredLessonIds.length;
  const progressPercent = Math.min(100, Math.round((completedCount / totalTopics) * 100));

  const handleTopicClick = (topic: CurriculumTopic, state: LessonAccessState) => {
    if (state === 'locked') {
      const check = checkPrerequisites(topic.id, progress.completedLessonIds);
      setPrereqNotice(check.explanation);
      setInspectingTopic(topic);
      return;
    }

    if (topic.contentStatus === 'coming_soon') {
      setInspectingTopic(topic);
      return;
    }

    // Navigate to lesson laboratory
    router.push(`/learn/${topic.id}`);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 w-full">
      {/* Header & Tabs */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-8">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-black bg-[#D1FAE5] text-[#059669] border border-[#059669] mb-3">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Deterministic Python Learning Roadmap</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-black text-[#1E1E24] tracking-tight">
            The Python Gurukul Roadmap
          </h1>
          <p className="text-sm font-bold text-[#4A4A58] mt-1 max-w-2xl">
            10 Stages • 112 Structured Topics • Zero Arbitrary Questions. Every lesson unlocks strictly through mastered prerequisites and proven code execution.
          </p>
        </div>

        {/* View Switcher Tabs */}
        <div className="flex items-center gap-2 bg-white p-1 rounded-xl border-2 border-[#1E1E24] shadow-[3px_3px_0px_#1E1E24]">
          <button
            onClick={() => setActiveTab('roadmap')}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-black transition-all ${
              activeTab === 'roadmap'
                ? 'bg-[#6C5CE7] text-white shadow-[2px_2px_0px_#1E1E24]'
                : 'text-[#4A4A58] hover:bg-[#FAF6EE]'
            }`}
          >
            <BookOpen className="w-4 h-4" />
            <span>Curriculum Roadmap</span>
          </button>
          <button
            onClick={() => setActiveTab('worldmap')}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-black transition-all ${
              activeTab === 'worldmap'
                ? 'bg-[#6C5CE7] text-white shadow-[2px_2px_0px_#1E1E24]'
                : 'text-[#4A4A58] hover:bg-[#FAF6EE]'
            }`}
          >
            <Map className="w-4 h-4" />
            <span>2D Game World</span>
          </button>
        </div>
      </div>

      {activeTab === 'worldmap' ? (
        <WorldMap />
      ) : (
        <div className="space-y-8">
          {/* Active Diagnostic & Recommendation Banner (Answers all 6 Core Questions) */}
          <div className="bg-white rounded-2xl border-2 border-[#1E1E24] p-6 shadow-[5px_5px_0px_#1E1E24]">
            <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
              <div className="space-y-2 max-w-3xl">
                <div className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-[#10B981] animate-ping" />
                  <span className="text-xs font-black uppercase tracking-wider text-[#6C5CE7]">
                    Current Learning Objective
                  </span>
                  <span className="text-xs text-gray-400 font-bold">•</span>
                  <span className="text-xs font-bold text-gray-500">
                    {completedCount} of {totalTopics} Topics Completed ({progressPercent}%)
                  </span>
                </div>
                <h2 className="text-xl sm:text-2xl font-black text-[#1E1E24]">
                  {recommendation.coreAnswers.whatIsLearnerLearning}
                </h2>
                <p className="text-xs sm:text-sm font-bold text-[#4A4A58]">
                  <strong className="text-[#1E1E24]">Why:</strong> {recommendation.coreAnswers.whyIsConceptTaught}
                </p>

                {/* Micro diagnostic answers */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-2 text-xs font-bold text-gray-600">
                  <div className="bg-[#FAF6EE] p-2.5 rounded-lg border border-[#1E1E24]/20">
                    <span className="text-[#6C5CE7] font-black">Prerequisites:</span>{' '}
                    {recommendation.coreAnswers.whatMustLearnerKnowBefore.join(', ')}
                  </div>
                  <div className="bg-[#FAF6EE] p-2.5 rounded-lg border border-[#1E1E24]/20">
                    <span className="text-[#10B981] font-black">Next Activity:</span>{' '}
                    {recommendation.coreAnswers.whatActivityNext}
                  </div>
                </div>
              </div>

              {/* Action Button */}
              <div className="flex flex-col items-start lg:items-end gap-3 flex-shrink-0">
                <Link
                  href={`/learn/${recommendation.currentTopic.id}`}
                  className="btn-game-purple flex items-center justify-center gap-2 py-3 px-6 text-sm font-black shadow-[4px_4px_0px_#1E1E24]"
                >
                  <Play className="w-4 h-4 fill-current" />
                  <span>Resume Current Lesson</span>
                  <ArrowRight className="w-4 h-4" />
                </Link>
                <span className="text-[11px] font-bold text-gray-400 text-right">
                  Earn +{recommendation.currentTopic.activities?.[0]?.xpReward || 35} XP on next test
                </span>
              </div>
            </div>

            {/* Overall Progress Bar */}
            <div className="mt-6 pt-4 border-t border-[#1E1E24]/10">
              <div className="flex justify-between items-center text-xs font-black text-[#1E1E24] mb-1.5">
                <span>Curriculum Mastery Progress</span>
                <span>{progressPercent}% Complete</span>
              </div>
              <div className="w-full bg-[#E5E7EB] h-3 rounded-full overflow-hidden border border-[#1E1E24]/40">
                <div
                  className="bg-gradient-to-r from-[#10B981] via-[#6C5CE7] to-[#FBBF24] h-full transition-all duration-500"
                  style={{ width: `${Math.max(3, progressPercent)}%` }}
                />
              </div>
            </div>
          </div>

          {/* Stage Selector Pills (1 to 10) */}
          <div className="overflow-x-auto pb-2 scrollbar-none">
            <div className="flex items-center gap-2 min-w-max">
              {PYTHON_STAGES_CATALOG.map((stage) => {
                const isSelected = selectedStageNum === stage.stageNumber;
                const stageCompletedCount = stage.topics.filter((t) =>
                  progress.completedLessonIds.includes(t.id)
                ).length;
                const isStageComplete = stageCompletedCount === stage.totalTopics && stage.totalTopics > 0;

                return (
                  <button
                    key={stage.id}
                    onClick={() => setSelectedStageNum(stage.stageNumber)}
                    className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-black transition-all border-2 ${
                      isSelected
                        ? 'bg-[#1E1E24] text-white border-[#1E1E24] shadow-[3px_3px_0px_#6C5CE7]'
                        : 'bg-white text-[#1E1E24] border-[#1E1E24] shadow-[2px_2px_0px_#1E1E24] hover:bg-[#FAF6EE]'
                    }`}
                  >
                    <span>Stage {stage.stageNumber}</span>
                    {isStageComplete ? (
                      <CheckCircle2 className="w-3.5 h-3.5 text-[#10B981]" />
                    ) : (
                      <span className="text-[10px] px-1.5 py-0.5 rounded bg-gray-200 text-gray-700">
                        {stageCompletedCount}/{stage.totalTopics}
                      </span>
                    )}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Current Stage Breakdown */}
          {PYTHON_STAGES_CATALOG.filter((s) => s.stageNumber === selectedStageNum).map((stage) => {
            return (
              <div
                key={stage.id}
                className="bg-white rounded-2xl border-2 border-[#1E1E24] p-6 shadow-[5px_5px_0px_#1E1E24] space-y-6"
              >
                {/* Stage Header */}
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-[#1E1E24]/10">
                  <div>
                    <div className="flex items-center gap-2 mb-2">
                      <span
                        className="px-2.5 py-1 rounded-md text-[11px] font-black uppercase tracking-wider"
                        style={{ backgroundColor: stage.accentBg, color: stage.color }}
                      >
                        {stage.realmName}
                      </span>
                      <span className="text-xs font-bold text-gray-400">
                        {stage.topics.length} Sequential Topics
                      </span>
                    </div>
                    <h2 className="text-2xl sm:text-3xl font-black text-[#1E1E24]">
                      {stage.title}
                    </h2>
                    <p className="text-sm font-bold text-[#4A4A58] mt-1 max-w-3xl">
                      {stage.description}
                    </p>
                  </div>

                  {/* Stage Project Card */}
                  <div className="bg-[#FAF6EE] p-4 rounded-xl border-2 border-[#1E1E24] shadow-[3px_3px_0px_#1E1E24] max-w-sm flex-shrink-0">
                    <div className="flex items-center gap-2 text-xs font-black text-[#F59E0B] uppercase">
                      <FolderGit2 className="w-4 h-4" />
                      <span>Stage Capstone Project</span>
                    </div>
                    <h4 className="font-black text-sm text-[#1E1E24] mt-1">
                      {stage.projectTitle}
                    </h4>
                    <p className="text-xs text-gray-600 font-bold mt-1">
                      {stage.projectDescription}
                    </p>
                  </div>
                </div>

                {/* Topics Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {stage.topics.map((topic) => {
                    const state = getLessonAccessState(topic.id, progress);
                    const isCompleted = state === 'completed' || state === 'mastered';
                    const isCurrent = state === 'in_progress' || recommendation.currentTopic.id === topic.id;
                    const isLocked = state === 'locked';
                    const isComingSoon = topic.contentStatus === 'coming_soon';

                    return (
                      <div
                        key={topic.id}
                        onClick={() => handleTopicClick(topic, state)}
                        className={`group relative p-4 rounded-xl border-2 transition-all cursor-pointer ${
                          isCurrent
                            ? 'bg-white border-[#6C5CE7] shadow-[4px_4px_0px_#6C5CE7] ring-2 ring-[#6C5CE7]/30'
                            : isCompleted
                            ? 'bg-[#F0FDF4] border-[#10B981] shadow-[3px_3px_0px_#10B981]'
                            : isLocked
                            ? 'bg-[#F9FAFB] border-gray-300 opacity-80 hover:opacity-100'
                            : 'bg-white border-[#1E1E24] shadow-[3px_3px_0px_#1E1E24] hover:-translate-y-0.5'
                        }`}
                      >
                        {/* Status Badges */}
                        <div className="flex items-center justify-between mb-2">
                          <span className="text-xs font-black text-gray-400">
                            #{topic.sequenceNumber}
                          </span>
                          {state === 'mastered' ? (
                            <span className="inline-flex items-center gap-1 text-[11px] font-black bg-[#FEF3C7] text-[#D97706] px-2 py-0.5 rounded-full border border-[#D97706]">
                              <Award className="w-3 h-3" /> Mastered
                            </span>
                          ) : state === 'completed' ? (
                            <span className="inline-flex items-center gap-1 text-[11px] font-black bg-[#D1FAE5] text-[#059669] px-2 py-0.5 rounded-full border border-[#059669]">
                              <CheckCircle2 className="w-3 h-3" /> Completed
                            </span>
                          ) : isCurrent ? (
                            <span className="inline-flex items-center gap-1 text-[11px] font-black bg-[#EDE9FE] text-[#6C5CE7] px-2 py-0.5 rounded-full border border-[#6C5CE7] animate-pulse">
                              <Play className="w-3 h-3 fill-current" /> Up Next
                            </span>
                          ) : isLocked ? (
                            <span className="inline-flex items-center gap-1 text-[11px] font-black bg-gray-100 text-gray-600 px-2 py-0.5 rounded-full border border-gray-300">
                              <Lock className="w-3 h-3" /> Locked
                            </span>
                          ) : isComingSoon ? (
                            <span className="inline-flex items-center gap-1 text-[11px] font-black bg-blue-50 text-blue-600 px-2 py-0.5 rounded-full border border-blue-200">
                              Coming Soon
                            </span>
                          ) : (
                            <span className="inline-flex items-center gap-1 text-[11px] font-black bg-gray-100 text-gray-700 px-2 py-0.5 rounded-full">
                              Available
                            </span>
                          )}
                        </div>

                        {/* Title & Description */}
                        <h3 className="font-black text-sm text-[#1E1E24] group-hover:text-[#6C5CE7] transition-colors">
                          {topic.title}
                        </h3>
                        <p className="text-xs font-bold text-[#4A4A58] mt-1 line-clamp-2">
                          {topic.description}
                        </p>

                        {/* Footer Info */}
                        <div className="mt-3 pt-2 border-t border-gray-100 flex items-center justify-between text-[11px] font-bold text-gray-500">
                          <span>{topic.estimatedMinutes} mins</span>
                          <span className="text-right text-[#6C5CE7] font-black group-hover:underline flex items-center gap-0.5">
                            {isLocked
                              ? 'Prerequisites'
                              : isComingSoon
                              ? 'Syllabus Info'
                              : isCompleted
                              ? 'Review Lesson'
                              : 'Start Lesson'}
                            <ChevronRight className="w-3 h-3" />
                          </span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Modal / Dialog for Topic Inspection or Prerequisite Warning */}
      {inspectingTopic && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in">
          <div className="bg-white rounded-2xl border-2 border-[#1E1E24] max-w-lg w-full p-6 shadow-[8px_8px_0px_#1E1E24] space-y-4">
            <div className="flex items-start justify-between">
              <div>
                <span className="text-xs font-black text-gray-400">
                  Topic #{inspectingTopic.sequenceNumber} • Stage {inspectingTopic.stageNumber}
                </span>
                <h3 className="text-xl font-black text-[#1E1E24] mt-0.5">
                  {inspectingTopic.title}
                </h3>
              </div>
              <button
                onClick={() => {
                  setInspectingTopic(null);
                  setPrereqNotice(null);
                }}
                className="p-1 rounded-lg hover:bg-gray-100 text-gray-500"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {prereqNotice && (
              <div className="p-3 rounded-xl bg-[#FEE2E2] border border-[#EF4444] text-xs font-bold text-[#991B1B] flex items-start gap-2">
                <Lock className="w-4 h-4 flex-shrink-0 mt-0.5" />
                <span>{prereqNotice}</span>
              </div>
            )}

            <p className="text-xs sm:text-sm font-bold text-[#4A4A58]">
              {inspectingTopic.description}
            </p>

            <div className="space-y-2">
              <h4 className="text-xs font-black uppercase tracking-wider text-gray-500">
                Learning Objectives:
              </h4>
              <ul className="text-xs font-bold text-gray-700 space-y-1 list-disc pl-4">
                {inspectingTopic.learningObjectives.map((obj, i) => (
                  <li key={i}>{obj}</li>
                ))}
              </ul>
            </div>

            <div className="space-y-1 text-xs font-bold text-gray-500 pt-2 border-t border-gray-100">
              <div>
                <span className="font-black text-[#1E1E24]">Prerequisites:</span>{' '}
                {inspectingTopic.prerequisiteLessonIds.length === 0
                  ? 'None (Foundational)'
                  : inspectingTopic.prerequisiteLessonIds
                      .map((id) => findTopicById(id)?.title || id)
                      .join(', ')}
              </div>
              <div>
                <span className="font-black text-[#1E1E24]">Status:</span>{' '}
                {inspectingTopic.contentStatus === 'available'
                  ? 'Playable in Laboratory'
                  : 'Curriculum Metadata Authoring'}
              </div>
            </div>

            <div className="pt-4 flex justify-end gap-2">
              <button
                onClick={() => {
                  setInspectingTopic(null);
                  setPrereqNotice(null);
                }}
                className="btn-game-yellow py-2 px-4 text-xs font-black"
              >
                Close
              </button>
              {inspectingTopic.contentStatus === 'available' && !prereqNotice && (
                <Link
                  href={`/learn/${inspectingTopic.id}`}
                  className="btn-game-purple py-2 px-4 text-xs font-black"
                >
                  Enter Laboratory →
                </Link>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
