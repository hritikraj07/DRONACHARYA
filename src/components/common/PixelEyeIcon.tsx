'use client';

import React from 'react';

interface PixelEyeIconProps {
  isOpen: boolean;
  className?: string;
  size?: number;
}

export function PixelEyeIcon({ isOpen, className = 'w-4 h-4', size = 16 }: PixelEyeIconProps) {
  if (isOpen) {
    // Open Eye: Pixelated almond shape with pupil and highlight
    return (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 16 16"
        width={size}
        height={size}
        className={className}
        fill="currentColor"
        shapeRendering="crispEdges"
      >
        {/* Upper eyelid arch */}
        <rect x="5" y="2" width="6" height="2" />
        <rect x="3" y="4" width="2" height="2" />
        <rect x="11" y="4" width="2" height="2" />
        <rect x="1" y="6" width="2" height="4" />
        <rect x="13" y="6" width="2" height="4" />

        {/* Lower eyelid arch */}
        <rect x="3" y="10" width="2" height="2" />
        <rect x="11" y="10" width="2" height="2" />
        <rect x="5" y="12" width="6" height="2" />

        {/* Pupil */}
        <rect x="6" y="5" width="4" height="6" />
        <rect x="5" y="6" width="6" height="4" />

        {/* Highlight (white sparkle dot) */}
        <rect x="7" y="6" width="2" height="2" fill="#FFFFFF" />
      </svg>
    );
  }

  // Closed / Slashed Eye: Eyelid with lashes and diagonal pixel strike
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 16 16"
      width={size}
      height={size}
      className={className}
      fill="currentColor"
      shapeRendering="crispEdges"
    >
      {/* Curved closed eyelid line */}
      <rect x="3" y="9" width="10" height="2" />
      {/* Downward lashes */}
      <rect x="4" y="11" width="1.5" height="2" />
      <rect x="7" y="11" width="2" height="2" />
      <rect x="10.5" y="11" width="1.5" height="2" />

      {/* Slashed pixel strike diagonal from top-right to bottom-left */}
      <rect x="13" y="2" width="2" height="2" />
      <rect x="11" y="4" width="2" height="2" />
      <rect x="9" y="6" width="2" height="2" />
      <rect x="7" y="8" width="2" height="2" />
      <rect x="5" y="10" width="2" height="2" />
      <rect x="3" y="12" width="2" height="2" />
      <rect x="1" y="14" width="2" height="2" />
    </svg>
  );
}
