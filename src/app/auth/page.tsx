// Dronacharya Authentication & Registration Gateway
// Step-by-Step onboarding, strictly up to 12th Pass, dropdown for programming languages
'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import {
  authenticateUser,
  registerUser,
  setActiveSession,
  AVAILABLE_CLASSES,
  AVAILABLE_SUBJECTS,
} from '@/lib/db/auth-db';
import {
  ShieldCheck,
  ArrowRight,
  BookOpen,
  GraduationCap,
  Sparkles,
  AlertCircle,
  CheckCircle2,
  Lock,
  Mail,
  User,
  ChevronDown,
  Gamepad2,
} from 'lucide-react';

export default function AuthPage() {
  const router = useRouter();

  // Mode: 'signin' | 'signup'
  const [isSignUp, setIsSignUp] = useState(true);
  const [signupStep, setSignupStep] = useState<1 | 2 | 3>(1);

  // Form Fields
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [studentClass, setStudentClass] = useState(AVAILABLE_CLASSES[1]); // Default Class 10
  const [targetSubject, setTargetSubject] = useState(AVAILABLE_SUBJECTS[0].id);

  // UI Status
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  React.useEffect(() => {
    const session = typeof window !== 'undefined' ? localStorage.getItem('dronacharya_active_session_v2') : null;
    if (session) {
      window.location.href = '/';
    }
  }, []);

  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);
    setSuccessMsg(null);
    setIsSubmitting(true);

    const cleanEmail = email.trim();
    setEmail(cleanEmail);

    const result = await authenticateUser({ email: cleanEmail, password });
    setIsSubmitting(false);

    if (result.success && result.user) {
      setSuccessMsg(`Welcome back, ${result.user.name}! Entering your learning dashboard...`);
      setActiveSession(result.user, result.session);
      window.dispatchEvent(new Event('dronacharya_session_change'));
      window.dispatchEvent(new Event('storage'));
      setTimeout(() => {
        window.location.href = '/';
      }, 300);
    } else {
      setErrorMsg(result.error || 'Authentication failed. Please verify credentials.');
    }
  };

  const handleProceedToStep2 = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);
    if (!fullName.trim()) {
      setErrorMsg('Please enter your full name.');
      return;
    }
    const cleanEmail = email.trim();
    setEmail(cleanEmail);
    if (!cleanEmail || !cleanEmail.includes('@')) {
      setErrorMsg('Please enter a valid email address.');
      return;
    }
    if (password.length < 6) {
      setErrorMsg('Password must be at least 6 characters long.');
      return;
    }
    setSignupStep(2);
  };

  const handleProceedToStep3 = () => {
    setErrorMsg(null);
    if (!studentClass) {
      setErrorMsg('Please select your class standard.');
      return;
    }
    setSignupStep(3);
  };

  const handleFinalSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);
    setSuccessMsg(null);
    setIsSubmitting(true);

    const cleanEmail = email.trim();
    setEmail(cleanEmail);

    const result = await registerUser({
      name: fullName.trim(),
      email: cleanEmail,
      password,
      studentClass,
      targetSubject,
    });
    setIsSubmitting(false);

    if (result.success && result.user) {
      setSuccessMsg(`Welcome, ${result.user.name}! Your game arena is ready.`);
      setActiveSession(result.user, result.session);
      window.dispatchEvent(new Event('dronacharya_session_change'));
      window.dispatchEvent(new Event('storage'));
      setTimeout(() => {
        window.location.href = '/';
      }, 300);
    } else {
      setErrorMsg(result.error || 'Registration failed.');
    }
  };

  return (
    <div className="w-full flex-1 flex items-center justify-center py-10 px-4 sm:px-6">
      <div className="w-full max-w-xl card-game bg-white p-6 sm:p-8 shadow-[6px_6px_0px_#1E1E24]">
        {/* Brand Header */}
        <div className="text-center mb-6">
          <div className="w-12 h-12 mx-auto rounded-xl bg-[#6C5CE7] text-white flex items-center justify-center font-serif text-2xl font-bold border-2 border-[#1E1E24] shadow-[3px_3px_0px_#1E1E24] mb-3">
            द्रो
          </div>
          <h1 className="font-serif font-black text-2xl sm:text-3xl text-[#1E1E24]">
            {isSignUp ? 'Begin Your Coding Adventure' : 'Sign In to Your Quest'}
          </h1>
          <p className="text-xs sm:text-sm text-[#4A4A58] mt-1 max-w-md mx-auto">
            {isSignUp
              ? 'Complete 3 quick steps to tailor your interactive programming world.'
              : 'Enter your credentials to load your saved progress & character state.'}
          </p>
        </div>

        {/* Tab Switcher */}
        <div className="flex border-b-2 border-[#1E1E24] mb-6">
          <button
            type="button"
            onClick={() => {
              setIsSignUp(false);
              setErrorMsg(null);
            }}
            className={`flex-1 py-2.5 text-xs font-black border-b-2 transition-all cursor-pointer ${
              !isSignUp
                ? 'border-[#6C5CE7] text-[#6C5CE7]'
                : 'border-transparent text-[#7E7E8F] hover:text-[#1E1E24]'
            }`}
          >
            Sign In
          </button>
          <button
            type="button"
            onClick={() => {
              setIsSignUp(true);
              setErrorMsg(null);
              setSignupStep(1);
            }}
            className={`flex-1 py-2.5 text-xs font-black border-b-2 transition-all cursor-pointer ${
              isSignUp
                ? 'border-[#6C5CE7] text-[#6C5CE7]'
                : 'border-transparent text-[#7E7E8F] hover:text-[#1E1E24]'
            }`}
          >
            New Apprentice (Step-by-Step)
          </button>
        </div>

        {/* Feedback alerts */}
        {errorMsg && (
          <div className="mb-4 p-3 rounded-xl bg-[#FEE2E2] border-2 border-[#EF4444] text-xs text-[#DC2626] font-bold flex items-start gap-2">
            <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
            <span>{errorMsg}</span>
          </div>
        )}

        {successMsg && (
          <div className="mb-4 p-3 rounded-xl bg-[#D1FAE5] border-2 border-[#10B981] text-xs text-[#059669] font-bold flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 shrink-0" />
            <span>{successMsg}</span>
          </div>
        )}

        {/* SIGN IN FORM */}
        {!isSignUp ? (
          <form onSubmit={handleSignIn} className="space-y-4 text-xs">
            <div>
              <label className="block font-bold text-[#1E1E24] mb-1">Email Address</label>
              <div className="relative">
                <Mail className="w-4 h-4 text-[#7E7E8F] absolute left-3 top-2.5" />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  onBlur={() => setEmail((prev) => prev.trim())}
                  placeholder="student@learning.edu"
                  className="w-full pl-9 pr-3 py-2 border-2 border-[#1E1E24] rounded-xl bg-[#FAF6EE] focus:bg-white focus:outline-none"
                />
              </div>
            </div>

            <div>
              <label className="block font-bold text-[#1E1E24] mb-1">Password</label>
              <div className="relative">
                <Lock className="w-4 h-4 text-[#7E7E8F] absolute left-3 top-2.5" />
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter your database password"
                  className="w-full pl-9 pr-3 py-2 border-2 border-[#1E1E24] rounded-xl bg-[#FAF6EE] focus:bg-white focus:outline-none"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="btn-game-purple w-full py-2.5 text-xs shadow-[3px_3px_0px_#1E1E24] mt-2"
            >
              <span>{isSubmitting ? 'Verifying...' : 'Verify Credentials & Start Quest'}</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>

            <div className="text-center pt-2 text-[#7E7E8F]">
              Don't have an account yet?{' '}
              <button
                type="button"
                onClick={() => {
                  setIsSignUp(true);
                  setSignupStep(1);
                }}
                className="text-[#6C5CE7] font-black underline cursor-pointer"
              >
                Start Step-by-Step Setup
              </button>
            </div>
          </form>
        ) : (
          /* STEP-BY-STEP SIGN UP WIZARD */
          <div>
            {/* Step Stepper Header */}
            <div className="flex items-center justify-between mb-6 px-2">
              <div className="flex items-center gap-1.5">
                <div
                  className={`w-7 h-7 rounded-xl flex items-center justify-center font-black text-xs border-2 border-[#1E1E24] shadow-[1.5px_1.5px_0px_#1E1E24] ${
                    signupStep >= 1 ? 'bg-[#6C5CE7] text-white' : 'bg-[#E8E1D2] text-[#7E7E8F]'
                  }`}
                >
                  1
                </div>
                <span className={`text-xs font-black ${signupStep === 1 ? 'text-[#6C5CE7]' : 'text-[#7E7E8F]'}`}>
                  Account
                </span>
              </div>

              <div className={`flex-1 h-0.5 mx-2 ${signupStep >= 2 ? 'bg-[#6C5CE7]' : 'bg-[#1E1E24]/20'}`} />

              <div className="flex items-center gap-1.5">
                <div
                  className={`w-7 h-7 rounded-xl flex items-center justify-center font-black text-xs border-2 border-[#1E1E24] shadow-[1.5px_1.5px_0px_#1E1E24] ${
                    signupStep >= 2 ? 'bg-[#6C5CE7] text-white' : 'bg-[#E8E1D2] text-[#7E7E8F]'
                  }`}
                >
                  2
                </div>
                <span className={`text-xs font-black ${signupStep === 2 ? 'text-[#6C5CE7]' : 'text-[#7E7E8F]'}`}>
                  Class
                </span>
              </div>

              <div className={`flex-1 h-0.5 mx-2 ${signupStep >= 3 ? 'bg-[#6C5CE7]' : 'bg-[#1E1E24]/20'}`} />

              <div className="flex items-center gap-1.5">
                <div
                  className={`w-7 h-7 rounded-xl flex items-center justify-center font-black text-xs border-2 border-[#1E1E24] shadow-[1.5px_1.5px_0px_#1E1E24] ${
                    signupStep === 3 ? 'bg-[#6C5CE7] text-white' : 'bg-[#E8E1D2] text-[#7E7E8F]'
                  }`}
                >
                  3
                </div>
                <span className={`text-xs font-black ${signupStep === 3 ? 'text-[#6C5CE7]' : 'text-[#7E7E8F]'}`}>
                  Language
                </span>
              </div>
            </div>

            {/* STEP 1: CREDENTIALS */}
            {signupStep === 1 && (
              <form onSubmit={handleProceedToStep2} className="space-y-4 text-xs">
                <div>
                  <label className="block font-bold text-[#1E1E24] mb-1">Full Name</label>
                  <div className="relative">
                    <User className="w-4 h-4 text-[#7E7E8F] absolute left-3 top-2.5" />
                    <input
                      type="text"
                      required
                      value={fullName}
                      onChange={(e) => setFullName(e.target.value)}
                      placeholder="e.g. Arjun Sharma"
                      className="w-full pl-9 pr-3 py-2 border-2 border-[#1E1E24] rounded-xl bg-[#FAF6EE] focus:bg-white focus:outline-none"
                    />
                  </div>
                </div>

                <div>
                  <label className="block font-bold text-[#1E1E24] mb-1">Email Address</label>
                  <div className="relative">
                    <Mail className="w-4 h-4 text-[#7E7E8F] absolute left-3 top-2.5" />
                    <input
                      type="email"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      onBlur={() => setEmail((prev) => prev.trim())}
                      placeholder="your.email@example.com"
                      className="w-full pl-9 pr-3 py-2 border-2 border-[#1E1E24] rounded-xl bg-[#FAF6EE] focus:bg-white focus:outline-none"
                    />
                  </div>
                </div>

                <div>
                  <label className="block font-bold text-[#1E1E24] mb-1">
                    Create Password (min 6 characters)
                  </label>
                  <div className="relative">
                    <Lock className="w-4 h-4 text-[#7E7E8F] absolute left-3 top-2.5" />
                    <input
                      type="password"
                      required
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="Create a secure password"
                      className="w-full pl-9 pr-3 py-2 border-2 border-[#1E1E24] rounded-xl bg-[#FAF6EE] focus:bg-white focus:outline-none"
                    />
                  </div>
                </div>

                <div className="pt-2">
                  <button
                    type="submit"
                    className="btn-game-purple w-full py-2.5 text-xs shadow-[3px_3px_0px_#1E1E24]"
                  >
                    <span>Continue to Step 2: Choose Class</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>

                <div className="text-center pt-2 text-[#7E7E8F]">
                  Already registered?{' '}
                  <button
                    type="button"
                    onClick={() => setIsSignUp(false)}
                    className="text-[#6C5CE7] font-black underline cursor-pointer"
                  >
                    Sign In instead
                  </button>
                </div>
              </form>
            )}

            {/* STEP 2: CLASS SELECTION */}
            {signupStep === 2 && (
              <div className="space-y-4 text-xs">
                <div>
                  <div className="font-serif font-black text-sm text-[#1E1E24] mb-1">
                    Step 2: Choose Your Class Standard
                  </div>
                  <p className="text-[#4A4A58] text-[11px] mb-3">
                    Each class curriculum is tailored separately (up to 12th Pass only):
                  </p>
                </div>

                <div className="space-y-2">
                  {AVAILABLE_CLASSES.map((cls) => {
                    const isSelected = studentClass === cls;
                    return (
                      <div
                        key={cls}
                        onClick={() => setStudentClass(cls)}
                        className={`p-3 rounded-xl border-2 border-[#1E1E24] cursor-pointer transition-all flex items-center justify-between ${
                          isSelected
                            ? 'bg-[#FBBF24] shadow-[3px_3px_0px_#1E1E24] font-black'
                            : 'bg-white hover:bg-[#F2ECE0] shadow-[2px_2px_0px_#1E1E24]'
                        }`}
                      >
                        <div className="flex items-center gap-2.5">
                          <span className="font-black text-xs text-[#1E1E24]">{cls}</span>
                        </div>

                        <span className="text-[10px] text-[#4A4A58] font-bold">
                          {cls === 'Class 9'
                            ? 'Foundations & Algorithmic Logic'
                            : cls === 'Class 10'
                            ? 'Core Problem Solving & Python'
                            : cls === 'Class 11'
                            ? 'CS Principles & Loops'
                            : 'Advanced Systems & Capstones'}
                        </span>
                      </div>
                    );
                  })}
                </div>

                <div className="flex items-center justify-between pt-3">
                  <button
                    type="button"
                    onClick={() => setSignupStep(1)}
                    className="btn-game-white py-2 px-4 text-xs font-black"
                  >
                    ← Back
                  </button>
                  <button
                    type="button"
                    onClick={handleProceedToStep3}
                    className="btn-game-purple py-2 px-5 text-xs shadow-[3px_3px_0px_#1E1E24] flex items-center gap-1.5"
                  >
                    <span>Continue to Step 3: Select Language</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            )}

            {/* STEP 3: PROGRAMMING LANGUAGE IN DROPDOWN BUTTON */}
            {signupStep === 3 && (
              <form onSubmit={handleFinalSignUp} className="space-y-4 text-xs">
                <div>
                  <div className="font-black text-sm text-[#1E1E24] mb-1">
                    Step 3: Select Programming Realm
                  </div>
                  <p className="text-[#4A4A58] text-[11px] mb-3">
                    Choose the language you want to learn through playable 2D games and quests:
                  </p>
                </div>

                <div>
                  <label className="block font-black text-[#1E1E24] mb-1.5">
                    Programming Language (Select from dropdown):
                  </label>
                  <div className="relative">
                    <select
                      value={targetSubject}
                      onChange={(e) => setTargetSubject(e.target.value)}
                      className="w-full appearance-none px-3.5 py-2.5 border-2 border-[#1E1E24] rounded-xl bg-white text-xs font-black text-[#1E1E24] focus:outline-none shadow-[3px_3px_0px_#1E1E24] cursor-pointer pr-10"
                    >
                      {AVAILABLE_SUBJECTS.map((sub) => (
                        <option key={sub.id} value={sub.id}>
                          {sub.name} — {sub.tagline}
                        </option>
                      ))}
                    </select>
                    <ChevronDown className="w-4 h-4 text-[#1E1E24] absolute right-3.5 top-3 pointer-events-none" />
                  </div>
                </div>

                <div className="p-3.5 rounded-xl bg-[#FAF6EE] border-2 border-[#1E1E24] shadow-[3px_3px_0px_#1E1E24] space-y-1.5">
                  <div className="flex items-center gap-2 text-xs font-black text-[#6C5CE7]">
                    <Gamepad2 className="w-4 h-4 text-[#EF4444]" />
                    <span>Included Mission: Rescue the Robot with Python Loops</span>
                  </div>
                  <p className="text-[11px] text-[#4A4A58] font-medium leading-relaxed">
                    You will play an animated 2D grid game to steer the robot, collect energy cells, avoid space obstacles, and reach the base beacon.
                  </p>
                </div>

                <div className="flex items-center justify-between pt-3">
                  <button
                    type="button"
                    onClick={() => setSignupStep(2)}
                    className="btn-game-white py-2 px-4 text-xs font-black"
                  >
                    ← Back
                  </button>
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="btn-game-yellow py-2.5 px-6 text-xs font-black shadow-[4px_4px_0px_#1E1E24] flex items-center gap-1.5"
                  >
                    <span>{isSubmitting ? 'Setting up...' : '🚀 Finish Setup & Enter Game Arena'}</span>
                  </button>
                </div>
              </form>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
