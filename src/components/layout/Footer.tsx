'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { X, ExternalLink, Users, Sparkles } from 'lucide-react';

interface TeamMember {
  name: string;
  role: string;
  tag: string;
  github: string;
  linkedin: string;
  avatarBg: string;
  avatarText: string;
  handle: string;
}

const TEAM_MEMBERS: TeamMember[] = [
  {
    name: 'Hritik Raj',
    role: 'Lead Architect & Core Developer',
    tag: 'Lead Visionary',
    github: 'https://github.com/hritikraj07',
    linkedin: 'https://www.linkedin.com/in/hritikraj07/',
    avatarBg: 'bg-[#6C5CE7]',
    avatarText: 'HR',
    handle: '@hritikraj07',
  },
  {
    name: 'Mukesh Parihar',
    role: 'Full-Stack & Systems Engineer',
    tag: 'Systems Architect',
    github: 'https://github.com/MukeshParihar007',
    linkedin: 'https://www.linkedin.com/in/msp007/',
    avatarBg: 'bg-[#00B894]',
    avatarText: 'MP',
    handle: '@MukeshParihar007',
  },
  {
    name: 'Nishtha Goyal',
    role: 'Frontend & Interactive UX Designer',
    tag: 'Creative UI / UX',
    github: 'https://github.com/nishthagoyal7',
    linkedin: 'https://www.linkedin.com/in/nishtha-goyal-a2a683441/',
    avatarBg: 'bg-[#FD79A8]',
    avatarText: 'NG',
    handle: '@nishthagoyal7',
  },
  {
    name: 'Pankaj Bhardwaj',
    role: 'Backend & Cloud AI Engineer',
    tag: 'AI & Data Flow',
    github: 'https://github.com/PANKAJBHARDWAJ9818',
    linkedin: 'https://www.linkedin.com/in/pankaj-bhardwaj-092a95404/',
    avatarBg: 'bg-[#F59E0B]',
    avatarText: 'PB',
    handle: '@PANKAJBHARDWAJ9818',
  },
];

