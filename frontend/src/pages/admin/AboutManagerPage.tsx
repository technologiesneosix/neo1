import { zodResolver } from '@hookform/resolvers/zod';
import { Plus, Save, Trash2 } from 'lucide-react';
import { useEffect } from 'react';
import { Controller, useFieldArray, useForm } from 'react-hook-form';
import { z } from 'zod';
import { api } from '@/api/services';
import { useList, useResourceMutations } from '@/api/hooks';
import type { AboutContent } from '@/types';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { Input, Textarea } from '@/components/ui/FormControls';
import { PageLoader } from '@/components/ui/Spinner';
import { Tabs } from '@/components/ui/Tabs';
import { ImageField } from '@/features/admin/ImageField';
import { uid } from '@/lib/utils';

const aboutSchema = z.object({
  sectionLabel: z.string(),
  title: z.string().min(1, 'Title is required'),
  leadText: z.string(),
  description: z.string(),
  imageUrl: z.string(),
  ctaLabel: z.string(),
  ctaLink: z.string(),
  mission: z.string(),
  vision: z.string(),
  values: z.array(z.string()),
  stats: z.array(
    z.object({
      id: z.string(),
      label: z.string().min(1, 'Label is required'),
      value: z.coerce.number(),
      suffix: z.string(),
    }),
  ),
});

type AboutFormValues = z.infer<typeof aboutSchema>;

function toFormValues(about: AboutContent): AboutFormValues {
  return {
    sectionLabel: about.sectionLabel,
    title: about.title,
    leadText: about.leadText,
    description: about.description,
    imageUrl: about.imageUrl,
    ctaLabel: about.ctaLabel,
    ctaLink: about.ctaLink,
    mission: about.mission,
    vision: about.vision,
    values: about.values,
    stats: about.stats,
  };
}

/** Single-record editor for the About section of the public site. */
export function AboutManagerPage() {
  const { data, isLoading } = useList(api.about);
  const { update } = useResourceMutations(api.about);
  const about = data?.[0];

  const {
    register,
    control,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<AboutFormValues>({
    resolver: zodResolver(aboutSchema),
    defaultValues: {
      sectionLabel: '',
      title: '',
      leadText: '',
      description: '',
      imageUrl: '',
      ctaLabel: '',
      ctaLink: '',
      mission: '',
      vision: '',
      values: [],
      stats: [],
    },
  });

  const statsArray = useFieldArray({ control, name: 'stats' });

  useEffect(() => {
    if (about) reset(toFormValues(about));
  }, [about, reset]);

  if (isLoading) return <PageLoader />;

  if (!about) {
    return (
      <Card hover={false} className="mx-auto max-w-lg text-center">
        <h1 className="mb-2 text-lg font-bold text-heading">About content missing</h1>
        <p className="text-sm text-neutral-500">
          No about record found in the database. Reset the seed data to restore it.
        </p>
      </Card>
    );
  }

  const onSubmit = (values: AboutFormValues) => {
    const cleaned: AboutFormValues = {
      ...values,
      values: values.values.map((item) => item.trim()).filter(Boolean),
    };
    update.mutate({ id: about.id, data: cleaned as Partial<AboutContent> });
  };

  const tabs = [
    {
      id: 'content',
      label: 'Content',
      content: (
        <div className="grid gap-x-4 gap-y-5 sm:grid-cols-2">
          <Input label="Section Label" error={errors.sectionLabel?.message} {...register('sectionLabel')} />
          <Input label="Title" required error={errors.title?.message} {...register('title')} />
          <div className="sm:col-span-2">
            <Textarea label="Lead Text" rows={3} error={errors.leadText?.message} {...register('leadText')} />
          </div>
          <div className="sm:col-span-2">
            <Textarea label="Description" rows={5} error={errors.description?.message} {...register('description')} />
          </div>
          <div className="sm:col-span-2">
            <Controller
              name="imageUrl"
              control={control}
              render={({ field }) => (
                <ImageField
                  label="Image"
                  value={typeof field.value === 'string' ? field.value : ''}
                  onChange={field.onChange}
                />
              )}
            />
          </div>
          <Input label="CTA Label" error={errors.ctaLabel?.message} {...register('ctaLabel')} />
          <Input label="CTA Link" error={errors.ctaLink?.message} {...register('ctaLink')} />
        </div>
      ),
    },
    {
      id: 'mission-vision',
      label: 'Mission & Vision',
      content: (
        <div className="space-y-5">
          <Textarea label="Mission" rows={4} error={errors.mission?.message} {...register('mission')} />
          <Textarea label="Vision" rows={4} error={errors.vision?.message} {...register('vision')} />
        </div>
      ),
    },
    {
      id: 'values',
      label: 'Values',
      content: (
        <Controller
          name="values"
          control={control}
          render={({ field }) => (
            <div>
              <Textarea
                label="Company Values"
                rows={6}
                placeholder="One value per line"
                value={Array.isArray(field.value) ? field.value.join('\n') : ''}
                onChange={(event) => field.onChange(event.target.value.split('\n'))}
              />
              <p className="mt-1.5 text-xs text-neutral-400">One value per line.</p>
            </div>
          )}
        />
      ),
    },
    {
      id: 'stats',
      label: 'Stats',
      content: (
        <div className="space-y-4">
          {statsArray.fields.length === 0 && (
            <p className="py-4 text-center text-sm text-neutral-400">No stats yet — add one.</p>
          )}
          {statsArray.fields.map((row, index) => (
            <div key={row.id} className="flex flex-wrap items-end gap-3 rounded-md bg-mist-50 p-4">
              <Input
                label="Label"
                required
                className="min-w-[160px] flex-1"
                error={errors.stats?.[index]?.label?.message}
                {...register(`stats.${index}.label`)}
              />
              <Input
                label="Value"
                type="number"
                step="any"
                className="w-32"
                error={errors.stats?.[index]?.value?.message}
                {...register(`stats.${index}.value`)}
              />
              <Input label="Suffix" className="w-24" {...register(`stats.${index}.suffix`)} />
              <button
                type="button"
                aria-label={`Remove stat ${index + 1}`}
                onClick={() => statsArray.remove(index)}
                className="mb-2 rounded-md p-2 text-neutral-400 transition-colors hover:bg-red-50 hover:text-red-600"
              >
                <Trash2 size={16} aria-hidden="true" />
              </button>
            </div>
          ))}
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={() => statsArray.append({ id: uid(), label: '', value: 0, suffix: '' })}
          >
            <Plus size={14} aria-hidden="true" />
            Add Stat
          </Button>
        </div>
      ),
    },
  ];

  return (
    <div className="space-y-6">
      <header className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-heading">About Section</h1>
          <p className="mt-1 text-sm text-neutral-500">
            Everything shown on the public About pages.
          </p>
        </div>
      </header>

      <form onSubmit={handleSubmit(onSubmit)} noValidate>
        <Card hover={false} className="p-6">
          <Tabs items={tabs} />
          <div className="mt-8 flex justify-end border-t border-neutral-100 pt-5">
            <Button type="submit" loading={update.isPending}>
              <Save size={15} aria-hidden="true" />
              Save Changes
            </Button>
          </div>
        </Card>
      </form>
    </div>
  );
}
