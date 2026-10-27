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
    <div className="min-h-screen flex flex-col relative text-[#1E1E24] isolate">
      {/* High-fidelity retro pixel mascot cursor and interactive sparkles */}
      <CustomCursor />
      <PixelCursorSparkles />

      {/* 100% Stationary Fixed Viewport Background & Scenery Layer */}
      <div
        className="fixed inset-0 w-screen h-screen pointer-events-none -z-10 overflow-hidden select-none"
        aria-hidden="true"
      >
        {/* Base Warm Canvas Color */}
        <div className="absolute inset-0 bg-[#FAF6EE]" />

        {/* Locked Stationary Adventure Realm Scenery Image */}
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src="/adventure-hero-bg.jpg"
          alt=""
          className="w-full h-full object-cover object-top opacity-30 sm:opacity-35 filter saturate-110"
        />

        {/* Ambient Warm Gradient Tint & Vignette Overlay */}
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            background:
              'radial-gradient(circle at 50% 30%, rgba(250, 246, 238, 0.4) 0%, rgba(250, 246, 238, 0.7) 50%, rgba(250, 246, 238, 0.94) 100%)',
          }}
        />
      </div>

      <Suspense fallback={<div className="h-16 border-b-2 border-[#1E1E24] bg-[#FAF6EE]" />}>
        <TopNav onOpenMentor={() => setIsMentorOpen(true)} />
      </Suspense>

      <main className="flex-1 flex flex-col relative z-10">
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
