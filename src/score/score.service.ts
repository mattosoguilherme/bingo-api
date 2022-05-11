import { ConflictException, Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma.service';
import { Player, Score } from '@prisma/client';
import { ScoreDto } from './dto/score-dto';

@Injectable()
export class ScoreService {
  constructor(private prismaService: PrismaService) {}

  async create(player: Player): Promise<Score> {

    const scoreByPlayer = await this.prismaService.score.findMany();

    scoreByPlayer.map((s) => {
      if (s.playerId === player.id) {
        throw new ConflictException(
          'O usuário só poder ter pontos inseridos apenas uma vez nesta rota.',
        );
      }
    });

    return await this.prismaService.score.create({
      data: {
        score: 1000,
        Player: { connect: { id: player.id } },
      },
    });
  }

  async findOne(id: number): Promise<Score> {
    return await this.prismaService.score.findUnique({
      where: { id: Number(id) },
    });
  }

  async debit(id: number, updateScoreDto: ScoreDto): Promise<Score> {
    const scoreActual = await this.prismaService.score.findUnique({
      where: { id: Number(id) },
    });

    if (scoreActual.score < updateScoreDto.score) {
      throw new ConflictException(
        'Você não tem pontos o sufiente para compra de cartelas',
      );
    }
    const scoreUpdated = scoreActual.score - updateScoreDto.score;

    return await this.prismaService.score.update({
      where: { id: Number(id) },
      data: {
        score: scoreUpdated,
      },
      include: {
        Player: {
          select: {
            name: true,
          },
        },
      },
    });
  }

  async credit(id: number, updateScoreDto: ScoreDto): Promise<Score> {
    const scoreActual = await this.prismaService.score.findUnique({
      where: { id: Number(id) },
    });

    const scoreUpdated = scoreActual.score + updateScoreDto.score;

    return await this.prismaService.score.update({
      where: { id: Number(id) },
      data: {
        score: scoreUpdated,
      },
      include: {
        Player: {
          select: {
            name: true,
          },
        },
      },
    });
  }
}
