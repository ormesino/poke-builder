import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { CreateTeamBody } from './dtos/create-team-body.dto';
import { TeamsService } from './teams.service';

@Controller('api/teams')
export class TeamsController {
  constructor(private readonly teamsService: TeamsService) {}

  // Controller para listagem de todos os times registrados no banco de dados
  @Get()
  findAll() {
    return this.teamsService.findAll();
  }

  // Controller para busca de um time específico no banco de dados
  @Get(':id')
  async findOne(@Param('id') id: string) {
    return await this.teamsService.findOne(+id);
  }

  // Controller para registro de um usuário e seu time
  @Post()
  create(@Body() body: CreateTeamBody) {
    return this.teamsService.create(body);
  }
}
