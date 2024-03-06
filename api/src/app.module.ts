import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PrismaService } from './teams/database/prisma.service';
import { TeamsModule } from './teams/teams.module';

@Module({
  imports: [TeamsModule],
  controllers: [AppController],
  providers: [AppService, PrismaService],
})
export class AppModule {}
