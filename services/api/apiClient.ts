import axios, { type AxiosInstance } from 'axios';

// Sử dụng giá trị mặc định an toàn hoặc để trống
const API_URL = process.env.NEXT_PUBLIC_API_URL || '';
const DEFAULT_TIMEOUT = Number.parseInt(
  process.env.NEXT_PUBLIC_API_TIMEOUT || '30000',
); // 30 giây là giá trị kỹ thuật thông thường
const CLOUDFRONT_URL = process.env.NEXT_PUBLIC_CLOUDFRONT_URL || '';

// Helper function to safely parse URLs
function sanitizeUrl(url: string): string {
  if (!url) return '';

  // Check if URL already has a protocol
  if (!/^https?:\/\//i.test(url) && !url.startsWith('/')) {
    // Add a default protocol if missing
    url = '/' + url;
  }

  return url;
}

// Token mặc định cho các request không cần xác thực
const DEFAULT_TOKEN = process.env.NEXT_PUBLIC_DEFAULT_TOKEN || '';

// Kiểm tra và cảnh báo khi thiếu biến môi trường quan trọng
if (!process.env.NEXT_PUBLIC_API_URL) {
  console.warn(
    'Missing NEXT_PUBLIC_API_URL environment variable. API calls may fail.',
  );
}

if (!process.env.NEXT_PUBLIC_CLOUDFRONT_URL) {
  console.warn(
    'Missing NEXT_PUBLIC_CLOUDFRONT_URL environment variable. Media files may not load correctly.',
  );
}

// Tham số chung
export const DEFAULT_OPTION_SELLER = 1;

// Cải thiện xử lý lỗi trong apiClient.ts

// Thêm các hằng số cho mã lỗi HTTP phổ biến
const HTTP_STATUS = {
  OK: 200,
  BAD_REQUEST: 400,
  UNAUTHORIZED: 401,
  FORBIDDEN: 403,
  NOT_FOUND: 404,
  INTERNAL_SERVER_ERROR: 500,
  SERVICE_UNAVAILABLE: 503,
};

