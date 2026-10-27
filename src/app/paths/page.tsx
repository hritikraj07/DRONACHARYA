// Learning Paths & Quest Map Explorer
'use client';

import React from 'react';
import Link from 'next/link';
import { useDronacharya } from '@/lib/store';
import {
  Compass,
  Target,
  CheckCircle2,
  Lock,
  ArrowRight,
  Terminal,
  Award,
  Layers,
} from 'lucide-react';

export default function PathsPage() {
  const { state } = useDronacharya();
  const path = state.learningPaths[0];

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-10 w-full">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-[#D8CFC0] pb-6 mb-8">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-0.5 rounded-full bg-[#E9DFC9] border border-[#B49A65] text-xs font-semibold text-[#7A6230] mb-2">
            <Compass className="w-3.5 h-3.5 text-[#B49A65]" />
            <span>Learning Roadmap</span>
          </div>
          <h1 className="font-serif font-bold text-3xl sm:text-4xl text-[#252820]">
            Learn: {path.title}
          </h1>
          <p className="text-sm text-[#575A51] mt-1">
            Complete step-by-step interactive missions to turn theoretical concepts into practical coding ability.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <div className="text-right">
            <div className="text-xs text-[#7E8276]">Missions Completed</div>
            <div className="font-serif font-bold text-xl text-[#354B3A]">
              {path.missions.filter((m) => m.isCompleted).length} / {path.missions.length}
            </div>
          </div>
        </div>
      </div>

      {/* Primary Path Overview */}
      <div className="card-parchment mb-8">
        <div className="flex items-start justify-between">
          <div className="flex items-start gap-4">
            <div className="w-12 h-12 rounded-lg bg-[#354B3A] text-white flex items-center justify-center shrink-0">
              <Terminal className="w-6 h-6" />
            </div>
            <div>
              <span className="text-xs font-semibold text-[#A65F43] uppercase tracking-wider">
                Beginner Track
              </span>
              <h2 className="font-serif font-bold text-2xl text-[#252820] mt-0.5">
                {path.title}
              </h2>
              <p className="text-xs text-[#575A51] mt-1.5 max-w-2xl leading-relaxed">
                {path.description}
              </p>
            </div>
          </div>
        </div>

        {/* Questline Timeline / DAG Nodes */}
        <div className="mt-8 relative">
          {/* Vertical Track Line */}
          <div className="absolute left-6 top-8 bottom-8 w-0.5 bg-[#D8CFC0]" />

          <div className="space-y-6 relative">
            {path.missions.map((mission, idx) => {
              const isUnlocked = mission.isUnlocked;
              const isCompleted = mission.isCompleted;

              return (
                <div
                  key={mission.id}
                  className={`flex items-start gap-5 p-5 rounded-xl border transition-all ${
                    isCompleted
                      ? 'bg-[#E2E8E3] border-[#354B3A] shadow-xs'
                      : isUnlocked
                      ? 'bg-white border-[#354B3A] ring-1 ring-[#354B3A]/30 shadow-md'
                      : 'bg-[#F0EAE1]/60 border-[#D8CFC0] opacity-60'
                  }`}
                >
                  {/* Step Node Circle */}
                  <div
                    className={`w-12 h-12 rounded-full flex items-center justify-center shrink-0 font-serif font-bold text-base shadow-sm z-10 ${
                      isCompleted
                        ? 'bg-[#354B3A] text-white'
                        : isUnlocked
                        ? 'bg-[#B49A65] text-white'
                        : 'bg-[#D8CFC0] text-[#7E8276]'
                    }`}
                  >
                    {isCompleted ? <CheckCircle2 className="w-6 h-6" /> : isUnlocked ? idx + 1 : <Lock className="w-5 h-5" />}
                  </div>

                  {/* Mission Details */}
                  <div className="flex-1">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                      <div>
                        <span className="text-[11px] font-semibold text-[#A65F43] uppercase tracking-wider">
                          Mission {idx + 1} • {mission.subtitle}
                        </span>
                        <h3 className="font-serif font-bold text-lg text-[#252820]">
                          {mission.title}
                        </h3>
                      </div>
                      <div className="flex items-center gap-3">
                        <span className="font-mono text-xs text-[#B49A65] font-semibold">
                          +{mission.xpReward} XP
                        </span>
                        {isUnlocked ? (
                          <Link
                            href={`/simulator?mission=${mission.id}`}
                            className={`text-xs py-2 px-4 rounded font-medium flex items-center gap-1.5 ${
                              isCompleted ? 'btn-secondary' : 'btn-primary'
                            }`}
                          >
                            <span>{isCompleted ? 'Revisit Sandbox' : 'Enter Mission'}</span>
                            <ArrowRight className="w-3.5 h-3.5" />
                          </Link>
                        ) : (
                          <span className="text-xs text-[#7E8276] px-3 py-1 bg-[#D8CFC0] rounded">
                            Locked (Prerequisite Required)
                          </span>
                        )}
                      </div>
                    </div>

                    <p className="text-xs text-[#575A51] mt-2 leading-relaxed">
                      {mission.narrativeContext}
                    </p>

                    <div className="mt-3 flex items-center gap-4 text-[11px] text-[#7E8276]">
                      <span>Est. Time: ~{mission.estTimeMinutes} mins</span>
                      <span>•</span>
                      <span>Target Skill: {mission.primarySkillId}</span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
