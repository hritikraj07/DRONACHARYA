// Dronacharya Unified Python Course Progress & State Synchronization Engine
// Provides a single source of truth for all Python learning activities across:
// 1. Python Dashboard
// 2. Stage 1 Interactive Game
// 3. Curriculum Lessons & Pyodide Labs
// 4. In-Browser Python Simulator Quests

import { getActiveSession, getGuestSession, recordGameProgress } from '@/lib/db/auth-db';
import { getLearnerProgress, saveLearnerProgress } from '@/lib/curriculum/progression-engine';
import { COURSES_CATALOG } from '@/lib/data/course-system';

export const ALL_PYTHON_LESSONS = [
  'py-less-1-1',
  'py-less-1-2',
  'py-less-2-1',
  'py-less-3-1',
  'py-less-4-1',
];

export const STAGE_1_MISSION_KEYS = [
  'stage1-mission-1-first-contact',
  'stage1-mission-2-restore-message',
  'stage1-mission-3-spell-gatekeeper',
  'stage1-mission-4-quote-dilemma',
  'stage1-mission-5-predict-output',
  'stage1-mission-6-final-gatekeeper',
];

export const FEATURED_SIMULATOR_MISSIONS = [
  'mission-hello-python',
  'mission-calculator',
  'mission-todo-list',
  'mission-rescue-robot',
  'mission-hazard-filter',
];

export const ALL_PYTHON_PROJECT_IDS = [
  'proj-rpg',
  'proj-budget',
  'proj-cipher',
];

export interface PythonProgressData {
  totalLessonsCount: number;
  completedLessonsCount: number;
  totalMissionsCount: number;
  completedMissionsCount: number;
  totalProjectsCount: number;
  completedProjectsCount: number;
  totalActivitiesCount: number;
  completedActivitiesCount: number;
  percent: number;
  completedLessonIds: string[];
  completedMissionKeys: string[];
  completedProjectIds: string[];
}

/**
 * Read and calculate full Python course progress deterministically.
 * Safe to call on client or during SSR.
 */
