// Student Progress: My Demonstrated Skills & Projects
'use client';

import React from 'react';
import Link from 'next/link';
import { useDronacharya } from '@/lib/store';
import {
  Award,
  CheckCircle2,
  Code2,
  FolderGit2,
  ArrowRight,
  Sparkles,
} from 'lucide-react';

export default function MyProgressPage() {
  const { state } = useDronacharya();

  const activePath = state.learningPaths[0];
  const completedMissions = activePath?.missions.filter((m) => m.isCompleted) || [];
  const verifiedProject = state.capstones.find((c) => c.isVerified || c.isSubmitted) || state.capstones[0];

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10 w-full">
      {/* Header */}
      <div className="bg-[#E9DFC9] border border-[#D8CFC0] rounded-2xl p-6 sm:p-8 mb-8 shadow-xs">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#F6F1E7] border border-[#D8CFC0] text-xs font-semibold text-[#354B3A] mb-2">
              <Award className="w-3.5 h-3.5 text-[#B49A65]" />
              <span>Skill Progress Portfolio</span>
            </div>
            <h1 className="font-serif font-bold text-3xl text-[#252820]">
              My Learning Progress
            </h1>
            <p className="text-xs sm:text-sm text-[#575A51] mt-1">
              Track skills you have demonstrated through practical challenges and working projects.
            </p>
          </div>

          <div className="text-right">
            <div className="text-xs text-[#7E8276]">Total Score</div>
            <div className="font-serif font-bold text-2xl text-[#354B3A]">
              {state.user.totalXp} XP
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Missions Completed */}
        <div className="bg-white border border-[#D8CFC0] rounded-xl p-5 shadow-xs">
          <div className="flex items-center justify-between mb-3 border-b border-[#D8CFC0] pb-2">
            <h3 className="font-serif font-bold text-base text-[#252820] flex items-center gap-2">
              <Code2 className="w-4 h-4 text-[#354B3A]" />
              <span>Missions Completed</span>
            </h3>
            <span className="text-xs font-semibold text-[#354B3A]">
              {completedMissions.length} of {activePath.missions.length}
            </span>
          </div>

          {completedMissions.length === 0 ? (
            <div className="py-6 text-center text-xs text-[#7E8276]">
              <p>No missions completed yet.</p>
              <Link
                href="/simulator?mission=mission-rescue-robot"
                className="mt-2 inline-block text-[#354B3A] font-semibold underline"
              >
                Start Mission: Rescue the Robot →
              </Link>
            </div>
          ) : (
            <div className="space-y-2.5">
              {completedMissions.map((m) => (
                <div key={m.id} className="p-3 rounded-lg bg-[#E2E8E3] border border-[#354B3A] flex items-center justify-between">
                  <div>
                    <div className="font-semibold text-xs text-[#252820]">{m.title}</div>
                    <div className="text-[11px] text-[#575A51]">{m.subtitle}</div>
                  </div>
                  <CheckCircle2 className="w-4 h-4 text-[#354B3A]" />
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Practical Projects */}
        <div className="bg-white border border-[#D8CFC0] rounded-xl p-5 shadow-xs">
          <div className="flex items-center justify-between mb-3 border-b border-[#D8CFC0] pb-2">
            <h3 className="font-serif font-bold text-base text-[#252820] flex items-center gap-2">
              <FolderGit2 className="w-4 h-4 text-[#A65F43]" />
              <span>Applied Practical Projects</span>
            </h3>
            <Link href="/projects" className="text-xs text-[#354B3A] font-semibold underline">
              Open Workspace
            </Link>
          </div>

          <div className="p-3.5 rounded-lg bg-[#FAF8F5] border border-[#D8CFC0]">
            <div className="flex items-center justify-between">
              <span className="font-serif font-bold text-sm text-[#252820]">
                {verifiedProject.title}
              </span>
              <span className={`text-[10px] font-semibold px-2 py-0.5 rounded ${
                verifiedProject.isVerified ? 'bg-[#E2E8E3] text-[#354B3A]' : 'bg-[#E9DFC9] text-[#7A6230]'
              }`}>
                {verifiedProject.isVerified ? 'Verified' : 'In Progress'}
              </span>
            </div>
            <p className="text-xs text-[#575A51] mt-1.5 line-clamp-2">
              {verifiedProject.description}
            </p>
          </div>
        </div>

        {/* Demonstrated Practical Skills */}
        <div className="md:col-span-2 bg-white border border-[#D8CFC0] rounded-xl p-5 shadow-xs">
          <h3 className="font-serif font-bold text-base text-[#252820] mb-3">
            Practical Skills Verified
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3">
            {state.skills.map((skill) => (
              <div key={skill.id} className="p-3 rounded-lg bg-[#FAF8F5] border border-[#D8CFC0]">
                <div className="text-xs font-semibold text-[#252820]">{skill.name}</div>
                <div className="text-[11px] text-[#7E8276] mt-1">{skill.description}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
