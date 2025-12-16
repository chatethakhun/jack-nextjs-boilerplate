// UserForm.test.tsx
import { describe, test, expect, vi, beforeEach } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { signIn } from 'next-auth/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { UserForm } from './user-form';

// Mock next-auth
vi.mock('next-auth/react', () => ({
  signIn: vi.fn(),
}));

// Helper to render with providers
function renderWithProviders(ui: React.ReactElement) {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: { retry: false },
      mutations: { retry: false },
    },
  });

  return render(
    <QueryClientProvider client={queryClient}>{ui}</QueryClientProvider>
  );
}

describe('UserForm', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  // ... tests here
  describe('UserForm - Rendering', () => {
    test('renders all form fields', () => {
      renderWithProviders(<UserForm />);

      expect(screen.getByPlaceholderText('abc')).toBeInTheDocument();
      expect(screen.getByPlaceholderText('******')).toBeInTheDocument();
      expect(
        screen.getByRole('button', { name: /เข้าสู่ระบบ/i })
      ).toBeInTheDocument();
    });

    test('renders submit button in enabled state initially', () => {
      renderWithProviders(<UserForm />);

      const submitButton = screen.getByRole('button', { name: /เข้าสู่ระบบ/i });
      expect(submitButton).not.toBeDisabled();
    });

    test('username field has correct attributes', () => {
      renderWithProviders(<UserForm />);

      const usernameInput = screen.getByPlaceholderText('abc');
      expect(usernameInput).toHaveAttribute('id', 'username');
    });

    test('password field has correct attributes', () => {
      renderWithProviders(<UserForm />);

      const passwordInput = screen.getByPlaceholderText('******');
      expect(passwordInput).toHaveAttribute('id', 'password');
    });
  });

  describe('UserForm - Validation', () => {
    test('shows error when username is empty', async () => {
      const user = userEvent.setup();
      renderWithProviders(<UserForm />);

      const submitButton = screen.getByRole('button', { name: /เข้าสู่ระบบ/i });

      await user.click(submitButton);

      await waitFor(() => {
        expect(
          screen.getByText(/Username must be at least 2 characters long/i)
        ).toBeInTheDocument();
      });
    });

    test('shows error when password is too short', async () => {
      const user = userEvent.setup();
      renderWithProviders(<UserForm />);

      const usernameInput = screen.getByPlaceholderText('abc');
      const passwordInput = screen.getByPlaceholderText('******');
      const submitButton = screen.getByRole('button', { name: /เข้าสู่ระบบ/i });

      await user.type(usernameInput, 'testuser');
      await user.type(passwordInput, '123'); // Too short
      await user.click(submitButton);

      await waitFor(() => {
        expect(
          screen.getByText(/Password must be at least 8 characters long/i)
        ).toBeInTheDocument();
      });
    });

    test('shows multiple errors when both fields are invalid', async () => {
      const user = userEvent.setup();
      renderWithProviders(<UserForm />);

      const passwordInput = screen.getByPlaceholderText('******');
      const submitButton = screen.getByRole('button', { name: /เข้าสู่ระบบ/i });

      await user.type(passwordInput, '123');
      await user.click(submitButton);

      await waitFor(() => {
        expect(
          screen.getByText(/Username must be at least 2 characters long/i)
        ).toBeInTheDocument();
        expect(
          screen.getByText(/Password must be at least 8 characters long/i)
        ).toBeInTheDocument();
      });
    });

    test('clears error when valid input is provided', async () => {
      const user = userEvent.setup();
      renderWithProviders(<UserForm />);

      const usernameInput = screen.getByPlaceholderText('abc');
      const submitButton = screen.getByRole('button', { name: /เข้าสู่ระบบ/i });

      // Submit without username to trigger error
      await user.click(submitButton);

      await waitFor(() => {
        expect(
          screen.getByText(/Username must be at least 2 characters long/i)
        ).toBeInTheDocument();
      });

      // Type valid username
      await user.type(usernameInput, 'testuser');

      // Error should clear
      await waitFor(() => {
        expect(
          screen.queryByText(/Username must be at least 2 characters long/i)
        ).not.toBeInTheDocument();
      });
    });
  });
});
