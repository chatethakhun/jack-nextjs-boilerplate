// ThemeToggle.test.tsx
import { describe, test, expect, vi, beforeEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { ThemeToggle } from './theme-toggle';

// Mock next-themes
const mockSetTheme = vi.fn();
const mockUseTheme = vi.fn();

vi.mock('next-themes', () => ({
  useTheme: () => mockUseTheme(),
}));

describe('ThemeToggle', () => {
  beforeEach(() => {
    mockSetTheme.mockClear();
  });

  test('renders button with accessible label', () => {
    mockUseTheme.mockReturnValue({
      theme: 'light',
      setTheme: mockSetTheme,
    });

    render(<ThemeToggle />);

    const button = screen.getByRole('button');
    expect(button).toBeInTheDocument();
    expect(screen.getByText('Toggle theme')).toBeInTheDocument();
  });

  test('toggles from light to dark', async () => {
    const user = userEvent.setup();
    mockUseTheme.mockReturnValue({
      theme: 'light',
      setTheme: mockSetTheme,
    });

    render(<ThemeToggle />);

    await user.click(screen.getByRole('button'));

    expect(mockSetTheme).toHaveBeenCalledWith('dark');
    expect(mockSetTheme).toHaveBeenCalledTimes(1);
  });

  test('toggles from dark to light', async () => {
    const user = userEvent.setup();
    mockUseTheme.mockReturnValue({
      theme: 'dark',
      setTheme: mockSetTheme,
    });

    render(<ThemeToggle />);

    await user.click(screen.getByRole('button'));

    expect(mockSetTheme).toHaveBeenCalledWith('light');
  });

  test('handles undefined theme gracefully', async () => {
    const user = userEvent.setup();
    mockUseTheme.mockReturnValue({
      theme: undefined,
      setTheme: mockSetTheme,
    });

    render(<ThemeToggle />);

    await user.click(screen.getByRole('button'));

    // undefined !== 'light' จะเป็น true, ดังนั้นจะ toggle เป็น 'dark'
    expect(mockSetTheme).toHaveBeenCalledWith('dark');
  });

  test('handles system theme', async () => {
    const user = userEvent.setup();
    mockUseTheme.mockReturnValue({
      theme: 'system',
      setTheme: mockSetTheme,
    });

    render(<ThemeToggle />);

    await user.click(screen.getByRole('button'));

    // system !== 'light' จะเป็น true
    expect(mockSetTheme).toHaveBeenCalledWith('dark');
  });
});
