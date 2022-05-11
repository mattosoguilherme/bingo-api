import { ApiProperty } from '@nestjs/swagger';
import { IsNumber, IsNotEmpty, IsArray } from 'class-validator';

export default class DrawValidationDto {

  @ApiProperty() 
  @IsArray()
  @IsNotEmpty({
    message: 'Campo numbers_raffle é obrigatório, não pode estar vazio',
  })
  numbers_raffle: Array<number>;

  @ApiProperty() 
  @IsNumber()
  @IsNotEmpty({
    message: 'Campo number_card é obrigatório, não pode estar vazio',
  })
  id_checked: number;
}
