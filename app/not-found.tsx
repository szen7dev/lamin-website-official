'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { m } from 'framer-motion';

import { ArrowLeftIcon } from '@/components/icons';

export default function NotFound() {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  return (
    <div className="min-h-screen flex items-center justify-center bg-background px-4">
      <div className="max-w-lg w-full text-center">
        <m.div
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
          initial={{ opacity: 0, y: 20 }}
          transition={{ duration: 0.5 }}>
          <m.h1
            animate={{ scale: 1 }}
            className="text-8xl font-bold text-primary mb-2"
            initial={{ scale: 0.5 }}
            transition={{
              type: 'spring',
              stiffness: 260,
              damping: 20,
              delay: 0.2,
            }}>
            404
          </m.h1>
          <m.div
            animate={{ opacity: 1 }}
            initial={{ opacity: 0 }}
            transition={{ delay: 0.5, duration: 0.5 }}>
            <h2 className="text-2xl font-semibold text-grayscale-90 mb-4">
              Trang không tồn tại
            </h2>
            <p className="text-grayscale-60 mb-8">
              Trang bạn đang tìm kiếm có thể đã bị xóa, đổi tên hoặc tạm thời
              không khả dụng.
            </p>
          </m.div>
        </m.div>

        {/* Animated illustration */}
        <m.div
          animate={{ opacity: 1 }}
          className="mb-8 flex justify-center"
          initial={{ opacity: 0 }}
          transition={{ delay: 0.3, duration: 0.5 }}>
          <div className="relative w-64 h-64">
            <m.div
              animate={{
                scale: [1, 1.05, 1],
              }}
              className="absolute inset-0 bg-primary/5 rounded-full"
              transition={{
                repeat: Infinity,
                duration: 3,
                ease: 'easeInOut',
              }}
            />
            <m.div
              animate={{
                scale: [1, 1.1, 1],
              }}
              className="absolute inset-4 bg-primary/10 rounded-full"
              transition={{
                repeat: Infinity,
                duration: 2.5,
                ease: 'easeInOut',
                delay: 0.2,
              }}
            />
            <m.div
              animate={{
                rotate: [0, 10, -10, 0],
              }}
              className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-primary"
              transition={{
                repeat: Infinity,
                duration: 5,
                ease: 'easeInOut',
              }}>
              <svg
                fill="none"
                height="100"
                stroke="currentColor"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                viewBox="0 0 24 24"
                width="100"
                xmlns="http://www.w3.org/2000/svg">
                <circle cx="12" cy="12" r="10" />
                <line x1="12" x2="12" y1="8" y2="12" />
                <line x1="12" x2="12.01" y1="16" y2="16" />
              </svg>
            </m.div>
          </div>
        </m.div>

        <m.div
          animate={{ opacity: 1, y: 0 }}
          initial={{ opacity: 0, y: 20 }}
          transition={{ delay: 0.7, duration: 0.5 }}>
          <Link
            className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-primary text-white font-medium rounded-full hover:bg-primary-dark transition-colors duration-300"
            href="/">
            <ArrowLeftIcon className="w-4 h-4" />
            <span>Quay về trang chủ</span>
          </Link>
        </m.div>
      </div>
    </div>
  );
}
