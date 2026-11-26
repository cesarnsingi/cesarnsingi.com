import { NextResponse } from 'next/server';
import { getDailyRuns } from '@/lib/runs';

export const dynamic = 'force-dynamic';

export async function GET() {
  return NextResponse.json(await getDailyRuns(), { headers: { 'Cache-Control': 'no-store' } });
}
