import { useState } from 'react';
import { useTickets } from '../hooks/useTickets';
import TicketsTable from '../components/TicketsTable';
import ChangeStatusModal from '../components/ChangeStatusModal';
import AssignModal from '../components/AssignModal';
import type { TicketDto } from '../../../shared/dtos/ticket.dto';

export default function TicketsContainer() {
  const { data, loading, filters, setStatus, setPriority, setPage, refresh } = useTickets();
  const [statusTarget, setStatusTarget] = useState<TicketDto | null>(null);
  const [assignTarget, setAssignTarget] = useState<TicketDto | null>(null);

  return (
    <>
      <TicketsTable
        data={data}
        loading={loading}
        currentStatus={filters.status}
        currentPriority={filters.priority}
        onStatusFilter={setStatus}
        onPriorityFilter={setPriority}
        onPageChange={setPage}
        onChangeStatus={setStatusTarget}
        onAssign={setAssignTarget}
      />

      <ChangeStatusModal
        ticket={statusTarget}
        onClose={() => setStatusTarget(null)}
        onSuccess={refresh}
      />
      <AssignModal
        ticket={assignTarget}
        onClose={() => setAssignTarget(null)}
        onSuccess={refresh}
      />
    </>
  );
}
