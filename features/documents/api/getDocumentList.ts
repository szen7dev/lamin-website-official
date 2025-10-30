import { Document, GetDocumentListParams } from '../types/documentTypes';

import { apiClient } from '@/services/api/apiClient';

export const getDocumentList = async (
  params: GetDocumentListParams = {},
): Promise<Document[]> => {
  try {
    const queryParams: Record<string, any> = {};

    if (params.limit) queryParams.limit = params.limit;
    if (params.populates) queryParams.populates = params.populates;
    if (params.select) queryParams.select = params.select;
    if (params.parentID) queryParams.parentID = params.parentID;
    if (params.lastestID) queryParams.lastestID = params.lastestID;

    const response = await apiClient.get<Document[]>(
      '/api/document/list-document',
      queryParams,
    );

    return response.data || [];
  } catch (error) {
    console.error('Error fetching document list:', error);

    return [];
  }
};
