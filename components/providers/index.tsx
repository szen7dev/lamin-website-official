'use client';

import type { ThemeProviderProps } from 'next-themes';

import * as React from 'react';
import { useState, useEffect } from 'react';
import { ThemeProvider as NextThemesProvider } from 'next-themes';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

import { Toaster } from '@/components/ui/toaster';
import { AuthProvider } from '@/contexts/AuthContext';
import { OrderProvider } from '@/contexts/OrderContext';

export interface ProvidersProps {
  children: React.ReactNode;
  themeProps?: ThemeProviderProps;
}

export function Providers({ children, themeProps }: ProvidersProps) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);
  const [queryClient] = useState(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: {
            staleTime: 86400, // 1 day
            gcTime: 30 * 60 * 1000, // 30 minutes
            refetchOnWindowFocus: false,
            refetchOnMount: false,
          },
        },
      }),
  );

  return (
    <QueryClientProvider client={queryClient}>
      <NextThemesProvider
        disableTransitionOnChange
        enableSystem
        attribute="class"
        defaultTheme="system"
        {...themeProps}>
        <AuthProvider>
          <OrderProvider>
            {mounted ? (
              <>
                {children}
                <Toaster />
              </>
            ) : (
              <div style={{ visibility: 'hidden' }}>{children}</div>
            )}
          </OrderProvider>
        </AuthProvider>
      </NextThemesProvider>
    </QueryClientProvider>
  );
}
