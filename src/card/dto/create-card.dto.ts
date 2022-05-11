import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty, IsNumber } from "class-validator";

export class CreateCardDto {

    @IsNotEmpty()
    @IsNumber()
    @ApiProperty()
    number_cards: number;


}
