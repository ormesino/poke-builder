import { Module } from '@nestjs/common';
import { PrismaService } from './database/prisma.service';
import { PrismaTeamsRepository } from './repositories/prisma/prisma.teams.repository';
import { TeamsRepository } from './repositories/teams.repository';
import { TeamsController } from './teams.controller';
import { TeamsService } from './teams.service';

@Module({
  controllers: [TeamsController],
  providers: [
    TeamsService,
    PrismaService,
    {
      provide: TeamsRepository,
      useClass: PrismaTeamsRepository,
    },
  ],
})
export class TeamsModule {}
