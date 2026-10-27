// Dronacharya Code Dungeon: Interactive 2D/2.5D RPG Dungeon Canvas
// Features animated Hero states (idle, walk, attack, hurt, victory), floating combat numbers,
// speech bubbles, floating HP bars, screen shake, and tile inspection.
'use client';

import React, { useState, useEffect } from 'react';
import {
  TileData,
  Direction,
  GameFrame,
  EnemyEntity,
  GemEntity,
  SwitchEntity,
  GateEntity,
  CrystalEntity,
} from '@/lib/simulator/dungeon-engine';
import {
  Sparkles,
  Shield,
  Zap,
  Lock,
  Unlock,
  Flame,
  AlertTriangle,
  Heart,
  MessageSquare,
  Crosshair,
  Volume2,
  Sword,
  Target,
} from 'lucide-react';

interface DungeonCanvasProps {
  gridWidth: number;
  gridHeight: number;
  tiles: TileData[];
  heroX: number;
  heroY: number;
  facing: Direction;
  heroHp: number;
  maxHp?: number;
  activeFrame?: GameFrame | null;
  pathTrail?: { x: number; y: number }[];
  isAnimating?: boolean;
  enemies?: EnemyEntity[];
  gems?: GemEntity[];
  switches?: SwitchEntity[];
  gates?: GateEntity[];
  crystals?: CrystalEntity[];
  onQuickInsertCode?: (codeSnippet: string) => void;
  onTileInspect?: (x: number, y: number, tileType: string) => void;
}

