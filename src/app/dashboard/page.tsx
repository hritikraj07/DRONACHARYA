// Student Dashboard: The Gurukul Courtyard
'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useDronacharya } from '@/lib/store';
import { getRankFromXp } from '@/lib/gamification';
import { getActiveSession, RegisteredUser, AVAILABLE_SUBJECTS } from '@/lib/db/auth-db';
import {
  Compass,
  ArrowRight,
  Target,
  Award,
  Code2,
  FolderGit2,
  Users,
  Flame,
  Sparkles,
  Play,
  CheckCircle2,
  TrendingUp,
} from 'lucide-react';

export default function DashboardPage() {
  const router = useRouter();
  const { state } = useDronacharya();
  const [currentUser, setCurrentUser] = useState<RegisteredUser | null>(null);

  useEffect(() => {
    const session = getActiveSession();
    if (!session) {
      router.push('/');
    } else {
      setCurrentUser(session);
    }
  }, [router]);

  const effectiveXp = currentUser ? currentUser.totalXp : state.user.totalXp;
  const { rank, title, epithet, nextRankMinXp, progressToNext } = getRankFromXp(effectiveXp);

  const activePath = state.learningPaths[0];
  const nextMission = activePath?.missions.find((m) => !m.isCompleted) || activePath?.missions[0];
  const unlockedSeals = state.seals.filter((s) => s.isUnlocked);

  const activeSubjectObj =
    AVAILABLE_SUBJECTS.find((s) => s.id === currentUser?.targetSubject) || AVAILABLE_SUBJECTS[0];

  return (
    <div className="w-full px-4 sm:px-8 py-8">
      {/* Student Courtyard Header */}
      <div className="bg-[#E9DFC9] border border-[#D8CFC0] rounded-xl p-6 sm:p-8 mb-8 relative overflow-hidden">
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div>
            <div className="inline-flex items-center gap-1.5 px-3 py-0.5 rounded-full bg-[#F6F1E7] border border-[#D8CFC0] text-xs font-semibold text-[#354B3A] mb-2">
              <span>Gurukul Courtyard</span>
              <span>•</span>
              <span className="font-serif italic">{epithet}</span>
            </div>
            <h1 className="font-serif font-bold text-3xl sm:text-4xl text-[#252820]">
              Welcome, {currentUser?.name || state.user.fullName || 'Scholar'}
            </h1>
            <p className="text-xs sm:text-sm text-[#575A51] mt-1 max-w-xl">
              Subject: <strong>{activeSubjectObj.name}</strong> • Class: <strong>{currentUser?.studentClass || 'Standard'}</strong>
            </p>
          </div>

          {/* Quick Stats Grid */}
          <div className="flex items-center gap-4">
            {/* Rank Card */}
            <div className="bg-[#F6F1E7] border border-[#B49A65] rounded-lg p-3.5 text-center min-w-[120px] shadow-xs">
              <div className="text-[10px] text-[#7E8276] uppercase tracking-wider font-semibold">Rank Tier</div>
              <div className="font-serif font-bold text-lg text-[#7A6230] mt-0.5">{rank}</div>
              <div className="text-[10px] text-[#A6AC9B]">{title}</div>
            </div>

            {/* Streak Card */}
            <div className="bg-[#F6F1E7] border border-[#D8CFC0] rounded-lg p-3.5 text-center min-w-[100px] shadow-xs">
              <div className="text-[10px] text-[#7E8276] uppercase tracking-wider font-semibold flex items-center justify-center gap-1">
                <Flame className="w-3 h-3 text-[#A65F43]" />
                <span>Streak</span>
              </div>
              <div className="font-serif font-bold text-lg text-[#A65F43] mt-0.5">
                {state.user.currentStreak} Days
              </div>
              <div className="text-[10px] text-[#354B3A]">1 Freeze Active</div>
            </div>

            {/* Total XP Card */}
            <div className="bg-[#F6F1E7] border border-[#D8CFC0] rounded-lg p-3.5 text-center min-w-[110px] shadow-xs">
              <div className="text-[10px] text-[#7E8276] uppercase tracking-wider font-semibold">Mastery XP</div>
              <div className="font-serif font-bold text-lg text-[#354B3A] mt-0.5">
                {state.user.totalXp}
              </div>
              <div className="text-[10px] text-[#7E8276]">Level Progress {progressToNext}%</div>
            </div>
          </div>
        </div>

        {/* Level Progression Progress Bar */}
        <div className="mt-6 pt-4 border-t border-[#D8CFC0]/60 flex items-center justify-between text-xs text-[#575A51]">
          <span>Rank Progress toward next tier:</span>
          <span className="font-mono">{state.user.totalXp} / {nextRankMinXp || 'MAX'} XP</span>
        </div>
        <div className="w-full h-2 bg-[#D8CFC0] rounded-full mt-1.5 overflow-hidden">
          <div
            className="h-full bg-[#354B3A] transition-all duration-500 rounded-full"
            style={{ width: `${progressToNext}%` }}
          />
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left Column: Next Recommended Mission & Learning Path */}
        <div className="lg:col-span-8 space-y-6">
          {/* Active Mission Recommendation Card */}
          {nextMission && (
            <div className="card-ivory border-l-4 border-l-[#354B3A] relative">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-semibold text-[#354B3A] uppercase tracking-wider flex items-center gap-1.5">
                  <Target className="w-4 h-4" />
                  Recommended Next Mission
                </span>
                <span className="text-xs text-[#B49A65] font-semibold">
                  +{nextMission.xpReward} XP Reward
                </span>
              </div>

              <h2 className="font-serif font-bold text-2xl text-[#252820]">
                {nextMission.title}
              </h2>
              <p className="text-xs font-semibold text-[#A65F43] mt-0.5">
                {nextMission.subtitle}
              </p>
              <p className="text-xs text-[#575A51] mt-2.5 leading-relaxed">
                {nextMission.narrativeContext}
              </p>

              <div className="mt-5 flex items-center justify-between pt-4 border-t border-[#D8CFC0]">
                <div className="text-xs text-[#7E8276]">
                  Estimated Time: ~{nextMission.estTimeMinutes} mins • Pyodide Wasm Sandbox
                </div>
                <Link
                  href={`/simulator?mission=${nextMission.id}`}
                  className="btn-primary text-xs py-2 px-4 shadow-sm"
                >
                  <span>Launch Mission Simulator</span>
                  <Play className="w-3.5 h-3.5 fill-current" />
                </Link>
              </div>
            </div>
          )}

          {/* Learning Path Questline Overview */}
          <div className="card-ivory">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="font-serif font-bold text-lg text-[#252820]">
                  Active Questline: {activePath.title}
                </h3>
                <p className="text-xs text-[#575A51]">
                  Sequential missions with prerequisite mastery unlocking.
                </p>
              </div>
              <Link href="/paths" className="text-xs text-[#354B3A] font-medium hover:underline">
                View Quest Map →
              </Link>
            </div>

            <div className="space-y-3">
              {activePath.missions.map((m, idx) => (
                <div
                  key={m.id}
                  className={`p-3.5 rounded-lg border flex items-center justify-between transition-all ${
                    m.isCompleted
                      ? 'bg-[#E2E8E3]/60 border-[#354B3A]'
                      : m.isUnlocked
                      ? 'bg-white border-[#D8CFC0] hover:bg-[#F6F1E7]'
                      : 'bg-[#F0EAE1]/50 border-[#D8CFC0] opacity-60'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <div
                      className={`w-7 h-7 rounded-full flex items-center justify-center font-bold text-xs ${
                        m.isCompleted
                          ? 'bg-[#354B3A] text-white'
                          : m.isUnlocked
                          ? 'bg-[#E9DFC9] text-[#252820]'
                          : 'bg-[#D8CFC0] text-[#7E8276]'
                      }`}
                    >
                      {m.isCompleted ? <CheckCircle2 className="w-4 h-4" /> : idx + 1}
                    </div>
                    <div>
                      <h4 className="font-serif font-bold text-sm text-[#252820]">
                        {m.title}
                      </h4>
                      <p className="text-[11px] text-[#575A51]">{m.subtitle}</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <span className="text-xs font-mono text-[#B49A65]">+{m.xpReward} XP</span>
                    {m.isUnlocked ? (
                      <Link
                        href={`/simulator?mission=${m.id}`}
                        className={`text-xs px-2.5 py-1 rounded font-medium ${
                          m.isCompleted ? 'btn-secondary text-[11px]' : 'btn-primary text-[11px]'
                        }`}
                      >
                        {m.isCompleted ? 'Revisit' : 'Enter'}
                      </Link>
                    ) : (
                      <span className="text-[11px] text-[#7E8276] px-2 py-0.5 bg-[#D8CFC0]/60 rounded">
                        Locked
                      </span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right Column: Knowledge Mastery Vector & Squad Activity */}
        <div className="lg:col-span-4 space-y-6">
          {/* Bayesian Knowledge Tracing Mastery Card */}
          <div className="card-ivory">
            <div className="flex items-center justify-between mb-3">
              <h3 className="font-serif font-bold text-base text-[#252820] flex items-center gap-1.5">
                <TrendingUp className="w-4 h-4 text-[#354B3A]" />
                <span>Knowledge Mastery (BKT)</span>
              </h3>
              <span className="text-[10px] text-[#7E8276]">P(L) Probabilities</span>
            </div>
            <p className="text-xs text-[#575A51] mb-4">
              Real-time probabilistic estimates of your understanding across skill nodes.
            </p>

            <div className="space-y-3">
              {state.skills.map((s) => {
                const percentage = Math.round(s.masteryProbability * 100);
                const isMastered = s.masteryProbability >= 0.75;
                return (
                  <div key={s.id}>
                    <div className="flex items-center justify-between text-xs mb-1">
                      <span className="font-medium text-[#252820] truncate">{s.name}</span>
                      <span
                        className={`font-mono text-[11px] font-semibold ${
                          isMastered ? 'text-[#354B3A]' : 'text-[#A65F43]'
                        }`}
                      >
                        {percentage}%
                      </span>
                    </div>
                    <div className="w-full h-1.5 bg-[#E9DFC9] rounded-full overflow-hidden">
                      <div
                        className={`h-full rounded-full transition-all duration-300 ${
                          isMastered ? 'bg-[#354B3A]' : 'bg-[#A65F43]'
                        }`}
                        style={{ width: `${percentage}%` }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Earned Seals Shelf */}
          <div className="card-ivory">
            <div className="flex items-center justify-between mb-3">
              <h3 className="font-serif font-bold text-base text-[#252820] flex items-center gap-1.5">
                <Award className="w-4 h-4 text-[#B49A65]" />
                <span>Mastery Seals</span>
              </h3>
              <Link href="/achievements" className="text-xs text-[#354B3A] hover:underline">
                View All →
              </Link>
            </div>

            {unlockedSeals.length === 0 ? (
              <div className="text-center py-5 text-xs text-[#7E8276]">
                <p>No seals unlocked yet.</p>
                <p className="mt-1">Pass Mission 1 tests to mint your first seal!</p>
              </div>
            ) : (
              <div className="space-y-2">
                {unlockedSeals.map((seal) => (
                  <div
                    key={seal.id}
                    className="p-2.5 rounded bg-[#FBF8F2] border border-[#B49A65] flex items-center gap-2.5"
                  >
                    <span className="text-lg">🌟</span>
                    <div>
                      <div className="font-serif font-bold text-xs text-[#252820]">
                        {seal.title}
                      </div>
                      <div className="text-[10px] text-[#7E8276]">Verified Proof Active</div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Gurukul Squad Activity */}
          <div className="card-ivory">
            <div className="flex items-center justify-between mb-2">
              <h3 className="font-serif font-bold text-base text-[#252820] flex items-center gap-1.5">
                <Users className="w-4 h-4 text-[#7A6230]" />
                <span>{state.squad.name}</span>
              </h3>
              <Link href="/squads" className="text-xs text-[#354B3A] hover:underline">
                Squad Hub →
              </Link>
            </div>
            <p className="text-xs text-[#575A51] mb-3">
              Weekly: <strong>{state.squad.weeklyGoal}</strong>
            </p>
            <div className="w-full h-1.5 bg-[#E9DFC9] rounded-full overflow-hidden">
              <div
                className="h-full bg-[#7A6230] rounded-full"
                style={{ width: `${state.squad.progressPercentage}%` }}
              />
            </div>
            <div className="text-[11px] text-[#7E8276] mt-1.5 text-right font-mono">
              {state.squad.progressPercentage}% Squad Goal Achieved
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
