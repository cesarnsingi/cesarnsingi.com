import { NextRequest, NextResponse } from 'next/server';
import { backfill } from '@/lib/strava';

export const dynamic = 'force-dynamic';
export const maxDuration = 60;

// One-off: curl -X POST https://cesarnsingi.com/api/strava/backfill -H "x-admin-secret: $ADMIN_SECRET"
export async function POST(req: NextRequest) {
  if (!process.env.ADMIN_SECRET || req.headers.get('x-admin-secret') !== process.env.ADMIN_SECRET) {
    return new NextResponse(null, { status: 401 });
  }
  return NextResponse.json({ imported: await backfill() });
}
