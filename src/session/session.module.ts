import { Module } from '@nestjs/common';
import { SessionService } from './session.service';
import { SessionController } from './session.controller';
import { PrismaService } from 'src/prisma.service';
import { BingoService } from 'src/bingo.service';
import { PassportModule } from '@nestjs/passport';
import { RolesGuard } from 'src/auth/guards/roles.guard';
import { ScoreService } from 'src/score/score.service';

@Module({
  imports: [PassportModule.register({ defaultStrategy: 'jwt' })],
  controllers: [SessionController],
  providers: [SessionService, PrismaService, BingoService, RolesGuard, ScoreService],
})
export class SessionModule {}
