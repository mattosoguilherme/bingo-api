import { Injectable } from '@nestjs/common';
import { BingoService } from 'src/bingo.service';
import { CreateCardDto } from './dto/create-card.dto';
import { PrismaService } from 'src/prisma.service';
import { Card } from '@prisma/client';
import { ScoreService } from 'src/score/score.service';
import { ScoreDto } from 'src/score/dto/score-dto';

@Injectable()
export class CardService {
  constructor(
    private bingoService: BingoService,
    private prismaService: PrismaService,
    private scoreService: ScoreService,
  ) {}

  async create(createCardDto: CreateCardDto, id: string): Promise<Card[]> {
    const { number_cards } = createCardDto;

    const player = await this.bingoService.findPlayerById(id);

    const price_card: ScoreDto = {
      score: number_cards * 100,
    };

    await this.scoreService.debit(player['Score'].id, price_card);

    const cards = this.bingoService.cardDraw(number_cards);

    const numbersCard = [];

    for (var i = 1; i <= number_cards; i++) {
      const cardCreated = await this.prismaService.card.create({
        data: {
          cards_drawn: cards[`card${i}`],
          Player: { connect: { id: id } },
        },
      });

      numbersCard.push(cardCreated);
    }

    for (let index = 0; index < numbersCard.length; index++) {
      console.log(numbersCard[index]);

      for (let n = 0; n < 15; n++) {
        console.log(numbersCard[index].id);

        await this.prismaService.checked.create({
          data: {
            check: false,
            number: numbersCard[index].cards_drawn[n],
            Card: { connect: { id: Number(numbersCard[index].id) } },
          },
        });
      }
    }

    return numbersCard;
  }

  async remove(id: number): Promise<Card> {
    await this.bingoService.findCardById(id);

    await this.prismaService.checked.deleteMany({
      where: { cardId: Number(id)  },
    });

    return await this.prismaService.card.delete({
      where: { id: Number(id) },
      include: { Player: true, Checked: true },
    });
  }
}
