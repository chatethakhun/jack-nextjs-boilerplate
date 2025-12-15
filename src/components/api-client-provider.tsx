'use client';

import { useEffect } from 'react';
import { useSession } from 'next-auth/react';
import apiClient from '@/lib/api';

export function ApiClientProvider({ children }: { children: React.ReactNode }) {
  const { data: session } = useSession();

  useEffect(() => {
    const requestInterceptor = apiClient.interceptors.request.use(
      (config) => {
        // If the session has an access token, add it to the Authorization header
        if (session?.accessToken) {
          config.headers.Authorization = `Bearer ${session.accessToken}`;
        }
        return config;
      },
      (error) => {
        return Promise.reject(error);
      }
    );

    // Clean up the interceptor when the component unmounts or session changes
    return () => {
      apiClient.interceptors.request.eject(requestInterceptor);
    };
  }, [session]);

  return <>{children}</>;
}
