import { ArrayNotEmpty, IsNotEmpty, IsString } from 'class-validator';

export class CreateTeamBody {
  @IsString({
    message: 'Nome de usuário precisa ser com caracteres alfanuméricos.',
  })
  @IsNotEmpty({
    message: 'Você precisa informar um nome de usuário.',
  })
  user: string;

  @ArrayNotEmpty({
    message: 'Você precisa informar ao menos um Pokémon.',
  })
  @IsNotEmpty({
    message: 'Você precisa informar os Pokémons do time.',
  })
  team: number[];
}
