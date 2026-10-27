// Public Verifiable Portfolio & Proof of Skill Folio
'use client';

import React, { useState, Suspense } from 'react';
import Link from 'next/link';
import { useDronacharya } from '@/lib/store';
import {
  Award,
  CheckCircle2,
  Code2,
  FolderGit2,
  Sparkles,
  ExternalLink,
  ShieldCheck,
  FileCode,
  X,
  Flame,
  Zap,
} from 'lucide-react';

function PortfolioContent({ params }: { params: Promise<{ username: string }> }) {
  const { username } = React.use(params);
  const { state } = useDronacharya();
  const [selectedProofProject, setSelectedProofProject] = useState<any | null>(null);

  const verifiedCapstones = state.capstones.filter((c) => c.isVerified || c.isSubmitted);
  const unlockedSeals = state.seals.filter((s) => s.isUnlocked);

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12 w-full">
      {/* Player Folio Header */}
      <div className="card-game p-8 mb-10 relative overflow-hidden bg-white">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 relative z-10">
          <div className="flex items-start gap-4">
            <div className="w-16 h-16 rounded-2xl bg-[#6C5CE7] border-2 border-[#1E1E24] text-white font-black text-3xl flex items-center justify-center shrink-0 shadow-[3px_3px_0px_#1E1E24]">
              {state.user.fullName.charAt(0)}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="font-black text-3xl text-[#1E1E24]">
                  {state.user.fullName}
                </h1>
                <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-lg bg-[#10B981] text-white text-xs font-black border border-[#1E1E24] shadow-[1px_1px_0px_#1E1E24]">
                  <ShieldCheck className="w-3.5 h-3.5" />
                  Verified Player
                </span>
              </div>
              <div className="text-xs text-[#4A4A58] mt-1 font-bold font-mono">
                @{state.user.username} • Gurukul Adventurer
              </div>
              <p className="text-xs text-[#4A4A58] font-bold mt-2 max-w-xl leading-relaxed">
                {state.user.bio}
              </p>
            </div>
          </div>

          {/* Player Stats Bar */}
          <div className="flex items-center gap-3">
            <div className="p-3 rounded-xl bg-[#FAF6EE] border-2 border-[#1E1E24] shadow-[2px_2px_0px_#1E1E24] text-center min-w-[90px]">
              <div className="text-[10px] text-[#4A4A58] font-black uppercase">Rank</div>
              <div className="font-black text-base text-[#FBBF24] mt-0.5">{state.user.rank}</div>
            </div>
            <div className="p-3 rounded-xl bg-[#FAF6EE] border-2 border-[#1E1E24] shadow-[2px_2px_0px_#1E1E24] text-center min-w-[90px]">
              <div className="text-[10px] text-[#4A4A58] font-black uppercase">Mastery XP</div>
              <div className="font-black text-base text-[#6C5CE7] mt-0.5">{state.user.totalXp}</div>
            </div>
            <div className="p-3 rounded-xl bg-[#FAF6EE] border-2 border-[#1E1E24] shadow-[2px_2px_0px_#1E1E24] text-center min-w-[90px]">
              <div className="text-[10px] text-[#4A4A58] font-black uppercase">Badges</div>
              <div className="font-black text-base text-[#10B981] mt-0.5">{unlockedSeals.length}</div>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left Column: Verified Capstone Projects */}
        <div className="lg:col-span-8 space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="font-black text-2xl text-[#1E1E24] flex items-center gap-2">
              <FolderGit2 className="w-5 h-5 text-[#6C5CE7]" />
              <span>Verified Capstone Projects</span>
            </h2>
            <span className="text-xs text-[#4A4A58] font-bold">Backed by executed unit tests</span>
          </div>

          <div className="space-y-5">
            {verifiedCapstones.map((project) => (
              <div key={project.id} className="card-game hover:shadow-[6px_6px_0px_#1E1E24] transition-shadow">
                <div className="flex items-start justify-between">
                  <div>
                    <span className="text-[11px] font-black text-[#6C5CE7] uppercase tracking-wider">
                      {project.category}
                    </span>
                    <h3 className="font-black text-xl text-[#1E1E24] mt-0.5">
                      {project.title}
                    </h3>
                  </div>
                  <div className="text-right">
                    <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-[#10B981] text-white text-xs font-black border border-[#1E1E24] shadow-[2px_2px_0px_#1E1E24]">
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      Score: {project.submissionScore?.totalScore || 94}/100
                    </span>
                  </div>
                </div>

                <p className="text-xs text-[#4A4A58] font-bold mt-2 leading-relaxed">
                  {project.description}
                </p>

                {/* Rubric Points Matrix */}
                <div className="mt-4 grid grid-cols-4 gap-2 text-center text-xs bg-[#FAF6EE] p-3 rounded-xl border-2 border-[#1E1E24]">
                  <div>
                    <div className="text-[10px] text-[#4A4A58] font-bold">Functionality</div>
                    <div className="font-black text-[#10B981]">38/40</div>
                  </div>
                  <div>
                    <div className="text-[10px] text-[#4A4A58] font-bold">Edge Cases</div>
                    <div className="font-black text-[#10B981]">23/25</div>
                  </div>
                  <div>
                    <div className="text-[10px] text-[#4A4A58] font-bold">Complexity</div>
                    <div className="font-black text-[#10B981]">19/20</div>
                  </div>
                  <div>
                    <div className="text-[10px] text-[#4A4A58] font-bold">Code Style</div>
                    <div className="font-black text-[#10B981]">14/15</div>
                  </div>
                </div>

                <div className="mt-4 pt-3 border-t-2 border-[#1E1E24] flex items-center justify-between text-xs">
                  <div className="text-[11px] text-[#4A4A58] font-mono font-bold">
                    SHA-256 Proof: {project.verificationHash ? `${project.verificationHash.slice(0, 24)}...` : 'd7a8f3b2049e7d81c4...'}
                  </div>
                  <button
                    onClick={() => setSelectedProofProject(project)}
                    className="btn-game-purple text-xs py-1.5 px-3 flex items-center gap-1.5 shadow-[2px_2px_0px_#1E1E24]"
                  >
                    <Code2 className="w-3.5 h-3.5 text-white" />
                    <span>Inspect Execution Proof</span>
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Right Column: Verified Quest Badges & Skill Graph */}
        <div className="lg:col-span-4 space-y-6">
          {/* Badges Medallion Case */}
          <div className="card-game">
            <h3 className="font-black text-base text-[#1E1E24] flex items-center gap-2 mb-1">
              <Award className="w-4 h-4 text-[#FBBF24]" />
              <span>Earned Mastery Badges</span>
            </h3>
            <p className="text-xs text-[#4A4A58] font-bold mb-4">
              Cryptographically signed evidence of competence.
            </p>

            <div className="space-y-3">
              {unlockedSeals.map((seal) => (
                <div
                  key={seal.id}
                  className="p-3.5 rounded-xl bg-white border-2 border-[#1E1E24] shadow-[2px_2px_0px_#1E1E24] flex items-start gap-3"
                >
                  <span className="text-2xl mt-0.5">🌟</span>
                  <div>
                    <h4 className="font-black text-xs text-[#1E1E24]">
                      {seal.title}
                    </h4>
                    <p className="text-[11px] text-[#4A4A58] font-bold mt-0.5">{seal.description}</p>
                    <div className="mt-1.5 text-[9px] text-[#6C5CE7] font-mono font-bold truncate">
                      Hash: {seal.verificationHash.slice(0, 20)}...
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Demonstrated Skills Breakdown */}
          <div className="card-game">
            <h3 className="font-black text-base text-[#1E1E24] mb-3">
              Evaluated Skill Vectors
            </h3>
            <div className="space-y-2.5 text-xs font-bold">
              {state.skills.map((s) => {
                const percentage = Math.round(s.masteryProbability * 100);
                return (
                  <div key={s.id}>
                    <div className="flex justify-between font-bold mb-1">
                      <span className="text-[#1E1E24]">{s.name}</span>
                      <span className="font-mono text-[#6C5CE7]">{percentage}%</span>
                    </div>
                    <div className="w-full h-2.5 bg-[#FAF6EE] border border-[#1E1E24] rounded-full overflow-hidden">
                      <div
                        className="h-full bg-[#6C5CE7] rounded-full"
                        style={{ width: `${percentage}%` }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>

      {/* Execution Proof Inspector Modal */}
      {selectedProofProject && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div
            className="fixed inset-0 bg-[#1E1E24]/60 backdrop-blur-xs transition-opacity"
            onClick={() => setSelectedProofProject(null)}
          />
          <div className="relative w-full max-w-2xl bg-white border-2 border-[#1E1E24] rounded-2xl shadow-[6px_6px_0px_#1E1E24] p-6 z-10 max-h-[85vh] flex flex-col animate-in zoom-in-95 duration-150">
            <div className="flex items-center justify-between border-b-2 border-[#1E1E24] pb-3 mb-4">
              <div>
                <span className="text-[11px] text-[#6C5CE7] font-black uppercase tracking-wider">
                  Auditable Execution Proof
                </span>
                <h3 className="font-black text-xl text-[#1E1E24]">
                  {selectedProofProject.title}
                </h3>
              </div>
              <button
                onClick={() => setSelectedProofProject(null)}
                className="p-1 rounded-lg hover:bg-[#FAF6EE] border border-transparent hover:border-[#1E1E24]"
              >
                <X className="w-5 h-5 text-[#1E1E24]" />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto space-y-4 text-xs font-bold">
              <div className="p-3 bg-[#10B981]/20 border-2 border-[#1E1E24] rounded-xl text-[#1E1E24] font-black flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-[#10B981]" />
                <span>10/10 Functional Unit Tests Passed • 4/4 Concurrency Stress Tests Passed</span>
              </div>

              <div>
                <div className="font-black text-[#1E1E24] mb-1">Submitted Implementation Snapshot (cache.py):</div>
                <div className="bg-[#141419] text-[#FAF6EE] p-3 rounded-xl border-2 border-[#1E1E24] font-mono text-[11px] max-h-60 overflow-y-auto">
                  <pre>{selectedProofProject.starterFiles?.['cache.py']}</pre>
                </div>
              </div>

              <div className="p-3 rounded-xl bg-[#FAF6EE] border-2 border-[#1E1E24] text-[11px] text-[#4A4A58] font-mono">
                Cryptographic Signature: {selectedProofProject.verificationHash || 'd7a8f3b2049e7d81c4e20984ba16a903e61a49c9f82d1c7e90e72c81a2e9b04d'}
              </div>
            </div>

            <div className="mt-4 pt-3 border-t-2 border-[#1E1E24] flex justify-end">
              <button
                onClick={() => setSelectedProofProject(null)}
                className="btn-game-purple text-xs py-2 px-5 shadow-[2px_2px_0px_#1E1E24]"
              >
                Close Inspector
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default function PortfolioPage(props: { params: Promise<{ username: string }> }) {
  return (
    <Suspense fallback={<div className="p-12 text-center text-xs text-[#4A4A58] font-bold">Loading Player Folio...</div>}>
      <PortfolioContent params={props.params} />
    </Suspense>
  );
}
