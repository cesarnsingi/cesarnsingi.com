import { START } from './runs';
import { getTokens, saveTokens, setActivity, deleteActivity, type Run, type Tokens } from './store';

const API = 'https://www.strava.com/api/v3';

export type StravaActivity = { id: number; sport_type: string; distance: number; start_date_local: string };
export type WebhookEvent = {
  object_type: 'activity' | 'athlete';
  object_id: number;
  aspect_type: 'create' | 'update' | 'delete';
  owner_id: number;
  subscription_id: number;
};

const isRun = (a: StravaActivity) => a.sport_type === 'Run' || a.sport_type === 'TrailRun';
const toRun = (a: StravaActivity): Run => ({ date: a.start_date_local.slice(0, 10), km: a.distance / 1000 });

async function accessToken(): Promise<string> {
  const saved = await getTokens();
  if (saved && saved.expires_at > Date.now() / 1000 + 60) return saved.access_token;

  const res = await fetch(`${API}/oauth/token`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      client_id: process.env.STRAVA_CLIENT_ID,
      client_secret: process.env.STRAVA_CLIENT_SECRET,
      grant_type: 'refresh_token',
      refresh_token: saved?.refresh_token ?? process.env.STRAVA_REFRESH_TOKEN,
    }),
  });
  if (!res.ok) throw new Error(`Strava token refresh failed: ${res.status}`);
  const next = (await res.json()) as Tokens;
  await saveTokens(next); // refresh tokens can rotate, so always keep the newest one
  return next.access_token;
}

async function get<T>(path: string): Promise<T> {
  const res = await fetch(API + path, { headers: { Authorization: `Bearer ${await accessToken()}` }, cache: 'no-store' });
  if (res.status === 429) throw new Error('Strava rate limit reached');
  if (!res.ok) throw new Error(`Strava ${res.status} for ${path}`);
  return (await res.json()) as T;
}

export async function handleEvent(e: WebhookEvent): Promise<void> {
  if (e.object_type !== 'activity') return;
  if (e.aspect_type === 'delete') return void (await deleteActivity(e.object_id));
  const a = await get<StravaActivity>(`/activities/${e.object_id}`);
  if (isRun(a)) await setActivity(a.id, toRun(a));
  else await deleteActivity(a.id); // e.g. a run re-labelled as a ride
}

export async function backfill(): Promise<number> {
  const after = Math.floor(new Date(START).getTime() / 1000);
  let count = 0;
  for (let page = 1; ; page++) {
    const batch = await get<StravaActivity[]>(`/athlete/activities?after=${after}&per_page=200&page=${page}`);
    if (!batch.length) break;
    for (const a of batch) if (isRun(a)) { await setActivity(a.id, toRun(a)); count++; }
  }
  return count;
}
