// Dronacharya Global Navigation Header
'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import {
  getActiveSession,
  setActiveSession,
  RegisteredUser,
  AVAILABLE_SUBJECTS,
  AVAILABLE_CLASSES,
  updateUserLearningSelection,
} from '@/lib/db/auth-db';
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
  LogOut,
  BookOpen,
  ChevronDown,
  Heart,
  Gamepad2,
  ChevronRight,
} from 'lucide-react';

interface TopNavProps {
  onOpenMentor: () => void;
}

export function TopNav({ onOpenMentor }: TopNavProps) {
  const pathname = usePathname();
  const router = useRouter();
  const [currentUser, setCurrentUser] = useState<RegisteredUser | null>(null);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [switchModalOpen, setSwitchModalOpen] = useState(false);

  // Subject switch modal state
  const [selectedClass, setSelectedClass] = useState('');
  const [selectedSubject, setSelectedSubject] = useState('');

  useEffect(() => {
    const syncUser = () => {
      const session = getActiveSession();
      setCurrentUser(session);
      if (session) {
        setSelectedClass(session.studentClass);
        setSelectedSubject(session.targetSubject);
      }
    };
    syncUser();
    window.addEventListener('dronacharya_session_change', syncUser);
    window.addEventListener('storage', syncUser);
    window.addEventListener('focus', syncUser);
    const interval = setInterval(syncUser, 500);
    return () => {
      window.removeEventListener('dronacharya_session_change', syncUser);
      window.removeEventListener('storage', syncUser);
      window.removeEventListener('focus', syncUser);
      clearInterval(interval);
    };
  }, [pathname]);

  const handleLogout = () => {
    setActiveSession(null);
    setCurrentUser(null);
    router.push('/auth');
  };

  const handleSaveSwitch = (e: React.FormEvent) => {
    e.preventDefault();
    const updated = updateUserLearningSelection({
      studentClass: selectedClass,
      targetSubject: selectedSubject,
    });
    if (updated) {
      setCurrentUser(updated);
      setSwitchModalOpen(false);
      // Reload or refresh to load the new subject's game
      router.refresh();
    }
  };

  const activeSubjectObj =
    AVAILABLE_SUBJECTS.find((s) => s.id === currentUser?.targetSubject) || AVAILABLE_SUBJECTS[0];

  const navLinks = [
    { name: 'Courses', href: '/courses', icon: BookOpen },
    { name: 'World Map', href: '/paths', icon: Compass },
    { name: 'Missions', href: '/simulator', icon: Gamepad2 },
    { name: 'Quest Hub', href: '/dashboard', icon: Target },
    { name: 'Mastery Seals', href: '/achievements', icon: Award },
    { name: 'Projects', href: '/projects', icon: FolderGit2 },
  ];

  const isAuthPage = pathname === '/auth';

  return (
    <>
      <header className={`sticky top-0 z-40 w-full transition-colors ${
        isAuthPage
          ? 'bg-[#090A0F]/85 backdrop-blur-md border-b-2 border-white/10 text-white'
          : 'bg-[#FAF6EE]/95 backdrop-blur-md border-b-2 border-[#1E1E24] shadow-xs'
      }`}>
        <div className="w-full px-4 sm:px-6 h-16 flex items-center justify-between">
          {/* Brand Mark & Title */}
          <div className="flex items-center gap-4 sm:gap-6 min-w-0">
            <Link href="/" className="flex items-center gap-2.5 shrink-0 group">
              <div className="w-9 h-9 rounded-xl bg-[#6C5CE7] text-white flex items-center justify-center font-serif text-lg font-bold border-2 border-[#1E1E24] shadow-[2px_2px_0px_#1E1E24] group-hover:translate-x-0.5 group-hover:translate-y-0.5 group-hover:shadow-[1px_1px_0px_#1E1E24] transition-all">
                द्रो
              </div>
              <div className="flex flex-col">
                <span className={`font-serif font-black text-base sm:text-lg tracking-tight leading-none flex items-center gap-1.5 ${
                  isAuthPage ? 'text-white' : 'text-[#1E1E24]'
                }`}>
                  DRONACHARYA
                  <span className="w-2 h-2 rounded-full bg-[#10B981] animate-ping" />
                </span>
                <span className="text-[9px] tracking-widest uppercase text-[#FBBF24] font-black mt-0.5">
                  Coding Adventure
                </span>
              </div>
            </Link>

            {/* Current Active Learning Course Pill with Change Action */}
            {currentUser && (
              <button
                onClick={() => setSwitchModalOpen(true)}
                className="hidden lg:flex items-center gap-1.5 px-3 py-1 rounded-xl bg-[#FFFFFF] hover:bg-[#F2ECE0] text-xs font-bold border-2 border-[#1E1E24] shadow-[2px_2px_0px_#1E1E24] text-[#1E1E24] transition-all cursor-pointer"
                title="Click to Switch Learning Topic"
              >
                <BookOpen className="w-3.5 h-3.5 text-[#6C5CE7]" />
                <span className="truncate max-w-[180px]">{activeSubjectObj.name}</span>
                <ChevronDown className="w-3 h-3 text-[#7E7E8F]" />
              </button>
            )}

            {/* Desktop Navigation Links */}
            {currentUser && (
              <nav className="hidden xl:flex items-center gap-1.5">
                {navLinks.map((link) => {
                  const Icon = link.icon;
                  const isActive = pathname === link.href || pathname.startsWith(`${link.href}/`);
                  return (
                    <Link
                      key={link.href}
                      href={link.href}
                      className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 border-2 ${
                        isActive
                          ? 'bg-[#6C5CE7] text-white border-[#1E1E24] shadow-[2px_2px_0px_#1E1E24]'
                          : 'border-transparent text-[#4A4A58] hover:text-[#1E1E24] hover:bg-[#F2ECE0] hover:border-[#1E1E24]'
                      }`}
                    >
                      <Icon className="w-3.5 h-3.5" />
                      <span>{link.name}</span>
                    </Link>
                  );
                })}
              </nav>
            )}
          </div>

          {/* Right Status Controls / Player HUD */}
          <div className="flex items-center gap-2 sm:gap-3 shrink-0">
            {currentUser ? (
              <>
                {/* Game Hearts/Lives */}
                <div
                  className="flex items-center gap-1 px-2.5 py-1 rounded-lg bg-[#FEE2E2] border-2 border-[#1E1E24] shadow-[2px_2px_0px_#1E1E24] text-xs font-black text-[#EF4444]"
                  title="Player Hearts Remaining"
                >
                  <Heart className="w-3.5 h-3.5 fill-[#EF4444]" />
                  <span>{currentUser.hearts ?? 3}</span>
                </div>

                {/* Daily Streak Indicator */}
                <div
                  className="hidden sm:flex items-center gap-1 px-2.5 py-1 rounded-lg bg-[#FEF3C7] border-2 border-[#1E1E24] shadow-[2px_2px_0px_#1E1E24] text-xs font-black text-[#D97706]"
                  title={`${currentUser.currentStreak} Day Quest Streak`}
                >
                  <Flame className="w-3.5 h-3.5 fill-[#F59E0B]" />
                  <span>{currentUser.currentStreak}d</span>
                </div>

                {/* XP & Level Badge */}
                <div className="flex items-center gap-1.5 px-3 py-1 rounded-lg bg-[#FBBF24] border-2 border-[#1E1E24] shadow-[2px_2px_0px_#1E1E24] text-xs font-black text-[#1E1E24]">
                  <Sparkles className="w-3.5 h-3.5 text-[#1E1E24]" />
                  <span>{currentUser.totalXp} XP</span>
                  <span className="opacity-40">•</span>
                  <span>Lv.{currentUser.level || 1}</span>
                </div>

                {/* AI Mentor Trigger Button */}
                <button
                  onClick={onOpenMentor}
                  className="btn-game-purple text-xs py-1.5 px-3"
                  title="Open AI Mentor Guidance"
                >
                  <Sparkles className="w-3.5 h-3.5 text-[#FBBF24]" />
                  <span className="hidden md:inline">Mentor AI</span>
                </button>

                {/* Logout Action */}
                <button
                  onClick={handleLogout}
                  className="p-1.5 rounded-lg border-2 border-transparent hover:border-[#1E1E24] hover:bg-[#FEE2E2] text-[#7E7E8F] hover:text-[#EF4444] transition-all"
                  title="Sign Out"
                  aria-label="Sign Out"
                >
                  <LogOut className="w-4 h-4" />
                </button>

                {/* Mobile Menu Toggle */}
                <button
                  onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                  className="xl:hidden p-1.5 rounded-lg border-2 border-[#1E1E24] bg-white shadow-[2px_2px_0px_#1E1E24] text-[#1E1E24]"
                  aria-label="Toggle Navigation Menu"
                >
                  {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5 text-[#1E1E24]" />}
                </button>
              </>
            ) : (
              <Link href="/auth" className="btn-game-yellow text-xs py-2 px-4">
                <span>Start Adventure</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </Link>
            )}
          </div>
        </div>

        {/* Mobile Navigation Drawer */}
        {mobileMenuOpen && currentUser && (
          <div className="xl:hidden border-t border-[#D8CFC0] bg-[#F6F1E7] px-4 pt-3 pb-4 space-y-2">
            <button
              onClick={() => {
                setMobileMenuOpen(false);
                setSwitchModalOpen(true);
              }}
              className="w-full text-left p-2.5 rounded bg-[#E9DFC9] border border-[#B49A65] text-xs font-medium flex items-center justify-between"
            >
              <div className="flex items-center gap-2">
                <BookOpen className="w-4 h-4 text-[#354B3A]" />
                <span>Subject: <strong>{activeSubjectObj.name}</strong></span>
              </div>
              <span className="text-[10px] text-[#A65F43] font-bold">Switch</span>
            </button>

            {navLinks.map((link) => {
              const Icon = link.icon;
              const isActive = pathname === link.href || pathname.startsWith(`${link.href}/`);
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={() => setMobileMenuOpen(false)}
                  className={`flex items-center gap-2.5 px-3 py-2 rounded text-xs font-medium ${
                    isActive ? 'bg-[#354B3A] text-[#F6F1E7]' : 'text-[#575A51] hover:bg-[#E9DFC9]'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  <span>{link.name}</span>
                </Link>
              );
            })}
          </div>
        )}
      </header>

      {/* Switch Class / Subject Modal */}
      {switchModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div
            className="fixed inset-0 bg-[#252820]/40 backdrop-blur-xs transition-opacity"
            onClick={() => setSwitchModalOpen(false)}
          />
          <div className="relative w-full max-w-lg bg-[#F6F1E7] border-2 border-[#354B3A] rounded-xl shadow-2xl p-6 z-10 animate-in zoom-in-95 duration-150">
            <div className="flex items-center justify-between border-b border-[#D8CFC0] pb-3 mb-4">
              <div>
                <span className="text-[10px] text-[#A65F43] uppercase tracking-wider font-semibold">
                  Personalized Learning
                </span>
                <h3 className="font-serif font-bold text-xl text-[#252820]">
                  What do you want to learn?
                </h3>
              </div>
              <button
                onClick={() => setSwitchModalOpen(false)}
                className="p-1 rounded hover:bg-[#D8CFC0]"
              >
                <X className="w-5 h-5 text-[#575A51]" />
              </button>
            </div>

            <form onSubmit={handleSaveSwitch} className="space-y-4 text-xs">
              <div>
                <label className="block font-semibold text-[#252820] mb-1.5">
                  Class Standard (Kept separately, up to 12th Pass):
                </label>
                <div className="space-y-1.5">
                  {AVAILABLE_CLASSES.map((c) => (
                    <div
                      key={c}
                      onClick={() => setSelectedClass(c)}
                      className={`p-2.5 rounded-lg border cursor-pointer transition-all flex items-center justify-between ${
                        selectedClass === c
                          ? 'bg-[#E9DFC9] border-[#354B3A] font-bold text-[#252820]'
                          : 'bg-[#FAF8F5] border-[#D8CFC0] hover:bg-white text-[#575A51]'
                      }`}
                    >
                      <span>{c}</span>
                      {selectedClass === c && <span className="text-[#354B3A]">✓ Active</span>}
                    </div>
                  ))}
                </div>
              </div>

              <div>
                <label className="block font-semibold text-[#252820] mb-1.5">
                  Programming Language (Dropdown Menu):
                </label>
                <div className="relative">
                  <select
                    value={selectedSubject}
                    onChange={(e) => setSelectedSubject(e.target.value)}
                    className="w-full appearance-none px-3.5 py-2.5 border-2 border-[#354B3A] rounded-xl bg-white text-xs font-bold text-[#252820] focus:outline-none cursor-pointer pr-10"
                  >
                    {AVAILABLE_SUBJECTS.map((s) => (
                      <option key={s.id} value={s.id}>
                        {s.name} — {s.tagline}
                      </option>
                    ))}
                  </select>
                  <ChevronDown className="w-4 h-4 text-[#354B3A] absolute right-3.5 top-3 pointer-events-none" />
                </div>
              </div>

              <div className="mt-6 pt-3 border-t border-[#D8CFC0] flex items-center justify-between">
                <button
                  type="button"
                  onClick={() => setSwitchModalOpen(false)}
                  className="btn-secondary text-xs py-2 px-4"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="btn-primary text-xs py-2 px-5"
                >
                  Save & Update
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
}
