'use client';

import type React from 'react';
import type { User } from '@/features/auth/types/authTypes';
import type { LoginResponse } from '@/features/auth/api/login';

import { createContext, useCallback, useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { deleteCookie, getCookie, setCookie } from 'cookies-next';

import { login as loginApi } from '@/features/auth/api/login';
import { apiClient } from '@/services/api/apiClient';
import { updateUser, UserUpdateParams } from '@/features/auth/api/updateUser';

type AuthContextType = {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  updateUser: (params: UserUpdateParams) => Promise<any>;
  login: (phone: string, otp: string) => Promise<LoginResponse>;
  setAuthUser: (userData: User, token: string) => void;
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
        // Check if token exists in cookies
        const token = getCookie('auth-token');

        if (token) {
          // Set token in apiClient
          apiClient.setToken(token as string);

          // Get user data from localStorage
          const userId = localStorage.getItem('user_id') || '';
          const userRealId = localStorage.getItem('user_real_id') || '';
          const userName = localStorage.getItem('user_name') || '';
          const userPhone = localStorage.getItem('user_phone') || '';
          const userEmail = localStorage.getItem('user_email') || '';
          const userImage = localStorage.getItem('user_image') || '';
          const userFullname = localStorage.getItem('user_fullname') || '';
          const userLoyaltyPoints =
            localStorage.getItem('user_loyalty_points') || '';
          const userGender = localStorage.getItem('user_gender') || '';
          const userBirthDay = localStorage.getItem('user_birthDay') || '';

          // Try to reconstruct user object from localStorage
          setUser({
            id: userId,
            _id: userRealId,
            name: userName,
            phone: userPhone,
            email: userEmail,
            image: userImage,
            fullname: userFullname,
            gender: parseInt(userGender) as 1 | 2 | 3,
            birthDay: userBirthDay,
            contacts: [{ remainLoyaltyPoints: parseInt(userLoyaltyPoints) }],
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

  // Clear all user data from localStorage and cookies
  const clearUserData = () => {
    deleteCookie('auth-token');
    localStorage.removeItem('user_id');
    localStorage.removeItem('user_real_id');
    localStorage.removeItem('user_name');
    localStorage.removeItem('user_phone');
    localStorage.removeItem('user_email');
    localStorage.removeItem('user_image');
    localStorage.removeItem('user_fullname');
    localStorage.removeItem('user_loyalty_points');
    localStorage.removeItem('user_gender');
    localStorage.removeItem('user_birthDay');
    // Add any other user properties that were stored
  };

  // Store user data in localStorage
  const storeUserData = useCallback((userData: User) => {
    if (userData.id) localStorage.setItem('user_id', userData.id);
    if (userData._id) localStorage.setItem('user_real_id', userData._id);
    if (userData.name) localStorage.setItem('user_name', userData.name);
    if (userData.phone) localStorage.setItem('user_phone', userData.phone);
    if (userData.email)
      localStorage.setItem('user_email', userData.email || '');
    if (userData.image) localStorage.setItem('user_image', userData.image);
    if (userData.fullname)
      localStorage.setItem('user_fullname', userData.fullname);
    if (userData.contacts && userData.contacts[0].remainLoyaltyPoints) {
      localStorage.setItem(
        'user_loyalty_points',
        userData.contacts[0].remainLoyaltyPoints.toString(),
      );
    }
    if (userData.gender)
      localStorage.setItem('user_gender', userData.gender.toString());
    if (userData.birthDay)
      localStorage.setItem('user_birthDay', userData.birthDay);
    // Store additional user properties as needed
  }, []);

  // Login with phone and OTP
  const login = async (phone: string, otp: string): Promise<LoginResponse> => {
    setIsLoading(true);
    try {
      // Use the login function with phone as email and OTP as password
      const response = await loginApi({ email: phone, password: otp });

      if (response.success && response.token) {
        // Store token in cookie
        setCookie('auth-token', response.token, { maxAge: 60 * 60 * 24 * 7 }); // 7 days
        apiClient.setToken(response.token);

        // Store user data
        if (response.user && response.user.contacts) {
          // Make sure to map _id to id and create a new object
          const userData = {
            ...response.user,
            id: response.user.contacts[0]._id || '',
            _id: response.user._id || '',
          };

          // Store in state and localStorage
          setUser(userData as User);
          storeUserData(userData as User);
        }
      }

      return response;
    } finally {
      setIsLoading(false);
    }
  };

  const handleUserUpdate = async (
    params: UserUpdateParams,
  ): Promise<LoginResponse> => {
    setIsLoading(true);
    if (!user) {
      throw new Error('User not found');
    }

    try {
      // Use the login function with phone as email and OTP as password
      const response = await updateUser({
        fullname: params.fullname,
        phone: params.phone,
        gender: params.gender,
        birthDay: params.birthDay,
        email: params.email,
      });

      if (!response.error) {
        // Store user data
        if (response.data) {
          const userData = {
            id: response.data._id,
            image: response.data.avatar,
            fullname: response.data.fullname,
            gender: response.data.gender,
            birthDay: response.data.birthDay,
            name: response.data.name,
            phone: response.data.phone,
            email: response.data.email,
          };

          storeUserData(userData);
          setUser(userData);
        }
      }

      return response;
    } finally {
      setIsLoading(false);
    }
  };

  const setAuthUser = (userData: User, token: string) => {
    setCookie('auth-token', token, { maxAge: 60 * 60 * 24 * 7 });
    apiClient.setToken(token);

    setUser(userData);
    storeUserData(userData);
  };

  // Logout function
  const logout = async () => {
    setIsLoading(true);
    try {
      // Clear auth data
      clearUserData();
      deleteCookie('auth-token');
      apiClient.clearToken();
      setUser(null);

      // Redirect to login page
      router.push('/');
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
        updateUser: handleUserUpdate,
        login,
        setAuthUser,
        logout,
      }}>
      {children}
    </AuthContext.Provider>
  );
}
