import { BaseModel, Identifable } from '../common/CommonModule';

export class TaskContainer extends BaseModel{
    title: string;
    type: string;
    closed: boolean;
    overContainer: TaskContainer;
}
export class State implements Identifable {
    id: number;
    name: string;
    order: number;
}

export class DetailedTaskContainer extends TaskContainer {
    tasks: Task[]
    states: State[];
}