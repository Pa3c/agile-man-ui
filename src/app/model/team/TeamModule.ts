import { BaseModel, Identifable } from '../common/CommonModule';
import { UserProject } from '../ProjectModule';

export class Team extends BaseModel implements Identifable {
    id: number;
    title: string;
    description: string;
}
export class UserTeam extends Team{
    projects: Set<UserProject>;
}



