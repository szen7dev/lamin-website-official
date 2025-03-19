'use client';

import type { ThemeProviderProps } from 'next-themes';

import { ThemeProvider as NextThemesProvider } from 'next-themes';
import { useEffect, useState } from 'react';

export function ThemeProvider({ children, ...props }: ThemeProviderProps) {
  // Add this to prevent hydration mismatch
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  // Only render the children after the component is mounted on the client
  // This prevents hydration mismatch between server and client
  return (
    <NextThemesProvider
      disableTransitionOnChange
      enableSystem
      attribute="class"
      defaultTheme="system"
      {...props}>
      {mounted ? (
        children
      ) : (
        <div style={{ visibility: 'hidden' }}>{children}</div>
      )}
    </NextThemesProvider>
  );
}
