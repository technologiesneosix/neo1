import { SearchX } from 'lucide-react';
import { useParams } from 'react-router-dom';
import { useBySlug, useList } from '@/api/hooks';
import { api } from '@/api/services';
import { Button } from '@/components/ui/Button';
import { PageLoader } from '@/components/ui/Spinner';
import { Seo } from '@/components/common/Seo';
import { DetailPageLayout } from '@/features/catalog/DetailPageLayout';

export function SolutionDetailPage() {
  const { slug } = useParams<{ slug: string }>();
  const { data: solution, isLoading, isError } = useBySlug(api.solutions, slug);
  const { data: solutions } = useList(api.solutions);
  const siblings = [...(solutions ?? [])].sort((a, b) => a.order - b.order);

  if (isLoading) {
    return (
      <>
        <Seo title="Solution | Neosix" description="Loading solution details." />
        <PageLoader />
      </>
    );
  }

  if (isError || !solution) {
    return (
      <>
        <Seo title="Solution Not Found | Neosix" description="This solution could not be found." />
        <section className="section-pad bg-white">
          <div className="container-site flex min-h-[40vh] flex-col items-center justify-center text-center">
            <SearchX size={48} aria-hidden="true" className="text-primary-300" />
            <h1 className="mt-6 text-display-3">Solution Not Found</h1>
            <p className="mt-4 max-w-md text-body">
              The platform you are looking for may have been renamed or removed. Browse our full
              catalog of solutions instead.
            </p>
            <Button to="/solutions" className="mt-8">
              View All Solutions
            </Button>
          </div>
        </section>
      </>
    );
  }

  return (
    <DetailPageLayout
      item={solution}
      siblings={siblings}
      basePath="/solutions"
      label="OUR SOLUTIONS"
    />
  );
}
