// Dronacharya Compact Global Footer
import React from 'react';

export function Footer() {
  return (
    <footer className="w-full border-t border-[#D8CFC0] bg-[#FAF8F5] py-2 px-4 sm:px-6 mt-auto">
      <div className="w-full flex flex-col sm:flex-row items-center justify-between gap-1 text-[11px] text-[#575A51]">
        <div className="flex items-center gap-2">
          <span className="font-serif font-bold text-xs text-[#252820]">DRONACHARYA</span>
          <span className="text-[#A6AC9B]">•</span>
          <span className="text-[#7E8276]">Play, Code & Master</span>
        </div>
        <div className="text-[10px] text-[#7E8276]">
          © 2026 Dronacharya Platform • All Rights Reserved
        </div>
      </div>
    </footer>
  );
}

