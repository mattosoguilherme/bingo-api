import { Module } from '@nestjs/common';
import { PlayerService } from './player.service';
import { PlayerController } from './player.controller';
import { BingoService } from 'src/bingo.service';
import { PrismaService } from 'src/prisma.service';
import { PassportModule } from '@nestjs/passport';
import { RolesGuard } from 'src/auth/guards/roles.guard';
import { ScoreService } from 'src/score/score.service';

@Module({
  imports: [PassportModule.register({ defaultStrategy: 'jwt' })],
  controllers: [PlayerController],
  providers: [
    PlayerService,
    BingoService,
    PrismaService,
    RolesGuard,
    ScoreService,
  ],
})
export class PlayerModule {}
