// Student Profile & Platform Settings
'use client';

import React, { useState } from 'react';
import { useDronacharya } from '@/lib/store';
import { LanguagePreference } from '@/types';
import { Settings, User, Languages, RefreshCw, CheckCircle2 } from 'lucide-react';

export default function SettingsPage() {
  const { state, updateProfile, resetDemoState } = useDronacharya();

  const [fullName, setFullName] = useState(state.user.fullName);
  const [bio, setBio] = useState(state.user.bio || '');
  const [lang, setLang] = useState<LanguagePreference>(state.user.preferredLanguage);
  const [savedFeedback, setSavedFeedback] = useState(false);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    updateProfile({
      fullName,
      bio,
      preferredLanguage: lang,
    });
    setSavedFeedback(true);
    setTimeout(() => setSavedFeedback(false), 2500);
  };

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-10 w-full">
      <div className="border-b-2 border-[#1E1E24] pb-4 mb-6">
        <h1 className="font-black text-3xl sm:text-4xl text-[#1E1E24]">
          Player Profile & Settings
        </h1>
        <p className="text-xs sm:text-sm text-[#4A4A58] font-bold mt-1">
          Customize your player codename, adventure bio, and Socratic mentor settings.
        </p>
      </div>

      <form onSubmit={handleSave} className="space-y-6">
        <div className="card-game space-y-4">
          <div>
            <label className="block text-xs font-black text-[#1E1E24] mb-1.5">Player Name</label>
            <input
              type="text"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              className="w-full px-3.5 py-2.5 border-2 border-[#1E1E24] rounded-xl text-xs font-bold focus:outline-none bg-white text-[#1E1E24] shadow-[2px_2px_0px_#1E1E24]"
            />
          </div>

          <div>
            <label className="block text-xs font-black text-[#1E1E24] mb-1.5">Adventure Bio</label>
            <textarea
              value={bio}
              onChange={(e) => setBio(e.target.value)}
              rows={3}
              className="w-full px-3.5 py-2.5 border-2 border-[#1E1E24] rounded-xl text-xs font-bold focus:outline-none bg-white text-[#1E1E24] shadow-[2px_2px_0px_#1E1E24]"
            />
          </div>

          <div>
            <label className="block text-xs font-black text-[#1E1E24] mb-1.5">
              Acharya AI Mentor Dialect
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
          </div>
        </div>

        <div className="flex items-center justify-between">
          <button
            type="button"
            onClick={() => {
              if (confirm('Reset demo state to initial adventure defaults?')) {
                resetDemoState();
              }
            }}
            className="btn-game-white text-xs py-2 px-3.5 flex items-center gap-1.5 font-black text-[#EF4444]"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            <span>Reset Demo State</span>
          </button>

          <div className="flex items-center gap-3">
            {savedFeedback && (
              <span className="text-xs text-[#10B981] font-black flex items-center gap-1">
                <CheckCircle2 className="w-4 h-4" />
                <span>Saved successfully</span>
              </span>
            )}
            <button type="submit" className="btn-game-purple text-xs py-2.5 px-6 font-black shadow-[3px_3px_0px_#1E1E24]">
              Save Changes
            </button>
          </div>
        </div>
      </form>
    </div>
  );
}
