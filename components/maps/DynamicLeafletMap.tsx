'use client';

import dynamic from 'next/dynamic';
import { Loader2 } from 'lucide-react';

// Dynamically import Leaflet map with SSR disabled
// This is necessary because Leaflet relies on the `window` object which doesn't exist during server-side rendering
const LeafletStoreMap = dynamic(
  () => import('./LeafletStoreMap').then((mod) => mod.LeafletStoreMap),
  {
    ssr: false,
    loading: () => (
      <div className="absolute inset-0 flex items-center justify-center bg-gray-100">
        <Loader2 className="w-12 h-12 text-primary animate-spin" />
      </div>
    ),
  }
);

export { LeafletStoreMap };
export { MapPlaceholder } from './LeafletStoreMap';
