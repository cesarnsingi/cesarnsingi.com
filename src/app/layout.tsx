
import type { Metadata, Viewport } from 'next';
import Link from 'next/link';
import { Inter } from 'next/font/google';
import Background3D from '@/components/Background3D';
import './globals.css';
import { SpeedInsights } from '@vercel/speed-insights/next';
import { Analytics } from '@vercel/analytics/next';

const inter = Inter({
  subsets: ['latin'],
  display: 'swap',
  preload: true,
});

export const metadata: Metadata = {
  metadataBase: new URL('https://cesarnsingi.com'),
  title: {
    default: 'César Nsingi',
    template: '%s | César Nsingi',
  },
  description: 'César Nsingi',
  keywords: [
    'Cesar Nsingi',
    'Software Engineer',
    'Full Stack Developer',
    'MERN Stack',
    'React Developer',
    'Next.js Developer',
    'TypeScript Developer',
    'Node.js Developer',
    'MongoDB',
  ],
  authors: [{ name: 'Cesar Nsingi' }],
  creator: 'Cesar Nsingi',
  manifest: '/manifest.json',
  icons: {
    icon: '/nextjs.png',
    apple: '/nextjs.png',
  },
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: '/',
    siteName: 'Cesar Nsingi',
    title: 'Cesar Nsingi | Software Engineer',
    description: 'Cesar Nsingi — Software Engineer.',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Cesar Nsingi | Software Engineer',
    description: 'Cesar Nsingi — Software Engineer.',
    creator: '@cesarnsingi',
  },
  robots: {
    index: true,
    follow: true,
    googleBot: { index: true, follow: true },
  },
  alternates: { canonical: '/' },
  verification: { google: 'googlea4a36904e14398c1' },
};

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 5,
  themeColor: '#000000',
};

type Item = {
  name: string;
  href: string;
};

const columns: { title: string; items: Item[] }[] = [
  {
    title: 'Building',
    items: [
      { name: 'Naviacuts', href: 'https://naviacuts.com' },
      { name: 'Flowpay', href: 'https://flowpay-teal.vercel.app/' },
    ],
  },
  {
    title: 'Everyday',
    items: [
      { name: 'Everyday run', href: '/' },
      { name: 'Monthly books', href: '/contact' },
    ],
  },
];

const dotted =
  'text-white underline decoration-dotted decoration-white/50 underline-offset-4 transition-colors hover:decoration-white';

function A({ name, href }: Item) {
  if (href.startsWith('http') || href.endsWith('.pdf')) {
    return (
      <a
        href={href}
        target="_blank"
        rel="noopener noreferrer"
        className={dotted}
      >
        {name}
      </a>
    );
  }

  return (
    <Link href={href} className={dotted}>
      {name}
    </Link>
  );
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={inter.className}>
      <body className="bg-black text-white antialiased">
        <div className="relative flex min-h-screen flex-col overflow-hidden">

          {/* Background */}
          <Background3D />

          {/* Bottom fade */}
          <div
            aria-hidden
            className="pointer-events-none absolute inset-x-0 bottom-0 z-10 h-[30vh] bg-gradient-to-t from-black via-black/70 to-transparent"
          />

          {/* Header */}
          <header className="relative z-20 flex items-start justify-between gap-4 px-6 pt-8 md:px-[5.8vw] md:pt-[5.4vh]">

            {/* Name and profession */}
            <div className="mt-4 translate-x-2 text-[17px] leading-7 md:mt-6 md:translate-x-4">
              <h1 className="font-normal text-white">
                César Nsingi
              </h1>
              <p className="font-normal text-neutral-400">
                Software Engineer
              </p>
            </div>

            {/* Social links */}
            <nav className="mt-10 -translate-x-2 text-right text-[17px] leading-7 text-neutral-400 md:mt-10 md:-translate-x-4">
              Find me on{' '}
              <a
                href="https://x.com/cesarnsingi"
                target="_blank"
                rel="noopener noreferrer"
                className={dotted}
              >
                X
              </a>{' '}
              or{' '}
              <a
                href="https://github.com/cesarnsingi"
                target="_blank"
                rel="noopener noreferrer"
                className={dotted}
              >
                GitHub
              </a>
            </nav>
          </header>

          {/* Page content */}
          <main className="relative z-10 flex-grow">
            {children}
          </main>

          {/* Footer */}
          <footer className="relative z-20 grid grid-cols-2 gap-8 px-6 pb-8 pt-16 text-[17px] leading-7 md:grid-cols-[1fr_auto] md:px-[5.8vw] md:pb-[5vh]">

            {/* Building */}
            <div>
              <h2 className="font-normal text-neutral-400">
                Building
              </h2>
              <ul>
                {columns[0].items.map((i) => (
                  <li key={i.name}>
                    <A {...i} />
                  </li>
                ))}
              </ul>
            </div>

            {/* Elsewhere */}
            <div className="md:text-right">
              <h2 className="font-normal text-neutral-400">
                Elsewhere
              </h2>
              <ul>
                {columns[1].items.map((i) => (
                  <li key={i.name}>
                    <A {...i} />
                  </li>
                ))}
              </ul>
            </div>

          </footer>

          <SpeedInsights />
        </div>

        <Analytics />
      </body>
    </html>
  );
}
