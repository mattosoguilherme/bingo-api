import { Module } from '@nestjs/common';
import { CardService } from './card.service';
import { CardController } from './card.controller';
import { BingoService } from 'src/bingo.service';
import { PrismaService } from 'src/prisma.service';
import { RolesGuard } from 'src/auth/guards/roles.guard';
import { PassportModule } from '@nestjs/passport';
import { ScoreService } from 'src/score/score.service';

@Module({
  imports: [PassportModule.register({ defaultStrategy: 'jwt' })],
  controllers: [CardController],
  providers: [CardService, BingoService,ScoreService, PrismaService, RolesGuard,],
})
export class CardModule {}
