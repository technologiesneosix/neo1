import { SearchX } from 'lucide-react';
import { useParams } from 'react-router-dom';
import { useBySlug, useList } from '@/api/hooks';
import { api } from '@/api/services';
import { Button } from '@/components/ui/Button';
import { PageLoader } from '@/components/ui/Spinner';
import { Seo } from '@/components/common/Seo';
import { DetailPageLayout } from '@/features/catalog/DetailPageLayout';

export function ServiceDetailPage() {
  const { slug } = useParams<{ slug: string }>();
  const { data: service, isLoading, isError } = useBySlug(api.services, slug);
  const { data: services } = useList(api.services);
  const siblings = [...(services ?? [])].sort((a, b) => a.order - b.order);

  if (isLoading) {
    return (
      <>
        <Seo title="Service | Neosix" description="Loading service details." />
        <PageLoader />
      </>
    );
  }

  if (isError || !service) {
    return (
      <>
        <Seo title="Service Not Found | Neosix" description="This service could not be found." />
        <section className="section-pad bg-white">
          <div className="container-site flex min-h-[40vh] flex-col items-center justify-center text-center">
            <SearchX size={48} aria-hidden="true" className="text-primary-300" />
            <h1 className="mt-6 text-display-3">Service Not Found</h1>
            <p className="mt-4 max-w-md text-body">
              The service you are looking for may have been renamed or removed. Browse our full
              list of services instead.
            </p>
            <Button to="/services" className="mt-8">
              View All Services
            </Button>
          </div>
        </section>
      </>
    );
  }

  return (
    <DetailPageLayout item={service} siblings={siblings} basePath="/services" label="OUR SERVICES" />
  );
}
