import {
  useMutation,
  useQuery,
  useQueryClient,
  type UseQueryOptions,
} from '@tanstack/react-query';
import toast from 'react-hot-toast';
import type { BaseEntity, SiteSettings } from '@/types';
import type { ResourceApi } from './resource';
import { api } from './services';

/** Query a full resource collection. */
export function useList<T extends BaseEntity>(
  resource: ResourceApi<T>,
  options?: Partial<UseQueryOptions<T[]>>,
) {
  return useQuery<T[]>({
    queryKey: [resource.key],
    queryFn: () => resource.list(),
    ...options,
  });
}

/** Query a single item by id. */
export function useItem<T extends BaseEntity>(resource: ResourceApi<T>, id: string | undefined) {
  return useQuery<T>({
    queryKey: [resource.key, id],
    queryFn: () => resource.get(id as string),
    enabled: Boolean(id),
  });
}

/** Query a single item by slug. */
export function useBySlug<T extends BaseEntity>(
  resource: ResourceApi<T>,
  slug: string | undefined,
) {
  return useQuery<T>({
    queryKey: [resource.key, 'slug', slug],
    queryFn: () => resource.getBySlug(slug as string),
    enabled: Boolean(slug),
  });
}

/** Create/update/delete mutations with cache invalidation and toasts. */
export function useResourceMutations<T extends BaseEntity>(resource: ResourceApi<T>) {
  const queryClient = useQueryClient();
  const invalidate = () => queryClient.invalidateQueries({ queryKey: [resource.key] });

  const create = useMutation({
    mutationFn: (data: Omit<T, keyof BaseEntity>) => resource.create(data),
    onSuccess: () => {
      invalidate();
      toast.success('Created successfully');
    },
    onError: (error: Error) => toast.error(error.message || 'Create failed'),
  });

  const update = useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<T> }) => resource.update(id, data),
    onSuccess: () => {
      invalidate();
      toast.success('Saved successfully');
    },
    onError: (error: Error) => toast.error(error.message || 'Save failed'),
  });

  const remove = useMutation({
    mutationFn: (id: string) => resource.remove(id),
    onSuccess: () => {
      invalidate();
      toast.success('Deleted');
    },
    onError: (error: Error) => toast.error(error.message || 'Delete failed'),
  });

  return { create, update, remove };
}

/** The single site-settings record used across the whole app. */
export function useSiteSettings() {
  const query = useList(api.settings);
  return { ...query, settings: query.data?.[0] as SiteSettings | undefined };
}
