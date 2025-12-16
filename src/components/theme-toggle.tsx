'use client';

import { useTheme } from 'next-themes';

import { Button } from '@/components/ui/button.jsx';
import { useMemo } from 'react';

export function ThemeToggle() {
  const { setTheme, theme } = useTheme();

  const currentTheme = useMemo(() => {
    if (!theme) return 'light';
    if (theme === 'system') return 'light';
    return theme;
  }, [theme]);

  return (
    <Button
      variant="ghost"
      onClick={() => setTheme(currentTheme === 'light' ? 'dark' : 'light')}
    >
      <span className="sr-only">Toggle theme</span>
    </Button>
  );
}
