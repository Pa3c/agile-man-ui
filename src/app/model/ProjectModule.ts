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

export class DetailedUserProject extends BaseModel{
    title: string;
    description: string;
    type: string;
    roles: string[];
    taskContainers: TaskContainer[];
}

export function defaultProjectResolver(description :string): String{
    return description;
}