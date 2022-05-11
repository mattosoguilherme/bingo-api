import { Module } from '@nestjs/common';
import { RaffleService } from './raffle.service';
import { RaffleController } from './raffle.controller';
import { RolesGuard } from 'src/auth/guards/roles.guard';
import { PassportModule } from '@nestjs/passport';
import { PrismaService } from 'src/prisma.service';
import { BingoService } from 'src/bingo.service';
import { ScoreService } from 'src/score/score.service';


@Module({
  imports:[PassportModule.register({defaultStrategy: 'jwt'})],
  controllers: [RaffleController],
  providers: [RaffleService,RolesGuard,PrismaService,BingoService,ScoreService]
})
export class RaffleModule {}
