import { ConflictException, Injectable } from '@nestjs/common';
import { Session } from '@prisma/client';
import { BingoService } from 'src/bingo.service';
import { PrismaService } from 'src/prisma.service';
import { SessionDto } from './dto/session.dto';

function filterSession(session: any) {
  return session.limit !== session.Players.length;
}

@Injectable()
export class SessionService {
  constructor(
    private prismaService: PrismaService,
    private bingoService: BingoService,
  ) {}

  async create(SessionDto: SessionDto): Promise<Session> {
    const { playerId, limit } = SessionDto;

    const numbers_draw = this.bingoService.numbersDraw();

    await this.bingoService.findPlayerById(playerId);

    const sessionCreated = await this.prismaService.session.create({
      data: {
        numbersDraw: numbers_draw,
        Players: { connect: { id: playerId } },
        limit: limit,
        close: false,
        winner: '',
      },
      include: {
        Players: {
          select: {
            Card: { select: { cards_drawn: true, id: true } },
            name: true,
            imgUrlPerfil: true,
            nickname: true,
            id: true,
            Score: { select: { score: true, id: true } },
          },
        },
      },
    });

    delete sessionCreated.numbersDraw;

    return sessionCreated;
  }

  async update(id: number, updateSessionDto: SessionDto): Promise<Session> {
    const sessionFinded = await this.prismaService.session.findUnique({
      where: { id: Number(id) },
      include: {
        Players: {
          select: {
            id: true,
          },
        },
      },
    });

    delete sessionFinded.numbersDraw;

    if (!sessionFinded) {
      throw new ConflictException('Sessão encerrada ou não existe.');
    }

    const players: Array<string> = [];

    sessionFinded.Players.map((p) => {
      players.push(p.id);
    });

    players.push(updateSessionDto.playerId);

    const sessionUpdated = await this.prismaService.session.update({
      where: { id: Number(id) },
      data: {
        Players: { connect: players.map((id) => ({ id: id })) },
        close: updateSessionDto.close,
        winner: updateSessionDto.winner,
      },
      include: {
        Players: {
          select: {
            id: true,
            nickname: true,
            imgUrlPerfil: true,
            Score: { select: { score: true, id: true } },
            sessionId: true,
            Card: { select: { cards_drawn: true, id: true } },
          },
        },
      },
    });

    delete sessionUpdated.numbersDraw;

    return sessionUpdated;
  }

  async findOne(id: number): Promise<Session> {
    const sessionFinded = await this.prismaService.session.findUnique({
      where: { id: Number(id) },
      include: {
        Players: {
          select: {
            Card: { select: { cards_drawn: true, id: true } },
            Score: { select: { score: true, id: true } },
            id: true,
            nickname: true,
            name: true,
            imgUrlPerfil: true,
          },
        },
      },
    });

    if (!sessionFinded) {
      throw new ConflictException('Sessão encerrada ou não existe.');
    }

    delete sessionFinded.numbersDraw;

    return sessionFinded;
  }

  async remove(id: number): Promise<Session> {
    await this.bingoService.ValidatorSessionById(id);

    return await this.prismaService.session.delete({
      where: { id: Number(id) },
    });
  }

  async findMany(): Promise<any[]> {
    const sessions = await this.prismaService.session.findMany({
      select: {
        Players: {
          select: {
            id: true,
          },
        },
        id: true,
        limit: true,
      },
    });

    sessions.map((s) => {
      if (s.limit === s.Players.length) {
        const i = sessions.indexOf(s);
        console.log(i);
        
        sessions.splice(i, 1);
      }
    });

    sessions.sort(function (a, b) {
      if (a.id > b.id) {
        return 1;
      }
      if (a.id < b.id) {
        return -1;
      }
      return 0;
    });

    return sessions;
  }
}
