// Student Onboarding: Career Track & Language Configuration
'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useDronacharya } from '@/lib/store';
import { LanguagePreference } from '@/types';
import {
  Compass,
  ArrowRight,
  Terminal,
  Cpu,
  Layers,
  Sparkles,
  CheckCircle2,
} from 'lucide-react';

export default function OnboardingPage() {
  const router = useRouter();
  const { state, updateProfile } = useDronacharya();

  const [selectedTrack, setSelectedTrack] = useState('python-algorithms');
  const [selectedLang, setSelectedLang] = useState<LanguagePreference>('hinglish');
  const [experienceLevel, setExperienceLevel] = useState('beginner');

  const tracks = [
    {
      id: 'python-algorithms',
      title: 'Python Computational Mastery',
      subtitle: 'Algorithms, Recursion & Data Structures',
      icon: Terminal,
      description: 'Ideal for engineering students preparing for technical interviews and building algorithmic intuition.',
    },
    {
      id: 'systems-architecture',
      title: 'Systems & Backend Architecture',
      subtitle: 'Caching, Concurrency & In-Memory Stores',
      icon: Layers,
      description: 'Master high-throughput systems design, LRU cache eviction, and thread-safe data pipelines.',
    },
    {
      id: 'ai-ml-studio',
      title: 'Applied AI & Machine Learning',
      subtitle: 'Tensors, Hyperparameters & Model Tuning',
      icon: Cpu,
      description: 'Gain practical intuition for gradient descent, learning rates, loss curves, and evaluation metrics.',
    },
  ];

  const languages = [
    { id: 'en', label: 'English', sub: 'Standard technical English' },
    { id: 'hinglish', label: 'Hinglish (Recommended)', sub: 'Natural Hindi-English code-switching' },
    { id: 'hi', label: 'हिन्दी (Devanagari)', sub: 'Complete Hindi explanations' },
  ];

  const handleProceed = () => {
    updateProfile({
      targetTrack: selectedTrack,
      preferredLanguage: selectedLang,
    });
    router.push('/diagnostic');
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-12">
      <div className="text-center mb-10">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#E9DFC9] border border-[#B49A65] text-xs font-semibold text-[#7A6230] mb-3">
          <Compass className="w-3.5 h-3.5 text-[#B49A65]" />
          <span>Step 1 of 2: Calibrate Your Gurukul Path</span>
        </div>
        <h1 className="font-serif font-bold text-3xl sm:text-4xl text-[#252820]">
          Configure Your Learning Focus
        </h1>
        <p className="text-sm text-[#575A51] mt-2 max-w-xl mx-auto">
          Dronacharya customizes your mission questline and Socratic mentor persona based on your career goals and language comfort.
        </p>
      </div>

      <div className="space-y-8">
        {/* Step 1: Track Selection */}
        <div>
          <label className="block font-serif font-bold text-lg text-[#252820] mb-3">
            1. Select Your Primary Learning Track
          </label>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {tracks.map((track) => {
              const Icon = track.icon;
              const isSelected = selectedTrack === track.id;
              return (
                <div
                  key={track.id}
                  onClick={() => setSelectedTrack(track.id)}
                  className={`p-5 rounded-lg border transition-all cursor-pointer flex flex-col justify-between ${
                    isSelected
                      ? 'bg-[#E9DFC9] border-[#354B3A] shadow-md ring-1 ring-[#354B3A]'
                      : 'bg-white border-[#D8CFC0] hover:bg-[#F6F1E7]'
                  }`}
                >
                  <div>
                    <div className="w-9 h-9 rounded bg-[#354B3A] text-white flex items-center justify-center mb-3">
                      <Icon className="w-5 h-5" />
                    </div>
                    <h3 className="font-serif font-bold text-base text-[#252820]">
                      {track.title}
                    </h3>
                    <p className="text-xs text-[#A65F43] font-semibold mt-0.5">
                      {track.subtitle}
                    </p>
                    <p className="text-xs text-[#575A51] mt-2 leading-relaxed">
                      {track.description}
                    </p>
                  </div>
                  {isSelected && (
                    <div className="mt-4 flex items-center gap-1.5 text-xs font-semibold text-[#354B3A]">
                      <CheckCircle2 className="w-4 h-4" />
                      <span>Selected Track</span>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* Step 2: Language Preference */}
        <div>
          <label className="block font-serif font-bold text-lg text-[#252820] mb-3">
            2. Choose Acharya AI’s Explanation Language
          </label>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            {languages.map((lang) => (
              <div
                key={lang.id}
                onClick={() => setSelectedLang(lang.id as LanguagePreference)}
                className={`p-4 rounded-lg border transition-all cursor-pointer ${
                  selectedLang === lang.id
                    ? 'bg-[#E9DFC9] border-[#354B3A] shadow-xs'
                    : 'bg-white border-[#D8CFC0] hover:bg-[#F6F1E7]'
                }`}
              >
                <div className="font-semibold text-sm text-[#252820]">{lang.label}</div>
                <div className="text-xs text-[#7E8276] mt-0.5">{lang.sub}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Action Button */}
        <div className="pt-6 border-t border-[#D8CFC0] flex items-center justify-between">
          <div className="text-xs text-[#575A51]">
            Next: <strong>3-Question Diagnostic Trial</strong> to calibrate difficulty.
          </div>
          <button
            onClick={handleProceed}
            className="btn-primary text-sm px-6 py-3 shadow-md"
          >
            <span>Proceed to Diagnostic Trial</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
}
