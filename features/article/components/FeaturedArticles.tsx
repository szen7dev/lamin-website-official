'use client';

import ArticleCard from './ArticleCard';

import { RelatedArticles, useGetNews } from '@/features';

export default function FeaturedArticles() {
  const { news: articles } = useGetNews();
  const mainArticle = articles[0];

  if (!articles || articles.length === 0) {
    return null;
  }

  return (
    <div className="grid grid-cols-1 gap-6 md:grid-cols-3 container">
      <div className="md:col-span-2">
        <ArticleCard article={mainArticle} variant="featured" />
      </div>
      <div className="space-y-6">
        <RelatedArticles haveHeader={false} />
      </div>
    </div>
  );
}
