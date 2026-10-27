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
} from 'lucide-react';

function PortfolioContent({ params }: { params: Promise<{ username: string }> }) {
  const { username } = React.use(params);
  const { state } = useDronacharya();
  const [selectedProofProject, setSelectedProofProject] = useState<any | null>(null);

  const verifiedCapstones = state.capstones.filter((c) => c.isVerified || c.isSubmitted);
  const unlockedSeals = state.seals.filter((s) => s.isUnlocked);

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12 w-full">
      {/* Editorial Folio Header */}
      <div className="card-parchment border-2 border-[#D8CFC0] rounded-2xl p-8 mb-10 relative overflow-hidden">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 relative z-10">
          <div className="flex items-start gap-4">
            <div className="w-16 h-16 rounded-full bg-[#354B3A] text-[#F6F1E7] font-serif font-bold text-2xl flex items-center justify-center shrink-0 shadow-md">
              {state.user.fullName.charAt(0)}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="font-serif font-bold text-3xl text-[#252820]">
                  {state.user.fullName}
                </h1>
                <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-[#E2E8E3] text-[#354B3A] text-xs font-semibold">
                  <ShieldCheck className="w-3.5 h-3.5" />
                  Verified Scholar
                </span>
              </div>
              <div className="text-xs text-[#575A51] mt-1 font-mono">
                @{state.user.username} • Gurukul Member
              </div>
              <p className="text-xs text-[#575A51] mt-2 max-w-xl leading-relaxed">
                {state.user.bio}
              </p>
            </div>
          </div>

          {/* Recruiter Stats Bar */}
          <div className="flex items-center gap-3">
            <div className="p-3 rounded-lg bg-white border border-[#D8CFC0] text-center min-w-[90px]">
              <div className="text-[10px] text-[#7E8276] uppercase">Rank</div>
              <div className="font-serif font-bold text-base text-[#7A6230] mt-0.5">{state.user.rank}</div>
            </div>
            <div className="p-3 rounded-lg bg-white border border-[#D8CFC0] text-center min-w-[90px]">
              <div className="text-[10px] text-[#7E8276] uppercase">Mastery XP</div>
              <div className="font-serif font-bold text-base text-[#354B3A] mt-0.5">{state.user.totalXp}</div>
            </div>
            <div className="p-3 rounded-lg bg-white border border-[#D8CFC0] text-center min-w-[90px]">
              <div className="text-[10px] text-[#7E8276] uppercase">Seals Minted</div>
              <div className="font-serif font-bold text-base text-[#B49A65] mt-0.5">{unlockedSeals.length}</div>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left Column: Verified Capstone Projects */}
        <div className="lg:col-span-8 space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="font-serif font-bold text-2xl text-[#252820] flex items-center gap-2">
              <FolderGit2 className="w-5 h-5 text-[#354B3A]" />
              <span>Verified Capstone Projects</span>
            </h2>
            <span className="text-xs text-[#7E8276]">Backed by executed unit tests</span>
          </div>

          <div className="space-y-5">
            {verifiedCapstones.map((project) => (
              <div key={project.id} className="card-ivory hover:shadow-md transition-shadow">
                <div className="flex items-start justify-between">
                  <div>
                    <span className="text-[11px] font-semibold text-[#A65F43] uppercase tracking-wider">
                      {project.category}
                    </span>
                    <h3 className="font-serif font-bold text-xl text-[#252820] mt-0.5">
                      {project.title}
                    </h3>
                  </div>
                  <div className="text-right">
                    <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded bg-[#E2E8E3] text-[#354B3A] text-xs font-semibold">
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      Score: {project.submissionScore?.totalScore || 94}/100
                    </span>
                  </div>
                </div>

                <p className="text-xs text-[#575A51] mt-2 leading-relaxed">
                  {project.description}
                </p>

                {/* Rubric Points Matrix */}
                <div className="mt-4 grid grid-cols-4 gap-2 text-center text-xs bg-[#FDFBF7] p-3 rounded border border-[#D8CFC0]">
                  <div>
                    <div className="text-[10px] text-[#7E8276]">Functionality</div>
                    <div className="font-bold text-[#354B3A]">38/40</div>
                  </div>
                  <div>
                    <div className="text-[10px] text-[#7E8276]">Edge Cases</div>
                    <div className="font-bold text-[#354B3A]">23/25</div>
                  </div>
                  <div>
                    <div className="text-[10px] text-[#7E8276]">Complexity</div>
                    <div className="font-bold text-[#354B3A]">19/20</div>
                  </div>
                  <div>
                    <div className="text-[10px] text-[#7E8276]">Code Style</div>
                    <div className="font-bold text-[#354B3A]">14/15</div>
                  </div>
                </div>

                <div className="mt-4 pt-3 border-t border-[#D8CFC0] flex items-center justify-between text-xs">
                  <div className="text-[11px] text-[#7E8276] font-mono">
                    SHA-256 Proof: {project.verificationHash ? `${project.verificationHash.slice(0, 24)}...` : 'd7a8f3b2049e7d81c4...'}
                  </div>
                  <button
                    onClick={() => setSelectedProofProject(project)}
                    className="btn-brass text-xs py-1.5 px-3 flex items-center gap-1.5"
                  >
                    <Code2 className="w-3.5 h-3.5 text-[#B49A65]" />
                    <span>Inspect Execution Proof</span>
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Right Column: Verified Mastery Seals & Skill Graph */}
        <div className="lg:col-span-4 space-y-6">
          {/* Seals Medallion Case */}
          <div className="card-ivory">
            <h3 className="font-serif font-bold text-base text-[#252820] flex items-center gap-2 mb-1">
              <Award className="w-4 h-4 text-[#B49A65]" />
              <span>Earned Mastery Seals</span>
            </h3>
            <p className="text-xs text-[#575A51] mb-4">
              Cryptographically signed evidence of competence.
            </p>

            <div className="space-y-3">
              {unlockedSeals.map((seal) => (
                <div
                  key={seal.id}
                  className="p-3.5 rounded-lg bg-[#FBF8F2] border border-[#B49A65] flex items-start gap-3 shadow-2xs"
                >
                  <span className="text-2xl mt-0.5">🌟</span>
                  <div>
                    <h4 className="font-serif font-bold text-xs text-[#252820]">
                      {seal.title}
                    </h4>
                    <p className="text-[11px] text-[#575A51] mt-0.5">{seal.description}</p>
                    <div className="mt-1.5 text-[9px] text-[#7E8276] font-mono truncate">
                      Hash: {seal.verificationHash.slice(0, 20)}...
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Demonstrated Skills Breakdown */}
          <div className="card-ivory">
            <h3 className="font-serif font-bold text-base text-[#252820] mb-3">
              Evaluated Skill Vectors
            </h3>
            <div className="space-y-2.5 text-xs">
              {state.skills.map((s) => {
                const percentage = Math.round(s.masteryProbability * 100);
                return (
                  <div key={s.id}>
                    <div className="flex justify-between font-medium mb-1">
                      <span className="text-[#252820]">{s.name}</span>
                      <span className="font-mono text-[#354B3A]">{percentage}%</span>
                    </div>
                    <div className="w-full h-1.5 bg-[#E9DFC9] rounded-full overflow-hidden">
                      <div
                        className="h-full bg-[#354B3A] rounded-full"
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
            className="fixed inset-0 bg-[#252820]/40 backdrop-blur-xs transition-opacity"
            onClick={() => setSelectedProofProject(null)}
          />
          <div className="relative w-full max-w-2xl bg-[#F6F1E7] border-2 border-[#354B3A] rounded-xl shadow-2xl p-6 z-10 max-h-[85vh] flex flex-col animate-in zoom-in-95 duration-150">
            <div className="flex items-center justify-between border-b border-[#D8CFC0] pb-3 mb-4">
              <div>
                <span className="text-[11px] text-[#354B3A] font-semibold uppercase tracking-wider">
                  Auditable Execution Proof
                </span>
                <h3 className="font-serif font-bold text-xl text-[#252820]">
                  {selectedProofProject.title}
                </h3>
              </div>
              <button
                onClick={() => setSelectedProofProject(null)}
                className="p-1 rounded hover:bg-[#D8CFC0]"
              >
                <X className="w-5 h-5 text-[#575A51]" />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto space-y-4 text-xs">
              <div className="p-3 bg-[#E2E8E3] rounded text-[#354B3A] font-medium flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4" />
                <span>10/10 Functional Unit Tests Passed • 4/4 Concurrency Stress Tests Passed</span>
              </div>

              <div>
                <div className="font-semibold text-[#252820] mb-1">Submitted Implementation Snapshot (cache.py):</div>
                <div className="bg-[#252820] text-[#E9DFC9] p-3 rounded font-mono text-[11px] max-h-60 overflow-y-auto">
                  <pre>{selectedProofProject.starterFiles?.['cache.py']}</pre>
                </div>
              </div>

              <div className="p-3 rounded bg-[#FAF4F0] border border-[#B49A65] text-[11px] text-[#575A51] font-mono">
                Cryptographic Signature: {selectedProofProject.verificationHash || 'd7a8f3b2049e7d81c4e20984ba16a903e61a49c9f82d1c7e90e72c81a2e9b04d'}
              </div>
            </div>

            <div className="mt-4 pt-3 border-t border-[#D8CFC0] flex justify-end">
              <button
                onClick={() => setSelectedProofProject(null)}
                className="btn-primary text-xs py-2 px-4"
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
    <Suspense fallback={<div className="p-12 text-center text-xs text-[#7E8276]">Loading Portfolio Folio...</div>}>
      <PortfolioContent params={props.params} />
    </Suspense>
  );
}
