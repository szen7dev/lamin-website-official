// import axios, {
//   type AxiosInstance,
//   type AxiosRequestConfig,
//   type InternalAxiosRequestConfig,
// } from 'axios';

// import { sanitizeUrl } from '@/utils/helpers';
// import { normalizeResponse } from '@/utils';

// const environment = process.env.NEXT_PUBLIC_ENVIRONMENT || 'dev';
// const API_URL = process.env.NEXT_PUBLIC_API_URL || '';
// const DEFAULT_TIMEOUT = Number.parseInt(
//   process.env.NEXT_PUBLIC_API_TIMEOUT || '30000',
// );
// const CLOUDFRONT_URL = process.env.NEXT_PUBLIC_CLOUDFRONT_URL || '';
// const DEFAULT_TOKEN = process.env.NEXT_PUBLIC_DEFAULT_TOKEN || '';

// if (!API_URL) console.warn('Missing NEXT_PUBLIC_API_URL. API calls may fail.');
// if (!CLOUDFRONT_URL)
//   console.warn(
//     'Missing NEXT_PUBLIC_CLOUDFRONT_URL. Media files may not load correctly.',
//   );

// export const DEFAULT_OPTION_SELLER = 1;

// class ApiClient {
//   private instance: AxiosInstance;
//   private token: string | null = null;

//   constructor() {
//     this.instance = axios.create({
//       baseURL: API_URL,
//       timeout: DEFAULT_TIMEOUT,
//       headers: { 'Content-Type': 'application/json' },
//     });

//     this.instance.interceptors.request.use(
//       this.requestInterceptor.bind(this),
//       this.handleError,
//     );
//     this.instance.interceptors.response.use(
//       this.responseInterceptor,
//       this.handleError,
//     );
//   }

//   private requestInterceptor(config: InternalAxiosRequestConfig) {
//     if (environment === 'dev') {
//       console.log('🚀 API Request:', config);
//     }
//     if (this.token) {
//       config.headers.set('Authorization', `Bearer ${this.token}`);
//     }

//     return config;
//   }

//   private responseInterceptor(response: any) {
//     if (environment === 'dev') {
//       console.log('✅ API Response:', response);
//     }

//     return response;
//   }

//   private handleError(error: any) {
//     console.error('❌ API Error:', error);

//     return Promise.reject(error);
//   }

//   public setToken(token: string): void {
//     this.token = token;
//   }

//   public getToken(): string | null {
//     return this.token;
//   }

//   public clearToken(): void {
//     this.token = null;
//   }

//   private getAuthHeaders(requireAuth: boolean): Record<string, string> {
//     const token = this.token || DEFAULT_TOKEN;

//     return requireAuth && token ? { Authorization: `Bearer ${token}` } : {};
//   }

//   private async request<T = any, R = any>(
//     method: string,
//     url: string,
//     dataOrParams?: any,
//     requireAuth = true,
//   ): Promise<{ status: number; data: T; response: R }> {
//     const config: AxiosRequestConfig = {
//       method: method as any,
//       url,
//       headers: {
//         'Content-Type': 'application/json',
//         ...this.getAuthHeaders(requireAuth),
//       },
//     };

//     if (['get', 'delete'].includes(method)) config.params = dataOrParams;
//     else config.data = dataOrParams;

//     const response = await this.instance.request<R>(config);

//     return {
//       status: response.status,
//       data: normalizeResponse<T>(response.data),
//       response: response.data,
//     };
//   }

//   private async requestNormalized<T = any>(
//     method: string,
//     url: string,
//     dataOrParams?: any,
//     requireAuth = true,
//   ): Promise<T> {
//     const { data } = await this.request<T>(
//       method,
//       url,
//       dataOrParams,
//       requireAuth,
//     );

//     return data;
//   }

//   public get = <T = any, R = any>(
//     url: string,
//     params?: any,
//     requireAuth = true,
//   ) => this.request<T, R>('get', url, params, requireAuth);
//   public getNormalizedResponse = <T = any>(
//     url: string,
//     params?: any,
//     requireAuth = true,
//   ) => this.requestNormalized<T>('get', url, params, requireAuth);

