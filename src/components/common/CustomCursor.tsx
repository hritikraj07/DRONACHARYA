'use client';

import React, { useEffect, useRef, useState } from 'react';

// Hotspot is exactly at the tip of the extended index finger (x: 7, y: 1)
const HOTSPOT = { x: 7, y: 1 };

/**
 * Pixel Hand Cursor SVG based on the classic 8-bit pointer glove,
 * themed with Dronacharya Arcade Gold, Ivory Sheen Highlights,
 * Royal Gurukul Purple wristband, and an animated fingertip magic star!
 */
function ThemedHandCursor({
  isHovering,
  isActive,
}: {
  isHovering: boolean;
  isActive: boolean;
}) {
  return (
    <div
      className="transition-transform duration-75 select-none pointer-events-none will-change-transform"
      style={{
        transform: isActive
          ? 'scale(0.92) translate(1px, 2px)'
          : isHovering
          ? 'scale(1.06) translate(-1px, -2px)'
          : 'scale(1)',
        filter: isHovering
          ? 'drop-shadow(0 0 6px rgba(251, 191, 36, 0.9)) drop-shadow(0 2px 5px rgba(108, 92, 231, 0.5))'
          : isActive
          ? 'drop-shadow(0 1px 2px rgba(0, 0, 0, 0.6))'
          : 'drop-shadow(0 2px 4px rgba(0, 0, 0, 0.35))',
      }}
    >
      <svg
        width="32"
        height="38"
        viewBox="0 0 24 30"
        shapeRendering="crispEdges"
        className="select-none pointer-events-none overflow-visible"
      >
        <defs>
          {/* Animated Gold Gradient for Palm & Fingers */}
          <linearGradient id="cursor-hand-gold" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#FFFBEB" />
            <stop offset="35%" stopColor="#FFD214" />
            <stop offset="100%" stopColor="#F59E0B" />
          </linearGradient>

          {/* Signature Gurukul Purple Gradient for Wristband */}
          <linearGradient id="cursor-wrist-purple" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#8B5CF6" />
            <stop offset="50%" stopColor="#6C5CE7" />
            <stop offset="100%" stopColor="#4834D4" />
          </linearGradient>
        </defs>

        {/* 1. SOLID PIXEL OUTLINE (Deep Charcoal #1E1E24) */}
        <g fill="#1E1E24">
          {/* Index Finger Tip & Sides */}
          <rect x="6" y="1" width="3" height="1" />
          <rect x="5" y="2" width="1" height="9" />
          <rect x="9" y="2" width="1" height="6" />

          {/* Middle Finger Top & Right Step */}
          <rect x="10" y="7" width="2" height="1" />
          <rect x="12" y="8" width="1" height="2" />

          {/* Ring Finger Top & Right Step */}
          <rect x="13" y="9" width="2" height="1" />
          <rect x="15" y="10" width="1" height="2" />

          {/* Pinky Finger Top & Right Outer Edge */}
          <rect x="16" y="11" width="2" height="1" />
          <rect x="18" y="12" width="1" height="7" />

          {/* Crease lines between fingers */}
          <rect x="9" y="8" width="1" height="3" />
          <rect x="12" y="10" width="1" height="4" />
          <rect x="15" y="12" width="1" height="3" />

          {/* Thumb Outline */}
          <rect x="1" y="11" width="4" height="1" />
          <rect x="0" y="12" width="1" height="3" />
          <rect x="1" y="15" width="1" height="2" />
          <rect x="2" y="17" width="1" height="1" />
          <rect x="3" y="18" width="1" height="1" />
          <rect x="4" y="19" width="1" height="1" />
          <rect x="5" y="20" width="1" height="1" />

          {/* Thumb Inner Junction with Index */}
          <rect x="4" y="14" width="1" height="1" />
          <rect x="5" y="12" width="1" height="2" />

          {/* Palm Bottom-Right Inset */}
          <rect x="17" y="19" width="1" height="2" />

          {/* Wrist Outline & Base Border */}
          <rect x="6" y="21" width="1" height="3" />
          <rect x="16" y="21" width="1" height="3" />
          <rect x="6" y="24" width="11" height="1" />
        </g>

        {/* 2. INNER HAND BODY: Dronacharya Arcade Gold */}
        <g fill="url(#cursor-hand-gold)">
          <rect x="6" y="2" width="3" height="9" />
          <rect x="10" y="8" width="2" height="6" />
          <rect x="13" y="10" width="2" height="4" />
          <rect x="16" y="12" width="2" height="7" />
          <rect x="1" y="12" width="4" height="3" />
          <rect x="2" y="15" width="2" height="2" />
          <rect x="6" y="11" width="12" height="3" />
          <rect x="3" y="14" width="15" height="1" />
          <rect x="3" y="15" width="15" height="3" />
          <rect x="4" y="18" width="14" height="1" />
          <rect x="5" y="19" width="12" height="1" />
          <rect x="6" y="20" width="10" height="1" />
        </g>

        {/* 3. HIGHLIGHT SHEEN: Soft Ivory Gold (#FEF08A) */}
        <g fill="#FEF08A">
          <rect x="6" y="2" width="1" height="8" />
          <rect x="6" y="2" width="3" height="1" />
          <rect x="10" y="8" width="1" height="4" />
          <rect x="13" y="10" width="1" height="3" />
          <rect x="16" y="12" width="1" height="4" />
          <rect x="1" y="12" width="3" height="1" />
          <rect x="1" y="13" width="1" height="2" />
          <rect x="4" y="15" width="1" height="3" />
        </g>

        {/* 4. WRISTBAND CUFF: Royal Gurukul Purple (#6C5CE7) */}
        <g fill="url(#cursor-wrist-purple)">
          <rect x="7" y="21" width="9" height="3" />
        </g>

        {/* 5. GOLDEN BUCKLE on Wristband */}
        <g fill="#FFD214">
          <rect x="10" y="22" width="3" height="1" />
        </g>
        <g fill="#FFFFFF">
          <rect x="11" y="22" width="1" height="1" />
        </g>

        {/* 6. ANIMATED RETRO SPARKLE STAR at Fingertip (x=7, y=0) */}
        <g
          className="transition-opacity duration-150"
          style={{
            opacity: isHovering ? 1 : 0.85,
          }}
        >
          {/* Star Core (Pure White) */}
          <rect x="7" y="0" width="1" height="1" fill="#FFFFFF" />

          {/* Star Arms (Arcade Gold) */}
          <rect x="7" y="-1" width="1" height="1" fill="#FFD214" />
          <rect x="7" y="1" width="1" height="1" fill="#FFD214" />
          <rect x="6" y="0" width="1" height="1" fill="#FFD214" />
          <rect x="8" y="0" width="1" height="1" fill="#FFD214" />

          {/* Floating Micro-Sparks (Royal Purple Glow) */}
          <rect x="7" y="-2" width="1" height="1" fill="#A78BFA" opacity="0.8" />
          <rect x="9" y="0" width="1" height="1" fill="#A78BFA" opacity="0.8" />
          <rect x="5" y="0" width="1" height="1" fill="#A78BFA" opacity="0.8" />
        </g>
      </svg>
    </div>
  );
}

