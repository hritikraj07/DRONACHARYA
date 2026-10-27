// Cohort Mastery Leaderboard
'use client';

import React from 'react';
import { useDronacharya } from '@/lib/store';
import { Award, TrendingUp, Users, Flame, ShieldCheck } from 'lucide-react';

export default function LeaderboardPage() {
  const { state } = useDronacharya();

  const cohortStudents = [
    { rank: 1, name: 'Ananya Deshmukh', username: 'ananya-d', xp: 4820, streak: 21, sealsCount: 5, guild: 'Pune Systems Guild' },
    { rank: 2, name: 'Aarav Sharma (You)', username: state.user.username, xp: state.user.totalXp, streak: state.user.currentStreak, sealsCount: state.seals.filter(s => s.isUnlocked).length, guild: 'Kashi Algorithmic Guild' },
    { rank: 3, name: 'Priya Patel', username: 'priya-p', xp: 2140, streak: 12, sealsCount: 3, guild: 'Kashi Algorithmic Guild' },
    { rank: 4, name: 'Karthik Raman', username: 'karthik-r', xp: 1890, streak: 9, sealsCount: 2, guild: 'Bengaluru Core Guild' },
    { rank: 5, name: 'Rohit Verma', username: 'rohit-v', xp: 1420, streak: 7, sealsCount: 2, guild: 'Kashi Algorithmic Guild' },
  ];

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10 w-full">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#D8CFC0] pb-6 mb-8">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-0.5 rounded-full bg-[#E9DFC9] border border-[#B49A65] text-xs font-semibold text-[#7A6230] mb-2">
            <TrendingUp className="w-3.5 h-3.5 text-[#B49A65]" />
            <span>Fair Mastery Cohort Standings</span>
          </div>
          <h1 className="font-serif font-bold text-3xl text-[#252820]">
            Gurukul Mastery Leaderboard
          </h1>
          <p className="text-xs sm:text-sm text-[#575A51] mt-1">
            Standings are balanced by problem solving, code elegance, and peer collaboration rather than raw point grinding.
          </p>
        </div>
      </div>

      <div className="card-ivory p-0 overflow-hidden border border-[#D8CFC0]">
        <table className="w-full text-left border-collapse text-xs">
          <thead>
            <tr className="bg-[#E9DFC9]/60 border-b border-[#D8CFC0] text-[#7E8276] uppercase text-[10px] tracking-wider font-semibold">
              <th className="py-3 px-4">Rank</th>
              <th className="py-3 px-4">Scholar</th>
              <th className="py-3 px-4">Guild</th>
              <th className="py-3 px-4">Consistency</th>
              <th className="py-3 px-4 text-center">Seals</th>
              <th className="py-3 px-4 text-right">Mastery XP</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[#D8CFC0]">
            {cohortStudents.map((student) => {
              const isCurrentUser = student.username === state.user.username;
              return (
                <tr
                  key={student.username}
                  className={`transition-colors ${
                    isCurrentUser ? 'bg-[#E2E8E3]/60 font-semibold text-[#354B3A]' : 'hover:bg-[#FDFBF7]'
                  }`}
                >
                  <td className="py-3 px-4 font-serif font-bold text-sm">
                    {student.rank === 1 ? '🥇 1' : student.rank === 2 ? '🥈 2' : student.rank === 3 ? '🥉 3' : `#${student.rank}`}
                  </td>
                  <td className="py-3 px-4">
                    <div className="text-[#252820] font-medium">{student.name}</div>
                    <div className="text-[11px] text-[#7E8276]">@{student.username}</div>
                  </td>
                  <td className="py-3 px-4 text-[#575A51]">{student.guild}</td>
                  <td className="py-3 px-4">
                    <span className="inline-flex items-center gap-1 text-[#A65F43] font-semibold">
                      <Flame className="w-3 h-3 fill-current" />
                      {student.streak}d streak
                    </span>
                  </td>
                  <td className="py-3 px-4 text-center font-bold text-[#B49A65]">
                    {student.sealsCount} 🌟
                  </td>
                  <td className="py-3 px-4 text-right font-mono font-bold text-[#354B3A]">
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
