// Dronacharya Global Navigation Header
'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useDronacharya } from '@/lib/store';
import {
  Compass,
  Code2,
  FolderGit2,
  Award,
  Users,
  Flame,
  Sparkles,
  Menu,
  X,
  Target,
} from 'lucide-react';

interface TopNavProps {
  onOpenMentor: () => void;
}

export function TopNav({ onOpenMentor }: TopNavProps) {
  const pathname = usePathname();
  const { state } = useDronacharya();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navLinks = [
    { name: 'Courtyard', href: '/dashboard', icon: Compass },
    { name: 'Missions', href: '/paths', icon: Target },
    { name: 'Simulator', href: '/simulator', icon: Code2 },
    { name: 'Projects', href: '/projects', icon: FolderGit2 },
    { name: 'Squads', href: '/squads', icon: Users },
    { name: 'Seals', href: '/achievements', icon: Award },
    { name: 'Portfolio', href: `/portfolio/${state.user.username}`, icon: Sparkles },
  ];

  return (
    <header className="sticky top-0 z-40 bg-[#F6F1E7]/95 backdrop-blur-md border-b border-[#D8CFC0]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        {/* Brand Mark & Title */}
        <div className="flex items-center gap-8">
          <Link href="/" className="flex items-center gap-3 group">
            <div className="w-9 h-9 rounded bg-[#354B3A] text-[#F6F1E7] flex items-center justify-center font-serif text-xl font-bold shadow-sm group-hover:bg-[#2B3D2F] transition-colors">
              द्रो
            </div>
            <div className="flex flex-col">
              <span className="font-serif font-bold text-lg text-[#252820] tracking-wide leading-tight">
                DRONACHARYA
              </span>
              <span className="text-[10px] tracking-widest uppercase text-[#7E8276] font-medium">
                The Digital Gurukul
              </span>
            </div>
          </Link>

          {/* Desktop Navigation Links */}
          <nav className="hidden md:flex items-center gap-1">
            {navLinks.map((link) => {
              const Icon = link.icon;
              const isActive = pathname === link.href || pathname.startsWith(`${link.href}/`);
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`px-3 py-1.5 rounded text-sm font-medium transition-colors flex items-center gap-1.5 ${
                    isActive
                      ? 'bg-[#354B3A] text-[#F6F1E7]'
                      : 'text-[#575A51] hover:text-[#252820] hover:bg-[#E9DFC9]/60'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  {link.name}
                </Link>
              );
            })}
          </nav>
        </div>

        {/* Right Status Controls */}
        <div className="flex items-center gap-3">
          {/* Daily Streak Indicator */}
          <div
            className="flex items-center gap-1 px-2.5 py-1 rounded-full bg-[#E9DFC9] border border-[#D8CFC0] text-xs font-semibold text-[#A65F43]"
            title={`${state.user.currentStreak} Day Focus Streak`}
          >
            <Flame className="w-3.5 h-3.5 fill-[#A65F43]" />
            <span>{state.user.currentStreak}d</span>
          </div>

          {/* XP & Rank Badge */}
          <div className="hidden sm:flex items-center gap-1.5 px-3 py-1 rounded bg-[#FBF8F2] border border-[#B49A65] text-xs font-medium text-[#7A6230]">
            <Award className="w-3.5 h-3.5 text-[#B49A65]" />
            <span>{state.user.totalXp} XP</span>
            <span className="text-[#A6AC9B]">•</span>
            <span className="font-semibold">{state.user.rank}</span>
          </div>

          {/* Acharya AI Mentor Trigger Button */}
          <button
            onClick={onOpenMentor}
            className="btn-brass text-xs py-1.5 px-3 shadow-xs"
            title="Open Acharya AI Socratic Guidance"
          >
            <Sparkles className="w-3.5 h-3.5 text-[#B49A65]" />
            <span className="hidden sm:inline">Acharya AI</span>
          </button>

          {/* Mobile Menu Toggle */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden p-1.5 rounded hover:bg-[#E9DFC9] text-[#252820]"
            aria-label="Toggle Navigation Menu"
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5 text-[#252820]" />}
          </button>
        </div>
      </div>

      {/* Mobile Nav Drawer */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t border-[#D8CFC0] bg-[#F6F1E7] px-4 pt-2 pb-4 space-y-1">
          {navLinks.map((link) => {
            const Icon = link.icon;
            const isActive = pathname === link.href || pathname.startsWith(`${link.href}/`);
            return (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setMobileMenuOpen(false)}
                className={`flex items-center gap-2.5 px-3 py-2 rounded text-sm font-medium ${
                  isActive ? 'bg-[#354B3A] text-[#F6F1E7]' : 'text-[#575A51] hover:bg-[#E9DFC9]'
                }`}
              >
                <Icon className="w-4 h-4" />
                {link.name}
              </Link>
            );
          })}
        </div>
      )}
    </header>
  );
}
