import { Helmet } from 'react-helmet-async';
import { useLocation } from 'react-router-dom';
import { useList } from '@/api/hooks';
import { api } from '@/api/services';
import type { SeoMeta } from '@/types';

interface SeoProps {
  /** Explicit overrides win over the admin-managed per-page SEO record. */
  title?: string;
  description?: string;
  meta?: Partial<SeoMeta>;
  type?: 'website' | 'article';
}

/** Renders meta tags from admin-managed SEO records with per-page overrides. */
export function Seo({ title, description, meta, type = 'website' }: SeoProps) {
  const { pathname } = useLocation();
  const { data: records } = useList(api.pageSeo);
  const record = records?.find((entry) => entry.page === pathname)?.seo;

  const finalTitle = title ?? meta?.metaTitle ?? record?.metaTitle ?? 'Neosix — Enterprise Software Solutions';
  const finalDescription =
    description ?? meta?.metaDescription ?? record?.metaDescription ?? 'Enterprise software, delivered.';
  const keywords = meta?.keywords ?? record?.keywords;
  const canonical = meta?.canonicalUrl ?? record?.canonicalUrl ?? `https://neosix.io${pathname}`;
  const ogImage = meta?.ogImage ?? record?.ogImage;
  const robots = meta?.robots ?? record?.robots ?? 'index,follow';

  return (
    <Helmet>
      <title>{finalTitle}</title>
      <meta name="description" content={finalDescription} />
      {keywords && <meta name="keywords" content={keywords} />}
      <meta name="robots" content={robots} />
      <link rel="canonical" href={canonical} />
      <meta property="og:title" content={finalTitle} />
      <meta property="og:description" content={finalDescription} />
      <meta property="og:type" content={type} />
      <meta property="og:url" content={canonical} />
      {ogImage && <meta property="og:image" content={ogImage} />}
      <meta name="twitter:card" content={ogImage ? 'summary_large_image' : 'summary'} />
      <meta name="twitter:title" content={finalTitle} />
      <meta name="twitter:description" content={finalDescription} />
      {ogImage && <meta name="twitter:image" content={ogImage} />}
      <script type="application/ld+json">
        {JSON.stringify({
          '@context': 'https://schema.org',
          '@type': type === 'article' ? 'Article' : 'WebPage',
          name: finalTitle,
          description: finalDescription,
          url: canonical,
        })}
      </script>
    </Helmet>
  );
}
