// Dronacharya Code Dungeon: Code Editor, Spellbook Cheat Sheet & Step Debugger
'use client';

import React, { useState } from 'react';
import {
  Play,
  RotateCcw,
  StepForward,
  FastForward,
  BookOpen,
  Code2,
  Sparkles,
  ChevronDown,
  ChevronUp,
  Copy,
  Check,
  Pickaxe,
  Wrench,
  Shield,
  Layers,
  Sword,
  Compass,
} from 'lucide-react';
import { DungeonAcharyaConsole } from '@/components/mentor/DungeonAcharyaConsole';
import {
  CRAFTING_RECIPES,
  DungeonInventory,
  CraftingRecipe,
} from '@/lib/simulator/dungeon-engine';

interface DungeonCodeEditorProps {
  code: string;
  onChangeCode: (newCode: string) => void;
  isRunning: boolean;
  isPaused?: boolean;
  onRunCode: () => void;
  onStepForward: () => void;
  onResetFloor: () => void;
  speed: 1 | 2;
  onToggleSpeed: () => void;
  logs: string[];
  diagnostic?: {
    state: 'success' | 'failure' | 'error';
    summary: string;
    socraticHint: string;
    suggestedSnippet: string;
  };
  floorNumber: number;
  inventory: DungeonInventory;
  onCraftItem: (recipe: CraftingRecipe) => void;
}

