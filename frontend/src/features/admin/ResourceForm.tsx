import { zodResolver } from '@hookform/resolvers/zod';
import { X } from 'lucide-react';
import { useMemo, useState, type KeyboardEvent } from 'react';
import {
  Controller,
  useForm,
  type Control,
  type FieldErrors,
  type FieldValues,
  type Resolver,
  type UseFormRegister,
} from 'react-hook-form';
import { z } from 'zod';
import { api } from '@/api/services';
import { useList } from '@/api/hooks';
import type { ResourceApi } from '@/api/resource';
import { Button } from '@/components/ui/Button';
import { FieldWrapper, Input, Select, Textarea, Toggle } from '@/components/ui/FormControls';
import { availableIconNames } from '@/components/common/DynamicIcon';
import { cn } from '@/lib/cn';
import { ImageField } from './ImageField';
import { RichTextEditor } from './RichTextEditor';
import type { AdminRecord, FieldDef, OptionsResourceKey, SelectOption } from './types';

/* ------------------------------ zod building ------------------------------ */

function fieldSchema(field: FieldDef): z.ZodTypeAny {
  switch (field.type) {
    case 'number':
      return z.coerce.number({ invalid_type_error: `${field.label} must be a number` });
    case 'toggle':
      return z.boolean().default(false);
    case 'tags':
    case 'list':
      return z
        .array(z.string())
        .default([])
        .transform((items) => items.map((item) => item.trim()).filter(Boolean));
    default: {
      const base = z.string({ required_error: `${field.label} is required` });
      return field.required
        ? base.trim().min(1, `${field.label} is required`)
        : base.optional().default('');
    }
  }
}

interface SchemaTree {
  [key: string]: z.ZodTypeAny | SchemaTree;
}

/** Builds a nested zod object from dot-path field names (e.g. `seo.metaTitle`). */
function buildSchema(fields: FieldDef[]): z.ZodTypeAny {
  const tree: SchemaTree = {};
  for (const field of fields) {
    const parts = field.name.split('.');
    let node = tree;
    parts.forEach((part, index) => {
      if (index === parts.length - 1) {
        node[part] = fieldSchema(field);
      } else {
        const next = node[part];
        if (next && !(next instanceof z.ZodType)) {
          node = next;
        } else {
          const created: SchemaTree = {};
          node[part] = created;
          node = created;
        }
      }
    });
  }
  const toZod = (node: SchemaTree): z.ZodTypeAny =>
    z
      .object(
        Object.fromEntries(
          Object.entries(node).map(([key, value]) => [
            key,
            value instanceof z.ZodType ? value : toZod(value as SchemaTree),
          ]),
        ),
      )
      .passthrough();
  return toZod(tree);
}

/** Reads a (possibly nested) RHF error message for a dot-path field name. */
function getErrorMessage(errors: FieldErrors, name: string): string | undefined {
  let node: unknown = errors;
  for (const part of name.split('.')) {
    if (!node || typeof node !== 'object') return undefined;
    node = (node as Record<string, unknown>)[part];
  }
  if (node && typeof node === 'object' && 'message' in node) {
    const message = (node as { message?: unknown }).message;
    return typeof message === 'string' ? message : undefined;
  }
  return undefined;
}

/* ------------------------------- tag chips -------------------------------- */

interface TagsInputProps {
  value: string[];
  onChange: (tags: string[]) => void;
  label?: string;
  error?: string;
  required?: boolean;
}

