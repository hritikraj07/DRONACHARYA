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
      <div className="border-b border-[#D8CFC0] pb-4 mb-6">
        <h1 className="font-serif font-bold text-3xl text-[#252820]">
          Scholar Profile & Preferences
        </h1>
        <p className="text-xs sm:text-sm text-[#575A51] mt-1">
          Customize your Gurukul profile details and Socratic mentor settings.
        </p>
      </div>

      <form onSubmit={handleSave} className="space-y-6">
        <div className="card-ivory space-y-4">
          <div>
            <label className="block text-xs font-semibold text-[#252820] mb-1">Full Name</label>
            <input
              type="text"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              className="w-full px-3 py-2 border border-[#D8CFC0] rounded text-xs focus:outline-none focus:border-[#354B3A] bg-[#FDFBF7]"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-[#252820] mb-1">Scholar Bio</label>
            <textarea
              value={bio}
              onChange={(e) => setBio(e.target.value)}
              rows={3}
              className="w-full px-3 py-2 border border-[#D8CFC0] rounded text-xs focus:outline-none focus:border-[#354B3A] bg-[#FDFBF7]"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-[#252820] mb-1">
              Acharya AI Primary Language
            </label>
            <select
              value={lang}
              onChange={(e) => setLang(e.target.value as LanguagePreference)}
              className="w-full px-3 py-2 border border-[#D8CFC0] rounded text-xs focus:outline-none focus:border-[#354B3A] bg-[#FDFBF7]"
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
              if (confirm('Reset demo state to initial onboarding defaults?')) {
                resetDemoState();
              }
            }}
            className="btn-secondary text-xs py-2 px-3 flex items-center gap-1.5 text-[#A65F43] border-[#A65F43]"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            <span>Reset Demo State</span>
          </button>

          <div className="flex items-center gap-3">
            {savedFeedback && (
              <span className="text-xs text-[#354B3A] font-semibold flex items-center gap-1">
                <CheckCircle2 className="w-4 h-4" />
                <span>Saved successfully</span>
              </span>
            )}
            <button type="submit" className="btn-primary text-xs py-2 px-5">
              Save Changes
            </button>
          </div>
        </div>
      </form>
    </div>
  );
}
