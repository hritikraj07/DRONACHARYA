// Dronacharya Code Dungeon & Craft Realm: Interactive 2D Grid & Voxel Renderer
'use client';

import React, { useState } from 'react';
import {
  TileData,
  Direction,
  DungeonSimulationFrame,
} from '@/lib/simulator/dungeon-engine';
import {
  Sparkles,
  Info,
  Flame,
  Shield,
  Pickaxe,
  Zap,
  Lock,
  Layers,
  ChevronRight,
  Eye,
  AlertTriangle,
} from 'lucide-react';

interface DungeonCanvasProps {
  tiles: TileData[];
  heroX: number;
  heroY: number;
  facing: Direction;
  heroHp: number;
  activeFrame?: DungeonSimulationFrame | null;
  pathTrail?: { x: number; y: number }[];
  isAnimating?: boolean;
  onTileInspect?: (tile: TileData) => void;
  onQuickInsertCode?: (codeSnippet: string) => void;
  bossHp?: number;
}

export function DungeonCanvas({
  tiles,
  heroX,
  heroY,
  facing,
  heroHp,
  activeFrame,
  pathTrail = [],
  isAnimating = false,
  onTileInspect,
  onQuickInsertCode,
  bossHp = 100,
}: DungeonCanvasProps) {
  const [selectedTile, setSelectedTile] = useState<TileData | null>(null);

  const handleTileClick = (t: TileData) => {
    setSelectedTile(t);
    if (onTileInspect) onTileInspect(t);
  };

  // Determine direction rotation angle for hero
  const facingRotation: Record<Direction, number> = {
    up: -90,
    down: 90,
    left: 180,
    right: 0,
  };

  return (
    <div className="relative w-full flex flex-col items-center select-none">
      {/* 1. Canvas Top Control & Legend Ribbon */}
      <div className="w-full mb-3 flex items-center justify-between text-xs font-bold text-[#4A4A58] px-1">
        <div className="flex items-center gap-2">
          <span className="flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-white border border-[#1E1E24]/20 shadow-xs">
            <span className="w-2.5 h-2.5 rounded-full bg-[#10B981] inline-block animate-pulse" />
            <span>Interactive 10x10 Dungeon Grid</span>
          </span>
          <span className="text-[11px] text-[#7E7E8F] hidden sm:inline">
            Click any tile to inspect coordinates &amp; properties
          </span>
        </div>

        {/* Selected Tile Mini Coordinates Indicator */}
        {selectedTile && (
          <div className="flex items-center gap-1 text-[11px] font-mono font-black text-[#6C5CE7] bg-[#EDE9FE] px-2 py-0.5 rounded border border-[#6C5CE7]/30">
            <span>Tile: ({selectedTile.x}, {selectedTile.y})</span>
            <span className="uppercase text-[10px]">[{selectedTile.type}]</span>
          </div>
        )}
      </div>

      {/* 2. Main 10x10 Grid Viewport */}
      <div className="relative w-full max-w-[560px] aspect-square p-2 bg-[#2D2A32] rounded-2xl border-4 border-[#1E1E24] shadow-[6px_6px_0px_#1E1E24] overflow-hidden">
        {/* Background Grid Pattern */}
        <div className="absolute inset-0 opacity-15 pointer-events-none bg-[radial-gradient(#FAF6EE_1px,transparent_1px)] [background-size:16px_16px]" />

        {/* Coordinate Headers: Top (X: 0 to 9) */}
        <div className="grid grid-cols-10 gap-1 mb-1 px-1">
          {Array.from({ length: 10 }).map((_, i) => (
            <span
              key={`col-${i}`}
              className={`text-center text-[10px] font-mono font-black transition-colors ${
                heroX === i ? 'text-[#FBBF24] scale-110 font-bold' : 'text-[#7E7E8F]'
              }`}
            >
              {i}
            </span>
          ))}
        </div>

        {/* 10x10 Tile Grid Container */}
        <div className="grid grid-cols-10 grid-rows-10 gap-1 w-full h-[calc(100%-20px)] relative">
          {/* Path Trail Overlay */}
          {pathTrail.map((p, idx) => (
            <div
              key={`trail-${p.x}-${p.y}-${idx}`}
              className="absolute pointer-events-none transition-opacity duration-300 rounded-sm bg-[#6C5CE7]/25 border border-[#6C5CE7]/40"
              style={{
                left: `${p.x * 10}%`,
                top: `${p.y * 10}%`,
                width: '10%',
                height: '10%',
                zIndex: 5,
              }}
            />
          ))}

          {/* Grid Tiles */}
          {tiles.map((tile) => {
            const isHeroHere = heroX === tile.x && heroY === tile.y;
            const isSelected = selectedTile?.x === tile.x && selectedTile?.y === tile.y;

            return (
              <button
                key={`tile-${tile.x}-${tile.y}`}
                onClick={() => handleTileClick(tile)}
                type="button"
                className={`relative w-full h-full rounded-md flex items-center justify-center transition-all cursor-pointer overflow-hidden group ${
                  isSelected
                    ? 'ring-2 ring-[#FBBF24] ring-offset-1 ring-offset-[#2D2A32] z-10 scale-105'
                    : 'hover:brightness-110'
                }`}
                style={{
                  ...getTileStyle(tile.type),
                }}
                title={`(${tile.x}, ${tile.y}) - ${tile.type}`}
              >
                {/* Visual Icon for Tile Type */}
                {renderTileContent(tile, bossHp)}

                {/* Subtile Hover Coordinate Badge */}
                <div className="absolute bottom-0 right-0 px-0.5 text-[8px] font-mono font-black opacity-0 group-hover:opacity-100 bg-black/60 text-white rounded-tl pointer-events-none transition-opacity">
                  {tile.x},{tile.y}
                </div>
              </button>
            );
          })}

          {/* Animated Apprentice Hero Sprite */}
          <div
            className={`absolute flex items-center justify-center pointer-events-none transition-all duration-200 z-20 ${
              isAnimating ? 'will-change-transform' : ''
            }`}
            style={{
              left: `${heroX * 10}%`,
              top: `${heroY * 10}%`,
              width: '10%',
              height: '10%',
            }}
          >
            {/* Hero Character Container */}
            <div className="relative w-full h-full p-0.5 flex items-center justify-center">
              {/* Pulsing Aura */}
              <div className="absolute inset-0 rounded-full bg-[#FBBF24]/40 animate-ping opacity-60 scale-75" />

              {/* Main Avatar Token */}
              <div
                className="w-full h-full rounded-lg bg-[#FAF6EE] border-2 border-[#1E1E24] shadow-[2px_2px_0px_#1E1E24] flex items-center justify-center text-sm sm:text-base relative transition-transform duration-150"
                style={{
                  filter: activeFrame?.action === 'damage' ? 'drop-shadow(0 0 6px #EF4444)' : 'none',
                }}
              >
                {/* Hero Mascot Emoji / Avatar */}
                <span className="scale-110">🧙‍♂️</span>

                {/* Direction Pointer Arrow */}
                <div
                  className="absolute -top-1.5 w-2 h-2 border-l-2 border-t-2 border-[#FBBF24] rotate-45 transition-transform duration-150"
                  style={{
                    transform: `rotate(${facingRotation[facing] + 45}deg)`,
                  }}
                />
              </div>

              {/* Floating Action Text Toast */}
              {activeFrame?.floatingText && (
                <div
                  className="absolute -top-7 whitespace-nowrap px-2 py-0.5 rounded-full text-[10px] font-black border border-[#1E1E24] shadow-[1.5px_1.5px_0px_#1E1E24] animate-bounce z-30"
                  style={{
                    backgroundColor: '#1E1E24',
                    color: activeFrame.floatingText.color,
                  }}
                >
                  {activeFrame.floatingText.text}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* 3. Interactive Tile Inspector Drawer */}
      {selectedTile && (
        <div className="w-full max-w-[560px] mt-3 p-3.5 bg-white border-2 border-[#1E1E24] rounded-xl shadow-[4px_4px_0px_#1E1E24] flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 animate-in fade-in slide-in-from-top-2 duration-200">
          <div className="flex items-center gap-3">
            <div
              className="w-10 h-10 rounded-lg border-2 border-[#1E1E24] flex items-center justify-center text-xl shrink-0 shadow-[2px_2px_0px_#1E1E24]"
              style={getTileStyle(selectedTile.type)}
            >
              {getTileEmoji(selectedTile.type)}
            </div>

            <div className="space-y-0.5">
              <div className="flex items-center gap-2">
                <span className="font-serif font-black text-sm text-[#1E1E24] capitalize">
                  {selectedTile.type === 'wood'
                    ? 'Whispering Tree'
                    : selectedTile.type === 'stone'
                    ? 'Quarry Granite'
                    : selectedTile.type === 'crystal'
                    ? 'Mana Crystal Geode'
                    : selectedTile.type === 'iron'
                    ? 'Iron Ore Vein'
                    : selectedTile.type === 'lava'
                    ? 'Molten Lava Fissure'
                    : selectedTile.type === 'bridge'
                    ? 'Walkable Bridge'
                    : selectedTile.type === 'boss'
                    ? 'Syntax Golem Titan'
                    : selectedTile.type === 'portal'
                    ? 'Sanctuary Gateway'
                    : selectedTile.type === 'mimic'
                    ? 'Corrupted Bug Mimic'
                    : selectedTile.type}
                </span>
                <span className="font-mono text-[11px] font-black text-[#6C5CE7] bg-[#EDE9FE] px-2 py-0.5 rounded border border-[#6C5CE7]/30">
                  x: {selectedTile.x}, y: {selectedTile.y}
                </span>
              </div>
              <p className="text-[11px] text-[#4A4A58]">
                {getTileDescription(selectedTile)}
              </p>
            </div>
          </div>

          {/* Quick-Code Helper Buttons */}
          <div className="flex items-center gap-1.5 self-end sm:self-center shrink-0">
            {['wood', 'stone', 'iron', 'crystal'].includes(selectedTile.type) && onQuickInsertCode && (
              <button
                onClick={() =>
                  onQuickInsertCode(
                    `hero.mine("${getRelativeDirection(heroX, heroY, selectedTile.x, selectedTile.y)}")`
                  )
                }
                className="btn-arcade text-[10px] py-1.5 px-3 btn-arcade-yellow flex items-center gap-1 cursor-pointer"
                title="Insert mining command into code editor"
              >
                <Pickaxe className="w-3 h-3" />
                <span>Mine Block</span>
              </button>
            )}

            {selectedTile.type === 'lava' && onQuickInsertCode && (
              <button
                onClick={() =>
                  onQuickInsertCode(
                    `hero.place("bridge", "${getRelativeDirection(heroX, heroY, selectedTile.x, selectedTile.y)}")`
                  )
                }
                className="btn-arcade text-[10px] py-1.5 px-3 btn-arcade-purple flex items-center gap-1 cursor-pointer"
                title="Insert place bridge command"
              >
                <span>Place Bridge</span>
              </button>
            )}

            {onQuickInsertCode && (
              <button
                onClick={() =>
                  onQuickInsertCode(
                    `tile = hero.scan("${getRelativeDirection(heroX, heroY, selectedTile.x, selectedTile.y)}")`
                  )
                }
                className="btn-arcade text-[10px] py-1.5 px-3 btn-arcade-white flex items-center gap-1 cursor-pointer"
              >
                <Eye className="w-3 h-3" />
                <span>Scan Tile</span>
              </button>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

// Visual tile styling helpers
function getTileStyle(type: TileData['type']): React.CSSProperties {
  switch (type) {
    case 'wall':
      return { backgroundColor: '#3F3B45', border: '1px solid #1E1E24' };
    case 'grass':
      return { backgroundColor: '#4C6E43', border: '1px solid #36502F' };
    case 'wood':
      return { backgroundColor: '#5B7A42', border: '1px solid #36502F' };
    case 'stone':
      return { backgroundColor: '#6B7280', border: '1px solid #374151' };
    case 'iron':
      return { backgroundColor: '#785A48', border: '1px solid #453227' };
    case 'crystal':
      return { backgroundColor: '#2E3856', border: '1px solid #1E293B' };
    case 'lava':
      return { backgroundColor: '#DC2626', border: '1px solid #991B1B' };
    case 'bridge':
      return { backgroundColor: '#92400E', border: '1px solid #78350F' };
    case 'portal':
      return { backgroundColor: '#6D28D9', border: '1.5px solid #FBBF24' };
    case 'gate':
      return { backgroundColor: '#475569', border: '1px solid #1E293B' };
    case 'mimic':
    case 'chest':
      return { backgroundColor: '#B45309', border: '1px solid #78350F' };
    case 'spike':
      return { backgroundColor: '#475569', border: '1px solid #334155' };
    case 'boss':
      return { backgroundColor: '#1E1B4B', border: '1.5px solid #EF4444' };
    default:
      return { backgroundColor: '#4C6E43', border: '1px solid #36502F' };
  }
}

function getTileEmoji(type: TileData['type']): string {
  switch (type) {
    case 'wood':
      return '🪵';
    case 'stone':
      return '🪨';
    case 'crystal':
      return '💎';
    case 'iron':
      return '⛏️';
    case 'lava':
      return '🔥';
    case 'bridge':
      return '🌉';
    case 'portal':
      return '🌀';
    case 'gate':
      return '🚪';
    case 'chest':
      return '📦';
    case 'mimic':
      return '👾';
    case 'spike':
      return '⚠️';
    case 'boss':
      return '👹';
    case 'wall':
      return '🧱';
    default:
      return '🌱';
  }
}

function renderTileContent(tile: TileData, bossHp: number) {
  switch (tile.type) {
    case 'wood':
      return <span className="text-sm sm:text-base drop-shadow-sm">🌲</span>;
    case 'stone':
      return <span className="text-xs sm:text-sm drop-shadow-sm font-bold text-slate-200">🪨</span>;
    case 'crystal':
      return (
        <span className="text-xs sm:text-sm animate-pulse drop-shadow-[0_0_6px_#38BDF8]">💎</span>
      );
    case 'iron':
      return <span className="text-xs sm:text-sm drop-shadow-sm">⛏️</span>;
    case 'lava':
      return (
        <div className="w-full h-full flex items-center justify-center bg-gradient-to-t from-[#B91C1C] to-[#EF4444] animate-pulse">
          <span className="text-[10px] sm:text-xs">🔥</span>
        </div>
      );
    case 'bridge':
      return (
        <div className="w-full h-full flex flex-col justify-evenly py-0.5 px-0.5 bg-[#92400E]">
          <div className="w-full h-0.5 bg-[#B45309]" />
          <div className="w-full h-0.5 bg-[#B45309]" />
        </div>
      );
    case 'portal':
      return (
        <div className="relative w-full h-full flex items-center justify-center bg-gradient-to-tr from-[#6C5CE7] to-[#FBBF24] rounded-md animate-spin-slow">
          <span className="text-xs sm:text-sm">🌀</span>
        </div>
      );
    case 'gate':
      return <span className="text-xs sm:text-sm">🚪</span>;
    case 'chest':
      return <span className="text-xs sm:text-sm">📦</span>;
    case 'mimic':
      return (
        <div className="relative flex items-center justify-center">
          <span className="text-xs sm:text-sm animate-bounce">👾</span>
        </div>
      );
    case 'spike':
      return <span className="text-xs sm:text-sm text-slate-300">▲▲</span>;
    case 'boss':
      return (
        <div className="w-full h-full flex flex-col items-center justify-center p-0.5 bg-[#1E1B4B]">
          <span className="text-xs sm:text-sm">👹</span>
          <div className="w-full h-1 bg-red-950 rounded-full mt-0.5 overflow-hidden">
            <div
              className="h-full bg-red-500 transition-all duration-300"
              style={{ width: `${Math.max(0, bossHp)}%` }}
            />
          </div>
        </div>
      );
    case 'wall':
      return null;
    default:
      return null;
  }
}

function getTileDescription(tile: TileData): string {
  switch (tile.type) {
    case 'wood':
      return 'Harvestable Whispering Tree. Mine using hero.mine() to collect Wood blocks.';
    case 'stone':
      return 'Dense Quarry Stone. Requires harvesting for stone bridge crafting.';
    case 'crystal':
      return 'Rare Mana Crystal. Radiates syntax energy required to craft Logic Keys.';
    case 'iron':
      return 'Iron Ore Vein. Mine to forge Logic Blades and Dungeon Keys.';
    case 'lava':
      return 'Lethal Molten Lava! Causes -1 Heart damage. Place a Bridge to cross safely.';
    case 'bridge':
      return 'Player-crafted Bridge. Safely walkable across lava and pits.';
    case 'gate':
      return 'Locked Sentinel Gate. Unlocks automatically when you walk into it with a Logic Key.';
    case 'chest':
      return 'Ancient Treasure Chest. Safe to open.';
    case 'mimic':
      return 'Corrupted Bug Mimic! Attacks if opened without prior inspection. Strike it down first!';
    case 'spike':
      return 'Concealed spike plate. Causes -1 Heart damage when stepped upon.';
    case 'boss':
      return 'Syntax Golem Titan. Invulnerable to standard attacks. Exploit rotating elemental weaknesses!';
    case 'portal':
      return 'Sanctuary Gateway! Step onto this tile to conquer the floor and claim your XP reward.';
    case 'wall':
      return 'Impassable dungeon wall.';
    default:
      return 'Open dungeon floor. Walkable.';
  }
}

function getRelativeDirection(fromX: number, fromY: number, toX: number, toY: number): Direction {
  const dx = toX - fromX;
  const dy = toY - fromY;
  if (Math.abs(dx) > Math.abs(dy)) {
    return dx > 0 ? 'right' : 'left';
  } else {
    return dy > 0 ? 'down' : 'up';
  }
}
