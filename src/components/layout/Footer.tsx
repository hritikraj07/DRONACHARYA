'use client';

import React from 'react';
import Link from 'next/link';

export function Footer() {
  const currentYear = 2026;

  return (
    <footer className="w-full bg-[#FAF6EE] text-[#1E1E24] border-t-2 border-[#1E1E24] mt-auto select-none py-10 px-4 sm:px-8">
      <div className="max-w-7xl mx-auto space-y-10">
        {/* Top Header: Brand Logo & Made with Heart */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-[#E2E8F0]">
          {/* Logo & Brand Wordmark */}
          <Link href="/" className="flex items-center gap-2.5 group w-fit">
            <img
              src="/logo.png"
              alt="Dronacharya Logo"
              className="w-8 h-8 rounded-xl border-2 border-[#1E1E24] object-cover shadow-[2px_2px_0px_#1E1E24] group-hover:rotate-6 transition-transform shrink-0 bg-white"
            />
            <div className="flex items-center gap-1.5">
              <span className="font-serif font-black text-xl tracking-tight text-[#1E1E24]">
                DRONACHARYA
              </span>
              <span className="text-amber-500 font-bold text-lg">⋆˙⟡</span>
            </div>
          </Link>

          {/* Made with pixel heart by NHK */}
          <div className="flex items-center gap-2 text-xs sm:text-sm font-semibold text-[#64748B]">
            <span>Made with</span>
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
            <span>by NHK</span>
          </div>
        </div>

        {/* Multi-Column Links Grid (Codédex Layout: COMPANY, PRACTICE, LEARN Col 1, LEARN Col 2) */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 sm:gap-10">
          {/* Col 1: COMPANY */}
          <div className="space-y-3.5">
            <h4 className="text-xs font-black uppercase tracking-wider text-[#020617]">
              Company
            </h4>
            <ul className="space-y-2.5 text-xs sm:text-sm font-medium text-[#64748B]">
              <li>
                <Link href="/about" className="hover:text-[#020617] hover:underline transition-colors">
                  About
                </Link>
              </li>
              <li>
                <Link href="/blog" className="hover:text-[#020617] hover:underline transition-colors">
                  Blog
                </Link>
              </li>
              <li>
                <Link href="/community" className="hover:text-[#020617] hover:underline transition-colors">
                  Community
                </Link>
              </li>
              <li>
                <Link href="/help" className="hover:text-[#020617] hover:underline transition-colors">
                  Help Center
                </Link>
              </li>
              <li>
                <Link href="/pricing" className="hover:text-[#020617] hover:underline transition-colors">
                  Pricing
                </Link>
              </li>
              <li>
                <Link href="/schools" className="hover:text-[#020617] hover:underline transition-colors">
                  For Schools
                </Link>
              </li>
            </ul>
          </div>

          {/* Col 2: PRACTICE */}
          <div className="space-y-3.5">
            <h4 className="text-xs font-black uppercase tracking-wider text-[#020617]">
              Practice
            </h4>
            <ul className="space-y-2.5 text-xs sm:text-sm font-medium text-[#64748B]">
              <li>
                <Link href="/simulator?mission=mission-rescue-robot" className="hover:text-[#020617] hover:underline transition-colors">
                  Rover 2D Simulator
                </Link>
              </li>
              <li>
                <Link href="/simulator?mission=mission-hazard-filter" className="hover:text-[#020617] hover:underline transition-colors">
                  Bio-Cell Hazard Filter
                </Link>
              </li>
              <li>
                <Link href="/simulator" className="hover:text-[#020617] hover:underline transition-colors">
                  Code Challenges & Arena
                </Link>
              </li>
              <li>
                <Link href="/projects" className="hover:text-[#020617] hover:underline transition-colors">
                  Capstone Projects
                </Link>
              </li>
              <li>
                <Link href="/leaderboard" className="hover:text-[#020617] hover:underline transition-colors">
                  Leaderboard
                </Link>
              </li>
            </ul>
          </div>

          {/* Col 3: LEARN (Active 4 Tracks & Foundations) */}
          <div className="space-y-3.5">
            <h4 className="text-xs font-black uppercase tracking-wider text-[#020617]">
              Learn
            </h4>
            <ul className="space-y-2.5 text-xs sm:text-sm font-medium text-[#64748B]">
              <li>
                <Link href="/courses" className="text-[#6C5CE7] font-bold hover:underline">
                  All Courses →
                </Link>
              </li>
              <li>
                <Link href="/learn/html-less-1-1" className="hover:text-[#020617] hover:underline transition-colors flex items-center justify-between">
                  <span>HTML</span>
                  <span className="text-[10px] font-mono text-[#00B894] font-bold">Active</span>
                </Link>
              </li>
              <li>
                <Link href="/learn/css-less-1-1" className="hover:text-[#020617] hover:underline transition-colors flex items-center justify-between">
                  <span>CSS</span>
                  <span className="text-[10px] font-mono text-[#00B894] font-bold">Active</span>
                </Link>
              </li>
              <li>
                <Link href="/learn/js-less-1-1" className="hover:text-[#020617] hover:underline transition-colors flex items-center justify-between">
                  <span>JavaScript</span>
                  <span className="text-[10px] font-mono text-[#00B894] font-bold">Active</span>
                </Link>
              </li>
              <li>
                <Link href="/learn/py-less-1-1" className="hover:text-[#020617] hover:underline transition-colors flex items-center justify-between">
                  <span>Python</span>
                  <span className="text-[10px] font-mono text-[#00B894] font-bold">Active</span>
                </Link>
              </li>
              <li>
                <Link href="/courses/sql" className="hover:text-[#020617] hover:underline transition-colors">
                  SQL
                </Link>
              </li>
              <li>
                <Link href="/courses/ml" className="hover:text-[#020617] hover:underline transition-colors">
                  Machine Learning
                </Link>
              </li>
            </ul>
          </div>

          {/* Col 4: LEARN (Coming Soon & Specialized Tracks) */}
          <div className="space-y-3.5">
            <h4 className="text-xs font-black uppercase tracking-wider text-[#020617] md:invisible">
              Advanced
            </h4>
            <ul className="space-y-2.5 text-xs sm:text-sm font-medium text-[#64748B]">
              <li>
                <Link href="/courses/react" className="hover:text-[#020617] hover:underline transition-colors">
                  React
                </Link>
              </li>
              <li>
                <Link href="/courses/nodejs" className="hover:text-[#020617] hover:underline transition-colors">
                  Node.js
                </Link>
              </li>
              <li>
                <Link href="/courses/git" className="hover:text-[#020617] hover:underline transition-colors">
                  Git & GitHub
                </Link>
              </li>
              <li>
                <Link href="/courses/cpp" className="hover:text-[#020617] hover:underline transition-colors">
                  C++
                </Link>
              </li>
              <li>
                <Link href="/courses" className="hover:text-[#020617] hover:underline transition-colors">
                  Data Structures & Algorithms
                </Link>
              </li>
              <li>
                <Link href="/courses" className="hover:text-[#020617] hover:underline transition-colors">
                  UI/UX Design
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
            <Link href="/terms" className="hover:text-[#020617] hover:underline">
              Terms
            </Link>
            <span>•</span>
            <Link href="/privacy" className="hover:text-[#020617] hover:underline">
              Privacy Policy
            </Link>
          </div>

          {/* Social Icons with retro hover */}
          <div className="flex items-center gap-3">
            {/* GitHub */}
            <a
              href="https://github.com"
              target="_blank"
              rel="noreferrer"
              className="w-8 h-8 rounded-lg bg-white border border-[#CBD5E1] flex items-center justify-center text-[#475569] hover:text-[#020617] hover:border-[#1E1E24] shadow-[1px_1px_0px_#1E1E24] hover:-translate-y-0.5 transition-all"
              aria-label="GitHub"
            >
              <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0024 12c0-6.63-5.37-12-12-12z" />
              </svg>
            </a>
            {/* Twitter / X */}
            <a
              href="https://twitter.com"
              target="_blank"
              rel="noreferrer"
              className="w-8 h-8 rounded-lg bg-white border border-[#CBD5E1] flex items-center justify-center text-[#475569] hover:text-[#020617] hover:border-[#1E1E24] shadow-[1px_1px_0px_#1E1E24] hover:-translate-y-0.5 transition-all"
              aria-label="Twitter / X"
            >
              <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
              </svg>
            </a>
            {/* Discord */}
            <a
              href="https://discord.com"
              target="_blank"
              rel="noreferrer"
              className="w-8 h-8 rounded-lg bg-white border border-[#CBD5E1] flex items-center justify-center text-[#475569] hover:text-[#020617] hover:border-[#1E1E24] shadow-[1px_1px_0px_#1E1E24] hover:-translate-y-0.5 transition-all"
              aria-label="Discord"
            >
              <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                <path d="M20.317 4.37a19.791 19.791 0 00-4.885-1.515.074.074 0 00-.079.037c-.21.375-.444.864-.608 1.25a18.27 18.27 0 00-5.487 0 12.64 12.64 0 00-.617-1.25.077.077 0 00-.079-.037A19.736 19.736 0 003.677 4.37a.07.07 0 00-.032.027C.533 9.046-.32 13.58.099 18.057a.082.082 0 00.031.057 19.9 19.9 0 005.993 3.03.078.078 0 00.084-.028c.462-.63.874-1.295 1.226-1.994.021-.041.001-.09-.041-.106a13.107 13.107 0 01-1.872-.892.077.077 0 01-.008-.128 10.2 10.2 0 00.372-.292.074.074 0 01.077-.01c3.929 1.793 8.18 1.793 12.061 0a.074.074 0 01.078.01c.12.098.246.198.373.292a.077.077 0 01-.006.127 12.299 12.299 0 01-1.873.894.077.077 0 00-.041.107c.36.698.772 1.362 1.225 1.993a.076.076 0 00.084.028 19.839 19.839 0 006.002-3.03.077.077 0 00.032-.054c.5-5.177-.838-9.674-3.549-13.66a.061.061 0 00-.031-.028zM8.02 15.33c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.956-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.956 2.418-2.157 2.418zm7.975 0c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.955-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.946 2.418-2.157 2.418z" />
              </svg>
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
