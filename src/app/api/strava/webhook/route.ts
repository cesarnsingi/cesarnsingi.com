import { after, NextRequest, NextResponse } from 'next/server';
import { handleEvent, type WebhookEvent } from '@/lib/strava';

export const dynamic = 'force-dynamic';

// Strava calls this once, when you create the subscription.
export async function GET(req: NextRequest) {
  const p = req.nextUrl.searchParams;
  if (p.get('hub.mode') === 'subscribe' && p.get('hub.verify_token') === process.env.STRAVA_VERIFY_TOKEN) {
    return NextResponse.json({ 'hub.challenge': p.get('hub.challenge') });
  }
  return new NextResponse(null, { status: 403 });
}

// Strava calls this on every activity create / update / delete and wants a 200 within 2 seconds.
export async function POST(req: NextRequest) {
  const e = (await req.json()) as WebhookEvent;

  // Webhooks are unsigned: only accept events for your subscription and your athlete.
  const okSub = !process.env.STRAVA_SUBSCRIPTION_ID || String(e.subscription_id) === process.env.STRAVA_SUBSCRIPTION_ID;
  const okOwner = !process.env.STRAVA_ATHLETE_ID || String(e.owner_id) === process.env.STRAVA_ATHLETE_ID;
  if (okSub && okOwner) after(() => handleEvent(e).catch(err => console.error('strava event failed', err)));

  return new NextResponse(null, { status: 200 });
}
