import { Controller, Get, Post, Body, Patch, Param, UseGuards } from '@nestjs/common';
import { ScoreService } from './score.service';
import { ScoreDto } from './dto/score-dto';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { Roles } from 'src/auth/decorators/roles.decorator';
import { Role } from 'src/utils/roles.enum';
import { Player } from '@prisma/client';
import LoggedPlayer from 'src/auth/decorators/logged-player.decoretor';
import { AuthGuard } from '@nestjs/passport';
import { RolesGuard } from 'src/auth/guards/roles.guard';

@ApiTags('score')
@Controller('score')
export class ScoreController {
  constructor(private readonly scoreService: ScoreService) {}

  @Get()
  @ApiOperation({
    summary: ' Adiciona pontos ao usuário apenas uma vez',
  })
  @ApiBearerAuth()
  @Roles(Role.USER, Role.ADMIN)
  @UseGuards(AuthGuard(), RolesGuard)
  create(@LoggedPlayer() player: Player) {
    return this.scoreService.create(player);
  }

  // @Get(':id')
  // @ApiBearerAuth()
  // @Roles(Role.USER, Role.ADMIN)
  // findOne(@Param('id') id: number) {
  //   return this.scoreService.findOne(id);
  // }

  @Patch('debit/:id')
  @ApiOperation({
    summary: 'Debitar pontos do usuário',
  })
  @ApiBearerAuth()
  @Roles(Role.USER, Role.ADMIN)
  @UseGuards(AuthGuard(), RolesGuard)
  debit(@Param('id') id: number, @Body() updateScoreDto: ScoreDto) {
    return this.scoreService.debit(id, updateScoreDto);
  }

  @Patch('credit/:id')
  @ApiOperation({
    summary: 'Creditar pontos ao usuário',
  })
  @ApiBearerAuth()
  @Roles(Role.USER, Role.ADMIN)
  @UseGuards(AuthGuard(), RolesGuard)
  credit(@Param('id') id: number, @Body() updateScoreDto: ScoreDto) {
    return this.scoreService.credit(id, updateScoreDto);
  }
}