export function DungeonCodeEditor({
  code,
  onChangeCode,
  isRunning,
  onRunCode,
  onStepForward,
  onResetFloor,
  speed,
  onToggleSpeed,
  logs,
  diagnostic,
  floorNumber,
  inventory,
  onCraftItem,
}: DungeonCodeEditorProps) {
  const [activeTab, setActiveTab] = useState<'editor' | 'blueprints'>('editor');
  const [spellbookOpen, setSpellbookOpen] = useState(false);

  // Line numbering
  const lineCount = Math.max(12, code.split('\n').length);

  const insertSnippet = (snippet: string) => {
    onChangeCode(code + (code.endsWith('\n') ? '' : '\n') + snippet + '\n');
  };

  const SPELLBOOK_METHODS = [
    {
      code: 'hero.move("right", steps=1)',
      desc: 'Move hero up, down, left, or right',
      category: 'Movement',
    },
    {
      code: 'hero.mine("right")',
      desc: 'Harvest adjacent tree, stone, iron, or crystal into inventory',
      category: 'Mining',
    },
    {
      code: 'hero.craft("bridge")',
      desc: 'Craft an item (bridge, key, blade, shield)',
      category: 'Crafting',
    },
    {
      code: 'hero.place("bridge", "right")',
      desc: 'Place a crafted bridge over lava or pits',
      category: 'Building',
    },
    {
      code: 'hero.scan("right")',
      desc: 'Inspect adjacent tile: returns { type, is_mimic }',
      category: 'Inspection',
    },
    {
      code: 'hero.attack("right", element="fire")',
      desc: 'Strike adjacent bug monster or Syntax Golem',
      category: 'Combat',
    },
  ];

  return (
    <div className="flex flex-col h-full space-y-3 select-none">
      {/* 1. Panel Header & Tabs */}
      <div className="card-game p-2.5 bg-white flex items-center justify-between border-2 border-[#1E1E24] shadow-[3px_3px_0px_#1E1E24]">
        <div className="flex items-center gap-1.5">
          <button
            onClick={() => setActiveTab('editor')}
            className={`px-3 py-1.5 text-xs font-black rounded-lg transition-all flex items-center gap-1.5 cursor-pointer ${
              activeTab === 'editor'
                ? 'bg-[#6C5CE7] text-white shadow-xs'
                : 'text-[#4A4A58] hover:bg-slate-100'
            }`}
          >
            <Code2 className="w-3.5 h-3.5" />
            <span>Python Spellbook</span>
          </button>

          <button
            onClick={() => setActiveTab('blueprints')}
            className={`px-3 py-1.5 text-xs font-black rounded-lg transition-all flex items-center gap-1.5 cursor-pointer ${
              activeTab === 'blueprints'
                ? 'bg-[#FBBF24] text-[#1E1E24] shadow-xs'
                : 'text-[#4A4A58] hover:bg-slate-100'
            }`}
          >
            <Wrench className="w-3.5 h-3.5" />
            <span>Crafting Blueprints</span>
          </button>
        </div>

        {/* Spellbook API Cheat Sheet Toggle Button */}
        {activeTab === 'editor' && (
          <button
            onClick={() => setSpellbookOpen(!spellbookOpen)}
            className="text-[11px] font-bold text-[#6C5CE7] hover:underline flex items-center gap-1 cursor-pointer bg-[#EDE9FE] px-2.5 py-1 rounded-md border border-[#6C5CE7]/30"
          >
            <BookOpen className="w-3.5 h-3.5" />
            <span>Spellbook API</span>
            {spellbookOpen ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />}
          </button>
        )}
      </div>

      {/* 2. Collapsible Spellbook API Drawer */}
      {spellbookOpen && activeTab === 'editor' && (
        <div className="card-game p-3 bg-[#FAF6EE] border-2 border-[#1E1E24] shadow-[3px_3px_0px_#1E1E24] animate-in fade-in slide-in-from-top-2 duration-150">
          <div className="flex items-center justify-between mb-2">
            <span className="text-[11px] font-black uppercase text-[#6C5CE7] tracking-wider">
              Spellbook API Cheat Sheet (Click to Insert)
            </span>
            <span className="text-[10px] text-[#7E7E8F]">Click any snippet to append to code</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-1.5">
            {SPELLBOOK_METHODS.map((method, idx) => (
              <button
                key={`spell-${idx}`}
                onClick={() => insertSnippet(method.code)}
                type="button"
                className="text-left p-2 rounded-lg bg-white border border-[#1E1E24]/20 hover:border-[#6C5CE7] hover:bg-[#EDE9FE]/50 transition-colors cursor-pointer group"
              >
                <code className="text-xs font-mono font-bold text-[#6C5CE7] block group-hover:text-[#5843D8]">
                  + {method.code}
                </code>
                <span className="text-[10px] text-[#7E7E8F] block mt-0.5">{method.desc}</span>
              </button>
            ))}
          </div>
        </div>
      )}

      {/* 3. Main Body: Code Editor Tab vs Blueprints Tab */}
      {activeTab === 'editor' ? (
        <div className="bg-[#181920] border-2 border-[#1E1E24] shadow-[6px_6px_0px_#1E1E24] rounded-2xl overflow-hidden flex flex-col flex-1 min-h-[340px]">
          {/* Editor Sub-header */}
          <div className="p-3 bg-[#22232E] border-b-2 border-[#12131A] flex items-center justify-between text-xs text-slate-200 font-mono">
            <div className="flex items-center gap-2">
              <span className="w-3 h-3 rounded-full bg-[#FF5F56] border border-[#E0443E]" />
              <span className="w-3 h-3 rounded-full bg-[#FFBD2E] border border-[#DEA123]" />
              <span className="w-3 h-3 rounded-full bg-[#27C93F] border border-[#1AAB29]" />
              <span className="ml-2 font-black text-[#FFD214] tracking-wide">hero_script.py</span>
            </div>
            <span className="text-[11px] text-gray-400 font-bold bg-[#161720] px-2 py-0.5 rounded border border-gray-700">Python 3.12 Engine</span>
          </div>

          {/* Code Editor with Line Numbers */}
          <div className="flex flex-1 relative font-mono text-xs overflow-hidden bg-[#181920]">
            {/* Line Numbers Gutter */}
            <div className="w-11 bg-[#12131A] text-gray-500 font-mono text-[11px] select-none py-3 text-right pr-2.5 border-r border-[#2A2B38] shrink-0">
              {Array.from({ length: lineCount }).map((_, i) => (
                <div key={`line-${i + 1}`} className="leading-[1.4rem]">{i + 1}</div>
              ))}
            </div>

            {/* Editable Text Area (High-Contrast White/Mint text on dark editor background) */}
            <textarea
              value={code}
              onChange={(e) => onChangeCode(e.target.value)}
              spellCheck={false}
              className="flex-1 bg-[#181920] text-[#F8FAFC] p-3 leading-[1.4rem] resize-none outline-none font-mono text-xs sm:text-[13px] overflow-y-auto selection:bg-[#6C5CE7] selection:text-white caret-[#FFD214] placeholder-gray-600"
              placeholder="# Write your Python dungeon commands here..."
            />
          </div>

          {/* 4. Execution Controls Action Bar */}
          <div className="p-3 bg-[#22232E] border-t-2 border-[#12131A] flex flex-wrap items-center justify-between gap-2">
            <div className="flex items-center gap-2">
              {/* Primary Run Code Button */}
              <button
                onClick={onRunCode}
                disabled={isRunning}
                className={`btn-arcade text-xs py-2 px-4 shadow-[2px_2px_0px_#1E1E24] flex items-center gap-1.5 cursor-pointer ${
                  isRunning
                    ? 'bg-slate-500 text-white opacity-80 cursor-not-allowed'
                    : 'btn-arcade-yellow'
                }`}
              >
                <Play className="w-3.5 h-3.5 fill-current" />
                <span>{isRunning ? 'Running...' : 'Run Code ▶'}</span>
              </button>

              {/* Step Forward Debugger */}
              <button
                onClick={onStepForward}
                disabled={isRunning}
                className="btn-arcade text-xs py-2 px-3 btn-arcade-white flex items-center gap-1 cursor-pointer"
                title="Execute next step frame"
              >
                <StepForward className="w-3.5 h-3.5" />
                <span>Step ⏭</span>
              </button>

              {/* Reset Floor */}
              <button
                onClick={onResetFloor}
                className="btn-arcade text-xs py-2 px-3 btn-arcade-white flex items-center gap-1 cursor-pointer text-[#EF4444]"
                title="Reset avatar and tiles to starting state"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>Reset ↺</span>
              </button>
            </div>

            {/* Speed Toggle (1x / 2x) */}
            <button
              onClick={onToggleSpeed}
              className="btn-arcade text-xs py-1.5 px-3 bg-[#6C5CE7] text-white flex items-center gap-1 cursor-pointer"
              title="Toggle execution animation speed"
            >
              <FastForward className="w-3 h-3" />
              <span>Speed: {speed}x</span>
            </button>
          </div>
        </div>
      ) : (
        /* Crafting & Blueprints Tab */
        <div className="card-game p-4 bg-white border-2 border-[#1E1E24] shadow-[4px_4px_0px_#1E1E24] flex-1 overflow-y-auto space-y-3">
          <div className="flex items-center justify-between mb-1">
            <h3 className="font-serif font-black text-sm text-[#1E1E24]">
              Available Crafting Blueprints
            </h3>
            <span className="text-[11px] text-[#7E7E8F]">
              Collect blocks to unlock recipes
            </span>
          </div>

          {CRAFTING_RECIPES.map((recipe, idx) => (
            <div
              key={`blueprint-${idx}`}
              className="p-3 rounded-xl border border-[#1E1E24]/20 bg-[#FAF6EE] flex items-center justify-between gap-3"
            >
              <div className="flex items-center gap-2.5">
                <span className="text-2xl">{recipe.icon}</span>
                <div>
                  <h4 className="font-bold text-xs text-[#1E1E24]">{recipe.name}</h4>
                  <p className="text-[11px] text-[#4A4A58]">{recipe.description}</p>
                </div>
              </div>

              <button
                onClick={() => insertSnippet(`hero.craft("${recipe.id}")`)}
                className="btn-arcade text-[10px] py-1.5 px-3 btn-arcade-yellow cursor-pointer shrink-0"
              >
                + hero.craft(&quot;{recipe.id}&quot;)
              </button>
            </div>
          ))}
        </div>
      )}

      {/* 5. Acharya AI Socratic Mentor Console Dock */}
      <DungeonAcharyaConsole
        logs={logs}
        diagnostic={diagnostic}
        floorNumber={floorNumber}
        code={code}
        onClearLogs={() => {}}
      />
    </div>
  );
}
