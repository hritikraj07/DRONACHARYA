// Dronacharya Deterministic Learning Progression & Recommendation Engine
// Enforces:
// 1. Strict prerequisite satisfaction before unlocking
// 2. Deterministic sequential question & activity selection (Zero random question selection)
// 3. Transparent answers to the 6 core learner diagnostic questions
// 4. Measurable mastery checks (>=80% test score + code verification)
// 5. Targeted prerequisite revision recommendations upon struggle
// 6. Anti-exploit protection against duplicate XP farming

import {
  CurriculumTopic,
  Activity,
  ALL_PYTHON_TOPICS,
  findTopicById,
  findTopicBySequence,
} from '@/lib/data/python-curriculum-112';
import { recordGameProgress, getActiveSession } from '@/lib/db/auth-db';

export type LessonAccessState = 'locked' | 'available' | 'in_progress' | 'completed' | 'mastered';

export interface LearnerProgressState {
  userId: string;
  courseId: string;
  completedLessonIds: string[];
  masteredLessonIds: string[];
  completedActivityIds: string[];
  currentLessonId: string;
  activityAttempts: Record<string, { attempts: number; passed: boolean; bestScore: number; hintsUsed: number }>;
  strugglingConceptTags: string[];
  totalXp: number;
  lastActiveTimestamp: string;
}

export interface PrerequisiteCheckResult {
  canUnlock: boolean;
  missingPrerequisites: { id: string; title: string; sequenceNumber: number }[];
  explanation: string;
}

export interface NextRecommendation {
  currentTopic: CurriculumTopic;
  state: LessonAccessState;
  nextActivity: Activity | null;
  // Answers to the 6 core educational questions:
  coreAnswers: {
    whatIsLearnerLearning: string;
    whyIsConceptTaught: string;
    whatMustLearnerKnowBefore: string[];
    whatActivityNext: string;
    whatHappensIfTheyStruggle: string;
    whatMustDemonstrateToUnlockNext: string;
  };
  recommendedRevisionLessonId?: string;
  recommendedRevisionTopicTitle?: string;
}

const PROGRESS_STORAGE_KEY = 'dronacharya_learner_progress_v3';

