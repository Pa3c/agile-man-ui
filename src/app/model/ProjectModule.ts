import { BaseModel, Identifable } from './common/CommonModule';
import { TaskContainer } from './task-container/TaskContainerModule';
import { MultiRoleBasicUser } from './user/UserModule';

export class Project extends BaseModel{
    id :number;
    title :string;
    description :string;
}
export class UserProject {
    roles: Set<string> = new Set();
    title: String = "";
}

export class BaseProjectTeam {
  public id: number;
  public title: string;
  public type: ProjectType;
}

export class DetailedUserProject extends BaseModel implements Identifable{
    id: number;
    teamInProjectId: number;
    teamId: number;
    projectId: number;
    title: string;
    description: string;
    type: string;
    roles: string[];
    taskContainers: TaskContainer[];
}
export enum ProjectType {
    XP = 'XP',
    SCRUM = 'SCRUM',
    KANBAN= 'KANBAN'
}
export class ProjectRole{
  name: string;
}
export class ProjectUserRolesInfo {
  projectType: string;
  users: MultiRoleBasicUser[];
}
