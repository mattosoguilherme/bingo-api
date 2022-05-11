
import { ApiProperty } from '@nestjs/swagger';
import { Role } from '@prisma/client';
import { IsOptional ,IsString, IsNotEmpty, IsUrl, MinLength } from 'class-validator';

export class UpdatePlayerDto {

  @IsOptional() 
  @ApiProperty({ default: 'www.img.com.br' })
  @IsString({ message: 'Esse campo deve ser uma string' })
  @IsNotEmpty({
    message: 'Campo imgUrlPerfil é obrigatório, não pode estar vazio',
  })
  @IsUrl()
  imgUrlPerfil: string;

  @IsOptional() 
  @IsString({ message: 'Esse campo deve ser uma string' })
  @ApiProperty({ default: 'jogador01' })
  @IsNotEmpty({ message: 'Campo nickname é obrigatório, não pode estar vazio' })
  nickname: string;

  @IsOptional() 
  @IsString({ message: 'Esse campo deve ser uma string' })
  @ApiProperty({ default: 'Guilherme Mattoso' })
  @IsNotEmpty({ message: 'Campo name é obrigatório, não pode estar vazio' })
  name: string;

  @IsOptional() 
  @IsString({ message: 'Esse campo deve ser uma string' })
  @ApiProperty({ default: 'guilherme@gmail.com' })
  @IsNotEmpty({ message: 'Campo email é obrigatório, não pode estar vazio' })
  email: string;

  @IsOptional() 
  @IsString({ message: 'Esse campo deve ser uma string' })
  @ApiProperty({ default: 'g123456' })
  @IsNotEmpty({ message: 'Campo password é obrigatório, não pode estar vazio' })
  @MinLength(6)
  password: string;

  @IsOptional() 
  @IsString({ message: 'Esse campo deve ser uma string' })
  @ApiProperty({ default: 'g123456' })
  @IsNotEmpty({ message: 'Campo password é obrigatório, não pode estar vazio' })
  @MinLength(6)
  newpass: string;

  @IsOptional() 
  @IsString({ message: 'Esse campo deve ser uma string' })
  @ApiProperty({ default: 'g123456' })
  @IsNotEmpty({
    message: 'Campo passwordConfirmation é obrigatório, não pode estar vazio',
  })
  @MinLength(6)
  newpassConfirmation: string;

  @IsOptional() 
  @IsString({ message: 'Esse campo deve ser uma string' })
  @ApiProperty({ default: 'USER' })
  @IsNotEmpty()
  role: Role;
}
