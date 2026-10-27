// Dronacharya Gamification & Learning Engine
import { RankTier } from '@/types';

export const RANK_THRESHOLDS: { rank: RankTier; minXp: number; title: string; epithet: string }[] = [
  { rank: 'Sadhaka', minXp: 0, title: 'The Seeker', epithet: 'साधक' },
  { rank: 'Abhyasi', minXp: 1000, title: 'The Practitioner', epithet: 'अभ्यासी' },
  { rank: 'Vidvan', minXp: 3500, title: 'The Scholar', epithet: 'विद्वान' },
  { rank: 'Acharya', minXp: 9000, title: 'The Master Guide', epithet: 'आचार्य' },
];

/**
 * Calculates student rank based on cumulative XP
 */
export function getRankFromXp(totalXp: number): { rank: RankTier; title: string; epithet: string; nextRankMinXp?: number; progressToNext: number } {
  let currentRank = RANK_THRESHOLDS[0];
  let nextRank = RANK_THRESHOLDS[1];

  for (let i = 0; i < RANK_THRESHOLDS.length; i++) {
    if (totalXp >= RANK_THRESHOLDS[i].minXp) {
      currentRank = RANK_THRESHOLDS[i];
      nextRank = RANK_THRESHOLDS[i + 1] || RANK_THRESHOLDS[i];
    }
  }

  const isMaxRank = currentRank.rank === 'Acharya';
  const progressToNext = isMaxRank
    ? 100
    : Math.min(100, Math.round(((totalXp - currentRank.minXp) / (nextRank.minXp - currentRank.minXp)) * 100));

  return {
    rank: currentRank.rank,
    title: currentRank.title,
    epithet: currentRank.epithet,
    nextRankMinXp: isMaxRank ? undefined : nextRank.minXp,
    progressToNext,
  };
}

/**
 * Anti-Grind Fatigue Governor:
 * Drops rewards if active coding time exceeds 60 minutes today to encourage healthy reflection
 */
export function calculateFatigueFactor(minutesSpentToday: number): number {
  if (minutesSpentToday <= 60) {
    return 1.0;
  }
  // Gradual decay by 1.5% per minute past 60 mins, bounded at minimum 0.25 (25%)
  const excess = minutesSpentToday - 60;
  return Math.max(0.25, Number((1.0 - excess * 0.015).toFixed(2)));
}

/**
 * Deterministic XP Award Formula
 */
export function calculateAwardedXp(params: {
  baseXp: number;
  difficulty: 'foundational' | 'intermediate' | 'advanced';
  hintsUsedCount: number;
  minutesSpentToday: number;
  isFirstCompletion: boolean;
}): number {
  const { baseXp, difficulty, hintsUsedCount, minutesSpentToday, isFirstCompletion } = params;

  // Duplicate completions award minimal review XP
  if (!isFirstCompletion) {
    return 15;
  }

  const difficultyMultiplier = difficulty === 'advanced' ? 2.0 : difficulty === 'intermediate' ? 1.5 : 1.0;
  const hintFactor = Math.max(0.55, 1.0 - hintsUsedCount * 0.15);
  const fatigueFactor = calculateFatigueFactor(minutesSpentToday);

  const rawXp = baseXp * difficultyMultiplier * hintFactor * fatigueFactor;
  return Math.max(10, Math.round(rawXp));
}
