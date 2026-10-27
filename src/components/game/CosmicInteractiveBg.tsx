// Interactive Cosmic Space Background with Floating Pixel Items
// Recreates the CodeDex deep space aesthetic with zero-gravity floating pixel items,
// perspective floor grid, twinkling stars, and mouse repulsion/click physics.
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
  crosshair: {
    name: 'crosshair',
    width: 9,
    height: 9,
    palette: ['transparent', '#94A3B8', '#64748B', '#FFFFFF'],
    scale: 2.6,
    grid: [
      [0, 0, 0, 0, 3, 0, 0, 0, 0],
      [0, 0, 0, 0, 1, 0, 0, 0, 0],
      [0, 0, 0, 0, 1, 0, 0, 0, 0],
      [0, 0, 0, 0, 1, 0, 0, 0, 0],
      [3, 1, 1, 1, 0, 1, 1, 1, 3],
      [0, 0, 0, 0, 1, 0, 0, 0, 0],
      [0, 0, 0, 0, 1, 0, 0, 0, 0],
      [0, 0, 0, 0, 1, 0, 0, 0, 0],
      [0, 0, 0, 0, 3, 0, 0, 0, 0],
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
  spinActive: number; // >0 if user clicked on it
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

    // Mouse coordinates & interactions
    let mouseX = -1000;
    let mouseY = -1000;
    let isMouseDown = false;

    // Responsive resize
    const handleResize = () => {
      if (!canvas) return;
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    };
    window.addEventListener('resize', handleResize);

    // Mouse listeners
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
      const sparkleColors = ['#FBBF24', '#38BDF8', '#10B981', '#A78BFA', '#EF4444', '#FFFFFF'];
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
          // Push away slightly
          item.vx += (dx / dist) * 3;
          item.vy += (dy / dist) * 3;
        }
      });
    };

    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mouseleave', handleMouseLeave);
    canvas.addEventListener('click', handleClick);

    // Initialize twinkling stars
    const stars: StarParticle[] = [];
    const numStars = Math.min(100, Math.floor((width * height) / 12000));
    for (let i = 0; i < numStars; i++) {
      stars.push({
        x: Math.random() * width,
        y: Math.random() * height,
        size: Math.random() < 0.2 ? 3 : Math.random() < 0.5 ? 2 : 1.5,
        opacity: 0.2 + Math.random() * 0.7,
        twinkleSpeed: 0.02 + Math.random() * 0.04,
        twinklePhase: Math.random() * Math.PI * 2,
        color: Math.random() < 0.15 ? '#38BDF8' : Math.random() < 0.3 ? '#FBBF24' : '#FFFFFF',
      });
    }

    // Initialize floating items matching user screenshot distribution
    const spriteKeys = Object.keys(PIXEL_SPRITES);
    const items: FloatingItem[] = [
      // Top Left: chest, sword, crown
      { id: 1, spriteKey: 'chest', x: width * 0.36, y: height * 0.14, vx: 0.12, vy: -0.06, angle: 0.2, vAngle: 0.003, baseY: height * 0.14, floatPhase: 0, floatSpeed: 0.02, scale: 1.1, spinActive: 0 },
      { id: 2, spriteKey: 'crown', x: width * 0.15, y: height * 0.16, vx: -0.08, vy: 0.04, angle: -0.1, vAngle: -0.002, baseY: height * 0.16, floatPhase: 1, floatSpeed: 0.015, scale: 0.9, spinActive: 0 },
      { id: 3, spriteKey: 'hazard', x: width * 0.1, y: height * 0.24, vx: 0.06, vy: 0.08, angle: 0.3, vAngle: 0.004, baseY: height * 0.24, floatPhase: 2, floatSpeed: 0.018, scale: 0.9, spinActive: 0 },
      { id: 4, spriteKey: 'sword', x: width * 0.04, y: height * 0.82, vx: -0.04, vy: 0.05, angle: 0.8, vAngle: 0.002, baseY: height * 0.82, floatPhase: 3, floatSpeed: 0.022, scale: 1.0, spinActive: 0 },
      { id: 5, spriteKey: 'boot', x: width * 0.16, y: height * 0.68, vx: 0.07, vy: -0.05, angle: -0.15, vAngle: 0.001, baseY: height * 0.68, floatPhase: 4, floatSpeed: 0.017, scale: 0.95, spinActive: 0 },
      // Center / Upper: crosshair, trophy
      { id: 6, spriteKey: 'trophy', x: width * 0.36, y: height * 0.52, vx: -0.1, vy: 0.04, angle: -0.05, vAngle: 0.001, baseY: height * 0.52, floatPhase: 2.5, floatSpeed: 0.019, scale: 1.15, spinActive: 0 },
      { id: 7, spriteKey: 'crosshair', x: width * 0.55, y: height * 0.11, vx: 0.05, vy: -0.06, angle: 0, vAngle: 0.005, baseY: height * 0.11, floatPhase: 1.5, floatSpeed: 0.014, scale: 1.0, spinActive: 0 },
      // Center-Right: rocket, sun, gem, beast
      { id: 8, spriteKey: 'rocket', x: width * 0.69, y: height * 0.41, vx: 0.09, vy: -0.07, angle: -0.2, vAngle: -0.003, baseY: height * 0.41, floatPhase: 0.5, floatSpeed: 0.024, scale: 1.05, spinActive: 0 },
      { id: 9, spriteKey: 'sun', x: width * 0.71, y: height * 0.58, vx: -0.06, vy: 0.06, angle: 0.1, vAngle: 0.006, baseY: height * 0.58, floatPhase: 3.2, floatSpeed: 0.02, scale: 1.0, spinActive: 0 },
      { id: 10, spriteKey: 'spaceship', x: width * 0.55, y: height * 0.81, vx: 0.08, vy: 0.04, angle: -0.3, vAngle: -0.002, baseY: height * 0.81, floatPhase: 4.1, floatSpeed: 0.016, scale: 1.1, spinActive: 0 },
      { id: 11, spriteKey: 'beast', x: width * 0.7, y: height * 0.87, vx: -0.05, vy: -0.05, angle: 0.15, vAngle: 0.003, baseY: height * 0.87, floatPhase: 1.8, floatSpeed: 0.021, scale: 1.1, spinActive: 0 },
      { id: 12, spriteKey: 'gem', x: width * 0.75, y: height * 0.34, vx: 0.08, vy: 0.07, angle: 0.4, vAngle: 0.004, baseY: height * 0.34, floatPhase: 2.8, floatSpeed: 0.025, scale: 0.95, spinActive: 0 },
      { id: 13, spriteKey: 'hazard', x: width * 0.96, y: height * 0.74, vx: -0.07, vy: 0.05, angle: -0.25, vAngle: -0.002, baseY: height * 0.74, floatPhase: 0.8, floatSpeed: 0.015, scale: 0.9, spinActive: 0 },
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

      // Draw pixels crisp without blur
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

    // Draw the subtle retro bottom perspective grid
    const drawBottomGrid = () => {
      const horizonY = height * 0.88;
      const floorH = height - horizonY;
      if (floorH <= 0) return;

      ctx.save();
      ctx.strokeStyle = 'rgba(108, 92, 231, 0.14)';
      ctx.lineWidth = 1;

      // Horizontal lines
      const numHoriz = 5;
      for (let i = 0; i <= numHoriz; i++) {
        const y = horizonY + (floorH * (i * i)) / (numHoriz * numHoriz);
        ctx.beginPath();
        ctx.moveTo(0, y);
        ctx.lineTo(width, y);
        ctx.stroke();
      }

      // Receding perspective lines
      const vanishingX = width * 0.5;
      const numVert = 18;
      for (let i = -numVert; i <= numVert; i++) {
        const bottomX = vanishingX + (i * width) / (numVert * 0.8);
        ctx.beginPath();
        ctx.moveTo(vanishingX + i * 15, horizonY);
        ctx.lineTo(bottomX, height);
        ctx.stroke();
      }

      // Colored neon bounding boxes along the bottom (from the user reference image)
      const boxW = Math.min(180, width * 0.22);
      const boxH = 40;
      const boxY = height - boxH - 8;
      const spacing = 16;
      const startBoxX = width * 0.5 - (boxW * 1.5 + spacing);

      // Box 1: Yellow
      ctx.strokeStyle = 'rgba(251, 191, 36, 0.4)';
      ctx.lineWidth = 1.5;
      ctx.strokeRect(startBoxX, boxY, boxW, boxH);

      // Box 2: Green
      ctx.strokeStyle = 'rgba(16, 185, 129, 0.4)';
      ctx.strokeRect(startBoxX + boxW + spacing, boxY, boxW, boxH);

      // Box 3: Purple
      ctx.strokeStyle = 'rgba(167, 139, 250, 0.4)';
      ctx.strokeRect(startBoxX + (boxW + spacing) * 2, boxY, boxW, boxH);

      ctx.restore();
    };

    // Animation loop
    let tick = 0;
    const render = () => {
      tick++;

      // 1. Clear background & draw celestial vignette
      ctx.fillStyle = '#090A0F';
      ctx.fillRect(0, 0, width, height);

      // Center subtle nebula glow (emerald + violet)
      const grad = ctx.createRadialGradient(
        width * 0.5,
        height * 0.45,
        50,
        width * 0.5,
        height * 0.45,
        Math.max(width, height) * 0.7
      );
      grad.addColorStop(0, 'rgba(16, 36, 42, 0.45)');
      grad.addColorStop(0.5, 'rgba(14, 18, 28, 0.7)');
      grad.addColorStop(1, 'rgba(8, 9, 13, 0.98)');
      ctx.fillStyle = grad;
      ctx.fillRect(0, 0, width, height);

      // 2. Draw retro bottom grid
      drawBottomGrid();

      // 3. Draw & twinkle stars with subtle parallax
      stars.forEach((star) => {
        star.twinklePhase += star.twinkleSpeed;
        const currentOpacity =
          star.opacity * (0.6 + 0.4 * Math.sin(star.twinklePhase));

        // Slight parallax offset based on mouse
        let px = star.x;
        let py = star.y;
        if (mouseX > 0) {
          px += (mouseX - width / 2) * 0.008;
          py += (mouseY - height / 2) * 0.008;
        }

        ctx.fillStyle = star.color;
        ctx.globalAlpha = Math.max(0.1, Math.min(1, currentOpacity));

        if (star.size > 2) {
          // Plus/cross star
          ctx.fillRect(px - 1, py, 3, 1);
          ctx.fillRect(px, py - 1, 1, 3);
        } else {
          // Dot star
          ctx.fillRect(px, py, star.size, star.size);
        }
      });
      ctx.globalAlpha = 1.0;

      // 4. Update and draw click sparkles
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

      // 5. Update & draw floating pixel items with physics
      items.forEach((item) => {
        const sprite = PIXEL_SPRITES[item.spriteKey];
        if (!sprite) return;

        // Base floating bobble oscillation
        item.floatPhase += item.floatSpeed;
        const bobbleY = Math.sin(item.floatPhase) * 12;

        // Apply velocities with damping
        item.x += item.vx;
        item.y += item.vy;
        item.vx *= 0.985;
        item.vy *= 0.985;

        // Rotation
        if (item.spinActive > 0) {
          item.angle += 0.35; // Rapid spin on click
          item.spinActive--;
        } else {
          item.angle += item.vAngle;
        }

        // Mouse repulsion physics (zero-gravity magnetic push)
        if (mouseX > 0 && mouseY > 0) {
          const dx = item.x - mouseX;
          const dy = item.y - mouseY;
          const dist = Math.sqrt(dx * dx + dy * dy);
          const repelRadius = 140;

          if (dist < repelRadius && dist > 1) {
            const force = (1 - dist / repelRadius) * 0.7;
            item.vx += (dx / dist) * force;
            item.vy += (dy / dist) * force;
          }
        }

        // Soft screen edge boundary reflection
        const pad = 30;
        if (item.x < pad) { item.x = pad; item.vx = Math.abs(item.vx) * 0.8 + 0.1; }
        if (item.x > width - pad) { item.x = width - pad; item.vx = -Math.abs(item.vx) * 0.8 - 0.1; }
        if (item.y < pad) { item.y = pad; item.vy = Math.abs(item.vy) * 0.8 + 0.1; }
        if (item.y > height - pad) { item.y = height - pad; item.vy = -Math.abs(item.vy) * 0.8 - 0.1; }

        // Draw sprite
        const drawY = item.y + bobbleY;
        const extraScale = item.spinActive > 0 ? 1.25 : 1.0;
        drawSprite(sprite, item.x, drawY, item.angle, item.scale * extraScale);
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
      className="fixed inset-0 w-full h-full pointer-events-auto z-0"
      style={{
        background: '#090A0F',
      }}
    />
  );
}
