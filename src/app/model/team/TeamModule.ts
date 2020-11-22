import { BaseModel, Identifable } from '../common/CommonModule';
import { UserProject } from '../ProjectModule';
import { User } from '../user/UserModule';

export class Team extends BaseModel implements Identifable {
    id: number;
    title: string;
    description: string;
}
export class UserTeam extends Team{
    projects: Set<UserProject>;
}
export class CreateTeam extends Team {
    users :User[];
}


