'use client';

import { useState } from 'react';
import { Star } from 'lucide-react';

import { CommentList } from './shared/CommentList';

import { Button } from '@/components/ui/button';
import { useReviews } from '@/features/product/hooks/useReviews';
import { cn } from '@/utils/helpers';
import { useMediaQuery } from '@/hooks/useMediaQuery';

interface ProductReviewsProps {
  productId: string;
}

export default function ProductReviews({ productId }: ProductReviewsProps) {
  // const [showReviewForm, setShowReviewForm] = useState(false);
  const [selectedFilter, setSelectedFilter] = useState<number>(5);
  const { reviews } = useReviews(productId);
  const isMobile = useMediaQuery('(max-width: 768px)');

  const totalReviews = reviews.length;
  // const averageRating =
  //   reviews.length > 0
  //     ? reviews.reduce((acc, review) => acc + review.rating, 0) / reviews.length
  //     : 0;

  // Calculate rating distribution
  const ratingCounts = Array.from({ length: 5 }, (_, i) => {
    const rating = 5 - i;

    return reviews.filter(review => review.rating === rating).length;
  });

  const filteredReviews = selectedFilter
    ? reviews.filter(review => review.rating === selectedFilter)
    : reviews;

  if (isMobile) {
    return (
      <div className="space-y-6">
        {/* Header with review count */}
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-bold text-grayscale-90">
            Đánh giá sản phẩm{' '}
            <span className="text-gray-500 font-normal">
              ({totalReviews} đánh giá)
            </span>
          </h2>
        </div>

        {/* Rating Summary */}
        <div className="border-t border-b border-gray-200 py-4">
          <div className="flex flex-col space-y-3">
            {/* Rating header */}
            <div className="flex items-center justify-between">
              <div className="flex flex-col items-start">
                <span className="text-lg text-gray-700">Tuyệt vời</span>
                <div className="flex items-center gap-2">
                  <span className="text-4xl font-bold">5.0</span>
                  <Star className="h-6 w-6 fill-[#FFB200] text-[#FFB200]" />
                </div>
              </div>

              {/* Review button */}
              <div className="mt-4">
                <Button
                  className="w-full bg-primary-50 text-white rounded-full hover:bg-primary-50/80"
                  // onClick={() => setShowReviewForm(true)}
                >
                  Gửi đánh giá
                </Button>
              </div>
            </div>

            {/* Rating bars */}
            <div className="space-y-2 mt-2">
              {[5, 4, 3, 2, 1].map(rating => {
                const count = ratingCounts[5 - rating];
                const percentage =
                  totalReviews > 0 ? (count / totalReviews) * 100 : 0;

                return (
                  <div key={rating} className="flex items-center gap-2">
                    <div className="flex items-center">
                      {Array.from({ length: 5 }).map((_, idx) => (
                        <Star
                          key={idx}
                          className={cn(
                            'h-4 w-4',
                            idx < rating
                              ? 'fill-[#FFB200] text-[#FFB200]'
                              : 'fill-gray-200 text-gray-200',
                          )}
                        />
                      ))}
                    </div>
                    <div className="flex-1 h-2 bg-gray-100 rounded-full">
                      <div
                        className="h-full bg-[#FFB200] rounded-full"
                        style={{ width: `${percentage}%` }}
                      />
                    </div>
                    <span className="w-8 text-right text-sm text-gray-500">
                      {count}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Filter Row */}
        <div>
          <div className="mb-2 text-gray-600">Lọc theo:</div>
          <div className="flex flex-wrap gap-2">
            {[5, 4, 3, 2, 1].map(stars => (
              <button
                key={stars}
                className={cn(
                  'px-4 py-1.5 rounded-full text-sm transition-colors',
                  selectedFilter === stars
                    ? 'bg-white border-[1px] border-primary-50 text-primary-50'
                    : 'bg-white text-gray-600 border border-gray-200 hover:border-primary-5',
                )}
                onClick={() => setSelectedFilter(stars)}>
                {stars} sao
              </button>
            ))}
          </div>
        </div>

        {/* Reviews List */}
        <CommentList showRating comments={filteredReviews} />
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Rating Summary - 2 Columns */}
      <div className="grid grid-cols-5 gap-8">
        {/* Left Column */}
        <div className="flex flex-col items-start space-y-4 max-w-[200px] col-span-1">
          <span className="text-lg">Tuyệt vời</span>
          <div className="flex items-center gap-2">
            <span className="text-4xl font-bold">5.0</span>
            <Star className="h-6 w-6 fill-[#FFB200] text-[#FFB200]" />
          </div>
          <Button
            className="w-full bg-primary-50 text-white rounded-full hover:bg-primary-50/80"
            // onClick={() => setShowReviewForm(true)}
          >
            Gửi đánh giá
          </Button>
        </div>

        {/* Right Column */}
        <div className="space-y-2 col-span-2">
          {[5, 4, 3, 2, 1].map(rating => {
            const count = ratingCounts[5 - rating];
            const percentage =
              totalReviews > 0 ? (count / totalReviews) * 100 : 0;

            return (
              <div key={rating} className="flex items-center gap-2">
                <div className="flex items-center w-24">
                  <div className="flex">
                    {Array.from({ length: 5 }).map((_, idx) => (
                      <Star
                        key={idx}
                        className={cn(
                          'h-3 w-3',
                          idx < rating
                            ? 'fill-[#FFB200] text-[#FFB200]'
                            : 'fill-gray-200 text-gray-200',
                        )}
                      />
                    ))}
                  </div>
                </div>
                <div className="flex-1 h-2 bg-gray-100 rounded-full">
                  <div
                    className="h-full bg-[#FFB200] rounded-full"
                    style={{ width: `${percentage}%` }}
                  />
                </div>
                <span className="w-8 text-right text-sm text-gray-500">
                  {count}
                </span>
              </div>
            );
          })}
        </div>
      </div>

      {/* Filter Row */}
      <div className="flex items-center gap-2">
        <span className="text-sm text-gray-500">Lọc theo:</span>
        <div className="flex gap-2">
          {[5, 4, 3, 2, 1].map(stars => (
            <button
              key={stars}
              className={cn(
                'px-4 py-1.5 rounded-full text-sm transition-colors',
                selectedFilter === stars
                  ? 'bg-white border-[1px] border-primary-50 text-primary-50'
                  : 'bg-white text-gray-600 border border-gray-200 hover:border-primary-5',
              )}
              onClick={() => setSelectedFilter(stars)}>
              {stars} sao
            </button>
          ))}
        </div>
      </div>

      {/* Reviews List */}
      <CommentList showRating comments={filteredReviews} />
    </div>
  );
}
