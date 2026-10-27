// Acharya AI Contextual Socratic Mentor Drawer
// Dynamic AI Engine supporting Live AST Code Analysis, Groq / Gemini / OpenAI LLM APIs,
// 3-Tier Socratic Pedagogy, and Proactive Error Diagnosis.
'use client';

import React, { useState, useEffect, useRef } from 'react';
import { useDronacharya } from '@/lib/store';
import { LanguagePreference } from '@/types';
import {
  queryAcharyaAI,
  getStoredAISettings,
  saveAISettings,
  AISettings,
  AcharyaRequestPayload,
} from '@/lib/mentor/acharya-engine';
import {
  Sparkles,
  X,
  Send,
  HelpCircle,
  Lightbulb,
  Cpu,
  BookOpen,
  Languages,
  Settings,
  AlertTriangle,
  Play,
  RotateCcw,
  CheckCircle2,
  Terminal,
  Compass,
  Code2,
  Key,
} from 'lucide-react';

export interface AcharyaDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  contextCode?: string;
  contextError?: string;
  activeMissionTitle?: string;
  missionGoal?: string;
  language?: 'python' | 'html' | 'css' | 'javascript';
  simulatorState?: {
    roverPos?: [number, number];
    targetPos?: [number, number];
    battery?: number;
    heartsLeft?: number;
    status?: 'crashed_obstacle' | 'syntax_error' | 'infinite_loop' | 'incomplete_goal' | 'battery_depleted' | 'success';
    lastCollisionCoord?: [number, number];
  };
  proactiveTrigger?: {
    type: 'collision' | 'error' | 'battery' | 'syntax';
    message: string;
    line?: number;
  } | null;
  onClearProactiveTrigger?: () => void;
}

interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  socraticQuestion?: string;
  hintTier?: 1 | 2 | 3;
  detectedLine?: number;
  timestamp: string;
  providerUsed?: string;
}

