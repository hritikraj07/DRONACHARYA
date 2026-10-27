// Dronacharya Landing Page — The Digital Gurukul
'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import {
  Compass,
  ArrowRight,
  Code2,
  Sparkles,
  Award,
  Users,
  Terminal,
  CheckCircle2,
  Target,
  Cpu,
  Layers,
  ShieldCheck,
  Play,
} from 'lucide-react';

export default function LandingPage() {
  const [activeStep, setActiveStep] = useState(0);

  const learningSteps = [
    { title: '1. Discover', desc: 'Encounter real production bottlenecks—such as an e-commerce checkout server crashing during high traffic.' },
    { title: '2. Understand', desc: 'Grasp the underlying computer science principles through concise visual models and call-stack diagrams.' },
    { title: '3. Practise', desc: 'Calibrate your comprehension with low-stakes diagnostic micro-drills before writing extensive code.' },
    { title: '4. Play', desc: 'Engage with narrative-driven missions where learning objectives turn into purposeful challenges.' },
    { title: '5. Experiment', desc: 'Run and modify code inside an isolated WebAssembly sandbox with immediate test execution.' },
    { title: '6. Build', desc: 'Develop multi-file capstone projects evaluated against rigorous industry-grade rubrics.' },
    { title: '7. Demonstrate', desc: 'Publish an auditable portfolio featuring passed unit test traces and cryptographic evidence.' },
    { title: '8. Master', desc: 'Earn verifiable Antique Brass Skill Seals representing proven, reproducible competence.' },
  ];

  return (
    <div className="flex flex-col min-h-screen">
      {/* Hero Section with Jaali Pattern Accent */}
      <section className="relative overflow-hidden jaali-pattern border-b border-[#D8CFC0] py-16 md:py-24 px-4 sm:px-6 lg:px-8">
        <div className="max-w-5xl mx-auto text-center relative z-10">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#E9DFC9] border border-[#B49A65] text-xs font-semibold text-[#7A6230] mb-6">
            <Sparkles className="w-3.5 h-3.5 text-[#B49A65]" />
            <span>Reimagining the Indian Gurukul for Modern Engineers</span>
          </div>

          <h1 className="font-serif font-bold text-4xl sm:text-5xl md:text-6xl text-[#252820] tracking-tight leading-tight">
            Where Theory Becomes <span className="text-[#354B3A] italic">Instinct</span>.
          </h1>

          <p className="mt-6 text-base sm:text-lg text-[#575A51] max-w-3xl mx-auto leading-relaxed">
            Stop passively streaming video lectures and copying code. <strong>Dronacharya</strong> combines AI-powered Socratic mentorship, live in-browser WebAssembly simulations, and verifiable project portfolios to forge true technical mastery.
          </p>

          <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link
              href="/onboarding"
              className="btn-primary w-full sm:w-auto text-sm px-6 py-3 shadow-md"
            >
              <span>Begin Diagnostic Trial</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
            <Link
              href="/dashboard"
              className="btn-secondary w-full sm:w-auto text-sm px-6 py-3"
            >
              <span>Enter the Gurukul</span>
            </Link>
          </div>

          <div className="mt-12 flex items-center justify-center gap-8 text-xs text-[#7E8276]">
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-[#354B3A]" />
              <span>Zero Cloud Server Execution Cost</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-[#354B3A]" />
              <span>Socratic Non-Spoiler Guidance</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-[#354B3A]" />
              <span>Bilingual English & Hinglish</span>
            </div>
          </div>
        </div>
      </section>

      {/* The 8-Stage Learning Wheel */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto w-full">
        <div className="text-center max-w-2xl mx-auto mb-12">
          <h2 className="font-serif font-bold text-3xl text-[#252820]">
            The 8-Stage Pedagogical Loop
          </h2>
          <p className="text-sm text-[#575A51] mt-2">
            Every concept follows an unbroken continuum from theoretical discovery to cryptographic proof of skill.
          </p>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {learningSteps.map((step, idx) => (
            <div
              key={idx}
              onClick={() => setActiveStep(idx)}
              className={`p-4 rounded-lg border transition-all cursor-pointer ${
                activeStep === idx
                  ? 'bg-[#E9DFC9] border-[#354B3A] shadow-xs'
                  : 'bg-white border-[#D8CFC0] hover:bg-[#F6F1E7]'
              }`}
            >
              <div className="font-serif font-bold text-sm text-[#354B3A]">
                {step.title}
              </div>
              <p className="text-xs text-[#575A51] mt-1.5 leading-relaxed">
                {step.desc}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* Interactive Simulator Teaser Section */}
      <section className="py-16 bg-[#E9DFC9]/40 border-y border-[#D8CFC0] px-4 sm:px-6 lg:px-8">
        <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          <div className="lg:col-span-5">
            <div className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#A65F43] uppercase tracking-wider mb-2">
              <Terminal className="w-4 h-4" />
              <span>Theory-to-Practice Simulator</span>
            </div>
            <h2 className="font-serif font-bold text-3xl text-[#252820] leading-snug">
              Instant WebAssembly Execution in Your Browser.
            </h2>
            <p className="text-sm text-[#575A51] mt-3 leading-relaxed">
              No cloud queue times or server execution costs. Write real Python code running on Pyodide (CPython 3.11 Wasm). When a test fails or a recursion error occurs, Acharya AI analyzes your call stack and nudges your reasoning in conversational Hinglish without spoiling the answer.
            </p>

            <div className="mt-6">
              <Link
                href="/simulator"
                className="btn-primary text-xs py-2.5 px-4"
              >
                <span>Launch Interactive Simulator</span>
                <Play className="w-3.5 h-3.5" />
              </Link>
            </div>
          </div>

          <div className="lg:col-span-7 bg-[#252820] rounded-xl p-5 text-[#F6F1E7] shadow-xl border border-[#D8CFC0]">
            <div className="flex items-center justify-between border-b border-[#3A3E34] pb-3 mb-3 text-xs text-[#A6AC9B]">
              <div className="flex items-center gap-2">
                <span className="w-3 h-3 rounded-full bg-[#A65F43]/80 inline-block"></span>
                <span className="w-3 h-3 rounded-full bg-[#B49A65]/80 inline-block"></span>
                <span className="w-3 h-3 rounded-full bg-[#354B3A] inline-block"></span>
                <span className="font-mono text-[11px] ml-2 text-[#E9DFC9]">route_cost.py</span>
              </div>
              <span className="text-[10px] bg-[#354B3A] text-white px-2 py-0.5 rounded">Python 3.11 Wasm</span>
            </div>

            <pre className="font-mono text-xs text-[#E9DFC9] leading-relaxed overflow-x-auto">
{`# Mission 1: The Labyrinth of Fibonacci
def route_cost(n: int) -> int:
    # Acharya Nudge: Establish your base termination condition!
    if n <= 1:
        return n
    return route_cost(n - 1) + route_cost(n - 2)

# Automated Pyodide Unit Verification:
assert route_cost(0) == 0    # Passed (0.01ms)
assert route_cost(1) == 1    # Passed (0.01ms)
assert route_cost(10) == 55  # Passed (0.04ms)`}
            </pre>

            <div className="mt-4 pt-3 border-t border-[#3A3E34] flex items-center justify-between text-xs">
              <span className="text-[#354B3A] font-semibold flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-[#354B3A]" />
                All 5 Tests Passed (0.06ms)
              </span>
              <span className="text-[#B49A65] font-mono">+120 XP Awarded</span>
            </div>
          </div>
        </div>
      </section>

      {/* Six Core Pillars Showcase */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <div className="text-center max-w-2xl mx-auto mb-14">
          <div className="text-xs font-semibold text-[#A65F43] uppercase tracking-wider mb-2">
            The Gurukul Architecture
          </div>
          <h2 className="font-serif font-bold text-3xl text-[#252820]">
            Six Pillars of Mastery
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <div className="card-parchment">
            <div className="w-10 h-10 rounded bg-[#354B3A] text-white flex items-center justify-center mb-4">
              <Target className="w-5 h-5" />
            </div>
            <h3 className="font-serif font-bold text-lg text-[#252820]">
              1. AI Personalised Learning
            </h3>
            <p className="text-xs text-[#575A51] mt-2 leading-relaxed">
              Bayesian Knowledge Tracing continuously estimates your latent mastery vector, dynamically serving remedial practice quests when a prerequisite gap is detected.
            </p>
          </div>

          <div className="card-parchment">
            <div className="w-10 h-10 rounded bg-[#B49A65] text-white flex items-center justify-center mb-4">
              <Award className="w-5 h-5" />
            </div>
            <h3 className="font-serif font-bold text-lg text-[#252820]">
              2. Learn by Playing
            </h3>
            <p className="text-xs text-[#575A51] mt-2 leading-relaxed">
              Curricula are framed as narrative quests. Earn Mastery XP, advance through Gurukul ranks, and unlock verifiable Antique Brass skill seals without point-farming.
            </p>
          </div>

          <div className="card-parchment">
            <div className="w-10 h-10 rounded bg-[#354B3A] text-white flex items-center justify-center mb-4">
              <Code2 className="w-5 h-5" />
            </div>
            <h3 className="font-serif font-bold text-lg text-[#252820]">
              3. Theory-to-Practice Simulators
            </h3>
            <p className="text-xs text-[#575A51] mt-2 leading-relaxed">
              Live in-browser Python WebAssembly runner, interactive Machine Learning parameter sliders, and virtual startup unit economics models bridge theory with execution.
            </p>
          </div>

          <div className="card-parchment">
            <div className="w-10 h-10 rounded bg-[#A65F43] text-white flex items-center justify-center mb-4">
              <Sparkles className="w-5 h-5" />
            </div>
            <h3 className="font-serif font-bold text-lg text-[#252820]">
              4. Acharya AI Socratic Mentor
            </h3>
            <p className="text-xs text-[#575A51] mt-2 leading-relaxed">
              A 4-tier progressive hint protocol refuses to leak direct homework answers, guiding your mental model with nudges, patterns, and analogies in English and Hinglish.
            </p>
          </div>

          <div className="card-parchment">
            <div className="w-10 h-10 rounded bg-[#354B3A] text-white flex items-center justify-center mb-4">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <h3 className="font-serif font-bold text-lg text-[#252820]">
              5. Real Projects & Skill Proof
            </h3>
            <p className="text-xs text-[#575A51] mt-2 leading-relaxed">
              Build multi-file capstone systems like an in-memory cache with TTL. Each portfolio entry includes passed test run proofs and cryptographic verification hashes.
            </p>
          </div>

          <div className="card-parchment">
            <div className="w-10 h-10 rounded bg-[#7A6230] text-white flex items-center justify-center mb-4">
              <Users className="w-5 h-5" />
            </div>
            <h3 className="font-serif font-bold text-lg text-[#252820]">
              6. Collaborative Squads
            </h3>
            <p className="text-xs text-[#575A51] mt-2 leading-relaxed">
              Form 4-person study guilds with cohort peers, tackle weekly architectural milestones together, and participate in peer code reviews for collective honor points.
            </p>
          </div>
        </div>
      </section>

      {/* Call to Action Banner */}
      <section className="bg-[#354B3A] text-[#F6F1E7] py-16 px-4 text-center">
        <div className="max-w-3xl mx-auto">
          <h2 className="font-serif font-bold text-3xl sm:text-4xl">
            Hit the Eye of the Bird.
          </h2>
          <p className="mt-4 text-sm text-[#E2E8E3] max-w-xl mx-auto leading-relaxed">
            Begin with a 3-minute diagnostic assessment to calibrate your personalized learning questline.
          </p>
          <div className="mt-8 flex justify-center gap-4">
            <Link
              href="/onboarding"
              className="bg-[#F6F1E7] text-[#354B3A] font-medium text-sm px-6 py-3 rounded hover:bg-[#E9DFC9] transition-colors"
            >
              Start Diagnostic Trial
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
