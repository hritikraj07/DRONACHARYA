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
    const session = getActiveSession();
    setCurrentUser(session);
    if (session) {
      setSelectedClass(session.studentClass);
      setSelectedSubject(session.targetSubject);
    }
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
    { name: 'Dashboard', href: '/dashboard', icon: Target },
    { name: 'Learn', href: '/paths', icon: BookOpen },
    { name: 'Missions', href: '/simulator', icon: Code2 },
    { name: 'Projects', href: '/projects', icon: FolderGit2 },
    { name: 'My Progress', href: '/portfolio', icon: Award },
  ];

  return (
    <>
      <header className="sticky top-0 z-40 w-full bg-[#F6F1E7]/95 backdrop-blur-md border-b border-[#D8CFC0]">
        <div className="w-full px-4 sm:px-6 h-16 flex items-center justify-between">
          {/* Brand Mark & Title */}
          <div className="flex items-center gap-4 sm:gap-6 min-w-0">
            <Link href="/" className="flex items-center gap-2.5 shrink-0 group">
              <div className="w-8 h-8 rounded bg-[#354B3A] text-[#F6F1E7] flex items-center justify-center font-serif text-lg font-bold shadow-xs group-hover:bg-[#2B3D2F]">
                द्रो
              </div>
              <div className="flex flex-col">
                <span className="font-serif font-bold text-base sm:text-lg text-[#252820] tracking-wide leading-none">
                  DRONACHARYA
                </span>
                <span className="text-[9px] tracking-widest uppercase text-[#7E8276] font-medium mt-0.5">
                  AI Learning Platform
                </span>
              </div>
            </Link>

            {/* Current Active Learning Course Pill with Change Action */}
            {currentUser && (
              <button
                onClick={() => setSwitchModalOpen(true)}
                className="hidden lg:flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#E9DFC9] hover:bg-[#D8CFC0] text-xs border border-[#B49A65] text-[#252820] transition-colors cursor-pointer"
                title="Click to Switch Learning Topic"
              >
                <BookOpen className="w-3.5 h-3.5 text-[#354B3A]" />
                <span className="font-medium truncate max-w-[200px]">{activeSubjectObj.name}</span>
                <ChevronDown className="w-3 h-3 text-[#7E8276]" />
              </button>
            )}

            {/* Desktop Navigation Links */}
            {currentUser && (
              <nav className="hidden xl:flex items-center gap-1">
                {navLinks.map((link) => {
                  const Icon = link.icon;
                  const isActive = pathname === link.href || pathname.startsWith(`${link.href}/`);
                  return (
                    <Link
                      key={link.href}
                      href={link.href}
                      className={`px-2.5 py-1.5 rounded text-xs font-medium transition-colors flex items-center gap-1.5 ${
                        isActive
                          ? 'bg-[#354B3A] text-[#F6F1E7]'
                          : 'text-[#575A51] hover:text-[#252820] hover:bg-[#E9DFC9]/60'
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

          {/* Right Status Controls */}
          <div className="flex items-center gap-2 sm:gap-3 shrink-0">
            {currentUser ? (
              <>
                {/* Game Hearts/Lives */}
                <div
                  className="flex items-center gap-1 px-2.5 py-1 rounded bg-[#FAF4F0] border border-[#A65F43]/40 text-xs font-bold text-[#A65F43]"
                  title="Game Hearts"
                >
                  <Heart className="w-3.5 h-3.5 fill-[#A65F43]" />
                  <span>{currentUser.hearts || 3}</span>
                </div>

                {/* Daily Streak Indicator */}
                <div
                  className="hidden sm:flex items-center gap-1 px-2.5 py-1 rounded-full bg-[#E9DFC9] border border-[#D8CFC0] text-xs font-semibold text-[#A65F43]"
                  title={`${currentUser.currentStreak} Day Focus Streak`}
                >
                  <Flame className="w-3.5 h-3.5 fill-[#A65F43]" />
                  <span>{currentUser.currentStreak}d</span>
                </div>

                {/* XP & Level Badge */}
                <div className="flex items-center gap-1.5 px-2.5 py-1 rounded bg-[#FBF8F2] border border-[#B49A65] text-xs font-medium text-[#7A6230]">
                  <Award className="w-3.5 h-3.5 text-[#B49A65]" />
                  <span className="font-bold">{currentUser.totalXp} XP</span>
                  <span className="text-[#A6AC9B] hidden sm:inline">•</span>
                  <span className="hidden sm:inline font-semibold">Lvl {currentUser.level || 1}</span>
                </div>

                {/* AI Mentor Trigger Button */}
                <button
                  onClick={onOpenMentor}
                  className="btn-brass text-xs py-1.5 px-2.5 shadow-2xs"
                  title="Open AI Mentor Guidance"
                >
                  <Sparkles className="w-3.5 h-3.5 text-[#B49A65]" />
                  <span className="hidden md:inline">AI Mentor</span>
                </button>

                {/* Logout Action */}
                <button
                  onClick={handleLogout}
                  className="p-1.5 rounded hover:bg-[#E9DFC9] text-[#7E8276] hover:text-[#A65F43]"
                  title="Sign Out"
                  aria-label="Sign Out"
                >
                  <LogOut className="w-4 h-4" />
                </button>

                {/* Mobile Menu Toggle */}
                <button
                  onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                  className="xl:hidden p-1.5 rounded hover:bg-[#E9DFC9] text-[#252820]"
                  aria-label="Toggle Navigation Menu"
                >
                  {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5 text-[#252820]" />}
                </button>
              </>
            ) : (
              <Link href="/auth" className="btn-primary text-xs py-1.5 px-4 shadow-xs">
                Sign In / Register
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
                <label className="block font-semibold text-[#252820] mb-1">
                  Education Level
                </label>
                <select
                  value={selectedClass}
                  onChange={(e) => setSelectedClass(e.target.value)}
                  className="w-full px-3 py-2 border border-[#D8CFC0] rounded bg-white focus:outline-none focus:border-[#354B3A]"
                >
                  {AVAILABLE_CLASSES.map((c) => (
                    <option key={c} value={c}>{c}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block font-semibold text-[#252820] mb-1">
                  Choose a Topic
                </label>
                <div className="space-y-2 mt-2">
                  {AVAILABLE_SUBJECTS.map((s) => (
                    <div
                      key={s.id}
                      onClick={() => setSelectedSubject(s.id)}
                      className={`p-3 rounded-lg border cursor-pointer transition-all flex items-center justify-between ${
                        selectedSubject === s.id
                          ? 'bg-[#E9DFC9] border-[#354B3A] ring-1 ring-[#354B3A] font-semibold'
                          : 'bg-white border-[#D8CFC0] hover:bg-[#FDFBF7]'
                      }`}
                    >
                      <div>
                        <div className="text-sm text-[#252820] flex items-center gap-2">
                          <span>{s.name}</span>
                          {s.isAvailable && (
                            <span className="text-[10px] bg-[#354B3A] text-white px-2 py-0.5 rounded font-normal">
                              Ready
                            </span>
                          )}
                          {!s.isAvailable && !s.isCustom && (
                            <span className="text-[10px] bg-[#D8CFC0] text-[#575A51] px-2 py-0.5 rounded font-normal">
                              Track Preview
                            </span>
                          )}
                        </div>
                        <div className="text-[11px] text-[#7E8276] font-normal">{s.tagline}</div>
                      </div>
                      <span className="text-xs text-[#354B3A]">{selectedSubject === s.id ? '✓ Selected' : ''}</span>
                    </div>
                  ))}
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
