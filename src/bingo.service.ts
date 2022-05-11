import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { Card, Player, Session } from '@prisma/client';
import { PrismaService } from './prisma.service';
import * as bcrypt from 'bcrypt';
import { CreatePlayerDto } from './player/dto/create-player.dto';
import { UpdatePlayerDto } from './player/dto/update-player.dto';
import DrawValidationDto from './raffle/dto/draw-validation.dto';
import { ScoreService } from './score/score.service';

@Injectable()
export class BingoService {
  constructor(
    private prismaService: PrismaService,
    private scoreService: ScoreService,
  ) {}

  // *
  // *
  //  Funções não assincronas
  // *
  // *

  async card_number_validator(
    id_checked: number,
    number_card: number,
    numbers_raffle: number[],
  ): Promise<any> {
    const message: object = {
      message: 'Número não foi sorteado, opção inválida.',
    };

    numbers_raffle.forEach(async (n) => {
      if (number_card === n) {
        message['message'] = `Número ${n} foi sorteado, opção é válida.`;

        await this.prismaService.checked.update({
          where: { id: Number(id_checked) },
          data: {
            check: true,
          },
        });
      }
    });

    if (message['message'] === 'Número não foi sorteado, opção inválida.') {
      throw new ConflictException(message['message']);
    }

    return message;
  }

  numbersDraw() {
    const maxNumbers = 90;
    let list: Array<number> = [];
    let randNumber: number;
    let tmp: number;

    for (var n = 0; n < maxNumbers; n++) {
      list[n] = n + 1;
    }

    for (let n = list.length; n; ) {
      randNumber = (Math.random() * n--) | 0;
      tmp = list[randNumber];
      list[randNumber] = list[n];
      list[n] = tmp;
    }

    return list;
  }

  numbersForCard() {
    const listDraw = this.numbersDraw();

    const cardNumbers = [];

    listDraw.forEach((n) => {
      if (cardNumbers.length < 15) {
        cardNumbers.push(n);
      }
    });
    return cardNumbers.sort((a, b) => a - b);
  }

  raffleOneCard() {
    const listDraw = this.numbersDraw();

    const raffle_15 = [];

    listDraw.forEach((n) => {
      if (raffle_15.length < 15) {
        raffle_15.push(n);
      }
    });
    return raffle_15;
  }

  raffleTwoCards() {
    const listDraw = this.numbersDraw();

    const raffle_30 = [];

    listDraw.forEach((n) => {
      if (raffle_30.length < 30) {
        raffle_30.push(n);
      }
    });
    return raffle_30;
  }

  raffleThreeCards() {
    const listDraw = this.numbersDraw();

    const raffle_45 = [];

    listDraw.forEach((n) => {
      if (raffle_45.length < 45) {
        raffle_45.push(n);
      }
    });
    return raffle_45;
  }

  raffleFourCards() {
    const listDraw = this.numbersDraw();

    const raffle_60 = [];

    listDraw.forEach((n) => {
      if (raffle_60.length < 60) {
        raffle_60.push(n);
      }
    });
    return raffle_60;
  }

  raffleFiveCards() {
    const listDraw = this.numbersDraw();

    const raffle_75 = [];

    listDraw.forEach((n) => {
      if (raffle_75.length < 75) {
        raffle_75.push(n);
      }
    });
    return raffle_75;
  }

  cardDraw(quantity: number) {
    if (quantity > 6) {
      throw new ConflictException('Você só pode comprar 6 cartelas por jogo.');
    }

    const numberCard: object = {};

    for (var i = 1; i <= quantity; i++) {
      numberCard[`card${i}`] = this.numbersForCard();
    }

    return numberCard;
  }

  // *
  // *
  //  Funções  assincronas
  // *
  // *

  // *
  // Buscando e validando componentes no banco de dados pelo seu atributo único
  // *

  async findPlayerById(id: string): Promise<Player> {
    const p = await this.prismaService.player.findUnique({
      where: { id: id },
      include: { Score: true, Card: true, Session: { select: { id: true } } },
    });

    if (!p) {
      throw new ConflictException('Usuário encontrado');
    }

    return p;
  }

  async EmailValid(email: string): Promise<Player> {
    const email_finded = await this.prismaService.player.findUnique({
      where: {
        email: email,
      },
    });

    if (email_finded) {
      throw new ConflictException('Email já cadastrado');
    }

    return email_finded;
  }

  async NickValid(nick: string): Promise<Player> {
    const nick_finded = await this.prismaService.player.findUnique({
      where: { nickname: nick },
      include: { Card: true },
    });

    if (nick_finded) {
      throw new ConflictException('Nickname já cadastrado');
    }

    return nick_finded;
  }

  async findPlayerByEmail(email: string): Promise<Player> {
    const player_finded = await this.prismaService.player.findUnique({
      where: { email: email },
      include: { Score: true, Card: true, Session: { select: { id: true } } },
    });

    if (!player_finded) {
      throw new ConflictException('Email não cadastrado.');
    }

    return player_finded;
  }

  async findCardById(id: number): Promise<Card> {
    const cardFinded = await this.prismaService.card.findUnique({
      where: { id: Number(id) },
    });

    if (!cardFinded) {
      throw new NotFoundException('Card não encontrado.');
    }

    return cardFinded;
  }

  async ValidatorSessionById(id: number): Promise<Session> {
    const sessionFinded = await this.prismaService.session.findUnique({
      where: { id: Number(id) },
    });

    if (!sessionFinded) {
      throw new ConflictException('Sessão encerrada ou não existe.');
    }

    return sessionFinded;
  }

