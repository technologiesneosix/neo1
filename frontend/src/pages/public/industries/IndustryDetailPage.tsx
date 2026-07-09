import { SearchX } from 'lucide-react';
import { useParams } from 'react-router-dom';
import { useBySlug, useList } from '@/api/hooks';
import { api } from '@/api/services';
import { Button } from '@/components/ui/Button';
import { PageLoader } from '@/components/ui/Spinner';
import { Seo } from '@/components/common/Seo';
import { DetailPageLayout } from '@/features/catalog/DetailPageLayout';

export function IndustryDetailPage() {
  const { slug } = useParams<{ slug: string }>();
  const { data: industry, isLoading, isError } = useBySlug(api.industries, slug);
  const { data: industries } = useList(api.industries);
  const siblings = [...(industries ?? [])].sort((a, b) => a.order - b.order);

  if (isLoading) {
    return (
      <>
        <Seo title="Industry | Neosix" description="Loading industry details." />
        <PageLoader />
      </>
    );
  }

  if (isError || !industry) {
    return (
      <>
        <Seo title="Industry Not Found | Neosix" description="This industry could not be found." />
        <section className="section-pad bg-white">
          <div className="container-site flex min-h-[40vh] flex-col items-center justify-center text-center">
            <SearchX size={48} aria-hidden="true" className="text-primary-300" />
            <h1 className="mt-6 text-display-3">Industry Not Found</h1>
            <p className="mt-4 max-w-md text-body">
              The industry page you are looking for may have moved. Explore all the sectors we
              serve instead.
            </p>
            <Button to="/industries" className="mt-8">
              View All Industries
            </Button>
          </div>
        </section>
      </>
    );
  }

  // Industries have no features array — DetailPageLayout omits that block.
  return (
    <DetailPageLayout
      item={industry}
      siblings={siblings}
      basePath="/industries"
      label="INDUSTRIES"
    />
  );
}
