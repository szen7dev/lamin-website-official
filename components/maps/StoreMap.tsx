'use client';

import { useEffect, useState } from 'react';
import { MapPin, Loader2, AlertCircle } from 'lucide-react';

interface StoreMapProps {
  latitude: number;
  longitude: number;
  storeName?: string;
}

export function StoreMap({ latitude, longitude, storeName }: StoreMapProps) {
  const [isLoading, setIsLoading] = useState(true);
  const [hasError, setHasError] = useState(false);
  const [map, setMap] = useState<google.maps.Map | null>(null);
  const [marker, setMarker] = useState<google.maps.Marker | null>(null);

  useEffect(() => {
    const apiKey = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY;

    if (!apiKey) {
      console.error('Google Maps API key is not configured');
      setHasError(true);
      setIsLoading(false);
      return;
    }

    // Check if Google Maps script is already loaded
    if (window.google?.maps) {
      initializeMap();
      return;
    }

    // Load Google Maps script
    const script = document.createElement('script');
    script.src = `https://maps.googleapis.com/maps/api/js?key=${apiKey}&libraries=places`;
    script.async = true;
    script.defer = true;
    script.onload = () => {
      initializeMap();
    };
    script.onerror = () => {
      console.error('Failed to load Google Maps script');
      setHasError(true);
      setIsLoading(false);
    };

    document.head.appendChild(script);

    return () => {
      // Cleanup marker when component unmounts
      if (marker) {
        marker.setMap(null);
      }
    };
  }, []);

  useEffect(() => {
    // Update map center and marker when coordinates change
    if (map && marker) {
      const newPosition = { lat: latitude, lng: longitude };
      map.setCenter(newPosition);
      marker.setPosition(newPosition);
    }
  }, [latitude, longitude, map, marker]);

  const initializeMap = () => {
    try {
      const mapElement = document.getElementById('store-map');
      if (!mapElement) {
        setHasError(true);
        setIsLoading(false);
        return;
      }

      const position = { lat: latitude, lng: longitude };

      // Create map
      const newMap = new google.maps.Map(mapElement, {
        center: position,
        zoom: 16,
        mapTypeControl: true,
        streetViewControl: true,
        fullscreenControl: true,
        zoomControl: true,
        styles: [
          {
            featureType: 'poi',
            elementType: 'labels',
            stylers: [{ visibility: 'off' }],
          },
        ],
      });

      // Create marker
      const newMarker = new google.maps.Marker({
        position,
        map: newMap,
        title: storeName || 'Store Location',
        animation: google.maps.Animation.DROP,
      });

      // Create info window
      const infoWindow = new google.maps.InfoWindow({
        content: `<div style="padding: 8px; font-family: sans-serif;">
          <h3 style="margin: 0 0 4px 0; font-size: 14px; font-weight: 600; color: #1f2937;">
            ${storeName || 'Store Location'}
          </h3>
          <p style="margin: 0; font-size: 12px; color: #6b7280;">
            Lat: ${latitude.toFixed(6)}, Lng: ${longitude.toFixed(6)}
          </p>
        </div>`,
      });

      // Open info window on marker click
      newMarker.addListener('click', () => {
        infoWindow.open(newMap, newMarker);
      });

      setMap(newMap);
      setMarker(newMarker);
      setIsLoading(false);
    } catch (error) {
      console.error('Error initializing map:', error);
      setHasError(true);
      setIsLoading(false);
    }
  };

  if (hasError) {
    return (
      <div className="absolute inset-0 flex flex-col items-center justify-center bg-gray-100">
        <AlertCircle className="w-12 h-12 text-red-500 mb-2" />
        <p className="text-sm text-gray-600 text-center px-4">
          Unable to load map
          <br />
          <span className="text-xs">
            Please check your API key configuration
          </span>
        </p>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="absolute inset-0 flex items-center justify-center bg-gray-100">
        <Loader2 className="w-12 h-12 text-primary animate-spin" />
      </div>
    );
  }

  return <div id="store-map" className="w-full h-full" />;
}

// Fallback component when coordinates are not available
export function MapPlaceholder() {
  return (
    <div className="absolute inset-0 flex items-center justify-center bg-gray-200">
      <MapPin className="w-12 h-12 text-primary" />
    </div>
  );
}
