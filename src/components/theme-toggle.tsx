'use client';

import { useTheme } from 'next-themes';

import { Button } from '@/components/ui/button';
import { useMemo } from 'react';
import Light from 'omoo-icons/icons/Lightbulb01';
export function ThemeToggle() {
  const { setTheme, theme } = useTheme();

  const currentTheme = useMemo(() => {
    if (!theme) return 'light';
    if (theme === 'system') return 'light';
    return theme;
  }, [theme]);

  return (
    <Button
      variant="outline"
      onClick={() => setTheme(currentTheme === 'light' ? 'dark' : 'light')}
      isIcon
    >
      <Light />
    </Button>
  );
}
