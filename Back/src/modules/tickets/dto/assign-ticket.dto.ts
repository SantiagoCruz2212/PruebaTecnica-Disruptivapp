import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsUUID } from 'class-validator';

export class AssignTicketDto {
  @ApiProperty({ example: 'a0000000-0000-0000-0000-000000000002', description: 'UUID del usuario a asignar (debe existir)' })
  @IsUUID('all')
  @IsNotEmpty()
  assignedTo: string;

  @ApiProperty({ example: 'a0000000-0000-0000-0000-000000000001', description: 'UUID del usuario que realiza la asignación' })
  @IsUUID('all')
  @IsNotEmpty()
  changedBy: string;
}
