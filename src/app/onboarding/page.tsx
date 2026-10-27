// Student Onboarding: Simple Topic Selection
'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useDronacharya } from '@/lib/store';
import { updateUserLearningSelection } from '@/lib/db/auth-db';
import { LanguagePreference } from '@/types';
import {
  ArrowRight,
  Terminal,
  Code2,
  Globe,
  Cpu,
  Sparkles,
  CheckCircle2,
} from 'lucide-react';

export default function OnboardingPage() {
  const router = useRouter();
  const { updateProfile } = useDronacharya();

  const [selectedTopic, setSelectedTopic] = useState('python-basics');
  const [customTopicText, setCustomTopicText] = useState('');
  const [selectedLang, setSelectedLang] = useState<LanguagePreference>('en');
  const [difficulty, setDifficulty] = useState<'beginner' | 'intermediate'>('beginner');

  const topics = [
    {
      id: 'python-basics',
      title: 'Python',
      subtitle: 'Beginner friendly',
      icon: Terminal,
      description: 'Learn loops, conditions, and practical coding step-by-step.',
      isReady: true,
    },
    {
      id: 'c-programming',
      title: 'C Programming',
      subtitle: 'Core programming',
      icon: Code2,
      description: 'Learn programming fundamentals, variables, and memory.',
      isReady: false,
    },
    {
      id: 'web-development',
      title: 'Web Development',
      subtitle: 'Frontend & Web apps',
      icon: Globe,
      description: 'Build web pages with HTML, CSS, and modern JavaScript.',
      isReady: false,
    },
    {
      id: 'ai-basics',
      title: 'AI Basics',
      subtitle: 'Modern AI concepts',
      icon: Cpu,
      description: 'Understand how machine learning and artificial intelligence work.',
      isReady: false,
    },
    {
      id: 'custom-topic',
      title: 'Custom Topic',
      subtitle: 'Your choice',
      icon: Sparkles,
      description: 'Enter any specific subject or skill you want to learn.',
      isReady: true,
      isCustom: true,
    },
  ];

  const languages = [
    { id: 'en', label: 'English', sub: 'Clear, simple English' },
    { id: 'hinglish', label: 'Hinglish', sub: 'Hindi + English mix' },
    { id: 'hi', label: 'हिन्दी', sub: 'Hindi explanations' },
  ];

  const handleProceed = () => {
    const finalSubject = selectedTopic === 'custom-topic' && customTopicText.trim()
      ? customTopicText.trim()
      : selectedTopic;

    updateProfile({
      targetTrack: finalSubject,
      preferredLanguage: selectedLang,
    });

    updateUserLearningSelection({
      targetSubject: finalSubject,
      preferredLanguage: selectedLang,
    });

    router.push('/dashboard');
  };

  return (
    <div className="w-full max-w-4xl mx-auto px-4 py-12">
      <div className="text-center mb-8">
        <h1 className="font-serif font-bold text-3xl sm:text-4xl text-[#252820]">
          What do you want to learn?
        </h1>
        <p className="text-sm text-[#575A51] mt-2 max-w-md mx-auto">
          Choose a topic to begin turning theoretical knowledge into practical skills.
        </p>
      </div>

      <div className="space-y-6">
        {/* Step 1: Topic Selection */}
        <div>
          <label className="block font-semibold text-base text-[#252820] mb-3">
            1. Select a Topic
          </label>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3.5">
            {topics.map((t) => {
              const Icon = t.icon;
              const isSelected = selectedTopic === t.id;
              return (
                <div
                  key={t.id}
                  onClick={() => setSelectedTopic(t.id)}
                  className={`p-4 rounded-xl border transition-all cursor-pointer flex flex-col justify-between ${
                    isSelected
                      ? 'bg-[#E9DFC9] border-[#354B3A] shadow-sm ring-1 ring-[#354B3A]'
                      : 'bg-white border-[#D8CFC0] hover:bg-[#FDFBF7]'
                  }`}
                >
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <div className="w-8 h-8 rounded-lg bg-[#354B3A] text-white flex items-center justify-center">
                        <Icon className="w-4 h-4" />
                      </div>
                      {t.isReady ? (
                        <span className="text-[10px] bg-[#354B3A] text-white px-2 py-0.5 rounded font-medium">
                          Available Now
                        </span>
                      ) : (
                        <span className="text-[10px] bg-[#D8CFC0] text-[#575A51] px-2 py-0.5 rounded font-medium">
                          Preview
                        </span>
                      )}
                    </div>
                    <h3 className="font-serif font-bold text-base text-[#252820]">
                      {t.title}
                    </h3>
                    <p className="text-xs text-[#575A51] mt-1 leading-relaxed">
                      {t.description}
                    </p>
                  </div>

                  {isSelected && (
                    <div className="mt-3 flex items-center gap-1 text-xs font-semibold text-[#354B3A]">
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      <span>Selected</span>
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          {/* Custom Topic Input */}
          {selectedTopic === 'custom-topic' && (
            <div className="mt-3 p-4 rounded-xl bg-white border border-[#354B3A]">
              <label className="block text-xs font-semibold text-[#252820] mb-1">
                Enter your custom topic or subject:
              </label>
              <input
                type="text"
                value={customTopicText}
                onChange={(e) => setCustomTopicText(e.target.value)}
                placeholder="e.g. SQL Database Queries, Data Structures, Git"
                className="w-full px-3 py-2 border border-[#D8CFC0] rounded text-xs bg-[#FAF8F5] focus:bg-white focus:outline-none focus:border-[#354B3A]"
              />
            </div>
          )}
        </div>

        {/* Step 2: Difficulty & Language */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block font-semibold text-sm text-[#252820] mb-2">
              2. Your Level
            </label>
            <div className="flex gap-2">
              <button
                type="button"
                onClick={() => setDifficulty('beginner')}
                className={`flex-1 py-2.5 px-3 rounded-lg border text-xs font-medium cursor-pointer ${
                  difficulty === 'beginner'
                    ? 'bg-[#E9DFC9] border-[#354B3A] font-semibold text-[#252820]'
                    : 'bg-white border-[#D8CFC0] text-[#575A51]'
                }`}
              >
                Beginner (Start fresh)
              </button>
              <button
                type="button"
                onClick={() => setDifficulty('intermediate')}
                className={`flex-1 py-2.5 px-3 rounded-lg border text-xs font-medium cursor-pointer ${
                  difficulty === 'intermediate'
                    ? 'bg-[#E9DFC9] border-[#354B3A] font-semibold text-[#252820]'
                    : 'bg-white border-[#D8CFC0] text-[#575A51]'
                }`}
              >
                Intermediate
              </button>
            </div>
          </div>

          <div>
            <label className="block font-semibold text-sm text-[#252820] mb-2">
              3. Explanation Language
            </label>
            <div className="flex gap-2">
              {languages.map((l) => (
                <button
                  key={l.id}
                  type="button"
                  onClick={() => setSelectedLang(l.id as LanguagePreference)}
                  className={`flex-1 py-2.5 px-2 rounded-lg border text-xs font-medium cursor-pointer ${
                    selectedLang === l.id
                      ? 'bg-[#E9DFC9] border-[#354B3A] font-semibold text-[#252820]'
                      : 'bg-white border-[#D8CFC0] text-[#575A51]'
                  }`}
                >
                  <div>{l.label}</div>
                  <div className="text-[10px] text-[#7E8276]">{l.sub}</div>
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Action Button */}
        <div className="pt-6 border-t border-[#D8CFC0] flex items-center justify-between">
          <div className="text-xs text-[#575A51]">
            Topic chosen: <strong className="text-[#252820]">{selectedTopic === 'custom-topic' ? (customTopicText || 'Custom Topic') : 'Python'}</strong>
          </div>
          <button
            onClick={handleProceed}
            className="btn-primary text-xs py-2.5 px-6 shadow-sm"
          >
            <span>Start Learning</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
}
