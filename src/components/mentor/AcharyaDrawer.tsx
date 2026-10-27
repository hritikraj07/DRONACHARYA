// Acharya AI Context-Aware Live Mentor Drawer
// Powered by Google Gemini 2.5 Flash SDK (@google/genai)
// Automatically captures active problem statement, student code, console errors, and produces exact working solutions.
'use client';

import React, { useState, useEffect, useRef } from 'react';
import { useDronacharya } from '@/lib/store';
import { LanguagePreference } from '@/types';
import {
  askMentorAI,
  getStoredAISettings,
  saveAISettings,
  AISettings,
  MentorHistoryItem,
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
  Copy,
  Check,
  AlertCircle,
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
  testResults?: Array<{ description: string; passed: boolean; expected?: string }>;
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
  timestamp: string;
  isError?: boolean;
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
  testResults,
  proactiveTrigger,
  onClearProactiveTrigger,
}: AcharyaDrawerProps) {
  const { state, updateProfile } = useDronacharya();
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState('');
  const [isThinking, setIsThinking] = useState(false);
  const [showSettingsPopover, setShowSettingsPopover] = useState(false);
  const [aiSettings, setAiSettings] = useState<AISettings>({ provider: 'gemini', apiKey: '' });
  const [apiErrorMessage, setApiErrorMessage] = useState<string | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Load AI Settings on mount
  useEffect(() => {
    setAiSettings(getStoredAISettings());
    const handleSettingsChange = () => setAiSettings(getStoredAISettings());
    window.addEventListener('dronacharya_ai_settings_changed', handleSettingsChange);
    return () => window.removeEventListener('dronacharya_ai_settings_changed', handleSettingsChange);
  }, []);

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
              ? `प्रणाम! मैं आचार्य एआई हूँ, आपका लाइव मेंटॉर। मैं आपकी सक्रिय समस्या "${activeMissionTitle}" और आपके कोड को देख रहा हूँ। पूछें, मैं सीधे समाधान के साथ आपकी मदद करूँगा।`
              : state.user.preferredLanguage === 'hinglish'
              ? `Pranam! Main Acharya AI hoon, tumhara context-aware AI mentor. Main tumhare active problem "${activeMissionTitle}", code aur errors ko live monitor kar raha hoon. Jahan bhi phas rahe ho pucho, main exact working solution provide karunga!`
              : `Greetings! I am Acharya AI, your context-aware mentor powered by Gemini 2.5 Flash. I am actively inspecting "${activeMissionTitle}", your live code editor, and runtime errors. Ask me anything to get direct, working solutions tailored to this problem.`,
          timestamp: 'Just now',
        },
      ]);
    }
  }, [activeMissionTitle, state.user.preferredLanguage]);

  if (!isOpen) return null;

  const handleLanguageToggle = (lang: LanguagePreference) => {
    updateProfile({ preferredLanguage: lang });
  };

  const handleSaveSettings = (e: React.FormEvent) => {
    e.preventDefault();
    saveAISettings(aiSettings);
    setShowSettingsPopover(false);
    setApiErrorMessage(null);
  };

  // Main Context-Aware Ask Handler
  const handleAskMentor = async (userQuestion: string) => {
    if (!userQuestion.trim() || isThinking) return;

    const userMsg: ChatMessage = {
      id: `u-${Date.now()}`,
      role: 'user',
      content: userQuestion,
      timestamp: 'Just now',
    };

    setMessages((prev) => [...prev, userMsg]);
    setInput('');
    setIsThinking(true);
    setApiErrorMessage(null);

    if (onClearProactiveTrigger) onClearProactiveTrigger();

    // Map conversation history
    const historyPayload: MentorHistoryItem[] = messages.slice(-8).map((m) => ({
      role: m.role,
      content: m.content,
    }));

    try {
      const res = await askMentorAI({
        message: userQuestion,
        history: historyPayload,
        context: {
          missionTitle: activeMissionTitle,
          problemStatement: missionGoal,
          code: contextCode,
          language,
          errorLog: contextError,
          simulationState: simulatorState,
          testResults,
        },
      });

      if (res.success && res.reply) {
        const assistantMsg: ChatMessage = {
          id: `a-${Date.now()}`,
          role: 'assistant',
          content: res.reply,
          timestamp: 'Just now',
        };
        setMessages((prev) => [...prev, assistantMsg]);
      } else {
        const errorText = res.error || 'Failed to generate solution. Please check your Gemini API key.';
        setApiErrorMessage(errorText);
        setMessages((prev) => [
          ...prev,
          {
            id: `err-${Date.now()}`,
            role: 'assistant',
            content: `⚠️ ${errorText}`,
            timestamp: 'Just now',
            isError: true,
          },
        ]);
      }
    } catch (err: any) {
      const netError = 'Network communication error: Unable to reach /api/mentor/ask endpoint.';
      setApiErrorMessage(netError);
      setMessages((prev) => [
        ...prev,
        {
          id: `err-${Date.now()}`,
          role: 'assistant',
          content: `⚠️ ${netError}`,
          timestamp: 'Just now',
          isError: true,
        },
      ]);
    } finally {
      setIsThinking(false);
    }
  };

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
            HEADER: Brand, Gemini 2.5 Flash Telemetry Pill, Settings & Close
           ========================================================================= */}
        <div className="p-3.5 border-b-2 border-[#1E1E24] bg-[#EDE9FE]/70 flex items-center justify-between gap-3">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-[#6C5CE7] text-[#FFD214] border-2 border-[#1E1E24] flex items-center justify-center shadow-[2px_2px_0px_#1E1E24] shrink-0">
              <Sparkles className="w-5 h-5 fill-current" />
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <h3 className="font-serif font-black text-sm text-[#1E1E24] leading-none">
                  Acharya AI Mentor
                </h3>
                <span className="text-[9px] font-black uppercase text-[#6C5CE7] bg-[#EDE9FE] px-1.5 py-0.5 rounded border border-[#6C5CE7]/30">
                  Gemini 2.5 Flash
                </span>
              </div>
              <p className="text-[10px] text-[#4A4A58] font-bold mt-0.5">
                Context-Aware • Exact Problem Solutions
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {/* Language Switcher */}
            <div className="flex items-center rounded-lg border-2 border-[#1E1E24] bg-white p-0.5 text-[10px] font-black shadow-[1px_1px_0px_#1E1E24]">
              <button
                onClick={() => handleLanguageToggle('en')}
                className={`px-1.5 py-0.5 rounded cursor-pointer ${
                  state.user.preferredLanguage === 'en'
                    ? 'bg-[#6C5CE7] text-white'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                EN
              </button>
              <button
                onClick={() => handleLanguageToggle('hinglish')}
                className={`px-1.5 py-0.5 rounded cursor-pointer ${
                  state.user.preferredLanguage === 'hinglish'
                    ? 'bg-[#6C5CE7] text-white'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                Hinglish
              </button>
            </div>

            {/* AI Settings Trigger */}
            <button
              onClick={() => setShowSettingsPopover(!showSettingsPopover)}
              className="p-1.5 rounded-lg border-2 border-[#1E1E24] bg-white hover:bg-slate-100 text-[#1E1E24] shadow-[1.5px_1.5px_0px_#1E1E24] cursor-pointer"
              title="Configure Gemini API Key"
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
            LIVE WORKSPACE CONTEXT TELEMETRY BAR
           ========================================================================= */}
        <div className="px-4 py-2 bg-[#1E1E24] text-white text-[11px] font-mono flex items-center justify-between gap-2 border-b-2 border-[#1E1E24]">
          <div className="flex items-center gap-2 truncate">
            <span className="w-2 h-2 rounded-full bg-[#10B981] animate-ping" />
            <span className="text-[#55EFC4] font-bold">Observing:</span>
            <span className="text-gray-300 truncate font-semibold">
              {activeMissionTitle} • {language.toUpperCase()}
            </span>
          </div>
          <span className="text-[10px] text-[#FBBF24] font-black uppercase tracking-wider shrink-0 bg-[#FBBF24]/20 px-2 py-0.5 rounded border border-[#FBBF24]/30">
            Real LLM Active
          </span>
        </div>

        {/* =========================================================================
            SETTINGS POPOVER (MODAL FOR CUSTOM GEMINI API KEY)
           ========================================================================= */}
        {showSettingsPopover && (
          <div className="p-4 bg-white border-b-2 border-[#1E1E24] shadow-[0px_4px_0px_#1E1E24] space-y-3 animate-in fade-in duration-150">
            <div className="flex items-center justify-between border-b pb-2">
              <div className="flex items-center gap-1.5 text-xs font-black text-[#1E1E24]">
                <Key className="w-4 h-4 text-[#6C5CE7]" />
                <span>Google Gemini API Configuration</span>
              </div>
              <button
                onClick={() => setShowSettingsPopover(false)}
                className="text-xs text-slate-500 hover:text-slate-900 font-bold cursor-pointer"
              >
                ✕ Close
              </button>
            </div>

            <form onSubmit={handleSaveSettings} className="space-y-3 text-xs">
              <div>
                <label className="block text-[11px] font-black text-[#1E1E24] mb-1 flex items-center justify-between">
                  <span>Gemini API Key</span>
                  <span className="text-[10px] text-gray-500 font-normal">Stored safely in browser</span>
                </label>
                <input
                  type="password"
                  value={aiSettings.apiKey}
                  onChange={(e) => setAiSettings({ ...aiSettings, apiKey: e.target.value })}
                  placeholder="AIzaSy..."
                  className="w-full px-2.5 py-1.5 border-2 border-[#1E1E24] rounded-lg font-mono text-xs bg-[#FAF6EE] text-[#1E1E24]"
                />
                <p className="text-[10px] text-gray-500 mt-1">
                  Or set <code className="bg-gray-100 px-1 py-0.5 rounded font-mono font-bold text-[#1E1E24]">GEMINI_API_KEY</code> in your <code className="bg-gray-100 px-1 py-0.5 rounded font-mono font-bold text-[#1E1E24]">.env.local</code> file on the server.
                </p>
              </div>

              <div className="flex items-center justify-between pt-1">
                <span className="text-[10px] text-slate-500">
                  {aiSettings.apiKey ? '● Custom Key Configured' : '○ Using Server GEMINI_API_KEY'}
                </span>
                <button
                  type="submit"
                  className="btn-arcade btn-arcade-purple text-[11px] py-1 px-3 shadow-[1px_1px_0px_#1E1E24] cursor-pointer"
                >
                  Save Key
                </button>
              </div>
            </form>
          </div>
        )}

        {/* API Error Warning Notice */}
        {apiErrorMessage && (
          <div className="m-3 p-3 rounded-xl bg-rose-50 border-2 border-[#EF4444] text-[#991B1B] text-xs font-bold shadow-[2px_2px_0px_#EF4444] flex items-start gap-2">
            <AlertCircle className="w-4 h-4 text-[#EF4444] shrink-0 mt-0.5" />
            <div className="flex-1">
              <p>{apiErrorMessage}</p>
              <button
                onClick={() => setShowSettingsPopover(true)}
                className="mt-1 text-[11px] text-[#6C5CE7] underline font-black block cursor-pointer"
              >
                Click here to configure your Gemini API Key →
              </button>
            </div>
          </div>
        )}

        {/* Proactive Trigger Alert Banner */}
        {proactiveTrigger && (
          <div className="m-3 p-3 rounded-xl bg-amber-50 border-2 border-[#F59E0B] shadow-[3px_3px_0px_#B45309] space-y-2 animate-in slide-in-from-top-2 duration-200">
            <div className="flex items-start justify-between gap-2">
              <div className="flex items-center gap-1.5 text-xs font-black uppercase text-[#B45309]">
                <AlertTriangle className="w-4 h-4" />
                <span>Issue Detected in Live Code</span>
              </div>
              <button
                onClick={onClearProactiveTrigger}
                className="text-gray-400 hover:text-gray-700 text-xs cursor-pointer"
              >
                ✕
              </button>
            </div>
            <p className="text-xs font-bold text-[#1E1E24] leading-relaxed">
              {proactiveTrigger.message}
            </p>
            <button
              onClick={() => handleAskMentor(`Diagnose and fix this issue: "${proactiveTrigger.message}" in my active code.`)}
              disabled={isThinking}
              className="btn-arcade btn-arcade-yellow text-[10px] py-1 px-3 flex items-center gap-1 cursor-pointer"
            >
              <span>⚡ Generate Exact Fix</span>
            </button>
          </div>
        )}

        {/* =========================================================================
            CONTEXT-AWARE QUICK ACTION CHIPS
           ========================================================================= */}
        <div className="p-3 border-b-2 border-[#1E1E24] bg-white space-y-1.5">
          <div className="flex items-center justify-between text-[10px] font-black uppercase tracking-wider text-[#4A4A58]">
            <span>Contextual Actions</span>
            <span>Targeted Solutions</span>
          </div>

          <div className="grid grid-cols-2 gap-2 text-xs">
            <button
              onClick={() =>
                handleAskMentor(
                  'Analyze my current code against the problem statement, diagnose any syntax or logic issues, and provide the exact working solution.'
                )
              }
              disabled={isThinking}
              className="p-2 rounded-xl border-2 border-[#1E1E24] bg-[#EDE9FE] hover:bg-[#DDD6FE] text-[#1E1E24] font-black text-left flex items-center gap-1.5 shadow-[2px_2px_0px_#1E1E24] cursor-pointer transition-all active:translate-y-0.5 disabled:opacity-50"
            >
              <Lightbulb className="w-3.5 h-3.5 text-[#6C5CE7] shrink-0" />
              <span className="truncate">💡 Exact Solution</span>
            </button>

            <button
              onClick={() =>
                handleAskMentor(
                  `Inspect my code and explain why this error or behavior occurred: "${contextError || 'Incomplete quest requirement'}"`
                )
              }
              disabled={isThinking}
              className="p-2 rounded-xl border-2 border-[#1E1E24] bg-[#FEF3C7] hover:bg-[#FDE68A] text-[#1E1E24] font-black text-left flex items-center gap-1.5 shadow-[2px_2px_0px_#1E1E24] cursor-pointer transition-all active:translate-y-0.5 disabled:opacity-50"
            >
              <AlertTriangle className="w-3.5 h-3.5 text-[#D97706] shrink-0" />
              <span className="truncate">⚠️ Diagnose Error</span>
            </button>

            <button
              onClick={() =>
                handleAskMentor(
                  'Check my code logic line-by-line and tell me if any edge cases or quest objectives are missing.'
                )
              }
              disabled={isThinking}
              className="p-2 rounded-xl border-2 border-[#1E1E24] bg-[#D1FAE5] hover:bg-[#A7F3D0] text-[#1E1E24] font-black text-left flex items-center gap-1.5 shadow-[2px_2px_0px_#1E1E24] cursor-pointer transition-all active:translate-y-0.5 disabled:opacity-50"
            >
              <CheckCircle2 className="w-3.5 h-3.5 text-[#059669] shrink-0" />
              <span className="truncate">✅ Verify Logic</span>
            </button>

            <button
              onClick={() =>
                handleAskMentor(
                  'Explain the core concept behind this quest and how to write optimal code for it.'
                )
              }
              disabled={isThinking}
              className="p-2 rounded-xl border-2 border-[#1E1E24] bg-[#E0F2FE] hover:bg-[#BAE6FD] text-[#1E1E24] font-black text-left flex items-center gap-1.5 shadow-[2px_2px_0px_#1E1E24] cursor-pointer transition-all active:translate-y-0.5 disabled:opacity-50"
            >
              <BookOpen className="w-3.5 h-3.5 text-[#0284C7] shrink-0" />
              <span className="truncate">📖 Concept Guide</span>
            </button>
          </div>
        </div>

        {/* =========================================================================
            MESSAGE THREAD (Full Multi-Turn Conversation)
           ========================================================================= */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {messages.map((m) => (
            <div
              key={m.id}
              className={`flex flex-col ${m.role === 'user' ? 'items-end' : 'items-start'}`}
            >
              <div
                className={`max-w-[92%] rounded-2xl p-4 text-xs leading-relaxed border-2 border-[#1E1E24] shadow-[3px_3px_0px_#1E1E24] ${
                  m.role === 'user'
                    ? 'bg-[#1E1E24] text-white'
                    : m.isError
                    ? 'bg-rose-50 text-rose-950 border-rose-500'
                    : 'bg-white text-[#1E1E24]'
                }`}
              >
                {m.role === 'assistant' && (
                  <div className="flex items-center justify-between text-[10px] text-[#6C5CE7] font-black uppercase tracking-wider mb-2 border-b border-slate-100 pb-1.5">
                    <span className="flex items-center gap-1">
                      <Sparkles className="w-3 h-3 text-[#FFD214] fill-current" />
                      Acharya AI Mentor
                    </span>
                    <span className="text-gray-400 font-mono text-[9px] lowercase">
                      gemini-2.5-flash
                    </span>
                  </div>
                )}

                <FormattedMessageContent content={m.content} isUser={m.role === 'user'} />
              </div>

              <span className="text-[9px] text-[#71717A] mt-1 px-1 font-mono">
                {m.timestamp}
              </span>
            </div>
          ))}

          {isThinking && (
            <div className="flex items-center gap-2.5 p-3 bg-white rounded-xl border-2 border-[#1E1E24] text-xs font-bold text-[#6C5CE7] shadow-[2px_2px_0px_#1E1E24] w-fit animate-pulse">
              <Sparkles className="w-4 h-4 text-[#FFD214] animate-spin" />
              <span>Acharya is analyzing your code and crafting the exact solution...</span>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* =========================================================================
            PROMPT INPUT FORM (Disabled While Loading to Prevent Duplicate Submissions)
           ========================================================================= */}
        <div className="p-3 border-t-2 border-[#1E1E24] bg-white">
          <form
            onSubmit={(e) => {
              e.preventDefault();
              if (input.trim() && !isThinking) {
                handleAskMentor(input.trim());
              }
            }}
            className="flex items-center gap-2"
          >
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Ask for the solution, bug diagnosis, or logic explanation..."
              className="flex-1 text-xs px-3.5 py-2.5 border-2 border-[#1E1E24] rounded-xl font-bold bg-[#FAF6EE] text-[#1E1E24] focus:outline-none focus:border-[#6C5CE7] shadow-[2px_2px_0px_#1E1E24] disabled:opacity-50"
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

/**
 * Clean markdown formatter: renders code blocks, copy buttons, inline code, bold text, and bullet points
 */
function FormattedMessageContent({ content, isUser }: { content: string; isUser?: boolean }) {
  const [copiedIdx, setCopiedIdx] = useState<number | null>(null);

  const handleCopy = (code: string, idx: number) => {
    navigator.clipboard.writeText(code);
    setCopiedIdx(idx);
    setTimeout(() => setCopiedIdx(null), 2000);
  };

  // Split markdown code blocks ```lang ... ```
  const parts = content.split(/(```[\s\S]*?```)/g);

  return (
    <div className="space-y-2 leading-relaxed">
      {parts.map((part, pIdx) => {
        if (part.startsWith('```') && part.endsWith('```')) {
          const raw = part.slice(3, -3);
          const lines = raw.split('\n');
          const firstLine = lines[0].trim();
          const hasLang = /^[a-zA-Z0-9_-]+$/.test(firstLine);
          const lang = hasLang ? firstLine : '';
          const codeBody = (hasLang ? lines.slice(1).join('\n') : raw).trim();

          return (
            <div
              key={pIdx}
              className="my-2.5 rounded-xl bg-[#1E1E24] text-[#FAF6EE] border-2 border-[#1E1E24] overflow-hidden shadow-[2px_2px_0px_#1E1E24]"
            >
              <div className="px-3 py-1.5 bg-[#12131C] border-b border-gray-700 flex items-center justify-between text-[10px] font-mono font-bold text-gray-400">
                <span className="uppercase text-[#FFD214] font-black">{lang || 'CODE'}</span>
                <button
                  type="button"
                  onClick={() => handleCopy(codeBody, pIdx)}
                  className="flex items-center gap-1 hover:text-white transition-colors cursor-pointer text-gray-300"
                >
                  {copiedIdx === pIdx ? (
                    <>
                      <Check className="w-3 h-3 text-emerald-400" />
                      <span className="text-emerald-400">Copied!</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-3 h-3" />
                      <span>Copy</span>
                    </>
                  )}
                </button>
              </div>
              <pre className="p-3 font-mono text-[11px] overflow-x-auto whitespace-pre leading-relaxed text-[#A29BFE]">
                <code>{codeBody}</code>
              </pre>
            </div>
          );
        }

        return (
          <div key={pIdx} className="whitespace-pre-line font-medium text-xs leading-relaxed">
            {renderInlineMarkdown(part, isUser)}
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
