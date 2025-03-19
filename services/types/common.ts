// Common types used across services

export interface PaginationParams {
  page?: number
  limit?: number
  cursor?: string
}

export interface PaginatedResponse<T> {
  listRecords: T[]
  totalRecord: number
  totalPage: number
  limit: number
  nextCursor: string | null
}

// Thêm enum ErrorType
export enum ErrorType {
  API_ERROR = "API_ERROR",
  NETWORK_ERROR = "NETWORK_ERROR",
  TIMEOUT_ERROR = "TIMEOUT_ERROR",
  SERVER_ERROR = "SERVER_ERROR",
  AUTH_ERROR = "AUTH_ERROR",
  VALIDATION_ERROR = "VALIDATION_ERROR",
  UNKNOWN_ERROR = "UNKNOWN_ERROR",
}

// Cập nhật ApiResponse interface để thêm code
export interface ApiResponse<T = any> {
  error: boolean
  status?: number
  code?: ErrorType
  message?: string
  data: T
}

export interface BaseEntity {
  _id: string
  createAt: string
  modifyAt: string
  state: number
  company: string
  userCreate: string
  userUpdate?: string
}

// Common error types
// Cập nhật ApiError class để sử dụng ErrorType
export class ApiError extends Error {
  constructor(
    public status: number,
    public code: ErrorType,
    message: string,
    public data?: any,
  ) {
    super(message)
    this.name = "ApiError"
  }
}

// Common query params
export interface CommonQueryParams {
  optionSeller?: number
  keyword?: string
  usage?: number
}

