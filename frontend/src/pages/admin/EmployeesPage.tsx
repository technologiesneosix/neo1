import { Info, UserCheck } from 'lucide-react';
import { Card } from '@/components/ui/Card';

export function EmployeesPage() {
  return (
    <div className="space-y-6">
      <header className="flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <h1 className="text-2xl font-bold text-heading">Employees</h1>
        </div>
      </header>

      <Card hover={false} className="flex flex-col items-center justify-center p-12 text-center min-h-[300px]">
        <UserCheck size={48} className="text-neutral-300 mb-4" />
        <h2 className="text-xl font-bold text-heading mb-2">Employee Directory (Placeholder)</h2>
        <p className="text-neutral-500 max-w-md">
          This section is a placeholder for future employee records management and tracking.
        </p>
      </Card>

      <Card hover={false} className="flex items-start gap-3 bg-primary-50/60 p-5">
        <Info size={18} className="mt-0.5 shrink-0 text-primary-600" aria-hidden="true" />
        <div className="text-sm leading-relaxed text-neutral-600">
          <p className="font-semibold text-heading">Upcoming Integration</p>
          <p>
            The Employee module will sync with Candidates who have transitioned to "Joined" status. It will manage contracts, department assignments, performance evaluations, and role permissions.
          </p>
        </div>
      </Card>
    </div>
  );
}
