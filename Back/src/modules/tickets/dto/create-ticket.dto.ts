import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsEnum, IsNotEmpty, IsOptional, IsString, IsUUID, MaxLength } from 'class-validator';
import { TicketPriority } from '../../../shared/enums/ticket-priority.enum';

export class CreateTicketDto {
  @ApiProperty({ example: 'Error al iniciar sesión', maxLength: 200 })
  @IsString()
  @IsNotEmpty()
  @MaxLength(200)
  title: string;

  @ApiProperty({ example: 'Los usuarios no pueden autenticarse desde las 8am.' })
  @IsString()
  @IsNotEmpty()
  description: string;

  @ApiPropertyOptional({ enum: TicketPriority, example: TicketPriority.HIGH })
  @IsEnum(TicketPriority)
  @IsOptional()
  priority?: TicketPriority;

  @ApiProperty({ example: 'a0000000-0000-0000-0000-000000000004', description: 'UUID del usuario que crea la solicitud' })
  @IsUUID('all')
  @IsNotEmpty()
  createdBy: string;

  @ApiPropertyOptional({ example: 'a0000000-0000-0000-0000-000000000002', description: 'UUID del responsable asignado (opcional)' })
  @IsUUID('all')
  @IsOptional()
  assignedTo?: string;
}
