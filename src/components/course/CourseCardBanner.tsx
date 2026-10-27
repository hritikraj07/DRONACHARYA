'use client';

import React from 'react';

interface CourseCardBannerProps {
  courseId: string;
  className?: string;
}

const VALID_TRACKS = [
  'python',
  'html',
  'css',
  'javascript',
  'react',
  'nodejs',
  'sql',
  'cpp',
  'ml',
  'git',
];

export function CourseCardBanner({ courseId, className = '' }: CourseCardBannerProps) {
  const normId = (courseId || '').toLowerCase().trim();
  const validId = VALID_TRACKS.includes(normId) ? normId : 'python';

  return (
    <div
      className={`relative w-full h-44 overflow-hidden bg-[#0A0E1A] flex items-center justify-center select-none group ${className}`}
    >
      <img
        src={`/courses/${validId}.svg`}
        alt={`${validId} curriculum track banner`}
        className="w-full h-full object-cover sm:object-contain transition-transform duration-300 group-hover:scale-105 pointer-events-none"
        loading="eager"
      />
    </div>
  );
}
