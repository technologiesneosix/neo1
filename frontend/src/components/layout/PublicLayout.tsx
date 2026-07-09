import { Suspense } from 'react';
import { Outlet } from 'react-router-dom';
import { Header } from './Header';
import { Footer } from './Footer';
import { PageLoader } from '@/components/ui/Spinner';
import { ScrollRestoration, ScrollToTopButton } from '@/components/common/ScrollToTop';

export function PublicLayout() {
  return (
    <div className="flex min-h-screen flex-col">
      <ScrollRestoration />
      <Header />
      <main className="flex-1">
        <Suspense fallback={<PageLoader className="min-h-[60vh]" />}>
          <Outlet />
        </Suspense>
      </main>
      <Footer />
      <ScrollToTopButton />
    </div>
  );
}
