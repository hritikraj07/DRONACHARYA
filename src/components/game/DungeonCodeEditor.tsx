// Dronacharya Code Dungeon: Python Code Editor, Spellbook API Sheet, and Live Combat Console
'use client';

import React, { useState } from 'react';
import {
  Play,
  RotateCcw,
  StepForward,
  Pause,
  FastForward,
  BookOpen,
  Code2,
  Sparkles,
  ChevronDown,
  ChevronUp,
  Copy,
  Check,
  AlertTriangle,
  Terminal,
  HelpCircle,
  Zap,
} from 'lucide-react';

interface DungeonCodeEditorProps {
  code: string;
  onChangeCode: (newCode: string) => void;
  isRunning: boolean;
  isPaused?: boolean;
  onRunCode: () => void;
  onStepForward: () => void;
  onPause?: () => void;
  onResetLevel: () => void;
  speed: 1 | 2 | 4;
  onToggleSpeed: () => void;
  logs: string[];
  diagnostic?: {
    state: 'success' | 'failure' | 'error';
    summary: string;
    socraticHint: string;
    suggestedSnippet: string;
    errorLine?: number;
    rawTraceback?: string;
  };
  levelNumber: number;
  parLines: number;
  isPyodideActive?: boolean;
  onAskMentorHelp?: (code: string, errorSummary?: string) => void;
}

