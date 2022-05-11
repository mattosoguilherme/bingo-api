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
import { RaffleService } from './raffle.service';

import GeneratorDto from './dto/generator.dto';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import DrawValidationDto from './dto/draw-validation.dto';
import { Roles } from 'src/auth/decorators/roles.decorator';
import { Role } from 'src/utils/roles.enum';
import { RolesGuard } from 'src/auth/guards/roles.guard';
import { AuthGuard } from '@nestjs/passport';
import PositionDto from './dto/position-number.dto';
import CheckBingoDto from './dto/check-bingo.dto';

@ApiTags('raffle')
@Controller('raffle')
export class RaffleController {
  constructor(private readonly raffleService: RaffleService) {}

  // @Post('/generate')
  // @ApiOperation({
  //   summary:
  //     'Gera números do sorteio proporcionais as quantidade de cartelas compradas pelo usuário',
  // })
  // @ApiBearerAuth()
  // @Roles(Role.ADMIN, Role.USER)
  // @UseGuards(AuthGuard(), RolesGuard)
  // generate(@Body() generator: GeneratorDto) {
  //   return this.raffleService.generatorRaffle(generator);
  // }

  @Post('/validation_number')
  @ApiOperation({
    summary: 'Verifica número da cartela e valida se há no sorteio',
  })
  @ApiBearerAuth()
  @Roles(Role.ADMIN, Role.USER)
  @UseGuards(AuthGuard(), RolesGuard)
  validation_number(@Body() drawValidationDto: DrawValidationDto) {
    return this.raffleService.validationNumber(drawValidationDto);
  }

  @Post('/draw')
  @ApiOperation({
    summary:
      'Pega um número sorteado do database de acordo com posição indicado pelo cliente',
  })
  @ApiBearerAuth()
  @Roles(Role.ADMIN, Role.USER)
  @UseGuards(AuthGuard(), RolesGuard)
  draw(@Body() positionDto: PositionDto) {
    return this.raffleService.draw(positionDto);
  }

  @Post('/check')
  @ApiOperation({
    summary: 'Vereficar se cartela é valida para receber prêmio',
  })
  @ApiBearerAuth()
  @Roles(Role.ADMIN, Role.USER)
  @UseGuards(AuthGuard(), RolesGuard)
  check(@Body() checkDto: CheckBingoDto) {
    return this.raffleService.check_bingo(checkDto);
  }
}
