import { NextRequest, NextResponse } from 'next/server';
import { calculateAwardedXp } from '@/lib/gamification';
import { calculateUpdatedBKT } from '@/lib/bkt';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const {
      baseXp = 120,
      difficulty = 'intermediate',
      hintsUsedCount = 0,
      minutesSpentToday = 20,
      isFirstCompletion = true,
      priorMastery = 0.25,
      isCorrect = true,
    } = body;

    // Server-side deterministic XP calculation
    const earnedXp = calculateAwardedXp({
      baseXp,
      difficulty,
      hintsUsedCount,
      minutesSpentToday,
      isFirstCompletion,
    });

    // Server-side BKT mastery update
    const updatedMastery = calculateUpdatedBKT(priorMastery, isCorrect, hintsUsedCount);

    return NextResponse.json({
      success: true,
      data: {
        earnedXp,
        updatedMastery,
        isMastered: updatedMastery >= 0.75,
        serverTimestamp: new Date().toISOString(),
      },
    });
  } catch (err: any) {
    return NextResponse.json(
      { success: false, error: err.message || 'Failed to award XP' },
      { status: 500 }
    );
  }
}
