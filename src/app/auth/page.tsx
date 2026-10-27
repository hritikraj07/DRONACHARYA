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

    const result = await authenticateUser({ email, password });
    setIsSubmitting(false);

    if (result.success && result.user) {
      setSuccessMsg(`Welcome back, ${result.user.name}! Entering your learning dashboard...`);
      setActiveSession(result.user);
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
    if (!email.trim() || !email.includes('@')) {
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

    const result = await registerUser({
      name: fullName,
      email,
      password,
      studentClass,
      targetSubject,
    });
    setIsSubmitting(false);

    if (result.success && result.user) {
      setSuccessMsg(`Welcome, ${result.user.name}! Your game arena is ready.`);
      setActiveSession(result.user);
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
    <div className="w-full flex-1 flex items-center justify-center py-8 px-4 sm:px-6">
      <div className="w-full max-w-xl card-ivory border-2 border-[#D8CFC0] rounded-2xl p-6 sm:p-8 shadow-xl">
        {/* Brand Header */}
        <div className="text-center mb-6">
          <div className="w-12 h-12 mx-auto rounded-xl bg-[#354B3A] text-[#F6F1E7] flex items-center justify-center font-serif text-2xl font-bold shadow-xs mb-3">
            द्रो
          </div>
          <h1 className="font-serif font-bold text-2xl sm:text-3xl text-[#252820]">
            {isSignUp ? 'What do you want to learn?' : 'Sign In to Continue'}
          </h1>
          <p className="text-xs sm:text-sm text-[#575A51] mt-1 max-w-md mx-auto">
            {isSignUp
              ? 'Complete the 3 quick steps to tailor your interactive gaming curriculum.'
              : 'Enter your email and password to access your learning dashboard.'}
          </p>
        </div>

        {/* Tab Switcher */}
        <div className="flex border-b border-[#D8CFC0] mb-6">
          <button
            type="button"
            onClick={() => {
              setIsSignUp(false);
              setErrorMsg(null);
            }}
            className={`flex-1 py-2.5 text-xs font-semibold border-b-2 transition-all cursor-pointer ${
              !isSignUp
                ? 'border-[#354B3A] text-[#354B3A]'
                : 'border-transparent text-[#7E8276] hover:text-[#252820]'
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
            className={`flex-1 py-2.5 text-xs font-semibold border-b-2 transition-all cursor-pointer ${
              isSignUp
                ? 'border-[#354B3A] text-[#354B3A]'
                : 'border-transparent text-[#7E8276] hover:text-[#252820]'
            }`}
          >
            New Student (Step-by-Step)
          </button>
        </div>

        {/* Feedback alerts */}
        {errorMsg && (
          <div className="mb-4 p-3 rounded-lg bg-[#FAF4F0] border border-[#A65F43] text-xs text-[#A65F43] flex items-start gap-2">
            <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
            <span>{errorMsg}</span>
          </div>
        )}

        {successMsg && (
          <div className="mb-4 p-3 rounded-lg bg-[#E2E8E3] border border-[#354B3A] text-xs text-[#354B3A] font-semibold flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 shrink-0" />
            <span>{successMsg}</span>
          </div>
        )}

        {/* SIGN IN FORM */}
        {!isSignUp ? (
          <form onSubmit={handleSignIn} className="space-y-4 text-xs">
            <div>
              <label className="block font-semibold text-[#252820] mb-1">Email Address</label>
              <div className="relative">
                <Mail className="w-4 h-4 text-[#7E8276] absolute left-3 top-2.5" />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="student@learning.edu"
                  className="w-full pl-9 pr-3 py-2 border border-[#D8CFC0] rounded bg-[#FAF8F5] focus:bg-white focus:outline-none focus:border-[#354B3A]"
                />
              </div>
            </div>

            <div>
              <label className="block font-semibold text-[#252820] mb-1">Password</label>
              <div className="relative">
                <Lock className="w-4 h-4 text-[#7E8276] absolute left-3 top-2.5" />
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter your database password"
                  className="w-full pl-9 pr-3 py-2 border border-[#D8CFC0] rounded bg-[#FAF8F5] focus:bg-white focus:outline-none focus:border-[#354B3A]"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full btn-primary py-2.5 text-xs font-semibold shadow-xs mt-2"
            >
              <span>{isSubmitting ? 'Verifying...' : 'Verify Credentials & Start Learning'}</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>

            <div className="text-center pt-2 text-[#7E8276]">
              Don't have an account yet?{' '}
              <button
                type="button"
                onClick={() => {
                  setIsSignUp(true);
                  setSignupStep(1);
                }}
                className="text-[#354B3A] font-semibold underline cursor-pointer"
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
                  className={`w-6 h-6 rounded-full flex items-center justify-center font-bold text-xs ${
                    signupStep >= 1 ? 'bg-[#354B3A] text-white' : 'bg-[#D8CFC0] text-[#575A51]'
                  }`}
                >
                  1
                </div>
                <span className={`text-[11px] font-semibold ${signupStep === 1 ? 'text-[#354B3A]' : 'text-[#7E8276]'}`}>
                  Account
                </span>
              </div>

              <div className={`flex-1 h-0.5 mx-2 ${signupStep >= 2 ? 'bg-[#354B3A]' : 'bg-[#D8CFC0]'}`} />

              <div className="flex items-center gap-1.5">
                <div
                  className={`w-6 h-6 rounded-full flex items-center justify-center font-bold text-xs ${
                    signupStep >= 2 ? 'bg-[#354B3A] text-white' : 'bg-[#D8CFC0] text-[#575A51]'
                  }`}
                >
                  2
                </div>
                <span className={`text-[11px] font-semibold ${signupStep === 2 ? 'text-[#354B3A]' : 'text-[#7E8276]'}`}>
                  Class
                </span>
              </div>

              <div className={`flex-1 h-0.5 mx-2 ${signupStep >= 3 ? 'bg-[#354B3A]' : 'bg-[#D8CFC0]'}`} />

              <div className="flex items-center gap-1.5">
                <div
                  className={`w-6 h-6 rounded-full flex items-center justify-center font-bold text-xs ${
                    signupStep === 3 ? 'bg-[#354B3A] text-white' : 'bg-[#D8CFC0] text-[#575A51]'
                  }`}
                >
                  3
                </div>
                <span className={`text-[11px] font-semibold ${signupStep === 3 ? 'text-[#354B3A]' : 'text-[#7E8276]'}`}>
                  Language
                </span>
              </div>
            </div>

            {/* STEP 1: CREDENTIALS */}
            {signupStep === 1 && (
              <form onSubmit={handleProceedToStep2} className="space-y-4 text-xs">
                <div>
                  <label className="block font-semibold text-[#252820] mb-1">Full Name</label>
                  <div className="relative">
                    <User className="w-4 h-4 text-[#7E8276] absolute left-3 top-2.5" />
                    <input
                      type="text"
                      required
                      value={fullName}
                      onChange={(e) => setFullName(e.target.value)}
                      placeholder="e.g. Arjun Sharma"
                      className="w-full pl-9 pr-3 py-2 border border-[#D8CFC0] rounded bg-[#FAF8F5] focus:bg-white focus:outline-none focus:border-[#354B3A]"
                    />
                  </div>
                </div>

                <div>
                  <label className="block font-semibold text-[#252820] mb-1">Email Address</label>
                  <div className="relative">
                    <Mail className="w-4 h-4 text-[#7E8276] absolute left-3 top-2.5" />
                    <input
                      type="email"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="your.email@example.com"
                      className="w-full pl-9 pr-3 py-2 border border-[#D8CFC0] rounded bg-[#FAF8F5] focus:bg-white focus:outline-none focus:border-[#354B3A]"
                    />
                  </div>
                </div>

                <div>
                  <label className="block font-semibold text-[#252820] mb-1">
                    Create Password (min 6 characters)
                  </label>
                  <div className="relative">
                    <Lock className="w-4 h-4 text-[#7E8276] absolute left-3 top-2.5" />
                    <input
                      type="password"
                      required
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="Create a secure password"
                      className="w-full pl-9 pr-3 py-2 border border-[#D8CFC0] rounded bg-[#FAF8F5] focus:bg-white focus:outline-none focus:border-[#354B3A]"
                    />
                  </div>
                </div>

                <div className="pt-2">
                  <button
                    type="submit"
                    className="w-full btn-primary py-2.5 text-xs font-semibold shadow-xs flex items-center justify-center gap-1.5"
                  >
                    <span>Continue to Step 2: Choose Class</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>

                <div className="text-center pt-2 text-[#7E8276]">
                  Already registered?{' '}
                  <button
                    type="button"
                    onClick={() => setIsSignUp(false)}
                    className="text-[#354B3A] font-semibold underline cursor-pointer"
                  >
                    Sign In instead
                  </button>
                </div>
              </form>
            )}

            {/* STEP 2: CLASS SELECTION (Kept separately & only 12th pass) */}
            {signupStep === 2 && (
              <div className="space-y-4 text-xs">
                <div>
                  <div className="font-serif font-bold text-sm text-[#252820] mb-1">
                    Step 2: Choose Your Class Standard
                  </div>
                  <p className="text-[#575A51] text-[11px] mb-3">
                    Each class level is kept separate (up to 12th Pass only):
                  </p>
                </div>

                <div className="space-y-2">
                  {AVAILABLE_CLASSES.map((cls) => {
                    const isSelected = studentClass === cls;
                    return (
                      <div
                        key={cls}
                        onClick={() => setStudentClass(cls)}
                        className={`p-3 rounded-xl border-2 cursor-pointer transition-all flex items-center justify-between ${
                          isSelected
                            ? 'bg-[#E9DFC9] border-[#354B3A] shadow-xs ring-1 ring-[#354B3A]'
                            : 'bg-[#FAF8F5] border-[#D8CFC0] hover:bg-white hover:border-[#354B3A]/60'
                        }`}
                      >
                        <div className="flex items-center gap-2.5">
                          <div
                            className={`w-4 h-4 rounded-full border-2 flex items-center justify-center ${
                              isSelected ? 'border-[#354B3A] bg-[#354B3A]' : 'border-[#7E8276] bg-white'
                            }`}
                          >
                            {isSelected && <div className="w-1.5 h-1.5 rounded-full bg-white" />}
                          </div>
                          <span className="font-bold text-xs text-[#252820]">{cls}</span>
                        </div>

                        <span className="text-[10px] text-[#575A51] font-medium">
                          {cls === 'Class 9'
                            ? 'Foundations & Algorithmic Logic'
                            : cls === 'Class 10'
                            ? 'Core Problem Solving & Board Prep'
                            : cls === 'Class 11'
                            ? 'CS Principles & Loop Engineering'
                            : 'Advanced Systems & Competitive Prep'}
                        </span>
                      </div>
                    );
                  })}
                </div>

                <div className="flex items-center justify-between pt-3">
                  <button
                    type="button"
                    onClick={() => setSignupStep(1)}
                    className="px-4 py-2 border border-[#D8CFC0] rounded hover:bg-[#E9DFC9] text-[#575A51] font-semibold text-xs transition-colors"
                  >
                    ← Back
                  </button>
                  <button
                    type="button"
                    onClick={handleProceedToStep3}
                    className="btn-primary py-2 px-5 text-xs font-semibold shadow-xs flex items-center gap-1.5"
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
                  <div className="font-serif font-bold text-sm text-[#252820] mb-1">
                    Step 3: Select Programming Language
                  </div>
                  <p className="text-[#575A51] text-[11px] mb-3">
                    Choose the language you want to learn through playable 2D games:
                  </p>
                </div>

                <div>
                  <label className="block font-semibold text-[#252820] mb-1.5">
                    Programming Language (Select from dropdown):
                  </label>
                  <div className="relative">
                    <select
                      value={targetSubject}
                      onChange={(e) => setTargetSubject(e.target.value)}
                      className="w-full appearance-none px-3.5 py-2.5 border-2 border-[#354B3A] rounded-xl bg-white text-xs font-bold text-[#252820] focus:outline-none shadow-xs cursor-pointer pr-10"
                    >
                      {AVAILABLE_SUBJECTS.map((sub) => (
                        <option key={sub.id} value={sub.id}>
                          {sub.name} — {sub.tagline}
                        </option>
                      ))}
                    </select>
                    <ChevronDown className="w-4 h-4 text-[#354B3A] absolute right-3.5 top-3 pointer-events-none" />
                  </div>
                </div>

                <div className="p-3.5 rounded-xl bg-[#FAF8F5] border border-[#B49A65] space-y-1.5">
                  <div className="flex items-center gap-2 text-xs font-bold text-[#354B3A]">
                    <Gamepad2 className="w-4 h-4 text-[#A65F43]" />
                    <span>Included Game: Rescue the Robot with Python Loops</span>
                  </div>
                  <p className="text-[11px] text-[#575A51] leading-relaxed">
                    You will play an animated 2D grid game to steer the robot, collect energy cells, avoid space rocks, and reach the base beacon.
                  </p>
                </div>

                <div className="flex items-center justify-between pt-3">
                  <button
                    type="button"
                    onClick={() => setSignupStep(2)}
                    className="px-4 py-2 border border-[#D8CFC0] rounded hover:bg-[#E9DFC9] text-[#575A51] font-semibold text-xs transition-colors"
                  >
                    ← Back
                  </button>
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="btn-primary py-2.5 px-6 text-xs font-bold shadow-md flex items-center gap-1.5"
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