//   public post = <T = any, R = any>(
//     url: string,
//     data?: any,
//     requireAuth = true,
//   ) => this.request<T, R>('post', url, data, requireAuth);
//   public postNormalizedResponse = <T = any>(
//     url: string,
//     data?: any,
//     requireAuth = true,
//   ) => this.requestNormalized<T>('post', url, data, requireAuth);

//   public put = <T = any, R = any>(
//     url: string,
//     data?: any,
//     requireAuth = true,
//   ) => this.request<T, R>('put', url, data, requireAuth);
//   public putNormalizedResponse = <T = any>(
//     url: string,
//     data?: any,
//     requireAuth = true,
//   ) => this.requestNormalized<T>('put', url, data, requireAuth);

//   public delete = <T = any, R = any>(url: string, requireAuth = true) =>
//     this.request<T, R>('delete', url, undefined, requireAuth);
//   public deleteNormalizedResponse = <T = any>(
//     url: string,
//     requireAuth = true,
//   ) => this.requestNormalized<T>('delete', url, undefined, requireAuth);

//   private buildMediaUrl(path: string, subPath = ''): string {
//     if (!path) return '';
//     const sanitizedPath = sanitizeUrl(path);

//     if (!CLOUDFRONT_URL) return sanitizedPath;
//     const base = CLOUDFRONT_URL.replace(/\/$/, '') + subPath;

//     return `${base}${sanitizedPath.startsWith('/') ? '' : '/'}${sanitizedPath}`;
//   }

//   public getFileUrl(path: string): string {
//     return this.buildMediaUrl(path);
//   }

//   public getContactImageUrl(path: string): string {
//     return this.buildMediaUrl(path, '/files/db/contacts');
//   }

//   public getUserImageUrl(path: string): string {
//     return this.buildMediaUrl(path, '/files/db/users');
//   }
// }

// export const apiClient = new ApiClient();
// export default apiClient;

import axios, { type AxiosInstance, type AxiosRequestConfig } from 'axios';

import { sanitizeUrl } from '@/utils/helpers';
import { normalizeResponse } from '@/utils';

const environment = process.env.NEXT_PUBLIC_ENVIRONMENT || 'dev';
const API_URL = process.env.NEXT_PUBLIC_API_URL || '';
const DEFAULT_TIMEOUT = Number.parseInt(
  process.env.NEXT_PUBLIC_API_TIMEOUT || '30000',
);
const CLOUDFRONT_URL = process.env.NEXT_PUBLIC_CLOUDFRONT_URL || '';
const DEFAULT_TOKEN = process.env.NEXT_PUBLIC_DEFAULT_TOKEN || '';

export const DEFAULT_OPTION_SELLER = 1;

if (!API_URL) {
  console.warn('Missing NEXT_PUBLIC_API_URL. API calls may fail.');
}

if (!CLOUDFRONT_URL) {
  console.warn(
    'Missing NEXT_PUBLIC_CLOUDFRONT_URL. Media files may not load correctly.',
  );
}

type HttpMethod = 'get' | 'post' | 'put' | 'delete';

interface RequestOptions {
  method: HttpMethod;
  url: string;
  data?: any;
  params?: Record<string, any>;
  requireAuth?: boolean;
  normalized?: boolean;
  headers?: Record<string, string>;
}

class ApiClient {
  private instance: AxiosInstance;
  private token: string | null = null;

