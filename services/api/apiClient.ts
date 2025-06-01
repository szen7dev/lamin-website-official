import axios, {
  type AxiosInstance,
  type AxiosRequestConfig,
  type InternalAxiosRequestConfig,
} from 'axios';

import { sanitizeUrl } from '@/utils/helpers';
import { normalizeResponse } from '@/utils';
import { Pagination } from '@/types';

const environment = process.env.NEXT_PUBLIC_ENVIRONMENT || 'dev';
const API_URL = process.env.NEXT_PUBLIC_API_URL || '';
const DEFAULT_TIMEOUT = Number.parseInt(
  process.env.NEXT_PUBLIC_API_TIMEOUT || '30000',
);
const CLOUDFRONT_URL = process.env.NEXT_PUBLIC_CLOUDFRONT_URL || '';
const DEFAULT_TOKEN = process.env.NEXT_PUBLIC_DEFAULT_TOKEN || '';

if (!API_URL) console.warn('Missing NEXT_PUBLIC_API_URL. API calls may fail.');
if (!CLOUDFRONT_URL)
  console.warn(
    'Missing NEXT_PUBLIC_CLOUDFRONT_URL. Media files may not load correctly.',
  );

export const DEFAULT_OPTION_SELLER = 1;

class ApiClient {
  private instance: AxiosInstance;
  private token: string | null = null;

  constructor() {
    this.instance = axios.create({
      baseURL: API_URL,
      timeout: DEFAULT_TIMEOUT,
      headers: { 'Content-Type': 'application/json' },
    });

    this.instance.interceptors.request.use(
      this.requestInterceptor.bind(this),
      this.handleError,
    );
    this.instance.interceptors.response.use(
      this.responseInterceptor,
      this.handleError,
    );
  }

  private requestInterceptor(config: InternalAxiosRequestConfig) {
    if (environment === 'dev') {
      console.log('🚀 API Request:', config);
    }
    if (this.token) {
      config.headers.set('Authorization', `Bearer ${this.token}`);
    }

    return config;
  }

  private responseInterceptor(response: any) {
    if (environment === 'dev') {
      console.log('✅ API Response:', response);
    }

    return response;
  }

  private handleError(error: any) {
    console.error('❌ API Error:', error);

    return Promise.reject(error);
  }

  public setToken(token: string): void {
    this.token = token;
  }

  public getToken(): string | null {
    return this.token;
  }

  public clearToken(): void {
    this.token = null;
  }

  private getAuthHeaders(requireAuth: boolean): Record<string, string> {
    const token = this.token || DEFAULT_TOKEN;

    return requireAuth && token ? { Authorization: `Bearer ${token}` } : {};
  }

  private async request<T = any>(
    method: string,
    url: string,
    dataOrParams?: any,
    requireAuth = true,
  ): Promise<{
    status: number;
    data: T;
    pagination: Pagination;
    information?: any;
  }> {
    const config: AxiosRequestConfig = {
      method: method as any,
      url,
      headers: {
        'Content-Type': 'application/json',
        ...this.getAuthHeaders(requireAuth),
      },
    };

    if (['get', 'delete'].includes(method)) config.params = dataOrParams;
    else config.data = dataOrParams;

    const response = await this.instance.request(config);
    const pagination = response.data.data
      ? {
          limit: response.data.data.limit,
          nextCursor: response.data.data.nextCursor,
          totalRecord: response.data.data.totalRecord,
          totalPage: response.data.data.totalPage,
        }
      : {
          limit: 0,
          nextCursor: '',
          totalRecord: 0,
          totalPage: 0,
        };

    const { data: _, ...rest } = response.data || {};

    return {
      status: response.status,
      data: normalizeResponse<T>(response.data),
      pagination,
      information: rest,
    };
  }

  public get = <T = any>(url: string, params?: any, requireAuth = true) =>
    this.request<T>('get', url, params, requireAuth);

  public post = <T = any>(url: string, data?: any, requireAuth = true) =>
    this.request<T>('post', url, data, requireAuth);

  public put = <T = any>(url: string, data?: any, requireAuth = true) =>
    this.request<T>('put', url, data, requireAuth);

  public delete = <T = any>(url: string, requireAuth = true) =>
    this.request<T>('delete', url, undefined, requireAuth);

  private buildMediaUrl(path: string, subPath = ''): string {
    if (!path) return '';
    const sanitizedPath = sanitizeUrl(path);

    if (!CLOUDFRONT_URL) return sanitizedPath;
    const base = CLOUDFRONT_URL.replace(/\/$/, '') + subPath;

    return `${base}${sanitizedPath.startsWith('/') ? '' : '/'}${sanitizedPath}`;
  }

  public getFileUrl(path: string): string {
    return this.buildMediaUrl(path);
  }

  public getContactImageUrl(path: string): string {
    return this.buildMediaUrl(path, '/files/db/contacts');
  }

  public getUserImageUrl(path: string): string {
    return this.buildMediaUrl(path, '/files/db/users');
  }
}

export const apiClient = new ApiClient();
export default apiClient;
