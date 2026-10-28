// Gurukul Squads: Collaborative Learning & Cohort Guilds
'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useDronacharya } from '@/lib/store';
import { supabase } from '@/lib/supabase';
import { INITIAL_SQUADS } from '@/lib/data/curriculum';
import { GurukulSquad } from '@/types';
import { getActiveSession } from '@/lib/db/auth-db';
import {
  Users,
  Award,
  CheckCircle2,
  Sparkles,
  ArrowRight,
  ShieldCheck,
  Send,
  UserPlus,
  Plus,
  Flame,
  Zap,
  Copy,
  Check,
  X,
  UserMinus,
  Lock,
  LogIn,
} from 'lucide-react';

export default function SquadsPage() {
  const { state, joinSquad, createSquad, setSquad } = useDronacharya();
  const [joinCodeInput, setJoinCodeInput] = useState('');
  const [joinFeedback, setJoinFeedback] = useState<{ text: string; type: 'success' | 'error' } | null>(null);
  const [peerReviewRequested, setPeerReviewRequested] = useState(false);
  const [copiedCode, setCopiedCode] = useState(false);

  // Authentication check
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [requestedGuildIds, setRequestedGuildIds] = useState<string[]>([]);

  // Modals for option buttons: "Create Guild" and "Join Guild"
  const [showJoinModal, setShowJoinModal] = useState(false);
  const [showCreateModal, setShowCreateModal] = useState(false);

  // Create Guild Form State
  const [newGuildName, setNewGuildName] = useState('');
  const [newGuildDesc, setNewGuildDesc] = useState('');
  const [newGuildQuest, setNewGuildQuest] = useState('Complete Rescue the Robot challenge');
  const [newGuildCode, setNewGuildCode] = useState('');

  // Live Available Guilds (Supabase + presets + custom)
  const [availableGuilds, setAvailableGuilds] = useState<GurukulSquad[]>(INITIAL_SQUADS);

  const squad = state.squad || INITIAL_SQUADS[0];

  // Sync auth state
  useEffect(() => {
    const checkAuth = () => {
      const s = getActiveSession();
      setIsLoggedIn(!!s && s.id !== 'guest');
    };
    checkAuth();
    window.addEventListener('dronacharya_session_change', checkAuth);
    window.addEventListener('storage', checkAuth);
    return () => {
      window.removeEventListener('dronacharya_session_change', checkAuth);
      window.removeEventListener('storage', checkAuth);
    };
  }, []);

  // Fetch live guilds from Supabase on mount
  useEffect(() => {
    async function loadGuilds() {
      try {
        const { data: dbSquads } = await supabase.from('squads').select('*');
        if (dbSquads && dbSquads.length > 0) {
          const mappedDbSquads: GurukulSquad[] = dbSquads.map((sq) => {
            // Find existing matching squad for member avatars if any
            const existing = INITIAL_SQUADS.find(
              (init) => init.joinCode.toUpperCase() === (sq.join_code || '').toUpperCase()
            );

            return {
              id: sq.id,
              name: sq.name,
              joinCode: sq.join_code,
              description: sq.description || 'A dedicated learning guild.',
              collectiveXp: sq.guild_xp || existing?.collectiveXp || 380,
              weeklyGoal: sq.weekly_quest_title || 'Complete Rescue the Robot challenge',
              activeChallenge: 'Robot Grid Navigation',
              progressPercentage: sq.weekly_quest_progress || 60,
              members: existing?.members || [
                {
                  userId: 'leader-1',
                  username: 'lead_scholar',
                  fullName: 'Guild Leader',
                  role: 'leader',
                  contributionXp: 200,
                },
              ],
            };
          });

          // Merge with custom squads from localStorage
          let customSquads: GurukulSquad[] = [];
          try {
            const raw = localStorage.getItem('dronacharya_custom_squads_v1');
            if (raw) customSquads = JSON.parse(raw);
          } catch {}

          const combined = [...mappedDbSquads];
          customSquads.forEach((cs) => {
            if (!combined.some((g) => g.joinCode.toUpperCase() === cs.joinCode.toUpperCase())) {
              combined.push(cs);
            }
          });

          setAvailableGuilds(combined);
        }
      } catch (err) {
        console.warn('Could not fetch Supabase squads:', err);
      }
    }

    loadGuilds();
  }, []);

  // Generate random default code when opening Create Guild modal
  const handleOpenCreateModal = () => {
    if (!isLoggedIn) {
      setShowAuthModal(true);
      return;
    }
    const randomCode = 'GLD' + Math.floor(100 + Math.random() * 900);
    setNewGuildCode(randomCode);
    setNewGuildName('');
    setNewGuildDesc('');
    setShowCreateModal(true);
    setShowJoinModal(false);
  };

  const handleOpenJoinModal = () => {
    if (!isLoggedIn) {
      setShowAuthModal(true);
      return;
    }
    setShowJoinModal(true);
    setShowCreateModal(false);
  };

  const handleRequestToJoin = (targetGuild: GurukulSquad) => {
    if (!isLoggedIn) {
      setShowAuthModal(true);
      return;
    }
    const idKey = targetGuild.id || targetGuild.joinCode;
    setRequestedGuildIds((prev) => [...prev, idKey]);
    setJoinFeedback({
      text: `⚔️ Join request sent to ${targetGuild.name}! The guild lead will review your squad application.`,
      type: 'success',
    });
  };

  const handleRemoveMember = (memberUserId: string, memberFullName: string) => {
    const updatedMembers = squad.members.filter((m) => m.userId !== memberUserId);
    const updatedSquad: GurukulSquad = {
      ...squad,
      members: updatedMembers,
    };
    setSquad(updatedSquad);
    setJoinFeedback({
      text: `✓ Removed ${memberFullName} from ${squad.name}.`,
      type: 'success',
    });
  };

  const handleJoinSubmit = (e?: React.FormEvent, customCode?: string) => {
    if (e) e.preventDefault();
    if (!isLoggedIn) {
      setShowAuthModal(true);
      return;
    }
    const codeToJoin = customCode || joinCodeInput;
    if (!codeToJoin.trim()) return;

    const res = joinSquad(codeToJoin);
    if (res.success) {
      setJoinFeedback({
        text: `⚔️ Successfully joined ${res.squad?.name || 'guild'}!`,
        type: 'success',
      });
      setJoinCodeInput('');
      setShowJoinModal(false);
    } else {
      setJoinFeedback({
        text: res.message || 'Guild join code not found. Try KASHI7, PUNE01, or PY2026.',
        type: 'error',
      });
    }
  };

  const handleCreateSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!isLoggedIn) {
      setShowAuthModal(true);
      return;
    }
    if (!newGuildName.trim()) return;

    const res = createSquad({
      name: newGuildName,
      description: newGuildDesc || 'A dedicated learning guild for coders.',
      weeklyGoal: newGuildQuest,
      joinCode: newGuildCode,
    });

    if (res.success && res.squad) {
      setJoinFeedback({
        text: `🎉 Successfully founded ${res.squad.name}! Your join code is ${res.squad.joinCode}. Share it with friends!`,
        type: 'success',
      });
      // Add to available guilds list
      setAvailableGuilds((prev) => [res.squad!, ...prev]);
      setShowCreateModal(false);
    } else {
      setJoinFeedback({
        text: res.message || 'Failed to create guild.',
        type: 'error',
      });
    }
  };

  const handleCopyCode = (code: string) => {
    if (typeof navigator !== 'undefined' && navigator.clipboard) {
      navigator.clipboard.writeText(code);
      setCopiedCode(true);
      setTimeout(() => setCopiedCode(false), 2000);
    }
  };

  // Ensure current user is reflected in member roster
  const currentUser = state.user;
  const isMember = squad.members.some(
    (m) => m.userId === currentUser.id || m.username === currentUser.username
  );
  const displayMembers = isMember
    ? squad.members
    : [
        ...squad.members,
        {
          userId: currentUser.id || 'current-user',
          username: currentUser.username || 'scholar',
          fullName: currentUser.fullName || 'Scholar (You)',
          role: (squad.members.length === 0 ? 'leader' : 'member') as 'leader' | 'member',
          contributionXp: Math.min(currentUser.totalXp, 250),
        },
      ];

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-10 w-full text-[#1E1E24]">
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
          <p className="text-sm text-[#4A4A58] font-bold mt-1 max-w-xl">
            Learn together in 1-5 member guilds. Squad points reward collaborative problem-solving and peer code reviews.
          </p>
        </div>

        {/* Guild Option Buttons: Join Guild and Create Guild */}
        <div className="flex items-center gap-2.5 flex-wrap">
          <button
            onClick={handleOpenJoinModal}
            className="btn-arcade btn-arcade-white px-4 py-2.5 text-xs font-black flex items-center gap-2 cursor-pointer shadow-[3px_3px_0px_#1E1E24] hover:-translate-y-0.5 transition-all"
            title="Join an existing guild using a code"
          >
            <UserPlus className="w-4 h-4 text-[#6C5CE7]" />
            <span>Join Guild</span>
          </button>

          <button
            onClick={handleOpenCreateModal}
            className="btn-arcade btn-arcade-gold px-4 py-2.5 text-xs font-black flex items-center gap-2 cursor-pointer shadow-[3px_3px_0px_#1E1E24] hover:-translate-y-0.5 transition-all"
            title="Found a new guild and invite squad mates"
          >
            <Plus className="w-4 h-4 text-[#1E1E24]" />
            <span>Create Guild</span>
          </button>
        </div>
      </div>

      {/* Dynamic Feedback Toast Banner */}
      {joinFeedback && (
        <div
          className={`mb-6 p-4 rounded-2xl border-2 border-[#1E1E24] shadow-[4px_4px_0px_#1E1E24] text-xs font-black flex items-center justify-between animate-in fade-in duration-150 ${
            joinFeedback.type === 'success'
              ? 'bg-[#10B981]/15 text-emerald-950 border-emerald-600'
              : 'bg-[#EF4444]/15 text-rose-950 border-rose-600'
          }`}
        >
          <span>{joinFeedback.text}</span>
          <button
            onClick={() => setJoinFeedback(null)}
            className="font-black text-base px-2 py-0.5 hover:opacity-70 cursor-pointer"
          >
            ×
          </button>
        </div>
      )}

      {/* Main Squads Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left Column: Active Squad Overview */}
        <div className="lg:col-span-8 space-y-6">
          <div
            className="p-6 rounded-3xl border-3 border-[#1E1E24] shadow-[6px_6px_0px_#1E1E24]"
            style={{
              backgroundColor: 'rgba(255, 255, 255, 0.88)',
              backdropFilter: 'blur(16px)',
              WebkitBackdropFilter: 'blur(16px)',
            }}
          >
            <div className="flex items-start justify-between flex-wrap gap-4">
              <div>
                <div className="flex items-center gap-2 mb-1 flex-wrap">
                  <span className="text-[11px] font-black text-[#6C5CE7] uppercase tracking-wider flex items-center gap-1">
                    <span>Active Guild (Join Code: {squad.joinCode})</span>
                    <button
                      onClick={() => handleCopyCode(squad.joinCode)}
                      className="inline-flex items-center gap-1 text-[10px] px-1.5 py-0.5 rounded bg-purple-100 hover:bg-purple-200 border border-[#6C5CE7] cursor-pointer transition-colors"
                      title="Copy join code to clipboard"
                    >
                      {copiedCode ? <Check className="w-3 h-3 text-emerald-600" /> : <Copy className="w-3 h-3 text-[#6C5CE7]" />}
                      <span>{copiedCode ? 'Copied!' : 'Copy'}</span>
                    </button>
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

              <div className="text-right p-3 rounded-2xl bg-[#FAF6EE] border-2 border-[#1E1E24] shadow-[3px_3px_0px_#1E1E24] shrink-0">
                <div className="text-[10px] text-[#4A4A58] font-black uppercase">Guild XP</div>
                <div className="font-black text-2xl text-[#6C5CE7]">
                  {squad.collectiveXp} XP
                </div>
              </div>
            </div>

            {/* Weekly Shared Goal */}
            <div className="mt-6 p-4 rounded-2xl bg-[#FAF6EE] border-2 border-[#1E1E24] shadow-[3px_3px_0px_#1E1E24]">
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
              <div className="text-[11px] text-[#4A4A58] font-bold mt-2 flex items-center justify-between flex-wrap gap-1">
                <span>
                  Active Squad Challenge: <strong className="text-[#1E1E24]">{squad.activeChallenge}</strong>
                </span>
                <span className="text-[#6C5CE7] font-black">+500 Bonus Guild XP</span>
              </div>
            </div>
          </div>

          {/* Squad Member Roster */}
          <div
            className="p-6 rounded-3xl border-3 border-[#1E1E24] shadow-[6px_6px_0px_#1E1E24]"
            style={{
              backgroundColor: 'rgba(255, 255, 255, 0.88)',
              backdropFilter: 'blur(16px)',
              WebkitBackdropFilter: 'blur(16px)',
            }}
          >
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-black text-lg text-[#1E1E24]">
                Guild Members ({displayMembers.length}/5)
              </h3>
              <span className="text-xs font-bold text-gray-500 font-mono">
                {5 - displayMembers.length} Open Slots (1-5 Member Guild)
              </span>
            </div>
            <div className="space-y-3">
              {displayMembers.map((member) => (
                <div
                  key={member.userId}
                  className="p-3.5 rounded-2xl border-2 border-[#1E1E24] bg-[#FAF6EE] shadow-[3px_3px_0px_#1E1E24] flex items-center justify-between hover:bg-[#FDF9F0] transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-2xl bg-[#6C5CE7] border-2 border-[#1E1E24] text-white flex items-center justify-center font-black text-base shadow-[2px_2px_0px_#1E1E24]">
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
                        {member.userId === currentUser.id && (
                          <span className="text-[10px] px-1.5 py-0.5 bg-purple-100 text-[#6C5CE7] border border-[#6C5CE7] rounded font-black">
                            You
                          </span>
                        )}
                      </div>
                      <div className="text-[11px] text-[#4A4A58] font-bold">@{member.username}</div>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <div className="text-right">
                      <div className="text-xs font-black text-[#10B981]">
                        +{member.contributionXp} XP
                      </div>
                      <div className="text-[10px] text-[#4A4A58] font-bold">Contributed This Week</div>
                    </div>

                    {/* Option to remove guild member */}
                    {displayMembers.length > 1 && (
                      <button
                        type="button"
                        onClick={() => handleRemoveMember(member.userId, member.fullName)}
                        className="p-1.5 rounded-xl border-2 border-rose-300 bg-rose-50 hover:bg-rose-100 text-rose-600 transition-all cursor-pointer shadow-[1.5px_1.5px_0px_#EF4444] shrink-0"
                        title={`Remove ${member.fullName} from squad`}
                      >
                        <UserMinus className="w-4 h-4" />
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right Column: Peer Code Review Station & Guild Quick Switch */}
        <div className="lg:col-span-4 space-y-6">
          {/* Peer Code Review Station */}
          <div
            className="p-6 rounded-3xl border-3 border-[#1E1E24] shadow-[6px_6px_0px_#1E1E24]"
            style={{
              backgroundColor: 'rgba(255, 255, 255, 0.88)',
              backdropFilter: 'blur(16px)',
              WebkitBackdropFilter: 'blur(16px)',
            }}
          >
            <h3 className="font-black text-base text-[#1E1E24] mb-2 flex items-center gap-1.5">
              <Sparkles className="w-4 h-4 text-[#FBBF24]" />
              <span>Peer Review Station</span>
            </h3>
            <p className="text-xs text-[#4A4A58] font-bold mb-4 leading-relaxed">
              Earn Gurukul Honor points by reviewing a squad mate&apos;s milestone submission before final evaluation.
            </p>

            {peerReviewRequested ? (
              <div className="p-3.5 rounded-xl bg-[#10B981]/20 border-2 border-[#1E1E24] text-xs text-[#1E1E24] font-black animate-in fade-in duration-150">
                ✓ Peer Review Request Broadcasted to {squad.name}!
              </div>
            ) : (
              <button
                onClick={() => setPeerReviewRequested(true)}
                className="btn-arcade btn-arcade-gold w-full text-xs py-3 flex items-center justify-center gap-1.5 shadow-[3px_3px_0px_#1E1E24] cursor-pointer"
              >
                <span>Request Squad Code Review</span>
                <Send className="w-3.5 h-3.5" />
              </button>
            )}

            <div className="mt-4 pt-3 border-t-2 border-[#1E1E24] text-[11px] text-[#4A4A58] font-bold">
              3 constructive peer reviews unlock the <em>Seal of the Generous Sage</em> badge.
            </div>
          </div>

          {/* Available Guilds Quick Browse */}
          <div
            className="p-6 rounded-3xl border-3 border-[#1E1E24] shadow-[6px_6px_0px_#1E1E24] space-y-3"
            style={{
              backgroundColor: 'rgba(255, 255, 255, 0.88)',
              backdropFilter: 'blur(16px)',
              WebkitBackdropFilter: 'blur(16px)',
            }}
          >
            <div className="flex items-center justify-between">
              <h3 className="font-black text-sm text-[#1E1E24] flex items-center gap-1.5">
                <ShieldCheck className="w-4 h-4 text-[#6C5CE7]" />
                <span>Realm Guilds</span>
              </h3>
              <button
                onClick={handleOpenJoinModal}
                className="text-[11px] font-bold text-[#6C5CE7] hover:underline cursor-pointer"
              >
                View All →
              </button>
            </div>

            <div className="space-y-2.5">
              {availableGuilds.slice(0, 3).map((g) => {
                const isActive = g.joinCode.toUpperCase() === squad.joinCode.toUpperCase();
                const isRequested = requestedGuildIds.includes(g.id || g.joinCode);
                return (
                  <div
                    key={g.id || g.joinCode}
                    className={`p-3 rounded-2xl border-2 transition-all flex items-center justify-between text-xs ${
                      isActive
                        ? 'bg-purple-50 border-[#6C5CE7] shadow-[2px_2px_0px_#6C5CE7]'
                        : 'bg-[#FAF6EE] border-[#1E1E24] shadow-[2px_2px_0px_#1E1E24] hover:bg-[#FEF9C3]'
                    }`}
                  >
                    <div>
                      <div className="font-black text-[#1E1E24]">{g.name}</div>
                      <div className="text-[10px] text-gray-500 font-mono mt-0.5">
                        {g.collectiveXp} XP • {g.members?.length || 2}/5 Members
                      </div>
                    </div>

                    {isActive ? (
                      <span className="text-[10px] font-pixel font-bold px-2 py-0.5 rounded bg-[#6C5CE7] text-white">
                        ACTIVE
                      </span>
                    ) : isRequested ? (
                      <span className="text-[10px] font-bold px-2.5 py-1 rounded-xl bg-emerald-100 text-emerald-800 border border-emerald-300">
                        ✓ Requested
                      </span>
                    ) : (
                      <button
                        onClick={() => handleRequestToJoin(g)}
                        className="btn-arcade btn-arcade-white px-2.5 py-1 text-[11px] font-black cursor-pointer shadow-[2px_2px_0px_#1E1E24] flex items-center gap-1"
                      >
                        <Send className="w-3 h-3 text-[#6C5CE7]" />
                        <span>Request Join</span>
                      </button>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>

      {/* =======================================================================
          MODAL 1: JOIN GUILD
         ======================================================================= */}
      {showJoinModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-200">
          <div className="relative w-full max-w-lg bg-[#FAF6EE] text-[#1E1E24] rounded-3xl border-4 border-[#1E1E24] shadow-[10px_10px_0px_#1E1E24] p-6 space-y-5 animate-in zoom-in-95">
            <div className="flex items-center justify-between border-b-2 border-[#1E1E24] pb-3">
              <div className="flex items-center gap-2">
                <UserPlus className="w-5 h-5 text-[#6C5CE7]" />
                <h3 className="font-serif font-black text-xl text-[#1E1E24]">
                  Join an Adventurer Guild
                </h3>
              </div>
              <button
                onClick={() => setShowJoinModal(false)}
                className="w-8 h-8 rounded-xl bg-white border-2 border-[#1E1E24] flex items-center justify-center font-black hover:bg-rose-50 cursor-pointer shadow-[2px_2px_0px_#1E1E24]"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Enter Code Directly (if friend provided private code) */}
            <form onSubmit={(e) => handleJoinSubmit(e)} className="space-y-3">
              <label className="block text-xs font-black uppercase text-[#1E1E24]">
                Have a Private Invite Code?
              </label>
              <div className="flex items-center gap-2">
                <input
                  type="text"
                  value={joinCodeInput}
                  onChange={(e) => setJoinCodeInput(e.target.value)}
                  placeholder="e.g. PY2026, KASHI7"
                  className="flex-1 px-4 py-3 border-2 border-[#1E1E24] rounded-2xl text-xs font-mono font-bold bg-white text-[#1E1E24] shadow-[3px_3px_0px_#1E1E24] focus:outline-none uppercase"
                  autoFocus
                />
                <button
                  type="submit"
                  className="btn-arcade btn-arcade-gold px-5 py-3 text-xs font-black cursor-pointer shadow-[3px_3px_0px_#1E1E24]"
                >
                  Join →
                </button>
              </div>
            </form>

            {/* Active Guilds Selector (Codes hidden, Request to Join) */}
            <div className="space-y-2 pt-2 border-t-2 border-[#1E1E24]">
              <span className="text-[11px] font-black uppercase text-gray-600 block">
                Or Browse Active Realm Guilds:
              </span>

              <div className="max-h-56 overflow-y-auto space-y-2 pr-1">
                {availableGuilds.map((g) => {
                  const isActive = g.joinCode.toUpperCase() === squad.joinCode.toUpperCase();
                  const isRequested = requestedGuildIds.includes(g.id || g.joinCode);
                  return (
                    <div
                      key={g.id || g.joinCode}
                      className={`p-3 rounded-2xl border-2 flex items-center justify-between text-xs transition-all ${
                        isActive
                          ? 'bg-purple-100 border-[#6C5CE7] shadow-[2px_2px_0px_#6C5CE7]'
                          : 'bg-white border-[#1E1E24] shadow-[2px_2px_0px_#1E1E24] hover:bg-amber-50'
                      }`}
                    >
                      <div>
                        <div className="font-black text-[#1E1E24]">{g.name}</div>
                        <div className="text-[11px] text-gray-500 font-mono mt-0.5">
                          {g.collectiveXp} XP • {g.members?.length || 2}/5 Members
                        </div>
                      </div>

                      {isActive ? (
                        <span className="text-[10px] font-pixel px-2.5 py-1 rounded-md bg-[#6C5CE7] text-white font-bold">
                          CURRENT
                        </span>
                      ) : isRequested ? (
                        <span className="text-[10px] font-bold px-2.5 py-1 rounded-xl bg-emerald-100 text-emerald-800 border border-emerald-300">
                          ✓ Requested
                        </span>
                      ) : (
                        <button
                          onClick={() => {
                            handleRequestToJoin(g);
                            setShowJoinModal(false);
                          }}
                          className="btn-arcade btn-arcade-white px-3 py-1.5 text-xs font-black cursor-pointer shadow-[2px_2px_0px_#1E1E24] flex items-center gap-1"
                        >
                          <Send className="w-3.5 h-3.5 text-[#6C5CE7]" />
                          <span>Request to Join</span>
                        </button>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* =======================================================================
          MODAL 2: CREATE GUILD
         ======================================================================= */}
      {showCreateModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-200">
          <div className="relative w-full max-w-lg bg-[#FAF6EE] text-[#1E1E24] rounded-3xl border-4 border-[#1E1E24] shadow-[10px_10px_0px_#1E1E24] p-6 space-y-5 animate-in zoom-in-95">
            <div className="flex items-center justify-between border-b-2 border-[#1E1E24] pb-3">
              <div className="flex items-center gap-2">
                <Plus className="w-5 h-5 text-[#FFD214]" />
                <h3 className="font-serif font-black text-xl text-[#1E1E24]">
                  Found a New Adventurer Guild
                </h3>
              </div>
              <button
                onClick={() => setShowCreateModal(false)}
                className="w-8 h-8 rounded-xl bg-white border-2 border-[#1E1E24] flex items-center justify-center font-black hover:bg-rose-50 cursor-pointer shadow-[2px_2px_0px_#1E1E24]"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleCreateSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-black uppercase text-[#1E1E24] mb-1">
                  Guild Name
                </label>
                <input
                  type="text"
                  required
                  value={newGuildName}
                  onChange={(e) => setNewGuildName(e.target.value)}
                  placeholder="e.g. Arya Autonomous Guild"
                  className="w-full px-4 py-2.5 border-2 border-[#1E1E24] rounded-2xl text-xs font-bold bg-white text-[#1E1E24] shadow-[2px_2px_0px_#1E1E24] focus:outline-none"
                  autoFocus
                />
              </div>

              <div>
                <label className="block text-xs font-black uppercase text-[#1E1E24] mb-1">
                  Description
                </label>
                <textarea
                  rows={2}
                  value={newGuildDesc}
                  onChange={(e) => setNewGuildDesc(e.target.value)}
                  placeholder="e.g. Dedicated guild for learners tackling Python loops, logic & code reviews."
                  className="w-full px-4 py-2.5 border-2 border-[#1E1E24] rounded-2xl text-xs font-bold bg-white text-[#1E1E24] shadow-[2px_2px_0px_#1E1E24] focus:outline-none resize-none"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-black uppercase text-[#1E1E24] mb-1">
                    Weekly Quest Goal
                  </label>
                  <input
                    type="text"
                    value={newGuildQuest}
                    onChange={(e) => setNewGuildQuest(e.target.value)}
                    className="w-full px-3.5 py-2.5 border-2 border-[#1E1E24] rounded-2xl text-xs font-bold bg-white text-[#1E1E24] shadow-[2px_2px_0px_#1E1E24] focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-black uppercase text-[#1E1E24] mb-1">
                    Join Code (Share with Squad)
                  </label>
                  <input
                    type="text"
                    required
                    value={newGuildCode}
                    onChange={(e) => setNewGuildCode(e.target.value.toUpperCase())}
                    className="w-full px-3.5 py-2.5 border-2 border-[#1E1E24] rounded-2xl text-xs font-mono font-black bg-white text-[#1E1E24] shadow-[2px_2px_0px_#1E1E24] focus:outline-none uppercase"
                  />
                </div>
              </div>

              <div className="pt-3 border-t-2 border-[#1E1E24] flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setShowCreateModal(false)}
                  className="btn-arcade btn-arcade-white px-4 py-2.5 text-xs font-black cursor-pointer shadow-[2px_2px_0px_#1E1E24]"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="btn-arcade btn-arcade-gold px-6 py-2.5 text-xs font-black cursor-pointer shadow-[3px_3px_0px_#1E1E24]"
                >
                  Found Guild ⚔️
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* =======================================================================
          MODAL 3: LOGIN REQUIRED
         ======================================================================= */}
      {showAuthModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-200">
          <div className="relative w-full max-w-md bg-[#FAF6EE] text-[#1E1E24] rounded-3xl border-4 border-[#1E1E24] shadow-[10px_10px_0px_#1E1E24] p-6 space-y-5 animate-in zoom-in-95">
            <div className="flex items-center justify-between border-b-2 border-[#1E1E24] pb-3">
              <div className="flex items-center gap-2">
                <Lock className="w-5 h-5 text-[#6C5CE7]" />
                <h3 className="font-serif font-black text-xl text-[#1E1E24]">
                  Adventurer Login Required
                </h3>
              </div>
              <button
                onClick={() => setShowAuthModal(false)}
                className="w-8 h-8 rounded-xl bg-white border-2 border-[#1E1E24] flex items-center justify-center font-black hover:bg-rose-50 cursor-pointer shadow-[2px_2px_0px_#1E1E24]"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="p-4 rounded-2xl bg-amber-50 border-2 border-[#1E1E24] text-xs font-bold text-[#1E1E24] leading-relaxed shadow-[2px_2px_0px_#1E1E24]">
              🛡️ <strong>Squad Membership:</strong> You must be signed in to create, join, or send join requests to coding guilds. Sign in or create a free adventurer account to collaborate with squad mates!
            </div>

            <div className="flex flex-col sm:flex-row gap-3 pt-2">
              <Link
                href="/auth?mode=signin"
                className="flex-1 btn-arcade btn-arcade-purple py-3 text-center text-xs font-black shadow-[2px_2px_0px_#1E1E24]"
              >
                Sign In to Account
              </Link>
              <Link
                href="/auth?mode=signup"
                className="flex-1 btn-arcade btn-arcade-gold py-3 text-center text-xs font-black shadow-[2px_2px_0px_#1E1E24]"
              >
                Create Account Free
              </Link>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
