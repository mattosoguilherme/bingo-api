import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
} from '@nestjs/common';
import { SessionService } from './session.service';
import { SessionDto } from './dto/session.dto';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { RolesGuard } from 'src/auth/guards/roles.guard';
import { AuthGuard } from '@nestjs/passport';
import { Role } from 'src/utils/roles.enum';
import { Roles } from 'src/auth/decorators/roles.decorator';

@ApiTags('session')
@Controller('session')
export class SessionController {
  constructor(private readonly sessionService: SessionService) {}

  @Post()
  @ApiOperation({ summary: 'Criar uma sessão para começar a jogar' })
  @Roles(Role.USER, Role.ADMIN)
  @UseGuards(AuthGuard(), RolesGuard)
  @ApiBearerAuth()
  create(@Body() sessionDto: SessionDto) {
    return this.sessionService.create(sessionDto);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Adicionar um jogador a sessão.' })
  @Roles(Role.USER, Role.ADMIN)
  @UseGuards(AuthGuard(), RolesGuard)
  @ApiBearerAuth()
  update(@Param('id') id: number, @Body() updateSessionDto: SessionDto) {
    return this.sessionService.update(id, updateSessionDto);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Listar uma sessão pelo seu Id.' })
  findOne(@Param('id') id: number) {
    return this.sessionService.findOne(id);
  }

  @Get()
  @Roles(Role.USER, Role.ADMIN)
  @UseGuards(AuthGuard(), RolesGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Lista todas as seções abertas' })
  findMany() {
    return this.sessionService.findMany();
  }

  @Delete(':id')
  @Roles(Role.USER, Role.ADMIN)
  @UseGuards(AuthGuard(), RolesGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Deletar sessão através do ID ' })
  remove(@Param('id') id: number) {
    return this.sessionService.remove(id);
  }
}
