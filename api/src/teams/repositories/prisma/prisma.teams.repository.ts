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
        where: { username: body.user },
      });

      if (!user) {
        const createdUser = await this.prisma.user.create({
          data: {
            username: body.user,
            teams: {
              create: {
                pokemons: body.team,
              },
            },
          },
        });

        return {
          message: `Usuário ${createdUser.username} e time registrados com sucesso.`,
        };
      }

      const updatedUser = await this.prisma.user.update({
        where: { username: user.username },
        data: {
          teams: {
            create: {
              pokemons: body.team,
            },
          },
        },
      });

      return {
        message: `Time registrado para o usuário ${updatedUser.username}.`,
      };
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

      return team;
    } catch (error) {
      return error;
    }
  }
}
