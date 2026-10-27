// Dronacharya Authentication & Registration Gateway
// Enforces real database credential matching and custom class/subject selection
'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import {
  authenticateUser,
  registerUser,
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
} from 'lucide-react';

export default function AuthPage() {
  const router = useRouter();

  // Mode: 'signin' | 'signup'
  const [isSignUp, setIsSignUp] = useState(false);

  // Form Fields
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [studentClass, setStudentClass] = useState(AVAILABLE_CLASSES[1]);
  const [targetSubject, setTargetSubject] = useState(AVAILABLE_SUBJECTS[0].id);

  // UI Status
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  React.useEffect(() => {
    const session = typeof window !== 'undefined' ? localStorage.getItem('dronacharya_active_session_v2') : null;
    if (session) {
      router.push('/');
    }
  }, [router]);

  const handleSignIn = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);
    setSuccessMsg(null);
    setIsSubmitting(true);

    const result = authenticateUser({ email, password });
    setIsSubmitting(false);

    if (result.success && result.user) {
      setSuccessMsg(`Welcome back, ${result.user.name}! Entering Gurukul...`);
      setTimeout(() => {
        router.push('/');
      }, 600);
    } else {
      setErrorMsg(result.error || 'Authentication failed. Please verify credentials.');
    }
  };

  const handleSignUp = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);
    setSuccessMsg(null);
    setIsSubmitting(true);

    const result = registerUser({
      name: fullName,
      email,
      password,
      studentClass,
      targetSubject,
    });
    setIsSubmitting(false);

    if (result.success && result.user) {
      setSuccessMsg(`Welcome, ${result.user.name}! Your learning journey is ready.`);
      setTimeout(() => {
        router.push('/');
      }, 600);
    } else {
      setErrorMsg(result.error || 'Registration failed.');
    }
  };

  return (
    <div className="w-full flex-1 flex items-center justify-center py-8 px-4 sm:px-6">
      <div className="w-full max-w-xl card-ivory border-2 border-[#D8CFC0] rounded-2xl p-6 sm:p-8 shadow-xl">
        {/* Brand Header */}
        <div className="text-center mb-6">
          <div className="w-12 h-12 mx-auto rounded-full bg-[#354B3A] text-[#F6F1E7] flex items-center justify-center font-serif text-2xl font-bold shadow-xs mb-3">
            द्रो
          </div>
          <h1 className="font-serif font-bold text-2xl sm:text-3xl text-[#252820]">
            {isSignUp ? 'Enroll in Dronacharya Gurukul' : 'Scholar Sign In'}
          </h1>
          <p className="text-xs sm:text-sm text-[#575A51] mt-1 max-w-md mx-auto">
            {isSignUp
              ? 'Select what class you are in and what subject you want to master through gamified learning.'
              : 'Enter your registered credentials to access your personalized game arena.'}
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
            Sign In to Existing Account
          </button>
          <button
            type="button"
            onClick={() => {
              setIsSignUp(true);
              setErrorMsg(null);
            }}
            className={`flex-1 py-2.5 text-xs font-semibold border-b-2 transition-all cursor-pointer ${
              isSignUp
                ? 'border-[#354B3A] text-[#354B3A]'
                : 'border-transparent text-[#7E8276] hover:text-[#252820]'
            }`}
          >
            Create New Account (Sign Up)
          </button>
        </div>

        {/* Feedback Alerts */}
        {errorMsg && (
          <div className="mb-5 p-3 rounded-lg bg-[#FAF4F0] border border-[#A65F43] text-xs text-[#A65F43] flex items-start gap-2 animate-in fade-in">
            <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
            <span>{errorMsg}</span>
          </div>
        )}

        {successMsg && (
          <div className="mb-5 p-3 rounded-lg bg-[#E2E8E3] border border-[#354B3A] text-xs text-[#354B3A] font-semibold flex items-center gap-2 animate-in fade-in">
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
                  placeholder="scholar@gurukul.edu"
                  className="w-full pl-9 pr-3 py-2 border border-[#D8CFC0] rounded bg-[#FDFBF7] focus:outline-none focus:border-[#354B3A]"
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
                  placeholder="Enter your password"
                  className="w-full pl-9 pr-3 py-2 border border-[#D8CFC0] rounded bg-[#FDFBF7] focus:outline-none focus:border-[#354B3A]"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="btn-primary w-full py-2.5 text-xs mt-2 flex items-center justify-center gap-2 shadow-sm"
            >
              <span>{isSubmitting ? 'Verifying with Database...' : 'Sign In to Game Arena'}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </form>
        ) : (
          /* SIGN UP FORM */
          <form onSubmit={handleSignUp} className="space-y-4 text-xs">
            <div>
              <label className="block font-semibold text-[#252820] mb-1">Full Name</label>
              <div className="relative">
                <User className="w-4 h-4 text-[#7E8276] absolute left-3 top-2.5" />
                <input
                  type="text"
                  required
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  placeholder="Your Name (e.g., Arjun)"
                  className="w-full pl-9 pr-3 py-2 border border-[#D8CFC0] rounded bg-[#FDFBF7] focus:outline-none focus:border-[#354B3A]"
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
                  className="w-full pl-9 pr-3 py-2 border border-[#D8CFC0] rounded bg-[#FDFBF7] focus:outline-none focus:border-[#354B3A]"
                />
              </div>
            </div>

            <div>
              <label className="block font-semibold text-[#252820] mb-1">Create Password</label>
              <div className="relative">
                <Lock className="w-4 h-4 text-[#7E8276] absolute left-3 top-2.5" />
                <input
                  type="password"
                  required
                  minLength={6}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="At least 6 characters"
                  className="w-full pl-9 pr-3 py-2 border border-[#D8CFC0] rounded bg-[#FDFBF7] focus:outline-none focus:border-[#354B3A]"
                />
              </div>
            </div>

            {/* Select Class / Target Level */}
            <div>
              <label className="block font-semibold text-[#252820] mb-1 flex items-center gap-1.5">
                <GraduationCap className="w-4 h-4 text-[#354B3A]" />
                <span>Select Your Current Class / Target Level</span>
              </label>
              <select
                value={studentClass}
                onChange={(e) => setStudentClass(e.target.value)}
                className="w-full px-3 py-2 border border-[#D8CFC0] rounded bg-white focus:outline-none focus:border-[#354B3A]"
              >
                {AVAILABLE_CLASSES.map((c) => (
                  <option key={c} value={c}>{c}</option>
                ))}
              </select>
              <p className="text-[10px] text-[#7E8276] mt-0.5">You can change your class anytime later.</p>
            </div>

            {/* Select Course / Subject to Learn */}
            <div>
              <label className="block font-semibold text-[#252820] mb-1 flex items-center gap-1.5">
                <BookOpen className="w-4 h-4 text-[#A65F43]" />
                <span>What Subject Do You Want To Learn?</span>
              </label>
              <div className="space-y-1.5 mt-1.5 max-h-48 overflow-y-auto pr-1">
                {AVAILABLE_SUBJECTS.map((s) => (
                  <div
                    key={s.id}
                    onClick={() => setTargetSubject(s.id)}
                    className={`p-2.5 rounded-lg border cursor-pointer transition-all flex items-center justify-between ${
                      targetSubject === s.id
                        ? 'bg-[#E9DFC9] border-[#354B3A] ring-1 ring-[#354B3A]'
                        : 'bg-white border-[#D8CFC0] hover:bg-[#FDFBF7]'
                    }`}
                  >
                    <div>
                      <div className="font-semibold text-xs text-[#252820]">{s.name}</div>
                      <div className="text-[10px] text-[#7E8276]">{s.tagline}</div>
                    </div>
                    {targetSubject === s.id && (
                      <span className="text-[11px] font-bold text-[#354B3A]">✓ Selected</span>
                    )}
                  </div>
                ))}
              </div>
              <p className="text-[10px] text-[#7E8276] mt-1">
                You can switch between Python, Math, Physics, ML, and Systems anytime with 1 click.
              </p>
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="btn-primary w-full py-2.5 text-xs mt-3 flex items-center justify-center gap-2 shadow-sm"
            >
              <span>{isSubmitting ? 'Registering...' : 'Register & Start Game'}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </form>
        )}

        <div className="mt-6 pt-4 border-t border-[#D8CFC0] text-center text-[10px] text-[#7E8276]">
          {isSignUp ? (
            <span>Already registered? <button onClick={() => setIsSignUp(false)} className="text-[#354B3A] font-semibold underline">Sign In here</button></span>
          ) : (
            <span>New student? <button onClick={() => setIsSignUp(true)} className="text-[#354B3A] font-semibold underline">Create an Account</button></span>
          )}
        </div>
      </div>
    </div>
  );
}
