import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Ticket } from './entities/ticket.entity';
import { TicketHistory } from './entities/ticket-history.entity';
import { TicketsRepository } from './tickets.repository';
import { TicketsService } from './tickets.service';
import { TicketsController } from './tickets.controller';
import { UsersModule } from '../users/users.module';

@Module({
  imports: [TypeOrmModule.forFeature([Ticket, TicketHistory]), UsersModule],
  providers: [TicketsRepository, TicketsService],
  controllers: [TicketsController],
})
export class TicketsModule {}
