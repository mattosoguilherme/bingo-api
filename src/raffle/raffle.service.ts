import {  ConflictException, Injectable } from '@nestjs/common';
import { BingoService } from 'src/bingo.service';
import { PrismaService } from 'src/prisma.service';
import GeneratorDto from './dto/generator.dto';
import DrawValidationDto from './dto/draw-validation.dto';
import PositionDto from './dto/position-number.dto';
import CheckBingoDto from './dto/check-bingo.dto';

@Injectable()
export class RaffleService {
  constructor(
    private prismaService: PrismaService,
    private bingoService: BingoService,
  ) {}

  generatorRaffle(generator: GeneratorDto) {
    const { raffle_of } = generator;

    if (raffle_of === 1) {
      return this.bingoService.raffleOneCard();
    } else if (raffle_of === 2) {
      return this.bingoService.raffleTwoCards();
    } else if (raffle_of === 3) {
      return this.bingoService.raffleThreeCards();
    } else if (raffle_of === 4) {
      return this.bingoService.raffleFourCards();
    } else if (raffle_of === 5) {
      return this.bingoService.raffleFiveCards();
    }
    if (raffle_of === 6) {
      return this.bingoService.numbersDraw();
    }
  }

  async validationNumber(drawValidationDto: DrawValidationDto): Promise<any> {
    const { id_checked, numbers_raffle } = drawValidationDto;

    const n_finded = await this.prismaService.checked.findUnique({
      where: { id: Number(id_checked) },
    });

    if (!n_finded) {
      throw new ConflictException('ID não existe!');
    }

    return await this.bingoService.card_number_validator(
      id_checked,
      n_finded.number,
      numbers_raffle,
    );
  }

  async draw(positionDto: PositionDto): Promise<number> {
    const { position, sessionId } = positionDto;
    return await this.bingoService.draw_number(position, sessionId);
  }

  async check_bingo(checkBingoDto: CheckBingoDto): Promise<object> {
    const { cardId, sessionId } = checkBingoDto;

    return await this.bingoService.check_bingo(cardId, sessionId);
  }
}
