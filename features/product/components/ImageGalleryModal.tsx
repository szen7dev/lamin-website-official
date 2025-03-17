"use client"

import { useEffect, useState } from "react"
import Image from "next/image"
import { ChevronLeft, ChevronRight, X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { cn } from "@/utils/helpers"

interface ImageGalleryModalProps {
  images: Array<{
    url: string
    alt?: string
    id?: string
  }>
  isOpen: boolean
  onClose: () => void
  initialIndex?: number
}

export default function ImageGalleryModal({ images, isOpen, onClose, initialIndex = 0 }: ImageGalleryModalProps) {
  const [currentIndex, setCurrentIndex] = useState(initialIndex)

  useEffect(() => {
    // Prevent scrolling when modal is open
    if (isOpen) {
      document.body.style.overflow = "hidden"
    }

    // Cleanup function
    return () => {
      document.body.style.overflow = "auto"
    }
  }, [isOpen])

  useEffect(() => {
    // Handle escape key to close modal
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        onClose()
      }
    }

    // Handle arrow keys for navigation
    const handleArrowKeys = (e: KeyboardEvent) => {
      if (e.key === "ArrowLeft") {
        handlePrevious()
      } else if (e.key === "ArrowRight") {
        handleNext()
      }
    }

    window.addEventListener("keydown", handleEscape)
    window.addEventListener("keydown", handleArrowKeys)

    return () => {
      window.removeEventListener("keydown", handleEscape)
      window.removeEventListener("keydown", handleArrowKeys)
    }
  }, [onClose])

  const handlePrevious = () => {
    setCurrentIndex((prev) => (prev === 0 ? images.length - 1 : prev - 1))
  }

  const handleNext = () => {
    setCurrentIndex((prev) => (prev === images.length - 1 ? 0 : prev + 1))
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4">
      {/* Close button */}
      <button
        onClick={onClose}
        className="absolute right-4 top-4 z-10 rounded-full bg-black/50 p-2 text-white hover:bg-black/70"
        aria-label="Close gallery"
      >
        <X className="h-6 w-6" />
      </button>

      {/* Image counter */}
      <div className="absolute left-4 top-4 z-10 rounded-full bg-black/50 px-3 py-1 text-sm text-white">
        {currentIndex + 1} / {images.length}
      </div>

      {/* Main image */}
      <div className="relative h-full w-full max-w-4xl">
        <div className="absolute inset-0 flex items-center justify-center">
          <Image
            src={images[currentIndex].url || "/placeholder.svg"}
            alt={images[currentIndex].alt || `Gallery image ${currentIndex + 1}`}
            fill
            className="object-contain"
            sizes="(max-width: 768px) 100vw, 80vw"
          />
        </div>

        {/* Navigation buttons */}
        <div className="absolute inset-0 flex items-center justify-between p-4">
          <Button
            variant="outline"
            size="sm"
            onClick={handlePrevious}
            className="h-10 w-10 rounded-full bg-black/30 border-0 backdrop-blur-sm hover:bg-black/40"
          >
            <ChevronLeft className="h-6 w-6 text-white" />
            <span className="sr-only">Previous image</span>
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={handleNext}
            className="h-10 w-10 rounded-full bg-black/30 border-0 backdrop-blur-sm hover:bg-black/40"
          >
            <ChevronRight className="h-6 w-6 text-white" />
            <span className="sr-only">Next image</span>
          </Button>
        </div>
      </div>

      {/* Thumbnails */}
      <div className="absolute bottom-4 left-1/2 flex -translate-x-1/2 space-x-2 overflow-x-auto p-2">
        {images.map((image, index) => (
          <button
            key={image.id || `modal-thumb-${index}`}
            onClick={() => setCurrentIndex(index)}
            className={cn(
              "h-16 w-16 flex-shrink-0 rounded border-2",
              index === currentIndex ? "border-white" : "border-transparent opacity-60 hover:opacity-100",
            )}
          >
            <div className="relative h-full w-full overflow-hidden rounded">
              <Image
                src={image.url || "/placeholder.svg"}
                alt={image.alt || `Thumbnail ${index + 1}`}
                fill
                className="object-cover"
              />
            </div>
          </button>
        ))}
      </div>
    </div>
  )
}

