// Dronacharya Global Application Shell with Persistent Acharya AI Drawer
'use client';

import React, { useState, Suspense } from 'react';
import { TopNav } from './TopNav';
import { Footer } from './Footer';
import { AcharyaDrawer } from '../mentor/AcharyaDrawer';

interface AppShellProps {
  children: React.ReactNode;
}

export function AppShell({ children }: AppShellProps) {
  const [isMentorOpen, setIsMentorOpen] = useState(false);

  return (
    <div className="min-h-screen flex flex-col bg-[#F6F1E7] text-[#252820]">
      <Suspense fallback={<div className="h-16 border-b border-[#D8CFC0] bg-[#F6F1E7]" />}>
        <TopNav onOpenMentor={() => setIsMentorOpen(true)} />
      </Suspense>

      <main className="flex-1 flex flex-col">
        {children}
      </main>

      <Footer />

      <AcharyaDrawer
        isOpen={isMentorOpen}
        onClose={() => setIsMentorOpen(false)}
      />
    </div>
  );
}
