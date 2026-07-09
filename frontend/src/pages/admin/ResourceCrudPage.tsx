import { AlertTriangle, Plus } from 'lucide-react';
import { useState } from 'react';
import { useList, useResourceMutations } from '@/api/hooks';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { Modal } from '@/components/ui/Modal';
import { ResourceForm } from '@/features/admin/ResourceForm';
import { ResourceTable } from '@/features/admin/ResourceTable';
import { resourceConfigs } from '@/features/admin/resourceConfigs';
import type { AdminRecord, ModuleConfig } from '@/features/admin/types';

function CrudModule({ config }: { config: ModuleConfig }) {
  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState<AdminRecord | null>(null);
  const { data, isLoading } = useList<AdminRecord>(config.resource);
  const { create, update, remove } = useResourceMutations<AdminRecord>(config.resource);

  const openCreate = () => {
    setEditing(null);
    setModalOpen(true);
  };

  const openEdit = (row: AdminRecord) => {
    setEditing(row);
    setModalOpen(true);
  };

  const handleSubmit = async (values: Record<string, unknown>) => {
    if (editing) {
      await update.mutateAsync({ id: editing.id, data: values });
    } else {
      await create.mutateAsync(values as Omit<AdminRecord, 'id' | 'createdAt' | 'updatedAt'>);
    }
    setModalOpen(false);
    setEditing(null);
  };

  return (
    <section aria-label={config.title}>
      <header className="mb-6 flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <h1 className="text-2xl font-bold text-heading">{config.title}</h1>
          <Badge tone="neutral">{data?.length ?? 0}</Badge>
        </div>
        <Button size="sm" onClick={openCreate}>
          <Plus size={15} aria-hidden="true" />
          Add {config.singular}
        </Button>
      </header>

      <Card hover={false} className="p-4 sm:p-6">
        <ResourceTable
          config={config}
          rows={data}
          loading={isLoading}
          onEdit={openEdit}
          onDelete={(row) => remove.mutate(row.id)}
        />
      </Card>

      <Modal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        title={editing ? `Edit ${config.singular}` : `Add ${config.singular}`}
        size="xl"
      >
        <ResourceForm
          key={editing?.id ?? 'create'}
          fields={config.fields}
          defaults={config.defaults}
          record={editing}
          onSubmit={handleSubmit}
          onCancel={() => setModalOpen(false)}
          submitting={create.isPending || update.isPending}
        />
      </Modal>
    </section>
  );
}

/** Generic CRUD screen — resolves its module config from the route key. */
export function ResourceCrudPage({ moduleKey }: { moduleKey: string }) {
  const config = resourceConfigs[moduleKey];

  if (!config) {
    return (
      <Card hover={false} className="mx-auto max-w-lg text-center">
        <AlertTriangle size={32} className="mx-auto mb-3 text-amber-500" aria-hidden="true" />
        <h1 className="mb-2 text-lg font-bold text-heading">Unknown module</h1>
        <p className="text-sm text-neutral-500">
          No admin configuration exists for “{moduleKey}”. Check
          src/features/admin/resourceConfigs.tsx.
        </p>
      </Card>
    );
  }

  return <CrudModule key={config.key} config={config} />;
}
