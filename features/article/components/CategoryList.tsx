import type { ArticleCategory } from '../types/articleTypes';

import Link from 'next/link';
import Image from 'next/image';

import { cn } from '@/utils/helpers';

interface CategoryListProps {
  categories: ArticleCategory[];
  activeSlug?: string;
}

export default function CategoryList({
  categories,
  activeSlug,
}: CategoryListProps) {
  return (
    <nav
      aria-label="Danh mục bài viết"
      className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-6">
      {categories.map(category => (
        <Link
          key={category.id}
          aria-current={activeSlug === category.slug ? 'page' : undefined}
          className={cn(
            'flex flex-col items-center rounded-lg p-4 transition-colors decoration-transparent',
            activeSlug === category.slug
              ? 'bg-primary-5 text-white'
              : 'bg-white hover:bg-primary-5/5',
          )}
          href={`/health-news/category/${category.slug}`}>
          <div className="relative mb-3 h-12 w-12 overflow-hidden rounded-full">
            <Image
              fill
              alt=""
              className="object-cover"
              src={category.thumbnailUrl || '/placeholder.svg'}
            />
          </div>
          <span
            className={cn(
              'text-center text-sm font-medium',
              activeSlug === category.slug ? 'text-white' : 'text-grayscale-90',
            )}>
            {category.name}
          </span>
        </Link>
      ))}
    </nav>
  );
}
