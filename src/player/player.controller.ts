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
import { PlayerService } from './player.service';
import { CreatePlayerDto } from './dto/create-player.dto';
import { UpdatePlayerDto } from './dto/update-player.dto';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import LoggedPlayer from 'src/auth/decorators/logged-player.decoretor';
import { Player } from '@prisma/client';
import { Roles } from 'src/auth/decorators/roles.decorator';
import { Role } from 'src/utils/roles.enum';
import { AuthGuard } from '@nestjs/passport';
import { RolesGuard } from 'src/auth/guards/roles.guard';

@ApiTags('player')
@Controller('player')
export class PlayerController {
  constructor(private readonly playerService: PlayerService) {}

  @Post()
  @ApiOperation({ summary: 'Cadastro de usuário.' })
  create(@Body() createPlayerDto: CreatePlayerDto) {
    return this.playerService.create(createPlayerDto);
  }

  @Patch()
  @ApiBearerAuth()
  @Roles(Role.ADMIN, Role.USER)
  @UseGuards(AuthGuard(), RolesGuard)
  @ApiOperation({ summary: 'Atualizar cadastro de usuário.' })
  update(
    @LoggedPlayer() player: Player,
    @Body() updatePlayerDto: UpdatePlayerDto,
  ) {
    return this.playerService.update(player.id, updatePlayerDto);
  }

  @Delete()
  @ApiBearerAuth()
  @Roles(Role.ADMIN, Role.USER)
  @UseGuards(AuthGuard(), RolesGuard)
  @ApiOperation({
    summary: 'Apenas o usuário logado deletará seu próprio cadastro.',
  })
  remove(@LoggedPlayer() player: Player) {
    return this.playerService.remove(player.id);
  }

  @Get(":id")
  @ApiBearerAuth()
  @Roles(Role.ADMIN, Role.USER)
  @UseGuards(AuthGuard(), RolesGuard)
  @ApiOperation({ summary: 'Listar usuário por Id '})
  findUnique(@Param('id') id:string){
    return  this.playerService.findUnique(id)
  }
}
