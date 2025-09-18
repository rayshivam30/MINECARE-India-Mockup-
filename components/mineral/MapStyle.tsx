'use client';

// This component ensures Leaflet CSS is loaded correctly in Next.js
import { useEffect } from 'react';

export default function MapStyle() {
  useEffect(() => {
    // This ensures the CSS is loaded on the client side
    const link = document.createElement('link');
    link.rel = 'stylesheet';
    link.href = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.css';
    link.integrity = 'sha256-p4NxAoJBhIIN+hmNHrzRCf9tD/miZyoHS5obTRR9BMY=';
    link.crossOrigin = '';
    
    document.head.appendChild(link);
    
    return () => {
      // Clean up the stylesheet when the component unmounts
      document.head.removeChild(link);
    };
  }, []);

  return null;
}
