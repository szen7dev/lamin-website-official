'use client';

import { useMemo, useState } from 'react';

import { useGetCommentsByProductID } from '../hooks/useGetReviews';

import { CommentList, Comment } from './shared/CommentList';

import { Button } from '@/components/ui/button';
import { cn } from '@/utils/helpers';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/hooks';
import { LoginModal } from '@/components/modal/LoginModal';
import { ReviewModal } from '@/components/modal/ReviewModal';

interface ProductQAProps {
  productId: string;
}

export default function ProductQA({ productId }: ProductQAProps) {
  const { toast } = useToast();

  const [selectedFilter, setSelectedFilter] = useState<
    'newest' | 'oldest' | 'helpful'
  >('newest');

  const { user } = useAuth();
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
  const [isReviewModalOpen, setIsReviewModalOpen] = useState(false);

  const {
    data: allQuestions,
    isLoading,
    isError,
  } = useGetCommentsByProductID({
    goodsID: productId,
    type: 1,
  });

  // Convert ProductReview[] to Comment[]
  const formattedComments = useMemo(() => {
    if (!allQuestions) return [];

    return allQuestions.map(
      (review): Comment => ({
        _id: review._id,
        author: {
          _id: review.author._id,
          fullname: review.author.fullname,
          phone: review.author.phone,
          image: review.author.image || null,
          createAt: review.author.createAt,
          rating: review.author.rating,
        },
        content: review.content,
        createAt: review.createAt,
        rating: review.rating,
        lastestReply: review.lastestReply
          ? {
              _id: review.lastestReply._id,
              author: {
                _id: review.lastestReply.author._id,
                fullname: review.lastestReply.author.fullname,
                phone: review.lastestReply.author.phone,
                image: review.lastestReply.author.image || null,
                createAt: review.lastestReply.author.createAt,
                rating: review.lastestReply.author.rating,
                isStaff: true, // Assuming replies are from staff
              },
              content: review.lastestReply.content,
              createAt: review.lastestReply.createAt,
            }
          : undefined,
      }),
    );
  }, [allQuestions]);

  const handleCommentButtonClick = () => {
    if (user) {
      setIsReviewModalOpen(true);
    } else {
      setIsLoginModalOpen(true);
    }
  };

  const handleReviewSubmit = () => {
    // This is handled by the ReviewModal's internal logic
    setIsReviewModalOpen(false);
  };

  return (
    <div className="space-y-6">
      {/* Title and comment count */}
      <div>
        <div className="flex items-center gap-2">
          <h2 className="text-xl font-bold text-grayscale-90">Hỏi đáp</h2>
          <span className="text-gray-500">
            ({allQuestions?.length || 0} bình luận)
          </span>
        </div>
        <Button
          className="mt-4 bg-primary-50 text-white hover:bg-primary-50/80 rounded-full text-sm font-medium px-5"
          onClick={handleCommentButtonClick}>
          Gửi bình luận
        </Button>
      </div>

      {/* Filter Row */}
      <div className="flex items-center gap-2">
        <span className="text-sm text-gray-500">Lọc theo:</span>
        <div className="flex gap-2">
          {[
            { id: 'newest', label: 'Mới nhất' },
            { id: 'oldest', label: 'Cũ nhất' },
            { id: 'helpful', label: 'Hữu ích nhất' },
          ].map(filter => (
            <button
              key={filter.id}
              className={cn(
                'px-4 py-1.5 rounded-full text-sm transition-colors',
                selectedFilter === filter.id
                  ? 'border-primary-50 border-[1px] text-primary-50'
                  : 'bg-white text-gray-600 border border-gray-200 hover:border-primary-5',
              )}
              onClick={() =>
                setSelectedFilter(filter.id as typeof selectedFilter)
              }>
              {filter.label}
            </button>
          ))}
        </div>
      </div>

      {/* Questions List */}
      <CommentList
        comments={formattedComments}
        productId={productId}
        type={1}
      />

      {/* Login Modal */}
      <LoginModal
        content="Vui lòng đăng nhập để có thể gửi bình luận"
        isOpen={isLoginModalOpen}
        onClose={() => setIsLoginModalOpen(false)}
      />

      {/* Review Modal for Q&A */}
      <ReviewModal
        header="Hỏi đáp"
        isOpen={isReviewModalOpen}
        productId={productId}
        type={1}
        onClose={() => setIsReviewModalOpen(false)}
        onSubmit={handleReviewSubmit}
      />
    </div>
  );
}
