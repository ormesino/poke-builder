import { HttpService } from '@nestjs/axios';
import { Injectable } from '@nestjs/common';
import { lastValueFrom } from 'rxjs';
import { CreateTeamBody } from './dtos/create-team-body.dto';
import { TeamsRepository } from './repositories/teams.repository';

@Injectable()
export class TeamsService {
  constructor(
    private teamsRepository: TeamsRepository,
    private readonly httpService: HttpService,
  ) {}

  // Método para registro de um time, passando pela PokéAPI
  async create(body: CreateTeamBody) {
    try {
      const { user, team } = body;
      const responses = await Promise.all(
        team.map((pokemon) =>
          lastValueFrom(
            this.httpService.get(
              `https://pokeapi.co/api/v2/pokemon/${pokemon}`,
            ),
          )
            .then((response) => response.data.id)
            .catch(() => {
              throw new Error(`Pokémon de nome ${pokemon} não encontrado.`);
            }),
        ),
      );
      // Criação do registro no banco de dados com os ids dos pokémons
      return await this.teamsRepository.create({ user, team: responses });
    } catch (error) {
      return { error: error.message };
    }
  }

  // Método para listagem de todos os times registrados no banco de dados
  async findAll() {
    try {
      // Busca no banco de dados
      const registry = await this.teamsRepository.findAll();

      if (!registry.length) {
        return { error: 'Nenhum time encontrado.' };
      }

      // Requisições para a PokéAPI para cada time
      const teams = await Promise.all(
        registry.map(async (team) => {
          const pokemons = await Promise.all(
            // Requisições para a PokéAPI para cada Pokémon do time
            team.pokemons.map((pokemon: number) =>
              lastValueFrom(
                this.httpService.get(
                  `https://pokeapi.co/api/v2/pokemon/${pokemon}`,
                ),
              )
                .then((response) => {
                  return {
                    id: response.data.id,
                    name: response.data.name,
                    weight: response.data.weight,
                    height: response.data.height,
                  };
                })
                .catch(() => {
                  throw new Error(`Pokémon de id ${pokemon} não encontrado.`);
                }),
            ),
          );

          // Retorno do time com os dados dos pokémons
          return {
            id: team.id,
            owner: team.owner,
            pokemons,
          };
        }),
      );

      const response = {};

      // Montagem do objeto de resposta
      teams.map((team) => {
        response[team.id] = {
          owner: team.owner,
          pokemons: team.pokemons,
        };
      });

      return response;
    } catch (error) {
      return { error: error.message };
    }
  }

  // Método para busca de um time específico
  async findOne(id: number) {
    try {
      // Busca no banco de dados
      const registry = await this.teamsRepository.findOne(id);

      if (!registry) {
        return { error: 'Time não encontrado.' };
      }

      // Requisições para a PokéAPI para cada Pokémon do time
      const team = await Promise.all(
        registry.pokemons.map((pokemon: number) =>
          lastValueFrom(
            this.httpService.get(
              `https://pokeapi.co/api/v2/pokemon/${pokemon}`,
            ),
          ).then((response) => {
            return {
              id: response.data.id,
              name: response.data.name,
              weight: response.data.weight,
              height: response.data.height,
            };
          }),
        ),
      );

      // Retorno do time com os dados dos pokémons
      return {
        owner: registry.owner,
        pokemons: team,
      };
    } catch (error) {
      return { error: error.message };
    }
  }
}
