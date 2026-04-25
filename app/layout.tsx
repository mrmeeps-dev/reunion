import type { Metadata } from 'next';
import { Inter, Plus_Jakarta_Sans } from 'next/font/google';
import './globals.css';

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
  display: 'swap',
});

const plusJakartaSans = Plus_Jakarta_Sans({
  subsets: ['latin'],
  variable: '--font-plus-jakarta',
  display: 'swap',
});

export const metadata: Metadata = {
  title: 'Sahuaro High School Class of 1976 — 50th Reunion',
  description:
    'Sahuaro High School Class of 1976 — 50th Reunion, October 9–10, 2026 in Tucson, Arizona.',
  icons: {
    icon: '/head-mascot.png',
    apple: '/head-mascot.png',
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" id="top" className="scroll-smooth">
      <body className={`${inter.variable} ${plusJakartaSans.variable} min-h-screen bg-stone-50 text-stone-900`}>
        {children}
      </body>
    </html>
  );
}
