// Acharya AI Contextual Socratic Mentor Drawer
'use client';

import React, { useState } from 'react';
import { useDronacharya } from '@/lib/store';
import { LanguagePreference, MentorMessage } from '@/types';
import { generateSocraticGuidance } from '@/lib/mentor/fallback-rules';
import {
  Sparkles,
  X,
  Send,
  HelpCircle,
  Lightbulb,
  Cpu,
  BookOpen,
  Languages,
} from 'lucide-react';

interface AcharyaDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  contextCode?: string;
  contextError?: string;
  activeMissionTitle?: string;
}

export function AcharyaDrawer({
  isOpen,
  onClose,
  contextCode = '',
  contextError = '',
  activeMissionTitle = 'The Labyrinth of Fibonacci',
}: AcharyaDrawerProps) {
  const { state, updateProfile } = useDronacharya();
  const [messages, setMessages] = useState<MentorMessage[]>([
    {
      id: 'init-msg',
      role: 'assistant',
      content:
        state.user.preferredLanguage === 'hi'
          ? 'प्रणाम शिष्य! मैं आचार्य एआई हूँ। मैं आपके संशय और कोड की समस्याओं में मार्गदर्शन करने के लिए उपस्थित हूँ। पूछें, आपका तर्क कहाँ अटक रहा है?'
          : state.user.preferredLanguage === 'hinglish'
          ? 'Pranam Shishya! Main Acharya AI hoon. Coding ya logic me jahan bhi doubt ho, bina hichkichaye pucho. Remember: Main answer spoonfeed nahi karunga, lekin tumhare concept ko solid banaunga!'
          : 'Greetings, scholar. I am Acharya AI. I am here to guide your inquiry without spoiling solutions. How may I illuminate your reasoning today?',
      language: state.user.preferredLanguage,
      timestamp: 'Just now',
      isFallback: true,
    },
  ]);
  const [input, setInput] = useState('');
  const [activeTier, setActiveTier] = useState<1 | 2 | 3 | 4>(1);
  const [isThinking, setIsThinking] = useState(false);

  if (!isOpen) return null;

  const handleLanguageToggle = (lang: LanguagePreference) => {
    updateProfile({ preferredLanguage: lang });
  };

  const handleSendPrompt = async (customPrompt?: string, tierOverride?: 1 | 2 | 3 | 4) => {
    const textToSend = customPrompt || input.trim();
    if (!textToSend && !tierOverride) return;

    const chosenTier = tierOverride || activeTier;
    const userMsg: MentorMessage = {
      id: `u-${Date.now()}`,
      role: 'user',
      content: textToSend || `[Requested Tier ${chosenTier} Socratic Hint]`,
      hintTier: chosenTier,
      language: state.user.preferredLanguage,
      timestamp: 'Just now',
    };

    setMessages((prev) => [...prev, userMsg]);
    setInput('');
    setIsThinking(true);

    // Call Socratic guidance engine
    setTimeout(() => {
      const guidance = generateSocraticGuidance({
        missionId: 'mission-fib-labyrinth',
        code: contextCode || 'def route_cost(n):\n    return route_cost(n - 1) + route_cost(n - 2)',
        errorLog: contextError || 'RecursionError: maximum recursion depth exceeded',
        hintTier: chosenTier,
        language: state.user.preferredLanguage,
      });

      const assistantMsg: MentorMessage = {
        id: `a-${Date.now()}`,
        role: 'assistant',
        content: guidance.message,
        socraticQuestion: guidance.socraticQuestion,
        hintTier: guidance.hintTier,
        language: state.user.preferredLanguage,
        timestamp: 'Just now',
        isFallback: true,
      };

      setMessages((prev) => [...prev, assistantMsg]);
      setIsThinking(false);
    }, 600);
  };

  return (
    <div className="fixed inset-0 z-50 flex justify-end">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-[#252820]/30 backdrop-blur-xs transition-opacity"
        onClick={onClose}
      />

      {/* Drawer Container */}
      <aside className="relative w-full max-w-md bg-[#F6F1E7] border-l border-[#D8CFC0] shadow-2xl flex flex-col h-full z-10 animate-in slide-in-from-right duration-200">
        {/* Drawer Header */}
        <div className="p-4 border-b border-[#D8CFC0] bg-[#E9DFC9]/50 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-full bg-[#B49A65] text-[#F6F1E7] flex items-center justify-center shadow-xs">
              <Sparkles className="w-4 h-4" />
            </div>
            <div>
              <h3 className="font-serif font-bold text-base text-[#252820] leading-none">
                Acharya AI
              </h3>
              <p className="text-[11px] text-[#7E8276] mt-0.5">Socratic Mentor • No Spoilers</p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {/* Language Switcher */}
            <div className="flex items-center rounded border border-[#D8CFC0] bg-[#F6F1E7] p-0.5 text-[11px]">
              <button
                onClick={() => handleLanguageToggle('en')}
                className={`px-1.5 py-0.5 rounded ${
                  state.user.preferredLanguage === 'en'
                    ? 'bg-[#354B3A] text-white font-medium'
                    : 'text-[#575A51]'
                }`}
              >
                EN
              </button>
              <button
                onClick={() => handleLanguageToggle('hinglish')}
                className={`px-1.5 py-0.5 rounded ${
                  state.user.preferredLanguage === 'hinglish'
                    ? 'bg-[#354B3A] text-white font-medium'
                    : 'text-[#575A51]'
                }`}
              >
                Hin-En
              </button>
              <button
                onClick={() => handleLanguageToggle('hi')}
                className={`px-1.5 py-0.5 rounded ${
                  state.user.preferredLanguage === 'hi'
                    ? 'bg-[#354B3A] text-white font-medium'
                    : 'text-[#575A51]'
                }`}
              >
                हिं
              </button>
            </div>

            <button
              onClick={onClose}
              className="p-1 rounded hover:bg-[#D8CFC0] text-[#575A51]"
              aria-label="Close Acharya Drawer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Active Context Banner */}
        <div className="px-4 py-2 bg-[#F0EAE1] border-b border-[#D8CFC0] text-xs text-[#575A51] flex items-center justify-between">
          <span className="truncate font-medium">Context: {activeMissionTitle}</span>
          <span className="text-[10px] text-[#A65F43] font-semibold uppercase tracking-wider">
            Socratic Protocol
          </span>
        </div>

        {/* 4-Tier Hint Selector Chips */}
        <div className="px-4 py-2.5 border-b border-[#D8CFC0] bg-[#FDFBF7]">
          <div className="text-[11px] font-semibold text-[#7E8276] uppercase tracking-wider mb-1.5">
            Select Guidance Tier:
          </div>
          <div className="grid grid-cols-4 gap-1 text-[11px]">
            <button
              onClick={() => {
                setActiveTier(1);
                handleSendPrompt('Nudge me in the right direction.', 1);
              }}
              className={`p-1.5 rounded text-center border transition-all ${
                activeTier === 1
                  ? 'bg-[#FAF4F0] border-[#A65F43] text-[#A65F43] font-semibold'
                  : 'bg-white border-[#D8CFC0] text-[#575A51] hover:bg-[#F6F1E7]'
              }`}
            >
              1. Nudge
            </button>
            <button
              onClick={() => {
                setActiveTier(2);
                handleSendPrompt('What structural pattern applies here?', 2);
              }}
              className={`p-1.5 rounded text-center border transition-all ${
                activeTier === 2
                  ? 'bg-[#FAF4F0] border-[#A65F43] text-[#A65F43] font-semibold'
                  : 'bg-white border-[#D8CFC0] text-[#575A51] hover:bg-[#F6F1E7]'
              }`}
            >
              2. Pattern
            </button>
            <button
              onClick={() => {
                setActiveTier(3);
                handleSendPrompt('Pinpoint where my logic breaks.', 3);
              }}
              className={`p-1.5 rounded text-center border transition-all ${
                activeTier === 3
                  ? 'bg-[#FAF4F0] border-[#A65F43] text-[#A65F43] font-semibold'
                  : 'bg-white border-[#D8CFC0] text-[#575A51] hover:bg-[#F6F1E7]'
              }`}
            >
              3. Pinpoint
            </button>
            <button
              onClick={() => {
                setActiveTier(4);
                handleSendPrompt('Show me a parallel analogy without solving my homework.', 4);
              }}
              className={`p-1.5 rounded text-center border transition-all ${
                activeTier === 4
                  ? 'bg-[#FAF4F0] border-[#A65F43] text-[#A65F43] font-semibold'
                  : 'bg-white border-[#D8CFC0] text-[#575A51] hover:bg-[#F6F1E7]'
              }`}
            >
              4. Analogy
            </button>
          </div>
        </div>

        {/* Message Thread */}
        <div className="flex-1 overflow-y-auto p-4 space-y-3.5">
          {messages.map((m) => (
            <div
              key={m.id}
              className={`flex flex-col ${m.role === 'user' ? 'items-end' : 'items-start'}`}
            >
              <div
                className={`max-w-[88%] rounded-lg p-3 text-xs leading-relaxed ${
                  m.role === 'user'
                    ? 'bg-[#354B3A] text-[#F6F1E7]'
                    : 'bg-[#FFFFFF] border border-[#D8CFC0] text-[#252820] shadow-2xs'
                }`}
              >
                {m.role === 'assistant' && (
                  <div className="flex items-center gap-1.5 text-[10px] text-[#B49A65] font-semibold uppercase tracking-wider mb-1">
                    <Sparkles className="w-3 h-3" />
                    Acharya Guidance • Tier {m.hintTier || 1}
                  </div>
                )}
                <p className="whitespace-pre-line">{m.content}</p>

                {m.socraticQuestion && (
                  <div className="mt-2.5 pt-2 border-t border-[#E9DFC9] text-[#A65F43] font-medium">
                    🤔 {m.socraticQuestion}
                  </div>
                )}
              </div>
              <span className="text-[10px] text-[#A6AC9B] mt-1 px-1">
                {m.isFallback ? 'Socratic Rulebook Engine' : 'Acharya Model'}
              </span>
            </div>
          ))}

          {isThinking && (
            <div className="flex items-center gap-2 text-xs text-[#7E8276] italic p-2">
              <Sparkles className="w-3.5 h-3.5 animate-spin text-[#B49A65]" />
              Acharya AI is contemplating your logic...
            </div>
          )}
        </div>

        {/* Prompt Input Form */}
        <div className="p-3 border-t border-[#D8CFC0] bg-[#FFFFFF]">
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSendPrompt();
            }}
            className="flex items-center gap-2"
          >
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Ask Acharya about your code or concept..."
              className="flex-1 text-xs px-3 py-2 border border-[#D8CFC0] rounded focus:outline-none focus:border-[#354B3A] bg-[#FDFBF7]"
            />
            <button
              type="submit"
              disabled={!input.trim()}
              className="p-2 rounded bg-[#354B3A] text-white disabled:opacity-40 hover:bg-[#2B3D2F] cursor-pointer"
              aria-label="Send Message to Acharya AI"
            >
              <Send className="w-4 h-4" />
            </button>
          </form>
        </div>
      </aside>
    </div>
  );
}
