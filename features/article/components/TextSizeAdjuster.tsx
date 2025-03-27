'use client';

import { useState, useEffect } from 'react';

import { Button } from '@/components/ui/button';

type TextSize = 'default' | 'large';

interface TextSizeAdjusterProps {
  className?: string;
}

export default function TextSizeAdjuster({
  className = '',
}: TextSizeAdjusterProps) {
  const [activeSize, setActiveSize] = useState<TextSize>('default');

  useEffect(() => {
    // Apply text size to article content
    const articleContent = document.querySelector('.article-content');

    if (articleContent) {
      // Remove existing classes
      articleContent.classList.remove('text-base', 'text-lg');

      // Add transition classes
      if (!articleContent.classList.contains('transition-all')) {
        articleContent.classList.add(
          'transition-all',
          'duration-300',
          'delay-100',
        );
      }

      // Apply text size classes to paragraphs and list items only
      const textElements = articleContent.querySelectorAll('p, li, td');

      textElements.forEach(element => {
        element.classList.remove(
          'text-base',
          'text-lg',
          'leading-normal',
          'leading-relaxed',
        );

        if (!element.classList.contains('transition-all')) {
          element.classList.add('transition-all', 'duration-300', 'delay-100');
        }

        if (activeSize === 'default') {
          element.classList.add('text-base', 'leading-normal');
        } else {
          element.classList.add('text-lg', 'leading-relaxed');
        }
      });
    }
  }, [activeSize]);

  return (
    <div className={`flex items-center gap-2 ${className}`}>
      <span className="text-sm text-grayscale-50">Kích thước chữ</span>
      <div className="flex p-1 bg-[#f5f5f5] w-max h-max rounded-full">
        <Button
          className={`rounded-full border-0 ${
            activeSize === 'default'
              ? 'bg-primary text-white hover:bg-primary/90'
              : 'bg-[#f5f5f5] text-black hover:bg-gray-50'
          }`}
          size="sm"
          variant={activeSize === 'default' ? 'default' : 'outline'}
          onClick={() => setActiveSize('default')}>
          Mặc định
        </Button>
        <Button
          className={`rounded-full border-0 ${
            activeSize === 'large'
              ? 'bg-primary text-white hover:bg-primary/90'
              : 'bg-[#f5f5f5] text-black hover:bg-gray-50'
          }`}
          size="sm"
          variant={activeSize === 'large' ? 'default' : 'outline'}
          onClick={() => setActiveSize('large')}>
          Lớn hơn
        </Button>
      </div>
    </div>
  );
}
