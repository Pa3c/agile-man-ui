import { BaseModel, Identifable } from './common/CommonModule';
import { TaskContainer } from './task-container/TaskContainerModule';

export class Project implements Identifable{
    id :number;
    title :string;
    description :string; 
}
export class UserProject {
    roles: Set<string> = new Set();
    title: String = "";
}

export class DetailedUserProject extends BaseModel implements Identifable{
    id: number;
    title: string;
    description: string;
    type: string;
    roles: string[];
    taskContainers: TaskContainer[];
}