export function Footer() {
  const currentYear = 2026;
  const [teamModalType, setTeamModalType] = useState<'github' | 'linkedin' | null>(null);

  return (
    <>
      <footer className="w-full bg-[#FAF6EE] text-[#1E1E24] border-t-2 border-[#1E1E24] mt-auto select-none py-10 px-4 sm:px-8">
        <div className="max-w-7xl mx-auto space-y-10">
          {/* Top Header: Brand Logo & Made with Heart */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-[#E2E8F0]">
            {/* Logo & Brand Wordmark */}
            <Link href="/" className="flex items-center gap-2.5 group w-fit">
              <div className="relative">
                <img
                  src="/logo.png"
                  alt="Dronacharya Logo"
                  className="w-9 h-9 rounded-xl border-2 border-[#1E1E24] object-cover shadow-[2px_2px_0px_#1E1E24] group-hover:rotate-6 group-hover:scale-105 transition-all shrink-0 bg-white"
                />
                <span className="absolute -top-1 -right-1 w-2.5 h-2.5 rounded-full bg-[#10B981] border border-[#1E1E24]" />
              </div>
              <div className="flex flex-col">
                <div className="flex items-center gap-1.5 leading-none">
                  <span className="font-serif font-black text-lg sm:text-xl tracking-tight text-[#1E1E24] group-hover:text-[#6C5CE7] transition-colors">
                    DRONACHARYA
                  </span>
                  <span className="text-amber-500 font-bold text-sm sm:text-base">⋆˙⟡</span>
                </div>
                <span className="text-[9px] font-black tracking-wider uppercase text-[#B45309] bg-[#FEF3C7] px-1.5 py-0.2 rounded-md border border-[#F59E0B]/30 inline-block shadow-2xs mt-1 w-fit">
                  Coding Adventure
                </span>
              </div>
            </Link>

            {/* Made with pixel heart by Team Dronacharya */}
            <div className="flex items-center gap-2 text-xs sm:text-sm font-semibold text-[#64748B]">
              <span>Crafted with</span>
              {/* Codédex Pixel Art Heart */}
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="20"
                height="20"
                viewBox="0 0 20 20"
                fill="none"
                className="inline-block hover:scale-125 transition-transform"
              >
                <path
                  fillRule="evenodd"
                  clipRule="evenodd"
                  d="M7.5 3.33301V4.99967H9.16667V6.66634H10.8333V4.99967H12.5V3.33301H15.8333V4.99967H17.5V9.99967H15.8333V11.6663H14.1667V13.333H12.5V14.9997H10.8333V16.6663H9.16667V14.9997H7.5V13.333H5.83333V11.6663H4.16667V9.99967H2.5V4.99967H4.16667V3.33301H7.5Z"
                  fill="#F43F5E"
                />
                <path
                  fillRule="evenodd"
                  clipRule="evenodd"
                  d="M7.50004 1.66699H4.16671V3.33366H2.50004V5.00033H0.833374V10.0003H2.50004V11.667H4.16671V13.3337H5.83337V15.0003H7.50004V16.667H9.16671V18.3337H10.8334V16.667H12.5V15.0003H14.1667V13.3337H15.8334V11.667H17.5V10.0003H19.1667V5.00033H17.5V3.33366H15.8334V1.66699H12.5V3.33366H10.8334V5.00033H9.16671V3.33366H7.50004V1.66699ZM7.50004 3.33366V5.00033H9.16671V6.66699H10.8334V5.00033H12.5V3.33366H15.8334V5.00033H17.5V10.0003H15.8334V11.667H14.1667V13.3337H12.5V15.0003H10.8334V16.667H9.16671V15.0003H7.50004V13.3337H5.83337V11.667H4.16671V10.0003H2.50004V5.00033H4.16671V3.33366H7.50004Z"
                  fill="#020617"
                />
                <rect x="14.1666" y="5" width="1.66667" height="1.66667" fill="white" />
                <rect x="14.1666" y="6.66699" width="1.66667" height="1.66667" fill="white" />
                <rect x="12.5" y="5" width="1.66667" height="1.66667" fill="white" />
              </svg>
              <span>by Team Dronacharya</span>
            </div>
          </div>

          {/* Multi-Column Links Grid: Gurukul Platform, Practice, Learn Tracks, Advanced */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 sm:gap-10">
            {/* Col 1: Renamed from Company to Gurukul Platform (unnecessary Blog/Pricing/Schools removed) */}
            <div className="space-y-3.5">
              <h4 className="text-xs font-black uppercase tracking-wider text-[#020617] flex items-center gap-1.5">
                <Users className="w-3.5 h-3.5 text-[#6C5CE7]" />
                <span>Gurukul Platform</span>
              </h4>
              <ul className="space-y-2.5 text-xs sm:text-sm font-medium text-[#64748B]">
                <li>
                  <Link href="/about" className="hover:text-[#020617] hover:underline transition-colors font-bold text-[#1E1E24]">
                    About Dronacharya
                  </Link>
                </li>
                <li>
                  <Link href="/paths" className="hover:text-[#020617] hover:underline transition-colors">
                    Curriculum World Map
                  </Link>
                </li>
                <li>
                  <Link href="/leaderboard" className="hover:text-[#020617] hover:underline transition-colors">
                    Global Leaderboard
                  </Link>
                </li>
                <li>
                  <Link href="/squads" className="hover:text-[#020617] hover:underline transition-colors">
                    Adventurer Squads
                  </Link>
                </li>
                <li>
                  <button
                    onClick={() => setTeamModalType('github')}
                    className="hover:text-[#6C5CE7] hover:underline transition-colors text-left font-bold cursor-pointer"
                  >
                    Meet the Creators (4) ↗
                  </button>
                </li>
              </ul>
            </div>

            {/* Col 2: PRACTICE */}
            <div className="space-y-3.5">
              <h4 className="text-xs font-black uppercase tracking-wider text-[#020617]">
                Practice Arena
              </h4>
              <ul className="space-y-2.5 text-xs sm:text-sm font-medium text-[#64748B]">
                <li>
                  <Link href="/simulator?mission=mission-rescue-robot" className="hover:text-[#020617] hover:underline transition-colors">
                    Rover Arya 2D Simulator
                  </Link>
                </li>
                <li>
                  <Link href="/simulator?mission=mission-hazard-filter" className="hover:text-[#020617] hover:underline transition-colors">
                    Hazard Cell Filter
                  </Link>
                </li>
                <li>
                  <Link href="/dungeon" className="hover:text-[#020617] hover:underline transition-colors font-bold text-[#6C5CE7]">
                    ⚔️ Python Code Dungeon
                  </Link>
                </li>
                <li>
                  <Link href="/learn/py-less-1-1" className="hover:text-[#020617] hover:underline transition-colors">
                    🚀 Python Odyssey RPG
                  </Link>
                </li>
                <li>
                  <Link href="/leaderboard" className="hover:text-[#020617] hover:underline transition-colors">
                    Quest Hall of Fame
                  </Link>
                </li>
              </ul>
            </div>

            {/* Col 3: LEARN (Active 4 Tracks & Foundations) */}
            <div className="space-y-3.5">
              <h4 className="text-xs font-black uppercase tracking-wider text-[#020617]">
                Core Curriculums
              </h4>
              <ul className="space-y-2.5 text-xs sm:text-sm font-medium text-[#64748B]">
                <li>
                  <Link href="/courses" className="text-[#6C5CE7] font-bold hover:underline">
                    All Courses →
                  </Link>
                </li>
                <li>
                  <Link href="/learn/html-less-1-1" className="hover:text-[#020617] hover:underline transition-colors flex items-center justify-between">
                    <span>HTML Web Forge</span>
                    <span className="text-[10px] font-mono text-[#00B894] font-bold">Active</span>
                  </Link>
                </li>
                <li>
                  <Link href="/learn/css-less-1-1" className="hover:text-[#020617] hover:underline transition-colors flex items-center justify-between">
                    <span>CSS Stylist Peak</span>
                    <span className="text-[10px] font-mono text-[#00B894] font-bold">Active</span>
                  </Link>
                </li>
                <li>
                  <Link href="/learn/js-less-1-1" className="hover:text-[#020617] hover:underline transition-colors flex items-center justify-between">
                    <span>JavaScript Nexus</span>
                    <span className="text-[10px] font-mono text-[#00B894] font-bold">Active</span>
                  </Link>
                </li>
                <li>
                  <Link href="/learn/py-less-1-1" className="hover:text-[#020617] hover:underline transition-colors flex items-center justify-between">
                    <span>Python Sanctuary</span>
                    <span className="text-[10px] font-mono text-[#00B894] font-bold">Active</span>
                  </Link>
                </li>
              </ul>
            </div>

            {/* Col 4: Advanced Specializations */}
            <div className="space-y-3.5">
              <h4 className="text-xs font-black uppercase tracking-wider text-[#020617]">
                Specializations
              </h4>
              <ul className="space-y-2.5 text-xs sm:text-sm font-medium text-[#64748B]">
                <li>
                  <Link href="/courses/react" className="hover:text-[#020617] hover:underline transition-colors">
                    React Frontend Architecture
                  </Link>
                </li>
                <li>
                  <Link href="/courses/nodejs" className="hover:text-[#020617] hover:underline transition-colors">
                    Node.js & Express Backends
                  </Link>
                </li>
                <li>
                  <Link href="/courses/sql" className="hover:text-[#020617] hover:underline transition-colors">
                    Relational SQL Databases
                  </Link>
                </li>
                <li>
                  <Link href="/courses/ml" className="hover:text-[#020617] hover:underline transition-colors">
                    Machine Learning & AI
                  </Link>
                </li>
                <li>
                  <Link href="/courses" className="hover:text-[#020617] hover:underline transition-colors">
                    Algorithms & Problem Solving
                  </Link>
                </li>
              </ul>
            </div>
          </div>

          {/* Bottom Bar: Copyright, Terms, Privacy & Social Icons */}
          <div className="pt-6 border-t border-[#E2E8F0] flex flex-col sm:flex-row items-center justify-between gap-4 text-xs font-medium text-[#64748B]">
            <div className="flex flex-wrap items-center gap-4">
              <span>© {currentYear} DRONACHARYA ⋆˙⟡ (The Digital Gurukul)</span>
              <span>•</span>
              <Link href="/about" className="hover:text-[#020617] hover:underline font-bold text-[#6C5CE7]">
                About
              </Link>
              <span>•</span>
              <Link href="/terms" className="hover:text-[#020617] hover:underline">
                Terms
              </Link>
              <span>•</span>
              <Link href="/privacy" className="hover:text-[#020617] hover:underline">
                Privacy Policy
              </Link>
            </div>

            {/* Social Icons (Click opens themed 4-member profile window in same tab) */}
            <div className="flex items-center gap-3">
              {/* GitHub Button -> Opens Themed 4-member GitHub Modal */}
              <button
                type="button"
                onClick={() => setTeamModalType('github')}
                className="w-9 h-9 rounded-xl bg-white border-2 border-[#1E1E24] flex items-center justify-center text-[#1E1E24] hover:bg-[#FAF6EE] hover:text-[#6C5CE7] shadow-[2px_2px_0px_#1E1E24] hover:-translate-y-0.5 active:translate-y-0 transition-all cursor-pointer"
                aria-label="View 4 Member GitHub Profiles"
                title="View Team GitHub Profiles (4 Members)"
              >
                <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                  <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0024 12c0-6.63-5.37-12-12-12z" />
                </svg>
              </button>

              {/* LinkedIn Button -> Opens Themed 4-member LinkedIn Modal */}
              <button
                type="button"
                onClick={() => setTeamModalType('linkedin')}
                className="w-9 h-9 rounded-xl bg-white border-2 border-[#1E1E24] flex items-center justify-center text-[#1E1E24] hover:bg-[#0A66C2] hover:text-white hover:border-[#0A66C2] shadow-[2px_2px_0px_#1E1E24] hover:-translate-y-0.5 active:translate-y-0 transition-all cursor-pointer"
                aria-label="View 4 Member LinkedIn Profiles"
                title="View Team LinkedIn Profiles (4 Members)"
              >
                <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                  <path d="M19 3a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h14m-.5 15.5v-5.3a3.26 3.26 0 0 0-3.26-3.26c-.85 0-1.84.52-2.28 1.3v-1.11h-2.79v8.37h2.79v-4.93c0-.77.62-1.4 1.39-1.4a1.4 1.4 0 0 1 1.4 1.4v4.93h2.75M6.46 10.9h2.79v8.37H6.46v-8.37M7.86 6.81a1.62 1.62 0 1 0 0 3.24 1.62 1.62 0 0 0 0-3.24z" />
                </svg>
              </button>

              {/* Mail Button */}
              <a
                href="mailto:nhkmukxsh@gmail.com"
                className="w-9 h-9 rounded-xl bg-white border-2 border-[#1E1E24] flex items-center justify-center text-[#1E1E24] hover:bg-[#EA4335] hover:text-white hover:border-[#EA4335] shadow-[2px_2px_0px_#1E1E24] hover:-translate-y-0.5 active:translate-y-0 transition-all"
                aria-label="Email"
                title="Send Email to Team Dronacharya"
              >
                <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                  <path d="M20 4H4c-1.1 0-1.99.9-1.99 2L2 18c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 4l-8 5-8-5V6l8 5 8-5v2z" />
                </svg>
              </a>
            </div>
          </div>
        </div>
      </footer>

      {/* =========================================================================
          THEMED IN-PAGE MODAL: 4 DEVELOPER PROFILES (GITHUB / LINKEDIN)
          Opens in the same tab with full retro-arcade Dronacharya aesthetics
         ========================================================================= */}
      {teamModalType !== null && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-200"
          onClick={() => setTeamModalType(null)}
          role="dialog"
          aria-modal="true"
        >
          <div
            className="relative w-full max-w-2xl bg-[#FAF6EE] rounded-3xl border-3 border-[#1E1E24] shadow-[8px_8px_0px_#1E1E24] p-5 sm:p-7 overflow-hidden text-[#1E1E24] animate-in zoom-in-95 duration-150"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div className="flex items-start justify-between gap-4 pb-4 border-b-2 border-[#1E1E24]/20 mb-5">
              <div className="flex items-center gap-3">
                <div
                  className={`w-12 h-12 rounded-2xl border-2 border-[#1E1E24] flex items-center justify-center shadow-[2px_2px_0px_#1E1E24] shrink-0 ${
                    teamModalType === 'github' ? 'bg-[#1E1E24] text-white' : 'bg-[#0A66C2] text-white'
                  }`}
                >
                  {teamModalType === 'github' ? (
                    <svg className="w-6 h-6 fill-current" viewBox="0 0 24 24">
                      <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0024 12c0-6.63-5.37-12-12-12z" />
                    </svg>
                  ) : (
                    <svg className="w-6 h-6 fill-current" viewBox="0 0 24 24">
                      <path d="M19 3a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h14m-.5 15.5v-5.3a3.26 3.26 0 0 0-3.26-3.26c-.85 0-1.84.52-2.28 1.3v-1.11h-2.79v8.37h2.79v-4.93c0-.77.62-1.4 1.39-1.4a1.4 1.4 0 0 1 1.4 1.4v4.93h2.75M6.46 10.9h2.79v8.37H6.46v-8.37M7.86 6.81a1.62 1.62 0 1 0 0 3.24 1.62 1.62 0 0 0 0-3.24z" />
                    </svg>
                  )}
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="font-serif font-black text-lg sm:text-xl text-[#1E1E24]">
                      {teamModalType === 'github'
                        ? 'Dronacharya Core Team • GitHub'
                        : 'Dronacharya Core Team • LinkedIn'}
                    </h3>
                    <Sparkles className="w-4 h-4 text-amber-500 fill-amber-400" />
                  </div>
                  <p className="text-xs text-[#64748B] font-bold">
                    {teamModalType === 'github'
                      ? 'Browse repositories and open source contributions from all 4 team members.'
                      : 'Connect and network professionally with all 4 Dronacharya engineers.'}
                  </p>
                </div>
              </div>

              {/* Close Button */}
              <button
                type="button"
                onClick={() => setTeamModalType(null)}
                className="p-2 rounded-xl bg-white border-2 border-[#1E1E24] shadow-[2px_2px_0px_#1E1E24] hover:bg-rose-50 hover:text-rose-600 transition-all cursor-pointer shrink-0"
                aria-label="Close Modal"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* 4 Members Grid (Tactile Retro-Arcade Cards) */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 max-h-[65vh] overflow-y-auto pr-1">
              {TEAM_MEMBERS.map((member) => {
                const targetUrl = teamModalType === 'github' ? member.github : member.linkedin;
                return (
                  <div
                    key={member.name}
                    className="p-4 rounded-2xl bg-white border-2 border-[#1E1E24] shadow-[3px_3px_0px_#1E1E24] flex flex-col justify-between gap-3 hover:-translate-y-0.5 transition-transform"
                  >
                    <div className="flex items-start gap-3">
                      <div
                        className={`w-10 h-10 rounded-xl ${member.avatarBg} text-white font-serif font-black text-sm flex items-center justify-center border-2 border-[#1E1E24] shadow-[1.5px_1.5px_0px_#1E1E24] shrink-0`}
                      >
                        {member.avatarText}
                      </div>
                      <div className="min-w-0 flex-1">
                        <div className="flex items-center gap-1.5 flex-wrap">
                          <h4 className="font-serif font-black text-sm text-[#1E1E24] truncate">
                            {member.name}
                          </h4>
                          <span className="text-[10px] font-black uppercase text-[#6C5CE7] bg-[#EDE9FE] px-1.5 py-0.2 rounded border border-[#6C5CE7]/30 shrink-0">
                            {member.tag}
                          </span>
                        </div>
                        <p className="text-[11px] text-[#64748B] font-bold line-clamp-1 mt-0.5">
                          {member.role}
                        </p>
                      </div>
                    </div>

                    {/* Member Action Link */}
                    <a
                      href={targetUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className={`w-full py-2 px-3 text-xs font-black rounded-xl border-2 border-[#1E1E24] flex items-center justify-between transition-all cursor-pointer ${
                        teamModalType === 'github'
                          ? 'bg-[#1E1E24] text-white hover:bg-gray-800 shadow-[2px_2px_0px_#1E1E24]'
                          : 'bg-[#0A66C2] text-white hover:bg-[#004182] shadow-[2px_2px_0px_#1E1E24]'
                      }`}
                    >
                      <span className="truncate">
                        {teamModalType === 'github'
                          ? `GitHub: ${member.handle}`
                          : `LinkedIn: ${member.name}`}
                      </span>
                      <ExternalLink className="w-3.5 h-3.5 shrink-0 ml-1.5" />
                    </a>
                  </div>
                );
              })}
            </div>

            {/* Bottom Tip Bar */}
            <div className="mt-5 pt-3 border-t border-[#1E1E24]/10 flex items-center justify-between text-[11px] font-bold text-[#64748B]">
              <span>💡 Links open the official profile in a secure tab</span>
              <button
                type="button"
                onClick={() => setTeamModalType(null)}
                className="text-[#6C5CE7] hover:underline font-black cursor-pointer"
              >
                Close Window
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
