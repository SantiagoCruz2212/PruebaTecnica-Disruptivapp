import { ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsEnum, IsInt, IsOptional, Max, Min } from 'class-validator';
import { TicketStatus } from '../../../shared/enums/ticket-status.enum';
import { TicketPriority } from '../../../shared/enums/ticket-priority.enum';

export class ListTicketsDto {
  @ApiPropertyOptional({ enum: TicketStatus, description: 'Filtrar por estado' })
  @IsOptional()
  @IsEnum(TicketStatus)
  status?: TicketStatus;

  @ApiPropertyOptional({ enum: TicketPriority, description: 'Filtrar por prioridad' })
  @IsOptional()
  @IsEnum(TicketPriority)
  priority?: TicketPriority;

  @ApiPropertyOptional({ example: 1, default: 1, minimum: 1, description: 'Número de página' })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  page?: number = 1;

  @ApiPropertyOptional({ example: 10, default: 10, minimum: 1, maximum: 100, description: 'Registros por página' })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  @Max(100)
  limit?: number = 10;
}
