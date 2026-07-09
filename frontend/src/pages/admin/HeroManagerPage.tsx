import { Plus } from 'lucide-react';
import { useState } from 'react';
import { api } from '@/api/services';
import { useList, useResourceMutations } from '@/api/hooks';
import type { HeroSlide } from '@/types';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { Modal } from '@/components/ui/Modal';
import { ResourceForm } from '@/features/admin/ResourceForm';
import { ResourceTable } from '@/features/admin/ResourceTable';
import type { AdminRecord, ModuleConfig } from '@/features/admin/types';
import { cn } from '@/lib/cn';

const heroConfig: ModuleConfig = {
  key: 'hero',
  title: 'Hero Slides',
  singular: 'Slide',
  resource: api.heroSlides,
  columns: [
    { key: 'imageUrl', label: 'Image' },
    { key: 'title', label: 'Title' },
    { key: 'subtitle', label: 'Subtitle' },
    { key: 'order', label: 'Order' },
    { key: 'active', label: 'Active' },
  ],
  fields: [
    { name: 'title', label: 'Title', type: 'text', required: true },
    { name: 'subtitle', label: 'Subtitle', type: 'text' },
    { name: 'description', label: 'Description', type: 'textarea' },
    { name: 'primaryCtaLabel', label: 'Primary CTA Label', type: 'text', required: true },
    { name: 'primaryCtaLink', label: 'Primary CTA Link', type: 'text', required: true },
    { name: 'secondaryCtaLabel', label: 'Secondary CTA Label', type: 'text' },
    { name: 'secondaryCtaLink', label: 'Secondary CTA Link', type: 'text' },
    { name: 'imageUrl', label: 'Image', type: 'image' },
    { name: 'order', label: 'Order', type: 'number' },
    { name: 'active', label: 'Active', type: 'toggle' },
  ],
  defaults: {
    title: '',
    subtitle: '',
    description: '',
    primaryCtaLabel: 'Get Started',
    primaryCtaLink: '/contact',
    secondaryCtaLabel: '',
    secondaryCtaLink: '',
    imageUrl: '',
    order: 0,
    active: true,
  },
  searchKeys: ['title', 'subtitle', 'description'],
};

/** Manages homepage hero slides with a live mini-preview of each slide. */
export function HeroManagerPage() {
  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState<HeroSlide | null>(null);
  const { data, isLoading } = useList(api.heroSlides);
  const { create, update, remove } = useResourceMutations(api.heroSlides);

  const slides = [...(data ?? [])].sort((a, b) => a.order - b.order);

  const handleSubmit = async (values: Record<string, unknown>) => {
    if (editing) {
      await update.mutateAsync({ id: editing.id, data: values as Partial<HeroSlide> });
    } else {
      await create.mutateAsync(values as Omit<HeroSlide, 'id' | 'createdAt' | 'updatedAt'>);
    }
    setModalOpen(false);
    setEditing(null);
  };

  return (
    <div className="space-y-6">
      <header className="flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <h1 className="text-2xl font-bold text-heading">Hero Slides</h1>
          <Badge tone="neutral">{slides.length}</Badge>
        </div>
        <Button
          size="sm"
          onClick={() => {
            setEditing(null);
            setModalOpen(true);
          }}
        >
          <Plus size={15} aria-hidden="true" />
          Add Slide
        </Button>
      </header>

      {/* Live preview strip */}
      {slides.length > 0 && (
        <section aria-label="Slide previews" className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
          {slides.map((slide) => (
            <Card key={slide.id} hover={false} className="overflow-hidden p-0">
              <div className="relative flex min-h-[150px] items-center overflow-hidden bg-ink-900 p-5">
                {slide.imageUrl && (
                  <img
                    src={slide.imageUrl}
                    alt=""
                    className="absolute inset-0 h-full w-full object-cover opacity-25"
                  />
                )}
                <div className="relative">
                  <p className="text-[10px] font-semibold uppercase tracking-[0.25em] text-accent-400">
                    {slide.subtitle}
                  </p>
                  <p className="mt-1 text-lg font-bold leading-snug text-white">{slide.title}</p>
                  {slide.description && (
                    <p className="mt-1 text-xs text-neutral-300">{slide.description}</p>
                  )}
                  <span className="mt-3 inline-block rounded-btn bg-brand-gradient px-4 py-1.5 text-[11px] font-semibold text-white">
                    {slide.primaryCtaLabel}
                  </span>
                </div>
              </div>
              <div className="flex items-center justify-between px-4 py-2.5">
                <span className="text-xs text-neutral-400">Slide {slide.order}</span>
                <span
                  className={cn(
                    'inline-flex items-center gap-1.5 text-xs font-semibold',
                    slide.active ? 'text-emerald-600' : 'text-neutral-400',
                  )}
                >
                  <span
                    className={cn(
                      'h-1.5 w-1.5 rounded-full',
                      slide.active ? 'bg-emerald-500' : 'bg-neutral-300',
                    )}
                    aria-hidden="true"
                  />
                  {slide.active ? 'Active' : 'Hidden'}
                </span>
              </div>
            </Card>
          ))}
        </section>
      )}

      <Card hover={false} className="p-4 sm:p-6">
        <ResourceTable
          config={heroConfig}
          rows={data as unknown as AdminRecord[] | undefined}
          loading={isLoading}
          onEdit={(row) => {
            setEditing(row as unknown as HeroSlide);
            setModalOpen(true);
          }}
          onDelete={(row) => remove.mutate(row.id)}
        />
      </Card>

      <Modal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        title={editing ? 'Edit Slide' : 'Add Slide'}
        size="xl"
      >
        <ResourceForm
          key={editing?.id ?? 'create'}
          fields={heroConfig.fields}
          defaults={heroConfig.defaults}
          record={editing as unknown as Record<string, unknown> | null}
          onSubmit={handleSubmit}
          onCancel={() => setModalOpen(false)}
          submitting={create.isPending || update.isPending}
        />
      </Modal>
    </div>
  );
}
