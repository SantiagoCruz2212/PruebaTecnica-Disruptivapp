import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { TicketStatus } from '../../../shared/enums/ticket-status.enum';
import { TicketPriority } from '../../../shared/enums/ticket-priority.enum';
import { User } from '../../users/entities/user.entity';
import { TicketHistory } from './ticket-history.entity';

@Entity('tickets')
export class Ticket {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ length: 200 })
  title: string;

  @Column({ type: 'text' })
  description: string;

  @Column({ type: 'enum', enum: TicketStatus, default: TicketStatus.PENDING })
  status: TicketStatus;

  @Column({ type: 'enum', enum: TicketPriority, default: TicketPriority.MEDIUM })
  priority: TicketPriority;

  @ManyToOne(() => User, (user) => user.createdTickets, { nullable: false })
  @JoinColumn({ name: 'created_by' })
  createdBy: User;

  @ManyToOne(() => User, (user) => user.assignedTickets, { nullable: true })
  @JoinColumn({ name: 'assigned_to' })
  assignedTo: User | null;

  @CreateDateColumn({ name: 'created_at', type: 'timestamptz' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at', type: 'timestamptz' })
  updatedAt: Date;

  @OneToMany(() => TicketHistory, (history) => history.ticket)
  history: TicketHistory[];
}
