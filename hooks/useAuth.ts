'use client';

import { useContext } from 'react';

import { AuthContext } from '@/contexts/AuthContext';

/**
 * Custom hook to use the authentication context
 * @returns The authentication context
 * @throws Error if used outside of AuthProvider
 */
export function useAuth() {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }

  return context;
}
