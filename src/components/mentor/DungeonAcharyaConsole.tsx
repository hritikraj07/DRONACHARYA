// Dronacharya Code Dungeon & Craft Realm: Acharya AI Socratic Mentor & Terminal Console
'use client';

import React, { useState } from 'react';
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
  onClearLogs?: () => void;
  onQuickPrompt?: (promptText: string) => void;
}

export function DungeonAcharyaConsole({
  logs,
  diagnostic,
  floorNumber,
  onClearLogs,
  onQuickPrompt,
}: DungeonAcharyaConsoleProps) {
  const [activeTab, setActiveTab] = useState<'terminal' | 'acharya'>('terminal');
  const [userQuery, setUserQuery] = useState('');
  const [chatMessages, setChatMessages] = useState<
    { sender: 'user' | 'acharya'; text: string; socratic?: boolean }[]
  >([
    {
      sender: 'acharya',
      text: `Greetings, Apprentice! I am Acharya Dronacharya. I guide your logic through this dungeon. If your hero takes damage or halts, ask me for a Socratic hint without spoiling the solution.`,
      socratic: true,
    },
  ]);

  const handleSendPrompt = (promptText: string) => {
    if (!promptText.trim()) return;

    const newMessages = [
      ...chatMessages,
      { sender: 'user' as const, text: promptText },
    ];
    setChatMessages(newMessages);
    setUserQuery('');

    // Dynamic Socratic Mentor response generation based on current floor & failure state
    setTimeout(() => {
      let reply = '';
      const lower = promptText.toLowerCase();

      if (lower.includes('loop')) {
        reply =
          'Apprentice, examine your loop range: `for i in range(count):`. How many blocks lie between your current tile and the target? Ensure you repeat both the action (like `mine`) and the step (`move`) inside the indented block.';
      } else if (lower.includes('craft') || lower.includes('bridge')) {
        reply =
          'To construct a bridge across the lava river, inspect your inventory for 3 Wood blocks. Once you have harvested them, invoke `hero.craft("bridge")`. Then step adjacent to the lava and call `hero.place("bridge", "right")`!';
      } else if (lower.includes('mimic') || lower.includes('scan') || lower.includes('health')) {
        reply =
          'A true warrior never charges blindly into an unverified chest. Call `tile = hero.scan("right")`. Check its attributes: `if tile.is_mimic == True: hero.attack("right")`. What will happen if you open it without attacking?';
      } else if (lower.includes('boss') || lower.includes('weakness') || lower.includes('golem')) {
        reply =
          'The Syntax Golem cycles through 4 elemental vulnerabilities: `["fire", "ice", "thunder", "fire"]`. Define a reusable function `cast_spell(elem)` that commands `hero.attack("up", elem)` and loop through each weakness!';
      } else if (diagnostic?.socraticHint) {
        reply = diagnostic.socraticHint;
      } else {
        reply =
          'Observe the coordinates of your hero and the surrounding obstacles. What does the terminal log reveal about the last executed command? Trace each step one by one.';
      }

      setChatMessages((prev) => [
        ...prev,
        { sender: 'acharya', text: reply, socratic: true },
      ]);
    }, 400);
  };

  const quickChips = [
    'Why did my loop stop early?',
    'How do I craft the bridge?',
    'Give me a Socratic hint 💡',
    'How to inspect boss weaknesses?',
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
            <Sparkles className="w-3.5 h-3.5 text-[#FBBF24]" />
            <span>Acharya AI Mentor</span>
          </button>
        </div>

        {activeTab === 'terminal' && onClearLogs && (
          <button
            onClick={onClearLogs}
            className="text-[10px] text-slate-400 hover:text-white font-mono flex items-center gap-1 cursor-pointer"
          >
            <RotateCcw className="w-3 h-3" />
            <span>Clear</span>
          </button>
        )}
      </div>

      {/* Tab 1: Terminal Output */}
      {activeTab === 'terminal' && (
        <div className="flex-1 overflow-y-auto space-y-1 font-mono text-[11px] pr-1 scrollbar-thin">
          {logs.length === 0 ? (
            <p className="text-slate-500 italic py-4 text-center">
              Awaiting execution. Click &quot;Run Code ▶&quot; to inspect step-by-step frames.
            </p>
          ) : (
            logs.map((log, idx) => {
              const isError = log.includes('❌') || log.includes('Burn hazard') || log.includes('Oof!');
              const isSuccess = log.includes('✨') || log.includes('Conquered') || log.includes('Mined');
              const isAction = log.includes('🚶') || log.includes('Crafted');

              return (
                <div
                  key={`log-${idx}`}
                  className={`leading-relaxed px-1.5 py-0.5 rounded ${
                    isError
                      ? 'text-red-400 bg-red-950/30'
                      : isSuccess
                      ? 'text-emerald-400 bg-emerald-950/20'
                      : isAction
                      ? 'text-yellow-300'
                      : 'text-slate-300'
                  }`}
                >
                  <span className="text-slate-600 mr-2">[{idx + 1}]</span>
                  <span>{log}</span>
                </div>
              );
            })
          )}

          {/* Socratic Failure Notice inside Terminal */}
          {diagnostic && diagnostic.state !== 'success' && diagnostic.socraticHint && (
            <div className="mt-2 p-2.5 rounded-lg bg-[#6C5CE7]/20 border border-[#6C5CE7]/40 text-xs text-[#FAF6EE]">
              <div className="flex items-center gap-1.5 text-[#FBBF24] font-black text-[11px] mb-1">
                <Lightbulb className="w-3.5 h-3.5" />
                <span>Acharya&apos;s Socratic Diagnosis</span>
              </div>
              <p className="italic text-[11px] leading-relaxed">{diagnostic.socraticHint}</p>
            </div>
          )}
        </div>
      )}

      {/* Tab 2: Acharya AI Socratic Dialogue */}
      {activeTab === 'acharya' && (
        <div className="flex-1 flex flex-col justify-between overflow-hidden">
          {/* Dialogue History */}
          <div className="flex-1 overflow-y-auto space-y-2 pr-1 mb-2">
            {chatMessages.map((msg, i) => (
              <div
                key={`msg-${i}`}
                className={`p-2.5 rounded-xl text-xs leading-relaxed max-w-[90%] ${
                  msg.sender === 'user'
                    ? 'ml-auto bg-[#6C5CE7] text-white'
                    : 'mr-auto bg-white/10 text-slate-200 border border-white/15'
                }`}
              >
                {msg.sender === 'acharya' && (
                  <div className="flex items-center gap-1 text-[10px] font-black text-[#FBBF24] uppercase tracking-wider mb-1">
                    <Sparkles className="w-3 h-3" />
                    <span>Acharya Dronacharya</span>
                  </div>
                )}
                <p>{msg.text}</p>
              </div>
            ))}
          </div>

          {/* Quick Prompt Chips */}
          <div className="flex flex-wrap items-center gap-1 mb-2">
            {quickChips.map((chip, idx) => (
              <button
                key={`chip-${idx}`}
                onClick={() => handleSendPrompt(chip)}
                className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-white/10 hover:bg-white/20 text-slate-300 transition-colors border border-white/10 cursor-pointer"
              >
                {chip}
              </button>
            ))}
          </div>

          {/* Ask Input Form */}
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSendPrompt(userQuery);
            }}
            className="flex items-center gap-1.5"
          >
            <input
              type="text"
              value={userQuery}
              onChange={(e) => setUserQuery(e.target.value)}
              placeholder="Ask Acharya a question about your code..."
              className="flex-1 bg-white/10 text-white placeholder:text-slate-500 text-xs px-3 py-1.5 rounded-lg border border-white/20 outline-none focus:border-[#FBBF24]"
            />
            <button
              type="submit"
              className="px-3 py-1.5 bg-[#FBBF24] text-[#1E1E24] text-xs font-black rounded-lg hover:brightness-110 flex items-center gap-1 cursor-pointer shrink-0"
            >
              <span>Ask</span>
              <Send className="w-3 h-3" />
            </button>
          </form>
        </div>
      )}
    </div>
  );
}
