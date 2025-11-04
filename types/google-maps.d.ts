/**
 * Google Maps JavaScript API type declarations
 * Provides basic type definitions for Google Maps
 */

declare namespace google.maps {
  export class Map {
    constructor(mapDiv: HTMLElement, opts?: MapOptions);
    setCenter(latLng: LatLngLiteral | LatLng): void;
    getCenter(): LatLng;
    setZoom(zoom: number): void;
    getZoom(): number;
  }

  export class Marker {
    constructor(opts?: MarkerOptions);
    setMap(map: Map | null): void;
    setPosition(latLng: LatLngLiteral | LatLng): void;
    getPosition(): LatLng;
    addListener(eventName: string, handler: () => void): void;
  }

  export class InfoWindow {
    constructor(opts?: InfoWindowOptions);
    open(map: Map, anchor?: Marker): void;
    close(): void;
    setContent(content: string | HTMLElement): void;
  }

  export class LatLng {
    constructor(lat: number, lng: number);
    lat(): number;
    lng(): number;
  }

  export interface LatLngLiteral {
    lat: number;
    lng: number;
  }

  export interface MapOptions {
    center?: LatLngLiteral | LatLng;
    zoom?: number;
    mapTypeControl?: boolean;
    streetViewControl?: boolean;
    fullscreenControl?: boolean;
    zoomControl?: boolean;
    styles?: MapTypeStyle[];
  }

  export interface MarkerOptions {
    position?: LatLngLiteral | LatLng;
    map?: Map | null;
    title?: string;
    animation?: Animation;
  }

  export interface InfoWindowOptions {
    content?: string | HTMLElement;
  }

  export interface MapTypeStyle {
    featureType?: string;
    elementType?: string;
    stylers?: Array<{ [key: string]: string }>;
  }

  export enum Animation {
    DROP = 1,
    BOUNCE = 2,
  }
}

declare global {
  interface Window {
    google?: {
      maps: typeof google.maps;
    };
  }
}

export {};
