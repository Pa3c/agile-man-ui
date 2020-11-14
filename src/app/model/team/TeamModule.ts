import { BaseModel, Identifable } from '../common/CommonModule';
import { UserProject } from '../ProjectModule';

export class UserTeam extends BaseModel implements Identifable{
    id: number;
    projects: Set<UserProject>;
    title: string;
    description: string;
}

