'use client';

import { Suspense, useState } from 'react';

import Loading from '@/app/loading';
import ArticleTagList from '@/features/article/components/ArticleTagList';
import { useGetArticleTagList } from '@/features/article/hooks/useGetArticleTagList';

interface ClientArticleTagListProps {
  slug: string;
}

export function ClientArticleTagList({ slug }: ClientArticleTagListProps) {
  const PAGE_SIZE = 5;
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [lastestID, setLastestID] = useState<string>('');
  const [pageHistory, setPageHistory] = useState<string[]>(['']); // Track lastestID for each page

  const { articlesTags, pagination, isLoading, error } = useGetArticleTagList({
    limit: PAGE_SIZE,
    menuSlug: slug,
    lastestID,
  });

  // Handle page change
  const handlePageChange = (newPage: number) => {
    if (newPage < 1) return;

    if (newPage > currentPage) {
      // Moving forward - use nextCursor from pagination
      if (pagination?.nextCursor) {
        setPageHistory(prev => {
          const updated = [...prev];
          updated[newPage - 1] = pagination.nextCursor;
          return updated;
        });
        setLastestID(pagination.nextCursor);
        setCurrentPage(newPage);
      }
    } else {
      // Moving backward - use stored lastestID from pageHistory
      const previousLastestID = pageHistory[newPage - 1] || '';
      setLastestID(previousLastestID);
      setCurrentPage(newPage);
    }
  };

  const totalRecords = pagination?.totalRecord || 0;
  const hasNextPage = !!pagination?.nextCursor;
  const hasPrevPage = currentPage > 1;

  return (
    <Suspense fallback={<Loading />}>
      <ArticleTagList
        articlesTags={articlesTags}
        error={error}
        isLoading={isLoading}
        currentPage={currentPage}
        totalRecords={totalRecords}
        pageSize={PAGE_SIZE}
        onPageChange={handlePageChange}
        hasNextPage={hasNextPage}
        hasPrevPage={hasPrevPage}
      />
    </Suspense>
  );
}
