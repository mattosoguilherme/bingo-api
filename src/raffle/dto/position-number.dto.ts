import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsNumber } from 'class-validator';

export default class PositionDto {
  @IsNumber()
  @IsNotEmpty({ message: 'Campo position é obrigatório, não pode ser vazio' })
  @ApiProperty()
  position: number;

  @IsNumber()
  @IsNotEmpty({ message: 'Campo sessionId é obrigatório, não pode ser vazio' })
  @ApiProperty()
  sessionId: number;
}
