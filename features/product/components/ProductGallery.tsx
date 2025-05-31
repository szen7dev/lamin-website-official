'use client';

import { useMemo, useState } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import Image from 'next/image';
import dynamic from 'next/dynamic';

import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { cn } from '@/utils/helpers';
import apiClient from '@/services/api/apiClient';

// Dynamically import the modal to avoid SSR issues
const ImageGalleryModal = dynamic(() => import('./ImageGalleryModal'), {
  ssr: false,
});

interface ProductGalleryProps {
  images: Array<{
    url: string;
    alt?: string;
    id?: string; // Optional id for better key management
  }>;
}

export default function ProductGallery({ images }: ProductGalleryProps) {
  const [currentImage, setCurrentImage] = useState(0);
  const [modalOpen, setModalOpen] = useState(false);

  // Ensure each image has a unique identifier for keying
  const processedImages = useMemo(() => {
    return images.map((image, index) => ({
      ...image,
      id: image.id || `img-${index}-${Date.now()}`,
      url:
        apiClient.getFileUrl(image.url) ||
        `/placeholder.svg?height=400&width=400&unique=${index}-${Date.now()}`,
      alt: image.alt || `Product image ${index + 1}`,
    }));
  }, [images]);

  // Constants for better readability and maintenance
  const MAX_THUMBNAILS = 3;
  const remainingImagesCount = Math.max(
    0,
    processedImages.length - MAX_THUMBNAILS,
  );

  const handlePrevious = () => {
    setCurrentImage(prev =>
      prev === 0 ? processedImages.length - 1 : prev - 1,
    );
  };

  const handleNext = () => {
    setCurrentImage(prev =>
      prev === processedImages.length - 1 ? 0 : prev + 1,
    );
  };

  const handleImageClick = () => {
    setModalOpen(true);
  };

  if (!processedImages.length) {
    return (
      <div className="aspect-square w-full rounded-lg bg-grayscale-10 flex items-center justify-center">
        <span className="text-grayscale-50">Không có hình ảnh</span>
      </div>
    );
  }

  return (
    <>
      <div className="space-y-4">
        {/* Main Image */}
        <div className="relative aspect-square w-full">
          <div className="absolute inset-0 rounded-lg overflow-hidden bg-white">
            {processedImages[currentImage].url ? (
              <button
                aria-label="View product image in gallery"
                className="relative w-full h-full cursor-pointer bg-transparent border-0 p-0"
                type="button"
                onClick={handleImageClick}
                onDoubleClick={handleImageClick}>
                <Image
                  fill
                  alt={processedImages[currentImage].alt}
                  className="object-contain"
                  priority={currentImage === 0}
                  sizes={`(min-width: 1024px) 50vw, 100vw`}
                  src={processedImages[currentImage].url}
                />
              </button>
            ) : (
              <div className="w-full h-full flex items-center justify-center">
                <Skeleton className="w-full h-full" />
              </div>
            )}
          </div>

          {/* Navigation Buttons - Only show if there's more than one image */}
          {processedImages.length > 1 && (
            <div className="absolute inset-0 flex items-center justify-between p-4 z-20 pointer-events-none">
              <Button
                className="h-10 w-10 rounded-full bg-black/30 border-0 backdrop-blur-sm hover:bg-black/40 pointer-events-auto"
                size="sm"
                variant="outline"
                onClick={handlePrevious}>
                <ChevronLeft className="h-6 w-6 text-white" />
                <span className="sr-only">Previous image</span>
              </Button>
              <Button
                className="h-10 w-10 rounded-full bg-black/30 border-0 backdrop-blur-sm hover:bg-black/40 pointer-events-auto"
                size="sm"
                variant="outline"
                onClick={handleNext}>
                <ChevronRight className="h-6 w-6 text-white" />
                <span className="sr-only">Next image</span>
              </Button>
            </div>
          )}
        </div>

        {/* Thumbnails - Only show if there's more than one image */}
        {processedImages.length > 1 && (
          <div className="flex gap-4">
            {/* Display up to MAX_THUMBNAILS thumbnails */}
            {processedImages.slice(0, MAX_THUMBNAILS).map((image, index) => (
              <button
                key={image.id}
                aria-label={`View product image ${index + 1}`}
                className={cn(
                  'relative aspect-square w-16 cursor-pointer rounded-md overflow-hidden',
                  currentImage === index
                    ? 'ring-2 ring-primary-5'
                    : 'ring-1 ring-grayscale-20',
                )}
                onClick={() => setCurrentImage(index)}>
                {image.url ? (
                  <Image
                    fill
                    alt={image.alt}
                    className="object-cover"
                    sizes="64px"
                    src={image.url}
                  />
                ) : (
                  <Skeleton className="w-full h-full" />
                )}
              </button>
            ))}

            {/* "View More" thumbnail - Only show if there are more images than MAX_THUMBNAILS */}
            {remainingImagesCount > 0 && (
              <button
                aria-label="View more product images"
                className="relative aspect-square w-16 cursor-pointer rounded-md overflow-hidden ring-1 ring-grayscale-20"
                onClick={() => setModalOpen(true)}>
                {processedImages[MAX_THUMBNAILS].url ? (
                  <div className="relative h-full w-full">
                    <Image
                      fill
                      alt="More product images"
                      className="object-cover"
                      sizes="64px"
                      src={processedImages[MAX_THUMBNAILS].url}
                    />
                    <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                      <span className="text-white text-xs font-medium">
                        +{remainingImagesCount}
                      </span>
                    </div>
                  </div>
                ) : (
                  <div className="relative h-full w-full">
                    <Skeleton className="w-full h-full" />
                    <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                      <span className="text-white text-xs font-medium">
                        +{remainingImagesCount}
                      </span>
                    </div>
                  </div>
                )}
              </button>
            )}
          </div>
        )}
      </div>

      {/* Image Gallery Modal */}
      {modalOpen && (
        <ImageGalleryModal
          images={processedImages}
          initialIndex={currentImage}
          isOpen={modalOpen}
          onClose={() => setModalOpen(false)}
        />
      )}
    </>
  );
}
