import { Injectable } from '@nestjs/common';
import { CreateTeamBody } from './dtos/create-team-body.dto';
import { TeamsRepository } from './repositories/teams.repository';

@Injectable()
export class TeamsService {
  constructor(private teamsRepository: TeamsRepository) {}

  async create(body: CreateTeamBody) {
    return await this.teamsRepository.create(body);
  }

  async findAll() {
    return await this.teamsRepository.findAll();
  }

  async findOne(id: number) {
    return await this.teamsRepository.findOne(id);
  }
}
