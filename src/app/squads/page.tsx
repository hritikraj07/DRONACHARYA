// Gurukul Squads: Collaborative Learning & Cohort Guilds
'use client';

import React, { useState } from 'react';
import { useDronacharya } from '@/lib/store';
import {
  Users,
  Award,
  CheckCircle2,
  Sparkles,
  ArrowRight,
  ShieldCheck,
  Send,
  UserPlus,
  Flame,
  Zap,
} from 'lucide-react';

export default function SquadsPage() {
  const { state, joinSquad } = useDronacharya();
  const [joinCodeInput, setJoinCodeInput] = useState('');
  const [joinFeedback, setJoinFeedback] = useState<string | null>(null);
  const [peerReviewRequested, setPeerReviewRequested] = useState(false);

  const squad = state.squad;

  const handleJoinSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const res = joinSquad(joinCodeInput);
    if (res.success) {
      setJoinFeedback('Successfully joined guild!');
      setJoinCodeInput('');
    } else {
      setJoinFeedback('Guild join code not found. Try KASHI7.');
    }
  };

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-10 w-full">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b-2 border-[#1E1E24] pb-6 mb-8">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#FBBF24] border-2 border-[#1E1E24] shadow-[2px_2px_0px_#1E1E24] text-xs font-black text-[#1E1E24] mb-2">
            <Users className="w-3.5 h-3.5 text-[#1E1E24]" />
            <span>Co-op Coding Squads</span>
          </div>
          <h1 className="font-black text-3xl sm:text-4xl text-[#1E1E24]">
            Coding Guilds & Squads
          </h1>
          <p className="text-sm text-[#4A4A58] font-bold mt-1">
            Learn together in 3-5 member guilds. Squad points reward collaborative problem-solving and peer code reviews.
          </p>
        </div>

        {/* Join Guild Form */}
        <form onSubmit={handleJoinSubmit} className="flex items-center gap-2">
          <input
            type="text"
            value={joinCodeInput}
            onChange={(e) => setJoinCodeInput(e.target.value)}
            placeholder="Enter Code (e.g. KASHI7)"
            className="px-3.5 py-2 border-2 border-[#1E1E24] rounded-xl text-xs bg-white font-bold text-[#1E1E24] shadow-[2px_2px_0px_#1E1E24] focus:outline-none"
          />
          <button type="submit" className="btn-game-purple text-xs py-2 px-3.5 flex items-center gap-1 shadow-[2px_2px_0px_#1E1E24]">
            <UserPlus className="w-3.5 h-3.5" />
            <span>Join Guild</span>
          </button>
        </form>
      </div>

      {joinFeedback && (
        <div className="mb-6 p-3.5 rounded-xl bg-[#FBBF24] border-2 border-[#1E1E24] shadow-[3px_3px_0px_#1E1E24] text-xs font-black text-[#1E1E24] flex items-center justify-between">
          <span>{joinFeedback}</span>
          <button onClick={() => setJoinFeedback(null)} className="font-black text-base">×</button>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left Column: Active Squad Overview */}
        <div className="lg:col-span-8 space-y-6">
          <div className="card-game">
            <div className="flex items-start justify-between">
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-[11px] font-black text-[#6C5CE7] uppercase tracking-wider">
                    Active Guild (Join Code: {squad.joinCode})
                  </span>
                  <span className="text-[10px] bg-[#FAF6EE] text-[#4A4A58] border border-[#1E1E24] px-2 py-0.5 rounded-lg font-black">
                    Live Co-Op Party
                  </span>
                </div>
                <h2 className="font-black text-2xl text-[#1E1E24] mt-0.5">
                  {squad.name}
                </h2>
                <p className="text-xs text-[#4A4A58] font-bold mt-1.5 max-w-xl leading-relaxed">
                  {squad.description}
                </p>
              </div>

              <div className="text-right p-3 rounded-xl bg-[#FAF6EE] border-2 border-[#1E1E24] shadow-[2px_2px_0px_#1E1E24]">
                <div className="text-[10px] text-[#4A4A58] font-black uppercase">Guild XP</div>
                <div className="font-black text-2xl text-[#6C5CE7]">
                  {squad.collectiveXp} XP
                </div>
              </div>
            </div>

            {/* Weekly Shared Goal */}
            <div className="mt-6 p-4 rounded-xl bg-[#FAF6EE] border-2 border-[#1E1E24] shadow-[3px_3px_0px_#1E1E24]">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-black text-[#1E1E24]">
                  Weekly Quest: {squad.weeklyGoal}
                </span>
                <span className="font-mono text-xs text-[#10B981] font-black">
                  {squad.progressPercentage}% Complete
                </span>
              </div>
              <div className="w-full h-3 bg-white border-2 border-[#1E1E24] rounded-full overflow-hidden">
                <div
                  className="h-full bg-[#10B981] transition-all"
                  style={{ width: `${squad.progressPercentage}%` }}
                />
              </div>
              <div className="text-[11px] text-[#4A4A58] font-bold mt-2 flex items-center justify-between">
                <span>Active Squad Challenge: <strong className="text-[#1E1E24]">{squad.activeChallenge}</strong></span>
                <span className="text-[#6C5CE7] font-black">+500 Bonus Guild XP</span>
              </div>
            </div>
          </div>

          {/* Squad Member Roster */}
          <div className="card-game">
            <h3 className="font-black text-lg text-[#1E1E24] mb-4">
              Guild Members ({squad.members.length}/5)
            </h3>
            <div className="space-y-3">
              {squad.members.map((member) => (
                <div
                  key={member.userId}
                  className="p-3.5 rounded-xl border-2 border-[#1E1E24] bg-white shadow-[2px_2px_0px_#1E1E24] flex items-center justify-between"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-[#6C5CE7] border-2 border-[#1E1E24] text-white flex items-center justify-center font-black text-base shadow-[2px_2px_0px_#1E1E24]">
                      {member.fullName.charAt(0)}
                    </div>
                    <div>
                      <div className="font-black text-sm text-[#1E1E24] flex items-center gap-2">
                        <span>{member.fullName}</span>
                        {member.role === 'leader' && (
                          <span className="text-[10px] px-2 py-0.5 bg-[#FBBF24] text-[#1E1E24] border border-[#1E1E24] rounded-md font-black uppercase shadow-[1px_1px_0px_#1E1E24]">
                            Guild Lead
                          </span>
                        )}
                      </div>
                      <div className="text-[11px] text-[#4A4A58] font-bold">@{member.username}</div>
                    </div>
                  </div>

                  <div className="text-right">
                    <div className="text-xs font-black text-[#10B981]">
                      +{member.contributionXp} XP
                    </div>
                    <div className="text-[10px] text-[#4A4A58] font-bold">Contributed This Week</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right Column: Peer Code Review Station */}
        <div className="lg:col-span-4 space-y-6">
          <div className="card-game">
            <h3 className="font-black text-base text-[#1E1E24] mb-2 flex items-center gap-1.5">
              <Sparkles className="w-4 h-4 text-[#FBBF24]" />
              <span>Peer Review Station</span>
            </h3>
            <p className="text-xs text-[#4A4A58] font-bold mb-4 leading-relaxed">
              Earn Gurukul Honor points by reviewing a squad mate&apos;s milestone submission before final evaluation.
            </p>

            {peerReviewRequested ? (
              <div className="p-3.5 rounded-xl bg-[#10B981]/20 border-2 border-[#1E1E24] text-xs text-[#1E1E24] font-black">
                ✓ Peer Review Request Broadcasted to Kashi Algorithmic Guild!
              </div>
            ) : (
              <button
                onClick={() => setPeerReviewRequested(true)}
                className="btn-game-yellow w-full text-xs py-2.5 flex items-center justify-center gap-1.5 shadow-[3px_3px_0px_#1E1E24]"
              >
                <span>Request Squad Code Review</span>
                <Send className="w-3.5 h-3.5" />
              </button>
            )}

            <div className="mt-4 pt-3 border-t-2 border-[#1E1E24] text-[11px] text-[#4A4A58] font-bold">
              3 constructive peer reviews unlock the <em>Seal of the Generous Sage</em> badge.
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
