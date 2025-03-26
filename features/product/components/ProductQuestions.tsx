'use client';

import type React from 'react';

import { useState } from 'react';
import { ChevronDown, MessageCircle, Plus } from 'lucide-react';

import { useProductQuestions } from '../hooks/useProductQuestions';

import { Button } from '@/components/ui/button';
import { cn } from '@/utils/helpers';

interface ProductQuestionsProps {
  productId: string;
}

export default function ProductQuestions({ productId }: ProductQuestionsProps) {
  const { data: questions = [], isLoading } = useProductQuestions(productId);
  const [openId, setOpenId] = useState<string | null>(null);
  const [showAskForm, setShowAskForm] = useState(false);
  const [question, setQuestion] = useState('');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!question || !name || !email) return;

    setIsSubmitting(true);

    // Simulate API call
    setTimeout(() => {
      setQuestion('');
      setName('');
      setEmail('');
      setIsSubmitting(false);
      setShowAskForm(false);
    }, 1000);
  };

  if (isLoading) {
    return (
      <div className="py-8 text-center text-grayscale-60">
        Đang tải câu hỏi...
      </div>
    );
  }

  return (
    <div className="rounded-lg border border-grayscale-20">
      <div className="border-b border-grayscale-20 p-6">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-bold text-grayscale-90">
            Hỏi đáp về sản phẩm
          </h2>
          <Button
            className="flex items-center gap-2 bg-primary-5 text-white hover:bg-primary-20"
            onClick={() => setShowAskForm(!showAskForm)}>
            <Plus className="h-4 w-4" />
            <span>Đặt câu hỏi</span>
          </Button>
        </div>

        {/* Ask Question Form */}
        {showAskForm && (
          <form
            className="mt-6 space-y-4 rounded-lg bg-grayscale-5 p-4"
            onSubmit={handleSubmit}>
            <div>
              <label
                className="mb-1 block text-sm font-medium text-grayscale-90"
                htmlFor="question">
                Câu hỏi của bạn <span className="text-error-5">*</span>
              </label>
              <textarea
                required
                className="w-full rounded-lg border border-grayscale-20 p-3 text-sm"
                id="question"
                placeholder="Nhập câu hỏi của bạn về sản phẩm này"
                rows={3}
                value={question}
                onChange={e => setQuestion(e.target.value)}
              />
            </div>

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div>
                <label
                  className="mb-1 block text-sm font-medium text-grayscale-90"
                  htmlFor="name">
                  Họ tên <span className="text-error-5">*</span>
                </label>
                <input
                  required
                  className="w-full rounded-lg border border-grayscale-20 p-3 text-sm"
                  id="name"
                  placeholder="Nhập họ tên của bạn"
                  type="text"
                  value={name}
                  onChange={e => setName(e.target.value)}
                />
              </div>
              <div>
                <label
                  className="mb-1 block text-sm font-medium text-grayscale-90"
                  htmlFor="email">
                  Email <span className="text-error-5">*</span>
                </label>
                <input
                  required
                  className="w-full rounded-lg border border-grayscale-20 p-3 text-sm"
                  id="email"
                  placeholder="Nhập email của bạn"
                  type="email"
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                />
              </div>
            </div>

            <div className="flex justify-end gap-3">
              <Button
                className="border-grayscale-20 text-grayscale-60 hover:bg-grayscale-10"
                type="button"
                variant="outline"
                onClick={() => setShowAskForm(false)}>
                Hủy
              </Button>
              <Button
                className="bg-primary-5 text-white hover:bg-primary-20"
                disabled={isSubmitting}
                type="submit">
                {isSubmitting ? 'Đang gửi...' : 'Gửi câu hỏi'}
              </Button>
            </div>
          </form>
        )}
      </div>

      <div className="divide-y divide-grayscale-20">
        {questions.length > 0 ? (
          questions.map(question => (
            <div key={question.id} className="p-6">
              <button
                className="flex w-full items-start justify-between text-left"
                onClick={() =>
                  setOpenId(openId === question.id ? null : question.id)
                }>
                <div className="flex items-start gap-3">
                  <MessageCircle className="mt-0.5 h-5 w-5 flex-shrink-0 text-primary-40" />
                  <div>
                    <p className="font-medium text-grayscale-90">
                      {question.question}
                    </p>
                    <p className="mt-1 text-sm text-grayscale-50">
                      Hỏi bởi: {question.author.name} •{' '}
                      {new Date(question.createdAt).toLocaleDateString('vi-VN')}
                    </p>
                  </div>
                </div>
                <ChevronDown
                  className={cn(
                    'h-5 w-5 flex-shrink-0 text-grayscale-40 transition-transform',
                    openId === question.id && 'rotate-180',
                  )}
                />
              </button>
              {openId === question.id && question.answer && (
                <div className="mt-4 ml-8 rounded-lg bg-grayscale-5 p-4">
                  <p className="text-sm text-grayscale-90">{question.answer}</p>
                  <p className="mt-2 text-xs text-grayscale-50">
                    Trả lời bởi: Dược sĩ Lamin •{' '}
                    {new Date(question.createdAt).toLocaleDateString('vi-VN')}
                  </p>
                </div>
              )}
            </div>
          ))
        ) : (
          <div className="p-6 text-center text-grayscale-60">
            <p>Chưa có câu hỏi nào về sản phẩm này.</p>
            <p className="mt-2">Hãy là người đầu tiên đặt câu hỏi!</p>
          </div>
        )}
      </div>
    </div>
  );
}
