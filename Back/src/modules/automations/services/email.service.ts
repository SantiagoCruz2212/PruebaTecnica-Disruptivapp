import { Injectable, Logger } from '@nestjs/common';
import { IAutomationAction } from '../interfaces/automation-action.interface';

export interface EmailPayload {
  to: string;
  subject: string;
  body: string;
}

@Injectable()
export class EmailService implements IAutomationAction<EmailPayload> {
  private readonly logger = new Logger(EmailService.name);

  async execute(payload: EmailPayload): Promise<void> {
    // Mock: reemplazar con SES / SendGrid / Nodemailer según el proveedor elegido
    this.logger.log('─────────────────────────────────────────');
    this.logger.log(`[EMAIL MOCK] Para:    ${payload.to}`);
    this.logger.log(`[EMAIL MOCK] Asunto:  ${payload.subject}`);
    this.logger.log(`[EMAIL MOCK] Cuerpo:  ${payload.body}`);
    this.logger.log('─────────────────────────────────────────');
  }
}