function TagsInput({ value, onChange, label, error, required }: TagsInputProps) {
  const [draft, setDraft] = useState('');

  const addDraft = () => {
    const tag = draft.trim().replace(/,+$/, '');
    if (tag && !value.includes(tag)) onChange([...value, tag]);
    setDraft('');
  };

  const handleKeyDown = (event: KeyboardEvent<HTMLInputElement>) => {
    if (event.key === 'Enter' || event.key === ',') {
      event.preventDefault();
      addDraft();
    } else if (event.key === 'Backspace' && !draft && value.length > 0) {
      onChange(value.slice(0, -1));
    }
  };

  return (
    <FieldWrapper label={label} error={error} required={required}>
      <div
        className={cn(
          'flex min-h-[46px] flex-wrap items-center gap-1.5 rounded-btn border bg-white px-3 py-2 transition-colors focus-within:border-primary-500 focus-within:ring-2 focus-within:ring-primary-500/20',
          error ? 'border-red-400' : 'border-neutral-200',
        )}
      >
        {value.map((tag) => (
          <span
            key={tag}
            className="inline-flex items-center gap-1 rounded-full bg-primary-50 px-2.5 py-1 text-xs font-semibold text-primary-700"
          >
            {tag}
            <button
              type="button"
              aria-label={`Remove ${tag}`}
              onClick={() => onChange(value.filter((item) => item !== tag))}
              className="rounded-full p-0.5 hover:bg-primary-100"
            >
              <X size={11} aria-hidden="true" />
            </button>
          </span>
        ))}
        <input
          type="text"
          value={draft}
          onChange={(event) => setDraft(event.target.value)}
          onKeyDown={handleKeyDown}
          onBlur={addDraft}
          placeholder={value.length === 0 ? 'Type and press Enter…' : ''}
          aria-label={label ? `Add ${label}` : 'Add tag'}
          className="min-w-[120px] flex-1 border-0 bg-transparent py-1 text-sm text-heading outline-none placeholder:text-neutral-400"
        />
      </div>
    </FieldWrapper>
  );
}

/* --------------------------- dynamic select data --------------------------- */

const optionsResources = {
  categories: api.categories,
  authors: api.authors,
  roles: api.roles,
  'job-openings': api.jobOpenings,
  projects: api.projects,
} as const;

function useResourceOptions(key: OptionsResourceKey | undefined): SelectOption[] {
  const resource = (
    key ? optionsResources[key] : api.categories
  ) as unknown as ResourceApi<AdminRecord>;
  const { data } = useList(resource, { enabled: Boolean(key) });
  return useMemo(() => {
    if (!key || !data) return [];
    return data.map((item) => {
      const label =
        typeof item.name === 'string' && item.name
          ? item.name
          : typeof item.title === 'string'
            ? item.title
            : item.id;
      return { value: item.id, label: String(label) };
    });
  }, [key, data]);
}

/* ------------------------------ field renderer ----------------------------- */

interface FieldRendererProps {
  field: FieldDef;
  register: UseFormRegister<FieldValues>;
  control: Control<FieldValues>;
  errors: FieldErrors<FieldValues>;
}

