// Dronacharya Global Application Shell with Persistent Acharya AI Drawer
'use client';

import React, { useState, Suspense } from 'react';
import { TopNav } from './TopNav';
import { Footer } from './Footer';
import { AcharyaDrawer } from '../mentor/AcharyaDrawer';
import { PixelCursorSparkles } from '../common/PixelCursorSparkles';
import { CustomCursor } from '../common/CustomCursor';

interface AppShellProps {
  children: React.ReactNode;
}

export function AppShell({ children }: AppShellProps) {
  const [isMentorOpen, setIsMentorOpen] = useState(false);

  return (
    <div className="min-h-screen flex flex-col bg-[#FAF6EE] text-[#1E1E24]">
      {/* High-fidelity retro pixel mascot cursor and interactive sparkles */}
      <CustomCursor />
      <PixelCursorSparkles />

      <Suspense fallback={<div className="h-16 border-b-2 border-[#1E1E24] bg-[#FAF6EE]" />}>
        <TopNav onOpenMentor={() => setIsMentorOpen(true)} />
      </Suspense>

      <main className="flex-1 flex flex-col relative">
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
