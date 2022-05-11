import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { BingoService } from './../bingo.service';
import { LoginResponseDto } from './dto/login-response.dto';
import { LoginDto } from './dto/login.dto';
import * as bcrypt from 'bcrypt';

@Injectable()
export class AuthService {
  constructor(
    private jwtService: JwtService,
    private bingoSerice: BingoService,
  ) {}

  async login(loginDto: LoginDto): Promise<LoginResponseDto> {
    const { email, password } = loginDto;

    const playerValided = await this.bingoSerice.findPlayerByEmail(email);

    const hash_valided = await bcrypt.compare(password, playerValided.password);

    if (!hash_valided) {
      throw new UnauthorizedException('Email ou senha inválidos.');
    }

    delete playerValided.password;

    return {
      token: this.jwtService.sign({ email }),
      player: playerValided,
    };
  }
}
