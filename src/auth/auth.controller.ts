import { Body, Controller, Get, Post, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { Player } from '@prisma/client';
import { Role } from 'src/utils/roles.enum';
import { AuthService } from './auth.service';
import  LoggedPlayer  from './decorators/logged-player.decoretor';
import { Roles } from './decorators/roles.decorator';
import { LoginResponseDto } from './dto/login-response.dto';
import { LoginDto } from './dto/login.dto';
import { RolesGuard } from './guards/roles.guard';

@ApiTags('auth')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post()
  @ApiOperation({ summary: 'Fazer Login.' })
  login(@Body() loginDto: LoginDto): Promise<LoginResponseDto> {
    return this.authService.login(loginDto);
  }

  @Get()
  @ApiOperation({ summary: 'Player logado com sucesso!' })
  @Roles(Role.USER, Role.ADMIN)
  @UseGuards(AuthGuard(), RolesGuard)
  @ApiBearerAuth()
  me(@LoggedPlayer() player: Player) {
    return player;
  }
}
