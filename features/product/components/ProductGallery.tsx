'use client';

import { useState, useMemo } from 'react';
import Image from 'next/image';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import dynamic from "next/dynamic"
import { Button } from "@/components/ui/button"
import { cn } from "@/utils/helpers"

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
        image.url ||
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
            <Image
              fill
              priority
              alt={processedImages[currentImage].alt}
              className="object-contain"
              src={processedImages[currentImage].url || "/placeholder.svg"}
            />
          </div>

          {/* Navigation Buttons - Only show if there's more than one image */}
          {processedImages.length > 1 && (
            <div className="absolute inset-0 flex items-center justify-between p-4">
              <Button
                className="h-10 w-10 rounded-full bg-black/30 border-0 backdrop-blur-sm hover:bg-black/40"
                size="sm"
                variant="outline"
                onClick={handlePrevious}
              >
                <ChevronLeft className="h-6 w-6 text-white" />
                <span className="sr-only">Previous image</span>
              </Button>
              <Button
                className="h-10 w-10 rounded-full bg-black/30 border-0 backdrop-blur-sm hover:bg-black/40"
                size="sm"
                variant="outline"
                onClick={handleNext}
              >
                <ChevronRight className="h-6 w-6 text-white" />
                <span className="sr-only">Next image</span>
              </Button>
            </div>
          )}
        </div>

        {/* Thumbnails - Only show if there's more than one image */}
        {processedImages.length > 1 && (
          <div className="grid grid-cols-4 gap-4">
            {/* Display up to MAX_THUMBNAILS thumbnails */}
            {processedImages.slice(0, MAX_THUMBNAILS).map((image, index) => (
              <button
                key={image.id}
                className={cn(
                  "relative aspect-square rounded-lg overflow-hidden",
                  index === currentImage ? "ring-2 ring-primary-5" : "ring-1 ring-grayscale-20",
                )}
                onClick={() => setCurrentImage(index)}
                <Image
                  src={image.url || '/placeholder.svg'}
                  alt={image.alt}
                  fill
                  className="object-contain"
                />
              </button>
            ))}

            {/* "View More" thumbnail - Only show if there are more images than MAX_THUMBNAILS */}
            {remainingImagesCount > 0 && (
              <button
                className="relative aspect-square rounded-lg overflow-hidden bg-grayscale-90"
                onClick={() => setModalOpen(true)}
              >
                <div className="absolute inset-0 flex flex-col items-center justify-center text-white">
                  <span className="text-sm font-medium">Xem thêm</span>
                  <span className="text-sm font-medium">
                    {remainingImagesCount} ảnh
                  </span>
                </div>
                {processedImages[MAX_THUMBNAILS] && (
                  <Image
                    fill
                    alt={`Xem thêm ${remainingImagesCount} ảnh`}
                    className="object-cover opacity-50"
                    src={processedImages[MAX_THUMBNAILS].url || "/placeholder.svg"}
                  />
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
