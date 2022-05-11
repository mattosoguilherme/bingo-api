import { ApiProperty } from '@nestjs/swagger';
import {
  IsBoolean,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
} from 'class-validator';

export class SessionDto {
  @IsNotEmpty({ message: 'Campo playerId é obrigatório, não pode estar vazio' })
  @IsString({ message: 'Campo playerId deve ser uma string' })
  @ApiProperty()
  playerId: string;

  @IsOptional()
  @IsNumber()
  @ApiProperty()
  limit: number;

  @IsNotEmpty({ message: 'Campo close é obrigatório, não pode estar vazio' })
  @ApiProperty({ default: false })
  @IsBoolean({
    message: 'Campo close é do tipo boleano. Valores aceitos: true ou false.',
  })
  close: boolean;

  @IsOptional()
  @ApiProperty({ default: 'ID do player vencedor' })
  @IsString({ message: 'Campo winner deve ser uma string' })
  winner: string;
}
