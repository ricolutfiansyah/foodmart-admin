import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Toaster } from '@/components/ui/sonner';
import './index.css';
import App from './App';
import { ErrorBoundary } from 'react-error-boundary';
import { ErrorPage } from './components/ErrorFallback';

const queryClient = new QueryClient();

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <QueryClientProvider client={queryClient}>
      <ErrorBoundary fallbackRender={ErrorPage}>
        <App />
        <Toaster position="top-center" />
      </ErrorBoundary>
    </QueryClientProvider>
  </StrictMode>
);
