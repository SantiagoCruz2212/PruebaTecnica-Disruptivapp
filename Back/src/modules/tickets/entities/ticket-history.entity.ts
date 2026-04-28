import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { TicketStatus } from '../../../shared/enums/ticket-status.enum';
import { Ticket } from './ticket.entity';
import { User } from '../../users/entities/user.entity';

@Entity('ticket_history')
export class TicketHistory {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => Ticket, (ticket) => ticket.history, { nullable: false })
  @JoinColumn({ name: 'ticket_id' })
  ticket: Ticket;

  @ManyToOne(() => User, { nullable: false })
  @JoinColumn({ name: 'changed_by' })
  changedBy: User;

  @Column({ name: 'old_status', type: 'enum', enum: TicketStatus, nullable: true })
  oldStatus: TicketStatus | null;

  @Column({ name: 'new_status', type: 'enum', enum: TicketStatus, nullable: true })
  newStatus: TicketStatus | null;

  @Column({ name: 'old_assigned', type: 'uuid', nullable: true })
  oldAssigned: string | null;

  @Column({ name: 'new_assigned', type: 'uuid', nullable: true })
  newAssigned: string | null;

  @CreateDateColumn({ name: 'changed_at', type: 'timestamptz' })
  changedAt: Date;
}
