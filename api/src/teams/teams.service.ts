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
    const { username, pokemons } = body;
    const responses = await Promise.all(
      pokemons.map((pokemon) =>
        lastValueFrom(
          this.httpService.get(`https://pokeapi.co/api/v2/pokemon/${pokemon}`),
        ).then((response) => response.data.id),
      ),
    );
    return await this.teamsRepository.create({ username, pokemons: responses });
  }

  async findAll() {
    const registry = await this.teamsRepository.findAll();

    const teams = await Promise.all(
      registry.map(async (team) => {
        const pokemons = await Promise.all(
          team.pokemons.map((pokemon: number) =>
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
  }

  async findOne(id: number) {
    const registry = await this.teamsRepository.findOne(id);

    const team = await Promise.all(
      registry.pokemons.map((pokemon: number) =>
        lastValueFrom(
          this.httpService.get(`https://pokeapi.co/api/v2/pokemon/${pokemon}`),
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
  }
}
