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
      return await this.teamsRepository.create({ user, team: responses });
    } catch (error) {
      return { error: error.message };
    }
  }

  async findAll() {
    try {
      const registry = await this.teamsRepository.findAll();

      const teams = await Promise.all(
        registry.map(async (team) => {
          const pokemons = await Promise.all(
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

          return {
            id: team.id,
            owner: team.owner,
            pokemons,
          };
        }),
      );

      const response = {};

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

  async findOne(id: number) {
    try {
      const registry = await this.teamsRepository.findOne(id);

      if (!registry) {
        return { error: 'Time não encontrado.' };
      }

      // Requisições para a PokéAPI
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

      return {
        owner: registry.owner,
        pokemons: team,
      };
    } catch (error) {
      return { error: error.message };
    }
  }
}
