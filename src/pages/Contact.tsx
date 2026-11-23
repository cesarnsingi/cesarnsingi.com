import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Books',
  description: 'Every year, the books I want to read.',
};

type Book = {
  title: string;
  author: string;
  isbn?: string; // adds a cover from Open Library
  cover?: string; // or use your own image URL / /public path
  href?: string; // Goodreads, publisher, your notes...
  read?: boolean;
};

// TODO: replace the examples with your own list. Newest year first.
const years: { year: number; books: Book[] }[] = [
  {
    year: 2026,
    books: [
      { title: 'The Pragmatic Programmer', author: 'Andrew Hunt, David Thomas' },
      { title: 'Designing Data-Intensive Applications', author: 'Martin Kleppmann' },
      { title: 'The Mom Test', author: 'Rob Fitzpatrick' },
    ],
  },
  
];

function Cover({ b }: { b: Book }) {
  const src = b.cover ?? (b.isbn ? `https://covers.openlibrary.org/b/isbn/${b.isbn}-M.jpg` : undefined);
  const inner = (
    <div className="relative aspect-[2/3] overflow-hidden rounded-[3px] bg-neutral-900 ring-1 ring-white/10 transition-transform duration-200 group-hover:-translate-y-0.5">
      {src ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img src={src} alt={`${b.title} by ${b.author}`} loading="lazy" className="h-full w-full object-cover" />
      ) : (
        <div className="flex h-full flex-col justify-between p-3 text-left">
          <span className="text-[13px] leading-snug text-white">{b.title}</span>
          <span className="text-[11px] leading-snug text-neutral-500">{b.author}</span>
        </div>
      )}
      {b.read && <span aria-label="Read" className="absolute right-1.5 top-1.5 h-2 w-2 rounded-full bg-white" />}
    </div>
  );
  const cls = 'group block';
  return b.href ? (
    <a href={b.href} target="_blank" rel="noopener noreferrer" title={`${b.title} — ${b.author}`} className={cls}>
      {inner}
    </a>
  ) : (
    <div title={`${b.title} — ${b.author}`} className={cls}>
      {inner}
    </div>
  );
}

export default function Books() {
  return (
    <section className="min-h-[80vh] bg-black px-6 pb-40 pt-12 md:px-[5.8vw]">
      <div className="max-w-3xl text-[17px] leading-7">
        <h1 className="font-normal text-white">Books to read</h1>
        <p className="text-neutral-400">Every year, the books I want to read.</p>
      </div>

      <ol className="mt-12 flex max-w-3xl flex-col gap-12">
        {years.map(({ year, books }) => (
          <li key={year}>
            <h2 className="mb-3 text-[17px] font-normal text-neutral-400">{year}</h2>
            <div className="grid grid-cols-3 gap-3 sm:grid-cols-4 md:grid-cols-6">
              {books.map((b) => (
                <Cover key={b.title} b={b} />
              ))}
            </div>
          </li>
        ))}
      </ol>
    </section>
  );
}
