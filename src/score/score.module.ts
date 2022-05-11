import { Module } from '@nestjs/common';
import { ScoreService } from './score.service';
import { ScoreController } from './score.controller';
import { PrismaService } from 'src/prisma.service';
import { RolesGuard } from 'src/auth/guards/roles.guard';
import { PassportModule } from '@nestjs/passport';


@Module({
  imports: [PassportModule.register({ defaultStrategy: 'jwt' })],
  controllers: [ScoreController],
  providers: [ScoreService,PrismaService, RolesGuard]
})
export class ScoreModule {}
