import { Inbox, Pencil, Search, Trash2 } from 'lucide-react';
import { useMemo, useState, type ReactNode } from 'react';
import { Badge } from '@/components/ui/Badge';
import { PageLoader } from '@/components/ui/Spinner';
import { Modal } from '@/components/ui/Modal';
import { Button } from '@/components/ui/Button';
import { truncate } from '@/lib/utils';
import type { AdminRecord, ModuleConfig } from './types';

const IMAGE_KEY_HINTS = ['image', 'avatar', 'photo', 'banner', 'cover', 'logo', 'favicon'];

function looksLikeImage(key: string, value: string): boolean {
  const keyHit = IMAGE_KEY_HINTS.some((hint) => key.toLowerCase().includes(hint));
  const valueHit =
    /^https?:\/\/.+(\.(png|jpe?g|gif|webp|svg|avif)(\?.*)?$|picsum\.photos|images\.unsplash)/i.test(
      value,
    ) || value.startsWith('data:image');
  return keyHit || valueHit;
}

/** Reads a possibly nested value ('seo.metaTitle') off a record. */
function getValue(row: AdminRecord, key: string): unknown {
  return key.split('.').reduce<unknown>((node, part) => {
    if (node && typeof node === 'object') return (node as Record<string, unknown>)[part];
    return undefined;
  }, row);
}

function renderCell(row: AdminRecord, key: string): ReactNode {
  const value = getValue(row, key);
  if (value === null || value === undefined || value === '') {
    return <span className="text-neutral-300">—</span>;
  }
  if (typeof value === 'boolean') {
    return <Badge tone={value ? 'success' : 'neutral'}>{value ? 'Yes' : 'No'}</Badge>;
  }
  if (Array.isArray(value)) {
    return truncate(value.map(String).join(', '), 50);
  }
  if (typeof value === 'string' && looksLikeImage(key, value)) {
    return (
      <img
        src={value}
        alt=""
        className="h-10 w-10 rounded-md border border-neutral-100 object-cover"
        loading="lazy"
      />
    );
  }
  return truncate(String(value), 70);
}

interface ResourceTableProps {
  config: ModuleConfig;
  rows: AdminRecord[] | undefined;
  loading: boolean;
  onEdit: (row: AdminRecord) => void;
  onDelete: (row: AdminRecord) => void;
}

/** Searchable data table shared by every admin CRUD module. */
export function ResourceTable({ config, rows, loading, onEdit, onDelete }: ResourceTableProps) {
  const [query, setQuery] = useState('');
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [rowToDelete, setRowToDelete] = useState<AdminRecord | null>(null);

  const filtered = useMemo(() => {
    const list = rows ?? [];
    const needle = query.trim().toLowerCase();
    if (!needle) return list;
    return list.filter((row) =>
      config.searchKeys.some((key) => {
        const value = getValue(row, key);
        return typeof value === 'string' && value.toLowerCase().includes(needle);
      }),
    );
  }, [rows, query, config.searchKeys]);

  const handleDelete = (row: AdminRecord) => {
    setRowToDelete(row);
    setDeleteModalOpen(true);
  };

  if (loading) return <PageLoader />;

  return (
    <div>
      <div className="relative mb-4 max-w-xs">
        <Search
          size={15}
          className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-neutral-400"
          aria-hidden="true"
        />
        <input
          type="search"
          value={query}
          onChange={(event) => setQuery(event.target.value)}
          placeholder={`Search ${config.title.toLowerCase()}…`}
          aria-label={`Search ${config.title}`}
          className="w-full rounded-btn border border-neutral-200 bg-white py-2.5 pl-9 pr-4 text-sm text-heading outline-none transition-colors placeholder:text-neutral-400 focus:border-primary-500 focus:ring-2 focus:ring-primary-500/20"
        />
      </div>

      {filtered.length === 0 ? (
        <div className="flex flex-col items-center gap-3 py-16 text-center">
          <Inbox size={32} className="text-neutral-300" aria-hidden="true" />
          <p className="text-sm text-neutral-400">
            {query
              ? `No ${config.title.toLowerCase()} match "${query}".`
              : `No ${config.title.toLowerCase()} yet — add the first one.`}
          </p>
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full min-w-[640px] text-left text-sm">
            <thead>
              <tr className="border-b border-neutral-100">
                {config.columns.map((column) => (
                  <th
                    key={column.key}
                    scope="col"
                    className="px-4 py-3 text-[11px] font-semibold uppercase tracking-wider text-neutral-400"
                  >
                    {column.label}
                  </th>
                ))}
                <th scope="col" className="px-4 py-3 text-right text-[11px] font-semibold uppercase tracking-wider text-neutral-400">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((row) => (
                <tr
                  key={row.id}
                  className="border-b border-neutral-50 transition-colors last:border-0 hover:bg-mist-50"
                >
                  {config.columns.map((column) => (
                    <td key={column.key} className="px-4 py-3 align-middle text-neutral-600">
                      {column.render ? column.render(row) : renderCell(row, column.key)}
                    </td>
                  ))}
                  <td className="px-4 py-3 text-right">
                    <div className="inline-flex items-center gap-1">
                      <button
                        type="button"
                        onClick={() => onEdit(row)}
                        aria-label={`Edit ${config.singular.toLowerCase()}`}
                        className="rounded-md p-2 text-neutral-400 transition-colors hover:bg-primary-50 hover:text-primary-600"
                      >
                        <Pencil size={15} aria-hidden="true" />
                      </button>
                      <button
                        type="button"
                        onClick={() => handleDelete(row)}
                        aria-label={`Delete ${config.singular.toLowerCase()}`}
                        className="rounded-md p-2 text-neutral-400 transition-colors hover:bg-red-50 hover:text-red-600"
                      >
                        <Trash2 size={15} aria-hidden="true" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {deleteModalOpen && rowToDelete && (
        <Modal
          open={deleteModalOpen}
          onClose={() => {
            setDeleteModalOpen(false);
            setRowToDelete(null);
          }}
          title={`Delete ${config.singular}`}
          size="md"
        >
          <div className="space-y-4 py-2">
            <p className="text-sm text-neutral-600">
              Are you sure you want to delete{' '}
              <strong className="text-heading">
                {String(
                  rowToDelete.title ||
                    rowToDelete.name ||
                    rowToDelete.email ||
                    `this ${config.singular.toLowerCase()}`
                )}
              </strong>
              ? This action cannot be undone.
            </p>
            <div className="flex justify-end gap-3 pt-2">
              <Button
                variant="ghost"
                onClick={() => {
                  setDeleteModalOpen(false);
                  setRowToDelete(null);
                }}
              >
                Cancel
              </Button>
              <Button
                variant="danger"
                onClick={() => {
                  onDelete(rowToDelete);
                  setDeleteModalOpen(false);
                  setRowToDelete(null);
                }}
              >
                Delete
              </Button>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
}
