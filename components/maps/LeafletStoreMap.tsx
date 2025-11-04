'use client';

import { useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import { MapPin } from 'lucide-react';
import type { LatLngExpression } from 'leaflet';
import 'leaflet/dist/leaflet.css';

interface LeafletStoreMapProps {
  latitude: number;
  longitude: number;
  storeName?: string;
}

// Component to update map center when coordinates change
function MapUpdater({ center }: { center: LatLngExpression }) {
  const map = useMap();

  useEffect(() => {
    map.setView(center, map.getZoom());
  }, [center, map]);

  return null;
}

export function LeafletStoreMap({
  latitude,
  longitude,
  storeName
}: LeafletStoreMapProps) {
  // Initialize Leaflet icon configuration
  useEffect(() => {
    import('@/lib/leaflet-config');
  }, []);

  const position: LatLngExpression = [latitude, longitude];

  return (
    <div className="w-full h-full relative">
      <MapContainer
        center={position}
        zoom={16}
        scrollWheelZoom={true}
        className="w-full h-full"
        zoomControl={true}
      >
        {/* OpenStreetMap Tile Layer - Free, no API key required */}
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          maxZoom={19}
        />

        {/* Alternative: MapTiler (Uncomment if you have API key)
        <TileLayer
          attribution='&copy; <a href="https://www.maptiler.com/copyright/">MapTiler</a> &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url={`https://api.maptiler.com/maps/streets-v2/{z}/{x}/{y}.png?key=${process.env.NEXT_PUBLIC_MAPTILER_API_KEY}`}
          maxZoom={19}
        />
        */}

        <Marker position={position}>
          <Popup>
            <div className="p-2 font-sans">
              <h3 className="font-semibold text-sm mb-1">
                {storeName || 'Store Location'}
              </h3>
              <p className="text-xs text-gray-600">
                Lat: {latitude.toFixed(6)}<br />
                Lng: {longitude.toFixed(6)}
              </p>
            </div>
          </Popup>
        </Marker>

        <MapUpdater center={position} />
      </MapContainer>
    </div>
  );
}

// Fallback component when coordinates are not available (kept for compatibility)
export function MapPlaceholder() {
  return (
    <div className="absolute inset-0 flex items-center justify-center bg-gray-200">
      <MapPin className="w-12 h-12 text-primary" />
    </div>
  );
}
