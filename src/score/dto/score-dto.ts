import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsNumber } from 'class-validator';

export class ScoreDto {
  @ApiProperty({ default: 100 })
  @IsNumber()
  @IsNotEmpty({ message: 'Campo score não pode estar vazio.' })
  score: number;
}
