/**
 * Streak computation with grace days.
 * - If consecutive posts are within 24h+grace: streak increments.
 * - 1â2 days gap: streak freezes as "Pausa de Enfoque" (not reset).
 * - >72h gap: streak resets to 0.
 */
export const GRACE_HOURS = 72;

export interface StreakResult {
  count: number;
  isPaused: boolean;
  isBroken: boolean;
  label: string;
}

export function computeStreak(createdDates: string[]): StreakResult {
  if (createdDates.length === 0) {
    return { count: 0, isPaused: false, isBroken: true, label: 'Sin racha' };
  }

  const sorted = createdDates
    .map((d) => new Date(d).getTime())
    .sort((a, b) => b - a);

  const now = Date.now();
  const latest = sorted[0];
  const hoursSinceLatest = (now - latest) / (1000 * 60 * 60);

  // Count consecutive days from the most recent post backwards
  let streak = 1;
  for (let i = 0; i < sorted.length - 1; i++) {
    const gapHours = (sorted[i] - sorted[i + 1]) / (1000 * 60 * 60);
    if (gapHours <= 36) {
      streak++;
    } else if (gapHours <= GRACE_HOURS) {
      break;
    } else {
      break;
    }
  }

  if (hoursSinceLatest > GRACE_HOURS) {
    return { count: 0, isPaused: false, isBroken: true, label: 'Racha reiniciada' };
  }

  if (hoursSinceLatest > 36) {
    return { count: streak, isPaused: true, isBroken: false, label: 'Pausa de Enfoque' };
  }

  return { count: streak, isPaused: false, isBroken: false, label: `${streak} dÃ­as consecutivos` };
}