function FieldRenderer({ field, register, control, errors }: FieldRendererProps) {
  const error = getErrorMessage(errors, field.name);
  const dynamicOptions = useResourceOptions(
    field.type === 'select' ? field.optionsResource : undefined,
  );

  const hint = field.hint ? (
    <p className="mt-1.5 text-xs text-neutral-400">{field.hint}</p>
  ) : null;

  switch (field.type) {
    case 'text':
      return (
        <div>
          <Input label={field.label} required={field.required} error={error} {...register(field.name)} />
          {hint}
        </div>
      );
    case 'number':
      return (
        <div>
          <Input
            type="number"
            step="any"
            label={field.label}
            required={field.required}
            error={error}
            {...register(field.name)}
          />
          {hint}
        </div>
      );
    case 'textarea':
      return (
        <div>
          <Textarea label={field.label} required={field.required} error={error} rows={4} {...register(field.name)} />
          {hint}
        </div>
      );
    case 'select': {
      const options = field.optionsResource ? dynamicOptions : (field.options ?? []);
      const withPlaceholder: SelectOption[] = [{ value: '', label: '— Select —' }, ...options];
      return (
        <div>
          <Select
            label={field.label}
            required={field.required}
            error={error}
            options={withPlaceholder}
            {...register(field.name)}
          />
          {hint}
        </div>
      );
    }
    case 'icon':
      return (
        <div>
          <Select
            label={field.label}
            required={field.required}
            error={error}
            options={[
              { value: '', label: '— Select icon —' },
              ...availableIconNames.map((name) => ({ value: name, label: name })),
            ]}
            {...register(field.name)}
          />
          {hint}
        </div>
      );
    case 'toggle':
      return (
        <div className="pt-6">
          <Toggle label={field.label} {...register(field.name)} />
          {hint}
        </div>
      );
    case 'date':
      return (
        <Controller
          name={field.name}
          control={control}
          render={({ field: rhf }) => (
            <div>
              <Input
                type="date"
                label={field.label}
                required={field.required}
                error={error}
                value={typeof rhf.value === 'string' && rhf.value ? rhf.value.slice(0, 10) : ''}
                onChange={(event) =>
                  rhf.onChange(
                    event.target.value
                      ? new Date(`${event.target.value}T12:00:00`).toISOString()
                      : '',
                  )
                }
              />
              {hint}
            </div>
          )}
        />
      );
    case 'image':
      return (
        <Controller
          name={field.name}
          control={control}
          render={({ field: rhf }) => (
            <div>
              <ImageField
                label={field.label}
                required={field.required}
                error={error}
                value={typeof rhf.value === 'string' ? rhf.value : ''}
                onChange={rhf.onChange}
              />
              {hint}
            </div>
          )}
        />
      );
    case 'richtext':
      return (
        <Controller
          name={field.name}
          control={control}
          render={({ field: rhf }) => (
            <div>
              <RichTextEditor
                label={field.label}
                required={field.required}
                error={error}
                value={typeof rhf.value === 'string' ? rhf.value : ''}
                onChange={rhf.onChange}
              />
              {hint}
            </div>
          )}
        />
      );
    case 'tags':
      return (
        <Controller
          name={field.name}
          control={control}
          render={({ field: rhf }) => (
            <div>
              <TagsInput
                label={field.label}
                required={field.required}
                error={error}
                value={Array.isArray(rhf.value) ? (rhf.value as string[]) : []}
                onChange={rhf.onChange}
              />
              {hint}
            </div>
          )}
        />
      );
    case 'list':
      return (
        <Controller
          name={field.name}
          control={control}
          render={({ field: rhf }) => (
            <div>
              <Textarea
                label={field.label}
                required={field.required}
                error={error}
                rows={4}
                placeholder="One item per line"
                value={Array.isArray(rhf.value) ? (rhf.value as string[]).join('\n') : ''}
                onChange={(event) => rhf.onChange(event.target.value.split('\n'))}
              />
              {hint ?? (
                <p className="mt-1.5 text-xs text-neutral-400">One item per line.</p>
              )}
            </div>
          )}
        />
      );
    default:
      return null;
  }
}

/* --------------------------------- form ----------------------------------- */

const WIDE_TYPES: FieldDef['type'][] = ['textarea', 'richtext', 'list', 'image'];

interface ResourceFormProps {
  fields: FieldDef[];
  defaults: Record<string, unknown>;
  record?: Record<string, unknown> | null;
  onSubmit: (values: Record<string, unknown>) => Promise<void> | void;
  onCancel: () => void;
  submitting?: boolean;
}

/** Schema-driven form: renders a FieldDef list with RHF + zod validation. */
export function ResourceForm({
  fields,
  defaults,
  record,
  onSubmit,
  onCancel,
  submitting,
}: ResourceFormProps) {
  const schema = useMemo(() => buildSchema(fields), [fields]);
  const defaultValues = useMemo(
    () => ({ ...defaults, ...(record ?? {}) }),
    [defaults, record],
  );

  const {
    register,
    control,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<FieldValues>({
    resolver: zodResolver(schema) as unknown as Resolver<FieldValues>,
    defaultValues,
  });

  return (
    <form
      onSubmit={handleSubmit((values) => onSubmit(values as Record<string, unknown>))}
      noValidate
      className="space-y-5"
    >
      <div className="grid gap-x-4 gap-y-5 sm:grid-cols-2">
        {fields.map((field) => (
          <div key={field.name} className={cn(WIDE_TYPES.includes(field.type) && 'sm:col-span-2')}>
            <FieldRenderer field={field} register={register} control={control} errors={errors} />
          </div>
        ))}
      </div>
      <div className="flex items-center justify-end gap-3 border-t border-neutral-100 pt-4">
        <Button type="button" variant="ghost" size="sm" onClick={onCancel}>
          Cancel
        </Button>
        <Button type="submit" size="sm" loading={submitting || isSubmitting}>
          Save
        </Button>
      </div>
    </form>
  );
}
