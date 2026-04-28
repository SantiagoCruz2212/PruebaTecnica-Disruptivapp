import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AutomationLog } from './entities/automation-log.entity';
import { EmailService } from './services/email.service';
import { SendEmailListener } from './listeners/send-email.listener';

@Module({
  imports: [TypeOrmModule.forFeature([AutomationLog])],
  providers: [EmailService, SendEmailListener],
})
export class AutomationsModule {}
