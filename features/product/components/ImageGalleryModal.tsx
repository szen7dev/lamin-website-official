'use client';

import { useEffect, useState } from 'react';
import Image from 'next/image';
import { ChevronLeft, ChevronRight, X, ZoomIn, ZoomOut } from 'lucide-react';

import { cn } from '@/utils/helpers';

interface ImageGalleryModalProps {
  images: Array<{
    url: string;
    alt?: string;
    id?: string;
  }>;
  isOpen: boolean;
  onClose: () => void;
  initialIndex?: number;
}

export default function ImageGalleryModal({
  images,
  isOpen,
  onClose,
  initialIndex = 0,
}: ImageGalleryModalProps) {
  const [currentIndex, setCurrentIndex] = useState(initialIndex);
  const [zoomLevel, setZoomLevel] = useState(1); // Default zoom level is 1 (100%)
  const MAX_ZOOM = 3; // Maximum zoom level (300%)
  const MIN_ZOOM = 0.5; // Minimum zoom level (50%)
  const ZOOM_STEP = 0.5; // Zoom step increment/decrement

  useEffect(() => {
    // Prevent scrolling when modal is open
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    }

    // Cleanup function
    return () => {
      document.body.style.overflow = 'auto';
    };
  }, [isOpen]);

  useEffect(() => {
    // Handle escape key to close modal
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };

    // Handle arrow keys for navigation
    const handleArrowKeys = (e: KeyboardEvent) => {
      if (e.key === 'ArrowLeft') {
        handlePrevious();
      } else if (e.key === 'ArrowRight') {
        handleNext();
      }
    };

    window.addEventListener('keydown', handleEscape);
    window.addEventListener('keydown', handleArrowKeys);

    return () => {
      window.removeEventListener('keydown', handleEscape);
      window.removeEventListener('keydown', handleArrowKeys);
    };
  }, [onClose]);

  // Reset zoom level when changing images
  useEffect(() => {
    setZoomLevel(1);
  }, [currentIndex]);

  const handlePrevious = () => {
    setCurrentIndex(prev => (prev === 0 ? images.length - 1 : prev - 1));
  };

  const handleNext = () => {
    setCurrentIndex(prev => (prev === images.length - 1 ? 0 : prev + 1));
  };

  const handleZoomIn = () => {
    setZoomLevel(prev => Math.min(prev + ZOOM_STEP, MAX_ZOOM));
  };

  const handleZoomOut = () => {
    setZoomLevel(prev => Math.max(prev - ZOOM_STEP, MIN_ZOOM));
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4">
      {/* Modal Container with rounded borders */}
      <div className="relative bg-white rounded-xl w-full max-w-3xl h-[80vh] flex flex-col overflow-hidden">
        {/* Close button */}
        <button
          aria-label="Close gallery"
          className="absolute right-3 top-3 z-10 rounded-full bg-black/40 backdrop-blur-sm p-1.5 text-white hover:bg-black/60"
          onClick={onClose}>
          <X className="h-4 w-4" />
        </button>

        {/* Main image container */}
        <div className="relative flex-1 w-full bg-gray-50 flex items-center justify-center">
          <div
            className="relative h-full w-full flex items-center justify-center"
            style={{
              transform: `scale(${zoomLevel})`,
              transition: 'transform 0.2s ease-in-out',
            }}>
            <Image
              alt={
                images[currentIndex].alt || `Gallery image ${currentIndex + 1}`
              }
              className="object-contain max-h-full"
              height={500}
              src={images[currentIndex].url || '/placeholder.svg'}
              width={500}
            />
          </div>

          {/* Pagination indicator */}
          <div className="absolute bottom-4 left-1/2 -translate-x-1/2 bg-black/40 backdrop-blur-sm px-2.5 py-0.5 rounded-full text-xs font-medium text-white">
            {currentIndex + 1}/{images.length}
          </div>

          {/* Navigation buttons */}
          <button
            aria-label="Previous image"
            className="absolute left-3 top-1/2 -translate-y-1/2 rounded-full bg-black/40 backdrop-blur-sm p-1.5 text-white hover:bg-black/60"
            onClick={handlePrevious}>
            <ChevronLeft className="h-5 w-5" />
          </button>
          <button
            aria-label="Next image"
            className="absolute right-3 top-1/2 -translate-y-1/2 rounded-full bg-black/40 backdrop-blur-sm p-1.5 text-white hover:bg-black/60"
            onClick={handleNext}>
            <ChevronRight className="h-5 w-5" />
          </button>

          {/* Zoom controls */}
          <div className="absolute bottom-12 left-1/2 -translate-x-1/2 z-10 flex gap-3">
            <button
              aria-label="Zoom out"
              className="rounded-full bg-black/40 backdrop-blur-sm p-1.5 text-white hover:bg-black/60"
              onClick={handleZoomOut}>
              <ZoomOut className="h-4 w-4" />
            </button>
            <button
              aria-label="Zoom in"
              className="rounded-full bg-black/40 backdrop-blur-sm p-1.5 text-white hover:bg-black/60"
              onClick={handleZoomIn}>
              <ZoomIn className="h-4 w-4" />
            </button>
          </div>
        </div>

        {/* Thumbnails strip */}
        <div className="w-full bg-white py-3 px-4 border-gray-200">
          <div className="flex items-center justify-center gap-1.5 overflow-x-auto py-0.5">
            {images.map((image, index) => (
              <button
                key={image.id || `modal-thumb-${index}`}
                className={cn(
                  'h-12 w-12 flex-shrink-0 rounded-md border-2 transition-all',
                  index === currentIndex
                    ? 'border-primary-50 shadow-sm'
                    : 'border-transparent opacity-70 hover:opacity-100',
                )}
                onClick={() => setCurrentIndex(index)}>
                <div className="relative h-full w-full overflow-hidden rounded-sm">
                  <Image
                    fill
                    alt={image.alt || `Thumbnail ${index + 1}`}
                    className="object-cover"
                    src={image.url || '/placeholder.svg'}
                  />
                </div>
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