export function DungeonCodeEditor({
  code,
  onChangeCode,
  isRunning,
  isPaused = false,
  onRunCode,
  onStepForward,
  onPause,
  onResetLevel,
  speed,
  onToggleSpeed,
  logs,
  diagnostic,
  levelNumber,
  parLines,
  isPyodideActive = true,
  onAskMentorHelp,
}: DungeonCodeEditorProps) {
  const [spellbookOpen, setSpellbookOpen] = useState(false);
  const [copiedSnippet, setCopiedSnippet] = useState<string | null>(null);

  // Compute non-empty, non-comment lines
  const effectiveLines = code
    .split('\n')
    .filter((l) => l.trim() && !l.trim().startsWith('#')).length;

  const totalLines = Math.max(12, code.split('\n').length);

  const insertSnippet = (snippet: string) => {
    onChangeCode(code + (code.endsWith('\n') ? '' : '\n') + snippet + '\n');
    setCopiedSnippet(snippet);
    setTimeout(() => setCopiedSnippet(null), 1500);
  };

  const SPELLBOOK_METHODS = [
    {
      code: 'hero.move_right(steps=1)',
      desc: 'Move hero right by N tiles',
      category: 'Movement',
    },
    {
      code: 'hero.move_down(steps=1)',
      desc: 'Move hero down by N tiles',
      category: 'Movement',
    },
    {
      code: 'hero.move_left(steps=1)',
      desc: 'Move hero left by N tiles',
      category: 'Movement',
    },
    {
      code: 'hero.move_up(steps=1)',
      desc: 'Move hero up by N tiles',
      category: 'Movement',
    },
    {
      code: 'hero.attack()',
      desc: 'Strike adjacent enemy with sword (35 dmg)',
      category: 'Combat',
    },
    {
      code: 'hero.collect()',
      desc: 'Pick up adjacent Mana Gem or absorb Healing Crystal',
      category: 'Interaction',
    },
    {
      code: 'hero.toggle_switch()',
      desc: 'Trigger adjacent pressure switch to unlock gates',
      category: 'Interaction',
    },
    {
      code: 'hero.say("Greetings!")',
      desc: 'Display comic speech bubble above hero',
      category: 'Communication',
    },
    {
      code: 'tile = hero.look_ahead()',
      desc: 'Inspects tile ahead: "goblin", "gem", "spike_trap", "portal", "clear"',
      category: 'Sensors',
    },
    {
      code: 'dist = hero.distance_to("boss")',
      desc: 'Calculates distance to target ("boss", "gem", "portal")',
      category: 'Sensors',
    },
    {
      code: 'enemies = hero.get_enemies()',
      desc: 'Returns list of remaining monsters with coordinates and HP',
      category: 'Sensors',
    },
    {
      code: 'hero.hp',
      desc: 'Property returning current hero health (0 to 100)',
      category: 'Sensors',
    },
  ];

  return (
    <div className="w-full flex flex-col gap-3 select-none">
      {/* 1. Editor Header Ribbon */}
      <div className="flex items-center justify-between bg-white p-3 rounded-xl border-2 border-[#1E1E24] shadow-[3px_3px_0px_#1E1E24]">
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-lg bg-[#6C5CE7] text-[#FFD214] border border-[#1E1E24] flex items-center justify-center font-bold text-xs shadow-xs">
            🐍
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-serif font-black text-xs text-[#1E1E24]">
                Python 3 Spellbook
              </span>
              <span className="px-1.5 py-0.2 rounded-full text-[9px] font-mono font-bold bg-[#10B981]/15 text-[#059669] border border-[#10B981]/30">
                {isPyodideActive ? 'CPython 3.12 (Pyodide)' : 'Deterministic Python Engine'}
              </span>
            </div>
            <span className="text-[10px] text-[#64748B] block">
              Direct live Hero API binding
            </span>
          </div>
        </div>

        {/* Line Counter vs Par Rating */}
        <div className="flex items-center gap-2">
          <div
            className={`px-2.5 py-1 rounded-lg border text-xs font-mono font-bold flex items-center gap-1.5 ${
              effectiveLines <= parLines
                ? 'bg-[#ECFDF5] border-[#10B981] text-[#059669]'
                : 'bg-[#FEF3C7] border-[#F59E0B] text-[#D97706]'
            }`}
          >
            <span>Lines: {effectiveLines}/{parLines}</span>
            <span>{effectiveLines <= parLines ? '⭐⭐⭐' : '⭐⭐'}</span>
          </div>

          <button
            onClick={() => setSpellbookOpen(!spellbookOpen)}
            className="btn-arcade text-[11px] py-1 px-2.5 btn-arcade-white flex items-center gap-1 shadow-[2px_2px_0px_#1E1E24]"
            title="Toggle Hero API method cheat sheet"
          >
            <BookOpen className="w-3 h-3 text-[#6C5CE7]" />
            <span className="hidden sm:inline">Spellbook API</span>
            {spellbookOpen ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />}
          </button>
        </div>
      </div>

      {/* 2. Spellbook API Cheat Sheet Drawer */}
      {spellbookOpen && (
        <div className="p-3 bg-[#FAF6EE] rounded-xl border-2 border-[#1E1E24] shadow-[3px_3px_0px_#1E1E24] space-y-2 animate-in fade-in zoom-in-95">
          <div className="flex items-center justify-between pb-1 border-b border-[#1E1E24]/15">
            <span className="text-xs font-bold text-[#1E1E24] flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-[#6C5CE7]" />
              Available Hero Spellbook Commands
            </span>
            <span className="text-[10px] text-[#64748B]">Click any snippet to append</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 max-h-48 overflow-y-auto pr-1">
            {SPELLBOOK_METHODS.map((m, i) => (
              <div
                key={`m-${i}`}
                onClick={() => insertSnippet(m.code)}
                className="p-2 bg-white rounded-lg border border-[#1E1E24]/20 hover:border-[#6C5CE7] hover:shadow-xs cursor-pointer flex items-start justify-between group transition-all"
              >
                <div>
                  <code className="text-[11px] font-mono font-bold text-[#6C5CE7] group-hover:underline block">
                    {m.code}
                  </code>
                  <span className="text-[10px] text-[#64748B] block mt-0.5">{m.desc}</span>
                </div>
                <button
                  type="button"
                  className="text-[9px] px-1.5 py-0.5 rounded bg-[#EDE9FE] text-[#6C5CE7] font-bold shrink-0 mt-0.5"
                >
                  {copiedSnippet === m.code ? '✓ Added' : '+ Add'}
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 3. Real Python Code Editor Area */}
      <div className="relative rounded-2xl border-4 border-[#1E1E24] shadow-[6px_6px_0px_#1E1E24] bg-[#1E1E24] overflow-hidden flex flex-col">
        {/* Editor Top Bar */}
        <div className="flex items-center justify-between px-3 py-1.5 bg-[#2D2A32] border-b-2 border-[#1E1E24] text-[11px] font-mono text-[#94A3B8]">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-[#EF4444]" />
            <span className="w-2.5 h-2.5 rounded-full bg-[#F59E0B]" />
            <span className="w-2.5 h-2.5 rounded-full bg-[#10B981]" />
            <span className="font-bold text-white ml-1">hero_script.py</span>
          </div>
          <span className="text-[10px] text-gray-400">Python 3 (Standard Syntax)</span>
        </div>

        {/* Line Numbers & Code Textarea */}
        <div className="flex w-full min-h-[220px] max-h-[340px] overflow-auto font-mono text-xs sm:text-sm">
          {/* Line Numbers Column */}
          <div className="w-10 bg-[#16151A] text-[#64748B] text-right pr-2 py-3 select-none flex flex-col shrink-0 font-bold border-r border-[#2D2A32]">
            {Array.from({ length: totalLines }).map((_, i) => (
              <span
                key={`ln-${i}`}
                className={`leading-5 text-[11px] ${
                  diagnostic?.errorLine === i + 1 ? 'text-[#EF4444] font-black' : ''
                }`}
              >
                {i + 1}
              </span>
            ))}
          </div>

          {/* Code Textarea */}
          <textarea
            value={code}
            onChange={(e) => onChangeCode(e.target.value)}
            disabled={isRunning}
            spellCheck={false}
            className="flex-1 bg-transparent text-[#F8FAFC] p-3 leading-5 outline-none resize-none font-mono caret-[#FBBF24] focus:ring-0"
            placeholder="# Write Python code to control your hero..."
          />
        </div>

        {/* 4. Playback Controls Bar */}
        <div className="p-2.5 bg-[#2D2A32] border-t-2 border-[#1E1E24] flex flex-wrap items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <button
              onClick={onRunCode}
              disabled={isRunning}
              className={`btn-arcade text-xs py-2 px-4 flex items-center gap-1.5 shadow-[2px_2px_0px_#1E1E24] ${
                isRunning
                  ? 'bg-gray-400 text-gray-700 cursor-not-allowed opacity-60'
                  : 'btn-arcade-green text-[#1E1E24] font-black'
              }`}
            >
              <Play className="w-3.5 h-3.5 fill-current" />
              <span>{isRunning ? 'Executing...' : 'Run Code ▶'}</span>
            </button>

            <button
              onClick={onStepForward}
              disabled={isRunning}
              className="btn-arcade text-xs py-2 px-3 btn-arcade-white flex items-center gap-1 shadow-[2px_2px_0px_#1E1E24]"
              title="Step forward 1 action tick"
            >
              <StepForward className="w-3.5 h-3.5 text-[#6C5CE7]" />
              <span className="hidden sm:inline">Step (1 Tick)</span>
            </button>

            {onPause && (
              <button
                onClick={onPause}
                disabled={!isRunning}
                className="btn-arcade text-xs py-2 px-2.5 btn-arcade-white flex items-center shadow-[2px_2px_0px_#1E1E24]"
                title="Pause simulation"
              >
                <Pause className="w-3.5 h-3.5 text-[#1E1E24]" />
              </button>
            )}

            <button
              onClick={onResetLevel}
              className="btn-arcade text-xs py-2 px-2.5 btn-arcade-white flex items-center shadow-[2px_2px_0px_#1E1E24]"
              title="Reset level and reset hero to start"
            >
              <RotateCcw className="w-3.5 h-3.5 text-[#EF4444]" />
            </button>
          </div>

          {/* Speed Toggle */}
          <button
            onClick={onToggleSpeed}
            className="btn-arcade text-xs py-1.5 px-3 btn-arcade-yellow flex items-center gap-1 shadow-[2px_2px_0px_#1E1E24] font-bold"
            title="Toggle playback animation speed"
          >
            <FastForward className="w-3.5 h-3.5" />
            <span>Speed: {speed}x</span>
          </button>
        </div>
      </div>

      {/* 5. Execution Log / Combat Console */}
      <div className="card-game p-3 bg-white border-2 border-[#1E1E24] shadow-[3px_3px_0px_#1E1E24] rounded-xl flex flex-col gap-2">
        <div className="flex items-center justify-between pb-1.5 border-b border-[#1E1E24]/10">
          <div className="flex items-center gap-1.5 text-xs font-bold text-[#1E1E24]">
            <Terminal className="w-3.5 h-3.5 text-[#6C5CE7]" />
            <span>Combat &amp; Execution Console</span>
          </div>
          <span className="text-[10px] font-mono text-[#64748B]">
            {logs.length} ticks recorded
          </span>
        </div>

        {/* Live Logs Stream */}
        <div className="h-28 overflow-y-auto bg-[#18181C] text-[#E2E8F0] p-2.5 rounded-lg font-mono text-xs space-y-1">
          {logs.length === 0 ? (
            <span className="text-[#64748B] italic">Press &quot;Run Code ▶&quot; to execute your Python script.</span>
          ) : (
            logs.map((log, idx) => (
              <div
                key={`log-${idx}`}
                className={`${
                  log.includes('💥') || log.includes('💀') || log.includes('🩸')
                    ? 'text-[#F87171] font-bold'
                    : log.includes('🏆') || log.includes('💎') || log.includes('💚')
                    ? 'text-[#34D399] font-bold'
                    : log.includes('🖨️')
                    ? 'text-[#38BDF8]'
                    : 'text-[#E2E8F0]'
                }`}
              >
                {log}
              </div>
            ))
          )}
        </div>

        {/* Diagnostic Error Banner with Acharya AI Deep Sync */}
        {diagnostic && (
          <div
            className={`p-3 rounded-lg border-2 flex flex-col gap-2 animate-in fade-in ${
              diagnostic.state === 'error'
                ? 'bg-[#FEF2F2] border-[#EF4444] text-[#991B1B]'
                : 'bg-[#FFFBEB] border-[#F59E0B] text-[#92400E]'
            }`}
          >
            <div className="flex items-start justify-between gap-2">
              <div className="flex items-start gap-2">
                <AlertTriangle className="w-4 h-4 shrink-0 mt-0.5" />
                <div>
                  <h4 className="text-xs font-black uppercase tracking-wider">
                    {diagnostic.state === 'error' ? 'Spell Fizzled! (Python Error)' : 'Quest Incomplete'}
                  </h4>
                  <p className="text-xs font-mono mt-0.5">{diagnostic.summary}</p>
                  <p className="text-[11px] text-[#4A4A58] mt-1 font-sans">
                    💡 <strong>Acharya Guild Hint:</strong> {diagnostic.socraticHint}
                  </p>
                </div>
              </div>

              {onAskMentorHelp && (
                <button
                  onClick={() => onAskMentorHelp(code, diagnostic.summary)}
                  className="px-2.5 py-1.5 rounded-lg bg-[#6C5CE7] hover:bg-[#5848c2] text-white text-xs font-bold shrink-0 flex items-center gap-1 shadow-xs transition-colors"
                  title="Open Acharya AI with full error context"
                >
                  <Sparkles className="w-3.5 h-3.5 fill-current text-[#FFD214]" />
                  <span>Help Me Debug</span>
                </button>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
