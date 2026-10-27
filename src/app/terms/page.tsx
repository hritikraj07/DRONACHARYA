import React from 'react';
import Link from 'next/link';
import { Metadata } from 'next';
import { ShieldCheck, ScrollText, Sparkles, ArrowLeft, Code2, Cpu, UserCheck, AlertCircle, Mail } from 'lucide-react';

export const metadata: Metadata = {
  title: 'Terms of Service | Dronacharya ⋆˙⟡',
  description: 'Terms of Service and Community Guidelines for Dronacharya, the gamified AI-powered coding adventure.',
};

export default function TermsPage() {
  const lastUpdated = 'October 27, 2026';

  return (
    <div className="min-h-screen bg-[#FAF6EE] text-[#1E1E24] py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto space-y-10">
        {/* Back Link */}
        <div>
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-xs font-black uppercase tracking-wider text-[#64748B] hover:text-[#1E1E24] transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Back to Gurukul</span>
          </Link>
        </div>

        {/* Hero Header */}
        <div className="space-y-4 border-b-2 border-[#1E1E24] pb-8">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#EDE9FE] border-2 border-[#1E1E24] shadow-[2px_2px_0px_#1E1E24]">
            <ScrollText className="w-3.5 h-3.5 text-[#6C5CE7]" />
            <span className="text-[10px] font-pixel uppercase tracking-wider text-[#6C5CE7]">
              Legal Charter & Guild Rules
            </span>
          </div>
          <h1 className="text-3xl sm:text-5xl font-black tracking-tight font-serif text-[#1E1E24]">
            Terms of Service
          </h1>
          <p className="text-xs sm:text-sm font-bold text-[#64748B]">
            Effective Date: {lastUpdated} • Version 2.4
          </p>
          <p className="text-sm sm:text-base text-[#4A4A58] font-bold leading-relaxed max-w-2xl">
            Welcome to <strong className="text-[#1E1E24]">Dronacharya ⋆˙⟡ (The Digital Gurukul)</strong>. By entering the platform, running code simulations, embarking on curriculum quests, or consulting the Acharya AI mentor, you agree to abide by these Terms of Service.
          </p>
        </div>

        {/* Terms Sections */}
        <div className="space-y-8 text-sm leading-relaxed text-[#4A4A58]">
          {/* Section 1: Platform Purpose & Admission */}
          <section className="bg-white border-2 border-[#1E1E24] rounded-2xl p-6 sm:p-8 shadow-[4px_4px_0px_#1E1E24] space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-[#FFD214] border-2 border-[#1E1E24] flex items-center justify-center font-pixel text-xs text-[#1E1E24]">
                01
              </div>
              <h2 className="text-lg sm:text-xl font-black text-[#1E1E24]">
                1. Educational Mission & Account Admission
              </h2>
            </div>
            <p className="font-medium">
              Dronacharya is an interactive learning platform designed to make computer science, software development, and algorithmic thinking accessible through game mechanics, browser-based sandboxes, and personalized mentoring.
            </p>
            <ul className="list-disc pl-5 space-y-2 font-medium">
              <li>
                <strong>Guest Mode:</strong> You may explore lessons, sandbox arenas, and interactive simulations freely as a Guest Explorer without registration. Progress in Guest Mode is cached locally in your web browser.
              </li>
              <li>
                <strong>Registered Scholars:</strong> To synchronize your mastery rank, streak multipliers, and capstone badges across devices, you must register with a valid email. You are responsible for safeguarding your credentials.
              </li>
              <li>
                <strong>Student Age:</strong> Scholars under the age of 13 must use Dronacharya under adult supervision or with parental/guardian permission.
              </li>
            </ul>
          </section>

          {/* Section 2: Code Execution & Browser Sandbox */}
          <section className="bg-white border-2 border-[#1E1E24] rounded-2xl p-6 sm:p-8 shadow-[4px_4px_0px_#1E1E24] space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-[#00B894] border-2 border-[#1E1E24] flex items-center justify-center font-pixel text-xs text-white">
                02
              </div>
              <h2 className="text-lg sm:text-xl font-black text-[#1E1E24]">
                2. In-Browser Code Execution & Sandboxing
              </h2>
            </div>
            <p className="font-medium">
              Our code runners (including Pyodide WebAssembly Python environment, HTML/CSS live renderer, and JavaScript simulators) execute directly within your browser client sandbox.
            </p>
            <div className="bg-[#FAF6EE] border border-[#CBD5E1] rounded-xl p-4 space-y-2">
              <div className="flex items-center gap-2 text-xs font-black uppercase text-[#1E1E24]">
                <Code2 className="w-4 h-4 text-[#00B894]" />
                <span>Code Ownership & Safety Guidelines</span>
              </div>
              <p className="text-xs text-[#64748B] font-bold">
                • You retain 100% intellectual property ownership of the programs, creative scripts, and portfolio websites you author inside the Gurukul.<br />
                • You agree not to deliberately inject malicious payloads, denial-of-service loops, automated scraping bots, or unauthorized network reconnaissance commands through the sandbox.
              </p>
            </div>
          </section>

          {/* Section 3: Acharya AI Mentor Usage */}
          <section className="bg-white border-2 border-[#1E1E24] rounded-2xl p-6 sm:p-8 shadow-[4px_4px_0px_#1E1E24] space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-[#6C5CE7] border-2 border-[#1E1E24] flex items-center justify-center font-pixel text-xs text-white">
                03
              </div>
              <h2 className="text-lg sm:text-xl font-black text-[#1E1E24]">
                3. Acharya AI Mentor Guidelines
              </h2>
            </div>
            <p className="font-medium">
              Acharya AI operates as a Socratic educational mentor. It provides progressive hints, identifies runtime bugs, and explains concepts without simply copy-pasting complete test answers.
            </p>
            <ul className="list-disc pl-5 space-y-2 font-medium">
              <li>
                Acharya AI answers are pedagogical in nature and generated through artificial intelligence models; Dronacharya does not guarantee that every suggestion is bug-free or production-ready.
              </li>
              <li>
                Scholars agree not to abuse, spam, or prompt-engineer the AI mentor to generate harmful, offensive, or non-educational content.
              </li>
            </ul>
          </section>

          {/* Section 4: Academic Integrity & Community Conduct */}
          <section className="bg-white border-2 border-[#1E1E24] rounded-2xl p-6 sm:p-8 shadow-[4px_4px_0px_#1E1E24] space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-[#FF7675] border-2 border-[#1E1E24] flex items-center justify-center font-pixel text-xs text-white">
                04
              </div>
              <h2 className="text-lg sm:text-xl font-black text-[#1E1E24]">
                4. Academic Integrity & Leaderboard Fair Play
              </h2>
            </div>
            <p className="font-medium">
              The Digital Gurukul is founded on mutual honor and disciplined craftsmanship. To maintain fair competition on public leaderboards and squad rankings:
            </p>
            <ul className="list-disc pl-5 space-y-2 font-medium">
              <li>XP spoofing, automated solution submissions, or manipulating streak counters through modified client scripts is strictly prohibited.</li>
              <li>Accounts found intentionally tampering with leaderboard rankings may have XP recalculated or access revoked.</li>
            </ul>
          </section>

          {/* Section 5: Limitation of Liability & Contact */}
          <section className="bg-white border-2 border-[#1E1E24] rounded-2xl p-6 sm:p-8 shadow-[4px_4px_0px_#1E1E24] space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-[#0F172A] border-2 border-[#1E1E24] flex items-center justify-center font-pixel text-xs text-white">
                05
              </div>
              <h2 className="text-lg sm:text-xl font-black text-[#1E1E24]">
                5. Disclaimer of Warranties & Contact
              </h2>
            </div>
            <p className="font-medium">
              Dronacharya is provided on an &ldquo;as is&rdquo; and &ldquo;as available&rdquo; basis for educational and hackathon demonstration purposes. While we strive for 100% uptime and smooth simulator physics, we disclaim all warranties of uninterrupted service or fitness for commercial deployment.
            </p>
            <div className="pt-4 border-t border-[#E2E8F0] flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div className="space-y-1">
                <span className="text-xs font-bold text-gray-500 block">Questions regarding these terms?</span>
                <span className="font-bold text-sm text-[#1E1E24]">Contact our maintainers:</span>
              </div>
              <a
                href="mailto:nhkmukxsh@gmail.com"
                className="btn-arcade btn-arcade-gold text-xs py-2 px-4 flex items-center gap-2 self-start sm:self-auto"
              >
                <Mail className="w-4 h-4" />
                <span>nhkmukxsh@gmail.com</span>
              </a>
            </div>
          </section>
        </div>

        {/* Footer Navigation */}
        <div className="flex items-center justify-between pt-6 border-t-2 border-[#1E1E24] text-xs font-bold text-[#64748B]">
          <Link href="/privacy" className="hover:text-[#1E1E24] hover:underline flex items-center gap-1.5">
            <ShieldCheck className="w-4 h-4 text-[#00B894]" />
            <span>Read Privacy Policy →</span>
          </Link>
          <span>DRONACHARYA ⋆˙⟡ (The Digital Gurukul)</span>
        </div>
      </div>
    </div>
  );
}
