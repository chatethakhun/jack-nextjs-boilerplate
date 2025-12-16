'use client';

import { useTheme } from 'next-themes';

import { Button } from '@/components/ui/button';
import { useMemo } from 'react';

export function ThemeToggle() {
  const { setTheme, theme } = useTheme();

  const currentTheme = useMemo(() => {
    if (!theme) return 'light';
    if (theme === 'system') return 'light';
    return theme;
  }, [theme]);

  console.log({ currentTheme });

  return (
    <div>
      <Button
        onClick={() => setTheme(currentTheme === 'light' ? 'dark' : 'light')}
      >
        <span className="sr-only text-black dark:text-white">Toggle theme</span>
      </Button>
    </div>
  );
}
