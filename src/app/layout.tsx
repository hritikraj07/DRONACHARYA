import type { Metadata } from 'next';
import { Lora, Inter, JetBrains_Mono, Press_Start_2P } from 'next/font/google';
import './globals.css';
import { AppShell } from '@/components/layout/AppShell';

const lora = Lora({
  variable: '--font-lora',
  subsets: ['latin'],
  weight: ['400', '500', '600', '700'],
  display: 'swap',
});

const inter = Inter({
  variable: '--font-inter',
  subsets: ['latin'],
  display: 'swap',
});

const jetbrainsMono = JetBrains_Mono({
  variable: '--font-mono',
  subsets: ['latin'],
  display: 'swap',
});

const pressStart2P = Press_Start_2P({
  variable: '--font-pixel',
  weight: '400',
  subsets: ['latin'],
  display: 'swap',
});

export const metadata: Metadata = {
  title: 'Dronacharya ⋆˙⟡',
  description:
    'Start your coding adventure with Dronacharya. The most fun and beginner-friendly way to learn Python, HTML, CSS, and JavaScript.',
  icons: {
    icon: [
      { url: '/logo-round.png', type: 'image/png' },
      { url: '/icon.png', type: 'image/png' },
      { url: '/favicon.ico' },
    ],
    shortcut: '/logo-round.png',
    apple: '/apple-icon.png',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="en"
      className={`${lora.variable} ${inter.variable} ${jetbrainsMono.variable} ${pressStart2P.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col font-sans bg-[#FAF6EE] text-[#1E1E24]">
        <AppShell>{children}</AppShell>
      </body>
    </html>
  );
}
