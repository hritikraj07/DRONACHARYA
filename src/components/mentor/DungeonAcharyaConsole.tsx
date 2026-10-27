// Dronacharya Code Dungeon & Craft Realm: Live Context-Aware AI Mentor Console
// Powered by Google Gemini 2.5 Pro SDK (@google/genai)
// Replaces static keyword-matching and mock setTimeout with real, intelligent coding solutions.
'use client';

import React, { useState, useRef, useEffect } from 'react';
import { askMentorAI, MentorHistoryItem } from '@/lib/mentor/acharya-engine';
import {
  Sparkles,
  Terminal,
  HelpCircle,
  Lightbulb,
  Send,
  MessageSquare,
  AlertTriangle,
  RotateCcw,
  CheckCircle2,
  Copy,
  Check,
} from 'lucide-react';

interface DungeonAcharyaConsoleProps {
  logs: string[];
  diagnostic?: {
    state: 'success' | 'failure' | 'error';
    summary: string;
    socraticHint: string;
    suggestedSnippet: string;
  };
  floorNumber: number;
  code?: string;
  onClearLogs?: () => void;
  onQuickPrompt?: (promptText: string) => void;
}

export function DungeonAcharyaConsole({
  logs,
  diagnostic,
  floorNumber,
  code = '',
  onClearLogs,
  onQuickPrompt,
}: DungeonAcharyaConsoleProps) {
  const [activeTab, setActiveTab] = useState<'terminal' | 'acharya'>('terminal');
  const [userQuery, setUserQuery] = useState('');
  const [isThinking, setIsThinking] = useState(false);
  const [chatMessages, setChatMessages] = useState<
    { sender: 'user' | 'acharya'; text: string; isError?: boolean }[]
  >([
    {
      sender: 'acharya',
      text: `Greetings, Apprentice! I am Acharya AI, powered by Gemini 2.5 Pro. I am actively watching Floor ${floorNumber}, your hero commands, and dungeon telemetry. Ask me anything to get exact working code solutions.`,
    },
  ]);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [chatMessages, isThinking]);

  const handleSendPrompt = async (promptText: string) => {
    if (!promptText.trim() || isThinking) return;

    const newMessages = [
      ...chatMessages,
      { sender: 'user' as const, text: promptText },
    ];
    setChatMessages(newMessages);
    setUserQuery('');
    setIsThinking(true);

    const history: MentorHistoryItem[] = chatMessages.slice(-6).map((m) => ({
      role: m.sender === 'user' ? 'user' : 'assistant',
      content: m.text,
    }));

    let assistantMsgIndex = -1;

    try {
      const result = await askMentorAI({
        message: promptText,
        history,
        context: {
          missionTitle: `Code Dungeon — Floor ${floorNumber}`,
          problemStatement:
            diagnostic?.summary ||
            `Navigate hero to the exit on Floor ${floorNumber}, harvesting resources and defeating obstacles.`,
          code,
          language: 'python',
          consoleOutput: logs.slice(-10).join('\n'),
          errorLog: diagnostic ? `Dungeon State: ${diagnostic.state}. ${diagnostic.summary}` : '',
        },
        onFirstToken: () => {
          setIsThinking(false);
          setChatMessages((prev) => {
            assistantMsgIndex = prev.length;
            return [...prev, { sender: 'acharya', text: '' }];
          });
        },
        onChunk: (_chunk, accumulated) => {
          setChatMessages((prev) => {
            if (assistantMsgIndex === -1) {
              assistantMsgIndex = prev.length - 1;
            }
            return prev.map((msg, idx) =>
              idx === assistantMsgIndex ? { ...msg, text: accumulated } : msg
            );
          });
        },
      });

      if (!result.success) {
        setChatMessages((prev) => [
          ...prev,
          {
            sender: 'acharya',
            text: `⚠️ ${result.error || 'Failed to fetch solution from Gemini API. Check your GEMINI_API_KEY.'}`,
            isError: true,
          },
        ]);
      }
    } catch (err: any) {
      setChatMessages((prev) => [
        ...prev,
        {
          sender: 'acharya',
          text: `⚠️ Network error communicating with AI Mentor: ${err?.message || 'Server unreachable'}.`,
          isError: true,
        },
      ]);
    } finally {
      setIsThinking(false);
    }
  };

  const quickChips = [
    'How do I craft and place the bridge?',
    'Give me the exact working code for this floor',
    'Why did my hero take damage?',
    'How to defeat the elemental boss?',
  ];

  return (
    <div className="card-game bg-[#1E1E24] text-white p-3.5 sm:p-4 border-2 border-[#1E1E24] shadow-[4px_4px_0px_#1E1E24] flex flex-col h-64 sm:h-72">
      {/* Console Top Tabs */}
      <div className="flex items-center justify-between border-b border-white/10 pb-2.5 mb-2.5">
        <div className="flex items-center gap-1.5">
          <button
            onClick={() => setActiveTab('terminal')}
            className={`px-3 py-1 text-xs font-black rounded-lg transition-all flex items-center gap-1.5 cursor-pointer ${
              activeTab === 'terminal'
                ? 'bg-[#6C5CE7] text-white shadow-xs'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <Terminal className="w-3.5 h-3.5" />
            <span>Terminal Logs ({logs.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('acharya')}
            className={`px-3 py-1 text-xs font-black rounded-lg transition-all flex items-center gap-1.5 cursor-pointer ${
              activeTab === 'acharya'
                ? 'bg-[#FBBF24] text-[#1E1E24] shadow-xs'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>Acharya AI (Gemini 2.5)</span>
          </button>
        </div>

        {activeTab === 'terminal' && onClearLogs && (
          <button
            onClick={onClearLogs}
            className="text-[11px] text-slate-400 hover:text-rose-400 flex items-center gap-1 transition-colors cursor-pointer"
            title="Clear Terminal Output"
          >
            <RotateCcw className="w-3 h-3" />
            <span>Clear</span>
          </button>
        )}
      </div>

      {/* TAB 1: Real Terminal Execution Logs */}
      {activeTab === 'terminal' && (
        <div className="flex-1 overflow-y-auto font-mono text-[11px] space-y-1 pr-1 text-emerald-400 select-text">
          {logs.length === 0 ? (
            <p className="text-slate-500 italic">
              # Terminal idle. Press &quot;Run Code ▶&quot; to execute hero commands.
            </p>
          ) : (
            logs.map((log, i) => (
              <div
                key={i}
                className={`py-0.5 leading-relaxed ${
                  log.includes('CRITICAL') || log.includes('DEPLETED') || log.includes('HALT') || log.includes('Error')
                    ? 'text-rose-400 font-bold'
                    : log.includes('CLEARED') || log.includes('VICTORY')
                    ? 'text-amber-300 font-bold'
                    : 'text-emerald-300'
                }`}
              >
                {log}
              </div>
            ))
          )}

          {diagnostic && (
            <div
              className={`mt-3 p-2.5 rounded-lg border text-xs font-bold ${
                diagnostic.state === 'success'
                  ? 'bg-emerald-950/40 border-emerald-500/40 text-emerald-300'
                  : 'bg-rose-950/40 border-rose-500/40 text-rose-300'
              }`}
            >
              <div className="flex items-center gap-1.5 mb-1 text-[11px] uppercase tracking-wider">
                {diagnostic.state === 'success' ? (
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                ) : (
                  <AlertTriangle className="w-3.5 h-3.5 text-rose-400" />
                )}
                <span>Diagnostic: {diagnostic.state}</span>
              </div>
              <p className="font-sans text-[11px] leading-relaxed text-slate-200">
                {diagnostic.summary}
              </p>
            </div>
          )}
        </div>
      )}

      {/* TAB 2: Live AI Mentor Chat */}
      {activeTab === 'acharya' && (
        <div className="flex-1 flex flex-col min-h-0">
          {/* Scrollable Chat History */}
          <div className="flex-1 overflow-y-auto space-y-2.5 pr-1 mb-2 font-sans text-xs">
            {chatMessages.map((msg, i) => (
              <div
                key={i}
                className={`p-2.5 rounded-xl border leading-relaxed ${
                  msg.sender === 'user'
                    ? 'bg-[#2A2B36] border-[#3E4052] text-white ml-6 text-right'
                    : msg.isError
                    ? 'bg-rose-950/40 border-rose-500/50 text-rose-200 mr-4'
                    : 'bg-[#2A2315] border-[#D97706]/40 text-[#FEF3C7] mr-4'
                }`}
              >
                {msg.sender === 'acharya' && (
                  <div className="flex items-center gap-1 text-[10px] font-black uppercase text-[#FBBF24] mb-1">
                    <Sparkles className="w-3 h-3" />
                    <span>Acharya Mentor (Gemini 2.5 Flash)</span>
                  </div>
                )}
                <div className="whitespace-pre-line text-left font-mono text-[11px]">
                  {renderDungeonMessage(msg.text)}
                </div>
              </div>
            ))}

            {isThinking && (
              <div className="flex items-center gap-2 p-2 bg-[#2A2315] rounded-xl border border-amber-500/30 text-xs text-amber-300 animate-pulse w-fit">
                <Sparkles className="w-3.5 h-3.5 text-[#FBBF24] animate-spin" />
                <span>Acharya is analyzing floor telemetry and generating solution...</span>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>

          {/* Quick Context Prompt Chips */}
          <div className="flex items-center gap-1.5 overflow-x-auto py-1 mb-1.5 shrink-0">
            {quickChips.map((chip, idx) => (
              <button
                key={idx}
                onClick={() => handleSendPrompt(chip)}
                disabled={isThinking}
                className="text-[10px] whitespace-nowrap bg-white/5 hover:bg-white/10 text-slate-300 hover:text-white px-2 py-0.5 rounded border border-white/10 transition-colors cursor-pointer shrink-0 disabled:opacity-40"
              >
                {chip}
              </button>
            ))}
          </div>

          {/* Prompt Input Form */}
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSendPrompt(userQuery);
            }}
            className="flex items-center gap-2 shrink-0"
          >
            <input
              type="text"
              value={userQuery}
              onChange={(e) => setUserQuery(e.target.value)}
              placeholder="Ask for the exact solution or bug fix..."
              className="flex-1 bg-[#12131C] border border-white/20 rounded-lg px-2.5 py-1.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-[#FBBF24]"
              disabled={isThinking}
            />
            <button
              type="submit"
              disabled={!userQuery.trim() || isThinking}
              className="bg-[#FBBF24] hover:bg-[#F59E0B] text-[#1E1E24] font-black px-3 py-1.5 rounded-lg text-xs flex items-center justify-center transition-colors disabled:opacity-40 cursor-pointer"
            >
              <Send className="w-3.5 h-3.5" />
            </button>
          </form>
        </div>
      )}
    </div>
  );
}

function renderDungeonMessage(content: string) {
  const parts = content.split(/(```[\s\S]*?```)/g);
  return parts.map((part, i) => {
    if (part.startsWith('```') && part.endsWith('```')) {
      const codeBody = part.replace(/^```[a-zA-Z0-9_-]*\n?/, '').replace(/```$/, '').trim();
      return (
        <div key={i} className="my-1.5 p-2 bg-[#101118] border border-gray-700 rounded-lg text-emerald-300 font-mono text-[10px] overflow-x-auto">
          <code>{codeBody}</code>
        </div>
      );
    }
    return <span key={i}>{part}</span>;
  });
}
