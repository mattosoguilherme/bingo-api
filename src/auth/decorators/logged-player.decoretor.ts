import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { Player } from '@prisma/client';

import { PrismaService } from '../../prisma.service';

const prisma = new PrismaService();

const LoggedPlayer = createParamDecorator(
  async (data: unknown, ctx: ExecutionContext) => {
    const require = ctx.switchToHttp().getRequest();

    const player = require.user as Player;
    console.log(player);

    const p = await prisma.player.findUnique({
      where: { id: player.id },
      include: {
        Score: true,
        Card: {
          select: {
            Checked: true,
            cards_drawn: true,
            id: true,
            playerId: true,
          },
        },
        Session: { select: { id: true } },
      },
    });

    return p;
  },
);

export default LoggedPlayer;
