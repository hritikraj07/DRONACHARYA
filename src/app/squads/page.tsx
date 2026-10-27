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
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-[#D8CFC0] pb-6 mb-8">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-0.5 rounded-full bg-[#E9DFC9] border border-[#B49A65] text-xs font-semibold text-[#7A6230] mb-2">
            <Users className="w-3.5 h-3.5 text-[#B49A65]" />
            <span>Collaborative Learning Guild</span>
          </div>
          <h1 className="font-serif font-bold text-3xl sm:text-4xl text-[#252820]">
            Gurukul Squads & Cohorts
          </h1>
          <p className="text-sm text-[#575A51] mt-1">
            Learn together in 3-5 member guilds. Squad points reward collaborative problem-solving and peer code reviews.
          </p>
        </div>

        {/* Join Guild Form */}
        <form onSubmit={handleJoinSubmit} className="flex items-center gap-2">
          <input
            type="text"
            value={joinCodeInput}
            onChange={(e) => setJoinCodeInput(e.target.value)}
            placeholder="Enter Join Code (e.g. KASHI7)"
            className="px-3 py-2 border border-[#D8CFC0] rounded text-xs bg-white focus:outline-none focus:border-[#354B3A]"
          />
          <button type="submit" className="btn-primary text-xs py-2 px-3 flex items-center gap-1">
            <UserPlus className="w-3.5 h-3.5" />
            <span>Join Guild</span>
          </button>
        </form>
      </div>

      {joinFeedback && (
        <div className="mb-6 p-3 rounded bg-[#E9DFC9] border border-[#D8CFC0] text-xs text-[#252820] flex items-center justify-between">
          <span>{joinFeedback}</span>
          <button onClick={() => setJoinFeedback(null)} className="font-bold">×</button>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left Column: Active Squad Overview */}
        <div className="lg:col-span-8 space-y-6">
          <div className="card-parchment">
            <div className="flex items-start justify-between">
              <div>
                <span className="text-[11px] font-semibold text-[#A65F43] uppercase tracking-wider">
                  Active Guild (Join Code: {squad.joinCode})
                </span>
                <h2 className="font-serif font-bold text-2xl text-[#252820] mt-0.5">
                  {squad.name}
                </h2>
                <p className="text-xs text-[#575A51] mt-1.5 max-w-xl leading-relaxed">
                  {squad.description}
                </p>
              </div>

              <div className="text-right">
                <div className="text-xs text-[#7E8276]">Collective Guild XP</div>
                <div className="font-serif font-bold text-2xl text-[#354B3A]">
                  {squad.collectiveXp} XP
                </div>
              </div>
            </div>

            {/* Weekly Shared Goal */}
            <div className="mt-6 p-4 rounded-lg bg-white border border-[#D8CFC0]">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-semibold text-[#252820]">
                  Weekly Milestone: {squad.weeklyGoal}
                </span>
                <span className="font-mono text-xs text-[#354B3A] font-bold">
                  {squad.progressPercentage}% Complete
                </span>
              </div>
              <div className="w-full h-2 bg-[#E9DFC9] rounded-full overflow-hidden">
                <div
                  className="h-full bg-[#354B3A] rounded-full"
                  style={{ width: `${squad.progressPercentage}%` }}
                />
              </div>
              <div className="text-[11px] text-[#7E8276] mt-2 flex items-center justify-between">
                <span>Active Squad Challenge: <strong>{squad.activeChallenge}</strong></span>
                <span>Unlocks +500 Bonus Guild XP</span>
              </div>
            </div>
          </div>

          {/* Squad Member Roster */}
          <div className="card-ivory">
            <h3 className="font-serif font-bold text-lg text-[#252820] mb-4">
              Guild Members ({squad.members.length}/5)
            </h3>
            <div className="space-y-3">
              {squad.members.map((member) => (
                <div
                  key={member.userId}
                  className="p-3.5 rounded-lg border border-[#D8CFC0] bg-[#FDFBF7] flex items-center justify-between"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-full bg-[#354B3A] text-white flex items-center justify-center font-bold text-sm">
                      {member.fullName.charAt(0)}
                    </div>
                    <div>
                      <div className="font-serif font-bold text-sm text-[#252820] flex items-center gap-2">
                        <span>{member.fullName}</span>
                        {member.role === 'leader' && (
                          <span className="text-[10px] px-2 py-0.2 bg-[#B49A65] text-white rounded font-sans uppercase">
                            Guild Lead
                          </span>
                        )}
                      </div>
                      <div className="text-[11px] text-[#7E8276]">@{member.username}</div>
                    </div>
                  </div>

                  <div className="text-right">
                    <div className="text-xs font-semibold text-[#354B3A]">
                      +{member.contributionXp} XP
                    </div>
                    <div className="text-[10px] text-[#7E8276]">Contributed This Week</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right Column: Peer Code Review Station */}
        <div className="lg:col-span-4 space-y-6">
          <div className="card-ivory">
            <h3 className="font-serif font-bold text-base text-[#252820] mb-2 flex items-center gap-1.5">
              <Sparkles className="w-4 h-4 text-[#B49A65]" />
              <span>Peer Review Station</span>
            </h3>
            <p className="text-xs text-[#575A51] mb-4 leading-relaxed">
              Earn Gurukul Honor points by reviewing a squad mate&apos;s milestone submission before final evaluation.
            </p>

            {peerReviewRequested ? (
              <div className="p-3.5 rounded bg-[#E2E8E3] border border-[#354B3A] text-xs text-[#354B3A] font-semibold">
                ✓ Peer Review Request Broadcasted to Kashi Algorithmic Guild!
              </div>
            ) : (
              <button
                onClick={() => setPeerReviewRequested(true)}
                className="btn-brass w-full text-xs py-2.5 flex items-center justify-center gap-1.5"
              >
                <span>Request Squad Code Review</span>
                <Send className="w-3.5 h-3.5" />
              </button>
            )}

            <div className="mt-4 pt-3 border-t border-[#D8CFC0] text-[11px] text-[#7E8276]">
              3 constructive peer reviews unlock the <em>Seal of the Generous Sage</em>.
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
