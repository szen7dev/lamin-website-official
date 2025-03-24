// Types for auth feature
export interface User {
  id: string;
  _id?: string; // Backend ID
  name: string;
  email?: string;
  phone?: string;
  role?: string;
  // Additional properties from the API response
  birthDay?: string | null;
  bizfullname?: string;
  company?: {
    name?: string;
    phone?: string;
    sign?: string;
    _id?: string;
  };
  contacts?: Array<{
    balance?: number;
    company?: string;
    email?: string;
    image?: string;
    name?: string;
    phone?: string;
    remainLoyaltyPoints?: number;
    _id?: string;
  }>;
  fullname?: string;
  gender?: number;
  image?: string;
  lang?: string;
  level?: number;
  signature?: string;
  status?: number;
}

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface RegisterData {
  email: string;
  password: string;
  name: string;
}

export interface AuthResponse {
  user: User;
  token: string;
}

export interface AuthService {
  login(email: string, password: string): Promise<AuthResponse>;
  register(
    email: string,
    password: string,
    name: string,
  ): Promise<AuthResponse>;
  logout(): Promise<void>;
  getProfile(): Promise<User>;
}
