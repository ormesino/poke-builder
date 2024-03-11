import { Injectable } from '@nestjs/common';
import { CreateTeamBody } from 'src/teams/dtos/create-team-body.dto';
import { PrismaService } from 'src/teams/prisma/prisma.service';
import { TeamsRepository } from './teams.repository';

@Injectable()
export class PrismaTeamsRepository implements TeamsRepository {
  constructor(private prisma: PrismaService) {}

  // Método para registro de um time utilizando o Prisma
  async create(body: CreateTeamBody): Promise<any> {
    try {
      const user = await this.prisma.user.findUnique({
        where: { username: body.user },
      });

      // Se o usuário não existir, ele é criado junto com o time
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

      // Se o usuário já existir, o time é registrado para ele
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

  // Método para listagem de todos os times registrados no banco de dados
  async findAll(): Promise<any> {
    try {
      return await this.prisma.team.findMany();
    } catch (error) {
      return error;
    }
  }

  // Método para busca de um time específico no banco de dados
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
