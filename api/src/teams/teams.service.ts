import { Injectable } from '@nestjs/common';
import { PrismaService } from './database/prisma.service';
import { CreateTeamBody } from './dtos/create-team-body.dto';

@Injectable()
export class TeamsService {
  constructor(private prisma: PrismaService) {}

  async create(body: CreateTeamBody) {
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

  findAll() {
    try {
      return this.prisma.team.findMany();
    } catch (error) {
      return error;
    }
  }

  async findOne(id: number) {
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
