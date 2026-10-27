'use client';

import React, { useEffect, useRef, useState } from 'react';

// Sleek 16-bit retro pixel arrow & pointer hand (base64 PNG for instant, zero-latency rendering)
const CURSOR_ASSETS = {
  default:
    'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACAAAAAgCAYAAABzenr0AAAAgElEQVR4nO3WSwoAIQwDUE/iau5/xRm6EESsP0wCQ7N10YcUTcr5eZMyBpAibLhFhigAGaIGSBAtgI7oAagID0BDjAAUxAwAR6wAoIhVAAyxA4AgTnbgKsJ7iOBX7wHKMBrC+4zogN4ACmJUSGiA2TltIQOxg5B2SHmVj0Qiv8oH3zMF7f1d6rEAAAAASUVORK5CYII=',
  pointer:
    'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACAAAAAgCAYAAABzenr0AAAAsUlEQVR4nO2VUQqAIAyGfegIPvvUaT1aj56kE2QMEgZtYbppxH7YQwv6P7fcnCMUwpqp/BCBOWgaRAGYBmEAnwaAZ3UoDuApLwpFGeEcfifeLuqjlDknqmVNJ2/VrWXJ11dGAiDjqiWfjz3WQ0gBFAgwxhBVIBoQr6qgBTH8Z8QA1cbSEN1zoQdCbDK2QIjvip5JKAtx3WUuVLckvtNUDAPY4kKGOoBDm5ILVXOTyfRrnZLrz3UFnLNvAAAAAElFTkSuQmCC',
  active:
    'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACAAAAAgCAYAAABzenr0AAAApElEQVR4nO3VMQ6AIAwFUAaPwMzkaTmaIyfhBGIwIelQEKSlDP1JBzGhD02KMTvGuTOJNs8RQxSAGGJrQH5mR9UArXVSFNYIrsF35L8L2xRrXssUYqRRD+DdL9h+FAUgwa8WbLqj70dQAQpi6PRciKHm2yDEAVSI6bkwgyCbjH8Q5HfFskn4iQi2Way3JJxsWC0DXP5Aix1gwE1ZK9bmGo1Gw5kH/1CdpomOKbEAAAAASUVORK5CYII=',
};

// Precise hotspot offsets (arrow tip at (1, 1), pointer index fingertip at (5, 1))
const HOTSPOTS = {
  default: { x: 1, y: 1 },
  pointer: { x: 5, y: 1 },
  active: { x: 5, y: 2 },
};

export function CustomCursor() {
  const cursorRef = useRef<HTMLDivElement | null>(null);
  const [cursorType, setCursorType] = useState<'default' | 'pointer' | 'active' | 'hidden'>('default');
  const [isVisible, setIsVisible] = useState(false);
  const posRef = useRef({ x: -100, y: -100 });
  const isMouseDownRef = useRef(false);

  useEffect(() => {
    // Only run on client
    if (typeof window === 'undefined') return;

    const cursorEl = cursorRef.current;
    if (!cursorEl) return;

    // Enable custom cursor mode on <html> tag to hide standard cursor cleanly
    document.documentElement.classList.add('custom-cursor-active');

    const updatePosition = (x: number, y: number) => {
      posRef.current = { x, y };
      const hotspot = HOTSPOTS[cursorType === 'active' ? 'active' : cursorType === 'pointer' ? 'pointer' : 'default'];
      cursorEl.style.transform = `translate3d(${x - hotspot.x}px, ${y - hotspot.y}px, 0)`;
    };

    const handlePointerMove = (e: PointerEvent) => {
      // Ignore pure touch events (phones/tablets without mouse)
      if (e.pointerType === 'touch') {
        setIsVisible(false);
        document.documentElement.classList.remove('custom-cursor-active');
        return;
      }

      if (!isVisible) {
        setIsVisible(true);
        document.documentElement.classList.add('custom-cursor-active');
      }

      // Check hovered element
      const target = e.target as HTMLElement | null;
      if (target) {
        // Text inputs, editors, or pre blocks -> hide custom cursor to allow text selection
        const isTextInput = target.closest(
          'input[type="text"], input[type="email"], input[type="password"], input[type="search"], input[type="number"], textarea, [contenteditable="true"], pre, code'
        );

        if (isTextInput) {
          setCursorType('hidden');
          updatePosition(e.clientX, e.clientY);
          return;
        }

        // Interactive clickable items -> pointer with shining star
        const isInteractive = target.closest(
          'a, button, [role="button"], .cursor-pointer, .card-game-interactive, .btn-arcade, .btn-game-yellow, .btn-game-purple, .btn-game-mint, .btn-game-white, .btn-game-coral, .btn-primary, .btn-secondary, select, summary, input[type="submit"], input[type="button"]'
        );

        if (isMouseDownRef.current) {
          setCursorType('active');
        } else if (isInteractive) {
          setCursorType('pointer');
        } else {
          setCursorType('default');
        }
      }

      updatePosition(e.clientX, e.clientY);
    };

    const handleMouseDown = (e: MouseEvent) => {
      if (e.button !== 0) return; // Only left click
      isMouseDownRef.current = true;
      setCursorType('active');
      updatePosition(e.clientX, e.clientY);
    };

    const handleMouseUp = (e: MouseEvent) => {
      isMouseDownRef.current = false;
      const target = e.target as HTMLElement | null;
      const isInteractive = target?.closest(
        'a, button, [role="button"], .cursor-pointer, .card-game-interactive, .btn-arcade, .btn-game-yellow, .btn-game-purple, .btn-game-mint, select, summary'
      );
      setCursorType(isInteractive ? 'pointer' : 'default');
      updatePosition(e.clientX, e.clientY);
    };

    const handleMouseLeave = () => {
      setIsVisible(false);
    };

    const handleMouseEnter = () => {
      setIsVisible(true);
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
  }, [isVisible, cursorType]);

  // Don't render during SSR or if hidden on text input
  if (cursorType === 'hidden' || !isVisible) {
    return null;
  }

  const assetSrc =
    cursorType === 'active'
      ? CURSOR_ASSETS.active
      : cursorType === 'pointer'
      ? CURSOR_ASSETS.pointer
      : CURSOR_ASSETS.default;

  return (
    <div
      ref={cursorRef}
      className="fixed top-0 left-0 pointer-events-none z-[999999] select-none will-change-transform"
      style={{
        transform: `translate3d(${posRef.current.x}px, ${posRef.current.y}px, 0)`,
        display: isVisible ? 'block' : 'none',
      }}
      aria-hidden="true"
    >
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={assetSrc}
        alt=""
        width={32}
        height={32}
        className="w-8 h-8 select-none pointer-events-none"
        style={{
          imageRendering: 'pixelated',
          filter: cursorType === 'active' ? 'drop-shadow(0 2px 4px rgba(250, 204, 21, 0.4))' : 'none',
        }}
      />
    </div>
  );
}