export function getPythonCourseProgress(): PythonProgressData {
  if (typeof window === 'undefined') {
    return {
      totalLessonsCount: ALL_PYTHON_LESSONS.length,
      completedLessonsCount: 0,
      totalMissionsCount: STAGE_1_MISSION_KEYS.length + FEATURED_SIMULATOR_MISSIONS.length,
      completedMissionsCount: 0,
      totalProjectsCount: ALL_PYTHON_PROJECT_IDS.length,
      completedProjectsCount: 0,
      totalActivitiesCount:
        ALL_PYTHON_LESSONS.length +
        STAGE_1_MISSION_KEYS.length +
        FEATURED_SIMULATOR_MISSIONS.length +
        ALL_PYTHON_PROJECT_IDS.length,
      completedActivitiesCount: 0,
      percent: 0,
      completedLessonIds: [],
      completedMissionKeys: [],
      completedProjectIds: [],
    };
  }

  // 1. Collect completed lessons
  const completedLessonSet = new Set<string>();
  try {
    const prog = getLearnerProgress();
    (prog.completedLessonIds || []).forEach((id) => completedLessonSet.add(id));
  } catch {}

  const session = getActiveSession() || getGuestSession();
  if (session?.completedMissions) {
    session.completedMissions.forEach((m) => {
      if (m.startsWith('py-less-')) {
        completedLessonSet.add(m);
      }
    });
  }

  // 2. Collect completed missions
  const completedMissionSet = new Set<string>();
  if (session?.completedMissions) {
    session.completedMissions.forEach((m) => completedMissionSet.add(m));
  }

  try {
    const rawM = localStorage.getItem('dronacharya_completed_missions');
    if (rawM) {
      const parsed: string[] = JSON.parse(rawM);
      parsed.forEach((m) => completedMissionSet.add(m));
    }
  } catch {}

  try {
    const rawS1 = localStorage.getItem('dronacharya_stage1_missions');
    if (rawS1) {
      const parsed: string[] = JSON.parse(rawS1);
      parsed.forEach((m) => completedMissionSet.add(m));
    }
  } catch {}

  // 3. Collect completed projects
  const completedProjectSet = new Set<string>();
  try {
    const rawP = localStorage.getItem('dronacharya_completed_projects');
    if (rawP) {
      const parsed: string[] = JSON.parse(rawP);
      parsed.forEach((p) => completedProjectSet.add(p));
    }
  } catch {}

  // Calculate actual completions against valid catalogs
  const completedLessons = ALL_PYTHON_LESSONS.filter((id) => completedLessonSet.has(id));
  const completedLessonsCount = completedLessons.length;

  const allMissions = [...STAGE_1_MISSION_KEYS, ...FEATURED_SIMULATOR_MISSIONS];
  const completedMissions = allMissions.filter((mKey) => {
    if (completedMissionSet.has(mKey)) return true;
    const stripped = mKey.replace('mission-', '');
    return Array.from(completedMissionSet).some((saved) => saved === stripped || saved.includes(stripped));
  });
  const completedMissionsCount = completedMissions.length;

  const completedProjects = ALL_PYTHON_PROJECT_IDS.filter((id) => completedProjectSet.has(id));
  const completedProjectsCount = completedProjects.length;

  const totalLessonsCount = ALL_PYTHON_LESSONS.length;
  const totalMissionsCount = allMissions.length;
  const totalProjectsCount = ALL_PYTHON_PROJECT_IDS.length;

  const totalActivitiesCount = totalLessonsCount + totalMissionsCount + totalProjectsCount;
  const completedActivitiesCount = Math.min(
    totalActivitiesCount,
    completedLessonsCount + completedMissionsCount + completedProjectsCount
  );

  const percent = totalActivitiesCount > 0
    ? Math.min(100, Math.round((completedActivitiesCount / totalActivitiesCount) * 100))
    : 0;

  return {
    totalLessonsCount,
    completedLessonsCount,
    totalMissionsCount,
    completedMissionsCount,
    totalProjectsCount,
    completedProjectsCount,
    totalActivitiesCount,
    completedActivitiesCount,
    percent,
    completedLessonIds: completedLessons,
    completedMissionKeys: completedMissions,
    completedProjectIds: completedProjects,
  };
}

/**
 * Record successful completion of a Python mission/challenge.
 * Synchronizes across localStorage, active/guest session, and fires events.
 */
export function recordPythonMissionCompletion(missionKey: string, xpReward: number = 50): PythonProgressData {
  if (typeof window === 'undefined') return getPythonCourseProgress();

  // 1. Update dronacharya_stage1_missions if Stage 1
  if (missionKey.startsWith('stage1-mission-')) {
    try {
      const raw = localStorage.getItem('dronacharya_stage1_missions');
      const list: string[] = raw ? JSON.parse(raw) : [];
      if (!list.includes(missionKey)) {
        list.push(missionKey);
        localStorage.setItem('dronacharya_stage1_missions', JSON.stringify(list));
      }
    } catch {}
  }

  // 2. Update dronacharya_completed_missions
  try {
    const raw = localStorage.getItem('dronacharya_completed_missions');
    const list: string[] = raw ? JSON.parse(raw) : [];
    if (!list.includes(missionKey)) {
      list.push(missionKey);
      localStorage.setItem('dronacharya_completed_missions', JSON.stringify(list));
    }
  } catch {}

  // 3. If Stage 1 Mission 1 is finished, also mark first lesson py-less-1-1
  if (missionKey === 'stage1-mission-1-first-contact') {
    try {
      const prog = getLearnerProgress();
      if (!prog.completedLessonIds.includes('py-less-1-1')) {
        prog.completedLessonIds.push('py-less-1-1');
        saveLearnerProgress(prog);
      }
    } catch {}
  }

  // 4. Update session via centralized auth-db
  recordGameProgress({
    missionId: missionKey,
    earnedXp: xpReward,
    subject: 'python',
    levelId: missionKey.startsWith('stage1-mission-') ? 'stage-1' : 'simulator',
  });

  // 5. Broadcast to all active listeners
  window.dispatchEvent(new Event('dronacharya_session_change'));
  window.dispatchEvent(new Event('storage'));

  return getPythonCourseProgress();
}