export function DungeonCanvas({
  gridWidth = 10,
  gridHeight = 8,
  tiles,
  heroX,
  heroY,
  facing,
  heroHp,
  maxHp = 100,
  activeFrame,
  pathTrail = [],
  isAnimating = false,
  enemies = [],
  gems = [],
  switches = [],
  gates = [],
  crystals = [],
  onQuickInsertCode,
  onTileInspect,
}: DungeonCanvasProps) {
  const [selectedTile, setSelectedTile] = useState<{ x: number; y: number; type: string } | null>(null);
  const [isShaking, setIsShaking] = useState(false);

  // Trigger screen shake when activeFrame requests it
  useEffect(() => {
    if (activeFrame?.shakeScreen) {
      setIsShaking(true);
      const timer = setTimeout(() => setIsShaking(false), 400);
      return () => clearTimeout(timer);
    }
  }, [activeFrame]);

  // Handle tile inspection click
  const handleTileClick = (x: number, y: number) => {
    const tile = tiles.find((t) => t.x === x && t.y === y);
    const enemy = enemies.find((e) => e.x === x && e.y === y && e.hp > 0);
    const gem = gems.find((g) => g.x === x && g.y === y && !g.collected);
    const sw = switches.find((s) => s.x === x && s.y === y);
    const gate = gates.find((g) => g.x === x && g.y === y);
    const crystal = crystals.find((c) => c.x === x && c.y === y && !c.used);

    let desc: string = tile?.type || 'stone';
    if (enemy) desc = `${enemy.name} (${enemy.hp} HP)`;
    else if (gem) desc = 'Mana Gem 💎';
    else if (sw) desc = 'Pressure Switch ⚙️';
    else if (gate) desc = gate.isOpen ? 'Gate (Open) 🔓' : 'Gate (Locked) 🔒';
    else if (crystal) desc = 'Healing Crystal 💚';

    setSelectedTile({ x, y, type: desc });
    if (onTileInspect) onTileInspect(x, y, desc);
  };

  // Determine hero action state for animation
  const actionType = activeFrame?.actionType || 'idle';
  const speechBubble = activeFrame?.speechBubble;
  const floatingText = activeFrame?.floatingText;

  // Rotation angles for direction
  const facingRotation: Record<Direction, string> = {
    right: 'rotate-0',
    down: 'rotate-90',
    left: 'scale-x-[-1]',
    up: '-rotate-90',
  };

  return (
    <div className="relative w-full flex flex-col items-center select-none">
      {/* 1. Header Toolbar & Selected Tile Inspector */}
      <div className="w-full mb-3 flex items-center justify-between text-xs font-bold text-[#4A4A58] px-1">
        <div className="flex items-center gap-2">
          <span className="flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-white border border-[#1E1E24]/20 shadow-xs">
            <span className="w-2.5 h-2.5 rounded-full bg-[#10B981] inline-block animate-pulse" />
            <span className="font-mono text-xs">
              Dungeon Grid ({gridWidth}x{gridHeight})
            </span>
          </span>
          <span className="text-[11px] text-[#7E7E8F] hidden sm:inline">
            Click any tile to inspect coordinates &amp; monsters
          </span>
        </div>

        {selectedTile && (
          <div className="flex items-center gap-2 bg-[#EDE9FE] px-2.5 py-1 rounded-lg border border-[#6C5CE7]/30 text-[11px] font-mono">
            <span className="font-bold text-[#6C5CE7]">
              ({selectedTile.x}, {selectedTile.y})
            </span>
            <span className="text-[#1E1E24] font-semibold">[{selectedTile.type}]</span>
            {onQuickInsertCode && (
              <button
                onClick={() => {
                  const dx = selectedTile.x - heroX;
                  const dy = selectedTile.y - heroY;
                  if (dx > 0) onQuickInsertCode(`hero.move_right(${dx})`);
                  else if (dx < 0) onQuickInsertCode(`hero.move_left(${Math.abs(dx)})`);
                  if (dy > 0) onQuickInsertCode(`hero.move_down(${dy})`);
                  else if (dy < 0) onQuickInsertCode(`hero.move_up(${Math.abs(dy)})`);
                }}
                className="px-1.5 py-0.5 rounded bg-[#6C5CE7] text-white text-[10px] font-bold hover:bg-[#5848c2]"
                title="Insert move commands to this tile"
              >
                + Walk Here
              </button>
            )}
          </div>
        )}
      </div>

      {/* 2. Main Dungeon Grid Canvas Stage */}
      <div
        className={`relative w-full max-w-[580px] p-2.5 bg-[#1F1E24] rounded-2xl border-4 border-[#1E1E24] shadow-[8px_8px_0px_#1E1E24] overflow-hidden transition-transform duration-100 ${
          isShaking ? 'translate-x-1 translate-y-1 rotate-0.5 ring-4 ring-red-500/50' : ''
        }`}
      >
        {/* Subtle Ambient Vignette & Torch Glow */}
        <div className="absolute inset-0 pointer-events-none bg-[radial-gradient(circle_at_center,transparent_40%,rgba(0,0,0,0.6)_100%)] z-10" />

        {/* X Coordinate Rulers (Top) */}
        <div
          className="grid gap-1 mb-1.5 px-0.5"
          style={{ gridTemplateColumns: `repeat(${gridWidth}, minmax(0, 1fr))` }}
        >
          {Array.from({ length: gridWidth }).map((_, i) => (
            <span
              key={`col-${i}`}
              className={`text-center text-[10px] font-mono font-black transition-colors ${
                heroX === i ? 'text-[#FBBF24] scale-110' : 'text-[#64748B]'
              }`}
            >
              {i}
            </span>
          ))}
        </div>

        {/* Grid Arena */}
        <div
          className="grid gap-1 w-full relative"
          style={{
            gridTemplateColumns: `repeat(${gridWidth}, minmax(0, 1fr))`,
            gridTemplateRows: `repeat(${gridHeight}, minmax(0, 1fr))`,
            aspectRatio: `${gridWidth} / ${gridHeight}`,
          }}
        >
          {/* Path Trail Overlays */}
          {pathTrail.map((p, idx) => (
            <div
              key={`trail-${p.x}-${p.y}-${idx}`}
              className="absolute pointer-events-none rounded-xs bg-[#6C5CE7]/20 border border-[#6C5CE7]/30 transition-opacity duration-300"
              style={{
                left: `${(p.x / gridWidth) * 100}%`,
                top: `${(p.y / gridHeight) * 100}%`,
                width: `${100 / gridWidth}%`,
                height: `${100 / gridHeight}%`,
                zIndex: 4,
              }}
            />
          ))}

          {/* Grid Tiles */}
          {Array.from({ length: gridHeight }).map((_, y) =>
            Array.from({ length: gridWidth }).map((_, x) => {
              const tile = tiles.find((t) => t.x === x && t.y === y);
              const enemy = enemies.find((e) => e.x === x && e.y === y && e.hp > 0);
              const gem = gems.find((g) => g.x === x && g.y === y && !g.collected);
              const sw = switches.find((s) => s.x === x && s.y === y);
              const gate = gates.find((g) => g.x === x && g.y === y);
              const crystal = crystals.find((c) => c.x === x && c.y === y && !c.used);

              const isHeroOnTile = heroX === x && heroY === y;
              const isSelected = selectedTile?.x === x && selectedTile?.y === y;
              const tileType = tile?.type || 'stone';

              // Visual styling per tile
              let tileBg = 'bg-[#2B2A33] border-[#3F3D4A] hover:border-[#6C5CE7]';
              let tileIcon = null;

              if (tileType === 'wall') {
                tileBg = 'bg-[#18181C] border-[#101014] shadow-inner';
                tileIcon = <div className="w-full h-full bg-[#141418] rounded-xs opacity-60" />;
              } else if (tileType === 'spike') {
                tileBg = 'bg-[#3A2828] border-[#7F1D1D]';
                tileIcon = <span className="text-xs sm:text-sm animate-pulse">⚙️</span>;
              } else if (tileType === 'lava') {
                tileBg = 'bg-[#451A03] border-[#B45309]';
                tileIcon = <Flame className="w-3.5 h-3.5 text-[#F59E0B] animate-bounce" />;
              } else if (tileType === 'portal') {
                tileBg = 'bg-[#1E3A8A] border-[#3B82F6] shadow-[0_0_12px_rgba(59,130,246,0.6)]';
                tileIcon = (
                  <span className="text-base sm:text-lg animate-spin" style={{ animationDuration: '4s' }}>
                    🌀
                  </span>
                );
              }

              // Overwrite with dynamic entities
              if (gem) {
                tileIcon = (
                  <span className="text-base sm:text-lg animate-bounce drop-shadow-[0_0_8px_rgba(56,189,248,0.8)]">
                    💎
                  </span>
                );
              } else if (crystal) {
                tileIcon = (
                  <span className="text-base sm:text-lg animate-pulse drop-shadow-[0_0_10px_rgba(16,185,129,0.8)]">
                    💚
                  </span>
                );
              } else if (sw) {
                tileIcon = <span className="text-sm sm:text-base">{sw.toggled ? '🟢' : '🔘'}</span>;
              } else if (gate) {
                tileIcon = (
                  <span className="text-sm sm:text-base">{gate.isOpen ? '🔓' : '🔒'}</span>
                );
                if (!gate.isOpen) {
                  tileBg = 'bg-[#2A2323] border-[#991B1B]';
                }
              } else if (enemy) {
                const isBoss = enemy.type === 'boss';
                tileIcon = (
                  <div className="relative flex flex-col items-center justify-center w-full h-full">
                    {/* Floating Enemy HP Bar */}
                    <div className="absolute -top-2 w-full px-1 z-20">
                      <div className="w-full h-1.5 bg-black/80 rounded-full border border-black overflow-hidden">
                        <div
                          className={`h-full transition-all duration-200 ${
                            isBoss ? 'bg-[#EF4444]' : 'bg-[#F59E0B]'
                          }`}
                          style={{ width: `${(enemy.hp / enemy.maxHp) * 100}%` }}
                        />
                      </div>
                    </div>
                    <span
                      className={`${
                        isBoss ? 'text-2xl sm:text-3xl animate-pulse' : 'text-base sm:text-xl'
                      }`}
                    >
                      {isBoss ? '🗿' : enemy.type === 'skeleton' ? '💀' : '👺'}
                    </span>
                  </div>
                );
              }

              return (
                <div
                  key={`tile-${x}-${y}`}
                  onClick={() => handleTileClick(x, y)}
                  className={`relative flex items-center justify-center rounded-sm border cursor-pointer transition-all duration-150 ${tileBg} ${
                    isSelected ? 'ring-2 ring-[#6C5CE7] ring-offset-1 ring-offset-[#1F1E24]' : ''
                  }`}
                >
                  {tileIcon}

                  {/* Highlight current Hero position */}
                  {isHeroOnTile && (
                    <div
                      className={`absolute inset-0 z-30 flex items-center justify-center transition-all duration-200 ${
                        actionType === 'attack'
                          ? 'scale-125'
                          : actionType === 'hurt'
                          ? 'animate-ping'
                          : 'scale-100'
                      }`}
                    >
                      {/* Floating Hero Health Pill */}
                      <div className="absolute -top-3.5 z-40 flex items-center gap-0.5 bg-black/85 px-1 py-0.2 rounded-full border border-black shadow-xs">
                        <span className="text-[8px] text-[#10B981] font-mono font-bold leading-none">
                          {heroHp}HP
                        </span>
                      </div>

                      {/* Hero Sprite Avatar */}
                      <div
                        className={`relative flex items-center justify-center text-xl sm:text-2xl transition-transform ${
                          facingRotation[facing]
                        } ${actionType === 'victory' ? 'animate-bounce' : ''}`}
                      >
                        🧙‍♂️
                      </div>
                    </div>
                  )}
                </div>
              );
            })
          )}
        </div>

        {/* 3. Floating Speech Bubble Overlay (hero.say) */}
        {speechBubble && (
          <div
            className="absolute z-50 pointer-events-none transition-all duration-200"
            style={{
              left: `${Math.min(75, Math.max(10, (heroX / gridWidth) * 100))}%`,
              top: `${Math.max(5, (heroY / gridHeight) * 100 - 15)}%`,
            }}
          >
            <div className="relative bg-[#FAF6EE] text-[#1E1E24] text-xs font-bold font-mono px-3 py-1.5 rounded-xl border-2 border-[#1E1E24] shadow-[3px_3px_0px_#1E1E24] flex items-center gap-1.5 animate-in zoom-in-95">
              <MessageSquare className="w-3.5 h-3.5 text-[#6C5CE7] shrink-0" />
              <span>&quot;{speechBubble}&quot;</span>
              <div className="absolute -bottom-1.5 left-4 w-3 h-3 bg-[#FAF6EE] border-b-2 border-r-2 border-[#1E1E24] rotate-45" />
            </div>
          </div>
        )}

        {/* 4. Floating Damage / Loot Pop-up */}
        {floatingText && (
          <div
            className="absolute z-50 pointer-events-none transition-all duration-300"
            style={{
              left: `${(heroX / gridWidth) * 100 + 4}%`,
              top: `${(heroY / gridHeight) * 100 - 8}%`,
            }}
          >
            <span
              className="text-xs sm:text-sm font-black font-mono px-2 py-0.5 rounded-md bg-black/80 border border-white/20 shadow-md animate-bounce"
              style={{ color: floatingText.color }}
            >
              {floatingText.text}
            </span>
          </div>
        )}
      </div>

      {/* 5. Live Legend & Controls Bar */}
      <div className="w-full max-w-[580px] mt-2.5 flex flex-wrap items-center justify-between gap-2 px-1 text-[11px] font-mono text-[#64748B]">
        <div className="flex items-center gap-3">
          <span className="flex items-center gap-1">
            <span>🧙‍♂️</span> <span>Hero</span>
          </span>
          <span className="flex items-center gap-1">
            <span>💎</span> <span>Mana Gem</span>
          </span>
          <span className="flex items-center gap-1">
            <span>👺</span> <span>Monster</span>
          </span>
          <span className="flex items-center gap-1">
            <span>🌀</span> <span>Portal</span>
          </span>
        </div>

        <div className="flex items-center gap-1 font-bold text-[#1E1E24]">
          <span>Hero Pos:</span>
          <span className="text-[#6C5CE7]">({heroX}, {heroY})</span>
        </div>
      </div>
    </div>
  );
}
