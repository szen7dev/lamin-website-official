import { Star } from 'lucide-react';
import Image from 'next/image';
import { useState } from 'react';
import { toast } from 'sonner';

import { usePostSendReview } from '../../hooks/usePostSendReview';

import { apiClient } from '@/services';
import { useAuth } from '@/hooks';
import { LoginModal } from '@/components/modal/LoginModal';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';

export interface Comment {
  _id: string;
  author: {
    _id: string;
    fullname: string;
    isStaff?: boolean;
    phone?: string;
    image: string | null;
    createAt: string;
    rating: number;
  };
  content: string;
  createAt: string;
  rating?: number;
  lastestReply?: Comment;
}

interface CommentListProps {
  comments: Comment[];
  type: number;
  showRating?: boolean;
  productId?: string;
}

export function CommentList({
  type,
  comments,
  showRating = false,
  productId,
}: CommentListProps) {
  const { user } = useAuth();
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
  const [replyingTo, setReplyingTo] = useState<string | null>(null);
  const [replyContent, setReplyContent] = useState('');

  const { mutate: sendReply, isPending } = usePostSendReview({
    onSuccess: data => {
      toast.success('Phản hồi đã được gửi thành công!');
      setReplyContent('');
      setReplyingTo(null);
    },
    onError: error => {
      toast.error('Có lỗi xảy ra khi gửi phản hồi. Vui lòng thử lại sau.');
      console.error('Reply submission error:', error);
    },
  });

  const formatDate = (date: string) => {
    if (!date) return '';

    const now = new Date();
    const commentDate = new Date(date);
    const diffInSeconds = Math.floor(
      (now.getTime() - commentDate.getTime()) / 1000,
    );

    // If less than 60 seconds, show "just now" or "X seconds ago"
    if (diffInSeconds < 60) {
      return diffInSeconds < 10 ? 'Vừa xong' : `${diffInSeconds} giây trước`;
    }

    // If less than 60 minutes, show "X minutes ago"
    const diffInMinutes = Math.floor(diffInSeconds / 60);

    if (diffInMinutes < 60) {
      return `${diffInMinutes} phút trước`;
    }

    // If less than 24 hours, show "X hours ago"
    const diffInHours = Math.floor(diffInMinutes / 60);

    if (diffInHours < 24) {
      return `${diffInHours} giờ trước`;
    }

    // If less than 7 days, show "X days ago"
    const diffInDays = Math.floor(diffInHours / 24);

    if (diffInDays < 7) {
      return `${diffInDays} ngày trước`;
    }

    // If less than 30 days, show "X weeks ago"
    if (diffInDays < 30) {
      const diffInWeeks = Math.floor(diffInDays / 7);

      return `${diffInWeeks} tuần trước`;
    }

    // If less than 365 days, show "X months ago"
    if (diffInDays < 365) {
      const diffInMonths = Math.floor(diffInDays / 30);

      return `${diffInMonths} tháng trước`;
    }

    // Otherwise, show "X years ago"
    const diffInYears = Math.floor(diffInDays / 365);

    return `${diffInYears} năm trước`;
  };

  const handleReplySubmit = (commentId: string) => {
    if (!replyContent.trim()) {
      toast.error('Vui lòng nhập nội dung phản hồi');

      return;
    }

    if (!productId) {
      toast.error('Thiếu thông tin sản phẩm');
      console.error('Missing productId');

      return;
    }

    sendReply({
      goodsID: productId,
      parentID: commentId,
      content: replyContent.trim(),
      type: type,
    });
  };

  return (
    <div className="space-y-8">
      {comments.map(comment => (
        <div key={comment._id} className="relative pl-12 pb-8">
          {/* Timeline line */}
          {comment.lastestReply && (
            <div className="absolute left-5 top-10 bottom-0 w-[1px] bg-gray-200" />
          )}

          <div className="relative">
            {/* User Avatar */}
            <div className="absolute -left-12 w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center">
              <Image
                alt={comment.author.fullname}
                className="w-full h-full object-cover rounded-full"
                height={40}
                src={
                  comment.author.image
                    ? apiClient.getUserImageUrl(comment.author.image)
                    : '/images/default-avatar.png'
                }
                width={40}
              />
            </div>

            {/* Comment Content */}
            <div>
              <h3 className="font-medium">{comment.author.fullname}</h3>
              {showRating && comment.rating && (
                <div className="flex items-center gap-1 mt-1">
                  <Star className="h-4 w-4 fill-[#FFB200] text-[#FFB200]" />
                  <span className="text-sm">{comment.rating}.0</span>
                </div>
              )}
              <p className="mt-1 text-grayscale-90">{comment.content}</p>
              <div className="flex items-center gap-2 mt-2 text-sm">
                <span className="text-gray-500">
                  {formatDate(comment.createAt)}
                </span>
                <span className="text-gray-300">•</span>
                {user ? (
                  <button
                    className="text-primary-50 hover:underline"
                    onClick={() => setReplyingTo(comment._id)}>
                    Trả lời
                  </button>
                ) : (
                  <button
                    className="text-primary-50 hover:underline"
                    onClick={() => setIsLoginModalOpen(true)}>
                    Trả lời
                  </button>
                )}
              </div>

              {/* Reply text area */}
              {replyingTo === comment._id && (
                <div className="mt-4 pl-4 border-l-2 border-gray-200">
                  <Textarea
                    className="w-full mb-2 min-h-[100px] bg-white"
                    placeholder="Nhập nội dung trả lời (Vui lòng gõ tiếng Việt có dấu)..."
                    value={replyContent}
                    onChange={e => setReplyContent(e.target.value)}
                  />
                  <div className="flex justify-end gap-2">
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => {
                        setReplyingTo(null);
                        setReplyContent('');
                      }}>
                      Hủy
                    </Button>
                    <Button
                      className="text-white"
                      disabled={isPending}
                      size="sm"
                      onClick={() => handleReplySubmit(comment._id)}>
                      {isPending && replyingTo === comment._id
                        ? 'Đang gửi...'
                        : 'Gửi'}
                    </Button>
                  </div>
                </div>
              )}

              {/* Staff Replies */}
              {comment.lastestReply && (
                <div className="mt-4 pl-12 relative">
                  {/* Staff Avatar */}
                  <div className="absolute -left-0 w-8 h-8 rounded-full overflow-hidden border-2 border-white">
                    <Image
                      alt={comment.lastestReply.author.fullname}
                      className="w-full h-full object-cover rounded-full"
                      height={32}
                      src={
                        comment.lastestReply.author.image
                          ? apiClient.getUserImageUrl(
                              comment.lastestReply.author.image,
                            )
                          : '/images/default-avatar.png'
                      }
                      width={32}
                    />
                  </div>

                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-medium">
                        {comment.lastestReply.author.fullname}
                      </span>
                    </div>
                    <p className="mt-1 text-grayscale-90 whitespace-pre-line">
                      {comment.lastestReply.content}
                    </p>
                    <div className="flex items-center gap-2 mt-2 text-sm">
                      <span className="text-gray-500">
                        {formatDate(comment.lastestReply.author.createAt)}
                      </span>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      ))}

      {/* Login Modal */}
      <LoginModal
        content="Vui lòng đăng nhập để trả lời bình luận"
        isOpen={isLoginModalOpen}
        onClose={() => setIsLoginModalOpen(false)}
      />
    </div>
  );
}