  // *
  // Validando campos de acordo com as regras de negócio
  // *

  async fieldsValidator(field: CreatePlayerDto): Promise<Player> {
    const { name, nickname, password, passwordConfirmation } = field;

    const titleize = (text: string) => {
      var words = text.toLowerCase().split(' ');

      for (var i = 0; i < words.length; i++) {
        var w: string = words[i];
        words[i] = w[0].toUpperCase() + w.slice(1);
      }
      const n: string = words.join();
      return n.replace(/,/g, ' ');
    };

    const n = titleize(name);

    if (n.length > 120) {
      throw new ConflictException(
        'O limite de caractéres do campo name é de 120.',
      );
    }

    if (nickname.length > 50) {
      throw new ConflictException(
        'O limite de caractéres do campo nickname é 50. ',
      );
    }

    if (passwordConfirmation !== password) {
      throw new ConflictException('Senhas não conferem');
    }

    const hashedPass = await bcrypt.hash(password, 10);

    const player = {
      ...field,
      name: n,
      password: hashedPass,
      id: '',
      sessionId: 0,
    };

    return player;
  }

  async fieldUpdateValidator(fieldUpdate: UpdatePlayerDto): Promise<Player> {
    const { name, email, nickname, newpass, newpassConfirmation } = fieldUpdate;

    const titleize = (text: string) => {
      var words = text.toLowerCase().split(' ');

      for (var i = 0; i < words.length; i++) {
        var w: string = words[i];
        words[i] = w[0].toUpperCase() + w.slice(1);
      }
      const n: string = words.join();
      return n.replace(/,/g, ' ');
    };

    const player = {
      ...fieldUpdate,
      id: '',
      sessionId: 0,
    };

    if (name) {
      const n = titleize(name);
      if (n.length > 120) {
        throw new ConflictException(
          'O limite de caractéres do campo name é de 120.',
        );
      }

      player.name = n;
    }

    if (newpass && newpassConfirmation) {
      if (newpass !== newpassConfirmation) {
        throw new ConflictException('Senhas não conferem');
      }

      const hashedPass = await bcrypt.hash(newpass, 10);

      player.password = hashedPass;
    }

    if (nickname) {
      await this.NickValid(nickname);

      if (nickname.length > 50) {
        throw new ConflictException(
          'O limite de caractéres do campo nickname é 50. ',
        );
      }
    }

    if (email) {
      await this.EmailValid(email);
    }

    return player;
  }

  // *
  // Verificando se a senha é a mesma cadastrada no banco de dados
  // *

  async compare(pass: string, id: string) {
    const player = await this.prismaService.player.findUnique({
      where: { id: id },
    });

    const hash_valided = await bcrypt.compare(pass, player.password);

    if (!hash_valided) {
      throw new ConflictException('Senha atual está incorreta.');
    }

    return;
  }

  // *
  // Validações do sorteio
  // *

  // draw_number verica se o número da cartela consta no sorteio
  async draw_number(position: number, sessionId: number): Promise<number> {
    const sessionFinded = await this.prismaService.session.findUnique({
      where: { id: Number(sessionId) },
    });

    const numbers_draw = sessionFinded.numbersDraw;

    return numbers_draw[Number(position)];
  }

  // check_bingo verifica se cartela é premiada
  async check_bingo(cardId: number, sessionId: number): Promise<object> {
    const sesssionFinded = await this.prismaService.session.findUnique({
      where: { id: Number(sessionId) },
    });

    const cardFinded = await this.prismaService.card.findUnique({
      where: { id: Number(cardId) },
      include: { Player: { select: { nickname: true } } },
    });

    const CardsOfPlayer = await this.prismaService.player.findUnique({
      where: { nickname: cardFinded.Player.nickname },
      include: { Card: true, Score: true },
    });

    const numbers_valid: Array<number> = [];
    const numbers_draw = sesssionFinded.numbersDraw;
    const numbers_card = cardFinded.cards_drawn;
    const scoreBonus = {
      score: 10000,
    };

    numbers_draw.map((n_draw) => {
      numbers_card.forEach((n_card) => {
        if (n_draw === n_card) {
          numbers_valid.push(n_draw);
        }
      });
    });

    if (numbers_valid.length < 15) {
      throw new ConflictException(
        'O cartela não é valida para receber premição.',
      );
    }

    if (numbers_valid.length === 15) {
      if (CardsOfPlayer.Card.length === 1) {
        await this.scoreService.credit(CardsOfPlayer.Score.id, scoreBonus);
      }
      if (CardsOfPlayer.Card.length === 2) {
        scoreBonus['score'] = 8000;

        await this.scoreService.credit(CardsOfPlayer.Score.id, scoreBonus);
      }
      if (CardsOfPlayer.Card.length === 3) {
        scoreBonus['score'] = 6400;

        await this.scoreService.credit(CardsOfPlayer.Score.id, scoreBonus);
      }
      if (CardsOfPlayer.Card.length === 4) {
        scoreBonus['score'] = 4800;

        await this.scoreService.credit(CardsOfPlayer.Score.id, scoreBonus);
      }
      if (CardsOfPlayer.Card.length === 5) {
        scoreBonus['score'] = 3200;

        await this.scoreService.credit(CardsOfPlayer.Score.id, scoreBonus);
      }
      if (CardsOfPlayer.Card.length === 6) {
        scoreBonus['score'] = 1600;

        await this.scoreService.credit(CardsOfPlayer.Score.id, scoreBonus);
      }
    }

    return {
      message: ` Parabéns ${cardFinded.Player.nickname} , você fez bingo! Total de pontos ganhos:${scoreBonus.score}`,
    };
  }
}
