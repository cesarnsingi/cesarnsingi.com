import type { Metadata } from 'next';
import Link from 'next/link';
import RunGraph from '@/components/RunGraph';
import { getDailyRuns } from '@/lib/runs';

export const dynamic = 'force-dynamic';

export const metadata: Metadata = {
  title: 'Everyday run',
  description: 'My running data, every day, in one graph.',
  alternates: { canonical: '/run' },
};

export default async function RunPage() {
  const runs = await getDailyRuns();
  return (
    <section className="flex min-h-[60vh] flex-col justify-center px-6 py-16 md:px-[5.8vw]">
      <div className="mx-auto w-full max-w-5xl">
        <Link
          href="/"
          className="text-[17px] leading-7 text-neutral-400 underline decoration-dotted decoration-white/50 underline-offset-4 transition-colors hover:text-white hover:decoration-white"
        >
          ← Home
        </Link>
        <h1 className="mt-6 text-[17px] font-normal leading-7 text-white">Everyday run</h1>
        <RunGraph initial={runs} />
      </div>
    </section>
  );
}