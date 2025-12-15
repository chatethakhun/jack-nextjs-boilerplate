'use client';
import { ReactNode } from 'react';
import {
  ToastContainer as ToastContainerComponent,
  ToastProvider as ToastProviderComponent,
} from 'the-omelet-ui/toast';

export const ToastProvider = (props: { children: ReactNode }) => {
  return (
    <ToastProviderComponent>
      {props.children}
      <ToastContainerComponent />
    </ToastProviderComponent>
  );
};
