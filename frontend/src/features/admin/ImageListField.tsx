import { useQueryClient } from '@tanstack/react-query';
import { FolderOpen, ImageOff, Trash2, Upload, Check } from 'lucide-react';
import { useRef, useState } from 'react';
import toast from 'react-hot-toast';
import { api } from '@/api/services';
import { useList } from '@/api/hooks';
import { Button } from '@/components/ui/Button';
import { FieldWrapper } from '@/components/ui/FormControls';
import { Modal } from '@/components/ui/Modal';
import { Spinner } from '@/components/ui/Spinner';
import { cn } from '@/lib/cn';
import { uploadMedia } from './uploadMedia';

interface ImageListFieldProps {
  value: string[];
  onChange: (urls: string[]) => void;
  label?: string;
  error?: string;
  required?: boolean;
}

/**
 * Multiple image selector with drag-and-drop, media-library selection (with toggle checkmarks),
 * and direct file upload. Used for product or project galleries.
 */
export function ImageListField({ value = [], onChange, label, error, required }: ImageListFieldProps) {
  const [browserOpen, setBrowserOpen] = useState(false);
  const [uploading, setUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const queryClient = useQueryClient();
  const { data: assets, isLoading } = useList(api.mediaAssets, { enabled: browserOpen });

  const images = (assets ?? []).filter((asset) => asset.type === 'image');

  const handleUpload = async (file: File | undefined) => {
    if (!file) return;
    setUploading(true);
    try {
      const asset = await uploadMedia(file, 'uploads');
      await queryClient.invalidateQueries({ queryKey: [api.mediaAssets.key] });
      onChange([...value, asset.url]);
      toast.success('Image uploaded and added to gallery');
    } catch (uploadError) {
      toast.error(uploadError instanceof Error ? uploadError.message : 'Upload failed');
    } finally {
      setUploading(false);
      if (fileInputRef.current) fileInputRef.current.value = '';
    }
  };

  const removeImage = (urlToRemove: string) => {
    onChange(value.filter((url) => url !== urlToRemove));
  };

  const toggleSelectAsset = (url: string) => {
    if (value.includes(url)) {
      onChange(value.filter((u) => u !== url));
    } else {
      onChange([...value, url]);
    }
  };

  return (
    <FieldWrapper label={label} error={error} required={required}>
      <div className="space-y-4">
        {/* Selected Images Grid */}
        <div className="flex flex-wrap gap-4">
          {value.map((url, index) => (
            <div
              key={`${url}-${index}`}
              className="group relative h-24 w-24 overflow-hidden rounded-md border border-neutral-200 bg-neutral-50 shadow-sm transition-all hover:shadow"
            >
              <img src={url} alt="" className="h-full w-full object-cover" />
              {/* Hover overlay for delete */}
              <div className="absolute inset-0 flex items-center justify-center bg-black/45 opacity-0 transition-opacity group-hover:opacity-100">
                <button
                  type="button"
                  onClick={() => removeImage(url)}
                  className="rounded-full bg-red-600 p-1.5 text-white transition-colors hover:bg-red-700 shadow"
                  aria-label="Remove image"
                >
                  <Trash2 size={14} />
                </button>
              </div>
            </div>
          ))}

          {/* Dash Add Button */}
          <button
            type="button"
            onClick={() => setBrowserOpen(true)}
            className="flex h-24 w-24 flex-col items-center justify-center gap-1 rounded-md border-2 border-dashed border-neutral-300 bg-white text-neutral-500 transition-all hover:border-primary-500 hover:text-primary-600"
          >
            <FolderOpen size={20} />
            <span className="text-[11px] font-semibold uppercase tracking-wider">Browse</span>
          </button>
        </div>

        {/* Text Area for raw copy-paste option */}
        <div className="mt-2">
          <label className="block text-xs font-semibold text-neutral-400 mb-1">
            Raw URL List (one per line)
          </label>
          <textarea
            value={value.join('\n')}
            onChange={(e) => onChange(e.target.value.split('\n').map((line) => line.trim()).filter(Boolean))}
            rows={3}
            placeholder="Or paste direct image URLs here, one per line..."
            className="w-full rounded-btn border border-neutral-200 bg-white px-3 py-2 text-xs text-heading placeholder:text-neutral-400 outline-none transition-colors focus:border-primary-500"
          />
        </div>
      </div>

      {/* Media Browser Modal */}
      <Modal open={browserOpen} onClose={() => setBrowserOpen(false)} title="Select Gallery Images" size="xl">
        <div className="mb-4 flex items-center justify-between gap-4">
          <p className="text-sm text-neutral-500">Click to select/deselect multiple images. Checked items are in the gallery.</p>
          <div className="flex gap-2">
            <Button
              type="button"
              size="sm"
              loading={uploading}
              onClick={() => fileInputRef.current?.click()}
            >
              <Upload size={14} aria-hidden="true" />
              Upload New
            </Button>
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => setBrowserOpen(false)}
            >
              Done
            </Button>
          </div>
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            className="hidden"
            aria-label="Upload image file"
            onChange={(event) => void handleUpload(event.target.files?.[0])}
          />
        </div>
        {isLoading ? (
          <div className="flex min-h-[200px] items-center justify-center">
            <Spinner />
          </div>
        ) : images.length === 0 ? (
          <p className="py-12 text-center text-sm text-neutral-400">
            No images in the library yet — upload one to get started.
          </p>
        ) : (
          <ul className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
            {images.map((asset) => {
              const isSelected = value.includes(asset.url);
              return (
                <li key={asset.id}>
                  <button
                    type="button"
                    onClick={() => toggleSelectAsset(asset.url)}
                    className={cn(
                      'group relative block w-full overflow-hidden rounded-md border-2 transition-colors',
                      isSelected
                        ? 'border-primary-500 ring-2 ring-primary-500/20'
                        : 'border-transparent hover:border-primary-300',
                    )}
                    aria-label={`Select ${asset.name}`}
                  >
                    <img
                      src={asset.url}
                      alt={asset.name}
                      loading="lazy"
                      className="aspect-[4/3] w-full object-cover transition-transform duration-300 group-hover:scale-105"
                    />
                    
                    {/* Selected Checkmark overlay */}
                    {isSelected && (
                      <span className="absolute top-1.5 right-1.5 flex h-5 w-5 items-center justify-center rounded-full bg-primary-600 text-white shadow">
                        <Check size={11} strokeWidth={4} />
                      </span>
                    )}

                    <span className="block truncate bg-mist-50 px-2 py-1.5 text-left text-xs text-neutral-500">
                      {asset.name}
                    </span>
                  </button>
                </li>
              );
            })}
          </ul>
        )}
      </Modal>
    </FieldWrapper>
  );
}
