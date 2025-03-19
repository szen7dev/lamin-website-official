'use client';

import { Moon, Sun } from 'lucide-react';

import { useTheme } from '@/hooks/useTheme';
import { Button } from '@/components/ui/button';

export function ThemeSwitcher() {
  const { resolvedTheme, toggleTheme, mounted } = useTheme();

  // Don't render anything until mounted to prevent hydration mismatch
  if (!mounted) {
    return (
      <Button
        aria-label="Toggle theme"
        className="w-9 h-9 opacity-0"
        size="icon"
        variant="ghost"
      />
    );
  }

  return (
    <Button
      aria-label="Toggle theme"
      className="w-9 h-9"
      size="icon"
      variant="ghost"
      onClick={toggleTheme}>
      {resolvedTheme === 'dark' ? (
        <Moon className="h-5 w-5" />
      ) : (
        <Sun className="h-5 w-5" />
      )}
    </Button>
  );
}
