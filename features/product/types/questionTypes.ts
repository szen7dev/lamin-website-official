/**
 * Represents a single product question
 */
export interface Question {
  _id: string;
  name: string;
  note: string;
  goods: string;
}

/**
 * Represents a paginated list of questions
 */
export interface QuestionList {
  listRecords: Question[];
  limit: number | null;
  totalRecord: number;
  totalPage: number | null;
  nextCursor: string | null;
}

/**
 * Represents the API response for question list
 */
export interface QuestionListResponse {
  error: boolean;
  data: QuestionList;
  status: number;
}

/**
 * Parameters for fetching question list
 */
export interface QuestionListParams {
  goodsId: string;
  limit?: number;
  page?: number;
  cursor?: string;
}
