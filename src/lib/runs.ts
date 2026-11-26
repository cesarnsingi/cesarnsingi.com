import { allActivities, type Run } from './store';

// First day of the streak (YYYY-MM-DD). Set RUN_START_DATE in your env.
export const START = process.env.RUN_START_DATE ?? '2025-01-01';

/** One entry per day from START to today, summing multiple runs on the same day. */
export async function getDailyRuns(): Promise<Run[]> {
  const perDay = new Map<string, number>();
  for (const r of Object.values(await allActivities())) {
    perDay.set(r.date, (perDay.get(r.date) ?? 0) + r.km);
  }
  const out: Run[] = [];
  const end = new Date().toISOString().slice(0, 10);
  for (const d = new Date(START); d.toISOString().slice(0, 10) <= end; d.setUTCDate(d.getUTCDate() + 1)) {
    const date = d.toISOString().slice(0, 10);
    out.push({ date, km: +(perDay.get(date) ?? 0).toFixed(1) });
  }
  return out;
}
