// Bayesian Knowledge Tracing (BKT) Engine for Dronacharya

export interface BKTParameters {
  p_l0: number; // Prior probability of mastery
  p_t: number;  // Transition probability (learning step)
  p_g: number;  // Guess probability
  p_s: number;  // Slip probability
}

export const DEFAULT_BKT_PARAMS: BKTParameters = {
  p_l0: 0.15,
  p_t: 0.20,
  p_g: 0.10,
  p_s: 0.05,
};

/**
 * Computes the updated mastery probability P(L_t) after observing an attempt
 * @param priorMastery - P(L_{t-1}) previous probability
 * @param isCorrect - Whether the student solved the challenge
 * @param hintsUsedCount - Number of hints requested (0 to 4)
 * @param params - BKT parameters
 */
export function calculateUpdatedBKT(
  priorMastery: number,
  isCorrect: boolean,
  hintsUsedCount: number = 0,
  params: BKTParameters = DEFAULT_BKT_PARAMS
): number {
  const { p_t, p_g, p_s } = params;

  // If the student relied on tier 2+ hints, penalize the effective correctness
  const effectiveCorrect = isCorrect && hintsUsedCount <= 1;

  let posterior: number;
  if (effectiveCorrect) {
    // Student demonstrated understanding: P(L | Correct)
    const numerator = priorMastery * (1 - p_s);
    const denominator = priorMastery * (1 - p_s) + (1 - priorMastery) * p_g;
    posterior = numerator / Math.max(0.0001, denominator);
  } else {
    // Student struggled or relied heavily on hints: P(L | Incorrect/Assisted)
    const numerator = priorMastery * p_s;
    const denominator = priorMastery * p_s + (1 - priorMastery) * (1 - p_g);
    posterior = numerator / Math.max(0.0001, denominator);
  }

  // Factor in the transition probability to the next state
  const nextMastery = posterior + (1 - posterior) * p_t;

  // Bound mastery within [0.05, 0.99]
  return Math.min(0.99, Math.max(0.05, Number(nextMastery.toFixed(3))));
}

/**
 * Determines whether a skill node is considered mastered
 */
export function isSkillMastered(masteryProbability: number): boolean {
  return masteryProbability >= 0.75;
}

/**
 * Checks if remediation is required for a struggling learner
 */
export function requiresRemediation(masteryProbability: number, consecutiveFailures: number): boolean {
  return masteryProbability < 0.60 && consecutiveFailures >= 2;
}
