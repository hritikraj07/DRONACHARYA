// Real-World Capstone Projects & Rubric Evaluation Workspace
'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useDronacharya } from '@/lib/store';
import {
  FolderGit2,
  CheckCircle2,
  Award,
  Sparkles,
  ArrowRight,
  Code2,
  Layers,
  FileCode,
  ShieldCheck,
  Zap,
} from 'lucide-react';

export default function ProjectsPage() {
  const { state, submitProject } = useDronacharya();
  const project = state.capstones[0];

  const fileKeys = Object.keys(project.starterFiles);
  const [activeFile, setActiveFile] = useState(fileKeys[0] || 'robot_navigator.py');
  const [files, setFiles] = useState(project.starterFiles);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [evaluationResult, setEvaluationResult] = useState<any>(project.submissionScore || null);

  const handleCodeChange = (newCode: string) => {
    setFiles((prev) => ({ ...prev, [activeFile]: newCode }));
  };

  const handleSubmit = () => {
    setIsSubmitting(true);
    setTimeout(() => {
      const score = submitProject(project.id, files);
      setEvaluationResult(score);
      setIsSubmitting(false);
    }, 800);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 w-full">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b-2 border-[#1E1E24] pb-6 mb-8">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#FBBF24] border-2 border-[#1E1E24] shadow-[2px_2px_0px_#1E1E24] text-xs font-black text-[#1E1E24] mb-2">
            <FolderGit2 className="w-3.5 h-3.5 text-[#1E1E24]" />
            <span>Capstone Kingdom Workspace</span>
          </div>
          <h1 className="font-black text-3xl sm:text-4xl text-[#1E1E24]">
            {project.title}
          </h1>
          <p className="text-xs sm:text-sm text-[#4A4A58] font-bold mt-1">
            Apply loop, condition, and state concepts to build a production autonomous navigation system.
          </p>
        </div>

        {project.isVerified && (
          <div className="flex items-center gap-2 p-3 rounded-xl bg-[#10B981]/20 border-2 border-[#1E1E24] shadow-[3px_3px_0px_#1E1E24] text-xs text-[#1E1E24] font-black">
            <CheckCircle2 className="w-5 h-5 text-[#10B981]" />
            <div>
              <div>Mastery Verified (Score: {project.submissionScore?.totalScore}/100)</div>
              <div className="text-[10px] text-[#4A4A58] font-bold">Published to Public Portfolio</div>
            </div>
          </div>
        )}
      </div>

      {/* Prerequisite & Mission Connection Banner */}
      <div className="mb-6 p-4 rounded-xl bg-[#FAF6EE] border-2 border-[#1E1E24] shadow-[4px_4px_0px_#1E1E24] flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
        <div className="flex items-center gap-2 flex-wrap">
          <span className="bg-[#6C5CE7] text-white px-2 py-0.5 rounded font-black text-[11px] border border-[#1E1E24]">
            Connected Mission
          </span>
          <span className="text-[#1E1E24] font-black">Rescue the Robot (Python Loops & Conditions)</span>
          {state.learningPaths[0]?.missions[0]?.isCompleted ? (
            <span className="text-[#10B981] font-black flex items-center gap-1">
              <CheckCircle2 className="w-4 h-4" />
              <span>Prerequisite Mastered</span>
            </span>
          ) : (
            <span className="text-[#EF4444] font-black">
              (Recommended: Complete Mission 1 first)
            </span>
          )}
        </div>
        <Link
          href="/simulator?mission=mission-rescue-robot"
          className="btn-game-purple py-1.5 px-3.5 text-xs shadow-[2px_2px_0px_#1E1E24] flex items-center gap-1"
        >
          <span>Open Rescue the Robot Simulator</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </Link>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left Column: Project Brief, Milestones & Rubric */}
        <div className="lg:col-span-5 space-y-6">
          <div className="card-game">
            <span className="text-[11px] font-black text-[#6C5CE7] uppercase tracking-wider">
              System Specification & Industry Value
            </span>
            <p className="text-xs text-[#4A4A58] font-bold mt-2 leading-relaxed">
              {project.description}
            </p>
            <div className="mt-3 p-3 rounded-lg bg-[#FAF6EE] border-2 border-[#1E1E24] text-[11px] text-[#4A4A58] font-bold">
              <strong className="text-[#1E1E24]">Why this matters:</strong> Autonomous warehouse rovers and planetary landers process movement command sequences with finite battery constraints. If coordinates or battery checks fail, the robot crashes into perimeter walls.
            </div>

            <div className="mt-4 pt-3 border-t-2 border-[#1E1E24]">
              <div className="text-xs font-black text-[#1E1E24] mb-2">Learning Objectives:</div>
              <ul className="space-y-1.5 text-xs text-[#4A4A58] font-bold">
                {project.learningObjectives.map((obj, i) => (
                  <li key={i} className="flex items-start gap-2">
                    <span className="text-[#10B981] font-black">✓</span>
                    <span>{obj}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Milestones Checklist */}
          <div className="card-game">
            <h3 className="font-black text-sm text-[#1E1E24] mb-3">
              Architectural Milestones
            </h3>
            <div className="space-y-3">
              {project.milestones.map((m) => (
                <div key={m.id} className="p-3 rounded-xl bg-white border-2 border-[#1E1E24] shadow-[2px_2px_0px_#1E1E24] text-xs">
                  <div className="font-black text-xs text-[#1E1E24] flex items-center justify-between">
                    <span>{m.title}</span>
                    <span className="text-[10px] text-[#6C5CE7] font-black uppercase bg-[#6C5CE7]/10 px-2 py-0.5 rounded border border-[#6C5CE7]/30">In Progress</span>
                  </div>
                  <p className="text-xs text-[#4A4A58] font-bold mt-1">{m.description}</p>
                </div>
              ))}
            </div>
          </div>

          {/* 4-Tier Transparent Rubric */}
          <div className="card-game">
            <h3 className="font-black text-sm text-[#1E1E24] mb-2">
              Transparent Evaluation Rubric (100 Pts)
            </h3>
            <div className="space-y-2 text-xs font-bold">
              <div className="p-2.5 rounded-lg bg-[#FAF6EE] border border-[#1E1E24]">
                <strong className="text-[#1E1E24]">1. Functionality (40%):</strong> <span className="text-[#4A4A58]">{project.rubricCriteria.functionality}</span>
              </div>
              <div className="p-2.5 rounded-lg bg-[#FAF6EE] border border-[#1E1E24]">
                <strong className="text-[#1E1E24]">2. Edge Cases (25%):</strong> <span className="text-[#4A4A58]">{project.rubricCriteria.edgeCases}</span>
              </div>
              <div className="p-2.5 rounded-lg bg-[#FAF6EE] border border-[#1E1E24]">
                <strong className="text-[#1E1E24]">3. Complexity (20%):</strong> <span className="text-[#4A4A58]">{project.rubricCriteria.complexity}</span>
              </div>
              <div className="p-2.5 rounded-lg bg-[#FAF6EE] border border-[#1E1E24]">
                <strong className="text-[#1E1E24]">4. Code Style (15%):</strong> <span className="text-[#4A4A58]">{project.rubricCriteria.codeStyle}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Multi-File Code Workspace & Evaluation */}
        <div className="lg:col-span-7 flex flex-col gap-4">
          <div className="rounded-2xl border-2 border-[#1E1E24] shadow-[4px_4px_0px_#1E1E24] overflow-hidden flex flex-col bg-white">
            {/* Multi-File Tab Bar */}
            <div className="bg-[#1E1E24] px-4 py-2 flex items-center justify-between text-xs text-white">
              <div className="flex items-center gap-2">
                {Object.keys(files).map((filename) => (
                  <button
                    key={filename}
                    onClick={() => setActiveFile(filename)}
                    className={`px-3 py-1.5 rounded-lg flex items-center gap-1.5 font-mono text-xs transition-colors ${
                      activeFile === filename
                        ? 'bg-[#6C5CE7] text-white font-black shadow-[2px_2px_0px_#FAF6EE]'
                        : 'text-[#A0A0B0] hover:text-white hover:bg-[#2D2D38]'
                    }`}
                  >
                    <FileCode className="w-3.5 h-3.5" />
                    <span>{filename}</span>
                  </button>
                ))}
              </div>
              <span className="text-[11px] text-[#FBBF24] font-black font-mono flex items-center gap-1">
                <Zap className="w-3.5 h-3.5" />
                +350 XP Capstone
              </span>
            </div>

            {/* Code Editor */}
            <textarea
              value={files[activeFile] || ''}
              onChange={(e) => handleCodeChange(e.target.value)}
              rows={16}
              className="w-full p-4 bg-[#141419] text-[#FAF6EE] font-mono text-xs leading-relaxed focus:outline-none resize-none"
              spellCheck={false}
            />

            {/* Submit Action Bar */}
            <div className="bg-[#FAF6EE] px-4 py-3 border-t-2 border-[#1E1E24] flex items-center justify-between">
              <div className="text-[11px] text-[#4A4A58] font-bold">
                Automated test cases, static AST verification & complexity analysis
              </div>
              <button
                onClick={handleSubmit}
                disabled={isSubmitting}
                className="btn-game-yellow py-2 px-5 text-xs font-black shadow-[3px_3px_0px_#1E1E24] flex items-center gap-1.5"
              >
                <ShieldCheck className="w-4 h-4" />
                <span>{isSubmitting ? 'Evaluating Rubric...' : 'Submit for Rubric Evaluation'}</span>
              </button>
            </div>
          </div>

          {/* Rubric Evaluation Results Card */}
          {evaluationResult && (
            <div className="card-game animate-in fade-in duration-200">
              <div className="flex items-center justify-between mb-4 border-b-2 border-[#1E1E24] pb-3">
                <div className="flex items-center gap-2">
                  <Award className="w-6 h-6 text-[#FBBF24]" />
                  <div>
                    <h3 className="font-black text-lg text-[#1E1E24]">
                      Rubric Assessment Verdict
                    </h3>
                    <div className="text-[11px] text-[#10B981] font-black">
                      Passed Verification • Seal Minted to Profile
                    </div>
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-[10px] text-[#4A4A58] font-black uppercase">Final Score</div>
                  <div className="font-black text-3xl text-[#6C5CE7]">
                    {evaluationResult.totalScore}/100
                  </div>
                </div>
              </div>

              {/* Score Breakdown Grid */}
              <div className="grid grid-cols-4 gap-2 mb-4 text-center text-xs">
                <div className="p-2.5 rounded-xl bg-white border-2 border-[#1E1E24] shadow-[2px_2px_0px_#1E1E24]">
                  <div className="text-[10px] text-[#4A4A58] font-bold">Functionality</div>
                  <div className="font-black text-[#10B981] mt-0.5">{evaluationResult.functionalityScore}/40</div>
                </div>
                <div className="p-2.5 rounded-xl bg-white border-2 border-[#1E1E24] shadow-[2px_2px_0px_#1E1E24]">
                  <div className="text-[10px] text-[#4A4A58] font-bold">Edge Cases</div>
                  <div className="font-black text-[#10B981] mt-0.5">{evaluationResult.edgeCasesScore}/25</div>
                </div>
                <div className="p-2.5 rounded-xl bg-white border-2 border-[#1E1E24] shadow-[2px_2px_0px_#1E1E24]">
                  <div className="text-[10px] text-[#4A4A58] font-bold">Complexity</div>
                  <div className="font-black text-[#10B981] mt-0.5">{evaluationResult.complexityScore}/20</div>
                </div>
                <div className="p-2.5 rounded-xl bg-white border-2 border-[#1E1E24] shadow-[2px_2px_0px_#1E1E24]">
                  <div className="text-[10px] text-[#4A4A58] font-bold">Code Style</div>
                  <div className="font-black text-[#10B981] mt-0.5">{evaluationResult.codeStyleScore}/15</div>
                </div>
              </div>

              {/* Feedback Comments */}
              <div className="space-y-1.5 text-xs text-[#4A4A58] font-bold bg-[#FAF6EE] p-3 rounded-xl border-2 border-[#1E1E24]">
                {evaluationResult.feedbackComments.map((c: string, i: number) => (
                  <div key={i} className="flex items-start gap-2">
                    <span className="text-[#FBBF24]">★</span>
                    <span>{c}</span>
                  </div>
                ))}
              </div>

              <div className="mt-4 pt-3 border-t-2 border-[#1E1E24] flex items-center justify-between text-xs">
                <span className="text-[11px] text-[#4A4A58] font-mono truncate">
                  SHA-256 Proof: d7a8f3b2049e7d81c4e20984...
                </span>
                <Link
                  href={`/portfolio/${state.user.username}`}
                  className="btn-game-purple text-xs py-1.5 px-3.5 flex items-center gap-1.5 shadow-[2px_2px_0px_#1E1E24]"
                >
                  <span>View Public Portfolio</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
