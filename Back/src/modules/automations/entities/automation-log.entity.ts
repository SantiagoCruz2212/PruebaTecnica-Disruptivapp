import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { AutomationStatus } from '../../../shared/enums/automation-status.enum';
import { Ticket } from '../../tickets/entities/ticket.entity';
import { User } from '../../users/entities/user.entity';

@Entity('automation_logs')
export class AutomationLog {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => Ticket, { nullable: false })
  @JoinColumn({ name: 'ticket_id' })
  ticket: Ticket;

  @Column({ name: 'trigger_type', length: 100 })
  triggerType: string;

  @Column({ name: 'action_type', length: 100 })
  actionType: string;

  @Column({ type: 'jsonb', default: {} })
  payload: Record<string, unknown>;

  @Column({ type: 'enum', enum: AutomationStatus, default: AutomationStatus.PENDING })
  status: AutomationStatus;

  @Column({ name: 'error_message', type: 'text', nullable: true })
  errorMessage: string | null;

  @ManyToOne(() => User, { nullable: false })
  @JoinColumn({ name: 'triggered_by' })
  triggeredBy: User;

  @CreateDateColumn({ name: 'created_at', type: 'timestamptz' })
  createdAt: Date;

  @Column({ name: 'processed_at', type: 'timestamptz', nullable: true })
  processedAt: Date | null;
}
