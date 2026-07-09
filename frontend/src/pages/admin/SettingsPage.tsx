import { zodResolver } from '@hookform/resolvers/zod';
import { Plus, Save, Trash2 } from 'lucide-react';
import { useEffect } from 'react';
import { Controller, useFieldArray, useForm } from 'react-hook-form';
import toast from 'react-hot-toast';
import { z } from 'zod';
import { api } from '@/api/services';
import { useResourceMutations, useSiteSettings } from '@/api/hooks';
import type { SiteSettings } from '@/types';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { FieldWrapper, Input, Select, Textarea, Toggle } from '@/components/ui/FormControls';
import { PageLoader } from '@/components/ui/Spinner';
import { Tabs } from '@/components/ui/Tabs';
import { ImageField } from '@/features/admin/ImageField';
import { uid } from '@/lib/utils';

const platformOptions = ['twitter', 'linkedin', 'instagram', 'youtube', 'github'].map(
  (value) => ({ value, label: value }),
);

const settingsSchema = z.object({
  siteName: z.string().min(1, 'Site name is required'),
  tagline: z.string(),
  logoUrl: z.string(),
  logoDarkUrl: z.string(),
  faviconUrl: z.string(),
  phone: z.string(),
  email: z.string(),
  address: z.string(),
  workingHours: z.string(),
  mapEmbedUrl: z.string(),
  socialLinks: z.array(
    z.object({
      id: z.string(),
      platform: z.enum(['twitter', 'linkedin', 'instagram', 'youtube', 'github']),
      url: z.string(),
    }),
  ),
  navLinks: z.array(
    z.object({
      id: z.string(),
      label: z.string().min(1, 'Label is required'),
      path: z.string().min(1, 'Path is required'),
      children: z.array(z.object({ id: z.string(), label: z.string(), path: z.string() })).optional(),
    }),
  ),
  footerText: z.string(),
  copyrightText: z.string(),
  primaryColor: z.string(),
  accentColor: z.string(),
  newsletterEnabled: z.boolean(),
  topBarEnabled: z.boolean(),
});

type SettingsFormValues = z.infer<typeof settingsSchema>;

function toFormValues(settings: SiteSettings): SettingsFormValues {
  return {
    siteName: settings.siteName,
    tagline: settings.tagline,
    logoUrl: settings.logoUrl,
    logoDarkUrl: settings.logoDarkUrl,
    faviconUrl: settings.faviconUrl,
    phone: settings.phone,
    email: settings.email,
    address: settings.address,
    workingHours: settings.workingHours,
    mapEmbedUrl: settings.mapEmbedUrl,
    socialLinks: settings.socialLinks,
    navLinks: settings.navLinks,
    footerText: settings.footerText,
    copyrightText: settings.copyrightText,
    primaryColor: settings.primaryColor,
    accentColor: settings.accentColor,
    newsletterEnabled: settings.newsletterEnabled,
    topBarEnabled: settings.topBarEnabled,
  };
}

const emptyDefaults: SettingsFormValues = {
  siteName: '',
  tagline: '',
  logoUrl: '',
  logoDarkUrl: '',
  faviconUrl: '',
  phone: '',
  email: '',
  address: '',
  workingHours: '',
  mapEmbedUrl: '',
  socialLinks: [],
  navLinks: [],
  footerText: '',
  copyrightText: '',
  primaryColor: '#4c3de4',
  accentColor: '#0088cc',
  newsletterEnabled: true,
  topBarEnabled: false,
};

