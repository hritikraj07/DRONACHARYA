// Dronacharya Authentication Screen (Sign In / Register)
'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useDronacharya } from '@/lib/store';
import { Compass, ArrowRight, ShieldCheck } from 'lucide-react';

export default function AuthPage() {
  const router = useRouter();
  const { updateProfile } = useDronacharya();

  const [isRegister, setIsRegister] = useState(false);
  const [email, setEmail] = useState('aarav.sharma@gurukul.edu');
  const [password, setPassword] = useState('Gurukul2026!');
  const [name, setName] = useState('Aarav Sharma');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (name) {
      updateProfile({ fullName: name, email });
    }
    router.push('/dashboard');
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-md card-ivory border-2 border-[#D8CFC0] rounded-xl p-8 shadow-xl">
        <div className="text-center mb-6">
          <div className="w-12 h-12 mx-auto rounded-full bg-[#354B3A] text-white flex items-center justify-center font-serif text-2xl font-bold shadow-sm mb-3">
            द्रो
          </div>
          <h1 className="font-serif font-bold text-2xl text-[#252820]">
            {isRegister ? 'Enter the Gurukul' : 'Welcome Back, Scholar'}
          </h1>
          <p className="text-xs text-[#575A51] mt-1">
            {isRegister
              ? 'Begin your journey from knowledge to demonstrable mastery.'
              : 'Sign in to access your missions, sandbox, and portfolio.'}
          </p>
        </div>

        {/* Tab Toggle */}
        <div className="flex border-b border-[#D8CFC0] mb-6">
          <button
            onClick={() => setIsRegister(false)}
            className={`flex-1 py-2 text-xs font-semibold border-b-2 transition-all ${
              !isRegister
                ? 'border-[#354B3A] text-[#354B3A]'
                : 'border-transparent text-[#7E8276] hover:text-[#252820]'
            }`}
          >
            Sign In
          </button>
          <button
            onClick={() => setIsRegister(true)}
            className={`flex-1 py-2 text-xs font-semibold border-b-2 transition-all ${
              isRegister
                ? 'border-[#354B3A] text-[#354B3A]'
                : 'border-transparent text-[#7E8276] hover:text-[#252820]'
            }`}
          >
            Register
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {isRegister && (
            <div>
              <label className="block text-xs font-medium text-[#252820] mb-1">
                Full Name
              </label>
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Aarav Sharma"
                className="w-full px-3 py-2 border border-[#D8CFC0] rounded text-xs bg-[#FDFBF7] focus:outline-none focus:border-[#354B3A]"
              />
            </div>
          )}

          <div>
            <label className="block text-xs font-medium text-[#252820] mb-1">
              Email Address
            </label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="aarav@gurukul.edu"
              className="w-full px-3 py-2 border border-[#D8CFC0] rounded text-xs bg-[#FDFBF7] focus:outline-none focus:border-[#354B3A]"
            />
          </div>

          <div>
            <label className="block text-xs font-medium text-[#252820] mb-1">
              Password
            </label>
            <input
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-3 py-2 border border-[#D8CFC0] rounded text-xs bg-[#FDFBF7] focus:outline-none focus:border-[#354B3A]"
            />
          </div>

          <button
            type="submit"
            className="btn-primary w-full text-xs py-2.5 mt-2 flex items-center justify-center gap-1.5 shadow-sm"
          >
            <span>{isRegister ? 'Complete Registration' : 'Sign In to Courtyard'}</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </form>

        <div className="mt-6 pt-4 border-t border-[#D8CFC0] text-center text-[11px] text-[#7E8276]">
          Protected by Dronacharya Identity & DPDP Act 2023 Compliance
        </div>
      </div>
    </div>
  );
}