export function CustomCursor() {
  const cursorRef = useRef<HTMLDivElement | null>(null);
  const [cursorType, setCursorType] = useState<'default' | 'pointer' | 'active' | 'hidden'>('default');
  const [isVisible, setIsVisible] = useState(false);
  const posRef = useRef({ x: -100, y: -100 });
  const isMouseDownRef = useRef(false);
  const cursorTypeRef = useRef<'default' | 'pointer' | 'active' | 'hidden'>('default');

  useEffect(() => {
    // Only run on client
    if (typeof window === 'undefined') return;

    // Enable custom cursor mode on <html> tag to hide standard cursor cleanly
    document.documentElement.classList.add('custom-cursor-active');

    const updatePosition = (x: number, y: number, type: 'default' | 'pointer' | 'active' | 'hidden') => {
      posRef.current = { x, y };
      const cursorEl = cursorRef.current;
      if (!cursorEl) return;
      cursorEl.style.transform = `translate3d(${x - HOTSPOT.x}px, ${y - HOTSPOT.y}px, 0)`;
      cursorEl.style.display = type === 'hidden' ? 'none' : 'block';
    };

    const handlePointerMove = (e: PointerEvent) => {
      // Ignore pure touch events (phones/tablets without mouse)
      if (e.pointerType === 'touch') {
        setIsVisible(false);
        document.documentElement.classList.remove('custom-cursor-active');
        return;
      }

      setIsVisible(true);
      document.documentElement.classList.add('custom-cursor-active');

      // Check hovered element
      const target = e.target as HTMLElement | null;
      let nextType: 'default' | 'pointer' | 'active' | 'hidden' = 'default';

      if (target) {
        // Text inputs, editors, or pre blocks -> hide custom cursor to allow text selection
        const isTextInput = target.closest(
          'input[type="text"], input[type="email"], input[type="password"], input[type="search"], input[type="number"], textarea, [contenteditable="true"], pre, code'
        );

        if (isTextInput) {
          nextType = 'hidden';
        } else {
          // Interactive clickable items -> pointer mode with enhanced gold aura & active sparkle
          const isInteractive = target.closest(
            'a, button, [role="button"], .cursor-pointer, .card-game-interactive, .btn-arcade, .btn-game-yellow, .btn-game-purple, .btn-game-mint, .btn-game-white, .btn-game-coral, .btn-primary, .btn-secondary, select, summary, input[type="submit"], input[type="button"]'
          );

          if (isMouseDownRef.current) {
            nextType = 'active';
          } else if (isInteractive) {
            nextType = 'pointer';
          } else {
            nextType = 'default';
          }
        }
      }

      cursorTypeRef.current = nextType;
      setCursorType(nextType);
      updatePosition(e.clientX, e.clientY, nextType);
    };

    const handleMouseDown = (e: MouseEvent) => {
      if (e.button !== 0) return; // Only left click
      isMouseDownRef.current = true;
      cursorTypeRef.current = 'active';
      setCursorType('active');
      updatePosition(e.clientX, e.clientY, 'active');
    };

    const handleMouseUp = (e: MouseEvent) => {
      isMouseDownRef.current = false;
      const target = e.target as HTMLElement | null;
      const isInteractive = target?.closest(
        'a, button, [role="button"], .cursor-pointer, .card-game-interactive, .btn-arcade, .btn-game-yellow, .btn-game-purple, .btn-game-mint, select, summary'
      );
      const nextType = isInteractive ? 'pointer' : 'default';
      cursorTypeRef.current = nextType;
      setCursorType(nextType);
      updatePosition(e.clientX, e.clientY, nextType);
    };

    const handleMouseLeave = () => {
      setIsVisible(false);
      const cursorEl = cursorRef.current;
      if (cursorEl) cursorEl.style.display = 'none';
    };

    const handleMouseEnter = (e: MouseEvent) => {
      setIsVisible(true);
      const cursorEl = cursorRef.current;
      if (cursorEl) cursorEl.style.display = 'block';
      updatePosition(e.clientX, e.clientY, cursorTypeRef.current);
    };

    window.addEventListener('pointermove', handlePointerMove, { passive: true });
    window.addEventListener('mousedown', handleMouseDown, { passive: true });
    window.addEventListener('mouseup', handleMouseUp, { passive: true });
    document.addEventListener('mouseleave', handleMouseLeave);
    document.addEventListener('mouseenter', handleMouseEnter);

    return () => {
      document.documentElement.classList.remove('custom-cursor-active');
      window.removeEventListener('pointermove', handlePointerMove);
      window.removeEventListener('mousedown', handleMouseDown);
      window.removeEventListener('mouseup', handleMouseUp);
      document.removeEventListener('mouseleave', handleMouseLeave);
      document.removeEventListener('mouseenter', handleMouseEnter);
    };
  }, []);

  const isHovering = cursorType === 'pointer';
  const isActive = cursorType === 'active';

  return (
    <div
      ref={cursorRef}
      className="fixed top-0 left-0 pointer-events-none z-[999999] select-none will-change-transform"
      style={{
        transform: `translate3d(${posRef.current.x - HOTSPOT.x}px, ${posRef.current.y - HOTSPOT.y}px, 0)`,
        display: isVisible && cursorType !== 'hidden' ? 'block' : 'none',
      }}
      aria-hidden="true"
    >
      <ThemedHandCursor isHovering={isHovering} isActive={isActive} />
    </div>
  );
}