/** Global site settings, grouped into tabs — one save per tab. */
export function SettingsPage() {
  const { settings, isLoading } = useSiteSettings();
  const { update } = useResourceMutations(api.settings);

  const {
    register,
    control,
    handleSubmit,
    reset,
    setValue,
    watch,
    formState: { errors },
  } = useForm<SettingsFormValues>({
    resolver: zodResolver(settingsSchema),
    defaultValues: emptyDefaults,
  });

  const socialArray = useFieldArray({ control, name: 'socialLinks' });
  const navArray = useFieldArray({ control, name: 'navLinks' });

  useEffect(() => {
    if (settings) reset(toFormValues(settings));
  }, [settings, reset]);

  if (isLoading) return <PageLoader />;

  if (!settings) {
    return (
      <Card hover={false} className="mx-auto max-w-lg text-center">
        <h1 className="mb-2 text-lg font-bold text-heading">Settings missing</h1>
        <p className="text-sm text-neutral-500">
          No settings record found. Reset the seed data to restore it.
        </p>
      </Card>
    );
  }

  const onSubmit = (values: SettingsFormValues) => {
    update.mutate({ id: settings.id, data: values as Partial<SiteSettings> });
  };

  const saveButton = (
    <div className="mt-6 flex justify-end border-t border-neutral-100 pt-5">
      <Button type="submit" size="sm" loading={update.isPending}>
        <Save size={14} aria-hidden="true" />
        Save Changes
      </Button>
    </div>
  );

  const primaryColor = watch('primaryColor');
  const accentColor = watch('accentColor');

  const tabs = [
    {
      id: 'general',
      label: 'General',
      content: (
        <div>
          <div className="grid gap-x-4 gap-y-5 sm:grid-cols-2">
            <Input label="Site Name" required error={errors.siteName?.message} {...register('siteName')} />
            <Input label="Tagline" {...register('tagline')} />
            <div className="sm:col-span-2">
              <Controller
                name="logoUrl"
                control={control}
                render={({ field }) => (
                  <ImageField label="Logo (light backgrounds)" value={field.value} onChange={field.onChange} />
                )}
              />
            </div>
            <div className="sm:col-span-2">
              <Controller
                name="logoDarkUrl"
                control={control}
                render={({ field }) => (
                  <ImageField label="Logo (dark backgrounds)" value={field.value} onChange={field.onChange} />
                )}
              />
            </div>
            <div className="sm:col-span-2">
              <Controller
                name="faviconUrl"
                control={control}
                render={({ field }) => (
                  <ImageField label="Favicon" value={field.value} onChange={field.onChange} />
                )}
              />
            </div>
          </div>
          {saveButton}
        </div>
      ),
    },
    {
      id: 'contact',
      label: 'Contact',
      content: (
        <div>
          <div className="grid gap-x-4 gap-y-5 sm:grid-cols-2">
            <Input label="Phone" {...register('phone')} />
            <Input label="Email" type="email" {...register('email')} />
            <Input label="Address" className="sm:col-span-2" {...register('address')} />
            <Input label="Working Hours" {...register('workingHours')} />
            <Input label="Map Embed URL" {...register('mapEmbedUrl')} />
          </div>
          {saveButton}
        </div>
      ),
    },
    {
      id: 'social',
      label: 'Social',
      content: (
        <div>
          <div className="space-y-3">
            {socialArray.fields.length === 0 && (
              <p className="py-4 text-center text-sm text-neutral-400">No social links yet.</p>
            )}
            {socialArray.fields.map((row, index) => (
              <div key={row.id} className="flex flex-wrap items-end gap-3 rounded-md bg-mist-50 p-4">
                <Select
                  label="Platform"
                  options={platformOptions}
                  className="w-40"
                  {...register(`socialLinks.${index}.platform`)}
                />
                <Input
                  label="URL"
                  className="min-w-[200px] flex-1"
                  error={errors.socialLinks?.[index]?.url?.message}
                  {...register(`socialLinks.${index}.url`)}
                />
                <button
                  type="button"
                  aria-label={`Remove social link ${index + 1}`}
                  onClick={() => socialArray.remove(index)}
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
              onClick={() => socialArray.append({ id: uid(), platform: 'instagram', url: '' })}
            >
              <Plus size={14} aria-hidden="true" />
              Add Social Link
            </Button>
          </div>
          {saveButton}
        </div>
      ),
    },
    {
      id: 'navigation',
      label: 'Navigation',
      content: (
        <div>
          <div className="space-y-3">
            {navArray.fields.map((row, index) => (
              <div key={row.id} className="rounded-md bg-mist-50 p-4">
                <div className="flex flex-wrap items-end gap-3">
                  <Input
                    label="Label"
                    required
                    className="min-w-[140px] flex-1"
                    error={errors.navLinks?.[index]?.label?.message}
                    {...register(`navLinks.${index}.label`)}
                  />
                  <Input
                    label="Path"
                    required
                    className="min-w-[140px] flex-1"
                    error={errors.navLinks?.[index]?.path?.message}
                    {...register(`navLinks.${index}.path`)}
                  />
                  <button
                    type="button"
                    aria-label={`Remove navigation link ${index + 1}`}
                    onClick={() => navArray.remove(index)}
                    className="mb-2 rounded-md p-2 text-neutral-400 transition-colors hover:bg-red-50 hover:text-red-600"
                  >
                    <Trash2 size={16} aria-hidden="true" />
                  </button>
                </div>
                <FieldWrapper label="Children (JSON)" className="mt-3">
                  <textarea
                    rows={3}
                    defaultValue={JSON.stringify(row.children ?? [], null, 2)}
                    aria-label={`Children of ${row.label || `link ${index + 1}`}`}
                    onBlur={(event) => {
                      try {
                        const parsed = JSON.parse(event.target.value || '[]') as unknown;
                        if (!Array.isArray(parsed)) throw new Error('Must be an array');
                        setValue(`navLinks.${index}.children`, parsed as SettingsFormValues['navLinks'][number]['children']);
                      } catch {
                        toast.error('Invalid JSON for nav children — change not applied');
                      }
                    }}
                    className="w-full rounded-btn border border-neutral-200 bg-white px-3 py-2 font-mono text-xs text-heading outline-none transition-colors focus:border-primary-500 focus:ring-2 focus:ring-primary-500/20"
                  />
                </FieldWrapper>
                <p className="mt-1 text-xs text-neutral-400">
                  Array of {'{'}"id","label","path"{'}'} objects. Applied on blur.
                </p>
              </div>
            ))}
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => navArray.append({ id: uid(), label: '', path: '/', children: [] })}
            >
              <Plus size={14} aria-hidden="true" />
              Add Nav Link
            </Button>
          </div>
          {saveButton}
        </div>
      ),
    },
    {
      id: 'appearance',
      label: 'Appearance',
      content: (
        <div>
          <div className="grid gap-x-4 gap-y-5 sm:grid-cols-2">
            <FieldWrapper label="Primary Color">
              <div className="flex items-center gap-3">
                <input
                  type="color"
                  aria-label="Primary color"
                  className="h-11 w-16 cursor-pointer rounded-btn border border-neutral-200 bg-white p-1"
                  {...register('primaryColor')}
                />
                <span
                  className="inline-block h-8 w-24 rounded-md border border-neutral-100"
                  style={{ backgroundColor: primaryColor }}
                  aria-hidden="true"
                />
                <code className="text-xs text-neutral-500">{primaryColor}</code>
              </div>
            </FieldWrapper>
            <FieldWrapper label="Accent Color">
              <div className="flex items-center gap-3">
                <input
                  type="color"
                  aria-label="Accent color"
                  className="h-11 w-16 cursor-pointer rounded-btn border border-neutral-200 bg-white p-1"
                  {...register('accentColor')}
                />
                <span
                  className="inline-block h-8 w-24 rounded-md border border-neutral-100"
                  style={{ backgroundColor: accentColor }}
                  aria-hidden="true"
                />
                <code className="text-xs text-neutral-500">{accentColor}</code>
              </div>
            </FieldWrapper>
          </div>
          {saveButton}
        </div>
      ),
    },
    {
      id: 'footer',
      label: 'Footer',
      content: (
        <div>
          <div className="space-y-5">
            <Textarea label="Footer Text" rows={3} {...register('footerText')} />
            <Input label="Copyright Text" {...register('copyrightText')} />
            <div className="flex flex-wrap gap-8 pt-1">
              <Toggle label="Newsletter enabled" {...register('newsletterEnabled')} />
              <Toggle label="Top bar enabled" {...register('topBarEnabled')} />
            </div>
          </div>
          {saveButton}
        </div>
      ),
    },
  ];

  return (
    <div className="space-y-6">
      <header>
        <h1 className="text-2xl font-bold text-heading">Site Settings</h1>
        <p className="mt-1 text-sm text-neutral-500">
          Branding, contact details, navigation and appearance for the public site.
        </p>
      </header>

      <form onSubmit={handleSubmit(onSubmit)} noValidate>
        <Card hover={false} className="p-6">
          <Tabs items={tabs} />
        </Card>
      </form>
    </div>
  );
}
