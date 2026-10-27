// Dronacharya Global Navigation Header
// Codédex-inspired retro-arcade gamified header with Guest Exploration, Supabase sync, zero-overlap layout, and tactile HUD
'use client';

import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import {
  getActiveSession,
  getGuestSession,
  setActiveSession,
  RegisteredUser,
  AVAILABLE_SUBJECTS,
  AVAILABLE_CLASSES,
  updateUserLearningSelection,
} from '@/lib/db/auth-db';
import { SaveProgressModal } from '@/components/auth/SaveProgressModal';
import {
  Compass,
  FolderGit2,
  Award,
  Users,
  Flame,
  Sparkles,
  Menu,
  X,
  Target,
  LogOut,
  BookOpen,
  ChevronDown,
  Heart,
  Gamepad2,
  ChevronRight,
  MoreHorizontal,
  LogIn,
  UserPlus,
} from 'lucide-react';

interface TopNavProps {
  onOpenMentor: () => void;
}

export function TopNav({ onOpenMentor }: TopNavProps) {
  const pathname = usePathname();
  const router = useRouter();
  const [currentUser, setCurrentUser] = useState<RegisteredUser | null>(null);
  const [guestUser, setGuestUser] = useState<RegisteredUser | null>(null);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [switchModalOpen, setSwitchModalOpen] = useState(false);
  const [moreDropdownOpen, setMoreDropdownOpen] = useState(false);
  const [saveModalOpen, setSaveModalOpen] = useState(false);
  const [saveModalMode, setSaveModalMode] = useState<'signup' | 'signin'>('signup');
  const moreRef = useRef<HTMLDivElement>(null);

  // Subject switch modal state
  const [selectedClass, setSelectedClass] = useState('');
  const [selectedSubject, setSelectedSubject] = useState('');

  useEffect(() => {
    const syncUser = () => {
      const session = getActiveSession();
      const guest = getGuestSession();
      setCurrentUser(session);
      setGuestUser(guest);
      const effective = session || guest;
      if (effective) {
        setSelectedClass(effective.studentClass);
        setSelectedSubject(effective.targetSubject);
      }
    };

    syncUser();
    window.addEventListener('dronacharya_session_change', syncUser);
    window.addEventListener('storage', syncUser);
    window.addEventListener('focus', syncUser);

    const handleOpenSave = (e: any) => {
      const mode = e?.detail?.reason === 'signin' ? 'signin' : 'signup';
      router.push(`/auth?mode=${mode}`);
    };
    window.addEventListener('dronacharya_open_save_progress', handleOpenSave);

    const interval = setInterval(syncUser, 600);
    return () => {
      window.removeEventListener('dronacharya_session_change', syncUser);
      window.removeEventListener('storage', syncUser);
      window.removeEventListener('focus', syncUser);
      window.removeEventListener('dronacharya_open_save_progress', handleOpenSave);
      clearInterval(interval);
    };
  }, [pathname]);

  // Close "More" dropdown on click outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (moreRef.current && !moreRef.current.contains(event.target as Node)) {
        setMoreDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Close menus on route change
  useEffect(() => {
    setMobileMenuOpen(false);
    setMoreDropdownOpen(false);
  }, [pathname]);

  const handleLogout = () => {
    setActiveSession(null);
    setCurrentUser(null);
    router.push('/');
  };

  const handleSaveSwitch = (e: React.FormEvent) => {
    e.preventDefault();
    const updated = updateUserLearningSelection({
      studentClass: selectedClass,
      targetSubject: selectedSubject,
    });
    if (updated) {
      if (currentUser) {
        setCurrentUser(updated);
      } else {
        setGuestUser(updated);
      }
      setSwitchModalOpen(false);
      router.refresh();
    }
  };

  const effectiveUser = currentUser || guestUser;
  const activeSubjectObj =
    AVAILABLE_SUBJECTS.find((s) => s.id === effectiveUser?.targetSubject) || AVAILABLE_SUBJECTS[0];

  // Core high-frequency desktop links (compact footprint)
  const primaryNavLinks = [
    { name: 'Courses', href: '/courses', icon: BookOpen },
    { name: 'Roadmap', href: '/paths', icon: Compass },
    { name: 'Missions', href: '/simulator', icon: Gamepad2 },
    { name: 'Projects', href: '/projects', icon: FolderGit2 },
  ];

  // Secondary links housed in clean "More" dropdown
  const secondaryNavLinks = [
    { name: 'Quest Hub', href: '/dashboard', icon: Target },
    { name: 'Mastery Seals', href: '/achievements', icon: Award },
    { name: 'Leaderboard', href: '/leaderboard', icon: Flame },
    { name: 'Squads', href: '/squads', icon: Users },
  ];

  const allNavLinks = [...primaryNavLinks, ...secondaryNavLinks];
  const isAuthPage = pathname === '/auth';

  return (
    <>
      <header
        className={`sticky top-0 z-40 w-full transition-colors ${
          isAuthPage
            ? 'bg-[#090A0F]/90 backdrop-blur-md border-b border-white/10 text-white'
            : 'bg-[#FAF6EE]/95 backdrop-blur-md border-b border-slate-200'
        }`}
      >
        <div className="w-full px-3 sm:px-6 h-16 flex items-center justify-between flex-nowrap gap-2 sm:gap-4 overflow-visible">
          {/* LEFT: Brand Logo & Title */}
          <div className="flex items-center gap-2 sm:gap-3 shrink-0 flex-nowrap">
            <Link href="/" className="flex items-center gap-2 shrink-0 group">
              <div className="w-9 h-9 rounded-xl bg-[#6C5CE7] text-white flex items-center justify-center font-serif text-lg font-bold border border-[#6C5CE7] transition-transform group-hover:scale-105 shrink-0">
                द्रो
              </div>
              <div className="flex flex-col shrink-0">
                <span
                  className={`font-serif font-black text-sm sm:text-base tracking-tight leading-none flex items-center gap-1.5 ${
                    isAuthPage ? 'text-white' : 'text-[#1E1E24]'
                  }`}
                >
                  DRONACHARYA
                  <span className="w-1.5 h-1.5 rounded-full bg-[#10B981] animate-ping" />
                </span>
                <span className="text-[8px] sm:text-[9px] tracking-widest uppercase text-[#FBBF24] font-black mt-0.5">
                  Coding Adventure
                </span>
              </div>
            </Link>

            {/* Current Course Selector Pill */}
            <button
              onClick={() => setSwitchModalOpen(true)}
              className="hidden xl:flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white hover:bg-slate-50 text-xs font-bold border border-slate-200 text-slate-800 transition-colors cursor-pointer shrink-0"
              title="Switch Learning Course"
            >
              <BookOpen className="w-3.5 h-3.5 text-[#6C5CE7] shrink-0" />
              <span className="truncate max-w-[130px]">{activeSubjectObj.name}</span>
              <ChevronDown className="w-3 h-3 text-slate-500 shrink-0" />
            </button>
          </div>

          {/* CENTER: Desktop Primary Navigation Links (Always visible to both guests and logged-in users) */}
          <nav className="hidden xl:flex items-center gap-1 flex-nowrap shrink-0">
            {primaryNavLinks.map((link) => {
              const Icon = link.icon;
              const isActive = pathname === link.href || pathname.startsWith(`${link.href}/`);
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-colors flex items-center gap-1.5 border shrink-0 ${
                    isActive
                      ? 'bg-[#6C5CE7] text-white border-[#6C5CE7]'
                      : 'border-transparent text-slate-600 hover:text-slate-900 hover:bg-slate-100/70'
                  }`}
                >
                  <Icon className="w-3.5 h-3.5 shrink-0" />
                  <span>{link.name}</span>
                </Link>
              );
            })}

            {/* "More" Dropdown Menu */}
            <div className="relative" ref={moreRef}>
              <button
                onClick={() => setMoreDropdownOpen(!moreDropdownOpen)}
                className="px-2.5 py-1.5 rounded-lg text-xs font-bold transition-colors flex items-center gap-1 border border-transparent text-slate-600 hover:text-slate-900 hover:bg-slate-100/70 shrink-0 cursor-pointer"
                title="More Sections"
              >
                <MoreHorizontal className="w-4 h-4 shrink-0" />
                <span>More</span>
                <ChevronDown className="w-3 h-3 shrink-0" />
              </button>

              {moreDropdownOpen && (
                <div className="absolute right-0 mt-2 w-48 bg-white border border-slate-200 rounded-xl py-1.5 z-50 animate-in fade-in-50 zoom-in-95 duration-100">
                  {secondaryNavLinks.map((link) => {
                    const Icon = link.icon;
                    const isActive = pathname === link.href;
                    return (
                      <Link
                        key={link.href}
                        href={link.href}
                        onClick={() => setMoreDropdownOpen(false)}
                        className={`flex items-center gap-2 px-3 py-2 text-xs font-bold hover:bg-[#FAF6EE] transition-colors ${
                          isActive ? 'text-[#6C5CE7] bg-[#EDE9FE]' : 'text-slate-800'
                        }`}
                      >
                        <Icon className="w-3.5 h-3.5 text-[#6C5CE7]" />
                        <span>{link.name}</span>
                      </Link>
                    );
                  })}
                </div>
              )}
            </div>
          </nav>

          {/* RIGHT: Player HUD Status Controls */}
          <div className="flex items-center gap-1.5 sm:gap-2.5 shrink-0 flex-nowrap">
            {currentUser ? (
              <>
                {/* 1. Player Avatar */}
                <Link
                  href="/dashboard"
                  className="w-8 h-8 rounded-xl bg-[#6C5CE7] border border-[#6C5CE7] text-white flex items-center justify-center font-serif font-black text-xs shrink-0 hover:scale-105 transition-transform"
                  title={`Adventurer: ${currentUser.name} (Quest Hub)`}
                >
                  {currentUser.name.charAt(0).toUpperCase()}
                </Link>

                {/* 2. Hearts Remaining */}
                <div
                  className="flex items-center gap-1 px-2.5 py-1 rounded-xl bg-rose-50 border border-rose-200 text-xs font-black text-rose-600 shrink-0"
                  title="Player Hearts Remaining"
                >
                  <Heart className="w-3.5 h-3.5 fill-rose-600 shrink-0" />
                  <span>{currentUser.hearts ?? 5}</span>
                </div>

                {/* 3. Daily Streak */}
                <div
                  className="hidden sm:flex items-center gap-1 px-2.5 py-1 rounded-xl bg-amber-50 border border-amber-200 text-xs font-black text-amber-700 shrink-0"
                  title={`${currentUser.currentStreak} Day Quest Streak`}
                >
                  <Flame className="w-3.5 h-3.5 fill-[#F59E0B] shrink-0" />
                  <span>{currentUser.currentStreak}d</span>
                </div>

                {/* 4. Level Badge */}
                <div
                  className="hidden md:flex items-center gap-1.5 px-2.5 py-1 rounded-xl bg-amber-100 border border-amber-300 text-xs font-black text-amber-900 shrink-0"
                  title={`Rank: ${currentUser.rank} • Lv.${currentUser.level || 1} • ${currentUser.totalXp} XP`}
                >
                  <Sparkles className="w-3.5 h-3.5 text-amber-900 shrink-0" />
                  <span>Lv.{currentUser.level || 1}</span>
                  <span className="opacity-40">•</span>
                  <span>{currentUser.totalXp} XP</span>
                </div>

                {/* AI Mentor Guidance */}
                <button
                  onClick={onOpenMentor}
                  className="btn-game-purple text-xs py-1.5 px-3 flex items-center gap-1 shrink-0"
                  title="Open AI Mentor Guidance"
                >
                  <Sparkles className="w-3.5 h-3.5 text-[#FBBF24] shrink-0" />
                  <span className="hidden lg:inline">Mentor AI</span>
                </button>

                {/* Sign Out Button */}
                <button
                  onClick={handleLogout}
                  className="p-1.5 rounded-xl border border-transparent hover:border-slate-200 hover:bg-rose-50 text-slate-500 hover:text-rose-600 transition-colors shrink-0 cursor-pointer"
                  title="Sign Out"
                  aria-label="Sign Out"
                >
                  <LogOut className="w-4 h-4" />
                </button>

                {/* Mobile / Tablet Menu Toggle Button */}
                <button
                  onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                  className="xl:hidden p-1.5 rounded-xl border border-slate-200 bg-white text-slate-700 shrink-0 cursor-pointer hover:bg-slate-50"
                  aria-label="Toggle Navigation Menu"
                >
                  {mobileMenuOpen ? <X className="w-4 h-4" /> : <Menu className="w-4 h-4" />}
                </button>
              </>
            ) : (
              <>
                {/* GUEST EXPLORER HUD: Pill badge + Log In + Sign Up (Routes to separate /auth page) */}
                <Link
                  href="/auth?mode=signup"
                  className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-50 hover:bg-amber-100/80 border border-amber-200 text-xs font-bold text-amber-900 transition-colors cursor-pointer shrink-0"
                  title="Guest Mode • Sign up to save progress"
                >
                  <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping shrink-0" />
                  <span className="hidden sm:inline">Guest Mode • Sign up to save progress</span>
                  <span className="sm:hidden">Guest • Save</span>
                </Link>

                {/* Log In Button (Different page: /auth?mode=signin) */}
                <Link
                  href="/auth?mode=signin"
                  className="px-3.5 py-1.5 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 text-slate-800 font-bold text-xs transition-colors shrink-0 cursor-pointer"
                >
                  Log In
                </Link>

                {/* Sign Up Button (Different page: /auth?mode=signup) */}
                <Link
                  href="/auth?mode=signup"
                  className="btn-game-yellow text-xs py-1.5 px-3.5 flex items-center gap-1 shrink-0 cursor-pointer"
                >
                  <Sparkles className="w-3.5 h-3.5 text-slate-900" />
                  <span>Sign Up</span>
                </Link>

                {/* AI Mentor Button */}
                <button
                  onClick={onOpenMentor}
                  className="btn-game-purple text-xs py-1.5 px-3 flex items-center gap-1 shrink-0"
                  title="Open AI Mentor Guidance"
                >
                  <Sparkles className="w-3.5 h-3.5 text-[#FBBF24] shrink-0" />
                  <span className="hidden lg:inline">Mentor AI</span>
                </button>

                {/* Mobile / Tablet Menu Toggle Button */}
                <button
                  onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                  className="xl:hidden p-1.5 rounded-xl border border-slate-200 bg-white text-slate-700 shrink-0 cursor-pointer hover:bg-slate-50"
                  aria-label="Toggle Navigation Menu"
                >
                  {mobileMenuOpen ? <X className="w-4 h-4" /> : <Menu className="w-4 h-4" />}
                </button>
              </>
            )}
          </div>
        </div>

        {/* Mobile / Tablet Navigation Drawer */}
        {mobileMenuOpen && (
          <div className="xl:hidden border-t border-slate-200 bg-[#FAF6EE] px-4 pt-3 pb-5 space-y-3 animate-in slide-in-from-top-2 duration-150">
            {/* Subject Switch Action */}
            <button
              onClick={() => {
                setMobileMenuOpen(false);
                setSwitchModalOpen(true);
              }}
              className="w-full text-left p-3 rounded-xl bg-white border border-slate-200 text-xs font-bold flex items-center justify-between"
            >
              <div className="flex items-center gap-2">
                <BookOpen className="w-4 h-4 text-[#6C5CE7]" />
                <span>
                  Course: <strong>{activeSubjectObj.name}</strong>
                </span>
              </div>
              <span className="text-[10px] font-black uppercase text-[#6C5CE7] bg-[#EDE9FE] px-2 py-0.5 rounded">
                Switch
              </span>
            </button>

            {/* Quick Stats or Guest CTA on Mobile */}
            {currentUser ? (
              <div className="grid grid-cols-3 gap-2 text-center text-xs font-black">
                <div className="bg-rose-50 p-2 rounded-lg border border-rose-200">
                  <div className="text-[10px] text-slate-500 font-bold">LIVES</div>
                  <div className="text-rose-600">{currentUser.hearts ?? 5} / 5</div>
                </div>
                <div className="bg-amber-50 p-2 rounded-lg border border-amber-200">
                  <div className="text-[10px] text-slate-500 font-bold">STREAK</div>
                  <div className="text-amber-700">{currentUser.currentStreak}d Active</div>
                </div>
                <div className="bg-amber-100 p-2 rounded-lg border border-amber-300">
                  <div className="text-[10px] text-slate-700 font-bold">XP / LVL</div>
                  <div className="text-slate-900">{currentUser.totalXp} XP (L{currentUser.level || 1})</div>
                </div>
              </div>
            ) : (
              <div className="p-3 rounded-xl bg-amber-50 border border-amber-200 space-y-2">
                <div className="flex items-center justify-between text-xs font-bold text-slate-900">
                  <span>🕹️ Playing as Guest Explorer</span>
                  <span className="text-amber-700">{guestUser?.totalXp || 0} XP Stashed</span>
                </div>
                <div className="flex gap-2">
                  <Link
                    href="/auth?mode=signin"
                    onClick={() => setMobileMenuOpen(false)}
                    className="flex-1 py-2 text-center rounded-lg border border-slate-200 bg-white text-xs font-bold text-slate-800 hover:bg-slate-50"
                  >
                    Log In
                  </Link>
                  <Link
                    href="/auth?mode=signup"
                    onClick={() => setMobileMenuOpen(false)}
                    className="flex-1 btn-game-yellow text-xs py-2 text-center font-bold"
                  >
                    Sign Up to Save
                  </Link>
                </div>
              </div>
            )}

            {/* Navigation Links Grid */}
            <div className="grid grid-cols-2 gap-2 pt-1">
              {allNavLinks.map((link) => {
                const Icon = link.icon;
                const isActive = pathname === link.href || pathname.startsWith(`${link.href}/`);
                return (
                  <Link
                    key={link.href}
                    href={link.href}
                    onClick={() => setMobileMenuOpen(false)}
                    className={`flex items-center gap-2 p-2.5 rounded-xl border text-xs font-bold transition-colors ${
                      isActive
                        ? 'bg-[#6C5CE7] text-white border-[#6C5CE7]'
                        : 'bg-white text-slate-800 border-slate-200 hover:bg-slate-50'
                    }`}
                  >
                    <Icon className="w-4 h-4 shrink-0" />
                    <span>{link.name}</span>
                  </Link>
                );
              })}
            </div>
          </div>
        )}
      </header>

      {/* Switch Class / Subject Modal */}
      {switchModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div
            className="fixed inset-0 bg-black/50 backdrop-blur-xs transition-opacity"
            onClick={() => setSwitchModalOpen(false)}
          />
          <div className="relative w-full max-w-lg bg-white border border-slate-200 rounded-2xl p-6 z-10 animate-in zoom-in-95 duration-150">
            <div className="flex items-center justify-between border-b border-slate-200 pb-3 mb-4">
              <div>
                <span className="text-[10px] text-[#6C5CE7] uppercase tracking-wider font-black">
                  Personalized Learning Path
                </span>
                <h3 className="font-serif font-black text-xl text-[#1E1E24]">
                  What do you want to learn?
                </h3>
              </div>
              <button
                onClick={() => setSwitchModalOpen(false)}
                className="p-1 rounded-lg hover:bg-gray-100 text-gray-500 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveSwitch} className="space-y-4 text-xs">
              <div>
                <label className="block font-black text-[#1E1E24] mb-1.5">
                  Class Standard (Kept separately, up to 12th Pass):
                </label>
                <div className="space-y-1.5">
                  {AVAILABLE_CLASSES.map((c) => (
                    <div
                      key={c}
                      onClick={() => setSelectedClass(c)}
                      className={`p-2.5 rounded-xl border cursor-pointer transition-colors flex items-center justify-between ${
                        selectedClass === c
                          ? 'bg-[#EDE9FE] border-[#6C5CE7] font-bold text-[#6C5CE7]'
                          : 'bg-white border-slate-200 hover:bg-slate-50 text-slate-800'
                      }`}
                    >
                      <span>{c}</span>
                      {selectedClass === c && <span className="text-[#6C5CE7]">✓ Active</span>}
                    </div>
                  ))}
                </div>
              </div>

              <div>
                <label className="block font-black text-[#1E1E24] mb-1.5">
                  Programming Language (Dropdown Menu):
                </label>
                <div className="relative">
                  <select
                    value={selectedSubject}
                    onChange={(e) => setSelectedSubject(e.target.value)}
                    className="w-full appearance-none px-3.5 py-2.5 border border-slate-200 rounded-xl bg-white text-xs font-bold text-[#1E1E24] focus:outline-none cursor-pointer pr-10"
                  >
                    {AVAILABLE_SUBJECTS.map((s) => (
                      <option key={s.id} value={s.id}>
                        {s.name} — {s.tagline}
                      </option>
                    ))}
                  </select>
                  <ChevronDown className="w-4 h-4 text-[#1E1E24] absolute right-3.5 top-3 pointer-events-none" />
                </div>
              </div>

              <div className="mt-6 pt-3 border-t border-slate-200 flex items-center justify-between">
                <button
                  type="button"
                  onClick={() => setSwitchModalOpen(false)}
                  className="btn-game-yellow text-xs py-2 px-4 cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="btn-game-purple text-xs py-2 px-5 cursor-pointer"
                >
                  Save & Update
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Cloud Sync & Save Progress Modal (Fallback if triggered programmatically) */}
      <SaveProgressModal
        isOpen={saveModalOpen}
        onClose={() => setSaveModalOpen(false)}
        initialMode={saveModalMode}
        onSuccess={(user) => {
          setCurrentUser(user);
        }}
      />
    </>
  );
}
