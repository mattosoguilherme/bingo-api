import {
  Controller,
  Get,
  Post,
  Body,
  UseGuards,
  Delete,
  Param,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { Card, Player } from '@prisma/client';
import  LoggedPlayer  from 'src/auth/decorators/logged-player.decoretor';
import { Roles } from 'src/auth/decorators/roles.decorator';
import { RolesGuard } from 'src/auth/guards/roles.guard';
import { Role } from 'src/utils/roles.enum';
import { CardService } from './card.service';
import { CreateCardDto } from './dto/create-card.dto';

@ApiTags('card')
@Controller('card')
export class CardController {
  constructor(private readonly cardService: CardService) {}

  @Post()
  @ApiBearerAuth()
  @Roles(Role.USER, Role.ADMIN)
  @UseGuards(AuthGuard(), RolesGuard)
  @ApiOperation({ summary: 'Gera cartela com números para o sorteio' })
  create(
    @Body() createCardDto: CreateCardDto,
    @LoggedPlayer() player: Player,
  ): Promise<Card[]> {
    return this.cardService.create(createCardDto, player.id);
  }
  
  @Delete(':id')
  @Roles(Role.ADMIN, Role.USER)
  @UseGuards(AuthGuard(), RolesGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Deleta card por ID' })
  remove(@Param('id') id: number): Promise<Card> {
    return this.cardService.remove(id);
  }
}
