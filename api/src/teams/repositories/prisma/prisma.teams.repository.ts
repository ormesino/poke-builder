import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/teams/database/prisma.service';
import { CreateTeamBody } from 'src/teams/dtos/create-team-body.dto';
import { TeamsRepository } from '../teams.repository';

@Injectable()
export class PrismaTeamsRepository implements TeamsRepository {
  constructor(private prisma: PrismaService) {}

  async create(body: CreateTeamBody): Promise<any> {
    try {
      const user = await this.prisma.user.findUnique({
        where: { username: body.username },
      });

      if (!user) {
        const createdUser = await this.prisma.user.create({
          data: {
            username: body.username,
            teams: {
              create: {
                pokemons: body.pokemons,
              },
            },
          },
        });

        return createdUser;
      }

      const updatedUser = await this.prisma.user.update({
        where: { username: user.username },
        data: {
          teams: {
            create: {
              pokemons: body.pokemons,
            },
          },
        },
      });

      return updatedUser;
    } catch (error) {
      return error;
    }
  }

  async findAll(): Promise<any> {
    try {
      return await this.prisma.team.findMany();
    } catch (error) {
      return error;
    }
  }

  async findOne(id: number): Promise<any> {
    try {
      const team = await this.prisma.team.findUnique({
        where: { id },
      });

      if (!team) return 'Team not found!';

      return team;
    } catch (error) {
      return error;
    }
  }
}
