import { Injectable } from '@nestjs/common';
import { Player } from '@prisma/client';
import { BingoService } from 'src/bingo.service';
import { PrismaService } from 'src/prisma.service';
import { CreatePlayerDto } from './dto/create-player.dto';
import { UpdatePlayerDto } from './dto/update-player.dto';

@Injectable()
export class PlayerService {
  constructor(
    private bingoService: BingoService,
    private prismaService: PrismaService,
  ) {}

  async create(createPlayerDto: CreatePlayerDto): Promise<Player> {
    const { role, nickname, email, imgUrlPerfil } = createPlayerDto;

    await this.bingoService.EmailValid(email);
    await this.bingoService.NickValid(nickname);

    const player = await this.bingoService.fieldsValidator(createPlayerDto);

    const playerCreated = await this.prismaService.player.create({
      data: {
        name: player.name,
        nickname: nickname,
        password: player.password,
        email: email,
        imgUrlPerfil: imgUrlPerfil,
        role: role,
      },
      include: { Card: true, Score: true, Session: true },
    });

    delete playerCreated.password;

    return playerCreated;
  }

  async update(id: string, updatePlayerDto: UpdatePlayerDto) {
    const { password } = updatePlayerDto;

    const { nickname, role, email, imgUrlPerfil } = updatePlayerDto;

    await this.bingoService.findPlayerById(id);

    if (password) {
      await this.bingoService.compare(password, id);
    }

    const playerValided = await this.bingoService.fieldUpdateValidator(
      updatePlayerDto,
    );

    const playerUpdated = await this.prismaService.player.update({
      where: { id: id },
      data: {
        imgUrlPerfil: imgUrlPerfil,
        nickname: nickname,
        role: role,
        email: email,
        password: playerValided.password,
        name: playerValided.name,
      },
      include: { Card: true, Score: true, Session: { select: { id: true } } },
    });

    delete playerUpdated.password;

    return playerUpdated;
  }

  async remove(id: string): Promise<Player> {
    await this.bingoService.findPlayerById(id);

    return await this.prismaService.player.delete({
      where: { id: id },
      include: { Card: true, Score: true, Session: true },
    });
  }

  async findUnique(id: string): Promise<Player> {
    return await this.bingoService.findPlayerById(id);
  }
}
