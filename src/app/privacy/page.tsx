import React from 'react';
import Link from 'next/link';
import { Metadata } from 'next';
import { ShieldCheck, Lock, HardDrive, Cpu, ArrowLeft, Mail, Eye, CheckCircle2, FileText } from 'lucide-react';

export const metadata: Metadata = {
  title: 'Privacy Policy | Dronacharya ⋆˙⟡',
  description: 'Privacy Policy for Dronacharya. Learn how we safeguard student data, in-browser code, and game progress.',
};

export default function PrivacyPolicyPage() {
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
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#D1FAE5] border-2 border-[#1E1E24] shadow-[2px_2px_0px_#1E1E24]">
            <ShieldCheck className="w-3.5 h-3.5 text-[#00B894]" />
            <span className="text-[10px] font-pixel uppercase tracking-wider text-[#00B894]">
              Data Protection & Privacy Shield
            </span>
          </div>
          <h1 className="text-3xl sm:text-5xl font-black tracking-tight font-serif text-[#1E1E24]">
            Privacy Policy
          </h1>
          <p className="text-xs sm:text-sm font-bold text-[#64748B]">
            Effective Date: {lastUpdated} • Version 2.4
          </p>
          <p className="text-sm sm:text-base text-[#4A4A58] font-bold leading-relaxed max-w-2xl">
            At <strong className="text-[#1E1E24]">Dronacharya ⋆˙⟡</strong>, we believe student privacy is fundamental. We architect our learning environment with local-first storage, in-browser sandboxes, and minimal data collection.
          </p>
        </div>

        {/* Core Principles Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="bg-white border-2 border-[#1E1E24] rounded-xl p-5 shadow-[3px_3px_0px_#1E1E24] space-y-2">
            <HardDrive className="w-5 h-5 text-[#6C5CE7]" />
            <h3 className="font-bold text-sm text-[#1E1E24]">Local-First Sandbox</h3>
            <p className="text-xs text-[#64748B] font-medium leading-relaxed">
              Guest exploration and code scripts run natively inside your browser without logging to external servers.
            </p>
          </div>
          <div className="bg-white border-2 border-[#1E1E24] rounded-xl p-5 shadow-[3px_3px_0px_#1E1E24] space-y-2">
            <Lock className="w-5 h-5 text-[#00B894]" />
            <h3 className="font-bold text-sm text-[#1E1E24]">Zero Ad-Tracking</h3>
            <p className="text-xs text-[#64748B] font-medium leading-relaxed">
              We do not sell personal data, display third-party behavioral ads, or track you across the web.
            </p>
          </div>
          <div className="bg-white border-2 border-[#1E1E24] rounded-xl p-5 shadow-[3px_3px_0px_#1E1E24] space-y-2">
            <Cpu className="w-5 h-5 text-[#F59E0B]" />
            <h3 className="font-bold text-sm text-[#1E1E24]">Private AI Mentoring</h3>
            <p className="text-xs text-[#64748B] font-medium leading-relaxed">
              Questions submitted to Acharya AI are processed strictly to generate hints and are never used to train public models.
            </p>
          </div>
        </div>

        {/* Detailed Sections */}
        <div className="space-y-8 text-sm leading-relaxed text-[#4A4A58]">
          {/* Section 1: Information We Collect */}
          <section className="bg-white border-2 border-[#1E1E24] rounded-2xl p-6 sm:p-8 shadow-[4px_4px_0px_#1E1E24] space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-[#FFD214] border-2 border-[#1E1E24] flex items-center justify-center font-pixel text-xs text-[#1E1E24]">
                01
              </div>
              <h2 className="text-lg sm:text-xl font-black text-[#1E1E24]">
                1. Information We Collect
              </h2>
            </div>
            <p className="font-medium">
              We collect only the minimum information required to deliver an engaging educational experience:
            </p>
            <ul className="list-disc pl-5 space-y-2 font-medium">
              <li>
                <strong>Guest Explorers:</strong> Zero personal information required. Your active course, class standard, and lesson progress are stored solely in your local browser storage (<code className="bg-[#FAF6EE] px-1 py-0.5 rounded text-[#1E1E24] font-mono text-xs">localStorage</code>).
              </li>
              <li>
                <strong>Registered Scholars:</strong> If you create an account to preserve progress, we store your email address, display handle, encrypted authentication token, and game statistics (XP points, streak days, completed lessons, unlocked mastery seals).
              </li>
              <li>
                <strong>In-Game Code Submissions:</strong> Code typed into exercises or simulator missions is evaluated in-browser for immediate feedback. When you complete a challenge, your pass/fail status is recorded to advance your curriculum progression.
              </li>
            </ul>
          </section>

          {/* Section 2: How We Use Your Information */}
          <section className="bg-white border-2 border-[#1E1E24] rounded-2xl p-6 sm:p-8 shadow-[4px_4px_0px_#1E1E24] space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-[#00B894] border-2 border-[#1E1E24] flex items-center justify-center font-pixel text-xs text-white">
                02
              </div>
              <h2 className="text-lg sm:text-xl font-black text-[#1E1E24]">
                2. How We Use Information
              </h2>
            </div>
            <p className="font-medium">
              Collected information is utilized exclusively for:
            </p>
            <ul className="list-disc pl-5 space-y-2 font-medium">
              <li>Syncing your personalized curriculum state (Class 9–12 NEP alignment) across sessions.</li>
              <li>Calculating streak multipliers, hearts recovery, and awarding mastery rank titles (Sadhaka to Acharya).</li>
              <li>Powering the real-time public leaderboard rankings for registered scholars.</li>
              <li>Responding to bug reports, feedback, and maintainer correspondence.</li>
            </ul>
          </section>

          {/* Section 3: Data Security & Storage */}
          <section className="bg-white border-2 border-[#1E1E24] rounded-2xl p-6 sm:p-8 shadow-[4px_4px_0px_#1E1E24] space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-[#6C5CE7] border-2 border-[#1E1E24] flex items-center justify-center font-pixel text-xs text-white">
                03
              </div>
              <h2 className="text-lg sm:text-xl font-black text-[#1E1E24]">
                3. Data Storage & Security
              </h2>
            </div>
            <p className="font-medium">
              Account records are stored in a managed PostgreSQL database powered by Supabase with Row Level Security (RLS) policies. All communication between your client device and our servers is secured using modern TLS 1.3 encryption in transit.
            </p>
            <div className="bg-[#FAF6EE] border border-[#CBD5E1] rounded-xl p-4 space-y-2">
              <div className="flex items-center gap-2 text-xs font-black uppercase text-[#1E1E24]">
                <CheckCircle2 className="w-4 h-4 text-[#00B894]" />
                <span>Cookies & Local Storage</span>
              </div>
              <p className="text-xs text-[#64748B] font-bold">
                We only use essential functional cookies (e.g., maintaining your active login session) and local browser storage. We do not place third-party advertising or telemetry trackers on your machine.
              </p>
            </div>
          </section>

          {/* Section 4: Scholar Rights & Deletion */}
          <section className="bg-white border-2 border-[#1E1E24] rounded-2xl p-6 sm:p-8 shadow-[4px_4px_0px_#1E1E24] space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-[#FF7675] border-2 border-[#1E1E24] flex items-center justify-center font-pixel text-xs text-white">
                04
              </div>
              <h2 className="text-lg sm:text-xl font-black text-[#1E1E24]">
                4. Your Rights: Export & Account Deletion
              </h2>
            </div>
            <p className="font-medium">
              You maintain total dominion over your data. At any time, you have the right to:
            </p>
            <ul className="list-disc pl-5 space-y-2 font-medium">
              <li>Reset your guest progress or clear locally cached data by clearing your browser storage.</li>
              <li>Update your target subject, enrolled grade, or display username directly in your Settings hub.</li>
              <li>Request complete permanent deletion of your account and progress data by contacting our maintainers.</li>
            </ul>
          </section>

          {/* Section 5: Contact Maintainers */}
          <section className="bg-white border-2 border-[#1E1E24] rounded-2xl p-6 sm:p-8 shadow-[4px_4px_0px_#1E1E24] space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-[#0F172A] border-2 border-[#1E1E24] flex items-center justify-center font-pixel text-xs text-white">
                05
              </div>
              <h2 className="text-lg sm:text-xl font-black text-[#1E1E24]">
                5. Privacy Queries & Maintainer Contact
              </h2>
            </div>
            <p className="font-medium">
              If you have any questions or data concerns regarding Dronacharya, please reach out to our team:
            </p>
            <div className="pt-4 border-t border-[#E2E8F0] flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div className="space-y-1">
                <span className="text-xs font-bold text-gray-500 block">Lead Developer & Maintainer</span>
                <span className="font-bold text-sm text-[#1E1E24]">Hritik Raj (Dronacharya Team)</span>
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
          <Link href="/terms" className="hover:text-[#1E1E24] hover:underline flex items-center gap-1.5">
            <FileText className="w-4 h-4 text-[#6C5CE7]" />
            <span>Read Terms of Service →</span>
          </Link>
          <span>DRONACHARYA ⋆˙⟡ (The Digital Gurukul)</span>
        </div>
      </div>
    </div>
  );
}
