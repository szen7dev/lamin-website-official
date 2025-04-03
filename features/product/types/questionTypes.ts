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
 * Parameters for fetching question list
 */
export interface QuestionListParams {
  goodsId?: string;
  slug?: string;
  limit?: number;
  page?: number;
  cursor?: string;
}
