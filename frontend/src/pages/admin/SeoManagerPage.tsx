import { Info, Plus } from 'lucide-react';
import { useState } from 'react';
import { api } from '@/api/services';
import { useList, useResourceMutations } from '@/api/hooks';
import type { PageSeo } from '@/types';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { Modal } from '@/components/ui/Modal';
import { ResourceForm } from '@/features/admin/ResourceForm';
import { ResourceTable } from '@/features/admin/ResourceTable';
import type { AdminRecord, ModuleConfig } from '@/features/admin/types';
import { truncate } from '@/lib/utils';

const seoConfig: ModuleConfig = {
  key: 'seo',
  title: 'Page SEO',
  singular: 'Page',
  resource: api.pageSeo,
  columns: [
    { key: 'page', label: 'Page' },
    { key: 'seo.metaTitle', label: 'Meta Title' },
    {
      key: 'seo.metaDescription',
      label: 'Description',
      render: (row) => {
        const seo = row.seo as PageSeo['seo'] | undefined;
        return seo?.metaDescription ? truncate(seo.metaDescription, 70) : '—';
      },
    },
    {
      key: 'seo.robots',
      label: 'Robots',
      render: (row) => {
        const seo = row.seo as PageSeo['seo'] | undefined;
        const robots = seo?.robots ?? 'index,follow';
        return (
          <Badge tone={robots.includes('noindex') ? 'warning' : 'success'}>{robots}</Badge>
        );
      },
    },
  ],
  fields: [
    {
      name: 'page',
      label: 'Page Route',
      type: 'text',
      required: true,
      hint: 'Route path on the public site, e.g. "/about".',
    },
    { name: 'seo.metaTitle', label: 'Meta Title', type: 'text', required: true },
    { name: 'seo.metaDescription', label: 'Meta Description', type: 'textarea' },
    { name: 'seo.keywords', label: 'Keywords', type: 'text', hint: 'Comma-separated keywords.' },
    { name: 'seo.canonicalUrl', label: 'Canonical URL', type: 'text' },
    { name: 'seo.ogImage', label: 'Open Graph Image', type: 'image' },
    {
      name: 'seo.robots',
      label: 'Robots',
      type: 'select',
      options: [
        { value: 'index,follow', label: 'index,follow' },
        { value: 'noindex,nofollow', label: 'noindex,nofollow' },
      ],
    },
  ],
  defaults: {
    page: '',
    seo: {
      metaTitle: '',
      metaDescription: '',
      keywords: '',
      canonicalUrl: '',
      ogImage: '',
      robots: 'index,follow',
    },
  },
  searchKeys: ['page'],
};

/** Per-route metadata manager for the public site. */
export function SeoManagerPage() {
  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState<AdminRecord | null>(null);
  const { data, isLoading } = useList<AdminRecord>(seoConfig.resource);
  const { create, update, remove } = useResourceMutations<AdminRecord>(seoConfig.resource);

  const handleSubmit = async (values: Record<string, unknown>) => {
    if (editing) {
      await update.mutateAsync({ id: editing.id, data: values });
    } else {
      await create.mutateAsync(values as Omit<AdminRecord, 'id' | 'createdAt' | 'updatedAt'>);
    }
    setModalOpen(false);
    setEditing(null);
  };

  return (
    <div className="space-y-6">
      <header className="flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <h1 className="text-2xl font-bold text-heading">SEO</h1>
          <Badge tone="neutral">{data?.length ?? 0}</Badge>
        </div>
        <Button
          size="sm"
          onClick={() => {
            setEditing(null);
            setModalOpen(true);
          }}
        >
          <Plus size={15} aria-hidden="true" />
          Add Page
        </Button>
      </header>

      <Card hover={false} className="p-4 sm:p-6">
        <ResourceTable
          config={seoConfig}
          rows={data}
          loading={isLoading}
          onEdit={(row) => {
            setEditing(row);
            setModalOpen(true);
          }}
          onDelete={(row) => remove.mutate(row.id)}
        />
      </Card>

      <Card hover={false} className="flex items-start gap-3 bg-primary-50/60 p-5">
        <Info size={18} className="mt-0.5 shrink-0 text-primary-600" aria-hidden="true" />
        <div className="text-sm leading-relaxed text-neutral-600">
          <p className="font-semibold text-heading">Sitemap &amp; robots.txt</p>
          <p>
            The sitemap.xml and robots.txt files are generated automatically at deploy time from
            the entries above — no manual editing required. Pages marked{' '}
            <code className="rounded bg-white px-1 py-0.5 text-xs">noindex,nofollow</code> are
            excluded from the sitemap.
          </p>
        </div>
      </Card>

      <Modal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        title={editing ? `Edit SEO — ${String(editing.page ?? '')}` : 'Add Page SEO'}
        size="xl"
      >
        <ResourceForm
          key={editing?.id ?? 'create'}
          fields={seoConfig.fields}
          defaults={seoConfig.defaults}
          record={editing}
          onSubmit={handleSubmit}
          onCancel={() => setModalOpen(false)}
          submitting={create.isPending || update.isPending}
        />
      </Modal>
    </div>
  );
}
