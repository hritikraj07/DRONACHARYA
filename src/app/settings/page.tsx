// Student Profile & Platform Settings
// Codédex-inspired retro-arcade settings with active course track switching and persistent database sync
'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useDronacharya } from '@/lib/store';
import { LanguagePreference } from '@/types';
import {
  Settings,
  User,
  Languages,
  RefreshCw,
  CheckCircle2,
  BookOpen,
  Sparkles,
  ArrowRight,
  GraduationCap,
} from 'lucide-react';
import {
  getActiveSession,
  getGuestSession,
  updateUserLearningSelection,
  AVAILABLE_SUBJECTS,
  AVAILABLE_CLASSES,
  RegisteredUser,
} from '@/lib/db/auth-db';

export default function SettingsPage() {
  const { state, updateProfile, resetDemoState } = useDronacharya();

  const [currentUser, setCurrentUser] = useState<RegisteredUser | null>(null);
  const [fullName, setFullName] = useState(state.user.fullName || 'Scholar Explorer');
  const [bio, setBio] = useState(state.user.bio || '');
  const [lang, setLang] = useState<LanguagePreference>(state.user.preferredLanguage || 'en');
  const [selectedSubject, setSelectedSubject] = useState<string>('python');
  const [selectedClass, setSelectedClass] = useState<string>('Class 10');
  const [savedFeedback, setSavedFeedback] = useState(false);

  useEffect(() => {
    const session = getActiveSession() || getGuestSession();
    if (session) {
      setCurrentUser(session);
      if (session.name) setFullName(session.name);
      if (session.targetSubject) setSelectedSubject(session.targetSubject);
      if (session.studentClass) setSelectedClass(session.studentClass);
      if (session.preferredLanguage) setLang(session.preferredLanguage as LanguagePreference);
    }
  }, []);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();

    // 1. Update in-memory Dronacharya state
    updateProfile({
      fullName,
      bio,
      preferredLanguage: lang,
    });

    // 2. Persist directly to Supabase profiles & synchronous session cache
    const updated = updateUserLearningSelection({
      studentClass: selectedClass,
      targetSubject: selectedSubject,
      preferredLanguage: lang,
    });

    if (updated) {
      setCurrentUser(updated);
    }

    // 3. Dispatch global sync event for TopNav and open tabs
    if (typeof window !== 'undefined') {
      window.dispatchEvent(new Event('dronacharya_session_change'));
      window.dispatchEvent(new Event('storage'));
    }

    setSavedFeedback(true);
    setTimeout(() => setSavedFeedback(false), 3000);
  };

  const activeSubjects = AVAILABLE_SUBJECTS.filter((s) => s.isAvailable && !s.isComingSoon);

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10 w-full space-y-8">
      {/* Header */}
      <div className="border-b-2 border-[#1E1E24] pb-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#EDE9FE] border-2 border-[#1E1E24] text-xs font-black text-[#6C5CE7] shadow-[2px_2px_0px_#1E1E24] mb-2">
            <Settings className="w-3.5 h-3.5" />
            <span>Profile & Learning Preferences</span>
          </div>
          <h1 className="font-serif font-black text-3xl sm:text-4xl text-[#1E1E24]">
            Player Settings
          </h1>
          <p className="text-xs sm:text-sm text-[#4A4A58] font-bold mt-1">
            Customize your active curriculum realm, adventurer persona, and AI mentor dialect.
          </p>
        </div>

        <Link
          href="/dashboard"
          className="btn-arcade btn-arcade-dark text-xs py-2 px-3.5 flex items-center gap-1.5 self-start sm:self-center shrink-0"
        >
          <span>Back to Quest Hub</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </Link>
      </div>

      <form onSubmit={handleSave} className="space-y-6">
        {/* =========================================================================
            1. ACTIVE LEARNING TRACK / COURSE SELECTOR
           ========================================================================= */}
        <div className="card-game space-y-4 bg-white border-2 border-[#1E1E24] p-5 sm:p-6 shadow-[4px_4px_0px_#1E1E24]">
          <div className="flex items-center justify-between border-b-2 border-[#1E1E24] pb-3">
            <div className="flex items-center gap-2">
              <BookOpen className="w-5 h-5 text-[#6C5CE7]" />
              <h2 className="font-black text-base sm:text-lg text-[#1E1E24]">
                Active Learning Realm & Course
              </h2>
            </div>
            <span className="text-[10px] font-black uppercase tracking-wider text-[#6C5CE7] bg-[#EDE9FE] px-3 py-1 rounded-full border border-[#1E1E24] shadow-[1px_1px_0px_#1E1E24]">
              Current Track
            </span>
          </div>

          <p className="text-xs text-[#4A4A58] font-medium leading-relaxed">
            Choose your primary programming track. Your daily quest recommendations, code simulator templates, and interactive coding challenges will match this subject.
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 pt-1">
            {activeSubjects.map((subject) => {
              const isSelected = selectedSubject === subject.id;
              return (
                <div
                  key={subject.id}
                  onClick={() => setSelectedSubject(subject.id)}
                  className={`p-4 rounded-xl border-2 transition-all cursor-pointer flex flex-col justify-between select-none ${
                    isSelected
                      ? 'border-[#6C5CE7] bg-[#EDE9FE]/50 shadow-[3px_3px_0px_#6C5CE7] ring-1 ring-[#6C5CE7]'
                      : 'border-[#1E1E24] bg-[#FAF6EE] hover:bg-white shadow-[2px_2px_0px_#1E1E24]'
                  }`}
                >
                  <div className="flex items-start justify-between gap-2 mb-2">
                    <div className="flex items-center gap-2.5">
                      <div
                        className="w-8 h-8 rounded-lg flex items-center justify-center font-mono font-black text-xs text-white border border-[#1E1E24] shadow-[1.5px_1.5px_0px_#1E1E24] shrink-0"
                        style={{ backgroundColor: subject.color || '#6C5CE7' }}
                      >
                        {subject.name.substring(0, 2).toUpperCase()}
                      </div>
                      <div>
                        <div className="font-black text-sm text-[#1E1E24] leading-tight flex items-center gap-1.5">
                          <span>{subject.name}</span>
                          {isSelected && (
                            <span className="text-[9px] font-black uppercase bg-[#6C5CE7] text-white px-1.5 py-0.2 rounded">
                              Active
                            </span>
                          )}
                        </div>
                        <div className="text-[10px] text-slate-500 font-bold uppercase tracking-wider mt-0.5">
                          {subject.category}
                        </div>
                      </div>
                    </div>

                    <div
                      className={`w-5 h-5 rounded-full flex items-center justify-center text-xs font-black shrink-0 border-2 transition-all ${
                        isSelected
                          ? 'border-[#6C5CE7] bg-[#6C5CE7] text-white'
                          : 'border-slate-300 bg-white'
                      }`}
                    >
                      {isSelected ? '✓' : ''}
                    </div>
                  </div>

                  <p className="text-[11px] text-[#4A4A58] font-medium leading-normal mt-1">
                    {subject.tagline}
                  </p>
                </div>
              );
            })}
          </div>

          {/* Academic Grade / Level */}
          <div className="pt-2 border-t border-slate-200">
            <label className="block text-xs font-black text-[#1E1E24] mb-1.5 flex items-center gap-1.5">
              <GraduationCap className="w-4 h-4 text-[#6C5CE7]" />
              <span>Academic Grade / Experience Level</span>
            </label>
            <select
              value={selectedClass}
              onChange={(e) => setSelectedClass(e.target.value)}
              className="w-full px-3.5 py-2.5 border-2 border-[#1E1E24] rounded-xl text-xs font-bold focus:outline-none bg-white text-[#1E1E24] shadow-[2px_2px_0px_#1E1E24] cursor-pointer"
            >
              {AVAILABLE_CLASSES.map((cls) => (
                <option key={cls} value={cls}>
                  {cls}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* =========================================================================
            2. PLAYER PROFILE DETAILS
           ========================================================================= */}
        <div className="card-game space-y-4 bg-white border-2 border-[#1E1E24] p-5 sm:p-6 shadow-[4px_4px_0px_#1E1E24]">
          <div className="flex items-center gap-2 border-b-2 border-[#1E1E24] pb-3">
            <User className="w-5 h-5 text-[#6C5CE7]" />
            <h2 className="font-black text-base sm:text-lg text-[#1E1E24]">
              Adventurer Persona & Bio
            </h2>
          </div>

          <div>
            <label className="block text-xs font-black text-[#1E1E24] mb-1.5">
              Player Codename / Full Name
            </label>
            <input
              type="text"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              className="w-full px-3.5 py-2.5 border-2 border-[#1E1E24] rounded-xl text-xs font-bold focus:outline-none bg-white text-[#1E1E24] shadow-[2px_2px_0px_#1E1E24]"
              placeholder="Your player handle"
            />
          </div>

          <div>
            <label className="block text-xs font-black text-[#1E1E24] mb-1.5">
              Adventure Bio
            </label>
            <textarea
              value={bio}
              onChange={(e) => setBio(e.target.value)}
              rows={3}
              className="w-full px-3.5 py-2.5 border-2 border-[#1E1E24] rounded-xl text-xs font-bold focus:outline-none bg-white text-[#1E1E24] shadow-[2px_2px_0px_#1E1E24]"
              placeholder="Share what quests or programming languages you are excited to conquer..."
            />
          </div>

          <div>
            <label className="block text-xs font-black text-[#1E1E24] mb-1.5 flex items-center gap-1.5">
              <Languages className="w-4 h-4 text-[#6C5CE7]" />
              <span>Acharya AI Mentor Dialect</span>
            </label>
            <select
              value={lang}
              onChange={(e) => setLang(e.target.value as LanguagePreference)}
              className="w-full px-3.5 py-2.5 border-2 border-[#1E1E24] rounded-xl text-xs font-bold focus:outline-none bg-white text-[#1E1E24] shadow-[2px_2px_0px_#1E1E24] cursor-pointer"
            >
              <option value="en">English (Standard)</option>
              <option value="hinglish">Hinglish (Conversational Code-Switching)</option>
              <option value="hi">हिन्दी (Devanagari)</option>
            </select>
            <p className="text-[10px] text-slate-500 font-bold mt-1">
              Select which language your Socratic AI mentor will converse with during coding quests.
            </p>
          </div>
        </div>

        {/* =========================================================================
            ACTIONS & CONFIRMATION
           ========================================================================= */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-2">
          <button
            type="button"
            onClick={() => {
              if (confirm('Reset demo state to initial adventure defaults?')) {
                resetDemoState();
              }
            }}
            className="w-full sm:w-auto btn-arcade btn-arcade-dark text-xs py-2 px-3.5 flex items-center justify-center gap-1.5 text-[#EF4444] border-rose-300 hover:border-rose-500"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            <span>Reset Adventure Defaults</span>
          </button>

          <div className="flex items-center gap-3 w-full sm:w-auto justify-end">
            {savedFeedback && (
              <span className="text-xs text-[#059669] font-black flex items-center gap-1.5 bg-[#D1FAE5] px-3 py-1.5 rounded-lg border border-[#059669] animate-in fade-in duration-200">
                <CheckCircle2 className="w-4 h-4 text-[#059669]" />
                <span>Preferences Saved!</span>
              </span>
            )}
            <button
              type="submit"
              className="w-full sm:w-auto btn-arcade btn-arcade-purple text-xs py-2.5 px-6 font-black shadow-[3px_3px_0px_#1E1E24]"
            >
              Save Changes
            </button>
          </div>
        </div>
      </form>
    </div>
  );
}
