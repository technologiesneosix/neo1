import {
  Copy,
  FileText,
  Image as ImageIcon,
  RefreshCw,
  Trash2,
  Upload,
  Video,
} from 'lucide-react';
import { useMemo, useRef, useState } from 'react';
import toast from 'react-hot-toast';
import { useQueryClient } from '@tanstack/react-query';
import { api } from '@/api/services';
import { useList, useResourceMutations } from '@/api/hooks';
import type { MediaAsset } from '@/types';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { PageLoader } from '@/components/ui/Spinner';
import { getUploadUrl, uploadMedia } from '@/features/admin/uploadMedia';
import { truncate } from '@/lib/utils';

const typeIcons = { image: ImageIcon, video: Video, pdf: FileText } as const;

function ReplaceButton({ asset, onReplace }: { asset: MediaAsset; onReplace: (file: File) => void }) {
  const inputRef = useRef<HTMLInputElement>(null);
  return (
    <>
      <button
        type="button"
        aria-label={`Replace ${asset.name}`}
        title="Replace file"
        onClick={() => inputRef.current?.click()}
        className="rounded-md p-2 text-neutral-400 transition-colors hover:bg-primary-50 hover:text-primary-600"
      >
        <RefreshCw size={14} aria-hidden="true" />
      </button>
      <input
        ref={inputRef}
        type="file"
        className="hidden"
        aria-label={`Replace file for ${asset.name}`}
        onChange={(event) => {
          const file = event.target.files?.[0];
          if (file) onReplace(file);
          event.target.value = '';
        }}
      />
    </>
  );
}

