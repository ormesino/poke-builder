import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { CreateTeamBody } from './dtos/create-team-body.dto';
import { TeamsService } from './teams.service';

@Controller('api/teams')
export class TeamsController {
  constructor(private readonly teamsService: TeamsService) {}

  @Get()
  findAll() {
    return this.teamsService.findAll();
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    return await this.teamsService.findOne(+id);
  }

  @Post()
  create(@Body() body: CreateTeamBody) {
    const { username, pokemons } = body;
    return this.teamsService.create({ username, pokemons });
  }
}
