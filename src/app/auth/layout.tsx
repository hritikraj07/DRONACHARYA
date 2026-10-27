import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Sign In ⋆˙⟡ Dronacharya',
  description: 'Sign in to Dronacharya to access your coding quests, stats, and courses.',
};

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
