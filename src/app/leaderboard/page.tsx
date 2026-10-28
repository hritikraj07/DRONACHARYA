// Cohort Mastery Leaderboard
'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { useDronacharya } from '@/lib/store';
import { supabase } from '@/lib/supabase';
import { getActiveSession, getGuestSession } from '@/lib/db/auth-db';
import { Award, TrendingUp, Flame } from 'lucide-react';

interface LeaderboardViewRow {
  user_id?: string;
  player?: string | null;
  username?: string | null;
  guild?: string | null;
  consistency_streak?: number | null;
  badges?: number | null;
  mastery_xp?: number | null;
  rank?: number | null;
}

interface SquadRow {
  id: string;
  name: string;
  guild_xp?: number;
}

interface TableLeaderboardStudent {
  id: string;
  rank: number;
  name: string;
  username: string;
  guild: string;
  streak: number;
  badges: number;
  xp: number;
  isCurrentUser: boolean;
}

export default function LeaderboardPage() {
  const { state } = useDronacharya();
  const [students, setStudents] = useState<TableLeaderboardStudent[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  const fetchLeaderboardData = useCallback(async () => {
    try {
      // 1. Fetch live records from Supabase public.leaderboard_view and public.squads
      const [leaderboardRes, squadsRes] = await Promise.all([
        supabase
          .from('leaderboard_view')
          .select('*')
          .order('mastery_xp', { ascending: false }),
        supabase.from('squads').select('id, name, guild_xp'),
      ]);

      const rawLeaderboard: LeaderboardViewRow[] = leaderboardRes.data || [];
      const rawSquads: SquadRow[] = squadsRes.data || [];
      const defaultGuildName =
        rawSquads[0]?.name || state.squad?.name || 'Kashi Algorithmic Guild';

      // 2. Identify session status
      const activeSession = getActiveSession();
      const isLoggedIn = !!activeSession && activeSession.id !== 'guest';

      // 3. Map live rows from Supabase
      let mappedStudents: TableLeaderboardStudent[] = rawLeaderboard.map((row, idx) => {
        const isThisUser = isLoggedIn
          ? row.user_id === activeSession.id ||
            row.username === activeSession.email?.split('@')[0]
          : false;

        const displayName = isThisUser
          ? `${row.player || row.username || 'Scholar'} (You)`
          : row.player || row.username || 'Scholar';

        const usernameClean =
          row.username ||
          (row.player ? row.player.toLowerCase().replace(/\s+/g, '-') : `scholar_${idx + 1}`);

        return {
          id: row.user_id || `db-row-${idx}`,
          rank: row.rank || idx + 1,
          name: displayName,
          username: usernameClean,
          guild: row.guild || defaultGuildName,
          streak: typeof row.consistency_streak === 'number' ? row.consistency_streak : 0,
          badges: typeof row.badges === 'number' ? row.badges : 0,
          xp: typeof row.mastery_xp === 'number' ? row.mastery_xp : 0,
          isCurrentUser: isThisUser,
        };
      });

      // 4. Handle Current User or Dynamic Guest Explorer Entry
      if (isLoggedIn) {
        const userAlreadyInDb = mappedStudents.some((s) => s.isCurrentUser);
        if (!userAlreadyInDb) {
          // If logged-in user isn't in leaderboard_view yet, dynamically position them
          mappedStudents.push({
            id: activeSession.id,
            rank: 1,
            name: `${activeSession.name || 'Scholar'} (You)`,
            username: activeSession.email ? activeSession.email.split('@')[0] : 'scholar',
            guild: state.squad?.name || defaultGuildName,
            streak: activeSession.currentStreak || 0,
            badges: activeSession.unlockedSeals?.length || 0,
            xp: activeSession.totalXp || 0,
            isCurrentUser: true,
          });
        }
      } else {
        // Visitor is a Guest Explorer: compute stats from local storage & store
        const guestSession = getGuestSession();
        const guestXp = Math.max(guestSession?.totalXp || 0, state.user?.totalXp || 0);
        const guestStreak = Math.max(
          guestSession?.currentStreak || 0,
          state.user?.currentStreak || 0,
          1
        );
        const guestBadges = Math.max(
          guestSession?.unlockedSeals?.length || 0,
          state.seals?.filter((s) => s.isUnlocked).length || 0
        );
        const guestGuild = state.squad?.name || defaultGuildName;

        const guestRow: TableLeaderboardStudent = {
          id: 'guest-explorer-dynamic',
          rank: 1,
          name: 'Guest Explorer (You)',
          username: 'guest_explorer',
          guild: guestGuild,
          streak: guestStreak,
          badges: guestBadges,
          xp: guestXp,
          isCurrentUser: true,
        };

        mappedStudents.push(guestRow);
      }

      // 5. Sort all rows by mastery XP descending, then consistency streak
      mappedStudents.sort((a, b) => {
        if (b.xp !== a.xp) return b.xp - a.xp;
        if (b.streak !== a.streak) return b.streak - a.streak;
        return 0;
      });

      // 6. Assign true ranks sequentially
      mappedStudents.forEach((student, index) => {
        student.rank = index + 1;
      });

      setStudents(mappedStudents);
    } catch (err) {
      console.warn('Failed to fetch live leaderboard from Supabase:', err);
    } finally {
      setIsLoading(false);
    }
  }, [state.squad?.name, state.user?.totalXp, state.user?.currentStreak, state.seals]);

  useEffect(() => {
    fetchLeaderboardData();

    // Listen for real-time progress updates or session changes
    const handleSessionChange = () => {
      fetchLeaderboardData();
    };

    window.addEventListener('dronacharya_session_change', handleSessionChange);
    window.addEventListener('storage', handleSessionChange);

    return () => {
      window.removeEventListener('dronacharya_session_change', handleSessionChange);
      window.removeEventListener('storage', handleSessionChange);
    };
  }, [fetchLeaderboardData]);

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
            {isLoading ? (
              // Loading skeleton rows maintaining layout
              [1, 2, 3].map((n) => (
                <tr key={n} className="animate-pulse">
                  <td className="py-3.5 px-4 font-black text-sm text-gray-300">#{n}</td>
                  <td className="py-3.5 px-4">
                    <div className="h-3.5 w-28 bg-gray-200 rounded-sm mb-1" />
                    <div className="h-2.5 w-16 bg-gray-100 rounded-sm" />
                  </td>
                  <td className="py-3.5 px-4">
                    <div className="h-3 w-32 bg-gray-200 rounded-sm" />
                  </td>
                  <td className="py-3.5 px-4">
                    <div className="h-3 w-16 bg-gray-200 rounded-sm" />
                  </td>
                  <td className="py-3.5 px-4 text-center">
                    <div className="h-3 w-8 bg-gray-200 rounded-sm mx-auto" />
                  </td>
                  <td className="py-3.5 px-4 text-right">
                    <div className="h-3 w-14 bg-gray-200 rounded-sm ml-auto" />
                  </td>
                </tr>
              ))
            ) : students.length === 0 ? (
              <tr>
                <td colSpan={6} className="py-12 px-4 text-center text-gray-500 font-bold">
                  <div className="flex flex-col items-center justify-center gap-2">
                    <Award className="w-8 h-8 text-[#FBBF24]" />
                    <span className="text-sm text-[#1E1E24] font-black">No scholars recorded yet</span>
                    <span className="text-xs text-[#4A4A58]">
                      Solve missions and earn XP to claim the #1 rank in the realm!
                    </span>
                  </div>
                </td>
              </tr>
            ) : (
              students.map((student) => {
                const isCurrentUser = student.isCurrentUser;
                return (
                  <tr
                    key={student.id}
                    className={`transition-colors ${
                      isCurrentUser
                        ? 'bg-[#6C5CE7]/15 font-black text-[#1E1E24]'
                        : 'hover:bg-[#FAF6EE]'
                    }`}
                  >
                    <td className="py-3.5 px-4 font-black text-sm">
                      {student.rank === 1
                        ? '🥇 1'
                        : student.rank === 2
                        ? '🥈 2'
                        : student.rank === 3
                        ? '🥉 3'
                        : `#${student.rank}`}
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
                      {student.badges} 🌟
                    </td>
                    <td className="py-3.5 px-4 text-right font-mono font-black text-[#6C5CE7]">
                      {student.xp} XP
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
