import { ApiProperty } from '@nestjs/swagger';
import { IsEnum, IsNotEmpty, IsUUID } from 'class-validator';
import { TicketStatus } from '../../../shared/enums/ticket-status.enum';

export class UpdateStatusDto {
  @ApiProperty({ enum: TicketStatus, example: TicketStatus.IN_PROGRESS, description: 'Nuevo estado (no puede ser cambiado si ya está resolved)' })
  @IsEnum(TicketStatus)
  @IsNotEmpty()
  status: TicketStatus;

  @ApiProperty({ example: 'a0000000-0000-0000-0000-000000000001', description: 'UUID del usuario que realiza el cambio' })
  @IsUUID('all')
  @IsNotEmpty()
  changedBy: string;
}
