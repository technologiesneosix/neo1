import type { ReactNode } from 'react';
import type { BaseEntity } from '@/types';
import type { ResourceApi } from '@/api/resource';

/** Resources that can feed a dynamic select field (id → name/title). */
export type OptionsResourceKey =
  | 'categories'
  | 'authors'
  | 'roles'
  | 'job-openings'
  | 'projects';

export interface SelectOption {
  value: string;
  label: string;
}

interface FieldBase {
  /** Form field name — supports dot paths for nested values (e.g. `seo.metaTitle`). */
  name: string;
  label: string;
  required?: boolean;
  /** Small helper text rendered under the control. */
  hint?: string;
}

/** Discriminated union describing every editable control the admin can render. */
export type FieldDef =
  | (FieldBase & { type: 'text' })
  | (FieldBase & { type: 'textarea' })
  | (FieldBase & { type: 'richtext' })
  | (FieldBase & { type: 'number' })
  | (FieldBase & {
      type: 'select';
      options?: SelectOption[];
      /** Resolve options dynamically from a resource (id as value, name/title as label). */
      optionsResource?: OptionsResourceKey;
    })
  | (FieldBase & { type: 'toggle' })
  | (FieldBase & { type: 'image' })
  | (FieldBase & { type: 'tags' })
  | (FieldBase & { type: 'list' })
  | (FieldBase & { type: 'icon' })
  | (FieldBase & { type: 'date' });

export type FieldType = FieldDef['type'];

/** Generic row shape flowing through admin tables/forms. */
export type AdminRecord = BaseEntity & Record<string, unknown>;

export interface ColumnDef {
  key: string;
  label: string;
  render?: (row: AdminRecord) => ReactNode;
}

export interface ModuleConfig {
  /** Route module key — must match src/pages/admin/routes.tsx. */
  key: string;
  title: string;
  singular: string;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  resource: ResourceApi<any>;
  columns: ColumnDef[];
  fields: FieldDef[];
  defaults: Record<string, unknown>;
  searchKeys: string[];
}
