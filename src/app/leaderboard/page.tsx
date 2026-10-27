// Cohort Mastery Leaderboard
'use client';

import React from 'react';
import { useDronacharya } from '@/lib/store';
import { Award, TrendingUp, Users, Flame, ShieldCheck, Zap } from 'lucide-react';

export default function LeaderboardPage() {
  const { state } = useDronacharya();

  const cohortStudents = [
    { rank: 1, name: 'Ananya Deshmukh', username: 'ananya-d', xp: 4820, streak: 21, sealsCount: 5, guild: 'Pune Systems Guild' },
    { rank: 2, name: `${state.user.fullName || 'You'} (You)`, username: state.user.username || 'scholar', xp: state.user.totalXp, streak: state.user.currentStreak, sealsCount: state.seals.filter(s => s.isUnlocked).length, guild: 'Kashi Algorithmic Guild' },
    { rank: 3, name: 'Priya Patel', username: 'priya-p', xp: 2140, streak: 12, sealsCount: 3, guild: 'Kashi Algorithmic Guild' },
    { rank: 4, name: 'Karthik Raman', username: 'karthik-r', xp: 1890, streak: 9, sealsCount: 2, guild: 'Bengaluru Core Guild' },
    { rank: 5, name: 'Rohit Verma', username: 'rohit-v', xp: 1420, streak: 7, sealsCount: 2, guild: 'Kashi Algorithmic Guild' },
  ];

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10 w-full">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b-2 border-[#1E1E24] pb-6 mb-8">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#FBBF24] border-2 border-[#1E1E24] shadow-[2px_2px_0px_#1E1E24] text-xs font-black text-[#1E1E24] mb-2">
            <TrendingUp className="w-3.5 h-3.5 text-[#1E1E24]" />
            <span>Realm Standings</span>
          </div>
          <h1 className="font-black text-3xl sm:text-4xl text-[#1E1E24]">
            Adventure Leaderboard
          </h1>
          <p className="text-xs sm:text-sm text-[#4A4A58] font-bold mt-1">
            Standings are balanced by code puzzles solved, test suites passed, and cooperative guild actions.
          </p>
        </div>
      </div>

      <div className="rounded-2xl border-2 border-[#1E1E24] shadow-[4px_4px_0px_#1E1E24] overflow-hidden bg-white">
        <table className="w-full text-left border-collapse text-xs">
          <thead>
            <tr className="bg-[#FAF6EE] border-b-2 border-[#1E1E24] text-[#1E1E24] uppercase text-[10px] tracking-wider font-black">
              <th className="py-3.5 px-4">Rank</th>
              <th className="py-3.5 px-4">Player</th>
              <th className="py-3.5 px-4">Guild</th>
              <th className="py-3.5 px-4">Consistency</th>
              <th className="py-3.5 px-4 text-center">Badges</th>
              <th className="py-3.5 px-4 text-right">Mastery XP</th>
            </tr>
          </thead>
          <tbody className="divide-y-2 divide-[#1E1E24]/20 font-bold">
            {cohortStudents.map((student) => {
              const isCurrentUser = student.username === state.user.username;
              return (
                <tr
                  key={student.username}
                  className={`transition-colors ${
                    isCurrentUser ? 'bg-[#6C5CE7]/15 font-black text-[#1E1E24]' : 'hover:bg-[#FAF6EE]'
                  }`}
                >
                  <td className="py-3.5 px-4 font-black text-sm">
                    {student.rank === 1 ? '🥇 1' : student.rank === 2 ? '🥈 2' : student.rank === 3 ? '🥉 3' : `#${student.rank}`}
                  </td>
                  <td className="py-3.5 px-4">
                    <div className="text-[#1E1E24] font-black">{student.name}</div>
                    <div className="text-[11px] text-[#4A4A58]">@{student.username}</div>
                  </td>
                  <td className="py-3.5 px-4 text-[#4A4A58]">{student.guild}</td>
                  <td className="py-3.5 px-4">
                    <span className="inline-flex items-center gap-1 text-[#EF4444] font-black">
                      <Flame className="w-3.5 h-3.5 fill-current" />
                      {student.streak}d streak
                    </span>
                  </td>
                  <td className="py-3.5 px-4 text-center font-black text-[#FBBF24]">
                    {student.sealsCount} 🌟
                  </td>
                  <td className="py-3.5 px-4 text-right font-mono font-black text-[#6C5CE7]">
                    {student.xp} XP
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
