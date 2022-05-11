import { ApiProperty } from "@nestjs/swagger";
import { IsEmail,MinLength, IsNotEmpty, IsString } from "class-validator";

export class LoginDto{

    @ApiProperty()
    @IsEmail()
    @IsString()
    @IsNotEmpty()
    email:string;

    @ApiProperty()
    @IsString()
    @IsNotEmpty()
    @MinLength(6)
    password:string;
}