// Real-World Capstone Projects & Rubric Evaluation Workspace
'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useDronacharya } from '@/lib/store';
import { CapstoneProject } from '@/types';
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
} from 'lucide-react';

export default function ProjectsPage() {
  const { state, submitProject } = useDronacharya();
  const project = state.capstones[0];

  const [activeFile, setActiveFile] = useState('cache.py');
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
    }, 1000);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 w-full">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-[#D8CFC0] pb-6 mb-8">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-0.5 rounded-full bg-[#E9DFC9] border border-[#B49A65] text-xs font-semibold text-[#7A6230] mb-2">
            <FolderGit2 className="w-3.5 h-3.5 text-[#B49A65]" />
            <span>Capstone Project Workspace</span>
          </div>
          <h1 className="font-serif font-bold text-3xl text-[#252820]">
            {project.title}
          </h1>
          <p className="text-xs sm:text-sm text-[#575A51] mt-1">
            Build industry-grade systems evaluated against rigorous 4-tier architectural rubrics.
          </p>
        </div>

        {project.isVerified && (
          <div className="flex items-center gap-2 p-2.5 rounded-lg bg-[#E2E8E3] border border-[#354B3A] text-xs text-[#354B3A] font-semibold">
            <CheckCircle2 className="w-5 h-5 text-[#354B3A]" />
            <div>
              <div>Mastery Verified (Score: {project.submissionScore?.totalScore}/100)</div>
              <div className="text-[10px] text-[#575A51]">Published to Public Portfolio</div>
            </div>
          </div>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left Column: Project Brief, Milestones & Rubric */}
        <div className="lg:col-span-5 space-y-6">
          <div className="card-ivory">
            <span className="text-[11px] font-semibold text-[#A65F43] uppercase tracking-wider">
              System Specification
            </span>
            <p className="text-xs text-[#575A51] mt-2 leading-relaxed">
              {project.description}
            </p>

            <div className="mt-4 pt-3 border-t border-[#D8CFC0]">
              <div className="text-xs font-semibold text-[#252820] mb-2">Learning Objectives:</div>
              <ul className="space-y-1.5 text-xs text-[#575A51]">
                {project.learningObjectives.map((obj, i) => (
                  <li key={i} className="flex items-start gap-2">
                    <span className="text-[#354B3A] font-bold">✓</span>
                    <span>{obj}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Milestones Checklist */}
          <div className="card-ivory">
            <h3 className="font-serif font-bold text-sm text-[#252820] mb-3">
              Architectural Milestones
            </h3>
            <div className="space-y-3">
              {project.milestones.map((m) => (
                <div key={m.id} className="p-3 rounded bg-[#FDFBF7] border border-[#D8CFC0] text-xs">
                  <div className="font-serif font-bold text-sm text-[#252820] flex items-center justify-between">
                    <span>{m.title}</span>
                    <span className="text-[11px] text-[#354B3A] font-sans font-medium">In Progress</span>
                  </div>
                  <p className="text-xs text-[#575A51] mt-1">{m.description}</p>
                </div>
              ))}
            </div>
          </div>

          {/* 4-Tier Transparent Rubric */}
          <div className="card-ivory">
            <h3 className="font-serif font-bold text-sm text-[#252820] mb-2">
              Transparent Evaluation Rubric (100 Pts)
            </h3>
            <div className="space-y-2 text-xs">
              <div className="p-2.5 rounded bg-[#F0EAE1]">
                <strong>1. Functionality (40%):</strong> {project.rubricCriteria.functionality}
              </div>
              <div className="p-2.5 rounded bg-[#F0EAE1]">
                <strong>2. Edge Cases (25%):</strong> {project.rubricCriteria.edgeCases}
              </div>
              <div className="p-2.5 rounded bg-[#F0EAE1]">
                <strong>3. Complexity (20%):</strong> {project.rubricCriteria.complexity}
              </div>
              <div className="p-2.5 rounded bg-[#F0EAE1]">
                <strong>4. Code Style (15%):</strong> {project.rubricCriteria.codeStyle}
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Multi-File Code Workspace & Evaluation */}
        <div className="lg:col-span-7 flex flex-col gap-4">
          <div className="card-ivory p-0 overflow-hidden flex flex-col border border-[#D8CFC0] shadow-sm">
            {/* Multi-File Tab Bar */}
            <div className="bg-[#252820] px-4 py-2 flex items-center justify-between text-xs text-[#F6F1E7]">
              <div className="flex items-center gap-2">
                {Object.keys(files).map((filename) => (
                  <button
                    key={filename}
                    onClick={() => setActiveFile(filename)}
                    className={`px-3 py-1.5 rounded flex items-center gap-1.5 font-mono text-xs transition-colors ${
                      activeFile === filename
                        ? 'bg-[#354B3A] text-white font-semibold'
                        : 'text-[#A6AC9B] hover:text-white hover:bg-[#3A3E34]'
                    }`}
                  >
                    <FileCode className="w-3.5 h-3.5" />
                    <span>{filename}</span>
                  </button>
                ))}
              </div>
              <span className="text-[11px] text-[#B49A65] font-mono">+350 XP Capstone</span>
            </div>

            {/* Code Editor */}
            <textarea
              value={files[activeFile] || ''}
              onChange={(e) => handleCodeChange(e.target.value)}
              rows={16}
              className="w-full p-4 bg-[#1E201B] text-[#E9DFC9] font-mono text-xs leading-relaxed focus:outline-none resize-none"
              spellCheck={false}
            />

            {/* Submit Action Bar */}
            <div className="bg-[#F6F1E7] px-4 py-3 border-t border-[#D8CFC0] flex items-center justify-between">
              <div className="text-[11px] text-[#7E8276]">
                Automatic unit tests, static linting & complexity review
              </div>
              <button
                onClick={handleSubmit}
                disabled={isSubmitting}
                className="btn-primary text-xs py-2 px-5 shadow-sm"
              >
                <ShieldCheck className="w-4 h-4" />
                <span>{isSubmitting ? 'Evaluating Rubric...' : 'Submit for Rubric Evaluation'}</span>
              </button>
            </div>
          </div>

          {/* Rubric Evaluation Results Card */}
          {evaluationResult && (
            <div className="card-parchment animate-in fade-in duration-200">
              <div className="flex items-center justify-between mb-4 border-b border-[#D8CFC0] pb-3">
                <div className="flex items-center gap-2">
                  <Award className="w-6 h-6 text-[#B49A65]" />
                  <div>
                    <h3 className="font-serif font-bold text-lg text-[#252820]">
                      Rubric Assessment Verdict
                    </h3>
                    <div className="text-[11px] text-[#354B3A] font-semibold">
                      Passed Verification • Seal Minted
                    </div>
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-[11px] text-[#7E8276]">Final Score</div>
                  <div className="font-serif font-bold text-3xl text-[#354B3A]">
                    {evaluationResult.totalScore}/100
                  </div>
                </div>
              </div>

              {/* Score Breakdown Grid */}
              <div className="grid grid-cols-4 gap-2 mb-4 text-center text-xs">
                <div className="p-2 rounded bg-white border border-[#D8CFC0]">
                  <div className="text-[10px] text-[#7E8276]">Functionality</div>
                  <div className="font-bold text-[#354B3A] mt-0.5">{evaluationResult.functionalityScore}/40</div>
                </div>
                <div className="p-2 rounded bg-white border border-[#D8CFC0]">
                  <div className="text-[10px] text-[#7E8276]">Edge Cases</div>
                  <div className="font-bold text-[#354B3A] mt-0.5">{evaluationResult.edgeCasesScore}/25</div>
                </div>
                <div className="p-2 rounded bg-white border border-[#D8CFC0]">
                  <div className="text-[10px] text-[#7E8276]">Complexity</div>
                  <div className="font-bold text-[#354B3A] mt-0.5">{evaluationResult.complexityScore}/20</div>
                </div>
                <div className="p-2 rounded bg-white border border-[#D8CFC0]">
                  <div className="text-[10px] text-[#7E8276]">Code Style</div>
                  <div className="font-bold text-[#354B3A] mt-0.5">{evaluationResult.codeStyleScore}/15</div>
                </div>
              </div>

              {/* Feedback Comments */}
              <div className="space-y-1.5 text-xs text-[#575A51] bg-white p-3 rounded border border-[#D8CFC0]">
                {evaluationResult.feedbackComments.map((c: string, i: number) => (
                  <div key={i} className="flex items-start gap-2">
                    <span className="text-[#B49A65]">★</span>
                    <span>{c}</span>
                  </div>
                ))}
              </div>

              <div className="mt-4 pt-3 border-t border-[#D8CFC0] flex items-center justify-between text-xs">
                <span className="text-[11px] text-[#7E8276] font-mono truncate">
                  SHA-256 Proof: d7a8f3b2049e7d81c4e20984...
                </span>
                <Link
                  href={`/portfolio/${state.user.username}`}
                  className="btn-primary text-xs py-1.5 px-3 flex items-center gap-1.5"
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