// Thêm các loại lỗi
const ERROR_TYPES = {
  NETWORK: 'NETWORK_ERROR',
  TIMEOUT: 'TIMEOUT_ERROR',
  SERVER: 'SERVER_ERROR',
  AUTH: 'AUTH_ERROR',
  VALIDATION: 'VALIDATION_ERROR',
  UNKNOWN: 'UNKNOWN_ERROR',
};

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

    // Request interceptor
    this.instance.interceptors.request.use(
      config => {
        console.log('🚀 API Request:', {
          method: config.method?.toUpperCase(),
          url: config.url,
          baseURL: config.baseURL,
          params: config.params,
          data: config.data,
          headers: config.headers,
        });

        // Thêm token xác thực nếu có
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

    // Response interceptor
    this.instance.interceptors.response.use(
      response => {
        console.log('✅ API Response:', {
          status: response.status,
          url: response.config.url,
          data: response.data,
        });

        return response.data; // Trả về data trực tiếp
      },
      error => {
        // Xử lý lỗi chung
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

  // Kiểm tra URL hợp lệ trước khi sử dụng
  private validateUrl(url: string | undefined): string {
    if (!url || url.trim() === '') {
      console.error('Invalid URL: URL is empty or undefined');
      throw new Error('API URL is not configured properly');
    }

    return url;
  }

  // Thiết lập token sau khi đăng nhập
  public setToken(token: string): void {
    this.token = token;
    if (typeof window !== 'undefined') {
      localStorage.setItem('auth_token', token);
    }
  }

  // Lấy token (hữu ích để duy trì trạng thái xác thực)
  public getToken(): string | null {
    if (!this.token && typeof window !== 'undefined') {
      this.token = localStorage.getItem('auth_token');
    }

    return this.token;
  }

  // Xóa token khi đăng xuất
  public clearToken(): void {
    this.token = null;
    if (typeof window !== 'undefined') {
      localStorage.removeItem('auth_token');
    }
  }

  // Phân loại lỗi HTTP
  private categorizeError(error: any): {
    type: string;
    message: string;
    status?: number;
    data?: any;
  } {
    if (!error.response) {
      // Lỗi mạng hoặc timeout
      return {
        type: error.message?.includes('timeout')
          ? ERROR_TYPES.TIMEOUT
          : ERROR_TYPES.NETWORK,
        message:
          'Không thể kết nối đến máy chủ. Vui lòng kiểm tra kết nối mạng của bạn.',
      };
    }

    const status = error.response.status;
    const data = error.response.data;

    switch (status) {
      case HTTP_STATUS.UNAUTHORIZED:
        return {
          type: ERROR_TYPES.AUTH,
          message: 'Phiên đăng nhập đã hết hạn hoặc không hợp lệ.',
          status,
          data,
        };
      case HTTP_STATUS.FORBIDDEN:
        return {
          type: ERROR_TYPES.AUTH,
          message: 'Bạn không có quyền truy cập vào tài nguyên này.',
          status,
          data,
        };
      case HTTP_STATUS.NOT_FOUND:
        return {
          type: ERROR_TYPES.SERVER,
          message: 'Không tìm thấy tài nguyên yêu cầu.',
          status,
          data,
        };
      case HTTP_STATUS.BAD_REQUEST:
        return {
          type: ERROR_TYPES.VALIDATION,
          message: data?.message || 'Dữ liệu gửi lên không hợp lệ.',
          status,
          data,
        };
      case HTTP_STATUS.INTERNAL_SERVER_ERROR:
      case HTTP_STATUS.SERVICE_UNAVAILABLE:
        return {
          type: ERROR_TYPES.SERVER,
          message: 'Máy chủ đang gặp sự cố. Vui lòng thử lại sau.',
          status,
          data,
        };
      default:
        return {
          type: ERROR_TYPES.UNKNOWN,
          message: 'Đã xảy ra lỗi không xác định.',
          status,
          data,
        };
    }
  }

  // Xử lý lỗi chung cho tất cả các request
  private handleRequestError(error: any, url: string): never {
    const errorInfo = this.categorizeError(error);

    console.error(`API Error (${errorInfo.type}):`, {
      url,
      status: errorInfo.status,
      message: errorInfo.message,
      data: errorInfo.data,
    });

    // Xử lý lỗi xác thực - tự động đăng xuất nếu token hết hạn
    if (errorInfo.type === ERROR_TYPES.AUTH && typeof window !== 'undefined') {
      // Xóa token và chuyển hướng đến trang đăng nhập nếu cần
      this.clearToken();

      // Không chuyển hướng tự động để tránh ảnh hưởng đến UX
      // window.location.href = '/auth/login'
    }

    throw {
      ...errorInfo,
      originalError: error,
    };
  }

  // Lấy token mặc định cho các request không cần xác thực
  public getDefaultToken(): string {
    return DEFAULT_TOKEN;
  }

  // Phương thức GET
  public async get<T = any>(
    url: string,
    params?: Record<string, any>,
    requireAuth = true,
  ): Promise<T> {
    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
    };

    // Thêm token nếu cần
    if (requireAuth) {
      const token = this.getToken() || (requireAuth ? DEFAULT_TOKEN : '');

      if (token) {
        headers.Authorization = `Bearer ${token}`;
      }
    }

    try {
      const response = await this.instance.get<T>(url, { params, headers });

      return response.data;
    } catch (error) {
      return this.handleRequestError(error, url);
    }
  }

  // Phương thức POST
  public async post<T = any>(
    url: string,
    data?: any,
    requireAuth = true,
  ): Promise<T> {
    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
    };

    // Thêm token nếu cần
    if (requireAuth) {
      const token = this.getToken() || (requireAuth ? DEFAULT_TOKEN : '');

      if (token) {
        headers.Authorization = `Bearer ${token}`;
      }
    }

    try {
      const response = await this.instance.post<T>(url, data, { headers });

      return response.data;
    } catch (error) {
      return this.handleRequestError(error, url);
    }
  }

  // Phương thức PUT
  public async put<T = any>(
    url: string,
    data?: any,
    requireAuth = true,
  ): Promise<T> {
    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
    };

    // Thêm token nếu cần
    if (requireAuth) {
      const token = this.getToken() || (requireAuth ? DEFAULT_TOKEN : '');

      if (token) {
        headers.Authorization = `Bearer ${token}`;
      }
    }

    try {
      const response = await this.instance.put<T>(url, data, { headers });

      return response.data;
    } catch (error) {
      return this.handleRequestError(error, url);
    }
  }

  // Thêm phương thức DELETE
  public async delete<T = any>(url: string, requireAuth = true): Promise<T> {
    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
    };

    // Thêm token nếu cần
    if (requireAuth) {
      const token = this.getToken() || (requireAuth ? DEFAULT_TOKEN : '');

      if (token) {
        headers.Authorization = `Bearer ${token}`;
      }
    }

    try {
      const response = await this.instance.delete<T>(url, { headers });

      return response.data;
    } catch (error) {
      return this.handleRequestError(error, url);
    }
  }

  // Helper cho URL file - Kiểm tra URL hợp lệ trước khi sử dụng
  public getFileUrl(path: string): string {
    if (!path) return '';

    // Sanitize the path to ensure it's a valid URL
    const sanitizedPath = sanitizeUrl(path);

    if (!CLOUDFRONT_URL) {
      console.warn(
        'CLOUDFRONT_URL is not configured. Media files may not load correctly.',
      );

      return sanitizedPath;
    }

    try {
      // Make sure we don't double up on slashes
      const baseUrl = CLOUDFRONT_URL.endsWith('/')
        ? CLOUDFRONT_URL.slice(0, -1)
        : CLOUDFRONT_URL;
      const pathSegment = sanitizedPath.startsWith('/')
        ? sanitizedPath
        : `/${sanitizedPath}`;

      return `${baseUrl}${pathSegment}`;
    } catch (error) {
      console.error('Error creating file URL:', error);

      return sanitizedPath;
    }
  }
}

// Tạo và export một instance singleton
export const apiClient = new ApiClient();

export default apiClient;
