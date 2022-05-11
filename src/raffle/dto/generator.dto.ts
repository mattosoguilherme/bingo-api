import { ApiProperty } from '@nestjs/swagger';
import {
    IsNumber,
    IsNotEmpty,
  } from 'class-validator';


export default class GeneratorDto {

    @IsNumber()
    @IsNotEmpty()
    @ApiProperty()
    raffle_of:number;
}