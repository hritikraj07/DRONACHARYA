// Dronacharya Playable 2D Grid Arena
// Visual, interactive 6x6 grid rendering the rover, obstacles, batteries, and step-by-step animation
'use client';

import React from 'react';
import {
  GRID_COLS,
  GRID_ROWS,
  START_COORDS,
  EXIT_COORDS,
  OBSTACLE_COORDS,
  BATTERY_COORDS,
  TilePosition,
  RobotSimulationFrame,
} from '@/lib/simulator/robot-code-executor';
import {
  Zap,
  Target,
  Sparkles,
  AlertTriangle,
  RotateCcw,
  Play,
  Pause,
  FastForward,
  Flag,
  BatteryCharging,
} from 'lucide-react';

interface PlayableGridEngineProps {
  currentFrame?: RobotSimulationFrame;
  isAnimating: boolean;
  onReset: () => void;
  speed: number;
  onSetSpeed: (speed: number) => void;
  collectedBatteries: number[]; // Indices of collected batteries
}

export function PlayableGridEngine({
  currentFrame,
  isAnimating,
  onReset,
  speed,
  onSetSpeed,
  collectedBatteries,
}: PlayableGridEngineProps) {
  const robotX = currentFrame?.x ?? START_COORDS.x;
  const robotY = currentFrame?.y ?? START_COORDS.y;
  const batteryPct = currentFrame?.battery ?? 70;
  const isCollision = currentFrame?.event === 'collision';
  const isDepleted = currentFrame?.event === 'depleted';
  const isVictory = currentFrame?.event === 'victory';

  // Determine robot facing angle based on action
  let rotationDeg = 0;
  if (currentFrame?.action?.includes('RIGHT')) rotationDeg = 90;
  if (currentFrame?.action?.includes('DOWN')) rotationDeg = 180;
  if (currentFrame?.action?.includes('LEFT')) rotationDeg = 270;
  if (currentFrame?.action?.includes('UP')) rotationDeg = 0;

  return (
    <div className="card-game p-4 sm:p-5 flex flex-col justify-between w-full h-full bg-[#FAF6EE]">
      {/* Top HUD: Battery Gauge & Coordinates */}
      <div className="flex items-center justify-between gap-3 mb-4 bg-white border-2 border-[#1E1E24] rounded-xl p-3 shadow-[2px_2px_0px_#1E1E24]">
        {/* Battery Gauge */}
        <div className="flex items-center gap-2 flex-1 max-w-[220px]">
          <BatteryCharging
            className={`w-5 h-5 shrink-0 ${
              batteryPct > 40 ? 'text-[#10B981]' : batteryPct > 15 ? 'text-[#F59E0B]' : 'text-[#EF4444]'
            }`}
          />
          <div className="w-full">
            <div className="flex items-center justify-between text-[11px] font-black text-[#1E1E24] mb-0.5">
              <span>Power</span>
              <span>{batteryPct}%</span>
            </div>
            <div className="w-full h-2.5 bg-[#E8E1D2] border border-[#1E1E24] rounded-full overflow-hidden">
              <div
                className={`h-full transition-all duration-300 rounded-full ${
                  batteryPct > 40
                    ? 'bg-[#10B981]'
                    : batteryPct > 15
                    ? 'bg-[#FBBF24]'
                    : 'bg-[#EF4444]'
                }`}
                style={{ width: `${Math.max(0, Math.min(100, batteryPct))}%` }}
              />
            </div>
          </div>
        </div>

        {/* Live Coordinates */}
        <div className="flex items-center gap-1.5 px-3 py-1 rounded-lg bg-[#FAF6EE] border-2 border-[#1E1E24] text-xs font-black text-[#1E1E24]">
          <span className="text-[#7E7E8F]">Grid:</span>
          <span>({robotX}, {robotY})</span>
        </div>

        {/* Speed Controls */}
        <div className="flex items-center gap-1.5">
          <button
            onClick={() => onSetSpeed(speed === 1 ? 2 : speed === 2 ? 4 : 1)}
            className="btn-arcade btn-arcade-white text-[10px] px-2.5 py-1"
            title="Toggle Playback Speed"
          >
            {speed}x Speed
          </button>
          <button
            onClick={onReset}
            disabled={isAnimating}
            className="btn-arcade btn-arcade-white p-1.5 disabled:opacity-40"
            title="Reset Rover to Start"
          >
            <RotateCcw className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* 6x6 Playable Grid Scene */}
      <div className="relative aspect-square max-w-[420px] mx-auto w-full border-3 border-[#1E1E24] rounded-2xl bg-white shadow-[4px_4px_0px_#1E1E24] p-2 flex items-center justify-center">
        <div className="grid grid-cols-6 grid-rows-6 w-full h-full gap-1">
          {Array.from({ length: GRID_ROWS }).map((_, r) =>
            Array.from({ length: GRID_COLS }).map((_, c) => {
              const isStart = c === START_COORDS.x && r === START_COORDS.y;
              const isTarget = c === EXIT_COORDS.x && r === EXIT_COORDS.y;
              const obstacleIndex = OBSTACLE_COORDS.findIndex((o) => o.x === c && o.y === r);
              const isObstacle = obstacleIndex !== -1;
              const batteryIndex = BATTERY_COORDS.findIndex((b) => b.x === c && b.y === r);
              const isBattery = batteryIndex !== -1 && !collectedBatteries.includes(batteryIndex);
              const isRobotHere = c === robotX && r === robotY;

              return (
                <div
                  key={`${r}-${c}`}
                  className={`relative rounded-lg border border-[#1E1E24]/20 flex items-center justify-center transition-all ${
                    isTarget
                      ? 'bg-[#CCFBF1] border-2 border-[#14B8A6]'
                      : isObstacle
                      ? 'bg-[#FEE2E2] border-2 border-[#EF4444]'
                      : (r + c) % 2 === 0
                      ? 'bg-[#FFFFFF]'
                      : 'bg-[#F8F3E8]'
                  }`}
                >
                  {/* Subtle Grid Coordinate label in corner */}
                  <span className="absolute top-0.5 left-1 text-[8px] font-bold text-[#7E7E8F]/40 select-none">
                    {c},{r}
                  </span>

                  {/* Obstacle Barrier */}
                  {isObstacle && !isRobotHere && (
                    <div className="w-7 h-7 rounded-md bg-[#EF4444] border-2 border-[#1E1E24] flex items-center justify-center shadow-[1.5px_1.5px_0px_#1E1E24]">
                      <AlertTriangle className="w-4 h-4 text-white" />
                    </div>
                  )}

                  {/* Energy Battery Cell */}
                  {isBattery && !isRobotHere && (
                    <div className="w-6 h-6 rounded-md bg-[#FBBF24] border-2 border-[#1E1E24] flex items-center justify-center shadow-[1.5px_1.5px_0px_#1E1E24] animate-bounce">
                      <Zap className="w-3.5 h-3.5 fill-[#1E1E24] text-[#1E1E24]" />
                    </div>
                  )}

                  {/* Extraction Beacon Portal */}
                  {isTarget && !isRobotHere && (
                    <div className="w-7 h-7 rounded-full bg-[#10B981] border-2 border-[#1E1E24] flex items-center justify-center shadow-[2px_2px_0px_#1E1E24] animate-pulse">
                      <Flag className="w-3.5 h-3.5 text-white" />
                    </div>
                  )}

                  {/* Start Point indicator when robot leaves */}
                  {isStart && !isRobotHere && (
                    <div className="w-2.5 h-2.5 rounded-full bg-[#3B82F6] border border-[#1E1E24]" />
                  )}

                  {/* The Animated Rover Arya Sprite */}
                  {isRobotHere && (
                    <div
                      className={`z-20 w-8 h-8 rounded-xl border-2 border-[#1E1E24] flex items-center justify-center transition-transform duration-300 shadow-[2px_2px_0px_#1E1E24] ${
                        isCollision
                          ? 'bg-[#EF4444] animate-ping'
                          : isVictory
                          ? 'bg-[#10B981] animate-bounce'
                          : isDepleted
                          ? 'bg-[#7E7E8F]'
                          : 'bg-[#6C5CE7]'
                      }`}
                      style={{
                        transform: `rotate(${rotationDeg}deg)`,
                      }}
                    >
                      {/* Pixel Robot Face */}
                      <svg viewBox="0 0 24 24" className="w-5 h-5 text-white" fill="none">
                        <rect x="3" y="5" width="18" height="14" rx="2" fill="currentColor" stroke="#1E1E24" strokeWidth="1.5" />
                        <circle cx="8" cy="11" r="1.5" fill="#FBBF24" />
                        <circle cx="16" cy="11" r="1.5" fill="#FBBF24" />
                        <line x1="12" y1="2" x2="12" y2="5" stroke="#1E1E24" strokeWidth="2" />
                        <circle cx="12" cy="2" r="1.5" fill="#EF4444" />
                        <rect x="7" y="15" width="10" height="2" rx="1" fill="#1E1E24" />
                      </svg>
                    </div>
                  )}
                </div>
              );
            })
          )}
        </div>
      </div>

      {/* Legend & Status Banner */}
      <div className="mt-4 pt-3 border-t-2 border-[#1E1E24]/15 flex flex-wrap items-center justify-between gap-2 text-xs">
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1">
            <div className="w-3.5 h-3.5 rounded bg-[#6C5CE7] border border-[#1E1E24]" />
            <span className="font-bold text-[#1E1E24]">Rover</span>
          </div>
          <div className="flex items-center gap-1">
            <div className="w-3.5 h-3.5 rounded bg-[#FBBF24] border border-[#1E1E24]" />
            <span className="font-bold text-[#1E1E24]">Battery (+25%)</span>
          </div>
          <div className="flex items-center gap-1">
            <div className="w-3.5 h-3.5 rounded bg-[#EF4444] border border-[#1E1E24]" />
            <span className="font-bold text-[#1E1E24]">Hazard</span>
          </div>
          <div className="flex items-center gap-1">
            <div className="w-3.5 h-3.5 rounded bg-[#10B981] border border-[#1E1E24]" />
            <span className="font-bold text-[#1E1E24]">Beacon (5,5)</span>
          </div>
        </div>

        {/* Step indicator */}
        <span className="text-[11px] font-black text-[#6C5CE7] bg-[#EDE9FE] px-2.5 py-0.5 rounded-full border border-[#1E1E24]">
          Step {currentFrame?.stepIndex ?? 0}
        </span>
      </div>
    </div>
  );
}
