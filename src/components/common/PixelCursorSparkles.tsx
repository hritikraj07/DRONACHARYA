'use client';

import React, { useEffect, useRef } from 'react';

interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  size: number;
  color: string;
  alpha: number;
  life: number;
  maxLife: number;
  shape: 'star' | 'square' | 'cross';
}

const COLORS = [
  '#FACC15', // Gold
  '#FDE047', // Light Gold
  '#8B5CF6', // Purple
  '#A78BFA', // Light Purple
  '#38BDF8', // Cyan
  '#34D399', // Mint
];

export function PixelCursorSparkles() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    if (typeof window === 'undefined') return;
    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
    if (reducedMotion.matches) return;

    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d', { alpha: true });
    if (!ctx) return;

    let animId: number;
    let particles: Particle[] = [];
    let lastMoveTime = 0;
    let lastX = 0;
    let lastY = 0;

    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    resize();
    window.addEventListener('resize', resize);

    // Spawn tiny trail sparkles on movement
    const onMouseMove = (e: MouseEvent) => {
      const now = performance.now();
      const dist = Math.hypot(e.clientX - lastX, e.clientY - lastY);

      // Only spawn if moved enough and at limited rate
      if (now - lastMoveTime > 45 && dist > 15) {
        lastMoveTime = now;
        lastX = e.clientX;
        lastY = e.clientY;

        // 30% chance to spawn a gentle floating micro-sparkle behind cursor
        if (Math.random() < 0.45 && particles.length < 24) {
          particles.push({
            x: e.clientX + (Math.random() * 8 - 4),
            y: e.clientY + (Math.random() * 8 + 4),
            vx: (Math.random() - 0.5) * 0.4,
            vy: Math.random() * 0.6 + 0.2, // Drifts gently down
            size: Math.random() > 0.5 ? 3 : 2,
            color: COLORS[Math.floor(Math.random() * COLORS.length)],
            alpha: 0.9,
            life: 0,
            maxLife: 28,
            shape: Math.random() > 0.4 ? 'star' : 'square',
          });
        }
      }
    };

    // Burst of pixel stars on click
    const onMouseDown = (e: MouseEvent) => {
      const count = 6;
      for (let i = 0; i < count; i++) {
        const angle = (Math.PI * 2 * i) / count + (Math.random() - 0.5) * 0.5;
        const speed = Math.random() * 1.8 + 1.2;
        particles.push({
          x: e.clientX,
          y: e.clientY,
          vx: Math.cos(angle) * speed,
          vy: Math.sin(angle) * speed,
          size: Math.random() > 0.5 ? 4 : 3,
          color: COLORS[Math.floor(Math.random() * COLORS.length)],
          alpha: 1,
          life: 0,
          maxLife: 24,
          shape: 'star',
        });
      }
    };

    window.addEventListener('mousemove', onMouseMove, { passive: true });
    window.addEventListener('mousedown', onMouseDown, { passive: true });

    // Draw pixel stars
    const drawStar = (ctx: CanvasRenderingContext2D, x: number, y: number, size: number) => {
      // 4-point retro pixel star
      ctx.fillRect(Math.round(x - size / 2), Math.round(y), size, 1);
      ctx.fillRect(Math.round(x), Math.round(y - size / 2), 1, size);
    };

    const render = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      for (let i = particles.length - 1; i >= 0; i--) {
        const p = particles[i];
        p.life++;
        p.x += p.vx;
        p.y += p.vy;
        p.alpha = Math.max(0, 1 - p.life / p.maxLife);

        if (p.life >= p.maxLife || p.alpha <= 0) {
          particles.splice(i, 1);
          continue;
        }

        ctx.globalAlpha = p.alpha;
        ctx.fillStyle = p.color;

        if (p.shape === 'star') {
          drawStar(ctx, p.x, p.y, p.size * 2);
        } else {
          ctx.fillRect(Math.round(p.x), Math.round(p.y), p.size, p.size);
        }
      }

      ctx.globalAlpha = 1;
      animId = requestAnimationFrame(render);
    };

    animId = requestAnimationFrame(render);

    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener('resize', resize);
      window.removeEventListener('mousemove', onMouseMove);
      window.removeEventListener('mousedown', onMouseDown);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 pointer-events-none z-[9999] select-none"
      aria-hidden="true"
    />
  );
}
