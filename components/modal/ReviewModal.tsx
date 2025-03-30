'use client';
import { useState } from 'react';
import Image from 'next/image';
import { Star } from 'lucide-react';
import { toast } from 'sonner';

import { usePostSendReview } from '@/features/product/hooks/usePostSendReview';
import { Button } from '@/components/ui/button';
import { Modal } from '@/components/ui/Modal';
import { Textarea } from '@/components/ui/textarea';
import { apiClient } from '@/services';

interface ReviewModalProps {
  type?: number;
  header: string;
  productName?: string;
  productImage?: string;
  productId?: string;
  optionSeller?: string;
  isOpen: boolean;
  onClose: () => void;
  onSubmit?: (rating: number, content: string) => void;
}

export function ReviewModal({
  type,
  isOpen,
  header,
  productName,
  productImage,
  productId,
  onClose,
  onSubmit,
}: ReviewModalProps) {
  const [rating, setRating] = useState(4);
  const [hoveredRating, setHoveredRating] = useState(0);
  const [content, setContent] = useState('');

  const { mutate: sendReview, isPending } = usePostSendReview({
    onSuccess: data => {
      toast.success('Đánh giá đã được gửi thành công!');
      setContent('');
      if (onSubmit) {
        onSubmit(rating, content);
      }
      onClose();
    },
    onError: error => {
      toast.error('Có lỗi xảy ra khi gửi đánh giá. Vui lòng thử lại sau.');
      console.error('Review submission error:', error);
    },
  });

  const handleSubmit = () => {
    if (!content.trim()) {
      toast.error('Vui lòng nhập nội dung đánh giá');

      return;
    }

    if (!productId) {
      toast.error('Thiếu thông tin sản phẩm');
      console.error('Missing productId');

      return;
    }

    // Ensure rating is a valid number between 1-5
    const validRating = Number.isNaN(rating)
      ? 5
      : Math.min(Math.max(Math.round(rating), 1), 5);

    sendReview({
      goodsID: productId,
      content: content.trim(),
      rating: validRating,
      type,
    });
  };

  // Map rating to sentiment text
  const getSentimentText = (stars: number) => {
    switch (stars) {
      case 1:
        return 'Rất không hài lòng';
      case 2:
        return 'Không hài lòng';
      case 3:
        return 'Bình thường';
      case 4:
        return 'Hài lòng';
      case 5:
        return 'Rất hài lòng';
      default:
        return 'Hài lòng';
    }
  };

  return (
    <Modal className="max-w-xl p-6 bg-white" isOpen={isOpen} onClose={onClose}>
      <div className="flex flex-col items-center">
        <h2 className="text-xl font-bold mb-4">{header}</h2>

        {productName && productImage && (
          <div className="flex items-center mb-6 w-full">
            <div className="w-20 h-20 relative flex-shrink-0 border border-gray-200 rounded-md overflow-hidden">
              <Image
                fill
                alt={productName}
                className="object-cover"
                sizes="80px"
                src={apiClient.getFileUrl(productImage)}
              />
            </div>
            <p className="text-gray-600 ml-3 text-left">{productName}</p>
          </div>
        )}

        {type === 2 && (
          <div className="flex flex-col items-center w-full mb-6">
            <div className="flex justify-center mb-2 gap-3">
              {[1, 2, 3, 4, 5].map(star => (
                <Star
                  key={star}
                  className={`h-8 w-8 cursor-pointer ${
                    (hoveredRating || rating) >= star
                      ? 'fill-[#FFB200] text-[#FFB200]'
                      : 'fill-gray-200 text-gray-200'
                  }`}
                  onClick={() => setRating(star)}
                  onMouseEnter={() => setHoveredRating(star)}
                  onMouseLeave={() => setHoveredRating(0)}
                />
              ))}
            </div>
            <p className="text-[#FFB200] font-medium">
              {getSentimentText(hoveredRating || rating)}
            </p>
          </div>
        )}
        <Textarea
          className="w-full mb-4 min-h-[120px] bg-white"
          placeholder="Nhập nội dung trả lời (Vui lòng gõ tiếng Việt có dấu)..."
          value={content}
          onChange={e => setContent(e.target.value)}
        />

        <div className="w-full space-y-3">
          <Button
            className="w-full bg-primary text-white hover:bg-primary/90 rounded-full"
            disabled={isPending}
            onClick={handleSubmit}>
            {isPending ? 'Đang gửi...' : 'Gửi đánh giá'}
          </Button>
        </div>
      </div>
    </Modal>
  );
}
