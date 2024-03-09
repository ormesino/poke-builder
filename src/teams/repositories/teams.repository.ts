import { CreateTeamBody } from '../dtos/create-team-body.dto';

export abstract class TeamsRepository {
  abstract create(body: CreateTeamBody): Promise<any>;
  abstract findAll(): Promise<any>;
  abstract findOne(id: number): Promise<any>;
}
