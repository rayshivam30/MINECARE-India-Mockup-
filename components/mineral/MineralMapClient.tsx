'use client';

import dynamic from 'next/dynamic';

const MineralMap = dynamic(() => import('./MineralMap'), {
  ssr: false,
  loading: () => <div className="w-full h-[600px] bg-muted/30 rounded-xl flex items-center justify-center">Loading map...</div>
});

export default function MineralMapClient() {
  return <MineralMap />;
}
