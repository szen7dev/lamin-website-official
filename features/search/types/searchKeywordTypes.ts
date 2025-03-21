/**
 * Interface for search keyword response
 */
export interface SearchKeyword {
  _id: string
  keyword: string
  count: number
  createdAt: string
  updatedAt: string
}

/**
 * Parameters for getting search keywords
 */
export interface GetSearchKeywordParams {
  optionSeller?: number
}

/**
 * Parameters for updating search keywords
 */
export interface UpdateSearchKeywordParams {
  keyword: string
  optionSeller?: number
} 