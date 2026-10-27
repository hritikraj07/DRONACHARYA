// Dronacharya — The Digital Gurukul
// About Us: Philosophy, Architecture, Features & Team NHK
'use client';

import React from 'react';
import Link from 'next/link';
import {
  Sparkles,
  BookOpen,
  Code2,
  Terminal,
  Cpu,
  Compass,
  ArrowRight,
  ShieldCheck,
  Award,
  Zap,
  Globe,
  Heart,
  Gamepad2,
  Layers,
  FileText,
  Mail,
  ExternalLink,
} from 'lucide-react';

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-[#F5F2EB] text-[#1E1E24] py-12 px-4 sm:px-6 lg:px-8 select-none">
      <div className="max-w-5xl mx-auto space-y-12">
        {/* ============================================================== */}
        {/* HERO SECTION */}
        {/* ============================================================== */}
        <div className="text-center space-y-4 pt-4">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#E0F2FE] border-2 border-[#1E1E24] shadow-[3px_3px_0px_#1E1E24] text-xs font-pixel text-[#0284C7]">
            <Sparkles className="w-3.5 h-3.5" />
            <span>THE DIGITAL GURUKUL · ABOUT US</span>
          </div>

          <h1 className="text-3xl sm:text-5xl font-black tracking-tight text-[#1E1E24] leading-tight">
            Ancient Mentorship.{' '}
            <span className="text-[#6C5CE7] underline decoration-[#FFD214] decoration-4">
              Modern Code.
            </span>
          </h1>

          <p className="max-w-3xl mx-auto text-sm sm:text-base font-bold text-[#4A4A58] leading-relaxed">
            Welcome to <strong className="text-[#1E1E24]">DRONACHARYA ⋆˙⟡</strong>. We are reinventing computer science education by combining ancient Gurukul mentorship philosophy with game simulations, zero-setup browser laboratories, and Socratic artificial intelligence.
          </p>

          {/* Quick Stats Pill Row */}
          <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
            <span className="px-3 py-1 rounded-xl bg-white border-2 border-[#1E1E24] shadow-[2px_2px_0px_#1E1E24] text-xs font-mono font-bold text-emerald-800">
              ⚡ 4 Active Tracks (HTML, CSS, JS, Python)
            </span>
            <span className="px-3 py-1 rounded-xl bg-white border-2 border-[#1E1E24] shadow-[2px_2px_0px_#1E1E24] text-xs font-mono font-bold text-purple-800">
              🤖 Socratic Acharya AI Mentor
            </span>
            <span className="px-3 py-1 rounded-xl bg-white border-2 border-[#1E1E24] shadow-[2px_2px_0px_#1E1E24] text-xs font-mono font-bold text-amber-800">
              🏰 Code Dungeon &amp; Craft Realm
            </span>
            <span className="px-3 py-1 rounded-xl bg-white border-2 border-[#1E1E24] shadow-[2px_2px_0px_#1E1E24] text-xs font-mono font-bold text-blue-800">
              🌐 Dual Dialect (English + Hinglish)
            </span>
          </div>
        </div>

        {/* ============================================================== */}
        {/* THE GURUKUL PHILOSOPHY & STORY */}
        {/* ============================================================== */}
        <div className="bg-white rounded-3xl border-2 border-[#1E1E24] p-6 sm:p-10 shadow-[8px_8px_0px_#1E1E24] space-y-6">
          <div className="flex items-center gap-3 border-b-2 border-[#1E1E24]/10 pb-4">
            <div className="w-10 h-10 rounded-2xl bg-[#FFD214] border-2 border-[#1E1E24] flex items-center justify-center shadow-[2px_2px_0px_#1E1E24]">
              <Compass className="w-5 h-5 text-[#1E1E24]" />
            </div>
            <div>
              <h2 className="text-xl sm:text-2xl font-black text-[#1E1E24]">
                The Story &amp; Philosophy
              </h2>
              <p className="text-xs font-bold text-gray-500">
                Why we built Dronacharya for the next generation of engineers
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-xs sm:text-sm font-bold text-[#4A4A58] leading-relaxed">
            <div className="space-y-4">
              <p>
                In Indian antiquity, <strong className="text-[#1E1E24]">Guru Dronacharya</strong> was the supreme preceptor of archery, strategy, and statecraft. He was famed for recognizing individual brilliance and cultivating intense, singular focus — like Arjuna who saw nothing but the eye of the bird.
              </p>
              <p>
                Modern coding education suffers from the exact opposite: <em className="text-[#1E1E24]">&quot;Tutorial Hell&quot;</em>. Beginners watch hours of video lectures, passively copying code without developing genuine problem-solving instinct or spatial mental models.
              </p>
            </div>
            <div className="space-y-4">
              <p>
                <strong className="text-[#1E1E24]">Dronacharya flips this completely.</strong> There are no dry 40-minute lectures. Instead, every lesson is an adventure quest where learners write code inside an immediate feedback loop:
              </p>
              <ul className="space-y-2 list-disc list-inside text-gray-700">
                <li><strong className="text-[#1E1E24]">Direct Action:</strong> Write code on line 1, see live browser rendering or Pyodide stdout instantly.</li>
                <li><strong className="text-[#1E1E24]">Dual Dialects:</strong> Toggle between English and conversational Hinglish so language never hinders insight.</li>
                <li><strong className="text-[#1E1E24]">Socratic Mentorship:</strong> Acharya AI never spoon-feeds code; it prompts questions that guide you to the solution.</li>
              </ul>
            </div>
          </div>
        </div>

        {/* ============================================================== */}
        {/* FOUR PILLARS OF DRONACHARYA */}
        {/* ============================================================== */}
        <div className="space-y-6">
          <div className="text-center space-y-1">
            <h2 className="text-2xl sm:text-3xl font-black text-[#1E1E24]">
              Core Pillars of the Platform
            </h2>
            <p className="text-xs sm:text-sm font-bold text-gray-600">
              Engineering breakthroughs powering the Digital Gurukul
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            {/* Pillar 1 */}
            <div className="bg-white rounded-2xl border-2 border-[#1E1E24] p-6 shadow-[6px_6px_0px_#1E1E24] space-y-3">
              <div className="w-10 h-10 rounded-xl bg-[#E0F2FE] border-2 border-[#1E1E24] flex items-center justify-center shadow-[2px_2px_0px_#1E1E24]">
                <Globe className="w-5 h-5 text-[#0284C7]" />
              </div>
              <h3 className="font-pixel text-xs sm:text-sm font-bold text-[#1E1E24]">
                1. Zero-Setup Browser Laboratories
              </h3>
              <p className="text-xs font-bold text-gray-600 leading-relaxed">
                Master HTML, CSS, JavaScript, and Python with zero local installations. Includes a realistic browser window sandbox with live reload, responsive mobile viewport simulation, and real-time DOM assertions.
              </p>
            </div>

            {/* Pillar 2 */}
            <div className="bg-white rounded-2xl border-2 border-[#1E1E24] p-6 shadow-[6px_6px_0px_#1E1E24] space-y-3">
              <div className="w-10 h-10 rounded-xl bg-[#FEF3C7] border-2 border-[#1E1E24] flex items-center justify-center shadow-[2px_2px_0px_#1E1E24]">
                <Gamepad2 className="w-5 h-5 text-amber-700" />
              </div>
              <h3 className="font-pixel text-xs sm:text-sm font-bold text-[#1E1E24]">
                2. Code Dungeon &amp; Craft Realm
              </h3>
              <p className="text-xs font-bold text-gray-600 leading-relaxed">
                Descend into a 4-floor retro dungeon crawler where you defeat code monsters by typing programmatic incantations, mine minerals (Silicon, Copper, Logic Crystals), and craft tools using a Minecraft-style hotbar.
              </p>
            </div>

            {/* Pillar 3 */}
            <div className="bg-white rounded-2xl border-2 border-[#1E1E24] p-6 shadow-[6px_6px_0px_#1E1E24] space-y-3">
              <div className="w-10 h-10 rounded-xl bg-[#F3E8FF] border-2 border-[#1E1E24] flex items-center justify-center shadow-[2px_2px_0px_#1E1E24]">
                <Cpu className="w-5 h-5 text-[#6C5CE7]" />
              </div>
              <h3 className="font-pixel text-xs sm:text-sm font-bold text-[#1E1E24]">
                3. Socratic Acharya AI Mentor
              </h3>
              <p className="text-xs font-bold text-gray-600 leading-relaxed">
                Context-aware AI mentor that inspects the learner&apos;s active code buffer, test assertion failures, and syntax traces. It delivers progressive 4-tier hints (Nudge → Clue → Blueprint → Solution) without spoiling the joy of discovery.
              </p>
            </div>

            {/* Pillar 4 */}
            <div className="bg-white rounded-2xl border-2 border-[#1E1E24] p-6 shadow-[6px_6px_0px_#1E1E24] space-y-3">
              <div className="w-10 h-10 rounded-xl bg-[#DCFCE7] border-2 border-[#1E1E24] flex items-center justify-center shadow-[2px_2px_0px_#1E1E24]">
                <Award className="w-5 h-5 text-emerald-700" />
              </div>
              <h3 className="font-pixel text-xs sm:text-sm font-bold text-[#1E1E24]">
                4. Rover 2D Spatial Simulator
              </h3>
              <p className="text-xs font-bold text-gray-600 leading-relaxed">
                Control autonomous rover Arya in interactive 2D grid worlds. Practice loops, conditionals, and math formulas with real obstacle collision physics, hazard filters, and beacon transmissions.
              </p>
            </div>
          </div>
        </div>


        {/* ============================================================== */}
        {/* TEAM & MAINTAINER INFO */}
        {/* ============================================================== */}
        <div className="bg-white rounded-3xl border-2 border-[#1E1E24] p-6 sm:p-8 shadow-[8px_8px_0px_#1E1E24] space-y-6">
          <div className="flex items-center justify-between flex-wrap gap-4 border-b-2 border-[#1E1E24]/10 pb-4">
            <div>
              <h2 className="text-xl sm:text-2xl font-black text-[#1E1E24]">
                Team NHK &amp; Maintainers
              </h2>
              <p className="text-xs font-bold text-gray-500">
                Crafted with passion for the Hackathon &amp; Ideathon 2026
              </p>
            </div>
            <div className="flex items-center gap-2 text-xs font-pixel text-rose-600 bg-rose-50 px-3 py-1 rounded-lg border border-rose-200">
              <Heart className="w-3.5 h-3.5 fill-current" />
              <span>Made with Love by NHK</span>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-2">
            {/* GitHub Card */}
            <a
              href="https://github.com/hritikraj07"
              target="_blank"
              rel="noreferrer"
              className="p-5 rounded-2xl border-2 border-[#1E1E24] bg-[#FAF6EE] hover:bg-[#F0ECE1] shadow-[4px_4px_0px_#1E1E24] transition-all hover:-translate-y-1 flex flex-col justify-between group"
            >
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-mono font-bold text-gray-500">GITHUB PROFILE</span>
                  <ExternalLink className="w-4 h-4 text-gray-400 group-hover:text-[#1E1E24]" />
                </div>
                <h4 className="font-black text-sm text-[#1E1E24]">@hritikraj07</h4>
                <p className="text-xs font-bold text-gray-600">
                  Lead Engineer &amp; Architect of the Dronacharya Digital Gurukul codebase.
                </p>
              </div>
              <span className="text-xs font-mono font-bold text-[#6C5CE7] mt-3 inline-block">
                github.com/hritikraj07 →
              </span>
            </a>

            {/* LinkedIn Card */}
            <a
              href="https://www.linkedin.com/in/msp007/"
              target="_blank"
              rel="noreferrer"
              className="p-5 rounded-2xl border-2 border-[#1E1E24] bg-[#FAF6EE] hover:bg-[#F0ECE1] shadow-[4px_4px_0px_#1E1E24] transition-all hover:-translate-y-1 flex flex-col justify-between group"
            >
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-mono font-bold text-gray-500">LINKEDIN CONNECT</span>
                  <ExternalLink className="w-4 h-4 text-gray-400 group-hover:text-[#0A66C2]" />
                </div>
                <h4 className="font-black text-sm text-[#1E1E24]">Mukesh Singh (msp007)</h4>
                <p className="text-xs font-bold text-gray-600">
                  Product Strategy, Curriculum Design, and Educational Pedagogical research.
                </p>
              </div>
              <span className="text-xs font-mono font-bold text-[#0A66C2] mt-3 inline-block">
                linkedin.com/in/msp007 →
              </span>
            </a>

            {/* Email Contact Card */}
            <a
              href="mailto:nhkmukxsh@gmail.com"
              className="p-5 rounded-2xl border-2 border-[#1E1E24] bg-[#FAF6EE] hover:bg-[#F0ECE1] shadow-[4px_4px_0px_#1E1E24] transition-all hover:-translate-y-1 flex flex-col justify-between group"
            >
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-mono font-bold text-gray-500">OFFICIAL INQUIRY</span>
                  <Mail className="w-4 h-4 text-gray-400 group-hover:text-[#EA4335]" />
                </div>
                <h4 className="font-black text-sm text-[#1E1E24]">nhkmukxsh@gmail.com</h4>
                <p className="text-xs font-bold text-gray-600">
                  Reach out for mentorship, hackathon evaluations, collaborations, and school deployments.
                </p>
              </div>
              <span className="text-xs font-mono font-bold text-[#EA4335] mt-3 inline-block">
                Send Direct Message →
              </span>
            </a>
          </div>
        </div>

        {/* ============================================================== */}
        {/* BOTTOM EXPLORATION CTAS */}
        {/* ============================================================== */}
        <div className="text-center pt-4 pb-8 space-y-4">
          <h3 className="font-pixel text-xs sm:text-sm font-bold text-[#1E1E24]">
            Ready to Begin Your Computational Odyssey?
          </h3>
          <div className="flex flex-wrap items-center justify-center gap-3">
            <Link
              href="/courses"
              className="btn-arcade btn-arcade-gold py-3 px-6 text-xs font-black cursor-pointer shadow-[3px_3px_0px_#1E1E24]"
            >
              <span>Explore All Courses →</span>
            </Link>
            <Link
              href="/simulator"
              className="btn-arcade btn-arcade-white py-3 px-6 text-xs font-black cursor-pointer shadow-[3px_3px_0px_#1E1E24]"
            >
              <span>Launch 2D Simulator</span>
            </Link>
            <Link
              href="/dungeon"
              className="btn-arcade btn-arcade-purple py-3 px-6 text-xs font-black cursor-pointer shadow-[3px_3px_0px_#1E1E24]"
            >
              <span>Enter Code Dungeon</span>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