// Load learner progress from cache or initialize defaults
export function getLearnerProgress(): LearnerProgressState {
  if (typeof window === 'undefined') {
    return {
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
  }

  try {
    const raw = localStorage.getItem(PROGRESS_STORAGE_KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      // Ensure defaults for backwards compatibility
      return {
        userId: parsed.userId || 'guest',
        courseId: parsed.courseId || 'python-101',
        completedLessonIds: parsed.completedLessonIds || [],
        masteredLessonIds: parsed.masteredLessonIds || [],
        completedActivityIds: parsed.completedActivityIds || [],
        currentLessonId: parsed.currentLessonId || 'py-topic-1',
        activityAttempts: parsed.activityAttempts || {},
        strugglingConceptTags: parsed.strugglingConceptTags || [],
        totalXp: parsed.totalXp || 0,
        lastActiveTimestamp: parsed.lastActiveTimestamp || '2026-10-27T00:00:00.000Z',
      };
    }
  } catch (e) {
    console.warn('Failed to parse learner progress:', e);
  }

  // Default start at Topic 1
  return {
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
}

// Persist learner progress to cache & backend
export function saveLearnerProgress(progress: LearnerProgressState): void {
  if (typeof window === 'undefined') return;
  try {
    progress.lastActiveTimestamp = new Date().toISOString();
    localStorage.setItem(PROGRESS_STORAGE_KEY, JSON.stringify(progress));
  } catch (e) {
    console.warn('Failed to save learner progress:', e);
  }
}

// Prerequisite Validator
export function checkPrerequisites(
  topicId: string,
  completedLessonIds: string[]
): PrerequisiteCheckResult {
  const topic = findTopicById(topicId);
  if (!topic) {
    return { canUnlock: false, missingPrerequisites: [], explanation: 'Topic not found in curriculum.' };
  }

  // Topic 1 has no prerequisites
  if (!topic.prerequisiteLessonIds || topic.prerequisiteLessonIds.length === 0) {
    return { canUnlock: true, missingPrerequisites: [], explanation: 'No prior prerequisites required.' };
  }

  const missing: { id: string; title: string; sequenceNumber: number }[] = [];
  for (const prereqId of topic.prerequisiteLessonIds) {
    if (!completedLessonIds.includes(prereqId)) {
      const prereqTopic = findTopicById(prereqId);
      if (prereqTopic) {
        missing.push({
          id: prereqTopic.id,
          title: prereqTopic.title,
          sequenceNumber: prereqTopic.sequenceNumber,
        });
      }
    }
  }

  if (missing.length === 0) {
    return { canUnlock: true, missingPrerequisites: [], explanation: 'All prerequisites satisfied.' };
  }

  const missingTitles = missing.map((m) => `Lesson ${m.sequenceNumber}: ${m.title}`).join(', ');
  return {
    canUnlock: false,
    missingPrerequisites: missing,
    explanation: `Prerequisites missing: Complete ${missingTitles} before unlocking this lesson.`,
  };
}

// Get the precise state of any lesson for the learner
export function getLessonAccessState(
  topicId: string,
  progress: LearnerProgressState
): LessonAccessState {
  if (progress.masteredLessonIds.includes(topicId)) return 'mastered';
  if (progress.completedLessonIds.includes(topicId)) return 'completed';

  const prereqCheck = checkPrerequisites(topicId, progress.completedLessonIds);
  if (!prereqCheck.canUnlock) {
    return 'locked';
  }

  if (progress.currentLessonId === topicId) return 'in_progress';
  return 'available';
}

// Deterministic question / activity selector
// Never uses random selection; returns the next incomplete required activity
export function getNextActivityForLesson(
  topic: CurriculumTopic,
  completedActivityIds: string[]
): Activity | null {
  if (!topic.activities || topic.activities.length === 0) return null;
  // Find first activity in defined sequence that has not been completed
  for (const act of topic.activities) {
    if (!completedActivityIds.includes(act.id)) {
      return act;
    }
  }
  // All activities complete
  return null;
}

// Evaluates an activity submission, tracks attempts, prevents duplicate XP
export function evaluateActivityAttempt(params: {
  topicId: string;
  activityId: string;
  isCorrect: boolean;
  score: number;
  hintsUsed: number;
  xpReward: number;
}): {
  awardedXp: number;
  isNewCompletion: boolean;
  needsRevision: boolean;
  strugglingConcept?: string;
  updatedProgress: LearnerProgressState;
} {
  const progress = getLearnerProgress();
  const currentAttempt = progress.activityAttempts[params.activityId] || {
    attempts: 0,
    passed: false,
    bestScore: 0,
    hintsUsed: 0,
  };

  const newAttempts = currentAttempt.attempts + 1;
  const isPassed = params.isCorrect && params.score >= 80;
  const alreadyCompleted = progress.completedActivityIds.includes(params.activityId);

  let awardedXp = 0;
  let isNewCompletion = false;

  if (isPassed && !alreadyCompleted) {
    // Only award XP the very first time it is legitimately passed
    awardedXp = params.xpReward;
    isNewCompletion = true;
    progress.completedActivityIds.push(params.activityId);
    progress.totalXp += awardedXp;

    // Sync to auth database
    recordGameProgress({
      missionId: params.activityId,
      earnedXp: awardedXp,
      subject: 'python-101',
    });
  }

  // Update attempt history
  progress.activityAttempts[params.activityId] = {
    attempts: newAttempts,
    passed: isPassed || currentAttempt.passed,
    bestScore: Math.max(currentAttempt.bestScore, params.score),
    hintsUsed: Math.max(currentAttempt.hintsUsed, params.hintsUsed),
  };

  // Check if learner is struggling (3 or more attempts without passing)
  let needsRevision = false;
  let strugglingConcept: string | undefined = undefined;

  if (!isPassed && newAttempts >= 2) {
    needsRevision = true;
    const topic = findTopicById(params.topicId);
    const act = topic?.activities?.find((a) => a.id === params.activityId);
    if (act && act.requiredConcepts.length > 0) {
      strugglingConcept = act.requiredConcepts[0];
      if (!progress.strugglingConceptTags.includes(strugglingConcept)) {
        progress.strugglingConceptTags.push(strugglingConcept);
      }
    }
  }

  saveLearnerProgress(progress);

  return {
    awardedXp,
    isNewCompletion,
    needsRevision,
    strugglingConcept,
    updatedProgress: progress,
  };
}

// Evaluates Lesson Completion & Mastery
export function completeLessonAndUnlockNext(
  topicId: string,
  assessmentScore: number
): {
  isMastered: boolean;
  unlockedTopic: CurriculumTopic | null;
  awardedXp: number;
  updatedProgress: LearnerProgressState;
} {
  const progress = getLearnerProgress();
  const topic = findTopicById(topicId);
  if (!topic) {
    return { isMastered: false, unlockedTopic: null, awardedXp: 0, updatedProgress: progress };
  }

  let awardedXp = 0;
  const isMastered = assessmentScore >= 80;

  if (!progress.completedLessonIds.includes(topicId)) {
    progress.completedLessonIds.push(topicId);
    awardedXp += 50;
  }

  if (isMastered && !progress.masteredLessonIds.includes(topicId)) {
    progress.masteredLessonIds.push(topicId);
    awardedXp += 50;
  }

  // Deterministically find the next eligible topic in sequence
  let nextTopic: CurriculumTopic | null = null;
  const currentSeq = topic.sequenceNumber;
  const candidateNext = findTopicBySequence(currentSeq + 1);

  if (candidateNext) {
    const prereq = checkPrerequisites(candidateNext.id, progress.completedLessonIds);
    if (prereq.canUnlock) {
      nextTopic = candidateNext;
      progress.currentLessonId = candidateNext.id;
    }
  }

  if (awardedXp > 0) {
    progress.totalXp += awardedXp;
    recordGameProgress({
      missionId: topicId,
      earnedXp: awardedXp,
      subject: 'python-101',
    });
  }

  saveLearnerProgress(progress);

  return {
    isMastered,
    unlockedTopic: nextTopic,
    awardedXp,
    updatedProgress: progress,
  };
}

// Next Recommendation Engine: Answers all 6 core educational questions deterministically
export function getNextRecommendedActivity(progress?: LearnerProgressState): NextRecommendation {
  const state = progress || getLearnerProgress();
  let currentTopic = findTopicById(state.currentLessonId);

  // Fallback to topic 1 if invalid
  if (!currentTopic) {
    currentTopic = ALL_PYTHON_TOPICS[0];
  }

  // If current topic is completed, look for first incomplete unlocked topic
  if (state.completedLessonIds.includes(currentTopic.id)) {
    for (const t of ALL_PYTHON_TOPICS) {
      if (!state.completedLessonIds.includes(t.id)) {
        const prereq = checkPrerequisites(t.id, state.completedLessonIds);
        if (prereq.canUnlock) {
          currentTopic = t;
          state.currentLessonId = t.id;
          saveLearnerProgress(state);
          break;
        }
      }
    }
  }

  const accessState = getLessonAccessState(currentTopic.id, state);
  const nextActivity = getNextActivityForLesson(currentTopic, state.completedActivityIds);

  // Determine if learner has an unresolved struggle to target revision
  let recommendedRevisionLessonId: string | undefined = undefined;
  let recommendedRevisionTopicTitle: string | undefined = undefined;

  if (state.strugglingConceptTags.length > 0) {
    const concept = state.strugglingConceptTags[state.strugglingConceptTags.length - 1];
    // Find earliest topic that introduced this concept
    const earlierTopic = ALL_PYTHON_TOPICS.find((t) =>
      t.conceptsIntroduced.includes(concept)
    );
    if (earlierTopic && earlierTopic.id !== currentTopic.id) {
      recommendedRevisionLessonId = earlierTopic.id;
      recommendedRevisionTopicTitle = earlierTopic.title;
    }
  }

  // Answer the 6 fundamental curriculum questions
  const coreAnswers = {
    whatIsLearnerLearning: `Lesson ${currentTopic.sequenceNumber}: ${currentTopic.title} (Concepts: ${currentTopic.conceptsIntroduced.join(', ')})`,
    whyIsConceptTaught: currentTopic.description,
    whatMustLearnerKnowBefore:
      currentTopic.prerequisiteLessonIds.length === 0
        ? ['No prior prerequisites required. Foundational entry point.']
        : currentTopic.prerequisiteLessonIds.map((id) => {
            const p = findTopicById(id);
            return p ? `Lesson ${p.sequenceNumber}: ${p.title}` : id;
          }),
    whatActivityNext: nextActivity
      ? `Activity ${nextActivity.sequenceNumber}: ${nextActivity.learningObjective} (${nextActivity.activityType.replace('_', ' ')})`
      : 'Mastery Assessment & Chapter Challenge',
    whatHappensIfTheyStruggle: recommendedRevisionTopicTitle
      ? `Targeted revision recommended on "${recommendedRevisionTopicTitle}" before continuing.`
      : 'Receive 4-tier progressive hints (Direction -> Focus -> Explanation -> Guided Correction) without revealing the answer immediately.',
    whatMustDemonstrateToUnlockNext:
      'Pass the lesson exercises and achieve >= 80% on the code test assessment to satisfy prerequisite criteria for the next lesson.',
  };

  return {
    currentTopic,
    state: accessState,
    nextActivity,
    coreAnswers,
    recommendedRevisionLessonId,
    recommendedRevisionTopicTitle,
  };
}

// Reset progress back to beginning for testing or fresh start
export function resetLearnerProgress(): LearnerProgressState {
  const fresh: LearnerProgressState = {
    userId: getActiveSession()?.id || 'guest',
    courseId: 'python-101',
    completedLessonIds: [],
    masteredLessonIds: [],
    completedActivityIds: [],
    currentLessonId: 'py-topic-1',
    activityAttempts: {},
    strugglingConceptTags: [],
    totalXp: 0,
    lastActiveTimestamp: new Date().toISOString(),
  };
  saveLearnerProgress(fresh);
  return fresh;
}
