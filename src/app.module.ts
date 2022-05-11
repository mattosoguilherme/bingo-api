import { Module } from '@nestjs/common';
import { RaffleModule } from './raffle/raffle.module';
import { CardModule } from './card/card.module';
import { PlayerModule } from './player/player.module';
import { AuthModule } from './auth/auth.module';
import { ScoreModule } from './score/score.module';
import { SessionModule } from './session/session.module';

@Module({
  imports: [
    RaffleModule,
    CardModule,
    PlayerModule,
    AuthModule,
    ScoreModule,
    SessionModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
