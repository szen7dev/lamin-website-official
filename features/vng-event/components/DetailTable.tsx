'use client';

import { format } from 'date-fns';
import { useMemo, useState } from 'react';
import Image from 'next/image';
import dynamic from 'next/dynamic';

import { Fund } from '../types/fund';

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { formatNumber } from '@/utils';
import { Button } from '@/components/ui/button';

// Dynamically import the modal to avoid SSR issues
const ImageGalleryModal = dynamic(
  () => import('@/features/product/components/ImageGalleryModal'),
  {
    ssr: false,
  },
);

interface DetailTableProps {
  donation: Fund;
}

const DetailTable: React.FC<DetailTableProps> = ({ donation }) => {
  const [modalOpen, setModalOpen] = useState(false);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  // Example images for demonstration (since real data might not be available)
  const processedImages = useMemo(() => {
    // Demo images from public directory - in a real scenario, we would use donation.images
    const demoImages = [
      '/images/qrCode.jpg',
      '/images/logo.jpg',
      '/images/payment/momo.png',
      '/images/payment/vnpay.png',
      '/images/payment/zalopay.png',
      '/images/payment/bank.png',
      '/images/payment/cash.png',
      '/images/coach_pages.png',
    ];

    return demoImages.map((image, index) => ({
      url: image,
      alt: `${donation.name || 'Donation'} image ${index + 1}`,
      id: `donation-img-${donation._id}-${index}`,
    }));
  }, [donation._id, donation.name]);

  // Constants for gallery display
  const MAX_GALLERY_IMAGES = 4;
  const hasMoreImages = processedImages.length > MAX_GALLERY_IMAGES;
  const displayImages = processedImages.slice(0, MAX_GALLERY_IMAGES);
  const remainingImagesCount = processedImages.length - MAX_GALLERY_IMAGES;

  const handleImageClick = (index: number) => {
    setCurrentImageIndex(index);
    setModalOpen(true);
  };

  return (
    <>
      <div className="overflow-x-auto mb-4">
        <Table>
          <TableHeader className="bg-[#E6EEF6]">
            <TableRow>
              <TableHead className="py-3 px-4 font-semibold text-gray-700 border-b">
                Ngày
              </TableHead>
              <TableHead className="py-3 px-4 font-semibold text-gray-700 border-b">
                Họ và tên
              </TableHead>
              <TableHead className="py-3 px-4 font-semibold text-gray-700 border-b">
                Địa chỉ
              </TableHead>
              <TableHead className="py-3 px-4 font-semibold text-gray-700 border-b">
                Số tiền quyên góp
              </TableHead>
              <TableHead className="py-3 px-4 font-semibold text-gray-700 border-b">
                Sự kiện
              </TableHead>
              <TableHead className="py-3 px-4 font-semibold text-gray-700 border-b">
                Ghi chú
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            <TableRow className="hover:bg-gray-50">
              <TableCell className="py-3 px-4 text-sm">
                {donation.date
                  ? format(new Date(donation.date), 'dd/MM/yyyy')
                  : '-'}
              </TableCell>
              <TableCell className="py-3 px-4 text-sm">
                {donation.name || '-'}
              </TableCell>
              <TableCell className="py-3 px-4 text-sm">
                {donation.address || '-'}
              </TableCell>
              <TableCell className="py-3 px-4 text-sm">
                {donation.amount ? formatNumber(donation.amount) : '0'}
              </TableCell>
              <TableCell className="py-3 px-4 text-sm">
                {donation.event?.name || '-'}
              </TableCell>
              <TableCell className="py-3 px-4 text-sm">
                {donation.note || '-'}
              </TableCell>
            </TableRow>
          </TableBody>
        </Table>
      </div>

      {processedImages.length > 0 && (
        <div className="mt-6">
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            {displayImages.map((image, index) => (
              <button
                key={image.id}
                aria-label={`View ${image.alt}`}
                className="relative aspect-square rounded-lg overflow-hidden border-0 p-0 w-full"
                type="button"
                onClick={() => handleImageClick(index)}>
                <Image
                  fill
                  alt={image.alt}
                  className="object-contain hover:scale-105 transition-transform duration-300"
                  sizes="(max-width: 640px) 50vw, 25vw"
                  src={image.url}
                />
                {index === 3 && hasMoreImages && (
                  <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                    <span className="text-white font-medium text-lg">
                      +{remainingImagesCount}
                    </span>
                  </div>
                )}
              </button>
            ))}
          </div>

          {processedImages.length > 0 && (
            <div className="flex justify-end mt-3">
              <Button
                className="text-sm"
                size="sm"
                variant="outline"
                onClick={() => setModalOpen(true)}>
                Xem tất cả hình ảnh
              </Button>
            </div>
          )}
        </div>
      )}

      {/* Image Gallery Modal */}
      {modalOpen && (
        <ImageGalleryModal
          images={processedImages}
          initialIndex={currentImageIndex}
          isOpen={modalOpen}
          onClose={() => setModalOpen(false)}
        />
      )}
    </>
  );
};

export default DetailTable;
