'use client';

import { Suspense, useEffect, useState } from 'react';

import Loading from '@/app/loading';
import ArticleTagList from '@/features/article/components/ArticleTagList';
import { Article } from '@/features/article/types/articleTypes';
import { useGetArticleTagList } from '@/features/article/hooks/useGetArticleTagList';

interface ClientArticleTagListProps {
  slug: string;
}

export function ClientArticleTagList({ slug }: ClientArticleTagListProps) {
  const [lastestID, setLastestID] = useState<string>('');
  const [allArticles, setAllArticles] = useState<Article[]>([]);
  const [hasMore, setHasMore] = useState<boolean>(true);
  const { articlesTags, pagination, isLoading, error } = useGetArticleTagList({
    limit: 5,
    menuSlug: slug,
    lastestID,
  });

  // Initialize or update articles when data is fetched
  useEffect(() => {
    if (articlesTags && articlesTags.length > 0) {
      if (lastestID === '') {
        // First load - replace all articles
        setAllArticles(articlesTags);
      } else {
        // Load more - append new articles
        setAllArticles(prev => [...prev, ...articlesTags]);
      }

      // Check if there are more articles to load
      if (pagination?.nextCursor) {
        setHasMore(true);
      } else {
        setHasMore(false);
      }
    } else if (articlesTags && articlesTags.length === 0) {
      setHasMore(false);
    }
  }, [articlesTags, pagination, lastestID]);

  // Function to handle loading more articles
  const handleLoadMore = () => {
    if (pagination?.nextCursor) {
      setLastestID(pagination.nextCursor);
    } else {
      // Set lastestID to the _id of the last item in articlesTags
      if (articlesTags.length > 0) {
        setLastestID(articlesTags[articlesTags.length - 1]._id);
      }
    }
  };

  return (
    <Suspense fallback={<Loading />}>
      <ArticleTagList
        articlesTags={allArticles}
        error={error}
        hasMore={hasMore}
        isLoading={isLoading && allArticles.length === 0}
        isLoadingMore={isLoading && allArticles.length > 0}
        onLoadMore={handleLoadMore}
      />
    </Suspense>
  );
}
