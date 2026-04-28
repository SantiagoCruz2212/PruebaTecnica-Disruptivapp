import { Controller, Get } from '@nestjs/common';
import { ApiOkResponse, ApiOperation, ApiTags } from '@nestjs/swagger';
import { UsersService } from './users.service';

@ApiTags('Users')
@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get()
  @ApiOperation({ summary: 'Listar todos los usuarios registrados' })
  @ApiOkResponse({
    description: 'Lista de usuarios',
    schema: {
      example: [
        { id: 'a0000000-0000-0000-0000-000000000001', name: 'Admin Sistema', email: 'admin@empresa.com', role: 'admin' },
        { id: 'a0000000-0000-0000-0000-000000000002', name: 'Ana García',    email: 'ana@empresa.com',   role: 'agent' },
      ],
    },
  })
  findAll() {
    return this.usersService.findAll();
  }
}
