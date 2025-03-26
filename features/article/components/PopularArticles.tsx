'use client';

import Link from 'next/link';

import { formatDate } from '@/utils/format';
import { useGetNews } from '@/features/homepage';

export default function PopularArticles() {
  const { news: articles } = useGetNews();

  if (!articles || articles.length === 0) {
    return (
      <div className="py-4 text-center">
        <p className="text-grayscale-60">Không có bài viết phổ biến.</p>
      </div>
    );
  }

  return (
    <ul className="space-y-4">
      {articles.map((article, index) => (
        <li key={article._id}>
          <Link
            className="group flex gap-3 decoration-transparent"
            href={`/health-news/article/${article.slug}`}>
            <div className="flex h-6 w-6 flex-shrink-0 items-center justify-center rounded-full bg-primary-5/10 text-sm font-bold text-primary-40">
              {index + 1}
            </div>
            <div className="flex-1">
              <h3 className="line-clamp-2 text-sm font-medium text-grayscale-90 group-hover:text-primary-40">
                {article.title}
              </h3>
              <div className="mt-1 flex items-center gap-2 text-xs text-grayscale-50">
                <time dateTime={article.createAt}>
                  {formatDate(article.createAt)}
                </time>
                <span>•</span>
                <span>{article.amountView} lượt xem</span>
              </div>
            </div>
          </Link>
        </li>
      ))}
    </ul>
  );
}