/** Full media manager: upload, filter, copy, replace and delete assets. */
export function MediaLibraryPage() {
  const [search, setSearch] = useState('');
  const [folderFilter, setFolderFilter] = useState('all');
  const [typeFilter, setTypeFilter] = useState('all');
  const [uploading, setUploading] = useState(false);
  const uploadInputRef = useRef<HTMLInputElement>(null);
  const queryClient = useQueryClient();

  const { data, isLoading } = useList(api.mediaAssets);
  const { update, remove } = useResourceMutations(api.mediaAssets);

  const folders = useMemo(
    () => Array.from(new Set((data ?? []).map((asset) => asset.folder))).sort(),
    [data],
  );

  const filtered = useMemo(() => {
    const needle = search.trim().toLowerCase();
    return (data ?? []).filter(
      (asset) =>
        (folderFilter === 'all' || asset.folder === folderFilter) &&
        (typeFilter === 'all' || asset.type === typeFilter) &&
        (!needle || asset.name.toLowerCase().includes(needle)),
    );
  }, [data, search, folderFilter, typeFilter]);

  const handleUploadFiles = async (files: FileList | null) => {
    if (!files || files.length === 0) return;
    const folder = window.prompt('Upload to folder:', 'uploads') || 'uploads';
    setUploading(true);
    try {
      for (const file of Array.from(files)) {
        await uploadMedia(file, folder);
      }
      await queryClient.invalidateQueries({ queryKey: [api.mediaAssets.key] });
      toast.success(files.length > 1 ? `${files.length} files uploaded` : 'File uploaded');
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Upload failed');
    } finally {
      setUploading(false);
      if (uploadInputRef.current) uploadInputRef.current.value = '';
    }
  };

  const handleCopy = async (asset: MediaAsset) => {
    try {
      await navigator.clipboard.writeText(asset.url);
      toast.success('URL copied to clipboard');
    } catch {
      toast.error('Could not copy URL');
    }
  };

  const handleReplace = async (asset: MediaAsset, file: File) => {
    try {
      const url = await getUploadUrl(file);
      update.mutate({ id: asset.id, data: { url, size: file.size } });
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Replace failed');
    }
  };

  const handleDelete = (asset: MediaAsset) => {
    if (window.confirm(`Delete "${asset.name}"? This cannot be undone.`)) {
      remove.mutate(asset.id);
    }
  };

  const selectClasses =
    'rounded-btn border border-neutral-200 bg-white px-3 py-2.5 text-sm text-heading outline-none transition-colors focus:border-primary-500 focus:ring-2 focus:ring-primary-500/20';

  return (
    <div className="space-y-6">
      <header className="flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <h1 className="text-2xl font-bold text-heading">Media Library</h1>
          <Badge tone="neutral">{data?.length ?? 0}</Badge>
        </div>
        <Button size="sm" loading={uploading} onClick={() => uploadInputRef.current?.click()}>
          <Upload size={15} aria-hidden="true" />
          Upload
        </Button>
        <input
          ref={uploadInputRef}
          type="file"
          multiple
          className="hidden"
          aria-label="Upload media files"
          onChange={(event) => void handleUploadFiles(event.target.files)}
        />
      </header>

      <Card hover={false} className="p-4 sm:p-6">
        <div className="mb-5 flex flex-wrap items-center gap-3">
          <input
            type="search"
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            placeholder="Search files…"
            aria-label="Search media"
            className={`${selectClasses} w-full max-w-xs`}
          />
          <select
            value={folderFilter}
            onChange={(event) => setFolderFilter(event.target.value)}
            aria-label="Filter by folder"
            className={selectClasses}
          >
            <option value="all">All folders</option>
            {folders.map((folder) => (
              <option key={folder} value={folder}>
                {folder}
              </option>
            ))}
          </select>
          <select
            value={typeFilter}
            onChange={(event) => setTypeFilter(event.target.value)}
            aria-label="Filter by type"
            className={selectClasses}
          >
            <option value="all">All types</option>
            <option value="image">Images</option>
            <option value="video">Videos</option>
            <option value="pdf">PDFs</option>
          </select>
        </div>

        {isLoading ? (
          <PageLoader />
        ) : filtered.length === 0 ? (
          <div className="flex flex-col items-center gap-3 py-16 text-center">
            <ImageIcon size={32} className="text-neutral-300" aria-hidden="true" />
            <p className="text-sm text-neutral-400">
              {data && data.length > 0
                ? 'No files match the current filters.'
                : 'The library is empty — upload your first file.'}
            </p>
          </div>
        ) : (
          <ul className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
            {filtered.map((asset) => {
              const TypeIcon = typeIcons[asset.type];
              return (
                <li
                  key={asset.id}
                  className="group overflow-hidden rounded-md border border-neutral-100 bg-white transition-shadow hover:shadow-card"
                >
                  <div className="flex aspect-[4/3] items-center justify-center overflow-hidden bg-mist-100">
                    {asset.type === 'image' ? (
                      <img
                        src={asset.url}
                        alt={asset.name}
                        loading="lazy"
                        className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
                      />
                    ) : (
                      <TypeIcon size={32} className="text-neutral-400" aria-hidden="true" />
                    )}
                  </div>
                  <div className="p-3">
                    <p className="truncate text-xs font-semibold text-heading" title={asset.name}>
                      {truncate(asset.name, 30)}
                    </p>
                    <div className="mt-1.5 flex items-center justify-between gap-2">
                      <Badge tone="neutral" className="px-2 py-0.5 text-[10px]">
                        {asset.folder}
                      </Badge>
                      <span className="text-[11px] text-neutral-400">
                        {Math.max(1, Math.round(asset.size / 1024))} KB
                      </span>
                    </div>
                    <div className="mt-2 flex items-center justify-end gap-0.5 border-t border-neutral-50 pt-2">
                      <button
                        type="button"
                        aria-label={`Copy URL of ${asset.name}`}
                        title="Copy URL"
                        onClick={() => void handleCopy(asset)}
                        className="rounded-md p-2 text-neutral-400 transition-colors hover:bg-primary-50 hover:text-primary-600"
                      >
                        <Copy size={14} aria-hidden="true" />
                      </button>
                      <ReplaceButton asset={asset} onReplace={(file) => void handleReplace(asset, file)} />
                      <button
                        type="button"
                        aria-label={`Delete ${asset.name}`}
                        title="Delete"
                        onClick={() => handleDelete(asset)}
                        className="rounded-md p-2 text-neutral-400 transition-colors hover:bg-red-50 hover:text-red-600"
                      >
                        <Trash2 size={14} aria-hidden="true" />
                      </button>
                    </div>
                  </div>
                </li>
              );
            })}
          </ul>
        )}
      </Card>
    </div>
  );
}
