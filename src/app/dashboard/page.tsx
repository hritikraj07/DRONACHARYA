// Student Dashboard: Clean & Useful Learning Hub
'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useDronacharya } from '@/lib/store';
import { getActiveSession, RegisteredUser, AVAILABLE_SUBJECTS } from '@/lib/db/auth-db';
import {
  ArrowRight,
  Target,
  Code2,
  FolderGit2,
  Play,
  CheckCircle2,
  BookOpen,
  Sparkles,
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

  const activePath = state.learningPaths[0];
  const nextMission = activePath?.missions.find((m) => !m.isCompleted) || activePath?.missions[0];
  const completedMissionsCount = activePath?.missions.filter((m) => m.isCompleted).length || 0;
  const totalMissionsCount = activePath?.missions.length || 2;
  const progressPercent = Math.round((completedMissionsCount / totalMissionsCount) * 100);

  const activeSubjectObj =
    AVAILABLE_SUBJECTS.find((s) => s.id === currentUser?.targetSubject) || AVAILABLE_SUBJECTS[0];

  const practicalProject = state.capstones[0];

  return (
    <div className="w-full px-4 sm:px-8 py-8 max-w-6xl mx-auto">
      {/* 1. Continue Learning Banner */}
      <div className="bg-[#E9DFC9] border border-[#D8CFC0] rounded-2xl p-6 sm:p-8 mb-8 shadow-xs">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#F6F1E7] border border-[#D8CFC0] text-xs font-semibold text-[#354B3A] mb-2">
              <Sparkles className="w-3.5 h-3.5 text-[#B49A65]" />
              <span>Learning Dashboard</span>
            </div>
            <h1 className="font-serif font-bold text-3xl sm:text-4xl text-[#252820]">
              Welcome, {currentUser?.name || state.user.fullName || 'Student'}
            </h1>
            <p className="text-xs sm:text-sm text-[#575A51] mt-1.5 max-w-xl">
              Currently learning: <strong className="text-[#252820]">{activeSubjectObj.name}</strong> • Level: <strong>{currentUser?.studentClass || 'Beginner'}</strong>
            </p>
          </div>

          <Link
            href="/simulator?mission=mission-rescue-robot"
            className="btn-primary text-xs py-3 px-6 shadow-sm self-start md:self-auto flex items-center gap-2"
          >
            <span>Continue Learning</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        {/* Real Progress Bar */}
        <div className="mt-6 pt-4 border-t border-[#D8CFC0]/60">
          <div className="flex items-center justify-between text-xs text-[#575A51] mb-1.5">
            <span>Overall Topic Completion</span>
            <span className="font-semibold text-[#252820]">{completedMissionsCount} of {totalMissionsCount} missions completed ({progressPercent}%)</span>
          </div>
          <div className="w-full h-2.5 bg-[#D8CFC0] rounded-full overflow-hidden">
            <div
              className="h-full bg-[#354B3A] transition-all duration-500 rounded-full"
              style={{ width: `${progressPercent}%` }}
            />
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* 2. Next Recommended Mission */}
        <div className="lg:col-span-7 space-y-6">
          <div className="bg-white border-2 border-[#354B3A]/30 rounded-2xl p-6 shadow-sm relative">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-bold text-[#354B3A] uppercase tracking-wider flex items-center gap-1.5">
                <Target className="w-4 h-4" />
                Next Recommended Mission
              </span>
              <span className="text-xs text-[#7A6230] font-semibold bg-[#FBF8F2] px-2.5 py-0.5 rounded border border-[#B49A65]">
                Interactive Challenge
              </span>
            </div>

            <h2 className="font-serif font-bold text-2xl text-[#252820] mt-1">
              {nextMission?.title || 'Rescue the Robot'}
            </h2>
            <p className="text-xs font-semibold text-[#A65F43] mt-0.5">
              {nextMission?.subtitle || 'Learn Python Loops'}
            </p>
            <p className="text-xs sm:text-sm text-[#575A51] mt-3 leading-relaxed">
              {nextMission?.narrativeContext || 'A small rescue robot has low battery power. Write a Python loop to calculate the total energy gathered from all battery cells.'}
            </p>

            <div className="mt-6 pt-4 border-t border-[#D8CFC0] flex items-center justify-between">
              <div className="text-xs text-[#7E8276]">
                Hands-on coding in browser sandbox
              </div>
              <Link
                href={`/simulator?mission=${nextMission?.id || 'mission-rescue-robot'}`}
                className="btn-primary text-xs py-2 px-4 shadow-sm"
              >
                <span>Start Mission</span>
                <Play className="w-3.5 h-3.5 fill-current" />
              </Link>
            </div>
          </div>

          {/* Missions List */}
          <div className="bg-white border border-[#D8CFC0] rounded-2xl p-6 shadow-sm">
            <h3 className="font-serif font-bold text-lg text-[#252820] mb-3 flex items-center gap-2">
              <Code2 className="w-4 h-4 text-[#354B3A]" />
              <span>Available Missions</span>
            </h3>

            <div className="space-y-3">
              {activePath.missions.map((m, idx) => (
                <div
                  key={m.id}
                  className={`p-3.5 rounded-xl border flex items-center justify-between transition-all ${
                    m.isCompleted
                      ? 'bg-[#E2E8E3] border-[#354B3A]'
                      : 'bg-[#FAF8F5] border-[#D8CFC0] hover:bg-white'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <div
                      className={`w-7 h-7 rounded-full flex items-center justify-center font-bold text-xs ${
                        m.isCompleted
                          ? 'bg-[#354B3A] text-white'
                          : 'bg-[#E9DFC9] text-[#252820]'
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

                  <Link
                    href={`/simulator?mission=${m.id}`}
                    className="btn-primary text-[11px] py-1.5 px-3"
                  >
                    {m.isCompleted ? 'Review' : 'Enter'}
                  </Link>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* 3. Relevant Practical Project & Actual Skills */}
        <div className="lg:col-span-5 space-y-6">
          {/* Practical Project Card */}
          {practicalProject && (
            <div className="bg-white border border-[#D8CFC0] rounded-2xl p-6 shadow-sm">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-bold text-[#A65F43] uppercase tracking-wider flex items-center gap-1.5">
                  <FolderGit2 className="w-4 h-4" />
                  Practical Project
                </span>
                <span className="text-[10px] text-[#354B3A] font-semibold bg-[#E2E8E3] px-2 py-0.5 rounded">
                  Connected to Loops
                </span>
              </div>

              <h3 className="font-serif font-bold text-lg text-[#252820]">
                {practicalProject.title}
              </h3>
              <p className="text-xs text-[#575A51] mt-2 leading-relaxed">
                {practicalProject.description}
              </p>

              <div className="mt-4 pt-3 border-t border-[#D8CFC0]">
                <div className="text-xs font-semibold text-[#252820] mb-2">Key Skills Practiced:</div>
                <ul className="space-y-1 text-xs text-[#575A51]">
                  {practicalProject.learningObjectives.slice(0, 3).map((obj, i) => (
                    <li key={i} className="flex items-start gap-1.5">
                      <span className="text-[#354B3A] font-bold">✓</span>
                      <span>{obj}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="mt-5">
                <Link
                  href="/projects"
                  className="btn-primary w-full text-xs py-2.5 justify-center flex items-center gap-2"
                >
                  <span>Open Project Workspace</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            </div>
          )}

          {/* Actual Learning Progress Card */}
          <div className="bg-white border border-[#D8CFC0] rounded-2xl p-6 shadow-sm">
            <h3 className="font-serif font-bold text-base text-[#252820] mb-2">
              Demonstrated Skills
            </h3>
            <p className="text-xs text-[#575A51] mb-3">
              Skills you build through working code and practical challenge execution:
            </p>

            <div className="space-y-2.5">
              {state.skills.map((skill) => (
                <div key={skill.id} className="p-2.5 rounded-lg bg-[#FAF8F5] border border-[#D8CFC0]">
                  <div className="text-xs font-semibold text-[#252820]">{skill.name}</div>
                  <div className="text-[11px] text-[#7E8276] mt-0.5">{skill.description}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
