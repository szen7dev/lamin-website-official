'use client';

import { useQuery } from '@tanstack/react-query';

import { getDocumentList } from '../api/getDocumentList';
import { GetDocumentListParams } from '../types/documentTypes';

export const useGetDocumentList = (params: GetDocumentListParams = {}) => {
  const { data, isLoading, error, refetch } = useQuery({
    queryKey: ['GET_DOCUMENT_LIST', params],
    queryFn: () => getDocumentList(params),
    staleTime: 1000 * 60 * 5, // 5 minutes
    enabled: !!params.parentID,
  });

  return {
    documents: data || [],
    isLoading,
    error,
    refetch,
  };
};
