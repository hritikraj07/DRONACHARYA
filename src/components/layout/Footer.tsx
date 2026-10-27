// Dronacharya Global Footer
import React from 'react';
import Link from 'next/link';

export function Footer() {
  return (
    <footer className="border-t border-[#D8CFC0] bg-[#E9DFC9]/40 py-12 px-4 sm:px-6 lg:px-8 mt-auto">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-6">
        <div className="flex flex-col items-center md:items-start">
          <div className="flex items-center gap-2">
            <span className="font-serif font-bold text-lg text-[#252820]">DRONACHARYA</span>
            <span className="text-xs px-2 py-0.5 rounded bg-[#354B3A] text-[#F6F1E7]">Gurukul 2.0</span>
          </div>
          <p className="text-xs text-[#575A51] mt-1 text-center md:text-left">
            Transforming theoretical comprehension into practical, verifiable mastery through Socratic AI.
          </p>
        </div>

        <div className="flex items-center gap-6 text-xs text-[#575A51]">
          <Link href="/paths" className="hover:text-[#252820]">Missions</Link>
          <Link href="/simulator" className="hover:text-[#252820]">Simulator</Link>
          <Link href="/projects" className="hover:text-[#252820]">Projects</Link>
          <Link href="/achievements" className="hover:text-[#252820]">Mastery Seals</Link>
          <Link href="/squads" className="hover:text-[#252820]">Squads</Link>
        </div>

        <div className="text-xs text-[#7E8276]">
          © 2026 Dronacharya Platform • DPDP Act 2023 Compliant
        </div>
      </div>
    </footer>
  );
}
