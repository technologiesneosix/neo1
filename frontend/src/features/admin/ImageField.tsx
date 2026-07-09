import { useQueryClient } from '@tanstack/react-query';
import { FolderOpen, ImageOff, Upload } from 'lucide-react';
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

interface ImageFieldProps {
  value: string;
  onChange: (url: string) => void;
  label?: string;
  error?: string;
  required?: boolean;
}

/**
 * URL input with live thumbnail plus a media-library browser and direct
 * upload — the single way images are picked across the admin.
 */
export function ImageField({ value, onChange, label, error, required }: ImageFieldProps) {
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
      onChange(asset.url);
      toast.success('Image uploaded');
      setBrowserOpen(false);
    } catch (uploadError) {
      toast.error(uploadError instanceof Error ? uploadError.message : 'Upload failed');
    } finally {
      setUploading(false);
      if (fileInputRef.current) fileInputRef.current.value = '';
    }
  };

  return (
    <FieldWrapper label={label} error={error} required={required}>
      <div className="flex items-center gap-3">
        <span className="flex h-14 w-14 shrink-0 items-center justify-center overflow-hidden rounded-md border border-neutral-200 bg-mist-100">
          {value ? (
            <img src={value} alt="" className="h-full w-full object-cover" />
          ) : (
            <ImageOff size={18} className="text-neutral-400" aria-hidden="true" />
          )}
        </span>
        <input
          type="text"
          value={value}
          onChange={(event) => onChange(event.target.value)}
          placeholder="https://… or browse the library"
          className={cn(
            'w-full rounded-btn border bg-white px-4 py-3 text-sm text-heading placeholder:text-neutral-400 outline-none transition-colors focus:border-primary-500 focus:ring-2 focus:ring-primary-500/20',
            error ? 'border-red-400' : 'border-neutral-200',
          )}
        />
        <Button
          type="button"
          variant="outline"
          size="sm"
          className="shrink-0"
          onClick={() => setBrowserOpen(true)}
        >
          <FolderOpen size={14} aria-hidden="true" />
          Browse
        </Button>
      </div>

      <Modal open={browserOpen} onClose={() => setBrowserOpen(false)} title="Media library" size="xl">
        <div className="mb-4 flex items-center justify-between gap-4">
          <p className="text-sm text-neutral-500">Pick an image or upload a new one.</p>
          <Button
            type="button"
            size="sm"
            loading={uploading}
            onClick={() => fileInputRef.current?.click()}
          >
            <Upload size={14} aria-hidden="true" />
            Upload
          </Button>
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
          <ul className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4">
            {images.map((asset) => (
              <li key={asset.id}>
                <button
                  type="button"
                  onClick={() => {
                    onChange(asset.url);
                    setBrowserOpen(false);
                  }}
                  className={cn(
                    'group block w-full overflow-hidden rounded-md border-2 transition-colors',
                    asset.url === value
                      ? 'border-primary-500'
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
                  <span className="block truncate bg-mist-50 px-2 py-1.5 text-left text-xs text-neutral-500">
                    {asset.name}
                  </span>
                </button>
              </li>
            ))}
          </ul>
        )}
      </Modal>
    </FieldWrapper>
  );
}
