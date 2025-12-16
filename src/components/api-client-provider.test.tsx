// ApiClientProvider.test.tsx
import { describe, test, expect, vi, beforeEach, afterEach } from 'vitest';
import { render, waitFor } from '@testing-library/react';
import { useSession } from 'next-auth/react';
import { ApiClientProvider } from './api-client-provider';
import apiClient from '@/lib/api';

// Mock next-auth
vi.mock('next-auth/react', () => ({
  useSession: vi.fn(),
}));

// Mock apiClient
vi.mock('@/lib/api', () => ({
  default: {
    interceptors: {
      request: {
        use: vi.fn(),
        eject: vi.fn(),
      },
    },
  },
}));

describe('ApiClientProvider', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  test('renders children', () => {
    vi.mocked(useSession).mockReturnValue({
      data: null,
      status: 'unauthenticated',
      update: vi.fn(),
    });

    const { container } = render(
      <ApiClientProvider>
        <div>Test Child</div>
      </ApiClientProvider>
    );

    expect(container.textContent).toBe('Test Child');
  });

  test('sets up request interceptor on mount', () => {
    vi.mocked(useSession).mockReturnValue({
      data: null,
      status: 'unauthenticated',
      update: vi.fn(),
    });

    render(
      <ApiClientProvider>
        <div>Test</div>
      </ApiClientProvider>
    );

    expect(apiClient.interceptors.request.use).toHaveBeenCalledTimes(1);
    expect(apiClient.interceptors.request.use).toHaveBeenCalledWith(
      expect.any(Function),
      expect.any(Function)
    );
  });

  test('adds Authorization header when session has accessToken', () => {
    const mockSession = {
      user: { name: 'Test User', email: 'test@example.com' },
      accessToken: 'test-token-123',
      expires: '2024-12-31',
    };

    vi.mocked(useSession).mockReturnValue({
      data: mockSession,
      status: 'authenticated',
      update: vi.fn(),
    });

    let requestInterceptor: any;

    vi.mocked(apiClient.interceptors.request.use).mockImplementation(
      (onFulfilled) => {
        requestInterceptor = onFulfilled;
        return 1; // mock interceptor id
      }
    );

    render(
      <ApiClientProvider>
        <div>Test</div>
      </ApiClientProvider>
    );

    // Test the interceptor function
    const mockConfig = {
      url: '/api/test',
      headers: {} as any,
    };

    const result = requestInterceptor(mockConfig);

    expect(result.headers.Authorization).toBe('Bearer test-token-123');
  });

  test('does not add Authorization header when session has no accessToken', () => {
    const mockSession = {
      user: { name: 'Test User', email: 'test@example.com' },
      expires: '2024-12-31',
    };

    vi.mocked(useSession).mockReturnValue({
      data: mockSession as any,
      status: 'authenticated',
      update: vi.fn(),
    });

    let requestInterceptor: any;

    vi.mocked(apiClient.interceptors.request.use).mockImplementation(
      (onFulfilled) => {
        requestInterceptor = onFulfilled;
        return 1;
      }
    );

    render(
      <ApiClientProvider>
        <div>Test</div>
      </ApiClientProvider>
    );

    const mockConfig = {
      url: '/api/test',
      headers: {} as any,
    };

    const result = requestInterceptor(mockConfig);

    expect(result.headers.Authorization).toBeUndefined();
  });

  test('does not add Authorization header when no session', () => {
    vi.mocked(useSession).mockReturnValue({
      data: null,
      status: 'unauthenticated',
      update: vi.fn(),
    });

    let requestInterceptor: any;

    vi.mocked(apiClient.interceptors.request.use).mockImplementation(
      (onFulfilled) => {
        requestInterceptor = onFulfilled;
        return 1;
      }
    );

    render(
      <ApiClientProvider>
        <div>Test</div>
      </ApiClientProvider>
    );

    const mockConfig = {
      url: '/api/test',
      headers: {} as any,
    };

    const result = requestInterceptor(mockConfig);

    expect(result.headers.Authorization).toBeUndefined();
  });

  test('handles request interceptor error', () => {
    vi.mocked(useSession).mockReturnValue({
      data: null,
      status: 'unauthenticated',
      update: vi.fn(),
    });

    let errorHandler: any;

    vi.mocked(apiClient.interceptors.request.use).mockImplementation(
      (onFulfilled, onRejected) => {
        errorHandler = onRejected;
        return 1;
      }
    );

    render(
      <ApiClientProvider>
        <div>Test</div>
      </ApiClientProvider>
    );

    const error = new Error('Request failed');
    const result = errorHandler(error);

    expect(result).rejects.toBe(error);
  });

  test('ejects interceptor on unmount', () => {
    const mockInterceptorId = 123;

    vi.mocked(apiClient.interceptors.request.use).mockReturnValue(
      mockInterceptorId
    );

    vi.mocked(useSession).mockReturnValue({
      data: null,
      status: 'unauthenticated',
      update: vi.fn(),
    });

    const { unmount } = render(
      <ApiClientProvider>
        <div>Test</div>
      </ApiClientProvider>
    );

    expect(apiClient.interceptors.request.eject).not.toHaveBeenCalled();

    unmount();

    expect(apiClient.interceptors.request.eject).toHaveBeenCalledWith(
      mockInterceptorId
    );
  });

  test('updates interceptor when session changes', () => {
    const { rerender } = render(
      <ApiClientProvider>
        <div>Test</div>
      </ApiClientProvider>
    );

    // Initial session - no token
    vi.mocked(useSession).mockReturnValue({
      data: null,
      status: 'loading',
      update: vi.fn(),
    });

    rerender(
      <ApiClientProvider>
        <div>Test</div>
      </ApiClientProvider>
    );

    const callCountBefore = vi.mocked(apiClient.interceptors.request.use).mock
      .calls.length;

    // Update session - with token
    vi.mocked(useSession).mockReturnValue({
      data: {
        user: { name: 'Test', email: 'test@example.com' },
        token: 'new-token',
        expires: '2024-12-31',
      },
      status: 'authenticated',
      update: vi.fn(),
    });

    rerender(
      <ApiClientProvider>
        <div>Test</div>
      </ApiClientProvider>
    );

    // Should have called use again (new interceptor)
    expect(apiClient.interceptors.request.use).toHaveBeenCalledTimes(
      callCountBefore + 1
    );
    // Should have ejected old interceptor
    expect(apiClient.interceptors.request.eject).toHaveBeenCalled();
  });
});
