'use client';

import React from 'react';

interface CourseCardBannerProps {
  courseId: string;
  className?: string;
}

export function CourseCardBanner({ courseId, className = '' }: CourseCardBannerProps) {
  const id = courseId.toLowerCase();

  return (
    <div
      className={`relative w-full h-44 overflow-hidden rounded-t-xl bg-[#090D1A] flex items-center justify-center select-none ${className}`}
      style={{
        backgroundImage: `
          linear-gradient(to right, rgba(255, 255, 255, 0.04) 1px, transparent 1px),
          linear-gradient(to bottom, rgba(255, 255, 255, 0.04) 1px, transparent 1px)
        `,
        backgroundSize: '18px 18px',
      }}
    >
      {/* Radial backlight glow */}
      <div className="absolute inset-0 bg-radial from-white/5 via-transparent to-transparent pointer-events-none" />

      {/* 1. PYTHON: Coiled cute serpent mascot, brackets, v3.12 */}
      {id === 'python' && (
        <svg viewBox="0 0 320 160" className="w-full h-full max-w-[300px]">
          {/* Subtle glow */}
          <circle cx="160" cy="80" r="55" fill="#38BDF8" opacity="0.12" filter="blur(16px)" />
          <circle cx="170" cy="85" r="45" fill="#FACC15" opacity="0.12" filter="blur(16px)" />

          {/* Left Brackets Pill */}
          <rect x="36" y="50" width="14" height="60" rx="7" fill="none" stroke="#38BDF8" strokeWidth="2.5" opacity="0.85" />
          <circle cx="43" cy="40" r="2.5" fill="#38BDF8" />

          {/* Right Brackets Pill */}
          <rect x="270" y="50" width="14" height="60" rx="7" fill="none" stroke="#FACC15" strokeWidth="2.5" opacity="0.85" />
          <circle cx="277" cy="120" r="2.5" fill="#FACC15" />

          {/* Top Pill: v3.12 */}
          <g transform="translate(230, 22)">
            <rect x="0" y="0" width="54" height="20" rx="10" fill="#0E1726" stroke="#38BDF8" strokeWidth="1.5" />
            <text x="27" y="13.5" textAnchor="middle" fill="#38BDF8" fontSize="9" fontFamily="monospace" fontWeight="bold">
              v3.12
            </text>
          </g>

          {/* Top Yellow sparkle */}
          <circle cx="115" cy="35" r="3" fill="#FACC15" />

          {/* Python Interlocking Mascot Coils */}
          {/* Blue Top Serpent */}
          <path
            d="M 160,42 C 132,42 120,52 120,68 C 120,84 134,88 152,88 L 175,88 C 185,88 192,95 192,105 C 192,118 180,126 160,126 C 142,126 135,118 135,112"
            fill="none"
            stroke="#38BDF8"
            strokeWidth="16"
            strokeLinecap="round"
          />
          {/* Yellow Bottom Serpent */}
          <path
            d="M 160,126 C 188,126 200,116 200,100 C 200,84 186,80 168,80 L 145,80 C 135,80 128,73 128,63 C 128,50 140,42 160,42"
            fill="none"
            stroke="#FACC15"
            strokeWidth="16"
            strokeLinecap="round"
          />

          {/* Eyes on Top Blue Head */}
          <circle cx="140" cy="56" r="3" fill="#0F172A" />
          <circle cx="149" cy="56" r="3" fill="#0F172A" />
          <circle cx="139" cy="55" r="1" fill="#FFFFFF" />
          <circle cx="148" cy="55" r="1" fill="#FFFFFF" />

          {/* Eyes on Bottom Yellow Head */}
          <circle cx="180" cy="112" r="3" fill="#0F172A" />
          <circle cx="171" cy="112" r="3" fill="#0F172A" />
          <circle cx="181" cy="111" r="1" fill="#FFFFFF" />
          <circle cx="172" cy="111" r="1" fill="#FFFFFF" />
        </svg>
      )}

      {/* 2. HTML: Code browser window, <code>, 3D shield, </div> */}
      {id === 'html' && (
        <svg viewBox="0 0 320 160" className="w-full h-full max-w-[300px]">
          {/* Subtle glow */}
          <circle cx="160" cy="80" r="55" fill="#E44D26" opacity="0.15" filter="blur(20px)" />

          {/* Left Pill: <code> */}
          <g transform="translate(34, 66)">
            <rect x="0" y="0" width="60" height="24" rx="12" fill="#0E1726" stroke="#38BDF8" strokeWidth="1.5" />
            <text x="30" y="15.5" textAnchor="middle" fill="#38BDF8" fontSize="10" fontFamily="monospace" fontWeight="bold">
              &lt;code&gt;
            </text>
          </g>

          {/* Right Pill: </div> */}
          <g transform="translate(226, 66)">
            <rect x="0" y="0" width="60" height="24" rx="12" fill="#0E1726" stroke="#34D399" strokeWidth="1.5" />
            <text x="30" y="15.5" textAnchor="middle" fill="#34D399" fontSize="10" fontFamily="monospace" fontWeight="bold">
              &lt;/div&gt;
            </text>
          </g>

          {/* Browser Window Header */}
          <g transform="translate(100, 24)">
            {/* Window frame */}
            <rect x="0" y="0" width="120" height="112" rx="10" fill="#151C2C" stroke="#2D3748" strokeWidth="2" />
            <path d="M 0,22 L 120,22" stroke="#2D3748" strokeWidth="1.5" />
            {/* Window dots */}
            <circle cx="12" cy="11" r="3.5" fill="#EF4444" />
            <circle cx="22" cy="11" r="3.5" fill="#FBBF24" />
            <circle cx="32" cy="11" r="3.5" fill="#10B981" />

            {/* 3D HTML5 Shield inside */}
            <g transform="translate(35, 34)">
              {/* Outer Shield (Orange) */}
              <polygon points="25,0 50,8 44,52 25,62 6,52 0,8" fill="#E44D26" />
              {/* Right Facet (Bright Orange) */}
              <polygon points="25,0 50,8 44,52 25,62" fill="#F16529" />
              {/* Inner White '5' Logo */}
              <polygon points="25,12 14,12 15,22 25,22 25,32 17,32 18,42 25,45 25,42 33,39 34,26 25,26" fill="#FFFFFF" opacity="0.95" />
              <polygon points="25,12 36,12 35,22 25,22 25,26 34,26 33,39 25,42" fill="#EBEBEB" />
            </g>
          </g>
        </svg>
      )}

      {/* 3. CSS: Prism with refracting light spectrum & display:grid crosshair */}
      {id === 'css' && (
        <svg viewBox="0 0 320 160" className="w-full h-full max-w-[300px]">
          {/* Central Prism Backlight */}
          <circle cx="160" cy="80" r="50" fill="#6C5CE7" opacity="0.15" filter="blur(20px)" />

          {/* Incoming White Light Beam */}
          <line x1="40" y1="90" x2="148" y2="78" stroke="#FFFFFF" strokeWidth="2.5" strokeLinecap="round" />

          {/* Prism Triangle (Glass Facet) */}
          <polygon
            points="160,26 122,118 198,118"
            fill="rgba(30, 41, 59, 0.6)"
            stroke="#38BDF8"
            strokeWidth="2.5"
            strokeLinejoin="round"
          />
          {/* Inner glass highlight */}
          <line x1="160" y1="32" x2="130" y2="114" stroke="#FFFFFF" strokeWidth="1" opacity="0.6" />

          {/* Refracted Spectral Beams */}
          <line x1="178" y1="84" x2="280" y2="60" stroke="#EF4444" strokeWidth="3" strokeLinecap="round" />
          <line x1="179" y1="87" x2="280" y2="72" stroke="#F97316" strokeWidth="3" strokeLinecap="round" />
          <line x1="180" y1="90" x2="280" y2="84" stroke="#FACC15" strokeWidth="3" strokeLinecap="round" />
          <line x1="181" y1="93" x2="280" y2="96" stroke="#10B981" strokeWidth="3" strokeLinecap="round" />
          <line x1="182" y1="96" x2="280" y2="108" stroke="#38BDF8" strokeWidth="3" strokeLinecap="round" />
          <line x1="183" y1="99" x2="280" y2="120" stroke="#8B5CF6" strokeWidth="3" strokeLinecap="round" />

          {/* Crosshair Pill: display: grid */}
          <g transform="translate(100, 84)">
            {/* Target crosshair circle */}
            <circle cx="28" cy="14" r="18" fill="none" stroke="#38BDF8" strokeWidth="1.5" strokeDasharray="3 3" opacity="0.6" />
            <circle cx="28" cy="14" r="2.5" fill="#38BDF8" />
            <rect x="0" y="4" width="76" height="20" rx="6" fill="#090D1A" stroke="#38BDF8" strokeWidth="1.5" />
            <text x="38" y="17.5" textAnchor="middle" fill="#38BDF8" fontSize="9" fontFamily="monospace" fontWeight="bold">
              display: grid
            </text>
          </g>
        </svg>
      )}

      {/* 4. JAVASCRIPT: Glowing JS hexagon, lightning bolts, async/await */}
      {id === 'javascript' && (
        <svg viewBox="0 0 320 160" className="w-full h-full max-w-[300px]">
          {/* Yellow Glow */}
          <circle cx="160" cy="80" r="55" fill="#FACC15" opacity="0.18" filter="blur(22px)" />

          {/* Top Pill: async / await */}
          <g transform="translate(112, 16)">
            <rect x="0" y="0" width="96" height="20" rx="10" fill="#0E1726" stroke="#FACC15" strokeWidth="1.5" />
            <text x="48" y="13.5" textAnchor="middle" fill="#FACC15" fontSize="9.5" fontFamily="monospace" fontWeight="bold">
              async / await
            </text>
          </g>

          {/* Left Lightning Bolt */}
          <path
            d="M 65,55 L 75,75 L 68,78 L 80,105 L 72,83 L 78,81 Z"
            fill="#FACC15"
            stroke="#FEF08A"
            strokeWidth="1"
            className="animate-pulse"
          />

          {/* Right Lightning Bolt */}
          <path
            d="M 255,55 L 245,75 L 252,78 L 240,105 L 248,83 L 242,81 Z"
            fill="#FACC15"
            stroke="#FEF08A"
            strokeWidth="1"
            className="animate-pulse"
          />

          {/* Central JS Hexagon */}
          <g transform="translate(160, 88)">
            {/* Hexagon Shape */}
            <polygon
              points="0,-44 38,-22 38,22 0,44 -38,22 -38,-22"
              fill="#FACC15"
              stroke="#FEF08A"
              strokeWidth="2.5"
            />
            {/* Bold 'JS' Text */}
            <text
              x="0"
              y="11"
              textAnchor="middle"
              fill="#0F172A"
              fontSize="30"
              fontFamily="sans-serif"
              fontWeight="900"
              letterSpacing="-1"
            >
              JS
            </text>
          </g>
        </svg>
      )}

      {/* 5. REACT: Atomic orbitals, electrons, useState() */}
      {id === 'react' && (
        <svg viewBox="0 0 320 160" className="w-full h-full max-w-[300px]">
          <circle cx="160" cy="80" r="50" fill="#61DAFB" opacity="0.15" filter="blur(20px)" />

          {/* Top Pill: useState() */}
          <g transform="translate(116, 16)">
            <rect x="0" y="0" width="88" height="20" rx="10" fill="#0E1726" stroke="#61DAFB" strokeWidth="1.5" />
            <text x="44" y="13.5" textAnchor="middle" fill="#61DAFB" fontSize="9.5" fontFamily="monospace" fontWeight="bold">
              useState()
            </text>
          </g>

          <g transform="translate(160, 88)">
            {/* Nucleus */}
            <circle cx="0" cy="0" r="10" fill="#61DAFB" />

            {/* Ellipse 1 */}
            <ellipse cx="0" cy="0" rx="55" ry="20" fill="none" stroke="#61DAFB" strokeWidth="2.5" />
            <circle cx="50" cy="-8" r="4" fill="#61DAFB" />

            {/* Ellipse 2 (Rotated 60 deg) */}
            <ellipse
              cx="0"
              cy="0"
              rx="55"
              ry="20"
              fill="none"
              stroke="#61DAFB"
              strokeWidth="2.5"
              transform="rotate(60)"
            />
            <circle cx="-25" cy="-45" r="4" fill="#61DAFB" />

            {/* Ellipse 3 (Rotated 120 deg) */}
            <ellipse
              cx="0"
              cy="0"
              rx="55"
              ry="20"
              fill="none"
              stroke="#61DAFB"
              strokeWidth="2.5"
              transform="rotate(120)"
            />
            <circle cx="-25" cy="45" r="4" fill="#61DAFB" />
          </g>
        </svg>
      )}

      {/* 6. NODEJS: Isometric server cube, green data pipelines */}
      {id === 'nodejs' && (
        <svg viewBox="0 0 320 160" className="w-full h-full max-w-[300px]">
          <circle cx="160" cy="80" r="50" fill="#339933" opacity="0.15" filter="blur(20px)" />

          {/* Top Pill: node index.js */}
          <g transform="translate(108, 16)">
            <rect x="0" y="0" width="104" height="20" rx="10" fill="#0E1726" stroke="#339933" strokeWidth="1.5" />
            <text x="52" y="13.5" textAnchor="middle" fill="#34D399" fontSize="9.5" fontFamily="monospace" fontWeight="bold">
              node server.js
            </text>
          </g>

          {/* Isometric Server Block */}
          <g transform="translate(160, 86)">
            {/* Top Face */}
            <polygon points="0,-36 36,-18 0,0 -36,-18" fill="#43A047" stroke="#66BB6A" strokeWidth="2" />
            {/* Right Face */}
            <polygon points="36,-18 36,22 0,40 0,0" fill="#2E7D32" stroke="#66BB6A" strokeWidth="2" />
            {/* Left Face */}
            <polygon points="-36,-18 -36,22 0,40 0,0" fill="#1B5E20" stroke="#66BB6A" strokeWidth="2" />
            {/* Server LED indicators */}
            <circle cx="-16" cy="10" r="2.5" fill="#69F0AE" />
            <circle cx="-6" cy="15" r="2.5" fill="#69F0AE" />
            <circle cx="16" cy="10" r="2.5" fill="#69F0AE" />
          </g>

          {/* Data Lines */}
          <path d="M 60,86 L 110,86" stroke="#34D399" strokeWidth="2" strokeDasharray="4 4" />
          <path d="M 210,86 L 260,86" stroke="#34D399" strokeWidth="2" strokeDasharray="4 4" />
        </svg>
      )}

      {/* 7. SQL: Relational cylinder database stack, query pill */}
      {id === 'sql' && (
        <svg viewBox="0 0 320 160" className="w-full h-full max-w-[300px]">
          <circle cx="160" cy="80" r="50" fill="#00758F" opacity="0.18" filter="blur(20px)" />

          {/* Top Pill: SELECT * */}
          <g transform="translate(110, 16)">
            <rect x="0" y="0" width="100" height="20" rx="10" fill="#0E1726" stroke="#38BDF8" strokeWidth="1.5" />
            <text x="50" y="13.5" textAnchor="middle" fill="#38BDF8" fontSize="9.5" fontFamily="monospace" fontWeight="bold">
              SELECT * FROM db
            </text>
          </g>

          {/* 3D Database Cylinders */}
          <g transform="translate(160, 60)">
            {/* Cylinder 1 (Bottom) */}
            <g transform="translate(0, 44)">
              <ellipse cx="0" cy="18" rx="42" ry="12" fill="#005A6F" stroke="#00758F" strokeWidth="2" />
              <rect x="-42" y="0" width="84" height="18" fill="#005A6F" />
              <ellipse cx="0" cy="0" rx="42" ry="12" fill="#00758F" stroke="#38BDF8" strokeWidth="2" />
            </g>
            {/* Cylinder 2 (Middle) */}
            <g transform="translate(0, 22)">
              <ellipse cx="0" cy="18" rx="42" ry="12" fill="#00758F" stroke="#38BDF8" strokeWidth="2" />
              <rect x="-42" y="0" width="84" height="18" fill="#00758F" />
              <ellipse cx="0" cy="0" rx="42" ry="12" fill="#008EA8" stroke="#38BDF8" strokeWidth="2" />
            </g>
            {/* Cylinder 3 (Top) */}
            <g transform="translate(0, 0)">
              <ellipse cx="0" cy="18" rx="42" ry="12" fill="#008EA8" stroke="#38BDF8" strokeWidth="2" />
              <rect x="-42" y="0" width="84" height="18" fill="#008EA8" />
              <ellipse cx="0" cy="0" rx="42" ry="12" fill="#00A7C5" stroke="#38BDF8" strokeWidth="2.5" />
            </g>
          </g>
        </svg>
      )}

      {/* 8. CPP: Microprocessor chip, lightning bus traces */}
      {id === 'cpp' && (
        <svg viewBox="0 0 320 160" className="w-full h-full max-w-[300px]">
          <circle cx="160" cy="80" r="50" fill="#00599C" opacity="0.18" filter="blur(20px)" />

          {/* Top Pill: std::vector */}
          <g transform="translate(116, 16)">
            <rect x="0" y="0" width="88" height="20" rx="10" fill="#0E1726" stroke="#00599C" strokeWidth="1.5" />
            <text x="44" y="13.5" textAnchor="middle" fill="#60A5FA" fontSize="9.5" fontFamily="monospace" fontWeight="bold">
              std::vector
            </text>
          </g>

          {/* Processor Silicon Die */}
          <g transform="translate(160, 88)">
            {/* CPU Pins */}
            <rect x="-40" y="-35" width="80" height="70" fill="none" stroke="#93C5FD" strokeWidth="1.5" strokeDasharray="6 6" />
            {/* Chip Body */}
            <rect x="-30" y="-25" width="60" height="50" rx="6" fill="#1E3A8A" stroke="#3B82F6" strokeWidth="2.5" />
            <text x="0" y="8" textAnchor="middle" fill="#FFFFFF" fontSize="20" fontFamily="sans-serif" fontWeight="900">
              C++
            </text>
          </g>

          {/* Bus Traces */}
          <path d="M 60,65 L 110,65 L 125,75" stroke="#60A5FA" strokeWidth="2" fill="none" />
          <path d="M 260,110 L 210,110 L 195,100" stroke="#60A5FA" strokeWidth="2" fill="none" />
        </svg>
      )}

      {/* 9. MACHINE LEARNING: Neural network synaptic graph */}
      {id === 'ml' && (
        <svg viewBox="0 0 320 160" className="w-full h-full max-w-[300px]">
          <circle cx="160" cy="80" r="50" fill="#FF6F00" opacity="0.18" filter="blur(20px)" />

          {/* Top Pill: model.fit() */}
          <g transform="translate(116, 16)">
            <rect x="0" y="0" width="88" height="20" rx="10" fill="#0E1726" stroke="#FF6F00" strokeWidth="1.5" />
            <text x="44" y="13.5" textAnchor="middle" fill="#FB923C" fontSize="9.5" fontFamily="monospace" fontWeight="bold">
              model.fit()
            </text>
          </g>

          {/* Synapses (Lines) */}
          <g stroke="#F97316" strokeWidth="1.5" opacity="0.6">
            <line x1="100" y1="55" x2="160" y2="45" />
            <line x1="100" y1="55" x2="160" y2="85" />
            <line x1="100" y1="55" x2="160" y2="125" />
            <line x1="100" y1="115" x2="160" y2="45" />
            <line x1="100" y1="115" x2="160" y2="85" />
            <line x1="100" y1="115" x2="160" y2="125" />

            <line x1="160" y1="45" x2="220" y2="65" />
            <line x1="160" y1="45" x2="220" y2="105" />
            <line x1="160" y1="85" x2="220" y2="65" />
            <line x1="160" y1="85" x2="220" y2="105" />
            <line x1="160" y1="125" x2="220" y2="65" />
            <line x1="160" y1="125" x2="220" y2="105" />
          </g>

          {/* Nodes */}
          {/* Layer 1 (Input) */}
          <circle cx="100" cy="55" r="7" fill="#EA580C" stroke="#FED7AA" strokeWidth="2" />
          <circle cx="100" cy="115" r="7" fill="#EA580C" stroke="#FED7AA" strokeWidth="2" />

          {/* Layer 2 (Hidden) */}
          <circle cx="160" cy="45" r="7" fill="#F97316" stroke="#FFEDD5" strokeWidth="2" />
          <circle cx="160" cy="85" r="8" fill="#F97316" stroke="#FFFFFF" strokeWidth="2.5" />
          <circle cx="160" cy="125" r="7" fill="#F97316" stroke="#FFEDD5" strokeWidth="2" />

          {/* Layer 3 (Output) */}
          <circle cx="220" cy="65" r="7" fill="#FDBA74" stroke="#FFFFFF" strokeWidth="2" />
          <circle cx="220" cy="105" r="7" fill="#FDBA74" stroke="#FFFFFF" strokeWidth="2" />
        </svg>
      )}

      {/* 10. GIT: Branching graph with commits & merge nodes */}
      {id === 'git' && (
        <svg viewBox="0 0 320 160" className="w-full h-full max-w-[300px]">
          <circle cx="160" cy="80" r="50" fill="#F05032" opacity="0.18" filter="blur(20px)" />

          {/* Top Pill: git commit */}
          <g transform="translate(112, 16)">
            <rect x="0" y="0" width="96" height="20" rx="10" fill="#0E1726" stroke="#F05032" strokeWidth="1.5" />
            <text x="48" y="13.5" textAnchor="middle" fill="#F87171" fontSize="9.5" fontFamily="monospace" fontWeight="bold">
              git commit -m
            </text>
          </g>

          {/* Main Branch Line (Blue) */}
          <line x1="60" y1="105" x2="260" y2="105" stroke="#38BDF8" strokeWidth="3" strokeLinecap="round" />

          {/* Feature Branch Curve (Orange) */}
          <path
            d="M 110,105 C 130,105 130,65 150,65 L 180,65 C 200,65 200,105 220,105"
            fill="none"
            stroke="#F05032"
            strokeWidth="3"
            strokeLinecap="round"
          />

          {/* Commits Dots on Main */}
          <circle cx="80" cy="105" r="6" fill="#0E1726" stroke="#38BDF8" strokeWidth="3" />
          <circle cx="110" cy="105" r="6" fill="#38BDF8" stroke="#FFFFFF" strokeWidth="2" />
          <circle cx="165" cy="105" r="6" fill="#0E1726" stroke="#38BDF8" strokeWidth="3" />
          <circle cx="220" cy="105" r="7" fill="#10B981" stroke="#FFFFFF" strokeWidth="2" />
          <circle cx="250" cy="105" r="6" fill="#0E1726" stroke="#38BDF8" strokeWidth="3" />

          {/* Commits on Feature */}
          <circle cx="150" cy="65" r="6" fill="#F05032" stroke="#FFFFFF" strokeWidth="2" />
          <circle cx="180" cy="65" r="6" fill="#F05032" stroke="#FFFFFF" strokeWidth="2" />
        </svg>
      )}
    </div>
  );
}
