// Dronacharya Interactive Bio-Data Cell Filter Engine
// Visual conveyor belt and laser chamber for filtering damaged cells
'use client';

import React from 'react';
import { ShieldCheck, AlertTriangle, Zap, CheckCircle2, XCircle, ArrowRight } from 'lucide-react';

export interface BioCell {
  id: number;
  charge: number;
  isContaminated: boolean;
  status?: 'pending' | 'scanning' | 'passed' | 'quarantined';
}

interface CellFilterEngineProps {
  cells: BioCell[];
  activeCellIndex: number;
  isScanning: boolean;
  matrixVaultCount: number;
  quarantineCount: number;
  onReset: () => void;
}

export function CellFilterEngine({
  cells,
  activeCellIndex,
  isScanning,
  matrixVaultCount,
  quarantineCount,
  onReset,
}: CellFilterEngineProps) {
  return (
    <div className="card-game p-4 sm:p-5 flex flex-col justify-between w-full h-full bg-[#FAF6EE]">
      {/* Top Status HUD */}
      <div className="flex items-center justify-between gap-3 mb-4 bg-white border-2 border-[#1E1E24] rounded-xl p-3 shadow-[2px_2px_0px_#1E1E24]">
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded-full bg-[#10B981] animate-ping" />
          <span className="font-serif font-black text-xs text-[#1E1E24]">
            Bio-Scan Matrix Chamber
          </span>
        </div>

        {/* Counters */}
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-[#D1FAE5] border-2 border-[#1E1E24] text-xs font-black text-[#059669]">
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>Vault: {matrixVaultCount}</span>
          </div>

          <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-[#FEE2E2] border-2 border-[#1E1E24] text-xs font-black text-[#DC2626]">
            <AlertTriangle className="w-3.5 h-3.5" />
            <span>Purged: {quarantineCount}</span>
          </div>
        </div>
      </div>

      {/* Main Laser Scanner Chamber */}
      <div className="relative w-full aspect-video max-w-[420px] mx-auto border-3 border-[#1E1E24] rounded-2xl bg-[#1E1E24] shadow-[4px_4px_0px_#1E1E24] p-4 flex flex-col justify-between overflow-hidden">
        {/* Scanner Ceiling Rail & Laser Beam */}
        <div className="relative w-full flex justify-center">
          <div className="w-24 h-3 bg-[#4A4A58] rounded-b border border-white/20" />
          {/* Laser Line */}
          <div
            className={`absolute top-3 w-1.5 h-28 rounded-full blur-[1px] transition-all duration-300 ${
              isScanning
                ? 'bg-[#10B981] shadow-[0_0_15px_#10B981]'
                : 'bg-[#6C5CE7] shadow-[0_0_8px_#6C5CE7]'
            }`}
          />
        </div>

        {/* Conveyor Belt Track */}
        <div className="relative w-full py-4 my-auto">
          <div className="w-full h-3 bg-[#2D2D38] border-y border-white/20 flex items-center justify-around">
            {Array.from({ length: 8 }).map((_, i) => (
              <div key={i} className="w-1.5 h-full bg-white/10" />
            ))}
          </div>

          {/* Cell Capsules Carousel */}
          <div className="absolute inset-0 flex items-center justify-center gap-3 overflow-x-auto px-4">
            {cells.map((cell, idx) => {
              const isActive = idx === activeCellIndex;
              const isClean = cell.charge > 0;

              return (
                <div
                  key={cell.id}
                  className={`w-12 h-16 rounded-xl border-2 flex flex-col items-center justify-between p-1.5 transition-all duration-300 shrink-0 ${
                    isActive
                      ? isClean
                        ? 'bg-[#10B981] border-white shadow-[0_0_12px_#10B981] scale-110 -translate-y-2'
                        : 'bg-[#EF4444] border-white shadow-[0_0_12px_#EF4444] scale-110 -translate-y-2'
                      : 'bg-[#2D2B38] border-white/30 text-white/80'
                  }`}
                >
                  <span className="text-[9px] font-mono font-bold text-white/70">
                    #{cell.id}
                  </span>

                  <div className="text-center font-black text-xs text-white">
                    {cell.charge > 0 ? `+${cell.charge}` : cell.charge}
                  </div>

                  <div className="text-[8px] font-bold text-white/80 uppercase">
                    {isClean ? 'Clean' : 'Hazard'}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Bottom Chutes: Clean Vault vs Incinerator */}
        <div className="flex items-center justify-between pt-2 border-t border-white/10 text-[10px] font-bold text-white/60">
          <div className="flex items-center gap-1 text-[#10B981]">
            <span>⮡ Matrix Vault (Charge &gt; 0)</span>
          </div>
          <div className="flex items-center gap-1 text-[#EF4444]">
            <span>Hazard Chute (Charge &lt; 0) ⮠</span>
          </div>
        </div>
      </div>

      {/* Dataset Preview Strip */}
      <div className="mt-4 pt-3 border-t-2 border-[#1E1E24]/15 flex items-center justify-between text-xs">
        <span className="font-bold text-[#1E1E24]">
          Input Stream: <span className="font-mono text-[#6C5CE7]">[{cells.map((c) => c.charge).join(', ')}]</span>
        </span>
        <button
          onClick={onReset}
          className="text-xs font-bold text-[#1E1E24] hover:underline"
        >
          Reset Stream
        </button>
      </div>
    </div>
  );
}
