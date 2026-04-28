import { Injectable } from '@nestjs/common';
import { OnEvent } from '@nestjs/event-emitter';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { TicketAssignedEvent } from '../../../shared/events/ticket-assigned.event';
import { AutomationLog } from '../entities/automation-log.entity';
import { AutomationStatus } from '../../../shared/enums/automation-status.enum';
import { EmailService } from '../services/email.service';

@Injectable()
export class SendEmailListener {
  constructor(
    @InjectRepository(AutomationLog)
    private readonly automationLogRepo: Repository<AutomationLog>,
    private readonly emailService: EmailService,
  ) {}

  // { async: true } — el handler se ejecuta fuera del flujo principal, sin bloquear la respuesta HTTP
  @OnEvent(TicketAssignedEvent.EVENT_NAME, { async: true })
  async handle(event: TicketAssignedEvent): Promise<void> {
    const payload = {
      to: event.assigneeEmail,
      subject: `[Soporte] Ticket asignado: ${event.ticketTitle}`,
      body: `Hola ${event.assigneeName}, se te ha asignado el ticket "${event.ticketTitle}". Por favor revísalo a la brevedad.`,
    };

    const log = this.automationLogRepo.create({
      ticket: { id: event.ticketId } as any,
      triggerType: 'ticket_assigned',
      actionType: 'send_email',
      payload,
      triggeredBy: { id: event.triggeredById } as any,
      status: AutomationStatus.PENDING,
    });

    await this.automationLogRepo.save(log);

    try {
      await this.emailService.execute(payload);

      await this.automationLogRepo.update(log.id, {
        status: AutomationStatus.SENT,
        processedAt: new Date(),
      });
    } catch (error) {
      await this.automationLogRepo.update(log.id, {
        status: AutomationStatus.FAILED,
        errorMessage: (error as Error).message,
        processedAt: new Date(),
      });
    }
  }
}
