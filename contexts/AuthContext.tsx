'use client';

import type React from 'react';
import type { User } from '@/features/auth/types/authTypes';
import type { LoginResponse } from '@/features/auth/api/login';

import { createContext, useCallback, useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

import { login as loginApi } from '@/features/auth/api/login';
import { apiClient } from '@/services/api/apiClient';

type AuthContextType = {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<LoginResponse>;
  loginWithOTP: (phone: string, otp: string) => Promise<LoginResponse>;
  logout: () => Promise<void>;
};

export const AuthContext = createContext<AuthContextType | undefined>(
  undefined,
);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();

  // Check authentication status when the component mounts
  useEffect(() => {
    const checkAuth = async () => {
      try {
        // Check if token exists in localStorage
        const token = localStorage.getItem('auth_token');

        if (token) {
          // Set token in apiClient
          apiClient.setToken(token);

          // Get user data from localStorage
          const userId = localStorage.getItem('user_id') || '';
          const userName = localStorage.getItem('user_name') || '';
          const userPhone = localStorage.getItem('user_phone') || '';
          const userEmail = localStorage.getItem('user_email') || '';
          const userImage = localStorage.getItem('user_image') || '';
          const userFullname = localStorage.getItem('user_fullname') || '';

          // Try to reconstruct user object from localStorage
          setUser({
            id: userId,
            name: userName,
            phone: userPhone,
            email: userEmail,
            image: userImage,
            fullname: userFullname,
          });
        }
      } catch (error) {
        console.error('Authentication check failed:', error);
        // Clear auth data on error
        clearUserData();
        apiClient.clearToken();
      } finally {
        setIsLoading(false);
      }
    };

    checkAuth();
  }, []);

  // Clear all user data from localStorage
  const clearUserData = () => {
    localStorage.removeItem('auth_token');
    localStorage.removeItem('user_id');
    localStorage.removeItem('user_name');
    localStorage.removeItem('user_phone');
    localStorage.removeItem('user_email');
    localStorage.removeItem('user_image');
    localStorage.removeItem('user_fullname');
    // Add any other user properties that were stored
  };

  // Store user data in localStorage
  const storeUserData = useCallback((userData: User) => {
    if (userData.id) localStorage.setItem('user_id', userData.id);
    if (userData.name) localStorage.setItem('user_name', userData.name);
    if (userData.phone) localStorage.setItem('user_phone', userData.phone);
    if (userData.email)
      localStorage.setItem('user_email', userData.email || '');
    if (userData.image) localStorage.setItem('user_image', userData.image);
    if (userData.fullname)
      localStorage.setItem('user_fullname', userData.fullname);
    // Store additional user properties as needed
  }, []);

  // Login with email/password
  const login = async (
    email: string,
    password: string,
  ): Promise<LoginResponse> => {
    setIsLoading(true);
    try {
      const response = await loginApi({ email, password });

      if (response.success && response.token) {
        // Store token
        localStorage.setItem('auth_token', response.token);
        apiClient.setToken(response.token);

        // Store user data
        if (response.user) {
          setUser(response.user);
          storeUserData(response.user);
        }
      }

      return response;
    } finally {
      setIsLoading(false);
    }
  };

  // Login with phone and OTP
  const loginWithOTP = async (
    phone: string,
    otp: string,
  ): Promise<LoginResponse> => {
    setIsLoading(true);
    try {
      // Use the login function with phone as email and OTP as password
      const response = await loginApi({ email: phone, password: otp });

      if (response.success && response.token) {
        // Store token
        localStorage.setItem('auth_token', response.token);
        apiClient.setToken(response.token);

        // Store user data
        if (response.user) {
          setUser(response.user);
          storeUserData(response.user);
        }
      }

      return response;
    } finally {
      setIsLoading(false);
    }
  };

  // Logout function
  const logout = async () => {
    setIsLoading(true);
    try {
      // Clear auth data
      clearUserData();
      apiClient.clearToken();
      setUser(null);

      // Redirect to login page
      router.push('/auth/login');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: !!user,
        isLoading,
        login,
        loginWithOTP,
        logout,
      }}>
      {children}
    </AuthContext.Provider>
  );
}
