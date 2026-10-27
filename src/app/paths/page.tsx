// Learning Paths & Quest Map Explorer (CodeDex Game World)
'use client';

import React from 'react';
import { WorldMap } from '@/components/game/WorldMap';

export default function PathsPage() {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 w-full">
      <WorldMap />
    </div>
  );
}
