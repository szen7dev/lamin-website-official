import { ApiError, type ApiResponse, ErrorType } from '../types/common';

import apiClient from './apiClient';

export abstract class BaseService {
  constructor(protected readonly basePath: string) {}

  protected async get<T>(
    path: string,
    params?: Record<string, any>,
    requireAuth = true,
  ): Promise<T> {
    try {
      const response = await apiClient.getNormalizedResponse<ApiResponse<T>>(
        `${this.basePath}${path}`,
        params,
        requireAuth,
      );

      if (response.error) {
        throw new ApiError(
          response.status || 500,
          response.code || ErrorType.API_ERROR,
          response.message || 'Unknown error',
          response.data,
        );
      }

      return response.data;
    } catch (error) {
      if (error instanceof ApiError) {
        throw error;
      }

      // Nếu lỗi đã được xử lý bởi apiClient
      if (error && typeof error === 'object' && 'type' in error) {
        const apiError = error as {
          type: string;
          status?: number;
          message?: string;
          data?: any;
        };

        throw new ApiError(
          apiError.status || 500,
          apiError.type as ErrorType,
          apiError.message || 'An error occurred',
          apiError.data,
        );
      }

      throw new ApiError(
        500,
        ErrorType.UNKNOWN_ERROR,
        'An unknown error occurred',
        error,
      );
    }
  }

  protected async post<T>(
    path: string,
    data?: Record<string, any>,
    requireAuth = true,
  ): Promise<T> {
    try {
      const response = await apiClient.postNormalizedResponse<ApiResponse<T>>(
        `${this.basePath}${path}`,
        data,
        requireAuth,
      );

      if (response.error) {
        throw new ApiError(
          response.status || 500,
          response.code || ErrorType.API_ERROR,
          response.message || 'Unknown error',
          response.data,
        );
      }

      return response.data;
    } catch (error) {
      if (error instanceof ApiError) {
        throw error;
      }

      // Nếu lỗi đã được xử lý bởi apiClient
      if (error && typeof error === 'object' && 'type' in error) {
        const apiError = error as {
          type: string;
          status?: number;
          message?: string;
          data?: any;
        };

        throw new ApiError(
          apiError.status || 500,
          apiError.type as ErrorType,
          apiError.message || 'An error occurred',
          apiError.data,
        );
      }

      throw new ApiError(
        500,
        ErrorType.UNKNOWN_ERROR,
        'An unknown error occurred',
        error,
      );
    }
  }

  protected async put<T>(
    path: string,
    data?: Record<string, any>,
    requireAuth = true,
  ): Promise<T> {
    try {
      const response = await apiClient.putNormalizedResponse<ApiResponse<T>>(
        `${this.basePath}${path}`,
        data,
        requireAuth,
      );

      if (response.error) {
        throw new ApiError(
          response.status || 500,
          response.code || ErrorType.API_ERROR,
          response.message || 'Unknown error',
          response.data,
        );
      }

      return response.data;
    } catch (error) {
      if (error instanceof ApiError) {
        throw error;
      }

      // Nếu lỗi đã được xử lý bởi apiClient
      if (error && typeof error === 'object' && 'type' in error) {
        const apiError = error as {
          type: string;
          status?: number;
          message?: string;
          data?: any;
        };

        throw new ApiError(
          apiError.status || 500,
          apiError.type as ErrorType,
          apiError.message || 'An error occurred',
          apiError.data,
        );
      }

      throw new ApiError(
        500,
        ErrorType.UNKNOWN_ERROR,
        'An unknown error occurred',
        error,
      );
    }
  }

  protected async delete<T>(path: string, requireAuth = true): Promise<T> {
    try {
      const response = await apiClient.deleteNormalizedResponse<ApiResponse<T>>(
        `${this.basePath}${path}`,
        requireAuth,
      );

      if (response.error) {
        throw new ApiError(
          response.status || 500,
          response.code || ErrorType.API_ERROR,
          response.message || 'Unknown error',
          response.data,
        );
      }

      return response.data;
    } catch (error) {
      if (error instanceof ApiError) {
        throw error;
      }

      // Nếu lỗi đã được xử lý bởi apiClient
      if (error && typeof error === 'object' && 'type' in error) {
        const apiError = error as {
          type: string;
          status?: number;
          message?: string;
          data?: any;
        };

        throw new ApiError(
          apiError.status || 500,
          apiError.type as ErrorType,
          apiError.message || 'An error occurred',
          apiError.data,
        );
      }

      throw new ApiError(
        500,
        ErrorType.UNKNOWN_ERROR,
        'An unknown error occurred',
        error,
      );
    }
  }
}
