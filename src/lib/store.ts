import { Redis } from '@upstash/redis';

export type Run = { date: string; km: number };
export type Tokens = { access_token: string; refresh_token: string; expires_at: number };

// Works with both the Upstash and the Vercel Marketplace (KV_*) env var names.
const url = process.env.UPSTASH_REDIS_REST_URL ?? process.env.KV_REST_API_URL;
const token = process.env.UPSTASH_REDIS_REST_TOKEN ?? process.env.KV_REST_API_TOKEN;
const redis = url && token ? new Redis({ url, token }) : null;

// No Redis configured: use in-memory demo data so you can preview the page locally.
// In production this throws instead, so you never ship demo data by accident.
const demo = new Map<string, Run>();
function useDemo(): void {
  if (process.env.NODE_ENV === 'production') {
    throw new Error('Redis is not configured: set UPSTASH_REDIS_REST_URL and UPSTASH_REDIS_REST_TOKEN');
  }
  if (demo.size) return;
  const d = new Date(process.env.RUN_START_DATE ?? '2025-01-01');
  const end = new Date().toISOString().slice(0, 10);
  for (let i = 0; d.toISOString().slice(0, 10) <= end; i++, d.setUTCDate(d.getUTCDate() + 1)) {
    const km = d.getUTCDay() === 0 ? 14 + ((i * 7) % 8) : 5 + ((i * 5) % 6);
    demo.set(`demo-${i}`, { date: d.toISOString().slice(0, 10), km });
  }
}

const ACTIVITIES = 'run:activities'; // hash: Strava activity id -> { date, km }
const TOKEN = 'run:strava-token';

export async function setActivity(id: string | number, run: Run): Promise<void> {
  if (redis) await redis.hset(ACTIVITIES, { [String(id)]: run });
  else { useDemo(); demo.set(String(id), run); }
}
export async function deleteActivity(id: string | number): Promise<void> {
  if (redis) await redis.hdel(ACTIVITIES, String(id));
  else { useDemo(); demo.delete(String(id)); }
}
export async function allActivities(): Promise<Record<string, Run>> {
  if (redis) return (await redis.hgetall<Record<string, Run>>(ACTIVITIES)) ?? {};
  useDemo();
  return Object.fromEntries(demo);
}
export async function getTokens(): Promise<Tokens | null> {
  return redis ? redis.get<Tokens>(TOKEN) : null;
}
export async function saveTokens(t: Tokens): Promise<void> {
  if (redis) await redis.set(TOKEN, t);
}