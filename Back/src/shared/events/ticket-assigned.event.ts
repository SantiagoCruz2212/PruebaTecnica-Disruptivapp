export class TicketAssignedEvent {
  static readonly EVENT_NAME = 'ticket.assigned';

  constructor(
    public readonly ticketId: string,
    public readonly ticketTitle: string,
    public readonly assigneeEmail: string,
    public readonly assigneeName: string,
    public readonly triggeredById: string,
  ) {}
}
