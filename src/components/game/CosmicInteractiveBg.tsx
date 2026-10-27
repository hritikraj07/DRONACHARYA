// Interactive Cosmic Coding Universe Background with Floating Collectibles & Programming Glyphs
// Rich deep midnight environment with upgraded horizon grid, zero-gravity sprites, glowing code runes, and physics
'use client';

import React, { useEffect, useRef } from 'react';

// Pixel Art Definitions (1 = color1, 2 = color2, 3 = color3, 4 = color4, 0 = transparent)
interface PixelSprite {
  name: string;
  width: number;
  height: number;
  palette: string[];
  grid: number[][];
  scale: number;
}

const PIXEL_SPRITES: Record<string, PixelSprite> = {
  trophy: {
    name: 'trophy',
    width: 12,
    height: 12,
    palette: ['transparent', '#FBBF24', '#D97706', '#FEF3C7', '#78350F'],
    scale: 3,
    grid: [
      [0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0],
      [1, 3, 3, 1, 1, 1, 1, 1, 1, 2, 2, 1],
      [1, 3, 1, 1, 1, 1, 1, 1, 1, 1, 2, 1],
      [1, 3, 1, 1, 1, 1, 1, 1, 1, 1, 2, 1],
      [0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0],
      [0, 0, 1, 1, 1, 1, 1, 1, 1, 1, 0, 0],
      [0, 0, 0, 1, 1, 1, 1, 1, 1, 0, 0, 0],
      [0, 0, 0, 0, 1, 1, 1, 1, 0, 0, 0, 0],
      [0, 0, 0, 0, 1, 1, 1, 1, 0, 0, 0, 0],
      [0, 0, 0, 1, 1, 1, 1, 1, 1, 0, 0, 0],
      [0, 0, 4, 4, 4, 4, 4, 4, 4, 4, 0, 0],
      [0, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 0],
    ],
  },
  chest: {
    name: 'chest',
    width: 12,
    height: 11,
    palette: ['transparent', '#FBBF24', '#B45309', '#FEF3C7', '#78350F'],
    scale: 3.2,
    grid: [
      [0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0],
      [1, 3, 1, 1, 1, 1, 1, 1, 1, 1, 2, 1],
      [1, 1, 4, 4, 4, 4, 4, 4, 4, 4, 1, 1],
      [1, 4, 4, 4, 4, 1, 1, 4, 4, 4, 4, 1],
      [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
      [1, 4, 4, 4, 4, 1, 1, 4, 4, 4, 4, 1],
      [1, 4, 4, 4, 4, 3, 3, 4, 4, 4, 4, 1],
      [1, 4, 4, 4, 4, 1, 1, 4, 4, 4, 4, 1],
      [1, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 1],
      [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
      [0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0],
    ],
  },
  spaceship: {
    name: 'spaceship',
    width: 13,
    height: 12,
    palette: ['transparent', '#38BDF8', '#0284C7', '#FFFFFF', '#EF4444'],
    scale: 3,
    grid: [
      [0, 0, 0, 0, 0, 1, 1, 1, 0, 0, 0, 0, 0],
      [0, 0, 0, 1, 1, 3, 3, 3, 1, 1, 0, 0, 0],
      [0, 0, 1, 1, 3, 3, 3, 3, 3, 1, 1, 0, 0],
      [0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0],
      [1, 1, 2, 2, 2, 2, 2, 2, 2, 2, 2, 1, 1],
      [1, 2, 2, 3, 3, 2, 2, 2, 3, 3, 2, 2, 1],
      [1, 2, 2, 3, 3, 2, 2, 2, 3, 3, 2, 2, 1],
      [1, 1, 2, 2, 2, 2, 2, 2, 2, 2, 2, 1, 1],
      [0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0],
      [0, 0, 1, 0, 1, 0, 0, 0, 1, 0, 1, 0, 0],
      [0, 1, 0, 0, 0, 4, 4, 4, 0, 0, 0, 1, 0],
      [1, 1, 0, 0, 4, 4, 4, 4, 4, 0, 0, 1, 1],
    ],
  },
  sword: {
    name: 'sword',
    width: 12,
    height: 12,
    palette: ['transparent', '#FFFFFF', '#94A3B8', '#FBBF24', '#78350F'],
    scale: 2.8,
    grid: [
      [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1],
      [0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 1],
      [0, 0, 0, 0, 0, 0, 0, 0, 1, 2, 1, 0],
      [0, 0, 0, 0, 0, 0, 0, 1, 2, 1, 0, 0],
      [0, 0, 0, 0, 0, 0, 1, 2, 1, 0, 0, 0],
      [0, 0, 0, 0, 0, 1, 2, 1, 0, 0, 0, 0],
      [0, 0, 0, 0, 1, 2, 1, 0, 0, 0, 0, 0],
      [0, 0, 3, 3, 3, 1, 0, 0, 0, 0, 0, 0],
      [0, 3, 3, 3, 3, 3, 0, 0, 0, 0, 0, 0],
      [0, 0, 4, 3, 3, 0, 0, 0, 0, 0, 0, 0],
      [0, 4, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
      [3, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    ],
  },
  rocket: {
    name: 'rocket',
    width: 11,
    height: 13,
    palette: ['transparent', '#EF4444', '#B91C1C', '#FFFFFF', '#F59E0B'],
    scale: 2.8,
    grid: [
      [0, 0, 0, 0, 0, 3, 0, 0, 0, 0, 0],
      [0, 0, 0, 0, 1, 1, 1, 0, 0, 0, 0],
      [0, 0, 0, 1, 1, 3, 1, 1, 0, 0, 0],
      [0, 0, 1, 1, 3, 3, 3, 1, 1, 0, 0],
      [0, 0, 1, 1, 1, 1, 1, 2, 2, 0, 0],
      [0, 0, 1, 1, 3, 3, 1, 2, 2, 0, 0],
      [0, 0, 1, 1, 3, 3, 1, 2, 2, 0, 0],
      [0, 1, 1, 1, 1, 1, 1, 2, 2, 1, 0],
      [1, 1, 1, 1, 1, 1, 1, 2, 2, 1, 1],
      [1, 0, 1, 1, 1, 1, 1, 2, 2, 0, 1],
      [0, 0, 0, 4, 4, 4, 4, 4, 0, 0, 0],
      [0, 0, 0, 0, 4, 4, 4, 0, 0, 0, 0],
      [0, 0, 0, 0, 0, 4, 0, 0, 0, 0, 0],
    ],
  },
  beast: {
    name: 'beast',
    width: 12,
    height: 10,
    palette: ['transparent', '#10B981', '#059669', '#34D399', '#064E3B'],
    scale: 3,
    grid: [
      [0, 0, 1, 1, 1, 1, 1, 1, 1, 1, 0, 0],
      [0, 1, 3, 3, 1, 1, 1, 1, 2, 2, 1, 0],
      [1, 3, 1, 1, 1, 1, 1, 1, 1, 1, 2, 1],
      [1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1],
      [1, 1, 0, 4, 0, 4, 4, 0, 4, 0, 1, 1],
      [1, 1, 0, 4, 4, 4, 4, 4, 4, 0, 1, 1],
      [1, 2, 0, 0, 0, 0, 0, 0, 0, 0, 2, 1],
      [0, 1, 2, 0, 0, 0, 0, 0, 0, 2, 1, 0],
      [0, 0, 1, 1, 0, 0, 0, 0, 1, 1, 0, 0],
      [0, 0, 0, 1, 1, 0, 0, 1, 1, 0, 0, 0],
    ],
  },
  sun: {
    name: 'sun',
    width: 12,
    height: 12,
    palette: ['transparent', '#FACC15', '#F59E0B', '#FEF08A', '#EA580C'],
    scale: 2.8,
    grid: [
      [0, 0, 0, 0, 0, 4, 4, 0, 0, 0, 0, 0],
      [0, 4, 0, 0, 0, 4, 4, 0, 0, 0, 4, 0],
      [0, 0, 0, 1, 1, 1, 1, 1, 1, 0, 0, 0],
      [0, 0, 1, 3, 3, 1, 1, 1, 1, 2, 0, 0],
      [0, 0, 1, 3, 1, 1, 1, 1, 1, 2, 0, 0],
      [4, 4, 1, 1, 1, 1, 1, 1, 1, 2, 4, 4],
      [4, 4, 1, 1, 1, 1, 1, 1, 1, 2, 4, 4],
      [0, 0, 1, 1, 1, 1, 1, 1, 2, 2, 0, 0],
      [0, 0, 1, 2, 2, 2, 2, 2, 2, 2, 0, 0],
      [0, 0, 0, 1, 1, 1, 1, 1, 1, 0, 0, 0],
      [0, 4, 0, 0, 0, 4, 4, 0, 0, 0, 4, 0],
      [0, 0, 0, 0, 0, 4, 4, 0, 0, 0, 0, 0],
    ],
  },
  crown: {
    name: 'crown',
    width: 11,
    height: 8,
    palette: ['transparent', '#FBBF24', '#D97706', '#EF4444', '#3B82F6'],
    scale: 2.8,
    grid: [
      [1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1],
      [1, 1, 0, 0, 1, 1, 1, 0, 0, 1, 1],
      [1, 1, 1, 0, 1, 1, 1, 0, 1, 1, 1],
      [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
      [1, 3, 1, 1, 4, 1, 4, 1, 1, 3, 1],
      [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
      [2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2],
      [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
    ],
  },
  hazard: {
    name: 'hazard',
    width: 12,
    height: 11,
    palette: ['transparent', '#FACC15', '#000000', '#FDE047', '#EAB308'],
    scale: 2.8,
    grid: [
      [0, 0, 0, 0, 0, 1, 1, 0, 0, 0, 0, 0],
      [0, 0, 0, 0, 1, 3, 3, 1, 0, 0, 0, 0],
      [0, 0, 0, 1, 1, 2, 2, 1, 1, 0, 0, 0],
      [0, 0, 1, 1, 3, 2, 2, 3, 1, 1, 0, 0],
      [0, 1, 1, 2, 2, 1, 1, 2, 2, 1, 1, 0],
      [0, 1, 3, 2, 2, 1, 1, 2, 2, 3, 1, 0],
      [1, 1, 1, 1, 1, 2, 2, 1, 1, 1, 1, 1],
      [1, 2, 2, 2, 2, 1, 1, 2, 2, 2, 2, 1],
      [1, 2, 2, 2, 2, 0, 0, 2, 2, 2, 2, 1],
      [1, 1, 1, 1, 1, 2, 2, 1, 1, 1, 1, 1],
      [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
    ],
  },
  boot: {
    name: 'boot',
    width: 10,
    height: 10,
    palette: ['transparent', '#92400E', '#78350F', '#B45309', '#FDE68A'],
    scale: 2.6,
    grid: [
      [0, 0, 3, 3, 3, 3, 0, 0, 0, 0],
      [0, 0, 1, 1, 1, 1, 0, 0, 0, 0],
      [0, 0, 1, 1, 1, 1, 0, 0, 0, 0],
      [0, 0, 1, 1, 1, 1, 0, 0, 0, 0],
      [0, 0, 1, 1, 1, 1, 1, 1, 0, 0],
      [0, 0, 1, 1, 1, 1, 1, 1, 1, 0],
      [0, 1, 1, 1, 1, 1, 1, 1, 1, 1],
      [1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
      [2, 2, 2, 2, 2, 2, 2, 2, 2, 2],
      [0, 2, 2, 0, 0, 0, 2, 2, 2, 0],
    ],
  },
  gem: {
    name: 'gem',
    width: 9,
    height: 9,
    palette: ['transparent', '#06B6D4', '#0891B2', '#CFFAFE', '#0E7490'],
    scale: 3,
    grid: [
      [0, 0, 1, 1, 1, 1, 1, 0, 0],
      [0, 1, 3, 3, 1, 1, 2, 1, 0],
      [1, 3, 3, 3, 1, 2, 2, 2, 1],
      [1, 1, 1, 1, 1, 1, 1, 1, 1],
      [0, 1, 1, 1, 1, 1, 2, 1, 0],
      [0, 0, 1, 1, 1, 2, 1, 0, 0],
      [0, 0, 0, 1, 2, 1, 0, 0, 0],
      [0, 0, 0, 0, 1, 0, 0, 0, 0],
      [0, 0, 0, 0, 0, 0, 0, 0, 0],
    ],
  },
  heart: {
    name: 'heart',
    width: 10,
    height: 9,
    palette: ['transparent', '#EF4444', '#DC2626', '#FFFFFF', '#7F1D1D'],
    scale: 2.8,
    grid: [
      [0, 1, 1, 0, 0, 0, 1, 1, 0, 0],
      [1, 3, 1, 1, 0, 1, 1, 1, 1, 0],
      [1, 1, 1, 1, 1, 1, 1, 2, 1, 0],
      [1, 1, 1, 1, 1, 1, 2, 2, 1, 0],
      [0, 1, 1, 1, 1, 2, 2, 1, 0, 0],
      [0, 0, 1, 1, 2, 2, 1, 0, 0, 0],
      [0, 0, 0, 1, 2, 1, 0, 0, 0, 0],
      [0, 0, 0, 0, 4, 0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    ],
  },
  coin: {
    name: 'coin',
    width: 9,
    height: 9,
    palette: ['transparent', '#FBBF24', '#D97706', '#FEF3C7', '#78350F'],
    scale: 2.8,
    grid: [
      [0, 0, 1, 1, 1, 1, 1, 0, 0],
      [0, 1, 3, 3, 1, 1, 2, 1, 0],
      [1, 3, 1, 1, 1, 1, 1, 2, 1],
      [1, 3, 1, 3, 1, 1, 1, 2, 1],
      [1, 1, 1, 1, 1, 1, 1, 2, 1],
      [1, 1, 1, 1, 1, 1, 1, 2, 1],
      [1, 2, 1, 1, 1, 1, 2, 2, 1],
      [0, 1, 2, 2, 2, 2, 2, 1, 0],
      [0, 0, 1, 1, 1, 1, 1, 0, 0],
    ],
  },
  ruby: {
    name: 'ruby',
    width: 9,
    height: 9,
    palette: ['transparent', '#F43F5E', '#BE123C', '#FFE4E6', '#881337'],
    scale: 2.8,
    grid: [
      [0, 0, 1, 1, 1, 1, 1, 0, 0],
      [0, 1, 3, 3, 1, 1, 2, 1, 0],
      [1, 3, 3, 3, 1, 2, 2, 2, 1],
      [1, 1, 1, 1, 1, 1, 1, 1, 1],
      [0, 1, 1, 1, 1, 1, 2, 1, 0],
      [0, 0, 1, 1, 1, 2, 1, 0, 0],
      [0, 0, 0, 1, 2, 1, 0, 0, 0],
      [0, 0, 0, 0, 4, 0, 0, 0, 0],
      [0, 0, 0, 0, 0, 0, 0, 0, 0],
    ],
  },
};

interface FloatingItem {
  id: number;
  spriteKey: string;
  x: number;
  y: number;
  vx: number;
  vy: number;
  angle: number;
  vAngle: number;
  baseY: number;
  floatPhase: number;
  floatSpeed: number;
  scale: number;
  spinActive: number;
}

interface StarParticle {
  x: number;
  y: number;
  size: number;
  opacity: number;
  twinkleSpeed: number;
  twinklePhase: number;
  color: string;
}

interface ClickSparkle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  life: number;
  maxLife: number;
  color: string;
  size: number;
}

interface CodeGlyph {
  text: string;
  x: number;
  y: number;
  vx: number;
  vy: number;
  floatPhase: number;
  floatSpeed: number;
  color: string;
  fontSize: number;
  baseOpacity: number;
}

export function CosmicInteractiveBg() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animId: number;
    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    // Reduced motion preference
    const prefersReducedMotion =
      typeof window !== 'undefined' &&
      window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    // Mouse coordinates & interactions
    let mouseX = -1000;
    let mouseY = -1000;

    // Responsive resize
    const handleResize = () => {
      if (!canvas) return;
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    };
    window.addEventListener('resize', handleResize);

    // Mouse listeners (disabled on touch devices for performance)
    const handleMouseMove = (e: MouseEvent) => {
      const rect = canvas.getBoundingClientRect();
      mouseX = e.clientX - rect.left;
      mouseY = e.clientY - rect.top;
    };

    const handleMouseLeave = () => {
      mouseX = -1000;
      mouseY = -1000;
    };

    // Click sparkle particles
    const clickSparkles: ClickSparkle[] = [];

    const handleClick = (e: MouseEvent) => {
      const rect = canvas.getBoundingClientRect();
      const clickX = e.clientX - rect.left;
      const clickY = e.clientY - rect.top;

      // Burst of sparkles
      const sparkleColors = ['#FBBF24', '#21D4FD', '#10B981', '#A78BFA', '#FF6B79', '#FFFFFF'];
      for (let i = 0; i < 18; i++) {
        const angle = Math.random() * Math.PI * 2;
        const speed = 1.5 + Math.random() * 3.5;
        clickSparkles.push({
          x: clickX,
          y: clickY,
          vx: Math.cos(angle) * speed,
          vy: Math.sin(angle) * speed,
          life: 45,
          maxLife: 45,
          color: sparkleColors[Math.floor(Math.random() * sparkleColors.length)],
          size: 2 + Math.random() * 3,
        });
      }

      // Check if user clicked close to a floating item -> make it do a rapid 360 spin!
      items.forEach((item) => {
        const dx = item.x - clickX;
        const dy = item.y - clickY;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < 60) {
          item.spinActive = 30; // 30 frames of fast spin
          item.vy -= 2;
        } else if (dist < 180) {
          item.vx += (dx / dist) * 3;
          item.vy += (dy / dist) * 3;
        }
      });
    };

    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mouseleave', handleMouseLeave);
    canvas.addEventListener('click', handleClick);

    // Initialize twinkling stars (multi-layer depth)
    const stars: StarParticle[] = [];
    const numStars = Math.min(120, Math.floor((width * height) / 10000));
    for (let i = 0; i < numStars; i++) {
      stars.push({
        x: Math.random() * width,
        y: Math.random() * height,
        size: Math.random() < 0.2 ? 3 : Math.random() < 0.5 ? 2 : 1.5,
        opacity: 0.2 + Math.random() * 0.75,
        twinkleSpeed: 0.015 + Math.random() * 0.035,
        twinklePhase: Math.random() * Math.PI * 2,
        color:
          Math.random() < 0.2
            ? '#21D4FD'
            : Math.random() < 0.35
            ? '#FFC83D'
            : Math.random() < 0.5
            ? '#A78BFA'
            : '#FFFFFF',
      });
    }

    // Initialize Floating Collectible Sprites placed towards outer edges
    const items: FloatingItem[] = [
      // Left side perimeter
      { id: 1, spriteKey: 'chest', x: width * 0.12, y: height * 0.18, vx: 0.08, vy: -0.05, angle: 0.15, vAngle: 0.002, baseY: height * 0.18, floatPhase: 0, floatSpeed: 0.018, scale: 1.05, spinActive: 0 },
      { id: 2, spriteKey: 'crown', x: width * 0.08, y: height * 0.38, vx: -0.06, vy: 0.04, angle: -0.1, vAngle: -0.002, baseY: height * 0.38, floatPhase: 1, floatSpeed: 0.015, scale: 0.9, spinActive: 0 },
      { id: 3, spriteKey: 'hazard', x: width * 0.18, y: height * 0.52, vx: 0.05, vy: 0.06, angle: 0.25, vAngle: 0.003, baseY: height * 0.52, floatPhase: 2, floatSpeed: 0.018, scale: 0.85, spinActive: 0 },
      { id: 4, spriteKey: 'sword', x: width * 0.06, y: height * 0.72, vx: -0.04, vy: 0.05, angle: 0.7, vAngle: 0.002, baseY: height * 0.72, floatPhase: 3, floatSpeed: 0.02, scale: 1.0, spinActive: 0 },
      { id: 5, spriteKey: 'coin', x: width * 0.22, y: height * 0.82, vx: 0.07, vy: -0.04, angle: -0.15, vAngle: 0.001, baseY: height * 0.82, floatPhase: 4, floatSpeed: 0.017, scale: 1.0, spinActive: 0 },
      { id: 6, spriteKey: 'boot', x: width * 0.15, y: height * 0.9, vx: 0.06, vy: -0.03, angle: 0.1, vAngle: 0.002, baseY: height * 0.9, floatPhase: 4.5, floatSpeed: 0.019, scale: 0.9, spinActive: 0 },

      // Right side perimeter
      { id: 7, spriteKey: 'trophy', x: width * 0.86, y: height * 0.18, vx: -0.07, vy: 0.04, angle: -0.05, vAngle: 0.001, baseY: height * 0.18, floatPhase: 2.2, floatSpeed: 0.019, scale: 1.1, spinActive: 0 },
      { id: 8, spriteKey: 'rocket', x: width * 0.9, y: height * 0.36, vx: 0.08, vy: -0.06, angle: -0.2, vAngle: -0.003, baseY: height * 0.36, floatPhase: 0.5, floatSpeed: 0.022, scale: 1.05, spinActive: 0 },
      { id: 9, spriteKey: 'gem', x: width * 0.82, y: height * 0.54, vx: 0.07, vy: 0.06, angle: 0.35, vAngle: 0.004, baseY: height * 0.54, floatPhase: 2.8, floatSpeed: 0.024, scale: 0.95, spinActive: 0 },
      { id: 10, spriteKey: 'sun', x: width * 0.88, y: height * 0.7, vx: -0.06, vy: 0.05, angle: 0.1, vAngle: 0.005, baseY: height * 0.7, floatPhase: 3.2, floatSpeed: 0.02, scale: 0.95, spinActive: 0 },
      { id: 11, spriteKey: 'spaceship', x: width * 0.78, y: height * 0.84, vx: 0.07, vy: 0.04, angle: -0.25, vAngle: -0.002, baseY: height * 0.84, floatPhase: 4.1, floatSpeed: 0.016, scale: 1.05, spinActive: 0 },
      { id: 12, spriteKey: 'heart', x: width * 0.92, y: height * 0.86, vx: -0.05, vy: -0.05, angle: 0.12, vAngle: 0.003, baseY: height * 0.86, floatPhase: 1.8, floatSpeed: 0.021, scale: 1.0, spinActive: 0 },
      { id: 13, spriteKey: 'ruby', x: width * 0.84, y: height * 0.94, vx: 0.05, vy: -0.04, angle: 0.2, vAngle: 0.002, baseY: height * 0.94, floatPhase: 2.5, floatSpeed: 0.02, scale: 0.95, spinActive: 0 },
    ];

    // Floating Programming Glyphs & Symbols ({ }, < />, 01, [ ], =>, λ)
    const codeGlyphs: CodeGlyph[] = [
      { text: '{ }', x: width * 0.25, y: height * 0.2, vx: 0.04, vy: -0.03, floatPhase: 0.5, floatSpeed: 0.016, color: '#21D4FD', fontSize: 18, baseOpacity: 0.4 },
      { text: '< />', x: width * 0.76, y: height * 0.22, vx: -0.05, vy: 0.03, floatPhase: 1.8, floatSpeed: 0.018, color: '#A78BFA', fontSize: 20, baseOpacity: 0.45 },
      { text: '01', x: width * 0.05, y: height * 0.52, vx: 0.03, vy: -0.02, floatPhase: 2.4, floatSpeed: 0.014, color: '#36E0B0', fontSize: 16, baseOpacity: 0.35 },
      { text: '[ ]', x: width * 0.94, y: height * 0.48, vx: -0.03, vy: 0.04, floatPhase: 3.1, floatSpeed: 0.017, color: '#FFC83D', fontSize: 18, baseOpacity: 0.38 },
      { text: '=>', x: width * 0.2, y: height * 0.74, vx: 0.05, vy: 0.03, floatPhase: 4.0, floatSpeed: 0.02, color: '#7257FF', fontSize: 20, baseOpacity: 0.42 },
      { text: 'λ', x: width * 0.8, y: height * 0.74, vx: -0.04, vy: -0.04, floatPhase: 1.2, floatSpeed: 0.015, color: '#21D4FD', fontSize: 22, baseOpacity: 0.4 },
      { text: 'print()', x: width * 0.14, y: height * 0.34, vx: 0.03, vy: -0.02, floatPhase: 2.8, floatSpeed: 0.012, color: '#36E0B0', fontSize: 14, baseOpacity: 0.32 },
      { text: 'return', x: width * 0.84, y: height * 0.38, vx: -0.03, vy: 0.03, floatPhase: 3.5, floatSpeed: 0.014, color: '#FF6B79', fontSize: 14, baseOpacity: 0.3 },
    ];

    // Helper to draw a pixel sprite onto canvas
    const drawSprite = (
      sprite: PixelSprite,
      cx: number,
      cy: number,
      angle: number,
      scaleMultiplier: number
    ) => {
      const s = sprite.scale * scaleMultiplier;
      const totalW = sprite.width * s;
      const totalH = sprite.height * s;

      ctx.save();
      ctx.translate(cx, cy);
      ctx.rotate(angle);

      ctx.imageSmoothingEnabled = false;
      const startX = -totalW / 2;
      const startY = -totalH / 2;

      for (let r = 0; r < sprite.height; r++) {
        for (let c = 0; c < sprite.width; c++) {
          const colorIdx = sprite.grid[r][c];
          if (colorIdx > 0 && sprite.palette[colorIdx]) {
            ctx.fillStyle = sprite.palette[colorIdx];
            ctx.fillRect(startX + c * s, startY + r * s, s, s);
          }
        }
      }

      ctx.restore();
    };

    // 3D Mouse Parallax State
    let mouseParallaxX = 0;
    let mouseParallaxY = 0;

    // UPGRADED RETRO PERSPECTIVE GRID FLOOR (3D Parallax Perspective, without bottom boxes)
    const drawBottomGrid = () => {
      const horizonY = height * 0.82 + mouseParallaxY * 15;
      const floorH = height - horizonY;
      if (floorH <= 0) return;

      ctx.save();

      // 1. Soft Horizon Glow Line (Cyan-Violet)
      const glowGrad = ctx.createLinearGradient(0, horizonY - 4, 0, horizonY + 12);
      glowGrad.addColorStop(0, 'rgba(114, 87, 255, 0)');
      glowGrad.addColorStop(0.3, 'rgba(33, 212, 253, 0.4)');
      glowGrad.addColorStop(0.7, 'rgba(114, 87, 255, 0.25)');
      glowGrad.addColorStop(1, 'rgba(114, 87, 255, 0)');
      ctx.fillStyle = glowGrad;
      ctx.fillRect(0, horizonY - 4, width, 16);

      // Fine horizon baseline
      ctx.strokeStyle = 'rgba(33, 212, 253, 0.6)';
      ctx.lineWidth = 1.2;
      ctx.beginPath();
      ctx.moveTo(0, horizonY);
      ctx.lineTo(width, horizonY);
      ctx.stroke();

      // 2. Finer Horizontal Perspective Lines with smooth distance fade
      const numHoriz = 10;
      for (let i = 1; i <= numHoriz; i++) {
        const factor = i / numHoriz;
        const y = horizonY + floorH * Math.pow(factor, 1.9);
        const alpha = 0.06 + 0.32 * factor;

        ctx.strokeStyle = `rgba(114, 87, 255, ${alpha})`;
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.moveTo(0, y);
        ctx.lineTo(width, y);
        ctx.stroke();
      }

      // 3. Finer Receding Perspective Lines spreading toward the viewer with 3D tilt
      const vanishingX = width * 0.5 + mouseParallaxX * 60;
      const numVert = 26;
      for (let i = -numVert; i <= numVert; i++) {
        const factor = i / numVert;
        const bottomX = width * 0.5 + factor * (width * 0.85) + mouseParallaxX * 25;
        const topX = vanishingX + i * 16;
        const centerDistance = Math.abs(factor);
        const alpha = 0.08 + 0.25 * (1 - centerDistance * 0.6);

        ctx.strokeStyle = `rgba(33, 212, 253, ${Math.max(0.04, alpha)})`;
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.moveTo(topX, horizonY);
        ctx.lineTo(bottomX, height);
        ctx.stroke();
      }

      ctx.restore();
    };

    // Draw small stepped pixel terrain platforms near bottom corners
    const drawPixelPlatforms = () => {
      ctx.save();
      ctx.imageSmoothingEnabled = false;

      // Bottom-Left Floating Platform
      const blX = 30 + mouseParallaxX * 8;
      const blY = height * 0.78 + mouseParallaxY * 6;
      ctx.fillStyle = 'rgba(26, 32, 53, 0.75)';
      ctx.fillRect(blX, blY, 90, 16);
      ctx.fillRect(blX + 12, blY + 16, 66, 12);
      ctx.fillStyle = 'rgba(54, 224, 176, 0.8)'; // Neon Mint Edge
      ctx.fillRect(blX, blY, 90, 3);
      ctx.fillStyle = 'rgba(33, 212, 253, 0.4)';
      ctx.fillRect(blX, blY + 3, 90, 2);

      // Bottom-Right Floating Platform
      const brX = width - 120 + mouseParallaxX * 8;
      const brY = height * 0.8 + mouseParallaxY * 6;
      ctx.fillStyle = 'rgba(26, 32, 53, 0.75)';
      ctx.fillRect(brX, brY, 85, 16);
      ctx.fillRect(brX + 10, brY + 16, 60, 12);
      ctx.fillStyle = 'rgba(114, 87, 255, 0.85)'; // Neon Violet Edge
      ctx.fillRect(brX, brY, 85, 3);
      ctx.fillStyle = 'rgba(255, 200, 61, 0.4)';
      ctx.fillRect(brX, brY + 3, 85, 2);

      ctx.restore();
    };

    // Animation Loop
    let tick = 0;
    const render = () => {
      tick++;

      // Update smooth 3D mouse parallax tilt
      if (mouseX > 0 && mouseY > 0 && !prefersReducedMotion) {
        const targetPX = (mouseX - width * 0.5) / (width * 0.5);
        const targetPY = (mouseY - height * 0.5) / (height * 0.5);
        mouseParallaxX += (targetPX - mouseParallaxX) * 0.05;
        mouseParallaxY += (targetPY - mouseParallaxY) * 0.05;
      } else {
        mouseParallaxX += (0 - mouseParallaxX) * 0.05;
        mouseParallaxY += (0 - mouseParallaxY) * 0.05;
      }

      // 1. Rich Deep Midnight Foundation with Subtle Gradients (#080B14, #10172A)
      ctx.fillStyle = '#080B14';
      ctx.fillRect(0, 0, width, height);

      // Atmospheric Nebula Light with 3D Parallax offset
      const nebulaLeft = ctx.createRadialGradient(
        width * 0.15 - mouseParallaxX * 25,
        height * 0.25 - mouseParallaxY * 20,
        40,
        width * 0.15 - mouseParallaxX * 25,
        height * 0.25 - mouseParallaxY * 20,
        width * 0.55
      );
      nebulaLeft.addColorStop(0, 'rgba(33, 212, 253, 0.08)');
      nebulaLeft.addColorStop(0.6, 'rgba(114, 87, 255, 0.04)');
      nebulaLeft.addColorStop(1, 'rgba(8, 11, 20, 0)');
      ctx.fillStyle = nebulaLeft;
      ctx.fillRect(0, 0, width, height);

      const nebulaRight = ctx.createRadialGradient(
        width * 0.85 - mouseParallaxX * 25,
        height * 0.35 - mouseParallaxY * 20,
        50,
        width * 0.85 - mouseParallaxX * 25,
        height * 0.35 - mouseParallaxY * 20,
        width * 0.55
      );
      nebulaRight.addColorStop(0, 'rgba(114, 87, 255, 0.1)');
      nebulaRight.addColorStop(0.5, 'rgba(255, 200, 61, 0.03)');
      nebulaRight.addColorStop(1, 'rgba(8, 11, 20, 0)');
      ctx.fillStyle = nebulaRight;
      ctx.fillRect(0, 0, width, height);

      // 2. Draw Upgraded Perspective Grid Floor with 3D Parallax
      drawBottomGrid();

      // 3. Draw Corner Platform Elements
      drawPixelPlatforms();

      // 4. Draw Twinkling Stars with 3D parallax depth
      stars.forEach((star) => {
        if (!prefersReducedMotion) {
          star.twinklePhase += star.twinkleSpeed;
        }
        const currentOpacity =
          star.opacity * (0.65 + 0.35 * Math.sin(star.twinklePhase));

        let px = star.x + (star.size * 1.5) * mouseParallaxX * 10;
        let py = star.y + (star.size * 1.5) * mouseParallaxY * 10;

        ctx.fillStyle = star.color;
        ctx.globalAlpha = Math.max(0.12, Math.min(1, currentOpacity));

        if (star.size > 2) {
          ctx.fillRect(px - 1, py, 3, 1);
          ctx.fillRect(px, py - 1, 1, 3);
        } else {
          ctx.fillRect(px, py, star.size, star.size);
        }
      });
      ctx.globalAlpha = 1.0;

      // 5. Draw Floating Programming Glyphs
      codeGlyphs.forEach((glyph) => {
        if (!prefersReducedMotion) {
          glyph.floatPhase += glyph.floatSpeed;
          glyph.x += glyph.vx;
          glyph.y += glyph.vy;

          if (glyph.x < 30 || glyph.x > width - 40) glyph.vx *= -1;
          if (glyph.y < 30 || glyph.y > height - 60) glyph.vy *= -1;
        }

        const bobbleY = Math.sin(glyph.floatPhase) * 6;
        const currentOpacity =
          glyph.baseOpacity * (0.8 + 0.2 * Math.cos(glyph.floatPhase));

        ctx.save();
        ctx.font = `bold ${glyph.fontSize}px "JetBrains Mono", monospace`;
        ctx.fillStyle = glyph.color;
        ctx.globalAlpha = currentOpacity;
        ctx.shadowColor = glyph.color;
        ctx.shadowBlur = 8;
        ctx.fillText(glyph.text, glyph.x, glyph.y + bobbleY);
        ctx.restore();
      });
      ctx.globalAlpha = 1.0;

      // 6. Draw Click Sparkles
      for (let i = clickSparkles.length - 1; i >= 0; i--) {
        const sp = clickSparkles[i];
        sp.x += sp.vx;
        sp.y += sp.vy;
        sp.vx *= 0.96;
        sp.vy *= 0.96;
        sp.life--;

        const alpha = sp.life / sp.maxLife;
        ctx.fillStyle = sp.color;
        ctx.globalAlpha = alpha;
        ctx.fillRect(sp.x - sp.size / 2, sp.y - sp.size / 2, sp.size, sp.size);

        if (sp.life <= 0) {
          clickSparkles.splice(i, 1);
        }
      }
      ctx.globalAlpha = 1.0;

      // 7. Update & Draw Floating Pixel Collectible Sprites with Physics
      items.forEach((item) => {
        const sprite = PIXEL_SPRITES[item.spriteKey];
        if (!sprite) return;

        if (!prefersReducedMotion) {
          item.floatPhase += item.floatSpeed;
          item.x += item.vx;
          item.y += item.vy;
          item.vx *= 0.985;
          item.vy *= 0.985;

          if (item.spinActive > 0) {
            item.angle += 0.35;
            item.spinActive--;
          } else {
            item.angle += item.vAngle;
          }

          // Mouse repulsion physics
          if (mouseX > 0 && mouseY > 0) {
            const dx = item.x - mouseX;
            const dy = item.y - mouseY;
            const dist = Math.sqrt(dx * dx + dy * dy);
            const repelRadius = 130;

            if (dist < repelRadius && dist > 1) {
              const force = (1 - dist / repelRadius) * 0.65;
              item.vx += (dx / dist) * force;
              item.vy += (dy / dist) * force;
            }
          }
        }

        // Screen edge reflection
        const pad = 24;
        if (item.x < pad) { item.x = pad; item.vx = Math.abs(item.vx) * 0.8 + 0.1; }
        if (item.x > width - pad) { item.x = width - pad; item.vx = -Math.abs(item.vx) * 0.8 - 0.1; }
        if (item.y < pad) { item.y = pad; item.vy = Math.abs(item.vy) * 0.8 + 0.1; }
        if (item.y > height - pad) { item.y = height - pad; item.vy = -Math.abs(item.vy) * 0.8 - 0.1; }

        // Center card clearance avoidance (pushes sprites gently toward edges)
        const centerX = width * 0.5;
        const centerY = height * 0.45;
        const clearW = Math.min(width * 0.42, 340);
        const clearH = Math.min(height * 0.48, 380);

        if (
          Math.abs(item.x - centerX) < clearW &&
          Math.abs(item.y - centerY) < clearH
        ) {
          const pushX = item.x > centerX ? 0.3 : -0.3;
          item.vx += pushX;
        }

        const bobbleY = Math.sin(item.floatPhase) * 10;
        const extraScale = item.spinActive > 0 ? 1.25 : 1.0;
        drawSprite(sprite, item.x, item.y + bobbleY, item.angle, item.scale * extraScale);
      });

      animId = requestAnimationFrame(render);
    };

    render();

    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseleave', handleMouseLeave);
      canvas.removeEventListener('click', handleClick);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      aria-hidden="true"
      className="fixed inset-0 w-full h-full pointer-events-auto z-0"
      style={{
        background: '#080B14',
      }}
    />
  );
}
