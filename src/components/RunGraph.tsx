'use client';

import { useEffect, useRef, useState } from 'react';

type Run = { date: string; km: number };

const W = 960;
const H = 160;
const POLL_MS = 20_000;

const day = (iso: string) =>
  new Date(iso + 'T00:00:00').toLocaleDateString('en', { month: 'short', day: 'numeric', year: 'numeric' });
const km = (n: number) => n.toLocaleString('en', { minimumFractionDigits: 1, maximumFractionDigits: 1 });

export default function RunGraph({ initial }: { initial: Run[] }) {
  const [runs, setRuns] = useState(initial);
  const [hover, setHover] = useState<number | null>(null);
  const [fresh, setFresh] = useState(-1);
  const latest = useRef(initial);

  // Pick up new runs without a reload: poll while the tab is visible.
  useEffect(() => {
    let alive = true;
    const refresh = async () => {
      if (document.hidden) return;
      try {
        const res = await fetch('/api/runs', { cache: 'no-store' });
        if (!res.ok || !alive) return;
        const next = (await res.json()) as Run[];
        const changed = next.findIndex((r, i) => latest.current[i]?.km !== r.km);
        latest.current = next;
        setRuns(next);
        if (changed >= 0) {
          setFresh(changed);
          setTimeout(() => setFresh(-1), 4000);
        }
      } catch {
        /* offline: keep what we have */
      }
    };
    const id = setInterval(refresh, POLL_MS);
    document.addEventListener('visibilitychange', refresh);
    return () => {
      alive = false;
      clearInterval(id);
      document.removeEventListener('visibilitychange', refresh);
    };
  }, []);

  if (!runs.length) return null;

  const total = runs.reduce((s, r) => s + r.km, 0);
  const max = Math.max(...runs.map(r => r.km), 1);
  const step = W / runs.length;
  const shown = runs[hover ?? runs.length - 1];

  return (
    <div className="mt-2">
      <p className="text-[17px] leading-7 text-neutral-400">Every day since {day(runs[0].date)}</p>
      <p className="text-[17px] leading-7 text-neutral-400">
        {runs.length} days, {km(total)} km
      </p>

      <svg
        viewBox={`0 0 ${W} ${H}`}
        className="mt-10 block w-full touch-pan-y"
        role="img"
        aria-label="Distance run each day, in kilometres"
        onPointerLeave={() => setHover(null)}
      >
        {runs.map((r, i) => {
          const h = Math.max(3, (r.km / max) * (H - 6));
          const on = i === hover || i === fresh;
          return (
            <rect
              key={r.date}
              x={i * step}
              y={H - h}
              width={Math.max(step - 1, 1)}
              height={h}
              rx={1}
              className={`transition-colors ${on ? 'fill-white' : 'fill-neutral-700'} ${i === fresh ? 'animate-pulse' : ''}`}
              onPointerEnter={() => setHover(i)}
              onPointerDown={() => setHover(i)}
            />
          );
        })}
      </svg>

      <p className="mt-4 text-[17px] leading-7 text-neutral-400">
        {day(shown.date)} <span className="text-white">{km(shown.km)} km</span>
      </p>
    </div>
  );
}
