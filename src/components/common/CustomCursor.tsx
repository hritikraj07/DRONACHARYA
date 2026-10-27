'use client';

import React, { useEffect, useRef, useState } from 'react';

// Crisp 32x32 retro pixel art mascot cursors (base64 PNG for zero-latency, zero-network instant display)
const CURSOR_ASSETS = {
  default:
    'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACAAAAAgCAYAAABzenr0AAAAwElEQVR4nO2WPQqAMAxGHdydxDt4VGdvoLurZxBP4eToLPhDhEAtTSvaNB384EPs4HtWgk2SmJIV5QEVg2OCS6hwEQlxgSgkKAFxCZsIrnuTpAR0ESzL53JJuARFBaKQ+CxATYPt3puEbQrEBLa2M0KodZYdeJJpXr4LvJUAODa4gAqH1k3PMwkusDf4Ewl2uE0iGNwkQYFZf9nw8HXMj6FKb2V9ax2+L9V1xQYVAJjYDqAEwNSKHNW8H7/+/IklJ+ct4eunPKwRAAAAAElFTkSuQmCC',
  pointer:
    'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACAAAAAgCAYAAABzenr0AAAA5ElEQVR4nO3WsQrCMBDG8QzuTuI7+KidfQPdXX0G8SmcOnYWtHLCyXFcwjXNd3XoQRAD+v8RKSYlNdv9YdR7YUPx5303LoLg+HvoTAS9h8E4LgESQa88cIQ+ARkPQ8hAKCBlnoJwRCksAfCT8AwE4o3nALxXDZsC0BD92VBEDrYo4C8QVQDrt7S+GALwxkqARz98VzPA63wxQ9Y+x5sCvCPj1YBahI4fT9e4J0DHZwOmICBxLwIaLyFKYci/I92Ubt3mt+BRHZeXVcY0P+ocgGL6BMIAjKCYXPArmYWYfdNZZx1jPqu0qONU3pU5AAAAAElFTkSuQmCC',
  active:
    'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACAAAAAgCAYAAABzenr0AAAA6ElEQVR4nO2WPwrCUAyHO7g7Fe/gCTxj595Ad1cXLyCewsmxowhaiRB4xrz0/envFak/yJAM/b6mUFJVIsvVupczaz5qCLI53noJo/5+rr/mMAkN/uyachIS7gpoEtTDxIY2QD0HLmHBi0gMweESIXBXAiISAvdJcJ8sFgPXRLI+UyrckvodAR9cW+t8BB67vfpg35xyuXbvihawthAahk8i4MKp2u0h7V+QIiHhWQKxEqPDYyRg8BAJONySKAbXJHxg6H3A19KpWXwU9K0l3D1YWaaYAMEm2wBLEMwt+HfXJLLPrX9mmxfVX7nioVggewAAAABJRU5ErkJggg==',
};

// Hotspot offsets (fingertip position within 32x32 bounding box)
const HOTSPOTS = {
  default: { x: 3, y: 2 },
  pointer: { x: 4, y: 3 },
  active: { x: 4, y: 3 },
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
