import { BaseModel, Identifable } from '../common/CommonModule';
import { UserProject } from '../ProjectModule';
import { RoleBasicUser, User } from '../user/UserModule';

export class Team extends BaseModel implements Identifable {
    id: number;
    title: string;
    description: string;
}
export class UserTeam extends Team{
    teamRole: string;
    projects: Set<UserProject>;
}
export class TeamWithUsers extends Team {
    users :RoleBasicUser[];
}
export enum TeamRole {
  BASIC = "TEAM_BASIC",
  ADMIN = "TEAM_ADMIN",
}
export class FromTo<T> {
  constructor(public from: T, public to: T){

  }
}