  constructor() {
    this.instance = axios.create({
      baseURL: API_URL,
      timeout: DEFAULT_TIMEOUT,
      headers: {
        'Content-Type': 'application/json',
      },
    });

    this.instance.interceptors.request.use(
      config => {
        if (environment === 'dev') {
          console.log('🚀 API Request:', {
            method: config.method?.toUpperCase(),
            url: config.url,
            baseURL: config.baseURL,
            params: config.params,
            data: config.data,
            headers: config.headers,
          });
        }

        if (this.token) {
          config.headers.Authorization = `Bearer ${this.token}`;
        }

        return config;
      },
      error => {
        console.error('❌ API Request Error:', error);

        return Promise.reject(error);
      },
    );

    this.instance.interceptors.response.use(
      response => {
        if (environment === 'dev') {
          console.log('✅ API Response:', {
            status: response.status,
            url: response.config.url,
            data: response.data,
          });
        }

        return response;
      },
      error => {
        console.error('❌ API Response Error:', {
          url: error.config?.url,
          status: error.response?.status,
          data: error.response?.data,
          message: error.message,
        });

        return Promise.reject(error);
      },
    );
  }

  public setToken(token: string) {
    this.token = token;
  }

  public getToken(): string | null {
    return this.token;
  }

  public clearToken() {
    this.token = null;
  }

  public async request<T = any, R extends T = any>({
    method,
    url,
    data,
    params,
    requireAuth = true,
    normalized = false,
    headers = {},
  }: RequestOptions): Promise<{ status: number; data: T; response: R }> {
    const finalHeaders: Record<string, string> = {
      'Content-Type': 'application/json',
      ...headers,
    };

    const token = this.token || DEFAULT_TOKEN;

    if (requireAuth && token) {
      finalHeaders.Authorization = `Bearer ${token}`;
    }

    const config: AxiosRequestConfig = {
      method,
      url,
      data,
      params,
      headers: finalHeaders,
    };

    try {
      const response = await this.instance.request<R>(config);
      const responseData = normalized
        ? normalizeResponse<T>(response.data)
        : response.data;

      return {
        status: response.status,
        data: responseData,
        response: response.data,
      };
    } catch (error) {
      throw error;
    }
  }

  public get<T = any, R extends T = any>(
    url: string,
    params?: Record<string, any>,
    requireAuth = true,
    normalized = false,
    headers = {},
  ) {
    return this.request<T, R>({
      method: 'get',
      url,
      params,
      requireAuth,
      normalized,
      headers,
    });
  }

  public post<T = any, R extends T = any>(
    url: string,
    data?: any,
    requireAuth = true,
    normalized = false,
    headers = {},
  ) {
    return this.request<T, R>({
      method: 'post',
      url,
      data,
      requireAuth,
      normalized,
      headers,
    });
  }

  public put<T = any, R extends T = any>(
    url: string,
    data?: any,
    requireAuth = true,
    normalized = false,
    headers = {},
  ) {
    return this.request<T, R>({
      method: 'put',
      url,
      data,
      requireAuth,
      normalized,
      headers,
    });
  }

  public delete<T = any, R extends T = any>(
    url: string,
    params?: Record<string, any>,
    requireAuth = true,
    normalized = false,
    headers = {},
  ) {
    return this.request<T, R>({
      method: 'delete',
      url,
      params,
      requireAuth,
      normalized,
      headers,
    });
  }

  public getFileUrl(path: string): string {
    return this.buildMediaUrl(path, '');
  }

  public getContactImageUrl(path: string): string {
    return this.buildMediaUrl(path, '/files/db/contacts');
  }

  public getUserImageUrl(path: string): string {
    return this.buildMediaUrl(path, '/files/db/users');
  }

  private buildMediaUrl(path: string, prefix: string): string {
    if (!path) return '';
    const sanitizedPath = sanitizeUrl(path);

    if (!CLOUDFRONT_URL) return sanitizedPath;

    const baseUrl = CLOUDFRONT_URL.endsWith('/')
      ? CLOUDFRONT_URL.slice(0, -1)
      : CLOUDFRONT_URL;
    const prefixPath = prefix.startsWith('/') ? prefix : `/${prefix}`;
    const pathSegment = sanitizedPath.startsWith('/')
      ? sanitizedPath
      : `/${sanitizedPath}`;

    return `${baseUrl}${prefixPath}${pathSegment}`;
  }
}

export const apiClient = new ApiClient();
export default apiClient;
