// Student Onboarding: An Adventure Entry to Dronacharya
// Inspires students with an interactive mission preview and transparent track readiness
'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useDronacharya } from '@/lib/store';
import { updateUserLearningSelection, getActiveSession } from '@/lib/db/auth-db';
import { LanguagePreference } from '@/types';
import {
  ArrowRight,
  Terminal,
  Code2,
  Globe,
  Cpu,
  Sparkles,
  CheckCircle2,
  Play,
  RotateCcw,
  Zap,
  ShieldAlert,
  Compass,
} from 'lucide-react';

export default function OnboardingPage() {
  const router = useRouter();
  const { updateProfile } = useDronacharya();

  // State selections
  const [selectedTopic, setSelectedTopic] = useState('python-basics');
  const [customTopicText, setCustomTopicText] = useState('');
  const [selectedLang, setSelectedLang] = useState<LanguagePreference>('hinglish');
  const [difficulty, setDifficulty] = useState<'beginner' | 'intermediate'>('beginner');

  // Mini Interactive Preview State
  const [previewStep, setPreviewStep] = useState<number>(0);
  const [previewRunning, setPreviewRunning] = useState<boolean>(false);
  const [previewBattery, setPreviewBattery] = useState<number>(40);

  // Playable Learning Worlds / Mission Cards
  const worlds = [
    {
      id: 'python-basics',
      title: 'The Python Realm: Stranded Rover',
      badge: 'Playable Adventure',
      badgeColor: 'bg-[#354B3A] text-white',
      icon: Terminal,
      concept: 'Python Loops & Sequential Logic',
      description: 'Rescue an autonomous field rover by writing loops to process energy cells and navigate terrain.',
      isPlayable: true,
      readyText: 'Ready to Play',
    },
    {
      id: 'c-programming',
      title: 'The C Sanctuary: Memory Mazes',
      badge: 'Coming Soon',
      badgeColor: 'bg-[#D8CFC0] text-[#575A51]',
      icon: Code2,
      concept: 'Pointers & Dynamic Memory',
      description: 'Navigate memory pointers across hardware registers without buffer overruns.',
      isPlayable: false,
      readyText: 'Curriculum In Training',
    },
    {
      id: 'web-development',
      title: 'The Web Forge: Canvas Hacker',
      badge: 'Coming Soon',
      badgeColor: 'bg-[#D8CFC0] text-[#575A51]',
      icon: Globe,
      concept: 'DOM & Interactive Canvas',
      description: 'Craft dynamic interactive canvases and responsive visual logic using JavaScript.',
      isPlayable: false,
      readyText: 'Curriculum In Training',
    },
    {
      id: 'ai-basics',
      title: 'The AI Nexus: Machine Perception',
      badge: 'Coming Soon',
      badgeColor: 'bg-[#D8CFC0] text-[#575A51]',
      icon: Cpu,
      concept: 'Perceptrons & Decision Trees',
      description: 'Train decision boundaries to identify anomalies and calibrate autonomous guards.',
      isPlayable: false,
      readyText: 'Curriculum In Training',
    },
  ];

  const languages = [
    { id: 'en', label: 'English', sub: 'Standard technical terms' },
    { id: 'hinglish', label: 'Hinglish', sub: 'Hindi + English conversational mix' },
    { id: 'hi', label: 'हिन्दी', sub: 'Pure Hindi explanations' },
  ];

  // Run the mini interactive preview
  const handleRunMiniPreview = () => {
    if (previewRunning) return;
    setPreviewRunning(true);
    setPreviewStep(1);
    setPreviewBattery(75);

    setTimeout(() => {
      setPreviewStep(2);
      setTimeout(() => {
        setPreviewRunning(false);
      }, 700);
    }, 800);
  };

  const handleResetMiniPreview = () => {
    setPreviewStep(0);
    setPreviewBattery(40);
    setPreviewRunning(false);
  };

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

    // Check if user session exists, route to simulator or dashboard
    router.push('/simulator');
  };

  return (
    <div className="w-full max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      {/* Adventure Header */}
      <div className="text-center max-w-2xl mx-auto mb-10">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#E9DFC9] border border-[#B49A65] text-xs font-semibold text-[#7A6230] mb-3 shadow-2xs">
          <Compass className="w-3.5 h-3.5 text-[#B49A65]" />
          <span>The Digital Gurukul Gateway</span>
        </div>
        <h1 className="font-serif font-bold text-3xl sm:text-4xl text-[#252820] tracking-tight">
          Your adventure begins with code.
        </h1>
        <p className="text-sm text-[#575A51] mt-2.5 leading-relaxed">
          Enter the Gurukul, solve coding challenges, learn from your mistakes, and master each mission through real code execution.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* LEFT COLUMN: LEARNING WORLDS SELECTION */}
        <div className="lg:col-span-7 space-y-6">
          <div>
            <div className="flex items-center justify-between mb-3">
              <label className="font-semibold text-sm text-[#252820] uppercase tracking-wider flex items-center gap-2">
                <span>1. Choose Your Adventure World</span>
              </label>
              <span className="text-[11px] text-[#354B3A] font-semibold">
                Python Track Fully Playable
              </span>
            </div>

            {/* World Cards */}
            <div className="space-y-3">
              {worlds.map((w) => {
                const Icon = w.icon;
                const isSelected = selectedTopic === w.id;

                return (
                  <div
                    key={w.id}
                    onClick={() => {
                      if (w.isPlayable) {
                        setSelectedTopic(w.id);
                      }
                    }}
                    className={`p-4 rounded-xl border-2 transition-all flex items-start justify-between gap-4 ${
                      isSelected
                        ? 'bg-[#E9DFC9] border-[#354B3A] shadow-md ring-1 ring-[#354B3A]'
                        : w.isPlayable
                        ? 'bg-white border-[#D8CFC0] hover:border-[#354B3A]/60 cursor-pointer'
                        : 'bg-[#FAF8F5]/80 border-[#E2DDD5] opacity-75 cursor-not-allowed'
                    }`}
                  >
                    <div className="flex items-start gap-3.5">
                      <div
                        className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${
                          isSelected
                            ? 'bg-[#354B3A] text-white shadow-xs'
                            : 'bg-[#E9DFC9] text-[#354B3A]'
                        }`}
                      >
                        <Icon className="w-5 h-5" />
                      </div>

                      <div>
                        <div className="flex items-center gap-2">
                          <h3 className="font-serif font-bold text-base text-[#252820]">
                            {w.title}
                          </h3>
                        </div>

                        <div className="text-[11px] font-semibold text-[#A65F43] mt-0.5">
                          {w.concept}
                        </div>

                        <p className="text-xs text-[#575A51] mt-1 leading-relaxed">
                          {w.description}
                        </p>
                      </div>
                    </div>

                    <div className="flex flex-col items-end shrink-0 gap-2">
                      <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${w.badgeColor}`}>
                        {w.badge}
                      </span>
                      {isSelected && (
                        <span className="text-xs font-semibold text-[#354B3A] flex items-center gap-1">
                          <CheckCircle2 className="w-3.5 h-3.5" />
                          <span>Active</span>
                        </span>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Calibrate Level & Explanation Language */}
          <div className="p-4 rounded-xl bg-white border border-[#D8CFC0] shadow-2xs space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block font-semibold text-xs text-[#252820] mb-1.5 uppercase tracking-wider">
                  2. Your Experience Level
                </label>
                <div className="flex gap-2">
                  <button
                    type="button"
                    onClick={() => setDifficulty('beginner')}
                    className={`flex-1 py-2 px-2.5 rounded-lg border text-xs font-medium transition-all ${
                      difficulty === 'beginner'
                        ? 'bg-[#E9DFC9] border-[#354B3A] font-bold text-[#252820]'
                        : 'bg-[#FAF8F5] border-[#D8CFC0] text-[#575A51]'
                    }`}
                  >
                    Beginner (From Scratch)
                  </button>
                  <button
                    type="button"
                    onClick={() => setDifficulty('intermediate')}
                    className={`flex-1 py-2 px-2.5 rounded-lg border text-xs font-medium transition-all ${
                      difficulty === 'intermediate'
                        ? 'bg-[#E9DFC9] border-[#354B3A] font-bold text-[#252820]'
                        : 'bg-[#FAF8F5] border-[#D8CFC0] text-[#575A51]'
                    }`}
                  >
                    Intermediate
                  </button>
                </div>
              </div>

              <div>
                <label className="block font-semibold text-xs text-[#252820] mb-1.5 uppercase tracking-wider">
                  3. Acharya AI Language
                </label>
                <div className="flex gap-1.5">
                  {languages.map((l) => (
                    <button
                      key={l.id}
                      type="button"
                      onClick={() => setSelectedLang(l.id as LanguagePreference)}
                      className={`flex-1 py-2 px-1.5 rounded-lg border text-center transition-all ${
                        selectedLang === l.id
                          ? 'bg-[#E9DFC9] border-[#354B3A] font-bold text-[#252820]'
                          : 'bg-[#FAF8F5] border-[#D8CFC0] text-[#575A51]'
                      }`}
                    >
                      <div className="text-xs">{l.label}</div>
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* RIGHT COLUMN: INTERACTIVE HOW-A-MISSION-WORKS PREVIEW */}
        <div className="lg:col-span-5 space-y-5">
          <div className="bg-[#252820] text-[#F6F1E7] border-2 border-[#3A3E34] rounded-2xl p-5 shadow-xl">
            <div className="flex items-center justify-between border-b border-[#3A3E34] pb-3 mb-4">
              <div className="flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-[#B49A65]" />
                <span className="font-serif font-bold text-sm text-[#F6F1E7]">
                  Mission Preview: How You Learn
                </span>
              </div>
              <div className="flex items-center gap-1.5 text-[11px] text-[#A6AC9B]">
                <Zap className="w-3.5 h-3.5 text-[#B49A65]" />
                <span>Battery: {previewBattery}%</span>
              </div>
            </div>

            {/* Mini 3x3 Grid Map */}
            <div className="bg-[#1C1F18] p-3 rounded-xl border border-[#2F3429] mb-4">
              <div className="grid grid-cols-3 gap-2 aspect-square max-w-[200px] mx-auto">
                {/* 3x3 Grid Tiles */}
                <div className="relative rounded-lg bg-[#2A3026] border border-[#3A4234] flex items-center justify-center aspect-square">
                  {previewStep === 0 && <span className="text-xl animate-bounce">🤖</span>}
                  <span className="absolute top-0.5 left-1 text-[8px] text-[#7E8276]">0,0</span>
                </div>
                <div className="relative rounded-lg bg-[#2A3026] border border-[#3A4234] flex items-center justify-center aspect-square">
                  {previewStep === 1 && <span className="text-xl animate-bounce">🤖</span>}
                  {previewStep < 1 && <span className="text-lg animate-pulse">⚡</span>}
                  <span className="absolute top-0.5 left-1 text-[8px] text-[#7E8276]">1,0</span>
                </div>
                <div className="relative rounded-lg bg-[#2B3D2F] border-2 border-dashed border-[#B49A65] flex items-center justify-center aspect-square">
                  {previewStep === 2 ? <span className="text-xl animate-bounce">🤖</span> : <span className="text-lg">🏁</span>}
                  <span className="absolute top-0.5 left-1 text-[8px] text-[#7E8276]">2,0</span>
                </div>
              </div>
              <div className="text-center text-[10px] text-[#A6AC9B] mt-2">
                {previewStep === 0 && 'Rover is waiting at (0,0). Write code to move and collect energy!'}
                {previewStep === 1 && '⚡ Loop step 1 executed! Rover collected energy cell (+35%)!'}
                {previewStep === 2 && '🏁 Loop step 2 completed! Rover reached the Beacon safely!'}
              </div>
            </div>

            {/* Mini Code Snippet */}
            <div className="bg-[#171914] p-3 rounded-lg border border-[#2F3429] font-mono text-[11px] text-[#E9DFC9] leading-relaxed mb-4">
              <div className="text-[10px] text-[#7E8276] mb-1"># How your Python code moves the game:</div>
              <div>for step in range(2):</div>
              <div className="pl-4 text-[#68D391]">rover.step_forward()</div>
              <div className="pl-4 text-[#F6E05E]">rover.collect_energy()</div>
            </div>

            {/* Preview Action Buttons */}
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={handleRunMiniPreview}
                disabled={previewRunning || previewStep === 2}
                className="flex-1 btn-primary py-2 text-xs font-bold shadow-xs flex items-center justify-center gap-1.5 disabled:opacity-50"
              >
                <Play className="w-3.5 h-3.5" />
                <span>{previewRunning ? 'Executing Code...' : previewStep === 2 ? 'Mission Cleared!' : 'Run Sample Code'}</span>
              </button>
              <button
                type="button"
                onClick={handleResetMiniPreview}
                className="p-2 rounded bg-[#2A3026] text-[#A6AC9B] hover:text-white border border-[#3A4234]"
                title="Reset Preview"
              >
                <RotateCcw className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Action Card: Enter the Arena */}
          <div className="card-parchment p-5 border-2 border-[#354B3A]">
            <div className="flex items-center justify-between mb-2">
              <span className="text-[10px] text-[#A65F43] font-bold uppercase tracking-wider">
                Adventure Configured
              </span>
              <span className="text-xs font-bold text-[#354B3A]">
                Python Programming
              </span>
            </div>
            <p className="text-xs text-[#575A51] leading-relaxed mb-4">
              Your chosen world and language settings will customize your coding challenges, feedback, and interactive simulator.
            </p>

            <button
              onClick={handleProceed}
              className="w-full btn-primary py-3 text-sm font-bold shadow-md flex items-center justify-center gap-2 hover:scale-[1.01] active:scale-[0.99] transition-all cursor-pointer"
            >
              <span>Enter Mission Simulator</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
