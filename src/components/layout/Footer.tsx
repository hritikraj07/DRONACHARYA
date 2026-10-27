// Dronacharya Compact Global Footer
import React from 'react';

export function Footer() {
  return (
    <footer className="w-full border-t-2 border-[#1E1E24] bg-[#FAF6EE] py-3 px-4 sm:px-6 mt-auto">
      <div className="w-full flex flex-col sm:flex-row items-center justify-between gap-2 text-xs text-[#4A4A58]">
        <div className="flex items-center gap-2">
          <span className="font-serif font-black text-xs text-[#1E1E24]">DRONACHARYA</span>
          <span className="text-[#6C5CE7] font-bold">•</span>
          <span className="text-[#6C5CE7] font-bold">Coding Adventure</span>
        </div>
        <div className="text-[11px] text-[#7E7E8F] flex items-center gap-3">
          <span>Explore • Code • Master</span>
          <span>© 2026 Dronacharya Platform</span>
        </div>
      </div>
    </footer>
  );
}
