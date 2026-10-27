// Dronacharya Code Dungeon & Craft Realm: Crafting & Blueprints Recipe Book
'use client';

import React from 'react';
import {
  CRAFTING_RECIPES,
  DungeonInventory,
  CraftingRecipe,
} from '@/lib/simulator/dungeon-engine';
import { DungeonSound } from '@/lib/simulator/audio-synth';
import { X, Sparkles, Check, AlertCircle, Wrench, ArrowRight } from 'lucide-react';

interface CraftingModalProps {
  isOpen: boolean;
  onClose: () => void;
  inventory: DungeonInventory;
  onCraftItem: (recipe: CraftingRecipe) => void;
  onInsertCodeSnippet: (snippet: string) => void;
}

export function CraftingModal({
  isOpen,
  onClose,
  inventory,
  onCraftItem,
  onInsertCodeSnippet,
}: CraftingModalProps) {
  if (!isOpen) return null;

  const canCraft = (recipe: CraftingRecipe) => {
    return Object.entries(recipe.requirements).every(([item, reqCount]) => {
      const current = inventory[item as keyof DungeonInventory] || 0;
      return current >= (reqCount || 0);
    });
  };

  const handleCraft = (recipe: CraftingRecipe) => {
    if (!canCraft(recipe)) return;
    DungeonSound.playCraft();
    onCraftItem(recipe);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs select-none">
      <div className="relative w-full max-w-xl bg-[#FAF6EE] border-4 border-[#1E1E24] rounded-2xl shadow-[8px_8px_0px_#1E1E24] overflow-hidden animate-in fade-in zoom-in-95 duration-150">
        {/* Header */}
        <div className="p-4 sm:p-5 bg-[#EDE9FE] border-b-2 border-[#1E1E24] flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-xl bg-[#6C5CE7] border-2 border-[#1E1E24] shadow-[2px_2px_0px_#1E1E24] flex items-center justify-center text-xl text-white">
              ⚒️
            </div>
            <div>
              <h2 className="font-serif font-black text-lg sm:text-xl text-[#1E1E24]">
                Dungeon Craft &amp; Recipe Book
              </h2>
              <p className="text-xs text-[#4A4A58] font-bold">
                Minecraft-style block &amp; tool crafting station
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="w-8 h-8 rounded-lg bg-white border-2 border-[#1E1E24] hover:bg-slate-100 flex items-center justify-center text-[#1E1E24] font-black shadow-[2px_2px_0px_#1E1E24] cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Current Resources Hotbar Strip */}
        <div className="p-3 bg-white border-b-2 border-[#1E1E24] flex items-center justify-around text-xs font-bold">
          <span className="flex items-center gap-1.5">
            <span>🪵 Wood:</span>
            <strong className="text-[#D97706] font-mono text-sm">{inventory.wood}</strong>
          </span>
          <span className="flex items-center gap-1.5">
            <span>🪨 Stone:</span>
            <strong className="text-slate-600 font-mono text-sm">{inventory.stone}</strong>
          </span>
          <span className="flex items-center gap-1.5">
            <span>⛏️ Iron:</span>
            <strong className="text-[#EA580C] font-mono text-sm">{inventory.iron}</strong>
          </span>
          <span className="flex items-center gap-1.5">
            <span>💎 Crystal:</span>
            <strong className="text-[#0284C7] font-mono text-sm">{inventory.crystal}</strong>
          </span>
        </div>

        {/* Recipes Grid */}
        <div className="p-4 sm:p-5 max-h-[60vh] overflow-y-auto space-y-3">
          {CRAFTING_RECIPES.map((recipe, idx) => {
            const isCraftable = canCraft(recipe);

            return (
              <div
                key={`recipe-${recipe.name}-${idx}`}
                className={`card-game p-3.5 sm:p-4 border-2 border-[#1E1E24] flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 transition-colors ${
                  isCraftable ? 'bg-white' : 'bg-[#F2ECE0]/60 opacity-80'
                }`}
              >
                {/* Left info */}
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-xl bg-[#FAF6EE] border-2 border-[#1E1E24] shadow-[2px_2px_0px_#1E1E24] flex items-center justify-center text-2xl shrink-0">
                    {recipe.icon}
                  </div>
                  <div>
                    <h3 className="font-serif font-black text-sm sm:text-base text-[#1E1E24] flex items-center gap-2">
                      <span>{recipe.name}</span>
                      {inventory[recipe.id] > 0 && (
                        <span className="text-[10px] font-sans font-bold bg-[#D1FAE5] text-[#059669] px-2 py-0.5 rounded-full border border-[#059669]/30">
                          Owned: {inventory[recipe.id]}
                        </span>
                      )}
                    </h3>
                    <p className="text-xs text-[#4A4A58] mb-2">{recipe.description}</p>

                    {/* Required materials */}
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="text-[11px] font-bold text-[#7E7E8F]">Requires:</span>
                      {Object.entries(recipe.requirements).map(([mat, count]) => {
                        const current = inventory[mat as keyof DungeonInventory] || 0;
                        const hasEnough = current >= (count || 0);

                        return (
                          <span
                            key={mat}
                            className={`text-[10px] font-bold px-2 py-0.5 rounded border flex items-center gap-1 ${
                              hasEnough
                                ? 'bg-[#D1FAE5] text-[#065F46] border-[#059669]/40'
                                : 'bg-[#FEE2E2] text-[#991B1B] border-[#DC2626]/40'
                            }`}
                          >
                            <span>
                              {mat === 'wood'
                                ? '🪵 Wood'
                                : mat === 'stone'
                                ? '🪨 Stone'
                                : mat === 'iron'
                                ? '⛏️ Iron'
                                : '💎 Crystal'}
                              :
                            </span>
                            <strong>
                              {current}/{count}
                            </strong>
                            {hasEnough ? (
                              <Check className="w-3 h-3 text-[#059669]" />
                            ) : (
                              <AlertCircle className="w-3 h-3 text-[#DC2626]" />
                            )}
                          </span>
                        );
                      })}
                    </div>
                  </div>
                </div>

                {/* Right Actions */}
                <div className="flex items-center gap-2 self-end sm:self-center shrink-0">
                  <button
                    onClick={() => {
                      onInsertCodeSnippet(`hero.craft("${recipe.id}")`);
                      onClose();
                    }}
                    className="btn-arcade text-xs py-1.5 px-3 btn-arcade-white cursor-pointer"
                    title="Insert code into editor"
                  >
                    <span>Insert Code</span>
                  </button>

                  <button
                    onClick={() => handleCraft(recipe)}
                    disabled={!isCraftable}
                    className={`btn-arcade text-xs py-1.5 px-4 cursor-pointer ${
                      isCraftable ? 'btn-arcade-yellow' : 'opacity-40 cursor-not-allowed bg-slate-200'
                    }`}
                  >
                    <Sparkles className="w-3.5 h-3.5" />
                    <span>Craft Now</span>
                  </button>
                </div>
              </div>
            );
          })}
        </div>

        {/* Footer info note */}
        <div className="p-3 bg-[#FAF6EE] border-t-2 border-[#1E1E24] text-center text-xs text-[#7E7E8F] font-medium">
          💡 You can craft manually here or automate it in your code using <code className="bg-white px-1.5 py-0.5 rounded border border-[#1E1E24]/20 font-bold text-[#6C5CE7]">hero.craft(&quot;bridge&quot;)</code>.
        </div>
      </div>
    </div>
  );
}
