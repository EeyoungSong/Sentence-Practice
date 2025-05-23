import '@/styles/globals.css';
import type { AppProps } from 'next/app';
import { Layout } from './layout';
import { HydrationBoundary, QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';

export default function App({ Component, pageProps }: AppProps): JSX.Element {
  const queryClient = new QueryClient();

  return (
    <QueryClientProvider client={queryClient}>
      <HydrationBoundary>
        <Layout>
          <Component {...pageProps} />
        </Layout>
      </HydrationBoundary>
      <ReactQueryDevtools initialIsOpen={true} />
    </QueryClientProvider>
  );
}
