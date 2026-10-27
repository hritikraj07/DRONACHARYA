// Dronacharya Save Progress & Cloud Sync Modal
// Codédex-inspired retro-arcade modal that syncs guest local progress to Supabase
'use client';

import React, { useState, useEffect } from 'react';
import {
  X,
  Sparkles,
  Flame,
  Heart,
  Award,
  ArrowRight,
  CheckCircle2,
  AlertCircle,
  Lock,
  Mail,
  User,
  GraduationCap,
} from 'lucide-react';
import confetti from 'canvas-confetti';
import {
  getGuestSession,
  registerUser,
  authenticateUser,
  AVAILABLE_CLASSES,
  AVAILABLE_SUBJECTS,
  RegisteredUser,
} from '@/lib/db/auth-db';

interface SaveProgressModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: (user: RegisteredUser) => void;
  initialMode?: 'signup' | 'signin';
}

export function SaveProgressModal({
  isOpen,
  onClose,
  onSuccess,
  initialMode = 'signup',
}: SaveProgressModalProps) {
  const [mode, setMode] = useState<'signup' | 'signin'>(initialMode);
  const [guestData, setGuestData] = useState<RegisteredUser | null>(null);

  // Form fields
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [studentClass, setStudentClass] = useState(AVAILABLE_CLASSES[1]); // Class 10
  const [targetSubject, setTargetSubject] = useState(AVAILABLE_SUBJECTS[0].id);

  // Status
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  useEffect(() => {
    if (isOpen) {
      setGuestData(getGuestSession());
      setErrorMessage(null);
      setSuccessMessage(null);
      setMode(initialMode);
    }
  }, [isOpen, initialMode]);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);
    setSuccessMessage(null);
    setIsLoading(true);

    const cleanEmail = email.trim();

    if (!cleanEmail || !password) {
      setErrorMessage('Please enter both email and password.');
      setIsLoading(false);
      return;
    }

    try {
      if (mode === 'signup') {
        if (!name.trim()) {
          setErrorMessage('Please enter your adventurer name.');
          setIsLoading(false);
          return;
        }

        const res = await registerUser({
          name: name.trim(),
          email: cleanEmail,
          password,
          studentClass,
          targetSubject: guestData?.targetSubject || targetSubject,
        });

        if (!res.success || !res.user) {
          setErrorMessage(res.error || 'Failed to create account. Please try again.');
          setIsLoading(false);
          return;
        }

        try {
          confetti({
            particleCount: 120,
            spread: 80,
            origin: { y: 0.6 },
          });
        } catch (e) {}

        setSuccessMessage('Progress synced successfully! Welcome to Dronacharya.');
        setTimeout(() => {
          setIsLoading(false);
          onSuccess?.(res.user!);
          onClose();
        }, 1200);
      } else {
        const res = await authenticateUser({
          email: cleanEmail,
          password,
        });

        if (!res.success || !res.user) {
          setErrorMessage(res.error || 'Invalid credentials.');
          setIsLoading(false);
          return;
        }

        try {
          confetti({
            particleCount: 80,
            spread: 60,
            origin: { y: 0.6 },
          });
        } catch (e) {}

        setSuccessMessage('Logged in successfully! Progress synced to Supabase.');
        setTimeout(() => {
          setIsLoading(false);
          onSuccess?.(res.user!);
          onClose();
        }, 1000);
      }
    } catch (err: any) {
      setErrorMessage(err.message || 'An unexpected error occurred.');
      setIsLoading(false);
    }
  };

  const guestXp = guestData?.totalXp || 0;
  const guestHearts = guestData?.hearts ?? 5;
  const questCount = guestData?.completedMissions?.length || 0;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-[#1E1E24]/60 backdrop-blur-xs transition-opacity"
        onClick={onClose}
      />

      {/* Modal Dialog */}
      <div className="relative w-full max-w-lg bg-[#FAF6EE] border-3 border-[#1E1E24] rounded-2xl shadow-[8px_8px_0px_#1E1E24] p-6 sm:p-7 z-10 animate-in zoom-in-95 duration-150 max-h-[92vh] overflow-y-auto">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-1.5 rounded-xl border-2 border-[#1E1E24] bg-white text-[#1E1E24] hover:bg-[#FEE2E2] shadow-[2px_2px_0px_#1E1E24] transition-all cursor-pointer"
          aria-label="Close"
        >
          <X className="w-4 h-4" />
        </button>

        {/* Header Badge & Title */}
        <div className="space-y-1.5 mb-5">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#EDE9FE] border-2 border-[#1E1E24] text-xs font-black text-[#6C5CE7] shadow-[2px_2px_0px_#1E1E24]">
            <Sparkles className="w-3.5 h-3.5 text-[#6C5CE7]" />
            <span>CLOUD SYNC • SUPABASE</span>
          </div>
          <h2 className="font-serif font-black text-2xl sm:text-3xl text-[#1E1E24]">
            {mode === 'signup' ? 'Save Your Quest Progress' : 'Log In & Sync Progress'}
          </h2>
          <p className="text-xs sm:text-sm text-[#4A4A58] font-bold">
            Create a free account to save your streak and sync your achievements to Supabase.
          </p>
        </div>

        {/* Guest Progress Trophy Card */}
        <div className="mb-5 p-3.5 rounded-xl bg-white border-2 border-[#1E1E24] shadow-[3px_3px_0px_#1E1E24] flex items-center justify-between gap-3">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-lg bg-[#FEF3C7] border-2 border-[#1E1E24] flex items-center justify-center text-lg shrink-0">
              🕹️
            </div>
            <div>
              <span className="text-[10px] font-black uppercase text-[#D97706] tracking-wider block">
                Local Guest Stash
              </span>
              <span className="text-xs font-black text-[#1E1E24]">
                {guestXp} XP • {questCount} Quests Done • {guestHearts} ❤️
              </span>
            </div>
          </div>
          <span className="px-2 py-0.5 rounded-md bg-[#D1FAE5] border border-[#1E1E24] text-[10px] font-black text-[#059669] shrink-0">
            Will Sync
          </span>
        </div>

        {/* Tab Switcher: Sign Up vs Log In */}
        <div className="flex rounded-xl bg-white border-2 border-[#1E1E24] p-1 mb-5 shadow-[2px_2px_0px_#1E1E24]">
          <button
            type="button"
            onClick={() => {
              setMode('signup');
              setErrorMessage(null);
            }}
            className={`flex-1 py-2 text-xs font-black rounded-lg transition-all cursor-pointer ${
              mode === 'signup'
                ? 'bg-[#6C5CE7] text-white border-2 border-[#1E1E24] shadow-[2px_2px_0px_#1E1E24]'
                : 'text-[#4A4A58] hover:text-[#1E1E24]'
            }`}
          >
            Create Free Account
          </button>
          <button
            type="button"
            onClick={() => {
              setMode('signin');
              setErrorMessage(null);
            }}
            className={`flex-1 py-2 text-xs font-black rounded-lg transition-all cursor-pointer ${
              mode === 'signin'
                ? 'bg-[#6C5CE7] text-white border-2 border-[#1E1E24] shadow-[2px_2px_0px_#1E1E24]'
                : 'text-[#4A4A58] hover:text-[#1E1E24]'
            }`}
          >
            I Already Have an Account
          </button>
        </div>

        {/* Feedback Notifications */}
        {errorMessage && (
          <div className="mb-4 p-3 rounded-xl bg-[#FEE2E2] border-2 border-[#1E1E24] shadow-[2px_2px_0px_#1E1E24] flex items-center gap-2 text-xs font-bold text-[#DC2626]">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{errorMessage}</span>
          </div>
        )}

        {successMessage && (
          <div className="mb-4 p-3 rounded-xl bg-[#D1FAE5] border-2 border-[#1E1E24] shadow-[2px_2px_0px_#1E1E24] flex items-center gap-2 text-xs font-bold text-[#059669]">
            <CheckCircle2 className="w-4 h-4 shrink-0" />
            <span>{successMessage}</span>
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-3.5">
          {mode === 'signup' && (
            <div>
              <label className="block text-xs font-black text-[#1E1E24] mb-1">
                Adventurer Name:
              </label>
              <div className="relative">
                <input
                  type="text"
                  required
                  placeholder="e.g. Arya Stark"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full px-3.5 py-2.5 pl-9 rounded-xl border-2 border-[#1E1E24] bg-white text-xs font-bold text-[#1E1E24] shadow-[2px_2px_0px_#1E1E24] focus:outline-none focus:border-[#6C5CE7]"
                />
                <User className="w-4 h-4 text-[#7E7E8F] absolute left-3 top-3 pointer-events-none" />
              </div>
            </div>
          )}

          <div>
            <label className="block text-xs font-black text-[#1E1E24] mb-1">
              Email Address:
            </label>
            <div className="relative">
              <input
                type="email"
                required
                placeholder="you@domain.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-3.5 py-2.5 pl-9 rounded-xl border-2 border-[#1E1E24] bg-white text-xs font-bold text-[#1E1E24] shadow-[2px_2px_0px_#1E1E24] focus:outline-none focus:border-[#6C5CE7]"
              />
              <Mail className="w-4 h-4 text-[#7E7E8F] absolute left-3 top-3 pointer-events-none" />
            </div>
          </div>

          <div>
            <label className="block text-xs font-black text-[#1E1E24] mb-1">
              Password:
            </label>
            <div className="relative">
              <input
                type="password"
                required
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-3.5 py-2.5 pl-9 rounded-xl border-2 border-[#1E1E24] bg-white text-xs font-bold text-[#1E1E24] shadow-[2px_2px_0px_#1E1E24] focus:outline-none focus:border-[#6C5CE7]"
              />
              <Lock className="w-4 h-4 text-[#7E7E8F] absolute left-3 top-3 pointer-events-none" />
            </div>
          </div>

          {mode === 'signup' && (
            <div>
              <label className="block text-xs font-black text-[#1E1E24] mb-1">
                Your Academic Level:
              </label>
              <div className="relative">
                <select
                  value={studentClass}
                  onChange={(e) => setStudentClass(e.target.value)}
                  className="w-full px-3.5 py-2.5 pl-9 appearance-none rounded-xl border-2 border-[#1E1E24] bg-white text-xs font-bold text-[#1E1E24] shadow-[2px_2px_0px_#1E1E24] focus:outline-none focus:border-[#6C5CE7] cursor-pointer"
                >
                  {AVAILABLE_CLASSES.map((cls) => (
                    <option key={cls} value={cls}>
                      {cls}
                    </option>
                  ))}
                </select>
                <GraduationCap className="w-4 h-4 text-[#7E7E8F] absolute left-3 top-3 pointer-events-none" />
              </div>
            </div>
          )}

          {/* Action Button */}
          <div className="pt-2">
            <button
              type="submit"
              disabled={isLoading}
              className="w-full btn-game-yellow py-3 text-xs font-black flex items-center justify-center gap-2 shadow-[4px_4px_0px_#1E1E24] cursor-pointer disabled:opacity-50"
            >
              {isLoading ? (
                <span>Syncing with Supabase...</span>
              ) : mode === 'signup' ? (
                <>
                  <Sparkles className="w-4 h-4 text-[#1E1E24]" />
                  <span>Save Progress & Create Account</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              ) : (
                <>
                  <Sparkles className="w-4 h-4 text-[#1E1E24]" />
                  <span>Log In & Sync Local Progress</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </div>
        </form>

        {/* Security Note */}
        <p className="mt-4 text-[11px] text-center text-[#7E7E8F] font-bold">
          🔒 Secure authentication powered by Supabase. Your passwords and data are strictly encrypted.
        </p>
      </div>
    </div>
  );
}