export function AcharyaDrawer({
  isOpen,
  onClose,
  contextCode = '',
  contextError = '',
  activeMissionTitle = 'Coding Quest',
  missionGoal = 'Reach the extraction beacon and write clean code',
  language = 'python',
  simulatorState,
  proactiveTrigger,
  onClearProactiveTrigger,
}: AcharyaDrawerProps) {
  const { state, updateProfile } = useDronacharya();
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState('');
  const [activeTier, setActiveTier] = useState<1 | 2 | 3>(1);
  const [isThinking, setIsThinking] = useState(false);
  const [showSettingsPopover, setShowSettingsPopover] = useState(false);
  const [aiSettings, setAiSettings] = useState<AISettings>({ provider: 'auto', apiKey: '' });
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Load AI Settings on mount
  useEffect(() => {
    setAiSettings(getStoredAISettings());
    const handleSettingsChange = () => setAiSettings(getStoredAISettings());
    window.addEventListener('dronacharya_ai_settings_changed', handleSettingsChange);
    return () => window.removeEventListener('dronacharya_ai_settings_changed', handleSettingsChange);
  }, []);

  // Determine current active line count and current line being inspected
  const codeLines = contextCode.split('\n');
  const activeLineCount = codeLines.length;
  const firstNonCommentLineIdx = codeLines.findIndex((l) => l.trim().length > 0 && !l.trim().startsWith('#'));
  const currentWatchedLine = proactiveTrigger?.line || (firstNonCommentLineIdx !== -1 ? firstNonCommentLineIdx + 1 : 1);

  // Auto-scroll chat to bottom
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isThinking]);

  // Initial welcome message if conversation is empty
  useEffect(() => {
    if (messages.length === 0) {
      setMessages([
        {
          id: 'init-msg',
          role: 'assistant',
          content:
            state.user.preferredLanguage === 'hi'
              ? 'प्रणाम शिष्य! मैं आचार्य एआई हूँ। मैं आपके लाइव कोड, कंसोल आउटपुट और सिमुलेटर को देख रहा हूँ। पूछें, आपका तर्क कहाँ अटक रहा है?'
              : state.user.preferredLanguage === 'hinglish'
              ? 'Pranam Shishya! Main Acharya AI hoon. Main tumhare live editor code aur simulator state ko real-time watch kar raha hoon. Jahan bhi confusion ho, pucho!'
              : 'Greetings, scholar. I am Acharya AI. I am actively observing your live code editor, runtime console, and simulator. How may I illuminate your reasoning without spoiling the solution?',
          socraticQuestion: 'What step is your mental model currently attempting to execute?',
          hintTier: 1,
          timestamp: 'Just now',
          providerUsed: 'Acharya Socratic Engine',
        },
      ]);
    }
  }, [state.user.preferredLanguage]);

  if (!isOpen) return null;

  const handleLanguageToggle = (lang: LanguagePreference) => {
    updateProfile({ preferredLanguage: lang });
  };

  const handleSaveSettings = (e: React.FormEvent) => {
    e.preventDefault();
    saveAISettings(aiSettings);
    setShowSettingsPopover(false);
  };

  // Main Socratic Query Handler
  const handleQuery = async (
    promptText: string,
    actionType: 'diagnose' | 'explain_error' | 'next_hint' | 'check_logic' | 'chat' = 'chat',
    tierOverride?: 1 | 2 | 3
  ) => {
    const chosenTier = tierOverride || activeTier;

    const userMsg: ChatMessage = {
      id: `u-${Date.now()}`,
      role: 'user',
      content: promptText,
      hintTier: chosenTier,
      timestamp: 'Just now',
    };

    setMessages((prev) => [...prev, userMsg]);
    setInput('');
    setIsThinking(true);

    if (onClearProactiveTrigger) onClearProactiveTrigger();

    try {
      const payload: AcharyaRequestPayload = {
        missionTitle: activeMissionTitle,
        missionGoal,
        studentCode: contextCode,
        consoleOutputOrError: contextError,
        simulatorState,
        hintTier: chosenTier,
        studentMessage: promptText,
        actionType,
        language,
        preferredLanguage: (state.user.preferredLanguage as 'en' | 'hinglish' | 'hi') || 'en',
        conversationHistory: messages.slice(-4).map((m) => ({
          role: m.role,
          content: m.content,
        })),
      };

      const response = await queryAcharyaAI(payload);

      const assistantMsg: ChatMessage = {
        id: `a-${Date.now()}`,
        role: 'assistant',
        content: response.message,
        socraticQuestion: response.socraticQuestion,
        hintTier: response.hintTier,
        detectedLine: response.detectedLine,
        timestamp: 'Just now',
        providerUsed: response.providerUsed,
      };

      setMessages((prev) => [...prev, assistantMsg]);
    } catch (err) {
      console.error('Failed to get Acharya response:', err);
    } finally {
      setIsThinking(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex justify-end">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-[#090A0F]/50 backdrop-blur-xs transition-opacity"
        onClick={onClose}
      />

      {/* Drawer Container */}
      <aside className="relative w-full max-w-lg bg-[#FAF6EE] border-l-2 border-[#1E1E24] shadow-[8px_0px_0px_#1E1E24] flex flex-col h-full z-10 animate-in slide-in-from-right duration-200">
        {/* =========================================================================
            HEADER: Brand, Live Telemetry Pill, Settings & Close
           ========================================================================= */}
        <div className="p-3.5 border-b-2 border-[#1E1E24] bg-[#EDE9FE]/70 flex items-center justify-between gap-3">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-[#6C5CE7] text-[#FFD214] border-2 border-[#1E1E24] flex items-center justify-center shadow-[2px_2px_0px_#1E1E24] shrink-0">
              <Sparkles className="w-5 h-5 fill-current" />
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <h3 className="font-serif font-black text-sm text-[#1E1E24] leading-none">
                  Acharya AI
                </h3>
                <span className="text-[9px] font-black uppercase text-[#6C5CE7] bg-[#EDE9FE] px-1.5 py-0.2 rounded border border-[#6C5CE7]/30">
                  Socratic Guru
                </span>
              </div>
              <p className="text-[10px] text-[#4A4A58] font-bold mt-0.5">
                Zero-Spoilers • Real-Time Code Telemetry
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {/* Language Switcher */}
            <div className="flex items-center rounded-lg border-2 border-[#1E1E24] bg-white p-0.5 text-[10px] font-black shadow-[1px_1px_0px_#1E1E24]">
              <button
                onClick={() => handleLanguageToggle('en')}
                className={`px-1.5 py-0.5 rounded ${
                  state.user.preferredLanguage === 'en'
                    ? 'bg-[#6C5CE7] text-white'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                EN
              </button>
              <button
                onClick={() => handleLanguageToggle('hinglish')}
                className={`px-1.5 py-0.5 rounded ${
                  state.user.preferredLanguage === 'hinglish'
                    ? 'bg-[#6C5CE7] text-white'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                Hinglish
              </button>
              <button
                onClick={() => handleLanguageToggle('hi')}
                className={`px-1.5 py-0.5 rounded ${
                  state.user.preferredLanguage === 'hi'
                    ? 'bg-[#6C5CE7] text-white'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                हिन्दी
              </button>
            </div>

            {/* AI Settings Popover Trigger */}
            <button
              onClick={() => setShowSettingsPopover(!showSettingsPopover)}
              className="p-1.5 rounded-lg border-2 border-[#1E1E24] bg-white hover:bg-slate-100 text-[#1E1E24] shadow-[1.5px_1.5px_0px_#1E1E24] cursor-pointer"
              title="Configure AI Provider & API Keys"
              aria-label="AI Settings"
            >
              <Settings className="w-3.5 h-3.5" />
            </button>

            {/* Close Drawer Button */}
            <button
              onClick={onClose}
              className="p-1.5 rounded-lg border-2 border-[#1E1E24] bg-white hover:bg-rose-100 text-[#1E1E24] shadow-[1.5px_1.5px_0px_#1E1E24] cursor-pointer"
              aria-label="Close Acharya Drawer"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* =========================================================================
            LIVE TELEMETRY STATUS PILL
           ========================================================================= */}
        <div className="px-4 py-2 bg-[#1E1E24] text-white text-[11px] font-mono flex items-center justify-between gap-2 border-b-2 border-[#1E1E24]">
          <div className="flex items-center gap-2 truncate">
            <span className="w-2 h-2 rounded-full bg-[#10B981] animate-ping" />
            <span className="text-[#55EFC4] font-bold">Watching:</span>
            <span className="text-gray-300 truncate">
              Line [{currentWatchedLine}] • {language.toUpperCase()} • Pyodide Runtime
            </span>
          </div>
          <span className="text-[10px] text-[#FBBF24] font-black uppercase tracking-wider shrink-0 bg-[#FBBF24]/20 px-2 py-0.5 rounded border border-[#FBBF24]/30">
            {aiSettings.provider === 'local' ? 'Offline AST' : aiSettings.provider.toUpperCase()}
          </span>
        </div>

        {/* =========================================================================
            SETTINGS POPOVER (MODAL DIALOG)
           ========================================================================= */}
        {showSettingsPopover && (
          <div className="p-4 bg-white border-b-2 border-[#1E1E24] shadow-[0px_4px_0px_#1E1E24] space-y-3 animate-in fade-in duration-150">
            <div className="flex items-center justify-between border-b pb-2">
              <div className="flex items-center gap-1.5 text-xs font-black text-[#1E1E24]">
                <Key className="w-4 h-4 text-[#6C5CE7]" />
                <span>Acharya AI Model & API Configuration</span>
              </div>
              <button
                onClick={() => setShowSettingsPopover(false)}
                className="text-xs text-slate-500 hover:text-slate-900 font-bold"
              >
                ✕ Close
              </button>
            </div>

            <form onSubmit={handleSaveSettings} className="space-y-3 text-xs">
              <div>
                <label className="block text-[11px] font-black text-[#1E1E24] mb-1">
                  Active Intelligence Engine
                </label>
                <select
                  value={aiSettings.provider}
                  onChange={(e) => setAiSettings({ ...aiSettings, provider: e.target.value as any })}
                  className="w-full px-2.5 py-1.5 border-2 border-[#1E1E24] rounded-lg text-xs font-bold bg-[#FAF6EE]"
                >
                  <option value="auto">Auto (Gemini / Groq / Fallback)</option>
                  <option value="groq">Groq (Llama 3.3 70B • Blazing Fast)</option>
                  <option value="gemini">Google Gemini 1.5 Flash</option>
                  <option value="openai">OpenAI (GPT-4o mini)</option>
                  <option value="local">Offline Deep Code AST Inspector (Zero Key)</option>
                </select>
              </div>

              <div>
                <label className="block text-[11px] font-black text-[#1E1E24] mb-1 flex items-center justify-between">
                  <span>Custom API Key (Optional)</span>
                  <span className="text-[10px] text-gray-500 font-normal">Saved in your browser</span>
                </label>
                <input
                  type="password"
                  value={aiSettings.apiKey}
                  onChange={(e) => setAiSettings({ ...aiSettings, apiKey: e.target.value })}
                  placeholder="gsk_... or AIzaSy... or sk-..."
                  className="w-full px-2.5 py-1.5 border-2 border-[#1E1E24] rounded-lg font-mono text-xs bg-[#FAF6EE]"
                />
              </div>

              <div className="flex items-center justify-between pt-1">
                <span className="text-[10px] text-slate-500">
                  {aiSettings.apiKey ? '● Custom Key Enabled' : '○ Using Built-in Server Keys / AST'}
                </span>
                <button
                  type="submit"
                  className="btn-arcade btn-arcade-purple text-[11px] py-1 px-3 shadow-[1px_1px_0px_#1E1E24]"
                >
                  Save AI Settings
                </button>
              </div>
            </form>
          </div>
        )}

        {/* =========================================================================
            PROACTIVE MENTOR ALERT BANNER (Auto-triggers on Bug / Collision)
           ========================================================================= */}
        {proactiveTrigger && (
          <div className="m-3 p-3 rounded-xl bg-amber-50 border-2 border-[#F59E0B] shadow-[3px_3px_0px_#B45309] space-y-2 animate-in slide-in-from-top-2 duration-200">
            <div className="flex items-start gap-2">
              <AlertTriangle className="w-4 h-4 text-[#D97706] shrink-0 mt-0.5 animate-bounce" />
              <div className="flex-1">
                <div className="text-[11px] font-black uppercase text-[#B45309]">
                  ⚡ Proactive Diagnostic Detected
                </div>
                <p className="text-xs font-bold text-[#1E1E24] mt-0.5">
                  {proactiveTrigger.message}
                </p>
              </div>
            </div>

            <div className="flex items-center justify-end gap-2 pt-1 border-t border-amber-200">
              <button
                onClick={() =>
                  handleQuery(
                    `I hit an issue: "${proactiveTrigger.message}". Please guide me with a Socratic question on Line ${proactiveTrigger.line || currentWatchedLine}.`,
                    'explain_error',
                    1
                  )
                }
                className="btn-arcade btn-arcade-yellow text-[10px] py-1 px-3 flex items-center gap-1 cursor-pointer"
              >
                <span>🔍 Debug Together</span>
              </button>
            </div>
          </div>
        )}

        {/* =========================================================================
            CONTEXT-AWARE ACTION CHIPS (4 Quick Socratic Triggers)
           ========================================================================= */}
        <div className="p-3 border-b-2 border-[#1E1E24] bg-white space-y-1.5">
          <div className="flex items-center justify-between text-[10px] font-black uppercase tracking-wider text-[#4A4A58]">
            <span>Contextual Actions</span>
            <span>Tier {activeTier} Mode</span>
          </div>

          <div className="grid grid-cols-2 gap-2 text-xs">
            <button
              onClick={() =>
                handleQuery(
                  'Diagnose my current code line-by-line against the mission goal.',
                  'diagnose',
                  1
                )
              }
              disabled={isThinking}
              className="p-2 rounded-xl border-2 border-[#1E1E24] bg-[#EDE9FE] hover:bg-[#DDD6FE] text-[#1E1E24] font-black text-left flex items-center gap-1.5 shadow-[2px_2px_0px_#1E1E24] cursor-pointer transition-all active:translate-y-0.5"
            >
              <Code2 className="w-3.5 h-3.5 text-[#6C5CE7] shrink-0" />
              <span className="truncate">🔍 Diagnose Code</span>
            </button>

            <button
              onClick={() =>
                handleQuery(
                  `Explain my last error or simulator state: "${contextError || 'Incomplete goal'}"`,
                  'explain_error',
                  2
                )
              }
              disabled={isThinking}
              className="p-2 rounded-xl border-2 border-[#1E1E24] bg-[#FEF3C7] hover:bg-[#FDE68A] text-[#1E1E24] font-black text-left flex items-center gap-1.5 shadow-[2px_2px_0px_#1E1E24] cursor-pointer transition-all active:translate-y-0.5"
            >
              <AlertTriangle className="w-3.5 h-3.5 text-[#D97706] shrink-0" />
              <span className="truncate">⚠️ Explain Error</span>
            </button>

            <button
              onClick={() => {
                const nextTier = activeTier === 1 ? 2 : activeTier === 2 ? 3 : 1;
                setActiveTier(nextTier);
                handleQuery(
                  `Escalate to Tier ${nextTier} hint: ${nextTier === 1 ? 'Socratic Probe' : nextTier === 2 ? 'Conceptual Compass' : 'Masked Blueprint'}`,
                  'next_hint',
                  nextTier
                );
              }}
              disabled={isThinking}
              className="p-2 rounded-xl border-2 border-[#1E1E24] bg-white hover:bg-slate-50 text-[#1E1E24] font-black text-left flex items-center gap-1.5 shadow-[2px_2px_0px_#1E1E24] cursor-pointer transition-all active:translate-y-0.5"
            >
              <Compass className="w-3.5 h-3.5 text-[#00B894] shrink-0" />
              <span className="truncate">🧭 Next Hint (Tier {activeTier}→{activeTier === 3 ? 1 : activeTier + 1})</span>
            </button>

            <button
              onClick={() =>
                handleQuery(
                  'Dry-run my logic mentally: what edge cases or boundary conditions should I consider before running?',
                  'check_logic',
                  1
                )
              }
              disabled={isThinking}
              className="p-2 rounded-xl border-2 border-[#1E1E24] bg-[#E0F2FE] hover:bg-[#BAE6FD] text-[#1E1E24] font-black text-left flex items-center gap-1.5 shadow-[2px_2px_0px_#1E1E24] cursor-pointer transition-all active:translate-y-0.5"
            >
              <Lightbulb className="w-3.5 h-3.5 text-[#0284C7] shrink-0" />
              <span className="truncate">🧪 Check Logic</span>
            </button>
          </div>
        </div>

        {/* =========================================================================
            MESSAGE THREAD
           ========================================================================= */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {messages.map((m, idx) => (
            <div
              key={m.id}
              className={`flex flex-col ${m.role === 'user' ? 'items-end' : 'items-start'}`}
            >
              <div
                className={`max-w-[90%] rounded-2xl p-4 text-xs leading-relaxed border-2 border-[#1E1E24] shadow-[3px_3px_0px_#1E1E24] ${
                  m.role === 'user'
                    ? 'bg-[#1E1E24] text-white'
                    : 'bg-white text-[#1E1E24]'
                }`}
              >
                {m.role === 'assistant' && (
                  <div className="flex items-center justify-between text-[10px] text-[#6C5CE7] font-black uppercase tracking-wider mb-2 border-b border-slate-100 pb-1.5">
                    <span className="flex items-center gap-1">
                      <Sparkles className="w-3 h-3 text-[#FFD214] fill-current" />
                      Acharya • Tier {m.hintTier || 1}
                      {m.detectedLine ? ` (Line ${m.detectedLine})` : ''}
                    </span>
                    <span className="text-gray-400 font-mono text-[9px] lowercase">
                      {m.providerUsed || 'Socratic Engine'}
                    </span>
                  </div>
                )}

                <FormattedMessageContent
                  content={m.content}
                  isLatestAssistant={m.role === 'assistant' && idx === messages.length - 1}
                  isUser={m.role === 'user'}
                />

                {m.socraticQuestion && (
                  <div className="mt-3 p-2.5 rounded-xl bg-[#EDE9FE] border border-[#6C5CE7]/30 text-[#4C1D95] font-bold flex items-start gap-2">
                    <span className="text-base leading-none">🤔</span>
                    <span>{m.socraticQuestion}</span>
                  </div>
                )}
              </div>

              <span className="text-[9px] text-[#71717A] mt-1 px-1 font-mono">
                {m.timestamp}
              </span>
            </div>
          ))}

          {isThinking && (
            <div className="flex items-center gap-2 p-3 bg-white rounded-xl border-2 border-[#1E1E24] text-xs font-bold text-[#6C5CE7] shadow-[2px_2px_0px_#1E1E24] w-fit animate-pulse">
              <Sparkles className="w-4 h-4 text-[#FFD214] animate-spin" />
              <span>Acharya is contemplating your live code &amp; logic...</span>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* =========================================================================
            PROMPT INPUT FORM
           ========================================================================= */}
        <div className="p-3 border-t-2 border-[#1E1E24] bg-white">
          <form
            onSubmit={(e) => {
              e.preventDefault();
              if (input.trim() && !isThinking) {
                handleQuery(input.trim(), 'chat');
              }
            }}
            className="flex items-center gap-2"
          >
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Ask Acharya anything about your code or why it failed..."
              className="flex-1 text-xs px-3.5 py-2.5 border-2 border-[#1E1E24] rounded-xl font-bold bg-[#FAF6EE] text-[#1E1E24] focus:outline-none focus:border-[#6C5CE7] shadow-[2px_2px_0px_#1E1E24]"
              disabled={isThinking}
            />
            <button
              type="submit"
              disabled={!input.trim() || isThinking}
              className="btn-arcade btn-arcade-purple p-2.5 text-xs flex items-center justify-center shrink-0 disabled:opacity-40 cursor-pointer"
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

function FormattedMessageContent({
  content,
  isLatestAssistant,
  isUser,
}: {
  content: string;
  isLatestAssistant?: boolean;
  isUser?: boolean;
}) {
  const [displayedLength, setDisplayedLength] = useState(
    isLatestAssistant ? 0 : content.length
  );

  useEffect(() => {
    if (!isLatestAssistant) {
      setDisplayedLength(content.length);
      return;
    }

    setDisplayedLength(0);
    let current = 0;
    const step = Math.max(2, Math.floor(content.length / 40));
    const interval = setInterval(() => {
      current += step;
      if (current >= content.length) {
        setDisplayedLength(content.length);
        clearInterval(interval);
      } else {
        setDisplayedLength(current);
      }
    }, 20);

    return () => clearInterval(interval);
  }, [content, isLatestAssistant]);

  const textToRender = content.slice(0, displayedLength);
  const isTyping = isLatestAssistant && displayedLength < content.length;

  // Split markdown blocks ```lang ... ```
  const parts = textToRender.split(/(```[\s\S]*?```)/g);

  return (
    <div
      className="space-y-2 leading-relaxed"
      onClick={() => isTyping && setDisplayedLength(content.length)}
    >
      {parts.map((part, pIdx) => {
        if (part.startsWith('```') && part.endsWith('```')) {
          const raw = part.slice(3, -3);
          const lines = raw.split('\n');
          const firstLine = lines[0].trim();
          const hasLang = /^[a-zA-Z0-9_-]+$/.test(firstLine);
          const lang = hasLang ? firstLine : '';
          const codeBody = hasLang ? lines.slice(1).join('\n') : raw;

          return (
            <div
              key={pIdx}
              className="my-2.5 rounded-xl bg-[#1E1E24] text-[#FAF6EE] border-2 border-[#1E1E24] overflow-hidden shadow-[2px_2px_0px_#1E1E24]"
            >
              <div className="px-3 py-1.5 bg-[#12131C] border-b border-gray-700 flex items-center justify-between text-[10px] font-mono font-bold text-gray-400">
                <span className="uppercase text-[#FFD214] font-black">{lang || 'CODE'}</span>
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    navigator.clipboard.writeText(codeBody.trim());
                  }}
                  className="hover:text-white transition-colors cursor-pointer"
                >
                  Copy
                </button>
              </div>
              <pre className="p-3 font-mono text-[11px] overflow-x-auto whitespace-pre leading-relaxed text-[#A29BFE]">
                <code>{codeBody}</code>
              </pre>
            </div>
          );
        }

        return (
          <div key={pIdx} className="whitespace-pre-line font-medium">
            {renderInlineMarkdown(part, isUser)}
            {isTyping && pIdx === parts.length - 1 && (
              <span className="inline-block w-1.5 h-3 ml-0.5 bg-[#6C5CE7] animate-pulse align-middle" />
            )}
          </div>
        );
      })}
    </div>
  );
}

function renderInlineMarkdown(text: string, isUser?: boolean) {
  const segments = text.split(/(`[^`]+`|\*\*[^*]+\*\*)/g);
  return segments.map((seg, i) => {
    if (seg.startsWith('`') && seg.endsWith('`')) {
      return (
        <code
          key={i}
          className={`px-1.5 py-0.5 mx-0.5 rounded font-mono text-[11px] font-bold border ${
            isUser
              ? 'bg-gray-800 text-[#FFD214] border-gray-700'
              : 'bg-[#EDE9FE] text-[#4C1D95] border-[#6C5CE7]/30'
          }`}
        >
          {seg.slice(1, -1)}
        </code>
      );
    }
    if (seg.startsWith('**') && seg.endsWith('**')) {
      return (
        <strong
          key={i}
          className={`font-black ${isUser ? 'text-[#FFD214]' : 'text-[#1E1E24]'}`}
        >
          {seg.slice(2, -2)}
        </strong>
      );
    }
    return seg;
  });
}
