import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsNumber } from 'class-validator';

export default class CheckBingoDto {
  @IsNotEmpty({ message: 'Campo sessionId é obrigatório, não pode ser vazio' })
  @IsNumber()
  @ApiProperty()
  sessionId: number;

  @IsNotEmpty({ message: 'Campo cardId é obrigatório, não pode ser vazio' })
  @IsNumber()
  @ApiProperty()
  cardId: number;
}
